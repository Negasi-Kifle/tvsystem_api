import { IHashService } from '../../domain/services/hash-service.interface';
import { hashPassword } from '../../shared/utils/password';

export class HashService implements IHashService {
  async hash(plain: string): Promise<string> {
    return hashPassword(plain);
  }
}
