import React, { useState, useId, useMemo } from 'react';
import {
  calculateRetirementAccumulationPlan,
  formatIndianCurrency,
  formatLakhsCrores,
  formatPercentage,
  type RetirementPlannerInput
} from '../../utils/calculations/retirementAccumulationPlanner';

type WizardStep = 1 | 2 | 3 | 4 | 5 | 'results';

export default function RetirementAccumulationPlanner() {
  const baseId = useId();

  // Wizard Navigation
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);

  // Step 1: Current Expenses (Annual)
  const [householdExpenses, setHouseholdExpenses] = useState<number>(1200000); // ₹12 Lakh/yr
  const [lifestyleExpenses, setLifestyleExpenses] = useState<number>(0);
  const [otherExpenses, setOtherExpenses] = useState<number>(0);

  // Step 2: Timeline & Inflation
  const [currentAge, setCurrentAge] = useState<number>(50);
  const [retirementAge, setRetirementAge] = useState<number>(60);
  const [inflationPreRetirement, setInflationPreRetirement] = useState<number>(6);
  const [expenseReductionPercent, setExpenseReductionPercent] = useState<number>(20);

  // Step 3: Corpus Assumptions
  const [lifeExpectancyAge, setLifeExpectancyAge] = useState<number>(90);
  const [inflationPostRetirement, setInflationPostRetirement] = useState<number>(6);
  const [taxRateOnCorpusReturn, setTaxRateOnCorpusReturn] = useState<number>(12.5);
  const [corpusReturnPreTax, setCorpusReturnPreTax] = useState<number>(10.5);
  const [childrenOrCharityCorpus, setChildrenOrCharityCorpus] = useState<number>(0);

  // Step 4: Existing Retirement Resources (Expected Value at Retirement)
  const [epfNps, setEpfNps] = useState<number>(7500000);
  const [gratuity, setGratuity] = useState<number>(2500000);
  const [superannuationOther, setSuperannuationOther] = useState<number>(0);
  const [fixedDeposits, setFixedDeposits] = useState<number>(3000000);
  const [insuranceMaturity, setInsuranceMaturity] = useState<number>(2500000);
  const [mutualFundsInvestments, setMutualFundsInvestments] = useState<number>(4500000);

  // Step 5: Fresh Investment Plan
  const [startInvestingDelay, setStartInvestingDelay] = useState<number>(0);
  const [expectedNewInvestmentReturn, setExpectedNewInvestmentReturn] = useState<number>(12);
  const [annualStepUpRate, setAnnualStepUpRate] = useState<number>(10);

  // Results Accordion
  const [showHowItWorks, setShowHowItWorks] = useState<boolean>(false);

  // Calculate Result
  const planInput: RetirementPlannerInput = useMemo(() => ({
    expenses: {
      householdExpenses,
      lifestyleExpenses,
      otherExpenses
    },
    timeline: {
      currentAge,
      retirementAge,
      inflationPreRetirement,
      expenseReductionPercent
    },
    corpus: {
      lifeExpectancyAge,
      inflationPostRetirement,
      taxRateOnCorpusReturn,
      corpusReturnPreTax,
      childrenOrCharityCorpus
    },
    employmentBenefits: {
      epfNps,
      gratuity,
      superannuationOther
    },
    retirementAssets: {
      fixedDeposits,
      insuranceMaturity,
      mutualFundsInvestments
    },
    funding: {
      startInvestingDelay,
      expectedNewInvestmentReturn,
      annualStepUpRate
    }
  }), [
    householdExpenses,
    lifestyleExpenses,
    otherExpenses,
    currentAge,
    retirementAge,
    inflationPreRetirement,
    expenseReductionPercent,
    lifeExpectancyAge,
    inflationPostRetirement,
    taxRateOnCorpusReturn,
    corpusReturnPreTax,
    childrenOrCharityCorpus,
    epfNps,
    gratuity,
    superannuationOther,
    fixedDeposits,
    insuranceMaturity,
    mutualFundsInvestments,
    startInvestingDelay,
    expectedNewInvestmentReturn,
    annualStepUpRate
  ]);

  const result = useMemo(() => calculateRetirementAccumulationPlan(planInput), [planInput]);

  // Load Benchmark Scenario
  const handleLoadSampleData = () => {
    setHouseholdExpenses(1200000);
    setLifestyleExpenses(0);
    setOtherExpenses(0);
    setCurrentAge(50);
    setRetirementAge(60);
    setInflationPreRetirement(6);
    setExpenseReductionPercent(20);
    setLifeExpectancyAge(90);
    setInflationPostRetirement(6);
    setTaxRateOnCorpusReturn(12.5);
    setCorpusReturnPreTax(10.5);
    setChildrenOrCharityCorpus(0);
    setEpfNps(7500000);
    setGratuity(2500000);
    setSuperannuationOther(0);
    setFixedDeposits(3000000);
    setInsuranceMaturity(2500000);
    setMutualFundsInvestments(4500000);
    setStartInvestingDelay(0);
    setExpectedNewInvestmentReturn(12);
    setAnnualStepUpRate(10);
    setCurrentStep('results');
  };

  // Reset to Baseline
  const handleReset = () => {
    setHouseholdExpenses(900000);
    setLifestyleExpenses(100000);
    setOtherExpenses(0);
    setCurrentAge(35);
    setRetirementAge(60);
    setInflationPreRetirement(6);
    setExpenseReductionPercent(20);
    setLifeExpectancyAge(85);
    setInflationPostRetirement(6);
    setTaxRateOnCorpusReturn(12.5);
    setCorpusReturnPreTax(10.5);
    setChildrenOrCharityCorpus(0);
    setEpfNps(2000000);
    setGratuity(1000000);
    setSuperannuationOther(0);
    setFixedDeposits(500000);
    setInsuranceMaturity(500000);
    setMutualFundsInvestments(1500000);
    setStartInvestingDelay(0);
    setExpectedNewInvestmentReturn(12);
    setAnnualStepUpRate(10);
    setCurrentStep(1);
  };

  // WhatsApp Prepopulated Deep Link
  const generateWhatsAppUrl = () => {
    const corpus = formatLakhsCrores(result.totalRetirementCorpusRequired);
    const assets = formatLakhsCrores(result.totalRetirementAssets);
    const gap = formatLakhsCrores(result.fundingDeficit);
    const sip = formatIndianCurrency(result.requiredFixedSIP);

    const message = `Hi Santhosh, I used the Retirement Planner on Ant Wealth Creation.

• Required Retirement Corpus: ${corpus} (at Age ${retirementAge})
• Existing Resources: ${assets}
• Remaining Funding Gap: ${gap}
• Required Monthly SIP: ${sip}/month

Can we connect to discuss this plan?`;

    return `https://wa.me/918087971566?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="retirement-planner-wrapper">
      {/* Top Action Bar: Sample Scenario & Reset */}
      <div className="calc-top-action-bar">
        <div className="action-tagline">
          <span className="live-pulse"></span>
          <span>Retirement Accumulation Roadmap</span>
        </div>
        <div className="action-btn-group">
          <button
            type="button"
            onClick={handleLoadSampleData}
            className="btn-sample-preset"
            title="Load Age 50 to 60 sample scenario"
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

      {/* Stepper Navigation (5 Steps + Results) */}
      <nav className="stepper-nav" aria-label="Calculator Steps">
        <ol className="stepper-list stepper-list-6">
          {[
            { step: 1, title: 'Current Expenses', icon: '💳' },
            { step: 2, title: 'Timeline', icon: '⏳' },
            { step: 3, title: 'Required Corpus', icon: '🌅' },
            { step: 4, title: 'Existing Resources', icon: '🛡️' },
            { step: 5, title: 'Funding Plan', icon: '🎯' },
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

      {/* STEP 1: CURRENT EXPENSES */}
      {currentStep === 1 && (
        <section className="step-card" aria-labelledby="step1-title">
          <div className="step-header">
            <div className="step-badge">Step 1 of 5</div>
            <h2 id="step1-title" className="step-heading">
              How much do you spend today?
            </h2>
            <p className="step-description">
              Your current living costs serve as the foundation for estimating your future retirement expenses.
            </p>
          </div>

          <div className="inputs-grid">
            <div className="input-group">
              <label htmlFor={`${baseId}-household`} className="input-label">
                Household Living Expenses (Annual) *
              </label>
              <div className="currency-input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  id={`${baseId}-household`}
                  type="number"
                  min="0"
                  step="50000"
                  value={householdExpenses || ''}
                  onChange={(e) => setHouseholdExpenses(Math.max(0, Number(e.target.value)))}
                  placeholder="1200000"
                  className="currency-field"
                />
                <span className="unit-tag">{formatLakhsCrores(householdExpenses)}/yr</span>
              </div>
              <span className="input-helper">Groceries, utilities, housing, healthcare, transport & regular bills</span>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-lifestyle`} className="input-label">
                Lifestyle & Discretionary Expenses (Annual)
              </label>
              <div className="currency-input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  id={`${baseId}-lifestyle`}
                  type="number"
                  min="0"
                  step="25000"
                  value={lifestyleExpenses || ''}
                  onChange={(e) => setLifestyleExpenses(Math.max(0, Number(e.target.value)))}
                  placeholder="0"
                  className="currency-field"
                />
                <span className="unit-tag">{formatLakhsCrores(lifestyleExpenses)}/yr</span>
              </div>
              <span className="input-helper">Vacations, dining out, hobbies, subscriptions & entertainment</span>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-other`} className="input-label">
                Other Ongoing Expenses (Annual)
              </label>
              <div className="currency-input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  id={`${baseId}-other`}
                  type="number"
                  min="0"
                  step="25000"
                  value={otherExpenses || ''}
                  onChange={(e) => setOtherExpenses(Math.max(0, Number(e.target.value)))}
                  placeholder="0"
                  className="currency-field"
                />
                <span className="unit-tag">{formatLakhsCrores(otherExpenses)}/yr</span>
              </div>
              <span className="input-helper">Parental support, insurance premiums, donations or annual commitments</span>
            </div>
          </div>

          {/* Current Total Summary Box */}
          <div className="expense-summary-box">
            <div className="summary-col">
              <span className="summary-lbl">Total Current Annual Expenses</span>
              <span className="summary-val text-navy">{formatIndianCurrency(result.totalCurrentAnnualExpenses)}/yr</span>
              <span className="summary-sub">{formatLakhsCrores(result.totalCurrentAnnualExpenses)} per year</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-col">
              <span className="summary-lbl">Monthly Equivalent</span>
              <span className="summary-val text-teal">{formatIndianCurrency(result.currentMonthlyExpenses)}/mo</span>
              <span className="summary-sub">Average monthly cash outflow</span>
            </div>
          </div>

          <div className="step-actions">
            <div></div>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="btn-continue"
            >
              Continue to Retirement Timeline →
            </button>
          </div>
        </section>
      )}

      {/* STEP 2: RETIREMENT TIMELINE & INFLATION */}
      {currentStep === 2 && (
        <section className="step-card" aria-labelledby="step2-title">
          <div className="step-header">
            <div className="step-badge">Step 2 of 5</div>
            <h2 id="step2-title" className="step-heading">
              When do you want to retire?
            </h2>
            <p className="step-description">
              Set your target retirement age and estimate how inflation and lifestyle changes will shape your expenses at retirement.
            </p>
          </div>

          <div className="inputs-grid">
            <div className="input-group">
              <label htmlFor={`${baseId}-currAge`} className="input-label">
                Current Age (Years) *
              </label>
              <div className="slider-group">
                <div className="slider-value-display">
                  <span>{currentAge} Years Old</span>
                </div>
                <input
                  id={`${baseId}-currAge`}
                  type="range"
                  min="20"
                  max="70"
                  step="1"
                  value={currentAge}
                  onChange={(e) => {
                    const newAge = Number(e.target.value);
                    setCurrentAge(newAge);
                    if (retirementAge <= newAge) setRetirementAge(newAge + 5);
                  }}
                  className="range-slider"
                />
                <div className="slider-ticks">
                  <span>20 yrs</span>
                  <span>35 yrs</span>
                  <span>50 yrs</span>
                  <span>70 yrs</span>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-retAge`} className="input-label">
                Planned Retirement Age (Years) *
              </label>
              <div className="slider-group">
                <div className="slider-value-display">
                  <span>{retirementAge} Years Old ({result.yearsUntilRetirement} yrs to retirement)</span>
                </div>
                <input
                  id={`${baseId}-retAge`}
                  type="range"
                  min={currentAge + 1}
                  max="75"
                  step="1"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(Number(e.target.value))}
                  className="range-slider"
                />
                <div className="slider-ticks">
                  <span>{currentAge + 1} yrs</span>
                  <span>55 yrs</span>
                  <span>60 yrs (Standard)</span>
                  <span>75 yrs</span>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-preInf`} className="input-label">
                Inflation Until Retirement (%)
              </label>
              <div className="slider-group">
                <div className="slider-value-display">
                  <span>{inflationPreRetirement}% p.a.</span>
                </div>
                <input
                  id={`${baseId}-preInf`}
                  type="range"
                  min="4"
                  max="10"
                  step="0.5"
                  value={inflationPreRetirement}
                  onChange={(e) => setInflationPreRetirement(Number(e.target.value))}
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
              <label htmlFor={`${baseId}-expRed`} className="input-label">
                Expected Reduction in Expenses After Retirement (%)
              </label>
              <div className="slider-group">
                <div className="slider-value-display">
                  <span>{expenseReductionPercent}% Reduction (80% of current lifestyle)</span>
                </div>
                <input
                  id={`${baseId}-expRed`}
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={expenseReductionPercent}
                  onChange={(e) => setExpenseReductionPercent(Number(e.target.value))}
                  className="range-slider"
                />
                <div className="slider-ticks">
                  <span>0% (Same)</span>
                  <span>20% (Default)</span>
                  <span>35%</span>
                  <span>50%</span>
                </div>
              </div>
              <span className="input-helper">Work commutes, child education and EMIs usually end, while healthcare may rise</span>
            </div>
          </div>

          {/* Future Expense Preview Box */}
          <div className="future-expense-preview-card">
            <h3 className="preview-title">Estimated Living Expenses at Age {retirementAge} ({result.yearsUntilRetirement} Years Away)</h3>
            <div className="preview-metrics-grid">
              <div className="prev-metric">
                <span className="prev-lbl">Today's Annual Expenses</span>
                <span className="prev-val">{formatLakhsCrores(result.totalCurrentAnnualExpenses)}</span>
                <span className="prev-sub">{formatIndianCurrency(result.totalCurrentAnnualExpenses)}/yr</span>
              </div>
              <div className="prev-arrow">→</div>
              <div className="prev-metric highlight-metric">
                <span className="prev-lbl">Estimated Annual Expenses at Retirement</span>
                <span className="prev-val text-teal">{formatLakhsCrores(result.futureAnnualExpenses)}/yr</span>
                <span className="prev-sub">{formatIndianCurrency(result.futureAnnualExpenses)}/yr</span>
              </div>
              <div className="prev-arrow">=</div>
              <div className="prev-metric">
                <span className="prev-lbl">Estimated Monthly Expenses</span>
                <span className="prev-val text-gold">{formatIndianCurrency(result.futureMonthlyExpenses)}/mo</span>
                <span className="prev-sub">Monthly cash required at age {retirementAge}</span>
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
              Continue to Required Corpus →
            </button>
          </div>
        </section>
      )}

      {/* STEP 3: RETIREMENT CORPUS & ASSUMPTIONS */}
      {currentStep === 3 && (
        <section className="step-card" aria-labelledby="step3-title">
          <div className="step-header">
            <div className="step-badge">Step 3 of 5</div>
            <h2 id="step3-title" className="step-heading">
              How large could your retirement corpus need to be?
            </h2>
            <p className="step-description">
              We calculate the exact corpus required to sustain your living expenses from retirement at age {retirementAge} to life expectancy using accurate year-by-year cash flow math.
            </p>
          </div>

          <div className="inputs-grid">
            <div className="input-group">
              <label htmlFor={`${baseId}-lifeExp`} className="input-label">
                Life Expectancy Age (Years) *
              </label>
              <div className="slider-group">
                <div className="slider-value-display">
                  <span>{lifeExpectancyAge} Years Old ({result.yearsPostRetirement} yrs in retirement)</span>
                </div>
                <input
                  id={`${baseId}-lifeExp`}
                  type="range"
                  min={retirementAge + 5}
                  max="100"
                  step="1"
                  value={lifeExpectancyAge}
                  onChange={(e) => setLifeExpectancyAge(Number(e.target.value))}
                  className="range-slider"
                />
                <div className="slider-ticks">
                  <span>{retirementAge + 5} yrs</span>
                  <span>80 yrs</span>
                  <span>90 yrs (Recommended)</span>
                  <span>100 yrs</span>
                </div>
              </div>
              <span className="input-helper">Planning up to age 85–90 ensures you never outlive your accumulated wealth</span>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-legacy`} className="input-label">
                Optional Corpus for Children / Charity (₹)
              </label>
              <div className="currency-input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  id={`${baseId}-legacy`}
                  type="number"
                  min="0"
                  step="500000"
                  value={childrenOrCharityCorpus || ''}
                  onChange={(e) => setChildrenOrCharityCorpus(Math.max(0, Number(e.target.value)))}
                  placeholder="0"
                  className="currency-field"
                />
                <span className="unit-tag">{formatLakhsCrores(childrenOrCharityCorpus)}</span>
              </div>
              <span className="input-helper">Leave empty or enter ₹0 if your goal is pure self-reliance in retirement</span>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-postInf`} className="input-label">
                Inflation During Retirement (%)
              </label>
              <div className="slider-group">
                <div className="slider-value-display">
                  <span>{inflationPostRetirement}% p.a.</span>
                </div>
                <input
                  id={`${baseId}-postInf`}
                  type="range"
                  min="4"
                  max="9"
                  step="0.5"
                  value={inflationPostRetirement}
                  onChange={(e) => setInflationPostRetirement(Number(e.target.value))}
                  className="range-slider"
                />
                <div className="slider-ticks">
                  <span>4%</span>
                  <span>6% (Standard)</span>
                  <span>8%</span>
                  <span>9%</span>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-preTaxRet`} className="input-label">
                Expected Gross Return on Corpus (%)
              </label>
              <div className="slider-group">
                <div className="slider-value-display">
                  <span>{corpusReturnPreTax}% p.a. Pre-Tax</span>
                </div>
                <input
                  id={`${baseId}-preTaxRet`}
                  type="range"
                  min="7"
                  max="14"
                  step="0.25"
                  value={corpusReturnPreTax}
                  onChange={(e) => setCorpusReturnPreTax(Number(e.target.value))}
                  className="range-slider"
                />
                <div className="slider-ticks">
                  <span>7% (Conservative)</span>
                  <span>10.5% (Balanced)</span>
                  <span>14%</span>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-taxRate`} className="input-label">
                Net Effective Tax on Corpus Returns (%)
              </label>
              <div className="slider-group">
                <div className="slider-value-display">
                  <span>{taxRateOnCorpusReturn}% Average Tax</span>
                </div>
                <input
                  id={`${baseId}-taxRate`}
                  type="range"
                  min="0"
                  max="30"
                  step="2.5"
                  value={taxRateOnCorpusReturn}
                  onChange={(e) => setTaxRateOnCorpusReturn(Number(e.target.value))}
                  className="range-slider"
                />
                <div className="slider-ticks">
                  <span>0%</span>
                  <span>12.5% (LTCG Blend)</span>
                  <span>20%</span>
                  <span>30%</span>
                </div>
              </div>
              <span className="input-helper">Blended capital gains and debt taxation across your retirement portfolio</span>
            </div>
          </div>

          {/* Mathematical Rate Journey Track */}
          <div className="rate-breakdown-card">
            <h3 className="rate-breakdown-title">How Inflation & Taxes Affect Your Returns</h3>
            <div className="rate-journey-track">
              <div className="journey-node">
                <span className="node-label">Gross Return</span>
                <span className="node-value">{corpusReturnPreTax}%</span>
                <span className="node-sub">Portfolio yield</span>
              </div>
              <div className="journey-connector">
                <span className="connector-tag">-{taxRateOnCorpusReturn}% Tax</span>
                <span className="connector-line"></span>
              </div>
              <div className="journey-node">
                <span className="node-label">After-Tax Return</span>
                <span className="node-value text-teal">{formatPercentage(result.taxAdjustedReturn)}</span>
                <span className="node-sub">Net earnings</span>
              </div>
              <div className="journey-connector">
                <span className="connector-tag">-{inflationPostRetirement}% Inflation</span>
                <span className="connector-line"></span>
              </div>
              <div className="journey-node highlight-node">
                <span className="node-label">Real Return</span>
                <span className="node-value text-gold">{formatPercentage(result.realReturn)}</span>
                <span className="node-sub">Purchasing power</span>
              </div>
            </div>
          </div>

          {/* Calculated Corpus Banner */}
          <div className="corpus-summary-banner">
            <div className="corpus-banner-content">
              <span className="corpus-banner-lbl">Total Estimated Retirement Corpus Required</span>
              <div className="corpus-banner-amount text-navy">{formatLakhsCrores(result.totalRetirementCorpusRequired)}</div>
              <div className="corpus-banner-exact">Total Estimated Corpus Needed: {formatIndianCurrency(result.totalRetirementCorpusRequired)}</div>
              <p className="corpus-banner-note">
                Sustains ₹{result.futureAnnualExpenses.toLocaleString('en-IN')}/year ({formatIndianCurrency(result.futureMonthlyExpenses)}/month) for {result.yearsPostRetirement} years from age {retirementAge} to {lifeExpectancyAge}.
              </p>
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
              Continue to Existing Resources →
            </button>
          </div>
        </section>
      )}

      {/* STEP 4: EXISTING RETIREMENT RESOURCES */}
      {currentStep === 4 && (
        <section className="step-card" aria-labelledby="step4-title">
          <div className="step-header">
            <div className="step-badge">Step 4 of 5</div>
            <h2 id="step4-title" className="step-heading">
              What resources may already be available at retirement?
            </h2>
            <p className="step-description">
              Enter the <strong>expected value available at retirement</strong> for your employment benefits and personal assets. The calculator treats these as future maturity values and will not compound them again.
            </p>
          </div>

          {/* Section A: Employment Benefits */}
          <div className="resource-section-block">
            <h3 className="resource-section-title">Section A — Employment & Retirement Benefits</h3>
            <div className="inputs-grid">
              <div className="input-group">
                <label htmlFor={`${baseId}-epf`} className="input-label">
                  EPF / PPF / NPS (Expected Value at Age {retirementAge})
                </label>
                <div className="currency-input-wrapper">
                  <span className="currency-symbol">₹</span>
                  <input
                    id={`${baseId}-epf`}
                    type="number"
                    min="0"
                    step="500000"
                    value={epfNps || ''}
                    onChange={(e) => setEpfNps(Math.max(0, Number(e.target.value)))}
                    placeholder="7500000"
                    className="currency-field"
                  />
                  <span className="unit-tag">{formatLakhsCrores(epfNps)}</span>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor={`${baseId}-gratuity`} className="input-label">
                  Gratuity (Expected at Retirement)
                </label>
                <div className="currency-input-wrapper">
                  <span className="currency-symbol">₹</span>
                  <input
                    id={`${baseId}-gratuity`}
                    type="number"
                    min="0"
                    step="200000"
                    value={gratuity || ''}
                    onChange={(e) => setGratuity(Math.max(0, Number(e.target.value)))}
                    placeholder="2500000"
                    className="currency-field"
                  />
                  <span className="unit-tag">{formatLakhsCrores(gratuity)}</span>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor={`${baseId}-superann`} className="input-label">
                  Superannuation / Other Employer Schemes
                </label>
                <div className="currency-input-wrapper">
                  <span className="currency-symbol">₹</span>
                  <input
                    id={`${baseId}-superann`}
                    type="number"
                    min="0"
                    step="200000"
                    value={superannuationOther || ''}
                    onChange={(e) => setSuperannuationOther(Math.max(0, Number(e.target.value)))}
                    placeholder="0"
                    className="currency-field"
                  />
                  <span className="unit-tag">{formatLakhsCrores(superannuationOther)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section B: Personal Assets */}
          <div className="resource-section-block">
            <h3 className="resource-section-title">Section B — Personal Investments & Policies</h3>
            <div className="inputs-grid">
              <div className="input-group">
                <label htmlFor={`${baseId}-fds`} className="input-label">
                  Fixed Deposits / Bank Savings (at Retirement)
                </label>
                <div className="currency-input-wrapper">
                  <span className="currency-symbol">₹</span>
                  <input
                    id={`${baseId}-fds`}
                    type="number"
                    min="0"
                    step="500000"
                    value={fixedDeposits || ''}
                    onChange={(e) => setFixedDeposits(Math.max(0, Number(e.target.value)))}
                    placeholder="3000000"
                    className="currency-field"
                  />
                  <span className="unit-tag">{formatLakhsCrores(fixedDeposits)}</span>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor={`${baseId}-ins`} className="input-label">
                  Insurance Maturity Values (at Retirement)
                </label>
                <div className="currency-input-wrapper">
                  <span className="currency-symbol">₹</span>
                  <input
                    id={`${baseId}-ins`}
                    type="number"
                    min="0"
                    step="500000"
                    value={insuranceMaturity || ''}
                    onChange={(e) => setInsuranceMaturity(Math.max(0, Number(e.target.value)))}
                    placeholder="2500000"
                    className="currency-field"
                  />
                  <span className="unit-tag">{formatLakhsCrores(insuranceMaturity)}</span>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor={`${baseId}-mfs`} className="input-label">
                  Mutual Funds / Stocks Earmarked (at Retirement)
                </label>
                <div className="currency-input-wrapper">
                  <span className="currency-symbol">₹</span>
                  <input
                    id={`${baseId}-mfs`}
                    type="number"
                    min="0"
                    step="500000"
                    value={mutualFundsInvestments || ''}
                    onChange={(e) => setMutualFundsInvestments(Math.max(0, Number(e.target.value)))}
                    placeholder="4500000"
                    className="currency-field"
                  />
                  <span className="unit-tag">{formatLakhsCrores(mutualFundsInvestments)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Goal Progress Summary Card */}
          <div className="asset-progress-summary-card">
            <div className="asset-summary-grid">
              <div className="summary-stat">
                <span className="stat-lbl">Employment Benefits</span>
                <span className="stat-num">{formatLakhsCrores(result.totalEmploymentBenefits)}</span>
                <span className="stat-sub">{formatIndianCurrency(result.totalEmploymentBenefits)}</span>
              </div>
              <div className="summary-stat">
                <span className="stat-lbl">Personal Assets</span>
                <span className="stat-num">{formatLakhsCrores(result.totalOwnAssets)}</span>
                <span className="stat-sub">{formatIndianCurrency(result.totalOwnAssets)}</span>
              </div>
              <div className="summary-stat highlight-stat">
                <span className="stat-lbl">Total Assets at Retirement</span>
                <span className="stat-num text-teal">{formatLakhsCrores(result.totalRetirementAssets)}</span>
                <span className="stat-sub">{result.goalProgress}% of required corpus</span>
              </div>
              <div className="summary-stat highlight-stat-gold">
                <span className="stat-lbl">Remaining Funding Gap</span>
                <span className="stat-num text-gold">{formatLakhsCrores(result.fundingDeficit)}</span>
                <span className="stat-sub">{formatIndianCurrency(result.fundingDeficit)} deficit</span>
              </div>
            </div>

            <div className="progress-bar-container">
              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${result.goalProgress}%` }}
                ></div>
              </div>
              <div className="progress-bar-labels">
                <span>{result.goalProgress}% Funded</span>
                <span>Target: {formatLakhsCrores(result.totalRetirementCorpusRequired)}</span>
              </div>
            </div>
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
              onClick={() => setCurrentStep(5)}
              className="btn-continue"
            >
              Continue to Funding Plan →
            </button>
          </div>
        </section>
      )}

      {/* STEP 5: FRESH INVESTMENT PLAN */}
      {currentStep === 5 && (
        <section className="step-card" aria-labelledby="step5-title">
          <div className="step-header">
            <div className="step-badge">Step 5 of 5</div>
            <h2 id="step5-title" className="step-heading">
              How much should you invest from today?
            </h2>
            <p className="step-description">
              Set your expected investment growth rate, start delay, and annual SIP step-up to generate your tailored monthly savings plan to bridge your {formatLakhsCrores(result.fundingDeficit)} gap.
            </p>
          </div>

          <div className="inputs-grid">
            <div className="input-group">
              <label htmlFor={`${baseId}-newRet`} className="input-label">
                Expected Annual Investment Return (%)
              </label>
              <div className="slider-group">
                <div className="slider-value-display">
                  <span>{expectedNewInvestmentReturn}% p.a.</span>
                </div>
                <input
                  id={`${baseId}-newRet`}
                  type="range"
                  min="6"
                  max="18"
                  step="0.5"
                  value={expectedNewInvestmentReturn}
                  onChange={(e) => setExpectedNewInvestmentReturn(Number(e.target.value))}
                  className="range-slider"
                />
                <div className="slider-ticks">
                  <span>6% (Debt/FD)</span>
                  <span>9% (Hybrid)</span>
                  <span>12% (Equity MF)</span>
                  <span>18%</span>
                </div>
              </div>
              <span className="input-helper">Illustrative planning assumption (market returns are not guaranteed)</span>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-stepUpRate`} className="input-label">
                Annual SIP Step-Up (%)
              </label>
              <div className="slider-group">
                <div className="slider-value-display">
                  <span>{annualStepUpRate}% Increase Every Year</span>
                </div>
                <input
                  id={`${baseId}-stepUpRate`}
                  type="range"
                  min="0"
                  max="25"
                  step="1"
                  value={annualStepUpRate}
                  onChange={(e) => setAnnualStepUpRate(Number(e.target.value))}
                  className="range-slider"
                />
                <div className="slider-ticks">
                  <span>0% (Flat SIP)</span>
                  <span>5%</span>
                  <span>10% (Recommended)</span>
                  <span>25%</span>
                </div>
              </div>
              <span className="input-helper">Starting with a lower SIP and stepping up with annual salary growth makes targets achievable</span>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-delayYrs`} className="input-label">
                Start Investing After (Delay in Years)
              </label>
              <div className="slider-group">
                <div className="slider-value-display">
                  <span>{startInvestingDelay === 0 ? 'Start Immediately (0 yrs)' : `Start after ${startInvestingDelay} yrs`}</span>
                </div>
                <input
                  id={`${baseId}-delayYrs`}
                  type="range"
                  min="0"
                  max={Math.max(0, result.yearsUntilRetirement - 1)}
                  step="1"
                  value={startInvestingDelay}
                  onChange={(e) => setStartInvestingDelay(Number(e.target.value))}
                  className="range-slider"
                />
                <div className="slider-ticks">
                  <span>0 yrs</span>
                  <span>{Math.max(0, result.yearsUntilRetirement - 1)} yrs (Max Delay)</span>
                </div>
              </div>
              <span className="input-helper">Remaining accumulation horizon: {result.yearsAvailableForInvestment} years</span>
            </div>
          </div>

          <div className="step-actions">
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="btn-back"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep('results')}
              className="btn-view-results"
            >
              See Your Retirement Plan ★
            </button>
          </div>
        </section>
      )}

      {/* RESULTS DASHBOARD */}
      {currentStep === 'results' && (
        <div className="results-container" aria-live="polite">
          {/* Results Hero Card */}
          <div className="results-hero-card">
            <div className="hero-eyebrow">YOUR RETIREMENT READINESS SNAPSHOT</div>
            <h2 className="hero-heading">Estimated Retirement Corpus Required</h2>

            <div className="primary-result-box">
              <span className="result-tag">ESTIMATED RETIREMENT CORPUS</span>
              <div className="result-main-number">
                {formatLakhsCrores(result.totalRetirementCorpusRequired)}
              </div>
              <div className="result-exact-number">
                Exact Corpus Requirement: {formatIndianCurrency(result.totalRetirementCorpusRequired)}
              </div>
            </div>

            <p className="hero-disclaimer-note">
              To support an estimated annual living expense of {formatLakhsCrores(result.futureAnnualExpenses)} ({formatIndianCurrency(result.futureMonthlyExpenses)}/month) for {result.yearsPostRetirement} years starting at retirement age {retirementAge}.
            </p>
          </div>

          {/* Retirement Journey Progression Flow */}
          <div className="results-journey-card">
            <h3 className="section-subtitle">Your Retirement Capital Flow</h3>
            <div className="journey-flow-grid">
              <div className="journey-step-box">
                <span className="j-step-lbl">Today's Expenses</span>
                <span className="j-step-val">{formatLakhsCrores(result.totalCurrentAnnualExpenses)}</span>
                <span className="j-step-sub">{formatIndianCurrency(result.currentMonthlyExpenses)}/mo</span>
              </div>
              <div className="j-arrow">→</div>
              <div className="journey-step-box">
                <span className="j-step-lbl">Expenses at Age {retirementAge}</span>
                <span className="j-step-val text-teal">{formatLakhsCrores(result.futureAnnualExpenses)}</span>
                <span className="j-step-sub">{formatIndianCurrency(result.futureMonthlyExpenses)}/mo</span>
              </div>
              <div className="j-arrow">→</div>
              <div className="journey-step-box highlight-j-box">
                <span className="j-step-lbl">Corpus Required</span>
                <span className="j-step-val text-navy">{formatLakhsCrores(result.totalRetirementCorpusRequired)}</span>
                <span className="j-step-sub">{result.yearsPostRetirement}-yr Living Corpus</span>
              </div>
              <div className="j-arrow">-</div>
              <div className="journey-step-box">
                <span className="j-step-lbl">Existing Resources</span>
                <span className="j-step-val text-teal">{formatLakhsCrores(result.totalRetirementAssets)}</span>
                <span className="j-step-sub">{result.goalProgress}% Funded</span>
              </div>
              <div className="j-arrow">=</div>
              <div className="journey-step-box gap-j-box">
                <span className="j-step-lbl">Remaining Gap</span>
                <span className="j-step-val text-gold">{formatLakhsCrores(result.fundingDeficit)}</span>
                <span className="j-step-sub">{formatIndianCurrency(result.fundingDeficit)}</span>
              </div>
            </div>
          </div>

          {/* Goal Progress Summary Bar */}
          <div className="progress-summary-card">
            <div className="progress-metrics-row">
              <div className="prog-metric-col">
                <span className="metric-lbl">Total Required Corpus</span>
                <span className="metric-val">{formatLakhsCrores(result.totalRetirementCorpusRequired)}</span>
                <span className="metric-sub">{formatIndianCurrency(result.totalRetirementCorpusRequired)}</span>
              </div>
              <div className="prog-metric-col">
                <span className="metric-lbl">Already Earmarked</span>
                <span className="metric-val text-teal">{formatLakhsCrores(result.totalRetirementAssets)}</span>
                <span className="metric-sub">{result.goalProgress}% on track</span>
              </div>
              <div className="prog-metric-col">
                <span className="metric-lbl">Remaining Deficit</span>
                <span className="metric-val text-gold">{formatLakhsCrores(result.fundingDeficit)}</span>
                <span className="metric-sub">{formatIndianCurrency(result.fundingDeficit)} gap</span>
              </div>
            </div>

            <div className="visual-progress-track">
              <div
                className="visual-progress-fill"
                style={{ width: `${result.goalProgress}%` }}
              ></div>
            </div>
          </div>

          {/* 3 Prominent Funding Options Grid */}
          <div className="funding-options-section">
            <h3 className="section-subtitle">
              {result.isFullyFunded
                ? 'Your Retirement Goal Is 100% Covered!'
                : `3 Ways to Fund Your Remaining ${formatLakhsCrores(result.fundingDeficit)} Gap`}
            </h3>

            {result.isFullyFunded ? (
              <div className="fully-funded-notice">
                <span className="notice-icon">🎉</span>
                <div className="notice-text">
                  <strong>Congratulations! Your retirement goal is fully funded.</strong>
                  <p>
                    Your expected retirement assets of {formatLakhsCrores(result.totalRetirementAssets)} are sufficient to cover your estimated corpus requirement of {formatLakhsCrores(result.totalRetirementCorpusRequired)}. Focus on maintaining disciplined asset allocation across debt and equity as your retirement age approaches.
                  </p>
                </div>
              </div>
            ) : (
              <div className="options-cards-grid">
                {/* Option 1: Lump Sum Today */}
                <div className="option-card">
                  <div className="option-header">
                    <span className="option-badge">Option 1</span>
                    <h4 className="option-title">Lump Sum Today</h4>
                  </div>
                  <div className="option-amount">{formatLakhsCrores(result.requiredLumpSum)}</div>
                  <div className="option-exact">{formatIndianCurrency(result.requiredLumpSum)}</div>
                  <p className="option-desc">
                    One-time investment made today compounding @ {expectedNewInvestmentReturn}% p.a. over {result.yearsAvailableForInvestment} years until age {retirementAge}.
                  </p>
                </div>

                {/* Option 2: Fixed Monthly SIP */}
                <div className="option-card featured-option">
                  <div className="option-header">
                    <span className="option-badge badge-teal">Option 2 (Standard)</span>
                    <h4 className="option-title">Fixed Monthly SIP</h4>
                  </div>
                  <div className="option-amount text-teal">{formatIndianCurrency(result.requiredFixedSIP)}/mo</div>
                  <div className="option-exact">{formatLakhsCrores(result.requiredFixedSIP)} every month</div>
                  <p className="option-desc">
                    Same monthly investment throughout the {result.yearsAvailableForInvestment}-year accumulation period @ {expectedNewInvestmentReturn}% expected return.
                  </p>
                </div>

                {/* Option 3: Step-Up SIP */}
                <div className="option-card">
                  <div className="option-header">
                    <span className="option-badge badge-gold">Option 3 (Flexible)</span>
                    <h4 className="option-title">Step-Up SIP</h4>
                  </div>
                  <div className="option-amount text-navy">{formatIndianCurrency(result.requiredStepUpSIP)}/mo</div>
                  <div className="option-exact">Starting amount ({annualStepUpRate}% annual increase)</div>
                  <p className="option-desc">
                    Start with a lower initial monthly commitment and increase your investment by {annualStepUpRate}% every year as your income grows.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Key Insight Card */}
          <div className="key-insight-card">
            <span className="insight-icon">💡</span>
            <div className="insight-body">
              <span className="insight-title">Key Factual Insight</span>
              <p className="insight-text">{result.keyInsight}</p>
            </div>
          </div>

          {/* Transparent Mathematical Breakdown Accordion */}
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
                  <h4>1. Future Expense Calculation at Retirement</h4>
                  <ul>
                    <li><strong>Current Annual Expenses:</strong> ₹{result.totalCurrentAnnualExpenses.toLocaleString('en-IN')}</li>
                    <li><strong>Pre-Retirement Inflation:</strong> {inflationPreRetirement}% for {result.yearsUntilRetirement} years</li>
                    <li><strong>Post-Retirement Reduction:</strong> {expenseReductionPercent}%</li>
                    <li><strong>Future Annual Expenses:</strong> ₹{result.totalCurrentAnnualExpenses.toLocaleString('en-IN')} × (1 + {inflationPreRetirement}%)^{result.yearsUntilRetirement} × (1 - {expenseReductionPercent}%) = <strong>₹{result.futureAnnualExpenses.toLocaleString('en-IN')}/yr</strong> ({formatIndianCurrency(result.futureMonthlyExpenses)}/mo)</li>
                  </ul>
                </div>

                <div className="formula-step-block">
                  <h4>2. Real Return Above Inflation & Tax Adjustment</h4>
                  <ul>
                    <li><strong>Gross Expected Corpus Return:</strong> {corpusReturnPreTax}% p.a.</li>
                    <li><strong>Tax-Adjusted Return:</strong> {corpusReturnPreTax}% × (1 - {taxRateOnCorpusReturn}%) = <strong>{formatPercentage(result.taxAdjustedReturn)}</strong></li>
                    <li><strong>Real Return (Above Inflation):</strong> ((1 + {formatPercentage(result.taxAdjustedReturn)}) / (1 + {inflationPostRetirement}%)) - 1 = <strong>{formatPercentage(result.realReturn)}</strong></li>
                  </ul>
                </div>

                <div className="formula-step-block">
                  <h4>3. Retirement Living Expense Corpus</h4>
                  <ul>
                    <li><strong>Retirement Horizon:</strong> Age {retirementAge} to {lifeExpectancyAge} ({result.yearsPostRetirement} years)</li>
                    <li><strong>Living Expenses Formula:</strong> Calculates starting corpus assuming living expenses are withdrawn at the start of each year.</li>
                    <li><strong>Required Living Corpus:</strong> <strong>₹{result.livingExpenseCorpusRequired.toLocaleString('en-IN')}</strong></li>
                    {result.legacyCorpusDiscounted > 0 && (
                      <li><strong>Discounted Legacy Corpus:</strong> <strong>₹{result.legacyCorpusDiscounted.toLocaleString('en-IN')}</strong></li>
                    )}
                    <li><strong>Total Corpus Required:</strong> <strong>₹{result.totalRetirementCorpusRequired.toLocaleString('en-IN')}</strong></li>
                  </ul>
                </div>

                <div className="formula-step-block">
                  <h4>4. Existing Resources & Fresh Investment Requirement</h4>
                  <ul>
                    <li><strong>Employment Benefits:</strong> EPF/NPS (₹{epfNps.toLocaleString('en-IN')}) + Gratuity (₹{gratuity.toLocaleString('en-IN')}) + Superannuation (₹{superannuationOther.toLocaleString('en-IN')}) = <strong>₹{result.totalEmploymentBenefits.toLocaleString('en-IN')}</strong></li>
                    <li><strong>Personal Assets:</strong> FD (₹{fixedDeposits.toLocaleString('en-IN')}) + Insurance (₹{insuranceMaturity.toLocaleString('en-IN')}) + Mutual Funds (₹{mutualFundsInvestments.toLocaleString('en-IN')}) = <strong>₹{result.totalOwnAssets.toLocaleString('en-IN')}</strong></li>
                    <li><strong>Total Assets Available at Retirement:</strong> <strong>₹{result.totalRetirementAssets.toLocaleString('en-IN')}</strong></li>
                    <li><strong>Funding Gap (Deficit):</strong> max(0, ₹{result.totalRetirementCorpusRequired.toLocaleString('en-IN')} - ₹{result.totalRetirementAssets.toLocaleString('en-IN')}) = <strong>₹{result.fundingDeficit.toLocaleString('en-IN')}</strong></li>
                    <li><strong>Lump Sum Required Today:</strong> ₹{result.fundingDeficit.toLocaleString('en-IN')} / (1 + {expectedNewInvestmentReturn}%)^{result.yearsAvailableForInvestment} = <strong>₹{result.requiredLumpSum.toLocaleString('en-IN')}</strong></li>
                    <li><strong>Fixed Monthly SIP:</strong> PMT over {result.yearsAvailableForInvestment * 12} months @ {expectedNewInvestmentReturn}% = <strong>₹{result.requiredFixedSIP.toLocaleString('en-IN')}/mo</strong></li>
                    <li><strong>Starting Step-Up SIP ({annualStepUpRate}% annual increase):</strong> <strong>₹{result.requiredStepUpSIP.toLocaleString('en-IN')}/mo</strong></li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Voluntary WhatsApp Consultation CTA */}
          <div className="results-cta-card">
            <h3 className="cta-heading">Want to review your retirement plan?</h3>
            <p className="cta-sub">
              We can help you review your assumptions, optimize existing EPF/NPS/mutual fund allocations, and build a stress-free retirement accumulation roadmap.
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
              100% Voluntary • No Phone Number or Login Needed • AMFI Registered Mutual Fund Distributor (ARN: 266896)
            </p>
          </div>

          {/* Navigation Action Buttons */}
          <div className="step-actions mt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="btn-back"
            >
              ← Edit Expense Inputs (Step 1)
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(5)}
              className="btn-edit-plan"
            >
              ⚙️ Modify Investment Assumptions (Step 5)
            </button>
          </div>
        </div>
      )}

      {/* Styled JSX (Vanilla CSS) */}
      <style>{`
        .retirement-planner-wrapper {
          width: 100%;
          max-width: 960px;
          margin: 0 auto;
          font-family: 'Inter', sans-serif;
          color: #00182A;

        /* Shared calculator primitives (action bar, stepper, step card, inputs, sliders) imported from calculators.css */

        /* Expense Summary Box */
        .expense-summary-box {
          display: flex;
          align-items: center;
          justify-content: space-around;
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
          margin-bottom: 1.75rem;
        }

        .summary-col {
          display: flex;
          flex-direction: column;
          text-align: center;
        }

        .summary-divider {
          width: 1px;
          height: 40px;
          background: #CBD5E1;
        }

        .summary-lbl {
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748B;
          margin-bottom: 0.25rem;
        }

        .summary-val {
          font-family: 'Outfit', sans-serif;
          font-size: 1.35rem;
          font-weight: 800;
        }

        .summary-sub {
          font-size: 0.7rem;
          color: #64748B;
          margin-top: 0.15rem;
        }

        /* Future Expense Preview Box */
        .future-expense-preview-card {
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 14px;
          padding: 1.5rem;
          margin-bottom: 1.75rem;
        }

        .preview-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: #00182A;
          margin: 0 0 1.25rem 0;
        }

        .preview-metrics-grid {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .prev-metric {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 0.85rem 1rem;
          text-align: center;
          flex: 1;
          min-width: 130px;
        }

        .prev-metric.highlight-metric {
          background: #E6F7F5;
          border-color: #00AB96;
        }

        .prev-lbl {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748B;
          margin-bottom: 0.25rem;
        }

        .prev-val {
          display: block;
          font-family: 'Outfit', sans-serif;
          font-size: 1.25rem;
          font-weight: 800;
          color: #00182A;
        }

        .prev-sub {
          display: block;
          font-size: 0.7rem;
          color: #64748B;
          margin-top: 0.15rem;
        }

        .prev-arrow {
          font-size: 1.25rem;
          font-weight: 700;
          color: #94A3B8;
        }

        /* Rate Journey Track */
        .rate-breakdown-card {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
          margin-bottom: 1.5rem;
        }

        .rate-breakdown-title {
          font-family: 'Outfit', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          color: #00182A;
          margin: 0 0 1rem 0;
        }

        .rate-journey-track {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .journey-node {
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          text-align: center;
          flex: 1;
          min-width: 110px;
        }

        .journey-node.highlight-node {
          background: #FFFBEB;
          border-color: #FCD34D;
        }

        .node-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748B;
          margin-bottom: 0.25rem;
        }

        .node-value {
          display: block;
          font-family: 'Outfit', sans-serif;
          font-size: 1.25rem;
          font-weight: 800;
          color: #00182A;
        }

        .node-sub {
          display: block;
          font-size: 0.7rem;
          color: #64748B;
          margin-top: 0.15rem;
        }

        .journey-connector {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 0.6;
        }

        .connector-tag {
          font-size: 0.7rem;
          font-weight: 700;
          color: #64748B;
          background: #E2E8F0;
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
          margin-bottom: 0.2rem;
          white-space: nowrap;
        }

        .connector-line {
          width: 100%;
          height: 2px;
          background: #CBD5E1;
        }

        /* Calculated Corpus Banner */
        .corpus-summary-banner {
          background: linear-gradient(135deg, #F0FDF4 0%, #E6F7F5 100%);
          border: 1.5px solid #00AB96;
          border-radius: 14px;
          padding: 1.5rem;
          text-align: center;
          margin-bottom: 1.75rem;
        }

        .corpus-banner-lbl {
          display: block;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #00AB96;
          margin-bottom: 0.35rem;
        }

        .corpus-banner-amount {
          font-family: 'Outfit', sans-serif;
          font-size: 2.25rem;
          font-weight: 900;
          margin-bottom: 0.25rem;
        }

        .corpus-banner-exact {
          font-size: 0.85rem;
          color: #475569;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .corpus-banner-note {
          font-size: 0.8rem;
          color: #64748B;
          margin: 0;
          line-height: 1.45;
        }

        /* Resource Section Blocks */
        .resource-section-block {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.25rem 1.5rem 0.5rem;
          margin-bottom: 1.25rem;
        }

        .resource-section-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #00182A;
          margin: 0 0 1rem 0;
        }

        /* Asset Progress Summary Card */
        .asset-progress-summary-card {
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 14px;
          padding: 1.5rem;
          margin-bottom: 1.75rem;
        }

        .asset-summary-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }

        .summary-stat {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 0.85rem;
          text-align: center;
        }

        .summary-stat.highlight-stat {
          background: #E6F7F5;
          border-color: #00AB96;
        }

        .summary-stat.highlight-stat-gold {
          background: #FFFBEB;
          border-color: #FCD34D;
        }

        .stat-lbl {
          display: block;
          font-size: 0.7rem;
          font-weight: 600;
          color: #64748B;
          margin-bottom: 0.25rem;
        }

        .stat-num {
          display: block;
          font-family: 'Outfit', sans-serif;
          font-size: 1.15rem;
          font-weight: 800;
          color: #00182A;
        }

        .stat-sub {
          display: block;
          font-size: 0.675rem;
          color: #64748B;
          margin-top: 0.15rem;
        }

        .progress-bar-container {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .progress-bar-track, .visual-progress-track {
          width: 100%;
          height: 10px;
          background: #CBD5E1;
          border-radius: 9999px;
          overflow: hidden;
        }

        .progress-bar-fill, .visual-progress-fill {
          height: 100%;
          background: #00AB96;
          border-radius: 9999px;
          transition: width 0.3s ease;
        }

        .progress-bar-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          font-weight: 700;
          color: #334155;
        }

        /* Results hero card imported from calculators.css */

        /* Journey Flow Grid */
        .results-journey-card {
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

        .journey-flow-grid {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        .journey-step-box {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 0.85rem 0.75rem;
          text-align: center;
          flex: 1;
          min-width: 120px;
        }

        .journey-step-box.highlight-j-box {
          background: #E6F7F5;
          border-color: #00AB96;
        }

        .journey-step-box.gap-j-box {
          background: #FFFBEB;
          border-color: #FCD34D;
        }

        .j-step-lbl {
          display: block;
          font-size: 0.7rem;
          font-weight: 600;
          color: #64748B;
          margin-bottom: 0.25rem;
        }

        .j-step-val {
          display: block;
          font-family: 'Outfit', sans-serif;
          font-size: 1.15rem;
          font-weight: 800;
          color: #00182A;
        }

        .j-step-sub {
          display: block;
          font-size: 0.675rem;
          color: #64748B;
          margin-top: 0.15rem;
        }

        .j-arrow {
          font-size: 1.1rem;
          font-weight: 700;
          color: #94A3B8;
        }

        /* Progress Summary Card */
        .progress-summary-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 1.75rem;
        }

        .progress-metrics-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.25rem;
        }

        .prog-metric-col {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 1rem;
          text-align: center;
        }

        .metric-lbl {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748B;
          margin-bottom: 0.25rem;
        }

        .metric-val {
          display: block;
          font-family: 'Outfit', sans-serif;
          font-size: 1.35rem;
          font-weight: 800;
          color: #00182A;
        }

        .metric-sub {
          display: block;
          font-size: 0.7rem;
          color: #64748B;
          margin-top: 0.2rem;
        }

        /* Funding Options Cards */
        .funding-options-section {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 2rem;
        }

        .fully-funded-notice {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: #F0FDF4;
          border: 1.5px solid #86EFAC;
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
        }

        .notice-icon { font-size: 2rem; }
        .notice-text strong { display: block; font-size: 1rem; color: #166534; margin-bottom: 0.25rem; }
        .notice-text p { font-size: 0.85rem; color: #15803D; margin: 0; line-height: 1.45; }

        .options-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }

        .option-card {
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 14px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          transition: all 0.2s ease;
        }

        .option-card.featured-option {
          background: #F0FDF4;
          border-color: #00AB96;
          box-shadow: 0 8px 20px -4px rgba(0, 171, 150, 0.15);
        }

        .option-header {
          margin-bottom: 0.75rem;
        }

        .option-badge {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          background: #E2E8F0;
          color: #475569;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          margin-bottom: 0.35rem;
        }

        .option-badge.badge-teal {
          background: #00AB96;
          color: #FFFFFF;
        }

        .option-badge.badge-gold {
          background: #FEF3C7;
          color: #D97706;
        }

        .option-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: #00182A;
          margin: 0;
        }

        .option-amount {
          font-family: 'Outfit', sans-serif;
          font-size: 1.6rem;
          font-weight: 800;
          color: #00182A;
          margin: 0.35rem 0 0.15rem 0;
        }

        .option-exact {
          font-size: 0.75rem;
          color: #64748B;
          margin-bottom: 0.75rem;
        }

        .option-desc {
          font-size: 0.8rem;
          color: #475569;
          line-height: 1.45;
          margin: auto 0 0 0;
        }

        /* Shared insight card, accordion, consultation CTA, step actions, and utilities imported from calculators.css */

        /* Responsive Breakpoints (Retirement-Specific) */
        @media (max-width: 860px) {
          .options-cards-grid, .progress-metrics-row, .asset-summary-grid {
            grid-template-columns: 1fr;
          }
          .journey-flow-grid {
            flex-direction: column;
            align-items: stretch;
          }
          .j-arrow {
            display: none;
          }
          .rate-journey-track {
            flex-direction: column;
            align-items: stretch;
          }
          .journey-connector {
            margin: 0.5rem 0;
          }
        }
      `}</style>
    </div>
  );
}
