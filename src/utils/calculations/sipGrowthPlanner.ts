/**
 * Ant Wealth Creation — SIP Growth Planner Calculation Engine
 * 
 * Implements the authoritative annual step-up SIP with effective monthly compounding:
 * - Starting monthly SIP with annual step-up percentage and step-up duration capping
 * - Effective monthly compounding: i = (1 + r)^(1/12) - 1
 * - Beginning-of-month Annuity-Due investment timing (type = 1)
 * - Dynamic multi-lump-sum investments across any year
 * - Post-SIP compounding horizon (T_total = sipDuration + postSipYears)
 */

export interface LumpSumInvestment {
  id: string;
  year: number;
  amount: number;
}

export interface SIPGrowthInputs {
  monthlySIP: number; // e.g. 20000
  sipDurationYears: number; // e.g. 20 (1-50)
  stepUpRate: number; // % p.a., e.g. 10 (0-50)
  stepUpDurationYears: number; // e.g. 20 (0-50)
  annualReturnRate: number; // % p.a., e.g. 10 (0-30)
  postSipYears: number; // e.g. 0 (0-30)
  lumpSums?: LumpSumInvestment[];
}

export interface YearProjection {
  year: number;
  monthlySIP: number;
  annualSIPInvestment: number;
  lumpSumInvestment: number;
  totalInvestmentForYear: number;
  stepUpRateApplied: number;
  annualReturnRate: number;
  openingCorpus: number;
  closingCorpus: number;
}

export interface SIPGrowthResult {
  totalInvestmentYears: number;
  totalSIPInvestment: number;
  totalLumpSumInvestment: number;
  totalInvested: number;
  finalCorpus: number;
  wealthCreated: number;
  growthPercentage: number;
  projection: YearProjection[];
  keyInsight: string;
}

/**
 * 1. Calculate Effective Monthly Rate
 * i = (1 + r)^(1/12) - 1
 */
export function calculateMonthlyRate(annualRatePercent: number): number {
  const r = Math.max(0, (annualRatePercent || 0) / 100);
  if (r === 0) return 0;
  return Math.pow(1 + r, 1 / 12) - 1;
}

/**
 * 2. Calculate Total Investment Horizon
 * T_total = sipYears + postSipYears
 */
export function calculateTotalInvestmentYears(
  sipYears: number,
  postSipYears: number
): number {
  return Math.max(0, (sipYears || 0) + (postSipYears || 0));
}

/**
 * 3. Calculate Monthly SIP for a Specific Year
 * - Year 1: initialSIP
 * - Year <= stepUpDuration & <= sipDuration: initialSIP * (1 + stepUpRate)^(year - 1)
 * - Year > stepUpDuration & <= sipDuration: initialSIP * (1 + stepUpRate)^(stepUpDuration - 1)
 * - Year > sipDuration: 0
 */
export function calculateMonthlySIPForYear(
  year: number,
  initialSIP: number,
  stepUpRatePercent: number,
  stepUpDurationYears: number,
  sipDurationYears: number
): number {
  if (year <= 0 || initialSIP <= 0 || year > sipDurationYears) {
    return 0;
  }
  if (year === 1) {
    return initialSIP;
  }

  const g = Math.max(0, (stepUpRatePercent || 0) / 100);
  const effectiveStepUps = Math.min(year - 1, Math.max(0, stepUpDurationYears - 1));
  return initialSIP * Math.pow(1 + g, effectiveStepUps);
}

/**
 * 4. Calculate Step-Up Rate Applied for a Given Year
 */
export function calculateStepUpRateForYear(
  year: number,
  stepUpRatePercent: number,
  stepUpDurationYears: number,
  sipDurationYears: number
): number {
  if (year <= 1 || year > sipDurationYears || year > stepUpDurationYears) {
    return 0;
  }
  return stepUpRatePercent;
}

/**
 * 5. Calculate Annual SIP Investment for a Given Year
 */
export function calculateAnnualSIPInvestment(monthlySIP: number): number {
  return Math.max(0, (monthlySIP || 0) * 12);
}

/**
 * 6. Calculate Total Lump Sum for a Specific Year from an Array of Lump Sums
 */
export function calculateAnnualLumpSum(
  year: number,
  lumpSums?: LumpSumInvestment[]
): number {
  if (!lumpSums || lumpSums.length === 0) return 0;
  return lumpSums
    .filter((item) => item.year === year && item.amount > 0)
    .reduce((sum, item) => sum + item.amount, 0);
}

/**
 * 7. Calculate Year-End Closing Corpus
 * Annuity-Due Beginning-of-Month timing with effective monthly rate i:
 * Base = OpeningCorpus + LumpSum
 * fvBase = Base * (1 + annualReturnRate)
 * fvSIP = MonthlySIP * [((1+i)^12 - 1) / i] * (1 + i)  (if i > 0, else MonthlySIP * 12)
 * ClosingCorpus = fvBase + fvSIP
 */
export function calculateYearEndCorpus(
  openingCorpus: number,
  lumpSum: number,
  monthlySIP: number,
  annualReturnRatePercent: number
): number {
  const base = Math.max(0, (openingCorpus || 0) + (lumpSum || 0));
  const r = Math.max(0, (annualReturnRatePercent || 0) / 100);

  if (r === 0) {
    return base + (monthlySIP * 12);
  }

  const i = calculateMonthlyRate(annualReturnRatePercent);
  const fvBase = base * (1 + r);

  let fvSIP = 0;
  if (monthlySIP > 0) {
    const fvFactor = ((Math.pow(1 + i, 12) - 1) / i) * (1 + i);
    fvSIP = monthlySIP * fvFactor;
  }

  return Math.max(0, fvBase + fvSIP);
}

/**
 * 8. Calculate Full Year-by-Year Projection
 */
export function calculateProjection(inputs: SIPGrowthInputs): YearProjection[] {
  const initialSIP = Math.max(0, inputs.monthlySIP || 0);
  const sipDuration = Math.max(0, inputs.sipDurationYears || 0);
  const stepUpRate = Math.max(0, inputs.stepUpRate || 0);
  const stepUpDuration = Math.max(0, inputs.stepUpDurationYears || 0);
  const annualReturn = Math.max(0, inputs.annualReturnRate || 0);
  const postSipYears = Math.max(0, inputs.postSipYears || 0);

  const totalYears = calculateTotalInvestmentYears(sipDuration, postSipYears);
  const projection: YearProjection[] = [];

  let currentCorpus = 0;

  for (let year = 1; year <= totalYears; year++) {
    const monthlySIP = calculateMonthlySIPForYear(
      year,
      initialSIP,
      stepUpRate,
      stepUpDuration,
      sipDuration
    );
    const annualSIP = calculateAnnualSIPInvestment(monthlySIP);
    const lumpSum = calculateAnnualLumpSum(year, inputs.lumpSums);
    const totalInvestedThisYear = annualSIP + lumpSum;
    const stepUpApplied = calculateStepUpRateForYear(
      year,
      stepUpRate,
      stepUpDuration,
      sipDuration
    );

    const opening = currentCorpus;
    const closing = calculateYearEndCorpus(
      opening,
      lumpSum,
      monthlySIP,
      annualReturn
    );

    projection.push({
      year,
      monthlySIP,
      annualSIPInvestment: annualSIP,
      lumpSumInvestment: lumpSum,
      totalInvestmentForYear: totalInvestedThisYear,
      stepUpRateApplied: stepUpApplied,
      annualReturnRate: annualReturn,
      openingCorpus: opening,
      closingCorpus: closing
    });

    currentCorpus = closing;
  }

  return projection;
}

/**
 * 9. Calculate Total SIP Investment from Projection
 */
export function calculateTotalSIPInvestment(projection: YearProjection[]): number {
  return projection.reduce((sum, item) => sum + item.annualSIPInvestment, 0);
}

/**
 * 10. Calculate Total Lump Sum Investment from Projection
 */
export function calculateTotalLumpSumInvestment(projection: YearProjection[]): number {
  return projection.reduce((sum, item) => sum + item.lumpSumInvestment, 0);
}

/**
 * 11. Calculate Total Investment (SIP + Lump Sums)
 */
export function calculateTotalInvestment(
  totalSIP: number,
  totalLump: number
): number {
  return Math.max(0, (totalSIP || 0) + (totalLump || 0));
}

/**
 * 12. Calculate Wealth Created (Final Corpus - Total Invested)
 */
export function calculateWealthCreated(
  finalCorpus: number,
  totalInvested: number
): number {
  return Math.max(0, (finalCorpus || 0) - (totalInvested || 0));
}

/**
 * 13. Calculate Growth Percentage
 */
export function calculateGrowthPercentage(
  wealthCreated: number,
  totalInvested: number
): number {
  if (totalInvested <= 0) return 0;
  return (wealthCreated / totalInvested) * 100;
}

/**
 * 14. Master SIP Growth Planner Orchestrator
 */
export function calculateSIPGrowthPlan(inputs: SIPGrowthInputs): SIPGrowthResult {
  const projection = calculateProjection(inputs);
  const totalInvestmentYears = projection.length;

  const totalSIPInvestment = calculateTotalSIPInvestment(projection);
  const totalLumpSumInvestment = calculateTotalLumpSumInvestment(projection);
  const totalInvested = calculateTotalInvestment(totalSIPInvestment, totalLumpSumInvestment);

  const finalCorpus = projection.length > 0 ? projection[projection.length - 1].closingCorpus : 0;
  const wealthCreated = calculateWealthCreated(finalCorpus, totalInvested);
  const growthPercentage = calculateGrowthPercentage(wealthCreated, totalInvested);

  // Generate Factual Dynamic Insight
  let keyInsight = '';
  if (totalInvested === 0) {
    keyInsight = 'Enter your starting monthly SIP and horizon to project your wealth creation roadmap.';
  } else {
    const times = totalInvested > 0 ? (finalCorpus / totalInvested).toFixed(1) : '0';
    const postNote = inputs.postSipYears > 0 ? ` (including ${inputs.postSipYears} post-SIP compounding years)` : '';
    keyInsight = `By investing ${formatLakhsCrores(totalInvested)} over ${totalInvestmentYears} years${postNote}, your estimated corpus could grow to ${formatLakhsCrores(finalCorpus)}—generating ${formatLakhsCrores(wealthCreated)} in estimated wealth (${times}x your total contributions).`;
  }

  return {
    totalInvestmentYears,
    totalSIPInvestment,
    totalLumpSumInvestment,
    totalInvested,
    finalCorpus,
    wealthCreated,
    growthPercentage: Math.round(growthPercentage * 100) / 100,
    projection,
    keyInsight
  };
}

/**
 * Format Indian Currency (e.g. ₹3,45,17,707)
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
 * Format Lakhs & Crores (e.g. ₹3.45 Cr or ₹44.10 Lakh)
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

/**
 * Format Percentage (e.g. 10% or 134.08%)
 */
export function formatPercentage(rate: number, decimals: number = 2): string {
  if (isNaN(rate) || rate === null || rate === undefined) return '0%';
  return `${rate.toFixed(decimals)}%`;
}
