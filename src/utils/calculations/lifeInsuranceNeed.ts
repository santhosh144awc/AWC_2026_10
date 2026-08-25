/**
 * Ant Wealth Creation — Life Insurance Need Calculation Engine
 * 
 * Implements the validated NetworkFP / QPFP Life Insurance Need Analysis methodology.
 * 
 * Mathematical Core:
 * - Outstanding Liabilities (A)
 * - Family Goals & Commitments (B)
 * - Future Living Expense Corpus (C) using exact Annuity-Due (type = 1) compounding:
 *   r_tax = r_gross * (1 - taxRate)
 *   r_real = ((1 + r_tax) / (1 + inflation)) - 1
 *   Corpus = AnnualFamilyExpenses * ((1 - (1 + r_real)^(-n)) / r_real) * (1 + r_real)
 * 
 * Total Life Insurance Required = A + B + C
 * Additional Cover Required = max(0, Total Requirement - Existing Resources)
 */

export interface LifeInsuranceLiabilities {
  homeLoan: number;
  vehicleLoan: number;
  personalLoan: number;
  educationLoan: number;
  otherLoans: number;
}

export interface LifeInsuranceGoals {
  higherEducation: number;
  marriage: number;
  primaryEducation: number;
  parentsContribution: number;
  firstHousePurchase: number;
}

export interface FamilyExpenseInputs {
  householdExpenses: number;
  lifestyleExpenses: number;
}

export interface LifeInsuranceAssumptions {
  yearsOfSupport: number;
  expenseInflation: number;
  taxRate: number;
  expectedReturn: number;
  personalExpenseDiscount: number;
}

export interface ExistingResources {
  existingLifeInsurance: number;
  investmentAssets: number;
  spouseFutureEarningsPV: number;
}

export interface LifeInsuranceNeedInput {
  liabilities: LifeInsuranceLiabilities;
  goals: LifeInsuranceGoals;
  expenses: FamilyExpenseInputs;
  assumptions: LifeInsuranceAssumptions;
  resources: ExistingResources;
}

export interface LifeInsuranceNeedResult {
  totalLiabilities: number;
  totalFamilyGoals: number;
  totalAnnualExpenses: number;
  annualFamilyExpenses: number;
  taxAdjustedReturn: number; // percentage (e.g. 7.2 for 7.2%)
  realReturn: number; // percentage (e.g. 1.132075 for 1.132075%)
  realReturnDecimal: number; // decimal (e.g. 0.01132075...)
  futureFamilyExpenseCorpus: number;
  totalRequirement: number;
  existingLifeInsurance: number;
  investmentAssets: number;
  spouseFutureEarningsPV: number;
  totalExistingResources: number;
  rawProtectionGap: number;
  additionalCoverRequired: number;
  isCovered: boolean;
  breakdown: {
    liabilities: number;
    goals: number;
    livingExpenseCorpus: number;
  };
  assumptions: LifeInsuranceAssumptions;
}

export const DEFAULT_ASSUMPTIONS: LifeInsuranceAssumptions = {
  yearsOfSupport: 25,
  expenseInflation: 6,
  taxRate: 10,
  expectedReturn: 8,
  personalExpenseDiscount: 20,
};

export const DEFAULT_LIABILITIES: LifeInsuranceLiabilities = {
  homeLoan: 0,
  vehicleLoan: 0,
  personalLoan: 0,
  educationLoan: 0,
  otherLoans: 0,
};

export const DEFAULT_GOALS: LifeInsuranceGoals = {
  higherEducation: 0,
  marriage: 0,
  primaryEducation: 0,
  parentsContribution: 0,
  firstHousePurchase: 0,
};

export const DEFAULT_EXPENSES: FamilyExpenseInputs = {
  householdExpenses: 0,
  lifestyleExpenses: 0,
};

export const DEFAULT_RESOURCES: ExistingResources = {
  existingLifeInsurance: 0,
  investmentAssets: 0,
  spouseFutureEarningsPV: 0,
};

export const SAMPLE_LIFE_INSURANCE_INPUT: LifeInsuranceNeedInput = {
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

/**
 * 1. Calculate Total Outstanding Liabilities (Component A)
 */
export function calculateOutstandingLiabilities(liabilities: LifeInsuranceLiabilities): number {
  const home = Math.max(0, Number(liabilities.homeLoan) || 0);
  const vehicle = Math.max(0, Number(liabilities.vehicleLoan) || 0);
  const personal = Math.max(0, Number(liabilities.personalLoan) || 0);
  const education = Math.max(0, Number(liabilities.educationLoan) || 0);
  const other = Math.max(0, Number(liabilities.otherLoans) || 0);

  return Math.round(home + vehicle + personal + education + other);
}

/**
 * 2. Calculate Total Family Goals & Commitments (Component B)
 * Entered as today's present-value estimates (no separate inflation applied).
 */
export function calculateFamilyGoals(goals: LifeInsuranceGoals): number {
  const higherEdu = Math.max(0, Number(goals.higherEducation) || 0);
  const marriage = Math.max(0, Number(goals.marriage) || 0);
  const primaryEdu = Math.max(0, Number(goals.primaryEducation) || 0);
  const parents = Math.max(0, Number(goals.parentsContribution) || 0);
  const house = Math.max(0, Number(goals.firstHousePurchase) || 0);

  return Math.round(higherEdu + marriage + primaryEdu + parents + house);
}

/**
 * 3. Calculate Total Annual Expenses
 */
export function calculateTotalAnnualExpenses(expenses: FamilyExpenseInputs): number {
  const household = Math.max(0, Number(expenses.householdExpenses) || 0);
  const lifestyle = Math.max(0, Number(expenses.lifestyleExpenses) || 0);

  return Math.round(household + lifestyle);
}

/**
 * 4. Calculate Annual Family Expenses after Personal Expense Discount
 */
export function calculateAnnualFamilyExpenses(
  totalAnnualExpenses: number,
  personalExpenseDiscount: number
): number {
  const safeTotal = Math.max(0, Number(totalAnnualExpenses) || 0);
  const safeDiscount = Math.min(100, Math.max(0, Number(personalExpenseDiscount) || 0));
  const discountMultiplier = 1 - safeDiscount / 100;

  return Math.round(safeTotal * discountMultiplier);
}

/**
 * 5. Calculate Tax-Adjusted Return
 * r_taxAdjusted = expectedReturn * (1 - taxRate / 100)
 */
export function calculateTaxAdjustedReturn(expectedReturn: number, taxRate: number): number {
  const safeReturn = Math.max(0, Number(expectedReturn) || 0);
  const safeTax = Math.min(100, Math.max(0, Number(taxRate) || 0));

  return safeReturn * (1 - safeTax / 100);
}

/**
 * 6. Calculate Exact Real Return (Compound Fisher Relation)
 * r_real = ((1 + r_taxAdjusted / 100) / (1 + expenseInflation / 100)) - 1
 * Returns percentage (e.g. 1.132075...)
 */
export function calculateRealReturn(taxAdjustedReturn: number, expenseInflation: number): number {
  const rTaxDecimal = (Number(taxAdjustedReturn) || 0) / 100;
  const inflationDecimal = Math.max(-0.99, (Number(expenseInflation) || 0) / 100);

  const realReturnDecimal = (1 + rTaxDecimal) / (1 + inflationDecimal) - 1;
  return realReturnDecimal * 100;
}

/**
 * 7. Calculate Future Family Expense Corpus using Annuity Due (type = 1)
 * 
 * Formula:
 * For r != 0:
 *   PV_due = A * [ (1 - (1 + r)^(-n)) / r ] * (1 + r)
 * For r == 0:
 *   PV = A * n
 * 
 * Where:
 *   A = Annual Family Expenses
 *   r = Real Return (decimal)
 *   n = Years of Family Expense Support
 */
export function calculateFutureFamilyExpenseCorpus(
  annualFamilyExpenses: number,
  realReturnDecimal: number,
  yearsOfSupport: number
): number {
  const safeExpenses = Math.max(0, Number(annualFamilyExpenses) || 0);
  const safeYears = Math.max(0, Number(yearsOfSupport) || 0);

  if (safeExpenses === 0 || safeYears === 0) {
    return 0;
  }

  // Zero-rate or near-zero fallback
  if (Math.abs(realReturnDecimal) < 1e-9) {
    return Math.round(safeExpenses * safeYears);
  }

  // Annuity Due: Ordinary Annuity * (1 + r)
  const ordinaryAnnuityFactor = (1 - Math.pow(1 + realReturnDecimal, -safeYears)) / realReturnDecimal;
  const annuityDueFactor = ordinaryAnnuityFactor * (1 + realReturnDecimal);

  return Math.round(safeExpenses * annuityDueFactor);
}

/**
 * 8. Calculate Total Life Insurance Required (Component A + B + C)
 */
export function calculateTotalLifeInsuranceRequired(
  totalLiabilities: number,
  totalFamilyGoals: number,
  futureFamilyExpenseCorpus: number
): number {
  const liabilities = Math.max(0, Number(totalLiabilities) || 0);
  const goals = Math.max(0, Number(totalFamilyGoals) || 0);
  const corpus = Math.max(0, Number(futureFamilyExpenseCorpus) || 0);

  return Math.round(liabilities + goals + corpus);
}

/**
 * 9. Calculate Total Existing Resources Available
 */
export function calculateTotalExistingResources(resources: ExistingResources): number {
  const insurance = Math.max(0, Number(resources.existingLifeInsurance) || 0);
  const investments = Math.max(0, Number(resources.investmentAssets) || 0);
  const spouseEarnings = Math.max(0, Number(resources.spouseFutureEarningsPV) || 0);

  return Math.round(insurance + investments + spouseEarnings);
}

/**
 * 10. Calculate Raw Protection Gap
 */
export function calculateRawProtectionGap(
  totalRequirement: number,
  totalExistingResources: number
): number {
  const req = Math.max(0, Number(totalRequirement) || 0);
  const res = Math.max(0, Number(totalExistingResources) || 0);

  return Math.round(req - res);
}

/**
 * 11. Calculate Additional Cover Required (Capped at 0 for consumer display)
 */
export function calculateAdditionalCover(rawProtectionGap: number): number {
  return Math.max(0, Math.round(Number(rawProtectionGap) || 0));
}

/**
 * 12. Master Orchestrator: calculateLifeInsuranceNeed
 */
export function calculateLifeInsuranceNeed(input: LifeInsuranceNeedInput): LifeInsuranceNeedResult {
  const liabilities = input.liabilities || DEFAULT_LIABILITIES;
  const goals = input.goals || DEFAULT_GOALS;
  const expenses = input.expenses || DEFAULT_EXPENSES;
  const assumptions = input.assumptions || DEFAULT_ASSUMPTIONS;
  const resources = input.resources || DEFAULT_RESOURCES;

  // Component A: Liabilities
  const totalLiabilities = calculateOutstandingLiabilities(liabilities);

  // Component B: Family Goals
  const totalFamilyGoals = calculateFamilyGoals(goals);

  // Component C: Future Family Living Expenses
  const totalAnnualExpenses = calculateTotalAnnualExpenses(expenses);
  const annualFamilyExpenses = calculateAnnualFamilyExpenses(
    totalAnnualExpenses,
    assumptions.personalExpenseDiscount
  );

  const taxAdjustedReturn = calculateTaxAdjustedReturn(
    assumptions.expectedReturn,
    assumptions.taxRate
  );

  const realReturn = calculateRealReturn(
    taxAdjustedReturn,
    assumptions.expenseInflation
  );

  const realReturnDecimal = realReturn / 100;

  const futureFamilyExpenseCorpus = calculateFutureFamilyExpenseCorpus(
    annualFamilyExpenses,
    realReturnDecimal,
    assumptions.yearsOfSupport
  );

  // Total Life Insurance Requirement (A + B + C)
  const totalRequirement = calculateTotalLifeInsuranceRequired(
    totalLiabilities,
    totalFamilyGoals,
    futureFamilyExpenseCorpus
  );

  // Existing Resources
  const existingLifeInsurance = Math.max(0, Number(resources.existingLifeInsurance) || 0);
  const investmentAssets = Math.max(0, Number(resources.investmentAssets) || 0);
  const spouseFutureEarningsPV = Math.max(0, Number(resources.spouseFutureEarningsPV) || 0);
  const totalExistingResources = calculateTotalExistingResources(resources);

  // Protection Gap
  const rawProtectionGap = calculateRawProtectionGap(totalRequirement, totalExistingResources);
  const additionalCoverRequired = calculateAdditionalCover(rawProtectionGap);
  const isCovered = rawProtectionGap <= 0;

  return {
    totalLiabilities,
    totalFamilyGoals,
    totalAnnualExpenses,
    annualFamilyExpenses,
    taxAdjustedReturn,
    realReturn,
    realReturnDecimal,
    futureFamilyExpenseCorpus,
    totalRequirement,
    existingLifeInsurance,
    investmentAssets,
    spouseFutureEarningsPV,
    totalExistingResources,
    rawProtectionGap,
    additionalCoverRequired,
    isCovered,
    breakdown: {
      liabilities: totalLiabilities,
      goals: totalFamilyGoals,
      livingExpenseCorpus: futureFamilyExpenseCorpus,
    },
    assumptions: {
      ...assumptions,
    },
  };
}

/**
 * Currency Formatting Helpers
 */
export function formatIndianCurrency(amount: number): string {
  if (isNaN(amount) || amount === 0) return '₹0';
  const prefix = amount < 0 ? '-₹' : '₹';
  return `${prefix}${Math.abs(amount).toLocaleString('en-IN')}`;
}

export function formatLakhsCrores(amount: number): string {
  if (isNaN(amount) || amount === 0) return '₹0';
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const prefix = isNegative ? '-₹' : '₹';

  if (absAmount >= 10000000) {
    const cr = absAmount / 10000000;
    return `${prefix}${cr.toFixed(2)} Cr`;
  }
  if (absAmount >= 100000) {
    const lk = absAmount / 100000;
    return `${prefix}${lk.toFixed(2)} Lakh`;
  }
  return `${prefix}${absAmount.toLocaleString('en-IN')}`;
}
