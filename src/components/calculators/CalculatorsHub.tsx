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
      if (hash && hash !== 'advanced') return normalizeTab(hash);
    }
  } catch {
    // Fallback for safety
  }
  return 'sip';
}

export default function CalculatorsHub() {
  const [activeTab, setActiveTab] = useState<CalculatorTab>('sip');
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentTab = getTabFromUrl();
    if (currentTab !== 'sip') {
      setActiveTab(currentTab);
    }

    const handlePopState = () => {
      setActiveTab(getTabFromUrl());
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
            <span className="tool-btn-link">Calculate Lumpsum →</span>
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
            <span className="tool-btn-link">Plan My Goal →</span>
          </button>

          {/* 5. Life Insurance Need Calculator */}
          <button 
            type="button" 
            onClick={() => handleSelectEmbeddedTab('insurance', true)}
            className={`tool-card-tier1 text-left ${activeTab === 'insurance' ? 'active-tier1-card' : ''}`}
          >
            <div className="card-top">
              <span className="tool-icon">🛡️</span>
              <span className="card-badge badge-teal">Interactive</span>
            </div>
            <h3 className="tool-title">Life Insurance Need Calculator</h3>
            <p className="tool-desc">Get an illustrative view of family protection needed based on income, debts, and goals.</p>
            <span className="tool-btn-link">Check Protection Need →</span>
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
            <span className="tool-btn-link">Calculate Net Worth →</span>
          </button>
        </div>
      </section>

      {/* Embedded Workspace Stage */}
      <div id="calculator-stage" ref={stageRef} className="embedded-workspace-card">
        <div className="workspace-header">
          <div className="workspace-title-row">
            <span className="workspace-tag">Interactive Workspace</span>
            <span className="active-tab-title">
              {activeTab === 'sip' && 'SIP Calculator'}
              {activeTab === 'lumpsum' && 'Lumpsum Calculator'}
              {activeTab === 'retirement' && 'Retirement Calculator'}
              {activeTab === 'goal' && 'Milestone Goal Planner'}
              {activeTab === 'loan-vs-invest' && 'Loan vs Investment Calculator'}
              {activeTab === 'insurance' && 'Life Insurance Calculator'}
              {activeTab === 'net-worth' && 'Net Worth Calculator'}
            </span>
          </div>
          
          <div className="workspace-tabs-pills" role="tablist" aria-label="Calculator Workspace Selector">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'sip'}
              onClick={() => handleSelectEmbeddedTab('sip')}
              className={`pill-btn ${activeTab === 'sip' ? 'active' : ''}`}
            >
              SIP
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'lumpsum'}
              onClick={() => handleSelectEmbeddedTab('lumpsum')}
              className={`pill-btn ${activeTab === 'lumpsum' ? 'active' : ''}`}
            >
              Lumpsum
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'goal'}
              onClick={() => handleSelectEmbeddedTab('goal')}
              className={`pill-btn ${activeTab === 'goal' ? 'active' : ''}`}
            >
              Goal
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'retirement'}
              onClick={() => handleSelectEmbeddedTab('retirement')}
              className={`pill-btn ${activeTab === 'retirement' ? 'active' : ''}`}
            >
              Retirement
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'loan-vs-invest'}
              onClick={() => handleSelectEmbeddedTab('loan-vs-invest')}
              className={`pill-btn ${activeTab === 'loan-vs-invest' ? 'active' : ''}`}
            >
              Loan vs Invest
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'insurance'}
              onClick={() => handleSelectEmbeddedTab('insurance')}
              className={`pill-btn ${activeTab === 'insurance' ? 'active' : ''}`}
            >
              Insurance
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'net-worth'}
              onClick={() => handleSelectEmbeddedTab('net-worth')}
              className={`pill-btn ${activeTab === 'net-worth' ? 'active' : ''}`}
            >
              Net Worth
            </button>
          </div>
        </div>

        <div className="workspace-content-pane">
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
      {/* SECTION 2: PLAN A GOAL (Tier 2 Milestone Planners) */}
      {/* ====================================================== */}
      <section className="hub-section tier-2-section">
        <div className="section-title-wrap">
          <div className="tier-pill tier-pill-secondary">Plan a Goal</div>
          <h2 className="tier-heading">Plan a Specific Goal</h2>
          <p className="tier-subtext">Detailed tools when you are ready to map out an important life milestone.</p>
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
            <span className="tool-btn-secondary">Plan Retirement →</span>
          </a>

          {/* Home Purchase Planner */}
          <a href="/tools/home-purchase" className="tool-card-secondary">
            <div className="card-top">
              <span className="tool-icon">🏡</span>
              <span className="card-badge badge-slate">Guided Roadmap</span>
            </div>
            <h3 className="tool-title">Home Purchase Planner</h3>
            <p className="tool-desc">Calculate future property cost, down payment targets, registration expenses, and EMI affordability.</p>
            <span className="tool-btn-secondary">Plan Home Purchase →</span>
          </a>

          {/* Children's Future Planner */}
          <a href="/plan/children" className="tool-card-secondary">
            <div className="card-top">
              <span className="tool-icon">🎓</span>
              <span className="card-badge badge-slate">Multi-Milestone</span>
            </div>
            <h3 className="tool-title">Children's Future Planner</h3>
            <p className="tool-desc">Map your child's higher education milestones and marriage timeline with inflation and step-up SIPs.</p>
            <span className="tool-btn-secondary">Plan Child's Goals →</span>
          </a>

          {/* SIP Growth Planner */}
          <a href="/tools/sip-growth" className="tool-card-secondary">
            <div className="card-top">
              <span className="tool-icon">🚀</span>
              <span className="card-badge badge-slate">Multi-Lump-Sum</span>
            </div>
            <h3 className="tool-title">SIP Growth Planner</h3>
            <p className="tool-desc">Model your monthly SIP, annual step-ups, and intermittent lump-sum additions over a custom horizon.</p>
            <span className="tool-btn-secondary">Plan SIP Growth →</span>
          </a>
        </div>
      </section>

      {/* ====================================================== */}
      {/* SECTION 3: COMPARE A DECISION (Tier 3 Trade-Off Tools) */}
      {/* ====================================================== */}
      <section className="hub-section tier-3-section">
        <div className="section-title-wrap">
          <div className="tier-pill tier-pill-secondary">Compare Your Choices</div>
          <h2 className="tier-heading">Compare Financial Decisions</h2>
          <p className="tier-subtext">Understand the financial trade-offs before making a major loan or investment decision.</p>
        </div>

        <div className="tools-grid-secondary">
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
            <span className="tool-btn-secondary">Compare Decision →</span>
          </button>

          {/* Loan + SIP Recovery Planner */}
          <a href="/tools/loan-sip-recovery" className="tool-card-secondary">
            <div className="card-top">
              <span className="tool-icon">⚖️</span>
              <span className="card-badge badge-slate">Wealth Recovery</span>
            </div>
            <h3 className="tool-title">Loan + SIP Recovery Planner</h3>
            <p className="tool-desc">See how investing a manageable percentage of your EMI into SIP can potentially offset loan interest or complete cost.</p>
            <span className="tool-btn-secondary">Plan Loan Offset →</span>
          </a>
        </div>
      </section>

      {/* ====================================================== */}
      {/* SECTION 4: ADVANCED PLANNING (Tier 4 Secondary Tools) */}
      {/* ====================================================== */}
      <section id="advanced" className="hub-section tier-4-section">
        <div className="section-title-wrap">
          <div className="tier-pill tier-pill-tertiary">Go Deeper</div>
          <h2 className="tier-heading">Advanced Planning Tools</h2>
          <p className="tier-subtext">Comprehensive suites for detailed scenario analysis, withdrawal simulations, and deep audits.</p>
        </div>

        <div className="tools-grid-advanced">
          {/* Home Loan Foreclosure */}
          <a href="/tools/home-loan-foreclosure" className="tool-card-advanced">
            <div className="card-top">
              <span className="tool-icon">🏠</span>
              <span className="card-badge badge-quiet">Foreclosure</span>
            </div>
            <h3 className="tool-title">Home Loan Foreclosure Planner</h3>
            <p className="tool-desc">Model parallel SIP growth alongside EMI to identify exact month when investment corpus overtakes loan balance.</p>
            <span className="tool-btn-quiet">Explore Foreclosure Plan →</span>
          </a>

          {/* SWP Longevity */}
          <a href="/tools/swp" className="tool-card-advanced">
            <div className="card-top">
              <span className="tool-icon">📉</span>
              <span className="card-badge badge-quiet">Withdrawal</span>
            </div>
            <h3 className="tool-title">SWP Longevity Calculator (Regular Withdrawal Plan)</h3>
            <p className="tool-desc">Plan regular retirement withdrawals (Systematic Withdrawal Plan) with monthly simulations, annual step-ups, and inflation protection.</p>
            <span className="tool-btn-quiet">Explore Regular Withdrawals →</span>
          </a>

          {/* Retirement Distribution */}
          <a href="/tools/retirement-distribution" className="tool-card-advanced">
            <div className="card-top">
              <span className="tool-icon">⏳</span>
              <span className="card-badge badge-quiet">Three-Bucket</span>
            </div>
            <h3 className="tool-title">Retirement Distribution Planner</h3>
            <p className="tool-desc">Structure your post-retirement nest egg across Liquidity (1-3 yrs), Safety (4-7 yrs), and Growth (8+ yrs) buckets.</p>
            <span className="tool-btn-quiet">Explore Three-Bucket Plan →</span>
          </a>

          {/* Detailed Life Insurance Analysis */}
          <a href="/tools/life-insurance" className="tool-card-advanced">
            <div className="card-top">
              <span className="tool-icon">🛡️</span>
              <span className="card-badge badge-quiet">5-Step Audit</span>
            </div>
            <h3 className="tool-title">Detailed Life Insurance Analysis</h3>
            <p className="tool-desc">In-depth 5-step protection gap audit factoring liabilities, living expenses, future milestone goals, and assets.</p>
            <span className="tool-btn-quiet">Explore Detailed Audit →</span>
          </a>

          {/* REAL Financial Statement */}
          <a href="/health-check/real-statement" className="tool-card-advanced">
            <div className="card-top">
              <span className="tool-icon">💎</span>
              <span className="card-badge badge-quiet">Diagnostic</span>
            </div>
            <h3 className="tool-title">REAL Financial Statement (Complete Money Snapshot)</h3>
            <p className="tool-desc">Audit real income, living costs, ongoing savings rate, and calculate your true net worth position.</p>
            <span className="tool-btn-quiet">Explore Financial Statement →</span>
          </a>
        </div>
      </section>

      <style>{`
        .hub-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        .hub-section {
          margin-bottom: 4rem;
        }

        .section-title-wrap {
          margin-bottom: 2rem;
          text-align: left;
        }

        .tier-pill {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          margin-bottom: 0.6rem;
        }

        .tier-pill-primary {
          background-color: #CCFBF1;
          color: #0F766E;
        }

        .tier-pill-secondary {
          background-color: #F1F5F9;
          color: #475569;
        }

        .tier-pill-tertiary {
          background-color: #E2E8F0;
          color: #334155;
        }

        .tier-heading {
          font-family: 'Outfit', sans-serif;
          font-size: 1.85rem;
          font-weight: 800;
          color: #00182A;
          margin: 0 0 0.4rem 0;
          line-height: 1.25;
        }

        .tier-subtext {
          font-size: 1rem;
          color: #475569;
          margin: 0;
          line-height: 1.5;
        }

        /* Tier 1 Grid */
        .tools-grid-tier1 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        @media (max-width: 1024px) {
          .tools-grid-tier1 {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .tools-grid-tier1 {
            grid-template-columns: 1fr;
          }
        }

        .tool-card-tier1 {
          background-color: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 16px;
          padding: 1.75rem 1.5rem;
          display: flex;
          flex-direction: column;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 15px rgba(0, 24, 42, 0.03);
          font-family: inherit;
        }

        .tool-card-tier1:hover {
          transform: translateY(-4px);
          border-color: #00AB96;
          box-shadow: 0 10px 24px rgba(0, 171, 150, 0.12);
        }

        .active-tier1-card {
          border-color: #00AB96;
          background-color: #F0FDF4;
        }

        .card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .tool-icon {
          font-size: 2rem;
          line-height: 1;
        }

        .card-badge {
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.2rem 0.55rem;
          border-radius: 6px;
        }

        .badge-teal {
          background-color: #CCFBF1;
          color: #0F766E;
        }

        .badge-slate {
          background-color: #F1F5F9;
          color: #475569;
        }

        .badge-quiet {
          background-color: #F8FAFC;
          color: #64748B;
          border: 1px solid #E2E8F0;
        }

        .tool-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.18rem;
          font-weight: 700;
          color: #00182A;
          margin: 0 0 0.5rem 0;
          line-height: 1.3;
        }

        .tool-desc {
          font-size: 0.88rem;
          color: #475569;
          line-height: 1.45;
          margin: 0 0 1.5rem 0;
          flex-grow: 1;
        }

        .tool-btn-link {
          font-size: 0.88rem;
          font-weight: 700;
          color: #00AB96;
          display: inline-flex;
          align-items: center;
          transition: color 0.2s ease;
        }

        .tool-card-tier1:hover .tool-btn-link {
          color: #008F7E;
          text-decoration: underline;
        }

        /* Workspace Stage */
        .active-workspace-wrapper {
          background: #FFFFFF;
          border: 2px solid #00AB96;
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 4.5rem;
          box-shadow: 0 14px 34px rgba(0, 171, 150, 0.08);
        }

        .workspace-header {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid #E2E8F0;
        }

        .workspace-tag {
          font-size: 0.8rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #0F766E;
        }

        .workspace-tabs-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .ws-tab-btn {
          padding: 0.6rem 1rem;
          border-radius: 10px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.88rem;
          font-weight: 700;
          background-color: #F8FAFC;
          color: #475569;
          border: 1px solid #E2E8F0;
          cursor: pointer;
          transition: all 0.2s ease;
          min-height: 40px;
        }

        .ws-tab-btn:hover {
          background-color: #F1F5F9;
          color: #00182A;
        }

        .ws-tab-btn.active {
          background-color: #00182A;
          color: #FFFFFF;
          border-color: #00182A;
        }

        /* Tier 2 & 3 Secondary Grids */
        .tools-grid-secondary {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        @media (max-width: 768px) {
          .tools-grid-secondary {
            grid-template-columns: 1fr;
          }
        }

        .tool-card-secondary {
          background-color: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 16px;
          padding: 1.75rem 1.5rem;
          display: flex;
          flex-direction: column;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(0, 24, 42, 0.02);
          font-family: inherit;
        }

        .tool-card-secondary:hover {
          transform: translateY(-3px);
          border-color: #94A3B8;
          box-shadow: 0 8px 20px rgba(0, 24, 42, 0.06);
        }

        .tool-btn-secondary {
          font-size: 0.88rem;
          font-weight: 700;
          color: #00182A;
          display: inline-flex;
          align-items: center;
        }

        .tool-card-secondary:hover .tool-btn-secondary {
          color: #00AB96;
          text-decoration: underline;
        }

        /* Tier 4 Advanced Grid */
        .tier-4-section {
          background-color: #F8FAFC;
          border: 1.5px dashed #CBD5E1;
          border-radius: 20px;
          padding: 2.5rem 2rem;
        }

        .tools-grid-advanced {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }

        @media (max-width: 1024px) {
          .tools-grid-advanced {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .tools-grid-advanced {
            grid-template-columns: 1fr;
          }
        }

        .tool-card-advanced {
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.5rem 1.25rem;
          display: flex;
          flex-direction: column;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .tool-card-advanced:hover {
          border-color: #00AB96;
          box-shadow: 0 6px 16px rgba(0, 24, 42, 0.04);
        }

        .tool-btn-quiet {
          font-size: 0.82rem;
          font-weight: 700;
          color: #64748B;
          display: inline-flex;
          align-items: center;
        }

        .tool-card-advanced:hover .tool-btn-quiet {
          color: #00AB96;
        }

        .text-left {
          text-align: left;
        }
      `}</style>
    </div>
  );
}
