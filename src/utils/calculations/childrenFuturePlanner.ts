/**
 * Ant Wealth Creation — Children's Future Planner Calculation Engine
 * 
 * Implements comprehensive goal planning methodology
 * with modern consumer adaptations (current value asset inputs, horizon-based return defaults,
 * effective monthly compounding PMT, and geometric annual step-up compounding).
 */

export const PLANNER_DEFAULTS = {
  INFLATION_RATE: 6,
  STEP_UP_PERCENTAGE: 10,
  RETURN_LESS_THAN_5_YEARS: 7,
  RETURN_5_TO_10_YEARS: 9,
  RETURN_10_PLUS_YEARS: 12,
} as const;

export interface ExistingAssetsInput {
  mutualFunds?: number;
  fixedDeposits?: number;
  gold?: number;
  stocks?: number;
  endowment?: number;
}

export interface AssetReturnOverrides {
  mutualFunds?: number;
  fixedDeposits?: number;
  gold?: number;
  stocks?: number;
  endowment?: number;
}

export type GoalPresetType = 
  | 'graduation'
  | 'post-graduation'
  | 'marriage'
  | 'schooling'
  | 'overseas-masters'
  | 'dream-venture'
  | 'custom';

export interface GoalInflationConfig {
  defaultRate: number;
  planningRange: string;
  explanation: string;
}

export const GOAL_INFLATION_CONFIGS: Record<GoalPresetType, GoalInflationConfig> = {
  schooling: {
    defaultRate: 6,
    planningRange: 'Typical planning range: 6–10%',
    explanation: 'Schooling costs can rise faster than general inflation, especially for private schools, tuition, transport and related expenses. Use this as a planning assumption and adjust it based on the school and education path you expect.',
  },
  graduation: {
    defaultRate: 6,
    planningRange: 'Typical planning range: 6–10%',
    explanation: 'Higher education costs can increase over time due to tuition, accommodation and other education-related expenses. Use this as a planning assumption and adjust it based on the course and institution you expect.',
  },
  'post-graduation': {
    defaultRate: 6,
    planningRange: 'Typical planning range: 6–10%',
    explanation: 'Post-graduation costs can vary significantly by course, institution and location. Tuition and related expenses may rise over time, so adjust this assumption based on your expected future cost.',
  },
  'overseas-masters': {
    defaultRate: 6,
    planningRange: 'Typical planning range: 6–10%+',
    explanation: 'Overseas education costs can change due to tuition fees, living expenses and currency movements. Use this as a planning assumption and adjust it based on the country, institution and course you expect.',
  },
  marriage: {
    defaultRate: 6,
    planningRange: 'Typical planning range: 6–10%',
    explanation: 'Marriage expenses can vary significantly based on location, guest count, venue, lifestyle and the scale of the celebration. Use this as a planning assumption and adjust it based on the type of wedding you expect.',
  },
  'dream-venture': {
    defaultRate: 6,
    planningRange: 'Typical planning range: 5–8%',
    explanation: 'The future cost of starting a business or venture depends on the industry, scale, technology and market conditions. Use this as a planning assumption and adjust it based on the type of venture you have in mind.',
  },
  custom: {
    defaultRate: 6,
    planningRange: 'No standard range — choose based on your goal.',
    explanation: 'This is your own planning assumption. Choose an inflation rate based on how you expect the cost of this goal to change over time.',
  },
};

export function getGoalInflationConfig(type: GoalPresetType): GoalInflationConfig {
  return GOAL_INFLATION_CONFIGS[type] || GOAL_INFLATION_CONFIGS.custom;
}

export interface ChildGoalInput {
  id: string;
  name: string;
  type: GoalPresetType;
  goalAge: number;
  targetCostToday: number;
  inflationRate?: number;
  expectedReturnRate?: number; // If undefined, calculated automatically from horizon
  isCustomReturn?: boolean;
  existingAssets?: ExistingAssetsInput;
  assetReturnOverrides?: AssetReturnOverrides;
  stepUpPercentage?: number;
  startDelayYears?: number;
  stopBeforeYears?: number;
}

export interface ChildPlannerInput {
  childName?: string;
  childCurrentAge: number;
  currentPlanningYear?: number;
  goals: ChildGoalInput[];
  globalStepUpPercentage?: number;
}

export interface GoalResultItem {
  id: string;
  name: string;
  type: GoalPresetType;
  goalAge: number;
  yearsRemaining: number;
  targetYear: number;
  targetCostToday: number;
  inflationRate: number;
  futureGoalCost: number;
  currentAssetsTotal: number;
  projectedAssetsTotal: number;
  assetsBreakdown: {
    mutualFunds: { current: number; projected: number };
    fixedDeposits: { current: number; projected: number };
    gold: { current: number; projected: number };
    stocks: { current: number; projected: number };
    endowment: { current: number; projected: number };
  };
  fundingGap: number;
  percentageFunded: number;
  isFullyFunded: boolean;
  expectedReturnRate: number;
  stepUpPercentage: number;
  startDelayYears: number;
  stopBeforeYears: number;
  effectiveInvestmentYears: number;
  requiredLumpSumToday: number;
  requiredMonthlySIP: number;
  requiredStepUpSIP: number;
}

export interface ChildPlannerSummaryResult {
  childName: string;
  childCurrentAge: number;
  currentPlanningYear: number;
  goals: GoalResultItem[];
  totalTargetCostToday: number;
  totalFutureGoalCost: number;
  totalCurrentAssets: number;
  totalProjectedAssets: number;
  totalFundingGap: number;
  overallPercentageFunded: number;
  isOverallFullyFunded: boolean;
  totalLumpSumRequired: number;
  totalMonthlySIPRequired: number;
  totalStepUpSIPStarting: number;
  activeStepUpPercentage: number;
}

/**
 * Returns the default expected investment return based on the goal time horizon.
 * < 5 years  => 7%
 * 5 to <10 y => 9%
 * >= 10 years => 12%
 */
export function getDefaultReturnForHorizon(years: number): number {
  if (years < 5) return PLANNER_DEFAULTS.RETURN_LESS_THAN_5_YEARS;
  if (years < 10) return PLANNER_DEFAULTS.RETURN_5_TO_10_YEARS;
  return PLANNER_DEFAULTS.RETURN_10_PLUS_YEARS;
}

/**
 * Calculates future value given inflation or constant growth rate.
 * FV = PV * (1 + inflationRate/100)^years
 */
export function calculateFutureGoalCost(
  todayCost: number,
  inflationRate: number,
  years: number
): number {
  if (todayCost <= 0 || years <= 0) return Math.max(0, todayCost);
  const rate = Math.max(0, inflationRate) / 100;
  return Math.round(todayCost * Math.pow(1 + rate, years));
}

/**
 * Projects existing assets to the goal date.
 * Default growth rate matches the goal's expected investment return unless overridden.
 */
export function calculateProjectedAssets(
  assets: ExistingAssetsInput = {},
  defaultReturnRate: number,
  years: number,
  overrides: AssetReturnOverrides = {}
): {
  totalCurrent: number;
  totalProjected: number;
  breakdown: GoalResultItem['assetsBreakdown'];
} {
  const safeYears = Math.max(0, years);
  const categories = ['mutualFunds', 'fixedDeposits', 'gold', 'stocks', 'endowment'] as const;

  let totalCurrent = 0;
  let totalProjected = 0;

  const breakdown = {
    mutualFunds: { current: 0, projected: 0 },
    fixedDeposits: { current: 0, projected: 0 },
    gold: { current: 0, projected: 0 },
    stocks: { current: 0, projected: 0 },
    endowment: { current: 0, projected: 0 },
  };

  for (const cat of categories) {
    const current = Math.max(0, Number(assets[cat]) || 0);
    const rate = Math.max(0, Number(overrides[cat] ?? defaultReturnRate) || 0) / 100;
    const projected = current > 0 ? Math.round(current * Math.pow(1 + rate, safeYears)) : 0;

    totalCurrent += current;
    totalProjected += projected;

    breakdown[cat] = {
      current,
      projected,
    };
  }

  return {
    totalCurrent: Math.round(totalCurrent),
    totalProjected: Math.round(totalProjected),
    breakdown,
  };
}

/**
 * Calculates the required lump sum today to cover the funding gap at the expected return rate.
 * PV = FundingGap / (1 + returnRate/100)^years
 */
export function calculateRequiredLumpSum(
  fundingGap: number,
  returnRate: number,
  years: number
): number {
  if (fundingGap <= 0 || years <= 0) return 0;
  const rate = Math.max(0, returnRate) / 100;
  if (rate === 0) return Math.round(fundingGap);
  return Math.round(fundingGap / Math.pow(1 + rate, years));
}

/**
 * Calculates fixed monthly SIP using the effective monthly compounding formula.
 * r_eff = (1 + r)^(1/12) - 1
 * PMT = FV * r_eff / ((1 + r_eff)^n - 1)
 */
export function calculateRequiredFixedSIP(
  targetAmount: number,
  investmentYears: number,
  annualReturnRate: number
): number {
  if (targetAmount <= 0 || investmentYears <= 0) return 0;

  const n = Math.max(1, Math.round(investmentYears * 12));
  const rAnnual = Math.max(0, annualReturnRate) / 100;

  if (rAnnual === 0) {
    return Math.max(1, Math.round(targetAmount / n));
  }

  const rEff = Math.pow(1 + rAnnual, 1 / 12) - 1;
  const denominator = Math.pow(1 + rEff, n) - 1;

  if (denominator <= 0) return Math.max(1, Math.round(targetAmount / n));

  const pmt = (targetAmount * rEff) / denominator;
  return Math.max(1, Math.round(pmt));
}

/**
 * Calculates starting monthly Step-Up SIP using geometric annual increment formula.
 * PMT_start = FV / Σ[y=1..Y] [ (1 + g)^(y-1) * ((1 + r_eff)^12 - 1) / r_eff * (1 + r)^(Y - y) ]
 */
export function calculateRequiredStepUpSIP(
  targetAmount: number,
  investmentYears: number,
  annualReturnRate: number,
  stepUpPercentage: number
): number {
  if (targetAmount <= 0 || investmentYears <= 0) return 0;

  const gAnnual = Math.max(0, stepUpPercentage) / 100;
  const rAnnual = Math.max(0, annualReturnRate) / 100;
  const Y = Math.max(1, Math.round(investmentYears));

  if (gAnnual === 0) {
    return calculateRequiredFixedSIP(targetAmount, investmentYears, annualReturnRate);
  }

  const rEff = rAnnual > 0 ? Math.pow(1 + rAnnual, 1 / 12) - 1 : 0;

  let totalFactor = 0;
  for (let y = 1; y <= Y; y++) {
    const yearGrowthMultiplier = Math.pow(1 + gAnnual, y - 1);
    const fv12MonthsPerUnit = rAnnual > 0 && rEff > 0
      ? (Math.pow(1 + rEff, 12) - 1) / rEff
      : 12;
    const compoundRemainingYears = rAnnual > 0
      ? Math.pow(1 + rAnnual, Y - y)
      : 1;

    totalFactor += yearGrowthMultiplier * fv12MonthsPerUnit * compoundRemainingYears;
  }

  if (totalFactor <= 0) return Math.max(1, Math.round(targetAmount / (Y * 12)));

  const pmtStart = targetAmount / totalFactor;
  return Math.max(1, Math.round(pmtStart));
}

/**
 * Comprehensive master calculation for multi-goal Children's Future Plan.
 */
export function calculateChildrenFuturePlan(input: ChildPlannerInput): ChildPlannerSummaryResult {
  const childName = (input.childName || 'My Child').trim();
  const childCurrentAge = Math.max(0, Math.min(25, Number(input.childCurrentAge) || 0));
  const currentPlanningYear = Number(input.currentPlanningYear) || new Date().getFullYear();
  const globalStepUp = Number(input.globalStepUpPercentage ?? PLANNER_DEFAULTS.STEP_UP_PERCENTAGE);

  const goalResults: GoalResultItem[] = [];

  let totalTargetCostToday = 0;
  let totalFutureGoalCost = 0;
  let totalCurrentAssets = 0;
  let totalProjectedAssets = 0;
  let totalFundingGap = 0;
  let totalLumpSumRequired = 0;
  let totalMonthlySIPRequired = 0;
  let totalStepUpSIPStarting = 0;

  for (const goal of input.goals) {
    const goalAge = Math.max(childCurrentAge + 1, Number(goal.goalAge) || (childCurrentAge + 1));
    const yearsRemaining = Math.max(1, goalAge - childCurrentAge);
    const targetYear = currentPlanningYear + yearsRemaining;
    const targetCostToday = Math.max(0, Number(goal.targetCostToday) || 0);

    const inflationRate = Number(goal.inflationRate ?? PLANNER_DEFAULTS.INFLATION_RATE);

    // Expected return: use custom return if set by user, otherwise calculate based on horizon
    const expectedReturnRate = goal.isCustomReturn && goal.expectedReturnRate !== undefined
      ? Number(goal.expectedReturnRate)
      : getDefaultReturnForHorizon(yearsRemaining);

    const stepUpPercentage = Number(goal.stepUpPercentage ?? globalStepUp);
    const startDelayYears = Math.max(0, Math.min(yearsRemaining - 1, Number(goal.startDelayYears) || 0));
    const stopBeforeYears = Math.max(0, Math.min(yearsRemaining - startDelayYears - 1, Number(goal.stopBeforeYears) || 0));

    // 1. Calculate future goal cost with inflation
    const futureGoalCost = calculateFutureGoalCost(targetCostToday, inflationRate, yearsRemaining);

    // 2. Project existing assets
    const { totalCurrent, totalProjected, breakdown } = calculateProjectedAssets(
      goal.existingAssets,
      expectedReturnRate,
      yearsRemaining,
      goal.assetReturnOverrides
    );

    // 3. Compute funding gap and funded percentage
    const fundingGap = Math.max(0, futureGoalCost - totalProjected);
    const percentageFunded = futureGoalCost > 0
      ? Math.min(100, Math.round((totalProjected / futureGoalCost) * 1000) / 10)
      : (totalProjected > 0 ? 100 : 0);
    const isFullyFunded = totalProjected >= futureGoalCost;

    // 4. Determine active investment timing
    const effectiveInvestmentYears = Math.max(1, yearsRemaining - startDelayYears - stopBeforeYears);
    const compoundAfterStopYears = stopBeforeYears;

    // Intermediate target needed at the end of active contribution period
    const targetAtEndOfContributions = compoundAfterStopYears > 0 && expectedReturnRate > 0
      ? fundingGap / Math.pow(1 + expectedReturnRate / 100, compoundAfterStopYears)
      : fundingGap;

    // 5. Calculate required investments
    const requiredLumpSumToday = calculateRequiredLumpSum(fundingGap, expectedReturnRate, yearsRemaining);
    const requiredMonthlySIP = calculateRequiredFixedSIP(
      targetAtEndOfContributions,
      effectiveInvestmentYears,
      expectedReturnRate
    );
    const requiredStepUpSIP = calculateRequiredStepUpSIP(
      targetAtEndOfContributions,
      effectiveInvestmentYears,
      expectedReturnRate,
      stepUpPercentage
    );

    goalResults.push({
      id: goal.id,
      name: goal.name || 'Milestone Goal',
      type: goal.type,
      goalAge,
      yearsRemaining,
      targetYear,
      targetCostToday,
      inflationRate,
      futureGoalCost,
      currentAssetsTotal: totalCurrent,
      projectedAssetsTotal: totalProjected,
      assetsBreakdown: breakdown,
      fundingGap,
      percentageFunded,
      isFullyFunded,
      expectedReturnRate,
      stepUpPercentage,
      startDelayYears,
      stopBeforeYears,
      effectiveInvestmentYears,
      requiredLumpSumToday,
      requiredMonthlySIP,
      requiredStepUpSIP,
    });

    totalTargetCostToday += targetCostToday;
    totalFutureGoalCost += futureGoalCost;
    totalCurrentAssets += totalCurrent;
    totalProjectedAssets += totalProjected;
    totalFundingGap += fundingGap;
    totalLumpSumRequired += requiredLumpSumToday;
    totalMonthlySIPRequired += requiredMonthlySIP;
    totalStepUpSIPStarting += requiredStepUpSIP;
  }

  const overallPercentageFunded = totalFutureGoalCost > 0
    ? Math.min(100, Math.round((totalProjectedAssets / totalFutureGoalCost) * 1000) / 10)
    : (totalProjectedAssets > 0 ? 100 : 0);

  return {
    childName,
    childCurrentAge,
    currentPlanningYear,
    goals: goalResults,
    totalTargetCostToday,
    totalFutureGoalCost,
    totalCurrentAssets,
    totalProjectedAssets,
    totalFundingGap,
    overallPercentageFunded,
    isOverallFullyFunded: totalProjectedAssets >= totalFutureGoalCost,
    totalLumpSumRequired,
    totalMonthlySIPRequired,
    totalStepUpSIPStarting,
    activeStepUpPercentage: globalStepUp,
  };
}
