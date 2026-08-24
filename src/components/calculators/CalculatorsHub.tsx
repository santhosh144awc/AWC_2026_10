import React, { useState, useEffect } from 'react';
import SIPCalculator from './SIPCalculator';
import RetirementCalculator from './RetirementCalculator';
import GoalPlannerCalculator from './GoalPlannerCalculator';
import LoanVsInvestmentCalculator from './LoanVsInvestmentCalculator';
import InsuranceCalculator from './InsuranceCalculator';
import NetWorthCalculator from './NetWorthCalculator';

type CalculatorTab = 'sip' | 'retirement' | 'goal' | 'loan-vs-invest' | 'insurance' | 'net-worth';

function normalizeTab(rawTab?: string | null): CalculatorTab {
  if (!rawTab) return 'sip';
  const clean = rawTab.toLowerCase().trim();
  if (clean === 'sip' || clean === 'sip-calculator' || clean === 'step-up' || clean === 'lumpsum') return 'sip';
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

interface CategoryGroup {
  category: string;
  items: Array<{ id: CalculatorTab; name: string; icon: string; tag: string }>;
}

const CATEGORIES: CategoryGroup[] = [
  {
    category: 'Build Wealth',
    items: [
      { id: 'sip', name: 'SIP & Step-Up Calculator', icon: '📈', tag: 'Compounding' },
    ]
  },
  {
    category: 'Plan for Goals',
    items: [
      { id: 'goal', name: 'Comprehensive Goal Planner', icon: '🎯', tag: 'Milestones' },
      { id: 'retirement', name: 'Retirement Corpus Planner', icon: '🌅', tag: 'Freedom' },
    ]
  },
  {
    category: 'Protect Your Family',
    items: [
      { id: 'insurance', name: 'Needs-Based Insurance Calculator', icon: '🛡️', tag: 'Protection' },
    ]
  },
  {
    category: 'Manage Your Money',
    items: [
      { id: 'loan-vs-invest', name: 'Loan Prepay vs Investment', icon: '⚖️', tag: 'Comparison' },
      { id: 'net-worth', name: 'Personal Net Worth Calculator', icon: '💎', tag: 'Balance Sheet' },
    ]
  }
];

export default function CalculatorsHub() {
  const [activeTab, setActiveTab] = useState<CalculatorTab>(getTabFromUrl);

  useEffect(() => {
    // Synchronize tab with current URL on mount
    const currentTab = getTabFromUrl();
    setActiveTab(currentTab);

    // Listen to browser Back and Forward navigation
    const handlePopState = () => {
      setActiveTab(getTabFromUrl());
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleSelectTab = (tab: CalculatorTab) => {
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
      {/* Category Navigation Bar */}
      <div className="hub-nav-wrapper">
        {CATEGORIES.map((catGroup) => (
          <div key={catGroup.category} className="category-group">
            <span className="group-title">{catGroup.category}</span>
            <div className="group-buttons">
              {catGroup.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectTab(item.id)}
                  className={`tab-btn ${activeTab === item.id ? 'tab-btn-active' : ''}`}
                >
                  <span className="btn-icon">{item.icon}</span>
                  <div className="btn-text-block">
                    <span className="btn-name">{item.name}</span>
                    <span className="btn-tag">{item.tag}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Active Calculator Container */}
      <div className="active-calculator-stage">
        {activeTab === 'sip' && <SIPCalculator />}
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
        }

        .tab-btn:hover {
          background-color: #F1F5F9;
          border-color: #CBD5E1;
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

        .active-calculator-stage {
          animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 1024px) {
          .hub-nav-wrapper {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .hub-nav-wrapper {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
