import {
  calculateOutstandingLiabilities,
  calculateFamilyGoals,
  calculateTotalAnnualExpenses,
  calculateAnnualFamilyExpenses,
  calculateTaxAdjustedReturn,
  calculateRealReturn,
  calculateFutureFamilyExpenseCorpus,
  calculateTotalLifeInsuranceRequired,
  calculateTotalExistingResources,
  calculateRawProtectionGap,
  calculateAdditionalCover,
  calculateLifeInsuranceNeed,
  formatIndianCurrency,
  formatLakhsCrores,
  DEFAULT_ASSUMPTIONS,
  DEFAULT_LIABILITIES,
  DEFAULT_GOALS,
  DEFAULT_EXPENSES,
  DEFAULT_RESOURCES,
  SAMPLE_LIFE_INSURANCE_INPUT,
  type LifeInsuranceNeedInput,
} from './lifeInsuranceNeed';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`✅ PASS: ${message}`);
}

function assertClose(actual: number, expected: number, tolerance: number, message: string) {
  const diff = Math.abs(actual - expected);
  if (diff > tolerance) {
    console.error(`❌ FAIL: ${message} (Actual: ${actual}, Expected: ${expected}, Diff: ${diff}, Tol: ${tolerance})`);
    throw new Error(`Assertion failed: ${message} (Actual: ${actual}, Expected: ${expected})`);
  }
  console.log(`✅ PASS: ${message} (Actual: ${actual}, Expected: ${expected})`);
}

console.log('\n========================================');
console.log('RUNNING LIFE INSURANCE NEED CALCULATION TESTS');
console.log('========================================\n');

// 1. Component Calculations: Liabilities
console.log('--- 1. Testing Liabilities Component ---');
const testLiab1 = calculateOutstandingLiabilities({
  homeLoan: 4000000,
  vehicleLoan: 500000,
  personalLoan: 200000,
  educationLoan: 300000,
  otherLoans: 0,
});
assert(testLiab1 === 5000000, 'Liabilities total matches ₹50 Lakh exactly');

const testLiabZero = calculateOutstandingLiabilities(DEFAULT_LIABILITIES);
assert(testLiabZero === 0, 'Zero liabilities produces ₹0');

// 2. Component Calculations: Goals
console.log('\n--- 2. Testing Family Goals Component ---');
const testGoals1 = calculateFamilyGoals({
  higherEducation: 4000000,
  marriage: 1000000,
  primaryEducation: 0,
  parentsContribution: 1000000,
  firstHousePurchase: 0,
});
assert(testGoals1 === 6000000, 'Family goals total matches ₹60 Lakh exactly');

const testGoalsZero = calculateFamilyGoals(DEFAULT_GOALS);
assert(testGoalsZero === 0, 'Zero family goals produces ₹0');

// 3. Component Calculations: Annual Expenses & Personal Discount
console.log('\n--- 3. Testing Annual Expenses & Personal Discount ---');
const totalExpenses = calculateTotalAnnualExpenses({
  householdExpenses: 900000,
  lifestyleExpenses: 300000,
});
assert(totalExpenses === 1200000, 'Total annual expenses = ₹12 Lakh');

const familyExpenses20 = calculateAnnualFamilyExpenses(1200000, 20);
assert(familyExpenses20 === 960000, '20% discount on ₹12L gives ₹9.60L family expenses');

const familyExpensesZeroDiscount = calculateAnnualFamilyExpenses(1200000, 0);
assert(familyExpensesZeroDiscount === 1200000, '0% discount preserves full ₹12L expenses');

const familyExpensesFullDiscount = calculateAnnualFamilyExpenses(1200000, 100);
assert(familyExpensesFullDiscount === 0, '100% discount gives ₹0 family expenses');

const householdOnly = calculateTotalAnnualExpenses({ householdExpenses: 600000, lifestyleExpenses: 0 });
assert(householdOnly === 600000, 'Household only expenses = ₹6L');

const lifestyleOnly = calculateTotalAnnualExpenses({ householdExpenses: 0, lifestyleExpenses: 400000 });
assert(lifestyleOnly === 400000, 'Lifestyle only expenses = ₹4L');

// 4. Return Calculations: Tax-Adjusted and Real Return
console.log('\n--- 4. Testing Tax-Adjusted Return & Real Return ---');
const taxAdjReturn8_10 = calculateTaxAdjustedReturn(8, 10);
assertClose(taxAdjReturn8_10, 7.2, 1e-9, '8% return with 10% tax = 7.2%');

const taxAdjReturnZeroTax = calculateTaxAdjustedReturn(8, 0);
assertClose(taxAdjReturnZeroTax, 8.0, 1e-9, '8% return with 0% tax = 8.0%');

const taxAdjReturnZeroReturn = calculateTaxAdjustedReturn(0, 10);
assertClose(taxAdjReturnZeroReturn, 0.0, 1e-9, '0% return with 10% tax = 0%');

// Real return: ((1 + 0.072) / (1 + 0.06)) - 1 = (1.072 / 1.06) - 1 ≈ 1.13207547%
const realReturn = calculateRealReturn(7.2, 6);
const expectedRealReturn = ((1.072 / 1.06) - 1) * 100;
assertClose(realReturn, expectedRealReturn, 1e-6, 'Real return matches exact compound formula ≈ 1.132075%');

// Real return with 0% inflation
const realReturnZeroInflation = calculateRealReturn(7.2, 0);
assertClose(realReturnZeroInflation, 7.2, 1e-6, 'Real return with 0% inflation equals tax-adjusted return (7.2%)');

// Real return when tax-adjusted return == inflation (e.g. 6% and 6%)
const realReturnEqual = calculateRealReturn(6, 6);
assertClose(realReturnEqual, 0, 1e-9, 'Real return is 0% when return equals inflation');

// 5. Annuity Due Timing Validation vs Ordinary Annuity
console.log('\n--- 5. Testing Annuity Due Timing Validation ---');
const annualExp = 960000;
const years = 25;
const rDecimal = ((1.072 / 1.06) - 1); // ≈ 0.011320754716981188

// Ordinary annuity
const ordinaryAnnuityFactor = (1 - Math.pow(1 + rDecimal, -years)) / rDecimal;
const ordinaryCorpus = Math.round(annualExp * ordinaryAnnuityFactor);

// Annuity Due
const annuityDueCorpus = calculateFutureFamilyExpenseCorpus(annualExp, rDecimal, years);

assert(annuityDueCorpus !== ordinaryCorpus, 'Annuity Due corpus is NOT equal to Ordinary Annuity');
assert(annuityDueCorpus > ordinaryCorpus, 'Annuity Due corpus is greater than Ordinary Annuity (payments at start)');

const expectedDue = Math.round(ordinaryCorpus * (1 + rDecimal));
assertClose(annuityDueCorpus, expectedDue, 2, 'Annuity Due exactly equals Ordinary Annuity * (1 + r)');
console.log(`   Ordinary Annuity: ₹${ordinaryCorpus.toLocaleString('en-IN')}`);
console.log(`   Annuity Due:      ₹${annuityDueCorpus.toLocaleString('en-IN')} (Diff: ₹${(annuityDueCorpus - ordinaryCorpus).toLocaleString('en-IN')})`);

// 6. Zero & Boundary Conditions for Expense Corpus
console.log('\n--- 6. Testing Zero & Boundary Conditions ---');
const corpusZeroExpenses = calculateFutureFamilyExpenseCorpus(0, rDecimal, 25);
assert(corpusZeroExpenses === 0, 'Zero expenses produces ₹0 corpus');

const corpusZeroYears = calculateFutureFamilyExpenseCorpus(960000, rDecimal, 0);
assert(corpusZeroYears === 0, 'Zero years produces ₹0 corpus');

// Zero real return fallback: A * n
const corpusZeroRate = calculateFutureFamilyExpenseCorpus(960000, 0, 25);
assert(corpusZeroRate === 960000 * 25, 'Zero real return accurately returns Annual Expenses * Years (₹2.40 Cr)');
assert(corpusZeroRate === 24000000, 'Zero rate corpus equals 24,000,000');

// 1-year support
const corpus1Year = calculateFutureFamilyExpenseCorpus(100000, 0.05, 1);
assert(corpus1Year === 100000, '1 year annuity due with 5% return gives exactly the beginning payment ₹100,000');

// 50-year support
const corpus50Years = calculateFutureFamilyExpenseCorpus(960000, rDecimal, 50);
assert(corpus50Years > annuityDueCorpus, '50-year corpus is greater than 25-year corpus');
assert(!isNaN(corpus50Years) && isFinite(corpus50Years), '50-year corpus is finite and valid');

// 7. Existing Resources Component
console.log('\n--- 7. Testing Existing Resources ---');
const resourcesTotal = calculateTotalExistingResources({
  existingLifeInsurance: 2500000,
  investmentAssets: 2000000,
  spouseFutureEarningsPV: 1500000,
});
assert(resourcesTotal === 6000000, 'Existing resources total = ₹60 Lakh');

const resourcesZero = calculateTotalExistingResources(DEFAULT_RESOURCES);
assert(resourcesZero === 0, 'Zero resources = ₹0');

// 8. Protection Gap & Overfunded Scenarios
console.log('\n--- 8. Testing Protection Gap & Overfunded Handling ---');
const rawGapPositive = calculateRawProtectionGap(32036533, 6000000);
assert(rawGapPositive === 26036533, 'Positive raw protection gap = ₹2,60,36,533');
assert(calculateAdditionalCover(rawGapPositive) === 26036533, 'Additional cover required = ₹2,60,36,533');

const rawGapZero = calculateRawProtectionGap(10000000, 10000000);
assert(rawGapZero === 0, 'Exact coverage gap = 0');
assert(calculateAdditionalCover(rawGapZero) === 0, 'Additional cover for exact match = ₹0');

const rawGapNegative = calculateRawProtectionGap(10000000, 15000000);
assert(rawGapNegative === -5000000, 'Overfunded raw gap = -₹50 Lakh');
assert(calculateAdditionalCover(rawGapNegative) === 0, 'Overfunded additional cover is capped at ₹0');

// 9. Full Deterministic QPFP Reference Scenario
console.log('\n--- 9. Testing Deterministic QPFP Reference Scenario ---');
const qpfpInput: LifeInsuranceNeedInput = {
  liabilities: {
    homeLoan: 4000000,
    vehicleLoan: 500000,
    personalLoan: 200000,
    educationLoan: 300000,
    otherLoans: 0,
  },
  goals: {
    higherEducation: 4000000,
    marriage: 1000000,
    primaryEducation: 0,
    parentsContribution: 1000000,
    firstHousePurchase: 0,
  },
  expenses: {
    householdExpenses: 900000,
    lifestyleExpenses: 300000,
  },
  assumptions: {
    yearsOfSupport: 25,
    expenseInflation: 6,
    taxRate: 10,
    expectedReturn: 8,
    personalExpenseDiscount: 20,
  },
  resources: {
    existingLifeInsurance: 2500000,
    investmentAssets: 2000000,
    spouseFutureEarningsPV: 1500000,
  },
};

const qpfpResult = calculateLifeInsuranceNeed(qpfpInput);

assert(qpfpResult.totalLiabilities === 5000000, 'Reference Liabilities = ₹50 Lakh');
assert(qpfpResult.totalFamilyGoals === 6000000, 'Reference Goals = ₹60 Lakh');
assert(qpfpResult.totalAnnualExpenses === 1200000, 'Reference Total Expenses = ₹12 Lakh');
assert(qpfpResult.annualFamilyExpenses === 960000, 'Reference Family Expenses = ₹9.60 Lakh');
assertClose(qpfpResult.taxAdjustedReturn, 7.2, 1e-6, 'Reference Tax-Adjusted Return = 7.2%');
assertClose(qpfpResult.realReturn, 1.13207547, 1e-4, 'Reference Real Return ≈ 1.132075%');

// Exact check on Living Expense Corpus:
// PV_due(r = (1.072/1.06)-1, n = 25, pmt = 960000) = ₹2,10,36,533 (₹2.10 Cr)
assertClose(qpfpResult.futureFamilyExpenseCorpus, 21036533, 1, 'Reference Living Expense Corpus ≈ ₹2,10,36,533');

// Total Requirement: 50,00,000 + 60,00,000 + 2,10,36,533 = 3,20,36,533
assertClose(qpfpResult.totalRequirement, 32036533, 1, 'Reference Total Requirement ≈ ₹3,20,36,533 (₹3.20 Cr)');

assert(qpfpResult.totalExistingResources === 6000000, 'Reference Existing Resources = ₹60 Lakh');
assertClose(qpfpResult.rawProtectionGap, 26036533, 1, 'Reference Raw Protection Gap ≈ ₹2,60,36,533');
assertClose(qpfpResult.additionalCoverRequired, 26036533, 1, 'Reference Additional Cover Required ≈ ₹2,60,36,533 (₹2.60 Cr)');
assert(qpfpResult.isCovered === false, 'isCovered is false for protection gap');

// 10. Complete Empty / Zero Input Safety Test
console.log('\n--- 10. Testing Empty / Zero Input Safety ---');
const emptyInputResult = calculateLifeInsuranceNeed({
  liabilities: DEFAULT_LIABILITIES,
  goals: DEFAULT_GOALS,
  expenses: DEFAULT_EXPENSES,
  assumptions: DEFAULT_ASSUMPTIONS,
  resources: DEFAULT_RESOURCES,
});

assert(emptyInputResult.totalLiabilities === 0, 'Empty input: totalLiabilities is 0');
assert(emptyInputResult.totalFamilyGoals === 0, 'Empty input: totalFamilyGoals is 0');
assert(emptyInputResult.totalAnnualExpenses === 0, 'Empty input: totalAnnualExpenses is 0');
assert(emptyInputResult.annualFamilyExpenses === 0, 'Empty input: annualFamilyExpenses is 0');
assert(emptyInputResult.futureFamilyExpenseCorpus === 0, 'Empty input: futureFamilyExpenseCorpus is 0');
assert(emptyInputResult.totalRequirement === 0, 'Empty input: totalRequirement is 0');
assert(emptyInputResult.totalExistingResources === 0, 'Empty input: totalExistingResources is 0');
assert(emptyInputResult.additionalCoverRequired === 0, 'Empty input: additionalCoverRequired is 0');
assert(emptyInputResult.isCovered === true, 'Empty input: isCovered is true (0 gap)');
assert(!isNaN(emptyInputResult.realReturn), 'Empty input: realReturn is valid number');

// 11. Overfunded Full Input Test
console.log('\n--- 11. Testing Full Overfunded Scenario ---');
const overfundedResult = calculateLifeInsuranceNeed({
  liabilities: { homeLoan: 2000000, vehicleLoan: 0, personalLoan: 0, educationLoan: 0, otherLoans: 0 },
  goals: { higherEducation: 2000000, marriage: 0, primaryEducation: 0, parentsContribution: 0, firstHousePurchase: 0 },
  expenses: { householdExpenses: 400000, lifestyleExpenses: 100000 }, // 5L * 0.8 = 4L
  assumptions: DEFAULT_ASSUMPTIONS, // 4L * ~21.985 = ~87.94L
  resources: {
    existingLifeInsurance: 10000000, // 1 Cr
    investmentAssets: 5000000,      // 50 L
    spouseFutureEarningsPV: 0,
  }, // Total resources = 1.5 Cr
});

assert(overfundedResult.totalRequirement < overfundedResult.totalExistingResources, 'Total requirement is less than resources');
assert(overfundedResult.rawProtectionGap < 0, 'Raw gap is negative');
assert(overfundedResult.additionalCoverRequired === 0, 'Additional cover required is ₹0');
assert(overfundedResult.isCovered === true, 'isCovered is true');

// 12. Currency Formatting Helpers Test
console.log('\n--- 12. Testing Formatting Helpers ---');
assert(formatIndianCurrency(0) === '₹0', 'formatIndianCurrency(0) = ₹0');
assert(formatIndianCurrency(50000) === '₹50,000', 'formatIndianCurrency(50000) = ₹50,000');
assert(formatIndianCurrency(26105831) === '₹2,61,05,831', 'formatIndianCurrency(26105831) = ₹2,61,05,831');
assert(formatIndianCurrency(-500000) === '-₹5,00,000', 'formatIndianCurrency(-500000) = -₹5,00,000');

assert(formatLakhsCrores(0) === '₹0', 'formatLakhsCrores(0) = ₹0');
assert(formatLakhsCrores(50000) === '₹50,000', 'formatLakhsCrores(50000) = ₹50,000');
assert(formatLakhsCrores(500000) === '₹5.00 Lakh', 'formatLakhsCrores(500000) = ₹5.00 Lakh');
assert(formatLakhsCrores(26036533) === '₹2.60 Cr', 'formatLakhsCrores(26036533) = ₹2.60 Cr');
assert(formatLakhsCrores(32036533) === '₹3.20 Cr', 'formatLakhsCrores(32036533) = ₹3.20 Cr');

console.log('\n========================================');
console.log('LIFE INSURANCE TEST SUITE: ALL TESTS PASSED');
console.log('========================================\n');
