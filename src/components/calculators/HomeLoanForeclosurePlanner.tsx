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
      ? `${targetClosureYears} years`
      : result.foreclosureMonth
        ? formatYearsAndMonths(result.foreclosureMonth)
        : 'N/A';

    const message = `Hi Santhosh, I used the Home Loan Foreclosure Planner on Ant Wealth Creation.
Loan Amount: ${formattedLoan} | Tenure: ${loanTenureYears} Years | Interest: ${loanInterestRate}% (EMI: ${formattedEMI}/mo)
Strategy: ${strategy === 'targetYear' ? `Target ${targetClosureYears}-Year Closure` : `Fixed SIP of ${formattedSIP}/mo`}
Expected Return: ${sipReturnRate}%
Projected Coverage Timeline: ${timeline} | Projected SIP Corpus: ${formatLakhsCrores(result.SIPCorpusAtTarget)}

I would like to understand whether this parallel SIP strategy fits my overall financial plan.`;

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
                <span className="rate-pill-sub">Beginning-of-month Annuity Due timing</span>
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
                  aria-label="Interactive Home Loan vs SIP Corpus Crossover Chart"
                >
                  <defs>
                    <linearGradient id="sipAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00AB96" stopOpacity="0.30" />
                      <stop offset="100%" stopColor="#00AB96" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid Lines */}
                  {[0.25, 0.5, 0.75, 1].map((pct, idx) => {
                    const yPos = padding.top + graphHeight * (1 - pct);
                    return (
                      <g key={idx}>
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
                    x1={padding.left}
                    y1={padding.top + graphHeight}
                    x2={padding.left + graphWidth}
                    y2={padding.top + graphHeight}
                    stroke="#CBD5E1"
                    strokeWidth="1.5"
                  />

                  {/* Shaded Area for SIP Growth */}
                  <path d={chartData.sipAreaD} fill="url(#sipAreaGradient)" />

                  {/* Outstanding Loan Principal Curve (Amber/Coral) */}
                  <path
                    d={chartData.loanPathD}
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Projected SIP Corpus Curve (Growth Teal) */}
                  <path
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
                        r="6"
                        fill="#00182A"
                        stroke="#00AB96"
                        strokeWidth="3"
                      />
                      <rect
                        x={Math.max(padding.left, chartData.crossoverX - 75)}
                        y={Math.max(padding.top, chartData.crossoverY - 32)}
                        width="150"
                        height="24"
                        rx="12"
                        fill="#00182A"
                      />
                      <text
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
                          className="chart-node"
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
                          className="chart-node"
                          onMouseEnter={() => setActiveChartPoint(idx)}
                          onTouchStart={() => setActiveChartPoint(idx)}
                        />

                        {/* X-axis Year Label */}
                        {(pt.yearNumber === 0 || pt.yearNumber % 5 === 0 || pt.yearNumber === result.loanTenureYears) && (
                          <text
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
                <h3 className="section-subtitle">Yearly Loan Amortization & SIP Accumulation</h3>
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
                This calculator illustrates a mathematical comparison between an accumulating SIP corpus and an amortizing home loan. It does <strong>not guarantee investment returns</strong> or recommend that you automatically redeem your investments to repay your loan. Before making any prepayment or foreclosure decision, carefully evaluate capital gains taxes, exit loads, emergency fund buffers, and your family's overall financial goals.
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
                    For target months n, solving for required monthly annuity due:<br />
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
                💬 Discuss on WhatsApp →
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

      {/* Styled JSX CSS */}
      <style>{`
        .foreclosure-planner-wrapper {
          width: 100%;
          max-width: 1040px;
          margin: 0 auto;
          font-family: 'Inter', sans-serif;
          color: #00182A;
        }

        /* Top Action Bar */
        .calc-top-action-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 0.75rem 1.25rem;
          margin-bottom: 1.5rem;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .action-tagline {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: #475569;
        }

        .live-pulse {
          width: 8px;
          height: 8px;
          background-color: #00AB96;
          border-radius: 50%;
          box-shadow: 0 0 0 3px rgba(0, 171, 150, 0.2);
        }

        .action-btn-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .btn-sample-preset {
          background: #F1F5F9;
          border: 1px solid #CBD5E1;
          color: #00182A;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 0.4rem 0.85rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-sample-preset:hover {
          background: #E2E8F0;
          border-color: #00AB96;
          color: #00AB96;
        }

        .btn-reset-preset {
          background: transparent;
          border: 1px solid #E2E8F0;
          color: #64748B;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.4rem 0.75rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-reset-preset:hover {
          background: #FEE2E2;
          border-color: #EF4444;
          color: #DC2626;
        }

        /* Stepper Navigation */
        .stepper-nav {
          margin-bottom: 2rem;
        }

        .stepper-list {
          display: flex;
          justify-content: space-between;
          list-style: none;
          padding: 0;
          margin: 0;
          gap: 0.5rem;
        }

        .stepper-item {
          flex: 1;
        }

        .stepper-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .stepper-btn.active {
          border-color: #00182A;
          background: #00182A;
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(0, 24, 42, 0.15);
        }

        .stepper-btn.completed {
          border-color: #00AB96;
          background: #F0FDF4;
          color: #00182A;
        }

        .results-stepper-btn.active {
          background: #00AB96 !important;
          border-color: #00AB96 !important;
        }

        .step-num {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #F1F5F9;
          color: #00182A;
          font-size: 0.75rem;
          font-weight: 800;
          flex-shrink: 0;
        }

        .stepper-btn.active .step-num {
          background: #00AB96;
          color: #FFFFFF;
        }

        .stepper-btn.completed .step-num {
          background: #00AB96;
          color: #FFFFFF;
        }

        .step-label {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          font-weight: 700;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .step-icon-sm {
          font-size: 0.95rem;
        }

        /* Step Card */
        .step-card {
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 16px;
          padding: 2.25rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(0, 24, 42, 0.04);
        }

        .step-header {
          margin-bottom: 1.75rem;
        }

        .step-badge {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #00AB96;
          background: #E6F7F5;
          padding: 0.2rem 0.65rem;
          border-radius: 4px;
          margin-bottom: 0.5rem;
        }

        .step-heading {
          font-family: 'Outfit', sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          color: #00182A;
          margin: 0 0 0.4rem 0;
        }

        .step-description {
          font-size: 0.95rem;
          color: #64748B;
          margin: 0;
          line-height: 1.5;
        }

        /* Form Controls */
        .inputs-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        .mt-2 {
          margin-top: 1.5rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .input-label {
          font-size: 0.875rem;
          font-weight: 700;
          color: #1E293B;
        }

        .currency-input-wrapper {
          display: flex;
          align-items: center;
          background: #F8FAFC;
          border: 1.5px solid #CBD5E1;
          border-radius: 8px;
          padding: 0.4rem 0.75rem;
          transition: border-color 0.2s;
        }

        .currency-input-wrapper:focus-within {
          border-color: #00AB96;
          background: #FFFFFF;
        }

        .currency-symbol {
          color: #64748B;
          font-weight: 700;
          font-size: 1rem;
          margin-right: 0.25rem;
        }

        .currency-field {
          width: 100%;
          border: none;
          background: transparent;
          font-size: 1rem;
          font-weight: 700;
          color: #00182A;
          outline: none;
        }

        .unit-tag {
          font-size: 0.8rem;
          font-weight: 700;
          color: #00AB96;
          background: #E6F7F5;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          white-space: nowrap;
          margin-left: 0.5rem;
        }

        .input-helper {
          font-size: 0.75rem;
          color: #64748B;
          line-height: 1.4;
        }

        .slider-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .slider-value-display {
          display: flex;
          justify-content: space-between;
          font-size: 0.95rem;
          font-weight: 800;
          color: #00182A;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 6px;
          padding: 0.35rem 0.75rem;
        }

        .range-slider {
          width: 100%;
          height: 6px;
          background: #E2E8F0;
          border-radius: 999px;
          outline: none;
          -webkit-appearance: none;
          accent-color: #00AB96;
          cursor: pointer;
          margin: 0.5rem 0 0.25rem;
        }

        .slider-ticks {
          display: flex;
          justify-content: space-between;
          font-size: 0.7rem;
          color: #94A3B8;
          font-weight: 600;
        }

        /* Live Preview Row Box */
        .live-preview-box {
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
          margin-top: 1.75rem;
        }

        .preview-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .preview-item {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          flex: 1;
        }

        .p-divider {
          width: 1px;
          height: 36px;
          background: #E2E8F0;
        }

        .p-lbl {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748B;
        }

        .p-val {
          font-family: 'Outfit', sans-serif;
          font-size: 1.25rem;
          font-weight: 800;
        }

        .text-navy { color: #00182A; }
        .text-teal { color: #00AB96; }
        .text-gold { color: #D97706; }
        .text-amber { color: #F59E0B; }
        .font-bold { font-weight: 700; }
        .font-semibold { font-weight: 600; }

        /* Strategy Cards Grid */
        .strategy-selection-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .strategy-card {
          background: #FFFFFF;
          border: 2px solid #E2E8F0;
          border-radius: 14px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
        }

        .strategy-card:hover {
          border-color: #CBD5E1;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
        }

        .strategy-card-active {
          border-color: #00AB96 !important;
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
          color: #00AB96;
        }

        .strat-tag {
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          background: #00182A;
          color: #FFFFFF;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        .strat-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.2rem;
          font-weight: 800;
          color: #00182A;
          margin: 0 0 0.4rem 0;
        }

        .strat-desc {
          font-size: 0.85rem;
          color: #475569;
          line-height: 1.45;
          margin: 0 0 1.25rem 0;
        }

        .strat-inner-form {
          margin-top: auto;
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
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
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 6px;
          padding: 0.5rem 0.75rem;
          margin-top: 0.25rem;
        }

        .preview-lbl {
          font-size: 0.8rem;
          font-weight: 700;
          color: #64748B;
        }

        .preview-val {
          font-family: 'Outfit', sans-serif;
          font-size: 1.05rem;
          font-weight: 800;
        }

        .info-card-box {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .info-card-heading {
          font-size: 0.9rem;
          font-weight: 800;
          color: #00182A;
          margin: 0;
        }

        .info-card-text {
          font-size: 0.825rem;
          color: #475569;
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
          color: #00AB96;
          background: #E6F7F5;
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          width: fit-content;
        }

        .rate-pill-sub {
          font-size: 0.7rem;
          color: #94A3B8;
        }

        /* Step Actions */
        .step-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #E2E8F0;
        }

        .btn-continue {
          background: #00182A;
          color: #FFFFFF;
          font-size: 0.95rem;
          font-weight: 700;
          padding: 0.85rem 1.75rem;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-continue:hover {
          background: #002B49;
          transform: translateY(-1px);
        }

        .btn-back {
          background: transparent;
          color: #64748B;
          font-size: 0.9rem;
          font-weight: 700;
          padding: 0.75rem 1.25rem;
          border-radius: 8px;
          border: 1px solid #CBD5E1;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-back:hover {
          background: #F1F5F9;
          color: #00182A;
        }

        .btn-view-results {
          background: #00AB96;
          color: #FFFFFF;
          font-size: 1rem;
          font-weight: 800;
          padding: 0.9rem 2rem;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(0, 171, 150, 0.25);
        }

        .btn-view-results:hover {
          background: #008f7d;
          transform: translateY(-1px);
        }

        /* RESULTS DASHBOARD */
        .results-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .results-hero-card {
          background: linear-gradient(135deg, #00182A 0%, #002B49 100%);
          border-radius: 20px;
          padding: 2.5rem 2rem;
          text-align: center;
          color: #FFFFFF;
          box-shadow: 0 16px 36px -10px rgba(0, 24, 42, 0.25);
        }

        .hero-eyebrow {
          font-size: 0.8rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #00AB96;
          margin-bottom: 0.5rem;
        }

        .hero-heading {
          font-family: 'Outfit', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 1.5rem 0;
          line-height: 1.25;
        }

        .primary-result-box {
          background: #FFFFFF;
          border-radius: 14px;
          padding: 1.5rem 2rem;
          max-width: 580px;
          margin: 0 auto 1.5rem auto;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }

        .result-tag {
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #00AB96;
          display: block;
          margin-bottom: 0.25rem;
        }

        .result-main-number {
          font-family: 'Outfit', sans-serif;
          font-size: 2.75rem;
          font-weight: 800;
          color: #00182A;
          line-height: 1.1;
          margin-bottom: 0.35rem;
        }

        .result-exact-number {
          font-size: 0.9rem;
          font-weight: 600;
          color: #475569;
        }

        .hero-disclaimer-note {
          font-size: 0.95rem;
          color: #CBD5E1;
          max-width: 720px;
          margin: 0 auto;
          line-height: 1.5;
        }

        /* 4 Metrics Grid */
        .metrics-four-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }

        .metric-card {
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .metric-card.highlight-metric {
          border-color: #00AB96;
          background: #F0FDF4;
        }

        .m-card-lbl {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748B;
        }

        .m-card-val {
          font-family: 'Outfit', sans-serif;
          font-size: 1.4rem;
          font-weight: 800;
        }

        .m-card-sub {
          font-size: 0.75rem;
          color: #64748B;
          margin-top: auto;
        }

        /* SVG Chart Card */
        .chart-card {
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 16px;
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
          font-family: 'Outfit', sans-serif;
          font-size: 1.25rem;
          font-weight: 800;
          color: #00182A;
          margin: 0 0 0.25rem 0;
        }

        .chart-subtitle-note {
          font-size: 0.8rem;
          color: #64748B;
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
          color: #475569;
        }

        .legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .dot-loan { background-color: #F59E0B; }
        .dot-sip { background-color: #00AB96; }

        .svg-chart-container {
          position: relative;
          width: 100%;
        }

        .growth-svg {
          width: 100%;
          height: auto;
          overflow: visible;
        }

        .chart-node {
          cursor: pointer;
          transition: r 0.2s ease;
        }

        .chart-tooltip-box {
          position: absolute;
          top: 10px;
          right: 20px;
          background: #00182A;
          color: #FFFFFF;
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
          background: #00AB96;
          color: #FFFFFF;
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
        .tt-val { font-family: 'Outfit', sans-serif; font-weight: 700; color: #FFFFFF; }

        /* Journey Track */
        .journey-track-card {
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 16px;
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
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          text-align: center;
        }

        .highlight-step-box {
          border-color: #00AB96;
          background: #E6F7F5;
        }

        .j-icon {
          font-size: 1.5rem;
          margin-bottom: 0.25rem;
        }

        .j-step-lbl {
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          color: #64748B;
        }

        .j-step-val {
          font-family: 'Outfit', sans-serif;
          font-size: 1.05rem;
          font-weight: 800;
        }

        .j-step-desc {
          font-size: 0.7rem;
          color: #64748B;
          line-height: 1.35;
        }

        .journey-flow-arrow {
          font-size: 1.25rem;
          font-weight: 800;
          color: #00AB96;
        }

        /* Table Card */
        .table-card {
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 16px;
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
          background: #F1F5F9;
          border: 1px solid #CBD5E1;
          color: #00182A;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-toggle-table:hover {
          background: #E2E8F0;
          border-color: #00AB96;
          color: #00AB96;
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
          background: #F8FAFC;
          color: #475569;
          font-weight: 700;
          text-align: right;
          padding: 0.75rem 0.85rem;
          border-bottom: 1.5px solid #E2E8F0;
          white-space: nowrap;
        }

        .projection-table th:first-child,
        .projection-table th:nth-child(2) {
          text-align: left;
        }

        .projection-table td {
          padding: 0.75rem 0.85rem;
          border-bottom: 1px solid #F1F5F9;
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
          background: #00AB96;
          color: #FFFFFF;
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
          margin-left: 0.4rem;
          display: inline-block;
        }

        /* Educational Disclaimer */
        .edu-disclaimer-card {
          display: flex;
          gap: 1rem;
          background: #F8FAFC;
          border: 1.5px solid #CBD5E1;
          border-left: 4px solid #00AB96;
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
          color: #00182A;
          margin: 0 0 0.35rem 0;
        }

        .disclaimer-text {
          font-size: 0.825rem;
          color: #475569;
          line-height: 1.55;
          margin: 0;
        }

        /* Accordion */
        .accordion-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          overflow: hidden;
        }

        .accordion-toggle-btn {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #FFFFFF;
          border: none;
          padding: 1rem 1.25rem;
          font-size: 0.9rem;
          font-weight: 700;
          color: #00182A;
          cursor: pointer;
          text-align: left;
        }

        .accordion-toggle-btn:hover {
          background: #F8FAFC;
        }

        .accordion-content {
          padding: 1.25rem;
          background: #F8FAFC;
          border-top: 1px solid #E2E8F0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .calc-formula-block h5 {
          font-size: 0.85rem;
          font-weight: 800;
          color: #00182A;
          margin: 0 0 0.25rem 0;
        }

        .calc-formula-block p {
          font-size: 0.8rem;
          color: #475569;
          line-height: 1.5;
          margin: 0;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 6px;
          padding: 0.5rem 0.75rem;
        }

        /* CTA Card */
        .results-cta-card {
          background: linear-gradient(135deg, #00182A 0%, #002B49 100%);
          border-radius: 16px;
          padding: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
          color: #FFFFFF;
          box-shadow: 0 12px 30px rgba(0, 24, 42, 0.2);
        }

        .cta-content {
          max-width: 520px;
        }

        .cta-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.35rem;
          font-weight: 800;
          color: #FFFFFF;
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
          background: #00AB96;
          color: #FFFFFF;
          font-size: 0.9rem;
          font-weight: 700;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          text-decoration: none;
          text-align: center;
          transition: all 0.2s ease;
        }

        .btn-whatsapp-action:hover {
          background: #008f7d;
          transform: translateY(-1px);
        }

        .btn-secondary-action {
          display: inline-block;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #FFFFFF;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 0.6rem 1.25rem;
          border-radius: 8px;
          text-decoration: none;
          text-align: center;
          transition: all 0.2s ease;
        }

        .btn-secondary-action:hover {
          background: rgba(255, 255, 255, 0.18);
        }

        .results-back-row {
          display: flex;
          justify-content: flex-start;
        }

        /* Mobile Responsiveness */
        @media (max-width: 1024px) {
          .metrics-four-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .journey-flow-row {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .journey-flow-arrow {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .stepper-list {
            flex-wrap: wrap;
          }
          .stepper-item {
            flex: 1 1 45%;
          }
          .inputs-grid {
            grid-template-columns: 1fr;
          }
          .strategy-selection-grid {
            grid-template-columns: 1fr;
          }
          .preview-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
          .p-divider {
            display: none;
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
          .step-card {
            padding: 1.25rem 1rem;
          }
          .hero-heading {
            font-size: 1.4rem;
          }
          .result-main-number {
            font-size: 2rem;
          }
          .metrics-four-grid {
            grid-template-columns: 1fr;
          }
          .stepper-item {
            flex: 1 1 100%;
          }
        }
      `}</style>
    </div>
  );
}
