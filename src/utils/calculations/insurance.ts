export interface InsuranceInput {
  annualIncome: number;
  yearsOfIncomeReplacement?: number;
  outstandingLoans?: number;
  futureMajorGoals?: number;
  existingLiquidAssets?: number;
  existingLifeCover?: number;
}

export interface InsuranceResult {
  annualIncome: number;
  incomeReplacementNeed: number;
  outstandingLoans: number;
  futureMajorGoals: number;
  totalGrossRequirement: number;
  existingLiquidAssets: number;
  existingLifeCover: number;
  totalExistingCushion: number;
  netAdditionalCoverRequired: number;
  indicativeMultiplier: number;
}

export function calculateInsuranceNeed(input: InsuranceInput): InsuranceResult {
  const {
    annualIncome = 0,
    yearsOfIncomeReplacement = 15,
    outstandingLoans = 0,
    futureMajorGoals = 0,
    existingLiquidAssets = 0,
    existingLifeCover = 0
  } = input;

  const validYears = Math.max(1, yearsOfIncomeReplacement);

  // 1. Income replacement for family sustenance
  const incomeReplacementNeed = Math.round(annualIncome * validYears);

  // 2. Total Gross Protection Need
  const totalGrossRequirement = Math.round(
    incomeReplacementNeed + outstandingLoans + futureMajorGoals
  );

  // 3. Existing resources available to family
  const totalExistingCushion = Math.round(existingLiquidAssets + existingLifeCover);

  // 4. Net additional pure term life insurance needed
  const netAdditionalCoverRequired = Math.max(
    0,
    Math.round(totalGrossRequirement - totalExistingCushion)
  );

  const indicativeMultiplier = annualIncome > 0 
    ? Math.round((netAdditionalCoverRequired / annualIncome) * 10) / 10 
    : 0;

  return {
    annualIncome,
    incomeReplacementNeed,
    outstandingLoans,
    futureMajorGoals,
    totalGrossRequirement,
    existingLiquidAssets,
    existingLifeCover,
    totalExistingCushion,
    netAdditionalCoverRequired,
    indicativeMultiplier
  };
}

