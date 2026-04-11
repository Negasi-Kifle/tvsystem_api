export enum SatelliteLogMatchType {
  Auto = 'AUTO',
  Manual = 'MANUAL',
  Unmatched = 'UNMATCHED',
}

export class SatelliteLogEntryEntity {
  constructor(
    public satelliteLogUploadId: string,
    public broadcastDateTime: Date,
    public hexId: string,
    public description: string,
    public durationSeconds: number,
    public matchedPlacementId: string | null = null,
    public matchType: SatelliteLogMatchType = SatelliteLogMatchType.Unmatched,
    public createdAt?: Date,
    public id?: string,
  ) {}
}
