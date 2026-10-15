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
    `• One-Time Investment: ${formatIndianCurrency(result.investedAmount)}\n` +
    `• Investment Duration: ${safeYears} Years\n` +
    `• Expected Return: ${safeReturn}% p.a.\n` +
    `• Estimated Future Value: ${formatIndianCurrency(result.totalValue)}\n\n` +
    `Can we connect to discuss this plan?`
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
              aria-label="Initial Investment (One-Time) (₹)"
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
              aria-label="Investment Period (Years)"
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
              aria-label="Expected Annual Return (%)"
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
                  aria-label="Expected Inflation Rate (%)"
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
              Your one-time investment grows through compounding returns. Every year, the returns you have already earned also start earning returns.
            </p>
            <p className="disclaimer-text">
              *Returns shown are illustrations based on the assumptions entered and are not guaranteed. Mutual fund investments are subject to market risks.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .maturity-number {
          color: var(--color-warm-gold);
        }

        .inflation-opt-box {
          margin-top: 1.75rem;
          padding: 1rem;
          background-color: var(--color-bg-light, #F8FAFC);
          border: 1px dashed var(--color-border-subtle, #CBD5E1);
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
          accent-color: var(--color-growth-teal, #00AB96);
          cursor: pointer;
          flex-shrink: 0;
        }

        .switch-text {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-primary-navy, #00182A);
          line-height: 1.35;
        }

        .inflation-badge {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--color-growth-teal, #00AB96);
          background-color: rgba(0, 171, 150, 0.1);
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          flex-shrink: 0;
          white-space: nowrap;
        }

        .inflation-control {
          margin-top: 0.85rem;
          padding-top: 0.85rem;
          border-top: 1px solid var(--color-border-subtle, #E2E8F0);
        }

        .inflation-hint {
          display: block;
          font-size: 0.775rem;
          color: var(--color-slate-text);
          margin-top: 0.5rem;
          line-height: 1.45;
        }

        @media (max-width: 540px) {
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
        }
      `}</style>
    </div>
  );
}
