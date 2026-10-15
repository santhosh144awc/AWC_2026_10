import React, { useState, useId, useMemo } from 'react';
import {
  calculateHomeLoanForeclosurePlan,
  calculateEMI,
  calculateMonthlySIPRate,
  calculateRequiredSIP,
  calculateSIPCorpus,
  formatIndianCurrency,
  formatLakhsCrores,
  formatPercentage,
  formatYearsAndMonths,
  type ForeclosureStrategy,
  type HomeLoanForeclosureInputs
} from '../../utils/calculations/homeLoanForeclosurePlanner';

type WizardStep = 1 | 2 | 3 | 'results';

export default function HomeLoanForeclosurePlanner() {
  const baseId = useId();

  // Wizard Navigation
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);

  // Step 1: Home Loan Inputs
  const [loanAmount, setLoanAmount] = useState<number>(5000000); // ₹50 Lakh
  const [loanTenureYears, setLoanTenureYears] = useState<number>(20); // 20 years
  const [loanInterestRate, setLoanInterestRate] = useState<number>(8.0); // 8% p.a.
  const [currentLoanStartDate, setCurrentLoanStartDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Step 2: SIP Return Assumptions
  const [sipReturnRate, setSipReturnRate] = useState<number>(12.0); // 12% p.a.

  // Step 3: Strategy Selection & Strategy-Specific Inputs
  const [strategy, setStrategy] = useState<ForeclosureStrategy>('targetYear');
  const [targetClosureYears, setTargetClosureYears] = useState<number>(10); // Option A (Default 10 years)
  const [monthlySIP, setMonthlySIP] = useState<number>(10000); // Option B (Default ₹10,000/mo)

  // Chart Interactive Hover State
  const [activeChartPoint, setActiveChartPoint] = useState<number | null>(null);

  // Accordion Toggles
  const [showFullProjection, setShowFullProjection] = useState<boolean>(false);
  const [showHowItWorks, setShowHowItWorks] = useState<boolean>(false);

  // Calculated Inputs Object
  const planInput: HomeLoanForeclosureInputs = useMemo(() => ({
    loanAmount,
    loanTenureYears,
    loanInterestRate,
    sipReturnRate,
    currentLoanStartDate,
    strategy,
    targetClosureYears: strategy === 'targetYear' ? targetClosureYears : undefined,
    monthlySIP: strategy === 'fixedSIP' ? monthlySIP : undefined
  }), [
    loanAmount,
    loanTenureYears,
    loanInterestRate,
    sipReturnRate,
    currentLoanStartDate,
    strategy,
    targetClosureYears,
    monthlySIP
  ]);

  // Master Result
  const result = useMemo(() => calculateHomeLoanForeclosurePlan(planInput), [planInput]);

  // Live Derived Previews
  const currentEMI = useMemo(() => calculateEMI(loanAmount, loanTenureYears, loanInterestRate), [loanAmount, loanTenureYears, loanInterestRate]);
  const effectiveMonthlySIPRate = useMemo(() => calculateMonthlySIPRate(sipReturnRate), [sipReturnRate]);

  // Sample Scenarios
  const handleLoadSampleScenarioA = () => {
    setLoanAmount(5000000);
    setLoanTenureYears(20);
    setLoanInterestRate(8.0);
    setSipReturnRate(12.0);
    setStrategy('targetYear');
    setTargetClosureYears(10);
    setCurrentLoanStartDate('2026-04-01');
    setCurrentStep('results');
  };

  const handleLoadSampleScenarioB = () => {
    setLoanAmount(5000000);
    setLoanTenureYears(20);
    setLoanInterestRate(8.0);
    setSipReturnRate(12.0);
    setStrategy('fixedSIP');
    setMonthlySIP(10000);
    setCurrentLoanStartDate('2026-04-01');
    setCurrentStep('results');
  };

  // Reset Handler
  const handleReset = () => {
    setLoanAmount(5000000);
    setLoanTenureYears(20);
    setLoanInterestRate(8.0);
    setSipReturnRate(12.0);
    setStrategy('targetYear');
    setTargetClosureYears(10);
    setMonthlySIP(10000);
    setCurrentLoanStartDate(new Date().toISOString().split('T')[0]);
    setCurrentStep(1);
    setActiveChartPoint(null);
  };

  // WhatsApp Prepopulated Deep Link
  const generateWhatsAppUrl = () => {
    const formattedLoan = formatLakhsCrores(loanAmount);
    const formattedEMI = formatIndianCurrency(Math.round(currentEMI));
    const formattedSIP = strategy === 'targetYear' && result.requiredMonthlySIP
      ? formatIndianCurrency(Math.round(result.requiredMonthlySIP))
      : formatIndianCurrency(monthlySIP);
    const timeline = strategy === 'targetYear'
      ? `${targetClosureYears} Years`
      : result.foreclosureMonth
        ? formatYearsAndMonths(result.foreclosureMonth)
        : 'N/A';

    const message = `Hi Santhosh, I used the Home Loan Foreclosure Planner on Ant Wealth Creation.

• Loan Amount: ${formattedLoan} (EMI: ${formattedEMI}/month)
• Parallel SIP: ${formattedSIP}/month
• Target Closure: ${timeline}
• Estimated SIP Corpus: ${formatLakhsCrores(result.SIPCorpusAtTarget)}

Can we connect to discuss this plan?`;

    return `https://wa.me/918087971566?text=${encodeURIComponent(message)}`;
  };

  // SVG Chart Dimensions
  const chartWidth = 720;
  const chartHeight = 300;
  const padding = { top: 25, right: 30, bottom: 45, left: 65 };
  const graphWidth = chartWidth - padding.left - padding.right;
  const graphHeight = chartHeight - padding.top - padding.bottom;

  // Chart Data Preparation (Yearly trajectory)
  const chartData = useMemo(() => {
    if (!result.yearlySummary || result.yearlySummary.length === 0) return null;

    const maxVal = Math.max(
      loanAmount,
      ...result.yearlySummary.map((y) => Math.max(y.openingLoanPrincipal, y.closingSIPCorpus)),
      100000
    ) * 1.05;

    const numYears = result.yearlySummary.length;

    // Start with Year 0 point
    const points = [
      {
        yearNumber: 0,
        calendarYear: parseInt(currentLoanStartDate.substring(0, 4), 10) || new Date().getFullYear(),
        loanPrincipal: loanAmount,
        sipCorpus: 0,
        gap: loanAmount,
        isCrossover: false,
        x: padding.left,
        yLoan: padding.top + graphHeight - (loanAmount / maxVal) * graphHeight,
        ySIP: padding.top + graphHeight
      }
    ];

    let crossoverX: number | null = null;
    let crossoverY: number | null = null;
    let crossoverLabel = '';

    result.yearlySummary.forEach((y, idx) => {
      const xPos = padding.left + ((idx + 1) / numYears) * graphWidth;
      const yLoanPos = padding.top + graphHeight - (y.closingLoanPrincipal / maxVal) * graphHeight;
      const ySIPPos = padding.top + graphHeight - (y.closingSIPCorpus / maxVal) * graphHeight;

      const isCrossoverYear = result.foreclosureMonth !== null && Math.ceil(result.foreclosureMonth / 12) === y.yearNumber;

      if (isCrossoverYear && crossoverX === null) {
        crossoverX = xPos;
        crossoverY = ySIPPos;
        crossoverLabel = result.foreclosureYears ? `${result.foreclosureYears.toFixed(1)} Yrs` : `Yr ${y.yearNumber}`;
      }

      points.push({
        yearNumber: y.yearNumber,
        calendarYear: y.calendarYear,
        loanPrincipal: y.closingLoanPrincipal,
        sipCorpus: y.closingSIPCorpus,
        gap: y.gap,
        isCrossover: isCrossoverYear,
        x: xPos,
        yLoan: yLoanPos,
        ySIP: ySIPPos
      });
    });

    // Generate Path Data
    const loanPathD = points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.yLoan}`, '');
    const sipPathD = points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.ySIP}`, '');
    const firstPt = points[0];
    const lastPt = points[points.length - 1];
    const sipAreaD = `${sipPathD} L ${lastPt.x} ${padding.top + graphHeight} L ${firstPt.x} ${padding.top + graphHeight} Z`;

    return {
      points,
      maxVal,
      loanPathD,
      sipPathD,
      sipAreaD,
      crossoverX,
      crossoverY,
      crossoverLabel
    };
  }, [result.yearlySummary, loanAmount, result.foreclosureMonth, result.foreclosureYears, currentLoanStartDate, graphWidth, graphHeight, padding.left, padding.top]);

  // Filtered Table Milestones
  const tableRows = useMemo(() => {
    if (showFullProjection) return result.yearlySummary;
    const crossoverYear = result.foreclosureMonth ? Math.ceil(result.foreclosureMonth / 12) : null;
    return result.yearlySummary.filter((y) => {
      return (
        y.yearNumber === 1 ||
        y.yearNumber === 3 ||
        y.yearNumber === 5 ||
        y.yearNumber === 10 ||
        y.yearNumber === 15 ||
        y.yearNumber === result.loanTenureYears ||
        (crossoverYear && y.yearNumber === crossoverYear)
      );
    });
  }, [result.yearlySummary, result.foreclosureMonth, result.loanTenureYears, showFullProjection]);

  return (
    <div className="foreclosure-planner-wrapper">
      {/* Top Action Bar */}
      <div className="calc-top-action-bar">
        <div className="action-tagline">
          <span className="live-pulse"></span>
          <span>Parallel Month-by-Month Amortization & SIP Simulation</span>
        </div>
        <div className="action-btn-group">
          <button
            type="button"
            onClick={handleLoadSampleScenarioA}
            className="btn-sample-preset"
            title="Load ₹50L @ 8%, 10-Year Target closure scenario"
          >
            🎯 Scenario A (10-Yr Target)
          </button>
          <button
            type="button"
            onClick={handleLoadSampleScenarioB}
            className="btn-sample-preset"
            title="Load ₹50L @ 8%, ₹10,000/mo SIP scenario"
          >
            💰 Scenario B (₹10k Fixed SIP)
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

      {/* Stepper Navigation */}
      <nav className="stepper-nav" aria-label="Calculator Steps">
        <ol className="stepper-list">
          {[
            { step: 1, title: 'Home Loan', icon: '🏠' },
            { step: 2, title: 'SIP Growth', icon: '📈' },
            { step: 3, title: 'Choose Strategy', icon: '🎯' },
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

      {/* STEP 1: HOME LOAN DETAILS */}
      {currentStep === 1 && (
        <section className="step-card" aria-labelledby="step1-title">
          <div className="step-header">
            <div className="step-badge">Step 1 of 3</div>
            <h2 id="step1-title" className="step-heading">
              Your Home Loan Details
            </h2>
            <p className="step-description">
              Enter your current loan amount, total tenure, and interest rate to calculate your baseline EMI.
            </p>
          </div>

          <div className="inputs-grid">
            <div className="input-group">
              <label htmlFor={`${baseId}-loanAmt`} className="input-label">
                Outstanding / New Loan Amount (₹) *
              </label>
              <div className="currency-input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  id={`${baseId}-loanAmt`}
                  type="number"
                  min="500000"
                  max="20000000"
                  step="100000"
                  value={loanAmount || ''}
                  onChange={(e) => setLoanAmount(Math.max(0, Number(e.target.value)))}
                  placeholder="5000000"
                  className="currency-field"
                />
                <span className="unit-tag">{formatLakhsCrores(loanAmount)}</span>
              </div>
              <input
                type="range"
                min="500000"
                max="20000000"
                step="250000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="range-slider"
                aria-label="Loan Amount Slider"
              />
              <div className="slider-ticks">
                <span>₹5 Lakh</span>
                <span>₹50 Lakh</span>
                <span>₹1 Crore</span>
                <span>₹2 Crore</span>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-tenure`} className="input-label">
                Loan Tenure (Years) *
              </label>
              <div className="slider-group">
                <div className="slider-value-display">
                  <span>{loanTenureYears} Years ({loanTenureYears * 12} EMIs)</span>
                </div>
                <input
                  id={`${baseId}-tenure`}
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={loanTenureYears}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setLoanTenureYears(val);
                    if (targetClosureYears > val) setTargetClosureYears(val);
                  }}
                  className="range-slider"
                />
                <div className="slider-ticks">
                  <span>5 yrs</span>
                  <span>15 yrs</span>
                  <span>20 yrs</span>
                  <span>30 yrs</span>
                </div>
              </div>
              <span className="input-helper">Total contractual repayment duration</span>
            </div>
          </div>

          <div className="inputs-grid mt-2">
            <div className="input-group">
              <label htmlFor={`${baseId}-rate`} className="input-label">
                Annual Loan Interest Rate (% p.a.) *
              </label>
              <div className="slider-group">
                <div className="slider-value-display">
                  <span>{loanInterestRate.toFixed(2)}% p.a.</span>
                </div>
                <input
                  id={`${baseId}-rate`}
                  type="range"
                  min="6.5"
                  max="14.0"
                  step="0.1"
                  value={loanInterestRate}
                  onChange={(e) => setLoanInterestRate(Number(e.target.value))}
                  className="range-slider"
                />
                <div className="slider-ticks">
                  <span>6.5%</span>
                  <span>8.0% (Standard)</span>
                  <span>9.5%</span>
                  <span>14.0%</span>
                </div>
              </div>
              <span className="input-helper">Prevailing floating or fixed home loan interest rate</span>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-start`} className="input-label">
                Loan Start / Planning Date
              </label>
              <input
                id={`${baseId}-start`}
                type="date"
                value={currentLoanStartDate}
                onChange={(e) => setCurrentLoanStartDate(e.target.value)}
                className="currency-field"
              />
              <span className="input-helper">Used to project month-by-month calendar dates</span>
            </div>
          </div>

          {/* Live Loan Summary Box */}
          <div className="live-preview-box">
            <div className="preview-row">
              <div className="preview-item">
                <span className="p-lbl">Monthly Loan EMI</span>
                <span className="p-val text-navy">{formatIndianCurrency(Math.round(currentEMI))}/mo</span>
              </div>
              <div className="p-divider"></div>
              <div className="preview-item">
                <span className="p-lbl">Total Scheduled Payment</span>
                <span className="p-val text-teal">{formatLakhsCrores(currentEMI * loanTenureYears * 12)}</span>
              </div>
              <div className="p-divider"></div>
              <div className="preview-item">
                <span className="p-lbl">Total Interest Payable</span>
                <span className="p-val text-gold">
                  {formatLakhsCrores(Math.max(0, currentEMI * loanTenureYears * 12 - loanAmount))}
                </span>
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
              Continue to SIP Assumptions →
            </button>
          </div>
        </section>
      )}

      {/* STEP 2: SIP RETURN ASSUMPTIONS */}
      {currentStep === 2 && (
        <section className="step-card" aria-labelledby="step2-title">
          <div className="step-header">
            <div className="step-badge">Step 2 of 3</div>
            <h2 id="step2-title" className="step-heading">
              Expected SIP Return Assumption
            </h2>
            <p className="step-description">
              Choose the long-term annual return expectation for your parallel mutual fund SIP.
            </p>
          </div>

          <div className="inputs-grid">
            <div className="input-group">
              <label htmlFor={`${baseId}-sipReturn`} className="input-label">
                Expected Long-Term SIP Return (% p.a.) *
              </label>
              <div className="slider-group">
                <div className="slider-value-display">
                  <span>{sipReturnRate.toFixed(1)}% p.a.</span>
                </div>
                <input
                  id={`${baseId}-sipReturn`}
                  type="range"
                  min="6"
                  max="18"
                  step="0.5"
                  value={sipReturnRate}
                  onChange={(e) => setSipReturnRate(Number(e.target.value))}
                  className="range-slider"
                />
                <div className="slider-ticks">
                  <span>6% (Conservative)</span>
                  <span>10% (Hybrid)</span>
                  <span>12% (Equity Standard)</span>
                  <span>18% (Aggressive)</span>
                </div>
              </div>
              <span className="input-helper">
                Compounded monthly using effective rate formula: i = (1+r)^(1/12) - 1
              </span>
            </div>

            <div className="info-card-box">
              <h4 className="info-card-heading">💡 Why Parallel SIP Instead of Direct Prepayment?</h4>
              <p className="info-card-text">
                When you invest in a mutual fund SIP alongside your EMI, your money remains <strong>100% liquid</strong> in your control while compounding at long-term equity rates. You avoid locking emergency capital into immovable bricks.
              </p>
              <div className="rate-badge-row">
                <span className="rate-pill">Effective Monthly Rate: {(effectiveMonthlySIPRate * 100).toFixed(4)}%/mo</span>
                <span className="rate-pill-sub">Invested at the start of each month</span>
              </div>
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
              Continue to Choose Strategy →
            </button>
          </div>
        </section>
      )}

      {/* STEP 3: CHOOSE STRATEGY */}
      {currentStep === 3 && (
        <section className="step-card" aria-labelledby="step3-title">
          <div className="step-header">
            <div className="step-badge">Step 3 of 3</div>
            <h2 id="step3-title" className="step-heading">
              Choose Your Foreclosure Planning Approach
            </h2>
            <p className="step-description">
              Select whether you want to target a specific closure year, or check how early your fixed monthly SIP budget could cover the loan.
            </p>
          </div>

          <div className="strategy-selection-grid">
            {/* OPTION A CARD */}
            <div
              className={`strategy-card ${strategy === 'targetYear' ? 'strategy-card-active' : ''}`}
              onClick={() => setStrategy('targetYear')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setStrategy('targetYear'); }}
            >
              <div className="strat-top">
                <span className="strat-radio-circle">{strategy === 'targetYear' ? '●' : '○'}</span>
                <span className="strat-tag">OPTION A</span>
              </div>
              <h3 className="strat-title">Target an Earlier Closure</h3>
              <p className="strat-desc">
                “I know when I want to be debt-free. Tell me the monthly SIP required today.”
              </p>

              {strategy === 'targetYear' && (
                <div className="strat-inner-form" onClick={(e) => e.stopPropagation()}>
                  <label htmlFor={`${baseId}-targetYr`} className="input-label">
                    Target Closure Horizon (Years)
                  </label>
                  <div className="slider-group">
                    <div className="slider-value-display">
                      <span className="text-teal font-bold">{targetClosureYears} Years</span>
                    </div>
                    <input
                      id={`${baseId}-targetYr`}
                      type="range"
                      min="3"
                      max={loanTenureYears}
                      step="1"
                      value={targetClosureYears}
                      onChange={(e) => setTargetClosureYears(Number(e.target.value))}
                      className="range-slider"
                    />
                    <div className="slider-ticks">
                      <span>3 yrs</span>
                      <span>5 yrs</span>
                      <span>10 yrs</span>
                      <span>{loanTenureYears} yrs</span>
                    </div>
                  </div>
                  <div className="live-strat-preview">
                    <span className="preview-lbl">Required Monthly SIP:</span>
                    <span className="preview-val text-teal">
                      {result.requiredMonthlySIP ? `${formatIndianCurrency(Math.round(result.requiredMonthlySIP))}/mo` : '₹0/mo'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* OPTION B CARD */}
            <div
              className={`strategy-card ${strategy === 'fixedSIP' ? 'strategy-card-active' : ''}`}
              onClick={() => setStrategy('fixedSIP')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setStrategy('fixedSIP'); }}
            >
              <div className="strat-top">
                <span className="strat-radio-circle">{strategy === 'fixedSIP' ? '●' : '○'}</span>
                <span className="strat-tag">OPTION B</span>
              </div>
              <h3 className="strat-title">I Have a Fixed Monthly Budget</h3>
              <p className="strat-desc">
                “I can invest a fixed amount each month alongside EMI. Project when the corpus could cover the loan.”
              </p>

              {strategy === 'fixedSIP' && (
                <div className="strat-inner-form" onClick={(e) => e.stopPropagation()}>
                  <label htmlFor={`${baseId}-fixedSIP`} className="input-label">
                    Affordable Monthly SIP (₹/month)
                  </label>
                  <div className="currency-input-wrapper">
                    <span className="currency-symbol">₹</span>
                    <input
                      id={`${baseId}-fixedSIP`}
                      type="number"
                      min="1000"
                      step="2500"
                      value={monthlySIP || ''}
                      onChange={(e) => setMonthlySIP(Math.max(0, Number(e.target.value)))}
                      className="currency-field"
                    />
                    <span className="unit-tag">{formatIndianCurrency(monthlySIP)}/mo</span>
                  </div>
                  <input
                    type="range"
                    min="2500"
                    max="100000"
                    step="2500"
                    value={monthlySIP}
                    onChange={(e) => setMonthlySIP(Number(e.target.value))}
                    className="range-slider"
                    aria-label="Fixed Monthly SIP Slider"
                  />
                  <div className="slider-ticks">
                    <span>₹2,500</span>
                    <span>₹10,000</span>
                    <span>₹25,000</span>
                    <span>₹1 Lakh</span>
                  </div>
                  <div className="live-strat-preview">
                    <span className="preview-lbl">Projected Crossover:</span>
                    <span className="preview-val text-gold">
                      {result.foreclosureMonth
                        ? `${formatYearsAndMonths(result.foreclosureMonth)} (Month ${result.foreclosureMonth})`
                        : 'Not within loan tenure'}
                    </span>
                  </div>
                </div>
              )}
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
              View Foreclosure Plan ★
            </button>
          </div>
        </section>
      )}

      {/* RESULTS DASHBOARD */}
      {currentStep === 'results' && (
        <div className="results-container" aria-live="polite">
          {/* Results Hero Card */}
          <div className="results-hero-card">
            <div className="hero-eyebrow">HOME LOAN + SIP PLANNER</div>
            <h2 className="hero-heading">Your SIP could help you plan an earlier loan closure</h2>

            <div className="primary-result-box">
              <span className="result-tag">
                {strategy === 'targetYear' ? 'REQUIRED MONTHLY SIP' : 'PROJECTED LOAN COVERAGE TIMELINE'}
              </span>
              <div className="result-main-number">
                {strategy === 'targetYear'
                  ? `${result.requiredMonthlySIP ? formatIndianCurrency(Math.round(result.requiredMonthlySIP)) : '₹0'} / mo`
                  : result.foreclosureYears
                    ? `${result.foreclosureYears.toFixed(1)} Years`
                    : 'Tenure Exceeded'}
              </div>
              <div className="result-exact-number">
                {strategy === 'targetYear'
                  ? `To accumulate ${formatLakhsCrores(result.outstandingPrincipalAtTarget)} remaining loan principal in ${targetClosureYears} years @ ${sipReturnRate}% return`
                  : result.foreclosureMonth
                    ? `Estimated in ${formatYearsAndMonths(result.foreclosureMonth)} (Month ${result.foreclosureMonth}) with ₹${monthlySIP.toLocaleString('en-IN')}/mo SIP`
                    : `SIP corpus is not projected to fully cover the loan within the ${loanTenureYears}-year tenure.`}
              </div>
            </div>

            <p className="hero-disclaimer-note">{result.keyInsight}</p>
          </div>

          {/* Major Result Metrics Grid (4 Cards) */}
          <div className="metrics-four-grid">
            <div className="metric-card">
              <span className="m-card-lbl">Monthly Loan EMI</span>
              <span className="m-card-val text-navy">{formatIndianCurrency(Math.round(result.emi))}/mo</span>
              <span className="m-card-sub">{loanTenureYears} Years Tenure</span>
            </div>

            <div className="metric-card">
              <span className="m-card-lbl">Outstanding Principal</span>
              <span className="m-card-val text-amber">{formatLakhsCrores(result.outstandingPrincipalAtTarget)}</span>
              <span className="m-card-sub">
                {strategy === 'targetYear' ? `After ${targetClosureYears} Yrs` : `At Month ${result.foreclosureMonth || loanTenureYears * 12}`}
              </span>
            </div>

            <div className="metric-card highlight-metric">
              <span className="m-card-lbl">Projected SIP Corpus</span>
              <span className="m-card-val text-teal">{formatLakhsCrores(result.SIPCorpusAtTarget)}</span>
              <span className="m-card-sub">{formatIndianCurrency(result.SIPCorpusAtTarget)}</span>
            </div>

            <div className="metric-card">
              <span className="m-card-lbl">Potential Surplus / Gap</span>
              <span className="m-card-val text-navy">
                {result.surplusAtTarget >= 0
                  ? `+${formatIndianCurrency(Math.round(result.surplusAtTarget))}`
                  : formatIndianCurrency(Math.round(result.surplusAtTarget))}
              </span>
              <span className="m-card-sub">{result.surplusAtTarget >= 0 ? 'Corpus exceeds debt' : 'Shortfall'}</span>
            </div>
          </div>

          {/* Interactive Responsive SVG Dual-Curve Crossover Chart */}
          {chartData && (
            <div className="chart-card">
              <div className="chart-header">
                <div>
                  <h3 className="section-subtitle">Loan Balance vs SIP Corpus Trajectory</h3>
                  <span className="chart-subtitle-note">
                    Hover/tap points along the timeline to view principal vs accumulated SIP wealth
                  </span>
                </div>
                <div className="chart-legend">
                  <span className="legend-item">
                    <span className="legend-dot dot-loan"></span>
                    <span>Loan Principal</span>
                  </span>
                  <span className="legend-item">
                    <span className="legend-dot dot-sip"></span>
                    <span>SIP Corpus</span>
                  </span>
                </div>
              </div>

              <div className="svg-chart-container">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="growth-svg"
                  preserveAspectRatio="xMidYMid meet"
                  role="region"
                  aria-label="Interactive Home Loan vs SIP Corpus Crossover Chart. Use Tab to inspect annual loan and SIP milestones, or review the projection table below."
                >
                  <defs aria-hidden="true">
                    <linearGradient id="sipAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00AB96" stopOpacity="0.30" />
                      <stop offset="100%" stopColor="#00AB96" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid Lines */}
                  {[0.25, 0.5, 0.75, 1].map((pct, idx) => {
                    const yPos = padding.top + graphHeight * (1 - pct);
                    return (
                      <g key={idx} aria-hidden="true">
                        <line
                          x1={padding.left}
                          y1={yPos}
                          x2={padding.left + graphWidth}
                          y2={yPos}
                          stroke="#E2E8F0"
                          strokeDasharray="4 4"
                        />
                        <text
                          x={padding.left - 8}
                          y={yPos + 4}
                          textAnchor="end"
                          fontSize="10"
                          fill="#94A3B8"
                          fontWeight="600"
                        >
                          {formatLakhsCrores(chartData.maxVal * pct)}
                        </text>
                      </g>
                    );
                  })}

                  {/* Baseline X-axis */}
                  <line
                    aria-hidden="true"
                    x1={padding.left}
                    y1={padding.top + graphHeight}
                    x2={padding.left + graphWidth}
                    y2={padding.top + graphHeight}
                    stroke="#CBD5E1"
                    strokeWidth="1.5"
                  />

                  {/* Shaded Area for SIP Growth */}
                  <path aria-hidden="true" d={chartData.sipAreaD} fill="url(#sipAreaGradient)" />

                  {/* Outstanding Loan Principal Curve (Amber/Coral) */}
                  <path
                    aria-hidden="true"
                    d={chartData.loanPathD}
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Projected SIP Corpus Curve (Growth Teal) */}
                  <path
                    aria-hidden="true"
                    d={chartData.sipPathD}
                    fill="none"
                    stroke="#00AB96"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Potential Loan Coverage Crossover Marker */}
                  {chartData.crossoverX !== null && chartData.crossoverY !== null && (
                    <g className="crossover-marker-group">
                      <line
                        aria-hidden="true"
                        x1={chartData.crossoverX}
                        y1={padding.top}
                        x2={chartData.crossoverX}
                        y2={padding.top + graphHeight}
                        stroke="#00AB96"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                      />
                      <circle
                        cx={chartData.crossoverX}
                        cy={chartData.crossoverY}
                        r="6.5"
                        fill="#00182A"
                        stroke="#00AB96"
                        strokeWidth="3"
                        tabIndex={0}
                        role="button"
                        className="chart-crossover-dot"
                        aria-label={`Milestone: Potential Loan Coverage Point at ${chartData.crossoverLabel}. Projected SIP corpus reaches parity with remaining home loan debt.`}
                        onFocus={() => {
                          const crossoverIdx = chartData.points.findIndex((p) => p.isCrossover);
                          if (crossoverIdx >= 0) setActiveChartPoint(crossoverIdx);
                        }}
                        onClick={() => {
                          const crossoverIdx = chartData.points.findIndex((p) => p.isCrossover);
                          if (crossoverIdx >= 0) setActiveChartPoint(crossoverIdx);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            const crossoverIdx = chartData.points.findIndex((p) => p.isCrossover);
                            if (crossoverIdx >= 0) setActiveChartPoint(crossoverIdx);
                          }
                        }}
                      />
                      <rect
                        aria-hidden="true"
                        x={Math.max(padding.left, chartData.crossoverX - 75)}
                        y={Math.max(padding.top, chartData.crossoverY - 32)}
                        width="150"
                        height="24"
                        rx="12"
                        fill="#00182A"
                      />
                      <text
                        aria-hidden="true"
                        x={Math.max(padding.left + 75, chartData.crossoverX)}
                        y={Math.max(padding.top + 16, chartData.crossoverY - 16)}
                        textAnchor="middle"
                        fontSize="9.5"
                        fontWeight="800"
                        fill="#00AB96"
                      >
                        ★ Potential Coverage Point
                      </text>
                    </g>
                  )}

                  {/* Interactive Points on Yearly Nodes */}
                  {chartData.points.map((pt, idx) => {
                    const isHovered = activeChartPoint === idx;
                    return (
                      <g key={idx}>
                        <circle
                          cx={pt.x}
                          cy={pt.yLoan}
                          r={isHovered ? 6 : 3.5}
                          fill="#FFFFFF"
                          stroke="#F59E0B"
                          strokeWidth={isHovered ? 3 : 2}
                          tabIndex={0}
                          role="button"
                          className="chart-node chart-point-dot dot-loan"
                          aria-label={`Year ${pt.yearNumber} (${pt.calendarYear}) Loan Principal: ${formatIndianCurrency(pt.loanPrincipal)}.`}
                          aria-pressed={isHovered}
                          onFocus={() => setActiveChartPoint(idx)}
                          onClick={() => setActiveChartPoint(idx)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setActiveChartPoint(idx);
                            }
                          }}
                          onMouseEnter={() => setActiveChartPoint(idx)}
                          onTouchStart={() => setActiveChartPoint(idx)}
                        />
                        <circle
                          cx={pt.x}
                          cy={pt.ySIP}
                          r={isHovered ? 6 : 3.5}
                          fill="#FFFFFF"
                          stroke="#00AB96"
                          strokeWidth={isHovered ? 3 : 2}
                          tabIndex={0}
                          role="button"
                          className="chart-node chart-point-dot dot-sip"
                          aria-label={`Year ${pt.yearNumber} (${pt.calendarYear}) Projected SIP Corpus: ${formatIndianCurrency(pt.sipCorpus)}${pt.isCrossover ? ' (Potential Coverage Point)' : ''}.`}
                          aria-pressed={isHovered}
                          onFocus={() => setActiveChartPoint(idx)}
                          onClick={() => setActiveChartPoint(idx)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setActiveChartPoint(idx);
                            }
                          }}
                          onMouseEnter={() => setActiveChartPoint(idx)}
                          onTouchStart={() => setActiveChartPoint(idx)}
                        />

                        {/* X-axis Year Label */}
                        {(pt.yearNumber === 0 || pt.yearNumber % 5 === 0 || pt.yearNumber === result.loanTenureYears) && (
                          <text
                            aria-hidden="true"
                            x={pt.x}
                            y={padding.top + graphHeight + 18}
                            textAnchor="middle"
                            fontSize="10"
                            fill="#64748B"
                            fontWeight="600"
                          >
                            Yr {pt.yearNumber}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>

                {/* Hover Tooltip Box */}
                {activeChartPoint !== null && chartData.points[activeChartPoint] && (
                  <div className="chart-tooltip-box">
                    <div className="tt-header">
                      <span>Year {chartData.points[activeChartPoint].yearNumber} ({chartData.points[activeChartPoint].calendarYear})</span>
                      {chartData.points[activeChartPoint].isCrossover && (
                        <span className="tt-crossover-tag">Coverage Point</span>
                      )}
                    </div>
                    <div className="tt-body">
                      <div className="tt-row">
                        <span className="tt-lbl text-amber">Loan Principal:</span>
                        <span className="tt-val">{formatIndianCurrency(chartData.points[activeChartPoint].loanPrincipal)}</span>
                      </div>
                      <div className="tt-row">
                        <span className="tt-lbl text-teal">SIP Corpus:</span>
                        <span className="tt-val">{formatIndianCurrency(chartData.points[activeChartPoint].sipCorpus)}</span>
                      </div>
                      <div className="tt-row">
                        <span className="tt-lbl">Net Gap:</span>
                        <span className="tt-val font-bold">
                          {chartData.points[activeChartPoint].gap <= 0
                            ? `+${formatIndianCurrency(Math.abs(chartData.points[activeChartPoint].gap))} (Surplus)`
                            : `-${formatIndianCurrency(chartData.points[activeChartPoint].gap)} (Shortfall)`}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Visual Investment Journey Track */}
          <div className="journey-track-card">
            <h3 className="section-subtitle">How Parallel SIP Loan Foreclosure Works</h3>
            <div className="journey-flow-row">
              <div className="journey-step-box">
                <span className="j-icon">🏠</span>
                <span className="j-step-lbl">1. Regular Home EMI</span>
                <span className="j-step-val">{formatIndianCurrency(Math.round(result.emi))}/mo</span>
                <span className="j-step-desc">Continues reducing loan principal month by month</span>
              </div>
              <div className="journey-flow-arrow">→</div>
              <div className="journey-step-box">
                <span className="j-icon">📈</span>
                <span className="j-step-lbl">2. Parallel Monthly SIP</span>
                <span className="j-step-val text-teal">
                  {strategy === 'targetYear'
                    ? `${formatIndianCurrency(Math.round(result.requiredMonthlySIP || 0))}/mo`
                    : `${formatIndianCurrency(monthlySIP)}/mo`}
                </span>
                <span className="j-step-desc">Compounds in high-quality market-linked funds</span>
              </div>
              <div className="journey-flow-arrow">→</div>
              <div className="journey-step-box highlight-step-box">
                <span className="j-icon">💎</span>
                <span className="j-step-lbl">3. Corpus Matches Debt</span>
                <span className="j-step-val text-navy">
                  {strategy === 'targetYear'
                    ? `${targetClosureYears} Years`
                    : result.foreclosureMonth
                      ? formatYearsAndMonths(result.foreclosureMonth)
                      : 'Milestone'}
                </span>
                <span className="j-step-desc">SIP corpus equals or exceeds remaining loan principal</span>
              </div>
              <div className="journey-flow-arrow">→</div>
              <div className="journey-step-box">
                <span className="j-icon">🔓</span>
                <span className="j-step-lbl">4. Early Closure Option</span>
                <span className="j-step-val text-gold">100% Discretion</span>
                <span className="j-step-desc">Pay off the loan early or let your corpus continue compounding</span>
              </div>
            </div>
          </div>

          {/* Milestone & Yearly Projection Table */}
          <div className="table-card">
            <div className="table-header-row">
              <div>
                <h3 className="section-subtitle">Yearly Loan Balance & SIP Growth</h3>
                <span className="chart-subtitle-note">
                  {showFullProjection ? 'Showing all years of the loan' : 'Showing key milestones & crossover year'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowFullProjection(!showFullProjection)}
                className="btn-toggle-table"
              >
                {showFullProjection ? 'Show Milestones Only' : 'View Full Projection Table →'}
              </button>
            </div>

            <div className="table-responsive-wrapper">
              <table className="projection-table">
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Calendar</th>
                    <th>Opening Principal</th>
                    <th>Annual EMI Paid</th>
                    <th>Principal Repaid</th>
                    <th>Closing Loan</th>
                    <th>Closing SIP Corpus</th>
                    <th>Net Gap / Surplus</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row) => (
                    <tr
                      key={row.yearNumber}
                      className={row.foreclosureReady ? 'crossover-highlight-row' : ''}
                    >
                      <td className="font-bold">
                        Year {row.yearNumber}
                        {row.foreclosureReady && <span className="row-badge">Covered</span>}
                      </td>
                      <td>{row.calendarYear}</td>
                      <td>{formatIndianCurrency(row.openingLoanPrincipal)}</td>
                      <td>{formatIndianCurrency(row.totalEMIPaid)}</td>
                      <td>{formatIndianCurrency(row.totalPrincipalPaid)}</td>
                      <td className="font-semibold text-navy">{formatIndianCurrency(row.closingLoanPrincipal)}</td>
                      <td className="font-semibold text-teal">{formatIndianCurrency(row.closingSIPCorpus)}</td>
                      <td className={`font-bold ${row.gap <= 0 ? 'text-teal' : 'text-amber'}`}>
                        {row.gap <= 0
                          ? `+${formatIndianCurrency(Math.abs(row.gap))}`
                          : `-${formatIndianCurrency(row.gap)}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Responsible Educational Disclaimer Box */}
          <div className="edu-disclaimer-card">
            <div className="disclaimer-icon">🛡️</div>
            <div className="disclaimer-content">
              <h4 className="disclaimer-heading">Important Educational & Planning Considerations</h4>
              <p className="disclaimer-text">
                This calculator illustrates a mathematical comparison between an accumulating SIP corpus and a decreasing home loan balance. It does <strong>not guarantee investment returns</strong> or recommend that you automatically redeem your investments to repay your loan. Before making any prepayment or foreclosure decision, carefully evaluate capital gains taxes, exit loads, emergency fund buffers, and your family's overall financial goals.
              </p>
            </div>
          </div>

          {/* Accordion: How was this calculated? */}
          <div className="accordion-card">
            <button
              type="button"
              onClick={() => setShowHowItWorks(!showHowItWorks)}
              className="accordion-toggle-btn"
              aria-expanded={showHowItWorks}
            >
              <span className="accordion-title">📐 How was this calculated? (Mathematical Breakdown)</span>
              <span className="accordion-arrow">{showHowItWorks ? '▲' : '▼'}</span>
            </button>

            {showHowItWorks && (
              <div className="accordion-content">
                <div className="calc-formula-block">
                  <h5>1. Standard Monthly Loan EMI</h5>
                  <p>
                    <strong>EMI = P × [i(1+i)^n] / [(1+i)^n - 1]</strong><br />
                    where P = Loan Amount, i = Annual Rate / (12 × 100), and n = Loan Tenure (Years) × 12.
                  </p>
                </div>

                <div className="calc-formula-block">
                  <h5>2. Effective Monthly SIP Compounding Rate</h5>
                  <p>
                    Unlike loans which use simple periodic rates, mutual fund growth uses effective compounding:<br />
                    <strong>i_SIP = (1 + r_annual)^(1/12) - 1</strong><br />
                    For a 12% p.a. expected return, i_SIP = (1.12)^(1/12) - 1 ≈ 0.94888% per month.
                  </p>
                </div>

                <div className="calc-formula-block">
                  <h5>3. Beginning-of-Period SIP Accumulation</h5>
                  <p>
                    SIP installments are deposited at the beginning of each month:<br />
                    <strong>Closing Corpus = (Opening Corpus + Monthly SIP) × (1 + i_SIP)</strong>
                  </p>
                </div>

                <div className="calc-formula-block">
                  <h5>4. Option 1 Required Monthly SIP Formula</h5>
                  <p>
                    For target months n, solving for required monthly SIP:<br />
                    <strong>Required SIP = Outstanding Principal at Month n / [((1 + i_SIP)^n - 1) / i_SIP × (1 + i_SIP)]</strong>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action CTAs: WhatsApp Consultation Bridge */}
          <div className="results-cta-card">
            <div className="cta-content">
              <h3 className="cta-title">Discuss Your Home Loan Strategy with Santhosh</h3>
              <p className="cta-desc">
                Review whether a parallel SIP, partial prepayment, or balanced wealth-accumulation plan is optimal for your tax slab and life goals.
              </p>
            </div>
            <div className="cta-buttons-row">
              <a
                href={generateWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp-action"
              >
                💬 Talk to Santhosh
              </a>
              <a href="/contact" className="btn-secondary-action">
                Book a Free Consultation
              </a>
            </div>
          </div>

          {/* Step Back Action */}
          <div className="results-back-row">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="btn-back"
            >
              ← Modify Inputs & Strategy
            </button>
          </div>
        </div>
      )}

      {/* Component-Specific Styles (Shared styles imported via calculators.css) */}
      <style>{`
        .foreclosure-planner-wrapper {
          width: 100%;
          max-width: 1040px;
          margin: 0 auto;
          font-family: var(--font-body, 'Inter', sans-serif);
          color: var(--color-primary-navy, #00182A);
        }

        /* 4-Item Stepper Grid Override */
        .foreclosure-planner-wrapper .stepper-list {
          grid-template-columns: repeat(4, 1fr);
        }

        /* Strategy Cards Grid */
        .strategy-selection-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .strategy-card {
          background: var(--color-white, #FFFFFF);
          border: 2px solid var(--color-border, #E2E8F0);
          border-radius: var(--radius-md, 14px);
          padding: 1.5rem;
          cursor: pointer;
          transition: all var(--transition-fast, 0.2s ease);
          display: flex;
          flex-direction: column;
        }

        .strategy-card:hover {
          border-color: var(--color-border-subtle, #CBD5E1);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
        }

        .strategy-card:focus-visible {
          outline: 2px solid var(--color-primary-navy, #00182A);
          outline-offset: 2px;
        }

        .strategy-card-active {
          border-color: var(--color-growth-teal, #00AB96) !important;
          background: #F0FDF4;
          box-shadow: 0 8px 24px -4px rgba(0, 171, 150, 0.15);
        }

        .strat-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .strat-radio-circle {
          font-size: 1.25rem;
          color: var(--color-growth-teal, #00AB96);
        }

        .strat-tag {
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          background: var(--color-primary-navy, #00182A);
          color: var(--color-white, #FFFFFF);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        .strat-title {
          font-family: var(--font-heading, 'Outfit', sans-serif);
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--color-primary-navy, #00182A);
          margin: 0 0 0.4rem 0;
        }

        .strat-desc {
          font-size: 0.85rem;
          color: var(--color-slate-text, #475569);
          line-height: 1.45;
          margin: 0 0 1.25rem 0;
        }

        .strat-inner-form {
          margin-top: auto;
          background: var(--color-white, #FFFFFF);
          border: 1px solid var(--color-border-subtle, #CBD5E1);
          border-radius: 10px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .live-strat-preview {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--color-bg-light, #F8FAFC);
          border: 1px solid var(--color-border, #E2E8F0);
          border-radius: 6px;
          padding: 0.5rem 0.75rem;
          margin-top: 0.25rem;
        }

        .preview-lbl {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--color-slate-muted, #64748B);
        }

        .preview-val {
          font-family: var(--font-heading, 'Outfit', sans-serif);
          font-size: 1.05rem;
          font-weight: 800;
        }

        .info-card-box {
          background: var(--color-bg-light, #F8FAFC);
          border: 1px solid var(--color-border, #E2E8F0);
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .info-card-heading {
          font-size: 0.9rem;
          font-weight: 800;
          color: var(--color-primary-navy, #00182A);
          margin: 0;
        }

        .info-card-text {
          font-size: 0.825rem;
          color: var(--color-slate-text, #475569);
          line-height: 1.5;
          margin: 0;
        }

        .rate-badge-row {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          margin-top: 0.25rem;
        }

        .rate-pill {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--color-growth-teal, #00AB96);
          background: var(--color-growth-teal-light, #E6F7F5);
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          width: fit-content;
        }

        .rate-pill-sub {
          font-size: 0.7rem;
          color: var(--color-border, #94A3B8);
        }

        /* SVG Chart Card */
        .chart-card {
          background: var(--color-white, #FFFFFF);
          border: 1.5px solid var(--color-border, #E2E8F0);
          border-radius: var(--radius-lg, 16px);
          padding: 1.75rem;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .section-subtitle {
          font-family: var(--font-heading, 'Outfit', sans-serif);
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--color-primary-navy, #00182A);
          margin: 0 0 0.25rem 0;
        }

        .chart-subtitle-note {
          font-size: 0.8rem;
          color: var(--color-slate-muted, #64748B);
        }

        .chart-legend {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--color-slate-text, #475569);
        }

        .legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .dot-loan { background-color: #F59E0B; }
        .dot-sip { background-color: var(--color-growth-teal, #00AB96); }

        .svg-chart-container {
          position: relative;
          width: 100%;
        }

        .growth-svg {
          width: 100%;
          height: auto;
          overflow: visible;
        }

        .chart-node,
        .chart-crossover-dot {
          cursor: pointer;
          outline: none;
          transition: r var(--transition-fast, 0.2s ease), stroke-width var(--transition-fast, 0.2s ease);
        }

        .chart-node:hover,
        .chart-crossover-dot:hover {
          filter: drop-shadow(0 2px 4px rgba(0, 24, 42, 0.25));
        }

        .chart-node:focus-visible,
        .chart-crossover-dot:focus-visible {
          outline: 2px solid var(--color-primary-navy, #00182A) !important;
          outline-offset: 3px !important;
          filter: drop-shadow(0 0 0 3px rgba(0, 24, 42, 0.25));
        }

        .chart-tooltip-box {
          position: absolute;
          top: 10px;
          right: 20px;
          background: var(--color-primary-navy, #00182A);
          color: var(--color-white, #FFFFFF);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          z-index: 10;
          min-width: 220px;
          pointer-events: none;
        }

        .tt-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.75rem;
          font-weight: 800;
          color: #94A3B8;
          margin-bottom: 0.4rem;
          padding-bottom: 0.35rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .tt-crossover-tag {
          font-size: 0.65rem;
          font-weight: 800;
          background: var(--color-growth-teal, #00AB96);
          color: var(--color-white, #FFFFFF);
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
        }

        .tt-body {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .tt-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
        }

        .tt-lbl { color: #CBD5E1; }
        .tt-val { font-family: var(--font-heading, 'Outfit', sans-serif); font-weight: 700; color: var(--color-white, #FFFFFF); }

        /* Journey Track */
        .journey-track-card {
          background: var(--color-white, #FFFFFF);
          border: 1.5px solid var(--color-border, #E2E8F0);
          border-radius: var(--radius-lg, 16px);
          padding: 1.75rem;
        }

        .journey-flow-row {
          display: grid;
          grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr;
          align-items: center;
          gap: 0.75rem;
          margin-top: 1.25rem;
        }

        .journey-step-box {
          background: var(--color-bg-light, #F8FAFC);
          border: 1px solid var(--color-border, #E2E8F0);
          border-radius: 10px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          text-align: center;
        }

        .highlight-step-box {
          border-color: var(--color-growth-teal, #00AB96);
          background: var(--color-growth-teal-light, #E6F7F5);
        }

        .j-icon {
          font-size: 1.5rem;
          margin-bottom: 0.25rem;
        }

        .j-step-lbl {
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--color-slate-muted, #64748B);
        }

        .j-step-val {
          font-family: var(--font-heading, 'Outfit', sans-serif);
          font-size: 1.05rem;
          font-weight: 800;
        }

        .j-step-desc {
          font-size: 0.7rem;
          color: var(--color-slate-muted, #64748B);
          line-height: 1.35;
        }

        .journey-flow-arrow {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--color-growth-teal, #00AB96);
        }

        /* Table Card */
        .table-card {
          background: var(--color-white, #FFFFFF);
          border: 1.5px solid var(--color-border, #E2E8F0);
          border-radius: var(--radius-lg, 16px);
          padding: 1.75rem;
        }

        .table-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn-toggle-table {
          background: var(--color-bg-subtle, #F1F5F9);
          border: 1px solid var(--color-border-subtle, #CBD5E1);
          color: var(--color-primary-navy, #00182A);
          font-size: 0.8rem;
          font-weight: 700;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-sm, 8px);
          cursor: pointer;
          transition: all var(--transition-fast, 0.2s ease);
        }

        .btn-toggle-table:hover {
          background: var(--color-border, #E2E8F0);
          border-color: var(--color-growth-teal, #00AB96);
          color: var(--color-growth-teal, #00AB96);
        }

        .btn-toggle-table:focus-visible {
          outline: 2px solid var(--color-primary-navy, #00182A);
          outline-offset: 2px;
        }

        .table-responsive-wrapper {
          overflow-x: auto;
        }

        .projection-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }

        .projection-table th {
          background: var(--color-bg-light, #F8FAFC);
          color: var(--color-slate-text, #475569);
          font-weight: 700;
          text-align: right;
          padding: 0.75rem 0.85rem;
          border-bottom: 1.5px solid var(--color-border, #E2E8F0);
          white-space: nowrap;
        }

        .projection-table th:first-child,
        .projection-table th:nth-child(2) {
          text-align: left;
        }

        .projection-table td {
          padding: 0.75rem 0.85rem;
          border-bottom: 1px solid var(--color-border-subtle, #F1F5F9);
          text-align: right;
          white-space: nowrap;
        }

        .projection-table td:first-child,
        .projection-table td:nth-child(2) {
          text-align: left;
        }

        .crossover-highlight-row {
          background: #F0FDF4 !important;
        }

        .row-badge {
          font-size: 0.65rem;
          font-weight: 800;
          background: var(--color-growth-teal, #00AB96);
          color: var(--color-white, #FFFFFF);
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
          margin-left: 0.4rem;
          display: inline-block;
        }

        /* Educational Disclaimer */
        .edu-disclaimer-card {
          display: flex;
          gap: 1rem;
          background: var(--color-bg-light, #F8FAFC);
          border: 1.5px solid var(--color-border-subtle, #CBD5E1);
          border-left: 4px solid var(--color-growth-teal, #00AB96);
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
        }

        .disclaimer-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .disclaimer-heading {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--color-primary-navy, #00182A);
          margin: 0 0 0.35rem 0;
        }

        .disclaimer-text {
          font-size: 0.825rem;
          color: var(--color-slate-text, #475569);
          line-height: 1.55;
          margin: 0;
        }

        /* CTA Card Custom Layout */
        .results-cta-card {
          background: linear-gradient(135deg, var(--color-primary-navy, #00182A) 0%, #002B49 100%);
          border-radius: 16px;
          padding: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
          color: var(--color-white, #FFFFFF);
          box-shadow: 0 12px 30px rgba(0, 24, 42, 0.2);
        }

        .cta-content {
          max-width: 520px;
          text-align: left;
        }

        .cta-title {
          font-family: var(--font-heading, 'Outfit', sans-serif);
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--color-white, #FFFFFF);
          margin: 0 0 0.35rem 0;
        }

        .cta-desc {
          font-size: 0.875rem;
          color: #CBD5E1;
          margin: 0;
          line-height: 1.5;
        }

        .cta-buttons-row {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          flex-shrink: 0;
        }

        .btn-whatsapp-action {
          display: inline-block;
          background: var(--color-growth-teal, #00AB96);
          color: var(--color-white, #FFFFFF);
          font-size: 0.9rem;
          font-weight: 700;
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius-sm, 8px);
          text-decoration: none;
          text-align: center;
          transition: all var(--transition-fast, 0.2s ease);
        }

        .btn-whatsapp-action:hover {
          background: var(--color-growth-teal-hover, #008f7d);
          transform: translateY(-1px);
        }

        .btn-whatsapp-action:focus-visible {
          outline: 2px solid var(--color-white);
          outline-offset: 2px;
        }

        .btn-secondary-action {
          display: inline-block;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: var(--color-white, #FFFFFF);
          font-size: 0.85rem;
          font-weight: 600;
          padding: 0.6rem 1.25rem;
          border-radius: var(--radius-sm, 8px);
          text-decoration: none;
          text-align: center;
          transition: all var(--transition-fast, 0.2s ease);
        }

        .btn-secondary-action:hover {
          background: rgba(255, 255, 255, 0.18);
        }

        .btn-secondary-action:focus-visible {
          outline: 2px solid var(--color-white);
          outline-offset: 2px;
        }

        .results-back-row {
          display: flex;
          justify-content: flex-start;
        }

        /* Mobile Responsiveness for component-specific cards */
        @media (max-width: 1024px) {
          .journey-flow-row {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .journey-flow-arrow {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .foreclosure-planner-wrapper .stepper-list {
            grid-template-columns: repeat(2, 1fr);
          }
          .strategy-selection-grid {
            grid-template-columns: 1fr;
          }
          .results-cta-card {
            flex-direction: column;
            align-items: flex-start;
          }
          .cta-buttons-row {
            width: 100%;
          }
          .btn-whatsapp-action,
          .btn-secondary-action {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .foreclosure-planner-wrapper .stepper-list {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
