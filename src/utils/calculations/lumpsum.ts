export interface LumpsumInput {
  principal: number;
  expectedReturnRate: number;
  timePeriodYears: number;
}

export interface LumpsumResult {
  investedAmount: number;
  estimatedReturns: number;
  totalValue: number;
  yearlyBreakdown: Array<{ year: number; value: number }>;
}

export function calculateLumpsum(
  principal: number,
  expectedReturnRate: number,
  timePeriodYears: number
): LumpsumResult {
  if (principal <= 0 || timePeriodYears <= 0) {
    return {
      investedAmount: 0,
      estimatedReturns: 0,
      totalValue: 0,
      yearlyBreakdown: []
    };
  }

  const rate = expectedReturnRate / 100;
  const totalValue = principal * Math.pow(1 + rate, timePeriodYears);
  const yearlyBreakdown = [];

  for (let y = 1; y <= timePeriodYears; y++) {
    yearlyBreakdown.push({
      year: y,
      value: Math.round(principal * Math.pow(1 + rate, y))
    });
  }

  return {
    investedAmount: Math.round(principal),
    estimatedReturns: Math.max(0, Math.round(totalValue - principal)),
    totalValue: Math.round(totalValue),
    yearlyBreakdown
  };
}

/**
 * Calculates future value given inflation or constant growth rate.
 * FV = PV * (1 + inflationRate)^years
 */
export function calculateFutureValue(
  presentValue: number,
  inflationRate: number,
  years: number
): number {
  if (presentValue <= 0 || years <= 0) return Math.max(0, presentValue);
  return Math.round(presentValue * Math.pow(1 + inflationRate / 100, years));
}

