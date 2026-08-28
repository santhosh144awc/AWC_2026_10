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

      <style>{`
        .calc-container {
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 2.25rem;
          box-shadow: 0 4px 20px rgba(0, 24, 42, 0.04);
        }

        .calc-grid {
          display: grid;
          grid-template-columns: 1fr 1.05fr;
          gap: 2.5rem;
          align-items: start;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.75rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #F1F5F9;
        }

        .panel-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: #00182A;
        }

        .reset-btn {
          background: transparent;
          border: none;
          color: #64748B;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        .reset-btn:hover {
          color: #00182A;
          background-color: #F1F5F9;
        }

        .form-group {
          margin-bottom: 1.75rem;
        }

        .label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.6rem;
        }

        .field-label {
          font-size: 0.95rem;
          font-weight: 600;
          color: #1E293B;
        }

        .field-label-sub {
          font-size: 0.875rem;
          font-weight: 600;
          color: #475569;
        }

        .input-currency-wrapper {
          display: flex;
          align-items: center;
          background-color: #F8FAFC;
          border: 1.5px solid #CBD5E1;
          border-radius: 8px;
          padding: 0.25rem 0.6rem;
          font-weight: 600;
          color: #00182A;
        }

        .currency-prefix, .unit-suffix {
          color: #64748B;
          font-size: 0.9rem;
          margin: 0 2px;
        }

        .number-input {
          width: 100px;
          border: none;
          background: transparent;
          font-size: 1rem;
          font-weight: 700;
          color: #00182A;
          text-align: right;
          outline: none;
        }

        .number-input-sm {
          width: 60px;
          border: none;
          background: transparent;
          font-size: 0.95rem;
          font-weight: 700;
          color: #00182A;
          text-align: right;
          outline: none;
        }

        .range-slider {
          width: 100%;
          height: 6px;
          background: #E2E8F0;
          border-radius: 9999px;
          outline: none;
          -webkit-appearance: none;
          accent-color: #00AB96;
          cursor: pointer;
        }

        .slider-limits {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #94A3B8;
          margin-top: 0.35rem;
        }

        .step-up-box {
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.25rem;
          margin-top: 1rem;
        }

        .step-up-toggle-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .switch-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 0.95rem;
          font-weight: 600;
          color: #00182A;
        }

        .checkbox-input {
          width: 18px;
          height: 18px;
          accent-color: #00AB96;
          cursor: pointer;
        }

        .step-up-badge {
          font-size: 0.75rem;
          font-weight: 700;
          color: #00AB96;
          background-color: rgba(0, 171, 150, 0.1);
          padding: 0.2rem 0.5rem;
          border-radius: 9999px;
        }

        .step-up-control {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #E2E8F0;
        }

        .step-up-hint {
          display: block;
          font-size: 0.8rem;
          color: #64748B;
          margin-top: 0.5rem;
          line-height: 1.4;
        }

        /* Result Panel */
        .calc-result-panel {
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 14px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .result-hero-box {
          background: linear-gradient(135deg, #00182A 0%, #002B49 100%);
          border-radius: 12px;
          padding: 1.75rem;
          color: #FFFFFF;
          text-align: center;
        }

        .result-tag {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #00AB96;
          display: block;
          margin-bottom: 0.4rem;
        }

        .maturity-number {
          font-family: 'Outfit', sans-serif;
          font-size: 2.5rem;
          font-weight: 800;
          color: #FFFFFF;
          line-height: 1.1;
          margin-bottom: 0.5rem;
        }

        .result-note {
          font-size: 0.85rem;
          color: #CBD5E1;
          line-height: 1.4;
        }

        .result-metrics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .metric-box {
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .metric-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .dot-navy { background-color: #00182A; }
        .dot-teal { background-color: #00AB96; }

        .metric-details {
          display: flex;
          flex-direction: column;
        }

        .metric-title {
          font-size: 0.8rem;
          color: #64748B;
          font-weight: 600;
        }

        .metric-value {
          font-family: 'Outfit', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: #00182A;
        }

        .proportion-section {
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 1rem 1.25rem;
        }

        .proportion-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          font-weight: 600;
          color: #475569;
          margin-bottom: 0.5rem;
        }

        .proportion-bar {
          height: 10px;
          background-color: #E2E8F0;
          border-radius: 9999px;
          display: flex;
          overflow: hidden;
        }

        .bar-invested {
          background-color: #00182A;
          height: 100%;
          transition: width 0.3s ease;
        }

        .bar-returns {
          background-color: #00AB96;
          height: 100%;
          transition: width 0.3s ease;
        }

        .calc-action-block {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .btn-whatsapp-consult {
          display: block;
          text-align: center;
          background-color: #00AB96;
          color: #FFFFFF;
          font-size: 0.95rem;
          font-weight: 600;
          padding: 0.85rem 1.25rem;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .btn-whatsapp-consult:hover {
          background-color: #008f7d;
          transform: translateY(-1px);
        }

        .btn-book-consult {
          display: block;
          text-align: center;
          background-color: #FFFFFF;
          border: 1.5px solid #00182A;
          color: #00182A;
          font-size: 0.95rem;
          font-weight: 600;
          padding: 0.85rem 1.25rem;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .btn-book-consult:hover {
          background-color: #F1F5F9;
        }

        .calc-explanation {
          padding-top: 1rem;
          border-top: 1px solid #E2E8F0;
        }

        .calc-explanation h4 {
          font-size: 0.9rem;
          font-weight: 700;
          color: #00182A;
          margin-bottom: 0.35rem;
        }

        .calc-explanation p {
          font-size: 0.8rem;
          color: #64748B;
          line-height: 1.5;
          margin-bottom: 0.5rem;
        }

        .disclaimer-text {
          font-size: 0.75rem !important;
          color: #94A3B8 !important;
          font-style: italic;
        }

        @media (max-width: 900px) {
          .calc-grid {
            grid-template-columns: 1fr;
          }
          .calc-container {
            padding: 1.5rem;
          }
        }

        @media (max-width: 540px) {
          .calc-container {
            padding: 1.25rem 0.875rem;
            border-radius: 12px;
          }

          .panel-header {
            margin-bottom: 1.25rem;
            gap: 0.5rem;
          }

          .panel-title {
            font-size: 1.15rem;
          }

          .label-row {
            flex-direction: column;
            align-items: stretch;
            gap: 0.35rem;
          }

          .field-label,
          .field-label-sub {
            font-size: 0.875rem;
          }

          .input-currency-wrapper {
            width: 100%;
            justify-content: space-between;
            padding: 0.4rem 0.75rem;
          }

          .number-input,
          .number-input-sm {
            width: 100%;
            flex: 1;
            font-size: 1rem;
          }

          .slider-limits {
            font-size: 0.7rem;
            gap: 0.25rem;
          }

          .step-up-box {
            padding: 0.75rem;
          }

          .step-up-toggle-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .step-up-badge {
            align-self: flex-start;
          }

          .result-hero-box {
            padding: 1.25rem 1rem;
          }

          .maturity-number {
            font-size: 1.85rem;
          }

          .maturity-words {
            font-size: 1rem;
          }

          .result-metrics-grid {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }

          .metric-box {
            padding: 0.75rem 0.85rem;
          }

          .sub-metrics-row {
            flex-direction: column;
            gap: 0.4rem;
            padding: 0.6rem 0.85rem;
          }
        }
      `}</style>
    </div>
  );
}
