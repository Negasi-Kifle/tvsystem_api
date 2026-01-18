export interface CompensationCalculatorInterface {
  calculateMissedAdCompensation(adDurationSeconds: number, ratePerSecond: number): number;
}
