import React, { useState, useMemo, useEffect } from 'react';
import {
  calculateLoanSIPRecoveryPlan,
  formatIndianCurrency,
  formatLakhsCrores,
  formatPercentage,
  formatYearsAndMonths,
  type LoanSIPRecoveryInputs,
  type LoanSIPRecoveryResult
} from '../../utils/calculations/loanSipRecoveryPlanner';

const LOAN_TYPES = [
  'Home Loan',
  'Personal Loan',
  'Vehicle Loan',
  'Education Loan',
  'Business Loan',
  'Other Loan'
];

export default function LoanSIPRecoveryPlanner() {
  // Stepper state (1: Loan Details, 2: Recovery Targets, 3: Custom SIP, 4: Results)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form Inputs
  const [loanType, setLoanType] = useState<string>('Home Loan');
  const [loanAmount, setLoanAmount] = useState<number>(5000000);
  const [annualLoanInterestRate, setAnnualLoanInterestRate] = useState<number>(9.0);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(20);
  const [loanStartDate, setLoanStartDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // SIP controls
  const [sipDurationYears, setSipDurationYears] = useState<number>(20);
  const [isReturnManuallyOverridden, setIsReturnManuallyOverridden] = useState<boolean>(false);
  const [sipReturnRate, setSipReturnRate] = useState<number>(12.0);
  const [customSipAmount, setCustomSipAmount] = useState<number>(9000);

  // UI helpers
  const [isMathOpen, setIsMathOpen] = useState<boolean>(false);
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Update default SIP duration when loan tenure changes (if user hasn't explicitly diverged)
  useEffect(() => {
    setSipDurationYears(loanTenureYears);
  }, [loanTenureYears]);

  // Adaptive Default Return Logic:
  // <= 10 years -> 10%, > 10 years -> 12% (unless user manually touched return)
  useEffect(() => {
    if (!isReturnManuallyOverridden) {
      if (sipDurationYears <= 10) {
        setSipReturnRate(10.0);
      } else {
        setSipReturnRate(12.0);
      }
    }
  }, [sipDurationYears, isReturnManuallyOverridden]);

  // Ensure custom SIP defaults to reasonable 20% of EMI on loan changes
  const baseInputs = useMemo<LoanSIPRecoveryInputs>(() => ({
    loanType,
    loanAmount,
    annualLoanInterestRate,
    loanTenureYears,
    loanStartDate,
    sipDurationYears,
    sipReturnRate,
    customSipAmount
  }), [
    loanType,
    loanAmount,
    annualLoanInterestRate,
    loanTenureYears,
    loanStartDate,
    sipDurationYears,
    sipReturnRate,
    customSipAmount
  ]);

  const plan: LoanSIPRecoveryResult = useMemo(() => {
    return calculateLoanSIPRecoveryPlan(baseInputs);
  }, [baseInputs]);

  // Handlers
  const handleReturnRateChange = (newVal: number) => {
    setIsReturnManuallyOverridden(true);
    setSipReturnRate(newVal);
  };

  const handleReset = () => {
    setLoanType('Home Loan');
    setLoanAmount(5000000);
    setAnnualLoanInterestRate(9.0);
    setLoanTenureYears(20);
    setLoanStartDate(new Date().toISOString().split('T')[0]);
    setSipDurationYears(20);
    setIsReturnManuallyOverridden(false);
    setSipReturnRate(12.0);
    setCustomSipAmount(9000);
    setCurrentStep(1);
    setHoveredPointIndex(null);
  };

  const handleSampleScenario = () => {
    setLoanType('Home Loan');
    setLoanAmount(5000000);
    setAnnualLoanInterestRate(9.0);
    setLoanTenureYears(20);
    setSipDurationYears(20);
    setIsReturnManuallyOverridden(false);
    setSipReturnRate(12.0);
    setCustomSipAmount(9000);
    setCurrentStep(4);
    setHoveredPointIndex(null);
  };

  const handleHigherSIPScenario = () => {
    setLoanType('Home Loan');
    setLoanAmount(5000000);
    setAnnualLoanInterestRate(9.0);
    setLoanTenureYears(20);
    setSipDurationYears(20);
    setIsReturnManuallyOverridden(false);
    setSipReturnRate(12.0);
    setCustomSipAmount(15000);
    setCurrentStep(4);
    setHoveredPointIndex(null);
  };

  // WhatsApp Advisory Bridge generator
  const getWhatsAppHref = () => {
    const interestDur = plan.customInterestMilestone.formattedDuration;
    const completeDur = plan.customCompleteLoanMilestone.formattedDuration;
    const msg = `Hi Santhosh, I was planning my loan on Ant Wealth Loan + SIP Recovery Planner:
• Loan Type: ${plan.loanDetails.loanType}
• Loan Amount: ${formatIndianCurrency(plan.loanDetails.loanAmount)} (${plan.loanDetails.annualLoanInterestRate}% for ${plan.loanDetails.loanTenureYears} yrs)
• Monthly EMI: ${formatIndianCurrency(plan.loanDetails.emi)}/mo
• Total Interest: ${formatLakhsCrores(plan.loanDetails.totalInterest)}
• Complete Loan Cost: ${formatLakhsCrores(plan.loanDetails.totalScheduledRepayment)}
• My Monthly SIP: ${formatIndianCurrency(plan.customSipAmount)}/mo (${plan.customSipPercentageOfEMI.toFixed(1)}% of EMI @ ${plan.sipReturnRate}% p.a.)
• Potential Interest Recovery: ${interestDur}
• Potential Complete Cost Recovery: ${completeDur}

Could you help me structure a tailored mutual fund portfolio to execute this recovery plan?`;

    return `https://wa.me/918087971566?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="planner-container">
      {/* 4-Step Progress Navigation Header */}
      <div className="stepper-nav" role="tablist" aria-label="Planner Progress Steps">
        {[
          { step: 1, label: 'Your Loan' },
          { step: 2, label: 'Recovery Targets' },
          { step: 3, label: 'Your SIP' },
          { step: 4, label: 'Potential Recovery' }
        ].map(({ step, label }) => {
          const isActive = currentStep === step;
          const isCompleted = currentStep > step;
          return (
            <button
              key={step}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`step-btn ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              onClick={() => setCurrentStep(step)}
            >
              <span className="step-circle">{isCompleted ? '✓' : step}</span>
              <span className="step-label">{label}</span>
            </button>
          );
        })}
      </div>

      {/* STEP 1: YOUR LOAN DETAILS */}
      {currentStep === 1 && (
        <div className="step-card">
          <div className="step-header">
            <span className="step-badge">Step 1 of 4</span>
            <h2 className="step-title">Your Loan Details</h2>
            <p className="step-subtitle">
              Let&apos;s understand what your loan is costing you over its full tenure.
            </p>
          </div>

          <div className="form-grid">
            {/* Loan Type */}
            <div className="form-group full-width">
              <label htmlFor="loan-type" className="input-label">
                Loan Category
              </label>
              <select
                id="loan-type"
                className="select-input"
                value={loanType}
                onChange={(e) => setLoanType(e.target.value)}
              >
                {LOAN_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <span className="helper-text">Contextual label for your personalized report.</span>
            </div>

            {/* Loan Amount */}
            <div className="form-group full-width">
              <div className="label-row">
                <label htmlFor="loan-amount-slider" className="input-label">
                  Loan Principal Amount
                </label>
                <div className="amount-input-wrapper">
                  <span className="currency-prefix">₹</span>
                  <input
                    type="number"
                    id="loan-amount-number"
                    aria-label="Loan Principal Amount in Rupees"
                    className="amount-input"
                    value={loanAmount}
                    min={100000}
                    max={20000000}
                    step={50000}
                    onChange={(e) => setLoanAmount(Number(e.target.value) || 0)}
                  />
                </div>
              </div>
              <input
                type="range"
                id="loan-amount-slider"
                aria-label="Loan Principal Amount Range Slider"
                className="range-slider"
                min={100000}
                max={20000000}
                step={50000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
              />
              <div className="range-hints">
                <span>₹1 Lakh</span>
                <span className="range-current">{formatLakhsCrores(loanAmount)}</span>
                <span>₹2 Crore</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="form-group">
              <div className="label-row">
                <label htmlFor="loan-rate-slider" className="input-label">
                  Annual Interest Rate
                </label>
                <span className="pill-badge">{annualLoanInterestRate.toFixed(1)}% p.a.</span>
              </div>
              <input
                type="range"
                id="loan-rate-slider"
                aria-label="Annual Loan Interest Rate Range Slider"
                className="range-slider"
                min={5.0}
                max={20.0}
                step={0.1}
                value={annualLoanInterestRate}
                onChange={(e) => setAnnualLoanInterestRate(Number(e.target.value))}
              />
              <div className="range-hints">
                <span>5.0%</span>
                <span>20.0%</span>
              </div>
            </div>

            {/* Loan Tenure */}
            <div className="form-group">
              <div className="label-row">
                <label htmlFor="loan-tenure-slider" className="input-label">
                  Loan Tenure
                </label>
                <span className="pill-badge">{loanTenureYears} Years</span>
              </div>
              <input
                type="range"
                id="loan-tenure-slider"
                aria-label="Loan Tenure in Years Range Slider"
                className="range-slider"
                min={1}
                max={30}
                step={1}
                value={loanTenureYears}
                onChange={(e) => setLoanTenureYears(Number(e.target.value))}
              />
              <div className="range-hints">
                <span>1 Year</span>
                <span>30 Years</span>
              </div>
            </div>

            {/* Loan Start Date */}
            <div className="form-group full-width">
              <label htmlFor="loan-start-date" className="input-label">
                Loan Start Date
              </label>
              <input
                type="date"
                id="loan-start-date"
                className="date-input"
                value={loanStartDate}
                onChange={(e) => setLoanStartDate(e.target.value)}
              />
            </div>
          </div>

          {/* Live Loan Preview Card */}
          <div className="live-preview-box">
            <div className="preview-item">
              <span className="preview-label">Loan Principal</span>
              <span className="preview-value">{formatLakhsCrores(plan.loanDetails.loanAmount)}</span>
              <span className="preview-subtext">{plan.loanDetails.loanTenureYears} Years @ {plan.loanDetails.annualLoanInterestRate}%</span>
            </div>
            <div className="preview-divider" />
            <div className="preview-item">
              <span className="preview-label">Your Monthly EMI</span>
              <span className="preview-value emi-highlight">
                {formatIndianCurrency(plan.loanDetails.emi)}
                <small className="per-month">/mo</small>
              </span>
              <span className="preview-subtext">{plan.loanDetails.loanTenureMonths} monthly payments</span>
            </div>
            <div className="preview-divider" />
            <div className="preview-item">
              <span className="preview-label">Total Loan Interest</span>
              <span className="preview-value interest-highlight">
                {formatLakhsCrores(plan.loanDetails.totalInterest)}
              </span>
              <span className="preview-subtext">
                {(plan.loanDetails.interestToPrincipalRatio * 100).toFixed(0)}% of principal
              </span>
            </div>
            <div className="preview-divider" />
            <div className="preview-item">
              <span className="preview-label">Total Loan Repayment</span>
              <span className="preview-value total-repayment-highlight">
                {formatLakhsCrores(plan.loanDetails.totalScheduledRepayment)}
              </span>
              <span className="preview-subtext">Principal + Interest</span>
            </div>
          </div>

          {/* CTA Next */}
          <div className="step-actions">
            <button
              type="button"
              className="btn-primary"
              onClick={() => setCurrentStep(2)}
            >
              Continue to Recovery Targets →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: RECOVERY TARGETS (Key Educational Step) */}
      {currentStep === 2 && (
        <div className="step-card">
          <div className="step-header">
            <span className="step-badge">Step 2 of 4</span>
            <h2 className="step-title">How much could your SIP potentially recover?</h2>
            <p className="step-subtitle">
              Your EMI pays off the loan contract. A parallel SIP puts compounding to work to build an offsetting wealth corpus over your {plan.sipDurationYears}-year investment horizon.
            </p>
          </div>

          {/* User-Editable SIP Return Assumption Panel */}
          <div className="return-assumption-panel">
            <div className="panel-header">
              <span className="panel-badge">RETURN ASSUMPTION</span>
              <h3 className="panel-title">What return should we assume for your SIP?</h3>
              <p className="panel-subtitle">
                Choose an illustrative annual return to see how the required SIP changes. Actual investment returns may vary.
              </p>
            </div>

            <div className="return-control-card">
              <div className="return-input-row">
                <label htmlFor="step2-return-slider" className="return-label">
                  Expected Annual SIP Return
                </label>
                <div className="return-input-wrapper">
                  <input
                    type="number"
                    id="step2-return-number"
                    aria-label="Expected Annual SIP Return Percentage"
                    className="return-number-input"
                    value={sipReturnRate}
                    min={6.0}
                    max={18.0}
                    step={1.0}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (!isNaN(val)) {
                        handleReturnRateChange(Math.max(6, Math.min(18, val)));
                      }
                    }}
                  />
                  <span className="percent-suffix">%</span>
                </div>
              </div>

              <input
                type="range"
                id="step2-return-slider"
                aria-label="Expected Annual SIP Return Range Slider"
                aria-valuemin={6}
                aria-valuemax={18}
                aria-valuenow={sipReturnRate}
                className="range-slider return-slider-accent"
                min={6.0}
                max={18.0}
                step={1.0}
                value={sipReturnRate}
                onChange={(e) => handleReturnRateChange(Number(e.target.value))}
              />

              <div className="range-hints">
                <span>6%</span>
                <span className="current-return-badge">{sipReturnRate}% p.a.</span>
                <span>18%</span>
              </div>

              <div className="return-horizon-note">
                <span className="horizon-tag">Investment Horizon: <strong>{plan.sipDurationYears} Years</strong></span>
                <span className="default-horizon-text">(Default horizon: same as your loan tenure)</span>
                <span className="effective-rate-tag">Effective Monthly Compounding: <strong>{(plan.effectiveMonthlySIPRate * 100).toFixed(4)}%/mo</strong></span>
              </div>

              {/* Dynamic Educational Impact Insight */}
              <div className="return-impact-insight">
                <div className="insight-icon">💡</div>
                <div className="insight-text">
                  <strong>Illustration: Required SIP is sensitive to the return assumption.</strong>
                  <p>
                    At <strong>{sipReturnRate}%</strong> assumed return, you would need approximately <strong>{formatIndianCurrency(plan.completeLoanRecovery.requiredMonthlySIP)}/month</strong> to potentially build a corpus equal to your complete loan repayment over {plan.sipDurationYears} years.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Two Large Visual Cards */}
          <div className="targets-grid">
            {/* Card 1: Interest Recovery */}
            <div className="target-card card-interest">
              <div className="target-eyebrow">TARGET 1</div>
              <h3 className="target-heading">Potentially Offset Loan Interest</h3>
              <div className="target-amount">{formatLakhsCrores(plan.loanDetails.totalInterest)}</div>
              <p className="target-desc">
                Total interest payable over your {plan.loanDetails.loanTenureYears}-year loan tenure.
              </p>

              <div className="target-metric-box">
                <div className="metric-row">
                  <span className="metric-title">Assumed SIP Return</span>
                  <span className="metric-val return-val-highlight">{plan.sipReturnRate}% p.a.</span>
                </div>
                <div className="metric-row">
                  <span className="metric-title">Estimated SIP Required</span>
                  <span className="metric-val">{formatIndianCurrency(plan.interestRecovery.requiredMonthlySIP)}/month</span>
                </div>
                <div className="metric-row">
                  <span className="metric-title">% of Monthly EMI</span>
                  <span className="metric-val percent-badge">
                    {plan.interestRecovery.sipPercentageOfEMI.toFixed(1)}% of EMI
                  </span>
                </div>
                <div className="metric-row">
                  <span className="metric-title">Investment Horizon</span>
                  <span className="metric-val">{plan.sipDurationYears} Years</span>
                </div>
                <div className="metric-row">
                  <span className="metric-title">Potential Corpus at Horizon</span>
                  <span className="metric-val">{formatLakhsCrores(plan.interestRecovery.projectedCorpus)}</span>
                </div>
              </div>

              {/* Visual Proportion Bar */}
              <div className="proportion-track-wrapper">
                <div className="proportion-label">
                  <span>Monthly EMI ({formatIndianCurrency(plan.loanDetails.emi)})</span>
                  <span>Required SIP ({formatIndianCurrency(plan.interestRecovery.requiredMonthlySIP)})</span>
                </div>
                <div className="proportion-bar-bg">
                  <div
                    className="proportion-bar-fill interest-fill"
                    style={{ width: `${Math.min(100, Math.max(8, plan.interestRecovery.sipPercentageOfEMI))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Complete Loan Cost Recovery */}
            <div className="target-card card-complete">
              <div className="target-eyebrow">TARGET 2</div>
              <h3 className="target-heading">Potentially Offset Complete Loan Cost</h3>
              <div className="target-amount">{formatLakhsCrores(plan.loanDetails.totalScheduledRepayment)}</div>
              
              {/* Breakdown formula */}
              <div className="cost-breakdown-row">
                <span className="cost-tag">Principal: {formatLakhsCrores(plan.loanDetails.loanAmount)}</span>
                <span className="math-plus">+</span>
                <span className="cost-tag">Interest: {formatLakhsCrores(plan.loanDetails.totalInterest)}</span>
                <span className="math-plus">=</span>
                <span className="cost-tag highlight-tag">Total Repayment: {formatLakhsCrores(plan.loanDetails.totalScheduledRepayment)}</span>
              </div>

              <div className="target-metric-box">
                <div className="metric-row">
                  <span className="metric-title">Assumed SIP Return</span>
                  <span className="metric-val return-val-highlight">{plan.sipReturnRate}% p.a.</span>
                </div>
                <div className="metric-row">
                  <span className="metric-title">Estimated SIP Required</span>
                  <span className="metric-val">{formatIndianCurrency(plan.completeLoanRecovery.requiredMonthlySIP)}/month</span>
                </div>
                <div className="metric-row">
                  <span className="metric-title">% of Monthly EMI</span>
                  <span className="metric-val percent-badge teal-badge">
                    {plan.completeLoanRecovery.sipPercentageOfEMI.toFixed(1)}% of EMI
                  </span>
                </div>
                <div className="metric-row">
                  <span className="metric-title">Investment Horizon</span>
                  <span className="metric-val">{plan.sipDurationYears} Years</span>
                </div>
                <div className="metric-row">
                  <span className="metric-title">Potential Corpus at Horizon</span>
                  <span className="metric-val">{formatLakhsCrores(plan.completeLoanRecovery.projectedCorpus)}</span>
                </div>
              </div>

              {/* Visual Proportion Bar */}
              <div className="proportion-track-wrapper">
                <div className="proportion-label">
                  <span>Monthly EMI ({formatIndianCurrency(plan.loanDetails.emi)})</span>
                  <span>Required SIP ({formatIndianCurrency(plan.completeLoanRecovery.requiredMonthlySIP)})</span>
                </div>
                <div className="proportion-bar-bg">
                  <div
                    className="proportion-bar-fill complete-fill"
                    style={{ width: `${Math.min(100, Math.max(8, plan.completeLoanRecovery.sipPercentageOfEMI))}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Visual Flow Graphic */}
          <div className="opportunity-flow">
            <div className="flow-step">
              <div className="flow-num">1</div>
              <div className="flow-text">
                <strong>Loan Principal</strong>
                <span>{formatLakhsCrores(plan.loanDetails.loanAmount)}</span>
              </div>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="flow-num">2</div>
              <div className="flow-text">
                <strong>Monthly EMI</strong>
                <span>{formatIndianCurrency(plan.loanDetails.emi)}/mo</span>
              </div>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step highlight-step">
              <div className="flow-num">3</div>
              <div className="flow-text">
                <strong>Invest Alongside EMI</strong>
                <span>{plan.interestRecovery.sipPercentageOfEMI.toFixed(0)}%–{plan.completeLoanRecovery.sipPercentageOfEMI.toFixed(0)}% of EMI</span>
              </div>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step complete-step">
              <div className="flow-num">4</div>
              <div className="flow-text">
                <strong>Potential Wealth Created</strong>
                <span>Offsets Complete Loan Cost</span>
              </div>
            </div>
          </div>

          {/* Step Actions */}
          <div className="step-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setCurrentStep(1)}
            >
              ← Back to Loan Details
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => setCurrentStep(3)}
            >
              Customize Your SIP Amount →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CUSTOM SIP AMOUNT */}
      {currentStep === 3 && (
        <div className="step-card">
          <div className="step-header">
            <span className="step-badge">Step 3 of 4</span>
            <h2 className="step-title">What can you invest every month?</h2>
            <p className="step-subtitle">
              Even a small amount alongside your regular EMI can potentially build significant wealth through long-term compounding.
            </p>
          </div>

          <div className="form-grid">
            {/* Monthly SIP Amount Slider & Input */}
            <div className="form-group full-width">
              <div className="label-row">
                <label htmlFor="custom-sip-slider" className="input-label">
                  Your Monthly SIP Investment
                </label>
                <div className="amount-input-wrapper">
                  <span className="currency-prefix">₹</span>
                  <input
                    type="number"
                    id="custom-sip-number"
                    aria-label="Monthly SIP Amount in Rupees"
                    className="amount-input"
                    value={customSipAmount}
                    min={1000}
                    max={100000}
                    step={500}
                    onChange={(e) => setCustomSipAmount(Number(e.target.value) || 0)}
                  />
                </div>
              </div>
              <input
                type="range"
                id="custom-sip-slider"
                aria-label="Monthly SIP Amount Range Slider"
                className="range-slider"
                min={1000}
                max={100000}
                step={500}
                value={customSipAmount}
                onChange={(e) => setCustomSipAmount(Number(e.target.value))}
              />
              <div className="range-hints">
                <span>₹1,000</span>
                <span className="range-current">{formatIndianCurrency(customSipAmount)}/mo</span>
                <span>₹1,00,000</span>
              </div>

              {/* Dynamic Percentage of EMI Badge */}
              <div className="sip-pct-badge-wrapper">
                <span className="sip-pct-badge">
                  {formatIndianCurrency(customSipAmount)} is <strong>{plan.customSipPercentageOfEMI.toFixed(1)}%</strong> of your monthly EMI ({formatIndianCurrency(plan.loanDetails.emi)})
                </span>
              </div>
            </div>

            {/* Expected SIP Return Assumption */}
            <div className="form-group">
              <div className="label-row">
                <label htmlFor="sip-return-slider" className="input-label">
                  Illustrative Annual SIP Return
                </label>
                <span className="pill-badge">{sipReturnRate.toFixed(1)}% p.a.</span>
              </div>
              <input
                type="range"
                id="sip-return-slider"
                aria-label="Illustrative Annual SIP Return Slider"
                className="range-slider"
                min={6.0}
                max={18.0}
                step={0.5}
                value={sipReturnRate}
                onChange={(e) => handleReturnRateChange(Number(e.target.value))}
              />
              <div className="range-hints">
                <span>6.0%</span>
                <span>18.0%</span>
              </div>
              <span className="helper-text">
                Effective monthly compounding: {(plan.effectiveMonthlySIPRate * 100).toFixed(4)}%/mo.
              </span>
            </div>

            {/* SIP Duration */}
            <div className="form-group">
              <div className="label-row">
                <label htmlFor="sip-duration-slider" className="input-label">
                  SIP Investment Horizon
                </label>
                <span className="pill-badge">{sipDurationYears} Years</span>
              </div>
              <input
                type="range"
                id="sip-duration-slider"
                aria-label="SIP Investment Horizon Slider"
                className="range-slider"
                min={5}
                max={30}
                step={1}
                value={sipDurationYears}
                onChange={(e) => setSipDurationYears(Number(e.target.value))}
              />
              <div className="range-hints">
                <span>5 Years</span>
                <span>30 Years</span>
              </div>
              <span className="helper-text">
                Defaults to your loan tenure ({plan.loanDetails.loanTenureYears}y).
              </span>
            </div>
          </div>

          {/* Quick Snapshot Card */}
          <div className="custom-snapshot-card">
            <div className="snapshot-item">
              <span className="snapshot-label">Interest Offset Milestone</span>
              <span className="snapshot-val">
                {plan.customInterestMilestone.isReached
                  ? `Reached in ${plan.customInterestMilestone.formattedDuration}`
                  : 'Not reached in 50y'}
              </span>
            </div>
            <div className="snapshot-divider" />
            <div className="snapshot-item">
              <span className="snapshot-label">Complete Loan Cost Milestone</span>
              <span className="snapshot-val highlight-val">
                {plan.customCompleteLoanMilestone.isReached
                  ? `Reached in ${plan.customCompleteLoanMilestone.formattedDuration}`
                  : 'Not reached in 50y'}
              </span>
            </div>
          </div>

          {/* Step Actions */}
          <div className="step-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setCurrentStep(2)}
            >
              ← Back to Targets
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => setCurrentStep(4)}
            >
              View Full Potential Recovery →
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: POTENTIAL RECOVERY (Results Dashboard) */}
      {currentStep === 4 && (
        <div className="step-card results-dashboard">
          {/* Hero Navy Card */}
          <div className="hero-card">
            <div className="hero-eyebrow">YOUR LOAN + SIP PLAN</div>
            <h2 className="hero-title">
              Turn a manageable monthly investment into a potential loan recovery strategy.
            </h2>

            {/* Primary Outcome Callout */}
            <div className="primary-outcome-box">
              <span className="outcome-eyebrow">POTENTIAL COMPLETE LOAN COST RECOVERY</span>
              <div className="outcome-duration">
                {plan.customCompleteLoanMilestone.isReached ? (
                  <>
                    Estimated in{' '}
                    <span className="duration-highlight">
                      {plan.customCompleteLoanMilestone.formattedDuration}
                    </span>
                  </>
                ) : (
                  <span className="duration-highlight">Exceeds 50-Year Horizon</span>
                )}
              </div>
              <p className="outcome-detail">
                With a monthly SIP of <strong>{formatIndianCurrency(plan.customSipAmount)}</strong> ({plan.customSipPercentageOfEMI.toFixed(1)}% of your EMI) at an assumed {plan.sipReturnRate}% return.
              </p>
            </div>

            {/* Narrative Timeline Banner */}
            <div className={`timeline-banner banner-${plan.customCompleteLoanMilestone.comparisonStatus}`}>
              <div className="banner-icon">
                {plan.customCompleteLoanMilestone.comparisonStatus === 'early' && '🎯'}
                {plan.customCompleteLoanMilestone.comparisonStatus === 'late' && '⏳'}
                {plan.customCompleteLoanMilestone.comparisonStatus === 'exact' && '✨'}
                {plan.customCompleteLoanMilestone.comparisonStatus === 'unreached' && 'ℹ️'}
              </div>
              <div className="banner-content">
                <strong>
                  {plan.customCompleteLoanMilestone.comparisonStatus === 'early' && 'Potential Early Recovery Horizon'}
                  {plan.customCompleteLoanMilestone.comparisonStatus === 'late' && 'Recovery Horizon vs Loan Tenure'}
                  {plan.customCompleteLoanMilestone.comparisonStatus === 'exact' && 'Target Matched at Maturity'}
                  {plan.customCompleteLoanMilestone.comparisonStatus === 'unreached' && 'Adjustment Recommended'}
                </strong>
                <p>{plan.customCompleteLoanMilestone.comparisonNarrative}</p>
              </div>
            </div>

            {/* 4-Metric Grid */}
            <div className="metric-quad-grid">
              <div className="quad-item">
                <span className="quad-label">Loan Principal</span>
                <span className="quad-val">{formatLakhsCrores(plan.loanDetails.loanAmount)}</span>
                <span className="quad-sub">{plan.loanDetails.loanTenureYears} Years</span>
              </div>
              <div className="quad-item">
                <span className="quad-label">Monthly EMI</span>
                <span className="quad-val">{formatIndianCurrency(plan.loanDetails.emi)}</span>
                <span className="quad-sub">Monthly Outflow</span>
              </div>
              <div className="quad-item">
                <span className="quad-label">Total Loan Interest</span>
                <span className="quad-val">{formatLakhsCrores(plan.loanDetails.totalInterest)}</span>
                <span className="quad-sub">Total Interest Paid</span>
              </div>
              <div className="quad-item">
                <span className="quad-label">Total Loan Repayment</span>
                <span className="quad-val teal-text">
                  {formatLakhsCrores(plan.loanDetails.totalScheduledRepayment)}
                </span>
                <span className="quad-sub">Principal + Interest</span>
              </div>
            </div>

            {/* Assumptions Strip */}
            <div className="hero-assumptions-strip">
              <span className="assumption-pill">
                Assumed SIP Return: <strong>{plan.sipReturnRate}% p.a.</strong>
              </span>
              <span className="assumption-pill">
                Investment Horizon: <strong>{plan.sipDurationYears} Years</strong>
              </span>
              <span className="assumption-pill">
                Effective Monthly Compounding: <strong>{(plan.effectiveMonthlySIPRate * 100).toFixed(4)}%/mo</strong>
              </span>
            </div>
          </div>

          {/* Two Milestone Summary Cards */}
          <div className="milestones-row">
            <div className="milestone-box box-interest">
              <div className="milestone-badge">TARGET 1</div>
              <h3 className="milestone-title">Potentially Offset Loan Interest</h3>
              <div className="milestone-target">{formatLakhsCrores(plan.loanDetails.totalInterest)}</div>
              
              <div className="milestone-details-grid">
                <div className="milestone-detail-item">
                  <span className="detail-label">Assumed Return:</span>
                  <span className="detail-val return-highlight">{plan.sipReturnRate}% p.a.</span>
                </div>
                <div className="milestone-detail-item">
                  <span className="detail-label">Required SIP:</span>
                  <span className="detail-val">{formatIndianCurrency(plan.interestRecovery.requiredMonthlySIP)}/mo</span>
                </div>
                <div className="milestone-detail-item">
                  <span className="detail-label">% of EMI:</span>
                  <span className="detail-val">{plan.interestRecovery.sipPercentageOfEMI.toFixed(1)}%</span>
                </div>
                <div className="milestone-detail-item">
                  <span className="detail-label">Investment Period:</span>
                  <span className="detail-val">{plan.sipDurationYears} Years</span>
                </div>
                <div className="milestone-detail-item">
                  <span className="detail-label">Value at Horizon:</span>
                  <span className="detail-val">{formatLakhsCrores(plan.interestRecovery.projectedCorpus)}</span>
                </div>
              </div>

              <div className="milestone-time">
                {plan.customInterestMilestone.isReached ? (
                  <>
                    With your {formatIndianCurrency(plan.customSipAmount)}/mo SIP: reached in <strong>{plan.customInterestMilestone.formattedDuration}</strong>
                  </>
                ) : (
                  'Not reached within projection period'
                )}
              </div>
              <p className="milestone-note">
                Your cumulative SIP investments + compounding growth equal the total interest charged by the bank.
              </p>
            </div>

            <div className="milestone-box box-complete">
              <div className="milestone-badge teal-badge">TARGET 2</div>
              <h3 className="milestone-title">Potentially Offset Complete Loan Cost</h3>
              <div className="milestone-target">{formatLakhsCrores(plan.loanDetails.totalScheduledRepayment)}</div>

              <div className="milestone-details-grid">
                <div className="milestone-detail-item">
                  <span className="detail-label">Assumed Return:</span>
                  <span className="detail-val return-highlight">{plan.sipReturnRate}% p.a.</span>
                </div>
                <div className="milestone-detail-item">
                  <span className="detail-label">Required SIP:</span>
                  <span className="detail-val">{formatIndianCurrency(plan.completeLoanRecovery.requiredMonthlySIP)}/mo</span>
                </div>
                <div className="milestone-detail-item">
                  <span className="detail-label">% of EMI:</span>
                  <span className="detail-val">{plan.completeLoanRecovery.sipPercentageOfEMI.toFixed(1)}%</span>
                </div>
                <div className="milestone-detail-item">
                  <span className="detail-label">Investment Period:</span>
                  <span className="detail-val">{plan.sipDurationYears} Years</span>
                </div>
                <div className="milestone-detail-item">
                  <span className="detail-label">Value at Horizon:</span>
                  <span className="detail-val">{formatLakhsCrores(plan.completeLoanRecovery.projectedCorpus)}</span>
                </div>
              </div>

              <div className="milestone-time">
                {plan.customCompleteLoanMilestone.isReached ? (
                  <>
                    With your {formatIndianCurrency(plan.customSipAmount)}/mo SIP: reached in <strong>{plan.customCompleteLoanMilestone.formattedDuration}</strong>
                  </>
                ) : (
                  'Not reached within projection period'
                )}
              </div>
              <p className="milestone-note">
                Your SIP corpus equals the entire amount paid to the lender (100% of Principal + 100% of Total Interest).
              </p>
            </div>
          </div>

          {/* Interactive SVG Chart: Dual Target Lines & Exponential SIP Growth */}
          <div className="chart-section">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">SIP Wealth Accumulation vs Loan Cost Targets</h3>
                <p className="chart-subtitle">
                  Watch how beginning-of-month compounding builds wealth over time to cross both loan recovery thresholds.
                </p>
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-swatch sip-swatch" />
                  <span>Estimated SIP Corpus</span>
                </div>
                <div className="legend-item">
                  <span className="legend-swatch interest-line-swatch" />
                  <span>Interest Target ({formatLakhsCrores(plan.loanDetails.totalInterest)})</span>
                </div>
                <div className="legend-item">
                  <span className="legend-swatch complete-line-swatch" />
                  <span>Complete Cost Target ({formatLakhsCrores(plan.loanDetails.totalScheduledRepayment)})</span>
                </div>
                <div className="legend-item">
                  <span className="legend-swatch maturity-swatch" />
                  <span>Loan Maturity ({plan.loanDetails.loanTenureYears}y)</span>
                </div>
              </div>
            </div>

            {/* SVG Canvas */}
            <div className="svg-container">
              {(() => {
                const totalMonths = Math.min(360, plan.projection.length);
                const displayRows = plan.projection.slice(0, totalMonths);
                const maxVal = Math.max(
                  plan.loanDetails.totalScheduledRepayment * 1.15,
                  displayRows[displayRows.length - 1]?.sipCorpus || 1
                );

                const width = 800;
                const height = 340;
                const padding = { top: 30, right: 30, bottom: 40, left: 70 };
                const plotW = width - padding.left - padding.right;
                const plotH = height - padding.top - padding.bottom;

                const getX = (m: number) => padding.left + (m / totalMonths) * plotW;
                const getY = (val: number) => padding.top + plotH - (val / maxVal) * plotH;

                // Points for SIP corpus curve
                const sipPoints = displayRows.map((r) => `${getX(r.monthNumber)},${getY(r.sipCorpus)}`).join(' ');

                // Target Y positions
                const yInterestTarget = getY(plan.loanDetails.totalInterest);
                const yCompleteTarget = getY(plan.loanDetails.totalScheduledRepayment);

                // Recovery milestone positions
                const intMonth = plan.customInterestMilestone.recoveryMonth;
                const compMonth = plan.customCompleteLoanMilestone.recoveryMonth;
                const loanMaturityMonth = plan.loanDetails.loanTenureMonths;

                const activePoint = hoveredPointIndex !== null ? displayRows[hoveredPointIndex] : null;

                return (
                  <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="recovery-svg"
                    role="img"
                    aria-label="SIP Compounding and Loan Recovery Target Chart"
                  >
                    {/* Horizontal Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
                      const val = maxVal * pct;
                      const y = getY(val);
                      return (
                        <g key={i} className="grid-group">
                          <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#E2E8F0" strokeDasharray="4,4" />
                          <text x={padding.left - 10} y={y + 4} textAnchor="end" fontSize="11" fill="#64748B">
                            {formatLakhsCrores(val)}
                          </text>
                        </g>
                      );
                    })}

                    {/* X-axis year ticks */}
                    {[5, 10, 15, 20, 25, 30].map((yr) => {
                      const m = yr * 12;
                      if (m > totalMonths) return null;
                      const x = getX(m);
                      return (
                        <g key={yr} className="x-tick-group">
                          <line x1={x} y1={padding.top} x2={x} y2={height - padding.bottom} stroke="#F1F5F9" />
                          <text x={x} y={height - padding.bottom + 20} textAnchor="middle" fontSize="11" fill="#64748B">
                            Yr {yr}
                          </text>
                        </g>
                      );
                    })}

                    {/* Loan Tenure Maturity Vertical Line */}
                    {loanMaturityMonth <= totalMonths && (
                      <g className="maturity-marker-group">
                        <line
                          x1={getX(loanMaturityMonth)}
                          y1={padding.top}
                          x2={getX(loanMaturityMonth)}
                          y2={height - padding.bottom}
                          stroke="#64748B"
                          strokeWidth="1.5"
                          strokeDasharray="3,3"
                        />
                        <text
                          x={getX(loanMaturityMonth)}
                          y={padding.top - 6}
                          textAnchor="middle"
                          fontSize="10"
                          fontWeight="600"
                          fill="#475569"
                        >
                          Loan End ({plan.loanDetails.loanTenureYears}y)
                        </text>
                      </g>
                    )}

                    {/* Target Line 1: Total Loan Interest */}
                    <line
                      x1={padding.left}
                      y1={yInterestTarget}
                      x2={width - padding.right}
                      y2={yInterestTarget}
                      stroke="#F59E0B"
                      strokeWidth="2"
                      strokeDasharray="6,6"
                    />

                    {/* Target Line 2: Complete Loan Cost */}
                    <line
                      x1={padding.left}
                      y1={yCompleteTarget}
                      x2={width - padding.right}
                      y2={yCompleteTarget}
                      stroke="#008080"
                      strokeWidth="2.5"
                      strokeDasharray="6,6"
                    />

                    {/* SIP Compounding Curve Area Fill */}
                    <polygon
                      points={`${padding.left},${height - padding.bottom} ${sipPoints} ${getX(totalMonths)},${height - padding.bottom}`}
                      fill="url(#sipGradient)"
                      opacity="0.25"
                    />

                    {/* SIP Compounding Line */}
                    <polyline
                      points={sipPoints}
                      fill="none"
                      stroke="#0F766E"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Milestone Pin: Interest Recovery */}
                    {intMonth && intMonth <= totalMonths && (
                      <g className="milestone-pin-group">
                        <circle cx={getX(intMonth)} cy={yInterestTarget} r="6" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2" />
                        <text
                          x={getX(intMonth)}
                          y={yInterestTarget - 10}
                          textAnchor="middle"
                          fontSize="10"
                          fontWeight="bold"
                          fill="#D97706"
                        >
                          ★ Interest Target ({formatYearsAndMonths(intMonth)})
                        </text>
                      </g>
                    )}

                    {/* Milestone Pin: Complete Loan Cost Recovery */}
                    {compMonth && compMonth <= totalMonths && (
                      <g className="milestone-pin-group">
                        <circle cx={getX(compMonth)} cy={yCompleteTarget} r="7" fill="#008080" stroke="#FFFFFF" strokeWidth="2.5" />
                        <text
                          x={getX(compMonth)}
                          y={yCompleteTarget - 12}
                          textAnchor="middle"
                          fontSize="11"
                          fontWeight="bold"
                          fill="#0F766E"
                        >
                          ★ Complete Recovery ({formatYearsAndMonths(compMonth)})
                        </text>
                      </g>
                    )}

                    {/* Invisible Hover Zones */}
                    {displayRows.map((r, idx) => (
                      <rect
                        key={r.monthNumber}
                        x={getX(r.monthNumber) - (plotW / totalMonths) / 2}
                        y={padding.top}
                        width={plotW / totalMonths}
                        height={plotH}
                        fill="transparent"
                        onMouseEnter={() => setHoveredPointIndex(idx)}
                        onTouchStart={() => setHoveredPointIndex(idx)}
                        style={{ cursor: 'pointer' }}
                      />
                    ))}

                    {/* Interactive Active Hover Indicator */}
                    {activePoint && (
                      <g className="hover-indicator-group">
                        <line
                          x1={getX(activePoint.monthNumber)}
                          y1={padding.top}
                          x2={getX(activePoint.monthNumber)}
                          y2={height - padding.bottom}
                          stroke="#0F766E"
                          strokeWidth="1.5"
                          strokeDasharray="3,3"
                        />
                        <circle
                          cx={getX(activePoint.monthNumber)}
                          cy={getY(activePoint.sipCorpus)}
                          r="5.5"
                          fill="#0F766E"
                          stroke="#FFFFFF"
                          strokeWidth="2"
                        />
                      </g>
                    )}

                    {/* SVG Gradients */}
                    <defs>
                      <linearGradient id="sipGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#008080" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#008080" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                  </svg>
                );
              })()}
            </div>

            {/* Hover Tooltip Box */}
            {hoveredPointIndex !== null && plan.projection[hoveredPointIndex] && (
              <div className="active-tooltip-box">
                <div className="tooltip-title">
                  Year {plan.projection[hoveredPointIndex].yearNumber} (Month {plan.projection[hoveredPointIndex].monthNumber})
                </div>
                <div className="tooltip-grid">
                  <div>
                    <span className="tooltip-sub">Total SIP Invested:</span>{' '}
                    <strong>{formatIndianCurrency(plan.projection[hoveredPointIndex].cumulativeSIPInvestment)}</strong>
                  </div>
                  <div>
                    <span className="tooltip-sub">Estimated SIP Corpus:</span>{' '}
                    <strong className="teal-text">{formatIndianCurrency(plan.projection[hoveredPointIndex].sipCorpus)}</strong>
                  </div>
                  <div>
                    <span className="tooltip-sub">Gap to Complete Target:</span>{' '}
                    <strong>{formatIndianCurrency(plan.projection[hoveredPointIndex].gapToCompleteLoanTarget)}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Visual Recovery Timeline (Loan Start -> Milestones -> Loan End) */}
          <div className="timeline-visual-card">
            <h3 className="timeline-title">Visual Recovery Milestones Journey</h3>
            <div className="horizontal-timeline">
              <div className="timeline-node node-start">
                <div className="node-dot" />
                <div className="node-content">
                  <span className="node-tag">Loan Starts</span>
                  <span className="node-val">Day 1</span>
                </div>
              </div>

              {plan.customInterestMilestone.isReached && (
                <div className="timeline-node node-interest">
                  <div className="node-dot dot-amber" />
                  <div className="node-content">
                    <span className="node-tag">Interest Offset</span>
                    <span className="node-val">{plan.customInterestMilestone.formattedDuration}</span>
                  </div>
                </div>
              )}

              {plan.customCompleteLoanMilestone.isReached && (
                <div className="timeline-node node-complete">
                  <div className="node-dot dot-teal" />
                  <div className="node-content">
                    <span className="node-tag">Complete Cost Offset</span>
                    <span className="node-val">{plan.customCompleteLoanMilestone.formattedDuration}</span>
                  </div>
                </div>
              )}

              <div className="timeline-node node-end">
                <div className="node-dot dot-navy" />
                <div className="node-content">
                  <span className="node-tag">Original Loan Maturity</span>
                  <span className="node-val">{plan.loanDetails.loanTenureYears} Years</span>
                </div>
              </div>
            </div>
          </div>

          {/* Plan Summary Table Card */}
          <div className="summary-card">
            <h3 className="summary-card-title">Comprehensive Loan + SIP Plan Summary</h3>
            <div className="summary-table-wrapper">
              <table className="summary-table">
                <tbody>
                  <tr>
                    <th>Loan Type</th>
                    <td>{plan.loanDetails.loanType}</td>
                  </tr>
                  <tr>
                    <th>Loan Principal Amount</th>
                    <td>{formatIndianCurrency(plan.loanDetails.loanAmount)}</td>
                  </tr>
                  <tr>
                    <th>Annual Interest Rate</th>
                    <td>{plan.loanDetails.annualLoanInterestRate}% p.a.</td>
                  </tr>
                  <tr>
                    <th>Contractual Loan Tenure</th>
                    <td>{plan.loanDetails.loanTenureYears} Years ({plan.loanDetails.loanTenureMonths} Months)</td>
                  </tr>
                  <tr>
                    <th>Monthly EMI Outflow</th>
                    <td><strong>{formatIndianCurrency(plan.loanDetails.emi)}/month</strong></td>
                  </tr>
                  <tr>
                    <th>Total Scheduled Interest</th>
                    <td>{formatLakhsCrores(plan.loanDetails.totalInterest)}</td>
                  </tr>
                  <tr>
                    <th>Complete Contractual Loan Cost</th>
                    <td><strong>{formatLakhsCrores(plan.loanDetails.totalScheduledRepayment)}</strong></td>
                  </tr>
                  <tr className="table-highlight-row">
                    <th>Your Monthly SIP Allocation</th>
                    <td><strong>{formatIndianCurrency(plan.customSipAmount)}/month</strong> ({plan.customSipPercentageOfEMI.toFixed(1)}% of EMI)</td>
                  </tr>
                  <tr>
                    <th>Assumed Annual SIP Return</th>
                    <td>{plan.sipReturnRate}% p.a. (Effective: {(plan.effectiveMonthlySIPRate * 100).toFixed(4)}%/mo)</td>
                  </tr>
                  <tr>
                    <th>Potential Total Interest Offset</th>
                    <td>
                      <span className="pill-status">
                        {plan.customInterestMilestone.formattedDuration}
                      </span>
                    </td>
                  </tr>
                  <tr className="table-highlight-row">
                    <th>Potential Complete Loan Cost Offset</th>
                    <td>
                      <span className="pill-status status-complete">
                        {plan.customCompleteLoanMilestone.formattedDuration}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Mathematical Transparency Accordion */}
          <div className="math-accordion">
            <button
              type="button"
              className="accordion-toggle"
              onClick={() => setIsMathOpen(!isMathOpen)}
              aria-expanded={isMathOpen}
            >
              <span>📐 How are these calculations modeled?</span>
              <span className="accordion-arrow">{isMathOpen ? '▲' : '▼'}</span>
            </button>
            {isMathOpen && (
              <div className="accordion-body">
                <div className="formula-block">
                  <h4>1. Reducing Balance Monthly Loan EMI</h4>
                  <p>
                    EMI = P × [i × (1 + i)ⁿ] / [(1 + i)ⁿ - 1]
                  </p>
                  <small>
                    Where P = Principal, i = AnnualRate / 1200, n = Tenure in months. Total Loan Cost = EMI × n. Total Interest = Total Cost - Principal.
                  </small>
                </div>

                <div className="formula-block">
                  <h4>2. Effective Monthly Mutual Fund SIP Compounding</h4>
                  <p>
                    i_SIP = (1 + AnnualReturnRate)^(1/12) - 1
                  </p>
                  <small>
                    Mutual funds compound returns geometrically on a daily/annualized basis, not simple division (r/12).
                  </small>
                </div>

                <div className="formula-block">
                  <h4>3. Beginning-of-Month SIP Accumulation (Annuity-Due)</h4>
                  <p>
                    FV = PMT × [((1 + i_SIP)ⁿ - 1) / i_SIP] × (1 + i_SIP)
                  </p>
                  <small>
                    Each monthly SIP is invested at the beginning of the month and earns returns immediately for the full period.
                  </small>
                </div>
              </div>
            )}
          </div>

          {/* Sample Scenario & Preset Buttons */}
          <div className="presets-bar">
            <button
              type="button"
              className="preset-btn"
              onClick={handleSampleScenario}
            >
              📊 Sample Scenario (₹50L @ 9%, ₹9k SIP)
            </button>
            <button
              type="button"
              className="preset-btn highlight-preset"
              onClick={handleHigherSIPScenario}
            >
              ⚡ Accelerated Recovery (₹15k SIP)
            </button>
            <button
              type="button"
              className="preset-btn reset-btn"
              onClick={handleReset}
            >
              🔄 Reset Calculator
            </button>
          </div>

          {/* Key Opportunity Message Banner */}
          <div className="key-message-card">
            <div className="message-quote">
              &ldquo;Your EMI pays off the loan. Your SIP can potentially build the wealth to offset it. Start small. Stay consistent. Give compounding time to work.&rdquo;
            </div>
          </div>

          {/* WhatsApp Advisory Bridge & Contact CTA */}
          <div className="advisory-bridge-card">
            <div className="advisory-content">
              <h3>Want to build your personal Loan + SIP strategy?</h3>
              <p>
                Discuss your loan portfolio with AMFI-Registered Mutual Fund Distributor Santhosh Kumar to select tailored, goal-aligned funds.
              </p>
              <div className="bridge-actions">
                <a
                  href={getWhatsAppHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-btn"
                >
                  💬 Talk to Ant Wealth on WhatsApp
                </a>
                <a href="/contact" className="consultation-btn">
                  📅 Book a Personal Consultation
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Step Actions */}
          <div className="step-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setCurrentStep(3)}
            >
              ← Back to SIP Adjustment
            </button>
          </div>
        </div>
      )}

      {/* Embedded CSS Styling */}
      <style>{`
        .planner-container {
          max-width: 1080px;
          margin: 0 auto;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #0F172A;
        }

        /* Stepper Nav */
        .stepper-nav {
          display: flex;
          justify-content: space-between;
          background: #FFFFFF;
          padding: 12px;
          border-radius: 16px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
          margin-bottom: 24px;
          gap: 8px;
          overflow-x: auto;
        }
        .step-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px solid transparent;
          background: #F8FAFC;
          color: #64748B;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .step-btn:hover {
          background: #F1F5F9;
          color: #0F172A;
        }
        .step-btn.active {
          background: #00182A;
          color: #FFFFFF;
        }
        .step-btn.completed {
          background: #F0FDF4;
          color: #166534;
          border-color: #BBF7D0;
        }
        .step-circle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.08);
          font-size: 11px;
        }
        .step-btn.active .step-circle {
          background: #008080;
          color: #FFFFFF;
        }
        .step-btn.completed .step-circle {
          background: #16A34A;
          color: #FFFFFF;
        }

        /* Step Card Container */
        .step-card {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
          border: 1px solid #E2E8F0;
        }
        .step-header {
          margin-bottom: 28px;
        }
        .step-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #008080;
          background: rgba(0, 128, 128, 0.1);
          padding: 4px 10px;
          border-radius: 6px;
          margin-bottom: 8px;
        }
        .step-title {
          font-size: 24px;
          font-weight: 800;
          color: #00182A;
          margin: 0 0 6px 0;
        }
        .step-subtitle {
          font-size: 14px;
          color: #64748B;
          margin: 0;
          line-height: 1.5;
        }

        /* Form Layout */
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .form-group.full-width {
          grid-column: 1 / -1;
        }
        .label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .input-label {
          font-size: 14px;
          font-weight: 700;
          color: #1E293B;
        }
        .select-input, .date-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 10px;
          border: 1.5px solid #CBD5E1;
          font-size: 15px;
          color: #0F172A;
          background: #FFFFFF;
          transition: border-color 0.2s;
        }
        .select-input:focus, .date-input:focus {
          outline: none;
          border-color: #008080;
          box-shadow: 0 0 0 3px rgba(0, 128, 128, 0.15);
        }
        .amount-input-wrapper {
          display: flex;
          align-items: center;
          background: #F8FAFC;
          border: 1.5px solid #CBD5E1;
          border-radius: 8px;
          padding: 4px 10px;
        }
        .currency-prefix {
          font-weight: 700;
          color: #64748B;
          margin-right: 4px;
        }
        .amount-input {
          border: none;
          background: transparent;
          font-size: 15px;
          font-weight: 700;
          color: #0F172A;
          width: 120px;
          text-align: right;
        }
        .amount-input:focus {
          outline: none;
        }
        .range-slider {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: #E2E8F0;
          accent-color: #008080;
          cursor: pointer;
        }
        .range-hints {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #94A3B8;
          margin-top: 6px;
        }
        .range-current {
          color: #008080;
          font-weight: 700;
        }
        .pill-badge {
          background: #E0F2FE;
          color: #0369A1;
          font-weight: 700;
          font-size: 12px;
          padding: 3px 8px;
          border-radius: 6px;
        }
        .helper-text {
          font-size: 12px;
          color: #64748B;
          margin-top: 4px;
          display: block;
        }

        /* Live Preview Box */
        .live-preview-box {
          display: flex;
          align-items: center;
          justify-content: space-around;
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 14px;
          padding: 20px;
          margin-top: 24px;
        }
        .preview-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .preview-label {
          font-size: 12px;
          font-weight: 600;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 4px;
        }
        .preview-value {
          font-size: 24px;
          font-weight: 800;
        }
        .emi-highlight {
          color: #00182A;
        }
        .interest-highlight {
          color: #D97706;
        }
        .per-month {
          font-size: 14px;
          font-weight: 500;
          color: #64748B;
        }
        .preview-subtext {
          font-size: 12px;
          color: #94A3B8;
          margin-top: 2px;
        }
        /* Return Assumption Panel (Step 2) */
        .return-assumption-panel {
          background: linear-gradient(180deg, #F0FDFA 0%, #FFFFFF 100%);
          border: 1.5px solid #99F6E4;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
        }
        .panel-header {
          margin-bottom: 16px;
        }
        .panel-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #0F766E;
          background: #CCFBF1;
          padding: 3px 8px;
          border-radius: 4px;
          margin-bottom: 6px;
        }
        .panel-title {
          font-size: 18px;
          font-weight: 800;
          color: #00182A;
          margin: 0 0 6px 0;
        }
        .panel-subtitle {
          font-size: 13px;
          color: #475569;
          margin: 0;
          line-height: 1.4;
        }
        .return-control-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 20px;
        }
        .return-input-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .return-label {
          font-size: 14px;
          font-weight: 700;
          color: #1E293B;
        }
        .return-input-wrapper {
          display: inline-flex;
          align-items: center;
          background: #F1F5F9;
          border: 1.5px solid #CBD5E1;
          border-radius: 8px;
          padding: 4px 10px;
        }
        .return-number-input {
          width: 54px;
          font-size: 16px;
          font-weight: 800;
          color: #00182A;
          border: none;
          background: transparent;
          text-align: right;
          outline: none;
        }
        .percent-suffix {
          font-size: 15px;
          font-weight: 700;
          color: #64748B;
          margin-left: 2px;
        }
        .current-return-badge {
          background: #008080;
          color: #FFFFFF;
          font-size: 12px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .return-horizon-note {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 12px;
          font-size: 12px;
          color: #64748B;
          flex-wrap: wrap;
        }
        .horizon-tag {
          background: #F1F5F9;
          padding: 3px 8px;
          border-radius: 4px;
          color: #334155;
        }
        .default-horizon-text {
          font-style: italic;
          color: #94A3B8;
        }
        .effective-rate-tag {
          background: #CCFBF1;
          color: #0F766E;
          padding: 3px 8px;
          border-radius: 4px;
          font-weight: 600;
        }
        .return-impact-insight {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: #F0FDF4;
          border: 1px solid #BBF7D0;
          border-radius: 10px;
          padding: 12px 14px;
          margin-top: 16px;
          font-size: 13px;
          color: #166534;
        }
        .insight-icon {
          font-size: 18px;
          line-height: 1;
        }
        .insight-text strong {
          display: block;
          margin-bottom: 2px;
          color: #14532D;
        }
        .insight-text p {
          margin: 0;
          font-size: 12px;
          color: #15803D;
          line-height: 1.4;
        }
        .return-val-highlight {
          color: #008080;
          font-weight: 800;
        }
        .return-highlight {
          color: #0F766E;
          font-weight: 700;
        }
        .hero-assumptions-strip {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 16px;
          padding-top: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.15);
        }
        .assumption-pill {
          font-size: 11px;
          color: #E2E8F0;
          background: rgba(255, 255, 255, 0.08);
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.12);
        }
        .assumption-pill strong {
          color: #2DD4BF;
        }

        /* Targets Grid (Step 2) */
        .targets-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 28px;
        }
        .target-card {
          border-radius: 16px;
          padding: 24px;
          border: 2px solid #E2E8F0;
          background: #FFFFFF;
          display: flex;
          flex-direction: column;
        }
        .card-interest {
          border-color: #FDE68A;
          background: linear-gradient(180deg, #FFFBEB 0%, #FFFFFF 100%);
        }
        .card-complete {
          border-color: #99F6E4;
          background: linear-gradient(180deg, #F0FDFA 0%, #FFFFFF 100%);
        }
        .target-eyebrow {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #64748B;
          margin-bottom: 4px;
        }
        .target-heading {
          font-size: 18px;
          font-weight: 800;
          color: #00182A;
          margin: 0 0 8px 0;
        }
        .target-amount {
          font-size: 28px;
          font-weight: 800;
          color: #0F172A;
          margin-bottom: 8px;
        }
        .target-desc {
          font-size: 13px;
          color: #64748B;
          margin: 0 0 16px 0;
          line-height: 1.4;
        }
        .cost-breakdown-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: #0F766E;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .cost-tag {
          background: #CCFBF1;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .math-plus {
          color: #94A3B8;
        }
        .target-metric-box {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 14px;
          margin-top: auto;
        }
        .metric-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          margin-bottom: 8px;
        }
        .metric-row:last-child {
          margin-bottom: 0;
        }
        .metric-title {
          color: #64748B;
          font-weight: 500;
        }
        .metric-val {
          font-weight: 700;
          color: #0F172A;
        }
        .percent-badge {
          background: #FEF3C7;
          color: #92400E;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
        }
        .teal-badge {
          background: #CCFBF1;
          color: #0F766E;
        }
        .proportion-track-wrapper {
          margin-top: 14px;
        }
        .proportion-label {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #64748B;
          margin-bottom: 4px;
        }
        .proportion-bar-bg {
          height: 8px;
          background: #E2E8F0;
          border-radius: 4px;
          overflow: hidden;
        }
        .proportion-bar-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }
        .interest-fill {
          background: #F59E0B;
        }
        .complete-fill {
          background: #008080;
        }

        /* Opportunity Flow Visual */
        .opportunity-flow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 14px;
          padding: 20px;
          margin-bottom: 28px;
          gap: 8px;
        }
        .flow-step {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .flow-num {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #E2E8F0;
          color: #475569;
          font-weight: 800;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .flow-text {
          display: flex;
          flex-direction: column;
          font-size: 12px;
        }
        .flow-text strong {
          color: #00182A;
          font-size: 13px;
        }
        .flow-arrow {
          font-size: 18px;
          color: #94A3B8;
          font-weight: 700;
        }
        .highlight-step .flow-num {
          background: #008080;
          color: #FFFFFF;
        }
        .complete-step .flow-num {
          background: #16A34A;
          color: #FFFFFF;
        }

        /* Custom Snapshot Card (Step 3) */
        .sip-pct-badge-wrapper {
          margin-top: 10px;
        }
        .sip-pct-badge {
          display: inline-block;
          background: #EFF6FF;
          color: #1E40AF;
          border: 1px solid #BFDBFE;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 13px;
        }
        .custom-snapshot-card {
          display: flex;
          justify-content: space-around;
          align-items: center;
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 14px;
          padding: 20px;
          margin-top: 24px;
        }
        .snapshot-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .snapshot-label {
          font-size: 12px;
          font-weight: 600;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 4px;
        }
        .snapshot-val {
          font-size: 16px;
          font-weight: 700;
          color: #0F172A;
        }
        .snapshot-val.highlight-val {
          color: #008080;
          font-size: 18px;
        }
        .snapshot-divider {
          width: 1px;
          height: 40px;
          background: #E2E8F0;
        }

        /* Step Actions */
        .step-actions {
          display: flex;
          justify-content: flex-end;
          gap: 14px;
          margin-top: 28px;
        }
        .btn-primary {
          background: #008080;
          color: #FFFFFF;
          border: none;
          font-weight: 700;
          font-size: 15px;
          padding: 12px 24px;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
        }
        .btn-primary:hover {
          background: #006666;
          transform: translateY(-1px);
        }
        .btn-secondary {
          background: #F1F5F9;
          color: #334155;
          border: 1px solid #CBD5E1;
          font-weight: 600;
          font-size: 14px;
          padding: 12px 20px;
          border-radius: 10px;
          cursor: pointer;
        }
        .btn-secondary:hover {
          background: #E2E8F0;
        }

        /* RESULTS DASHBOARD (Step 4) */
        .results-dashboard {
          padding: 0;
          background: transparent;
          border: none;
          box-shadow: none;
        }

        /* Dark Navy Hero Card */
        .hero-card {
          background: linear-gradient(135deg, #00182A 0%, #002B49 100%);
          border-radius: 20px;
          padding: 36px;
          color: #FFFFFF;
          box-shadow: 0 12px 36px rgba(0, 24, 42, 0.25);
          margin-bottom: 24px;
        }
        .hero-eyebrow {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: #2DD4BF;
          margin-bottom: 6px;
        }
        .hero-title {
          font-size: 24px;
          font-weight: 800;
          margin: 0 0 24px 0;
          line-height: 1.3;
          color: #FFFFFF;
        }
        .primary-outcome-box {
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 14px;
          padding: 22px;
          margin-bottom: 20px;
        }
        .outcome-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #94A3B8;
          display: block;
          margin-bottom: 6px;
        }
        .outcome-duration {
          font-size: 26px;
          font-weight: 800;
          color: #FFFFFF;
          margin-bottom: 6px;
        }
        .duration-highlight {
          color: #2DD4BF;
        }
        .outcome-detail {
          font-size: 13px;
          color: #CBD5E1;
          margin: 0;
          line-height: 1.5;
        }

        /* Timeline Banner */
        .timeline-banner {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 18px;
          border-radius: 12px;
          margin-bottom: 24px;
          font-size: 13px;
        }
        .banner-early {
          background: rgba(45, 212, 191, 0.12);
          border: 1px solid rgba(45, 212, 191, 0.3);
          color: #E2E8F0;
        }
        .banner-early strong {
          color: #2DD4BF;
        }
        .banner-late {
          background: rgba(251, 191, 36, 0.12);
          border: 1px solid rgba(251, 191, 36, 0.3);
          color: #E2E8F0;
        }
        .banner-late strong {
          color: #FCD34D;
        }
        .banner-exact {
          background: rgba(59, 130, 246, 0.12);
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #E2E8F0;
        }
        .banner-exact strong {
          color: #93C5FD;
        }
        .banner-unreached {
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #E2E8F0;
        }
        .banner-icon {
          font-size: 20px;
          line-height: 1;
        }
        .banner-content p {
          margin: 4px 0 0 0;
          font-size: 12px;
          color: #94A3B8;
          line-height: 1.4;
        }

        /* Metric Quad Grid */
        .metric-quad-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          background: rgba(0, 0, 0, 0.2);
          padding: 16px;
          border-radius: 12px;
        }
        .quad-item {
          display: flex;
          flex-direction: column;
        }
        .quad-label {
          font-size: 11px;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 4px;
        }
        .quad-val {
          font-size: 18px;
          font-weight: 800;
          color: #FFFFFF;
        }
        .teal-text {
          color: #2DD4BF;
        }
        .quad-sub {
          font-size: 11px;
          color: #64748B;
          margin-top: 2px;
        }

        /* Milestones Row */
        .milestones-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }
        .milestone-box {
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
        }
        .box-interest {
          border-top: 4px solid #F59E0B;
        }
        .box-complete {
          border-top: 4px solid #008080;
        }
        .milestone-badge {
          display: inline-block;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.05em;
          background: #FEF3C7;
          color: #92400E;
          padding: 3px 8px;
          border-radius: 4px;
          margin-bottom: 8px;
        }
        .milestone-title {
          font-size: 16px;
          font-weight: 800;
          color: #00182A;
          margin: 0 0 6px 0;
        }
        .milestone-target {
          font-size: 24px;
          font-weight: 800;
          color: #0F172A;
          margin-bottom: 12px;
        }
        .milestone-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px 12px;
          background: #F8FAFC;
          border-radius: 8px;
          padding: 10px 12px;
          margin-bottom: 14px;
          border: 1px solid #E2E8F0;
        }
        .milestone-detail-item {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
        }
        .detail-label {
          color: #64748B;
          font-weight: 500;
        }
        .detail-val {
          font-weight: 700;
          color: #0F172A;
        }
        .milestone-time {
          font-size: 13px;
          color: #334155;
          margin-bottom: 8px;
          background: #EFF6FF;
          padding: 8px 12px;
          border-radius: 6px;
          border-left: 3px solid #3B82F6;
        }
        .milestone-note {
          font-size: 12px;
          color: #64748B;
          margin: 0;
          line-height: 1.4;
        }

        /* Chart Section */
        .chart-section {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 28px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.04);
          margin-bottom: 24px;
        }
        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .chart-title {
          font-size: 18px;
          font-weight: 800;
          color: #00182A;
          margin: 0 0 4px 0;
        }
        .chart-subtitle {
          font-size: 13px;
          color: #64748B;
          margin: 0;
        }
        .chart-legend {
          display: flex;
          gap: 16px;
          font-size: 12px;
          color: #475569;
          flex-wrap: wrap;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .legend-swatch {
          width: 14px;
          height: 4px;
          border-radius: 2px;
        }
        .sip-swatch {
          background: #008080;
          height: 6px;
        }
        .interest-line-swatch {
          background: #F59E0B;
        }
        .complete-line-swatch {
          background: #008080;
          border-top: 1px dashed #008080;
        }
        .maturity-swatch {
          background: #64748B;
          border-top: 1px dashed #64748B;
        }
        .total-repayment-highlight {
          color: #0F766E;
        }
        .svg-container {
          width: 100%;
          overflow: hidden;
        }
        .recovery-svg {
          width: 100%;
          height: auto;
          display: block;
        }
        .active-tooltip-box {
          background: #00182A;
          color: #FFFFFF;
          border-radius: 10px;
          padding: 12px 16px;
          margin-top: 14px;
          font-size: 12px;
        }
        .tooltip-title {
          font-weight: 700;
          color: #2DD4BF;
          margin-bottom: 6px;
        }
        .tooltip-grid {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }
        .tooltip-sub {
          color: #94A3B8;
        }

        /* Timeline Visual */
        .timeline-visual-card {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #E2E8F0;
          margin-bottom: 24px;
        }
        .timeline-title {
          font-size: 16px;
          font-weight: 800;
          color: #00182A;
          margin: 0 0 20px 0;
        }
        .horizontal-timeline {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          padding: 0 20px;
        }
        .horizontal-timeline::before {
          content: '';
          position: absolute;
          top: 11px;
          left: 30px;
          right: 30px;
          height: 3px;
          background: #E2E8F0;
          z-index: 1;
        }
        .timeline-node {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .node-dot {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #94A3B8;
          border: 3px solid #FFFFFF;
          box-shadow: 0 0 0 2px #E2E8F0;
          margin-bottom: 8px;
        }
        .dot-amber {
          background: #F59E0B;
          box-shadow: 0 0 0 2px #FDE68A;
        }
        .dot-teal {
          background: #008080;
          box-shadow: 0 0 0 2px #99F6E4;
        }
        .dot-navy {
          background: #00182A;
          box-shadow: 0 0 0 2px #CBD5E1;
        }
        .node-content {
          display: flex;
          flex-direction: column;
        }
        .node-tag {
          font-size: 11px;
          font-weight: 600;
          color: #64748B;
        }
        .node-val {
          font-size: 13px;
          font-weight: 800;
          color: #00182A;
        }

        /* Summary Card */
        .summary-card {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #E2E8F0;
          margin-bottom: 24px;
        }
        .summary-card-title {
          font-size: 16px;
          font-weight: 800;
          color: #00182A;
          margin: 0 0 16px 0;
        }
        .summary-table-wrapper {
          overflow-x: auto;
        }
        .summary-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        .summary-table th, .summary-table td {
          padding: 10px 14px;
          border-bottom: 1px solid #F1F5F9;
          text-align: left;
        }
        .summary-table th {
          color: #64748B;
          font-weight: 600;
          width: 45%;
        }
        .summary-table td {
          color: #0F172A;
        }
        .table-highlight-row {
          background: #F8FAFC;
        }
        .pill-status {
          display: inline-block;
          background: #FEF3C7;
          color: #92400E;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 6px;
        }
        .status-complete {
          background: #CCFBF1;
          color: #0F766E;
        }

        /* Math Accordion */
        .math-accordion {
          background: #FFFFFF;
          border-radius: 14px;
          border: 1px solid #E2E8F0;
          margin-bottom: 24px;
          overflow: hidden;
        }
        .accordion-toggle {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: #F8FAFC;
          border: none;
          font-weight: 700;
          font-size: 14px;
          color: #00182A;
          cursor: pointer;
        }
        .accordion-body {
          padding: 20px;
          background: #FFFFFF;
        }
        .formula-block {
          margin-bottom: 16px;
        }
        .formula-block:last-child {
          margin-bottom: 0;
        }
        .formula-block h4 {
          font-size: 13px;
          font-weight: 700;
          color: #008080;
          margin: 0 0 4px 0;
        }
        .formula-block p {
          font-family: monospace;
          background: #F1F5F9;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 13px;
          color: #0F172A;
          margin: 0 0 4px 0;
        }
        .formula-block small {
          font-size: 12px;
          color: #64748B;
          display: block;
        }

        /* Presets Bar */
        .presets-bar {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .preset-btn {
          flex: 1;
          padding: 10px 16px;
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          border-radius: 10px;
          font-weight: 600;
          font-size: 13px;
          color: #334155;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .preset-btn:hover {
          background: #F8FAFC;
          border-color: #94A3B8;
        }
        .highlight-preset {
          background: #F0FDFA;
          border-color: #99F6E4;
          color: #0F766E;
        }
        .reset-btn {
          flex: 0 0 auto;
        }

        /* Key Message Card */
        .key-message-card {
          background: linear-gradient(135deg, #00182A 0%, #002B49 100%);
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          color: #FFFFFF;
          margin-bottom: 24px;
        }
        .message-quote {
          font-size: 16px;
          font-weight: 700;
          line-height: 1.5;
          color: #2DD4BF;
        }

        /* WhatsApp Advisory Bridge */
        .advisory-bridge-card {
          background: linear-gradient(135deg, #064E3B 0%, #065F46 100%);
          border-radius: 16px;
          padding: 28px;
          color: #FFFFFF;
          margin-bottom: 24px;
        }
        .advisory-content h3 {
          font-size: 18px;
          font-weight: 800;
          margin: 0 0 6px 0;
        }
        .advisory-content p {
          font-size: 13px;
          color: #A7F3D0;
          margin: 0 0 20px 0;
          line-height: 1.4;
        }
        .bridge-actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }
        .whatsapp-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #25D366;
          color: #FFFFFF;
          font-weight: 700;
          font-size: 14px;
          padding: 12px 20px;
          border-radius: 10px;
          text-decoration: none;
          transition: background 0.2s;
        }
        .whatsapp-btn:hover {
          background: #22C55E;
        }
        .consultation-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.15);
          color: #FFFFFF;
          font-weight: 600;
          font-size: 14px;
          padding: 12px 20px;
          border-radius: 10px;
          text-decoration: none;
          border: 1px solid rgba(255, 255, 255, 0.25);
        }
        .consultation-btn:hover {
          background: rgba(255, 255, 255, 0.25);
        }

        /* Responsive Mobile Adjustments */
        @media (max-width: 768px) {
          .step-card {
            padding: 20px;
          }
          .form-grid {
            grid-template-columns: 1fr;
          }
          .live-preview-box {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            padding: 16px;
          }
          .preview-divider {
            display: none;
          }
          .targets-grid {
            grid-template-columns: 1fr;
          }
          .opportunity-flow {
            flex-direction: column;
            align-items: flex-start;
          }
          .flow-arrow {
            transform: rotate(90deg);
            margin: 4px auto;
          }
          .hero-card {
            padding: 24px;
          }
          .metric-quad-grid {
            grid-template-columns: 1fr 1fr;
          }
          .milestones-row {
            grid-template-columns: 1fr;
          }
          .milestone-details-grid {
            grid-template-columns: 1fr;
          }
          .horizontal-timeline {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
            padding: 0;
          }
          .horizontal-timeline::before {
            display: none;
          }
          .timeline-node {
            flex-direction: row;
            text-align: left;
            gap: 12px;
          }
          .node-dot {
            margin-bottom: 0;
          }
          .bridge-actions {
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          .live-preview-box {
            grid-template-columns: 1fr;
            text-align: left;
          }
          .preview-item {
            align-items: flex-start;
            text-align: left;
          }
          .metric-quad-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
