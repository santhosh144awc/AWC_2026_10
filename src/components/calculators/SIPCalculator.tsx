import React, { useState, useId } from 'react';
import { calculateSIP } from '../../utils/calculations/sip';

export default function SIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [timePeriodYears, setTimePeriodYears] = useState(10);
  const [expectedReturnRate, setExpectedReturnRate] = useState(12);
  const [stepUpPercentage, setStepUpPercentage] = useState(0);
  const [enableStepUp, setEnableStepUp] = useState(false);

  const monthlyId = useId();
  const yearsId = useId();
  const returnId = useId();
  const stepUpId = useId();

  const result = calculateSIP({
    monthlyInvestment: Number(monthlyInvestment) || 0,
    timePeriodYears: Number(timePeriodYears) || 0,
    expectedReturnRate: Number(expectedReturnRate) || 0,
    stepUpPercentage: enableStepUp ? Number(stepUpPercentage) || 0 : 0
  });

  const investedRatio = result.totalValue > 0 
    ? Math.round((result.totalInvested / result.totalValue) * 100) 
    : 50;
  const returnsRatio = 100 - investedRatio;

  const handleReset = () => {
    setMonthlyInvestment(10000);
    setTimePeriodYears(10);
    setExpectedReturnRate(12);
    setStepUpPercentage(0);
    setEnableStepUp(false);
  };

  return (
    <div className="calc-container">
      <div className="calc-grid">
        {/* Input Column */}
        <div className="calc-input-panel">
          <div className="panel-header">
            <h2 className="panel-title">SIP Investment Parameters</h2>
            <button onClick={handleReset} className="reset-btn" title="Reset all fields to default">
              ↺ Reset
            </button>
          </div>

          {/* Monthly Investment */}
          <div className="form-group">
            <div className="label-row">
              <label htmlFor={monthlyId} className="field-label">Monthly SIP Amount</label>
              <div className="input-currency-wrapper">
                <span className="currency-prefix">₹</span>
                <input
                  id={monthlyId}
                  type="number"
                  min="500"
                  max="1000000"
                  step="500"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                  className="number-input"
                />
              </div>
            </div>
            <input
              type="range"
              min="500"
              max="200000"
              step="500"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
              className="range-slider"
              aria-label="Monthly SIP Amount (₹)"
            />
            <div className="slider-limits">
              <span>₹500</span>
              <span>₹2,00,000</span>
            </div>
          </div>

          {/* Time Period */}
          <div className="form-group">
            <div className="label-row">
              <label htmlFor={yearsId} className="field-label">Investment Duration</label>
              <div className="input-currency-wrapper">
                <input
                  id={yearsId}
                  type="number"
                  min="1"
                  max="40"
                  value={timePeriodYears}
                  onChange={(e) => setTimePeriodYears(Number(e.target.value))}
                  className="number-input"
                />
                <span className="unit-suffix">Yr</span>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="35"
              step="1"
              value={timePeriodYears}
              onChange={(e) => setTimePeriodYears(Number(e.target.value))}
              className="range-slider"
              aria-label="Investment Duration (Years)"
            />
            <div className="slider-limits">
              <span>1 Year</span>
              <span>35 Years</span>
            </div>
          </div>

          {/* Expected Return */}
          <div className="form-group">
            <div className="label-row">
              <label htmlFor={returnId} className="field-label">Expected Annual Return</label>
              <div className="input-currency-wrapper">
                <input
                  id={returnId}
                  type="number"
                  min="1"
                  max="30"
                  step="0.5"
                  value={expectedReturnRate}
                  onChange={(e) => setExpectedReturnRate(Number(e.target.value))}
                  className="number-input"
                />
                <span className="unit-suffix">%</span>
              </div>
            </div>
            <input
              type="range"
              min="4"
              max="20"
              step="0.5"
              value={expectedReturnRate}
              onChange={(e) => setExpectedReturnRate(Number(e.target.value))}
              className="range-slider"
              aria-label="Expected Annual Return (%)"
            />
            <div className="slider-limits">
              <span>4%</span>
              <span>20% (Assumed)</span>
            </div>
          </div>

          {/* Step Up Toggle */}
          <div className="step-up-box">
            <div className="step-up-toggle-row">
              <label className="switch-label">
                <input
                  type="checkbox"
                  checked={enableStepUp}
                  onChange={(e) => setEnableStepUp(e.target.checked)}
                  className="checkbox-input"
                />
                <span className="switch-text">Enable Annual Step-Up SIP</span>
              </label>
              <span className="step-up-badge">Boost Wealth</span>
            </div>

            {enableStepUp && (
              <div className="step-up-control">
                <div className="label-row">
                  <label htmlFor={stepUpId} className="field-label-sub">Annual Increase</label>
                  <div className="input-currency-wrapper">
                    <input
                      id={stepUpId}
                      type="number"
                      min="1"
                      max="30"
                      value={stepUpPercentage}
                      onChange={(e) => setStepUpPercentage(Number(e.target.value))}
                      className="number-input-sm"
                    />
                    <span className="unit-suffix">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  step="1"
                  value={stepUpPercentage}
                  onChange={(e) => setStepUpPercentage(Number(e.target.value))}
                  className="range-slider"
                  aria-label="Annual Step-Up Increase (%)"
                />
                <span className="step-up-hint">
                  Your SIP amount increases by {stepUpPercentage}% each year as your income grows.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Results Column */}
        <div className="calc-result-panel">
          <div className="result-hero-box">
            <span className="result-tag">Estimated Maturity Value</span>
            <div className="maturity-number">₹{result.totalValue.toLocaleString('en-IN')}</div>
            <p className="result-note">
              Accumulated over {timePeriodYears} years assuming an indicative annual growth rate of {expectedReturnRate}%.
            </p>
          </div>

          {/* Metric Cards */}
          <div className="result-metrics-grid">
            <div className="metric-box invested-box">
              <div className="metric-dot dot-navy"></div>
              <div className="metric-details">
                <span className="metric-title">Total Invested</span>
                <span className="metric-value">₹{result.totalInvested.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="metric-box returns-box">
              <div className="metric-dot dot-teal"></div>
              <div className="metric-details">
                <span className="metric-title">Estimated Gains</span>
                <span className="metric-value">₹{result.estimatedReturns.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Proportion Bar */}
          <div className="proportion-section">
            <div className="proportion-labels">
              <span>Invested: {investedRatio}%</span>
              <span>Wealth Gain: {returnsRatio}%</span>
            </div>
            <div className="proportion-bar">
              <div className="bar-invested" style={{ width: `${investedRatio}%` }} />
              <div className="bar-returns" style={{ width: `${returnsRatio}%` }} />
            </div>
          </div>

          {/* Action CTAs */}
          <div className="calc-action-block">
            <a 
              href={`https://wa.me/918087971566?text=${encodeURIComponent(
                `Hi Santhosh, I used the SIP Calculator on Ant Wealth Creation.\n\n` +
                `• Monthly Investment: ₹${monthlyInvestment.toLocaleString('en-IN')}\n` +
                `• Investment Duration: ${timePeriodYears} Years\n` +
                `• Expected Return: ${expectedReturnRate}% p.a.\n` +
                `• Estimated Future Value: ₹${(result.totalValue || 0).toLocaleString('en-IN')}\n\n` +
                `Can we connect to discuss this plan?`
              )}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-whatsapp-consult"
            >
              💬 Talk to Santhosh
            </a>
            <a href="/contact" className="btn-book-consult">
              Book a Free Consultation
            </a>
          </div>

          {/* Educational Explanation */}
          <div className="calc-explanation">
            <h4>How this is calculated</h4>
            <p>
              Each monthly investment earns compounding returns over time. Money invested in earlier months grows for longer. We calculate your total growth month-by-month at your selected annual return rate.
            </p>
            <p className="disclaimer-text">
              *Returns shown are illustrations based on the assumptions entered and are not guaranteed. Mutual fund investments are subject to market risks.
            </p>
          </div>
        </div>
      </div>

      {/* Shared two-column calculator styles imported globally from calculators.css */}
    </div>
  );
}
