import {
  calculateTotalIncome,
  calculateAnnualExpenses,
  calculateSavings,
  calculateAnnualInvestments,
  calculateSurplus,
  calculateAssetTotals,
  calculateTotalLiabilities,
  calculateNotionalNetWorth,
  calculateActualNetWorth,
  calculateRealStatement,
  DEFAULT_INCOME_INPUT,
  DEFAULT_EXPENSES_INPUT,
  DEFAULT_INVESTMENTS_INPUT,
  DEFAULT_ASSETS_INPUT,
  DEFAULT_LIABILITIES_INPUT,
  type RealStatementInput,
} from './realFinancialStatement';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

function assertClose(actual: number, expected: number, tolerance: number, message: string) {
  const diff = Math.abs(actual - expected);
  if (diff > tolerance) {
    console.error(`❌ FAIL: ${message} (Actual: ${actual}, Expected: ${expected}, Diff: ${diff})`);
    process.exit(1);
  } else {
    console.log(`✅ PASS: ${message} (Actual: ${actual})`);
  }
}

console.log('\n--- 1. Testing Income Methodology & Monthly Equivalents ---');
{
  const income1 = calculateTotalIncome({
    ...DEFAULT_INCOME_INPUT,
    primarySalary: 1200000,
  });
  assert(income1.totalAnnualIncome === 1200000, 'Single annual salary ₹12 Lakh');
  assert(income1.monthlyEquivalentIncome === 100000, 'Monthly equivalent is ₹1 Lakh');

  const income2 = calculateTotalIncome({
    primarySalary: 1500000,
    spouseSalary: 900000,
    bonus: 200000,
    businessIncome: 0,
    rentalIncome: 180000,
    investmentIncome: 60000,
    otherIncome: 0,
  });
  assert(income2.totalAnnualIncome === 2840000, 'Combined family annual income = ₹28.40 Lakh');
  assert(income2.monthlyEquivalentIncome === 236667, 'Monthly equivalent = ₹2,36,667');

  const zeroIncome = calculateTotalIncome(DEFAULT_INCOME_INPUT);
  assert(zeroIncome.totalAnnualIncome === 0, 'Zero income handled safely');
  assert(zeroIncome.monthlyEquivalentIncome === 0, 'Zero monthly equivalent handled safely');
}

console.log('\n--- 2. Testing Expense Categories & Annual Multipliers ---');
{
  const expenses = calculateAnnualExpenses({
    household: {
      rent: 25000,
      groceries: 15000,
      transport: 5000,
      utilities: 4000,
      domesticHelp: 3000,
      otherHousehold: 3000,
    },
    lifestyle: {
      shopping: 5000,
      dining: 4000,
      travel: 3000,
      personalCare: 2000,
      hobbies: 1000,
      otherLifestyle: 0,
    },
    family: {
      education: 8000,
      dependents: 5000,
      otherFamily: 0,
    },
    insurance: {
      lifeInsurance: 3000,
      healthInsurance: 2000,
      generalInsurance: 1000,
    },
    loanEmis: {
      homeLoanEmi: 30000,
      vehicleLoanEmi: 8000,
      otherLoanEmi: 0,
    },
  });

  assert(expenses.monthlyHousehold === 55000, 'Household monthly total = ₹55,000');
  assert(expenses.monthlyLifestyle === 15000, 'Lifestyle monthly total = ₹15,000');
  assert(expenses.monthlyFamily === 13000, 'Family monthly total = ₹13,000');
  assert(expenses.monthlyInsurance === 6000, 'Insurance monthly total = ₹6,000');
  assert(expenses.monthlyLoanEmis === 38000, 'Loan EMIs monthly total = ₹38,000');
  assert(expenses.totalMonthlyExpenses === 127000, 'Total monthly expenses = ₹1,27,000');

  assert(expenses.annualHousehold === 660000, 'Household annual = ₹6.60 Lakh');
  assert(expenses.annualLifestyle === 180000, 'Lifestyle annual = ₹1.80 Lakh');
  assert(expenses.annualFamily === 156000, 'Family annual = ₹1.56 Lakh');
  assert(expenses.annualInsurance === 72000, 'Insurance annual = ₹72,000');
  assert(expenses.annualLoanEmis === 456000, 'Loan EMIs annual = ₹4.56 Lakh');
  assert(expenses.totalAnnualExpenses === 1524000, 'Total annual expenses = ₹15.24 Lakh');
}

console.log('\n--- 3. Testing Savings & Savings Rate Formulas ---');
{
  const annualIncome = 2400000;
  const annualExpenses = 1440000;
  const savings = calculateSavings(annualIncome, annualExpenses);

  assert(savings.annualSavings === 960000, 'Annual savings = ₹9.60 Lakh');
  assert(savings.monthlySavings === 80000, 'Monthly savings = ₹80,000');
  assert(savings.savingsRate === 40, 'Savings rate = 40.0%');

  // Zero income edge case
  const zeroSavings = calculateSavings(0, 0);
  assert(zeroSavings.annualSavings === 0, 'Zero income annual savings = 0');
  assert(zeroSavings.savingsRate === 0, 'Zero income savings rate does not produce NaN');
  assert(!isNaN(zeroSavings.savingsRate) && isFinite(zeroSavings.savingsRate), 'Savings rate is finite number');

  // Deficit scenario
  const deficitSavings = calculateSavings(1000000, 1200000);
  assert(deficitSavings.annualSavings === -200000, 'Deficit annual savings = -₹2.00 Lakh');
  assert(deficitSavings.savingsRate === -20, 'Negative savings rate = -20%');
}

console.log('\n--- 4. Testing Ongoing Investments & Surplus Available for New Investments ---');
{
  const investments = calculateAnnualInvestments({
    mutualFundSips: 30000,
    recurringDepositsPolicies: 10000,
    otherInvestments: 5000,
  }, 2400000);

  assert(investments.totalMonthlyInvestments === 45000, 'Total monthly investments = ₹45,000');
  assert(investments.totalAnnualInvestments === 540000, 'Total annual investments = ₹5.40 Lakh');
  assert(investments.investmentRate === 22.5, 'Investment rate = 22.5% of income');

  // Surplus Available for New Investments
  const annualSavings = 960000;
  const surplus = calculateSurplus(annualSavings, investments.totalAnnualInvestments);
  assert(surplus.annualSurplus === 420000, 'Annual surplus available = ₹4.20 Lakh');
  assert(surplus.monthlySurplus === 35000, 'Monthly surplus available = ₹35,000');
}

console.log('\n--- 5. Testing Asset Categories, Personal-Use Isolation & Allocation ---');
{
  const assets = calculateAssetTotals({
    liquid: {
      savingsBank: 200000,
      cash: 50000,
      liquidFunds: 250000,
    },
    debt: {
      fixedDeposits: 500000,
      ppf: 300000,
      epf: 600000,
      npsDebt: 100000,
      debtMutualFunds: 200000,
      bondsOther: 0,
    },
    equity: {
      directEquity: 800000,
      equityMutualFunds: 1200000,
      npsEquity: 200000,
      ulips: 0,
    },
    gold: {
      physicalGold: 300000,
      goldEtfsSgb: 200000,
    },
    realEstate: {
      primaryResidence: 5000000, // Personal-use
      investmentProperty: 2000000, // Productive
      land: 500000, // Productive
      reits: 0,
    },
    personal: {
      vehicles: 600000, // Personal-use
      jewellery: 400000, // Personal-use
      otherPersonal: 100000, // Personal-use
    },
  });

  assert(assets.categoryTotals.liquid === 500000, 'Liquid assets = ₹5 Lakh');
  assert(assets.categoryTotals.debt === 1700000, 'Debt assets = ₹17 Lakh');
  assert(assets.categoryTotals.equity === 2200000, 'Equity assets = ₹22 Lakh');
  assert(assets.categoryTotals.gold === 500000, 'Gold assets = ₹5 Lakh');
  assert(assets.categoryTotals.realEstate === 7500000, 'Real estate total = ₹75 Lakh');
  assert(assets.categoryTotals.personal === 1100000, 'Personal assets category = ₹11 Lakh');

  // Total Assets = 5 + 17 + 22 + 5 + 75 + 11 = 135 Lakh
  assert(assets.totalAssets === 13500000, 'Total assets = ₹1.35 Crore');

  // Personal-Use Assets = Primary Residence (50L) + Vehicles (6L) + Jewellery (4L) + Other (1L) = 61 Lakh
  assert(assets.personalUseAssets === 6100000, 'Personal-use assets = ₹61 Lakh');

  // Productive Assets = Total Assets (135L) - Personal-Use (61L) = 74 Lakh
  assert(assets.productiveAssets === 7400000, 'Productive/Financial assets = ₹74 Lakh');

  // Allocation %
  assertClose(assets.allocationPercentages.liquid, 3.7, 0.1, 'Liquid allocation ≈ 3.7%');
  assertClose(assets.allocationPercentages.debt, 12.6, 0.1, 'Debt allocation ≈ 12.6%');
  assertClose(assets.allocationPercentages.equity, 16.3, 0.1, 'Equity allocation ≈ 16.3%');
  assertClose(assets.allocationPercentages.realEstate, 55.6, 0.1, 'Real estate allocation ≈ 55.6%');
}

console.log('\n--- 6. Testing Liabilities & Net Worth Methodologies ---');
{
  const liabilities = calculateTotalLiabilities({
    homeLoan: 2500000,
    vehicleLoan: 300000,
    personalLoan: 0,
    educationLoan: 0,
    otherLoans: 0,
    creditCardDebt: 50000,
  });

  assert(liabilities.totalLiabilities === 2850000, 'Total liabilities = ₹28.50 Lakh');

  const totalAssets = 13500000;
  const personalUseAssets = 6100000;
  const totalLiabilities = 2850000;

  // Notional Net Worth = Total Assets - Total Liabilities = 135L - 28.5L = 106.5L
  const notionalNetWorth = calculateNotionalNetWorth(totalAssets, totalLiabilities);
  assert(notionalNetWorth === 10650000, 'Notional Net Worth = ₹1.065 Crore (₹106.50 Lakh)');

  // Actual Net Worth = Total Assets - Personal-Use Assets - Total Liabilities
  // = 135L - 61L - 28.5L = 45.5L
  const actualNetWorth = calculateActualNetWorth(totalAssets, totalLiabilities, personalUseAssets);
  assert(actualNetWorth === 4550000, 'Actual Net Worth = ₹45.50 Lakh');

  // Verify Productive Assets - Liabilities = Actual Net Worth
  const productiveAssets = totalAssets - personalUseAssets;
  assert(productiveAssets - totalLiabilities === actualNetWorth, 'Actual Net Worth equals Productive Assets minus Liabilities');
}

console.log('\n--- 7. Testing Complete Representative End-to-End Client Case ---');
{
  const testClientInput: RealStatementInput = {
    income: {
      primarySalary: 1800000,
      spouseSalary: 600000,
      bonus: 100000,
      businessIncome: 0,
      rentalIncome: 0,
      investmentIncome: 20000,
      otherIncome: 0,
    },
    expenses: {
      household: {
        rent: 0, // Own home
        groceries: 20000,
        transport: 6000,
        utilities: 5000,
        domesticHelp: 4000,
        otherHousehold: 3000,
      },
      lifestyle: {
        shopping: 6000,
        dining: 5000,
        travel: 4000,
        personalCare: 3000,
        hobbies: 2000,
        otherLifestyle: 0,
      },
      family: {
        education: 12000,
        dependents: 5000,
        otherFamily: 0,
      },
      insurance: {
        lifeInsurance: 4000,
        healthInsurance: 3000,
        generalInsurance: 1000,
      },
      loanEmis: {
        homeLoanEmi: 32000,
        vehicleLoanEmi: 6000,
        otherLoanEmi: 0,
      },
    },
    investments: {
      mutualFundSips: 35000,
      recurringDepositsPolicies: 10000,
      otherInvestments: 5000,
    },
    assets: {
      liquid: {
        savingsBank: 150000,
        cash: 30000,
        liquidFunds: 200000,
      },
      debt: {
        fixedDeposits: 400000,
        ppf: 300000,
        epf: 500000,
        npsDebt: 100000,
        debtMutualFunds: 100000,
        bondsOther: 0,
      },
      equity: {
        directEquity: 600000,
        equityMutualFunds: 1000000,
        npsEquity: 200000,
        ulips: 0,
      },
      gold: {
        physicalGold: 300000,
        goldEtfsSgb: 150000,
      },
      realEstate: {
        primaryResidence: 4500000,
        investmentProperty: 0,
        land: 0,
        reits: 0,
      },
      personal: {
        vehicles: 400000,
        jewellery: 300000,
        otherPersonal: 100000,
      },
    },
    liabilities: {
      homeLoan: 2200000,
      vehicleLoan: 150000,
      personalLoan: 0,
      educationLoan: 0,
      otherLoans: 0,
      creditCardDebt: 25000,
    },
  };

  const result = calculateRealStatement(testClientInput);

  // Income checks
  assert(result.income.totalAnnualIncome === 2520000, 'Client annual income = ₹25.20 Lakh');
  assert(result.income.monthlyEquivalentIncome === 210000, 'Client monthly equivalent = ₹2.10 Lakh');

  // Expense checks
  assert(result.expenses.totalMonthlyExpenses === 121000, 'Client monthly expenses = ₹1,21,000');
  assert(result.expenses.totalAnnualExpenses === 1452000, 'Client annual expenses = ₹14.52 Lakh');

  // Savings checks
  assert(result.savings.annualSavings === 1068000, 'Client annual savings = ₹10.68 Lakh');
  assert(result.savings.monthlySavings === 89000, 'Client monthly savings = ₹89,000');
  assertClose(result.savings.savingsRate, 42.4, 0.1, 'Client savings rate ≈ 42.4%');

  // Ongoing investments & surplus checks
  assert(result.investments.totalMonthlyInvestments === 50000, 'Client monthly investments = ₹50,000');
  assert(result.investments.totalAnnualInvestments === 600000, 'Client annual investments = ₹6.00 Lakh');
  assert(result.surplus.annualSurplus === 468000, 'Client annual surplus available = ₹4.68 Lakh');
  assert(result.surplus.monthlySurplus === 39000, 'Client monthly surplus available = ₹39,000');

  // Assets & Liabilities checks
  // Total Assets = 3.8L (Liquid) + 14L (Debt) + 18L (Equity) + 4.5L (Gold) + 45L (Primary RE) + 8L (Personal) = 93.30 Lakh
  assert(result.assets.totalAssets === 9330000, 'Client total assets = ₹93.30 Lakh');
  assert(result.assets.personalUseAssets === 5300000, 'Client personal-use assets (Home 45L + Personal 8L) = ₹53.00 Lakh');
  assert(result.assets.productiveAssets === 4030000, 'Client productive assets = ₹40.30 Lakh');
  assert(result.liabilities.totalLiabilities === 2375000, 'Client total liabilities = ₹23.75 Lakh');

  // Net Worth checks
  assert(result.notionalNetWorth === 6955000, 'Client Notional Net Worth = ₹69.55 Lakh');
  assert(result.actualNetWorth === 1655000, 'Client Actual Net Worth = ₹16.55 Lakh');

  // Metrics checks
  assertClose(result.metrics.debtToAssetRatio, 25.5, 0.1, 'Client Debt-to-Asset ratio ≈ 25.5%');
  assert(result.observations.length >= 3, 'Generated rich factual observations');
}

console.log('\n--- 8. Testing Edge Cases & Boundary Handling ---');
{
  const emptyInput: RealStatementInput = {
    income: DEFAULT_INCOME_INPUT,
    expenses: DEFAULT_EXPENSES_INPUT,
    investments: DEFAULT_INVESTMENTS_INPUT,
    assets: DEFAULT_ASSETS_INPUT,
    liabilities: DEFAULT_LIABILITIES_INPUT,
  };

  const emptyResult = calculateRealStatement(emptyInput);
  assert(emptyResult.income.totalAnnualIncome === 0, 'Empty input: Annual income is 0');
  assert(emptyResult.savings.savingsRate === 0, 'Empty input: Savings rate is 0 (not NaN)');
  assert(emptyResult.surplus.monthlySurplus === 0, 'Empty input: Monthly surplus is 0');
  assert(emptyResult.assets.totalAssets === 0, 'Empty input: Total assets is 0');
  assert(emptyResult.actualNetWorth === 0, 'Empty input: Actual net worth is 0');
  assert(emptyResult.notionalNetWorth === 0, 'Empty input: Notional net worth is 0');
  assert(emptyResult.metrics.debtToAssetRatio === 0, 'Empty input: Debt-to-asset ratio is 0');
}

console.log('\n========================================');
console.log('REAL STATEMENT TEST SUITE: ALL TESTS PASSED');
console.log('========================================\n');
