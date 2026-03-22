import { IGenerateBusinessRefService } from "../../domain/services/generate-business-ref.service";
import { generate } from 'generate-password'

export class GenerateBusinessRefService implements IGenerateBusinessRefService {
    async generateBusinessRef(
        length: number = 10,
        uppercase: boolean = true,
        lowercase: boolean = false,
        excludeSimilarCharacters: boolean = false): Promise<string> {
        return generate({
            length: length,
            numbers: true,
            symbols: false,
            uppercase: uppercase,
            lowercase: lowercase,
            excludeSimilarCharacters: excludeSimilarCharacters
        });
    }
}