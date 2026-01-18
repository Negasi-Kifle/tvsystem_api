export interface MediaPackVersion {
  version: number;
  notes?: string;
  createdAt: Date;
}

export interface MediaPack {
  id: string;
  name: string;
  description?: string;
  versions: MediaPackVersion[];
}
