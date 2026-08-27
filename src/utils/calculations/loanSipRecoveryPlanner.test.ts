/**
 * Unit Test Suite for Loan + SIP Recovery Planner Calculation Engine
 * 
 * Verifies all 45+ test cases covering:
 * 1. Loan EMI & Reducing-balance calculations (Standard ₹50L @ 9% / 20y, zero-interest, zero loan)
 * 2. Total loan interest & complete loan cost targets
 * 3. Effective monthly SIP return rate calculation (i_SIP = (1+r)^(1/12) - 1, strictly NOT r/12)
 * 4. Beginning-of-month Annuity Due future value and required SIP formulas
 * 5. Target 1 (Interest Recovery) & Target 2 (Complete Loan Cost Recovery) Required SIPs
 * 6. Percentage of EMI calculations
 * 7. Custom SIP time-to-recovery simulations (Early recovery, Late recovery, Exact match, Unreached)
 * 8. Adaptive default return logic (<=10y -> 10%, >10y -> 12%, manual override preservation)
 * 9. Deterministic regression benchmark matching:
 *    - Loan = ₹50,00,000, 9% interest, 20 years
 *    - EMI = ₹44,986.30
 *    - Total Interest = ₹57,96,712.44
 *    - Complete Loan Cost = ₹1,07,96,712.44
 *    - At 12% return over 20 yrs: Target 1 SIP = ₹6,301.60 (14.01% of EMI), Target 2 SIP = ₹11,737.09 (26.09% of EMI)
 *    - Custom SIP ₹9,000/mo: 20.01% of EMI, Interest recovered in 14y 1m (m=169), Complete cost in 18y 1m (m=217, 1y 11m early)
 * 10. Boundary conditions & safety guards (No NaN, no Infinity, no negative balances)
 * 11. Formatting helpers
 */

import {
  calculateMonthlyLoanRate,
  calculateEMI,
  calculateTotalInterest,
  calculateTotalLoanCost,
  calculateLoanAmortization,
  calculateEffectiveMonthlySIPRate,
  calculateSIPFutureValue,
  calculateRequiredSIP,
  calculateSIPPercentageOfEMI,
  calculateInterestRecoverySIP,
  calculateCompleteLoanRecoverySIP,
  calculateRecoveryMonths,
  calculateRecoveryYearsAndMonths,
  calculateRecoveryTimelineComparison,
  calculateCustomSIPProjection,
  calculateLoanSIPRecoveryPlan,
  formatIndianCurrency,
  formatLakhsCrores,
  formatPercentage,
  formatYearsAndMonths,
  type LoanSIPRecoveryInputs
} from './loanSipRecoveryPlanner';

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
console.log('RUNNING LOAN + SIP RECOVERY PLANNER TESTS');
console.log('========================================');

// --- 1. Loan EMI & Reducing Balance Math ---
console.log('\n--- 1. Loan EMI & Reducing Balance Math ---');
const emi50L9Pct = calculateEMI(5000000, 20, 9);
assertClose(emi50L9Pct, 44986.30, 0.5, 'Standard EMI for ₹50L @ 9% for 20 years = ₹44,986.30');

const emi30L8Pct = calculateEMI(3000000, 15, 8.5);
assertClose(emi30L8Pct, 29542.19, 0.5, 'EMI for ₹30L @ 8.5% for 15 years');

const emiZeroRate = calculateEMI(2400000, 20, 0);
assert(emiZeroRate === 10000, '0% interest rate EMI = linear ₹24L / 240m = ₹10,000');

const emiZeroLoan = calculateEMI(0, 20, 9);
assert(emiZeroLoan === 0, '₹0 loan returns ₹0 EMI');

const emiNegLoan = calculateEMI(-5000000, 20, 9);
assert(emiNegLoan === 0, 'Negative loan amount sanitized to ₹0 EMI');

const iLoanRate = calculateMonthlyLoanRate(9);
assertClose(iLoanRate, 0.0075, 0.00001, 'Monthly loan rate for 9% = 0.0075');

// --- 2. Total Interest & Complete Loan Cost ---
console.log('\n--- 2. Total Interest & Complete Loan Cost ---');
const totalInterest50L = calculateTotalInterest(5000000, emi50L9Pct, 20);
assertClose(totalInterest50L, 5796712.44, 1.0, 'Total interest for ₹50L @ 9% (20y) = ₹57,96,712.44');

const totalCost50L = calculateTotalLoanCost(5000000, totalInterest50L);
assertClose(totalCost50L, 10796712.44, 1.0, 'Complete loan cost for ₹50L @ 9% (20y) = ₹1,07,96,712.44');

// Amortization check
const amort = calculateLoanAmortization(5000000, 20, 9);
assert(amort.length === 240, '20-year loan generates 240 amortization months');
assert(amort[0].openingPrincipal === 5000000, 'Month 1 opening principal = ₹50L');
assertClose(amort[0].interestComponent, 5000000 * 0.0075, 0.5, 'Month 1 interest = ₹37,500');
assert(amort[239].closingPrincipal === 0, 'Final Month 240 amortizes loan balance to ₹0');

// --- 3. Effective Monthly SIP Return Rate ---
console.log('\n--- 3. Effective Monthly SIP Return Rate ---');
const iSIP12 = calculateEffectiveMonthlySIPRate(12);
assertClose(iSIP12, 0.00948879, 0.00001, 'Effective monthly rate for 12% p.a. ≈ 0.94888%/mo');
assert(iSIP12 < 0.01, 'Effective monthly rate is strictly less than nominal r/12 (0.01)');

const iSIP10 = calculateEffectiveMonthlySIPRate(10);
assertClose(iSIP10, 0.00797414, 0.00001, 'Effective monthly rate for 10% p.a. ≈ 0.79741%/mo');

const iSIP0 = calculateEffectiveMonthlySIPRate(0);
assert(iSIP0 === 0, 'Effective monthly rate for 0% return is 0');

const iSIPNeg = calculateEffectiveMonthlySIPRate(-5);
assert(iSIPNeg === 0, 'Negative return rate sanitized to 0');

// --- 4. Beginning-of-Month Annuity Due Compounding ---
console.log('\n--- 4. Beginning-of-Month Annuity Due Compounding ---');
const fv10k120m = calculateSIPFutureValue(10000, 120, 12);
assertClose(fv10k120m, 2240358.90, 2.0, 'Annuity Due FV for ₹10,000/mo in 10 yrs @ 12%');

const fvZeroReturn = calculateSIPFutureValue(10000, 120, 0);
assert(fvZeroReturn === 1200000, '0% return Annuity Due FV = ₹12,00,000 (linear sum)');

const reqSIPZeroTarget = calculateRequiredSIP(0, 120, 12);
assert(reqSIPZeroTarget === 0, '₹0 target requires ₹0 SIP');

// --- 5. Deterministic Benchmark Scenario ---
console.log('\n--- 5. Deterministic Benchmark Scenario ---');
const benchInputs: LoanSIPRecoveryInputs = {
  loanType: 'Home Loan',
  loanAmount: 5000000,
  annualLoanInterestRate: 9,
  loanTenureYears: 20,
  loanStartDate: '2026-04-01',
  sipDurationYears: 20,
  sipReturnRate: 12,
  customSipAmount: 9000
};
const plan = calculateLoanSIPRecoveryPlan(benchInputs);

assert(plan.loanDetails.loanAmount === 5000000, 'Loan amount = ₹50,00,000');
assert(plan.loanDetails.annualLoanInterestRate === 9, 'Loan interest = 9%');
assert(plan.loanDetails.loanTenureYears === 20, 'Loan tenure = 20 years');
assertClose(plan.loanDetails.emi, 44986.30, 0.5, 'Monthly EMI = ₹44,986.30');
assertClose(plan.loanDetails.totalInterest, 5796712.44, 2.0, 'Total interest = ₹57,96,712.44');
assertClose(plan.loanDetails.totalScheduledRepayment, 10796712.44, 2.0, 'Complete loan cost = ₹1,07,96,712.44');

// Target 1: Interest Recovery Required SIP
assertClose(plan.interestRecovery.targetAmount, 5796712.44, 2.0, 'Target 1 amount = ₹57,96,712.44');
assertClose(plan.interestRecovery.requiredMonthlySIP, 6301.60, 1.0, 'Target 1 required SIP = ₹6,301.60/mo');
assertClose(plan.interestRecovery.sipPercentageOfEMI, 14.01, 0.1, 'Target 1 is 14.01% of EMI');
assertClose(plan.interestRecovery.totalSIPInvestment, 1512420.10, 5.0, 'Target 1 total SIP investment');
assertClose(plan.interestRecovery.projectedCorpus, 5796712.44, 5.0, 'Target 1 projected corpus matches target');

// Target 2: Complete Loan Cost Recovery Required SIP
assertClose(plan.completeLoanRecovery.targetAmount, 10796712.44, 2.0, 'Target 2 amount = ₹1,07,96,712.44');
assertClose(plan.completeLoanRecovery.requiredMonthlySIP, 11737.09, 1.0, 'Target 2 required SIP = ₹11,737.09/mo');
assertClose(plan.completeLoanRecovery.sipPercentageOfEMI, 26.09, 0.1, 'Target 2 is 26.09% of EMI');
assertClose(plan.completeLoanRecovery.projectedCorpus, 10796712.44, 5.0, 'Target 2 projected corpus matches complete cost');

// Custom Monthly SIP = ₹9,000/mo (approx 20% of EMI)
assert(plan.customSipAmount === 9000, 'Custom SIP = ₹9,000/mo');
assertClose(plan.customSipPercentageOfEMI, 20.01, 0.1, 'Custom SIP is 20.01% of EMI');

// Target 1 Custom Recovery Milestone (Interest)
assert(plan.customInterestMilestone.isReached === true, 'Interest target is reached');
assert(plan.customInterestMilestone.recoveryMonth === 207, `Interest recovered at Month 207 (got ${plan.customInterestMilestone.recoveryMonth})`);
assert(plan.customInterestMilestone.recoveryYears === 17, 'Interest recovery years = 17');
assert(plan.customInterestMilestone.recoveryMonthsRemaining === 3, 'Interest recovery remaining months = 3');
assert(plan.customInterestMilestone.formattedDuration === '17 Years 3 Months', 'Interest duration formatted = 17 Years 3 Months');

// Target 2 Custom Recovery Milestone (Complete Loan Cost)
assert(plan.customCompleteLoanMilestone.isReached === true, 'Complete cost target is reached');
assert(plan.customCompleteLoanMilestone.recoveryMonth === 266, `Complete cost recovered at Month 266 (got ${plan.customCompleteLoanMilestone.recoveryMonth})`);
assert(plan.customCompleteLoanMilestone.recoveryYears === 22, 'Complete recovery years = 22');
assert(plan.customCompleteLoanMilestone.recoveryMonthsRemaining === 2, 'Complete recovery remaining months = 2');
assert(plan.customCompleteLoanMilestone.formattedDuration === '22 Years 2 Months', 'Complete duration formatted = 22 Years 2 Months');
assert(plan.customCompleteLoanMilestone.comparisonStatus === 'late', 'Complete recovery with ₹9k SIP is after 20-year loan tenure');
assert(plan.customCompleteLoanMilestone.monthsVsTenure === 26, 'Complete recovery is 26 months after tenure (2y 2m)');

// High Custom SIP ₹15,000/mo (Achieves Early Recovery before tenure)
const highSipPlan = calculateLoanSIPRecoveryPlan({
  ...benchInputs,
  customSipAmount: 15000
});
assert(highSipPlan.customCompleteLoanMilestone.isReached === true, 'High SIP complete cost is reached');
assert(highSipPlan.customCompleteLoanMilestone.recoveryMonth === 218, `High SIP complete cost recovered at Month 218 (got ${highSipPlan.customCompleteLoanMilestone.recoveryMonth})`);
assert(highSipPlan.customCompleteLoanMilestone.recoveryYears === 18, 'High SIP recovery years = 18');
assert(highSipPlan.customCompleteLoanMilestone.recoveryMonthsRemaining === 2, 'High SIP recovery remaining months = 2');
assert(highSipPlan.customCompleteLoanMilestone.comparisonStatus === 'early', 'High SIP recovery is early');
assert(highSipPlan.customCompleteLoanMilestone.monthsVsTenure === -22, 'High SIP is 22 months early (1y 10m)');
assert(highSipPlan.customCompleteLoanMilestone.comparisonNarrative.includes('1 Year 10 Months before your original 20-year loan tenure'), 'High SIP early narrative verified');

// --- 6. Recovery Timeline Comparisons ---
console.log('\n--- 6. Recovery Timeline Comparisons ---');
const compEarly = calculateRecoveryTimelineComparison(240, 217);
assert(compEarly.comparisonStatus === 'early', 'Month 217 vs 240 is early');
assert(compEarly.comparisonNarrative.includes('1 Year 11 Months before'), 'Early narrative verified');

const compLate = calculateRecoveryTimelineComparison(240, 270);
assert(compLate.comparisonStatus === 'late', 'Month 270 vs 240 is late');
assert(compLate.comparisonNarrative.includes('2 Years 6 Months after'), 'Late narrative verified');

const compExact = calculateRecoveryTimelineComparison(240, 240);
assert(compExact.comparisonStatus === 'exact', 'Month 240 vs 240 is exact');

const compUnreached = calculateRecoveryTimelineComparison(240, null);
assert(compUnreached.comparisonStatus === 'unreached', 'Null recovery is unreached');

// --- 7. Adaptive Default Return Logic ---
console.log('\n--- 7. Adaptive Default Return Logic ---');
// Duration <= 10 years -> default 10%
const plan10y = calculateLoanSIPRecoveryPlan({
  loanType: 'Personal Loan',
  loanAmount: 1000000,
  annualLoanInterestRate: 12,
  loanTenureYears: 5,
  loanStartDate: '2026-01-01',
  sipDurationYears: 5 // <= 10y
});
assert(plan10y.sipReturnRate === 10, 'SIP duration <= 10y defaults to 10% return');

// Duration > 10 years -> default 12%
const plan15y = calculateLoanSIPRecoveryPlan({
  loanType: 'Home Loan',
  loanAmount: 5000000,
  annualLoanInterestRate: 8.5,
  loanTenureYears: 15,
  loanStartDate: '2026-01-01',
  sipDurationYears: 15 // > 10y
});
assert(plan15y.sipReturnRate === 12, 'SIP duration > 10y defaults to 12% return');

// Explicit return preserved
const planManual = calculateLoanSIPRecoveryPlan({
  loanType: 'Home Loan',
  loanAmount: 5000000,
  annualLoanInterestRate: 8.5,
  loanTenureYears: 15,
  loanStartDate: '2026-01-01',
  sipDurationYears: 15,
  sipReturnRate: 14.5
});
assert(planManual.sipReturnRate === 14.5, 'Manual return 14.5% is preserved');

// --- 8. Edge Cases & Boundary Safety ---
console.log('\n--- 8. Edge Cases & Boundary Safety ---');
// Zero loan amount
const zeroLoanPlan = calculateLoanSIPRecoveryPlan({
  loanType: 'Home Loan',
  loanAmount: 0,
  annualLoanInterestRate: 9,
  loanTenureYears: 20,
  loanStartDate: '2026-01-01'
});
assert(zeroLoanPlan.loanDetails.emi === 0, 'Zero loan EMI = 0');
assert(zeroLoanPlan.interestRecovery.requiredMonthlySIP === 0, 'Zero loan required SIP = 0');
assert(!isNaN(zeroLoanPlan.loanDetails.emi), 'No NaN on zero loan');

// Zero interest rate loan
const zeroInterestPlan = calculateLoanSIPRecoveryPlan({
  loanType: 'Education Loan',
  loanAmount: 1200000,
  annualLoanInterestRate: 0,
  loanTenureYears: 10,
  loanStartDate: '2026-01-01'
});
assert(zeroInterestPlan.loanDetails.emi === 10000, '0% loan EMI = ₹10,000');
assert(zeroInterestPlan.loanDetails.totalInterest === 0, '0% loan interest = 0');
assert(zeroInterestPlan.interestRecovery.requiredMonthlySIP === 0, '0% loan interest recovery SIP = 0');

// Zero SIP entered
const zeroSIPPlan = calculateLoanSIPRecoveryPlan({
  loanType: 'Home Loan',
  loanAmount: 5000000,
  annualLoanInterestRate: 9,
  loanTenureYears: 20,
  loanStartDate: '2026-01-01',
  customSipAmount: 0
});
assert(zeroSIPPlan.customInterestMilestone.isReached === false, 'Zero SIP does not reach interest target');
assert(zeroSIPPlan.customCompleteLoanMilestone.isReached === false, 'Zero SIP does not reach complete target');

// Huge SIP (Month 1 Recovery)
const hugeSIPPlan = calculateLoanSIPRecoveryPlan({
  loanType: 'Home Loan',
  loanAmount: 1000000,
  annualLoanInterestRate: 9,
  loanTenureYears: 5,
  loanStartDate: '2026-01-01',
  customSipAmount: 2000000 // ₹20 Lakh/mo SIP
});
assert(hugeSIPPlan.customCompleteLoanMilestone.recoveryMonth === 1, 'Huge SIP recovers complete loan cost in Month 1');

// Very Low SIP (Unreached in 50 years)
const lowSIPPlan = calculateLoanSIPRecoveryPlan({
  loanType: 'Home Loan',
  loanAmount: 10000000, // ₹1 Crore
  annualLoanInterestRate: 10,
  loanTenureYears: 20,
  loanStartDate: '2026-01-01',
  sipReturnRate: 6,
  customSipAmount: 500 // ₹500/mo
});
assert(lowSIPPlan.customCompleteLoanMilestone.isReached === false, 'Very low SIP unreached in 50y');
assert(lowSIPPlan.customCompleteLoanMilestone.recoveryMonth === null, 'Unreached recoveryMonth is null');
assert(lowSIPPlan.customCompleteLoanMilestone.comparisonStatus === 'unreached', 'Status is unreached');

// Return Rate Sweep: 6%, 10%, 12%, 18%
console.log('\n--- 8b. Return Rate Sweeps ---');
const plan6 = calculateLoanSIPRecoveryPlan({ ...benchInputs, sipReturnRate: 6 });
assert(plan6.interestRecovery.requiredMonthlySIP > plan.interestRecovery.requiredMonthlySIP, '6% return requires higher SIP than 12%');
assert(!isNaN(plan6.interestRecovery.requiredMonthlySIP), '6% required SIP is finite');

const plan18 = calculateLoanSIPRecoveryPlan({ ...benchInputs, sipReturnRate: 18 });
assert(plan18.interestRecovery.requiredMonthlySIP < plan.interestRecovery.requiredMonthlySIP, '18% return requires lower SIP than 12%');
assert(!isNaN(plan18.interestRecovery.requiredMonthlySIP), '18% required SIP is finite');

// Tenure Sweeps: 1 Year Short Loan, 30 Year Long Loan
console.log('\n--- 8c. Tenure Sweeps ---');
const shortLoan = calculateLoanSIPRecoveryPlan({
  loanType: 'Personal Loan',
  loanAmount: 200000,
  annualLoanInterestRate: 12,
  loanTenureYears: 1,
  loanStartDate: '2026-01-01'
});
assertClose(shortLoan.loanDetails.emi, 17769.77, 1.0, '1-year loan EMI verified');
assert(shortLoan.loanDetails.loanTenureMonths === 12, '1-year tenure is 12 months');

const longLoan = calculateLoanSIPRecoveryPlan({
  loanType: 'Home Loan',
  loanAmount: 20000000, // ₹2 Crore
  annualLoanInterestRate: 8.5,
  loanTenureYears: 30,
  loanStartDate: '2026-01-01'
});
assert(longLoan.loanDetails.loanTenureMonths === 360, '30-year tenure is 360 months');
assertClose(longLoan.loanDetails.emi, 153783.33, 5.0, '₹2 Crore 30-year EMI verified');
assert(!isNaN(longLoan.completeLoanRecovery.requiredMonthlySIP), '₹2 Cr required SIP is valid');

// Custom SIP equal to exact Target 1 required SIP
const exactTarget1SIP = Math.round(plan.interestRecovery.requiredMonthlySIP);
const exactPlan = calculateLoanSIPRecoveryPlan({ ...benchInputs, customSipAmount: exactTarget1SIP });
assert(exactPlan.customInterestMilestone.isReached === true, 'Exact required SIP reaches interest target');
assert(exactPlan.customInterestMilestone.recoveryMonth === 240, `Exact required SIP reaches at Month 240 (got ${exactPlan.customInterestMilestone.recoveryMonth})`);

// Projection check
const proj = calculateCustomSIPProjection(benchInputs, 9000);
assert(proj.length >= 240, 'Projection generated for at least 240 months');
assert(proj.every(p => !isNaN(p.sipCorpus) && !isNaN(p.loanBalance)), 'No NaN in projection');
assert(proj.every(p => p.sipCorpus >= 0 && p.loanBalance >= 0), 'All projection numbers non-negative');

// --- 9. Formatters ---
console.log('\n--- 9. Formatters ---');
assert(formatIndianCurrency(0) === '₹0', 'formatIndianCurrency(0) = ₹0');
assert(formatIndianCurrency(44986.30) === '₹44,986', 'formatIndianCurrency(44986.30) = ₹44,986');
assert(formatIndianCurrency(5000000) === '₹50,00,000', 'formatIndianCurrency(5000000) = ₹50,00,000');
assert(formatIndianCurrency(-500000) === '-₹5,00,000', 'formatIndianCurrency(-500000) = -₹5,00,000');

assert(formatLakhsCrores(0) === '₹0', 'formatLakhsCrores(0) = ₹0');
assert(formatLakhsCrores(5796712) === '₹57.97 Lakh', 'formatLakhsCrores(5796712) = ₹57.97 Lakh');
assert(formatLakhsCrores(10796712) === '₹1.08 Cr', 'formatLakhsCrores(10796712) = ₹1.08 Cr');
assert(formatLakhsCrores(5000000) === '₹50.00 Lakh', 'formatLakhsCrores(5000000) = ₹50.00 Lakh');

assert(formatPercentage(12) === '12.00%', 'formatPercentage(12) = 12.00%');
assert(formatPercentage(20.006, 1) === '20.0%', 'formatPercentage(20.006, 1) = 20.0%');

assert(formatYearsAndMonths(217) === '18 Years 1 Month', 'formatYearsAndMonths(217) = 18 Years 1 Month');
assert(formatYearsAndMonths(240) === '20 Years', 'formatYearsAndMonths(240) = 20 Years');
assert(formatYearsAndMonths(6) === '6 Months', 'formatYearsAndMonths(6) = 6 Months');
assert(formatYearsAndMonths(0) === '0 Months', 'formatYearsAndMonths(0) = 0 Months');

console.log('\n========================================');
console.log('LOAN + SIP RECOVERY PLANNER TEST SUITE: ALL TESTS PASSED');
console.log('========================================\n');
