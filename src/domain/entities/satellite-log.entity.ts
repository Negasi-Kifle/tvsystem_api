export interface SatelliteLog {
  id: string;
  showId: string;
  broadcastAt: Date;
  deliveredAds: { advertId: string; played: boolean }[];
}
