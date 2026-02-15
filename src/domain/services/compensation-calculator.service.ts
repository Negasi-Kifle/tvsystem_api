export interface ICompensationCalculatorService {
  calculateMissedAdCompensation(adDurationSeconds: number, ratePerSecond: number): number;
}
