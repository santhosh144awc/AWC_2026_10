export type ToolTier = 'start' | 'goal' | 'decision' | 'advanced';
export type ToolCategory = 'financial-health' | 'investment' | 'goal-planning' | 'protection' | 'money-management' | 'advanced-planning';

export interface ToolRegistryItem {
  id: string;
  title: string;
  shortTitle?: string;
  description: string;
  tier: ToolTier;
  category: ToolCategory;
  legacyCategory?: 'Build Wealth' | 'Plan for Goals' | 'Protect Your Family' | 'Manage Your Money';
  icon: string;
  route: string;
  queryParam?: string;
  componentKey: string;
  visibility: 'public' | 'specialized';
  homepageVisibility: boolean;
  homepageEntry?: 'health' | 'goal' | 'investment' | 'protection';
  primaryCTA: string;
  badge?: string;
  toolsPagePriority: number;
  relatedArticles?: string[];
}

export const TOOLS_REGISTRY: ToolRegistryItem[] = [
  // ==========================================
  // TIER 1: START HERE (Simple Public Tools)
  // ==========================================
  {
    id: 'health-check',
    title: 'Financial Health Check',
    shortTitle: '2-Min Health Check',
    description: 'Understand your savings, emergency fund, protection, and retirement readiness in 2 minutes.',
    tier: 'start',
    category: 'financial-health',
    legacyCategory: 'Manage Your Money',
    icon: '🩺',
    route: '/health-check',
    componentKey: 'HealthQuestionnaire',
    visibility: 'public',
    homepageVisibility: true,
    homepageEntry: 'health',
    primaryCTA: 'Check My Financial Health',
    badge: '2-Minute Self-Check',
    toolsPagePriority: 1,
    relatedArticles: ['how-much-emergency-fund-should-you-have', 'what-is-financial-freedom']
  },
  {
    id: 'sip',
    title: 'SIP Calculator',
    shortTitle: 'SIP Compounding',
    description: 'Calculate how disciplined monthly investments grow over time with compounding.',
    tier: 'start',
    category: 'investment',
    legacyCategory: 'Build Wealth',
    icon: '📈',
    route: '/tools?calc=sip',
    queryParam: 'sip',
    componentKey: 'SIPCalculator',
    visibility: 'public',
    homepageVisibility: true,
    homepageEntry: 'investment',
    primaryCTA: 'Calculate My SIP',
    badge: 'Monthly',
    toolsPagePriority: 2,
    relatedArticles: ['what-is-a-mutual-fund', 'what-is-sip-and-how-does-it-work']
  },
  {
    id: 'lumpsum',
    title: 'Lumpsum Calculator',
    shortTitle: 'One-Time Investment',
    description: 'See how a one-time lump sum investment can compound over your intended time horizon.',
    tier: 'start',
    category: 'investment',
    legacyCategory: 'Build Wealth',
    icon: '💰',
    route: '/tools?calc=lumpsum',
    queryParam: 'lumpsum',
    componentKey: 'LumpsumCalculator',
    visibility: 'public',
    homepageVisibility: true,
    homepageEntry: 'investment',
    primaryCTA: 'Calculate Lumpsum',
    badge: 'One-Time',
    toolsPagePriority: 3,
    relatedArticles: ['sip-vs-lumpsum-what-is-the-difference', 'what-is-a-mutual-fund']
  },
  {
    id: 'goal',
    title: 'Goal Planner',
    shortTitle: 'Milestone Planner',
    description: 'Plan for life milestones (education, home down payment, wedding) with inflation-adjusted targets.',
    tier: 'start',
    category: 'goal-planning',
    legacyCategory: 'Plan for Goals',
    icon: '🎯',
    route: '/plan',
    queryParam: 'goal',
    componentKey: 'GoalPlannerCalculator',
    visibility: 'public',
    homepageVisibility: true,
    homepageEntry: 'goal',
    primaryCTA: 'Plan My Goal',
    badge: 'Milestones',
    toolsPagePriority: 4,
    relatedArticles: ['what-is-goal-based-financial-planning']
  },
  {
    id: 'insurance',
    title: 'Life Insurance Need Calculator',
    shortTitle: 'Protection Gap',
    description: 'Get an illustrative view of family protection needed based on income, debts, and goals.',
    tier: 'start',
    category: 'protection',
    legacyCategory: 'Protect Your Family',
    icon: '🛡️',
    route: '/tools?calc=insurance',
    queryParam: 'insurance',
    componentKey: 'InsuranceCalculator',
    visibility: 'public',
    homepageVisibility: true,
    homepageEntry: 'protection',
    primaryCTA: 'Check Protection Need',
    badge: 'Family Protection',
    toolsPagePriority: 5,
    relatedArticles: ['why-life-insurance-is-important-for-a-family']
  },
  {
    id: 'net-worth',
    title: 'Personal Net Worth Calculator',
    shortTitle: 'Net Worth',
    description: 'Track your personal balance sheet, assets, and liabilities clearly in minutes.',
    tier: 'start',
    category: 'money-management',
    legacyCategory: 'Manage Your Money',
    icon: '📊',
    route: '/tools?calc=net-worth',
    queryParam: 'net-worth',
    componentKey: 'NetWorthCalculator',
    visibility: 'public',
    homepageVisibility: true,
    primaryCTA: 'Calculate Net Worth',
    badge: 'Balance Sheet',
    toolsPagePriority: 6,
    relatedArticles: ['what-is-asset-allocation', 'what-is-financial-freedom']
  },

  // ==========================================
  // TIER 2: PLAN A GOAL (Goal Planning Tools)
  // ==========================================
  {
    id: 'retirement',
    title: 'Retirement Planner',
    shortTitle: 'Retirement Accumulation',
    description: 'Estimate future living expenses, required retirement corpus, and monthly SIP requirements.',
    tier: 'goal',
    category: 'goal-planning',
    legacyCategory: 'Plan for Goals',
    icon: '🌅',
    route: '/tools/retirement',
    queryParam: 'retirement',
    componentKey: 'RetirementCalculator',
    visibility: 'public',
    homepageVisibility: false,
    primaryCTA: 'Plan Retirement',
    badge: 'Retirement',
    toolsPagePriority: 7,
    relatedArticles: ['how-to-start-planning-for-retirement']
  },
  {
    id: 'home-purchase',
    title: 'Home Purchase Planner',
    shortTitle: 'Home Purchase',
    description: 'Calculate future property cost, down payment, acquisition expenses, and EMI affordability.',
    tier: 'goal',
    category: 'goal-planning',
    legacyCategory: 'Plan for Goals',
    icon: '🏡',
    route: '/tools/home-purchase',
    componentKey: 'HousePurchasePlannerCalculator',
    visibility: 'public',
    homepageVisibility: false,
    primaryCTA: 'Plan Home Purchase',
    badge: 'Guided Plan',
    toolsPagePriority: 8,
    relatedArticles: ['what-is-goal-based-financial-planning']
  },
  {
    id: 'children',
    title: "Children's Future Planner",
    shortTitle: 'Child Education & Marriage',
    description: "Map your child's higher education and marriage milestones with inflation and step-up SIPs.",
    tier: 'goal',
    category: 'goal-planning',
    legacyCategory: 'Plan for Goals',
    icon: '🎓',
    route: '/plan/children',
    componentKey: 'ChildrenFuturePlanner',
    visibility: 'public',
    homepageVisibility: false,
    primaryCTA: "Plan Child's Goals",
    badge: 'Multi-Milestone',
    toolsPagePriority: 9,
    relatedArticles: ['how-to-plan-for-your-childs-education']
  },
  {
    id: 'sip-growth',
    title: 'SIP Growth Planner',
    shortTitle: 'SIP Growth',
    description: 'Model your monthly SIP, annual step-ups, and milestone lump-sum investments over time.',
    tier: 'goal',
    category: 'investment',
    legacyCategory: 'Build Wealth',
    icon: '🚀',
    route: '/tools/sip-growth',
    componentKey: 'SIPGrowthPlanner',
    visibility: 'public',
    homepageVisibility: false,
    primaryCTA: 'Plan SIP Growth',
    badge: 'Multi-Lump-Sum',
    toolsPagePriority: 10,
    relatedArticles: ['what-is-sip-and-how-does-it-work']
  },

  // ==========================================
  // TIER 3: COMPARE A DECISION (Decision Tools)
  // ==========================================
  {
    id: 'loan-vs-invest',
    title: 'Loan vs Investment',
    shortTitle: 'Loan vs Investment',
    description: 'Evaluate whether you should prepay your loan or invest the surplus in equity mutual funds.',
    tier: 'decision',
    category: 'money-management',
    legacyCategory: 'Manage Your Money',
    icon: '⚖️',
    route: '/tools?calc=loan-vs-invest',
    queryParam: 'loan-vs-invest',
    componentKey: 'LoanVsInvestmentCalculator',
    visibility: 'public',
    homepageVisibility: false,
    primaryCTA: 'Compare Decision',
    badge: 'Trade-off Analysis',
    toolsPagePriority: 11,
    relatedArticles: ['what-is-financial-freedom']
  },
  {
    id: 'loan-sip-recovery',
    title: 'Loan + SIP Recovery Planner',
    shortTitle: 'Loan + SIP Recovery',
    description: 'See how investing a manageable percentage of your EMI into SIP can potentially offset loan interest or complete cost.',
    tier: 'decision',
    category: 'money-management',
    legacyCategory: 'Build Wealth',
    icon: '⚖️',
    route: '/tools/loan-sip-recovery',
    componentKey: 'LoanSIPRecoveryPlanner',
    visibility: 'public',
    homepageVisibility: false,
    primaryCTA: 'Plan Loan Offset',
    badge: 'Wealth Recovery',
    toolsPagePriority: 12,
    relatedArticles: ['what-is-goal-based-financial-planning']
  },

  // ==========================================
  // TIER 4: ADVANCED PLANNING (Secondary Tools)
  // ==========================================
  {
    id: 'home-loan-foreclosure',
    title: 'Home Loan Foreclosure Planner',
    shortTitle: 'Loan Foreclosure',
    description: 'See how a parallel SIP alongside your EMI could help you plan for an earlier home-loan closure.',
    tier: 'advanced',
    category: 'advanced-planning',
    legacyCategory: 'Build Wealth',
    icon: '🏠',
    route: '/tools/home-loan-foreclosure',
    componentKey: 'HomeLoanForeclosurePlanner',
    visibility: 'public',
    homepageVisibility: false,
    primaryCTA: 'Explore Foreclosure Plan',
    badge: 'Advanced • Foreclosure',
    toolsPagePriority: 13,
    relatedArticles: ['what-is-goal-based-financial-planning']
  },
  {
    id: 'swp',
    title: 'SWP Longevity Calculator',
    shortTitle: 'SWP Longevity',
    description: 'Plan retirement withdrawals with monthly simulations, annual step-ups, and lump-sum milestones.',
    tier: 'advanced',
    category: 'advanced-planning',
    legacyCategory: 'Build Wealth',
    icon: '📉',
    route: '/tools/swp',
    componentKey: 'SWPCalculator',
    visibility: 'public',
    homepageVisibility: false,
    primaryCTA: 'Explore SWP Longevity',
    badge: 'Advanced • SWP',
    toolsPagePriority: 14,
    relatedArticles: ['how-to-start-planning-for-retirement']
  },
  {
    id: 'retirement-distribution',
    title: 'Retirement Distribution Planner',
    shortTitle: 'Retirement Buckets',
    description: 'Structure your post-retirement corpus across liquidity, safety, and wealth creation buckets.',
    tier: 'advanced',
    category: 'advanced-planning',
    legacyCategory: 'Plan for Goals',
    icon: '⏳',
    route: '/tools/retirement-distribution',
    componentKey: 'RetirementDistributionPlanner',
    visibility: 'public',
    homepageVisibility: false,
    primaryCTA: 'Explore Three-Bucket Plan',
    badge: 'Advanced • Three-Bucket',
    toolsPagePriority: 15,
    relatedArticles: ['how-to-start-planning-for-retirement']
  },
  {
    id: 'life-insurance',
    title: 'Detailed Life Insurance Analysis',
    shortTitle: '5-Step Protection Audit',
    description: 'Comprehensive 5-step protection gap audit factoring liabilities, living expenses, and family goals.',
    tier: 'advanced',
    category: 'advanced-planning',
    legacyCategory: 'Protect Your Family',
    icon: '🛡️',
    route: '/tools/life-insurance',
    componentKey: 'LifeInsuranceNeedCalculator',
    visibility: 'public',
    homepageVisibility: false,
    primaryCTA: 'Explore Detailed Audit',
    badge: 'Advanced • 5-Step Model',
    toolsPagePriority: 16,
    relatedArticles: ['why-life-insurance-is-important-for-a-family']
  },
  {
    id: 'real-statement',
    title: 'REAL Financial Statement',
    shortTitle: 'REAL Statement',
    description: 'Comprehensive diagnostic audit of income, living costs, ongoing savings, and Actual Net Worth.',
    tier: 'advanced',
    category: 'advanced-planning',
    legacyCategory: 'Manage Your Money',
    icon: '💎',
    route: '/health-check/real-statement',
    componentKey: 'REALFinancialStatement',
    visibility: 'public',
    homepageVisibility: false,
    primaryCTA: 'Explore REAL Statement',
    badge: 'Advanced • Diagnostic',
    toolsPagePriority: 17,
    relatedArticles: ['what-is-asset-allocation', 'what-is-financial-freedom']
  }
];

export const START_HERE_TOOLS = TOOLS_REGISTRY.filter(t => t.tier === 'start');
export const GOAL_PLANNING_TOOLS = TOOLS_REGISTRY.filter(t => t.tier === 'goal');
export const DECISION_TOOLS = TOOLS_REGISTRY.filter(t => t.tier === 'decision');
export const ADVANCED_TOOLS = TOOLS_REGISTRY.filter(t => t.tier === 'advanced');

export const PUBLIC_CALCULATORS = TOOLS_REGISTRY.filter(t => t.visibility === 'public');
export const HOMEPAGE_CALCULATORS = TOOLS_REGISTRY.filter(t => t.homepageVisibility);
