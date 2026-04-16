import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import type { IAdvertSalesRepository } from '../../domain/repositories/adver-sales.repository.interface';
import type { IAdvertPlacementRepository } from '../../domain/repositories/advert-placement.repository.interface';
import type { IShowRepository } from '../../domain/repositories/show.repository.interface';
import type { IUserPermissionsRepository } from '../../domain/repositories/user-permissions.repo';
import type { IEmailService } from '../../domain/services/email.service';

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export class AlertService {
  constructor(
    private readonly advertSalesRepo: IAdvertSalesRepository,
    private readonly advertPlacementRepo: IAdvertPlacementRepository,
    private readonly showRepo: IShowRepository,
    private readonly userPermissionsRepo: IUserPermissionsRepository,
    private readonly emailService: IEmailService,
  ) {}

  async processOffAirAlerts(): Promise<void> {
    const now = new Date();
    const windowEnd = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const recipients = await this.userPermissionsRepo.findActiveUserEmailsByPermissionSlug(
      PERMISSIONS.RECEIVE_OPERATIONAL_ALERTS,
    );
    if (recipients.length === 0) {
      // eslint-disable-next-line no-console
      console.warn('[AlertService] No active users with receive_operational_alerts permission');
      return;
    }

    const sales = await this.advertSalesRepo.findCampaignsNeedingEndAlert(now, windowEnd);
    const placements = await this.advertPlacementRepo.findPlacementsNeedingAirAlert(now, windowEnd);

    if (sales.length === 0 && placements.length === 0) {
      return;
    }

    const showTitleCache = new Map<string, string>();
    const getShowTitle = async (showId: string): Promise<string> => {
      const cached = showTitleCache.get(showId);
      if (cached) {
        return cached;
      }
      const show = await this.showRepo.findById(showId);
      const t = show?.title ?? showId;
      showTitleCache.set(showId, t);
      return t;
    };

    const placementRows: string[] = [];
    for (const p of placements) {
      if (!p.id) continue;
      const title = await getShowTitle(p.showId);
      placementRows.push(
        `<li>${esc(title)} — ${esc(p.dateEth)} — placement ${esc(p.id ?? '')}</li>`,
      );
    }

    const saleRows: string[] = [];
    for (const s of sales) {
      if (!s.id) continue;
      saleRows.push(
        `<li>${esc(String(s.referenceNumber ?? ''))} — ${esc(String(s.campaignName ?? ''))} — ends ${esc(s.adEndDate.toISOString().slice(0, 10))}</li>`,
      );
    }

    const html = `
      <h2>Operational alerts (next 24 hours)</h2>
      <p>The following campaigns or placements are due within the next 24 hours.</p>
      ${saleRows.length ? `<h3>Campaign end</h3><ul>${saleRows.join('')}</ul>` : ''}
      ${placementRows.length ? `<h3>Scheduled placements</h3><ul>${placementRows.join('')}</ul>` : ''}
    `;

    const subject = 'Abbay TV — Operational alerts (24h window)';

    for (const to of recipients) {
      await this.emailService.send(to, subject, html);
    }

    const sentAt = new Date();
    for (const s of sales) {
      if (!s.id) continue;
      s.campaignEndAlertSentAt = sentAt;
      await this.advertSalesRepo.update(s);
    }
    for (const p of placements) {
      if (!p.id) continue;
      p.airAlertSentAt = sentAt;
      await this.advertPlacementRepo.update(p);
    }
  }
}
