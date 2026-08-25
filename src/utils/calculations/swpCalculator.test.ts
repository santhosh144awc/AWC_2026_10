/**
 * Unit Test Suite for SWP Calculator Calculation Engine
 * 
 * Verifies all 35+ test categories covering:
 * - Effective monthly compounding rate
 * - Annual step-up timing (months 13, 25, 37, 49, ...)
 * - Beginning-of-month withdrawal timing & safety capping
 * - Dynamic multi-lump-sum withdrawals
 * - Depletion detection over 600 months & 50-year survival
 * - Deterministic regression scenarios (Scenario A: 13.25 yrs / ₹31.80L, Scenario B: 22.00 yrs / ₹2.65 Cr)
 * - Yearly summaries and formatting
 */

import {
  calculateMonthlyReturn,
  calculateSWPForMonth,
  calculateActualSWP,
  calculateActualLumpSumWithdrawal,
  calculateEndingCorpus,
  calculateYearlySummary,
  calculateSWPPlan,
  formatIndianCurrency,
  formatLakhsCrores,
  formatPercentage,
  formatYearsAndMonths,
  type SWPInputs,
  type SWPMonthlyProjection
} from './swpCalculator';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`✅ PASS: ${message}`);
}

function assertClose(actual: number, expected: number, tolerance: number = 0.5, message: string) {
  const diff = Math.abs(actual - expected);
  if (diff > tolerance) {
    console.error(`❌ FAIL: ${message} — Expected ~${expected}, got ${actual} (diff: ${diff})`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`✅ PASS: ${message} (Actual: ${actual.toFixed(2)}, Expected: ${expected.toFixed(2)})`);
}

console.log('========================================');
console.log('RUNNING SWP CALCULATOR TESTS');
console.log('========================================');

// --- 1. Effective Monthly Return Rate ---
console.log('\n--- 1. Effective Monthly Return Rate ---');
const i8 = calculateMonthlyReturn(8);
assertClose(i8, 0.00643403, 0.00001, 'Effective monthly rate for 8% annual return');
const i9 = calculateMonthlyReturn(9);
assertClose(i9, 0.00720732, 0.00001, 'Effective monthly rate for 9% annual return');
assert(calculateMonthlyReturn(0) === 0, 'Effective monthly rate for 0% annual return is 0');

// --- 2. Monthly SWP Step-Up Timing ---
console.log('\n--- 2. Monthly SWP Step-Up Timing ---');
// Starting ₹50,000, 6% annual step-up
assert(calculateSWPForMonth(1, 50000, 6) === 50000, 'Month 1 SWP = ₹50,000');
assert(calculateSWPForMonth(12, 50000, 6) === 50000, 'Month 12 SWP remains ₹50,000 (Year 1)');
assertClose(calculateSWPForMonth(13, 50000, 6), 53000, 0.01, 'Month 13 SWP = ₹53,000 (Year 2 start, +6%)');
assertClose(calculateSWPForMonth(24, 50000, 6), 53000, 0.01, 'Month 24 SWP remains ₹53,000 (Year 2)');
assertClose(calculateSWPForMonth(25, 50000, 6), 56180, 0.01, 'Month 25 SWP = ₹56,180 (Year 3 start, +6%)');
assertClose(calculateSWPForMonth(37, 50000, 6), 59550.80, 0.01, 'Month 37 SWP = ₹59,550.80 (Year 4 start, +6%)');
assertClose(calculateSWPForMonth(49, 50000, 6), 63123.85, 0.01, 'Month 49 SWP = ₹63,123.85 (Year 5 start, +6%)');
assert(calculateSWPForMonth(13, 50000, 0) === 50000, '0% step-up maintains flat ₹50,000 across Year 2');

// --- 3. Withdrawal Capping & Safety ---
console.log('\n--- 3. Withdrawal Capping & Safety ---');
assert(calculateActualSWP(50000, 1000000) === 50000, 'Actual SWP = ₹50,000 when corpus is sufficient');
assert(calculateActualSWP(50000, 30000) === 30000, 'Actual SWP capped at ₹30,000 when beginning corpus is ₹30,000');
assert(calculateActualSWP(50000, 0) === 0, 'Actual SWP = 0 when beginning corpus is 0');
assert(calculateActualLumpSumWithdrawal(100000, 500000) === 100000, 'Actual Lump Sum = ₹1,00,000 when available');
assert(calculateActualLumpSumWithdrawal(100000, 40000) === 40000, 'Actual Lump Sum capped at ₹40,000');
assert(calculateActualLumpSumWithdrawal(100000, 0) === 0, 'Actual Lump Sum = 0 when remaining corpus is 0');

// --- 4. Ending Corpus & Return Timing ---
console.log('\n--- 4. Ending Corpus & Return Timing ---');
// Pre-return 100,000 with 8% annual return (monthly rate ~0.00643403)
const end1 = calculateEndingCorpus(100000, i8);
assertClose(end1, 100643.40, 0.05, 'Ending corpus with positive pre-return corpus');
assert(calculateEndingCorpus(0, i8) === 0, 'Ending corpus = 0 when pre-return is 0');
assert(calculateEndingCorpus(-5000, i8) === 0, 'Ending corpus = 0 when pre-return is negative');

// --- 5. Deterministic Regression Scenario A (Candidates Sheet Benchmark) ---
console.log('\n--- 5. Regression Scenario A (Candidates Benchmark) ---');
const candInput: SWPInputs = {
  currentAge: 59,
  startDate: '2026-01-02',
  annualReturnRate: 8,
  stepUpRate: 0,
  initialCorpus: 2000000,
  monthlySWP: 20000,
  lumpSums: []
};
const candRes = calculateSWPPlan(candInput);
assert(candRes.corpusDepleted === true, 'Scenario A: Corpus is depleted');
assert(candRes.swpDurationMonths === 159, `Scenario A: Depletion at exactly 159 months (got ${candRes.swpDurationMonths})`);
assert(candRes.swpDurationYears === 13.25, `Scenario A: Duration = 13.25 years (got ${candRes.swpDurationYears})`);
assertClose(candRes.totalWithdrawals, 3179834.07, 0.5, 'Scenario A: Total withdrawals ≈ ₹31.80 Lakh');
assert(candRes.finalCorpus === 0, 'Scenario A: Final corpus = ₹0');
assert(candRes.yearlySummary.length === 14, 'Scenario A: 14 yearly summary rows generated');

// --- 6. Deterministic Regression Scenario B (Trainers Sheet Benchmark) ---
console.log('\n--- 6. Regression Scenario B (Trainers Benchmark) ---');
const trainLumps = [
  { id: '1', monthNumber: 12, amount: 100000 },
  { id: '2', monthNumber: 24, amount: 100000 },
  { id: '3', monthNumber: 36, amount: 100000 },
  { id: '4', monthNumber: 48, amount: 100000 },
  { id: '5', monthNumber: 60, amount: 100000 }
];
const trainInput: SWPInputs = {
  currentAge: 60,
  startDate: '2025-01-01',
  annualReturnRate: 9,
  stepUpRate: 6,
  initialCorpus: 10000000,
  monthlySWP: 50000,
  lumpSums: trainLumps
};
const trainRes = calculateSWPPlan(trainInput);
assert(trainRes.corpusDepleted === true, 'Scenario B: Corpus is depleted');
assert(trainRes.swpDurationMonths === 264, `Scenario B: Depletion at exactly 264 months (got ${trainRes.swpDurationMonths})`);
assert(trainRes.swpDurationYears === 22.00, `Scenario B: Duration = 22.00 years (got ${trainRes.swpDurationYears})`);
assert(trainRes.totalLumpSumWithdrawal === 500000, 'Scenario B: Total lump sum withdrawals = ₹5,00,000');
assertClose(trainRes.totalWithdrawal, 25972467.66, 0.5, 'Scenario B: Total monthly SWPs ≈ ₹2.597 Cr');
assertClose(trainRes.totalWithdrawals, 26472467.66, 0.5, 'Scenario B: Total combined withdrawals ≈ ₹2.647 Cr');
assert(trainRes.finalCorpus === 0, 'Scenario B: Final corpus = ₹0');
assert(trainRes.yearlySummary.length === 22, 'Scenario B: 22 yearly summary rows generated');

// --- 7. Long-Term Survival (50-Year Simulation Horizon) ---
console.log('\n--- 7. Long-Term Survival (50-Year Horizon) ---');
// ₹2 Cr corpus, ₹30k/mo, 12% return, 5% step-up (returns exceed withdrawals)
const surviveInput: SWPInputs = {
  currentAge: 60,
  startDate: '2025-01-01',
  annualReturnRate: 12,
  stepUpRate: 5,
  initialCorpus: 20000000,
  monthlySWP: 30000,
  lumpSums: []
};
const surviveRes = calculateSWPPlan(surviveInput);
assert(surviveRes.corpusDepleted === false, 'Surviving Plan: Corpus is not depleted');
assert(surviveRes.swpDurationMonths === 600, 'Surviving Plan: Survived full 600 months');
assert(surviveRes.swpDurationYears === 50.00, 'Surviving Plan: 50.00 years duration');
assert(surviveRes.finalCorpus > 0, 'Surviving Plan: Final corpus remains positive');
assert(surviveRes.yearlySummary.length === 50, 'Surviving Plan: 50 yearly summary rows generated');

// --- 8. Zero & Edge Cases Safety ---
console.log('\n--- 8. Zero & Edge Cases Safety ---');
const emptyPlan = calculateSWPPlan({
  currentAge: 60,
  annualReturnRate: 0,
  stepUpRate: 0,
  initialCorpus: 0,
  monthlySWP: 0,
  lumpSums: []
});
assert(emptyPlan.totalWithdrawals === 0, 'Empty plan total withdrawals = 0');
assert(emptyPlan.finalCorpus === 0, 'Empty plan final corpus = 0');
assert(!isNaN(emptyPlan.finalCorpus), 'No NaN on empty plan');
assert(isFinite(emptyPlan.finalCorpus), 'Finite value on empty plan');

// Immediate depletion test (₹50k corpus, ₹1L SWP)
const immDepPlan = calculateSWPPlan({
  currentAge: 60,
  annualReturnRate: 8,
  stepUpRate: 0,
  initialCorpus: 50000,
  monthlySWP: 100000,
  lumpSums: []
});
assert(immDepPlan.swpDurationMonths === 1, 'Immediate depletion: Month 1');
assert(immDepPlan.totalWithdrawals === 50000, 'Immediate depletion: Withdrew available ₹50,000');
assert(immDepPlan.finalCorpus === 0, 'Immediate depletion: Ending corpus = 0');

// Multiple lump sums in same month
const multiLumpPlan = calculateSWPPlan({
  currentAge: 60,
  annualReturnRate: 8,
  stepUpRate: 0,
  initialCorpus: 5000000,
  monthlySWP: 20000,
  lumpSums: [
    { id: '1', monthNumber: 6, amount: 200000 },
    { id: '2', monthNumber: 6, amount: 300000 }
  ]
});
assert(multiLumpPlan.totalLumpSumWithdrawal === 500000, 'Multiple lump sums in same month aggregated to ₹5,00,000');

// --- 9. Formatters ---
console.log('\n--- 9. Formatters ---');
assert(formatIndianCurrency(0) === '₹0', 'formatIndianCurrency(0) = ₹0');
assert(formatIndianCurrency(50000) === '₹50,000', 'formatIndianCurrency(50000) = ₹50,000');
assert(formatIndianCurrency(26472468) === '₹2,64,72,468', 'formatIndianCurrency(26472468) = ₹2,64,72,468');
assert(formatIndianCurrency(-100000) === '-₹1,00,000', 'formatIndianCurrency(-100000) = -₹1,00,000');
assert(formatLakhsCrores(0) === '₹0', 'formatLakhsCrores(0) = ₹0');
assert(formatLakhsCrores(3180000) === '₹31.80 Lakh', 'formatLakhsCrores(3180000) = ₹31.80 Lakh');
assert(formatLakhsCrores(26472468) === '₹2.65 Cr', 'formatLakhsCrores(26472468) = ₹2.65 Cr');
assert(formatPercentage(8) === '8.00%', 'formatPercentage(8) = 8.00%');
assert(formatYearsAndMonths(159) === '13 Years 3 Months', 'formatYearsAndMonths(159) = 13 Years 3 Months');
assert(formatYearsAndMonths(264) === '22 Years', 'formatYearsAndMonths(264) = 22 Years');
assert(formatYearsAndMonths(6) === '6 Months', 'formatYearsAndMonths(6) = 6 Months');

console.log('\n========================================');
console.log('SWP CALCULATOR TEST SUITE: ALL TESTS PASSED');
console.log('========================================\n');
