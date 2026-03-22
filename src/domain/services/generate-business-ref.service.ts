

export interface IGenerateBusinessRefService {
    generateBusinessRef(
        length?: number,
        uppercase?: boolean,
        lowercase?: boolean,
        excludeSimilarCharacters?: boolean): Promise<string>;
}