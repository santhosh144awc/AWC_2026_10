import React, { useState, useId, useMemo } from 'react';
import {
  calculateRetirementDistributionPlan,
  formatIndianCurrency,
  formatLakhsCrores,
  formatPercentage,
  type RetirementDistributionInput
} from '../../utils/calculations/retirementDistributionPlanner';

type WizardStep = 1 | 2 | 3 | 'results';

export default function RetirementDistributionPlanner() {
  const baseId = useId();

  // Wizard Navigation
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);

  // Step 1: Retirement Details
  const [retirementAge, setRetirementAge] = useState<number>(60);
  const [monthlyExpense, setMonthlyExpense] = useState<number>(100000); // ₹1 Lakh/mo
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(90);

  // Step 2: Assumptions
  const [inflationRate, setInflationRate] = useState<number>(6);
  const [bucket1Return, setBucket1Return] = useState<number>(6);
  const [bucket2Return, setBucket2Return] = useState<number>(8);
  const [bucket3Return, setBucket3Return] = useState<number>(10);

  // Accordions
  const [showTimingExplainer, setShowTimingExplainer] = useState<boolean>(false);
  const [showHowItWorks, setShowHowItWorks] = useState<boolean>(false);

  // Calculate Result
  const planInput: RetirementDistributionInput = useMemo(() => ({
    retirementAge,
    monthlyRetirementExpense: monthlyExpense,
    lifeExpectancy,
    assumptions: {
      inflationRate,
      bucket1Return,
      bucket2Return,
      bucket3Return
    }
  }), [
    retirementAge,
    monthlyExpense,
    lifeExpectancy,
    inflationRate,
    bucket1Return,
    bucket2Return,
    bucket3Return
  ]);

  const result = useMemo(() => calculateRetirementDistributionPlan(planInput), [planInput]);

  // Load Trainer Deterministic Sample Scenario
  const handleLoadSampleData = () => {
    setRetirementAge(60);
    setMonthlyExpense(100000);
    setLifeExpectancy(90);
    setInflationRate(6);
    setBucket1Return(6);
    setBucket2Return(8);
    setBucket3Return(10);
    setCurrentStep('results');
  };

  // Reset to Baseline Defaults
  const handleReset = () => {
    setRetirementAge(60);
    setMonthlyExpense(75000);
    setLifeExpectancy(85);
    setInflationRate(6);
    setBucket1Return(6);
    setBucket2Return(8);
    setBucket3Return(10);
    setCurrentStep(1);
  };

  // WhatsApp Prepopulated Deep Link
  const generateWhatsAppUrl = () => {
    const total = formatLakhsCrores(result.totalInvestmentRequiredToday);
    const b1 = formatLakhsCrores(result.bucket1.investmentRequiredToday);
    const b2 = formatLakhsCrores(result.bucket2.investmentRequiredToday);
    const b3 = formatLakhsCrores(result.bucket3.investmentRequiredToday);
    const monthly = formatIndianCurrency(monthlyExpense);

    const message = `Hi Santhosh, I used the Retirement Distribution Planner on Ant Wealth Creation.
Target Retirement Age: ${retirementAge} | Life Expectancy: ${lifeExpectancy} (${result.distributionYears} yrs)
Starting Monthly Expense: ${monthly}/month
Estimated Total Investment Required Today: ${total}

3-Bucket Allocation:
• Bucket 1 (Liquidity): ${b1} (${result.bucket1.allocationPercent}%)
• Bucket 2 (Safety): ${b2} (${result.bucket2.allocationPercent}%)
• Bucket 3 (Wealth Creation): ${b3} (${result.bucket3.allocationPercent}%)

I would like to discuss structuring my post-retirement income strategy.`;

    return `https://wa.me/918087971566?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="dist-planner-wrapper">
      {/* Top Action Bar: Sample Scenario & Reset */}
      <div className="calc-top-action-bar">
        <div className="action-tagline">
          <span className="live-pulse"></span>
          <span>Three-Bucket Retirement Income Strategy</span>
        </div>
        <div className="action-btn-group">
          <button
            type="button"
            onClick={handleLoadSampleData}
            className="btn-sample-preset"
            title="Load Age 60 to 90, ₹1 Lakh/mo sample scenario"
          >
            📊 Try Sample Scenario
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="btn-reset-preset"
            title="Reset calculator to defaults"
          >
            ↺ Reset
          </button>
        </div>
      </div>

      {/* Stepper Navigation (3 Steps + Results) */}
      <nav className="stepper-nav" aria-label="Calculator Steps">
        <ol className="stepper-list">
          {[
            { step: 1, title: 'Retirement Details', icon: '⏳' },
            { step: 2, title: 'Assumptions', icon: '⚖️' },
            { step: 3, title: 'Three Buckets', icon: '🛡️' },
          ].map((item) => {
            const isCompleted = typeof currentStep === 'number' && currentStep > item.step;
            const isActive = currentStep === item.step;
            return (
              <li key={item.step} className="stepper-item">
                <button
                  type="button"
                  onClick={() => setCurrentStep(item.step as WizardStep)}
                  className={`stepper-btn ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                  aria-current={isActive ? 'step' : undefined}
                >
                  <span className="step-num">{isCompleted ? '✓' : item.step}</span>
                  <span className="step-label">
                    <span className="step-icon-sm">{item.icon}</span>
                    {item.title}
                  </span>
                </button>
              </li>
            );
          })}
          <li className="stepper-item">
            <button
              type="button"
              onClick={() => setCurrentStep('results')}
              className={`stepper-btn results-stepper-btn ${currentStep === 'results' ? 'active' : ''}`}
              aria-current={currentStep === 'results' ? 'step' : undefined}
            >
              <span className="step-num">★</span>
              <span className="step-label">Results</span>
            </button>
          </li>
        </ol>
      </nav>

      {/* STEP 1: RETIREMENT DETAILS */}
      {currentStep === 1 && (
        <section className="step-card" aria-labelledby="step1-title">
          <div className="step-header">
            <div className="step-badge">Step 1 of 3</div>
            <h2 id="step1-title" className="step-heading">
              Your Retirement Details
            </h2>
            <p className="step-description">
              Enter your planned retirement age, target monthly spending at retirement, and life expectancy to establish your distribution horizon.
            </p>
          </div>

          <div className="inputs-grid">
            <div className="input-group">
              <label htmlFor={`${baseId}-retAge`} className="input-label">
                Planned Retirement Age (Years) *
              </label>
              <div className="slider-group">
                <div className="slider-value-display">
                  <span>{retirementAge} Years Old</span>
                </div>
                <input
                  id={`${baseId}-retAge`}
                  type="range"
                  min="45"
                  max="75"
                  step="1"
                  value={retirementAge}
                  onChange={(e) => {
                    const newAge = Number(e.target.value);
                    setRetirementAge(newAge);
                    if (lifeExpectancy <= newAge) setLifeExpectancy(newAge + 10);
                  }}
                  className="range-slider"
                />
                <div className="slider-ticks">
                  <span>45 yrs</span>
                  <span>55 yrs</span>
                  <span>60 yrs (Standard)</span>
                  <span>75 yrs</span>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-lifeExp`} className="input-label">
                Life Expectancy (Years) *
              </label>
              <div className="slider-group">
                <div className="slider-value-display">
                  <span>{lifeExpectancy} Years Old ({result.distributionYears} yrs in retirement)</span>
                </div>
                <input
                  id={`${baseId}-lifeExp`}
                  type="range"
                  min={retirementAge + 1}
                  max="105"
                  step="1"
                  value={lifeExpectancy}
                  onChange={(e) => setLifeExpectancy(Number(e.target.value))}
                  className="range-slider"
                />
                <div className="slider-ticks">
                  <span>{retirementAge + 1} yrs</span>
                  <span>80 yrs</span>
                  <span>90 yrs (Recommended)</span>
                  <span>105 yrs</span>
                </div>
              </div>
              <span className="input-helper">Planning up to 85–90 helps ensure your retirement funds outlast you</span>
            </div>

            <div className="input-group full-width-group">
              <label htmlFor={`${baseId}-monthlyExp`} className="input-label">
                Monthly Living Expenses at Start of Retirement (₹) *
              </label>
              <div className="currency-input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  id={`${baseId}-monthlyExp`}
                  type="number"
                  min="0"
                  step="10000"
                  value={monthlyExpense || ''}
                  onChange={(e) => setMonthlyExpense(Math.max(0, Number(e.target.value)))}
                  placeholder="100000"
                  className="currency-field"
                />
                <span className="unit-tag">{formatLakhsCrores(monthlyExpense)}/mo</span>
              </div>
              <span className="input-helper">How much would you like to spend each month when you first retire?</span>
            </div>
          </div>

          {/* Horizon Preview Summary Box */}
          <div className="horizon-summary-card">
            <div className="horizon-metrics-row">
              <div className="h-col">
                <span className="h-lbl">Distribution Horizon</span>
                <span className="h-val text-navy">{result.distributionYears} Years</span>
                <span className="h-sub">Age {retirementAge} to {lifeExpectancy}</span>
              </div>
              <div className="h-divider"></div>
              <div className="h-col">
                <span className="h-lbl">Starting Annual Expense</span>
                <span className="h-val text-teal">{formatLakhsCrores(result.initialAnnualExpense)}/yr</span>
                <span className="h-sub">{formatIndianCurrency(result.initialAnnualExpense)} per year</span>
              </div>
              <div className="h-divider"></div>
              <div className="h-col">
                <span className="h-lbl">Monthly Equivalent</span>
                <span className="h-val text-gold">{formatIndianCurrency(monthlyExpense)}/mo</span>
                <span className="h-sub">Beginning of each month</span>
              </div>
            </div>
          </div>

          <div className="step-actions">
            <div></div>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="btn-continue"
            >
              Continue to Return Assumptions →
            </button>
          </div>
        </section>
      )}

      {/* STEP 2: ASSUMPTIONS */}
      {currentStep === 2 && (
        <section className="step-card" aria-labelledby="step2-title">
          <div className="step-header">
            <div className="step-badge">Step 2 of 3</div>
            <h2 id="step2-title" className="step-heading">
              Return & Inflation Assumptions
            </h2>
            <p className="step-description">
              Set your expected inflation rate and post-tax returns across the three time horizons. Returns are illustrative and used to estimate capital preservation.
            </p>
          </div>

          <div className="inputs-grid">
            <div className="input-group">
              <label htmlFor={`${baseId}-inf`} className="input-label">
                Inflation Rate (% p.a.)
              </label>
              <div className="slider-group">
                <div className="slider-value-display">
                  <span>{inflationRate}% p.a.</span>
                </div>
                <input
                  id={`${baseId}-inf`}
                  type="range"
                  min="4"
                  max="10"
                  step="0.5"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                  className="range-slider"
                />
                <div className="slider-ticks">
                  <span>4%</span>
                  <span>6% (Standard)</span>
                  <span>8%</span>
                  <span>10%</span>
                </div>
              </div>
              <span className="input-helper">Historical long-term Indian CPI inflation typically ranges 5%–7%</span>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-b1Ret`} className="input-label">
                Bucket 1 Return (Liquidity: 1–3 Yrs) — Post-Tax %
              </label>
              <div className="slider-group">
                <div className="slider-value-display">
                  <span>{bucket1Return}% p.a. (Real: {formatPercentage(result.bucket1.realReturn)})</span>
                </div>
                <input
                  id={`${baseId}-b1Ret`}
                  type="range"
                  min="4"
                  max="8"
                  step="0.5"
                  value={bucket1Return}
                  onChange={(e) => setBucket1Return(Number(e.target.value))}
                  className="range-slider"
                />
                <div className="slider-ticks">
                  <span>4% (Savings/FD)</span>
                  <span>6% (Liquid/Arbitrage)</span>
                  <span>8%</span>
                </div>
              </div>
              <span className="input-helper">Focused on capital protection and immediate cash flow</span>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-b2Ret`} className="input-label">
                Bucket 2 Return (Safety: 4–7 Yrs) — Post-Tax %
              </label>
              <div className="slider-group">
                <div className="slider-value-display">
                  <span>{bucket2Return}% p.a. (Real: {formatPercentage(result.bucket2.realReturn)})</span>
                </div>
                <input
                  id={`${baseId}-b2Ret`}
                  type="range"
                  min="6"
                  max="10"
                  step="0.5"
                  value={bucket2Return}
                  onChange={(e) => setBucket2Return(Number(e.target.value))}
                  className="range-slider"
                />
                <div className="slider-ticks">
                  <span>6%</span>
                  <span>8% (Hybrid/Conservative)</span>
                  <span>10%</span>
                </div>
              </div>
              <span className="input-helper">Focused on medium-term stability with modest real growth</span>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-b3Ret`} className="input-label">
                Bucket 3 Return (Wealth Creation: 8+ Yrs) — Post-Tax %
              </label>
              <div className="slider-group">
                <div className="slider-value-display">
                  <span>{bucket3Return}% p.a. (Real: {formatPercentage(result.bucket3.realReturn)})</span>
                </div>
                <input
                  id={`${baseId}-b3Ret`}
                  type="range"
                  min="8"
                  max="14"
                  step="0.5"
                  value={bucket3Return}
                  onChange={(e) => setBucket3Return(Number(e.target.value))}
                  className="range-slider"
                />
                <div className="slider-ticks">
                  <span>8%</span>
                  <span>10% (Diversified Equity)</span>
                  <span>14%</span>
                </div>
              </div>
              <span className="input-helper">Has 7+ years to compound before being tapped for income</span>
            </div>
          </div>

          <div className="step-actions">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="btn-back"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="btn-continue"
            >
              Continue to Three Buckets Overview →
            </button>
          </div>
        </section>
      )}

      {/* STEP 3: THREE-BUCKET STRATEGY */}
      {currentStep === 3 && (
        <section className="step-card" aria-labelledby="step3-title">
          <div className="step-header">
            <div className="step-badge">Step 3 of 3</div>
            <h2 id="step3-title" className="step-heading">
              How Your Retirement Horizon is Divided
            </h2>
            <p className="step-description">
              By segmenting your {result.distributionYears}-year retirement into 3 strategic time horizons, you protect immediate income while allowing long-term wealth to grow undisturbed.
            </p>
          </div>

          <div className="bucket-explainer-grid">
            <div className="bucket-exp-card b1-card">
              <div className="b-badge b1-badge">Bucket 1 • Liquidity</div>
              <h3 className="b-title">Immediate Cash Flow (Years 1–{result.bucket1.durationYears})</h3>
              <p className="b-desc">
                Holds {result.bucket1.durationYears} years of living expenses in liquid & ultra-safe instruments so you never have to sell investments during market downturns.
              </p>
              <div className="b-stats">
                <span>Duration: <strong>{result.bucket1.durationYears} Years</strong></span>
                <span>Expected Return: <strong>{bucket1Return}% p.a.</strong></span>
              </div>
            </div>

            <div className="bucket-exp-card b2-card">
              <div className="b-badge b2-badge">Bucket 2 • Safety</div>
              <h3 className="b-title">Medium-Term Bridge (Years {result.bucket2.startYearOffset + 1}–{result.bucket2.startYearOffset + result.bucket2.durationYears})</h3>
              <p className="b-desc">
                Invested in conservative and hybrid assets to generate predictable returns, compounding for {result.bucket1.durationYears} years before replenishing Bucket 1.
              </p>
              <div className="b-stats">
                <span>Duration: <strong>{result.bucket2.durationYears} Years</strong></span>
                <span>Expected Return: <strong>{bucket2Return}% p.a.</strong></span>
              </div>
            </div>

            <div className="bucket-exp-card b3-card">
              <div className="b-badge b3-badge">Bucket 3 • Wealth Creation</div>
              <h3 className="b-title">Long-Term Growth (Years {result.bucket3.startYearOffset + 1}+)</h3>
              <p className="b-desc">
                Has a long 7+ year horizon to beat inflation through diversified equities, refilling Bucket 2 as retirement progresses.
              </p>
              <div className="b-stats">
                <span>Duration: <strong>{result.bucket3.durationYears} Years</strong></span>
                <span>Expected Return: <strong>{bucket3Return}% p.a.</strong></span>
              </div>
            </div>
          </div>

          <div className="step-actions">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="btn-back"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep('results')}
              className="btn-view-results"
            >
              See Your Distribution Plan ★
            </button>
          </div>
        </section>
      )}

      {/* RESULTS DASHBOARD */}
      {currentStep === 'results' && (
        <div className="results-container" aria-live="polite">
          {/* Results Hero Card */}
          <div className="results-hero-card">
            <div className="hero-eyebrow">YOUR RETIREMENT DISTRIBUTION ROADMAP</div>
            <h2 className="hero-heading">Estimated Retirement Investment Required Today</h2>

            <div className="primary-result-box">
              <span className="result-tag">TOTAL CAPITAL REQUIRED AT RETIREMENT</span>
              <div className="result-main-number">
                {formatLakhsCrores(result.totalInvestmentRequiredToday)}
              </div>
              <div className="result-exact-number">
                Exact Required Capital: {formatIndianCurrency(result.totalInvestmentRequiredToday)}
              </div>
            </div>

            <p className="hero-disclaimer-note">
              To support an initial monthly retirement expense of {formatIndianCurrency(monthlyExpense)} ({formatLakhsCrores(result.initialAnnualExpense)}/year) growing at {inflationRate}% inflation over {result.distributionYears} years (age {retirementAge} to {lifeExpectancy}).
            </p>
          </div>

          {/* Horizontal Allocation Bar */}
          <div className="allocation-bar-card">
            <h3 className="section-subtitle">Recommended Three-Bucket Allocation</h3>
            
            <div className="visual-allocation-bar">
              {result.bucket1.allocationPercent > 0 && (
                <div
                  className="bar-segment b1-segment"
                  style={{ width: `${result.bucket1.allocationPercent}%` }}
                  title={`Bucket 1 (Liquidity): ${result.bucket1.allocationPercent}%`}
                >
                  <span>{result.bucket1.allocationPercent}%</span>
                </div>
              )}
              {result.bucket2.allocationPercent > 0 && (
                <div
                  className="bar-segment b2-segment"
                  style={{ width: `${result.bucket2.allocationPercent}%` }}
                  title={`Bucket 2 (Safety): ${result.bucket2.allocationPercent}%`}
                >
                  <span>{result.bucket2.allocationPercent}%</span>
                </div>
              )}
              {result.bucket3.allocationPercent > 0 && (
                <div
                  className="bar-segment b3-segment"
                  style={{ width: `${result.bucket3.allocationPercent}%` }}
                  title={`Bucket 3 (Wealth Creation): ${result.bucket3.allocationPercent}%`}
                >
                  <span>{result.bucket3.allocationPercent}%</span>
                </div>
              )}
            </div>

            <div className="allocation-legend-row">
              <div className="legend-item">
                <span className="legend-dot b1-dot"></span>
                <span className="legend-name">Bucket 1 (Liquidity):</span>
                <strong className="legend-val">{formatLakhsCrores(result.bucket1.investmentRequiredToday)} ({result.bucket1.allocationPercent}%)</strong>
              </div>
              <div className="legend-item">
                <span className="legend-dot b2-dot"></span>
                <span className="legend-name">Bucket 2 (Safety):</span>
                <strong className="legend-val">{formatLakhsCrores(result.bucket2.investmentRequiredToday)} ({result.bucket2.allocationPercent}%)</strong>
              </div>
              <div className="legend-item">
                <span className="legend-dot b3-dot"></span>
                <span className="legend-name">Bucket 3 (Wealth Creation):</span>
                <strong className="legend-val">{formatLakhsCrores(result.bucket3.investmentRequiredToday)} ({result.bucket3.allocationPercent}%)</strong>
              </div>
            </div>
          </div>

          {/* Three-Bucket Cards Grid */}
          <div className="bucket-results-grid">
            {/* Bucket 1 Card */}
            <div className="bucket-res-card b1-res-card">
              <div className="b-card-top">
                <span className="b-card-badge b1-badge">Bucket 1 • Liquidity</span>
                <span className="b-card-alloc">{result.bucket1.allocationPercent}%</span>
              </div>
              <div className="b-card-amount">{formatLakhsCrores(result.bucket1.investmentRequiredToday)}</div>
              <div className="b-card-exact">{formatIndianCurrency(result.bucket1.investmentRequiredToday)} required today</div>
              
              <ul className="b-card-metrics-list">
                <li><span>Duration Covered:</span> <strong>{result.bucket1.yearsRange} ({result.bucket1.durationYears} yrs)</strong></li>
                <li><span>Starting Annual Outflow:</span> <strong>{formatLakhsCrores(result.bucket1.startingAnnualExpense)}/yr</strong></li>
                <li><span>Monthly Equivalent:</span> <strong>{formatIndianCurrency(result.bucket1.startingMonthlyExpense)}/mo</strong></li>
                <li><span>Expected Return:</span> <strong>{result.bucket1.postTaxReturn}% p.a.</strong></li>
                <li><span>Real Return (Fisher):</span> <strong>{formatPercentage(result.bucket1.realReturn)}</strong></li>
              </ul>
            </div>

            {/* Bucket 2 Card */}
            <div className="bucket-res-card b2-res-card">
              <div className="b-card-top">
                <span className="b-card-badge b2-badge">Bucket 2 • Safety</span>
                <span className="b-card-alloc">{result.bucket2.allocationPercent}%</span>
              </div>
              <div className="b-card-amount">{formatLakhsCrores(result.bucket2.investmentRequiredToday)}</div>
              <div className="b-card-exact">{formatIndianCurrency(result.bucket2.investmentRequiredToday)} required today</div>
              
              <ul className="b-card-metrics-list">
                <li><span>Duration Covered:</span> <strong>{result.bucket2.yearsRange} ({result.bucket2.durationYears} yrs)</strong></li>
                <li><span>Starting Annual Outflow:</span> <strong>{formatLakhsCrores(result.bucket2.startingAnnualExpense)}/yr</strong></li>
                <li><span>Monthly Equivalent:</span> <strong>{formatIndianCurrency(result.bucket2.startingMonthlyExpense)}/mo</strong></li>
                <li><span>Expected Return:</span> <strong>{result.bucket2.postTaxReturn}% p.a.</strong></li>
                <li><span>Corpus at Start (Yr {result.bucket2.startYearOffset}):</span> <strong>{formatLakhsCrores(result.bucket2.corpusAtBucketStart)}</strong></li>
              </ul>
            </div>

            {/* Bucket 3 Card */}
            <div className="bucket-res-card b3-res-card">
              <div className="b-card-top">
                <span className="b-card-badge b3-badge">Bucket 3 • Wealth Creation</span>
                <span className="b-card-alloc">{result.bucket3.allocationPercent}%</span>
              </div>
              <div className="b-card-amount">{formatLakhsCrores(result.bucket3.investmentRequiredToday)}</div>
              <div className="b-card-exact">{formatIndianCurrency(result.bucket3.investmentRequiredToday)} required today</div>
              
              <ul className="b-card-metrics-list">
                <li><span>Duration Covered:</span> <strong>{result.bucket3.yearsRange}</strong></li>
                <li><span>Starting Annual Outflow:</span> <strong>{formatLakhsCrores(result.bucket3.startingAnnualExpense)}/yr</strong></li>
                <li><span>Monthly Equivalent:</span> <strong>{formatIndianCurrency(result.bucket3.startingMonthlyExpense)}/mo</strong></li>
                <li><span>Expected Return:</span> <strong>{result.bucket3.postTaxReturn}% p.a.</strong></li>
                <li><span>Corpus at Start (Yr {result.bucket3.startYearOffset}):</span> <strong>{formatLakhsCrores(result.bucket3.corpusAtBucketStart)}</strong></li>
              </ul>
            </div>
          </div>

          {/* Capital Flow Story */}
          <div className="flow-story-card">
            <h3 className="section-subtitle">Retirement Decumulation Capital Flow</h3>
            <div className="flow-steps-track">
              <div className="flow-step">
                <span className="flow-step-lbl">Today's Capital</span>
                <span className="flow-step-val">{formatLakhsCrores(result.totalInvestmentRequiredToday)}</span>
                <span className="flow-step-sub">Structured into 3 buckets</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <span className="flow-step-lbl">Bucket 1 (Liquidity)</span>
                <span className="flow-step-val text-teal">{formatLakhsCrores(result.bucket1.investmentRequiredToday)}</span>
                <span className="flow-step-sub">Funds Years 1–3</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <span className="flow-step-lbl">Bucket 2 (Safety)</span>
                <span className="flow-step-val text-navy">{formatLakhsCrores(result.bucket2.investmentRequiredToday)}</span>
                <span className="flow-step-sub">Refills at Year 4</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <span className="flow-step-lbl">Bucket 3 (Growth)</span>
                <span className="flow-step-val text-gold">{formatLakhsCrores(result.bucket3.investmentRequiredToday)}</span>
                <span className="flow-step-sub">Compounds 7 yrs</span>
              </div>
              <div className="flow-arrow">=</div>
              <div className="flow-step highlight-flow-step">
                <span className="flow-step-lbl">Retirement Income</span>
                <span className="flow-step-val text-teal">{formatIndianCurrency(monthlyExpense)}/mo</span>
                <span className="flow-step-sub">+6% inflation indexed</span>
              </div>
            </div>
          </div>

          {/* Weighted Rate Metrics Box */}
          <div className="rate-summary-bar">
            <div className="r-metric">
              <span className="r-lbl">Weighted Average Post-Tax Return</span>
              <span className="r-val text-navy">{formatPercentage(result.weightedAveragePostTaxReturn)}</span>
              <span className="r-sub">Across all 3 buckets</span>
            </div>
            <div className="r-divider"></div>
            <div className="r-metric">
              <span className="r-lbl">Assumed Inflation Rate</span>
              <span className="r-val text-slate">{inflationRate}% p.a.</span>
              <span className="r-sub">Annual lifestyle inflation</span>
            </div>
            <div className="r-divider"></div>
            <div className="r-metric">
              <span className="r-lbl">Approximate Weighted Real Return</span>
              <span className="r-val text-teal">{formatPercentage(result.overallRealReturn)}</span>
              <span className="r-sub">Compound Fisher return above inflation</span>
            </div>
          </div>

          {/* Key Factual Insight */}
          <div className="key-insight-card">
            <span className="insight-icon">💡</span>
            <div className="insight-body">
              <span className="insight-title">Key Factual Insight</span>
              <p className="insight-text">{result.keyInsight}</p>
            </div>
          </div>

          {/* Accordion 1: Why does timing matter? */}
          <div className="accordion-card">
            <button
              type="button"
              onClick={() => setShowTimingExplainer(!showTimingExplainer)}
              className="accordion-toggle-btn"
              aria-expanded={showTimingExplainer}
            >
              <span className="toggle-left">
                <span className="toggle-icon">⏳</span>
                <strong>Why does timing matter in retirement decumulation?</strong>
              </span>
              <span className="toggle-chevron">{showTimingExplainer ? '▲' : '▼'}</span>
            </button>

            {showTimingExplainer && (
              <div className="accordion-content">
                <p>
                  In retirement, living expenses are required at the <strong>beginning of each period</strong> (Annuity-Due), rather than at the end of the year. This requires a slightly higher initial capital reserve compared to an ordinary end-of-period withdrawal model.
                </p>
                <p>
                  More importantly, time horizon dictates risk tolerance:
                </p>
                <ul>
                  <li><strong>Years 1–3:</strong> Cannot take equity risk because funds must be drawn immediately for monthly living needs.</li>
                  <li><strong>Years 4–7:</strong> Have a 3-year gestation period to earn moderate hybrid returns before being converted to liquidity.</li>
                  <li><strong>Years 8+:</strong> Have 7 to 30 years to withstand market cycles, enabling higher equity participation that generates real purchasing power.</li>
                </ul>
              </div>
            )}
          </div>

          {/* Accordion 2: How was this calculated? */}
          <div className="accordion-card">
            <button
              type="button"
              onClick={() => setShowHowItWorks(!showHowItWorks)}
              className="accordion-toggle-btn"
              aria-expanded={showHowItWorks}
            >
              <span className="toggle-left">
                <span className="toggle-icon">📐</span>
                <strong>How was this calculated?</strong>
              </span>
              <span className="toggle-chevron">{showHowItWorks ? '▲' : '▼'}</span>
            </button>

            {showHowItWorks && (
              <div className="accordion-content">
                <div className="formula-step-block">
                  <h4>1. Distribution Horizon & Bucket Partitioning</h4>
                  <ul>
                    <li><strong>Retirement Horizon:</strong> {lifeExpectancy} - {retirementAge} = <strong>{result.distributionYears} Years</strong></li>
                    <li><strong>Bucket 1 (Liquidity):</strong> {result.bucket1.durationYears} years (Years 1–{result.bucket1.durationYears})</li>
                    <li><strong>Bucket 2 (Safety):</strong> {result.bucket2.durationYears} years (Years {result.bucket2.startYearOffset + 1}–{result.bucket2.startYearOffset + result.bucket2.durationYears})</li>
                    <li><strong>Bucket 3 (Wealth Creation):</strong> {result.bucket3.durationYears} years (Years {result.bucket3.startYearOffset + 1}+)</li>
                  </ul>
                </div>

                <div className="formula-step-block">
                  <h4>2. Inflation-Adjusted Starting Expenses & Real Rates</h4>
                  <ul>
                    <li><strong>Bucket 1 Starting Expense:</strong> ₹{result.initialAnnualExpense.toLocaleString('en-IN')}/yr | Real Return: {formatPercentage(result.bucket1.realReturn)}</li>
                    <li><strong>Bucket 2 Starting Expense (Yr {result.bucket2.startYearOffset}):</strong> ₹{result.initialAnnualExpense.toLocaleString('en-IN')} × (1 + {inflationRate}%)^{result.bucket1.durationYears} = <strong>₹{result.bucket2.startingAnnualExpense.toLocaleString('en-IN')}/yr</strong> | Real Return: {formatPercentage(result.bucket2.realReturn)}</li>
                    <li><strong>Bucket 3 Starting Expense (Yr {result.bucket3.startYearOffset}):</strong> ₹{result.initialAnnualExpense.toLocaleString('en-IN')} × (1 + {inflationRate}%)^{result.bucket3.startYearOffset} = <strong>₹{result.bucket3.startingAnnualExpense.toLocaleString('en-IN')}/yr</strong> | Real Return: {formatPercentage(result.bucket3.realReturn)}</li>
                  </ul>
                </div>

                <div className="formula-step-block">
                  <h4>3. Annuity-Due Capitalization & Present Value Discounting</h4>
                  <ul>
                    <li><strong>Bucket 1 Investment Today:</strong> <strong>₹{result.bucket1.investmentRequiredToday.toLocaleString('en-IN')}</strong></li>
                    <li><strong>Bucket 2 Investment Today:</strong> ₹{result.bucket2.corpusAtBucketStart.toLocaleString('en-IN')} / (1 + {bucket2Return}%)^{result.bucket1.durationYears} = <strong>₹{result.bucket2.investmentRequiredToday.toLocaleString('en-IN')}</strong></li>
                    <li><strong>Bucket 3 Investment Today:</strong> ₹{result.bucket3.corpusAtBucketStart.toLocaleString('en-IN')} / (1 + {bucket3Return}%)^{result.bucket3.startYearOffset} = <strong>₹{result.bucket3.investmentRequiredToday.toLocaleString('en-IN')}</strong></li>
                    <li><strong>Total Investment Required Today:</strong> ₹{result.bucket1.investmentRequiredToday.toLocaleString('en-IN')} + ₹{result.bucket2.investmentRequiredToday.toLocaleString('en-IN')} + ₹{result.bucket3.investmentRequiredToday.toLocaleString('en-IN')} = <strong>₹{result.totalInvestmentRequiredToday.toLocaleString('en-IN')}</strong></li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Voluntary WhatsApp Consultation CTA */}
          <div className="results-cta-card">
            <h3 className="cta-heading">Want to discuss your retirement distribution strategy?</h3>
            <p className="cta-sub">
              We can help you review your asset allocation, structure your bucket boundaries, and set up a disciplined monthly cash-flow mechanism.
            </p>
            <div className="cta-btn-row">
              <a
                href={generateWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp-cta"
              >
                <span>💬 Discuss My Plan on WhatsApp</span>
              </a>
              <a href="/contact" className="btn-contact-secondary">
                Book a Free Consultation
              </a>
            </div>
            <p className="cta-disclaimer">
              100% Voluntary • Zero forced lead capture • AMFI Registered Mutual Fund Distributor (ARN: 266896)
            </p>
          </div>

          {/* Navigation Action Buttons */}
          <div className="step-actions mt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="btn-back"
            >
              ← Edit Retirement Details (Step 1)
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="btn-edit-plan"
            >
              ⚙️ Modify Return Assumptions (Step 2)
            </button>
          </div>
        </div>
      )}

      {/* Styled JSX (Vanilla CSS) */}
      <style>{`
        .dist-planner-wrapper {
          width: 100%;
          max-width: 960px;
          margin: 0 auto;
          font-family: 'Inter', sans-serif;
          color: #00182A;
        }

        .calc-top-action-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 0.75rem 1.25rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
        }

        .action-tagline {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: #00AB96;
        }

        .live-pulse {
          width: 8px;
          height: 8px;
          background-color: #00AB96;
          border-radius: 50%;
          box-shadow: 0 0 0 rgba(0, 171, 150, 0.4);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(0, 171, 150, 0.4); }
          70% { box-shadow: 0 0 0 8px rgba(0, 171, 150, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0, 171, 150, 0); }
        }

        .action-btn-group {
          display: flex;
          gap: 0.5rem;
        }

        .btn-sample-preset, .btn-reset-preset {
          background: #F8FAFC;
          border: 1px solid #CBD5E1;
          padding: 0.4rem 0.75rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: #334155;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-sample-preset:hover {
          background: #00AB96;
          color: #FFFFFF;
          border-color: #00AB96;
        }

        .btn-reset-preset:hover {
          background: #F1F5F9;
          color: #0F172A;
        }

        /* Stepper Navigation */
        .stepper-nav {
          margin-bottom: 2rem;
        }

        .stepper-list {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .stepper-btn {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
          padding: 0.75rem 0.5rem;
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .stepper-btn.active {
          background: #00182A;
          border-color: #00182A;
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(0, 24, 42, 0.15);
        }

        .stepper-btn.active .step-num {
          background: #00AB96;
          color: #FFFFFF;
        }

        .stepper-btn.results-stepper-btn.active {
          background: #00AB96;
          border-color: #00AB96;
          color: #FFFFFF;
          box-shadow: 0 4px 14px rgba(0, 171, 150, 0.3);
        }

        .stepper-btn.results-stepper-btn.active .step-num {
          background: #FFFFFF;
          color: #00AB96;
        }

        .stepper-btn.completed {
          border-color: #00AB96;
        }

        .stepper-btn.completed .step-num {
          background: #E6F7F5;
          color: #00AB96;
        }

        .step-num {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #F1F5F9;
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748B;
        }

        .step-label {
          font-size: 0.8rem;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .step-icon-sm {
          margin-right: 0.2rem;
        }

        /* Step Card */
        .step-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 2.25rem;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.04);
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .step-badge {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background: #E6F7F5;
          color: #00AB96;
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
          margin-bottom: 0.75rem;
        }

        .step-heading {
          font-family: 'Outfit', sans-serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: #00182A;
          margin: 0 0 0.5rem 0;
        }

        .step-description {
          font-size: 0.95rem;
          color: #475569;
          line-height: 1.5;
          margin: 0 0 1.75rem 0;
        }

        /* Inputs Grid */
        .inputs-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
          margin-bottom: 1.75rem;
        }

        .full-width-group {
          grid-column: 1 / -1;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .input-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1E293B;
        }

        .currency-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .currency-symbol {
          position: absolute;
          left: 12px;
          font-weight: 600;
          color: #64748B;
          font-size: 1rem;
          pointer-events: none;
        }

        .unit-tag {
          position: absolute;
          right: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #64748B;
        }

        .currency-field {
          width: 100%;
          padding: 0.75rem 0.75rem 0.75rem 2rem;
          font-size: 1.05rem;
          font-weight: 600;
          color: #00182A;
          background: #F8FAFC;
          border: 1.5px solid #CBD5E1;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .currency-field:focus {
          outline: none;
          background: #FFFFFF;
          border-color: #00AB96;
          box-shadow: 0 0 0 3px rgba(0, 171, 150, 0.15);
        }

        .input-helper {
          font-size: 0.75rem;
          color: #64748B;
          font-weight: 500;
        }

        /* Sliders */
        .slider-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .slider-value-display {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          font-weight: 700;
          color: #00AB96;
        }

        .range-slider {
          width: 100%;
          accent-color: #00AB96;
          cursor: pointer;
        }

        .slider-ticks {
          display: flex;
          justify-content: space-between;
          font-size: 0.7rem;
          color: #94A3B8;
        }

        /* Horizon Summary Card */
        .horizon-summary-card {
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
          margin-bottom: 1.75rem;
        }

        .horizon-metrics-row {
          display: flex;
          align-items: center;
          justify-content: space-around;
        }

        .h-col {
          display: flex;
          flex-direction: column;
          text-align: center;
        }

        .h-divider {
          width: 1px;
          height: 40px;
          background: #CBD5E1;
        }

        .h-lbl {
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748B;
          margin-bottom: 0.25rem;
        }

        .h-val {
          font-family: 'Outfit', sans-serif;
          font-size: 1.35rem;
          font-weight: 800;
        }

        .h-sub {
          font-size: 0.7rem;
          color: #64748B;
          margin-top: 0.15rem;
        }

        /* Step 3 Bucket Explainer Grid */
        .bucket-explainer-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          margin-bottom: 1.75rem;
        }

        .bucket-exp-card {
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 14px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
        }

        .b1-card { border-top: 4px solid #00AB96; }
        .b2-card { border-top: 4px solid #3B82F6; }
        .b3-card { border-top: 4px solid #F59E0B; }

        .b-badge {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: 0.2rem 0.55rem;
          border-radius: 4px;
          margin-bottom: 0.5rem;
          width: fit-content;
        }

        .b1-badge { background: #E6F7F5; color: #00AB96; }
        .b2-badge { background: #EFF6FF; color: #3B82F6; }
        .b3-badge { background: #FEF3C7; color: #D97706; }

        .b-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #00182A;
          margin: 0 0 0.5rem 0;
        }

        .b-desc {
          font-size: 0.825rem;
          color: #475569;
          line-height: 1.5;
          margin: 0 0 1.25rem 0;
          flex-grow: 1;
        }

        .b-stats {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.775rem;
          color: #64748B;
          border-top: 1px solid #E2E8F0;
          padding-top: 0.75rem;
        }

        /* Results Styles */
        .results-container {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
          animation: fadeIn 0.35s ease-out;
        }

        .results-hero-card {
          background: linear-gradient(135deg, #00182A 0%, #002B49 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 2.75rem 2rem 2.25rem;
          color: #FFFFFF;
          text-align: center;
          box-shadow: 0 20px 40px -15px rgba(0, 24, 42, 0.35);
        }

        .hero-eyebrow {
          font-size: 0.85rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #00AB96;
          margin-bottom: 0.6rem;
          text-transform: uppercase;
        }

        .hero-heading {
          font-family: 'Outfit', sans-serif;
          font-size: 2.1rem;
          font-weight: 800;
          color: #FFFFFF !important;
          margin: 0 0 1.75rem 0;
          line-height: 1.25;
        }

        .primary-result-box {
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 16px;
          padding: 2rem 1.5rem;
          max-width: 520px;
          margin: 0 auto 1.5rem auto;
          box-shadow: 0 12px 32px -8px rgba(0, 0, 0, 0.18);
          text-align: center;
        }

        .result-tag {
          display: block;
          font-size: 0.825rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #00AB96;
          margin-bottom: 0.35rem;
        }

        .result-main-number {
          font-family: 'Outfit', sans-serif;
          font-size: 3.25rem;
          font-weight: 900;
          color: #00182A;
          margin: 0.25rem 0 0.5rem 0;
          line-height: 1.1;
        }

        .result-exact-number {
          font-size: 0.95rem;
          color: #64748B;
          font-weight: 600;
        }

        .hero-disclaimer-note {
          font-size: 0.9rem;
          color: #CBD5E1;
          max-width: 640px;
          margin: 0 auto;
          line-height: 1.55;
        }

        /* Allocation Bar Card */
        .allocation-bar-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 1.75rem;
        }

        .section-subtitle {
          font-family: 'Outfit', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: #00182A;
          margin: 0 0 1.25rem 0;
        }

        .visual-allocation-bar {
          display: flex;
          height: 36px;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 1.25rem;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
        }

        .bar-segment {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          font-size: 0.825rem;
          font-weight: 800;
          transition: width 0.3s ease;
        }

        .b1-segment { background: #00AB96; }
        .b2-segment { background: #3B82F6; }
        .b3-segment { background: #F59E0B; }

        .allocation-legend-row {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.825rem;
        }

        .legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .b1-dot { background: #00AB96; }
        .b2-dot { background: #3B82F6; }
        .b3-dot { background: #F59E0B; }

        .legend-name { color: #64748B; }
        .legend-val { color: #00182A; }

        /* Bucket Results Grid */
        .bucket-results-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }

        .bucket-res-card {
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
        }

        .b1-res-card { border-top: 4px solid #00AB96; }
        .b2-res-card { border-top: 4px solid #3B82F6; }
        .b3-res-card { border-top: 4px solid #F59E0B; }

        .b-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .b-card-badge {
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        .b-card-alloc {
          font-family: 'Outfit', sans-serif;
          font-size: 1.1rem;
          font-weight: 800;
          color: #00182A;
        }

        .b-card-amount {
          font-family: 'Outfit', sans-serif;
          font-size: 1.85rem;
          font-weight: 800;
          color: #00182A;
          margin-bottom: 0.15rem;
        }

        .b-card-exact {
          font-size: 0.75rem;
          color: #64748B;
          margin-bottom: 1.25rem;
        }

        .b-card-metrics-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          font-size: 0.8rem;
          border-top: 1px solid #F1F5F9;
          padding-top: 0.85rem;
        }

        .b-card-metrics-list li {
          display: flex;
          justify-content: space-between;
          color: #64748B;
        }

        .b-card-metrics-list strong {
          color: #00182A;
        }

        /* Flow Story Card */
        .flow-story-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 1.75rem;
        }

        .flow-steps-track {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        .flow-step {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 0.85rem 0.65rem;
          text-align: center;
          flex: 1;
          min-width: 120px;
        }

        .flow-step.highlight-flow-step {
          background: #E6F7F5;
          border-color: #00AB96;
        }

        .flow-step-lbl {
          display: block;
          font-size: 0.7rem;
          font-weight: 600;
          color: #64748B;
          margin-bottom: 0.25rem;
        }

        .flow-step-val {
          display: block;
          font-family: 'Outfit', sans-serif;
          font-size: 1.1rem;
          font-weight: 800;
          color: #00182A;
        }

        .flow-step-sub {
          display: block;
          font-size: 0.65rem;
          color: #64748B;
          margin-top: 0.15rem;
        }

        .flow-arrow {
          font-size: 1.1rem;
          font-weight: 700;
          color: #94A3B8;
        }

        /* Rate Summary Bar */
        .rate-summary-bar {
          display: flex;
          align-items: center;
          justify-content: space-around;
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 14px;
          padding: 1.25rem 1.5rem;
        }

        .r-metric {
          display: flex;
          flex-direction: column;
          text-align: center;
        }

        .r-divider {
          width: 1px;
          height: 40px;
          background: #CBD5E1;
        }

        .r-lbl {
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748B;
          margin-bottom: 0.25rem;
        }

        .r-val {
          font-family: 'Outfit', sans-serif;
          font-size: 1.35rem;
          font-weight: 800;
        }

        .r-sub {
          font-size: 0.7rem;
          color: #64748B;
          margin-top: 0.15rem;
        }

        /* Key Insight Card */
        .key-insight-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: linear-gradient(135deg, #00182A 0%, #002B49 100%);
          border-radius: 14px;
          padding: 1.25rem 1.5rem;
          color: #FFFFFF;
        }

        .insight-icon {
          font-size: 1.75rem;
          flex-shrink: 0;
        }

        .insight-title {
          display: block;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #00AB96;
          margin-bottom: 0.25rem;
        }

        .insight-text {
          font-size: 0.9rem;
          color: #E2E8F0;
          line-height: 1.5;
          margin: 0;
        }

        /* Accordion Cards */
        .accordion-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 14px;
          overflow: hidden;
        }

        .accordion-toggle-btn {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          color: #00182A;
          transition: background 0.2s;
        }

        .accordion-toggle-btn:hover {
          background: #F8FAFC;
        }

        .toggle-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .accordion-content {
          padding: 0 1.5rem 1.5rem;
          border-top: 1px solid #F1F5F9;
        }

        .accordion-content p {
          font-size: 0.875rem;
          color: #334155;
          line-height: 1.6;
          margin-top: 1rem;
        }

        .accordion-content ul {
          padding-left: 1.25rem;
          margin: 0.5rem 0 0 0;
          font-size: 0.85rem;
          color: #334155;
          line-height: 1.6;
        }

        .formula-step-block {
          margin-top: 1.25rem;
        }

        .formula-step-block h4 {
          font-size: 0.9rem;
          font-weight: 700;
          color: #00182A;
          margin: 0 0 0.5rem 0;
        }

        /* Consultation CTA Card */
        .results-cta-card {
          background: linear-gradient(135deg, #00182A 0%, #00365D 100%);
          border-radius: 16px;
          padding: 2.25rem;
          color: #FFFFFF;
          text-align: center;
        }

        .cta-heading {
          font-family: 'Outfit', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
        }

        .cta-sub {
          font-size: 0.95rem;
          color: #CBD5E1;
          max-width: 600px;
          margin: 0 auto 1.5rem auto;
          line-height: 1.5;
        }

        .cta-btn-row {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .btn-whatsapp-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #25D366;
          color: #FFFFFF;
          text-decoration: none;
          font-size: 1rem;
          font-weight: 700;
          padding: 0.875rem 1.75rem;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(37, 211, 102, 0.25);
          transition: all 0.2s ease;
        }

        .btn-whatsapp-cta:hover {
          background: #20BA5A;
          transform: translateY(-2px);
        }

        .btn-contact-secondary {
          display: inline-flex;
          align-items: center;
          background: transparent;
          color: #FFFFFF;
          border: 1.5px solid rgba(255, 255, 255, 0.3);
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 600;
          padding: 0.875rem 1.5rem;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .btn-contact-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: #FFFFFF;
        }

        .cta-disclaimer {
          font-size: 0.75rem;
          color: #94A3B8;
          margin: 0;
        }

        /* Buttons */
        .step-actions {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .btn-continue, .btn-view-results, .btn-edit-plan {
          background: #00AB96;
          color: #FFFFFF;
          border: none;
          padding: 0.875rem 1.75rem;
          font-size: 1rem;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-continue:hover, .btn-view-results:hover, .btn-edit-plan:hover {
          background: #008f7d;
          transform: translateY(-1px);
        }

        .btn-back {
          background: #F1F5F9;
          color: #334155;
          border: 1px solid #CBD5E1;
          padding: 0.875rem 1.5rem;
          font-size: 0.95rem;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-back:hover {
          background: #E2E8F0;
        }

        /* Color Utility Classes */
        .text-teal { color: #00AB96; }
        .text-gold { color: #D97706; }
        .text-navy { color: #00182A; }
        .text-slate { color: #64748B; }

        /* Responsive Breakpoints */
        @media (max-width: 860px) {
          .stepper-list {
            grid-template-columns: repeat(2, 1fr);
          }
          .inputs-grid {
            grid-template-columns: 1fr;
          }
          .bucket-explainer-grid, .bucket-results-grid {
            grid-template-columns: 1fr;
          }
          .flow-steps-track {
            flex-direction: column;
            align-items: stretch;
          }
          .flow-arrow {
            display: none;
          }
          .rate-summary-bar {
            flex-direction: column;
            gap: 1rem;
          }
          .r-divider {
            display: none;
          }
          .allocation-legend-row {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 640px) {
          .step-card {
            padding: 1.5rem 1rem;
          }
          .calc-top-action-bar {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
          }
          .action-btn-group {
            justify-content: flex-end;
          }
          .results-hero-card {
            padding: 1.75rem 1rem 1.5rem;
            border-radius: 16px;
          }
          .hero-heading {
            font-size: 1.5rem !important;
            margin-bottom: 1.25rem;
          }
          .primary-result-box {
            padding: 1.5rem 1rem;
            border-radius: 12px;
          }
          .result-main-number {
            font-size: 2.35rem;
          }
          .cta-btn-row {
            flex-direction: column;
          }
          .step-actions {
            flex-direction: column-reverse;
          }
          .btn-continue, .btn-view-results, .btn-edit-plan, .btn-back {
            width: 100%;
            text-align: center;
          }
          .horizon-metrics-row {
            flex-direction: column;
            gap: 0.75rem;
          }
          .h-divider {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
