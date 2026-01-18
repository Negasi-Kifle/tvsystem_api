export interface Customer {
  id: string;
  name: string;
  industry?: string;
  contacts?: { name: string; email?: string; phone?: string }[];
  createdAt?: Date;
}
