import { calculateFutureValue, calculateLumpsum } from './lumpsum';
import { calculateRequiredSIP } from './sip';

export interface GoalInput {
  goalName: string;
  targetCostToday: number;
  yearsToGoal: number;
  expectedInflation: number;
  currentSavings?: number;
  expectedReturnRate: number;
  stepUpPercentage?: number;
}

export interface GoalResult {
  goalName: string;
  targetCostToday: number;
  yearsToGoal: number;
  futureGoalCost: number;
  existingSavingsGrowth: number;
  shortfall: number;
  requiredMonthlySIP: number;
  totalInvested: number;
  estimatedReturns: number;
}

export function calculateGoal(input: GoalInput): GoalResult {
  const {
    goalName,
    targetCostToday,
    yearsToGoal,
    expectedInflation,
    currentSavings = 0,
    expectedReturnRate,
    stepUpPercentage = 0
  } = input;

  const validYears = Math.max(1, yearsToGoal);

  // 1. Calculate future goal cost with inflation
  const futureGoalCost = calculateFutureValue(
    targetCostToday,
    expectedInflation,
    validYears
  );

  // 2. Calculate growth of existing savings committed to this goal
  const existingSavingsGrowth = currentSavings > 0
    ? calculateLumpsum(currentSavings, expectedReturnRate, validYears).totalValue
    : 0;

  // 3. Net shortfall to be accumulated via SIP
  const shortfall = Math.max(0, Math.round(futureGoalCost - existingSavingsGrowth));

  // 4. Calculate required monthly SIP using shared SIP engine
  const sipResult = calculateRequiredSIP(
    shortfall,
    validYears,
    expectedReturnRate,
    stepUpPercentage
  );

  return {
    goalName: goalName || 'My Life Goal',
    targetCostToday,
    yearsToGoal: validYears,
    futureGoalCost,
    existingSavingsGrowth,
    shortfall,
    requiredMonthlySIP: sipResult.requiredMonthlySIP,
    totalInvested: sipResult.totalInvested,
    estimatedReturns: sipResult.estimatedReturns
  };
}

