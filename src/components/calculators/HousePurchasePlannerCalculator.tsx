import React, { useState, useId, useMemo } from 'react';
import {
  calculateHousePurchasePlan,
  formatIndianCurrency,
  formatLakhsCrores,
  type HousePurchasePlannerInput,
  type EarmarkedAsset
} from '../../utils/calculations/housePurchasePlanner';

type WizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 'results';

const DEFAULT_ASSETS: EarmarkedAsset[] = [
  { id: '1', name: 'Mutual Funds', amount: 500000 },
  { id: '2', name: 'Fixed Deposits / Savings', amount: 300000 },
];

export default function HousePurchasePlannerCalculator() {
  const baseId = useId();

  // Wizard Navigation
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);

  // Step 1: Goal Inputs
  const [currentPropertyValue, setCurrentPropertyValue] = useState<number>(10000000); // ₹1 Cr
  const [yearsToPurchase, setYearsToPurchase] = useState<number>(6);
  const [location, setLocation] = useState<string>('Indore');
  const [homeType, setHomeType] = useState<string>('3 BHK');

  // Step 2: Future Home Cost
  const [propertyGrowthRate, setPropertyGrowthRate] = useState<number>(6);
  const [additionalCostPercent, setAdditionalCostPercent] = useState<number>(10);

  // Step 3: Home Loan & Down Payment
  const [homeLoanFundingPercent, setHomeLoanFundingPercent] = useState<number>(80);
  const [homeLoanInterestRate, setHomeLoanInterestRate] = useState<number>(8.5);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(20);

  // Step 4: Income & Affordability
  const [currentMonthlyIncome, setCurrentMonthlyIncome] = useState<number>(150000); // ₹1.5 Lakh/mo
  const [incomeGrowthRate, setIncomeGrowthRate] = useState<number>(8);
  const [idealEMIPercent, setIdealEMIPercent] = useState<number>(40);

  // Step 5: Existing Assets
  const [earmarkedAssets, setEarmarkedAssets] = useState<EarmarkedAsset[]>(DEFAULT_ASSETS);

  // Step 6: Funding Plan Options
  const [expectedInvestmentReturn, setExpectedInvestmentReturn] = useState<number>(12);
  const [startInvestingDelay, setStartInvestingDelay] = useState<number>(0);
  const [annualStepUpPercent, setAnnualStepUpPercent] = useState<number>(10);

  // Results Accordion
  const [showHowItWorks, setShowHowItWorks] = useState<boolean>(false);

  // Calculate Result
  const planInput: HousePurchasePlannerInput = useMemo(() => ({
    goal: {
      currentPropertyValue,
      yearsToPurchase,
      location,
      homeType
    },
    cost: {
      propertyGrowthRate,
      additionalCostPercent
    },
    loan: {
      homeLoanFundingPercent,
      homeLoanInterestRate,
      loanTenureYears
    },
    income: {
      currentMonthlyIncome,
      incomeGrowthRate,
      idealEMIPercent
    },
    earmarkedAssets,
    funding: {
      expectedInvestmentReturn,
      startInvestingDelay,
      annualStepUpPercent
    }
  }), [
    currentPropertyValue,
    yearsToPurchase,
    location,
    homeType,
    propertyGrowthRate,
    additionalCostPercent,
    homeLoanFundingPercent,
    homeLoanInterestRate,
    loanTenureYears,
    currentMonthlyIncome,
    incomeGrowthRate,
    idealEMIPercent,
    earmarkedAssets,
    expectedInvestmentReturn,
    startInvestingDelay,
    annualStepUpPercent
  ]);

  const result = useMemo(() => calculateHousePurchasePlan(planInput), [planInput]);

  // Asset Management Handlers
  const handleAddAsset = () => {
    const newId = (earmarkedAssets.length + 1).toString() + '-' + Date.now().toString().slice(-4);
    setEarmarkedAssets([...earmarkedAssets, { id: newId, name: 'Mutual Funds', amount: 100000 }]);
  };

  const handleRemoveAsset = (id: string) => {
    setEarmarkedAssets(earmarkedAssets.filter(item => item.id !== id));
  };

  const handleUpdateAsset = (id: string, field: 'name' | 'amount', value: string | number) => {
    setEarmarkedAssets(earmarkedAssets.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  // Sample Scenario Preset (Indore 3 BHK ₹1 Cr in 6 yrs)
  const handleLoadSampleData = () => {
    setCurrentPropertyValue(10000000);
    setYearsToPurchase(6);
    setLocation('Indore');
    setHomeType('3 BHK');
    setPropertyGrowthRate(6);
    setAdditionalCostPercent(10);
    setHomeLoanFundingPercent(80);
    setHomeLoanInterestRate(8.5);
    setLoanTenureYears(20);
    setCurrentMonthlyIncome(150000);
    setIncomeGrowthRate(8);
    setIdealEMIPercent(40);
    setEarmarkedAssets([
      { id: '1', name: 'Mutual Funds', amount: 1000000 },
      { id: '2', name: 'Fixed Deposits', amount: 500000 }
    ]);
    setExpectedInvestmentReturn(12);
    setStartInvestingDelay(0);
    setAnnualStepUpPercent(10);
    setCurrentStep('results');
  };

  // Reset to Baseline
  const handleReset = () => {
    setCurrentPropertyValue(8000000);
    setYearsToPurchase(5);
    setLocation('');
    setHomeType('2 BHK');
    setPropertyGrowthRate(6);
    setAdditionalCostPercent(10);
    setHomeLoanFundingPercent(80);
    setHomeLoanInterestRate(8.5);
    setLoanTenureYears(20);
    setCurrentMonthlyIncome(120000);
    setIncomeGrowthRate(8);
    setIdealEMIPercent(40);
    setEarmarkedAssets([
      { id: '1', name: 'Mutual Funds', amount: 300000 },
      { id: '2', name: 'Fixed Deposits / Savings', amount: 200000 }
    ]);
    setExpectedInvestmentReturn(12);
    setStartInvestingDelay(0);
    setAnnualStepUpPercent(10);
    setCurrentStep(1);
  };

  // WhatsApp Prepopulated Deep Link
  const generateWhatsAppUrl = () => {
    const propertyToday = formatLakhsCrores(currentPropertyValue);
    const propertyFuture = formatLakhsCrores(result.futurePropertyValue);
    const downPmt = formatLakhsCrores(result.totalAmountToAccumulate);
    const gap = formatLakhsCrores(result.fundingDeficit);
    const sip = formatIndianCurrency(result.requiredFixedSIP);

    const message = `Hi Santhosh, I used the Home Purchase Planner on Ant Wealth Creation.
Goal: ${homeType || 'Home'} in ${location ? location + ', ' : ''}${yearsToPurchase} years
Estimated Future Cost: ${propertyFuture} (Today: ${propertyToday})
Down Payment + Costs Needed: ${downPmt}
My Remaining Funding Gap: ${gap}
Required Monthly SIP: ${sip}/month

I would like to discuss a practical investment roadmap to fund my home down payment.`;

    return `https://wa.me/918087971566?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="home-planner-wrapper">
      {/* Top Action Bar: Sample Scenario & Reset */}
      <div className="calc-top-action-bar">
        <div className="action-tagline">
          <span className="live-pulse"></span>
          <span>Home Purchase Financial Roadmap</span>
        </div>
        <div className="action-btn-group">
          <button
            type="button"
            onClick={handleLoadSampleData}
            className="btn-sample-preset"
            title="Load Indore 3 BHK ₹1 Cr sample scenario"
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

      {/* Stepper Navigation (6 Steps + Results) */}
      <nav className="stepper-nav" aria-label="Calculator Steps">
        <ol className="stepper-list">
          {[
            { step: 1, title: 'Goal', icon: '🏠' },
            { step: 2, title: 'Future Cost', icon: '📈' },
            { step: 3, title: 'Loan & Down Pmt', icon: '🏦' },
            { step: 4, title: 'EMI Check', icon: '💳' },
            { step: 5, title: 'Assets', icon: '🛡️' },
            { step: 6, title: 'Funding Plan', icon: '🎯' },
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

      {/* STEP 1: HOME GOAL */}
      {currentStep === 1 && (
        <section className="step-card" aria-labelledby="step1-title">
          <div className="step-header">
            <div className="step-badge">Step 1 of 6</div>
            <h2 id="step1-title" className="step-heading">
              What home are you planning to purchase?
            </h2>
            <p className="step-description">
              Start with today's market price of your desired home and your expected purchase horizon.
            </p>
          </div>

          <div className="inputs-grid">
            <div className="input-group">
              <label htmlFor={`${baseId}-currPrice`} className="input-label">
                Current Home Price (in today's money) *
              </label>
              <div className="currency-input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  id={`${baseId}-currPrice`}
                  type="number"
                  min="500000"
                  step="100000"
                  value={currentPropertyValue || ''}
                  onChange={(e) => setCurrentPropertyValue(Math.max(0, Number(e.target.value)))}
                  placeholder="10000000"
                  className="currency-field"
                />
                <span className="unit-tag">{formatLakhsCrores(currentPropertyValue)}</span>
              </div>
              <span className="input-helper">What would a similar home cost today?</span>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-years`} className="input-label">
                When are you planning to buy? (Years) *
              </label>
              <div className="slider-group">
                <div className="slider-value-display">
                  <span>{yearsToPurchase} {yearsToPurchase === 1 ? 'Year' : 'Years'}</span>
                </div>
                <input
                  id={`${baseId}-years`}
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={yearsToPurchase}
                  onChange={(e) => setYearsToPurchase(Number(e.target.value))}
                  className="range-slider"
                />
                <div className="slider-ticks">
                  <span>1 yr</span>
                  <span>5 yrs</span>
                  <span>10 yrs</span>
                  <span>20 yrs</span>
                  <span>30 yrs</span>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-type`} className="input-label">
                Home Type (Optional)
              </label>
              <select
                id={`${baseId}-type`}
                value={homeType}
                onChange={(e) => setHomeType(e.target.value)}
                className="select-field"
              >
                <option value="1 BHK">1 BHK Apartment</option>
                <option value="2 BHK">2 BHK Apartment</option>
                <option value="3 BHK">3 BHK Apartment</option>
                <option value="4 BHK">4 BHK Apartment</option>
                <option value="Independent House / Villa">Independent House / Villa</option>
                <option value="Plot + Construction">Plot + Construction</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-location`} className="input-label">
                City / Location (Optional)
              </label>
              <input
                id={`${baseId}-location`}
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Indore, Chennai, Bengaluru, Dharmapuri"
                className="text-field"
              />
            </div>
          </div>

          <div className="step-actions">
            <div></div>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="btn-continue"
            >
              Continue to Future Home Cost →
            </button>
          </div>
        </section>
      )}

      {/* STEP 2: FUTURE HOME COST & APPRECIATION */}
      {currentStep === 2 && (
        <section className="step-card" aria-labelledby="step2-title">
          <div className="step-header">
            <div className="step-badge">Step 2 of 6</div>
            <h2 id="step2-title" className="step-heading">
              How much will the property cost in {yearsToPurchase} years?
            </h2>
            <p className="step-description">
              Property prices appreciate over time, and acquisition requires additional budget for registration, stamp duty, taxes, and interiors.
            </p>
          </div>

          <div className="inputs-grid">
            <div className="input-group">
              <label htmlFor={`${baseId}-growth`} className="input-label">
                Expected Annual Property Appreciation Rate (%)
              </label>
              <div className="slider-group">
                <div className="slider-value-display">
                  <span>{propertyGrowthRate}% p.a.</span>
                </div>
                <input
                  id={`${baseId}-growth`}
                  type="range"
                  min="2"
                  max="15"
                  step="0.5"
                  value={propertyGrowthRate}
                  onChange={(e) => setPropertyGrowthRate(Number(e.target.value))}
                  className="range-slider"
                />
                <div className="slider-ticks">
                  <span>2%</span>
                  <span>6% (Standard)</span>
                  <span>10%</span>
                  <span>15%</span>
                </div>
              </div>
              <span className="input-helper">Your planning assumption (historical averages typically 5%–8%)</span>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-costs`} className="input-label">
                Additional Purchase Costs (% of property value)
              </label>
              <div className="slider-group">
                <div className="slider-value-display">
                  <span>{additionalCostPercent}%</span>
                </div>
                <input
                  id={`${baseId}-costs`}
                  type="range"
                  min="0"
                  max="25"
                  step="1"
                  value={additionalCostPercent}
                  onChange={(e) => setAdditionalCostPercent(Number(e.target.value))}
                  className="range-slider"
                />
                <div className="slider-ticks">
                  <span>0%</span>
                  <span>5%</span>
                  <span>10% (Default)</span>
                  <span>15%</span>
                  <span>25%</span>
                </div>
              </div>
              <span className="input-helper">Stamp duty (~5–7%), registration (1%), legal fees, taxes, and basic interiors</span>
            </div>
          </div>

          {/* Visual Progression Card */}
          <div className="cost-progression-card">
            <h3 className="progression-title">Future Property Cost Breakdown ({yearsToPurchase} Years)</h3>
            <div className="progression-grid">
              <div className="prog-step">
                <span className="prog-label">Today's Price</span>
                <span className="prog-val">{formatLakhsCrores(currentPropertyValue)}</span>
                <span className="prog-sub">{formatIndianCurrency(currentPropertyValue)}</span>
              </div>
              <div className="prog-arrow">→</div>
              <div className="prog-step">
                <span className="prog-label">Estimated Property Price</span>
                <span className="prog-val text-teal">{formatLakhsCrores(result.futurePropertyValue)}</span>
                <span className="prog-sub">@{propertyGrowthRate}% growth for {yearsToPurchase} yrs</span>
              </div>
              <div className="prog-arrow">+</div>
              <div className="prog-step">
                <span className="prog-label">Purchase Costs ({additionalCostPercent}%)</span>
                <span className="prog-val text-gold">{formatLakhsCrores(result.additionalPurchaseCosts)}</span>
                <span className="prog-sub">Registration, taxes & interiors</span>
              </div>
              <div className="prog-arrow">=</div>
              <div className="prog-step highlight-step">
                <span className="prog-label">Total Acquisition Cost</span>
                <span className="prog-val text-navy">{formatLakhsCrores(result.totalFutureCost)}</span>
                <span className="prog-sub">{formatIndianCurrency(result.totalFutureCost)}</span>
              </div>
            </div>
            <p className="progression-note">
              ℹ️ <strong>Planning Rule:</strong> Your home loan will be calculated against the future property price ({formatLakhsCrores(result.futurePropertyValue)}). The additional purchase costs ({formatLakhsCrores(result.additionalPurchaseCosts)}) must be accumulated separately.
            </p>
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
              Continue to Loan & Down Payment →
            </button>
          </div>
        </section>
      )}

      {/* STEP 3: HOME LOAN & DOWN PAYMENT */}
      {currentStep === 3 && (
        <section className="step-card" aria-labelledby="step3-title">
          <div className="step-header">
            <div className="step-badge">Step 3 of 6</div>
            <h2 id="step3-title" className="step-heading">
              Home Loan Funding & Down Payment Requirement
            </h2>
            <p className="step-description">
              Choose what percentage of the future property value you plan to fund with a home loan.
            </p>
          </div>

          <div className="inputs-grid">
            <div className="input-group">
              <label htmlFor={`${baseId}-loanPct`} className="input-label">
                Home Loan Funding Percentage (% of property price)
              </label>
              <div className="slider-group">
                <div className="slider-value-display">
                  <span>{homeLoanFundingPercent}% Loan / {100 - homeLoanFundingPercent}% Down Payment</span>
                </div>
                <input
                  id={`${baseId}-loanPct`}
                  type="range"
                  min="0"
                  max="90"
                  step="5"
                  value={homeLoanFundingPercent}
                  onChange={(e) => setHomeLoanFundingPercent(Number(e.target.value))}
                  className="range-slider"
                />
                <div className="slider-ticks">
                  <span>0% (Full Cash)</span>
                  <span>50%</span>
                  <span>80% (Standard)</span>
                  <span>90% (Max LTV)</span>
                </div>
              </div>
              <span className="input-helper">RBI guidelines allow up to 75%–80% for large homes, 90% for affordable housing</span>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-loanTenure`} className="input-label">
                Planned Home Loan Tenure (Years)
              </label>
              <div className="slider-group">
                <div className="slider-value-display">
                  <span>{loanTenureYears} Years ({loanTenureYears * 12} EMIs)</span>
                </div>
                <input
                  id={`${baseId}-loanTenure`}
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={loanTenureYears}
                  onChange={(e) => setLoanTenureYears(Number(e.target.value))}
                  className="range-slider"
                />
                <div className="slider-ticks">
                  <span>5 yrs</span>
                  <span>15 yrs</span>
                  <span>20 yrs (Standard)</span>
                  <span>30 yrs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Allocation Split Cards */}
          <div className="split-cards-grid">
            <div className="split-card loan-card">
              <div className="split-header">
                <span className="split-icon">🏦</span>
                <span className="split-tag">Funded by Bank Loan</span>
              </div>
              <div className="split-title">Future Home Loan Amount ({homeLoanFundingPercent}%)</div>
              <div className="split-amount">{formatLakhsCrores(result.homeLoanAmount)}</div>
              <div className="split-exact">{formatIndianCurrency(result.homeLoanAmount)}</div>
              <p className="split-desc">Calculated against base property price ({formatLakhsCrores(result.futurePropertyValue)})</p>
            </div>

            <div className="split-card down-pmt-card">
              <div className="split-header">
                <span className="split-icon">💵</span>
                <span className="split-tag">Self-Funded Down Payment</span>
              </div>
              <div className="split-title">Down Payment ({100 - homeLoanFundingPercent}%)</div>
              <div className="split-amount">{formatLakhsCrores(result.downPayment)}</div>
              <div className="split-exact">{formatIndianCurrency(result.downPayment)}</div>
              <p className="split-desc">Your equity contribution towards property price</p>
            </div>

            <div className="split-card accumulate-card">
              <div className="split-header">
                <span className="split-icon">🎯</span>
                <span className="split-tag">Total Self-Funding Target</span>
              </div>
              <div className="split-title">Total Amount to Accumulate</div>
              <div className="split-amount text-gold">{formatLakhsCrores(result.totalAmountToAccumulate)}</div>
              <div className="split-exact">{formatIndianCurrency(result.totalAmountToAccumulate)}</div>
              <p className="split-desc">Down Payment ({formatLakhsCrores(result.downPayment)}) + Acquisition Costs ({formatLakhsCrores(result.additionalPurchaseCosts)})</p>
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
              Continue to EMI Affordability →
            </button>
          </div>
        </section>
      )}

      {/* STEP 4: EMI AFFORDABILITY */}
      {currentStep === 4 && (
        <section className="step-card" aria-labelledby="step4-title">
          <div className="step-header">
            <div className="step-badge">Step 4 of 6</div>
            <h2 id="step4-title" className="step-heading">
              Will the future EMI be affordable for your family?
            </h2>
            <p className="step-description">
              We project your monthly income at purchase time ({yearsToPurchase} years ahead) and check if the home loan EMI stays within a comfortable debt limit.
            </p>
          </div>

          <div className="inputs-grid">
            <div className="input-group">
              <label htmlFor={`${baseId}-income`} className="input-label">
                Current Monthly Household Take-Home Income *
              </label>
              <div className="currency-input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  id={`${baseId}-income`}
                  type="number"
                  min="10000"
                  step="5000"
                  value={currentMonthlyIncome || ''}
                  onChange={(e) => setCurrentMonthlyIncome(Math.max(0, Number(e.target.value)))}
                  placeholder="150000"
                  className="currency-field"
                />
                <span className="unit-tag">{formatLakhsCrores(currentMonthlyIncome)}/mo</span>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-incGrowth`} className="input-label">
                Expected Annual Income Growth (%)
              </label>
              <div className="slider-group">
                <div className="slider-value-display">
                  <span>{incomeGrowthRate}% p.a. (Standard: 8%)</span>
                </div>
                <input
                  id={`${baseId}-incGrowth`}
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={incomeGrowthRate}
                  onChange={(e) => setIncomeGrowthRate(Number(e.target.value))}
                  className="range-slider"
                />
                <div className="slider-ticks">
                  <span>0%</span>
                  <span>5%</span>
                  <span>8% (Default)</span>
                  <span>12%</span>
                  <span>20%</span>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-emiLimit`} className="input-label">
                Ideal EMI Limit (% of future monthly income)
              </label>
              <div className="slider-group">
                <div className="slider-value-display">
                  <span>{idealEMIPercent}% of income</span>
                </div>
                <input
                  id={`${baseId}-emiLimit`}
                  type="range"
                  min="20"
                  max="60"
                  step="5"
                  value={idealEMIPercent}
                  onChange={(e) => setIdealEMIPercent(Number(e.target.value))}
                  className="range-slider"
                />
                <div className="slider-ticks">
                  <span>20% (Conservative)</span>
                  <span>40% (Recommended)</span>
                  <span>50% (Max Safe)</span>
                  <span>60%</span>
                </div>
              </div>
              <span className="input-helper">Financial planners recommend keeping total home loan EMIs below 40% of income</span>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-loanRate`} className="input-label">
                Expected Home Loan Interest Rate (%)
              </label>
              <div className="slider-group">
                <div className="slider-value-display">
                  <span>{homeLoanInterestRate}% p.a.</span>
                </div>
                <input
                  id={`${baseId}-loanRate`}
                  type="range"
                  min="5"
                  max="15"
                  step="0.25"
                  value={homeLoanInterestRate}
                  onChange={(e) => setHomeLoanInterestRate(Number(e.target.value))}
                  className="range-slider"
                />
                <div className="slider-ticks">
                  <span>5%</span>
                  <span>8.5% (Current Average)</span>
                  <span>11%</span>
                  <span>15%</span>
                </div>
              </div>
            </div>
          </div>

          {/* EMI Affordability Comparison Dashboard */}
          <div className="affordability-card">
            <h3 className="affordability-title">Projected Income & EMI Affordability</h3>
            <div className="affordability-metrics">
              <div className="aff-metric">
                <span className="aff-label">Projected Monthly Income</span>
                <span className="aff-val">{formatIndianCurrency(result.projectedMonthlyIncome)}/mo</span>
                <span className="aff-sub">In {yearsToPurchase} yrs @ {incomeGrowthRate}% annual growth</span>
              </div>
              <div className="aff-metric">
                <span className="aff-label">Planned EMI Limit ({idealEMIPercent}%)</span>
                <span className="aff-val text-teal">{formatIndianCurrency(result.idealMonthlyEMILimit)}/mo</span>
                <span className="aff-sub">Maximum comfortable monthly debt</span>
              </div>
              <div className="aff-metric">
                <span className="aff-label">Estimated Home Loan EMI</span>
                <span className="aff-val text-gold">{formatIndianCurrency(result.estimatedHomeLoanEMI)}/mo</span>
                <span className="aff-sub">{loanTenureYears} yrs @ {homeLoanInterestRate}% on {formatLakhsCrores(result.homeLoanAmount)}</span>
              </div>
            </div>

            <div className={`emi-status-box ${result.isEMIAffordable ? 'status-safe' : 'status-caution'}`}>
              <span className="status-badge-icon">{result.isEMIAffordable ? '✅' : '⚠️'}</span>
              <div className="status-text-content">
                <strong>
                  {result.isEMIAffordable
                    ? `Estimated EMI is within your selected ${idealEMIPercent}% income limit.`
                    : `Estimated EMI is above your selected ${idealEMIPercent}% income limit.`}
                </strong>
                <p>
                  {result.isEMIAffordable
                    ? `Your projected EMI of ${formatIndianCurrency(result.estimatedHomeLoanEMI)} represents ${((result.estimatedHomeLoanEMI / (result.projectedMonthlyIncome || 1)) * 100).toFixed(1)}% of your projected income, leaving ${formatIndianCurrency(result.emiDifference)} buffer below your limit.`
                    : `The estimated EMI of ${formatIndianCurrency(result.estimatedHomeLoanEMI)} requires ${((result.estimatedHomeLoanEMI / (result.projectedMonthlyIncome || 1)) * 100).toFixed(1)}% of your projected income (${formatIndianCurrency(Math.abs(result.emiDifference))} above your target limit). Consider increasing your down payment, extending tenure, or choosing a home with lower initial cost.`}
                </p>
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
              Continue to Existing Funds →
            </button>
          </div>
        </section>
      )}

      {/* STEP 5: EXISTING FUNDS */}
      {currentStep === 5 && (
        <section className="step-card" aria-labelledby="step5-title">
          <div className="step-header">
            <div className="step-badge">Step 5 of 6</div>
            <h2 id="step5-title" className="step-heading">
              Do you have existing savings earmarked for this home?
            </h2>
            <p className="step-description">
              Add any current investments or bank balances you plan to utilize for this down payment.
            </p>
          </div>

          <div className="assets-list-container">
            {earmarkedAssets.map((asset, index) => (
              <div key={asset.id} className="asset-row-item">
                <div className="asset-category-col">
                  <label htmlFor={`asset-name-${asset.id}`} className="input-label-sm">
                    Asset Category {index + 1}
                  </label>
                  <select
                    id={`asset-name-${asset.id}`}
                    value={asset.name}
                    onChange={(e) => handleUpdateAsset(asset.id, 'name', e.target.value)}
                    className="select-field-sm"
                  >
                    <option value="Mutual Funds">Mutual Funds</option>
                    <option value="Fixed Deposits / RDs">Fixed Deposits / RDs</option>
                    <option value="Savings / Bank Balance">Savings / Bank Balance</option>
                    <option value="Gold / Sovereign Gold Bonds">Gold / SGBs</option>
                    <option value="Stocks / Equity">Stocks / Equity</option>
                    <option value="PF / PPF Withdrawal">PF / PPF (Eligible for House)</option>
                    <option value="Family Contribution">Family Contribution</option>
                    <option value="Other Investments">Other Investments</option>
                  </select>
                </div>

                <div className="asset-amount-col">
                  <label htmlFor={`asset-amount-${asset.id}`} className="input-label-sm">
                    Current Value Earmarked
                  </label>
                  <div className="currency-input-wrapper-sm">
                    <span className="currency-symbol">₹</span>
                    <input
                      id={`asset-amount-${asset.id}`}
                      type="number"
                      min="0"
                      step="25000"
                      value={asset.amount || ''}
                      onChange={(e) => handleUpdateAsset(asset.id, 'amount', Math.max(0, Number(e.target.value)))}
                      placeholder="0"
                      className="currency-field-sm"
                    />
                    <span className="unit-tag-sm">{formatLakhsCrores(asset.amount)}</span>
                  </div>
                </div>

                <div className="asset-action-col">
                  <button
                    type="button"
                    onClick={() => handleRemoveAsset(asset.id)}
                    className="btn-remove-asset"
                    title="Remove asset"
                    aria-label={`Remove ${asset.name}`}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddAsset}
              className="btn-add-asset"
            >
              + Add Another Earmarked Asset
            </button>
          </div>

          {/* Live Progress Summary */}
          <div className="live-asset-summary-card">
            <div className="asset-summary-header">
              <div className="summary-left">
                <span className="summary-title">Total Earmarked Assets</span>
                <span className="summary-amount text-teal">{formatLakhsCrores(result.totalEarmarkedAssets)}</span>
                <span className="summary-exact">{formatIndianCurrency(result.totalEarmarkedAssets)}</span>
              </div>
              <div className="summary-right">
                <span className="summary-title">Remaining Gap to Build</span>
                <span className="summary-amount text-gold">{formatLakhsCrores(result.fundingDeficit)}</span>
                <span className="summary-exact">{formatIndianCurrency(result.fundingDeficit)}</span>
              </div>
            </div>

            <div className="progress-bar-container">
              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${result.fundingProgress}%` }}
                ></div>
              </div>
              <div className="progress-bar-labels">
                <span>{result.fundingProgress}% Earmarked</span>
                <span>Target: {formatLakhsCrores(result.totalAmountToAccumulate)}</span>
              </div>
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
              onClick={() => setCurrentStep(6)}
              className="btn-continue"
            >
              Continue to Funding Plan →
            </button>
          </div>
        </section>
      )}

      {/* STEP 6: FUNDING PLAN (SIP & LUMPSUM OPTIONS) */}
      {currentStep === 6 && (
        <section className="step-card" aria-labelledby="step6-title">
          <div className="step-header">
            <div className="step-badge">Step 6 of 6</div>
            <h2 id="step6-title" className="step-heading">
              How would you like to build your remaining {formatLakhsCrores(result.fundingDeficit)}?
            </h2>
            <p className="step-description">
              Set your expected investment growth rate, delay options, and annual SIP step-up to generate your monthly investment plan.
            </p>
          </div>

          <div className="inputs-grid">
            <div className="input-group">
              <label htmlFor={`${baseId}-return`} className="input-label">
                Expected Annual Investment Return (%)
              </label>
              <div className="slider-group">
                <div className="slider-value-display">
                  <span>{expectedInvestmentReturn}% p.a.</span>
                </div>
                <input
                  id={`${baseId}-return`}
                  type="range"
                  min="4"
                  max="18"
                  step="0.5"
                  value={expectedInvestmentReturn}
                  onChange={(e) => setExpectedInvestmentReturn(Number(e.target.value))}
                  className="range-slider"
                />
                <div className="slider-ticks">
                  <span>4% (Debt/FD)</span>
                  <span>8% (Hybrid)</span>
                  <span>12% (Equity MF)</span>
                  <span>18%</span>
                </div>
              </div>
              <span className="input-helper">Illustrative assumption based on asset allocation (not guaranteed)</span>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-stepUp`} className="input-label">
                Annual SIP Step-Up (%)
              </label>
              <div className="slider-group">
                <div className="slider-value-display">
                  <span>{annualStepUpPercent}% Increase Every Year</span>
                </div>
                <input
                  id={`${baseId}-stepUp`}
                  type="range"
                  min="0"
                  max="25"
                  step="1"
                  value={annualStepUpPercent}
                  onChange={(e) => setAnnualStepUpPercent(Number(e.target.value))}
                  className="range-slider"
                />
                <div className="slider-ticks">
                  <span>0% (Flat SIP)</span>
                  <span>5%</span>
                  <span>10% (Recommended)</span>
                  <span>20%</span>
                  <span>25%</span>
                </div>
              </div>
              <span className="input-helper">Increasing SIP with annual salary increments significantly reduces initial monthly burden</span>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-delay`} className="input-label">
                Start Investing After (Delay in Years)
              </label>
              <div className="slider-group">
                <div className="slider-value-display">
                  <span>{startInvestingDelay === 0 ? 'Start Immediately (0 yrs)' : `Start after ${startInvestingDelay} yrs`}</span>
                </div>
                <input
                  id={`${baseId}-delay`}
                  type="range"
                  min="0"
                  max={Math.max(0, yearsToPurchase - 1)}
                  step="1"
                  value={startInvestingDelay}
                  onChange={(e) => setStartInvestingDelay(Number(e.target.value))}
                  className="range-slider"
                />
                <div className="slider-ticks">
                  <span>0 yrs</span>
                  <span>{Math.max(0, yearsToPurchase - 1)} yrs (Max Delay)</span>
                </div>
              </div>
              <span className="input-helper">Remaining accumulation period: {result.remainingInvestmentPeriod} years</span>
            </div>
          </div>

          <div className="step-actions">
            <button
              type="button"
              onClick={() => setCurrentStep(5)}
              className="btn-back"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep('results')}
              className="btn-view-results"
            >
              See Your Home Purchase Plan ★
            </button>
          </div>
        </section>
      )}

      {/* RESULTS DASHBOARD */}
      {currentStep === 'results' && (
        <div className="results-container" aria-live="polite">
          {/* Results Hero Card */}
          <div className="results-hero-card">
            <div className="hero-eyebrow">YOUR HOME PURCHASE PLAN</div>
            <h2 className="hero-heading">Estimated Amount You Need to Build</h2>

            <div className="primary-result-box">
              <span className="result-tag">REMAINING FUNDING NEED</span>
              <div className="result-main-number">
                {result.isFullyFunded ? '₹0' : formatLakhsCrores(result.fundingDeficit)}
              </div>
              <div className="result-exact-number">
                {result.isFullyFunded
                  ? 'Your existing earmarked assets cover the total down payment & costs!'
                  : `Exact Deficit: ${formatIndianCurrency(result.fundingDeficit)} (Target: ${formatIndianCurrency(result.totalAmountToAccumulate)})`}
              </div>
            </div>

            <p className="hero-disclaimer-note">
              Based on a {homeType || 'home'} in {location ? location : 'your chosen location'} priced at {formatLakhsCrores(currentPropertyValue)} today, appreciating to {formatLakhsCrores(result.futurePropertyValue)} in {yearsToPurchase} years with an {homeLoanFundingPercent}% home loan.
            </p>
          </div>

          {/* Funding Progress Bar Card */}
          <div className="progress-summary-card">
            <h3 className="section-subtitle">Goal Funding Progress</h3>
            <div className="progress-metrics-row">
              <div className="prog-metric-col">
                <span className="metric-lbl">Total Accumulate Target</span>
                <span className="metric-val">{formatLakhsCrores(result.totalAmountToAccumulate)}</span>
                <span className="metric-sub">Down pmt ({formatLakhsCrores(result.downPayment)}) + Costs ({formatLakhsCrores(result.additionalPurchaseCosts)})</span>
              </div>
              <div className="prog-metric-col">
                <span className="metric-lbl">Already Earmarked</span>
                <span className="metric-val text-teal">{formatLakhsCrores(result.totalEarmarkedAssets)}</span>
                <span className="metric-sub">{result.fundingProgress}% of target</span>
              </div>
              <div className="prog-metric-col">
                <span className="metric-lbl">Remaining Need</span>
                <span className="metric-val text-gold">{formatLakhsCrores(result.fundingDeficit)}</span>
                <span className="metric-sub">To be funded through investments</span>
              </div>
            </div>

            <div className="visual-progress-track">
              <div
                className="visual-progress-fill"
                style={{ width: `${result.fundingProgress}%` }}
              ></div>
            </div>
          </div>

          {/* 3 Prominent Funding Options Grid */}
          <div className="funding-options-section">
            <h3 className="section-subtitle">3 Ways to Fund Your Remaining {formatLakhsCrores(result.fundingDeficit)}</h3>
            
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
                  One-time investment made today compounding @ {expectedInvestmentReturn}% p.a. for {result.remainingInvestmentPeriod} years.
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
                  Same monthly investment throughout the {result.remainingInvestmentPeriod}-year accumulation period @ {expectedInvestmentReturn}% expected return.
                </p>
              </div>

              {/* Option 3: Step-Up SIP */}
              <div className="option-card">
                <div className="option-header">
                  <span className="option-badge badge-gold">Option 3 (Flexible)</span>
                  <h4 className="option-title">Step-Up SIP</h4>
                </div>
                <div className="option-amount text-navy">{formatIndianCurrency(result.requiredStepUpSIP)}/mo</div>
                <div className="option-exact">Starting amount ({annualStepUpPercent}% annual increase)</div>
                <p className="option-desc">
                  Start with a lower initial monthly commitment and increase your investment by {annualStepUpPercent}% every year as your income grows.
                </p>
              </div>
            </div>
          </div>

          {/* Future Home Loan EMI Affordability Card */}
          <div className="emi-result-card">
            <h3 className="section-subtitle">Future Home Loan EMI Affordability</h3>
            <div className="emi-card-grid">
              <div className="emi-stat-box">
                <span className="emi-stat-lbl">Projected Monthly Income</span>
                <span className="emi-stat-num">{formatIndianCurrency(result.projectedMonthlyIncome)}/mo</span>
                <span className="emi-stat-desc">In {yearsToPurchase} yrs @ {incomeGrowthRate}% annual growth</span>
              </div>

              <div className="emi-stat-box">
                <span className="emi-stat-lbl">Planned EMI Limit ({idealEMIPercent}%)</span>
                <span className="emi-stat-num text-teal">{formatIndianCurrency(result.idealMonthlyEMILimit)}/mo</span>
                <span className="emi-stat-desc">Maximum planned debt cap</span>
              </div>

              <div className="emi-stat-box">
                <span className="emi-stat-lbl">Estimated Home Loan EMI</span>
                <span className="emi-stat-num text-gold">{formatIndianCurrency(result.estimatedHomeLoanEMI)}/mo</span>
                <span className="emi-stat-desc">{loanTenureYears} yrs @ {homeLoanInterestRate}% on {formatLakhsCrores(result.homeLoanAmount)}</span>
              </div>
            </div>

            <div className={`emi-verdict-banner ${result.isEMIAffordable ? 'verdict-pass' : 'verdict-warn'}`}>
              <span className="verdict-icon">{result.isEMIAffordable ? '✅' : '⚠️'}</span>
              <div className="verdict-content">
                <strong>{result.isEMIAffordable ? 'Estimated EMI is within your planned EMI limit.' : 'Estimated EMI is above your planned EMI limit.'}</strong>
                <p>
                  {result.isEMIAffordable
                    ? `Your estimated EMI of ${formatIndianCurrency(result.estimatedHomeLoanEMI)} utilizes ${((result.estimatedHomeLoanEMI / (result.projectedMonthlyIncome || 1)) * 100).toFixed(1)}% of your projected income, safely below your ${idealEMIPercent}% limit.`
                    : `Your estimated EMI of ${formatIndianCurrency(result.estimatedHomeLoanEMI)} represents ${((result.estimatedHomeLoanEMI / (result.projectedMonthlyIncome || 1)) * 100).toFixed(1)}% of your projected income. You can improve affordability by accumulating a larger down payment or extending your loan tenure.`}
                </p>
              </div>
            </div>
          </div>

          {/* Key Insight Banner */}
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
                  <h4>1. Property Price Appreciation & Acquisition Costs</h4>
                  <ul>
                    <li><strong>Future Property Price:</strong> ₹{currentPropertyValue.toLocaleString('en-IN')} × (1 + {propertyGrowthRate}%)^{yearsToPurchase} = <strong>₹{result.futurePropertyValue.toLocaleString('en-IN')}</strong></li>
                    <li><strong>Additional Purchase Costs ({additionalCostPercent}%):</strong> ₹{result.futurePropertyValue.toLocaleString('en-IN')} × {additionalCostPercent}% = <strong>₹{result.additionalPurchaseCosts.toLocaleString('en-IN')}</strong></li>
                    <li><strong>Total Future Acquisition Cost:</strong> ₹{result.futurePropertyValue.toLocaleString('en-IN')} + ₹{result.additionalPurchaseCosts.toLocaleString('en-IN')} = <strong>₹{result.totalFutureCost.toLocaleString('en-IN')}</strong></li>
                  </ul>
                </div>

                <div className="formula-step-block">
                  <h4>2. Loan vs Down Payment Split</h4>
                  <ul>
                    <li><strong>Home Loan Amount ({homeLoanFundingPercent}% of property price):</strong> ₹{result.futurePropertyValue.toLocaleString('en-IN')} × {homeLoanFundingPercent}% = <strong>₹{result.homeLoanAmount.toLocaleString('en-IN')}</strong></li>
                    <li><strong>Down Payment ({100 - homeLoanFundingPercent}%):</strong> ₹{result.futurePropertyValue.toLocaleString('en-IN')} - ₹{result.homeLoanAmount.toLocaleString('en-IN')} = <strong>₹{result.downPayment.toLocaleString('en-IN')}</strong></li>
                    <li><strong>Total Amount to Accumulate:</strong> Down Payment (₹{result.downPayment.toLocaleString('en-IN')}) + Acquisition Costs (₹{result.additionalPurchaseCosts.toLocaleString('en-IN')}) = <strong>₹{result.totalAmountToAccumulate.toLocaleString('en-IN')}</strong></li>
                  </ul>
                </div>

                <div className="formula-step-block">
                  <h4>3. Funding Gap & Investment Mathematics</h4>
                  <ul>
                    <li><strong>Total Earmarked Assets:</strong> <strong>₹{result.totalEarmarkedAssets.toLocaleString('en-IN')}</strong></li>
                    <li><strong>Funding Deficit:</strong> max(0, ₹{result.totalAmountToAccumulate.toLocaleString('en-IN')} - ₹{result.totalEarmarkedAssets.toLocaleString('en-IN')}) = <strong>₹{result.fundingDeficit.toLocaleString('en-IN')}</strong></li>
                    <li><strong>Lump Sum Required:</strong> ₹{result.fundingDeficit.toLocaleString('en-IN')} / (1 + {expectedInvestmentReturn}%)^{result.remainingInvestmentPeriod} = <strong>₹{result.requiredLumpSum.toLocaleString('en-IN')}</strong></li>
                    <li><strong>Fixed Monthly SIP:</strong> Monthly compounding PMT to accumulate ₹{result.fundingDeficit.toLocaleString('en-IN')} over {result.remainingInvestmentPeriod * 12} months @ {expectedInvestmentReturn}% = <strong>₹{result.requiredFixedSIP.toLocaleString('en-IN')}/mo</strong></li>
                    <li><strong>Starting Step-Up SIP ({annualStepUpPercent}% increase):</strong> <strong>₹{result.requiredStepUpSIP.toLocaleString('en-IN')}/mo</strong></li>
                  </ul>
                </div>

                <div className="formula-step-block">
                  <h4>4. Projected Income & Home Loan EMI</h4>
                  <ul>
                    <li><strong>Projected Monthly Income:</strong> ₹{currentMonthlyIncome.toLocaleString('en-IN')} × (1 + {incomeGrowthRate}%)^{yearsToPurchase} = <strong>₹{result.projectedMonthlyIncome.toLocaleString('en-IN')}/mo</strong></li>
                    <li><strong>Planned EMI Limit ({idealEMIPercent}%):</strong> ₹{result.projectedMonthlyIncome.toLocaleString('en-IN')} × {idealEMIPercent}% = <strong>₹{result.idealMonthlyEMILimit.toLocaleString('en-IN')}/mo</strong></li>
                    <li><strong>Estimated Loan EMI:</strong> ₹{result.homeLoanAmount.toLocaleString('en-IN')} @ {homeLoanInterestRate}% for {loanTenureYears} years = <strong>₹{result.estimatedHomeLoanEMI.toLocaleString('en-IN')}/mo</strong></li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Voluntary WhatsApp Consultation CTA */}
          <div className="results-cta-card">
            <h3 className="cta-heading">Want help turning this into a practical home purchase plan?</h3>
            <p className="cta-sub">
              Planning for a home requires disciplined asset allocation across debt and equity funds so your down payment is protected when you are ready to buy.
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
              100% Voluntary • No forced lead capture • AMFI Registered Mutual Fund Distributor (ARN: 266896)
            </p>
          </div>

          {/* Navigation Action Buttons */}
          <div className="step-actions mt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="btn-back"
            >
              ← Edit Goal Inputs (Step 1)
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(6)}
              className="btn-edit-plan"
            >
              ⚙️ Modify Investment Assumptions (Step 6)
            </button>
          </div>
        </div>
      )}

      {/* Styled JSX (Vanilla CSS) */}
      <style>{`
        .home-planner-wrapper {
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
          grid-template-columns: repeat(7, 1fr);
          gap: 0.4rem;
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
          padding: 0.65rem 0.25rem;
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
          font-size: 0.75rem;
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

        .currency-input-wrapper, .currency-input-wrapper-sm {
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

        .unit-tag, .unit-tag-sm {
          position: absolute;
          right: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #64748B;
        }

        .currency-field, .select-field, .text-field {
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

        .select-field, .text-field {
          padding-left: 0.75rem;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .currency-field:focus, .select-field:focus, .text-field:focus {
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

        /* Cost Progression Card */
        .cost-progression-card {
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 14px;
          padding: 1.5rem;
          margin-bottom: 1.75rem;
        }

        .progression-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: #00182A;
          margin: 0 0 1.25rem 0;
        }

        .progression-grid {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
        }

        .prog-step {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 0.85rem 1rem;
          text-align: center;
          flex: 1;
          min-width: 130px;
        }

        .prog-step.highlight-step {
          background: #E6F7F5;
          border-color: #00AB96;
        }

        .prog-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748B;
          margin-bottom: 0.25rem;
        }

        .prog-val {
          display: block;
          font-family: 'Outfit', sans-serif;
          font-size: 1.25rem;
          font-weight: 800;
          color: #00182A;
        }

        .prog-sub {
          display: block;
          font-size: 0.7rem;
          color: #64748B;
          margin-top: 0.15rem;
        }

        .prog-arrow {
          font-size: 1.25rem;
          font-weight: 700;
          color: #94A3B8;
        }

        .progression-note {
          font-size: 0.825rem;
          color: #475569;
          line-height: 1.45;
          margin: 0;
          background: #FFFFFF;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          border-left: 3px solid #00AB96;
        }

        /* Split Cards Grid */
        .split-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.75rem;
        }

        .split-card {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
        }

        .split-card.accumulate-card {
          background: #FFFBEB;
          border-color: #FCD34D;
        }

        .split-header {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-bottom: 0.5rem;
        }

        .split-icon { font-size: 1.1rem; }
        .split-tag {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #475569;
        }

        .split-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: #00182A;
          margin-bottom: 0.4rem;
        }

        .split-amount {
          font-family: 'Outfit', sans-serif;
          font-size: 1.4rem;
          font-weight: 800;
          color: #00182A;
        }

        .split-exact {
          font-size: 0.75rem;
          color: #64748B;
          margin-bottom: 0.5rem;
        }

        .split-desc {
          font-size: 0.75rem;
          color: #64748B;
          line-height: 1.35;
          margin: auto 0 0 0;
        }

        /* Affordability Card */
        .affordability-card {
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 14px;
          padding: 1.5rem;
          margin-bottom: 1.75rem;
        }

        .affordability-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: #00182A;
          margin: 0 0 1.25rem 0;
        }

        .affordability-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.25rem;
        }

        .aff-metric {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 1rem;
          text-align: center;
        }

        .aff-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748B;
          margin-bottom: 0.25rem;
        }

        .aff-val {
          display: block;
          font-family: 'Outfit', sans-serif;
          font-size: 1.25rem;
          font-weight: 800;
          color: #00182A;
        }

        .aff-sub {
          display: block;
          font-size: 0.7rem;
          color: #64748B;
          margin-top: 0.2rem;
        }

        .emi-status-box {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          border-radius: 10px;
        }

        .emi-status-box.status-safe {
          background: #F0FDF4;
          border: 1px solid #86EFAC;
        }

        .emi-status-box.status-caution {
          background: #FFFBEB;
          border: 1px solid #FDE68A;
        }

        .status-badge-icon {
          font-size: 1.35rem;
          flex-shrink: 0;
        }

        .status-text-content strong {
          display: block;
          font-size: 0.9rem;
          color: #0F172A;
          margin-bottom: 0.25rem;
        }

        .status-text-content p {
          font-size: 0.825rem;
          color: #334155;
          line-height: 1.45;
          margin: 0;
        }

        /* Dynamic Assets List */
        .assets-list-container {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .asset-row-item {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 1rem;
          align-items: flex-end;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 0.85rem 1rem;
        }

        .input-label-sm {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: #475569;
          margin-bottom: 0.25rem;
        }

        .select-field-sm, .currency-field-sm {
          width: 100%;
          padding: 0.6rem 0.75rem;
          font-size: 0.9rem;
          font-weight: 600;
          color: #00182A;
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          border-radius: 6px;
        }

        .currency-field-sm {
          padding-left: 1.75rem;
        }

        .unit-tag-sm {
          position: absolute;
          right: 8px;
          font-size: 0.75rem;
          color: #64748B;
        }

        .btn-remove-asset {
          background: #FEE2E2;
          color: #DC2626;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .btn-remove-asset:hover {
          background: #FCA5A5;
        }

        .btn-add-asset {
          align-self: flex-start;
          background: #FFFFFF;
          border: 1.5px dashed #00AB96;
          color: #00AB96;
          padding: 0.6rem 1.25rem;
          font-size: 0.85rem;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-add-asset:hover {
          background: #E6F7F5;
        }

        /* Live Asset Summary Card */
        .live-asset-summary-card {
          background: linear-gradient(135deg, #F0FDF4 0%, #E6F7F5 100%);
          border: 1.5px solid #00AB96;
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
          margin-bottom: 1.75rem;
        }

        .asset-summary-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .summary-left, .summary-right {
          display: flex;
          flex-direction: column;
        }

        .summary-right { text-align: right; }

        .summary-title {
          font-size: 0.8rem;
          font-weight: 600;
          color: #475569;
        }

        .summary-amount {
          font-family: 'Outfit', sans-serif;
          font-size: 1.4rem;
          font-weight: 800;
        }

        .summary-exact {
          font-size: 0.75rem;
          color: #64748B;
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

        /* Progress Summary Card */
        .progress-summary-card {
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

        /* EMI Result Card */
        .emi-result-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 2rem;
        }

        .emi-card-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.25rem;
        }

        .emi-stat-box {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 1rem;
          text-align: center;
        }

        .emi-stat-lbl {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748B;
          margin-bottom: 0.25rem;
        }

        .emi-stat-num {
          display: block;
          font-family: 'Outfit', sans-serif;
          font-size: 1.35rem;
          font-weight: 800;
          color: #00182A;
        }

        .emi-stat-desc {
          display: block;
          font-size: 0.7rem;
          color: #64748B;
          margin-top: 0.2rem;
        }

        .emi-verdict-banner {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 1.25rem;
          border-radius: 10px;
        }

        .emi-verdict-banner.verdict-pass {
          background: #F0FDF4;
          border: 1px solid #86EFAC;
        }

        .emi-verdict-banner.verdict-warn {
          background: #FFFBEB;
          border: 1px solid #FDE68A;
        }

        .verdict-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .verdict-content strong {
          display: block;
          font-size: 0.95rem;
          color: #0F172A;
          margin-bottom: 0.25rem;
        }

        .verdict-content p {
          font-size: 0.85rem;
          color: #334155;
          line-height: 1.45;
          margin: 0;
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

        /* Accordion Card */
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
          margin: 0 0 0.5rem 0;
        }

        .formula-step-block ul {
          padding-left: 1.25rem;
          margin: 0;
          font-size: 0.85rem;
          color: #334155;
          line-height: 1.6;
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

        /* Utility Color Classes */
        .text-teal { color: #00AB96; }
        .text-gold { color: #D97706; }
        .text-navy { color: #00182A; }

        /* Responsive Breakpoints */
        @media (max-width: 860px) {
          .stepper-list {
            grid-template-columns: repeat(4, 1fr);
          }
          .inputs-grid {
            grid-template-columns: 1fr;
          }
          .split-cards-grid, .affordability-metrics, .options-cards-grid, .progress-metrics-row, .emi-card-grid {
            grid-template-columns: 1fr;
          }
          .progression-grid {
            flex-direction: column;
            align-items: stretch;
          }
          .prog-arrow {
            display: none;
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
          .stepper-list {
            grid-template-columns: repeat(3, 1fr);
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
          .asset-row-item {
            grid-template-columns: 1fr;
          }
          .asset-summary-header {
            flex-direction: column;
            gap: 0.75rem;
          }
          .summary-right {
            text-align: left;
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
        }
      `}</style>
    </div>
  );
}
