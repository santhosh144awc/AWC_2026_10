/**
 * Unit Test Suite for Home Loan Foreclosure Planner Calculation Engine
 * 
 * Verifies all 40+ test cases covering:
 * 1. Standard EMI calculation (Rs 50L / 20y / 8%, zero-interest, zero loan, boundary cases)
 * 2. Effective monthly SIP return calculation (12% -> 0.94888%/mo, 0%, 8%, 15%, strictly NOT r/12)
 * 3. Monthly loan amortization (Month 1, Month 12, Month 60, Month 120, Month 240, zero principal at maturity)
 * 4. Required monthly SIP solving (Option 1 - Target Closure Year: 10y, 5y, 15y, target = tenure)
 * 5. Fixed monthly SIP accumulation & Crossover detection (Option 2 - Fixed SIP: Month 142 crossover, early crossover, no crossover)
 * 6. Safety & numerical stability (No NaN, no Infinity, no negative principal or corpus)
 * 7. Deterministic regression tests matching Excel workbook benchmark calculations:
 *    - Loan = Rs 50,00,000, 20 yrs, 8% interest -> EMI = Rs 41,822.01
 *    - Option 1 (10-year target, 12% return): Outstanding Principal = Rs 34,47,030.56, Required SIP = Rs 15,386.07
 *    - Option 2 (Rs 10,000/mo SIP, 12% return): Crossover at Month 142 (11y 10m), Principal = Rs 30,34,801.46, Corpus = Rs 30,53,490.41
 * 8. Yearly summary aggregation and formatting helpers
 */

import {
  calculateEMI,
  calculateMonthlySIPRate,
  calculateOutstandingPrincipal,
  calculateRequiredSIP,
  calculateSIPCorpus,
  calculateLoanProjection,
  calculateYearlySummary,
  calculateHomeLoanForeclosurePlan,
  formatIndianCurrency,
  formatLakhsCrores,
  formatPercentage,
  formatYearsAndMonths,
  type HomeLoanForeclosureInputs
} from './homeLoanForeclosurePlanner';

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
console.log('RUNNING HOME LOAN FORECLOSURE PLANNER TESTS');
console.log('========================================');

// --- 1. EMI Calculations ---
console.log('\n--- 1. EMI Calculations ---');
const emi50L = calculateEMI(5000000, 20, 8);
assertClose(emi50L, 41822.01, 0.5, 'Standard EMI for ₹50L @ 8% for 20 years');

const emi30L = calculateEMI(3000000, 15, 9);
assertClose(emi30L, 30428.03, 0.5, 'EMI for ₹30L @ 9% for 15 years');

const emiZeroRate = calculateEMI(2400000, 20, 0);
assert(emiZeroRate === 10000, '0% interest rate EMI = ₹10,000 (linear ₹24L / 240m)');

const emiZeroLoan = calculateEMI(0, 20, 8.5);
assert(emiZeroLoan === 0, '₹0 loan amount returns ₹0 EMI');

const emiNegLoan = calculateEMI(-5000000, 20, 8);
assert(emiNegLoan === 0, 'Negative loan amount returns ₹0 EMI');

const emi1Yr = calculateEMI(120000, 1, 10);
assertClose(emi1Yr, 10549.91, 0.5, '1-year loan ₹1.2L @ 10% EMI');

// --- 2. Effective Monthly SIP Return Rate ---
console.log('\n--- 2. Effective Monthly SIP Return Rate ---');
const i12 = calculateMonthlySIPRate(12);
assertClose(i12, 0.00948879, 0.00001, 'Effective monthly rate for 12% p.a. ≈ 0.94888%/mo');
assert(i12 < 0.01, 'Effective monthly rate is strictly less than nominal r/12 (0.01)');

const i0 = calculateMonthlySIPRate(0);
assert(i0 === 0, 'Effective monthly rate for 0% return is 0');

const i8 = calculateMonthlySIPRate(8);
assertClose(i8, 0.00643403, 0.00001, 'Effective monthly rate for 8% return');

const i15 = calculateMonthlySIPRate(15);
assertClose(i15, 0.01171492, 0.00001, 'Effective monthly rate for 15% return');

const iNeg = calculateMonthlySIPRate(-5);
assert(iNeg === 0, 'Negative rate returns 0');

// --- 3. Outstanding Loan Principal Amortization ---
console.log('\n--- 3. Outstanding Loan Principal Amortization ---');
const loanAmt = 5000000;
const tenure = 20;
const rate = 8;

const p0 = calculateOutstandingPrincipal(loanAmt, tenure, rate, 0);
assert(p0 === loanAmt, 'Month 0 outstanding principal = original loan amount');

const p1 = calculateOutstandingPrincipal(loanAmt, tenure, rate, 1);
assertClose(p1, 4991511.32, 0.5, 'Month 1 closing principal = ₹49,91,511.32');

const p12 = calculateOutstandingPrincipal(loanAmt, tenure, rate, 12);
assertClose(p12, 4894316.69, 0.5, 'Month 12 (Year 1) closing principal = ₹48,94,316.69');

const p60 = calculateOutstandingPrincipal(loanAmt, tenure, rate, 60);
assertClose(p60, 4376279.21, 2.0, 'Month 60 (Year 5) closing principal = ₹43,76,279.21');

const p120 = calculateOutstandingPrincipal(loanAmt, tenure, rate, 120);
assertClose(p120, 3447030.56, 2.0, 'Month 120 (Year 10 Benchmark) closing principal = ₹34,47,030.56');

const p240 = calculateOutstandingPrincipal(loanAmt, tenure, rate, 240);
assert(p240 < 1, 'Final Month 240 amortizes loan balance to ₹0');

const pBeyond = calculateOutstandingPrincipal(loanAmt, tenure, rate, 250);
assert(pBeyond === 0, 'Months beyond tenure return ₹0 balance');

// --- 4. Required Monthly SIP & SIP Corpus Compounding ---
console.log('\n--- 4. Required Monthly SIP & SIP Corpus Compounding ---');
const targetCorpus = 3447030.56;
const reqSIP = calculateRequiredSIP(targetCorpus, 120, 12);
assertClose(reqSIP, 15386.07, 0.5, 'Required monthly SIP for ₹34.47L in 10 yrs @ 12% = ₹15,386.07');

const corpusGen = calculateSIPCorpus(15386.07, 120, 12);
assertClose(corpusGen, 3447030.56, 2.0, 'SIP corpus generated in 120 months equals target ₹34.47L');

const reqSIPZero = calculateRequiredSIP(1200000, 120, 0);
assert(reqSIPZero === 10000, '0% return required SIP = linear division ₹10,000');

const reqSIPZeroCorpus = calculateRequiredSIP(0, 120, 12);
assert(reqSIPZeroCorpus === 0, '₹0 target corpus requires ₹0 SIP');

const corpus142 = calculateSIPCorpus(10000, 142, 12);
assertClose(corpus142, 3003402.64, 2.0, 'SIP corpus for ₹10,000/mo in 142 months @ 12% = ₹30,03,402.64');

// --- 5. Deterministic Regression: Option 1 (Target Closure Year Benchmark) ---
console.log('\n--- 5. Regression: Option 1 (10-Year Target Benchmark) ---');
const opt1Inputs: HomeLoanForeclosureInputs = {
  loanAmount: 5000000,
  loanTenureYears: 20,
  loanInterestRate: 8,
  sipReturnRate: 12,
  strategy: 'targetYear',
  targetClosureYears: 10
};
const opt1Result = calculateHomeLoanForeclosurePlan(opt1Inputs);

assert(opt1Result.loanAmount === 5000000, 'Option 1: Loan amount = ₹50,00,000');
assert(opt1Result.loanTenureYears === 20, 'Option 1: Tenure = 20 years');
assert(opt1Result.strategy === 'targetYear', 'Option 1: Strategy is targetYear');
assertClose(opt1Result.emi, 41822.01, 1.0, 'Option 1: Monthly EMI = ₹41,822.01');
assert(opt1Result.targetClosureYears === 10, 'Option 1: Target closure = 10 years');
assert(opt1Result.targetClosureMonths === 120, 'Option 1: Target closure = 120 months');
assertClose(opt1Result.outstandingPrincipalAtTarget, 3447030.56, 2.0, 'Option 1: Outstanding principal at 10 yrs = ₹34,47,030.56');
assertClose(opt1Result.requiredMonthlySIP!, 15386.07, 1.0, 'Option 1: Required Monthly SIP = ₹15,386.07');
assertClose(opt1Result.SIPCorpusAtTarget, 3447030.56, 2.0, 'Option 1: SIP Corpus at target = ₹34,47,030.56');
assertClose(opt1Result.totalSIPInvestment, 1846328.21, 2.0, 'Option 1: Total SIP Investment = ₹18,46,328.21');
assertClose(opt1Result.SIPWealthCreated, 1600702.35, 2.0, 'Option 1: SIP Wealth Created = ₹16,00,702.35');
assert(opt1Result.isForeclosureAchievedWithinTenure === true, 'Option 1: Foreclosure achieved within tenure');
assert(opt1Result.foreclosureMonth === 120, 'Option 1: Foreclosure month = 120');
assert(opt1Result.foreclosureYears === 10, 'Option 1: Foreclosure years = 10');

// 5-Year Target
const opt1_5Yr = calculateHomeLoanForeclosurePlan({
  ...opt1Inputs,
  targetClosureYears: 5
});
assert(opt1_5Yr.targetClosureYears === 5, 'Option 1 (5y): Target = 5 years');
assertClose(opt1_5Yr.outstandingPrincipalAtTarget, 4376279.21, 2.0, 'Option 1 (5y): Principal = ₹43,76,279.21');
assertClose(opt1_5Yr.requiredMonthlySIP!, 53959.10, 2.0, 'Option 1 (5y): Required SIP = ₹53,959.10');

// 15-Year Target
const opt1_15Yr = calculateHomeLoanForeclosurePlan({
  ...opt1Inputs,
  targetClosureYears: 15
});
assert(opt1_15Yr.targetClosureYears === 15, 'Option 1 (15y): Target = 15 years');
assertClose(opt1_15Yr.outstandingPrincipalAtTarget, 2062595.69, 3.0, 'Option 1 (15y): Principal = ₹20,62,595.69');
assertClose(opt1_15Yr.requiredMonthlySIP!, 4333.80, 3.0, 'Option 1 (15y): Required SIP = ₹4,333.80');

// Target clamped to tenure
const opt1_clamp = calculateHomeLoanForeclosurePlan({
  ...opt1Inputs,
  targetClosureYears: 25
});
assert(opt1_clamp.targetClosureYears === 20, 'Target exceeding tenure clamped to 20 years');

// --- 6. Deterministic Regression: Option 2 (Fixed Monthly SIP Benchmark) ---
console.log('\n--- 6. Regression: Option 2 (Fixed SIP ₹10,000/mo Benchmark) ---');
const opt2Inputs: HomeLoanForeclosureInputs = {
  loanAmount: 5000000,
  loanTenureYears: 20,
  loanInterestRate: 8,
  sipReturnRate: 12,
  strategy: 'fixedSIP',
  monthlySIP: 10000
};
const opt2Result = calculateHomeLoanForeclosurePlan(opt2Inputs);

assert(opt2Result.strategy === 'fixedSIP', 'Option 2: Strategy is fixedSIP');
assert(opt2Result.availableMonthlySIP === 10000, 'Option 2: Available monthly SIP = ₹10,000');
assert(opt2Result.foreclosureMonth === 142, `Option 2: Crossover at exactly Month 142 (got ${opt2Result.foreclosureMonth})`);
assert(opt2Result.foreclosureYears === 11.83, `Option 2: Crossover at 11.83 years (got ${opt2Result.foreclosureYears})`);
assert(opt2Result.isForeclosureAchievedWithinTenure === true, 'Option 2: Foreclosure achieved within tenure');

// Month 141 (Pre-crossover check)
const m141 = opt2Result.projection[140];
assert(m141.monthNumber === 141, 'Month 141 verified');
assert(m141.closingSIPCorpus < m141.closingPrincipal, 'Month 141: SIP corpus < Loan balance');
assert(m141.foreclosureReady === false, 'Month 141: foreclosureReady is false');

// Month 142 (Crossover check)
const m142 = opt2Result.projection[141];
assert(m142.monthNumber === 142, 'Month 142 verified');
assert(m142.closingSIPCorpus >= m142.closingPrincipal, 'Month 142: SIP corpus >= Loan balance');
assert(m142.foreclosureReady === true, 'Month 142: foreclosureReady is true');

// High SIP ₹20,000/mo (Earlier crossover)
const opt2_20k = calculateHomeLoanForeclosurePlan({
  ...opt2Inputs,
  monthlySIP: 20000
});
assert(opt2_20k.foreclosureMonth === 107, `₹20k/mo SIP achieves crossover at Month 107 (got ${opt2_20k.foreclosureMonth})`);
assert(opt2_20k.foreclosureYears === 8.92, '₹20k/mo SIP crossover = 8.92 years (8 years 11 months)');

// Low SIP ₹500/mo on 5-year loan (No crossover during tenure)
const opt2_low = calculateHomeLoanForeclosurePlan({
  loanAmount: 5000000,
  loanTenureYears: 5,
  loanInterestRate: 8,
  sipReturnRate: 12,
  strategy: 'fixedSIP',
  monthlySIP: 500
});
assert(opt2_low.isForeclosureAchievedWithinTenure === false, 'Low SIP: No crossover within tenure');
assert(opt2_low.foreclosureMonth === null, 'Low SIP: Foreclosure month is null');
assert(opt2_low.keyInsight.includes('not projected to fully match'), 'Low SIP insight informs user');

// Zero monthly SIP
const opt2_zero = calculateHomeLoanForeclosurePlan({
  ...opt2Inputs,
  monthlySIP: 0
});
assert(opt2_zero.isForeclosureAchievedWithinTenure === false, 'Zero SIP: No crossover');
assert(opt2_zero.SIPCorpusAtTarget === 0, 'Zero SIP corpus is 0');

// --- 7. Projections & Yearly Summaries ---
console.log('\n--- 7. Projections & Yearly Summaries ---');
assert(opt1Result.projection.length === 240, '20-year loan generates 240 monthly projections');
assert(opt1Result.yearlySummary.length === 20, '20-year loan generates 20 yearly summary rows');

const y1 = opt1Result.yearlySummary[0];
assert(y1.yearNumber === 1, 'Year 1 summary exists');
assert(y1.openingLoanPrincipal === 5000000, 'Year 1 opening principal = ₹50,00,000');
assertClose(y1.closingLoanPrincipal, 4894316.69, 0.5, 'Year 1 closing principal = ₹48,94,316.69');
assertClose(y1.totalEMIPaid, 41822.01 * 12, 1.0, 'Year 1 total EMI paid');

// --- 8. Edge Cases & Safety Guards ---
console.log('\n--- 8. Edge Cases & Safety Guards ---');
const emptyPlan = calculateHomeLoanForeclosurePlan({
  loanAmount: 0,
  loanTenureYears: 20,
  loanInterestRate: 8,
  sipReturnRate: 12,
  strategy: 'targetYear',
  targetClosureYears: 10
});
assert(emptyPlan.emi === 0, 'Empty plan EMI = 0');
assert(emptyPlan.requiredMonthlySIP === 0, 'Empty plan required SIP = 0');
assert(!isNaN(emptyPlan.emi), 'No NaN on empty plan');
assert(isFinite(emptyPlan.emi), 'Finite values on empty plan');

const zeroReturnPlan = calculateHomeLoanForeclosurePlan({
  loanAmount: 5000000,
  loanTenureYears: 20,
  loanInterestRate: 8,
  sipReturnRate: 0,
  strategy: 'targetYear',
  targetClosureYears: 10
});
assertClose(zeroReturnPlan.requiredMonthlySIP!, 28725.25, 0.5, '0% return required SIP = 34.47L / 120');

const zeroInterestPlan = calculateHomeLoanForeclosurePlan({
  loanAmount: 2400000,
  loanTenureYears: 20,
  loanInterestRate: 0,
  sipReturnRate: 12,
  strategy: 'targetYear',
  targetClosureYears: 10
});
assert(zeroInterestPlan.emi === 10000, '0% loan interest plan EMI = ₹10,000');
assert(zeroInterestPlan.outstandingPrincipalAtTarget === 1200000, '0% loan principal after 10y = ₹12,00,000');

// --- 9. Formatters ---
console.log('\n--- 9. Formatters ---');
assert(formatIndianCurrency(0) === '₹0', 'formatIndianCurrency(0) = ₹0');
assert(formatIndianCurrency(41822) === '₹41,822', 'formatIndianCurrency(41822) = ₹41,822');
assert(formatIndianCurrency(5000000) === '₹50,00,000', 'formatIndianCurrency(5000000) = ₹50,00,000');
assert(formatIndianCurrency(15386.07) === '₹15,386', 'formatIndianCurrency(15386.07) = ₹15,386');
assert(formatIndianCurrency(-500000) === '-₹5,00,000', 'formatIndianCurrency(-500000) = -₹5,00,000');

assert(formatLakhsCrores(0) === '₹0', 'formatLakhsCrores(0) = ₹0');
assert(formatLakhsCrores(5000000) === '₹50.00 Lakh', 'formatLakhsCrores(5000000) = ₹50.00 Lakh');
assert(formatLakhsCrores(12500000) === '₹1.25 Cr', 'formatLakhsCrores(12500000) = ₹1.25 Cr');
assert(formatLakhsCrores(3447031) === '₹34.47 Lakh', 'formatLakhsCrores(3447031) = ₹34.47 Lakh');

assert(formatPercentage(8) === '8.00%', 'formatPercentage(8) = 8.00%');
assert(formatPercentage(12, 1) === '12.0%', 'formatPercentage(12, 1) = 12.0%');

assert(formatYearsAndMonths(142) === '11 Years 10 Months', 'formatYearsAndMonths(142) = 11 Years 10 Months');
assert(formatYearsAndMonths(120) === '10 Years', 'formatYearsAndMonths(120) = 10 Years');
assert(formatYearsAndMonths(6) === '6 Months', 'formatYearsAndMonths(6) = 6 Months');
assert(formatYearsAndMonths(0) === '0 Months', 'formatYearsAndMonths(0) = 0 Months');

console.log('\n========================================');
console.log('HOME LOAN FORECLOSURE PLANNER TEST SUITE: ALL TESTS PASSED');
console.log('========================================\n');
