export interface Compensation {
  id: string;
  advertId: string;
  proposal: string;
  status: 'Proposed' | 'Accepted' | 'Rejected';
  customerResponse?: string;
  createdAt?: Date;
}
