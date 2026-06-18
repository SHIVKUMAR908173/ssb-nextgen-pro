// Simple in-memory brute force protection
export interface BruteForceRecord {
  attempts: number;
  lockUntil: number | null;
}

const store = new Map<string, BruteForceRecord>();

// 15 minutes lockout by default
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export const bruteForceProtection = {
  /**
   * Check if a key (e.g. IP + email) is locked.
   * Returns true if locked.
   */
  isLocked(key: string): boolean {
    const record = store.get(key);
    if (!record) return false;
    
    if (record.lockUntil && Date.now() < record.lockUntil) {
      return true;
    }
    
    // If lock expired, clear it
    if (record.lockUntil && Date.now() >= record.lockUntil) {
      store.delete(key);
    }
    return false;
  },

  /**
   * Record a failed attempt. 
   * Returns true if newly locked.
   */
  recordFailure(key: string): boolean {
    let record = store.get(key);
    if (!record) {
      record = { attempts: 0, lockUntil: null };
      store.set(key, record);
    }
    
    // Don't increment if already locked
    if (record.lockUntil && Date.now() < record.lockUntil) {
      return true;
    }
    
    record.attempts += 1;
    if (record.attempts >= MAX_ATTEMPTS) {
      record.lockUntil = Date.now() + LOCKOUT_DURATION_MS;
      return true;
    }
    
    return false;
  },

  /**
   * Record a success, clearing failures.
   */
  recordSuccess(key: string): void {
    store.delete(key);
  }
};
