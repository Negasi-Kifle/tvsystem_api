import { Show } from '../../entities/show.entity';

export interface ShowRepositoryInterface {
  create(show: Omit<Show, 'id'>): Promise<Show>;
  findById(id: string): Promise<Show | null>;
  list(): Promise<Show[]>;
}
