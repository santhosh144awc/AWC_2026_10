import React, { useState, useId, useMemo } from 'react';
import {
  calculateSIPGrowthPlan,
  formatIndianCurrency,
  formatLakhsCrores,
  formatPercentage,
  type LumpSumInvestment,
  type SIPGrowthInputs
} from '../../utils/calculations/sipGrowthPlanner';

type WizardStep = 1 | 2 | 3 | 4 | 'results';

export default function SIPGrowthPlanner() {
  const baseId = useId();

  // Wizard Navigation
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);

  // Step 1: Starting SIP
  const [monthlySIP, setMonthlySIP] = useState<number>(20000);
  const [sipDuration, setSipDuration] = useState<number>(20);

  // Step 2: Annual Step-Up
  const [stepUpRate, setStepUpRate] = useState<number>(10);
  const [stepUpDuration, setStepUpDuration] = useState<number>(20);

  // Step 3: Return & Horizon
  const [annualReturn, setAnnualReturn] = useState<number>(10);
  const [postSipYears, setPostSipYears] = useState<number>(0);

  // Step 4: Lump-Sum Investments
  const [lumpSums, setLumpSums] = useState<LumpSumInvestment[]>([
    { id: '1', year: 5, amount: 500000 },
    { id: '2', year: 11, amount: 500000 }
  ]);

  // New Lump Sum Temp Form
  const [newLumpYear, setNewLumpYear] = useState<number>(1);
  const [newLumpAmount, setNewLumpAmount] = useState<number>(100000);

  // Chart Hover State
  const [activeChartPoint, setActiveChartPoint] = useState<number | null>(null);

  // Accordions
  const [showFullProjection, setShowFullProjection] = useState<boolean>(false);
  const [showHowItWorks, setShowHowItWorks] = useState<boolean>(false);

  // Total Investment Duration
  const totalDuration = sipDuration + postSipYears;

  // Calculate Result
  const planInput: SIPGrowthInputs = useMemo(() => ({
    monthlySIP,
    sipDurationYears: sipDuration,
    stepUpRate,
    stepUpDurationYears: stepUpDuration,
    annualReturnRate: annualReturn,
    postSipYears,
    lumpSums
  }), [
    monthlySIP,
    sipDuration,
    stepUpRate,
    stepUpDuration,
    annualReturn,
    postSipYears,
    lumpSums
  ]);

  const result = useMemo(() => calculateSIPGrowthPlan(planInput), [planInput]);

  // Handlers for Lump Sum Entries
  const handleAddLumpSum = () => {
    if (newLumpYear > 0 && newLumpYear <= totalDuration && newLumpAmount > 0) {
      const newEntry: LumpSumInvestment = {
        id: Date.now().toString(),
        year: newLumpYear,
        amount: newLumpAmount
      };
      setLumpSums([...lumpSums, newEntry]);
      setNewLumpAmount(100000);
    }
  };

  const handleDeleteLumpSum = (id: string) => {
    setLumpSums(lumpSums.filter((item) => item.id !== id));
  };

  const handleUpdateLumpSum = (id: string, field: 'year' | 'amount', value: number) => {
    setLumpSums(
      lumpSums.map((item) =>
        item.id === id ? { ...item, [field]: Math.max(0, value) } : item
      )
    );
  };

  // Load Benchmark Scenario
  const handleLoadSampleData = () => {
    setMonthlySIP(20000);
    setSipDuration(20);
    setStepUpRate(10);
    setStepUpDuration(20);
    setAnnualReturn(10);
    setPostSipYears(0);
    setLumpSums([
      { id: '1', year: 5, amount: 500000 },
      { id: '2', year: 11, amount: 500000 }
    ]);
    setCurrentStep('results');
  };

  // Reset to Baseline Defaults
  const handleReset = () => {
    setMonthlySIP(15000);
    setSipDuration(15);
    setStepUpRate(10);
    setStepUpDuration(10);
    setAnnualReturn(12);
    setPostSipYears(0);
    setLumpSums([]);
    setCurrentStep(1);
  };

  // WhatsApp Prepopulated Deep Link
  const generateWhatsAppUrl = () => {
    const corpus = formatLakhsCrores(result.finalCorpus);
    const invested = formatLakhsCrores(result.totalInvested);
    const wealth = formatLakhsCrores(result.wealthCreated);
    const sip = formatIndianCurrency(monthlySIP);

    const message = `Hi Santhosh, I used the SIP Growth Planner on Ant Wealth Creation.

• Monthly SIP: ${sip}/month (${sipDuration} Years)
• Total Invested: ${invested}
• Estimated Final Corpus: ${corpus}
• Wealth Created: ${wealth}

Can we connect to discuss this plan?`;

    return `https://wa.me/918087971566?text=${encodeURIComponent(message)}`;
  };

  // SVG Chart Dimensions
  const chartWidth = 720;
  const chartHeight = 280;
  const padding = { top: 20, right: 30, bottom: 40, left: 60 };
  const graphWidth = chartWidth - padding.left - padding.right;
  const graphHeight = chartHeight - padding.top - padding.bottom;

  const maxCorpus = useMemo(() => {
    const maxVal = Math.max(...result.projection.map((p) => p.closingCorpus), 100000);
    return maxVal * 1.05;
  }, [result.projection]);

  const chartPoints = useMemo(() => {
    if (result.projection.length === 0) return [];
    return result.projection.map((p, idx) => {
      const x = padding.left + (idx / Math.max(1, result.projection.length - 1)) * graphWidth;
      const y = padding.top + graphHeight - (p.closingCorpus / maxCorpus) * graphHeight;
      return { ...p, x, y };
    });
  }, [result.projection, maxCorpus, graphWidth, graphHeight, padding.left, padding.top]);

  const svgPathData = useMemo(() => {
    if (chartPoints.length === 0) return '';
    const first = chartPoints[0];
    const pathD = chartPoints.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');
    const last = chartPoints[chartPoints.length - 1];
    const areaD = `${pathD} L ${last.x} ${padding.top + graphHeight} L ${first.x} ${padding.top + graphHeight} Z`;
    return { line: pathD, area: areaD };
  }, [chartPoints, padding.top, graphHeight]);

  return (
    <div className="sip-planner-wrapper">
      {/* Top Action Bar: Sample Scenario & Reset */}
      <div className="calc-top-action-bar">
        <div className="action-tagline">
          <span className="live-pulse"></span>
          <span>Annual Step-Up & Multi-Lump-Sum Compounding</span>
        </div>
        <div className="action-btn-group">
          <button
            type="button"
            onClick={handleLoadSampleData}
            className="btn-sample-preset"
            title="Load ₹20k/mo, 20 yrs, 10% step-up sample scenario"
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

      {/* Stepper Navigation (4 Steps + Results) */}
      <nav className="stepper-nav" aria-label="Calculator Steps">
        <ol className="stepper-list">
          {[
            { step: 1, title: 'Starting SIP', icon: '📈' },
            { step: 2, title: 'Step-Up Rate', icon: '🚀' },
            { step: 3, title: 'Return & Time', icon: '⏳' },
            { step: 4, title: 'Lump Sums', icon: '💰' },
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

      {/* STEP 1: STARTING SIP */}
      {currentStep === 1 && (
        <section className="step-card" aria-labelledby="step1-title">
          <div className="step-header">
            <div className="step-badge">Step 1 of 4</div>
            <h2 id="step1-title" className="step-heading">
              Start with Your Monthly SIP
            </h2>
            <p className="step-description">
              Enter your initial monthly investment amount and planned SIP duration. Contributions are modeled at beginning-of-month timing.
            </p>
          </div>

          <div className="inputs-grid">
            <div className="input-group">
              <label htmlFor={`${baseId}-sipAmount`} className="input-label">
                Initial Monthly SIP Amount (₹) *
              </label>
              <div className="currency-input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  id={`${baseId}-sipAmount`}
                  type="number"
                  min="500"
                  step="1000"
                  value={monthlySIP || ''}
                  onChange={(e) => setMonthlySIP(Math.max(0, Number(e.target.value)))}
                  placeholder="20000"
                  className="currency-field"
                />
                <span className="unit-tag">{formatLakhsCrores(monthlySIP)}/mo</span>
              </div>
              <span className="input-helper">Amount you plan to invest every month in Year 1</span>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-sipDuration`} className="input-label">
                SIP Duration (Years) *
              </label>
              <div className="slider-group">
                <div className="slider-value-display">
                  <span>{sipDuration} Years</span>
                </div>
                <input
                  id={`${baseId}-sipDuration`}
                  type="range"
                  min="1"
                  max="40"
                  step="1"
                  value={sipDuration}
                  onChange={(e) => {
                    const newDur = Number(e.target.value);
                    setSipDuration(newDur);
                    if (stepUpDuration > newDur) setStepUpDuration(newDur);
                  }}
                  className="range-slider"
                />
                <div className="slider-ticks">
                  <span>1 yr</span>
                  <span>10 yrs</span>
                  <span>20 yrs</span>
                  <span>40 yrs</span>
                </div>
              </div>
              <span className="input-helper">How many years will you continue making regular monthly contributions?</span>
            </div>
          </div>

          {/* Step 1 Live Summary Box */}
          <div className="live-preview-box">
            <div className="preview-row">
              <div className="preview-item">
                <span className="p-lbl">Year 1 Monthly Outflow</span>
                <span className="p-val text-navy">{formatIndianCurrency(monthlySIP)}/mo</span>
              </div>
              <div className="p-divider"></div>
              <div className="preview-item">
                <span className="p-lbl">Year 1 Annual Contribution</span>
                <span className="p-val text-teal">{formatLakhsCrores(monthlySIP * 12)}/yr</span>
              </div>
              <div className="p-divider"></div>
              <div className="preview-item">
                <span className="p-lbl">Flat Contributions (Without Step-Up)</span>
                <span className="p-val text-gold">{formatLakhsCrores(monthlySIP * 12 * sipDuration)}</span>
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
              Continue to Annual Step-Up →
            </button>
          </div>
        </section>
      )}

      {/* STEP 2: ANNUAL STEP-UP */}
      {currentStep === 2 && (
        <section className="step-card" aria-labelledby="step2-title">
          <div className="step-header">
            <div className="step-badge">Step 2 of 4</div>
            <h2 id="step2-title" className="step-heading">
              Increase Your SIP as Your Income Grows
            </h2>
            <p className="step-description">
              An annual step-up increases your monthly SIP once each year. After the step-up duration ends, your SIP stays at the last stepped-up amount for the remainder of your SIP period.
            </p>
          </div>

          <div className="inputs-grid">
            <div className="input-group">
              <label htmlFor={`${baseId}-stepUpRate`} className="input-label">
                Annual Step-Up Rate (% per year)
              </label>
              <div className="slider-group">
                <div className="slider-value-display">
                  <span>{stepUpRate}% Annual Increase</span>
                </div>
                <input
                  id={`${baseId}-stepUpRate`}
                  type="range"
                  min="0"
                  max="30"
                  step="1"
                  value={stepUpRate}
                  onChange={(e) => setStepUpRate(Number(e.target.value))}
                  className="range-slider"
                />
                <div className="slider-ticks">
                  <span>0% (Flat)</span>
                  <span>10% (Recommended)</span>
                  <span>20%</span>
                  <span>30%</span>
                </div>
              </div>
              <span className="input-helper">Aligns your investments with salary increments and inflation</span>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-stepUpDuration`} className="input-label">
                Step-Up Duration (Years)
              </label>
              <div className="slider-group">
                <div className="slider-value-display">
                  <span>{stepUpDuration} Years (out of {sipDuration} yrs SIP)</span>
                </div>
                <input
                  id={`${baseId}-stepUpDuration`}
                  type="range"
                  min="1"
                  max={sipDuration}
                  step="1"
                  value={stepUpDuration}
                  onChange={(e) => setStepUpDuration(Number(e.target.value))}
                  className="range-slider"
                />
                <div className="slider-ticks">
                  <span>1 yr</span>
                  <span>{Math.round(sipDuration / 2)} yrs</span>
                  <span>{sipDuration} yrs (Full Duration)</span>
                </div>
              </div>
              <span className="input-helper">Number of years your SIP will continue to step up</span>
            </div>
          </div>

          {/* Step-Up Progression Preview */}
          <div className="progression-preview-card">
            <h4 className="progression-title">Projected Monthly SIP Progression</h4>
            <div className="progression-track">
              <div className="prog-step">
                <span className="prog-yr">Year 1</span>
                <span className="prog-val">{formatIndianCurrency(monthlySIP)}</span>
                <span className="prog-sub">Starting</span>
              </div>
              <div className="prog-arrow">→</div>
              <div className="prog-step">
                <span className="prog-yr">Year 2</span>
                <span className="prog-val">
                  {formatIndianCurrency(monthlySIP * (1 + stepUpRate / 100))}
                </span>
                <span className="prog-sub">+{stepUpRate}%</span>
              </div>
              <div className="prog-arrow">→</div>
              <div className="prog-step">
                <span className="prog-yr">Year 5</span>
                <span className="prog-val">
                  {formatIndianCurrency(
                    monthlySIP * Math.pow(1 + stepUpRate / 100, Math.min(4, stepUpDuration - 1))
                  )}
                </span>
                <span className="prog-sub">5th Year</span>
              </div>
              <div className="prog-arrow">→</div>
              <div className="prog-step highlight-step">
                <span className="prog-yr">Final Step-Up Year</span>
                <span className="prog-val text-teal">
                  {formatIndianCurrency(
                    monthlySIP * Math.pow(1 + stepUpRate / 100, Math.max(0, stepUpDuration - 1))
                  )}
                </span>
                <span className="prog-sub">Year {stepUpDuration}</span>
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
              Continue to Return & Horizon →
            </button>
          </div>
        </section>
      )}

      {/* STEP 3: RETURN & HORIZON */}
      {currentStep === 3 && (
        <section className="step-card" aria-labelledby="step3-title">
          <div className="step-header">
            <div className="step-badge">Step 3 of 4</div>
            <h2 id="step3-title" className="step-heading">
              Expected Return & Compounding Horizon
            </h2>
            <p className="step-description">
              Set your expected annual rate of return. You can also allow your corpus to continue compounding for additional years after monthly contributions stop.
            </p>
          </div>

          <div className="inputs-grid">
            <div className="input-group">
              <label htmlFor={`${baseId}-return`} className="input-label">
                Expected Annual Rate of Return (% p.a.) *
              </label>
              <div className="slider-group">
                <div className="slider-value-display">
                  <span>{annualReturn}% p.a.</span>
                </div>
                <input
                  id={`${baseId}-return`}
                  type="range"
                  min="6"
                  max="18"
                  step="0.5"
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(Number(e.target.value))}
                  className="range-slider"
                />
                <div className="slider-ticks">
                  <span>6% (Conservative)</span>
                  <span>10% (Balanced)</span>
                  <span>12% (Equity)</span>
                  <span>18%</span>
                </div>
              </div>
              <span className="input-helper">Used to model effective monthly compounding: (1+r)^(1/12) - 1</span>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-postSip`} className="input-label">
                Investment Horizon After SIP Period (Years)
              </label>
              <div className="slider-group">
                <div className="slider-value-display">
                  <span>{postSipYears} Additional Years ({totalDuration} yrs total horizon)</span>
                </div>
                <input
                  id={`${baseId}-postSip`}
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={postSipYears}
                  onChange={(e) => setPostSipYears(Number(e.target.value))}
                  className="range-slider"
                />
                <div className="slider-ticks">
                  <span>0 yrs (Withdraw immediately)</span>
                  <span>5 yrs</span>
                  <span>10 yrs</span>
                  <span>20 yrs</span>
                </div>
              </div>
              <span className="input-helper">Corpus continues compounding with zero new monthly contributions</span>
            </div>
          </div>

          {/* Timeline Visual Card */}
          <div className="timeline-visual-card">
            <h4 className="timeline-title">Investment Journey Timeline</h4>
            <div className="timeline-track">
              <div className="timeline-phase active-phase">
                <span className="phase-lbl">SIP Contributions Active</span>
                <span className="phase-dur">Years 1–{sipDuration} ({sipDuration} Years)</span>
                <span className="phase-desc">Monthly SIP + Annual Step-Ups</span>
              </div>
              {postSipYears > 0 ? (
                <div className="timeline-phase post-phase">
                  <span className="phase-lbl">Post-SIP Compounding</span>
                  <span className="phase-dur">Years {sipDuration + 1}–{totalDuration} ({postSipYears} Years)</span>
                  <span className="phase-desc">₹0 SIP • Full Corpus Compounds</span>
                </div>
              ) : (
                <div className="timeline-phase ready-phase">
                  <span className="phase-lbl">Maturity Horizon</span>
                  <span className="phase-dur">Year {totalDuration}</span>
                  <span className="phase-desc">Corpus available at end of SIP</span>
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
              onClick={() => setCurrentStep(4)}
              className="btn-continue"
            >
              Continue to Additional Lump Sums →
            </button>
          </div>
        </section>
      )}

      {/* STEP 4: ADDITIONAL LUMP SUMS */}
      {currentStep === 4 && (
        <section className="step-card" aria-labelledby="step4-title">
          <div className="step-header">
            <div className="step-badge">Step 4 of 4</div>
            <h2 id="step4-title" className="step-heading">
              Add Occasional Lump-Sum Investments
            </h2>
            <p className="step-description">
              Inject one-time surpluses (bonuses, inheritance, maturing FDs) at any year. Lump sums participate in compounding from the beginning of that year.
            </p>
          </div>

          {/* Add New Lump Sum Form */}
          <div className="lump-form-card">
            <h4 className="lump-form-heading">+ Add a One-Time Investment</h4>
            <div className="lump-form-row">
              <div className="lump-field-group">
                <label htmlFor={`${baseId}-lumpYr`} className="input-label">Investment Year</label>
                <select
                  id={`${baseId}-lumpYr`}
                  value={newLumpYear}
                  onChange={(e) => setNewLumpYear(Number(e.target.value))}
                  className="lump-select"
                >
                  {Array.from({ length: totalDuration }, (_, i) => i + 1).map((yr) => (
                    <option key={yr} value={yr}>
                      Year {yr} {yr > sipDuration ? '(Post-SIP)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lump-field-group">
                <label htmlFor={`${baseId}-lumpAmt`} className="input-label">Lump-Sum Amount (₹)</label>
                <div className="currency-input-wrapper">
                  <span className="currency-symbol">₹</span>
                  <input
                    id={`${baseId}-lumpAmt`}
                    type="number"
                    min="10000"
                    step="50000"
                    value={newLumpAmount || ''}
                    onChange={(e) => setNewLumpAmount(Math.max(0, Number(e.target.value)))}
                    placeholder="100000"
                    className="currency-field"
                  />
                </div>
              </div>

              <div className="lump-field-btn">
                <button
                  type="button"
                  onClick={handleAddLumpSum}
                  className="btn-add-lump"
                >
                  Add Investment
                </button>
              </div>
            </div>
          </div>

          {/* Active Lump Sums List */}
          <div className="active-lumps-container">
            <h4 className="active-lumps-heading">
              Planned Additional Investments ({lumpSums.length})
            </h4>

            {lumpSums.length === 0 ? (
              <div className="empty-lump-state">
                <span>💡 No additional lump-sum investments added. You can proceed with pure SIP or add occasional top-ups above.</span>
              </div>
            ) : (
              <div className="lump-list-grid">
                {lumpSums.map((item) => (
                  <div key={item.id} className="lump-item-card">
                    <div className="lump-badge">Year {item.year}</div>
                    <div className="lump-amount-val">{formatLakhsCrores(item.amount)}</div>
                    <div className="lump-exact-sub">{formatIndianCurrency(item.amount)}</div>
                    <button
                      type="button"
                      onClick={() => handleDeleteLumpSum(item.id)}
                      className="btn-delete-lump"
                      title="Delete investment"
                      aria-label={`Delete Year ${item.year} investment of ${formatIndianCurrency(item.amount)}`}
                    >
                      ✕ Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="step-actions">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="btn-back"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep('results')}
              className="btn-view-results"
            >
              See Your SIP Growth Plan ★
            </button>
          </div>
        </section>
      )}

      {/* RESULTS DASHBOARD */}
      {currentStep === 'results' && (
        <div className="results-container" aria-live="polite">
          {/* Results Hero Card */}
          <div className="results-hero-card">
            <div className="hero-eyebrow">YOUR WEALTH CREATION ESTIMATE</div>
            <h2 className="hero-heading">Estimated Final Corpus</h2>

            <div className="primary-result-box">
              <span className="result-tag">ESTIMATED FUTURE VALUE AT MATURITY</span>
              <div className="result-main-number">
                {formatLakhsCrores(result.finalCorpus)}
              </div>
              <div className="result-exact-number">
                Exact Estimated Corpus: {formatIndianCurrency(result.finalCorpus)}
              </div>
            </div>

            <p className="hero-disclaimer-note">
              Based on an initial monthly SIP of {formatIndianCurrency(monthlySIP)} with {stepUpRate}% annual step-ups over {sipDuration} years{postSipYears > 0 ? ` + ${postSipYears} years post-SIP compounding` : ''} at {annualReturn}% expected annual return.
            </p>
          </div>

          {/* Four Key Metrics Grid */}
          <div className="metrics-four-grid">
            <div className="metric-card">
              <span className="m-card-lbl">Total Amount Invested</span>
              <span className="m-card-val text-navy">{formatLakhsCrores(result.totalInvested)}</span>
              <span className="m-card-sub">{formatIndianCurrency(result.totalInvested)}</span>
            </div>
            <div className="metric-card highlight-metric">
              <span className="m-card-lbl">Estimated Final Corpus</span>
              <span className="m-card-val text-teal">{formatLakhsCrores(result.finalCorpus)}</span>
              <span className="m-card-sub">{formatIndianCurrency(result.finalCorpus)}</span>
            </div>
            <div className="metric-card">
              <span className="m-card-lbl">Estimated Wealth Created</span>
              <span className="m-card-val text-gold">{formatLakhsCrores(result.wealthCreated)}</span>
              <span className="m-card-sub">Gains from compounding</span>
            </div>
            <div className="metric-card">
              <span className="m-card-lbl">Growth on Investment</span>
              <span className="m-card-val text-teal">{formatPercentage(result.growthPercentage)}</span>
              <span className="m-card-sub">{(result.finalCorpus / Math.max(1, result.totalInvested)).toFixed(1)}x capital multiplier</span>
            </div>
          </div>

          {/* Invested vs Growth Visual Stacked Bar */}
          <div className="stacked-bar-card">
            <h3 className="section-subtitle">Invested Capital vs Estimated Growth</h3>
            
            <div className="visual-stacked-bar">
              {result.totalInvested > 0 && (
                <div
                  className="bar-segment invested-segment"
                  style={{
                    width: `${Math.min(100, Math.max(5, (result.totalInvested / result.finalCorpus) * 100))}%`
                  }}
                  title={`Total Invested: ${formatLakhsCrores(result.totalInvested)}`}
                >
                  <span>
                    {Math.round((result.totalInvested / result.finalCorpus) * 100)}% Invested
                  </span>
                </div>
              )}
              {result.wealthCreated > 0 && (
                <div
                  className="bar-segment growth-segment"
                  style={{
                    width: `${Math.min(100, Math.max(5, (result.wealthCreated / result.finalCorpus) * 100))}%`
                  }}
                  title={`Estimated Growth: ${formatLakhsCrores(result.wealthCreated)}`}
                >
                  <span>
                    {Math.round((result.wealthCreated / result.finalCorpus) * 100)}% Growth
                  </span>
                </div>
              )}
            </div>

            <div className="stacked-legend-row">
              <div className="legend-item">
                <span className="legend-dot invested-dot"></span>
                <span className="legend-name">Total Invested:</span>
                <strong className="legend-val">
                  {formatLakhsCrores(result.totalInvested)} ({formatIndianCurrency(result.totalInvested)})
                </strong>
              </div>
              <div className="legend-item">
                <span className="legend-dot growth-dot"></span>
                <span className="legend-name">Estimated Compounding Growth:</span>
                <strong className="legend-val">
                  {formatLakhsCrores(result.wealthCreated)} ({formatIndianCurrency(result.wealthCreated)})
                </strong>
              </div>
            </div>
          </div>

          {/* Interactive Responsive SVG Growth Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="section-subtitle">Corpus Growth Trajectory</h3>
              <span className="chart-subtitle-note">Hover/tap points to view year-by-year corpus</span>
            </div>

            <div className="svg-chart-container">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="growth-svg"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00AB96" stopOpacity="0.35" />
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
                        x2={chartWidth - padding.right}
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
                      >
                        {formatLakhsCrores(maxCorpus * pct)}
                      </text>
                    </g>
                  );
                })}

                {/* Area and Line */}
                {svgPathData && (
                  <>
                    <path d={svgPathData.area} fill="url(#areaGradient)" />
                    <path
                      d={svgPathData.line}
                      fill="none"
                      stroke="#00AB96"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </>
                )}

                {/* Points and Lump Sum Markers */}
                {chartPoints.map((pt) => {
                  const isHovered = activeChartPoint === pt.year;
                  const hasLump = pt.lumpSumInvestment > 0;
                  return (
                    <g key={pt.year}>
                      {hasLump && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="8"
                          fill="#D97706"
                          opacity="0.3"
                        />
                      )}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={hasLump ? '5' : isHovered ? '6' : '3.5'}
                        fill={hasLump ? '#D97706' : '#00182A'}
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        style={{ cursor: 'pointer' }}
                        onMouseEnter={() => setActiveChartPoint(pt.year)}
                        onClick={() => setActiveChartPoint(pt.year)}
                      />
                    </g>
                  );
                })}

                {/* X Axis Labels */}
                {chartPoints
                  .filter((_, idx) => idx === 0 || (idx + 1) % 5 === 0 || idx === chartPoints.length - 1)
                  .map((pt) => (
                    <text
                      key={pt.year}
                      x={pt.x}
                      y={chartHeight - 12}
                      textAnchor="middle"
                      fontSize="11"
                      fill="#64748B"
                      fontWeight="600"
                    >
                      Yr {pt.year}
                    </text>
                  ))}
              </svg>

              {/* Tooltip Overlay */}
              {activeChartPoint !== null && (() => {
                const pt = chartPoints.find((p) => p.year === activeChartPoint);
                if (!pt) return null;
                return (
                  <div className="chart-tooltip-box">
                    <div className="tooltip-yr">Year {pt.year} Summary</div>
                    <div className="tooltip-row">
                      <span>Monthly SIP:</span>
                      <strong>{formatIndianCurrency(pt.monthlySIP)}/mo</strong>
                    </div>
                    {pt.lumpSumInvestment > 0 && (
                      <div className="tooltip-row text-gold">
                        <span>Lump Sum:</span>
                        <strong>+{formatIndianCurrency(pt.lumpSumInvestment)}</strong>
                      </div>
                    )}
                    <div className="tooltip-row">
                      <span>Year-End Corpus:</span>
                      <strong className="text-teal">{formatIndianCurrency(pt.closingCorpus)}</strong>
                    </div>
                  </div>
                );
              })()}
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

          {/* Milestone Step-Up Progression Table */}
          <div className="stepup-table-card">
            <div className="table-header-row">
              <h3 className="section-subtitle">SIP Step-Up & Corpus Progression</h3>
              <button
                type="button"
                onClick={() => setShowFullProjection(!showFullProjection)}
                className="btn-toggle-projection"
              >
                {showFullProjection ? 'Show Key Milestones Only' : 'View Full Year-by-Year Projection (All Years) ▼'}
              </button>
            </div>

            <div className="table-responsive-wrapper">
              <table className="projection-table">
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Monthly SIP</th>
                    <th>Annual SIP</th>
                    <th>Lump Sum</th>
                    <th>Total Year Deposit</th>
                    <th>Year-End Corpus</th>
                  </tr>
                </thead>
                <tbody>
                  {result.projection
                    .filter((p) =>
                      showFullProjection
                        ? true
                        : p.year === 1 ||
                          p.year === 5 ||
                          p.year === 10 ||
                          p.year === 11 ||
                          p.year === 15 ||
                          p.year === 20 ||
                          p.year === result.totalInvestmentYears ||
                          p.lumpSumInvestment > 0
                    )
                    .map((p) => (
                      <tr key={p.year} className={p.lumpSumInvestment > 0 ? 'lump-row-highlight' : ''}>
                        <td>
                          <strong>Year {p.year}</strong>
                          {p.year > sipDuration ? <span className="tag-post">Post-SIP</span> : ''}
                        </td>
                        <td>{formatIndianCurrency(p.monthlySIP)}</td>
                        <td>{formatIndianCurrency(p.annualSIPInvestment)}</td>
                        <td>
                          {p.lumpSumInvestment > 0 ? (
                            <span className="text-gold font-bold">+{formatIndianCurrency(p.lumpSumInvestment)}</span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td>{formatIndianCurrency(p.totalInvestmentForYear)}</td>
                        <td>
                          <strong className="text-navy">{formatIndianCurrency(p.closingCorpus)}</strong>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Investment Journey Flow */}
          <div className="flow-story-card">
            <h3 className="section-subtitle">The SIP Compounding Journey</h3>
            <div className="flow-steps-track">
              <div className="flow-step">
                <span className="flow-step-lbl">Initial Monthly SIP</span>
                <span className="flow-step-val">{formatIndianCurrency(monthlySIP)}</span>
                <span className="flow-step-sub">Starting in Year 1</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <span className="flow-step-lbl">Annual Step-Up</span>
                <span className="flow-step-val text-teal">+{stepUpRate}%/yr</span>
                <span className="flow-step-sub">For {stepUpDuration} years</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <span className="flow-step-lbl">Total Invested</span>
                <span className="flow-step-val text-navy">{formatLakhsCrores(result.totalInvested)}</span>
                <span className="flow-step-sub">SIP + Lump Sums</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step highlight-flow-step">
                <span className="flow-step-lbl">Compounding Growth</span>
                <span className="flow-step-val text-teal">+{formatLakhsCrores(result.wealthCreated)}</span>
                <span className="flow-step-sub">@{annualReturn}% p.a.</span>
              </div>
              <div className="flow-arrow">=</div>
              <div className="flow-step result-flow-step">
                <span className="flow-step-lbl">Final Corpus</span>
                <span className="flow-step-val text-gold">{formatLakhsCrores(result.finalCorpus)}</span>
                <span className="flow-step-sub">At Year {totalDuration}</span>
              </div>
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
              <span className="toggle-left">
                <span className="toggle-icon">📐</span>
                <strong>How was this calculated?</strong>
              </span>
              <span className="toggle-chevron">{showHowItWorks ? '▲' : '▼'}</span>
            </button>

            {showHowItWorks && (
              <div className="accordion-content">
                <div className="formula-step-block">
                  <h4>1. Effective Monthly Compounding Rate</h4>
                  <p>
                    Rather than dividing the annual return by 12, the engine uses the precise effective monthly rate:
                    <br />
                    <code>i = (1 + annualReturn)^(1/12) - 1 = (1 + {annualReturn / 100})^(1/12) - 1</code>
                  </p>
                </div>

                <div className="formula-step-block">
                  <h4>2. Monthly SIP Timing Math</h4>
                  <p>
                    Because monthly SIP installments are invested at the start of each month, each installment earns returns for that full monthly period.
                  </p>
                </div>

                <div className="formula-step-block">
                  <h4>3. Annual Step-Up Progression</h4>
                  <p>
                    Your monthly SIP increases each year during the step-up window (Years 1 to {stepUpDuration}), then stays at that peak contribution for the remainder of the {sipDuration}-year SIP term.
                  </p>
                </div>

                <div className="formula-step-block">
                  <h4>4. Lump-Sum Investments & Compounding</h4>
                  <p>
                    Any lump-sum deposits made in a particular year are added to that year's opening corpus and compound at the full annual rate of {annualReturn}% alongside the monthly SIP inflows.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Voluntary WhatsApp Consultation CTA */}
          <div className="results-cta-card">
            <h3 className="cta-heading">Want help choosing a SIP amount & step-up strategy for your goals?</h3>
            <p className="cta-sub">
              We can help you review your cash flow, align your SIP step-up percentages with salary cycles, and select appropriate mutual fund categories.
            </p>
            <div className="cta-btn-row">
              <a
                href={generateWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp-cta"
              >
                <span>💬 Talk to Santhosh</span>
              </a>
              <a href="/contact" className="btn-contact-secondary">
                Book a Free Consultation
              </a>
            </div>
            <p className="cta-disclaimer">
              100% Confidential • No Phone Number or Login Needed • AMFI Registered Mutual Fund Distributor (ARN: 266896)
            </p>
          </div>

          {/* Navigation Action Buttons */}
          <div className="step-actions mt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="btn-back"
            >
              ← Edit SIP Inputs (Step 1)
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="btn-edit-plan"
            >
              ⚙️ Modify Lump Sums (Step 4)
            </button>
          </div>
        </div>
      )}

      {/* Styled JSX (Vanilla CSS) */}
      <style>{`
        .sip-planner-wrapper {
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
          grid-template-columns: repeat(5, 1fr);
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

        /* Live Preview Box */
        .live-preview-box {
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
          margin-bottom: 1.75rem;
        }

        .preview-row {
          display: flex;
          align-items: center;
          justify-content: space-around;
        }

        .preview-item {
          display: flex;
          flex-direction: column;
          text-align: center;
        }

        .p-divider {
          width: 1px;
          height: 40px;
          background: #CBD5E1;
        }

        .p-lbl {
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748B;
          margin-bottom: 0.25rem;
        }

        .p-val {
          font-family: 'Outfit', sans-serif;
          font-size: 1.35rem;
          font-weight: 800;
        }

        /* Progression Preview Card */
        .progression-preview-card {
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
          margin-bottom: 1.75rem;
        }

        .progression-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: #00182A;
          margin: 0 0 0.85rem 0;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .progression-track {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .prog-step {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 0.75rem 0.85rem;
          text-align: center;
          flex: 1;
          min-width: 110px;
        }

        .prog-step.highlight-step {
          border-color: #00AB96;
          background: #E6F7F5;
        }

        .prog-yr {
          display: block;
          font-size: 0.7rem;
          font-weight: 700;
          color: #64748B;
          margin-bottom: 0.2rem;
        }

        .prog-val {
          display: block;
          font-family: 'Outfit', sans-serif;
          font-size: 1.05rem;
          font-weight: 800;
          color: #00182A;
        }

        .prog-sub {
          display: block;
          font-size: 0.65rem;
          color: #64748B;
          margin-top: 0.15rem;
        }

        .prog-arrow {
          font-size: 1.1rem;
          font-weight: 700;
          color: #94A3B8;
        }

        /* Timeline Visual Card */
        .timeline-visual-card {
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
          margin-bottom: 1.75rem;
        }

        .timeline-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: #00182A;
          margin: 0 0 0.85rem 0;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .timeline-track {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .timeline-phase {
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          border-radius: 10px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
        }

        .active-phase { border-left: 4px solid #00AB96; }
        .post-phase { border-left: 4px solid #3B82F6; }
        .ready-phase { border-left: 4px solid #F59E0B; }

        .phase-lbl {
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748B;
          margin-bottom: 0.25rem;
        }

        .phase-dur {
          font-family: 'Outfit', sans-serif;
          font-size: 1.15rem;
          font-weight: 800;
          color: #00182A;
        }

        .phase-desc {
          font-size: 0.75rem;
          color: #64748B;
          margin-top: 0.25rem;
        }

        /* Step 4 Lump Sum Styles */
        .lump-form-card {
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
          margin-bottom: 1.75rem;
        }

        .lump-form-heading {
          font-size: 0.9rem;
          font-weight: 700;
          color: #00182A;
          margin: 0 0 0.85rem 0;
        }

        .lump-form-row {
          display: grid;
          grid-template-columns: 1fr 2fr auto;
          gap: 1rem;
          align-items: flex-end;
        }

        .lump-field-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .lump-select {
          padding: 0.75rem;
          font-size: 0.95rem;
          font-weight: 600;
          color: #00182A;
          background: #FFFFFF;
          border: 1.5px solid #CBD5E1;
          border-radius: 8px;
          cursor: pointer;
        }

        .btn-add-lump {
          background: #00AB96;
          color: #FFFFFF;
          border: none;
          padding: 0.8rem 1.25rem;
          font-size: 0.9rem;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .btn-add-lump:hover {
          background: #008f7d;
        }

        .active-lumps-container {
          margin-bottom: 1.75rem;
        }

        .active-lumps-heading {
          font-size: 0.9rem;
          font-weight: 700;
          color: #00182A;
          margin: 0 0 0.85rem 0;
        }

        .empty-lump-state {
          background: #F1F5F9;
          border-radius: 8px;
          padding: 1rem;
          font-size: 0.85rem;
          color: #475569;
          text-align: center;
        }

        .lump-list-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 0.75rem;
        }

        .lump-item-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
        }

        .lump-badge {
          font-size: 0.7rem;
          font-weight: 800;
          background: #FEF3C7;
          color: #D97706;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          width: fit-content;
        }

        .lump-amount-val {
          font-family: 'Outfit', sans-serif;
          font-size: 1.35rem;
          font-weight: 800;
          color: #00182A;
        }

        .lump-exact-sub {
          font-size: 0.75rem;
          color: #64748B;
          margin-bottom: 0.5rem;
        }

        .btn-delete-lump {
          background: #FEE2E2;
          color: #DC2626;
          border: none;
          padding: 0.35rem 0.6rem;
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          align-self: flex-start;
          transition: background 0.2s;
        }

        .btn-delete-lump:hover {
          background: #FCA5A5;
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

        /* Metrics Four Grid */
        .metrics-four-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }

        .metric-card {
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 14px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          text-align: center;
        }

        .metric-card.highlight-metric {
          border-color: #00AB96;
          background: #E6F7F5;
        }

        .m-card-lbl {
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748B;
          margin-bottom: 0.25rem;
        }

        .m-card-val {
          font-family: 'Outfit', sans-serif;
          font-size: 1.45rem;
          font-weight: 800;
        }

        .m-card-sub {
          font-size: 0.7rem;
          color: #64748B;
          margin-top: 0.15rem;
        }

        /* Stacked Bar Card */
        .stacked-bar-card {
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

        .visual-stacked-bar {
          display: flex;
          height: 38px;
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

        .invested-segment { background: #00182A; }
        .growth-segment { background: #00AB96; }

        .stacked-legend-row {
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
        }

        .legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .invested-dot { background: #00182A; }
        .growth-dot { background: #00AB96; }

        .legend-name { color: #64748B; }
        .legend-val { color: #00182A; }

        /* SVG Chart Card */
        .chart-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 1.75rem;
          position: relative;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 1rem;
        }

        .chart-subtitle-note {
          font-size: 0.75rem;
          color: #64748B;
        }

        .svg-chart-container {
          position: relative;
          width: 100%;
        }

        .growth-svg {
          width: 100%;
          height: auto;
          display: block;
        }

        .chart-tooltip-box {
          position: absolute;
          top: 15px;
          right: 20px;
          background: #00182A;
          color: #FFFFFF;
          border-radius: 8px;
          padding: 0.75rem 1rem;
          font-size: 0.8rem;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
          pointer-events: none;
        }

        .tooltip-yr {
          font-weight: 700;
          color: #00AB96;
          margin-bottom: 0.35rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
          padding-bottom: 0.25rem;
        }

        .tooltip-row {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          margin-top: 0.2rem;
        }

        /* Step-Up Table Card */
        .stepup-table-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 1.75rem;
        }

        .table-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }

        .btn-toggle-projection {
          background: #F1F5F9;
          color: #0F172A;
          border: 1px solid #CBD5E1;
          padding: 0.4rem 0.85rem;
          font-size: 0.8rem;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-toggle-projection:hover {
          background: #E2E8F0;
        }

        .table-responsive-wrapper {
          overflow-x: auto;
        }

        .projection-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
          text-align: left;
        }

        .projection-table th {
          background: #F8FAFC;
          color: #64748B;
          font-weight: 700;
          padding: 0.75rem 1rem;
          border-bottom: 2px solid #E2E8F0;
        }

        .projection-table td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #F1F5F9;
          color: #334155;
        }

        .lump-row-highlight {
          background: #FEF9C3;
        }

        .tag-post {
          font-size: 0.65rem;
          font-weight: 700;
          background: #E2E8F0;
          color: #475569;
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          margin-left: 0.4rem;
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
          min-width: 110px;
        }

        .flow-step.highlight-flow-step {
          background: #E6F7F5;
          border-color: #00AB96;
        }

        .flow-step.result-flow-step {
          background: #FEF3C7;
          border-color: #D97706;
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

        .formula-step-block {
          margin-top: 1.25rem;
        }

        .formula-step-block h4 {
          font-size: 0.9rem;
          font-weight: 700;
          color: #00182A;
          margin: 0 0 0.35rem 0;
        }

        .formula-step-block p {
          font-size: 0.85rem;
          color: #475569;
          line-height: 1.6;
          margin: 0;
        }

        .formula-step-block code {
          display: inline-block;
          background: #F1F5F9;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          color: #0F172A;
          font-weight: 600;
          font-size: 0.8rem;
          margin-top: 0.25rem;
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
        .font-bold { font-weight: 700; }

        /* Responsive Breakpoints */
        @media (max-width: 860px) {
          .stepper-list {
            grid-template-columns: repeat(3, 1fr);
          }
          .inputs-grid {
            grid-template-columns: 1fr;
          }
          .metrics-four-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .lump-form-row {
            grid-template-columns: 1fr;
          }
          .timeline-track {
            grid-template-columns: 1fr;
          }
          .flow-steps-track {
            flex-direction: column;
            align-items: stretch;
          }
          .flow-arrow {
            display: none;
          }
          .stacked-legend-row {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 640px) {
          .step-card {
            padding: 1.5rem 1rem;
          }
          .stepper-list {
            grid-template-columns: repeat(2, 1fr);
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
          .metrics-four-grid {
            grid-template-columns: 1fr;
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
          .preview-row {
            flex-direction: column;
            gap: 0.75rem;
          }
          .p-divider {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
