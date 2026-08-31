export interface FinancialJourneyStage {
  id: number;
  step: number;
  title: string;
  shortDescription: string;
  introduction: string;
  focusAreas: string[];
  tip: string;
  actionLabel: string;
  actionHref: string;
}

export const FINANCIAL_JOURNEY_STAGES: FinancialJourneyStage[] = [
  {
    id: 1,
    step: 1,
    title: "Starting Out",
    shortDescription: "First salary / first investment",
    introduction: "This is the foundation of your financial journey. Start by understanding your cash flow and building good money habits.",
    focusAreas: [
      "Understand your income and monthly expenses",
      "Start building an emergency fund",
      "Get appropriate life and health protection",
      "Start investing regularly"
    ],
    tip: "Small, consistent steps today can create a strong financial foundation for tomorrow.",
    actionLabel: "Check My Financial Health →",
    actionHref: "/health-check"
  },
  {
    id: 2,
    step: 2,
    title: "Building Stability",
    shortDescription: "Emergency fund + insurance",
    introduction: "Before focusing heavily on wealth creation, make sure your financial foundation can handle unexpected events.",
    focusAreas: [
      "Build an emergency fund",
      "Review essential insurance protection",
      "Keep high-cost debt under control",
      "Maintain a healthy monthly surplus"
    ],
    tip: "Financial stability gives you the confidence to invest for the long term.",
    actionLabel: "Check My Financial Health →",
    actionHref: "/health-check"
  },
  {
    id: 3,
    step: 3,
    title: "Growing Wealth",
    shortDescription: "SIP + long-term investments",
    introduction: "Once your foundation is stronger, regular investing can help you work towards long-term wealth creation.",
    focusAreas: [
      "Invest regularly",
      "Understand the power of compounding",
      "Match investments with your time horizon",
      "Review your asset allocation over time"
    ],
    tip: "Consistency and time can matter more than trying to find the perfect investment.",
    actionLabel: "Explore Investment Tools →",
    actionHref: "/tools?calc=sip"
  },
  {
    id: 4,
    step: 4,
    title: "Protecting Family",
    shortDescription: "Life + health protection",
    introduction: "As responsibilities grow, protecting your family from financial shocks becomes increasingly important.",
    focusAreas: [
      "Review life insurance needs",
      "Maintain appropriate health insurance",
      "Consider outstanding liabilities",
      "Protect important family goals"
    ],
    tip: "Protection is about making sure your family's plans can continue even when life does not go as expected.",
    actionLabel: "Check Protection Need →",
    actionHref: "/tools?calc=insurance"
  },
  {
    id: 5,
    step: 5,
    title: "Achieving Goals",
    shortDescription: "Education + home + major goals",
    introduction: "Major goals become easier to manage when you know what they may cost, when you need the money, and how much you can set aside today.",
    focusAreas: [
      "Identify important financial goals",
      "Estimate future costs",
      "Consider inflation and time horizon",
      "Create a realistic investment plan"
    ],
    tip: "A clear goal gives your money a purpose.",
    actionLabel: "Plan a Goal →",
    actionHref: "/plan"
  },
  {
    id: 6,
    step: 6,
    title: "Financial Freedom",
    shortDescription: "Retirement + passive income",
    introduction: "Financial freedom is about building enough financial resources to support the lifestyle and responsibilities you want over time.",
    focusAreas: [
      "Build retirement readiness",
      "Estimate future income needs",
      "Plan withdrawals carefully",
      "Continue reviewing your financial plan"
    ],
    tip: "Financial freedom is built gradually through planning, saving, investing and disciplined decisions.",
    actionLabel: "Plan for Retirement →",
    actionHref: "/tools?calc=retirement"
  }
];
