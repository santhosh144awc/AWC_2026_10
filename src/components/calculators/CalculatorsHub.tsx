import React, { useState, useEffect, useRef } from 'react';
import SIPCalculator from './SIPCalculator';
import LumpsumCalculator from './LumpsumCalculator';
import RetirementCalculator from './RetirementCalculator';
import GoalPlannerCalculator from './GoalPlannerCalculator';
import LoanVsInvestmentCalculator from './LoanVsInvestmentCalculator';
import InsuranceCalculator from './InsuranceCalculator';
import NetWorthCalculator from './NetWorthCalculator';

export type CalculatorTab = 'sip' | 'lumpsum' | 'retirement' | 'goal' | 'loan-vs-invest' | 'insurance' | 'net-worth';

function normalizeTab(rawTab?: string | null): CalculatorTab {
  if (!rawTab) return 'sip';
  const clean = rawTab.toLowerCase().trim();
  if (clean === 'lumpsum' || clean === 'lump-sum' || clean === 'one-time' || clean === 'lumpsum-calculator') return 'lumpsum';
  if (clean === 'sip' || clean === 'sip-calculator' || clean === 'step-up') return 'sip';
  if (clean === 'retirement' || clean === 'retirement-calculator') return 'retirement';
  if (clean === 'goal' || clean === 'goal-planner' || clean === 'goals') return 'goal';
  if (clean === 'loan-vs-invest' || clean === 'loan-vs-investment' || clean === 'loan' || clean === 'loan-prepay') return 'loan-vs-invest';
  if (clean === 'insurance' || clean === 'insurance-calculator' || clean === 'term-insurance' || clean === 'protection' || clean === 'life-insurance') return 'insurance';
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
      if (hash && hash !== 'advanced') return normalizeTab(hash);
    }
  } catch {
    // Fallback for safety
  }
  return 'sip';
}

export interface WorkspaceTab {
  id: CalculatorTab;
  label: string;
  title: string;
}

export const WORKSPACE_TABS: WorkspaceTab[] = [
  { id: 'sip', label: 'SIP', title: 'SIP Calculator' },
  { id: 'lumpsum', label: 'Lumpsum', title: 'Lumpsum Calculator' },
  { id: 'goal', label: 'Goal', title: 'Milestone Goal Planner' },
  { id: 'retirement', label: 'Retirement', title: 'Retirement Calculator' },
  { id: 'loan-vs-invest', label: 'Loan vs Invest', title: 'Loan vs Investment Calculator' },
  { id: 'insurance', label: 'Insurance', title: 'Life Insurance Calculator' },
  { id: 'net-worth', label: 'Net Worth', title: 'Net Worth Calculator' },
];

export default function CalculatorsHub() {
  const [activeTab, setActiveTab] = useState<CalculatorTab>('sip');
  const stageRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = -1;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (index + 1) % WORKSPACE_TABS.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = (index - 1 + WORKSPACE_TABS.length) % WORKSPACE_TABS.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = WORKSPACE_TABS.length - 1;
        break;
      default:
        return;
    }

    e.preventDefault();
    const targetTab = WORKSPACE_TABS[nextIndex];
    handleSelectEmbeddedTab(targetTab.id);
    tabRefs.current[nextIndex]?.focus();
  };

  useEffect(() => {
    const currentTab = getTabFromUrl();
    if (currentTab) {
      setActiveTab(currentTab);
      // Auto-scroll to calculator stage if specific tab requested via URL query or hash
      if (typeof window !== 'undefined' && (window.location.search.includes('calc=') || (window.location.hash && window.location.hash !== '#advanced'))) {
        setTimeout(() => {
          stageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    }

    const handlePopState = () => {
      const tab = getTabFromUrl();
      setActiveTab(tab);
      stageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleSelectEmbeddedTab = (tab: CalculatorTab, scroll: boolean = false) => {
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

      if (scroll && stageRef.current) {
        stageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="hub-container">
      {/* ====================================================== */}
      {/* SECTION 1: START HERE (Tier 1 Simple Public Tools) */}
      {/* ====================================================== */}
      <section className="hub-section tier-1-section">
        <div className="section-title-wrap">
          <div className="tier-pill tier-pill-primary">Start Here</div>
          <h2 className="tier-heading">Start Here</h2>
          <p className="tier-subtext">Simple tools for everyday financial decisions and quick self-assessments.</p>
        </div>

        <div className="tools-grid-tier1">
          {/* 1. Health Check */}
          <a href="/health-check" className="tool-card-tier1">
            <div className="card-top">
              <span className="tool-icon">🩺</span>
              <span className="card-badge badge-teal">Self-Assessment</span>
            </div>
            <h3 className="tool-title">Financial Health Check</h3>
            <p className="tool-desc">Understand your savings, emergency fund, protection and retirement readiness in 2 minutes.</p>
            <span className="tool-btn-link">Check My Financial Health →</span>
          </a>

          {/* 2. SIP Calculator */}
          <button 
            type="button" 
            onClick={() => handleSelectEmbeddedTab('sip', true)}
            className={`tool-card-tier1 text-left ${activeTab === 'sip' ? 'active-tier1-card' : ''}`}
          >
            <div className="card-top">
              <span className="tool-icon">📈</span>
              <span className="card-badge badge-teal">Interactive</span>
            </div>
            <h3 className="tool-title">SIP Calculator</h3>
            <p className="tool-desc">Calculate how disciplined monthly investments grow over time with compounding.</p>
            <span className="tool-btn-link">Calculate My SIP →</span>
          </button>

          {/* 3. Lumpsum Calculator */}
          <button 
            type="button" 
            onClick={() => handleSelectEmbeddedTab('lumpsum', true)}
            className={`tool-card-tier1 text-left ${activeTab === 'lumpsum' ? 'active-tier1-card' : ''}`}
          >
            <div className="card-top">
              <span className="tool-icon">💰</span>
              <span className="card-badge badge-teal">Interactive</span>
            </div>
            <h3 className="tool-title">Lumpsum Calculator</h3>
            <p className="tool-desc">See how a one-time lump sum investment can compound over your intended time horizon.</p>
            <span className="tool-btn-link">Calculate Growth →</span>
          </button>

          {/* 4. Goal Planner */}
          <button 
            type="button" 
            onClick={() => handleSelectEmbeddedTab('goal', true)}
            className={`tool-card-tier1 text-left ${activeTab === 'goal' ? 'active-tier1-card' : ''}`}
          >
            <div className="card-top">
              <span className="tool-icon">🎯</span>
              <span className="card-badge badge-teal">Interactive</span>
            </div>
            <h3 className="tool-title">Goal Planner</h3>
            <p className="tool-desc">Plan for life milestones (education, home down payment, wedding) with inflation-adjusted targets.</p>
            <span className="tool-btn-link">Plan This Goal →</span>
          </button>

          {/* 5. Life Insurance Calculator */}
          <button 
            type="button" 
            onClick={() => handleSelectEmbeddedTab('insurance', true)}
            className={`tool-card-tier1 text-left ${activeTab === 'insurance' ? 'active-tier1-card' : ''}`}
          >
            <div className="card-top">
              <span className="tool-icon">🛡️</span>
              <span className="card-badge badge-teal">Interactive</span>
            </div>
            <h3 className="tool-title">Life Insurance Calculator</h3>
            <p className="tool-desc">Get an illustrative view of family protection needed based on income, debts, and goals.</p>
            <span className="tool-btn-link">Check My Protection Need →</span>
          </button>

          {/* 6. Net Worth Calculator */}
          <button 
            type="button" 
            onClick={() => handleSelectEmbeddedTab('net-worth', true)}
            className={`tool-card-tier1 text-left ${activeTab === 'net-worth' ? 'active-tier1-card' : ''}`}
          >
            <div className="card-top">
              <span className="tool-icon">💎</span>
              <span className="card-badge badge-teal">Interactive</span>
            </div>
            <h3 className="tool-title">Personal Net Worth Calculator</h3>
            <p className="tool-desc">Map all your assets and liabilities to calculate your net worth and debt-to-asset balance.</p>
            <span className="tool-btn-link">Calculate My Net Worth →</span>
          </button>
        </div>
      </section>

      {/* Embedded Workspace Stage */}
      <div id="calculator-stage" ref={stageRef} className="active-workspace-wrapper">
        <div className="workspace-header">
          <div className="workspace-title-row">
            <span className="workspace-tag">Interactive Workspace</span>
            <span className="active-tab-title">
              {WORKSPACE_TABS.find(t => t.id === activeTab)?.title || 'Calculator Workspace'}
            </span>
          </div>
          
          <div className="workspace-tabs-bar" role="tablist" aria-label="Calculator Workspace Selector">
            {WORKSPACE_TABS.map((tab, index) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  ref={(el) => { tabRefs.current[index] = el; }}
                  type="button"
                  role="tab"
                  id={`workspace-tab-${tab.id}`}
                  aria-controls={`workspace-panel-${tab.id}`}
                  aria-selected={isSelected}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => handleSelectEmbeddedTab(tab.id)}
                  onKeyDown={(e) => handleTabKeyDown(e, index)}
                  className={`ws-tab-btn ${isSelected ? 'active' : ''}`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div
          role="tabpanel"
          id={`workspace-panel-${activeTab}`}
          aria-labelledby={`workspace-tab-${activeTab}`}
          tabIndex={0}
          className="workspace-content-pane"
        >
          {activeTab === 'sip' && <SIPCalculator />}
          {activeTab === 'lumpsum' && <LumpsumCalculator />}
          {activeTab === 'retirement' && <RetirementCalculator />}
          {activeTab === 'goal' && <GoalPlannerCalculator />}
          {activeTab === 'loan-vs-invest' && <LoanVsInvestmentCalculator />}
          {activeTab === 'insurance' && <InsuranceCalculator />}
          {activeTab === 'net-worth' && <NetWorthCalculator />}
        </div>
      </div>

      {/* ====================================================== */}
      {/* SECTION 2: PLAN A GOAL */}
      {/* ====================================================== */}
      <section className="hub-section tier-2-section">
        <div className="section-title-wrap">
          <div className="tier-pill tier-pill-secondary">Plan a Goal</div>
          <h2 className="tier-heading">Plan a Goal</h2>
          <p className="tier-subtext">Plan for an important life goal.</p>
        </div>

        <div className="tools-grid-secondary">
          {/* Retirement Accumulation Planner */}
          <a href="/tools/retirement" className="tool-card-secondary">
            <div className="card-top">
              <span className="tool-icon">🌅</span>
              <span className="card-badge badge-slate">Corpus & SIP</span>
            </div>
            <h3 className="tool-title">Retirement Planner</h3>
            <p className="tool-desc">Estimate future living expenses, required retirement corpus, and discover your required monthly SIP.</p>
            <span className="tool-btn-secondary">Plan My Retirement →</span>
          </a>

          {/* Home Purchase Planner */}
          <a href="/tools/home-purchase" className="tool-card-secondary">
            <div className="card-top">
              <span className="tool-icon">🏡</span>
              <span className="card-badge badge-slate">Guided Roadmap</span>
            </div>
            <h3 className="tool-title">Home Purchase Planner</h3>
            <p className="tool-desc">Calculate future property cost, down payment targets, registration expenses, and EMI affordability.</p>
            <span className="tool-btn-secondary">Plan My Home Purchase →</span>
          </a>

          {/* Children's Future Planner */}
          <a href="/plan/children" className="tool-card-secondary">
            <div className="card-top">
              <span className="tool-icon">🎓</span>
              <span className="card-badge badge-slate">Multi-Milestone</span>
            </div>
            <h3 className="tool-title">Children's Future Planner</h3>
            <p className="tool-desc">Map your child's higher education milestones and marriage timeline with inflation and step-up SIPs.</p>
            <span className="tool-btn-secondary">Plan Child's Future →</span>
          </a>

          {/* SIP Growth Planner */}
          <a href="/tools/sip-growth" className="tool-card-secondary">
            <div className="card-top">
              <span className="tool-icon">🚀</span>
              <span className="card-badge badge-slate">Multi-Lump-Sum</span>
            </div>
            <h3 className="tool-title">SIP Growth Planner</h3>
            <p className="tool-desc">Model your monthly SIP, annual step-ups, and intermittent lump-sum additions over a custom horizon.</p>
            <span className="tool-btn-secondary">Explore SIP Growth →</span>
          </a>
        </div>
      </section>

      {/* ====================================================== */}
      {/* SECTION 3: COMPARE A DECISION */}
      {/* ====================================================== */}
      <section className="hub-section tier-3-section">
        <div className="section-title-wrap">
          <div className="tier-pill tier-pill-secondary">Compare a Decision</div>
          <h2 className="tier-heading">Compare a Decision</h2>
          <p className="tier-subtext">Compare financial choices before you act.</p>
        </div>

        <div className="tools-grid-advanced">
          {/* Loan vs Investment */}
          <button 
            type="button" 
            onClick={() => handleSelectEmbeddedTab('loan-vs-invest', true)}
            className="tool-card-secondary text-left"
          >
            <div className="card-top">
              <span className="tool-icon">⚖️</span>
              <span className="card-badge badge-slate">Trade-off</span>
            </div>
            <h3 className="tool-title">Loan vs Investment</h3>
            <p className="tool-desc">Evaluate whether you should prepay your loan or invest surplus funds into diversified equity mutual funds.</p>
            <span className="tool-btn-secondary">Compare My Options →</span>
          </button>

          {/* Loan + SIP Recovery Planner */}
          <a href="/tools/loan-sip-recovery" className="tool-card-secondary">
            <div className="card-top">
              <span className="tool-icon">⚖️</span>
              <span className="card-badge badge-slate">Wealth Recovery</span>
            </div>
            <h3 className="tool-title">Loan + SIP Recovery Planner</h3>
            <p className="tool-desc">See how investing a manageable percentage of your EMI into SIP can potentially offset loan interest or complete cost.</p>
            <span className="tool-btn-secondary">Plan Loan Recovery →</span>
          </a>

          {/* Home Loan Foreclosure */}
          <a href="/tools/home-loan-foreclosure" className="tool-card-secondary">
            <div className="card-top">
              <span className="tool-icon">🏠</span>
              <span className="card-badge badge-slate">Foreclosure</span>
            </div>
            <h3 className="tool-title">Home Loan Foreclosure Planner</h3>
            <p className="tool-desc">Model parallel SIP growth alongside EMI to identify exact month when investment corpus overtakes loan balance.</p>
            <span className="tool-btn-secondary">Plan Loan Foreclosure →</span>
          </a>
        </div>
      </section>

      {/* ====================================================== */}
      {/* SECTION 4: ADVANCED PLANNING */}
      {/* ====================================================== */}
      <section id="advanced" className="hub-section tier-4-section">
        <div className="section-title-wrap">
          <div className="tier-pill tier-pill-tertiary">Advanced Planning</div>
          <h2 className="tier-heading">Advanced Planning</h2>
          <p className="tier-subtext">For deeper financial analysis and planning.</p>
        </div>

        <div className="tools-grid-secondary">
          {/* SWP Longevity */}
          <a href="/tools/swp" className="tool-card-advanced">
            <div className="card-top">
              <span className="tool-icon">📉</span>
              <span className="card-badge badge-quiet">Withdrawal</span>
            </div>
            <h3 className="tool-title">SWP Longevity Calculator (Regular Withdrawal Plan)</h3>
            <p className="tool-desc">Plan regular retirement withdrawals (Systematic Withdrawal Plan) with monthly simulations, annual step-ups, and inflation protection.</p>
            <span className="tool-btn-quiet">Plan Regular Withdrawals →</span>
          </a>

          {/* Retirement Distribution */}
          <a href="/tools/retirement-distribution" className="tool-card-advanced">
            <div className="card-top">
              <span className="tool-icon">⏳</span>
              <span className="card-badge badge-quiet">Three-Bucket</span>
            </div>
            <h3 className="tool-title">Retirement Distribution Planner</h3>
            <p className="tool-desc">Structure your post-retirement nest egg across Liquidity (1-3 yrs), Safety (4-7 yrs), and Growth (8+ yrs) buckets.</p>
            <span className="tool-btn-quiet">Plan Retirement Income →</span>
          </a>

          {/* Detailed Life Insurance Analysis */}
          <a href="/tools/life-insurance" className="tool-card-advanced">
            <div className="card-top">
              <span className="tool-icon">🛡️</span>
              <span className="card-badge badge-quiet">5-Step Audit</span>
            </div>
            <h3 className="tool-title">Detailed Life Insurance Analysis</h3>
            <p className="tool-desc">In-depth 5-step protection gap audit factoring liabilities, living expenses, future milestone goals, and assets.</p>
            <span className="tool-btn-quiet">Audit Protection Need →</span>
          </a>

          {/* REAL Financial Statement */}
          <a href="/health-check/real-statement" className="tool-card-advanced">
            <div className="card-top">
              <span className="tool-icon">💎</span>
              <span className="card-badge badge-quiet">Diagnostic</span>
            </div>
            <h3 className="tool-title">REAL Financial Statement (Complete Money Snapshot)</h3>
            <p className="tool-desc">Audit real income, living costs, ongoing savings rate, and calculate your true net worth position.</p>
            <span className="tool-btn-quiet">View Financial Statement →</span>
          </a>
        </div>
      </section>
    </div>
  );
}
