import { 
  HEALTH_PILLARS, 
  calculateFinancialHealth, 
  getPillarStatus,
  getPillarStatusLabel,
  getOverallScoreBand,
  getRecommendedNextSteps,
  getStrengths,
  getAreasToStrengthen,
  getPriorityAreas,
  type HealthCheckAnswers,
  type PillarScoreResult,
  type HealthPillar
} from './financialHealth';

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string, details: string = '') {
  if (condition) {
    console.log(`✅ PASS: ${msg}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${msg} ${details ? '— ' + details : ''}`);
    failed++;
  }
}

console.log('====================================================');
console.log('RUNNING FINANCIAL HEALTH CHECK v4.0 CALCULATION TESTS');
console.log('====================================================\n');

// ----------------------------------------------------
// 1. Structure & Weights Validation
// ----------------------------------------------------
console.log('--- 1. Structure & Weights ---');
assert(HEALTH_PILLARS.length === 7, '7 health check pillars defined');

const totalWeight = HEALTH_PILLARS.reduce((sum, p) => sum + p.weight, 0);
assert(Math.abs(totalWeight - 1.0) < 0.0001, `Total weight equals 100% (Actual: ${totalWeight * 100}%)`);

for (const p of HEALTH_PILLARS) {
  assert(p.options.length === 4, `Pillar "${p.id}" has exactly 4 options`);
  for (const opt of p.options) {
    assert(typeof opt.score === 'number' && opt.score >= 20 && opt.score <= 100, `Option ${opt.id} in [20, 100]`);
    assert(opt.label.length > 0, `Option ${opt.id} has non-empty label`);
  }
}

// ----------------------------------------------------
// 2. Expected Score Test: Highest & Lowest Scenarios
// ----------------------------------------------------
console.log('\n--- 2. Highest & Lowest Scenarios ---');

// All highest-scoring options:
// Cash Flow = 100, Emergency = 100, Debt = 100, Protection = 100, Investments = 100, Goals = 100, Retirement = 100
const allHighestAnswers: HealthCheckAnswers = {
  cashFlow: 'cf_4',
  emergencyFund: 'ef_4',
  debt: 'db_4',
  protection: 'pr_4',
  investments: 'inv_4',
  goals: 'gl_4',
  retirement: 'rt_4'
};
const highestResult = calculateFinancialHealth(allHighestAnswers);
assert(highestResult.overallScore === 100, `All highest options score = 100 (got ${highestResult.overallScore})`);
assert(highestResult.ratingTitle === 'Strong Foundation', 'Highest rating title is "Strong Foundation"');
assert(highestResult.strengths.length === 7, 'All 7 pillars present in Key Strengths');
assert(highestResult.areasToStrengthen.length === 0, 'Zero areas to strengthen for top score');
assert(highestResult.priorityAreas.length === 0, 'Zero priority areas for top score');

// All lowest-scoring options:
// Cash Flow = 20 (0.15 => 3.0)
// Emergency = 20 (0.15 => 3.0)
// Debt = 20 (0.15 => 3.0)
// Protection = 20 (0.15 => 3.0)
// Investments = 30 (0.15 => 4.5)
// Goals = 25 (0.10 => 2.5)
// Retirement = 20 (0.15 => 3.0)
// Sum = 3 + 3 + 3 + 3 + 4.5 + 2.5 + 3 = 22.0 => Expected: 22
const allLowestAnswers: HealthCheckAnswers = {
  cashFlow: 'cf_1',
  emergencyFund: 'ef_1',
  debt: 'db_1',
  protection: 'pr_1',
  investments: 'inv_1',
  goals: 'gl_1',
  retirement: 'rt_1'
};
const lowestResult = calculateFinancialHealth(allLowestAnswers);
assert(lowestResult.overallScore === 22, `All lowest options score = 22 (got ${lowestResult.overallScore})`);
assert(lowestResult.ratingTitle === 'Priority Areas Identified', 'Lowest rating title is "Priority Areas Identified"');
assert(lowestResult.strengths.length === 0, 'Zero key strengths for lowest score');
assert(lowestResult.priorityAreas.length === 7, 'All 7 pillars present in Priority Areas');

// ----------------------------------------------------
// 3. Boundary Score Band Classifications
// ----------------------------------------------------
console.log('\n--- 3. Boundary Score Bands ---');
// 49 -> Priority Areas Identified
assert(getOverallScoreBand(49).title === 'Priority Areas Identified', 'Score 49 -> Priority Areas Identified');
// 50 -> Needs Strengthening
assert(getOverallScoreBand(50).title === 'Needs Strengthening', 'Score 50 -> Needs Strengthening');
// 64 -> Needs Strengthening
assert(getOverallScoreBand(64).title === 'Needs Strengthening', 'Score 64 -> Needs Strengthening');
// 65 -> Generally Healthy
assert(getOverallScoreBand(65).title === 'Generally Healthy', 'Score 65 -> Generally Healthy');
// 79 -> Generally Healthy
assert(getOverallScoreBand(79).title === 'Generally Healthy', 'Score 79 -> Generally Healthy');
// 80 -> Strong Foundation
assert(getOverallScoreBand(80).title === 'Strong Foundation', 'Score 80 -> Strong Foundation');
assert(getOverallScoreBand(100).title === 'Strong Foundation', 'Score 100 -> Strong Foundation');

// ----------------------------------------------------
// 4. Pillar Status Tests
// ----------------------------------------------------
console.log('\n--- 4. Pillar Status Functions ---');
assert(getPillarStatus(49) === 'attention', 'Pillar score 49 status is attention');
assert(getPillarStatusLabel(getPillarStatus(49)) === 'Needs Attention', 'Score 49 label is "Needs Attention"');

assert(getPillarStatus(50) === 'building', 'Pillar score 50 status is building');
assert(getPillarStatusLabel(getPillarStatus(50)) === 'Building', 'Score 50 label is "Building"');

assert(getPillarStatus(79) === 'building', 'Pillar score 79 status is building');
assert(getPillarStatusLabel(getPillarStatus(79)) === 'Building', 'Score 79 label is "Building"');

assert(getPillarStatus(80) === 'strong', 'Pillar score 80 status is strong');
assert(getPillarStatusLabel(getPillarStatus(80)) === 'Strong', 'Score 80 label is "Strong"');

assert(getPillarStatus(100) === 'strong', 'Pillar score 100 status is strong');

// ----------------------------------------------------
// 5. Strengths Threshold Tests (79 vs 80)
// ----------------------------------------------------
console.log('\n--- 5. Strengths Thresholds ---');
const dummyPillarsBorder: PillarScoreResult[] = [
  { pillar: 'emergencyFund', title: 'Emergency Reserve', shortTitle: 'Emergency', score: 79, status: 'building', statusLabel: 'Building', statusColor: '#2563EB', icon: '↗' },
  { pillar: 'debt', title: 'Debt Management', shortTitle: 'Debt', score: 80, status: 'strong', statusLabel: 'Strong', statusColor: '#00AB96', icon: '✓' }
];
const borderStrengths = getStrengths(dummyPillarsBorder);
assert(!borderStrengths.some(s => s.pillar === 'emergencyFund'), 'Pillar with score 79 is NOT in Key Strengths');
assert(borderStrengths.some(s => s.pillar === 'debt'), 'Pillar with score 80 IS in Key Strengths');

// ----------------------------------------------------
// 6. Contradiction Tests
// ----------------------------------------------------
console.log('\n--- 6. Contradiction Tests ---');
// Verify a pillar can NEVER be in both Key Strengths and Priority Areas, or both Building and Strong
for (let s = 20; s <= 100; s += 5) {
  const dummy: PillarScoreResult[] = [
    { pillar: 'cashFlow', title: 'Cash Flow', shortTitle: 'Cash Flow', score: s, status: getPillarStatus(s), statusLabel: getPillarStatusLabel(getPillarStatus(s)), statusColor: '', icon: '' }
  ];
  const isStrength = getStrengths(dummy).length > 0;
  const isStrengthen = getAreasToStrengthen(dummy).length > 0;
  const isPriority = getPriorityAreas(dummy).length > 0;

  const activeCategories = [isStrength, isStrengthen, isPriority].filter(Boolean).length;
  assert(activeCategories === 1, `Score ${s} belongs to exactly 1 category bucket (got ${activeCategories})`);
}

// ----------------------------------------------------
// 7. Dependency-Aware Recommendation Engine Tests
// ----------------------------------------------------
console.log('\n--- 7. Recommendation Engine & Dependency Ordering ---');

// Test 7a: High-cost Debt < 50 takes precedence over weak investments
const testDebtVsInvest: PillarScoreResult[] = [
  { pillar: 'debt', title: 'Debt Management', shortTitle: 'Debt', score: 20, status: 'attention', statusLabel: 'Needs Attention', statusColor: '', icon: '' },
  { pillar: 'investments', title: 'Investing', shortTitle: 'Investing', score: 30, status: 'attention', statusLabel: 'Needs Attention', statusColor: '', icon: '' },
  { pillar: 'emergencyFund', title: 'Emergency Reserve', shortTitle: 'Emergency', score: 85, status: 'strong', statusLabel: 'Strong', statusColor: '', icon: '' },
  { pillar: 'cashFlow', title: 'Cash Flow', shortTitle: 'Cash Flow', score: 80, status: 'strong', statusLabel: 'Strong', statusColor: '', icon: '' },
  { pillar: 'protection', title: 'Protection', shortTitle: 'Protection', score: 80, status: 'strong', statusLabel: 'Strong', statusColor: '', icon: '' },
  { pillar: 'goals', title: 'Goals', shortTitle: 'Goals', score: 85, status: 'strong', statusLabel: 'Strong', statusColor: '', icon: '' },
  { pillar: 'retirement', title: 'Retirement', shortTitle: 'Retirement', score: 85, status: 'strong', statusLabel: 'Strong', statusColor: '', icon: '' }
];
const recsDebtVsInvest = getRecommendedNextSteps(testDebtVsInvest);
assert(recsDebtVsInvest[0].pillar === 'debt', 'Debt < 50 is prioritized as Step 1 over weak investments');
assert(recsDebtVsInvest.length <= 3, 'Recommendations capped at max 3');

// Test 7b: Emergency < 50 prioritized when debt is healthy
const testEmergencyFirst: PillarScoreResult[] = [
  { pillar: 'debt', title: 'Debt Management', shortTitle: 'Debt', score: 85, status: 'strong', statusLabel: 'Strong', statusColor: '', icon: '' },
  { pillar: 'emergencyFund', title: 'Emergency Reserve', shortTitle: 'Emergency', score: 20, status: 'attention', statusLabel: 'Needs Attention', statusColor: '', icon: '' },
  { pillar: 'investments', title: 'Investing', shortTitle: 'Investing', score: 30, status: 'attention', statusLabel: 'Needs Attention', statusColor: '', icon: '' },
  { pillar: 'protection', title: 'Protection', shortTitle: 'Protection', score: 80, status: 'strong', statusLabel: 'Strong', statusColor: '', icon: '' },
  { pillar: 'cashFlow', title: 'Cash Flow', shortTitle: 'Cash Flow', score: 80, status: 'strong', statusLabel: 'Strong', statusColor: '', icon: '' },
  { pillar: 'goals', title: 'Goals', shortTitle: 'Goals', score: 85, status: 'strong', statusLabel: 'Strong', statusColor: '', icon: '' },
  { pillar: 'retirement', title: 'Retirement', shortTitle: 'Retirement', score: 85, status: 'strong', statusLabel: 'Strong', statusColor: '', icon: '' }
];
const recsEmergencyFirst = getRecommendedNextSteps(testEmergencyFirst);
assert(recsEmergencyFirst[0].pillar === 'emergencyFund', 'Emergency < 50 is prioritized as Step 1 when debt is healthy');

// Test 7c: Protection < 50 prioritized before planning/growth
const testProtectionFirst: PillarScoreResult[] = [
  { pillar: 'debt', title: 'Debt Management', shortTitle: 'Debt', score: 85, status: 'strong', statusLabel: 'Strong', statusColor: '', icon: '' },
  { pillar: 'emergencyFund', title: 'Emergency Reserve', shortTitle: 'Emergency', score: 85, status: 'strong', statusLabel: 'Strong', statusColor: '', icon: '' },
  { pillar: 'protection', title: 'Protection', shortTitle: 'Protection', score: 20, status: 'attention', statusLabel: 'Needs Attention', statusColor: '', icon: '' },
  { pillar: 'investments', title: 'Investing', shortTitle: 'Investing', score: 30, status: 'attention', statusLabel: 'Needs Attention', statusColor: '', icon: '' },
  { pillar: 'cashFlow', title: 'Cash Flow', shortTitle: 'Cash Flow', score: 80, status: 'strong', statusLabel: 'Strong', statusColor: '', icon: '' },
  { pillar: 'goals', title: 'Goals', shortTitle: 'Goals', score: 55, status: 'building', statusLabel: 'Building', statusColor: '', icon: '' },
  { pillar: 'retirement', title: 'Retirement', shortTitle: 'Retirement', score: 50, status: 'building', statusLabel: 'Building', statusColor: '', icon: '' }
];
const recsProtectionFirst = getRecommendedNextSteps(testProtectionFirst);
assert(recsProtectionFirst[0].pillar === 'protection', 'Protection < 50 is prioritized as Step 1');

// Test 7d: Maximum 3 recommendations and no duplicate pillars
const allWeakDummy: PillarScoreResult[] = HEALTH_PILLARS.map(p => ({
  pillar: p.id,
  title: p.title,
  shortTitle: p.shortTitle,
  score: 20,
  status: 'attention',
  statusLabel: 'Needs Attention',
  statusColor: '',
  icon: ''
}));
const allWeakRecs = getRecommendedNextSteps(allWeakDummy);
assert(allWeakRecs.length === 3, 'Exactly 3 recommendations returned when all 7 pillars have gaps');
const pillarSet = new Set(allWeakRecs.map(r => r.pillar));
assert(pillarSet.size === 3, 'No duplicate pillars in recommendations');

// Test 7e: Product neutrality in recommendations (no forced SIP, mutual funds, or specific products)
for (const rec of allWeakRecs) {
  const fullText = (rec.title + ' ' + rec.description + ' ' + rec.action).toLowerCase();
  assert(!fullText.includes('start a sip'), `Recommendation for ${rec.pillar} does not prescribe "start a sip"`);
  assert(!fullText.includes('buy term insurance from'), `Recommendation for ${rec.pillar} does not endorse an insurer`);
}

// ----------------------------------------------------
// 8. Specific Profiles & Edge Cases
// ----------------------------------------------------
console.log('\n--- 8. Specific Profiles & Edge Cases ---');

// Profile: Strong emergency + weak investments
const profile1: HealthCheckAnswers = {
  cashFlow: 'cf_3',      // 80
  emergencyFund: 'ef_4', // 100
  debt: 'db_3',          // 85
  protection: 'pr_3',    // 80
  investments: 'inv_1',  // 30
  goals: 'gl_3',         // 90
  retirement: 'rt_3'     // 85
};
const res1 = calculateFinancialHealth(profile1);
assert(res1.strengths.some(s => s.pillar === 'emergencyFund'), 'Profile 1 has strong emergency fund in strengths');
assert(res1.priorityAreas.some(p => p.pillar === 'investments'), 'Profile 1 has investments in priority areas');
assert(res1.recommendations.some(r => r.pillar === 'investments'), 'Profile 1 recommends investing alignment');

// Profile: Weak emergency + weak debt
const profile2: HealthCheckAnswers = {
  cashFlow: 'cf_3',      // 80
  emergencyFund: 'ef_1', // 20
  debt: 'db_1',          // 20
  protection: 'pr_3',    // 80
  investments: 'inv_3',  // 85
  goals: 'gl_3',         // 90
  retirement: 'rt_3'     // 85
};
const res2 = calculateFinancialHealth(profile2);
assert(res2.recommendations[0].pillar === 'debt', 'Debt review comes first when both debt and emergency are weak');
assert(res2.recommendations[1].pillar === 'emergencyFund', 'Emergency reserve comes second');

// Profile: Empty / invalid answers fallback safety
const emptyRes = calculateFinancialHealth({});
assert(!isNaN(emptyRes.overallScore), 'Empty answers produce valid numeric overall score');
assert(isFinite(emptyRes.overallScore), 'Empty answers score is finite');
assert(emptyRes.pillarScores.length === 7, '7 pillar scores generated on empty input');
assert(emptyRes.recommendations.length <= 3, 'Valid recommendations generated on empty input');

console.log('\n====================================================');
console.log(`FINANCIAL HEALTH v4.0 TESTS: ${passed} PASSED, ${failed} FAILED`);
console.log('====================================================');

if (failed > 0) {
  process.exit(1);
}
