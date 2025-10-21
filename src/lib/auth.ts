import bcrypt from 'bcryptjs';
import { parsePhoneNumber } from 'libphonenumber-js';

const SALT_ROUNDS = 12;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function normalizePhoneNumber(phone: string): string {
  try {
    const phoneNumber = parsePhoneNumber(phone, 'KR');
    if (!phoneNumber) {
      throw new Error('Invalid phone number');
    }
    return phoneNumber.format('E.164');
  } catch (error) {
    throw new Error('Invalid phone number format');
  }
}

export function validatePassword(password: string): boolean {
  // Minimum 8 characters
  return password.length >= 8;
}

export function isAccountLocked(
  loginAttempts: number,
  lockedUntil: string | null
): boolean {
  if (lockedUntil) {
    const lockoutEnd = new Date(lockedUntil);
    if (lockoutEnd > new Date()) {
      return true;
    }
  }
  return loginAttempts >= MAX_LOGIN_ATTEMPTS;
}

export function getLockoutEndTime(): Date {
  const now = new Date();
  return new Date(now.getTime() + LOCKOUT_DURATION_MINUTES * 60 * 1000);
}
