// NetworkFP / QPFP REAL Statement Calculation Engine
// Single source of truth for the REAL Financial Statement

export interface IncomeInput {
  primarySalary: number;
  spouseSalary: number;
  bonus: number;
  businessIncome: number;
  rentalIncome: number;
  investmentIncome: number;
  otherIncome: number;
}

export interface ExpensesHouseholdInput {
  rent: number;
  groceries: number;
  transport: number;
  utilities: number;
  domesticHelp: number;
  otherHousehold: number;
}

export interface ExpensesLifestyleInput {
  shopping: number;
  dining: number;
  travel: number;
  personalCare: number;
  hobbies: number;
  otherLifestyle: number;
}

export interface ExpensesFamilyInput {
  education: number;
  dependents: number;
  otherFamily: number;
}

export interface ExpensesInsuranceInput {
  lifeInsurance: number;
  healthInsurance: number;
  generalInsurance: number;
}

export interface ExpensesLoanEmisInput {
  homeLoanEmi: number;
  vehicleLoanEmi: number;
  otherLoanEmi: number;
}

export interface ExpensesInput {
  household: ExpensesHouseholdInput;
  lifestyle: ExpensesLifestyleInput;
  family: ExpensesFamilyInput;
  insurance: ExpensesInsuranceInput;
  loanEmis: ExpensesLoanEmisInput;
}

export interface InvestmentsInput {
  mutualFundSips: number;
  recurringDepositsPolicies: number;
  otherInvestments: number;
}

export interface AssetsLiquidInput {
  savingsBank: number;
  cash: number;
  liquidFunds: number;
}

export interface AssetsDebtInput {
  fixedDeposits: number;
  ppf: number;
  epf: number;
  npsDebt: number;
  debtMutualFunds: number;
  bondsOther: number;
}

export interface AssetsEquityInput {
  directEquity: number;
  equityMutualFunds: number;
  npsEquity: number;
  ulips: number;
}

export interface AssetsGoldInput {
  physicalGold: number;
  goldEtfsSgb: number;
}

export interface AssetsRealEstateInput {
  primaryResidence: number; // Personal-use
  investmentProperty: number; // Productive
  land: number; // Productive
  reits: number; // Productive
}

export interface AssetsPersonalInput {
  vehicles: number; // Personal-use
  jewellery: number; // Personal-use
  otherPersonal: number; // Personal-use
}

export interface AssetsInput {
  liquid: AssetsLiquidInput;
  debt: AssetsDebtInput;
  equity: AssetsEquityInput;
  gold: AssetsGoldInput;
  realEstate: AssetsRealEstateInput;
  personal: AssetsPersonalInput;
}

export interface LiabilitiesInput {
  homeLoan: number;
  vehicleLoan: number;
  personalLoan: number;
  educationLoan: number;
  otherLoans: number;
  creditCardDebt: number;
}

export interface RealStatementInput {
  income: IncomeInput;
  expenses: ExpensesInput;
  investments: InvestmentsInput;
  assets: AssetsInput;
  liabilities: LiabilitiesInput;
}

export interface IncomeResult {
  totalAnnualIncome: number;
  monthlyEquivalentIncome: number;
}

export interface ExpensesResult {
  monthlyHousehold: number;
  monthlyLifestyle: number;
  monthlyFamily: number;
  monthlyInsurance: number;
  monthlyLoanEmis: number;
  totalMonthlyExpenses: number;
  annualHousehold: number;
  annualLifestyle: number;
  annualFamily: number;
  annualInsurance: number;
  annualLoanEmis: number;
  totalAnnualExpenses: number;
}

export interface SavingsResult {
  annualSavings: number;
  monthlySavings: number;
  savingsRate: number; // percentage (0-100 or negative)
}

export interface InvestmentsResult {
  totalMonthlyInvestments: number;
  totalAnnualInvestments: number;
  investmentRate: number; // percentage (0-100)
}

export interface SurplusResult {
  annualSurplus: number;
  monthlySurplus: number;
}

export interface AssetCategoryTotals {
  liquid: number;
  debt: number;
  equity: number;
  gold: number;
  realEstate: number;
  personal: number;
}

export interface AssetAllocationPercentages {
  liquid: number;
  debt: number;
  equity: number;
  gold: number;
  realEstate: number;
  personal: number;
}

export interface AssetsResult {
  categoryTotals: AssetCategoryTotals;
  allocationPercentages: AssetAllocationPercentages;
  totalAssets: number;
  personalUseAssets: number;
  productiveAssets: number;
}

export interface LiabilitiesResult {
  totalLiabilities: number;
  breakdown: LiabilitiesInput;
}

export interface FinancialMetrics {
  savingsRate: number;
  investmentRate: number;
  debtToAssetRatio: number;
  solvencyRatio: number;
  productiveAssetsRatio: number;
  personalAssetsRatio: number;
}

export interface FinancialObservation {
  id: string;
  category: 'savings' | 'surplus' | 'debt' | 'assets';
  title: string;
  description: string;
  type: 'positive' | 'neutral' | 'caution';
}

export interface RealStatementResult {
  income: IncomeResult;
  expenses: ExpensesResult;
  savings: SavingsResult;
  investments: InvestmentsResult;
  surplus: SurplusResult;
  assets: AssetsResult;
  liabilities: LiabilitiesResult;
  notionalNetWorth: number;
  actualNetWorth: number;
  metrics: FinancialMetrics;
  observations: FinancialObservation[];
}

// Default initial state helper
export const DEFAULT_INCOME_INPUT: IncomeInput = {
  primarySalary: 0,
  spouseSalary: 0,
  bonus: 0,
  businessIncome: 0,
  rentalIncome: 0,
  investmentIncome: 0,
  otherIncome: 0,
};

export const DEFAULT_EXPENSES_INPUT: ExpensesInput = {
  household: {
    rent: 0,
    groceries: 0,
    transport: 0,
    utilities: 0,
    domesticHelp: 0,
    otherHousehold: 0,
  },
  lifestyle: {
    shopping: 0,
    dining: 0,
    travel: 0,
    personalCare: 0,
    hobbies: 0,
    otherLifestyle: 0,
  },
  family: {
    education: 0,
    dependents: 0,
    otherFamily: 0,
  },
  insurance: {
    lifeInsurance: 0,
    healthInsurance: 0,
    generalInsurance: 0,
  },
  loanEmis: {
    homeLoanEmi: 0,
    vehicleLoanEmi: 0,
    otherLoanEmi: 0,
  },
};

export const DEFAULT_INVESTMENTS_INPUT: InvestmentsInput = {
  mutualFundSips: 0,
  recurringDepositsPolicies: 0,
  otherInvestments: 0,
};

export const DEFAULT_ASSETS_INPUT: AssetsInput = {
  liquid: {
    savingsBank: 0,
    cash: 0,
    liquidFunds: 0,
  },
  debt: {
    fixedDeposits: 0,
    ppf: 0,
    epf: 0,
    npsDebt: 0,
    debtMutualFunds: 0,
    bondsOther: 0,
  },
  equity: {
    directEquity: 0,
    equityMutualFunds: 0,
    npsEquity: 0,
    ulips: 0,
  },
  gold: {
    physicalGold: 0,
    goldEtfsSgb: 0,
  },
  realEstate: {
    primaryResidence: 0,
    investmentProperty: 0,
    land: 0,
    reits: 0,
  },
  personal: {
    vehicles: 0,
    jewellery: 0,
    otherPersonal: 0,
  },
};

export const DEFAULT_LIABILITIES_INPUT: LiabilitiesInput = {
  homeLoan: 0,
  vehicleLoan: 0,
  personalLoan: 0,
  educationLoan: 0,
  otherLoans: 0,
  creditCardDebt: 0,
};

// Safe number parser
export function safeNumber(val: unknown): number {
  if (typeof val === 'number') {
    return isNaN(val) || !isFinite(val) ? 0 : Math.max(0, val);
  }
  if (typeof val === 'string') {
    const parsed = parseFloat(val.replace(/,/g, ''));
    return isNaN(parsed) || !isFinite(parsed) ? 0 : Math.max(0, parsed);
  }
  return 0;
}

// 1. Calculate Total Annual Income & Monthly Equivalent
export function calculateTotalIncome(input: IncomeInput): IncomeResult {
  const totalAnnualIncome = Math.round(
    safeNumber(input.primarySalary) +
    safeNumber(input.spouseSalary) +
    safeNumber(input.bonus) +
    safeNumber(input.businessIncome) +
    safeNumber(input.rentalIncome) +
    safeNumber(input.investmentIncome) +
    safeNumber(input.otherIncome)
  );

  const monthlyEquivalentIncome = Math.round(totalAnnualIncome / 12);

  return {
    totalAnnualIncome,
    monthlyEquivalentIncome,
  };
}

// 2. Calculate Expenses (Monthly -> Annual)
export function calculateAnnualExpenses(input: ExpensesInput): ExpensesResult {
  const h = input.household;
  const l = input.lifestyle;
  const f = input.family;
  const ins = input.insurance;
  const e = input.loanEmis;

  const monthlyHousehold = Math.round(
    safeNumber(h.rent) +
    safeNumber(h.groceries) +
    safeNumber(h.transport) +
    safeNumber(h.utilities) +
    safeNumber(h.domesticHelp) +
    safeNumber(h.otherHousehold)
  );

  const monthlyLifestyle = Math.round(
    safeNumber(l.shopping) +
    safeNumber(l.dining) +
    safeNumber(l.travel) +
    safeNumber(l.personalCare) +
    safeNumber(l.hobbies) +
    safeNumber(l.otherLifestyle)
  );

  const monthlyFamily = Math.round(
    safeNumber(f.education) +
    safeNumber(f.dependents) +
    safeNumber(f.otherFamily)
  );

  const monthlyInsurance = Math.round(
    safeNumber(ins.lifeInsurance) +
    safeNumber(ins.healthInsurance) +
    safeNumber(ins.generalInsurance)
  );

  const monthlyLoanEmis = Math.round(
    safeNumber(e.homeLoanEmi) +
    safeNumber(e.vehicleLoanEmi) +
    safeNumber(e.otherLoanEmi)
  );

  const totalMonthlyExpenses = monthlyHousehold + monthlyLifestyle + monthlyFamily + monthlyInsurance + monthlyLoanEmis;

  const annualHousehold = monthlyHousehold * 12;
  const annualLifestyle = monthlyLifestyle * 12;
  const annualFamily = monthlyFamily * 12;
  const annualInsurance = monthlyInsurance * 12;
  const annualLoanEmis = monthlyLoanEmis * 12;
  const totalAnnualExpenses = totalMonthlyExpenses * 12;

  return {
    monthlyHousehold,
    monthlyLifestyle,
    monthlyFamily,
    monthlyInsurance,
    monthlyLoanEmis,
    totalMonthlyExpenses,
    annualHousehold,
    annualLifestyle,
    annualFamily,
    annualInsurance,
    annualLoanEmis,
    totalAnnualExpenses,
  };
}

// 3. Calculate Savings & Savings Rate
export function calculateSavings(totalAnnualIncome: number, totalAnnualExpenses: number): SavingsResult {
  const annualSavings = totalAnnualIncome - totalAnnualExpenses;
  const monthlySavings = Math.round(annualSavings / 12);
  const savingsRate = totalAnnualIncome > 0 
    ? Math.round((annualSavings / totalAnnualIncome) * 1000) / 10 // 1 decimal place
    : 0;

  return {
    annualSavings,
    monthlySavings,
    savingsRate,
  };
}

// 4. Calculate Ongoing Investments
export function calculateAnnualInvestments(input: InvestmentsInput, totalAnnualIncome: number): InvestmentsResult {
  const totalMonthlyInvestments = Math.round(
    safeNumber(input.mutualFundSips) +
    safeNumber(input.recurringDepositsPolicies) +
    safeNumber(input.otherInvestments)
  );

  const totalAnnualInvestments = totalMonthlyInvestments * 12;
  const investmentRate = totalAnnualIncome > 0
    ? Math.round((totalAnnualInvestments / totalAnnualIncome) * 1000) / 10
    : 0;

  return {
    totalMonthlyInvestments,
    totalAnnualInvestments,
    investmentRate,
  };
}

// 5. Calculate Surplus Available for New Investments
export function calculateSurplus(annualSavings: number, totalAnnualInvestments: number): SurplusResult {
  const annualSurplus = annualSavings - totalAnnualInvestments;
  const monthlySurplus = Math.round(annualSurplus / 12);

  return {
    annualSurplus,
    monthlySurplus,
  };
}

// 6. Calculate Asset Totals & Categories
export function calculateAssetTotals(input: AssetsInput): AssetsResult {
  const l = input.liquid;
  const d = input.debt;
  const eq = input.equity;
  const g = input.gold;
  const re = input.realEstate;
  const p = input.personal;

  const liquid = Math.round(
    safeNumber(l.savingsBank) +
    safeNumber(l.cash) +
    safeNumber(l.liquidFunds)
  );

  const debt = Math.round(
    safeNumber(d.fixedDeposits) +
    safeNumber(d.ppf) +
    safeNumber(d.epf) +
    safeNumber(d.npsDebt) +
    safeNumber(d.debtMutualFunds) +
    safeNumber(d.bondsOther)
  );

  const equity = Math.round(
    safeNumber(eq.directEquity) +
    safeNumber(eq.equityMutualFunds) +
    safeNumber(eq.npsEquity) +
    safeNumber(eq.ulips)
  );

  const gold = Math.round(
    safeNumber(g.physicalGold) +
    safeNumber(g.goldEtfsSgb)
  );

  const realEstate = Math.round(
    safeNumber(re.primaryResidence) +
    safeNumber(re.investmentProperty) +
    safeNumber(re.land) +
    safeNumber(re.reits)
  );

  const personal = Math.round(
    safeNumber(p.vehicles) +
    safeNumber(p.jewellery) +
    safeNumber(p.otherPersonal)
  );

  const totalAssets = liquid + debt + equity + gold + realEstate + personal;

  // Personal-Use Assets = Primary Residence + Vehicles + Jewellery + Other Personal Use
  const personalUseAssets = Math.round(
    safeNumber(re.primaryResidence) +
    safeNumber(p.vehicles) +
    safeNumber(p.jewellery) +
    safeNumber(p.otherPersonal)
  );

  const productiveAssets = totalAssets - personalUseAssets;

  const categoryTotals: AssetCategoryTotals = {
    liquid,
    debt,
    equity,
    gold,
    realEstate,
    personal,
  };

  const allocationPercentages: AssetAllocationPercentages = {
    liquid: totalAssets > 0 ? Math.round((liquid / totalAssets) * 1000) / 10 : 0,
    debt: totalAssets > 0 ? Math.round((debt / totalAssets) * 1000) / 10 : 0,
    equity: totalAssets > 0 ? Math.round((equity / totalAssets) * 1000) / 10 : 0,
    gold: totalAssets > 0 ? Math.round((gold / totalAssets) * 1000) / 10 : 0,
    realEstate: totalAssets > 0 ? Math.round((realEstate / totalAssets) * 1000) / 10 : 0,
    personal: totalAssets > 0 ? Math.round((personal / totalAssets) * 1000) / 10 : 0,
  };

  return {
    categoryTotals,
    allocationPercentages,
    totalAssets,
    personalUseAssets,
    productiveAssets,
  };
}

// 7. Calculate Total Liabilities
export function calculateTotalLiabilities(input: LiabilitiesInput): LiabilitiesResult {
  const totalLiabilities = Math.round(
    safeNumber(input.homeLoan) +
    safeNumber(input.vehicleLoan) +
    safeNumber(input.personalLoan) +
    safeNumber(input.educationLoan) +
    safeNumber(input.otherLoans) +
    safeNumber(input.creditCardDebt)
  );

  return {
    totalLiabilities,
    breakdown: { ...input },
  };
}

// 8. Calculate Net Worth
export function calculateNotionalNetWorth(totalAssets: number, totalLiabilities: number): number {
  return totalAssets - totalLiabilities;
}

export function calculateActualNetWorth(totalAssets: number, totalLiabilities: number, personalUseAssets: number): number {
  return totalAssets - personalUseAssets - totalLiabilities;
}

// 9. Generate Factual Financial Observations
export function generateFinancialObservations(
  income: IncomeResult,
  savings: SavingsResult,
  investments: InvestmentsResult,
  surplus: SurplusResult,
  assets: AssetsResult,
  liabilities: LiabilitiesResult,
  actualNetWorth: number
): FinancialObservation[] {
  const observations: FinancialObservation[] = [];

  // Observation 1: Savings Rate
  if (income.totalAnnualIncome > 0) {
    if (savings.savingsRate >= 30) {
      observations.push({
        id: 'obs-savings-high',
        category: 'savings',
        title: 'Strong Savings Velocity',
        description: `Your savings rate is ${savings.savingsRate}%. You are retaining a healthy portion of your annual income for long-term goals.`,
        type: 'positive',
      });
    } else if (savings.savingsRate >= 15) {
      observations.push({
        id: 'obs-savings-moderate',
        category: 'savings',
        title: 'Steady Cash Flow Retention',
        description: `Your current savings rate is ${savings.savingsRate}%. Maintaining consistency in savings provides room for systematic milestone planning.`,
        type: 'neutral',
      });
    } else if (savings.savingsRate > 0) {
      observations.push({
        id: 'obs-savings-low',
        category: 'savings',
        title: 'Opportunity to Build Surplus',
        description: `Your current savings rate is ${savings.savingsRate}%. Reviewing discretionary expenses may help create more room for future goals.`,
        type: 'caution',
      });
    } else {
      observations.push({
        id: 'obs-savings-deficit',
        category: 'savings',
        title: 'Expenses Match or Exceed Income',
        description: `Your current annual expenses match or exceed your annual income. Balancing current cash flows will help stabilize savings.`,
        type: 'caution',
      });
    }
  }

  // Observation 2: Surplus Available for New Investments
  if (income.totalAnnualIncome > 0) {
    if (surplus.monthlySurplus > 0) {
      const formattedSurplus = surplus.monthlySurplus >= 100000 
        ? `₹${(surplus.monthlySurplus / 100000).toFixed(2)} Lakh` 
        : `₹${surplus.monthlySurplus.toLocaleString('en-IN')}`;
      
      observations.push({
        id: 'obs-surplus-positive',
        category: 'surplus',
        title: 'Available Investment Capacity',
        description: `You currently have approximately ${formattedSurplus}/month available after existing ongoing investments.`,
        type: 'positive',
      });
    } else if (surplus.monthlySurplus === 0 && investments.totalMonthlyInvestments > 0) {
      observations.push({
        id: 'obs-surplus-balanced',
        category: 'surplus',
        title: 'Fully Deployed Savings',
        description: `Your entire annual savings is currently committed to ongoing investments and policies.`,
        type: 'neutral',
      });
    } else if (surplus.monthlySurplus < 0) {
      const absSurplus = Math.abs(surplus.monthlySurplus);
      const formattedAbs = absSurplus >= 100000 
        ? `₹${(absSurplus / 100000).toFixed(2)} Lakh` 
        : `₹${absSurplus.toLocaleString('en-IN')}`;

      observations.push({
        id: 'obs-surplus-deficit',
        category: 'surplus',
        title: 'Cash Flow Realignment Needed',
        description: `Your ongoing commitments exceed annual savings by approximately ${formattedAbs}/month. Review your cash flow allocation before adding new commitments.`,
        type: 'caution',
      });
    }
  }

  // Observation 3: Debt Burden / Liabilities
  if (assets.totalAssets > 0) {
    const debtRatio = Math.round((liabilities.totalLiabilities / assets.totalAssets) * 100);
    if (liabilities.totalLiabilities === 0) {
      observations.push({
        id: 'obs-debt-zero',
        category: 'debt',
        title: 'Zero Debt Obligations',
        description: 'You currently have zero debt obligations, keeping your balance sheet resilient.',
        type: 'positive',
      });
    } else if (debtRatio <= 30) {
      observations.push({
        id: 'obs-debt-manageable',
        category: 'debt',
        title: 'Conservative Debt Level',
        description: `Liabilities represent ${debtRatio}% of your current total assets, reflecting a manageable leverage position.`,
        type: 'neutral',
      });
    } else {
      observations.push({
        id: 'obs-debt-elevated',
        category: 'debt',
        title: 'Debt-to-Asset Position',
        description: `Liabilities represent ${debtRatio}% of your current total assets. Structuring an active repayment strategy can accelerate your net worth growth.`,
        type: 'caution',
      });
    }
  }

  // Observation 4: Asset Composition (Productive vs Personal)
  if (assets.totalAssets > 0) {
    const productivePercent = Math.round((assets.productiveAssets / assets.totalAssets) * 100);
    if (productivePercent >= 50) {
      observations.push({
        id: 'obs-assets-productive',
        category: 'assets',
        title: 'Healthy Financial Asset Base',
        description: `${productivePercent}% of your total assets are productive financial and investment assets that can generate returns and fund future goals.`,
        type: 'positive',
      });
    } else {
      observations.push({
        id: 'obs-assets-personal-heavy',
        category: 'assets',
        title: 'Personal-Use Asset Concentration',
        description: `${100 - productivePercent}% of your assets are in personal-use items (primary home, vehicles, jewellery). Building financial assets will strengthen liquidity.`,
        type: 'neutral',
      });
    }
  }

  return observations;
}

// 10. Master Real Statement Calculation Function
export function calculateRealStatement(input: RealStatementInput): RealStatementResult {
  const income = calculateTotalIncome(input.income);
  const expenses = calculateAnnualExpenses(input.expenses);
  const savings = calculateSavings(income.totalAnnualIncome, expenses.totalAnnualExpenses);
  const investments = calculateAnnualInvestments(input.investments, income.totalAnnualIncome);
  const surplus = calculateSurplus(savings.annualSavings, investments.totalAnnualInvestments);
  const assets = calculateAssetTotals(input.assets);
  const liabilities = calculateTotalLiabilities(input.liabilities);

  const notionalNetWorth = calculateNotionalNetWorth(assets.totalAssets, liabilities.totalLiabilities);
  const actualNetWorth = calculateActualNetWorth(assets.totalAssets, liabilities.totalLiabilities, assets.personalUseAssets);

  const debtToAssetRatio = assets.totalAssets > 0 
    ? Math.round((liabilities.totalLiabilities / assets.totalAssets) * 1000) / 10 
    : 0;

  const solvencyRatio = assets.totalAssets > 0 
    ? Math.round((notionalNetWorth / assets.totalAssets) * 1000) / 10 
    : 0;

  const productiveAssetsRatio = assets.totalAssets > 0 
    ? Math.round((assets.productiveAssets / assets.totalAssets) * 1000) / 10 
    : 0;

  const personalAssetsRatio = assets.totalAssets > 0 
    ? Math.round((assets.personalUseAssets / assets.totalAssets) * 1000) / 10 
    : 0;

  const metrics: FinancialMetrics = {
    savingsRate: savings.savingsRate,
    investmentRate: investments.investmentRate,
    debtToAssetRatio,
    solvencyRatio,
    productiveAssetsRatio,
    personalAssetsRatio,
  };

  const observations = generateFinancialObservations(
    income,
    savings,
    investments,
    surplus,
    assets,
    liabilities,
    actualNetWorth
  );

  return {
    income,
    expenses,
    savings,
    investments,
    surplus,
    assets,
    liabilities,
    notionalNetWorth,
    actualNetWorth,
    metrics,
    observations,
  };
}
