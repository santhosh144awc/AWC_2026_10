import React, { useState, useId } from 'react';
import {
  calculateLifeInsuranceNeed,
  formatIndianCurrency,
  formatLakhsCrores,
  DEFAULT_ASSUMPTIONS,
  DEFAULT_LIABILITIES,
  DEFAULT_GOALS,
  DEFAULT_EXPENSES,
  DEFAULT_RESOURCES,
  SAMPLE_LIFE_INSURANCE_INPUT,
  type LifeInsuranceLiabilities,
  type LifeInsuranceGoals,
  type FamilyExpenseInputs,
  type LifeInsuranceAssumptions,
  type ExistingResources,
  type LifeInsuranceNeedInput,
} from '../../utils/calculations/lifeInsuranceNeed';

type WizardStep = 1 | 2 | 3 | 4 | 5 | 'results';

export default function LifeInsuranceNeedCalculator() {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);

  // Form State
  const [liabilities, setLiabilities] = useState<LifeInsuranceLiabilities>(DEFAULT_LIABILITIES);
  const [goals, setGoals] = useState<LifeInsuranceGoals>(DEFAULT_GOALS);
  const [expenses, setExpenses] = useState<FamilyExpenseInputs>(DEFAULT_EXPENSES);
  const [assumptions, setAssumptions] = useState<LifeInsuranceAssumptions>(DEFAULT_ASSUMPTIONS);
  const [resources, setResources] = useState<ExistingResources>(DEFAULT_RESOURCES);

  // Accordion UI State
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showAssumptionsModal, setShowAssumptionsModal] = useState(false);

  // Accessible unique IDs
  const baseId = useId();

  // Master calculation result (real-time)
  const calculationInput: LifeInsuranceNeedInput = {
    liabilities,
    goals,
    expenses,
    assumptions,
    resources,
  };
  const result = calculateLifeInsuranceNeed(calculationInput);

  // Handlers for inputs
  const handleLiabilityChange = (field: keyof LifeInsuranceLiabilities, val: number) => {
    setLiabilities((prev) => ({ ...prev, [field]: Math.max(0, val) }));
  };

  const handleGoalChange = (field: keyof LifeInsuranceGoals, val: number) => {
    setGoals((prev) => ({ ...prev, [field]: Math.max(0, val) }));
  };

  const handleExpenseChange = (field: keyof FamilyExpenseInputs, val: number) => {
    setExpenses((prev) => ({ ...prev, [field]: Math.max(0, val) }));
  };

  const handleAssumptionChange = (field: keyof LifeInsuranceAssumptions, val: number) => {
    setAssumptions((prev) => ({ ...prev, [field]: val }));
  };

  const handleResourceChange = (field: keyof ExistingResources, val: number) => {
    setResources((prev) => ({ ...prev, [field]: Math.max(0, val) }));
  };

  const handleLoadSampleData = () => {
    setLiabilities(SAMPLE_LIFE_INSURANCE_INPUT.liabilities);
    setGoals(SAMPLE_LIFE_INSURANCE_INPUT.goals);
    setExpenses(SAMPLE_LIFE_INSURANCE_INPUT.expenses);
    setAssumptions(SAMPLE_LIFE_INSURANCE_INPUT.assumptions);
    setResources(SAMPLE_LIFE_INSURANCE_INPUT.resources);
  };

  const handleReset = () => {
    setLiabilities(DEFAULT_LIABILITIES);
    setGoals(DEFAULT_GOALS);
    setExpenses(DEFAULT_EXPENSES);
    setAssumptions(DEFAULT_ASSUMPTIONS);
    setResources(DEFAULT_RESOURCES);
    setCurrentStep(1);
  };

  // WhatsApp Message Generator
  const generateWhatsAppUrl = () => {
    const text = `Hi Santhosh, I used the Life Insurance Need Calculator on Ant Wealth Creation.

• Total Protection Requirement: ${formatLakhsCrores(result.totalRequirement)} (${formatIndianCurrency(result.totalRequirement)})
• Existing Resources: ${formatLakhsCrores(result.totalExistingResources)} (${formatIndianCurrency(result.totalExistingResources)})
• Estimated Additional Cover: ${result.isCovered ? '₹0 (Fully Covered)' : `${formatLakhsCrores(result.additionalCoverRequired)} (${formatIndianCurrency(result.additionalCoverRequired)})`}

I would like help reviewing my family's protection plan.`;

    return `https://wa.me/918087971566?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="insurance-calc-wrapper">
      {/* Top Bar: Quick Demo Sample & Reset Controls */}
      <div className="calc-top-action-bar">
        <div className="action-tagline">
          <span className="live-pulse"></span>
          <span>Family Protection Assessment</span>
        </div>
        <div className="action-btn-group">
          <button
            type="button"
            onClick={handleLoadSampleData}
            className="btn-sample-preset"
            title="Populate representative scenario for quick test"
          >
            📊 Try Sample Scenario
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="btn-reset-preset"
            title="Clear all fields"
          >
            ↺ Reset
          </button>
        </div>
      </div>

      {/* 5-Step Stepper Navigation */}
      <nav className="stepper-nav" aria-label="Calculator Steps">
        <ol className="stepper-list">
          {[
            { step: 1, title: 'Loans', icon: '🏠' },
            { step: 2, title: 'Goals', icon: '🎯' },
            { step: 3, title: 'Living Expenses', icon: '🛒' },
            { step: 4, title: 'Assumptions', icon: '⚙️' },
            { step: 5, title: 'Resources', icon: '🛡️' },
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

      {/* STEP 1: OUTSTANDING LOANS */}
      {currentStep === 1 && (
        <section className="step-card" aria-labelledby="step1-title">
          <div className="step-header">
            <div className="step-badge">Step 1 of 5</div>
            <h2 id="step1-title" className="step-heading">
              What loans would your family need to settle?
            </h2>
            <p className="step-description">
              If something happened to you, these outstanding loan balances would need to be cleared so your family does not face repayment stress or asset repossession.
            </p>
          </div>

          <div className="inputs-grid">
            <div className="input-group">
              <label htmlFor={`${baseId}-homeLoan`} className="input-label">
                <span className="label-icon">🏠</span> Home Loan Outstanding
              </label>
              <div className="currency-input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  id={`${baseId}-homeLoan`}
                  type="number"
                  min="0"
                  step="50000"
                  value={liabilities.homeLoan || ''}
                  onChange={(e) => handleLiabilityChange('homeLoan', Number(e.target.value))}
                  placeholder="0"
                  className="currency-field"
                />
              </div>
              <span className="input-helper">{formatLakhsCrores(liabilities.homeLoan)}</span>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-vehicleLoan`} className="input-label">
                <span className="label-icon">🚗</span> Vehicle Loan Outstanding
              </label>
              <div className="currency-input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  id={`${baseId}-vehicleLoan`}
                  type="number"
                  min="0"
                  step="25000"
                  value={liabilities.vehicleLoan || ''}
                  onChange={(e) => handleLiabilityChange('vehicleLoan', Number(e.target.value))}
                  placeholder="0"
                  className="currency-field"
                />
              </div>
              <span className="input-helper">{formatLakhsCrores(liabilities.vehicleLoan)}</span>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-personalLoan`} className="input-label">
                <span className="label-icon">💳</span> Personal Loan Outstanding
              </label>
              <div className="currency-input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  id={`${baseId}-personalLoan`}
                  type="number"
                  min="0"
                  step="25000"
                  value={liabilities.personalLoan || ''}
                  onChange={(e) => handleLiabilityChange('personalLoan', Number(e.target.value))}
                  placeholder="0"
                  className="currency-field"
                />
              </div>
              <span className="input-helper">{formatLakhsCrores(liabilities.personalLoan)}</span>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-educationLoan`} className="input-label">
                <span className="label-icon">🎓</span> Education Loan Outstanding
              </label>
              <div className="currency-input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  id={`${baseId}-educationLoan`}
                  type="number"
                  min="0"
                  step="25000"
                  value={liabilities.educationLoan || ''}
                  onChange={(e) => handleLiabilityChange('educationLoan', Number(e.target.value))}
                  placeholder="0"
                  className="currency-field"
                />
              </div>
              <span className="input-helper">{formatLakhsCrores(liabilities.educationLoan)}</span>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-otherLoans`} className="input-label">
                <span className="label-icon">📑</span> Other Loans & Borrowings
              </label>
              <div className="currency-input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  id={`${baseId}-otherLoans`}
                  type="number"
                  min="0"
                  step="25000"
                  value={liabilities.otherLoans || ''}
                  onChange={(e) => handleLiabilityChange('otherLoans', Number(e.target.value))}
                  placeholder="0"
                  className="currency-field"
                />
              </div>
              <span className="input-helper">{formatLakhsCrores(liabilities.otherLoans)}</span>
            </div>
          </div>

          {/* Live Subtotal Bar */}
          <div className="live-subtotal-card">
            <div className="subtotal-info">
              <span className="subtotal-label">Total Outstanding Loans (Component A)</span>
              <span className="subtotal-helper">Current principal balance to be cleared</span>
            </div>
            <div className="subtotal-val-box">
              <span className="subtotal-main">{formatLakhsCrores(result.totalLiabilities)}</span>
              <span className="subtotal-exact">{formatIndianCurrency(result.totalLiabilities)}</span>
            </div>
          </div>

          <div className="step-actions">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="btn-continue"
            >
              Continue to Family Goals →
            </button>
          </div>
        </section>
      )}

      {/* STEP 2: FAMILY GOALS & COMMITMENTS */}
      {currentStep === 2 && (
        <section className="step-card" aria-labelledby="step2-title">
          <div className="step-header">
            <div className="step-badge">Step 2 of 5</div>
            <h2 id="step2-title" className="step-heading">
              What financial commitments should your family still fulfil?
            </h2>
            <p className="step-description">
              Enter the estimated amount required <strong>in today's value</strong> for each milestone commitment. This calculator includes them as present-value requirements.
            </p>
          </div>

          <div className="inputs-grid">
            <div className="input-group">
              <label htmlFor={`${baseId}-higherEdu`} className="input-label">
                <span className="label-icon">🎓</span> Children's Higher Education
              </label>
              <div className="currency-input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  id={`${baseId}-higherEdu`}
                  type="number"
                  min="0"
                  step="50000"
                  value={goals.higherEducation || ''}
                  onChange={(e) => handleGoalChange('higherEducation', Number(e.target.value))}
                  placeholder="0"
                  className="currency-field"
                />
              </div>
              <span className="input-helper">{formatLakhsCrores(goals.higherEducation)}</span>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-marriage`} className="input-label">
                <span className="label-icon">💍</span> Children's Marriage & Life Milestones
              </label>
              <div className="currency-input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  id={`${baseId}-marriage`}
                  type="number"
                  min="0"
                  step="50000"
                  value={goals.marriage || ''}
                  onChange={(e) => handleGoalChange('marriage', Number(e.target.value))}
                  placeholder="0"
                  className="currency-field"
                />
              </div>
              <span className="input-helper">{formatLakhsCrores(goals.marriage)}</span>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-primaryEdu`} className="input-label">
                <span className="label-icon">🎒</span> Children's Primary & School Education
              </label>
              <div className="currency-input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  id={`${baseId}-primaryEdu`}
                  type="number"
                  min="0"
                  step="25000"
                  value={goals.primaryEducation || ''}
                  onChange={(e) => handleGoalChange('primaryEducation', Number(e.target.value))}
                  placeholder="0"
                  className="currency-field"
                />
              </div>
              <span className="input-helper">{formatLakhsCrores(goals.primaryEducation)}</span>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-parents`} className="input-label">
                <span className="label-icon">👵</span> Contribution to Dependent Parents
              </label>
              <div className="currency-input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  id={`${baseId}-parents`}
                  type="number"
                  min="0"
                  step="25000"
                  value={goals.parentsContribution || ''}
                  onChange={(e) => handleGoalChange('parentsContribution', Number(e.target.value))}
                  placeholder="0"
                  className="currency-field"
                />
              </div>
              <span className="input-helper">{formatLakhsCrores(goals.parentsContribution)}</span>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-firstHouse`} className="input-label">
                <span className="label-icon">🏡</span> First House Purchase / Down Payment
              </label>
              <div className="currency-input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  id={`${baseId}-firstHouse`}
                  type="number"
                  min="0"
                  step="50000"
                  value={goals.firstHousePurchase || ''}
                  onChange={(e) => handleGoalChange('firstHousePurchase', Number(e.target.value))}
                  placeholder="0"
                  className="currency-field"
                />
              </div>
              <span className="input-helper">{formatLakhsCrores(goals.firstHousePurchase)}</span>
            </div>
          </div>

          <div className="live-subtotal-card">
            <div className="subtotal-info">
              <span className="subtotal-label">Total Family Goals (Component B)</span>
              <span className="subtotal-helper">Estimated in today's money (Present Value)</span>
            </div>
            <div className="subtotal-val-box">
              <span className="subtotal-main">{formatLakhsCrores(result.totalFamilyGoals)}</span>
              <span className="subtotal-exact">{formatIndianCurrency(result.totalFamilyGoals)}</span>
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
              Continue to Living Expenses →
            </button>
          </div>
        </section>
      )}

      {/* STEP 3: FAMILY LIVING EXPENSES */}
      {currentStep === 3 && (
        <section className="step-card" aria-labelledby="step3-title">
          <div className="step-header">
            <div className="step-badge">Step 3 of 5</div>
            <h2 id="step3-title" className="step-heading">
              How much does your family need to maintain its lifestyle?
            </h2>
            <p className="step-description">
              Enter annual living expenses. The calculator allows adjusting for personal expenses that would no longer occur.
            </p>
          </div>

          <div className="inputs-grid">
            <div className="input-group">
              <label htmlFor={`${baseId}-householdExp`} className="input-label">
                <span className="label-icon">🍲</span> Annual Household Expenses
              </label>
              <div className="currency-input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  id={`${baseId}-householdExp`}
                  type="number"
                  min="0"
                  step="25000"
                  value={expenses.householdExpenses || ''}
                  onChange={(e) => handleExpenseChange('householdExpenses', Number(e.target.value))}
                  placeholder="0"
                  className="currency-field"
                />
                <span className="unit-tag">/ yr</span>
              </div>
              <span className="input-helper">{formatLakhsCrores(expenses.householdExpenses)} per year</span>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-lifestyleExp`} className="input-label">
                <span className="label-icon">✈️</span> Annual Lifestyle & Discretionary Expenses
              </label>
              <div className="currency-input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  id={`${baseId}-lifestyleExp`}
                  type="number"
                  min="0"
                  step="25000"
                  value={expenses.lifestyleExpenses || ''}
                  onChange={(e) => handleExpenseChange('lifestyleExpenses', Number(e.target.value))}
                  placeholder="0"
                  className="currency-field"
                />
                <span className="unit-tag">/ yr</span>
              </div>
              <span className="input-helper">{formatLakhsCrores(expenses.lifestyleExpenses)} per year</span>
            </div>
          </div>

          {/* Personal Expense Discount Slider */}
          <div className="discount-card">
            <div className="discount-header-row">
              <label htmlFor={`${baseId}-discount`} className="discount-title">
                Personal Expense Discount: <strong>{assumptions.personalExpenseDiscount}%</strong>
              </label>
              <span className="discount-badge">Default: 20%</span>
            </div>
            <p className="discount-desc">
              A portion of current household spending belongs to the earning member's personal consumption (e.g. personal commute, wardrobe, personal dining). This discount adjusts the ongoing requirement for the surviving family.
            </p>
            <input
              id={`${baseId}-discount`}
              type="range"
              min="0"
              max="50"
              step="5"
              value={assumptions.personalExpenseDiscount}
              onChange={(e) => handleAssumptionChange('personalExpenseDiscount', Number(e.target.value))}
              className="range-slider"
            />
            <div className="slider-ticks">
              <span>0% (No reduction)</span>
              <span>20% (Standard)</span>
              <span>50% (Max)</span>
            </div>
          </div>

          <div className="live-subtotal-card">
            <div className="subtotal-info">
              <span className="subtotal-label">Annual Family Expenses</span>
              <span className="subtotal-helper">
                {formatIndianCurrency(result.totalAnnualExpenses)} × (100% - {assumptions.personalExpenseDiscount}%)
              </span>
            </div>
            <div className="subtotal-val-box">
              <span className="subtotal-main">{formatIndianCurrency(result.annualFamilyExpenses)} / yr</span>
              <span className="subtotal-exact">{formatLakhsCrores(result.annualFamilyExpenses)} / year</span>
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
              Continue to Assumptions →
            </button>
          </div>
        </section>
      )}

      {/* STEP 4: ADVANCED ASSUMPTIONS */}
      {currentStep === 4 && (
        <section className="step-card" aria-labelledby="step4-title">
          <div className="step-header">
            <div className="step-badge">Step 4 of 5</div>
            <h2 id="step4-title" className="step-heading">
              Fine-tune your financial assumptions
            </h2>
            <p className="step-description">
              These illustrative assumptions determine the capital needed to support your family's future living expenses across time, adjusted for taxes and inflation.
            </p>
          </div>

          <div className="assumptions-grid">
            <div className="assumption-box">
              <div className="assumption-label-row">
                <label htmlFor={`${baseId}-yearsSupport`} className="assumption-title">
                  Years of Family Support
                </label>
                <span className="assumption-val">{assumptions.yearsOfSupport} Yrs</span>
              </div>
              <p className="assumption-helper">
                How many years the expense corpus should sustain the family (e.g. spouse life expectancy).
              </p>
              <input
                id={`${baseId}-yearsSupport`}
                type="range"
                min="5"
                max="50"
                step="1"
                value={assumptions.yearsOfSupport}
                onChange={(e) => handleAssumptionChange('yearsOfSupport', Number(e.target.value))}
                className="range-slider"
              />
              <div className="slider-ticks">
                <span>5 yrs</span>
                <span>25 yrs (Default)</span>
                <span>50 yrs</span>
              </div>
            </div>

            <div className="assumption-box">
              <div className="assumption-label-row">
                <label htmlFor={`${baseId}-return`} className="assumption-title">
                  Expected Investment Return
                </label>
                <span className="assumption-val">{assumptions.expectedReturn}% p.a.</span>
              </div>
              <p className="assumption-helper">
                Gross illustrative return generated by the family expense corpus.
              </p>
              <input
                id={`${baseId}-return`}
                type="range"
                min="4"
                max="15"
                step="0.5"
                value={assumptions.expectedReturn}
                onChange={(e) => handleAssumptionChange('expectedReturn', Number(e.target.value))}
                className="range-slider"
              />
              <div className="slider-ticks">
                <span>4%</span>
                <span>8% (Default)</span>
                <span>15%</span>
              </div>
            </div>

            <div className="assumption-box">
              <div className="assumption-label-row">
                <label htmlFor={`${baseId}-taxRate`} className="assumption-title">
                  Tax on Investment Income
                </label>
                <span className="assumption-val">{assumptions.taxRate}%</span>
              </div>
              <p className="assumption-helper">
                Expected tax bracket on capital gains and interest from the corpus.
              </p>
              <input
                id={`${baseId}-taxRate`}
                type="range"
                min="0"
                max="30"
                step="2.5"
                value={assumptions.taxRate}
                onChange={(e) => handleAssumptionChange('taxRate', Number(e.target.value))}
                className="range-slider"
              />
              <div className="slider-ticks">
                <span>0%</span>
                <span>10% (Default)</span>
                <span>30%</span>
              </div>
            </div>

            <div className="assumption-box">
              <div className="assumption-label-row">
                <label htmlFor={`${baseId}-inflation`} className="assumption-title">
                  Expense Inflation
                </label>
                <span className="assumption-val">{assumptions.expenseInflation}% p.a.</span>
              </div>
              <p className="assumption-helper">
                Expected annual rate of increase for household living expenses.
              </p>
              <input
                id={`${baseId}-inflation`}
                type="range"
                min="3"
                max="12"
                step="0.5"
                value={assumptions.expenseInflation}
                onChange={(e) => handleAssumptionChange('expenseInflation', Number(e.target.value))}
                className="range-slider"
              />
              <div className="slider-ticks">
                <span>3%</span>
                <span>6% (Default)</span>
                <span>12%</span>
              </div>
            </div>
          </div>

          {/* Mathematical Rate Breakdown Card */}
          <div className="rate-breakdown-card">
            <h3 className="rate-breakdown-title">Compounding Rate Journey (Compound Fisher Relation)</h3>
            <div className="rate-journey-track">
              <div className="journey-node">
                <span className="node-label">Gross Return</span>
                <span className="node-val">{assumptions.expectedReturn.toFixed(1)}%</span>
              </div>
              <span className="journey-arrow">→</span>
              <div className="journey-node">
                <span className="node-label">After-Tax Return</span>
                <span className="node-val node-teal">{result.taxAdjustedReturn.toFixed(2)}%</span>
                <span className="node-sub">(-{assumptions.taxRate}% tax)</span>
              </div>
              <span className="journey-arrow">→</span>
              <div className="journey-node">
                <span className="node-label">Real Return</span>
                <span className="node-val node-gold">{result.realReturn.toFixed(2)}%</span>
                <span className="node-sub">(-{assumptions.expenseInflation}% inflation)</span>
              </div>
            </div>

            <div className="corpus-result-highlight">
              <div className="corpus-icon">🏦</div>
              <div className="corpus-text">
                <span className="corpus-label">Future Family Living Expense Corpus (Component C)</span>
                <span className="corpus-amount">{formatLakhsCrores(result.futureFamilyExpenseCorpus)}</span>
                <span className="corpus-sub">
                  Calculated using Annuity Due (type = 1, beginning of period withdrawals) for {assumptions.yearsOfSupport} years.
                </span>
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
              Continue to Existing Resources →
            </button>
          </div>
        </section>
      )}

      {/* STEP 5: EXISTING RESOURCES */}
      {currentStep === 5 && (
        <section className="step-card" aria-labelledby="step5-title">
          <div className="step-header">
            <div className="step-badge">Step 5 of 5</div>
            <h2 id="step5-title" className="step-heading">
              What financial resources does your family already have?
            </h2>
            <p className="step-description">
              These available resources offset your total protection requirement.
            </p>
          </div>

          <div className="inputs-grid">
            <div className="input-group">
              <label htmlFor={`${baseId}-existingInsurance`} className="input-label">
                <span className="label-icon">🛡️</span> Existing Life Insurance Sum Assured
              </label>
              <div className="currency-input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  id={`${baseId}-existingInsurance`}
                  type="number"
                  min="0"
                  step="50000"
                  value={resources.existingLifeInsurance || ''}
                  onChange={(e) => handleResourceChange('existingLifeInsurance', Number(e.target.value))}
                  placeholder="0"
                  className="currency-field"
                />
              </div>
              <span className="input-helper">{formatLakhsCrores(resources.existingLifeInsurance)}</span>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-investments`} className="input-label">
                <span className="label-icon">📈</span> Current Investment Assets
              </label>
              <div className="currency-input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  id={`${baseId}-investments`}
                  type="number"
                  min="0"
                  step="50000"
                  value={resources.investmentAssets || ''}
                  onChange={(e) => handleResourceChange('investmentAssets', Number(e.target.value))}
                  placeholder="0"
                  className="currency-field"
                />
              </div>
              <span className="input-helper">
                Mutual funds, fixed deposits, stocks (exclude primary residence & personal vehicles)
              </span>
            </div>

            <div className="input-group">
              <label htmlFor={`${baseId}-spouseIncome`} className="input-label">
                <span className="label-icon">💼</span> Present Value of Spouse's Future Earnings
              </label>
              <div className="currency-input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  id={`${baseId}-spouseIncome`}
                  type="number"
                  min="0"
                  step="50000"
                  value={resources.spouseFutureEarningsPV || ''}
                  onChange={(e) => handleResourceChange('spouseFutureEarningsPV', Number(e.target.value))}
                  placeholder="0"
                  className="currency-field"
                />
              </div>
              <span className="input-helper">
                Approximate present value if spouse will continue earning in future
              </span>
            </div>
          </div>

          <div className="live-subtotal-card">
            <div className="subtotal-info">
              <span className="subtotal-label">Total Resources Available</span>
              <span className="subtotal-helper">Existing cover + Investments + Spouse Earnings PV</span>
            </div>
            <div className="subtotal-val-box">
              <span className="subtotal-main">{formatLakhsCrores(result.totalExistingResources)}</span>
              <span className="subtotal-exact">{formatIndianCurrency(result.totalExistingResources)}</span>
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
              See Your Protection Snapshot ★
            </button>
          </div>
        </section>
      )}

      {/* RESULTS DASHBOARD */}
      {currentStep === 'results' && (
        <div className="results-container" aria-live="polite">
          {/* Hero Result Banner */}
          <div className="results-hero-card">
            <div className="hero-eyebrow">YOUR FAMILY PROTECTION SNAPSHOT</div>
            <h2 className="hero-heading">How Much Life Insurance Does Your Family Really Need?</h2>

            <div className="primary-result-box">
              <span className="result-tag">ESTIMATED ADDITIONAL COVER REQUIRED</span>
              <div className="result-main-number">
                {result.isCovered ? '₹0' : formatLakhsCrores(result.additionalCoverRequired)}
              </div>
              <div className="result-exact-number">
                {result.isCovered
                  ? 'Your estimated existing resources cover the calculated requirement'
                  : `Exact Protection Gap: ${formatIndianCurrency(result.additionalCoverRequired)}`}
              </div>
            </div>

            {result.isCovered ? (
              <div className="covered-status-card">
                <span className="status-icon">✅</span>
                <p className="status-text">
                  Based on the information and assumptions provided, your existing resources currently cover the calculated requirement. Regularly review this as liabilities or family commitments change.
                </p>
              </div>
            ) : (
              <p className="hero-disclaimer-note">
                Based on the information and assumptions you provided, this is the estimated additional pure life insurance cover your family may need to settle debt, fund milestones, and support ongoing living expenses.
              </p>
            )}
          </div>

          {/* 3-Component Requirement Breakdown */}
          <div className="section-breakdown-box">
            <h3 className="section-subtitle">1. Total Financial Requirement Breakdown</h3>
            <div className="components-grid">
              <div className="component-card">
                <div className="card-top">
                  <span className="comp-icon">🏠</span>
                  <span className="comp-tag">Component A</span>
                </div>
                <div className="comp-title">Outstanding Loans</div>
                <div className="comp-amount">{formatLakhsCrores(result.totalLiabilities)}</div>
                <div className="comp-exact">{formatIndianCurrency(result.totalLiabilities)}</div>
                <p className="comp-desc">Principal balance across home, vehicle, personal, and education debt.</p>
              </div>

              <div className="component-card">
                <div className="card-top">
                  <span className="comp-icon">🎯</span>
                  <span className="comp-tag">Component B</span>
                </div>
                <div className="comp-title">Family Goals & Commitments</div>
                <div className="comp-amount">{formatLakhsCrores(result.totalFamilyGoals)}</div>
                <div className="comp-exact">{formatIndianCurrency(result.totalFamilyGoals)}</div>
                <p className="comp-desc">Children's higher education, marriage, and parents' contribution in today's value.</p>
              </div>

              <div className="component-card">
                <div className="card-top">
                  <span className="comp-icon">🛒</span>
                  <span className="comp-tag">Component C</span>
                </div>
                <div className="comp-title">Living Expense Corpus</div>
                <div className="comp-amount">{formatLakhsCrores(result.futureFamilyExpenseCorpus)}</div>
                <div className="comp-exact">{formatIndianCurrency(result.futureFamilyExpenseCorpus)}</div>
                <p className="comp-desc">
                  Annuity Due corpus for {assumptions.yearsOfSupport} years of support @ {result.realReturn.toFixed(2)}% real return.
                </p>
              </div>
            </div>

            <div className="total-req-banner">
              <span className="total-req-label">TOTAL LIFE INSURANCE REQUIREMENT (A + B + C)</span>
              <span className="total-req-val">{formatLakhsCrores(result.totalRequirement)}</span>
            </div>
          </div>

          {/* Resources vs Requirement Visual Bar */}
          <div className="visual-comparison-card">
            <h3 className="section-subtitle">2. Protection Gap Comparison</h3>
            <div className="comparison-row">
              <div className="comp-stat">
                <span className="stat-label">Total Requirement</span>
                <span className="stat-val">{formatLakhsCrores(result.totalRequirement)}</span>
              </div>
              <div className="comp-divider">vs</div>
              <div className="comp-stat">
                <span className="stat-label">Resources Available</span>
                <span className="stat-val text-teal">{formatLakhsCrores(result.totalExistingResources)}</span>
              </div>
              <div className="comp-divider">=</div>
              <div className="comp-stat">
                <span className="stat-label">Protection Gap</span>
                <span className="stat-val text-gold">
                  {result.isCovered ? '₹0' : formatLakhsCrores(result.additionalCoverRequired)}
                </span>
              </div>
            </div>

            {/* Visual stacked / progress track */}
            <div className="progress-track-wrapper">
              <div className="progress-bar-bg">
                <div
                  className="progress-fill-resources"
                  style={{
                    width: `${result.totalRequirement > 0 ? Math.min(100, (result.totalExistingResources / result.totalRequirement) * 100) : 100}%`,
                  }}
                  title="Resources Available"
                ></div>
              </div>
              <div className="progress-legend">
                <span className="legend-item">
                  <span className="legend-dot dot-teal"></span> Available Resources ({result.totalRequirement > 0 ? Math.round((result.totalExistingResources / result.totalRequirement) * 100) : 100}%)
                </span>
                <span className="legend-item">
                  <span className="legend-dot dot-gold"></span> Net Protection Gap
                </span>
              </div>
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
                <strong>How was my result calculated?</strong>
              </span>
              <span className="toggle-chevron">{showHowItWorks ? '▲' : '▼'}</span>
            </button>

            {showHowItWorks && (
              <div className="accordion-content">
                <div className="formula-step-block">
                  <h4>Step 1: Total Requirement Formula</h4>
                  <code>
                    Total Requirement = Outstanding Liabilities (₹{result.totalLiabilities.toLocaleString('en-IN')}) + Family Goals (₹{result.totalFamilyGoals.toLocaleString('en-IN')}) + Future Living Expense Corpus (₹{result.futureFamilyExpenseCorpus.toLocaleString('en-IN')}) = ₹{result.totalRequirement.toLocaleString('en-IN')}
                  </code>
                </div>

                <div className="formula-step-block">
                  <h4>Step 2: Compound Real Return & Annuity-Due Calculation</h4>
                  <ul>
                    <li><strong>Annual Family Expenses:</strong> ₹{result.totalAnnualExpenses.toLocaleString('en-IN')} × (1 - {assumptions.personalExpenseDiscount}%) = <strong>₹{result.annualFamilyExpenses.toLocaleString('en-IN')} / yr</strong></li>
                    <li><strong>Tax-Adjusted Return:</strong> {assumptions.expectedReturn}% × (1 - {assumptions.taxRate}%) = <strong>{result.taxAdjustedReturn.toFixed(2)}%</strong></li>
                    <li><strong>Fisher Real Return:</strong> (1 + {result.taxAdjustedReturn.toFixed(2)}%) / (1 + {assumptions.expenseInflation}%) - 1 = <strong>{result.realReturn.toFixed(4)}%</strong></li>
                    <li><strong>Expense Corpus (Annuity Due):</strong> Payments made at the beginning of each year across {assumptions.yearsOfSupport} years = <strong>₹{result.futureFamilyExpenseCorpus.toLocaleString('en-IN')}</strong></li>
                  </ul>
                </div>

                <div className="formula-step-block">
                  <h4>Step 3: Protection Gap Formula</h4>
                  <code>
                    Additional Cover = max(0, Total Requirement - Existing Resources) = max(0, ₹{result.totalRequirement.toLocaleString('en-IN')} - ₹{result.totalExistingResources.toLocaleString('en-IN')}) = ₹{result.additionalCoverRequired.toLocaleString('en-IN')}
                  </code>
                </div>

                <div className="action-row-inside">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="btn-edit-assumptions"
                  >
                    ⚙️ Edit Assumptions (Step 4)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="results-cta-card">
            <h3 className="cta-heading">Want help reviewing your family's protection needs?</h3>
            <p className="cta-sub">
              A protection calculation is only the starting point. We can help you review your existing policies, debt coverage, family milestones, and build a stress-free financial plan.
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
              100% Voluntary • No high-pressure sales • AMFI Registered Mutual Fund Distributor
            </p>
          </div>

          {/* Edit / Restart Navigation */}
          <div className="step-actions mt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="btn-back"
            >
              ← Edit All Inputs
            </button>
          </div>
        </div>
      )}

      {/* Styled JSX (Vanilla CSS) */}
      <style>{`
        .insurance-calc-wrapper {
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
          background: #00AB96;
          border-radius: 50%;
          animation: pulse 1.8s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 171, 150, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(0, 171, 150, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 171, 150, 0); }
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

        /* Stepper */
        .stepper-nav {
          margin-bottom: 2rem;
        }

        .stepper-list {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
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
          padding: 0.65rem 0.4rem;
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
          width: 24px;
          height: 24px;
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
          margin-right: 0.25rem;
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
          display: flex;
          align-items: center;
          gap: 0.4rem;
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

        /* Live Subtotal Card */
        .live-subtotal-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, #F0FDF4 0%, #E6F7F5 100%);
          border: 1.5px solid #00AB96;
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
          margin-bottom: 1.75rem;
        }

        .subtotal-label {
          display: block;
          font-size: 0.95rem;
          font-weight: 700;
          color: #00182A;
        }

        .subtotal-helper {
          font-size: 0.8rem;
          color: #475569;
        }

        .subtotal-val-box {
          text-align: right;
        }

        .subtotal-main {
          display: block;
          font-family: 'Outfit', sans-serif;
          font-size: 1.4rem;
          font-weight: 800;
          color: #00AB96;
        }

        .subtotal-exact {
          font-size: 0.8rem;
          color: #64748B;
          font-weight: 600;
        }

        /* Discount Slider Card */
        .discount-card {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .discount-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.35rem;
        }

        .discount-title {
          font-size: 0.95rem;
          color: #00182A;
        }

        .discount-badge {
          font-size: 0.75rem;
          font-weight: 600;
          background: #E2E8F0;
          color: #334155;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
        }

        .discount-desc {
          font-size: 0.825rem;
          color: #64748B;
          line-height: 1.4;
          margin-bottom: 0.75rem;
        }

        .range-slider {
          width: 100%;
          accent-color: #00AB96;
          cursor: pointer;
          margin-bottom: 0.25rem;
        }

        .slider-ticks {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #94A3B8;
        }

        /* Assumptions Grid */
        .assumptions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
          margin-bottom: 1.75rem;
        }

        .assumption-box {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 1rem;
        }

        .assumption-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.25rem;
        }

        .assumption-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: #00182A;
        }

        .assumption-val {
          font-size: 0.9rem;
          font-weight: 800;
          color: #00AB96;
        }

        .assumption-helper {
          font-size: 0.75rem;
          color: #64748B;
          margin-bottom: 0.75rem;
          line-height: 1.35;
        }

        /* Rate Breakdown Card */
        .rate-breakdown-card {
          background: #00182A;
          color: #FFFFFF;
          border-radius: 14px;
          padding: 1.5rem;
          margin-bottom: 1.75rem;
        }

        .rate-breakdown-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.05rem;
          font-weight: 700;
          margin: 0 0 1.25rem 0;
          color: #FFFFFF;
        }

        .rate-journey-track {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 1rem;
          margin-bottom: 1.25rem;
        }

        .journey-node {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .node-label {
          font-size: 0.75rem;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .node-val {
          font-family: 'Outfit', sans-serif;
          font-size: 1.25rem;
          font-weight: 800;
          color: #FFFFFF;
          margin-top: 0.15rem;
        }

        .node-teal { color: #00AB96; }
        .node-gold { color: #FFC107; }

        .node-sub {
          font-size: 0.7rem;
          color: #CBD5E1;
        }

        .journey-arrow {
          font-size: 1.25rem;
          color: #64748B;
        }

        .corpus-result-highlight {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(0, 171, 150, 0.15);
          border: 1px solid rgba(0, 171, 150, 0.4);
          border-radius: 10px;
          padding: 1rem 1.25rem;
        }

        .corpus-icon {
          font-size: 2rem;
        }

        .corpus-text {
          display: flex;
          flex-direction: column;
        }

        .corpus-label {
          font-size: 0.8rem;
          color: #94A3B8;
          font-weight: 600;
        }

        .corpus-amount {
          font-family: 'Outfit', sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          color: #00AB96;
        }

        .corpus-sub {
          font-size: 0.75rem;
          color: #CBD5E1;
          margin-top: 0.15rem;
        }

        /* Buttons */
        .step-actions {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          margin-top: 1rem;
        }

        .btn-continue, .btn-view-results {
          background: #00AB96;
          color: #FFFFFF;
          border: none;
          padding: 0.875rem 1.75rem;
          font-size: 1rem;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-left: auto;
        }

        .btn-continue:hover, .btn-view-results:hover {
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

        /* RESULTS STYLES */
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

        .covered-status-card {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid #10B981;
          border-radius: 10px;
          padding: 1rem 1.25rem;
          max-width: 600px;
          margin: 0 auto;
          text-align: left;
        }

        .status-icon {
          font-size: 1.5rem;
        }

        .status-text {
          font-size: 0.85rem;
          color: #E2E8F0;
          line-height: 1.4;
          margin: 0;
        }

        .hero-disclaimer-note {
          font-size: 0.9rem;
          color: #CBD5E1;
          max-width: 640px;
          margin: 0 auto;
          line-height: 1.55;
        }

        /* 3-Component Grid */
        .section-breakdown-box {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 2rem;
        }

        .section-subtitle {
          font-family: 'Outfit', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: #00182A;
          margin: 0 0 1.25rem 0;
        }

        .components-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .component-card {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .comp-icon { font-size: 1.25rem; }
        .comp-tag {
          font-size: 0.7rem;
          font-weight: 700;
          background: #E2E8F0;
          color: #475569;
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
        }

        .comp-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: #00182A;
          margin-bottom: 0.5rem;
        }

        .comp-amount {
          font-family: 'Outfit', sans-serif;
          font-size: 1.4rem;
          font-weight: 800;
          color: #00182A;
        }

        .comp-exact {
          font-size: 0.75rem;
          color: #64748B;
          margin-bottom: 0.5rem;
        }

        .comp-desc {
          font-size: 0.75rem;
          color: #64748B;
          line-height: 1.35;
          margin: auto 0 0 0;
        }

        .total-req-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #00182A;
          color: #FFFFFF;
          border-radius: 10px;
          padding: 1.25rem 1.5rem;
        }

        .total-req-label {
          font-size: 0.875rem;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .total-req-val {
          font-family: 'Outfit', sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          color: #00AB96;
        }

        /* Visual Comparison Card */
        .visual-comparison-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 2rem;
        }

        .comparison-row {
          display: flex;
          justify-content: space-around;
          align-items: center;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .stat-label {
          display: block;
          font-size: 0.8rem;
          color: #64748B;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .stat-val {
          font-family: 'Outfit', sans-serif;
          font-size: 1.6rem;
          font-weight: 800;
          color: #00182A;
        }

        .text-teal { color: #00AB96; }
        .text-gold { color: #D97706; }

        .comp-divider {
          font-size: 1.25rem;
          font-weight: 700;
          color: #CBD5E1;
        }

        .progress-track-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .progress-bar-bg {
          height: 16px;
          background: #FEF3C7;
          border-radius: 9999px;
          overflow: hidden;
        }

        .progress-fill-resources {
          height: 100%;
          background: #00AB96;
          border-radius: 9999px;
          transition: width 0.4s ease;
        }

        .progress-legend {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          font-size: 0.75rem;
          color: #475569;
          font-weight: 600;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .dot-teal { background: #00AB96; }
        .dot-gold { background: #F59E0B; }

        /* Accordion Card */
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
          padding: 1.25rem 1.5rem;
          background: #F8FAFC;
          border: none;
          cursor: pointer;
          font-size: 0.95rem;
          color: #00182A;
          text-align: left;
        }

        .toggle-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .accordion-content {
          padding: 1.5rem;
          border-top: 1px solid #E2E8F0;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .formula-step-block h4 {
          font-size: 0.875rem;
          font-weight: 700;
          color: #00182A;
          margin: 0 0 0.4rem 0;
        }

        .formula-step-block code {
          display: block;
          background: #F1F5F9;
          padding: 0.6rem 0.85rem;
          border-radius: 6px;
          font-size: 0.8rem;
          color: #0F172A;
          word-break: break-word;
        }

        .formula-step-block ul {
          padding-left: 1.25rem;
          margin: 0;
          font-size: 0.825rem;
          color: #334155;
          line-height: 1.6;
        }

        .action-row-inside {
          margin-top: 0.5rem;
        }

        .btn-edit-assumptions {
          background: #00182A;
          color: #FFFFFF;
          border: none;
          padding: 0.5rem 1rem;
          font-size: 0.8rem;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
        }

        /* Results Consultation CTA */
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

        /* Responsive Layout Adjustments */
        @media (max-width: 840px) {
          .stepper-list {
            grid-template-columns: repeat(3, 1fr);
          }
          .components-grid {
            grid-template-columns: 1fr;
          }
          .inputs-grid {
            grid-template-columns: 1fr;
          }
          .assumptions-grid {
            grid-template-columns: 1fr;
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
          .rate-journey-track {
            flex-direction: column;
            gap: 0.75rem;
          }
          .journey-arrow {
            transform: rotate(90deg);
          }
          .comparison-row {
            flex-direction: column;
            gap: 0.75rem;
          }
          .comp-divider {
            display: none;
          }
          .cta-btn-row {
            flex-direction: column;
          }
          .step-actions {
            flex-direction: column-reverse;
          }
          .btn-continue, .btn-view-results {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
