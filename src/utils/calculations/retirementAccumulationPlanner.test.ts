/**
 * Unit Test Suite for Retirement Accumulation Planner Calculation Engine
 * 
 * Verifies all 32 specific test categories covering:
 * - Current and future expense inflation & reduction
 * - Compound Fisher real return and tax-adjusted returns
 * - Annuity-Due living expense capitalization (type=1) vs ordinary annuity
 * - Existing assets aggregation at retirement (no double-compounding)
 * - Funding deficit, lump sum, fixed SIP, and Step-Up SIP (Step-up annuity formula)
 * - Deterministic reference scenario validation
 * - Boundary handling and floating-point stability
 */

import {
  calculateTotalCurrentAnnualExpenses,
  calculateYearsUntilRetirement,
  calculateFutureAnnualRetirementExpenses,
  calculateMonthlyRetirementExpenses,
  calculateYearsPostRetirement,
  calculateTaxAdjustedReturn,
  calculateRealReturn,
  calculateRetirementCorpusRequired,
  calculateEmploymentBenefits,
  calculateOwnAssetsAtRetirement,
  calculateTotalRetirementAssets,
  calculateGoalProgress,
  calculateFundingDeficit,
  calculateRequiredLumpSum,
  calculateRequiredFixedSIP,
  calculateRequiredStepUpSIP,
  calculateRetirementAccumulationPlan,
  formatIndianCurrency,
  formatLakhsCrores,
  formatPercentage,
  type RetirementPlannerInput
} from './retirementAccumulationPlanner';

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
console.log('RUNNING RETIREMENT ACCUMULATION PLANNER TESTS');
console.log('========================================');

// --- 1. Current Annual & Monthly Expenses ---
console.log('\n--- 1. Current Annual & Monthly Expenses ---');
const totalExp = calculateTotalCurrentAnnualExpenses(1200000, 300000, 100000);
assert(totalExp === 1600000, 'Total annual expenses = ₹16,00,000');
assert(calculateTotalCurrentAnnualExpenses(1200000, 0, 0) === 1200000, 'Household only = ₹12,00,000');
assert(calculateTotalCurrentAnnualExpenses(0, 0, 0) === 0, 'Zero expenses = ₹0');
assert(calculateMonthlyRetirementExpenses(1200000) === 100000, 'Monthly expense = ₹1,00,000/mo');

// --- 2. Timeline & Future Expense Inflation ---
console.log('\n--- 2. Timeline & Future Expense Inflation ---');
const yrsToRetire = calculateYearsUntilRetirement(50, 60);
assert(yrsToRetire === 10, 'Years until retirement (50 to 60) = 10 years');

// ₹12L @ 6% inflation for 10 years with 20% expense reduction:
// 1200000 * (1.06)^10 * (1 - 0.20) = 1200000 * 1.790847696 * 0.80 = 1719213.788 => 1719214
const futureExp = calculateFutureAnnualRetirementExpenses(1200000, 6, 10, 20);
assertClose(futureExp, 1719214, 2, 'Future annual expenses ≈ ₹17,19,214');

const futureMonthly = calculateMonthlyRetirementExpenses(futureExp);
assertClose(futureMonthly, 143268, 2, 'Future monthly expenses ≈ ₹1,43,268/mo');

// Zero inflation: 1200000 * 0.80 = 960000
assert(calculateFutureAnnualRetirementExpenses(1200000, 0, 10, 20) === 960000, '0% inflation gives 9.60L');
// 0% expense reduction: 1200000 * (1.06)^10 = 2149017
assertClose(calculateFutureAnnualRetirementExpenses(1200000, 6, 10, 0), 2149017, 2, '0% reduction gives ₹21,49,017');

// --- 3. Tax-Adjusted Return & Real Return ---
console.log('\n--- 3. Tax-Adjusted Return & Real Return ---');
// 10.5% return with 12.5% tax: 10.5 * (1 - 0.125) = 9.1875%
const taxAdjRet = calculateTaxAdjustedReturn(10.5, 12.5);
assertClose(taxAdjRet, 9.1875, 0.0001, 'Tax-adjusted return = 9.1875%');

// Real return: ((1 + 0.091875) / (1 + 0.06)) - 1 = 1.091875 / 1.06 - 1 = 0.0300707547 => 3.0071%
const realRet = calculateRealReturn(taxAdjRet, 6);
assertClose(realRet, 3.0071, 0.001, 'Real return ≈ 3.0071%');

// Zero tax return
assert(calculateTaxAdjustedReturn(10, 0) === 10, '0% tax returns 10%');
// 0% return with tax
assert(calculateTaxAdjustedReturn(0, 12.5) === 0, '0% return gives 0%');
// Real return when return == inflation
assert(calculateRealReturn(6, 6) === 0, 'Real return is 0% when return equals inflation');

// --- 4. Annuity-Due Retirement Corpus Required ---
console.log('\n--- 4. Annuity-Due Retirement Corpus Required ---');
const yrsPostRetire = calculateYearsPostRetirement(90, 60);
assert(yrsPostRetire === 30, 'Years post retirement (60 to 90) = 30 years');

// Future expenses = 1719214, n = 30, r = 3.0071%
// Annuity Due formula: 1719214 * ((1 - (1.0300707547)^(-30)) / 0.0300707547) * 1.0300707547
// = 1719214 * (0.58902937 / 0.0300707547) * 1.0300707547 = 1719214 * 19.588114 * 1.0300707547 = 34678929
const corpusRes = calculateRetirementCorpusRequired(futureExp, 30, realRet, 0);
assertClose(corpusRes.livingCorpus, 34678929, 2, 'Required retirement living corpus ≈ ₹3,46,78,929 (₹3.47 Cr)');
assert(corpusRes.legacyCorpus === 0, 'Zero legacy corpus gives 0 legacy amount');
assertClose(corpusRes.totalCorpus, 34678929, 2, 'Total required corpus ≈ ₹3,46,78,929');

// Annuity Due vs Ordinary Annuity Check
const ordinaryAnnuity = futureExp * ((1 - Math.pow(1 + realRet / 100, -30)) / (realRet / 100));
assert(corpusRes.livingCorpus > ordinaryAnnuity, 'Annuity Due corpus is greater than ordinary annuity (withdrawals at start)');
assertClose(corpusRes.livingCorpus, ordinaryAnnuity * (1 + realRet / 100), 2, 'Annuity Due equals Ordinary Annuity * (1 + r)');

// Zero Real Return Test: PMT * n = futureExp * 30
const zeroRealCorpus = calculateRetirementCorpusRequired(futureExp, 30, 0, 0);
assertClose(zeroRealCorpus.livingCorpus, Math.round(futureExp * 30), 2, '0% real return returns PMT * n (₹5,15,76,414)');

// Negative Real Return Test (inflation > tax-adjusted return, e.g. r = -1%)
const negRealCorpus = calculateRetirementCorpusRequired(1000000, 20, -1, 0);
assert(negRealCorpus.livingCorpus > 0 && !isNaN(negRealCorpus.livingCorpus) && isFinite(negRealCorpus.livingCorpus), 'Negative real return calculates safely without NaN');

// Legacy Corpus Test
const legacyCorpusTest = calculateRetirementCorpusRequired(futureExp, 30, realRet, 5000000);
assert(legacyCorpusTest.legacyCorpus > 0, 'Discounted legacy corpus is included');
assert(legacyCorpusTest.totalCorpus === corpusRes.livingCorpus + legacyCorpusTest.legacyCorpus, 'Total corpus = living + legacy');

// --- 5. Existing Assets Aggregation & Goal Progress ---
console.log('\n--- 5. Existing Assets Aggregation & Goal Progress ---');
// Section A: Employment benefits
const empBenefits = calculateEmploymentBenefits(7500000, 2500000, 0);
assert(empBenefits === 10000000, 'Employment benefits (EPF 75L + Gratuity 25L) = ₹1,00,00,000 (₹1.00 Cr)');

// Section B: Own assets
const ownAssets = calculateOwnAssetsAtRetirement(3000000, 2500000, 4500000);
assert(ownAssets === 10000000, 'Own assets (FD 30L + Ins 25L + MF 45L) = ₹1,00,00,000 (₹1.00 Cr)');

// Total retirement resources
const totalAssets = calculateTotalRetirementAssets(empBenefits, ownAssets);
assert(totalAssets === 20000000, 'Total retirement resources = ₹2,00,00,000 (₹2.00 Cr)');

// Goal progress: (20000000 / 34678929) * 100 = 57.6719% => 57.67%
const progress = calculateGoalProgress(totalAssets, corpusRes.totalCorpus);
assertClose(progress, 57.67, 0.02, 'Goal progress ≈ 57.67%');

// Overfunded progress cap at 100%
assert(calculateGoalProgress(40000000, 30000000) === 100, 'Overfunded progress is capped at 100%');
assert(calculateGoalProgress(0, 30000000) === 0, 'Zero assets returns 0% progress');

// Funding Deficit
const deficit = calculateFundingDeficit(corpusRes.totalCorpus, totalAssets);
assertClose(deficit, 14678929, 2, 'Funding deficit = ₹1,46,78,929 (₹1.47 Cr)');
assert(calculateFundingDeficit(20000000, 30000000) === 0, 'Overfunded deficit is capped at ₹0');

// --- 6. Lump Sum Required Today ---
console.log('\n--- 6. Lump Sum Required Today ---');
// ₹1,46,78,929 deficit @ 12% return for 10 years:
// 14678929 / (1.12)^10 = 14678929 / 3.1058482 = 4726222.06 => 4726222
const lumpSum = calculateRequiredLumpSum(14678929, 12, 10);
assertClose(lumpSum, 4726222, 2, 'Lump sum required for ₹1.47 Cr deficit @ 12% for 10 yrs ≈ ₹47,26,222');
assert(calculateRequiredLumpSum(14678929, 0, 10) === 14678929, '0% return requires full deficit as lump sum');
assert(calculateRequiredLumpSum(0, 12, 10) === 0, 'Zero deficit requires ₹0 lump sum');

// --- 7. Fixed Monthly SIP ---
console.log('\n--- 7. Fixed Monthly SIP ---');
// ₹1,46,78,929 deficit @ 12% for 10 years (120 months):
// i = 0.12 / 12 = 0.01
// PMT = 14678929 * 0.01 / ((1.01)^120 - 1) = 146789.29 / 2.30038689 = 66141.56 => ₹66,142
const fixedSip = calculateRequiredFixedSIP(14678929, 12, 10);
assertClose(fixedSip, 66142, 2, 'Fixed monthly SIP for ₹1.47 Cr @ 12% for 10 yrs ≈ ₹66,142/mo');
// 0% return: 14678929 / 120 = 122324.4 => 122324
assertClose(calculateRequiredFixedSIP(14678929, 0, 10), 122324, 2, '0% return divides deficit evenly across 120 months');
assert(calculateRequiredFixedSIP(0, 12, 10) === 0, 'Zero deficit requires ₹0 SIP');

// --- 8. Step-Up Monthly SIP ---
console.log('\n--- 8. Step-Up Monthly SIP ---');
// Deficit = 14678929, r = 0.12, g = 0.10, t = 10
// Numerator = 14678929 * (0.12 - 0.10) = 293578.58
// Denominator = (1.12)^10 - (1.10)^10 = 3.1058482 - 2.59374246 = 0.51210574
// FV1 = 293578.58 / 0.51210574 = 573277.26
// -PMT(0.01, 12, 0, 573277.26, 0) = 573277.26 * 0.01 / ((1.01)^12 - 1) = 5732.7726 / 0.12682503 = 45330.93 => ₹45,331
const stepUpSip = calculateRequiredStepUpSIP(14678929, 12, 10, 10);
assertClose(stepUpSip, 45331, 2, 'Starting Step-Up SIP (10% annual increase) ≈ ₹45,331/mo');
assert(stepUpSip < fixedSip, 'Starting Step-Up SIP is lower than flat fixed SIP (₹45,331 < ₹66,142)');
assert(calculateRequiredStepUpSIP(0, 12, 10, 10) === 0, 'Zero deficit requires ₹0 Step-Up SIP');

// Special case: r == g (e.g. 10% return and 10% step-up)
const equalRateStepUp = calculateRequiredStepUpSIP(10000000, 10, 10, 10);
assert(equalRateStepUp > 0 && !isNaN(equalRateStepUp) && isFinite(equalRateStepUp), 'Equal return and step-up (r=g) does not produce NaN/0');

// --- 9. Start Delay Tests ---
console.log('\n--- 9. Start Delay Tests ---');
// 2-year delay on 10-year goal => 8-year horizon
const delayedSip = calculateRequiredFixedSIP(14678929, 12, 8);
assert(delayedSip > fixedSip, 'Delayed SIP requires higher monthly amount due to shorter horizon');
assertClose(delayedSip, 94369, 2, '8-year fixed SIP for ₹1.47 Cr @ 12% ≈ ₹94,369/mo');

// --- 10. Master End-to-End Orchestrator (Deterministic Reference Scenario) ---
console.log('\n--- 10. Master End-to-End Orchestrator ---');
const sampleInput: RetirementPlannerInput = {
  expenses: {
    householdExpenses: 1200000,
    lifestyleExpenses: 0,
    otherExpenses: 0
  },
  timeline: {
    currentAge: 50,
    retirementAge: 60,
    inflationPreRetirement: 6,
    expenseReductionPercent: 20
  },
  corpus: {
    lifeExpectancyAge: 90,
    inflationPostRetirement: 6,
    taxRateOnCorpusReturn: 12.5,
    corpusReturnPreTax: 10.5,
    childrenOrCharityCorpus: 0
  },
  employmentBenefits: {
    epfNps: 7500000,
    gratuity: 2500000,
    superannuationOther: 0
  },
  retirementAssets: {
    fixedDeposits: 3000000,
    insuranceMaturity: 2500000,
    mutualFundsInvestments: 4500000
  },
  funding: {
    startInvestingDelay: 0,
    expectedNewInvestmentReturn: 12,
    annualStepUpRate: 10
  }
};

const result = calculateRetirementAccumulationPlan(sampleInput);

assert(result.totalCurrentAnnualExpenses === 1200000, 'Current Annual Expenses = ₹12,00,000');
assert(result.currentMonthlyExpenses === 100000, 'Current Monthly Expenses = ₹1,00,000');
assert(result.yearsUntilRetirement === 10, 'Years until retirement = 10');
assertClose(result.futureAnnualExpenses, 1719214, 2, 'Future Annual Expenses at Retirement ≈ ₹17,19,214');
assertClose(result.futureMonthlyExpenses, 143268, 2, 'Future Monthly Expenses at Retirement ≈ ₹1,43,268');
assert(result.yearsPostRetirement === 30, 'Years post retirement = 30');
assertClose(result.taxAdjustedReturn, 9.1875, 0.001, 'Tax Adjusted Return = 9.1875%');
assertClose(result.realReturn, 3.0071, 0.001, 'Real Return ≈ 3.0071%');
assertClose(result.totalRetirementCorpusRequired, 34678929, 2, 'Total Retirement Corpus Required ≈ ₹3,46,78,929 (₹3.47 Cr)');
assert(result.totalEmploymentBenefits === 10000000, 'Employment Benefits = ₹1,00,00,000 (₹1.00 Cr)');
assert(result.totalOwnAssets === 10000000, 'Own Assets = ₹1,00,00,000 (₹1.00 Cr)');
assert(result.totalRetirementAssets === 20000000, 'Total Retirement Resources = ₹2,00,00,000 (₹2.00 Cr)');
assertClose(result.goalProgress, 57.67, 0.02, 'Goal Progress ≈ 57.67%');
assertClose(result.fundingDeficit, 14678929, 2, 'Funding Deficit ≈ ₹1,46,78,929 (₹1.47 Cr)');
assert(result.isFullyFunded === false, 'isFullyFunded is false');
assertClose(result.requiredLumpSum, 4726222, 2, 'Required Lump Sum Today ≈ ₹47,26,222');
assertClose(result.requiredFixedSIP, 66142, 2, 'Required Fixed Monthly SIP ≈ ₹66,142/mo');
assertClose(result.requiredStepUpSIP, 45331, 2, 'Required Step-Up Starting SIP ≈ ₹45,331/mo');
assert(result.keyInsight.length > 0, 'Key factual insight generated');

// --- 11. Edge & Boundary Safety ---
console.log('\n--- 11. Edge & Boundary Safety ---');
const emptyInput: RetirementPlannerInput = {
  expenses: { householdExpenses: 0, lifestyleExpenses: 0, otherExpenses: 0 },
  timeline: { currentAge: 50, retirementAge: 50, inflationPreRetirement: 0, expenseReductionPercent: 0 },
  corpus: { lifeExpectancyAge: 50, inflationPostRetirement: 0, taxRateOnCorpusReturn: 0, corpusReturnPreTax: 0 },
  employmentBenefits: { epfNps: 0, gratuity: 0, superannuationOther: 0 },
  retirementAssets: { fixedDeposits: 0, insuranceMaturity: 0, mutualFundsInvestments: 0 },
  funding: { startInvestingDelay: 0, expectedNewInvestmentReturn: 0, annualStepUpRate: 0 }
};
const emptyResult = calculateRetirementAccumulationPlan(emptyInput);
assert(emptyResult.totalRetirementCorpusRequired === 0, 'Empty input: corpus is 0');
assert(emptyResult.fundingDeficit === 0, 'Empty input: deficit is 0');
assert(emptyResult.requiredFixedSIP === 0, 'Empty input: fixed SIP is 0');
assert(emptyResult.requiredStepUpSIP === 0, 'Empty input: step-up SIP is 0');
assert(!isNaN(emptyResult.requiredLumpSum), 'Empty input: lump sum is not NaN');
assert(isFinite(emptyResult.requiredFixedSIP), 'Empty input: fixed SIP is finite');

// --- 12. Currency & Percentage Formatting ---
console.log('\n--- 12. Currency & Percentage Formatting ---');
assert(formatIndianCurrency(0) === '₹0', 'formatIndianCurrency(0) = ₹0');
assert(formatIndianCurrency(50000) === '₹50,000', 'formatIndianCurrency(50000) = ₹50,000');
assert(formatIndianCurrency(34678929) === '₹3,46,78,929', 'formatIndianCurrency(34678929) = ₹3,46,78,929');
assert(formatIndianCurrency(-500000) === '-₹5,00,000', 'formatIndianCurrency(-500000) = -₹5,00,000');
assert(formatLakhsCrores(0) === '₹0', 'formatLakhsCrores(0) = ₹0');
assert(formatLakhsCrores(4726222) === '₹47.26 Lakh', 'formatLakhsCrores(4726222) = ₹47.26 Lakh');
assert(formatLakhsCrores(34678929) === '₹3.47 Cr', 'formatLakhsCrores(34678929) = ₹3.47 Cr');
assert(formatPercentage(9.1875) === '9.19%', 'formatPercentage(9.1875) = 9.19%');
assert(formatPercentage(3.0071) === '3.01%', 'formatPercentage(3.0071) = 3.01%');

console.log('\n========================================');
console.log('RETIREMENT PLANNER TEST SUITE: ALL TESTS PASSED');
console.log('========================================\n');
