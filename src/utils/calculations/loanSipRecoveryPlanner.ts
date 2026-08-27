/**
 * Ant Wealth — Loan + SIP Recovery Planner Calculation Engine
 * 
 * Core Concept:
 * "Your EMI pays off the loan. Your SIP can potentially build the wealth to offset it."
 * 
 * Mathematical Models:
 * 1. Reducing Balance Home/Personal/Vehicle Loan Amortization:
 *    - Monthly periodic rate: i_loan = AnnualRate / 12 / 100
 *    - EMI = P * [i_loan * (1 + i_loan)^n] / [(1 + i_loan)^n - 1]
 *    - Total Loan Cost = EMI * n
 *    - Total Interest = Total Loan Cost - Loan Principal
 * 
 * 2. Two Primary Recovery Targets:
 *    - Target 1: Recover Total Loan Interest
 *    - Target 2: Recover Complete Loan Cost (Principal + Total Interest)
 * 
 * 3. Beginning-of-Month Annuity Due Compounding for Parallel SIP:
 *    - Effective monthly SIP return: i_SIP = (1 + r_annual)^(1/12) - 1
 *    - FV = PMT * [((1 + i_SIP)^n - 1) / i_SIP] * (1 + i_SIP)
 *    - Required SIP = Target / [((1 + i_SIP)^n - 1) / i_SIP * (1 + i_SIP)]
 *    - SIP % of EMI = (Required SIP / EMI) * 100
 * 
 * 4. Custom SIP Time-to-Recovery Simulation:
 *    - Simulates month-by-month parallel accumulation to find earliest month where:
 *      Corpus >= Target
 *    - Compares recovery milestone vs original loan tenure (Early, Late, Exactly on time).
 */

export interface LoanSIPRecoveryInputs {
  loanType: string; // "Home Loan", "Personal Loan", "Vehicle Loan", "Education Loan", "Business Loan", "Other Loan"
  loanAmount: number;
  annualLoanInterestRate: number;
  loanTenureYears: number;
  loanStartDate: string;

  sipReturnRate?: number; // Annual % p.a.
  sipDurationYears?: number; // In years (Default = loanTenureYears)

  customSipAmount?: number; // Custom monthly SIP entered by user
}

export interface LoanDetails {
  loanType: string;
  loanAmount: number;
  annualLoanInterestRate: number;
  loanTenureYears: number;
  loanTenureMonths: number;
  loanStartDate: string;
  emi: number;
  totalScheduledRepayment: number;
  totalInterest: number;
  interestToPrincipalRatio: number; // e.g. 1.16 means interest is 116% of principal
}

export interface RequiredSIPResult {
  targetType: 'interest' | 'complete';
  targetAmount: number;
  sipDurationYears: number;
  sipDurationMonths: number;
  sipReturnRate: number;
  effectiveMonthlyRate: number;
  requiredMonthlySIP: number;
  sipPercentageOfEMI: number;
  totalSIPInvestment: number;
  projectedCorpus: number;
  wealthCreated: number;
}

export interface CustomSIPRecoveryMilestone {
  targetAmount: number;
  isReached: boolean;
  recoveryMonth: number | null;
  recoveryYears: number | null;
  recoveryMonthsRemaining: number | null;
  formattedDuration: string;
  recoveryDate?: string;
  corpusAtRecovery: number;
  totalSIPInvestedAtRecovery: number;
  surplusAtRecovery: number;
  monthsVsTenure: number | null; // Negative = early, Positive = late
  comparisonStatus: 'early' | 'late' | 'exact' | 'unreached';
  comparisonNarrative: string;
}

export interface CustomSIPProjectionRow {
  monthNumber: number;
  yearNumber: number;
  date: string;
  loanBalance: number;
  monthlySIP: number;
  cumulativeSIPInvestment: number;
  sipGrowth: number;
  sipCorpus: number;
  gapToInterestTarget: number;
  gapToCompleteLoanTarget: number;
  isInterestCovered: boolean;
  isCompleteLoanCovered: boolean;
}

export interface LoanAmortizationMonth {
  monthNumber: number;
  yearNumber: number;
  date: string;
  openingPrincipal: number;
  emi: number;
  interestComponent: number;
  principalComponent: number;
  closingPrincipal: number;
}

export interface LoanSIPRecoveryResult {
  loanDetails: LoanDetails;
  sipDurationYears: number;
  sipDurationMonths: number;
  sipReturnRate: number;
  effectiveMonthlySIPRate: number;
  isReturnManuallySet: boolean;

  // Target 1: Interest Recovery
  interestRecovery: RequiredSIPResult;

  // Target 2: Complete Loan Cost Recovery
  completeLoanRecovery: RequiredSIPResult;

  // Custom SIP (if provided or default)
  customSipAmount: number;
  customSipPercentageOfEMI: number;
  customInterestMilestone: CustomSIPRecoveryMilestone;
  customCompleteLoanMilestone: CustomSIPRecoveryMilestone;

  // Projection Table
  projection: CustomSIPProjectionRow[];
  yearlySummaries: Array<{
    yearNumber: number;
    calendarYear: number;
    closingLoanBalance: number;
    cumulativeSIPInvestment: number;
    closingSIPCorpus: number;
    interestTargetMet: boolean;
    completeTargetMet: boolean;
  }>;

  // Key Factual Insights
  keyMessage: string;
}

/**
 * 1. Calculate Monthly Loan Periodic Interest Rate
 */
export function calculateMonthlyLoanRate(annualRate: number): number {
  if (!annualRate || annualRate <= 0) return 0;
  return annualRate / (12 * 100);
}

/**
 * 2. Calculate Standard Reducing-Balance Loan Monthly EMI
 */
export function calculateEMI(
  loanAmount: number,
  tenureYears: number,
  annualInterestRate: number
): number {
  const p = Math.max(0, loanAmount || 0);
  const n = Math.max(1, (tenureYears || 1) * 12);
  const r = calculateMonthlyLoanRate(annualInterestRate);

  if (p === 0) return 0;
  if (r === 0) return p / n;

  const factor = Math.pow(1 + r, n);
  const emi = p * ((r * factor) / (factor - 1));
  return isFinite(emi) ? emi : 0;
}

/**
 * 3. Calculate Total Interest Payable Over Contractual Loan Tenure
 */
export function calculateTotalInterest(
  loanAmount: number,
  emi: number,
  tenureYears: number
): number {
  const p = Math.max(0, loanAmount || 0);
  const n = Math.max(1, (tenureYears || 1) * 12);
  const totalRepayment = emi * n;
  return Math.max(0, totalRepayment - p);
}

/**
 * 4. Calculate Total Loan Cost (Principal + Total Interest)
 */
export function calculateTotalLoanCost(
  loanAmount: number,
  totalInterest: number
): number {
  return Math.max(0, (loanAmount || 0) + (totalInterest || 0));
}

/**
 * 5. Calculate Loan Reducing Balance Amortization
 */
export function calculateLoanAmortization(
  loanAmount: number,
  tenureYears: number,
  annualInterestRate: number,
  startDate?: string
): LoanAmortizationMonth[] {
  const p = Math.max(0, loanAmount || 0);
  const n = Math.max(1, (tenureYears || 1) * 12);
  const r = calculateMonthlyLoanRate(annualInterestRate);
  const emi = calculateEMI(p, tenureYears, annualInterestRate);

  const parsedStart = startDate ? new Date(startDate) : new Date();
  const validStart = isNaN(parsedStart.getTime()) ? new Date() : parsedStart;

  const rows: LoanAmortizationMonth[] = [];
  let currentPrincipal = p;

  for (let m = 1; m <= n; m++) {
    const yearNumber = Math.ceil(m / 12);
    const currentDate = new Date(validStart.getFullYear(), validStart.getMonth() + m - 1, 1);
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-01`;

    const openingPrincipal = currentPrincipal;
    let interestComponent = 0;
    let principalComponent = 0;
    let closingPrincipal = 0;

    if (openingPrincipal > 0) {
      interestComponent = openingPrincipal * r;
      principalComponent = Math.min(openingPrincipal, emi - interestComponent);
      closingPrincipal = Math.max(0, openingPrincipal - principalComponent);
      if (m === n || closingPrincipal < 0.5) {
        closingPrincipal = 0;
      }
    }

    rows.push({
      monthNumber: m,
      yearNumber,
      date: dateStr,
      openingPrincipal,
      emi: openingPrincipal > 0 ? emi : 0,
      interestComponent,
      principalComponent,
      closingPrincipal
    });

    currentPrincipal = closingPrincipal;
  }

  return rows;
}

/**
 * 6. Calculate Effective Monthly SIP Compounding Rate
 * Formula: i_SIP = (1 + r_annual)^(1/12) - 1
 */
export function calculateEffectiveMonthlySIPRate(annualReturnRate: number): number {
  if (!annualReturnRate || annualReturnRate <= 0) return 0;
  return Math.pow(1 + annualReturnRate / 100, 1 / 12) - 1;
}

/**
 * 7. Calculate Beginning-of-Month Annuity Due Future Value of SIP
 */
export function calculateSIPFutureValue(
  monthlySIP: number,
  months: number,
  annualReturnRate: number
): number {
  const pmt = Math.max(0, monthlySIP || 0);
  const n = Math.max(0, months || 0);
  if (pmt === 0 || n === 0) return 0;

  const iSIP = calculateEffectiveMonthlySIPRate(annualReturnRate);
  if (iSIP === 0) {
    return pmt * n;
  }

  const factor = Math.pow(1 + iSIP, n);
  const fv = pmt * ((factor - 1) / iSIP) * (1 + iSIP);
  return isFinite(fv) ? fv : 0;
}

/**
 * 8. Calculate Required Monthly SIP to Reach Target Corpus (Beginning-of-Month Timing)
 */
export function calculateRequiredSIP(
  targetCorpus: number,
  months: number,
  annualReturnRate: number
): number {
  const target = Math.max(0, targetCorpus || 0);
  const n = Math.max(1, months || 1);
  if (target === 0) return 0;

  const iSIP = calculateEffectiveMonthlySIPRate(annualReturnRate);
  if (iSIP === 0) {
    return target / n;
  }

  const factor = Math.pow(1 + iSIP, n);
  const annuityFactor = ((factor - 1) / iSIP) * (1 + iSIP);
  const requiredSIP = target / annuityFactor;
  return isFinite(requiredSIP) ? requiredSIP : 0;
}

/**
 * 9. Calculate Percentage of Monthly SIP relative to Loan EMI
 */
export function calculateSIPPercentageOfEMI(sipAmount: number, emi: number): number {
  if (!emi || emi <= 0 || !sipAmount || sipAmount <= 0) return 0;
  return (sipAmount / emi) * 100;
}

/**
 * 10. Calculate Required SIP for Target 1: Interest Recovery
 */
export function calculateInterestRecoverySIP(
  loanAmount: number,
  tenureYears: number,
  loanInterestRate: number,
  sipDurationYears: number,
  sipReturnRate: number
): RequiredSIPResult {
  const emi = calculateEMI(loanAmount, tenureYears, loanInterestRate);
  const totalInterest = calculateTotalInterest(loanAmount, emi, tenureYears);
  const sipMonths = Math.max(1, sipDurationYears * 12);
  const requiredMonthlySIP = calculateRequiredSIP(totalInterest, sipMonths, sipReturnRate);
  const sipPercentageOfEMI = calculateSIPPercentageOfEMI(requiredMonthlySIP, emi);
  const totalSIPInvestment = requiredMonthlySIP * sipMonths;
  const projectedCorpus = calculateSIPFutureValue(requiredMonthlySIP, sipMonths, sipReturnRate);
  const wealthCreated = Math.max(0, projectedCorpus - totalSIPInvestment);

  return {
    targetType: 'interest',
    targetAmount: totalInterest,
    sipDurationYears,
    sipDurationMonths: sipMonths,
    sipReturnRate,
    effectiveMonthlyRate: calculateEffectiveMonthlySIPRate(sipReturnRate),
    requiredMonthlySIP,
    sipPercentageOfEMI,
    totalSIPInvestment,
    projectedCorpus,
    wealthCreated
  };
}

/**
 * 11. Calculate Required SIP for Target 2: Complete Loan Cost Recovery
 */
export function calculateCompleteLoanRecoverySIP(
  loanAmount: number,
  tenureYears: number,
  loanInterestRate: number,
  sipDurationYears: number,
  sipReturnRate: number
): RequiredSIPResult {
  const emi = calculateEMI(loanAmount, tenureYears, loanInterestRate);
  const totalInterest = calculateTotalInterest(loanAmount, emi, tenureYears);
  const completeLoanCost = calculateTotalLoanCost(loanAmount, totalInterest);
  const sipMonths = Math.max(1, sipDurationYears * 12);
  const requiredMonthlySIP = calculateRequiredSIP(completeLoanCost, sipMonths, sipReturnRate);
  const sipPercentageOfEMI = calculateSIPPercentageOfEMI(requiredMonthlySIP, emi);
  const totalSIPInvestment = requiredMonthlySIP * sipMonths;
  const projectedCorpus = calculateSIPFutureValue(requiredMonthlySIP, sipMonths, sipReturnRate);
  const wealthCreated = Math.max(0, projectedCorpus - totalSIPInvestment);

  return {
    targetType: 'complete',
    targetAmount: completeLoanCost,
    sipDurationYears,
    sipDurationMonths: sipMonths,
    sipReturnRate,
    effectiveMonthlyRate: calculateEffectiveMonthlySIPRate(sipReturnRate),
    requiredMonthlySIP,
    sipPercentageOfEMI,
    totalSIPInvestment,
    projectedCorpus,
    wealthCreated
  };
}

/**
 * 12. Calculate Number of Months for a Custom SIP to Reach a Target Corpus
 */
export function calculateRecoveryMonths(
  targetCorpus: number,
  monthlySIP: number,
  annualReturnRate: number,
  maxHorizonMonths: number = 600
): number | null {
  const target = Math.max(0, targetCorpus || 0);
  const pmt = Math.max(0, monthlySIP || 0);
  if (target === 0) return 0;
  if (pmt === 0) return null;

  const iSIP = calculateEffectiveMonthlySIPRate(annualReturnRate);
  let currentCorpus = 0;

  for (let m = 1; m <= maxHorizonMonths; m++) {
    const investBase = currentCorpus + pmt;
    const growth = investBase * iSIP;
    currentCorpus = investBase + growth;

    if (currentCorpus >= target - 0.01) {
      return m;
    }
  }

  return null;
}

/**
 * 13. Format Months into Years and Months Object
 */
export function calculateRecoveryYearsAndMonths(months: number | null): {
  years: number;
  months: number;
  formatted: string;
} {
  if (months === null || months === undefined || months <= 0) {
    return { years: 0, months: 0, formatted: 'Not reached within 50 years' };
  }

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  let formatted = '';
  if (years > 0 && remainingMonths > 0) {
    formatted = `${years} Year${years > 1 ? 's' : ''} ${remainingMonths} Month${remainingMonths > 1 ? 's' : ''}`;
  } else if (years > 0) {
    formatted = `${years} Year${years > 1 ? 's' : ''}`;
  } else {
    formatted = `${remainingMonths} Month${remainingMonths > 1 ? 's' : ''}`;
  }

  return { years, months: remainingMonths, formatted };
}

/**
 * 14. Calculate Recovery Timeline Comparison vs Original Loan Tenure
 */
export function calculateRecoveryTimelineComparison(
  loanTenureMonths: number,
  recoveryMonths: number | null
): {
  monthsVsTenure: number | null;
  comparisonStatus: 'early' | 'late' | 'exact' | 'unreached';
  comparisonNarrative: string;
} {
  if (recoveryMonths === null) {
    return {
      monthsVsTenure: null,
      comparisonStatus: 'unreached',
      comparisonNarrative: 'The target is not projected to be reached within a 50-year horizon with the current SIP amount and return assumptions.'
    };
  }

  const diff = recoveryMonths - loanTenureMonths;

  if (diff < 0) {
    const earlyMonths = Math.abs(diff);
    const { formatted } = calculateRecoveryYearsAndMonths(earlyMonths);
    return {
      monthsVsTenure: diff,
      comparisonStatus: 'early',
      comparisonNarrative: `🎯 Potential Recovery Achieved Early: Your SIP could potentially reach your complete loan-cost target ${formatted} before your original ${Math.round(loanTenureMonths / 12)}-year loan tenure ends, based on the selected return assumption.`
    };
  } else if (diff > 0) {
    const lateMonths = diff;
    const { formatted } = calculateRecoveryYearsAndMonths(lateMonths);
    return {
      monthsVsTenure: diff,
      comparisonStatus: 'late',
      comparisonNarrative: `Recovery may take longer than the loan tenure: Your SIP is projected to reach the complete loan-cost target approximately ${formatted} after your ${Math.round(loanTenureMonths / 12)}-year loan tenure ends. Increasing your monthly SIP amount can accelerate this timeline.`
    };
  } else {
    return {
      monthsVsTenure: 0,
      comparisonStatus: 'exact',
      comparisonNarrative: `🎯 Target Matched at Loan Maturity: Your SIP is projected to accumulate the complete loan-cost target right around the end of your ${Math.round(loanTenureMonths / 12)}-year loan tenure.`
    };
  }
}

/**
 * 15. Calculate Month-by-Month Custom SIP Projection
 */
export function calculateCustomSIPProjection(
  inputs: LoanSIPRecoveryInputs,
  customSIP: number,
  maxHorizonMonths: number = 600
): CustomSIPProjectionRow[] {
  const loanAmount = Math.max(0, inputs.loanAmount || 0);
  const tenureYears = Math.max(1, inputs.loanTenureYears || 1);
  const loanRate = Math.max(0, inputs.annualLoanInterestRate || 0);
  const emi = calculateEMI(loanAmount, tenureYears, loanRate);
  const totalInterest = calculateTotalInterest(loanAmount, emi, tenureYears);
  const completeCost = calculateTotalLoanCost(loanAmount, totalInterest);

  const sipDurationYears = inputs.sipDurationYears || tenureYears;
  const defaultReturn = sipDurationYears <= 10 ? 10 : 12;
  const sipReturn = inputs.sipReturnRate !== undefined ? inputs.sipReturnRate : defaultReturn;
  const iSIP = calculateEffectiveMonthlySIPRate(sipReturn);
  const iLoan = calculateMonthlyLoanRate(loanRate);

  const totalLoanMonths = tenureYears * 12;
  const parsedStart = inputs.loanStartDate ? new Date(inputs.loanStartDate) : new Date();
  const validStart = isNaN(parsedStart.getTime()) ? new Date() : parsedStart;

  const rows: CustomSIPProjectionRow[] = [];
  let currentPrincipal = loanAmount;
  let currentSIPCorpus = 0;
  let cumulativeSIP = 0;

  // We project for max(totalLoanMonths, maxHorizonMonths) or until targets are well surpassed
  const projectionMonths = Math.min(maxHorizonMonths, Math.max(totalLoanMonths, 360));

  for (let m = 1; m <= projectionMonths; m++) {
    const yearNumber = Math.ceil(m / 12);
    const currentDate = new Date(validStart.getFullYear(), validStart.getMonth() + m - 1, 1);
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-01`;

    // Loan balance amortization
    let closingLoanBalance = 0;
    if (m <= totalLoanMonths && currentPrincipal > 0) {
      const interestComp = currentPrincipal * iLoan;
      const principalComp = Math.min(currentPrincipal, emi - interestComp);
      closingLoanBalance = Math.max(0, currentPrincipal - principalComp);
      if (m === totalLoanMonths || closingLoanBalance < 0.5) {
        closingLoanBalance = 0;
      }
      currentPrincipal = closingLoanBalance;
    }

    // SIP accumulation
    cumulativeSIP += customSIP;
    const investBase = currentSIPCorpus + customSIP;
    const sipGrowth = investBase * iSIP;
    const closingSIPCorpus = investBase + sipGrowth;
    currentSIPCorpus = closingSIPCorpus;

    const gapToInterest = Math.max(0, totalInterest - closingSIPCorpus);
    const gapToComplete = Math.max(0, completeCost - closingSIPCorpus);

    rows.push({
      monthNumber: m,
      yearNumber,
      date: dateStr,
      loanBalance: closingLoanBalance,
      monthlySIP: customSIP,
      cumulativeSIPInvestment: cumulativeSIP,
      sipGrowth,
      sipCorpus: closingSIPCorpus,
      gapToInterestTarget: gapToInterest,
      gapToCompleteLoanTarget: gapToComplete,
      isInterestCovered: closingSIPCorpus >= totalInterest - 0.01,
      isCompleteLoanCovered: closingSIPCorpus >= completeCost - 0.01
    });
  }

  return rows;
}

/**
 * 16. Master Orchestrator: Calculate Complete Loan + SIP Recovery Plan
 */
export function calculateLoanSIPRecoveryPlan(
  inputs: LoanSIPRecoveryInputs
): LoanSIPRecoveryResult {
  const loanType = inputs.loanType || 'Home Loan';
  const loanAmount = Math.max(0, inputs.loanAmount || 0);
  const loanTenureYears = Math.max(1, inputs.loanTenureYears || 1);
  const loanTenureMonths = loanTenureYears * 12;
  const annualLoanInterestRate = Math.max(0, inputs.annualLoanInterestRate || 0);
  const loanStartDate = inputs.loanStartDate || new Date().toISOString().split('T')[0];

  // Default SIP Duration equals loan tenure if not provided
  const sipDurationYears = Math.max(1, inputs.sipDurationYears || loanTenureYears);
  const sipDurationMonths = sipDurationYears * 12;

  // Adaptive Default Return Logic:
  // If SIP duration <= 10 years -> 10% default
  // If SIP duration > 10 years -> 12% default
  const defaultReturn = sipDurationYears <= 10 ? 10 : 12;
  const isReturnManuallySet = inputs.sipReturnRate !== undefined;
  const sipReturnRate = isReturnManuallySet ? inputs.sipReturnRate! : defaultReturn;
  const effectiveMonthlySIPRate = calculateEffectiveMonthlySIPRate(sipReturnRate);

  // Contractual Loan Details
  const emi = calculateEMI(loanAmount, loanTenureYears, annualLoanInterestRate);
  const totalScheduledRepayment = emi * loanTenureMonths;
  const totalInterest = calculateTotalInterest(loanAmount, emi, loanTenureYears);
  const interestToPrincipalRatio = loanAmount > 0 ? (totalInterest / loanAmount) : 0;

  const loanDetails: LoanDetails = {
    loanType,
    loanAmount,
    annualLoanInterestRate,
    loanTenureYears,
    loanTenureMonths,
    loanStartDate,
    emi,
    totalScheduledRepayment,
    totalInterest,
    interestToPrincipalRatio
  };

  // Target 1: Recover Loan Interest
  const interestRecovery = calculateInterestRecoverySIP(
    loanAmount,
    loanTenureYears,
    annualLoanInterestRate,
    sipDurationYears,
    sipReturnRate
  );

  // Target 2: Recover Complete Loan Cost
  const completeLoanRecovery = calculateCompleteLoanRecoverySIP(
    loanAmount,
    loanTenureYears,
    annualLoanInterestRate,
    sipDurationYears,
    sipReturnRate
  );

  // Custom Monthly SIP (default to approx 20% of EMI or 9,000 if not specified)
  const defaultCustomSIP = Math.round(emi * 0.20) || 9000;
  const customSipAmount = inputs.customSipAmount !== undefined
    ? Math.max(0, inputs.customSipAmount)
    : defaultCustomSIP;

  const customSipPercentageOfEMI = calculateSIPPercentageOfEMI(customSipAmount, emi);

  // Calculate Recovery Milestones for Custom SIP
  const recoveryMonthInterest = calculateRecoveryMonths(totalInterest, customSipAmount, sipReturnRate);
  const recoveryMonthComplete = calculateRecoveryMonths(
    loanAmount + totalInterest,
    customSipAmount,
    sipReturnRate
  );

  const interestYearsAndMonths = calculateRecoveryYearsAndMonths(recoveryMonthInterest);
  const completeYearsAndMonths = calculateRecoveryYearsAndMonths(recoveryMonthComplete);

  const timelineCompInterest = calculateRecoveryTimelineComparison(loanTenureMonths, recoveryMonthInterest);
  const timelineCompComplete = calculateRecoveryTimelineComparison(loanTenureMonths, recoveryMonthComplete);

  // Helper date calculator
  const getMilestoneDate = (monthNum: number | null): string | undefined => {
    if (!monthNum) return undefined;
    const parsed = new Date(loanStartDate);
    const valid = isNaN(parsed.getTime()) ? new Date() : parsed;
    const d = new Date(valid.getFullYear(), valid.getMonth() + monthNum - 1, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
  };

  const corpusAtInterestRec = recoveryMonthInterest
    ? calculateSIPFutureValue(customSipAmount, recoveryMonthInterest, sipReturnRate)
    : 0;
  const totalInvAtInterestRec = recoveryMonthInterest ? customSipAmount * recoveryMonthInterest : 0;

  const corpusAtCompleteRec = recoveryMonthComplete
    ? calculateSIPFutureValue(customSipAmount, recoveryMonthComplete, sipReturnRate)
    : 0;
  const totalInvAtCompleteRec = recoveryMonthComplete ? customSipAmount * recoveryMonthComplete : 0;

  const customInterestMilestone: CustomSIPRecoveryMilestone = {
    targetAmount: totalInterest,
    isReached: recoveryMonthInterest !== null,
    recoveryMonth: recoveryMonthInterest,
    recoveryYears: interestYearsAndMonths.years,
    recoveryMonthsRemaining: interestYearsAndMonths.months,
    formattedDuration: interestYearsAndMonths.formatted,
    recoveryDate: getMilestoneDate(recoveryMonthInterest),
    corpusAtRecovery: corpusAtInterestRec,
    totalSIPInvestedAtRecovery: totalInvAtInterestRec,
    surplusAtRecovery: Math.max(0, corpusAtInterestRec - totalInterest),
    monthsVsTenure: timelineCompInterest.monthsVsTenure,
    comparisonStatus: timelineCompInterest.comparisonStatus,
    comparisonNarrative: timelineCompInterest.comparisonNarrative
  };

  const customCompleteLoanMilestone: CustomSIPRecoveryMilestone = {
    targetAmount: loanAmount + totalInterest,
    isReached: recoveryMonthComplete !== null,
    recoveryMonth: recoveryMonthComplete,
    recoveryYears: completeYearsAndMonths.years,
    recoveryMonthsRemaining: completeYearsAndMonths.months,
    formattedDuration: completeYearsAndMonths.formatted,
    recoveryDate: getMilestoneDate(recoveryMonthComplete),
    corpusAtRecovery: corpusAtCompleteRec,
    totalSIPInvestedAtRecovery: totalInvAtCompleteRec,
    surplusAtRecovery: Math.max(0, corpusAtCompleteRec - (loanAmount + totalInterest)),
    monthsVsTenure: timelineCompComplete.monthsVsTenure,
    comparisonStatus: timelineCompComplete.comparisonStatus,
    comparisonNarrative: timelineCompComplete.comparisonNarrative
  };

  // Generate Month-by-Month Projection
  const projection = calculateCustomSIPProjection(inputs, customSipAmount);

  // Generate Yearly Summaries
  const yearlyMap = new Map<number, CustomSIPProjectionRow[]>();
  projection.forEach((p) => {
    const list = yearlyMap.get(p.yearNumber) || [];
    list.push(p);
    yearlyMap.set(p.yearNumber, list);
  });

  const yearlySummaries = Array.from(yearlyMap.entries()).map(([yearNum, monthsInYear]) => {
    const lastMonth = monthsInYear[monthsInYear.length - 1];
    const calendarYear = parseInt(lastMonth.date.substring(0, 4), 10);
    return {
      yearNumber: yearNum,
      calendarYear,
      closingLoanBalance: lastMonth.loanBalance,
      cumulativeSIPInvestment: lastMonth.cumulativeSIPInvestment,
      closingSIPCorpus: lastMonth.sipCorpus,
      interestTargetMet: lastMonth.isInterestCovered,
      completeTargetMet: lastMonth.isCompleteLoanCovered
    };
  });

  // Master Key Message
  const keyMessage =
    'Your EMI pays off the loan. Your SIP can potentially build the wealth to offset it. Start small. Stay consistent. Give compounding time to work.';

  return {
    loanDetails,
    sipDurationYears,
    sipDurationMonths,
    sipReturnRate,
    effectiveMonthlySIPRate,
    isReturnManuallySet,
    interestRecovery,
    completeLoanRecovery,
    customSipAmount,
    customSipPercentageOfEMI,
    customInterestMilestone,
    customCompleteLoanMilestone,
    projection,
    yearlySummaries,
    keyMessage
  };
}

/**
 * Indian Rupee Currency Formatter
 */
export function formatIndianCurrency(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0';
  const isNegative = amount < 0;
  const absVal = Math.round(Math.abs(amount));

  const str = absVal.toString();
  let result = '';

  if (str.length <= 3) {
    result = str;
  } else {
    const lastThree = str.substring(str.length - 3);
    const otherNumbers = str.substring(0, str.length - 3);
    const withCommas = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    result = `${withCommas},${lastThree}`;
  }

  return isNegative ? `-₹${result}` : `₹${result}`;
}

/**
 * Lakhs & Crores Smart Formatter
 */
export function formatLakhsCrores(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined || amount === 0) return '₹0';
  const absVal = Math.abs(amount);
  const isNegative = amount < 0;
  const prefix = isNegative ? '-₹' : '₹';

  if (absVal >= 10000000) {
    const cr = absVal / 10000000;
    return `${prefix}${cr.toFixed(2)} Cr`;
  } else if (absVal >= 100000) {
    const lk = absVal / 100000;
    return `${prefix}${lk.toFixed(2)} Lakh`;
  } else {
    return formatIndianCurrency(amount);
  }
}

/**
 * Percentage Formatter
 */
export function formatPercentage(rate: number, decimals: number = 2): string {
  if (isNaN(rate) || rate === null || rate === undefined) return '0.00%';
  return `${rate.toFixed(decimals)}%`;
}

/**
 * Formatter for Years and Months from total months
 */
export function formatYearsAndMonths(totalMonths: number): string {
  if (!totalMonths || totalMonths <= 0) return '0 Months';
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years > 0 && months > 0) {
    return `${years} Year${years > 1 ? 's' : ''} ${months} Month${months > 1 ? 's' : ''}`;
  } else if (years > 0) {
    return `${years} Year${years > 1 ? 's' : ''}`;
  } else {
    return `${months} Month${months > 1 ? 's' : ''}`;
  }
}
