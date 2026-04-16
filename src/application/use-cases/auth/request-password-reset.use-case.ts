import { IEmailService } from '../../../domain/services/email.service';
import { IUserRepository } from '../../../domain/repositories/user.repo';
import { generateOpaqueToken, sha256Hex } from '../../../shared/utils/secure-token';
import { getPublicAppUrlOrThrow } from '../../../shared/config/public-app-url';

const RESET_TTL_MS = 60 * 60 * 1000;

/**
 * Self-service forgot password: stores hashed token and emails a link
 * `{PUBLIC_APP_URL}/reset-password?token=<plain>` for the SPA to collect new password and call complete reset.
 */
export class RequestPasswordResetUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly emailService: IEmailService,
  ) {}

  async execute(email: string): Promise<void> {
    const normalized = email.trim().toLowerCase();
    const user = await this.userRepo.findByEmailOrPhoneNumber(normalized);
    if (!user?.id) {
      return;
    }

    const plainToken = generateOpaqueToken();
    const tokenHash = sha256Hex(plainToken);
    const expiresAt = new Date(Date.now() + RESET_TTL_MS);

    await this.userRepo.updatePasswordResetToken(user.id, tokenHash, expiresAt);

    const base = getPublicAppUrlOrThrow();
    const link = `${base}/reset-password?token=${encodeURIComponent(plainToken)}`;

    const html = `
      <h2>Password reset</h2>
      <p>Hello ${user.fullName},</p>
      <p>We received a request to reset your password. Click the link below (valid for 1 hour):</p>
      <p><a href="${link}">Reset password</a></p>
      <p>If you did not request this, you can ignore this email.</p>
    `;

    await this.emailService.send(user.email, 'Password reset request', html);
  }
}
