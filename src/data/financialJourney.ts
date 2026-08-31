export interface FinancialJourneyStage {
  id: number;
  step: number;
  title: string;
  shortDescription: string;
  introduction: string;
  focusAreas: string[];
  tip: string;
}

export const FINANCIAL_JOURNEY_STAGES: FinancialJourneyStage[] = [
  {
    id: 1,
    step: 1,
    title: "Starting Out",
    shortDescription: "First salary / first investment",
    introduction: "Your financial journey begins with understanding your income, expenses and basic financial needs.",
    focusAreas: [
      "Understand your monthly cash flow",
      "Start building an emergency buffer",
      "Get essential financial protection",
      "Begin investing regularly"
    ],
    tip: "Start small, build good money habits and give yourself a strong foundation."
  },
  {
    id: 2,
    step: 2,
    title: "Building Stability",
    shortDescription: "Emergency fund + financial foundation",
    introduction: "Before focusing heavily on wealth creation, make sure your financial foundation can handle unexpected events.",
    focusAreas: [
      "Build an adequate emergency fund",
      "Keep high-cost debt under control",
      "Maintain a healthy monthly surplus",
      "Review your essential financial protection"
    ],
    tip: "Financial stability gives you the confidence to plan for the long term."
  },
  {
    id: 3,
    step: 3,
    title: "Protecting Family",
    shortDescription: "Life + health protection",
    introduction: "Protect the people who depend on you and make sure unexpected events do not derail your family's financial goals.",
    focusAreas: [
      "Assess your family's life insurance need",
      "Maintain appropriate health insurance",
      "Consider major liabilities and responsibilities",
      "Protect important future financial goals"
    ],
    tip: "Protect your family first so your financial plan can withstand life's uncertainties."
  },
  {
    id: 4,
    step: 4,
    title: "Growing Wealth",
    shortDescription: "SIP + long-term investments",
    introduction: "Once your financial foundation is in place, regular long-term investing can help your wealth grow over time.",
    focusAreas: [
      "Invest regularly",
      "Give your investments enough time to compound",
      "Match investments with your time horizon",
      "Review your asset allocation periodically"
    ],
    tip: "Consistency and time can be more powerful than trying to predict the market."
  },
  {
    id: 5,
    step: 5,
    title: "Achieving Goals",
    shortDescription: "Education + home + major goals",
    introduction: "Your investments should have a purpose. Plan for important goals by understanding their future cost and the time available.",
    focusAreas: [
      "Identify important financial goals",
      "Estimate the future cost of each goal",
      "Consider inflation and the time horizon",
      "Build an investment plan for each goal"
    ],
    tip: "Turn your important life goals into clear financial targets."
  },
  {
    id: 6,
    step: 6,
    title: "Financial Freedom",
    shortDescription: "Retirement + sustainable income",
    introduction: "Financial freedom is about building enough financial resources to support the lifestyle and responsibilities you want over time.",
    focusAreas: [
      "Build retirement readiness",
      "Estimate future income needs",
      "Plan withdrawals carefully",
      "Review your financial plan as life changes"
    ],
    tip: "Financial freedom is built gradually through planning, saving, investing and disciplined decisions."
  }
];
