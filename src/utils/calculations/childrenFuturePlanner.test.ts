// Automated Validation & Regression Test Suite for Children's Future Planner
import {
  calculateFutureGoalCost,
  calculateProjectedAssets,
  calculateRequiredLumpSum,
  calculateRequiredFixedSIP,
  calculateRequiredStepUpSIP,
  calculateChildrenFuturePlan,
  getDefaultReturnForHorizon,
  PLANNER_DEFAULTS
} from './childrenFuturePlanner';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, details: string = '') {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${testName} - ${details}`);
    failed++;
  }
}

function assertClose(actual: number, expected: number, tolerancePercent: number, testName: string) {
  const diff = Math.abs(actual - expected);
  const allowed = (expected * tolerancePercent) / 100;
  if (diff <= allowed) {
    console.log(`✅ PASS: ${testName} (Actual: ${actual}, Expected: ${expected})`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${testName} (Actual: ${actual}, Expected: ${expected}, Diff: ${diff} > Allowed: ${allowed})`);
    failed++;
  }
}

console.log('--- 1. Testing Default Return Horizons ---');
assert(getDefaultReturnForHorizon(1) === 7, 'Horizon 1y returns 7%');
assert(getDefaultReturnForHorizon(4) === 7, 'Horizon 4y returns 7%');
assert(getDefaultReturnForHorizon(5) === 9, 'Horizon 5y returns 9%');
assert(getDefaultReturnForHorizon(9) === 9, 'Horizon 9y returns 9%');
assert(getDefaultReturnForHorizon(10) === 12, 'Horizon 10y returns 12%');
assert(getDefaultReturnForHorizon(15) === 12, 'Horizon 15y returns 12%');

console.log('\n--- 2. Testing NetworkFP / QPFP Reference Scenarios ---');

// Reference Scenario 1: Graduation
// Child Age: 5, Goal Age: 18 -> 13 yrs
// Today Cost: 20,00,000, Inflation: 5%, Existing Assets: 5,00,000, Return: 11%
const gradFuture = calculateFutureGoalCost(2000000, 5, 13);
assertClose(gradFuture, 3771298, 0.01, 'Graduation Future Cost ≈ ₹37.71 Lakh (3,771,298)');

const gradGap = gradFuture - 500000;
assertClose(gradGap, 3271298, 0.01, 'Graduation Funding Gap ≈ ₹32.71 Lakh (3,271,298)');

// Exact PV math: 3,271,298.28 / (1.11)^13 = 842,405.94 -> 842,406 (which is ₹8.42 Lakh)
const gradLumpSum = calculateRequiredLumpSum(gradGap, 11, 13);
assert(gradLumpSum === 842406, 'Graduation Lump Sum exact integer = ₹8,42,406 (₹8.42 Lakh)');
assertClose(gradLumpSum, 842478, 0.05, 'Graduation Lump Sum matches reference ₹8.42 Lakh within 0.05%');

const gradFixedSIP = calculateRequiredFixedSIP(gradGap, 13, 11);
assert(gradFixedSIP === 9910, 'Graduation Fixed SIP exact = ₹9,910/mo');

const gradStepUpSIP = calculateRequiredStepUpSIP(gradGap, 13, 11, 10);
assert(gradStepUpSIP === 6027, 'Graduation Step-Up SIP exact = ₹6,027/mo');

// Reference Scenario 2: Post-Graduation
// Child Age: 5, Goal Age: 21 -> 16 yrs
// Today Cost: 20,00,000, Inflation: 5%, Existing Assets: 3,00,000, Return: 11%
const postGradFuture = calculateFutureGoalCost(2000000, 5, 16);
assertClose(postGradFuture, 4365749, 0.01, 'Post-Graduation Future Cost ≈ ₹43.66 Lakh (4,365,749)');

const postGradGap = postGradFuture - 300000;
assertClose(postGradGap, 4065749, 0.01, 'Post-Graduation Funding Gap ≈ ₹40.66 Lakh (4,065,749)');

// Exact PV math: 4,065,748.88 / (1.11)^16 = 765,548.87 -> 765,549 (which is ₹7.66 Lakh)
const postGradLumpSum = calculateRequiredLumpSum(postGradGap, 11, 16);
assert(postGradLumpSum === 765549, 'Post-Graduation Lump Sum exact integer = ₹7,65,549 (₹7.66 Lakh)');
assertClose(postGradLumpSum, 765992, 0.1, 'Post-Graduation Lump Sum matches reference ₹7.66 Lakh within 0.1%');

const postGradFixedSIP = calculateRequiredFixedSIP(postGradGap, 16, 11);
assert(postGradFixedSIP === 8238, 'Post-Graduation Fixed SIP exact = ₹8,238/mo');

const postGradStepUpSIP = calculateRequiredStepUpSIP(postGradGap, 16, 11, 10);
assert(postGradStepUpSIP === 4509, 'Post-Graduation Step-Up SIP exact = ₹4,509/mo');

// Reference Scenario 3: Marriage
// Child Age: 5, Goal Age: 26 -> 21 yrs
// Today Cost: 20,00,000, Inflation: 12%, Existing Assets: 5,00,000, Return: 12%
const marrFuture = calculateFutureGoalCost(2000000, 12, 21);
assertClose(marrFuture, 21607697, 0.01, 'Marriage Future Cost ≈ ₹2.16 Crore (21,607,697)');

const marrGap = marrFuture - 500000;
assertClose(marrGap, 21107697, 0.01, 'Marriage Funding Gap ≈ ₹2.11 Crore (21,107,697)');

// Exact PV math: 21,107,697 / (1.12)^21 = 1,953,720.08 -> 1,953,720 (which is ₹19.54 Lakh)
const marrLumpSum = calculateRequiredLumpSum(marrGap, 12, 21);
assert(marrLumpSum === 1953720, 'Marriage Lump Sum exact integer = ₹19,53,720 (₹19.54 Lakh)');
assertClose(marrLumpSum, 1954496, 0.1, 'Marriage Lump Sum matches reference ₹19.54 Lakh within 0.1%');

const marrFixedSIP = calculateRequiredFixedSIP(marrGap, 21, 12);
assert(marrFixedSIP === 20429, 'Marriage Fixed SIP exact = ₹20,429/mo');

const marrStepUpSIP = calculateRequiredStepUpSIP(marrGap, 21, 12, 10);
assert(marrStepUpSIP === 9808, 'Marriage Step-Up SIP exact = ₹9,808/mo');

console.log('\n--- 3. Testing Existing Asset Projection (Consumer Model) ---');
const projected = calculateProjectedAssets({ mutualFunds: 500000 }, 12, 10);
// 5,00,000 * (1.12)^10 = 1,552,924.1
assertClose(projected.totalProjected, 1552924, 0.01, 'Asset Projection for ₹5L @ 12% for 10y ≈ ₹15.53 Lakh');

console.log('\n--- 4. Testing Multi-Goal Master Aggregator ---');
const masterPlan = calculateChildrenFuturePlan({
  childName: 'Aarav',
  childCurrentAge: 5,
  currentPlanningYear: 2026,
  goals: [
    {
      id: 'g1',
      name: 'Graduation',
      type: 'graduation',
      goalAge: 18,
      targetCostToday: 2000000,
      inflationRate: 6,
      existingAssets: { mutualFunds: 200000 }
    },
    {
      id: 'g2',
      name: 'Post-Graduation',
      type: 'post-graduation',
      goalAge: 21,
      targetCostToday: 2500000,
      inflationRate: 6,
      existingAssets: { fixedDeposits: 100000 }
    }
  ]
});

assert(masterPlan.goals.length === 2, 'Two goals calculated');
assert(masterPlan.goals[0].yearsRemaining === 13, 'Goal 1 horizon = 13y');
assert(masterPlan.goals[0].targetYear === 2039, 'Goal 1 target year = 2039');
assert(masterPlan.goals[0].expectedReturnRate === 12, 'Goal 1 return rate = 12%');
assert(masterPlan.totalFutureGoalCost > 0, 'Total future cost calculated');
assert(masterPlan.totalFundingGap > 0, 'Total funding gap calculated');
assert(masterPlan.totalMonthlySIPRequired > 0, 'Total monthly SIP calculated');
assert(masterPlan.totalStepUpSIPStarting > 0, 'Total step-up SIP calculated');

console.log('\n--- 5. Testing Advanced Investment Timing ---');
// Timing 1: Start Delay = 2y, Stop Before = 0
const delayPlan = calculateChildrenFuturePlan({
  childCurrentAge: 5,
  goals: [{
    id: 't1',
    name: 'Goal with Delay',
    type: 'custom',
    goalAge: 18,
    targetCostToday: 2000000,
    inflationRate: 6,
    startDelayYears: 2,
    stopBeforeYears: 0
  }]
});
assert(delayPlan.goals[0].effectiveInvestmentYears === 11, 'Delay 2y on 13y horizon results in 11 active years');
assert(delayPlan.goals[0].requiredMonthlySIP > 0, 'Delay plan calculates valid positive SIP');

// Timing 2: Start Delay = 0, Stop Before = 2y
const stopPlan = calculateChildrenFuturePlan({
  childCurrentAge: 5,
  goals: [{
    id: 't2',
    name: 'Goal with Stop Before',
    type: 'custom',
    goalAge: 18,
    targetCostToday: 2000000,
    inflationRate: 6,
    startDelayYears: 0,
    stopBeforeYears: 2
  }]
});
assert(stopPlan.goals[0].effectiveInvestmentYears === 11, 'Stop before 2y on 13y horizon results in 11 active years');
assert(stopPlan.goals[0].requiredMonthlySIP > 0, 'Stop-before plan calculates valid positive SIP');

// Timing 3: Step-Up = 0% must equal Fixed SIP
const zeroStepUpPlan = calculateChildrenFuturePlan({
  childCurrentAge: 5,
  globalStepUpPercentage: 0,
  goals: [{
    id: 't3',
    name: 'Zero Step-Up Goal',
    type: 'custom',
    goalAge: 18,
    targetCostToday: 2000000,
    inflationRate: 6
  }]
});
assert(
  zeroStepUpPlan.goals[0].requiredStepUpSIP === zeroStepUpPlan.goals[0].requiredMonthlySIP,
  'Step-up 0% produces identical value to Fixed Monthly SIP'
);

console.log('\n--- 6. Testing Edge Cases & Boundary Conditions ---');
// Zero assets
const zeroAssets = calculateChildrenFuturePlan({
  childCurrentAge: 5,
  goals: [{ id: 'z1', name: 'G', type: 'custom', goalAge: 15, targetCostToday: 1000000 }]
});
assert(zeroAssets.goals[0].fundingGap === zeroAssets.goals[0].futureGoalCost, 'Zero assets -> Gap equals Future Cost');

// 100% fully funded
const fullyFunded = calculateChildrenFuturePlan({
  childCurrentAge: 5,
  goals: [{
    id: 'f1',
    name: 'G',
    type: 'custom',
    goalAge: 10,
    targetCostToday: 100000,
    existingAssets: { mutualFunds: 1000000 }
  }]
});
assert(fullyFunded.goals[0].fundingGap === 0, 'Over-funded -> Funding Gap is 0');
assert(fullyFunded.goals[0].isFullyFunded === true, 'isFullyFunded is true');
assert(fullyFunded.goals[0].requiredMonthlySIP === 0, 'Fully funded -> Required SIP is 0');
assert(fullyFunded.goals[0].requiredLumpSumToday === 0, 'Fully funded -> Required Lump Sum is 0');

// Child age change test
const age5 = calculateChildrenFuturePlan({
  childCurrentAge: 5,
  goals: [{ id: 'a1', name: 'G', type: 'graduation', goalAge: 18, targetCostToday: 2000000 }]
});
const age6 = calculateChildrenFuturePlan({
  childCurrentAge: 6,
  goals: [{ id: 'a1', name: 'G', type: 'graduation', goalAge: 18, targetCostToday: 2000000 }]
});
assert(age5.goals[0].yearsRemaining === 13, 'Age 5 -> 13 years remaining');
assert(age6.goals[0].yearsRemaining === 12, 'Age 6 -> 12 years remaining');
assert(age6.goals[0].futureGoalCost < age5.goals[0].futureGoalCost, 'Fewer years of inflation -> lower future cost');

console.log(`\n========================================`);
console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log(`========================================\n`);

if (failed > 0) process.exit(1);
