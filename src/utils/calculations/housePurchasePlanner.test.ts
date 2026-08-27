/**
 * Unit Test Suite for Home Purchase Planning Calculation Engine
 * 
 * Verifies all 25 specific test categories covering goal planning methodology,
 * property compounding, acquisition cost separation, loan amounts, 8% income growth,
 * EMI calculations, dynamic asset aggregation, lumpsum, fixed SIP, and Step-Up SIP.
 */

import {
  calculateFuturePropertyValue,
  calculateAdditionalPurchaseCosts,
  calculateTotalFutureCost,
  calculateHomeLoanAmount,
  calculateDownPayment,
  calculateTotalAmountToAccumulate,
  calculateProjectedMonthlyIncome,
  calculateIdealMonthlyEMILimit,
  calculateHomeLoanEMI,
  calculateTotalEarmarkedAssets,
  calculateFundingProgress,
  calculateFundingDeficit,
  calculateRequiredLumpSum,
  calculateRequiredFixedSIP,
  calculateRequiredStepUpSIP,
  calculateHousePurchasePlan,
  formatIndianCurrency,
  formatLakhsCrores,
  type HousePurchasePlannerInput,
  type EarmarkedAsset
} from './housePurchasePlanner';

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
console.log('RUNNING HOME PURCHASE PLANNER TESTS');
console.log('========================================');

// --- 1. Testing Future Property Value ---
console.log('\n--- 1. Testing Future Property Value ---');
// ₹1 Cr @ 6% for 6 years: 10000000 * (1.06)^6 = 14185191.12 => 14185191 or 14185192
const fpv6 = calculateFuturePropertyValue(10000000, 6, 6);
assertClose(fpv6, 14185191, 2, '₹1 Cr @ 6% for 6 yrs ≈ ₹1,41,85,191');
assert(calculateFuturePropertyValue(0, 6, 6) === 0, 'Zero property value returns 0');
assert(calculateFuturePropertyValue(10000000, 0, 6) === 10000000, '0% growth returns original value');
assert(calculateFuturePropertyValue(10000000, 6, 0) === 10000000, '0 years returns original value');

// --- 2. Testing Additional Purchase Costs ---
console.log('\n--- 2. Testing Additional Purchase Costs ---');
// 10% on ₹1,41,85,191 = 1418519.1 => 1418519
const addCost = calculateAdditionalPurchaseCosts(14185191, 10);
assertClose(addCost, 1418519, 1, '10% additional costs on ₹1.418 Cr ≈ ₹14,18,519');
assert(calculateAdditionalPurchaseCosts(0, 10) === 0, 'Zero property value gives 0 additional cost');
assert(calculateAdditionalPurchaseCosts(14185191, 0) === 0, '0% additional costs gives 0');
const totalCost = calculateTotalFutureCost(14185191, 1418519);
assert(totalCost === 15603710, 'Total future cost equals property + acquisition costs (₹1.56 Cr)');

// --- 3. Testing Home Loan Amount & Down Payment ---
console.log('\n--- 3. Testing Home Loan Amount & Down Payment ---');
// Loan is calculated strictly on property value (₹1,41,85,191), NOT including additional costs!
// 80% of 14185191 = 11348152.8 => 11348153
const loanAmt = calculateHomeLoanAmount(14185191, 80);
assertClose(loanAmt, 11348153, 1, '80% loan on ₹1.418 Cr ≈ ₹1,13,48,153');

// Down payment = 14185191 - 11348153 = 2837038 (20%)
const downPmt = calculateDownPayment(14185191, loanAmt);
assertClose(downPmt, 2837038, 1, 'Down payment = ₹28,37,038');

// Total amount to accumulate = Down Payment + Additional Purchase Costs
// 2837038 + 1418519 = 4255557
const totalAccumulate = calculateTotalAmountToAccumulate(downPmt, addCost);
assertClose(totalAccumulate, 4255557, 1, 'Total to accumulate = Down payment + Acquisition costs ≈ ₹42,55,557');
assert(calculateHomeLoanAmount(14185191, 0) === 0, '0% loan funding produces ₹0 loan');
assert(calculateDownPayment(14185191, 0) === 14185191, '0% loan funding requires 100% down payment');

// --- 4. Testing Projected Income & Ideal EMI Limit ---
console.log('\n--- 4. Testing Projected Income & Ideal EMI Limit ---');
// ₹1,00,000/mo growing at 8% p.a. for 6 years: 100000 * (1.08)^6 = 158687.43 => 158687
const projIncome = calculateProjectedMonthlyIncome(100000, 8, 6);
assertClose(projIncome, 158687, 1, '₹1 Lakh/mo @ 8% growth for 6 yrs ≈ ₹1,58,687/mo');
// Ideal 40% EMI limit: 158687 * 0.40 = 63474.8 => 63475
const emiLimit = calculateIdealMonthlyEMILimit(projIncome, 40);
assertClose(emiLimit, 63475, 1, '40% EMI limit on ₹1,58,687 ≈ ₹63,475/mo');
assert(calculateProjectedMonthlyIncome(0, 8, 6) === 0, 'Zero current income returns 0');
assert(calculateProjectedMonthlyIncome(100000, 0, 6) === 100000, '0% income growth preserves original income');

// --- 5. Testing Home Loan Monthly EMI ---
console.log('\n--- 5. Testing Home Loan Monthly EMI ---');
// ₹1,13,48,153 loan @ 8.5% annual for 20 years (240 months)
// r_m = 0.085 / 12 = 0.007083333333333333
// EMI = 11348153 * (0.00708333333 * (1.00708333333)^240) / ((1.0070833333)^240 - 1)
// Standard financial calculator result: ₹98,479
const homeEmi = calculateHomeLoanEMI(11348153, 8.5, 20);
assertClose(homeEmi, 98482, 1, '₹1.1348 Cr loan @ 8.5% for 20 yrs ≈ ₹98,482/mo');

// Zero interest loan: ₹12 Lakh for 10 years (120 months) => ₹10,000/mo
const zeroIntEmi = calculateHomeLoanEMI(1200000, 0, 10);
assert(zeroIntEmi === 10000, '0% interest loan divides principal evenly across months (₹10,000/mo)');
assert(calculateHomeLoanEMI(0, 8.5, 20) === 0, 'Zero loan amount produces ₹0 EMI');

// --- 6. Testing Existing Assets, Progress & Deficit ---
console.log('\n--- 6. Testing Existing Assets, Progress & Deficit ---');
const sampleAssets: EarmarkedAsset[] = [
  { id: '1', name: 'Mutual Funds', amount: 1000000 },
  { id: '2', name: 'Fixed Deposit', amount: 500000 },
  { id: '3', name: 'Gold', amount: 200000 }
];
const totalAssets = calculateTotalEarmarkedAssets(sampleAssets);
assert(totalAssets === 1700000, 'Total earmarked assets = ₹17,00,000');

// Progress on ₹42,55,557 target: (1700000 / 4255557) * 100 = 39.948% => 39.9%
const progress = calculateFundingProgress(4255557, totalAssets);
assertClose(progress, 39.9, 0.2, 'Funding progress ≈ 39.9%');

// Deficit: 4255557 - 1700000 = 2555557
const deficit = calculateFundingDeficit(4255557, totalAssets);
assert(deficit === 2555557, 'Funding deficit = ₹25,55,557');

// Overfunded test
const overfundedProgress = calculateFundingProgress(1000000, 1500000);
assert(overfundedProgress === 100, 'Overfunded progress is capped at 100%');
const overfundedDeficit = calculateFundingDeficit(1000000, 1500000);
assert(overfundedDeficit === 0, 'Overfunded deficit is capped at ₹0');

// Zero target test
assert(calculateFundingProgress(0, 500000) === 100, 'Zero target returns 100% progress');
assert(calculateFundingDeficit(0, 500000) === 0, 'Zero target returns ₹0 deficit');

// --- 7. Testing Required Lump Sum ---
console.log('\n--- 7. Testing Required Lump Sum ---');
// ₹25,55,557 deficit @ 12% return for 6 years: 2555557 / (1.12)^6 = 2555557 / 1.973822685 = 1294724.7 => 1294725
const lumpSum = calculateRequiredLumpSum(2555557, 12, 6);
assertClose(lumpSum, 1294725, 2, 'Lump sum required for ₹25.55L @ 12% for 6 yrs ≈ ₹12,94,725');
assert(calculateRequiredLumpSum(2555557, 0, 6) === 2555557, '0% return requires full deficit as lump sum');
assert(calculateRequiredLumpSum(2555557, 12, 0) === 2555557, '0 investment period requires full deficit');
assert(calculateRequiredLumpSum(0, 12, 6) === 0, 'Zero deficit requires ₹0 lump sum');

// --- 8. Testing Required Fixed Monthly SIP ---
console.log('\n--- 8. Testing Required Fixed Monthly SIP ---');
// ₹25,55,557 deficit @ 12% return for 6 years (72 months):
// i = 0.12 / 12 = 0.01
// PMT = 2555557 * 0.01 / ((1.01)^72 - 1) = 25555.57 / (2.047099 - 1) = 25555.57 / 1.0470993 = 24406.06 => ₹24,406
const fixedSip = calculateRequiredFixedSIP(2555557, 12, 6);
assertClose(fixedSip, 24406, 2, 'Fixed monthly SIP for ₹25.55L @ 12% for 6 yrs ≈ ₹24,406/mo');
// 0% return: 2555557 / 72 = 35493.8 => 35494
const zeroRetSip = calculateRequiredFixedSIP(2555557, 0, 6);
assertClose(zeroRetSip, 35494, 2, '0% return divides deficit evenly by 72 months (₹35,494/mo)');
assert(calculateRequiredFixedSIP(0, 12, 6) === 0, 'Zero deficit requires ₹0 SIP');

// --- 9. Testing Required Step-Up SIP ---
console.log('\n--- 9. Testing Required Step-Up SIP ---');
// Step-Up formula:
// Deficit = 2555557, r = 0.12, g = 0.10, t = 6
// Numerator = 2555557 * (0.12 - 0.10) = 51111.14
// Denominator = (1.12)^6 - (1.10)^6 = 1.973822685 - 1.771561 = 0.202261685
// FV1 = 51111.14 / 0.202261685 = 252698.08
// -PMT(0.12/12, 12, 0, 252698.08, 0) = 252698.08 * 0.01 / ((1.01)^12 - 1)
// (1.01)^12 - 1 = 0.12682503
// Starting PMT = 2526.9808 / 0.12682503 = 19924.94 => ₹19,925
const stepUpSip = calculateRequiredStepUpSIP(2555557, 12, 6, 10);
assertClose(stepUpSip, 19925, 2, 'Starting Step-Up SIP (10% annual increase) ≈ ₹19,925/mo');
assert(stepUpSip < fixedSip, 'Starting Step-Up SIP is lower than flat fixed SIP (₹19,925 < ₹24,406)');
assert(calculateRequiredStepUpSIP(0, 12, 6, 10) === 0, 'Zero deficit requires ₹0 Step-Up SIP');

// Special case: r == g (e.g. 10% return and 10% step-up)
const equalRateStepUp = calculateRequiredStepUpSIP(1000000, 10, 5, 10);
assert(equalRateStepUp > 0 && !isNaN(equalRateStepUp) && isFinite(equalRateStepUp), 'Equal return and step-up (r=g) does not produce NaN/0');

// --- 10. Testing Investment Start Delay ---
console.log('\n--- 10. Testing Investment Start Delay ---');
// 6-year goal with 2-year delay => 4-year remaining period
const delayedSip = calculateRequiredFixedSIP(2555557, 12, 4);
assert(delayedSip > fixedSip, 'Delayed SIP has shorter horizon and requires higher monthly amount');
assertClose(delayedSip, 41742, 1, '4-year fixed SIP for ₹25.55L @ 12% ≈ ₹41,742/mo');

// --- 11. Testing Full Master End-to-End Orchestrator (Deterministic Indore 3 BHK Scenario) ---
console.log('\n--- 11. Testing Full Master End-to-End Orchestrator ---');
const sampleInput: HousePurchasePlannerInput = {
  goal: {
    currentPropertyValue: 10000000, // ₹1 Crore
    yearsToPurchase: 6,
    location: 'Indore',
    homeType: '3 BHK'
  },
  cost: {
    propertyGrowthRate: 6, // 6%
    additionalCostPercent: 10 // 10%
  },
  loan: {
    homeLoanFundingPercent: 80, // 80%
    homeLoanInterestRate: 8.5, // 8.5%
    loanTenureYears: 20 // 20 yrs
  },
  income: {
    currentMonthlyIncome: 150000, // ₹1.5 Lakh/mo
    incomeGrowthRate: 8, // 8%
    idealEMIPercent: 40 // 40%
  },
  earmarkedAssets: [
    { id: '1', name: 'Mutual Funds', amount: 1000000 },
    { id: '2', name: 'Fixed Deposits', amount: 500000 }
  ],
  funding: {
    expectedInvestmentReturn: 12, // 12%
    startInvestingDelay: 0,
    annualStepUpPercent: 10 // 10%
  }
};

const result = calculateHousePurchasePlan(sampleInput);

assert(result.currentPropertyValue === 10000000, 'Current Property Value = ₹1 Crore');
assert(result.yearsToPurchase === 6, 'Years to purchase = 6');
assertClose(result.futurePropertyValue, 14185191, 2, 'Future Property Value ≈ ₹1,41,85,191');
assertClose(result.additionalPurchaseCosts, 1418519, 2, 'Additional Costs (10%) ≈ ₹14,18,519');
assertClose(result.totalFutureCost, 15603710, 2, 'Total Future Cost ≈ ₹1,56,03,710');
assertClose(result.homeLoanAmount, 11348153, 2, 'Home Loan Amount (80%) ≈ ₹1,13,48,153');
assertClose(result.downPayment, 2837038, 2, 'Down Payment (20%) ≈ ₹28,37,038');
assertClose(result.totalAmountToAccumulate, 4255557, 2, 'Total to Accumulate ≈ ₹42,55,557');
assert(result.totalEarmarkedAssets === 1500000, 'Total Earmarked Assets = ₹15,00,000');
assertClose(result.fundingProgress, 35.2, 0.2, 'Funding Progress ≈ 35.2%');
assertClose(result.fundingDeficit, 2755557, 2, 'Funding Deficit ≈ ₹27,55,557');
assertClose(result.projectedMonthlyIncome, 238031, 2, 'Projected Income @ 8% growth ≈ ₹2,38,031/mo');
assertClose(result.idealMonthlyEMILimit, 95212, 2, 'Ideal 40% EMI limit ≈ ₹95,212/mo');
assertClose(result.estimatedHomeLoanEMI, 98482, 1, 'Estimated Loan EMI @ 8.5% for 20 yrs ≈ ₹98,482/mo');
assert(result.isEMIAffordable === false, 'EMI (₹98,482) is slightly above 40% limit (₹95,212)');
assertClose(result.requiredLumpSum, 1396051, 2, 'Required Lump Sum Today ≈ ₹13,96,051');
assertClose(result.requiredFixedSIP, 26316, 2, 'Required Fixed Monthly SIP ≈ ₹26,316/mo');
assertClose(result.requiredStepUpSIP, 21484, 2, 'Required Step-Up Starting SIP ≈ ₹21,484/mo');
assert(result.keyInsight.length > 0, 'Key factual insight generated');

// --- 12. Testing Empty / Boundary Input Safety ---
console.log('\n--- 12. Testing Empty / Boundary Input Safety ---');
const emptyInput: HousePurchasePlannerInput = {
  goal: { currentPropertyValue: 0, yearsToPurchase: 0 },
  cost: { propertyGrowthRate: 0, additionalCostPercent: 0 },
  loan: { homeLoanFundingPercent: 0, homeLoanInterestRate: 0, loanTenureYears: 0 },
  income: { currentMonthlyIncome: 0, incomeGrowthRate: 0, idealEMIPercent: 0 },
  earmarkedAssets: [],
  funding: { expectedInvestmentReturn: 0, startInvestingDelay: 0, annualStepUpPercent: 0 }
};
const emptyResult = calculateHousePurchasePlan(emptyInput);
assert(emptyResult.futurePropertyValue === 0, 'Empty input: future property value is 0');
assert(emptyResult.totalAmountToAccumulate === 0, 'Empty input: total amount to accumulate is 0');
assert(emptyResult.fundingDeficit === 0, 'Empty input: funding deficit is 0');
assert(emptyResult.requiredFixedSIP === 0, 'Empty input: required fixed SIP is 0');
assert(emptyResult.requiredStepUpSIP === 0, 'Empty input: required step-up SIP is 0');
assert(!isNaN(emptyResult.requiredLumpSum), 'Empty input: lump sum is not NaN');
assert(isFinite(emptyResult.requiredFixedSIP), 'Empty input: fixed SIP is finite');

// --- 13. Testing Currency Formatting ---
console.log('\n--- 13. Testing Currency Formatting ---');
assert(formatIndianCurrency(0) === '₹0', 'formatIndianCurrency(0) = ₹0');
assert(formatIndianCurrency(50000) === '₹50,000', 'formatIndianCurrency(50000) = ₹50,000');
assert(formatIndianCurrency(14185191) === '₹1,41,85,191', 'formatIndianCurrency(14185191) = ₹1,41,85,191');
assert(formatIndianCurrency(-500000) === '-₹5,00,000', 'formatIndianCurrency(-500000) = -₹5,00,000');
assert(formatLakhsCrores(0) === '₹0', 'formatLakhsCrores(0) = ₹0');
assert(formatLakhsCrores(50000) === '₹50,000', 'formatLakhsCrores(50000) = ₹50,000');
assert(formatLakhsCrores(4255557) === '₹42.56 Lakh', 'formatLakhsCrores(4255557) = ₹42.56 Lakh');
assert(formatLakhsCrores(14185191) === '₹1.42 Cr', 'formatLakhsCrores(14185191) = ₹1.42 Cr');

console.log('\n========================================');
console.log('HOME PURCHASE PLANNER TEST SUITE: ALL TESTS PASSED');
console.log('========================================\n');
