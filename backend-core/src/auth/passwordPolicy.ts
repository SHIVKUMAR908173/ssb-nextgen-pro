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
  }
};
