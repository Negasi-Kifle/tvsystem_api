import { createHash, randomBytes } from 'node:crypto';

export function sha256Hex(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

export function generateOpaqueToken(): string {
  return randomBytes(32).toString('hex');
}
