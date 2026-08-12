import crypto from "node:crypto";

export interface PasswordPolicyResult {
  isValid: boolean;
  errors: string[];
}

export const passwordPolicy = {
  validate(password: string): PasswordPolicyResult {
    const errors: string[] = [];

    if (!password || password.length < 12) {
      errors.push("Password must be at least 12 characters long.");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter.");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter.");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number.");
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push("Password must contain at least one special character.");
    }

    // Common sequences check
    if (/(abc|123|qwerty|password)/i.test(password)) {
      errors.push("Password contains common easily guessed sequences.");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Validates a password against the HaveIBeenPwned API using k-Anonymity.
   * This ensures the password hasn't been exposed in known data breaches
   * without sending the actual password to a third party.
   */
  async checkPwned(password: string): Promise<PasswordPolicyResult> {
    const result = this.validate(password);
    
    // If it already fails local validation, return immediately
    if (!result.isValid) {
      return result;
    }

    try {
      // Hash password with SHA-1
      const shasum = crypto.createHash("sha1");
      shasum.update(password);
      const hash = shasum.digest("hex").toUpperCase();

      const prefix = hash.slice(0, 5);
      const suffix = hash.slice(5);

      // Fetch matching hashes for the 5-character prefix
      const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      
      if (response.ok) {
        const text = await response.text();
        // Check if our suffix exists in the response
        const lines = text.split("\n");
        const isPwned = lines.some(line => line.split(":")[0] === suffix);

        if (isPwned) {
          result.errors.push("This password has appeared in a data breach. Please choose a different, secure password.");
          result.isValid = false;
        }
      }
    } catch (e) {
      console.warn("Failed to check HaveIBeenPwned API:", e);
      // We don't fail open strictly on network error, we just allow it
      // if local validation passed.
    }

    return result;
  }
};
