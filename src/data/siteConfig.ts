export interface NavItem {
  label: string;
  href: string;
}

export interface GoalItem {
  id: string;
  title: string;
  icon: string;
  description: string;
  href: string;
  color: string;
}

export interface CalculatorItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
}

export interface JourneyStage {
  step: number;
  title: string;
  focus: string;
  description: string;
}

export interface TrustPillar {
  title: string;
  subtitle: string;
  icon: string;
}

export const siteConfig = {
  name: "Ant Wealth Creation",
  tagline: "Make Better Money Decisions. Build a Better Future.",
  heroSubtitle: "Simple financial guidance for investing, protection, retirement and wealth creation.",
  domain: "https://antwealth.in",
  
  founder: {
    name: "C. Santhosh Sathriyan, B.E.",
    title: "Founder & AMFI-Registered Mutual Fund Distributor",
    arn: "266896",
    credentials: "QPFP Certified | AMFI-Registered MFD",
    experienceSince: "2012",
    establishedDate: "14 April 2023",
    photo: "/assets/santhosh_photo.webp",
    quote: "My goal is simple — to help families make better financial decisions and move towards financial freedom.",
    bio: "With experience in financial markets since 2012, Santhosh helps families systematically plan for life milestones through disciplined, goal-oriented mutual fund investing and risk protection.",
    story: {
      heritage: "Growing up in a family with deep roots in life insurance through his father's decades of dedicated service at LIC, Santhosh saw firsthand how financial protection and disciplined savings safeguard families during life's most vulnerable moments.",
      evolution: "Recognizing that Indian families needed a comprehensive approach connecting insurance with long-term wealth creation, Santhosh developed a strong passion for goal-based financial planning and mutual funds, active in financial markets since 2012.",
      founding: "On 14 April 2023, Santhosh formally established Ant Wealth Creation with a clear mission: to make financial planning simple, transparent, and accessible to everyday Indian families without pressure, complex jargon, or opaque sales tactics."
    }
  },

  contact: {
    phone: "+91 80879 71566",
    phoneDisplay: "+91 80879 71566",
    email: "santhosh@antwealth.in",
    location: "Dharmapuri, Tamil Nadu",
    whatsappUrl: "https://wa.me/918087971566?text=Hi%20Santhosh,%20I%20came%20across%20Ant%20Wealth%20Creation%20and%20would%20like%20to%20discuss%20my%20financial%20goals.",
    consultationBookingUrl: "", // Configurable third-party calendar URL (e.g. Calendly / Cal.com). Interactive fallback enabled.
  },

  nav: [
    { label: "Home", href: "/" },
    { label: "Plan Your Money", href: "/plan" },
    { label: "Calculators", href: "/tools" },
    { label: "Learn", href: "/learn" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ] as NavItem[],

  primaryCTA: {
    label: "Start Your Financial Plan",
    href: "/plan",
  },

  disclaimers: {
    regulatory: "AMFI Registered Mutual Fund Distributor (ARN-266896). Mutual fund investments are subject to market risks, read all scheme related documents carefully.",
    notRIA: "Ant Wealth Creation is a mutual fund distribution firm registered with AMFI. Information on this website is for educational and planning purposes only and does not constitute guaranteed return or financial advice.",
    copyright: "© 2026 Ant Wealth Creation. All Rights Reserved."
  },

  trustPillars: [
    {
      title: "Since 2012",
      subtitle: "Experience in mutual funds",
      icon: "calendar",
    },
    {
      title: "AMFI Registered",
      subtitle: "Mutual Fund Distributor (ARN: 266896)",
      icon: "shield-check",
    },
    {
      title: "Client First",
      subtitle: "Recommendations based on goals",
      icon: "user-heart",
    },
    {
      title: "Simple & Transparent",
      subtitle: "Finance explained in easy language",
      icon: "sparkles",
    },
    {
      title: "Long-Term Approach",
      subtitle: "Focus on financial goals, not short-term noise",
      icon: "trending-up",
    },
  ] as TrustPillar[],

  goals: [
    {
      id: "home",
      title: "Buy a Home",
      icon: "home",
      description: "Plan your down payment, acquisition costs and EMI affordability.",
      href: "/tools/home-purchase",
      color: "#10B981",
    },
    {
      id: "education",
      title: "Child's Education",
      description: "Build an inflation-adjusted corpus for your child's higher education.",
      href: "/plan/children",
      color: "#3B82F6",
    },
    {
      id: "retirement",
      title: "Retirement",
      icon: "retirement",
      description: "Ensure a dignified, stress-free life with passive income.",
      href: "/tools/retirement",
      color: "#F59E0B",
    },
    {
      id: "wealth",
      title: "Build Wealth",
      icon: "wealth",
      description: "Harness the power of compounding for long-term growth.",
      href: "/plan?goal=wealth",
      color: "#00AB96",
    },
    {
      id: "protection",
      title: "Protect My Family",
      icon: "protection",
      description: "Safeguard against life uncertainties with adequate cover.",
      href: "/tools/life-insurance",
      color: "#6366F1",
    },
    {
      id: "income",
      title: "Create Regular Income",
      icon: "income",
      description: "Generate steady cash flow through systematic withdrawal plans.",
      href: "/tools/retirement-distribution",
      color: "#EC4899",
    },
  ] as GoalItem[],

  calculators: [
    {
      id: "swp",
      title: "SWP Calculator",
      description: "Estimate retirement withdrawal sustainability with annual step-ups and lump sum milestones.",
      icon: "trending-down",
      href: "/tools/swp",
    },
    {
      id: "sip-growth",
      title: "SIP Growth Planner",
      description: "See how your monthly SIP, annual step-ups and additional investments grow over time.",
      icon: "trending-up",
      href: "/tools/sip-growth",
    },
    {
      id: "retirement-distribution",
      title: "Retirement Distribution Planner",
      description: "Structure your post-retirement corpus across liquidity, safety, and wealth creation buckets.",
      icon: "sunset",
      href: "/tools/retirement-distribution",
    },
    {
      id: "retirement",
      title: "Retirement Accumulation Planner",
      description: "Estimate your future living expenses, required corpus, and monthly SIP roadmap.",
      icon: "sunset",
      href: "/tools/retirement",
    },
    {
      id: "home-purchase",
      title: "Home Purchase Planner",
      description: "Estimate your future property cost, down payment, acquisition expenses and EMI affordability.",
      icon: "home",
      href: "/tools/home-purchase",
    },
    {
      id: "life-insurance",
      title: "Life Insurance Need",
      description: "Comprehensive 5-step family protection gap analysis based on debt, goals, and living expenses.",
      icon: "shield-check",
      href: "/tools/life-insurance",
    },
    {
      id: "sip",
      title: "SIP Calculator",
      description: "See how your monthly investment can grow over time.",
      icon: "calculator",
      href: "/tools?calc=sip",
    },
    {
      id: "lumpsum",
      title: "Lumpsum Calculator",
      description: "See how a one-time investment can compound over time.",
      icon: "dollar-sign",
      href: "/tools?calc=lumpsum",
    },
    {
      id: "goal-planner",
      title: "Goal Planner",
      description: "Plan for your dreams with the right investment amount.",
      icon: "target",
      href: "/tools?calc=goal",
    },
    {
      id: "loan-vs-invest",
      title: "Loan vs Investment",
      description: "Should you prepay your loan or invest the surplus?",
      icon: "scale",
      href: "/tools?calc=loan-vs-invest",
    },
    {
      id: "insurance",
      title: "Quick Insurance HLV",
      description: "Calculate quick income replacement coverage need.",
      icon: "shield",
      href: "/tools?calc=insurance",
    },
    {
      id: "net-worth",
      title: "Net Worth Calculator",
      description: "Track your complete financial balance sheet in minutes.",
      icon: "briefcase",
      href: "/tools?calc=net-worth",
    },
  ] as CalculatorItem[],

  journeyStages: [
    {
      step: 1,
      title: "Starting Out",
      focus: "First salary / first investment",
      description: "Setting up basic budgeting, tracking cashflows, and starting first SIPs.",
    },
    {
      step: 2,
      title: "Building Stability",
      focus: "Emergency fund + insurance",
      description: "Creating a 6-month safety net and securing term & health insurance.",
    },
    {
      step: 3,
      title: "Growing Wealth",
      focus: "SIP + long-term investments",
      description: "Systematic asset allocation in equity funds for beating inflation.",
    },
    {
      step: 4,
      title: "Protecting Family",
      focus: "Life + health protection",
      description: "Comprehensive risk coverage and liabilities ring-fencing.",
    },
    {
      step: 5,
      title: "Achieving Goals",
      focus: "Education + home + major goals",
      description: "De-risking and funding milestones as maturity dates approach.",
    },
    {
      step: 6,
      title: "Financial Freedom",
      focus: "Retirement + passive income",
      description: "Enjoying life with inflation-protected SWP income streams.",
    },
  ] as JourneyStage[],
};
