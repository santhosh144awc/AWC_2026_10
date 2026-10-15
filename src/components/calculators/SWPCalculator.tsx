import React, { useState, useId, useMemo } from 'react';
import {
  calculateSWPPlan,
  formatIndianCurrency,
  formatLakhsCrores,
  formatPercentage,
  formatYearsAndMonths,
  type SWPLumpSumWithdrawal,
  type SWPInputs
} from '../../utils/calculations/swpCalculator';

type WizardStep = 1 | 2 | 3 | 4 | 'results';

export default function SWPCalculator() {
  const baseId = useId();

  // Wizard Navigation
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);

  // Step 1: Retirement Corpus
  const [currentAge, setCurrentAge] = useState<number>(60);
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [initialCorpus, setInitialCorpus] = useState<number>(10000000);

  // Step 2: Monthly SWP Withdrawal
  const [monthlySWP, setMonthlySWP] = useState<number>(50000);

  // Step 3: Growth & Step-Up
  const [annualReturn, setAnnualReturn] = useState<number>(9);
  const [stepUpRate, setStepUpRate] = useState<number>(6);

  // Step 4: Additional Lump-Sum Withdrawals
  const [lumpSums, setLumpSums] = useState<SWPLumpSumWithdrawal[]>([
    { id: '1', monthNumber: 12, amount: 100000, label: 'Vacation' },
    { id: '2', monthNumber: 24, amount: 100000, label: 'Home Upgrade' },
    { id: '3', monthNumber: 36, amount: 100000, label: 'Vehicle' },
    { id: '4', monthNumber: 48, amount: 100000, label: 'Medical Buffer' },
    { id: '5', monthNumber: 60, amount: 100000, label: 'Family Milestone' }
  ]);

  // Temp Form for New Lump-Sum Entry
  const [newLumpYear, setNewLumpYear] = useState<number>(1);
  const [newLumpAmount, setNewLumpAmount] = useState<number>(100000);
  const [newLumpLabel, setNewLumpLabel] = useState<string>('Travel');

  // Chart Hover State
  const [activeChartPoint, setActiveChartPoint] = useState<number | null>(null);

  // Accordion Toggles
  const [showFullProjection, setShowFullProjection] = useState<boolean>(false);
  const [showHowItWorks, setShowHowItWorks] = useState<boolean>(false);

  // Calculate Result
  const planInput: SWPInputs = useMemo(() => ({
    currentAge,
    startDate,
    annualReturnRate: annualReturn,
    stepUpRate,
    initialCorpus,
    monthlySWP,
    lumpSums
  }), [
    currentAge,
    startDate,
    annualReturn,
    stepUpRate,
    initialCorpus,
    monthlySWP,
    lumpSums
  ]);

  const result = useMemo(() => calculateSWPPlan(planInput), [planInput]);

  // Handlers for Lump Sum Withdrawals
  const handleAddLumpSum = () => {
    if (newLumpYear > 0 && newLumpAmount > 0) {
      const monthNum = newLumpYear * 12;
      const newEntry: SWPLumpSumWithdrawal = {
        id: Date.now().toString(),
        monthNumber: monthNum,
        amount: newLumpAmount,
        label: newLumpLabel || `Year ${newLumpYear} Withdrawal`
      };
      setLumpSums([...lumpSums, newEntry]);
      setNewLumpAmount(100000);
    }
  };

  const handleDeleteLumpSum = (id: string) => {
    setLumpSums(lumpSums.filter((item) => item.id !== id));
  };

  // Load Benchmark Scenario
  const handleLoadSampleData = () => {
    setCurrentAge(60);
    setStartDate('2025-01-01');
    setInitialCorpus(10000000);
    setMonthlySWP(50000);
    setAnnualReturn(9);
    setStepUpRate(6);
    setLumpSums([
      { id: '1', monthNumber: 12, amount: 100000, label: 'Vacation' },
      { id: '2', monthNumber: 24, amount: 100000, label: 'Home Upgrade' },
      { id: '3', monthNumber: 36, amount: 100000, label: 'Vehicle' },
      { id: '4', monthNumber: 48, amount: 100000, label: 'Medical Buffer' },
      { id: '5', monthNumber: 60, amount: 100000, label: 'Family Milestone' }
    ]);
    setCurrentStep('results');
  };

  // Reset to Clean Baseline Defaults
  const handleReset = () => {
    setCurrentAge(60);
    setStartDate(new Date().toISOString().split('T')[0]);
    setInitialCorpus(10000000);
    setMonthlySWP(50000);
    setAnnualReturn(8);
    setStepUpRate(6);
    setLumpSums([]);
    setCurrentStep(1);
  };

  // WhatsApp Prepopulated Deep Link
  const generateWhatsAppUrl = () => {
    const corpus = formatLakhsCrores(initialCorpus);
    const swp = formatIndianCurrency(monthlySWP);
    const duration = result.corpusDepleted
      ? `${result.swpDurationYears} Years`
      : '50+ Years (Sustained)';

    const message = `Hi Santhosh, I used the SWP Calculator on Ant Wealth Creation.

• Starting Corpus: ${corpus}
• Monthly SWP: ${swp}/month (Step-Up: ${stepUpRate}%/yr)
• Expected Return: ${annualReturn}% p.a.
• Estimated Longevity: ${duration}

Can we connect to discuss this plan?`;

    return `https://wa.me/918087971566?text=${encodeURIComponent(message)}`;
  };

  // SVG Chart Dimensions
  const chartWidth = 720;
  const chartHeight = 280;
  const padding = { top: 20, right: 30, bottom: 40, left: 60 };
  const graphWidth = chartWidth - padding.left - padding.right;
  const graphHeight = chartHeight - padding.top - padding.bottom;

  // Chart data: sample from yearly summaries or monthly projections
  const chartPoints = useMemo(() => {
    if (result.yearlySummary.length === 0) return [];
    const maxVal = Math.max(initialCorpus, ...result.yearlySummary.map((y) => y.startingCorpus), 100000) * 1.05;

    // Start with Year 0 point
    const points = [
      {
        year: 0,
        yearNumber: 0,
        corpus: initialCorpus,
        age: currentAge,
        monthlySWP: monthlySWP,
        lumpSum: 0,
        x: padding.left,
        y: padding.top + graphHeight - (initialCorpus / maxVal) * graphHeight
      }
    ];

    const numYears = result.yearlySummary.length;
    result.yearlySummary.forEach((y, idx) => {
      const x = padding.left + ((idx + 1) / Math.max(1, numYears)) * graphWidth;
      const yPos = padding.top + graphHeight - (y.endingCorpus / maxVal) * graphHeight;
      points.push({
        year: y.calendarYear,
        yearNumber: y.yearNumber,
        corpus: y.endingCorpus,
        age: y.age,
        monthlySWP: y.monthlySWPAtYearEnd,
        lumpSum: y.totalLumpSumWithdrawal,
        x,
        y: yPos
      });
    });

    return { points, maxVal };
  }, [result.yearlySummary, initialCorpus, currentAge, monthlySWP, graphWidth, graphHeight, padding.left, padding.top]);

  const svgPathData = useMemo(() => {
    if (!chartPoints.points || chartPoints.points.length === 0) return { line: '', area: '' };
    const pts = chartPoints.points;
    const first = pts[0];
    const pathD = pts.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');
    const last = pts[pts.length - 1];
    const areaD = `${pathD} L ${last.x} ${padding.top + graphHeight} L ${first.x} ${padding.top + graphHeight} Z`;
    return { line: pathD, area: areaD };
  }, [chartPoints, padding.top, graphHeight]);

  return (
    <div className="swp-calculator-wrapper">
      {/* Top Action Bar: Sample Scenario & Reset */}
      <div className="calc-top-action-bar">
        <div className="action-tagline">
          <span className="live-pulse"></span>
          <span>Monthly Sequential Simulation • Beginning-of-Month Timing</span>
        </div>
        <div className="action-btn-group">
          <button
            type="button"
            onClick={handleLoadSampleData}
            className="btn-sample-preset"
            title="Load ₹1 Cr corpus, ₹50k/mo, 9% return, 6% step-up sample scenario"
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
            { step: 1, title: 'Corpus & Age', icon: '💰' },
            { step: 2, title: 'Monthly SWP', icon: '📉' },
            { step: 3, title: 'Growth & Step-Up', icon: '📈' },
            { step: 4, title: 'Lump Sums', icon: '🏖️' },
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
          <li className="stepper-item results-stepper-item">
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

      {/* STEP 1: RETIREMENT CORPUS */}
      {currentStep === 1 && (
        <section className="step-card" aria-labelledby="step1-title">
          <div className="step-header">
            <div className="step-badge">Step 1 of 4</div>
            <h2 id="step1-title" className="step-heading">
              Your Starting Retirement Corpus
            </h2>
            <p className="step-description">
              Enter your accumulated savings corpus, current age, and planned withdrawal start date.
            </p>
          </div>

          <div className="inputs-grid">
            <div className="input-group">
              <label htmlFor={`${baseId}-corpus`} className="input-label">
                Total Retirement Corpus Available (₹) *
              </label>
              <div className="currency-input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  id={`${baseId}-corpus`}
                  type="number"
                  min="100000"
                  step="500000"
                  value={initialCorpus || ''}
                  onChange={(e) => setInitialCorpus(Math.max(0, Number(e.target.value)))}
                  placeholder="10000000"
                  className="currency-field"
                />
                <span className="unit-tag">{formatLakhsCrores(initialCorpus)}</span>
              </div>
              <span className="input-helper">Mutual funds, EPF, PPF, gratuity and other liquid retirement assets</span>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-age`} className="input-label">
                Current Age at Retirement (Years) *
              </label>
              <div className="slider-group">
                <div className="slider-value-display">
                  <span>{currentAge} Years Old</span>
                </div>
                <input
                  id={`${baseId}-age`}
                  type="range"
                  min="40"
                  max="80"
                  step="1"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(Number(e.target.value))}
                  className="range-slider"
                />
                <div className="slider-ticks">
                  <span>40 yrs (FIRE)</span>
                  <span>58 yrs</span>
                  <span>60 yrs (Standard)</span>
                  <span>80 yrs</span>
                </div>
              </div>
              <span className="input-helper">Age when your monthly SWP withdrawals begin</span>
            </div>
          </div>

          <div className="inputs-grid mt-2">
            <div className="input-group">
              <label htmlFor={`${baseId}-start`} className="input-label">
                Withdrawal Start Date
              </label>
              <input
                id={`${baseId}-start`}
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="currency-field"
              />
              <span className="input-helper">Used to project month-by-month calendar dates</span>
            </div>
          </div>

          <div className="step-actions">
            <div></div>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="btn-continue"
            >
              Continue to Monthly Withdrawal →
            </button>
          </div>
        </section>
      )}

      {/* STEP 2: MONTHLY SWP WITHDRAWAL */}
      {currentStep === 2 && (
        <section className="step-card" aria-labelledby="step2-title">
          <div className="step-header">
            <div className="step-badge">Step 2 of 4</div>
            <h2 id="step2-title" className="step-heading">
              Planned Monthly Withdrawal (SWP)
            </h2>
            <p className="step-description">
              Set the monthly living expense you plan to draw at the beginning of each calendar month.
            </p>
          </div>

          <div className="inputs-grid">
            <div className="input-group">
              <label htmlFor={`${baseId}-swp`} className="input-label">
                Starting Monthly SWP (₹ per month) *
              </label>
              <div className="currency-input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  id={`${baseId}-swp`}
                  type="number"
                  min="5000"
                  step="5000"
                  value={monthlySWP || ''}
                  onChange={(e) => setMonthlySWP(Math.max(0, Number(e.target.value)))}
                  placeholder="50000"
                  className="currency-field"
                />
                <span className="unit-tag">{formatIndianCurrency(monthlySWP)}/mo</span>
              </div>
              <span className="input-helper">Initial monthly income withdrawn at beginning of month</span>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-swpSlider`} className="input-label">
                Quick Adjust Monthly Withdrawal
              </label>
              <div className="slider-group">
                <div className="slider-value-display">
                  <span>{formatIndianCurrency(monthlySWP)}/mo</span>
                </div>
                <input
                  id={`${baseId}-swpSlider`}
                  type="range"
                  min="10000"
                  max="300000"
                  step="5000"
                  value={monthlySWP}
                  onChange={(e) => setMonthlySWP(Number(e.target.value))}
                  className="range-slider"
                />
                <div className="slider-ticks">
                  <span>₹10k</span>
                  <span>₹50k</span>
                  <span>₹1.5L</span>
                  <span>₹3.0L</span>
                </div>
              </div>
              <span className="input-helper">Adjust slider to see immediate impact on annual withdrawals</span>
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="live-preview-box">
            <div className="preview-row">
              <div className="preview-item">
                <span className="p-lbl">Year 1 Monthly Outflow</span>
                <span className="p-val text-navy">{formatIndianCurrency(monthlySWP)}/mo</span>
              </div>
              <div className="p-divider"></div>
              <div className="preview-item">
                <span className="p-lbl">Year 1 Annual Withdrawal</span>
                <span className="p-val text-teal">{formatLakhsCrores(monthlySWP * 12)}/yr</span>
              </div>
              <div className="p-divider"></div>
              <div className="preview-item">
                <span className="p-lbl">Initial Withdrawal Rate</span>
                <span className="p-val text-gold">
                  {initialCorpus > 0 ? ((monthlySWP * 12 / initialCorpus) * 100).toFixed(2) : 0}% p.a.
                </span>
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
              Continue to Growth & Step-Up →
            </button>
          </div>
        </section>
      )}

      {/* STEP 3: GROWTH & STEP-UP */}
      {currentStep === 3 && (
        <section className="step-card" aria-labelledby="step3-title">
          <div className="step-header">
            <div className="step-badge">Step 3 of 4</div>
            <h2 id="step3-title" className="step-heading">
              Expected Return & Annual Step-Up
            </h2>
            <p className="step-description">
              Account for rising living costs by increasing your SWP annually, while your remaining corpus compounds at your expected return rate.
            </p>
          </div>

          <div className="inputs-grid">
            <div className="input-group">
              <label htmlFor={`${baseId}-return`} className="input-label">
                Expected Annual Return on Remaining Corpus (% p.a.) *
              </label>
              <div className="slider-group">
                <div className="slider-value-display">
                  <span>{annualReturn}% p.a.</span>
                </div>
                <input
                  id={`${baseId}-return`}
                  type="range"
                  min="4"
                  max="14"
                  step="0.5"
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(Number(e.target.value))}
                  className="range-slider"
                />
                <div className="slider-ticks">
                  <span>4% (Conservative)</span>
                  <span>8% (Balanced)</span>
                  <span>9% (Standard)</span>
                  <span>14% (Growth)</span>
                </div>
              </div>
              <span className="input-helper">Effective monthly rate i = (1+r)^(1/12) - 1 applied to remaining balance</span>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-stepUp`} className="input-label">
                Annual SWP Step-Up Rate (% per year)
              </label>
              <div className="slider-group">
                <div className="slider-value-display">
                  <span>{stepUpRate}% Annual Increment</span>
                </div>
                <input
                  id={`${baseId}-stepUp`}
                  type="range"
                  min="0"
                  max="15"
                  step="0.5"
                  value={stepUpRate}
                  onChange={(e) => setStepUpRate(Number(e.target.value))}
                  className="range-slider"
                />
                <div className="slider-ticks">
                  <span>0% (Flat)</span>
                  <span>6% (Standard Inflation)</span>
                  <span>8%</span>
                  <span>15%</span>
                </div>
              </div>
              <span className="input-helper">Increases your monthly withdrawal once every 12 months</span>
            </div>
          </div>

          {/* Step-Up Progression Preview */}
          <div className="progression-preview-card">
            <h4 className="progression-title">Projected Monthly SWP Escalation</h4>
            <div className="progression-track">
              <div className="prog-step">
                <span className="prog-yr">Year 1</span>
                <span className="prog-val">{formatIndianCurrency(monthlySWP)}</span>
                <span className="prog-sub">Starting</span>
              </div>
              <div className="prog-arrow">→</div>
              <div className="prog-step">
                <span className="prog-yr">Year 2</span>
                <span className="prog-val">
                  {formatIndianCurrency(monthlySWP * (1 + stepUpRate / 100))}
                </span>
                <span className="prog-sub">+{stepUpRate}%</span>
              </div>
              <div className="prog-arrow">→</div>
              <div className="prog-step">
                <span className="prog-yr">Year 3</span>
                <span className="prog-val">
                  {formatIndianCurrency(monthlySWP * Math.pow(1 + stepUpRate / 100, 2))}
                </span>
                <span className="prog-sub">Year 3</span>
              </div>
              <div className="prog-arrow">→</div>
              <div className="prog-step highlight-step">
                <span className="prog-yr">Year 5</span>
                <span className="prog-val text-teal">
                  {formatIndianCurrency(monthlySWP * Math.pow(1 + stepUpRate / 100, 4))}
                </span>
                <span className="prog-sub">5th Year</span>
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
              onClick={() => setCurrentStep(4)}
              className="btn-continue"
            >
              Continue to Additional Withdrawals →
            </button>
          </div>
        </section>
      )}

      {/* STEP 4: ADDITIONAL LUMP-SUM WITHDRAWALS */}
      {currentStep === 4 && (
        <section className="step-card" aria-labelledby="step4-title">
          <div className="step-header">
            <div className="step-badge">Step 4 of 4</div>
            <h2 id="step4-title" className="step-heading">
              Plan Occasional One-Time Withdrawals
            </h2>
            <p className="step-description">
              Factor in major lifestyle milestones (travel, home repair, medical reserve, vehicle replacement) occurring in specific years.
            </p>
          </div>

          {/* Add Form */}
          <div className="lump-form-card">
            <h4 className="lump-form-heading">+ Add a One-Time Withdrawal</h4>
            <div className="lump-form-row">
              <div className="lump-field-group">
                <label htmlFor={`${baseId}-lumpYr`} className="input-label">Year of Withdrawal</label>
                <select
                  id={`${baseId}-lumpYr`}
                  value={newLumpYear}
                  onChange={(e) => setNewLumpYear(Number(e.target.value))}
                  className="lump-select"
                >
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((yr) => (
                    <option key={yr} value={yr}>
                      Year {yr} (Age {currentAge + yr - 1})
                    </option>
                  ))}
                </select>
              </div>

              <div className="lump-field-group">
                <label htmlFor={`${baseId}-lumpAmt`} className="input-label">Amount (₹)</label>
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

              <div className="lump-field-group">
                <label htmlFor={`${baseId}-lumpLbl`} className="input-label">Purpose / Label</label>
                <input
                  id={`${baseId}-lumpLbl`}
                  type="text"
                  value={newLumpLabel}
                  onChange={(e) => setNewLumpLabel(e.target.value)}
                  placeholder="e.g. Vacation"
                  className="currency-field"
                />
              </div>

              <div className="lump-field-btn">
                <button
                  type="button"
                  onClick={handleAddLumpSum}
                  className="btn-add-lump"
                >
                  Add Withdrawal
                </button>
              </div>
            </div>
          </div>

          {/* List of Active Lump Sums */}
          <div className="active-lumps-container">
            <h4 className="active-lumps-heading">
              Scheduled Additional Withdrawals ({lumpSums.length})
            </h4>

            {lumpSums.length === 0 ? (
              <div className="empty-lump-state">
                <span>💡 No additional one-time withdrawals added. You can proceed with pure monthly SWP or add occasional lumps above.</span>
              </div>
            ) : (
              <div className="lump-list-grid">
                {lumpSums.map((item) => {
                  const yr = Math.ceil(item.monthNumber / 12);
                  return (
                    <div key={item.id} className="lump-item-card">
                      <div className="lump-badge">Year {yr} (Month {item.monthNumber})</div>
                      <div className="lump-amount-val">{formatLakhsCrores(item.amount)}</div>
                      <div className="lump-exact-sub">{item.label || formatIndianCurrency(item.amount)}</div>
                      <button
                        type="button"
                        onClick={() => handleDeleteLumpSum(item.id)}
                        className="btn-delete-lump"
                        title="Delete withdrawal"
                        aria-label={`Delete Year ${yr} withdrawal of ${formatIndianCurrency(item.amount)}`}
                      >
                        ✕ Remove
                      </button>
                    </div>
                  );
                })}
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
              See Your SWP Sustainability Plan ★
            </button>
          </div>
        </section>
      )}

      {/* RESULTS DASHBOARD */}
      {currentStep === 'results' && (
        <div className="results-container" aria-live="polite">
          {/* Results Hero Card */}
          <div className="results-hero-card">
            <div className="hero-eyebrow">RETIREMENT WITHDRAWAL PLAN</div>
            <h2 className="hero-heading">How Long Could Your Corpus Last?</h2>

            <div className="primary-result-box">
              <span className="result-tag">ESTIMATED SWP SUSTAINABILITY</span>
              <div className="result-main-number">
                {result.corpusDepleted
                  ? `${result.swpDurationYears.toFixed(1)} Years`
                  : '50+ Years'}
              </div>
              <div className="result-exact-number">
                {result.corpusDepleted
                  ? `Estimated Longevity: ${formatYearsAndMonths(result.swpDurationMonths)} (${result.swpDurationMonths} Months)`
                  : 'Corpus comfortably sustains withdrawals through the full 50-year horizon'}
              </div>
            </div>

            <p className="hero-disclaimer-note">
              {result.corpusDepleted
                ? `Starting with ${formatLakhsCrores(initialCorpus)} at age ${currentAge} with an initial withdrawal of ${formatIndianCurrency(monthlySWP)}/mo stepping up by ${stepUpRate}% annually at ${annualReturn}% expected return.`
                : `Your corpus of ${formatLakhsCrores(initialCorpus)} generates compounding returns that exceed your planned monthly withdrawals.`}
            </p>
          </div>

          {/* Four Key Metrics Grid */}
          <div className="metrics-four-grid">
            <div className="metric-card">
              <span className="m-card-lbl">Starting Corpus</span>
              <span className="m-card-val text-navy">{formatLakhsCrores(result.initialCorpus)}</span>
              <span className="m-card-sub">At Age {currentAge}</span>
            </div>
            <div className="metric-card highlight-metric">
              <span className="m-card-lbl">Total Withdrawals Delivered</span>
              <span className="m-card-val text-teal">{formatLakhsCrores(result.totalWithdrawals)}</span>
              <span className="m-card-sub">{formatIndianCurrency(result.totalWithdrawals)}</span>
            </div>
            <div className="metric-card">
              <span className="m-card-lbl">SWP Duration</span>
              <span className="m-card-val text-gold">
                {result.corpusDepleted ? `${result.swpDurationYears} Years` : '50+ Years'}
              </span>
              <span className="m-card-sub">Until Age {currentAge + Math.floor(result.swpDurationMonths / 12)}</span>
            </div>
            <div className="metric-card">
              <span className="m-card-lbl">Estimated Remaining Corpus</span>
              <span className="m-card-val text-navy">{formatLakhsCrores(result.finalCorpus)}</span>
              <span className="m-card-sub">{result.corpusDepleted ? 'Fully utilized' : 'Surplus legacy'}</span>
            </div>
          </div>

          {/* Interactive Responsive SVG Corpus Depletion Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="section-subtitle">Corpus Depletion Trajectory</h3>
              <span className="chart-subtitle-note">Hover/tap points to view year-by-year corpus balance</span>
            </div>

            <div className="svg-chart-container">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="growth-svg"
                preserveAspectRatio="xMidYMid meet"
                role="region"
                aria-label="SWP Corpus Depletion Trajectory interactive chart. Use Tab to inspect points, or review the projection table below."
              >
                <defs>
                  <linearGradient id="swpAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00AB96" stopOpacity="0.35" />
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
                        {formatLakhsCrores(chartPoints.maxVal * pct)}
                      </text>
                    </g>
                  );
                })}

                {/* Area and Line */}
                {svgPathData && (
                  <>
                    <path d={svgPathData.area} fill="url(#swpAreaGradient)" aria-hidden="true" />
                    <path
                      d={svgPathData.line}
                      fill="none"
                      stroke="#00AB96"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      aria-hidden="true"
                    />
                  </>
                )}

                {/* Points and Markers */}
                {chartPoints.points.map((pt) => {
                  const isSelected = activeChartPoint === pt.yearNumber;
                  const isDepletion = pt.corpus === 0 && pt.yearNumber > 0;
                  const hasLump = pt.lumpSum > 0;
                  const accessibleLabel = pt.yearNumber === 0
                    ? `Starting Corpus at Age ${pt.age}: ${formatIndianCurrency(pt.corpus)}`
                    : `Year ${pt.yearNumber} (Age ${pt.age}): Ending corpus ${formatIndianCurrency(pt.corpus)}, Monthly SWP ${formatIndianCurrency(pt.monthlySWP)}${hasLump ? `, includes ${formatIndianCurrency(pt.lumpSum)} lump withdrawal` : ''}${isDepletion ? ' (Corpus Depleted)' : ''}`;

                  return (
                    <g key={pt.yearNumber} className="chart-point-group">
                      {isDepletion && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="9"
                          fill="#DC2626"
                          opacity="0.3"
                          aria-hidden="true"
                        />
                      )}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isDepletion ? (isSelected ? '7.5' : '6') : hasLump ? (isSelected ? '6.5' : '5') : isSelected ? '6' : '3.5'}
                        fill={isDepletion ? '#DC2626' : hasLump ? '#D97706' : '#00182A'}
                        stroke="#FFFFFF"
                        strokeWidth={isSelected ? '2.5' : '2'}
                        tabIndex={0}
                        role="button"
                        aria-label={accessibleLabel}
                        aria-pressed={isSelected}
                        className={`chart-point-dot ${isSelected ? 'active-point' : ''} ${isDepletion ? 'depletion-point' : ''}`}
                        onMouseEnter={() => setActiveChartPoint(pt.yearNumber)}
                        onClick={() => setActiveChartPoint(pt.yearNumber)}
                        onFocus={() => setActiveChartPoint(pt.yearNumber)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setActiveChartPoint(pt.yearNumber);
                          }
                        }}
                      />
                    </g>
                  );
                })}

                {/* X Axis Labels */}
                {chartPoints.points
                  .filter((_, idx) => idx === 0 || (idx) % 5 === 0 || idx === chartPoints.points.length - 1)
                  .map((pt) => (
                    <text
                      key={pt.yearNumber}
                      x={pt.x}
                      y={chartHeight - 12}
                      textAnchor="middle"
                      fontSize="11"
                      fill="#64748B"
                      fontWeight="600"
                      aria-hidden="true"
                    >
                      {pt.yearNumber === 0 ? 'Start' : `Yr ${pt.yearNumber}`}
                    </text>
                  ))}
              </svg>

              {/* Tooltip Overlay */}
              {activeChartPoint !== null && (() => {
                const pt = chartPoints.points.find((p) => p.yearNumber === activeChartPoint);
                if (!pt) return null;
                return (
                  <div className="chart-tooltip-box">
                    <div className="tooltip-yr">
                      {pt.yearNumber === 0 ? 'Starting Corpus' : `Year ${pt.yearNumber} (Age ${pt.age})`}
                    </div>
                    <div className="tooltip-row">
                      <span>Monthly SWP:</span>
                      <strong>{formatIndianCurrency(pt.monthlySWP)}/mo</strong>
                    </div>
                    {pt.lumpSum > 0 && (
                      <div className="tooltip-row text-gold">
                        <span>Lump Withdrawal:</span>
                        <strong>-{formatIndianCurrency(pt.lumpSum)}</strong>
                      </div>
                    )}
                    <div className="tooltip-row">
                      <span>Ending Corpus:</span>
                      <strong className={pt.corpus === 0 ? 'text-danger' : 'text-teal'}>
                        {formatIndianCurrency(pt.corpus)}
                      </strong>
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
              <span className="insight-title">Factual Longevity Insight</span>
              <p className="insight-text">{result.keyInsight}</p>
            </div>
          </div>

          {/* Milestone Progression Table */}
          <div className="stepup-table-card">
            <div className="table-header-row">
              <h3 className="section-subtitle">Year-by-Year Withdrawal Progression</h3>
              <button
                type="button"
                onClick={() => setShowFullProjection(!showFullProjection)}
                className="btn-toggle-projection"
              >
                {showFullProjection ? 'Show Key Milestones Only' : 'View Full Yearly Projection (All Years) ▼'}
              </button>
            </div>

            <div className="table-responsive-wrapper">
              <table className="projection-table">
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Age</th>
                    <th>Monthly SWP</th>
                    <th>Annual SWP</th>
                    <th>Lump Withdrawal</th>
                    <th>Year-End Corpus</th>
                  </tr>
                </thead>
                <tbody>
                  {result.yearlySummary
                    .filter((y) =>
                      showFullProjection
                        ? true
                        : y.yearNumber === 1 ||
                          y.yearNumber === 5 ||
                          y.yearNumber === 10 ||
                          y.yearNumber === 15 ||
                          y.yearNumber === 20 ||
                          y.yearNumber === result.yearlySummary.length ||
                          y.totalLumpSumWithdrawal > 0
                    )
                    .map((y) => (
                      <tr key={y.yearNumber} className={y.endingCorpus === 0 ? 'depletion-row-highlight' : ''}>
                        <td>
                          <strong>Year {y.yearNumber}</strong>
                        </td>
                        <td>Age {y.age}</td>
                        <td>{formatIndianCurrency(y.monthlySWPAtYearStart)}</td>
                        <td>{formatIndianCurrency(y.totalSWP)}</td>
                        <td>
                          {y.totalLumpSumWithdrawal > 0 ? (
                            <span className="text-gold font-bold">-{formatIndianCurrency(y.totalLumpSumWithdrawal)}</span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td>
                          <strong className={y.endingCorpus === 0 ? 'text-danger' : 'text-navy'}>
                            {formatIndianCurrency(y.endingCorpus)}
                          </strong>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Corpus Journey Flow */}
          <div className="flow-story-card">
            <h3 className="section-subtitle">The SWP Compounding Journey</h3>
            <div className="flow-steps-track">
              <div className="flow-step">
                <span className="flow-step-lbl">Starting Corpus</span>
                <span className="flow-step-val">{formatLakhsCrores(initialCorpus)}</span>
                <span className="flow-step-sub">At Age {currentAge}</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <span className="flow-step-lbl">Monthly SWP</span>
                <span className="flow-step-val text-teal">{formatIndianCurrency(monthlySWP)}</span>
                <span className="flow-step-sub">+{stepUpRate}% annual step-up</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <span className="flow-step-lbl">Lump Withdrawals</span>
                <span className="flow-step-val text-gold">{formatLakhsCrores(result.totalLumpSumWithdrawal)}</span>
                <span className="flow-step-sub">{lumpSums.length} milestones</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step highlight-flow-step">
                <span className="flow-step-lbl">Total Delivered</span>
                <span className="flow-step-val text-teal">{formatLakhsCrores(result.totalWithdrawals)}</span>
                <span className="flow-step-sub">Across {result.swpDurationYears} Years</span>
              </div>
              <div className="flow-arrow">=</div>
              <div className="flow-step result-flow-step">
                <span className="flow-step-lbl">Final Corpus</span>
                <span className="flow-step-val text-navy">{formatLakhsCrores(result.finalCorpus)}</span>
                <span className="flow-step-sub">{result.corpusDepleted ? 'Corpus utilized' : 'Surplus legacy'}</span>
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
                    The calculation engine converts the annual return into the effective monthly rate:
                    <br />
                    <code>i = (1 + annualReturn)^(1/12) - 1 = (1 + {annualReturn / 100})^(1/12) - 1</code>
                  </p>
                </div>

                <div className="formula-step-block">
                  <h4>2. Beginning-of-Month Withdrawal Assumption</h4>
                  <p>
                    Monthly living expenses and scheduled one-time lump-sum withdrawals are deducted from the corpus at the beginning of each calendar month before applying that month's compounding return:
                    <br />
                    <code>PreReturnCorpus = BeginningCorpus − ActualSWP − ActualLumpSum</code>
                    <br />
                    <code>ClosingCorpus = max(0, PreReturnCorpus × (1 + i))</code>
                  </p>
                </div>

                <div className="formula-step-block">
                  <h4>3. Annual Step-Up Timing</h4>
                  <p>
                    Your monthly SWP increases once every 12 months (at Months 13, 25, 37, 49, ...) to account for inflation, staying constant across all 12 months of that year.
                  </p>
                </div>

                <div className="formula-step-block">
                  <h4>4. Withdrawal Safety Capping</h4>
                  <p>
                    Actual monthly and lump-sum withdrawals are capped at the available corpus balance, preventing negative balances.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Voluntary WhatsApp Consultation CTA */}
          <div className="results-cta-card">
            <h3 className="cta-heading">Want to review your retirement withdrawal plan?</h3>
            <p className="cta-sub">
              We can help you structure your retirement portfolio across liquid cash reserves, debt funds for regular SWP income, and equity for long-term growth.
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
              This calculator provides an illustrative estimate based on the assumptions you enter. Actual investment returns, taxes, inflation, market conditions and withdrawals may differ.
            </p>
          </div>

          {/* Navigation Action Buttons */}
          <div className="step-actions mt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="btn-back"
            >
              ← Edit Corpus Inputs (Step 1)
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
        .swp-calculator-wrapper {
          width: 100%;
          max-width: 960px;
          margin: 0 auto;
          font-family: 'Inter', sans-serif;
          color: #00182A;

        /* Shared calculator primitives (action bar, stepper, step card, inputs, sliders, preview) imported from calculators.css */

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
          grid-template-columns: 1fr 1.5fr 1.5fr auto;
          gap: 0.75rem;
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

        /* Results hero and metrics grid styles imported from calculators.css */

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
          overflow: visible;
        }

        .chart-point-dot {
          cursor: pointer;
          outline: none;
          transition: r 0.2s ease, stroke 0.2s ease, stroke-width 0.2s ease, filter 0.2s ease;
        }

        .chart-point-dot:hover {
          stroke: var(--color-growth-teal);
          stroke-width: 3px;
        }

        .chart-point-dot.active-point {
          stroke: var(--color-growth-teal);
          stroke-width: 3.5px;
          filter: drop-shadow(0 2px 6px rgba(0, 171, 150, 0.45));
        }

        .chart-point-dot:focus-visible {
          outline: 2px solid var(--color-primary-navy) !important;
          outline-offset: 3px !important;
          stroke: var(--color-primary-navy);
          stroke-width: 3.5px;
          filter: drop-shadow(0 0 6px rgba(0, 24, 42, 0.6));
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

        .depletion-row-highlight {
          background: #FEF2F2;
        }

        /* Flow Story Card */
        .flow-story-card {
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

        /* Shared insight card, accordion, consultation CTA, step actions, and utilities imported from calculators.css */

        /* Responsive Breakpoints (SWP-Specific) */
        @media (max-width: 860px) {
          .lump-form-row {
            grid-template-columns: 1fr;
          }
          .flow-steps-track {
            flex-direction: column;
            align-items: stretch;
          }
          .flow-arrow {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
