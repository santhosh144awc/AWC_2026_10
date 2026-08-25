/**
 * Ant Wealth Creation — SWP Calculator Calculation Engine
 * 
 * Implements the authoritative monthly sequential SWP simulation:
 * - Effective monthly compounding: i = (1 + r)^(1/12) - 1
 * - Annual step-up applied at months 1, 13, 25, 37, 49, ...
 * - Beginning-of-month withdrawal timing with safety capping at available corpus
 * - Dynamic multi-lump-sum withdrawals with safety capping
 * - Pre-return corpus calculation: preReturn = beginningCorpus - actualSWP - actualLump
 * - Closing corpus: max(0, preReturn * (1 + i))
 * - Depletion detection over a 600-month (50-year) horizon
 */

export interface SWPLumpSumWithdrawal {
  id: string;
  monthNumber: number;
  amount: number;
  label?: string;
}

export interface SWPInputs {
  currentAge: number;
  startDate?: string; // YYYY-MM-DD
  annualReturnRate: number; // % p.a., e.g. 8 or 9
  stepUpRate: number; // % p.a., e.g. 6
  initialCorpus: number; // e.g. 10000000
  monthlySWP: number; // e.g. 50000
  lumpSums?: SWPLumpSumWithdrawal[];
}

export interface SWPMonthlyProjection {
  monthNumber: number;
  date: string;
  year: number;
  beginningCorpus: number;
  plannedSWP: number;
  actualSWP: number;
  lumpSumWithdrawal: number;
  annualReturnRate: number;
  monthlyReturnRate: number;
  closingCorpus: number;
  age: number;
}

export interface SWPYearlySummary {
  yearNumber: number;
  calendarYear: number;
  startingCorpus: number;
  totalSWP: number;
  totalLumpSumWithdrawal: number;
  totalWithdrawals: number;
  endingCorpus: number;
  monthlySWPAtYearStart: number;
  monthlySWPAtYearEnd: number;
  returnRate: number;
  age: number;
}

export interface SWPResult {
  initialCorpus: number;
  monthlySWP: number;
  stepUpRate: number;
  annualReturnRate: number;
  totalWithdrawal: number; // pure monthly SWPs
  totalLumpSumWithdrawal: number; // pure lump sums
  totalWithdrawals: number; // total withdrawals combined
  swpDurationMonths: number;
  swpDurationYears: number;
  finalCorpus: number;
  corpusDepleted: boolean;
  depletionDate?: string;
  totalMonthsSimulated: number;
  projection: SWPMonthlyProjection[];
  yearlySummary: SWPYearlySummary[];
  keyInsight: string;
}

/**
 * 1. Calculate Effective Monthly Rate
 * i = (1 + r)^(1/12) - 1
 */
export function calculateMonthlyReturn(annualRatePercent: number): number {
  const r = Math.max(0, (annualRatePercent || 0) / 100);
  if (r === 0) return 0;
  return Math.pow(1 + r, 1 / 12) - 1;
}

/**
 * 2. Calculate Planned Monthly SWP for a Given Month
 * Step-up applies at months 1, 13, 25, 37, 49...
 * stepYear = floor((m - 1) / 12)
 * plannedSWP = P0 * (1 + g)^stepYear
 */
export function calculateSWPForMonth(
  monthNumber: number,
  initialSWP: number,
  stepUpRatePercent: number
): number {
  if (monthNumber <= 0 || initialSWP <= 0) return 0;
  if (monthNumber === 1) return initialSWP;

  const g = Math.max(0, (stepUpRatePercent || 0) / 100);
  const stepYear = Math.floor((monthNumber - 1) / 12);
  return initialSWP * Math.pow(1 + g, stepYear);
}

/**
 * 3. Calculate Actual Monthly SWP (capped at beginning corpus)
 */
export function calculateActualSWP(
  plannedSWP: number,
  beginningCorpus: number
): number {
  if (beginningCorpus <= 0 || plannedSWP <= 0) return 0;
  return Math.min(plannedSWP, beginningCorpus);
}

/**
 * 4. Calculate Actual Lump-Sum Withdrawal (capped at remaining corpus after SWP)
 */
export function calculateActualLumpSumWithdrawal(
  scheduledLump: number,
  availableCorpusAfterSWP: number
): number {
  if (availableCorpusAfterSWP <= 0 || scheduledLump <= 0) return 0;
  return Math.min(scheduledLump, availableCorpusAfterSWP);
}

/**
 * 5. Calculate Ending Corpus
 * preReturnCorpus = beginningCorpus - actualSWP - actualLump
 * closingCorpus = max(0, preReturnCorpus * (1 + monthlyReturnRate))
 */
export function calculateEndingCorpus(
  preReturnCorpus: number,
  monthlyReturnRate: number
): number {
  if (preReturnCorpus <= 0) return 0;
  return Math.max(0, preReturnCorpus * (1 + monthlyReturnRate));
}

/**
 * Helper to compute date string for month m given a start date
 */
function getMonthDate(startDateStr: string, monthIndex: number): string {
  try {
    const baseDate = new Date(startDateStr || '2025-01-01');
    if (isNaN(baseDate.getTime())) {
      const fallback = new Date();
      fallback.setMonth(fallback.getMonth() + monthIndex);
      return fallback.toISOString().split('T')[0];
    }
    const d = new Date(baseDate);
    d.setMonth(d.getMonth() + monthIndex);
    return d.toISOString().split('T')[0];
  } catch {
    return `Month ${monthIndex + 1}`;
  }
}

/**
 * 6. Calculate Yearly Summary from Monthly Projections
 */
export function calculateYearlySummary(
  monthlyProjections: SWPMonthlyProjection[]
): SWPYearlySummary[] {
  if (!monthlyProjections || monthlyProjections.length === 0) return [];

  const yearlyMap = new Map<number, SWPMonthlyProjection[]>();

  monthlyProjections.forEach((p) => {
    const list = yearlyMap.get(p.year) || [];
    list.push(p);
    yearlyMap.set(p.year, list);
  });

  const yearlySummaries: SWPYearlySummary[] = [];

  Array.from(yearlyMap.entries()).forEach(([yearNum, monthsInYear]) => {
    if (monthsInYear.length === 0) return;

    const firstMonth = monthsInYear[0];
    const lastMonth = monthsInYear[monthsInYear.length - 1];

    const startingCorpus = firstMonth.beginningCorpus;
    const endingCorpus = lastMonth.closingCorpus;

    const totalSWP = monthsInYear.reduce((s, m) => s + m.actualSWP, 0);
    const totalLump = monthsInYear.reduce((s, m) => s + m.lumpSumWithdrawal, 0);
    const totalWithdrawals = totalSWP + totalLump;

    const calendarYear = parseInt(firstMonth.date.substring(0, 4), 10) || (2025 + yearNum - 1);

    yearlySummaries.push({
      yearNumber: yearNum,
      calendarYear,
      startingCorpus,
      totalSWP,
      totalLumpSumWithdrawal: totalLump,
      totalWithdrawals,
      endingCorpus,
      monthlySWPAtYearStart: firstMonth.actualSWP || firstMonth.plannedSWP,
      monthlySWPAtYearEnd: lastMonth.actualSWP || lastMonth.plannedSWP,
      returnRate: firstMonth.annualReturnRate,
      age: firstMonth.age
    });
  });

  return yearlySummaries;
}

/**
 * 7. Master SWP Calculator Orchestrator
 */
export function calculateSWPPlan(inputs: SWPInputs): SWPResult {
  const initialCorpus = Math.max(0, inputs.initialCorpus || 0);
  const monthlySWP = Math.max(0, inputs.monthlySWP || 0);
  const stepUpRate = Math.max(0, inputs.stepUpRate || 0);
  const annualReturn = Math.max(0, inputs.annualReturnRate || 0);
  const currentAge = Math.max(0, inputs.currentAge || 60);
  const startDate = inputs.startDate || new Date().toISOString().split('T')[0];
  const lumpSums = inputs.lumpSums || [];

  const monthlyReturnRate = calculateMonthlyReturn(annualReturn);
  const projection: SWPMonthlyProjection[] = [];

  let currentCorpus = initialCorpus;
  let totalWithdrawal = 0;
  let totalLumpSumWithdrawal = 0;
  let depletionMonth: number | null = null;
  let depletionDate: string | undefined = undefined;

  const MAX_MONTHS = 600; // 50 years

  for (let m = 1; m <= MAX_MONTHS; m++) {
    const beginningCorpus = currentCorpus;
    const yearNumber = Math.floor((m - 1) / 12) + 1;
    const dateStr = getMonthDate(startDate, m - 1);
    const age = currentAge + Math.floor((m - 1) / 12);

    const plannedSWP = calculateSWPForMonth(m, monthlySWP, stepUpRate);

    if (beginningCorpus <= 0) {
      if (depletionMonth === null) {
        depletionMonth = m - 1;
        depletionDate = getMonthDate(startDate, m - 2);
      }
      projection.push({
        monthNumber: m,
        date: dateStr,
        year: yearNumber,
        beginningCorpus: 0,
        plannedSWP,
        actualSWP: 0,
        lumpSumWithdrawal: 0,
        annualReturnRate: annualReturn,
        monthlyReturnRate,
        closingCorpus: 0,
        age
      });
      continue;
    }

    const actualSWP = calculateActualSWP(plannedSWP, beginningCorpus);
    const availableAfterSWP = Math.max(0, beginningCorpus - actualSWP);

    // Sum all scheduled lump sums for this month
    const scheduledLump = lumpSums
      .filter((item) => item.monthNumber === m && item.amount > 0)
      .reduce((sum, item) => sum + item.amount, 0);

    const actualLump = calculateActualLumpSumWithdrawal(scheduledLump, availableAfterSWP);

    totalWithdrawal += actualSWP;
    totalLumpSumWithdrawal += actualLump;

    const preReturnCorpus = beginningCorpus - actualSWP - actualLump;
    const closingCorpus = calculateEndingCorpus(preReturnCorpus, monthlyReturnRate);

    projection.push({
      monthNumber: m,
      date: dateStr,
      year: yearNumber,
      beginningCorpus,
      plannedSWP,
      actualSWP,
      lumpSumWithdrawal: actualLump,
      annualReturnRate: annualReturn,
      monthlyReturnRate,
      closingCorpus,
      age
    });

    currentCorpus = closingCorpus;

    if (closingCorpus <= 0 && depletionMonth === null) {
      depletionMonth = m;
      depletionDate = dateStr;
    }
  }

  const corpusDepleted = depletionMonth !== null;
  const swpDurationMonths = corpusDepleted ? depletionMonth! : MAX_MONTHS;
  const swpDurationYears = Math.round((swpDurationMonths / 12) * 100) / 100;
  const totalWithdrawals = totalWithdrawal + totalLumpSumWithdrawal;
  const finalCorpus = currentCorpus;

  // Trim or slice projection for yearly summary to avoid excessive empty tail months
  const activeProjections = corpusDepleted
    ? projection.slice(0, Math.min(MAX_MONTHS, swpDurationMonths + (12 - (swpDurationMonths % 12 || 12))))
    : projection;

  const yearlySummary = calculateYearlySummary(activeProjections);

  // Generate factual insight
  let keyInsight = '';
  if (initialCorpus === 0 || monthlySWP === 0) {
    keyInsight = 'Enter your retirement corpus and initial monthly SWP to model your withdrawal sustainability.';
  } else if (!corpusDepleted) {
    keyInsight = `Your retirement corpus of ${formatLakhsCrores(initialCorpus)} comfortably sustains withdrawals throughout the simulated 50-year period, with an estimated ${formatLakhsCrores(finalCorpus)} remaining.`;
  } else {
    const formattedDuration = formatYearsAndMonths(swpDurationMonths);
    const times = initialCorpus > 0 ? (totalWithdrawals / initialCorpus).toFixed(1) : '0';
    keyInsight = `Your corpus of ${formatLakhsCrores(initialCorpus)} could sustain your planned monthly withdrawals for approximately ${formattedDuration}, providing a total of ${formatLakhsCrores(totalWithdrawals)} in cumulative retirement income (${times}x your initial corpus).`;
  }

  return {
    initialCorpus,
    monthlySWP,
    stepUpRate,
    annualReturnRate: annualReturn,
    totalWithdrawal,
    totalLumpSumWithdrawal,
    totalWithdrawals,
    swpDurationMonths,
    swpDurationYears,
    finalCorpus,
    corpusDepleted,
    depletionDate,
    totalMonthsSimulated: MAX_MONTHS,
    projection,
    yearlySummary,
    keyInsight
  };
}

/**
 * Format Indian Currency (e.g. ₹2,64,72,468)
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
 * Format Lakhs & Crores (e.g. ₹2.65 Cr or ₹31.80 Lakh)
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
 * Format Percentage (e.g. 8% or 6.00%)
 */
export function formatPercentage(rate: number, decimals: number = 2): string {
  if (isNaN(rate) || rate === null || rate === undefined) return '0%';
  return `${rate.toFixed(decimals)}%`;
}

/**
 * Format Duration in Years and Months (e.g. "13 Years 3 Months" or "22.0 Years")
 */
export function formatYearsAndMonths(totalMonths: number): string {
  if (!totalMonths || totalMonths <= 0) return '0 Months';
  const yrs = Math.floor(totalMonths / 12);
  const mos = totalMonths % 12;

  if (yrs === 0) return `${mos} Month${mos !== 1 ? 's' : ''}`;
  if (mos === 0) return `${yrs} Year${yrs !== 1 ? 's' : ''}`;
  return `${yrs} Year${yrs !== 1 ? 's' : ''} ${mos} Month${mos !== 1 ? 's' : ''}`;
}
