import { SatelliteLogUploadEntity, SatelliteLogUploadStatus } from '../../../domain/entities/satellite-log-upload.entity';
import { SatelliteLogEntryEntity, SatelliteLogMatchType } from '../../../domain/entities/satellite-log-entry.entity';
import { ISatelliteLogUploadRepository } from '../../../domain/repositories/satellite-log-upload.repository.interface';
import { ISatelliteLogEntryRepository } from '../../../domain/repositories/satellite-log-entry.repository.interface';

export type UploadSatelliteLogInput = {
  logDate: Date;
  uploadedById: string;
  fileName: string;
  fileContent: string;
};

function parseDuration(durationStr: string): number {
  const parts = durationStr.trim().split(':');
  if (parts.length === 3) {
    const hh = Number(parts[0] ?? 0);
    const mm = Number(parts[1] ?? 0);
    const ss = Number(parts[2] ?? 0);
    return hh * 3600 + mm * 60 + ss;
  }
  return 0;
}

function parseLogLine(line: string, logDate: Date): {
  broadcastDateTime: Date;
  hexId: string;
  description: string;
  durationSeconds: number;
} | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  const parts = trimmed.split('\t');
  if (parts.length < 4) return null;

  const dateStr = parts[0];
  const timeStr = parts[1];
  const hexId = parts[2];
  if (dateStr === undefined || timeStr === undefined || hexId === undefined) {
    return null;
  }
  const rest = parts.slice(3);
  const durationStr = rest.pop() ?? '00:00:00';
  const description = rest.join(' ').trim();

  const dateTimeParts = `${dateStr.trim()} ${timeStr.trim()}`;
  let broadcastDateTime: Date;
  try {
    broadcastDateTime = new Date(dateTimeParts);
    if (isNaN(broadcastDateTime.getTime())) {
      broadcastDateTime = logDate;
    }
  } catch {
    broadcastDateTime = logDate;
  }

  return {
    broadcastDateTime,
    hexId: hexId.trim(),
    description,
    durationSeconds: parseDuration(durationStr),
  };
}

export class UploadSatelliteLogUseCase {
  constructor(
    private readonly uploadRepo: ISatelliteLogUploadRepository,
    private readonly entryRepo: ISatelliteLogEntryRepository,
  ) {}

  async execute(input: UploadSatelliteLogInput): Promise<SatelliteLogUploadEntity> {
    const upload = await this.uploadRepo.create(
      new SatelliteLogUploadEntity(
        input.logDate,
        input.uploadedById,
        input.fileName,
        SatelliteLogUploadStatus.Pending,
      ),
    );

    try {
      const lines = input.fileContent.split('\n');
      const entries: SatelliteLogEntryEntity[] = [];

      for (const line of lines) {
        const parsed = parseLogLine(line, input.logDate);
        if (!parsed) continue;

        const uploadId = upload.id;
        if (!uploadId) {
          continue;
        }

        entries.push(
          new SatelliteLogEntryEntity(
            uploadId,
            parsed.broadcastDateTime,
            parsed.hexId,
            parsed.description,
            parsed.durationSeconds,
            null,
            SatelliteLogMatchType.Unmatched,
          ),
        );
      }

      if (entries.length > 0) {
        await this.entryRepo.createMany(entries);
      }

      upload.status = SatelliteLogUploadStatus.Processed;
      await this.uploadRepo.update(upload);
    } catch {
      upload.status = SatelliteLogUploadStatus.Failed;
      await this.uploadRepo.update(upload);
    }

    return upload;
  }
}
