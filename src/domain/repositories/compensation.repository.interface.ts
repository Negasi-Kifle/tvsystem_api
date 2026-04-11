import { CompensationEntity } from '../entities/compensation.entity';
import { IBaseRepository } from './base.repository.interface';

export interface ICompensationRepository extends IBaseRepository<CompensationEntity> {}
