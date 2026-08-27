/**
 * Ant Wealth Creation — Home Loan Foreclosure Planner Calculation Engine
 * 
 * Implements the month-by-month loan amortization and parallel SIP accumulation methodology:
 * - Standard monthly EMI calculation: EMI = P * [i*(1+i)^n] / [(1+i)^n - 1]
 * - Month-by-month loan amortization tracking opening principal, interest, principal, and closing balance
 * - Effective monthly SIP compounding: i_SIP = (1 + r_annual)^(1/12) - 1 (NOT r/12)
 * - Beginning-of-period Annuity-Due monthly SIP accumulation: ClosingCorpus = (OpeningCorpus + MonthlySIP) * (1 + i_SIP)
 * - Strategy 1 (Target Closure Year): Solves for required monthly SIP to accumulate the outstanding loan principal after target Y years
 * - Strategy 2 (Fixed Monthly SIP): Simulates both streams in parallel and identifies the first crossover month where SIP Corpus >= Outstanding Loan Principal
 */

export type ForeclosureStrategy = 'targetYear' | 'fixedSIP';

export interface HomeLoanForeclosureInputs {
  loanAmount: number; // e.g. 5000000 (Rs 50 Lakh)
  loanTenureYears: number; // e.g. 20 years
  loanInterestRate: number; // % p.a., e.g. 8.0

  sipReturnRate: number; // % p.a., e.g. 12.0

  currentLoanStartDate?: Date | string;

  strategy: ForeclosureStrategy; // 'targetYear' | 'fixedSIP'

  targetClosureYears?: number; // e.g. 10 years (for Option 1)
  monthlySIP?: number; // e.g. 10000 (for Option 2)
}

export interface LoanMonthProjection {
  monthNumber: number;
  yearNumber: number;
  date: string;

  openingPrincipal: number;
  emi: number;
  interestComponent: number;
  principalComponent: number;

  prepayment: number;
  closingPrincipal: number;

  monthlySIP: number;
  openingSIPCorpus: number;
  SIPGrowth: number;
  closingSIPCorpus: number;

  gap: number; // closingPrincipal - closingSIPCorpus (positive = shortfall, negative = surplus)
  foreclosureReady: boolean; // closingSIPCorpus >= closingPrincipal
}

export interface LoanYearSummary {
  yearNumber: number;
  calendarYear: number;
  openingLoanPrincipal: number;
  totalEMIPaid: number;
  totalInterestPaid: number;
  totalPrincipalPaid: number;
  closingLoanPrincipal: number;
  totalSIPInvested: number;
  closingSIPCorpus: number;
  gap: number;
  foreclosureReady: boolean;
}

export interface HomeLoanForeclosureResult {
  loanAmount: number;
  loanTenureYears: number;
  loanInterestRate: number;
  sipReturnRate: number;
  strategy: ForeclosureStrategy;

  emi: number;
  totalScheduledRepayment: number;
  totalScheduledInterest: number;

  // Option 1 specifics
  targetClosureYears?: number;
  targetClosureMonths?: number;
  requiredMonthlySIP?: number;

  // Option 2 specifics
  availableMonthlySIP?: number;

  // Outcome metrics at crossover / target point
  foreclosureMonth: number | null; // 1-based month index where crossover happens (or target month)
  foreclosureYears: number | null; // fractional years e.g. 11.83
  foreclosureDate?: string;

  outstandingPrincipalAtTarget: number;
  SIPCorpusAtTarget: number;
  surplusAtTarget: number; // SIPCorpus - OutstandingPrincipal

  totalSIPInvestment: number;
  SIPWealthCreated: number; // SIPCorpus - totalSIPInvestment

  isForeclosureAchievedWithinTenure: boolean;

  projection: LoanMonthProjection[];
  yearlySummary: LoanYearSummary[];

  keyInsight: string;
}

/**
 * 1. Calculate Standard Monthly Home Loan EMI
 * Formula: EMI = P * [i*(1+i)^n] / [(1+i)^n - 1]
 * where i = LoanInterestRate / (12 * 100) and n = LoanTenureYears * 12
 * Zero-interest fallback: EMI = P / n
 */
export function calculateEMI(
  loanAmount: number,
  loanTenureYears: number,
  loanInterestRate: number
): number {
  const p = Math.max(0, loanAmount || 0);
  const n = Math.max(1, Math.round((loanTenureYears || 0) * 12));
  const annualRate = Math.max(0, loanInterestRate || 0);

  if (p === 0 || n === 0) return 0;
  if (annualRate === 0) return p / n;

  const monthlyRate = annualRate / (12 * 100);
  const compoundFactor = Math.pow(1 + monthlyRate, n);
  const emi = (p * monthlyRate * compoundFactor) / (compoundFactor - 1);

  return isFinite(emi) ? emi : p / n;
}

/**
 * 2. Calculate Effective Monthly SIP Rate
 * Formula: i_SIP = (1 + r_annual)^(1/12) - 1
 * Strictly uses compounding effective monthly rate (NOT r / 12)
 */
export function calculateMonthlySIPRate(annualRatePercent: number): number {
  const r = Math.max(0, (annualRatePercent || 0) / 100);
  if (r === 0) return 0;
  return Math.pow(1 + r, 1 / 12) - 1;
}

/**
 * 3. Calculate Outstanding Loan Principal at a Specific Month
 * Simulates amortization up to targetMonth.
 */
export function calculateOutstandingPrincipal(
  loanAmount: number,
  loanTenureYears: number,
  loanInterestRate: number,
  targetMonth: number
): number {
  const p = Math.max(0, loanAmount || 0);
  const totalMonths = Math.max(1, Math.round((loanTenureYears || 0) * 12));
  const mTarget = Math.min(totalMonths, Math.max(0, Math.round(targetMonth || 0)));

  if (p === 0 || mTarget === 0) return p;

  const emi = calculateEMI(p, loanTenureYears, loanInterestRate);
  const monthlyRate = Math.max(0, loanInterestRate || 0) / (12 * 100);

  let currentPrincipal = p;

  for (let m = 1; m <= mTarget; m++) {
    const interest = currentPrincipal * monthlyRate;
    const principalPaid = Math.min(currentPrincipal, Math.max(0, emi - interest));
    currentPrincipal = Math.max(0, currentPrincipal - principalPaid);
    if (currentPrincipal <= 0) break;
  }

  return currentPrincipal;
}

/**
 * 4. Calculate Required Monthly SIP for a Target Future Corpus in N Months
 * Uses beginning-of-period Annuity Due formula with effective monthly rate i:
 * FV = SIP * [((1+i)^n - 1) / i] * (1 + i)
 * RequiredSIP = TargetCorpus / [ ( ((1+i)^n - 1) / i ) * (1 + i) ]
 * When i = 0: RequiredSIP = TargetCorpus / n
 */
export function calculateRequiredSIP(
  targetCorpus: number,
  targetMonths: number,
  annualSIPReturnPercent: number
): number {
  const target = Math.max(0, targetCorpus || 0);
  const n = Math.max(1, Math.round(targetMonths || 0));
  const annualReturn = Math.max(0, annualSIPReturnPercent || 0);

  if (target === 0) return 0;
  if (annualReturn === 0) return target / n;

  const i = calculateMonthlySIPRate(annualReturn);
  const compoundFactor = Math.pow(1 + i, n);
  const annuityDueFactor = ((compoundFactor - 1) / i) * (1 + i);

  if (annuityDueFactor <= 0 || !isFinite(annuityDueFactor)) {
    return target / n;
  }

  return target / annuityDueFactor;
}

/**
 * 5. Calculate SIP Corpus Accumulated in N Months with a Fixed Monthly SIP
 * Beginning-of-period Annuity Due:
 * FV = MonthlySIP * [((1+i)^n - 1) / i] * (1 + i)
 */
export function calculateSIPCorpus(
  monthlySIP: number,
  months: number,
  annualSIPReturnPercent: number
): number {
  const sip = Math.max(0, monthlySIP || 0);
  const n = Math.max(0, Math.round(months || 0));
  const annualReturn = Math.max(0, annualSIPReturnPercent || 0);

  if (sip === 0 || n === 0) return 0;
  if (annualReturn === 0) return sip * n;

  const i = calculateMonthlySIPRate(annualReturn);
  const compoundFactor = Math.pow(1 + i, n);
  const annuityDueFactor = ((compoundFactor - 1) / i) * (1 + i);

  return sip * annuityDueFactor;
}

/**
 * Helper to compute date string for month m given a start date
 */
function getMonthDateString(startDateInput: Date | string | undefined, monthIndex: number): string {
  try {
    let baseDate: Date;
    if (startDateInput instanceof Date && !isNaN(startDateInput.getTime())) {
      baseDate = new Date(startDateInput);
    } else if (typeof startDateInput === 'string' && startDateInput.trim() !== '') {
      baseDate = new Date(startDateInput);
      if (isNaN(baseDate.getTime())) {
        baseDate = new Date();
      }
    } else {
      baseDate = new Date();
    }

    const d = new Date(baseDate.getFullYear(), baseDate.getMonth() + monthIndex, 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}-01`;
  } catch {
    return `Month ${monthIndex + 1}`;
  }
}

/**
 * 6. Calculate Full Month-by-Month Loan and SIP Projections
 */
export function calculateLoanProjection(
  inputs: HomeLoanForeclosureInputs,
  effectiveMonthlySIP: number
): LoanMonthProjection[] {
  const loanAmount = Math.max(0, inputs.loanAmount || 0);
  const tenureYears = Math.max(1, inputs.loanTenureYears || 1);
  const totalMonths = tenureYears * 12;
  const loanRate = Math.max(0, inputs.loanInterestRate || 0);
  const sipReturn = Math.max(0, inputs.sipReturnRate || 0);

  const emi = calculateEMI(loanAmount, tenureYears, loanRate);
  const monthlyLoanRate = loanRate / (12 * 100);
  const iSIP = calculateMonthlySIPRate(sipReturn);

  const projections: LoanMonthProjection[] = [];
  let currentPrincipal = loanAmount;
  let currentSIPCorpus = 0;

  for (let m = 1; m <= totalMonths; m++) {
    const yearNumber = Math.floor((m - 1) / 12) + 1;
    const dateStr = getMonthDateString(inputs.currentLoanStartDate, m - 1);

    // Loan Amortization for Month m
    const openingPrincipal = currentPrincipal;
    let interestComponent = 0;
    let principalComponent = 0;
    let closingPrincipal = 0;

    if (openingPrincipal > 0) {
      interestComponent = openingPrincipal * monthlyLoanRate;
      const scheduledPrincipal = emi - interestComponent;
      principalComponent = Math.min(openingPrincipal, Math.max(0, scheduledPrincipal));
      closingPrincipal = Math.max(0, openingPrincipal - principalComponent);
    }

    // SIP Accumulation for Month m (Beginning of period contribution)
    const openingSIPCorpus = currentSIPCorpus;
    let sipGrowth = 0;
    let closingSIPCorpus = 0;

    if (effectiveMonthlySIP > 0 || openingSIPCorpus > 0) {
      const investBase = openingSIPCorpus + effectiveMonthlySIP;
      sipGrowth = investBase * iSIP;
      closingSIPCorpus = investBase + sipGrowth;
    }    const gap = closingPrincipal - closingSIPCorpus;
    const foreclosureReady = closingSIPCorpus >= closingPrincipal && closingPrincipal >= 100 && m < totalMonths;

    projections.push({
      monthNumber: m,
      yearNumber,
      date: dateStr,
      openingPrincipal,
      emi: openingPrincipal > 0 ? emi : 0,
      interestComponent,
      principalComponent,
      prepayment: 0,
      closingPrincipal,
      monthlySIP: effectiveMonthlySIP,
      openingSIPCorpus,
      SIPGrowth: sipGrowth,
      closingSIPCorpus,
      gap,
      foreclosureReady
    });

    currentPrincipal = closingPrincipal;
    currentSIPCorpus = closingSIPCorpus;
  }

  return projections;
}

/**
 * 7. Calculate Yearly Summary from Monthly Projections
 */
export function calculateYearlySummary(
  projections: LoanMonthProjection[]
): LoanYearSummary[] {
  if (!projections || projections.length === 0) return [];

  const yearlyMap = new Map<number, LoanMonthProjection[]>();

  projections.forEach((p) => {
    const list = yearlyMap.get(p.yearNumber) || [];
    list.push(p);
    yearlyMap.set(p.yearNumber, list);
  });

  const summaries: LoanYearSummary[] = [];

  Array.from(yearlyMap.entries()).forEach(([yearNum, monthsInYear]) => {
    if (monthsInYear.length === 0) return;

    const firstMonth = monthsInYear[0];
    const lastMonth = monthsInYear[monthsInYear.length - 1];

    const openingLoanPrincipal = firstMonth.openingPrincipal;
    const closingLoanPrincipal = lastMonth.closingPrincipal;

    const totalEMIPaid = monthsInYear.reduce((sum, m) => sum + m.emi, 0);
    const totalInterestPaid = monthsInYear.reduce((sum, m) => sum + m.interestComponent, 0);
    const totalPrincipalPaid = monthsInYear.reduce((sum, m) => sum + m.principalComponent, 0);
    const totalSIPInvested = monthsInYear.reduce((sum, m) => sum + m.monthlySIP, 0);
    const closingSIPCorpus = lastMonth.closingSIPCorpus;
    const gap = closingLoanPrincipal - closingSIPCorpus;
    const foreclosureReady = closingSIPCorpus >= closingLoanPrincipal && closingLoanPrincipal >= 100;

    const calendarYear = parseInt(firstMonth.date.substring(0, 4), 10) || (new Date().getFullYear() + yearNum - 1);

    summaries.push({
      yearNumber: yearNum,
      calendarYear,
      openingLoanPrincipal,
      totalEMIPaid,
      totalInterestPaid,
      totalPrincipalPaid,
      closingLoanPrincipal,
      totalSIPInvested,
      closingSIPCorpus,
      gap,
      foreclosureReady
    });
  });

  return summaries;
}

/**
 * 8. Master Orchestrator: Calculate Home Loan Foreclosure Plan
 */
export function calculateHomeLoanForeclosurePlan(
  inputs: HomeLoanForeclosureInputs
): HomeLoanForeclosureResult {
  const loanAmount = Math.max(0, inputs.loanAmount || 0);
  const loanTenureYears = Math.max(1, inputs.loanTenureYears || 1);
  const loanInterestRate = Math.max(0, inputs.loanInterestRate || 0);
  const sipReturnRate = Math.max(0, inputs.sipReturnRate || 0);
  const strategy = inputs.strategy || 'targetYear';

  const totalLoanMonths = loanTenureYears * 12;
  const emi = calculateEMI(loanAmount, loanTenureYears, loanInterestRate);
  const totalScheduledRepayment = emi * totalLoanMonths;
  const totalScheduledInterest = Math.max(0, totalScheduledRepayment - loanAmount);

  let targetClosureYears: number | undefined = undefined;
  let targetClosureMonths: number | undefined = undefined;
  let requiredMonthlySIP: number | undefined = undefined;
  let availableMonthlySIP: number | undefined = undefined;

  let effectiveMonthlySIP = 0;
  let foreclosureMonth: number | null = null;
  let foreclosureYears: number | null = null;
  let foreclosureDate: string | undefined = undefined;

  let outstandingPrincipalAtTarget = 0;
  let SIPCorpusAtTarget = 0;
  let surplusAtTarget = 0;
  let totalSIPInvestment = 0;
  let SIPWealthCreated = 0;
  let isForeclosureAchievedWithinTenure = false;

  if (strategy === 'targetYear') {
    // Option 1: User specifies target closure year
    targetClosureYears = Math.min(loanTenureYears, Math.max(1, inputs.targetClosureYears || 10));
    targetClosureMonths = targetClosureYears * 12;

    // Calculate outstanding loan principal after targetClosureMonths
    outstandingPrincipalAtTarget = calculateOutstandingPrincipal(
      loanAmount,
      loanTenureYears,
      loanInterestRate,
      targetClosureMonths
    );

    // Calculate required monthly SIP to reach outstandingPrincipalAtTarget in targetClosureMonths
    requiredMonthlySIP = calculateRequiredSIP(
      outstandingPrincipalAtTarget,
      targetClosureMonths,
      sipReturnRate
    );

    effectiveMonthlySIP = requiredMonthlySIP;
    foreclosureMonth = targetClosureMonths;
    foreclosureYears = targetClosureYears;
    isForeclosureAchievedWithinTenure = true;

    // Calculate SIP corpus at target
    SIPCorpusAtTarget = calculateSIPCorpus(
      effectiveMonthlySIP,
      targetClosureMonths,
      sipReturnRate
    );
    surplusAtTarget = SIPCorpusAtTarget - outstandingPrincipalAtTarget;

    totalSIPInvestment = effectiveMonthlySIP * targetClosureMonths;
    SIPWealthCreated = Math.max(0, SIPCorpusAtTarget - totalSIPInvestment);
  } else {
    // Option 2: User specifies affordable fixed monthly SIP
    availableMonthlySIP = Math.max(0, inputs.monthlySIP || 0);
    effectiveMonthlySIP = availableMonthlySIP;
  }

  // Generate full month-by-month projection
  const projection = calculateLoanProjection(inputs, effectiveMonthlySIP);
  const yearlySummary = calculateYearlySummary(projection);

  if (strategy === 'fixedSIP') {
    // Locate the first month where closingSIPCorpus >= closingPrincipal before natural loan payoff
    const crossoverMonthObj = projection.find(
      (p) => p.closingSIPCorpus >= p.closingPrincipal && p.closingPrincipal >= 100 && p.monthNumber < totalLoanMonths
    );

    if (crossoverMonthObj && availableMonthlySIP! > 0) {
      foreclosureMonth = crossoverMonthObj.monthNumber;
      foreclosureYears = Math.round((crossoverMonthObj.monthNumber / 12) * 100) / 100;
      foreclosureDate = crossoverMonthObj.date;
      outstandingPrincipalAtTarget = crossoverMonthObj.closingPrincipal;
      SIPCorpusAtTarget = crossoverMonthObj.closingSIPCorpus;
      surplusAtTarget = SIPCorpusAtTarget - outstandingPrincipalAtTarget;
      totalSIPInvestment = effectiveMonthlySIP * crossoverMonthObj.monthNumber;
      SIPWealthCreated = Math.max(0, SIPCorpusAtTarget - totalSIPInvestment);
      isForeclosureAchievedWithinTenure = true;
    } else {
      // No crossover prior to tenure completion
      foreclosureMonth = null;
      foreclosureYears = null;
      foreclosureDate = undefined;
      isForeclosureAchievedWithinTenure = false;

      const lastMonth = projection[projection.length - 1];
      outstandingPrincipalAtTarget = lastMonth ? lastMonth.closingPrincipal : 0;
      SIPCorpusAtTarget = lastMonth ? lastMonth.closingSIPCorpus : 0;
      surplusAtTarget = SIPCorpusAtTarget - outstandingPrincipalAtTarget;
      totalSIPInvestment = effectiveMonthlySIP * totalLoanMonths;
      SIPWealthCreated = Math.max(0, SIPCorpusAtTarget - totalSIPInvestment);
    }
  } else if (strategy === 'targetYear' && targetClosureMonths) {
    const targetMonthObj = projection[targetClosureMonths - 1];
    if (targetMonthObj) {
      foreclosureDate = targetMonthObj.date;
    }
  }

  // Generate Factual Dynamic Insight
  let keyInsight = '';
  if (loanAmount === 0) {
    keyInsight = 'Enter your home loan details to project your parallel SIP investment roadmap.';
  } else if (strategy === 'targetYear' && targetClosureYears && requiredMonthlySIP !== undefined) {
    const formattedSIP = formatIndianCurrency(Math.round(requiredMonthlySIP));
    const formattedCorpus = formatLakhsCrores(SIPCorpusAtTarget);
    const formattedPrincipal = formatLakhsCrores(outstandingPrincipalAtTarget);
    keyInsight = `By investing ${formattedSIP}/month in a parallel SIP alongside your EMI, your projected corpus could reach ${formattedCorpus} in ${targetClosureYears} years—matching your remaining loan principal of ${formattedPrincipal} for a potential early closure.`;
  } else if (strategy === 'fixedSIP' && availableMonthlySIP !== undefined) {
    if (isForeclosureAchievedWithinTenure && foreclosureMonth) {
      const formattedDuration = formatYearsAndMonths(foreclosureMonth);
      const formattedSIP = formatIndianCurrency(Math.round(availableMonthlySIP));
      const formattedCorpus = formatLakhsCrores(SIPCorpusAtTarget);
      const formattedPrincipal = formatLakhsCrores(outstandingPrincipalAtTarget);
      keyInsight = `With a parallel SIP of ${formattedSIP}/month alongside your EMI, your projected SIP corpus of ${formattedCorpus} is estimated to match the remaining loan principal of ${formattedPrincipal} in approximately ${formattedDuration} (Month ${foreclosureMonth}), potentially enabling an earlier payoff than your ${loanTenureYears}-year tenure.`;
    } else {
      const formattedSIP = formatIndianCurrency(Math.round(availableMonthlySIP));
      keyInsight = `A parallel SIP of ${formattedSIP}/month is not projected to fully match the outstanding loan balance within the ${loanTenureYears}-year tenure. Increasing your monthly SIP or extending your investment horizon could help accelerate loan coverage.`;
    }
  }

  return {
    loanAmount,
    loanTenureYears,
    loanInterestRate,
    sipReturnRate,
    strategy,
    emi,
    totalScheduledRepayment,
    totalScheduledInterest,
    targetClosureYears,
    targetClosureMonths,
    requiredMonthlySIP,
    availableMonthlySIP,
    foreclosureMonth,
    foreclosureYears,
    foreclosureDate,
    outstandingPrincipalAtTarget,
    SIPCorpusAtTarget,
    surplusAtTarget,
    totalSIPInvestment,
    SIPWealthCreated,
    isForeclosureAchievedWithinTenure,
    projection,
    yearlySummary,
    keyInsight
  };
}

/**
 * Format Indian Currency (e.g. ₹41,822 or ₹50,00,000)
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
 * Format Lakhs & Crores (e.g. ₹50.00 Lakh or ₹1.25 Cr)
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
 * Format Percentage (e.g. 8.00% or 12.00%)
 */
export function formatPercentage(rate: number, decimals: number = 2): string {
  if (isNaN(rate) || rate === null || rate === undefined) return '0%';
  return `${rate.toFixed(decimals)}%`;
}

/**
 * Format Duration in Years and Months (e.g. "11 Years 9 Months" or "10 Years")
 */
export function formatYearsAndMonths(totalMonths: number): string {
  if (!totalMonths || totalMonths <= 0) return '0 Months';
  const yrs = Math.floor(totalMonths / 12);
  const mos = Math.round(totalMonths % 12);

  if (yrs === 0) return `${mos} Month${mos !== 1 ? 's' : ''}`;
  if (mos === 0) return `${yrs} Year${yrs !== 1 ? 's' : ''}`;
  return `${yrs} Year${yrs !== 1 ? 's' : ''} ${mos} Month${mos !== 1 ? 's' : ''}`;
}
