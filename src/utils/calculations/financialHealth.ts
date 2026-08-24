export interface HealthCheckOption {
  id: string;
  label: string;
  sublabel?: string;
  score: number; // 0 to 100 for this category
}

export interface HealthCheckQuestion {
  id: string;
  category: HealthCategory;
  categoryTitle: string;
  question: string;
  description: string;
  options: HealthCheckOption[];
}

export type HealthCategory = 
  | 'cashFlow'
  | 'emergencyFund'
  | 'investments'
  | 'protection'
  | 'debt'
  | 'retirement'
  | 'goals';

export interface CategoryScoreResult {
  category: HealthCategory;
  title: string;
  score: number; // 0 to 100
  status: 'Strong' | 'Good' | 'Needs Attention';
  statusColor: string;
  icon: string;
}

export interface HealthCheckAnswers {
  [questionId: string]: string; // questionId -> optionId
}

export interface HealthCheckResult {
  overallScore: number; // 0 to 100
  ratingTitle: string;
  ratingDescription: string;
  categoryScores: CategoryScoreResult[];
  strengths: string[];
  needsAttention: string[];
  nextSteps: string[];
}

export const HEALTH_CHECK_QUESTIONS: HealthCheckQuestion[] = [
  {
    id: 'cashFlow',
    category: 'cashFlow',
    categoryTitle: 'Cash Flow & Income',
    question: 'What percentage of your monthly income do you typically save or invest?',
    description: 'A healthy savings rate is the primary foundation for long-term compounding.',
    options: [
      { id: 'cf_1', label: 'Less than 10%', sublabel: 'Struggling to save regularly after monthly expenses', score: 20 },
      { id: 'cf_2', label: '10% to 20%', sublabel: 'Consistent habit, with room to optimize cash flow', score: 55 },
      { id: 'cf_3', label: '20% to 40%', sublabel: 'Healthy, disciplined monthly allocation', score: 85 },
      { id: 'cf_4', label: 'More than 40%', sublabel: 'Excellent savings velocity towards financial freedom', score: 100 }
    ]
  },
  {
    id: 'emergencyFund',
    category: 'emergencyFund',
    categoryTitle: 'Emergency Cushion',
    question: 'How many months of essential living expenses could your emergency fund cover?',
    description: 'Liquid funds in savings accounts or liquid mutual funds kept strictly for unexpected events.',
    options: [
      { id: 'ef_1', label: 'Less than 1 month', sublabel: 'High vulnerability to sudden medical or job shocks', score: 15 },
      { id: 'ef_2', label: '1 to 3 months', sublabel: 'Basic buffer, but needs expansion for safety', score: 50 },
      { id: 'ef_3', label: '3 to 6 months', sublabel: 'Standard recommended safety cushion for working professionals', score: 85 },
      { id: 'ef_4', label: '6 months or more', sublabel: 'Rock-solid emergency security', score: 100 }
    ]
  },
  {
    id: 'investments',
    category: 'investments',
    categoryTitle: 'Wealth & Investments',
    question: 'How are your long-term savings currently invested?',
    description: 'Beating inflation requires a disciplined, diversified asset allocation strategy.',
    options: [
      { id: 'inv_1', label: 'Only in Savings Account or Traditional Bank FDs', sublabel: 'Safe, but returns may struggle against real inflation and tax', score: 30 },
      { id: 'inv_2', label: 'Irregular or occasional investments without a fixed plan', sublabel: 'Some exposure, but lacks compounding consistency', score: 55 },
      { id: 'inv_3', label: 'Monthly SIPs in Mutual Funds + Diversified Assets', sublabel: 'Disciplined compounding aligned with personal goals', score: 90 },
      { id: 'inv_4', label: 'Structured asset allocation (Equity, Debt, Gold, Liquid)', sublabel: 'Comprehensive, balanced portfolio strategy', score: 100 }
    ]
  },
  {
    id: 'protection',
    category: 'protection',
    categoryTitle: 'Insurance & Protection',
    question: 'What is your family’s life and health insurance coverage status?',
    description: 'Protection prevents unforeseen medical emergencies or life events from draining your wealth.',
    options: [
      { id: 'pr_1', label: 'No insurance / only basic employer health cover', sublabel: 'Vulnerable if you switch jobs or face major health issues', score: 15 },
      { id: 'pr_2', label: 'Only traditional endowment / money-back insurance policies', sublabel: 'High premiums with inadequate sum assured', score: 45 },
      { id: 'pr_3', label: 'Personal Health Insurance + Basic Term Cover', sublabel: 'Good start; ensure sum assured equals 10-15x annual income', score: 80 },
      { id: 'pr_4', label: 'Adequate Pure Term Insurance (15-20x income) + Separate Family Health Cover', sublabel: 'Comprehensive, optimal protection strategy', score: 100 }
    ]
  },
  {
    id: 'debt',
    category: 'debt',
    categoryTitle: 'Debt Management',
    question: 'How much of your monthly income goes towards EMIs and loan repayments?',
    description: 'Includes home loans, car loans, personal loans, and credit card outstanding balances.',
    options: [
      { id: 'db_1', label: 'More than 50% / High-interest credit card debt', sublabel: 'Heavy debt burden constraining wealth creation', score: 20 },
      { id: 'db_2', label: '35% to 50% of monthly income', sublabel: 'Moderate-high EMI commitment; needs careful monitoring', score: 55 },
      { id: 'db_3', label: '15% to 35% of monthly income (mainly home loan)', sublabel: 'Healthy, manageable debt ratio', score: 85 },
      { id: 'db_4', label: 'Zero debt / Less than 15% on manageable home loan', sublabel: 'Low debt stress, high cash flow flexibility', score: 100 }
    ]
  },
  {
    id: 'retirement',
    category: 'retirement',
    categoryTitle: 'Retirement Readiness',
    question: 'How clearly have you planned and invested for your retirement corpus?',
    description: 'Retirement is the only milestone where you cannot take an education or bank loan.',
    options: [
      { id: 'rt_1', label: 'Haven’t started planning or calculating my required corpus', sublabel: 'Relying solely on EPF or informal savings', score: 20 },
      { id: 'rt_2', label: 'Investing occasionally, but have not calculated inflation-adjusted needs', sublabel: 'Unclear if the corpus will sustain lifelong lifestyle', score: 50 },
      { id: 'rt_3', label: 'Dedicated monthly SIPs with an estimated target corpus', sublabel: 'Clear roadmap underway with regular review', score: 85 },
      { id: 'rt_4', label: 'Calculated inflation-adjusted corpus with automated SIPs & asset rebalancing', sublabel: 'High clarity and structured retirement path', score: 100 }
    ]
  },
  {
    id: 'goals',
    category: 'goals',
    categoryTitle: 'Goal Clarity',
    question: 'Do you have specific time horizons and designated investments for your life goals?',
    description: 'Examples: Children’s higher education, home purchase, travel, or regular income.',
    options: [
      { id: 'gl_1', label: 'No specific timeline or dedicated investments for milestones', sublabel: 'Goals are general wishes rather than structured plans', score: 25 },
      { id: 'gl_2', label: 'Goals identified, but investing in one common pool', sublabel: 'Risk of withdrawing from long-term funds for short-term needs', score: 60 },
      { id: 'gl_3', label: 'Key milestones mapped with separate SIPs and timelines', sublabel: 'Clear separation between short, medium, and long-term goals', score: 90 },
      { id: 'gl_4', label: 'Fully mapped financial roadmap with timelines & reviewed annually', sublabel: 'Crystal clear milestone execution', score: 100 }
    ]
  }
];

const CATEGORY_WEIGHTS: Record<HealthCategory, number> = {
  cashFlow: 0.15,
  emergencyFund: 0.15,
  investments: 0.15,
  protection: 0.15,
  debt: 0.15,
  retirement: 0.15,
  goals: 0.10
};

export function calculateFinancialHealth(answers: HealthCheckAnswers): HealthCheckResult {
  let weightedScoreSum = 0;
  const categoryScores: CategoryScoreResult[] = [];
  const strengths: string[] = [];
  const needsAttention: string[] = [];
  const nextSteps: string[] = [];

  for (const question of HEALTH_CHECK_QUESTIONS) {
    const selectedOptionId = answers[question.id];
    const selectedOption = question.options.find(o => o.id === selectedOptionId) || question.options[0];
    const score = selectedOption.score;
    const weight = CATEGORY_WEIGHTS[question.category];

    weightedScoreSum += score * weight;

    let status: 'Strong' | 'Good' | 'Needs Attention' = 'Needs Attention';
    let statusColor = '#EF4444';
    let icon = '•';

    if (score >= 75) {
      status = 'Strong';
      statusColor = '#00AB96';
      icon = '✓';
    } else if (score >= 50) {
      status = 'Good';
      statusColor = '#F59E0B';
      icon = '•';
    }

    categoryScores.push({
      category: question.category,
      title: question.categoryTitle,
      score,
      status,
      statusColor,
      icon
    });

    if (question.category === 'cashFlow') {
      if (score >= 75) {
        strengths.push('Healthy monthly savings rate supporting wealth accumulation.');
      } else {
        needsAttention.push('Monthly savings rate is below the recommended 20-30% benchmark.');
        nextSteps.push('Conduct a 30-day cash flow audit to identify non-essential leaks and automate monthly savings.');
      }
    }

    if (question.category === 'emergencyFund') {
      if (score >= 75) {
        strengths.push('Solid emergency cushion protecting against sudden financial shocks.');
      } else {
        needsAttention.push('Emergency fund is insufficient (under 3-6 months of essential living expenses).');
        nextSteps.push('Prioritize building a 3-6 month liquid emergency fund before aggressively expanding risky assets.');
      }
    }

    if (question.category === 'investments') {
      if (score >= 75) {
        strengths.push('Disciplined mutual fund & asset allocation habit driving compounding.');
      } else {
        needsAttention.push('Savings are heavily concentrated in low-yield or un-structured instruments.');
        nextSteps.push('Start a disciplined monthly SIP in diversified equity & hybrid mutual funds to beat long-term inflation.');
      }
    }

    if (question.category === 'protection') {
      if (score >= 75) {
        strengths.push('Adequate life and health protection safeguarding your family’s future.');
      } else {
        needsAttention.push('Life or health insurance coverage needs urgent review to prevent portfolio depletion.');
        nextSteps.push('Secure an adequate pure term life insurance plan (15-20x annual income) and standalone family health cover.');
      }
    }

    if (question.category === 'debt') {
      if (score >= 75) {
        strengths.push('Manageable debt levels providing high monthly cash flow flexibility.');
      } else {
        needsAttention.push('EMI and debt obligations exceed the comfortable 35-40% income threshold.');
        nextSteps.push('Create a structured debt-reduction plan to pay off high-cost liabilities and lower monthly EMI stress.');
      }
    }

    if (question.category === 'retirement') {
      if (score >= 75) {
        strengths.push('Proactive, inflation-adjusted retirement roadmap with regular investing.');
      } else {
        needsAttention.push('Retirement corpus requirements and withdrawal timelines remain uncalculated.');
        nextSteps.push('Use the Retirement Calculator to calculate your inflation-adjusted corpus and calibrate your monthly SIP.');
      }
    }

    if (question.category === 'goals') {
      if (score >= 75) {
        strengths.push('Well-mapped life milestones with dedicated investment buckets.');
      } else {
        needsAttention.push('Life goals lack separated investment buckets and clear time horizons.');
        nextSteps.push('Tag specific mutual fund SIPs to distinct life milestones (child education, home purchase, wealth creation).');
      }
    }
  }

  const overallScore = Math.round(weightedScoreSum);

  let ratingTitle = 'Healthy Financial Path';
  let ratingDescription = 'You have established several key financial habits, with clear opportunities to strengthen risk protection and compounding.';

  if (overallScore >= 85) {
    ratingTitle = 'Excellent Financial Foundation';
    ratingDescription = 'Your finances demonstrate strong discipline, prudent risk management, and consistent goal-oriented planning.';
  } else if (overallScore >= 70) {
    ratingTitle = 'Healthy Financial Path';
    ratingDescription = 'You are on a solid trajectory with strong core habits. Addressing a few identified gaps will accelerate your financial independence.';
  } else if (overallScore >= 50) {
    ratingTitle = 'Moderate Stability — Action Needed';
    ratingDescription = 'You have initiated good financial steps, but key vulnerabilities in emergency backup, insurance, or long-term growth require attention.';
  } else {
    ratingTitle = 'Vulnerable — Immediate Review Recommended';
    ratingDescription = 'Your current financial setup has significant exposure to unexpected shocks. Restructuring cash flow, protection, and emergency reserves should be your top priority.';
  }

  if (nextSteps.length === 0) {
    nextSteps.push('Review your asset allocation annually to ensure it matches your changing life milestones.');
    nextSteps.push('Schedule an annual portfolio checkup to rebalance between equity and debt assets.');
  }

  return {
    overallScore,
    ratingTitle,
    ratingDescription,
    categoryScores,
    strengths,
    needsAttention,
    nextSteps: nextSteps.slice(0, 4)
  };
}