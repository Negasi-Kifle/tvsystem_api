export enum SatelliteLogUploadStatus {
  Pending = 'PENDING',
  Processed = 'PROCESSED',
  Failed = 'FAILED',
}

export class SatelliteLogUploadEntity {
  constructor(
    public logDate: Date,
    public uploadedById: string,
    public fileName: string,
    public status: SatelliteLogUploadStatus = SatelliteLogUploadStatus.Pending,
    public createdAt?: Date,
    public updatedAt?: Date,
    public id?: string,
  ) {}
}
