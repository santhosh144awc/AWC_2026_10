import React, { useState, useEffect } from 'react';
import SIPCalculator from './SIPCalculator';
import LumpsumCalculator from './LumpsumCalculator';
import RetirementCalculator from './RetirementCalculator';
import GoalPlannerCalculator from './GoalPlannerCalculator';
import LoanVsInvestmentCalculator from './LoanVsInvestmentCalculator';
import InsuranceCalculator from './InsuranceCalculator';
import NetWorthCalculator from './NetWorthCalculator';

type CalculatorTab = 'sip' | 'lumpsum' | 'retirement' | 'goal' | 'loan-vs-invest' | 'insurance' | 'net-worth';

function normalizeTab(rawTab?: string | null): CalculatorTab {
  if (!rawTab) return 'sip';
  const clean = rawTab.toLowerCase().trim();
  if (clean === 'lumpsum' || clean === 'lump-sum' || clean === 'one-time' || clean === 'lumpsum-calculator') return 'lumpsum';
  if (clean === 'sip' || clean === 'sip-calculator' || clean === 'step-up') return 'sip';
  if (clean === 'retirement' || clean === 'retirement-calculator') return 'retirement';
  if (clean === 'goal' || clean === 'goal-planner' || clean === 'goals') return 'goal';
  if (clean === 'loan-vs-invest' || clean === 'loan-vs-investment' || clean === 'loan' || clean === 'loan-prepay') return 'loan-vs-invest';
  if (clean === 'insurance' || clean === 'insurance-calculator' || clean === 'term-insurance' || clean === 'protection') return 'insurance';
  if (clean === 'net-worth' || clean === 'networth' || clean === 'net-worth-calculator') return 'net-worth';
  return 'sip';
}

function getTabFromUrl(): CalculatorTab {
  if (typeof window === 'undefined') return 'sip';
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const param = urlParams.get('calc');
    if (param) return normalizeTab(param);
    if (window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      if (hash) return normalizeTab(hash);
    }
  } catch {
    // Fallback for safety
  }
  return 'sip';
}

interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  tag: string;
  href?: string;
}

interface CategoryGroup {
  category: string;
  items: CategoryItem[];
}

const FEATURED_SUITES = [
  {
    title: 'Loan + SIP Recovery Planner',
    icon: '⚖️',
    badge: 'New • Wealth Recovery',
    desc: 'See how investing a manageable percentage of your EMI into SIP can potentially offset your loan interest or complete cost.',
    href: '/tools/loan-sip-recovery',
    cta: 'Plan Loan Offset →'
  },
  {
    title: 'Home Loan Foreclosure Planner',
    icon: '🏠',
    badge: 'New • Foreclosure Strategy',
    desc: 'See how a parallel SIP alongside your EMI could help you plan for an earlier home-loan closure.',
    href: '/tools/home-loan-foreclosure',
    cta: 'Plan Loan Foreclosure →'
  },
  {
    title: 'SWP Calculator',
    icon: '📉',
    badge: 'New • Retirement SWP',
    desc: 'Plan retirement withdrawals with monthly simulations, annual step-ups and lump-sum milestones.',
    href: '/tools/swp',
    cta: 'Plan SWP Longevity →'
  },
  {
    title: 'SIP Growth Planner',
    icon: '🚀',
    badge: 'New • Multi-Lump-Sum',
    desc: 'See how your monthly SIP, annual step-ups and additional investments grow over time.',
    href: '/tools/sip-growth',
    cta: 'Plan SIP Growth →'
  },
  {
    title: 'Retirement Distribution Planner',
    icon: '⏳',
    badge: 'New • Three-Bucket',
    desc: 'Structure your post-retirement corpus across liquidity, safety, and wealth creation buckets.',
    href: '/tools/retirement-distribution',
    cta: 'Structure Retirement Buckets →'
  },
  {
    title: 'Retirement Accumulation Planner',
    icon: '🌅',
    badge: 'New • Annuity-Due',
    desc: 'Estimate future living expenses, required corpus, existing resources & 3-way SIP roadmap.',
    href: '/tools/retirement',
    cta: 'Plan Retirement Corpus →'
  },
  {
    title: 'Home Purchase Planner',
    icon: '🏠',
    badge: 'New • Guided Plan',
    desc: 'Calculate future property cost, down payment, acquisition expenses & EMI affordability.',
    href: '/tools/home-purchase',
    cta: 'Plan Home Purchase →'
  },
  {
    title: 'Life Insurance Need Analysis',
    icon: '🛡️',
    badge: 'New • 5-Step Model',
    desc: 'Needs-based protection gap audit factoring liabilities, living expenses & family goals.',
    href: '/tools/life-insurance',
    cta: 'Check Insurance Need →'
  },
  {
    title: "Children's Future Planner",
    icon: '🎓',
    badge: 'Education & Marriage',
    desc: "Map your child's higher education milestones with inflation and step-up SIPs.",
    href: '/plan/children',
    cta: "Plan Child's Goals →"
  },
  {
    title: 'REAL Financial Statement',
    icon: '💎',
    badge: 'Comprehensive Audit',
    desc: 'Audit income, living costs, ongoing savings, and calculate your Actual Net Worth.',
    href: '/health-check/real-statement',
    cta: 'Open REAL Statement →'
  },
];

const CATEGORIES: CategoryGroup[] = [
  {
    category: 'Build Wealth',
    items: [
      { id: 'loan-sip-recovery', name: 'Loan + SIP Recovery Planner', icon: '⚖️', tag: 'New', href: '/tools/loan-sip-recovery' },
      { id: 'home-loan-foreclosure', name: 'Home Loan Foreclosure Planner', icon: '🏠', tag: 'New', href: '/tools/home-loan-foreclosure' },
      { id: 'sip-growth', name: 'SIP Growth Planner', icon: '🚀', tag: 'New', href: '/tools/sip-growth' },
      { id: 'swp', name: 'SWP Calculator', icon: '📉', tag: 'New', href: '/tools/swp' },
      { id: 'sip', name: 'Quick SIP Calculator', icon: '📈', tag: 'Monthly' },
      { id: 'lumpsum', name: 'Lumpsum Calculator', icon: '💰', tag: 'One-Time' },
    ]
  },
  {
    category: 'Plan for Goals',
    items: [
      { id: 'loan-sip-recovery-goal', name: 'Loan + SIP Recovery Planner', icon: '⚖️', tag: 'New', href: '/tools/loan-sip-recovery' },
      { id: 'home-foreclosure-goal', name: 'Home Loan Foreclosure Planner', icon: '🏠', tag: 'New', href: '/tools/home-loan-foreclosure' },
      { id: 'swp-goal', name: 'SWP Longevity Calculator', icon: '📉', tag: 'New', href: '/tools/swp' },
      { id: 'retirement-distribution', name: 'Retirement Distribution Planner', icon: '⏳', tag: 'New', href: '/tools/retirement-distribution' },
      { id: 'retirement', name: 'Retirement Accumulation Planner', icon: '🌅', tag: 'New', href: '/tools/retirement' },
      { id: 'home', name: 'Home Purchase Planner', icon: '🏠', tag: 'New', href: '/tools/home-purchase' },
      { id: 'children', name: "Children's Future Planner", icon: '🎓', tag: 'Education', href: '/plan/children' },
      { id: 'goal', name: 'Comprehensive Goal Planner', icon: '🎯', tag: 'Milestones' },
    ]
  },
  {
    category: 'Protect Your Family',
    items: [
      { id: 'life-insurance', name: 'Life Insurance Need Analysis', icon: '🛡️', tag: 'New', href: '/tools/life-insurance' },
      { id: 'insurance', name: 'Quick Term Insurance Check', icon: '⚡', tag: 'Protection' },
    ]
  },
  {
    category: 'Manage Your Money',
    items: [
      { id: 'real-statement', name: 'REAL Financial Statement', icon: '💎', tag: 'Audit', href: '/health-check/real-statement' },
      { id: 'loan-vs-invest', name: 'Loan Prepay vs Investment', icon: '⚖️', tag: 'Comparison' },
      { id: 'net-worth', name: 'Personal Net Worth Calculator', icon: '📊', tag: 'Balance Sheet' },
    ]
  }
];

export default function CalculatorsHub() {
  const [activeTab, setActiveTab] = useState<CalculatorTab>(getTabFromUrl);

  useEffect(() => {
    const currentTab = getTabFromUrl();
    setActiveTab(currentTab);

    const handlePopState = () => {
      setActiveTab(getTabFromUrl());
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleSelectTab = (item: CategoryItem) => {
    if (item.href) {
      window.location.href = item.href;
      return;
    }

    const tab = item.id as CalculatorTab;
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('calc', tab);
        window.history.pushState({ calc: tab }, '', url.toString());
      } catch {
        const newUrl = `${window.location.pathname}?calc=${tab}`;
        window.history.pushState({ calc: tab }, '', newUrl);
      }
    }
  };

  return (
    <div className="hub-container">
      {/* Featured Planning Suites Grid */}
      <div className="featured-suites-wrapper">
        <div className="featured-header">
          <span className="featured-badge">Featured Guided Planners</span>
          <h2 className="featured-title">Specialized Financial Planning Suites</h2>
          <p className="featured-sub">
            Advanced, step-by-step financial decision tools based on validated planning frameworks.
          </p>
        </div>

        <div className="featured-cards-grid">
          {FEATURED_SUITES.map((suite) => (
            <a key={suite.title} href={suite.href} className="featured-suite-card">
              <div className="suite-card-top">
                <span className="suite-icon">{suite.icon}</span>
                <span className="suite-badge-tag">{suite.badge}</span>
              </div>
              <h3 className="suite-heading">{suite.title}</h3>
              <p className="suite-desc">{suite.desc}</p>
              <span className="suite-cta-link">{suite.cta}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="hub-divider">
        <span className="divider-text">Or Use Our Quick Simulation Calculators</span>
      </div>

      {/* Category Navigation Bar */}
      <div className="hub-nav-wrapper">
        {CATEGORIES.map((catGroup) => (
          <div key={catGroup.category} className="category-group">
            <span className="group-title">{catGroup.category}</span>
            <div className="group-buttons">
              {catGroup.items.map((item) => {
                if (item.href) {
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      className="tab-btn tab-btn-link"
                    >
                      <span className="btn-icon">{item.icon}</span>
                      <div className="btn-text-block">
                        <span className="btn-name">{item.name}</span>
                        <span className="btn-tag btn-tag-link">{item.tag} ↗</span>
                      </div>
                    </a>
                  );
                }

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectTab(item)}
                    className={`tab-btn ${activeTab === item.id ? 'tab-btn-active' : ''}`}
                  >
                    <span className="btn-icon">{item.icon}</span>
                    <div className="btn-text-block">
                      <span className="btn-name">{item.name}</span>
                      <span className="btn-tag">{item.tag}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Active Calculator Container */}
      <div className="active-calculator-stage">
        {activeTab === 'sip' && <SIPCalculator />}
        {activeTab === 'lumpsum' && <LumpsumCalculator />}
        {activeTab === 'retirement' && <RetirementCalculator />}
        {activeTab === 'goal' && <GoalPlannerCalculator />}
        {activeTab === 'loan-vs-invest' && <LoanVsInvestmentCalculator />}
        {activeTab === 'insurance' && <InsuranceCalculator />}
        {activeTab === 'net-worth' && <NetWorthCalculator />}
      </div>

      <style>{`
        .hub-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Featured Suites Grid */
        .featured-suites-wrapper {
          background: linear-gradient(135deg, #00182A 0%, #002B49 100%);
          border-radius: 20px;
          padding: 2.25rem 2rem;
          margin-bottom: 2.5rem;
          box-shadow: 0 16px 36px -10px rgba(0, 24, 42, 0.25);
          color: #FFFFFF;
        }

        .featured-header {
          text-align: center;
          margin-bottom: 1.75rem;
        }

        .featured-badge {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #00AB96;
          background: rgba(0, 171, 150, 0.15);
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          margin-bottom: 0.5rem;
        }

        .featured-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.85rem;
          font-weight: 800;
          color: #FFFFFF !important;
          margin: 0 0 0.5rem 0;
        }

        .featured-sub {
          font-size: 0.95rem;
          color: #CBD5E1;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.5;
        }

        .featured-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }

        .featured-suite-card {
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 14px;
          padding: 1.25rem;
          text-decoration: none;
          color: #00182A;
          display: flex;
          flex-direction: column;
          transition: all 0.25s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .featured-suite-card:hover {
          transform: translateY(-4px);
          border-color: #00AB96;
          box-shadow: 0 12px 24px -6px rgba(0, 171, 150, 0.25);
        }

        .suite-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .suite-icon {
          font-size: 1.75rem;
        }

        .suite-badge-tag {
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          background: #E6F7F5;
          color: #00AB96;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
        }

        .suite-heading {
          font-family: 'Outfit', sans-serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: #00182A;
          margin: 0 0 0.4rem 0;
          line-height: 1.3;
        }

        .suite-desc {
          font-size: 0.8rem;
          color: #64748B;
          line-height: 1.4;
          margin: 0 0 1rem 0;
          flex-grow: 1;
        }

        .suite-cta-link {
          font-size: 0.8rem;
          font-weight: 700;
          color: #00AB96;
          margin-top: auto;
        }

        /* Hub Divider */
        .hub-divider {
          position: relative;
          text-align: center;
          margin: 2rem 0;
        }

        .hub-divider::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          width: 100%;
          height: 1px;
          background: #E2E8F0;
          z-index: 1;
        }

        .divider-text {
          position: relative;
          z-index: 2;
          background: #F8FAFC;
          padding: 0 1rem;
          font-size: 0.85rem;
          font-weight: 700;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        /* Category Nav */
        .hub-nav-wrapper {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 2.5rem;
        }

        .category-group {
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .group-title {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748B;
          margin-bottom: 0.25rem;
        }

        .group-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background-color: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 8px;
          padding: 0.6rem 0.75rem;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          color: inherit;
        }

        .tab-btn:hover {
          background-color: #F1F5F9;
          border-color: #CBD5E1;
        }

        .tab-btn-link:hover {
          border-color: #00AB96;
          background-color: #F0FDF4;
        }

        .tab-btn-active {
          background-color: #00182A !important;
          border-color: #00182A !important;
          color: #FFFFFF !important;
        }

        .tab-btn-active .btn-tag {
          background-color: #00AB96;
          color: #FFFFFF;
        }

        .btn-icon {
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        .btn-text-block {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .btn-name {
          font-size: 0.825rem;
          font-weight: 700;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .btn-tag {
          font-size: 0.675rem;
          font-weight: 600;
          color: #64748B;
          margin-top: 0.15rem;
          display: inline-block;
          width: fit-content;
          padding: 0.1rem 0.35rem;
          border-radius: 4px;
          background-color: #E2E8F0;
        }

        .btn-tag-link {
          background-color: #E6F7F5;
          color: #00AB96;
        }

        .active-calculator-stage {
          animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 1024px) {
          .featured-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .hub-nav-wrapper {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .featured-suites-wrapper {
            padding: 1.5rem 1rem;
          }
          .featured-title {
            font-size: 1.4rem !important;
          }
          .featured-cards-grid {
            grid-template-columns: 1fr;
          }
          .hub-nav-wrapper {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
