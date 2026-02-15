export interface IHashService {
  hash(plain: string): Promise<string>;
}
