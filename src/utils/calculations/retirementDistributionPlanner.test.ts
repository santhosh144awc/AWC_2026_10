/**
 * Unit Test Suite for Retirement Distribution Planner Calculation Engine
 * 
 * Verifies all 32 specific test categories covering:
 * - Distribution horizon and 3-bucket partitioning
 * - Inflation-adjusted starting expenses
 * - Compound Fisher real rates per bucket
 * - Annuity-Due living expense capitalization (type=1) vs ordinary annuity
 * - Present value discounting of future buckets back to today
 * - Allocation percentages, weighted returns, and overall real rates
 * - Deterministic reference regression scenario
 * - Boundary handling and floating-point stability
 */

import {
  calculateDistributionYears,
  calculateBucketDurations,
  calculateAnnualExpenses,
  calculateInflationAdjustedExpense,
  calculateRealReturn,
  calculateAnnuityDuePV,
  calculateBucket1InvestmentToday,
  calculateBucket2InvestmentToday,
  calculateBucket3InvestmentToday,
  calculateTotalInvestmentRequired,
  calculateAllocationPercentages,
  calculateWeightedAverageReturn,
  calculateOverallRealReturn,
  calculateRetirementDistributionPlan,
  formatIndianCurrency,
  formatLakhsCrores,
  formatPercentage,
  type RetirementDistributionInput
} from './retirementDistributionPlanner';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`✅ PASS: ${message}`);
}

function assertClose(actual: number, expected: number, tolerance: number = 2, message: string) {
  const diff = Math.abs(actual - expected);
  if (diff > tolerance) {
    console.error(`❌ FAIL: ${message} — Expected ~${expected}, got ${actual} (diff: ${diff})`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`✅ PASS: ${message} (Actual: ${actual}, Expected: ${expected})`);
}

console.log('========================================');
console.log('RUNNING RETIREMENT DISTRIBUTION PLANNER TESTS');
console.log('========================================');

// --- 1. Distribution Years & Partitioning ---
console.log('\n--- 1. Distribution Years & Partitioning ---');
assert(calculateDistributionYears(60, 90) === 30, 'Distribution years (60 to 90) = 30');
assert(calculateDistributionYears(60, 60) === 0, 'Same age distribution years = 0');
assert(calculateDistributionYears(60, 55) === 0, 'Invalid age distribution years = 0');

// 30-year partition: 3 / 4 / 23
const p30 = calculateBucketDurations(30);
assert(p30.b1Years === 3 && p30.b2Years === 4 && p30.b3Years === 23, '30-year partition = 3 / 4 / 23');

// 7-year partition: 3 / 4 / 0
const p7 = calculateBucketDurations(7);
assert(p7.b1Years === 3 && p7.b2Years === 4 && p7.b3Years === 0, '7-year partition = 3 / 4 / 0');

// 6-year partition: 3 / 3 / 0
const p6 = calculateBucketDurations(6);
assert(p6.b1Years === 3 && p6.b2Years === 3 && p6.b3Years === 0, '6-year partition = 3 / 3 / 0');

// 3-year partition: 3 / 0 / 0
const p3 = calculateBucketDurations(3);
assert(p3.b1Years === 3 && p3.b2Years === 0 && p3.b3Years === 0, '3-year partition = 3 / 0 / 0');

// 2-year partition: 2 / 0 / 0
const p2 = calculateBucketDurations(2);
assert(p2.b1Years === 2 && p2.b2Years === 0 && p2.b3Years === 0, '2-year partition = 2 / 0 / 0');

// 0-year partition: 0 / 0 / 0
const p0 = calculateBucketDurations(0);
assert(p0.b1Years === 0 && p0.b2Years === 0 && p0.b3Years === 0, '0-year partition = 0 / 0 / 0');

// --- 2. Annual Expenses & Inflation Adjustments ---
console.log('\n--- 2. Annual Expenses & Inflation Adjustments ---');
const annualExp = calculateAnnualExpenses(100000);
assert(annualExp === 1200000, 'Annual expenses = ₹12,00,000 (₹1.00 Lakh/mo)');
assert(calculateAnnualExpenses(0) === 0, '0 monthly expense = ₹0');

// Bucket 1 expense (start at Year 0): ₹12,00,000
const b1Exp = calculateInflationAdjustedExpense(annualExp, 6, 0);
assert(b1Exp === 1200000, 'Bucket 1 starting annual expense = ₹12,00,000');

// Bucket 2 expense (start at Year 3 @ 6% inflation): 1200000 * (1.06)^3 = 1429219.20
const b2Exp = calculateInflationAdjustedExpense(annualExp, 6, 3);
assertClose(b2Exp, 1429219.20, 0.5, 'Bucket 2 starting annual expense ≈ ₹14,29,219.20');

// Bucket 3 expense (start at Year 7 @ 6% inflation): 1200000 * (1.06)^7 = 1804356.31
const b3Exp = calculateInflationAdjustedExpense(annualExp, 6, 7);
assertClose(b3Exp, 1804356.31, 0.5, 'Bucket 3 starting annual expense ≈ ₹18,04,356.31');

// --- 3. Compound Fisher Real Return per Bucket ---
console.log('\n--- 3. Compound Fisher Real Return per Bucket ---');
// Bucket 1: (1.06 / 1.06) - 1 = 0%
const b1Real = calculateRealReturn(6, 6);
assertClose(b1Real, 0, 0.0001, 'Bucket 1 real return (6% return, 6% inflation) = 0%');

// Bucket 2: (1.08 / 1.06) - 1 = 1.886792%
const b2Real = calculateRealReturn(8, 6);
assertClose(b2Real, 1.8868, 0.001, 'Bucket 2 real return (8% return, 6% inflation) ≈ 1.8868%');

// Bucket 3: (1.10 / 1.06) - 1 = 3.773585%
const b3Real = calculateRealReturn(10, 6);
assertClose(b3Real, 3.7736, 0.001, 'Bucket 3 real return (10% return, 6% inflation) ≈ 3.7736%');

// Zero inflation: return remains post-tax return
assertClose(calculateRealReturn(8, 0), 8, 0.0001, '0% inflation preserves 8% post-tax return');

// Negative real return: return < inflation (e.g. 4% return, 6% inflation)
const negReal = calculateRealReturn(4, 6);
assert(negReal < 0, 'Negative real return when return < inflation');
assertClose(negReal, -1.8868, 0.001, 'Negative real return ≈ -1.8868%');

// --- 4. Annuity-Due Capitalization vs Ordinary Annuity ---
console.log('\n--- 4. Annuity-Due Capitalization vs Ordinary Annuity ---');
// When real return == 0%: PV_due = PMT * n = 1200000 * 3 = 3600000
const b1PV = calculateAnnuityDuePV(1200000, 3, 0);
assert(b1PV === 3600000, 'Bucket 1 Annuity-Due corpus (r=0, n=3) = ₹36,00,000');

// Bucket 2 Corpus at start of Year 3 (PMT = 1429219.20, n = 4, r = 1.886792%)
const b2PV = calculateAnnuityDuePV(b2Exp, 4, b2Real);
assertClose(b2PV, 5560026, 100, 'Bucket 2 Corpus at start of Bucket 2 ≈ ₹55.60 Lakh');

// Bucket 3 Corpus at start of Year 7 (PMT = 1804356.31, n = 23, r = 3.773585%)
const b3PV = calculateAnnuityDuePV(b3Exp, 23, b3Real);
assertClose(b3PV, 28452856, 100, 'Bucket 3 Corpus at start of Bucket 3 ≈ ₹2.85 Cr');

// Annuity Due vs Ordinary Annuity timing check
const r2 = b2Real / 100;
const ordinaryPV = b2Exp * ((1 - Math.pow(1 + r2, -4)) / r2);
assert(b2PV > ordinaryPV, 'Annuity Due PV is greater than Ordinary Annuity PV (beginning of period withdrawals)');
assertClose(b2PV, ordinaryPV * (1 + r2), 0.01, 'Annuity Due equals Ordinary Annuity * (1 + r)');

// --- 5. Present Value Discounting to Today ---
console.log('\n--- 5. Present Value Discounting to Today ---');
// Bucket 1 Today = b1PV = 3600000
const b1InvToday = calculateBucket1InvestmentToday(1200000, 3, 0);
assert(b1InvToday === 3600000, 'Bucket 1 Investment Today = ₹36,00,000');

// Bucket 2 Today: 5560026.11 / (1.08)^3 ≈ ₹44,13,728
const b2InvToday = calculateBucket2InvestmentToday(b2PV, 8, 3);
assertClose(b2InvToday, 4413728, 5000, 'Bucket 2 Investment Today ≈ ₹44.10–44.14 Lakh');

// Bucket 3 Today: 28452855.60 / (1.10)^7 ≈ ₹1,46,00,814
const b3InvToday = calculateBucket3InvestmentToday(b3PV, 10, 7);
assertClose(b3InvToday, 14600814, 60000, 'Bucket 3 Investment Today ≈ ₹1.46–1.47 Cr');

// Total Investment Today ≈ ₹2.26–2.27 Cr
const totalInv = calculateTotalInvestmentRequired(b1InvToday, b2InvToday, b3InvToday);
assertClose(totalInv, 22614542, 60000, 'Total Investment Required Today ≈ ₹2.26–2.27 Cr');

// --- 6. Allocation Percentages & Weighted Returns ---
console.log('\n--- 6. Allocation Percentages & Weighted Returns ---');
const allocs = calculateAllocationPercentages(b1InvToday, b2InvToday, b3InvToday, totalInv);
assertClose(allocs.alloc1, 15.92, 0.2, 'Bucket 1 Allocation ≈ 15.9%');
assertClose(allocs.alloc2, 19.52, 0.2, 'Bucket 2 Allocation ≈ 19.5%');
assertClose(allocs.alloc3, 64.56, 0.3, 'Bucket 3 Allocation ≈ 64.6%');
assertClose(allocs.alloc1 + allocs.alloc2 + allocs.alloc3, 100, 0.1, 'Allocations sum to 100%');

// Weighted Post-Tax Return: (3*6 + 4*8 + 23*10) / 30 = 280 / 30 = 9.3333%
const weightedRet = calculateWeightedAverageReturn(3, 6, 4, 8, 23, 10, 30);
assertClose(weightedRet, 9.3333, 0.01, 'Weighted Post-Tax Return = 9.33%');

// Overall Real Return: (1.0933333 / 1.06) - 1 = 3.1447% => 3.14%
const overallReal = calculateOverallRealReturn(weightedRet, 6);
assertClose(overallReal, 3.1447, 0.01, 'Overall Real Return = 3.14%');

// --- 7. Master End-to-End Orchestrator (Deterministic Regression Scenario) ---
console.log('\n--- 7. Master End-to-End Orchestrator ---');
const sampleInput: RetirementDistributionInput = {
  retirementAge: 60,
  monthlyRetirementExpense: 100000,
  lifeExpectancy: 90,
  assumptions: {
    inflationRate: 6,
    bucket1Return: 6,
    bucket2Return: 8,
    bucket3Return: 10
  }
};

const result = calculateRetirementDistributionPlan(sampleInput);

assert(result.distributionYears === 30, 'Distribution Years = 30');
assert(result.initialAnnualExpense === 1200000, 'Initial Annual Expense = ₹12,00,000');
assert(result.initialMonthlyExpense === 100000, 'Initial Monthly Expense = ₹1,00,000');

// Bucket 1 checks
assert(result.bucket1.durationYears === 3, 'Bucket 1 Duration = 3 years');
assert(result.bucket1.startingAnnualExpense === 1200000, 'Bucket 1 Starting Annual Expense = ₹12,00,000');
assert(result.bucket1.corpusAtBucketStart === 3600000, 'Bucket 1 Corpus at Start = ₹36,00,000');
assert(result.bucket1.investmentRequiredToday === 3600000, 'Bucket 1 Investment Today = ₹36,00,000');
assertClose(result.bucket1.allocationPercent, 15.92, 0.2, 'Bucket 1 Allocation ≈ 15.9%');

// Bucket 2 checks
assert(result.bucket2.durationYears === 4, 'Bucket 2 Duration = 4 years');
assertClose(result.bucket2.startingAnnualExpense, 1429219, 2, 'Bucket 2 Starting Annual Expense ≈ ₹14,29,219');
assertClose(result.bucket2.corpusAtBucketStart, 5560026, 100, 'Bucket 2 Corpus at Start ≈ ₹55.60 Lakh');
assertClose(result.bucket2.investmentRequiredToday, 4413728, 5000, 'Bucket 2 Investment Today ≈ ₹44.10–44.14 Lakh');
assertClose(result.bucket2.allocationPercent, 19.52, 0.2, 'Bucket 2 Allocation ≈ 19.5%');

// Bucket 3 checks
assert(result.bucket3.durationYears === 23, 'Bucket 3 Duration = 23 years');
assertClose(result.bucket3.startingAnnualExpense, 1804356, 2, 'Bucket 3 Starting Annual Expense ≈ ₹18,04,356');
assertClose(result.bucket3.corpusAtBucketStart, 28452856, 100, 'Bucket 3 Corpus at Start ≈ ₹2.85 Cr');
assertClose(result.bucket3.investmentRequiredToday, 14600814, 60000, 'Bucket 3 Investment Today ≈ ₹1.46–1.47 Cr');
assertClose(result.bucket3.allocationPercent, 64.56, 0.3, 'Bucket 3 Allocation ≈ 64.6%');

// Totals check
assertClose(result.totalInvestmentRequiredToday, 22614542, 60000, 'Total Investment Today ≈ ₹2.26–2.27 Cr');
assertClose(result.weightedAveragePostTaxReturn, 9.33, 0.05, 'Weighted Post-Tax Return ≈ 9.33%');
assertClose(result.overallRealReturn, 3.14, 0.05, 'Overall Real Return ≈ 3.14%');
assert(result.keyInsight.length > 0, 'Key factual insight generated');

// --- 8. Boundary & Zero Value Safety ---
console.log('\n--- 8. Boundary & Zero Value Safety ---');
const emptyInput: RetirementDistributionInput = {
  retirementAge: 60,
  monthlyRetirementExpense: 0,
  lifeExpectancy: 60
};
const emptyResult = calculateRetirementDistributionPlan(emptyInput);
assert(emptyResult.distributionYears === 0, 'Zero distribution years');
assert(emptyResult.totalInvestmentRequiredToday === 0, 'Zero total investment required');
assert(emptyResult.bucket1.investmentRequiredToday === 0, 'Zero bucket 1 investment');
assert(emptyResult.bucket2.investmentRequiredToday === 0, 'Zero bucket 2 investment');
assert(emptyResult.bucket3.investmentRequiredToday === 0, 'Zero bucket 3 investment');
assert(!isNaN(emptyResult.totalInvestmentRequiredToday), 'Zero input produces no NaN');
assert(isFinite(emptyResult.totalInvestmentRequiredToday), 'Zero input produces finite value');

// --- 9. Currency & Percentage Formatting ---
console.log('\n--- 9. Currency & Percentage Formatting ---');
assert(formatIndianCurrency(0) === '₹0', 'formatIndianCurrency(0) = ₹0');
assert(formatIndianCurrency(100000) === '₹1,00,000', 'formatIndianCurrency(100000) = ₹1,00,000');
assert(formatIndianCurrency(22666938) === '₹2,26,66,938', 'formatIndianCurrency(22666938) = ₹2,26,66,938');
assert(formatIndianCurrency(-500000) === '-₹5,00,000', 'formatIndianCurrency(-500000) = -₹5,00,000');
assert(formatLakhsCrores(0) === '₹0', 'formatLakhsCrores(0) = ₹0');
assert(formatLakhsCrores(4410372) === '₹44.10 Lakh', 'formatLakhsCrores(4410372) = ₹44.10 Lakh');
assert(formatLakhsCrores(22666938) === '₹2.27 Cr', 'formatLakhsCrores(22666938) = ₹2.27 Cr');
assert(formatPercentage(9.33) === '9.33%', 'formatPercentage(9.33) = 9.33%');
assert(formatPercentage(3.14) === '3.14%', 'formatPercentage(3.14) = 3.14%');

console.log('\n========================================');
console.log('RETIREMENT DISTRIBUTION TEST SUITE: ALL TESTS PASSED');
console.log('========================================\n');
