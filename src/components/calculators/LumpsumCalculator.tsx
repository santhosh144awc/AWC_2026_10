import React, { useState, useId } from 'react';
import { calculateLumpsum } from '../../utils/calculations/lumpsum';

function formatIndianCurrency(amount: number): string {
  if (isNaN(amount) || amount === 0) return '₹0';
  return `₹${amount.toLocaleString('en-IN')}`;
}

function formatLakhsCrores(amount: number): string {
  if (isNaN(amount) || amount === 0) return '₹0';
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `₹${cr.toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    const lk = amount / 100000;
    return `₹${lk.toFixed(2)} Lakh`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

export default function LumpsumCalculator() {
  const [initialInvestment, setInitialInvestment] = useState<number>(100000);
  const [timePeriodYears, setTimePeriodYears] = useState<number>(10);
  const [expectedReturnRate, setExpectedReturnRate] = useState<number>(12);
  const [enableInflation, setEnableInflation] = useState<boolean>(false);
  const [inflationRate, setInflationRate] = useState<number>(6);

  const principalId = useId();
  const yearsId = useId();
  const returnId = useId();
  const inflationId = useId();

  const safePrincipal = Math.max(0, Math.min(100000000, Number(initialInvestment) || 0));
  const safeYears = Math.max(1, Math.min(40, Number(timePeriodYears) || 1));
  const safeReturn = Math.max(0, Math.min(30, Number(expectedReturnRate) || 0));
  const safeInflation = Math.max(0, Math.min(15, Number(inflationRate) || 6));

  const result = calculateLumpsum(safePrincipal, safeReturn, safeYears);

  // Proportional bar ratios
  const investedRatio = result.totalValue > 0 
    ? Math.round((result.investedAmount / result.totalValue) * 100) 
    : 50;
  const returnsRatio = Math.max(0, 100 - investedRatio);

  // Optional real purchasing power calculation
  const realPurchasingPower = enableInflation && safeInflation > 0 && safeYears > 0
    ? Math.round(result.totalValue / Math.pow(1 + safeInflation / 100, safeYears))
    : result.totalValue;

  const handleReset = () => {
    setInitialInvestment(100000);
    setTimePeriodYears(10);
    setExpectedReturnRate(12);
    setEnableInflation(false);
    setInflationRate(6);
  };

  const whatsappMessage = encodeURIComponent(
    `Hi Santhosh, I used the Lumpsum Calculator on Ant Wealth Creation.\n\n` +
    `• One-time Investment: ${formatIndianCurrency(result.investedAmount)}\n` +
    `• Duration: ${safeYears} Years\n` +
    `• Assumed Return: ${safeReturn}% p.a.\n` +
    `• Estimated Maturity: ${formatIndianCurrency(result.totalValue)} (${formatLakhsCrores(result.totalValue)})\n\n` +
    `I would like guidance on selecting the right mutual fund allocation for this lumpsum.`
  );

  return (
    <div className="calc-container">
      <div className="calc-grid">
        {/* Input Column */}
        <div className="calc-input-panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Lumpsum Investment Parameters</h2>
              <p className="panel-subtitle">Estimate the future growth of your one-time investment.</p>
            </div>
            <button 
              type="button" 
              onClick={handleReset} 
              className="reset-btn" 
              title="Reset all fields to default"
              aria-label="Reset calculator to defaults"
            >
              ↺ Reset
            </button>
          </div>

          {/* Initial Investment (Principal) */}
          <div className="form-group">
            <div className="label-row">
              <label htmlFor={principalId} className="field-label">Initial Investment (One-Time)</label>
              <div className="input-currency-wrapper">
                <span className="currency-prefix">₹</span>
                <input
                  id={principalId}
                  type="number"
                  min="1000"
                  max="100000000"
                  step="5000"
                  value={initialInvestment || ''}
                  onChange={(e) => setInitialInvestment(Number(e.target.value))}
                  className="number-input"
                  aria-label="Initial Investment in Rupees"
                />
              </div>
            </div>
            <input
              type="range"
              min="1000"
              max="2500000"
              step="5000"
              value={Math.min(2500000, safePrincipal)}
              onChange={(e) => setInitialInvestment(Number(e.target.value))}
              className="range-slider"
              aria-label="Initial Investment Slider"
            />
            <div className="slider-limits">
              <span>₹1,000</span>
              <span>₹25 Lakh (Slider) • Direct input up to ₹10 Cr</span>
            </div>
          </div>

          {/* Investment Duration (Years) */}
          <div className="form-group">
            <div className="label-row">
              <label htmlFor={yearsId} className="field-label">Investment Period</label>
              <div className="input-currency-wrapper">
                <input
                  id={yearsId}
                  type="number"
                  min="1"
                  max="40"
                  value={timePeriodYears || ''}
                  onChange={(e) => setTimePeriodYears(Number(e.target.value))}
                  className="number-input"
                  aria-label="Investment Period in Years"
                />
                <span className="unit-suffix">Yrs</span>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="40"
              step="1"
              value={safeYears}
              onChange={(e) => setTimePeriodYears(Number(e.target.value))}
              className="range-slider"
              aria-label="Investment Period Slider"
            />
            <div className="slider-limits">
              <span>1 Year</span>
              <span>40 Years</span>
            </div>
          </div>

          {/* Expected Annual Return */}
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
                  value={expectedReturnRate || ''}
                  onChange={(e) => setExpectedReturnRate(Number(e.target.value))}
                  className="number-input"
                  aria-label="Expected Annual Return Percentage"
                />
                <span className="unit-suffix">%</span>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="0.5"
              value={safeReturn}
              onChange={(e) => setExpectedReturnRate(Number(e.target.value))}
              className="range-slider"
              aria-label="Expected Annual Return Slider"
            />
            <div className="slider-limits">
              <span>1%</span>
              <span>12% (Equity Benchmark)</span>
              <span>30%</span>
            </div>
          </div>

          {/* Optional Real Value / Inflation Adjustment */}
          <div className="inflation-opt-box">
            <div className="inflation-toggle-row">
              <label className="switch-label">
                <input
                  type="checkbox"
                  checked={enableInflation}
                  onChange={(e) => setEnableInflation(e.target.checked)}
                  className="checkbox-input"
                />
                <span className="switch-text">Optional: What could this be worth in today's money?</span>
              </label>
              <span className="inflation-badge">Purchasing Power</span>
            </div>

            {enableInflation && (
              <div className="inflation-control">
                <div className="label-row">
                  <label htmlFor={inflationId} className="field-label-sub">Expected Inflation Rate</label>
                  <div className="input-currency-wrapper">
                    <input
                      id={inflationId}
                      type="number"
                      min="1"
                      max="15"
                      step="0.5"
                      value={inflationRate}
                      onChange={(e) => setInflationRate(Number(e.target.value))}
                      className="number-input-sm"
                      aria-label="Inflation Rate Percentage"
                    />
                    <span className="unit-suffix">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="3"
                  max="12"
                  step="0.5"
                  value={safeInflation}
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                  className="range-slider"
                  aria-label="Inflation Rate Slider"
                />
                <span className="inflation-hint">
                  At {safeInflation}% annual inflation, your future ₹{result.totalValue.toLocaleString('en-IN')} has the equivalent purchasing power of <strong>{formatIndianCurrency(realPurchasingPower)}</strong> today.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Results Column */}
        <div className="calc-result-panel">
          <div className="result-hero-box">
            <span className="result-tag">Estimated Future Value</span>
            <div className="maturity-number">{formatIndianCurrency(result.totalValue)}</div>
            {result.totalValue >= 100000 && (
              <div className="maturity-words">{formatLakhsCrores(result.totalValue)}</div>
            )}
            <p className="result-note">
              Total estimated corpus accumulated after {safeYears} years at an illustrative growth rate of {safeReturn}% p.a.
            </p>
          </div>

          {/* Metric Cards */}
          <div className="result-metrics-grid">
            <div className="metric-box invested-box">
              <div className="metric-dot dot-navy"></div>
              <div className="metric-details">
                <span className="metric-title">Initial Investment</span>
                <span className="metric-value">{formatIndianCurrency(result.investedAmount)}</span>
              </div>
            </div>

            <div className="metric-box returns-box">
              <div className="metric-dot dot-teal"></div>
              <div className="metric-details">
                <span className="metric-title">Estimated Growth</span>
                <span className="metric-value">{formatIndianCurrency(result.estimatedReturns)}</span>
              </div>
            </div>
          </div>

          {/* Secondary Details Row */}
          <div className="sub-metrics-row">
            <div className="sub-metric">
              <span className="sub-lbl">Investment Period:</span>
              <span className="sub-val">{safeYears} {safeYears === 1 ? 'Year' : 'Years'}</span>
            </div>
            <div className="sub-metric">
              <span className="sub-lbl">Assumed Return:</span>
              <span className="sub-val">{safeReturn}% p.a.</span>
            </div>
          </div>

          {/* Visual Proportion Bar */}
          <div className="proportion-section">
            <div className="proportion-labels">
              <span>Principal: {investedRatio}%</span>
              <span>Compounded Gain: {returnsRatio}%</span>
            </div>
            <div className="proportion-bar" role="progressbar" aria-valuenow={investedRatio} aria-valuemin={0} aria-valuemax={100} aria-label="Investment vs Growth Breakdown">
              <div className="bar-invested" style={{ width: `${investedRatio}%` }} title={`Principal: ${investedRatio}%`} />
              <div className="bar-returns" style={{ width: `${returnsRatio}%` }} title={`Gain: ${returnsRatio}%`} />
            </div>
          </div>

          {/* Action CTAs */}
          <div className="calc-action-block">
            <a 
              href={`https://wa.me/918087971566?text=${whatsappMessage}`} 
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
            <h4>How it works</h4>
            <p>
              A lumpsum investment is a one-time investment. If the investment earns returns and those returns remain invested, the value can compound over time. The longer the investment remains invested, the greater the potential effect of compounding.
            </p>
            <p className="formula-note">
              Formula: <code>FV = PV × (1 + r)^t</code> where PV is your initial investment, r is the annual expected return rate, and t is the investment duration in years.
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
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        .calc-grid {
          display: grid;
          grid-template-columns: 1fr 1.05fr;
          gap: 2.5rem;
          align-items: start;
          width: 100%;
          box-sizing: border-box;
        }

        .calc-input-panel,
        .calc-result-panel {
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.75rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #F1F5F9;
        }

        .panel-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: #00182A;
          margin-bottom: 0.25rem;
        }

        .panel-subtitle {
          font-size: 0.825rem;
          color: #64748B;
        }

        .reset-btn {
          background: transparent;
          border: none;
          color: #64748B;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .reset-btn:hover {
          color: #00182A;
          background-color: #F1F5F9;
        }

        .form-group {
          margin-bottom: 1.5rem;
          width: 100%;
          box-sizing: border-box;
        }

        .label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          gap: 0.75rem;
        }

        .field-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: #00182A;
          flex: 1 1 auto;
        }

        .field-label-sub {
          font-size: 0.85rem;
          font-weight: 600;
          color: #334155;
          flex: 1 1 auto;
        }

        .input-currency-wrapper {
          display: flex;
          align-items: center;
          background-color: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 8px;
          padding: 0.25rem 0.6rem;
          transition: border-color 0.2s ease;
          box-sizing: border-box;
          flex-shrink: 0;
        }

        .input-currency-wrapper:focus-within {
          border-color: #00AB96;
          background-color: #FFFFFF;
        }

        .currency-prefix {
          font-size: 0.95rem;
          font-weight: 600;
          color: #64748B;
          margin-right: 0.25rem;
        }

        .unit-suffix {
          font-size: 0.85rem;
          font-weight: 600;
          color: #64748B;
          margin-left: 0.25rem;
        }

        .number-input {
          border: none;
          background: transparent;
          font-size: 0.95rem;
          font-weight: 700;
          color: #00182A;
          width: 110px;
          max-width: 100%;
          text-align: right;
          outline: none;
          box-sizing: border-box;
        }

        .number-input-sm {
          border: none;
          background: transparent;
          font-size: 0.9rem;
          font-weight: 700;
          color: #00182A;
          width: 60px;
          max-width: 100%;
          text-align: right;
          outline: none;
          box-sizing: border-box;
        }

        .range-slider {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: #E2E8F0;
          outline: none;
          -webkit-appearance: none;
          accent-color: #00AB96;
          margin: 0.75rem 0 0.35rem;
          box-sizing: border-box;
        }

        .slider-limits {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #94A3B8;
          box-sizing: border-box;
        }

        .inflation-opt-box {
          margin-top: 1.75rem;
          padding: 1rem;
          background-color: #F8FAFC;
          border: 1px dashed #CBD5E1;
          border-radius: 10px;
          box-sizing: border-box;
        }

        .inflation-toggle-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.5rem;
        }

        .switch-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          flex: 1 1 auto;
        }

        .checkbox-input {
          width: 16px;
          height: 16px;
          accent-color: #00AB96;
          cursor: pointer;
          flex-shrink: 0;
        }

        .switch-text {
          font-size: 0.85rem;
          font-weight: 600;
          color: #00182A;
          line-height: 1.35;
        }

        .inflation-badge {
          font-size: 0.7rem;
          font-weight: 700;
          color: #00AB96;
          background-color: rgba(0, 171, 150, 0.1);
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          flex-shrink: 0;
          white-space: nowrap;
        }

        .inflation-control {
          margin-top: 0.85rem;
          padding-top: 0.85rem;
          border-top: 1px solid #E2E8F0;
        }

        .inflation-hint {
          display: block;
          font-size: 0.775rem;
          color: #475569;
          margin-top: 0.5rem;
          line-height: 1.45;
        }

        /* Result Column */
        .calc-result-panel {
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 14px;
          padding: 1.75rem;
        }

        .result-hero-box {
          background: linear-gradient(135deg, #00182A 0%, #002B49 100%);
          border-radius: 12px;
          padding: 1.5rem;
          color: #FFFFFF;
          text-align: center;
          margin-bottom: 1.25rem;
          box-sizing: border-box;
        }

        .result-tag {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #00AB96;
          display: block;
          margin-bottom: 0.35rem;
        }

        .maturity-number {
          font-family: 'Outfit', sans-serif;
          font-size: 2.25rem;
          font-weight: 800;
          color: #FFC107;
          line-height: 1.15;
          margin-bottom: 0.25rem;
          word-break: break-word;
        }

        .maturity-words {
          font-size: 1.1rem;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 0.5rem;
        }

        .result-note {
          font-size: 0.8rem;
          color: #94A3B8;
          line-height: 1.4;
          margin: 0;
        }

        .result-metrics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .metric-box {
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 0.85rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          box-sizing: border-box;
        }

        .metric-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .dot-navy {
          background-color: #00182A;
        }

        .dot-teal {
          background-color: #00AB96;
        }

        .metric-details {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .metric-title {
          font-size: 0.725rem;
          font-weight: 600;
          color: #64748B;
          text-transform: uppercase;
        }

        .metric-value {
          font-size: 1.1rem;
          font-weight: 700;
          color: #00182A;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sub-metrics-row {
          display: flex;
          justify-content: space-between;
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 0.6rem 1rem;
          margin-bottom: 1rem;
          box-sizing: border-box;
        }

        .sub-metric {
          font-size: 0.825rem;
          display: flex;
          gap: 0.4rem;
        }

        .sub-lbl {
          color: #64748B;
        }

        .sub-val {
          font-weight: 700;
          color: #00182A;
        }

        .proportion-section {
          margin-bottom: 1.25rem;
        }

        .proportion-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          font-weight: 600;
          color: #475569;
          margin-bottom: 0.4rem;
        }

        .proportion-bar {
          display: flex;
          height: 10px;
          border-radius: 5px;
          overflow: hidden;
          background-color: #E2E8F0;
        }

        .bar-invested {
          background-color: #00182A;
          transition: width 0.3s ease;
        }

        .bar-returns {
          background-color: #00AB96;
          transition: width 0.3s ease;
        }

        .calc-action-block {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          margin-bottom: 1.25rem;
        }

        .btn-whatsapp-consult {
          display: block;
          background-color: #25D366;
          color: #FFFFFF;
          text-align: center;
          font-weight: 700;
          font-size: 0.9rem;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          text-decoration: none;
          transition: background-color 0.2s ease;
        }

        .btn-whatsapp-consult:hover {
          background-color: #20BA5C;
          color: #FFFFFF;
        }

        .btn-book-consult {
          display: block;
          background-color: #FFFFFF;
          color: #00182A;
          border: 1.5px solid #00182A;
          text-align: center;
          font-weight: 700;
          font-size: 0.9rem;
          padding: 0.65rem 1rem;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .btn-book-consult:hover {
          background-color: #00182A;
          color: #FFFFFF;
        }

        .calc-explanation {
          border-top: 1px solid #E2E8F0;
          padding-top: 1rem;
        }

        .calc-explanation h4 {
          font-size: 0.85rem;
          font-weight: 700;
          color: #00182A;
          margin-bottom: 0.35rem;
        }

        .calc-explanation p {
          font-size: 0.775rem;
          color: #64748B;
          line-height: 1.5;
          margin-bottom: 0.5rem;
        }

        .formula-note {
          font-family: monospace;
          background-color: #F1F5F9;
          padding: 0.35rem 0.5rem;
          border-radius: 4px;
        }

        .disclaimer-text {
          font-size: 0.725rem !important;
          color: #94A3B8 !important;
          font-style: italic;
          margin: 0 !important;
        }

        @media (max-width: 900px) {
          .calc-grid {
            grid-template-columns: 1fr;
            gap: 1.75rem;
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

          .inflation-opt-box {
            padding: 0.75rem;
          }

          .inflation-toggle-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .inflation-badge {
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
