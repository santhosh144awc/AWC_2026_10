/**
 * Ant Wealth Creation — Home Purchase Planning Calculation Engine
 * 
 * Implements property appreciation, loan-to-value allocation,
 * down payment & acquisition cost accumulation, 8% compounding projected income,
 * monthly home loan EMI, dynamic asset allocation, lump sum, fixed monthly SIP,
 * and annual Step-Up SIP compounding.
 */

export interface HomePurchaseGoalInput {
  currentPropertyValue: number; // in ₹ today
  yearsToPurchase: number; // 1–30 years
  location?: string; // Optional descriptive
  homeType?: string; // Optional descriptive
}

export interface HomePurchaseCostInput {
  propertyGrowthRate: number; // annual % (default: 6%)
  additionalCostPercent: number; // % of property value (default: 10%)
}

export interface HomeLoanInput {
  homeLoanFundingPercent: number; // % (default: 80%)
  homeLoanInterestRate: number; // annual % (default: 8.5%)
  loanTenureYears: number; // years (default: 20)
}

export interface IncomeAffordabilityInput {
  currentMonthlyIncome: number; // in ₹/month
  incomeGrowthRate: number; // annual % (default: 8%)
  idealEMIPercent: number; // % of projected monthly income (default: 40%)
}

export interface EarmarkedAsset {
  id: string;
  name: string;
  amount: number;
}

export interface FundingPlanInput {
  expectedInvestmentReturn: number; // annual % (default: 12%)
  startInvestingDelay: number; // years (default: 0)
  annualStepUpPercent: number; // annual % (default: 10%)
}

export interface HousePurchasePlannerInput {
  goal: HomePurchaseGoalInput;
  cost: HomePurchaseCostInput;
  loan: HomeLoanInput;
  income: IncomeAffordabilityInput;
  earmarkedAssets: EarmarkedAsset[];
  funding: FundingPlanInput;
}

export interface HousePurchasePlannerResult {
  // Goal & Property
  currentPropertyValue: number;
  yearsToPurchase: number;
  propertyGrowthRate: number;
  futurePropertyValue: number; // base property value excluding additional costs
  additionalCostPercent: number;
  additionalPurchaseCosts: number; // acquisition costs
  totalFutureCost: number; // futurePropertyValue + additionalPurchaseCosts

  // Loan & Down Payment
  homeLoanFundingPercent: number;
  homeLoanAmount: number; // futurePropertyValue * fundingPercent
  downPayment: number; // futurePropertyValue - homeLoanAmount
  totalAmountToAccumulate: number; // downPayment + additionalPurchaseCosts

  // Income & EMI Affordability
  currentMonthlyIncome: number;
  incomeGrowthRate: number;
  projectedMonthlyIncome: number;
  idealEMIPercent: number;
  idealMonthlyEMILimit: number;
  homeLoanInterestRate: number;
  loanTenureYears: number;
  estimatedHomeLoanEMI: number;
  isEMIAffordable: boolean;
  emiDifference: number; // idealMonthlyEMILimit - estimatedHomeLoanEMI

  // Existing Assets & Deficit
  totalEarmarkedAssets: number;
  fundingProgress: number; // 0 to 100%
  fundingDeficit: number; // max(0, totalAmountToAccumulate - totalEarmarkedAssets)
  isFullyFunded: boolean;

  // Investment Options for Deficit
  expectedInvestmentReturn: number;
  startInvestingDelay: number;
  remainingInvestmentPeriod: number; // yearsToPurchase - startInvestingDelay
  hasSufficientTime: boolean; // remainingInvestmentPeriod > 0
  annualStepUpPercent: number;
  requiredLumpSum: number;
  requiredFixedSIP: number;
  requiredStepUpSIP: number; // starting monthly amount

  // Narrative
  keyInsight: string;
}

/**
 * 1. Future Property Value (Excludes additional acquisition costs)
 * FV = currentPropertyValue * (1 + propertyGrowthRate)^yearsToPurchase
 */
export function calculateFuturePropertyValue(
  currentPropertyValue: number,
  propertyGrowthRate: number,
  yearsToPurchase: number
): number {
  if (currentPropertyValue <= 0 || yearsToPurchase <= 0) {
    return Math.max(0, currentPropertyValue || 0);
  }
  const r = (propertyGrowthRate || 0) / 100;
  return Math.round(currentPropertyValue * Math.pow(1 + r, yearsToPurchase));
}

/**
 * 2. Additional Purchase Costs (Stamp duty, registration, interiors, taxes)
 * additionalPurchaseCosts = futurePropertyValue * (additionalCostPercent / 100)
 */
export function calculateAdditionalPurchaseCosts(
  futurePropertyValue: number,
  additionalCostPercent: number
): number {
  if (futurePropertyValue <= 0 || additionalCostPercent <= 0) {
    return 0;
  }
  return Math.round(futurePropertyValue * ((additionalCostPercent || 0) / 100));
}

/**
 * 3. Total Future Cost of House Acquisition
 */
export function calculateTotalFutureCost(
  futurePropertyValue: number,
  additionalPurchaseCosts: number
): number {
  return (futurePropertyValue || 0) + (additionalPurchaseCosts || 0);
}

/**
 * 4. Home Loan Amount (Applies ONLY to base future property value)
 * homeLoanAmount = futurePropertyValue * (homeLoanFundingPercent / 100)
 */
export function calculateHomeLoanAmount(
  futurePropertyValue: number,
  homeLoanFundingPercent: number
): number {
  if (futurePropertyValue <= 0 || homeLoanFundingPercent <= 0) {
    return 0;
  }
  const pct = Math.min(100, Math.max(0, homeLoanFundingPercent)) / 100;
  return Math.round(futurePropertyValue * pct);
}

/**
 * 5. Down Payment
 * downPayment = futurePropertyValue - homeLoanAmount
 */
export function calculateDownPayment(
  futurePropertyValue: number,
  homeLoanAmount: number
): number {
  return Math.max(0, (futurePropertyValue || 0) - (homeLoanAmount || 0));
}

/**
 * 6. Total Amount To Accumulate Before Purchase
 * totalAmountToAccumulate = downPayment + additionalPurchaseCosts
 */
export function calculateTotalAmountToAccumulate(
  downPayment: number,
  additionalPurchaseCosts: number
): number {
  return Math.max(0, (downPayment || 0) + (additionalPurchaseCosts || 0));
}

/**
 * 7. Projected Monthly Income (Compounded annually at incomeGrowthRate)
 * projectedMonthlyIncome = currentMonthlyIncome * (1 + incomeGrowthRate)^yearsToPurchase
 */
export function calculateProjectedMonthlyIncome(
  currentMonthlyIncome: number,
  incomeGrowthRate: number,
  yearsToPurchase: number
): number {
  if (currentMonthlyIncome <= 0) return 0;
  if (yearsToPurchase <= 0) return currentMonthlyIncome;
  const g = (incomeGrowthRate || 0) / 100;
  return Math.round(currentMonthlyIncome * Math.pow(1 + g, yearsToPurchase));
}

/**
 * 8. Ideal Monthly EMI Limit
 * idealMonthlyEMILimit = projectedMonthlyIncome * (idealEMIPercent / 100)
 */
export function calculateIdealMonthlyEMILimit(
  projectedMonthlyIncome: number,
  idealEMIPercent: number
): number {
  if (projectedMonthlyIncome <= 0 || idealEMIPercent <= 0) return 0;
  const pct = Math.min(100, Math.max(0, idealEMIPercent)) / 100;
  return Math.round(projectedMonthlyIncome * pct);
}

/**
 * 9. Home Loan Monthly EMI (periodic monthly rate = rate / 12)
 * EMI = P * r * (1+r)^n / ((1+r)^n - 1)
 */
export function calculateHomeLoanEMI(
  homeLoanAmount: number,
  homeLoanInterestRate: number,
  loanTenureYears: number
): number {
  if (homeLoanAmount <= 0 || loanTenureYears <= 0) return 0;
  
  const n = Math.round(loanTenureYears * 12);
  if (n <= 0) return 0;

  const annualRate = (homeLoanInterestRate || 0) / 100;
  const monthlyRate = annualRate / 12;

  if (monthlyRate === 0) {
    return Math.round(homeLoanAmount / n);
  }

  const factor = Math.pow(1 + monthlyRate, n);
  const emi = (homeLoanAmount * monthlyRate * factor) / (factor - 1);
  return Math.round(emi);
}

/**
 * 10. Total Earmarked Assets Aggregation
 */
export function calculateTotalEarmarkedAssets(assets: EarmarkedAsset[]): number {
  if (!assets || !Array.isArray(assets)) return 0;
  return assets.reduce((sum, item) => sum + Math.max(0, Number(item.amount) || 0), 0);
}

/**
 * 11. Funding Progress Percentage (0% to 100%)
 */
export function calculateFundingProgress(
  totalAmountToAccumulate: number,
  totalEarmarkedAssets: number
): number {
  if (totalAmountToAccumulate <= 0) return 100;
  if (totalEarmarkedAssets <= 0) return 0;
  const progress = (totalEarmarkedAssets / totalAmountToAccumulate) * 100;
  return Math.min(100, Math.max(0, Math.round(progress * 10) / 10));
}

/**
 * 12. Funding Deficit
 * fundingDeficit = max(0, totalAmountToAccumulate - totalEarmarkedAssets)
 */
export function calculateFundingDeficit(
  totalAmountToAccumulate: number,
  totalEarmarkedAssets: number
): number {
  return Math.max(0, (totalAmountToAccumulate || 0) - (totalEarmarkedAssets || 0));
}

/**
 * 13. Required Lump Sum Today
 * PV = deficit / (1 + r)^t
 */
export function calculateRequiredLumpSum(
  fundingDeficit: number,
  expectedInvestmentReturn: number,
  remainingInvestmentPeriod: number
): number {
  if (fundingDeficit <= 0) return 0;
  if (remainingInvestmentPeriod <= 0) return fundingDeficit;
  
  const r = (expectedInvestmentReturn || 0) / 100;
  if (r === 0) return fundingDeficit;

  const pv = fundingDeficit / Math.pow(1 + r, remainingInvestmentPeriod);
  return Math.round(pv);
}

/**
 * 14. Required Fixed Monthly SIP (periodic compounding PMT)
 * PMT = deficit * (i / ((1+i)^m - 1))
 * where i = r / 12, m = investmentPeriod * 12
 */
export function calculateRequiredFixedSIP(
  fundingDeficit: number,
  expectedInvestmentReturn: number,
  remainingInvestmentPeriod: number
): number {
  if (fundingDeficit <= 0 || remainingInvestmentPeriod <= 0) return 0;

  const m = Math.round(remainingInvestmentPeriod * 12);
  if (m <= 0) return 0;

  const annualRate = (expectedInvestmentReturn || 0) / 100;
  const monthlyRate = annualRate / 12;

  if (monthlyRate === 0) {
    return Math.round(fundingDeficit / m);
  }

  const factor = Math.pow(1 + monthlyRate, m);
  const pmt = (fundingDeficit * monthlyRate) / (factor - 1);
  return Math.round(pmt);
}

/**
 * 15. Required Annual Step-Up Monthly SIP
 * 
 * Monthly Step-Up Investment =
 *   -PMT(
 *       (r / 12),
 *       12,
 *       0,
 *       (deficit * (r - g)) / ((1 + r)^t - (1 + g)^t),
 *       0
 *   )
 * 
 * where:
 *   r = annual expected return (as decimal)
 *   g = annual step-up rate (as decimal)
 *   t = remaining investment period in years
 */
export function calculateRequiredStepUpSIP(
  fundingDeficit: number,
  expectedInvestmentReturn: number,
  remainingInvestmentPeriod: number,
  annualStepUpPercent: number
): number {
  if (fundingDeficit <= 0 || remainingInvestmentPeriod <= 0) return 0;

  const t = remainingInvestmentPeriod;
  const r = (expectedInvestmentReturn || 0) / 100;
  const g = (annualStepUpPercent || 0) / 100;
  const monthlyRate = r / 12;

  let fv1: number;
  if (Math.abs(r - g) < 1e-7) {
    // When r == g, the limit as g -> r of (r - g) / ((1+r)^t - (1+g)^t) is 1 / (t * (1+r)^(t-1))
    fv1 = fundingDeficit / (t * Math.pow(1 + r, t - 1));
  } else {
    const numerator = fundingDeficit * (r - g);
    const denominator = Math.pow(1 + r, t) - Math.pow(1 + g, t);
    fv1 = numerator / denominator;
  }

  if (monthlyRate === 0) {
    return Math.round(fv1 / 12);
  }

  // -PMT(monthlyRate, 12, 0, fv1, 0)
  // PMT to reach fv1 at end of 12 months with periodic monthly compounding
  const factor12 = Math.pow(1 + monthlyRate, 12);
  const startingMonthlyPmt = (fv1 * monthlyRate) / (factor12 - 1);
  return Math.round(startingMonthlyPmt);
}

/**
 * 16. Master Calculation Orchestrator
 */
export function calculateHousePurchasePlan(
  input: HousePurchasePlannerInput
): HousePurchasePlannerResult {
  const currentPropertyValue = Math.max(0, input.goal?.currentPropertyValue || 0);
  const yearsToPurchase = Math.max(1, Math.min(30, input.goal?.yearsToPurchase || 6));
  const propertyGrowthRate = input.cost?.propertyGrowthRate ?? 6;
  const additionalCostPercent = input.cost?.additionalCostPercent ?? 10;

  // 1. Property Values
  const futurePropertyValue = calculateFuturePropertyValue(
    currentPropertyValue,
    propertyGrowthRate,
    yearsToPurchase
  );
  const additionalPurchaseCosts = calculateAdditionalPurchaseCosts(
    futurePropertyValue,
    additionalCostPercent
  );
  const totalFutureCost = calculateTotalFutureCost(
    futurePropertyValue,
    additionalPurchaseCosts
  );

  // 2. Loan & Down Payment
  const homeLoanFundingPercent = input.loan?.homeLoanFundingPercent ?? 80;
  const homeLoanAmount = calculateHomeLoanAmount(
    futurePropertyValue,
    homeLoanFundingPercent
  );
  const downPayment = calculateDownPayment(
    futurePropertyValue,
    homeLoanAmount
  );
  const totalAmountToAccumulate = calculateTotalAmountToAccumulate(
    downPayment,
    additionalPurchaseCosts
  );

  // 3. Income & EMI Affordability
  const currentMonthlyIncome = Math.max(0, input.income?.currentMonthlyIncome || 0);
  const incomeGrowthRate = input.income?.incomeGrowthRate ?? 8;
  const projectedMonthlyIncome = calculateProjectedMonthlyIncome(
    currentMonthlyIncome,
    incomeGrowthRate,
    yearsToPurchase
  );
  const idealEMIPercent = input.income?.idealEMIPercent ?? 40;
  const idealMonthlyEMILimit = calculateIdealMonthlyEMILimit(
    projectedMonthlyIncome,
    idealEMIPercent
  );
  const homeLoanInterestRate = input.loan?.homeLoanInterestRate ?? 8.5;
  const loanTenureYears = Math.max(1, Math.min(30, input.loan?.loanTenureYears ?? 20));
  const estimatedHomeLoanEMI = calculateHomeLoanEMI(
    homeLoanAmount,
    homeLoanInterestRate,
    loanTenureYears
  );
  const isEMIAffordable = estimatedHomeLoanEMI <= idealMonthlyEMILimit;
  const emiDifference = idealMonthlyEMILimit - estimatedHomeLoanEMI;

  // 4. Existing Assets & Deficit
  const totalEarmarkedAssets = calculateTotalEarmarkedAssets(input.earmarkedAssets || []);
  const fundingProgress = calculateFundingProgress(
    totalAmountToAccumulate,
    totalEarmarkedAssets
  );
  const fundingDeficit = calculateFundingDeficit(
    totalAmountToAccumulate,
    totalEarmarkedAssets
  );
  const isFullyFunded = fundingDeficit === 0;

  // 5. Funding Plan
  const expectedInvestmentReturn = input.funding?.expectedInvestmentReturn ?? 12;
  const startInvestingDelay = Math.max(0, Math.min(yearsToPurchase - 1, input.funding?.startInvestingDelay ?? 0));
  const remainingInvestmentPeriod = Math.max(0, yearsToPurchase - startInvestingDelay);
  const hasSufficientTime = remainingInvestmentPeriod > 0;
  const annualStepUpPercent = input.funding?.annualStepUpPercent ?? 10;

  const requiredLumpSum = hasSufficientTime
    ? calculateRequiredLumpSum(fundingDeficit, expectedInvestmentReturn, remainingInvestmentPeriod)
    : fundingDeficit;

  const requiredFixedSIP = hasSufficientTime
    ? calculateRequiredFixedSIP(fundingDeficit, expectedInvestmentReturn, remainingInvestmentPeriod)
    : 0;

  const requiredStepUpSIP = hasSufficientTime
    ? calculateRequiredStepUpSIP(fundingDeficit, expectedInvestmentReturn, remainingInvestmentPeriod, annualStepUpPercent)
    : 0;

  // 6. Generate Contextual Factual Insight
  let keyInsight = '';
  if (isFullyFunded) {
    keyInsight = `Your existing earmarked assets of ${formatLakhsCrores(totalEarmarkedAssets)} cover 100% of the estimated down payment and purchase costs.`;
  } else if (fundingProgress > 0) {
    keyInsight = `You have already earmarked ${fundingProgress}% (${formatLakhsCrores(totalEarmarkedAssets)}) of the total ${formatLakhsCrores(totalAmountToAccumulate)} required. Your remaining funding gap is ${formatLakhsCrores(fundingDeficit)}.`;
  } else {
    keyInsight = `To purchase your home in ${yearsToPurchase} years, you will need to accumulate ${formatLakhsCrores(totalAmountToAccumulate)} for the down payment and acquisition costs.`;
  }

  return {
    currentPropertyValue,
    yearsToPurchase,
    propertyGrowthRate,
    futurePropertyValue,
    additionalCostPercent,
    additionalPurchaseCosts,
    totalFutureCost,
    homeLoanFundingPercent,
    homeLoanAmount,
    downPayment,
    totalAmountToAccumulate,
    currentMonthlyIncome,
    incomeGrowthRate,
    projectedMonthlyIncome,
    idealEMIPercent,
    idealMonthlyEMILimit,
    homeLoanInterestRate,
    loanTenureYears,
    estimatedHomeLoanEMI,
    isEMIAffordable,
    emiDifference,
    totalEarmarkedAssets,
    fundingProgress,
    fundingDeficit,
    isFullyFunded,
    expectedInvestmentReturn,
    startInvestingDelay,
    remainingInvestmentPeriod,
    hasSufficientTime,
    annualStepUpPercent,
    requiredLumpSum,
    requiredFixedSIP,
    requiredStepUpSIP,
    keyInsight,
  };
}

/**
 * Format number into standard Indian Currency (e.g. ₹1,41,85,192)
 */
export function formatIndianCurrency(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0';
  const isNegative = amount < 0;
  const absAmount = Math.round(Math.abs(amount));

  const amountStr = absAmount.toString();
  if (amountStr.length <= 3) {
    return `${isNegative ? '-' : ''}₹${amountStr}`;
  }

  const lastThree = amountStr.substring(amountStr.length - 3);
  const remaining = amountStr.substring(0, amountStr.length - 3);
  const withCommas = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',');

  return `${isNegative ? '-' : ''}₹${withCommas},${lastThree}`;
}

/**
 * Format into human-readable Lakhs and Crores (e.g. ₹1.42 Cr or ₹42.50 Lakh)
 */
export function formatLakhsCrores(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined || amount === 0) return '₹0';
  const isNegative = amount < 0;
  const abs = Math.abs(amount);

  if (abs >= 10000000) {
    const cr = abs / 10000000;
    return `${isNegative ? '-' : ''}₹${cr.toFixed(2)} Cr`;
  } else if (abs >= 100000) {
    const lakh = abs / 100000;
    return `${isNegative ? '-' : ''}₹${lakh.toFixed(2)} Lakh`;
  } else {
    return formatIndianCurrency(amount);
  }
}
