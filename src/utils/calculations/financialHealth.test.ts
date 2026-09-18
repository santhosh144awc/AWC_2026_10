import { 
  HEALTH_CHECK_QUESTIONS, 
  calculateFinancialHealth, 
  type HealthCheckAnswers 
} from './financialHealth';

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`✅ PASS: ${msg}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${msg}`);
    failed++;
  }
}

console.log('========================================');
console.log('RUNNING FINANCIAL HEALTH DIAGNOSTIC TESTS');
console.log('========================================');

// 1. Structure and configuration
assert(HEALTH_CHECK_QUESTIONS.length === 7, '7 health check questions defined');
for (const q of HEALTH_CHECK_QUESTIONS) {
  assert(q.options.length === 4, `Question "${q.id}" has 4 options`);
  for (const opt of q.options) {
    assert(typeof opt.score === 'number' && opt.score >= 0 && opt.score <= 100, `Option ${opt.id} has score in [0, 100]`);
  }
}

// 2. Scenario A: Worst possible answers (first option for all questions)
const worstAnswers: HealthCheckAnswers = {
  cashFlow: 'cf_1',       // score 20, weight 0.15 => 3.0
  emergencyFund: 'ef_1',  // score 15, weight 0.15 => 2.25
  investments: 'inv_1',   // score 30, weight 0.15 => 4.5
  protection: 'pr_1',     // score 15, weight 0.15 => 2.25
  debt: 'db_1',           // score 20, weight 0.15 => 3.0
  retirement: 'rt_1',     // score 20, weight 0.15 => 3.0
  goals: 'gl_1'           // score 25, weight 0.10 => 2.5
};
// Expected weighted sum = 3 + 2.25 + 4.5 + 2.25 + 3 + 3 + 2.5 = 20.5 => Math.round = 21 or 20 (weightedScoreSum)
const worstResult = calculateFinancialHealth(worstAnswers);
assert(typeof worstResult.overallScore === 'number', 'Worst answers: score is number');
assert(!isNaN(worstResult.overallScore), 'Worst answers: score is not NaN');
assert(isFinite(worstResult.overallScore), 'Worst answers: score is finite');
assert(worstResult.overallScore >= 0 && worstResult.overallScore <= 40, `Worst answers: score within [0, 40] (got ${worstResult.overallScore})`);
assert(worstResult.categoryScores.length === 7, '7 category scores returned');
assert(worstResult.needsAttention.length > 0, 'Needs attention items present for low scores');
assert(worstResult.nextSteps.length > 0, 'Next steps present for low scores');

// 3. Scenario B: Best possible answers (last option for all questions)
const bestAnswers: HealthCheckAnswers = {
  cashFlow: 'cf_4',       // score 100
  emergencyFund: 'ef_4',  // score 100
  investments: 'inv_4',   // score 100
  protection: 'pr_4',     // score 100
  debt: 'db_4',           // score 100
  retirement: 'rt_4',     // score 100
  goals: 'gl_4'           // score 100
};
const bestResult = calculateFinancialHealth(bestAnswers);
assert(bestResult.overallScore === 100, `Best answers: score is 100 (got ${bestResult.overallScore})`);
assert(bestResult.ratingTitle === 'Excellent Financial Foundation', 'Best rating title matches');
assert(bestResult.strengths.length === 7, 'All 7 strengths present for top scores');
assert(bestResult.needsAttention.length === 0, 'Zero needs attention for top scores');
assert(bestResult.nextSteps.length === 2, 'Annual review next steps present for top scores');

// 4. Scenario C: Mixed realistic profile
const mixedAnswers: HealthCheckAnswers = {
  cashFlow: 'cf_3',       // score 85
  emergencyFund: 'ef_2',  // score 50
  investments: 'inv_3',   // score 90
  protection: 'pr_2',     // score 45
  debt: 'db_3',           // score 85
  retirement: 'rt_2',     // score 50
  goals: 'gl_3'           // score 90
};
const mixedResult = calculateFinancialHealth(mixedAnswers);
assert(mixedResult.overallScore >= 60 && mixedResult.overallScore <= 80, `Mixed profile score reasonable (got ${mixedResult.overallScore})`);
assert(mixedResult.strengths.length > 0, 'Mixed profile has strengths');
assert(mixedResult.needsAttention.length > 0, 'Mixed profile has areas needing attention');
assert(mixedResult.nextSteps.length > 0, 'Mixed profile has next steps');

// 5. Empty / missing answers fallback safety
const emptyResult = calculateFinancialHealth({});
assert(!isNaN(emptyResult.overallScore), 'Empty answers: score is not NaN');
assert(isFinite(emptyResult.overallScore), 'Empty answers: score is finite');
assert(emptyResult.categoryScores.length === 7, 'Empty answers fallback produces 7 categories');

console.log('\n========================================');
console.log(`FINANCIAL HEALTH TESTS: ${passed} PASSED, ${failed} FAILED`);
console.log('========================================');

if (failed > 0) {
  process.exit(1);
}
