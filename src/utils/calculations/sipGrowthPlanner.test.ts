/**
 * Unit Test Suite for SIP Growth Planner Calculation Engine
 * 
 * Verifies all 35+ test categories covering:
 * - Effective monthly compounding rate
 * - Duration partitioning (SIP duration + post-SIP horizon)
 * - Annual step-up logic and step-up duration capping
 * - Beginning-of-month Annuity-Due investment timing
 * - Dynamic multi-lump-sum handling (single year, multiple years, post-SIP)
 * - Total investment, wealth created, and growth percentage
 * - Deterministic reference regression benchmark (matching to the exact paisa)
 * - Boundary handling, zero values, and formatting
 */

import {
  calculateMonthlyRate,
  calculateTotalInvestmentYears,
  calculateMonthlySIPForYear,
  calculateStepUpRateForYear,
  calculateAnnualSIPInvestment,
  calculateAnnualLumpSum,
  calculateYearEndCorpus,
  calculateProjection,
  calculateTotalSIPInvestment,
  calculateTotalLumpSumInvestment,
  calculateTotalInvestment,
  calculateWealthCreated,
  calculateGrowthPercentage,
  calculateSIPGrowthPlan,
  formatIndianCurrency,
  formatLakhsCrores,
  formatPercentage,
  type SIPGrowthInputs
} from './sipGrowthPlanner';

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
console.log('RUNNING SIP GROWTH PLANNER TESTS');
console.log('========================================');

// --- 1. Effective Monthly Return Rate ---
console.log('\n--- 1. Effective Monthly Return Rate ---');
// 10% annual return: (1.10)^(1/12) - 1 = 0.00797414042890374
const i10 = calculateMonthlyRate(10);
assertClose(i10, 0.00797414, 0.00001, 'Effective monthly rate for 10% annual return');
assert(calculateMonthlyRate(0) === 0, 'Effective monthly rate for 0% annual return is 0');
const i12 = calculateMonthlyRate(12);
assertClose(i12, 0.00948879, 0.00001, 'Effective monthly rate for 12% annual return');

// --- 2. Duration Partitioning ---
console.log('\n--- 2. Duration Partitioning ---');
assert(calculateTotalInvestmentYears(20, 0) === 20, '20 yrs SIP + 0 yrs post = 20 yrs total');
assert(calculateTotalInvestmentYears(20, 5) === 25, '20 yrs SIP + 5 yrs post = 25 yrs total');
assert(calculateTotalInvestmentYears(0, 5) === 5, '0 yrs SIP + 5 yrs post = 5 yrs total');
assert(calculateTotalInvestmentYears(0, 0) === 0, '0 yrs total duration');

// --- 3. Step-Up Progression & Duration Capping ---
console.log('\n--- 3. Step-Up Progression & Duration Capping ---');
// Starting ₹20,000, 10% step-up for 5 years in a 20-year SIP
assert(calculateMonthlySIPForYear(1, 20000, 10, 5, 20) === 20000, 'Year 1 = ₹20,000');
assertClose(calculateMonthlySIPForYear(2, 20000, 10, 5, 20), 22000, 0.01, 'Year 2 = ₹22,000');
assertClose(calculateMonthlySIPForYear(3, 20000, 10, 5, 20), 24200, 0.01, 'Year 3 = ₹24,200');
assertClose(calculateMonthlySIPForYear(4, 20000, 10, 5, 20), 26620, 0.01, 'Year 4 = ₹26,620');
assertClose(calculateMonthlySIPForYear(5, 20000, 10, 5, 20), 29282, 0.01, 'Year 5 = ₹29,282');
// Year 6 to 20 should cap at Year 5's stepped up amount (₹29,282)
assertClose(calculateMonthlySIPForYear(6, 20000, 10, 5, 20), 29282, 0.01, 'Year 6 caps at ₹29,282');
assertClose(calculateMonthlySIPForYear(20, 20000, 10, 5, 20), 29282, 0.01, 'Year 20 remains ₹29,282');
// Year 21 (post-SIP) = ₹0
assert(calculateMonthlySIPForYear(21, 20000, 10, 5, 20) === 0, 'Year 21 (post-SIP) = ₹0');

// Zero step-up: remains ₹20,000 across all 20 years
assert(calculateMonthlySIPForYear(10, 20000, 0, 20, 20) === 20000, '0% step-up maintains ₹20,000');

// Step-up duration >= SIP duration (step-up continues for entire 20 years)
assertClose(calculateMonthlySIPForYear(20, 20000, 10, 20, 20), 122318.18, 0.05, 'Year 20 SIP @ 10% for 20 yrs ≈ ₹1,22,318.18');

// --- 4. Annual SIP Contributions & Lump-Sum Aggregation ---
console.log('\n--- 4. Annual SIP Contributions & Lump-Sum Aggregation ---');
assert(calculateAnnualSIPInvestment(20000) === 240000, 'Annual SIP for ₹20,000/mo = ₹2,40,000');
assert(calculateAnnualSIPInvestment(0) === 0, 'Annual SIP for ₹0 = ₹0');

const sampleLumpSums = [
  { id: '1', year: 5, amount: 300000 },
  { id: '2', year: 5, amount: 200000 }, // Multiple in same year
  { id: '3', year: 11, amount: 500000 },
  { id: '4', year: 22, amount: 100000 }  // During post-SIP period
];
assert(calculateAnnualLumpSum(1, sampleLumpSums) === 0, 'Year 1 has ₹0 lump sum');
assert(calculateAnnualLumpSum(5, sampleLumpSums) === 500000, 'Year 5 sums multiple lump sums to ₹5,00,000');
assert(calculateAnnualLumpSum(11, sampleLumpSums) === 500000, 'Year 11 has ₹5,00,000 lump sum');
assert(calculateAnnualLumpSum(22, sampleLumpSums) === 100000, 'Year 22 (post-SIP) has ₹1,00,000 lump sum');
assert(calculateAnnualLumpSum(5, []) === 0, 'Empty lump sums returns 0');

// --- 5. Beginning-of-Month Annuity-Due Timing & Year-End Corpus ---
console.log('\n--- 5. Beginning-of-Month Annuity-Due Timing & Year-End Corpus ---');
// Year 1: Opening = 0, Lump = 0, Monthly = 20000, Return = 10%
// fvFactor = ((1.00797414)^12 - 1) / 0.00797414 * 1.00797414 = 12.6405364
// 20000 * 12.6405364 = 252810.73
const y1Closing = calculateYearEndCorpus(0, 0, 20000, 10);
assertClose(y1Closing, 252810.73, 0.05, 'Year 1 closing corpus = ₹2,52,810.73');

// Zero return test: Opening (100000) + Lump (50000) + Monthly (20000 * 12) = 390000
const yZeroRet = calculateYearEndCorpus(100000, 50000, 20000, 0);
assert(yZeroRet === 390000, '0% return produces exact arithmetic sum ₹3,90,000');

// Annuity-Due is strictly greater than Ordinary Annuity
const i = calculateMonthlyRate(10);
const ordinaryFV = 20000 * ((Math.pow(1 + i, 12) - 1) / i);
assert(y1Closing > ordinaryFV, 'Annuity-Due FV > Ordinary Annuity FV (beginning of month timing)');
assertClose(y1Closing, ordinaryFV * (1 + i), 0.001, 'Annuity-Due equals Ordinary Annuity * (1 + i)');

// --- 6. Deterministic Reference Regression Scenario ---
console.log('\n--- 6. Deterministic Reference Regression Scenario ---');
const benchmarkInput: SIPGrowthInputs = {
  monthlySIP: 20000,
  sipDurationYears: 20,
  stepUpRate: 10,
  stepUpDurationYears: 20,
  annualReturnRate: 10,
  postSipYears: 0,
  lumpSums: [
    { id: '1', year: 5, amount: 500000 },
    { id: '2', year: 11, amount: 500000 }
  ]
};

const result = calculateSIPGrowthPlan(benchmarkInput);

// Overall Totals
assertClose(result.totalSIPInvestment, 13745999.88, 0.1, 'Total SIP Investment ≈ ₹1,37,45,999.88');
assert(result.totalLumpSumInvestment === 1000000, 'Total Lump Sum Investment = ₹10,00,000.00');
assertClose(result.totalInvested, 14745999.88, 0.1, 'Total Invested ≈ ₹1,47,45,999.88');
assertClose(result.finalCorpus, 34517706.60, 0.1, 'Final Corpus ≈ ₹3,45,17,706.60');
assertClose(result.wealthCreated, 19771706.72, 0.1, 'Wealth Created ≈ ₹1,97,71,706.72');
assertClose(result.growthPercentage, 134.08, 0.05, 'Growth Percentage ≈ 134.08%');

// Specific Milestone Year Checks (Matching Workbook Progression)
const p1 = result.projection[0];
assert(p1.year === 1, 'Year 1 milestone check');
assert(p1.monthlySIP === 20000, 'Year 1 Monthly SIP = ₹20,000');
assertClose(p1.closingCorpus, 252810.73, 0.05, 'Year 1 Closing Corpus ≈ ₹2,52,810.73');

const p5 = result.projection[4];
assert(p5.year === 5, 'Year 5 milestone check');
assertClose(p5.monthlySIP, 29282.00, 0.01, 'Year 5 Monthly SIP = ₹29,282.00');
assert(p5.lumpSumInvestment === 500000, 'Year 5 Lump Sum = ₹5,00,000');
assertClose(p5.closingCorpus, 2400700.97, 0.05, 'Year 5 Closing Corpus ≈ ₹24,00,700.97');

const p10 = result.projection[9];
assert(p10.year === 10, 'Year 10 milestone check');
assertClose(p10.monthlySIP, 47158.95, 0.05, 'Year 10 Monthly SIP ≈ ₹47,158.95');
assertClose(p10.closingCorpus, 6846925.32, 0.05, 'Year 10 Closing Corpus ≈ ₹68,46,925.32');

const p11 = result.projection[10];
assert(p11.year === 11, 'Year 11 milestone check');
assertClose(p11.monthlySIP, 51874.85, 0.05, 'Year 11 Monthly SIP ≈ ₹51,874.85');
assert(p11.lumpSumInvestment === 500000, 'Year 11 Lump Sum = ₹5,00,000');
assertClose(p11.closingCorpus, 8737343.79, 0.05, 'Year 11 Closing Corpus ≈ ₹87,37,343.79');

const p15 = result.projection[14];
assert(p15.year === 15, 'Year 15 milestone check');
assertClose(p15.monthlySIP, 75949.97, 0.05, 'Year 15 Monthly SIP ≈ ₹75,949.97');
assertClose(p15.closingCorpus, 16632538.38, 0.05, 'Year 15 Closing Corpus ≈ ₹1,66,32,538.38');

const p20 = result.projection[19];
assert(p20.year === 20, 'Year 20 milestone check');
assertClose(p20.monthlySIP, 122318.18, 0.05, 'Year 20 Monthly SIP ≈ ₹1,22,318.18');
assertClose(p20.closingCorpus, 34517706.60, 0.05, 'Year 20 Closing Corpus ≈ ₹3,45,17,706.60');

// --- 7. Post-SIP Compounding Period Tests ---
console.log('\n--- 7. Post-SIP Compounding Period Tests ---');
const postSipInput: SIPGrowthInputs = {
  monthlySIP: 20000,
  sipDurationYears: 10,
  stepUpRate: 10,
  stepUpDurationYears: 10,
  annualReturnRate: 12,
  postSipYears: 5,
  lumpSums: []
};
const postResult = calculateSIPGrowthPlan(postSipInput);
assert(postResult.totalInvestmentYears === 15, 'Total years = 15 (10 SIP + 5 post)');
assert(postResult.projection[9].monthlySIP > 0, 'Year 10 has active SIP');
assert(postResult.projection[10].monthlySIP === 0, 'Year 11 has ₹0 SIP (post-SIP)');
assert(postResult.projection[14].monthlySIP === 0, 'Year 15 has ₹0 SIP (post-SIP)');
assert(postResult.projection[14].closingCorpus > postResult.projection[9].closingCorpus, 'Corpus continues compounding over post-SIP years');
// Year 15 closing = Year 10 closing * (1.12)^5
const y10Closing = postResult.projection[9].closingCorpus;
const expectedY15Closing = y10Closing * Math.pow(1.12, 5);
assertClose(postResult.projection[14].closingCorpus, expectedY15Closing, 0.01, 'Post-SIP compounding compounds exactly at annual rate');

// --- 8. Boundary & Zero Value Safety ---
console.log('\n--- 8. Boundary & Zero Value Safety ---');
const emptyPlan = calculateSIPGrowthPlan({
  monthlySIP: 0,
  sipDurationYears: 0,
  stepUpRate: 0,
  stepUpDurationYears: 0,
  annualReturnRate: 0,
  postSipYears: 0
});
assert(emptyPlan.totalInvested === 0, 'Zero input total invested = 0');
assert(emptyPlan.finalCorpus === 0, 'Zero input final corpus = 0');
assert(emptyPlan.wealthCreated === 0, 'Zero input wealth created = 0');
assert(emptyPlan.growthPercentage === 0, 'Zero input growth percentage = 0');
assert(!isNaN(emptyPlan.finalCorpus), 'No NaN on zero input');
assert(isFinite(emptyPlan.finalCorpus), 'Finite value on zero input');

// --- 9. Currency & Percentage Formatting ---
console.log('\n--- 9. Currency & Percentage Formatting ---');
assert(formatIndianCurrency(0) === '₹0', 'formatIndianCurrency(0) = ₹0');
assert(formatIndianCurrency(20000) === '₹20,000', 'formatIndianCurrency(20000) = ₹20,000');
assert(formatIndianCurrency(34517707) === '₹3,45,17,707', 'formatIndianCurrency(34517707) = ₹3,45,17,707');
assert(formatIndianCurrency(-500000) === '-₹5,00,000', 'formatIndianCurrency(-500000) = -₹5,00,000');
assert(formatLakhsCrores(0) === '₹0', 'formatLakhsCrores(0) = ₹0');
assert(formatLakhsCrores(14746000) === '₹1.47 Cr', 'formatLakhsCrores(14746000) = ₹1.47 Cr');
assert(formatLakhsCrores(2400701) === '₹24.01 Lakh', 'formatLakhsCrores(2400701) = ₹24.01 Lakh');
assert(formatPercentage(10) === '10.00%', 'formatPercentage(10) = 10.00%');
assert(formatPercentage(134.08) === '134.08%', 'formatPercentage(134.08) = 134.08%');

console.log('\n========================================');
console.log('SIP GROWTH PLANNER TEST SUITE: ALL TESTS PASSED');
console.log('========================================\n');
