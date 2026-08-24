import { calculateFutureValue, calculateLumpsum } from './lumpsum';
import { calculateRequiredSIP } from './sip';

export interface RetirementInput {
  currentAge: number;
  retirementAge: number;
  currentMonthlyExpenses: number;
  currentSavings?: number;
  expectedInflation: number;
  preRetirementReturn: number;
  postRetirementReturn: number;
  lifeExpectancy?: number;
}

export interface RetirementResult {
  yearsToRetire: number;
  yearsInRetirement: number;
  futureMonthlyExpenses: number;
  futureAnnualExpenses: number;
  requiredCorpus: number;
  existingSavingsGrowth: number;
  additionalCorpusRequired: number;
  requiredMonthlySIP: number;
}

export function calculateRetirement(input: RetirementInput): RetirementResult {
  const {
    currentAge,
    retirementAge,
    currentMonthlyExpenses,
    currentSavings = 0,
    expectedInflation,
    preRetirementReturn,
    postRetirementReturn,
    lifeExpectancy = 85
  } = input;

  const yearsToRetire = Math.max(1, retirementAge - currentAge);
  const yearsInRetirement = Math.max(1, lifeExpectancy - retirementAge);

  // 1. Future monthly & annual expenses at retirement
  const futureMonthlyExpenses = calculateFutureValue(
    currentMonthlyExpenses,
    expectedInflation,
    yearsToRetire
  );
  const futureAnnualExpenses = futureMonthlyExpenses * 12;

  // 2. Real rate of return in retirement
  const infDecimal = expectedInflation / 100;
  const postRetDecimal = postRetirementReturn / 100;
  const realRate = (1 + postRetDecimal) / (1 + infDecimal) - 1;

  // 3. Required Corpus at retirement age
  let requiredCorpus = 0;
  if (Math.abs(realRate) < 0.0001) {
    requiredCorpus = futureAnnualExpenses * yearsInRetirement;
  } else {
    // Present Value of Annuity formula
    requiredCorpus = futureAnnualExpenses * ((1 - Math.pow(1 + realRate, -yearsInRetirement)) / realRate);
  }
  requiredCorpus = Math.max(0, Math.round(requiredCorpus));

  // 4. Growth of existing savings till retirement age
  const existingSavingsGrowth = currentSavings > 0
    ? calculateLumpsum(currentSavings, preRetirementReturn, yearsToRetire).totalValue
    : 0;

  // 5. Additional corpus required
  const additionalCorpusRequired = Math.max(0, Math.round(requiredCorpus - existingSavingsGrowth));

  // 6. Required monthly SIP to bridge the shortfall
  const sipCalculation = calculateRequiredSIP(
    additionalCorpusRequired,
    yearsToRetire,
    preRetirementReturn
  );

  return {
    yearsToRetire,
    yearsInRetirement,
    futureMonthlyExpenses,
    futureAnnualExpenses,
    requiredCorpus,
    existingSavingsGrowth,
    additionalCorpusRequired,
    requiredMonthlySIP: sipCalculation.requiredMonthlySIP
  };
}

