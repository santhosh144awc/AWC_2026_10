import React, { useState, useId } from 'react';
import { calculateLoanVsInvestment } from '../../utils/calculations/loanVsInvestment';

export default function LoanVsInvestmentCalculator() {
  const [loanAmount, setLoanAmount] = useState(3000000);
  const [loanInterestRate, setLoanInterestRate] = useState(8.5);
  const [loanTenureYears, setLoanTenureYears] = useState(15);
  const [lumpsumAvailable, setLumpsumAvailable] = useState(500000);
  const [expectedInvestmentReturn, setExpectedInvestmentReturn] = useState(12);
  const [investmentPeriodYears, setInvestmentPeriodYears] = useState(15);

  const loanAmtId = useId();
  const loanRateId = useId();
  const tenureId = useId();
  const lumpId = useId();
  const invRateId = useId();

  const result = calculateLoanVsInvestment({
    loanAmount: Number(loanAmount) || 0,
    loanInterestRate: Number(loanInterestRate) || 0,
    loanTenureYears: Number(loanTenureYears) || 1,
    lumpsumAvailable: Number(lumpsumAvailable) || 0,
    expectedInvestmentReturn: Number(expectedInvestmentReturn) || 0,
    investmentPeriodYears: Number(investmentPeriodYears) || 1
  });

  const handleReset = () => {
    setLoanAmount(3000000);
    setLoanInterestRate(8.5);
    setLoanTenureYears(15);
    setLumpsumAvailable(500000);
    setExpectedInvestmentReturn(12);
    setInvestmentPeriodYears(15);
  };

  return (
    <div className="calc-container">
      <div className="calc-grid">
        {/* Input Panel */}
        <div className="calc-input-panel">
          <div className="panel-header">
            <h2 className="panel-title">Loan & Investment Comparison</h2>
            <button onClick={handleReset} className="reset-btn" title="Reset all fields">
              ↺ Reset
            </button>
          </div>

          {/* Loan Amount */}
          <div className="form-group">
            <div className="label-row">
              <label htmlFor={loanAmtId} className="field-label">Outstanding Loan Principal</label>
              <div className="input-currency-wrapper">
                <span className="currency-prefix">₹</span>
                <input
                  id={loanAmtId}
                  type="number"
                  min="100000"
                  max="50000000"
                  step="50000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="number-input"
                />
              </div>
            </div>
            <input
              type="range"
              min="200000"
              max="10000000"
              step="50000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="range-slider"
              aria-label="Outstanding Loan Principal (₹)"
            />
            <div className="slider-limits">
              <span>₹2 Lakh</span>
              <span>₹1 Crore</span>
            </div>
          </div>

          {/* Lumpsum Amount Available */}
          <div className="form-group">
            <div className="label-row">
              <label htmlFor={lumpId} className="field-label">Surplus Lumpsum Available</label>
              <div className="input-currency-wrapper">
                <span className="currency-prefix">₹</span>
                <input
                  id={lumpId}
                  type="number"
                  min="25000"
                  max={loanAmount}
                  step="25000"
                  value={lumpsumAvailable}
                  onChange={(e) => setLumpsumAvailable(Number(e.target.value))}
                  className="number-input"
                />
              </div>
            </div>
            <input
              type="range"
              min="50000"
              max="3000000"
              step="25000"
              value={lumpsumAvailable}
              onChange={(e) => setLumpsumAvailable(Number(e.target.value))}
              className="range-slider"
              aria-label="Surplus Lumpsum Available (₹)"
            />
            <div className="slider-limits">
              <span>₹50,000</span>
              <span>₹30 Lakh</span>
            </div>
          </div>

          {/* Loan Interest & Investment Return Rates */}
          <div className="two-col-inputs">
            <div className="form-group">
              <label htmlFor={loanRateId} className="field-label-sub">Loan Interest Rate</label>
              <div className="input-currency-wrapper">
                <input
                  id={loanRateId}
                  type="number"
                  min="4"
                  max="20"
                  step="0.1"
                  value={loanInterestRate}
                  onChange={(e) => setLoanInterestRate(Number(e.target.value))}
                  className="number-input-sm"
                />
                <span className="unit-suffix">%</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor={invRateId} className="field-label-sub">Expected Investment Return</label>
              <div className="input-currency-wrapper">
                <input
                  id={invRateId}
                  type="number"
                  min="4"
                  max="25"
                  step="0.5"
                  value={expectedInvestmentReturn}
                  onChange={(e) => setExpectedInvestmentReturn(Number(e.target.value))}
                  className="number-input-sm"
                />
                <span className="unit-suffix">%</span>
              </div>
            </div>
          </div>

          {/* Tenure */}
          <div className="form-group">
            <div className="label-row">
              <label htmlFor={tenureId} className="field-label">Duration (Years)</label>
              <div className="input-currency-wrapper">
                <input
                  id={tenureId}
                  type="number"
                  min="1"
                  max="30"
                  value={loanTenureYears}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setLoanTenureYears(val);
                    setInvestmentPeriodYears(val);
                  }}
                  className="number-input-sm"
                />
                <span className="unit-suffix">Yrs</span>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              step="1"
              value={loanTenureYears}
              onChange={(e) => {
                const val = Number(e.target.value);
                setLoanTenureYears(val);
                setInvestmentPeriodYears(val);
              }}
              className="range-slider"
              aria-label="Duration (Years)"
            />
            <div className="slider-limits">
              <span>1 Year</span>
              <span>25 Years</span>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="calc-result-panel">
          {/* Comparison Cards Grid */}
          <div className="option-comparison-grid">
            {/* Option A: Prepay */}
            <div className="option-box prepay-box">
              <div className="option-badge">Option A: Prepay Loan</div>
              <div className="option-value">₹{result.interestSavedByPrepayment.toLocaleString('en-IN')}</div>
              <span className="option-metric-name">Guaranteed Interest Saved</span>
              <ul className="option-bullet-list">
                <li>Reduced EMI: ₹{result.newMonthlyEMI.toLocaleString('en-IN')} / mo (down from ₹{result.originalMonthlyEMI.toLocaleString('en-IN')})</li>
                <li>Zero market risk & peace of mind</li>
                <li>Immediate debt reduction</li>
              </ul>
            </div>

            {/* Option B: Invest */}
            <div className="option-box invest-box">
              <div className="option-badge teal-badge">Option B: Invest Lumpsum</div>
              <div className="option-value teal-value">₹{result.investmentFutureValue.toLocaleString('en-IN')}</div>
              <span className="option-metric-name">Estimated Future Wealth</span>
              <ul className="option-bullet-list">
                <li>Net Gains: ₹{result.investmentGain.toLocaleString('en-IN')}</li>
                <li>Liquid emergency capital retained</li>
                <li>Potential compounding upside over {investmentPeriodYears} yrs</li>
              </ul>
            </div>
          </div>

          {/* Strategic Insight Box */}
          <div className="insight-summary-card">
            <h4 className="insight-title">Educational Analysis</h4>
            <p className="insight-text">{result.summaryInsight}</p>
          </div>

          {/* Action CTAs */}
          <div className="calc-action-block">
            <a 
              href={`https://wa.me/918087971566?text=${encodeURIComponent(
                `Hi Santhosh, I used the Loan vs Investment Calculator on Ant Wealth Creation.\n\n` +
                `• Loan Balance: ₹${loanAmount.toLocaleString('en-IN')} (${loanInterestRate}% for ${loanTenureYears} Years)\n` +
                `• Lump Sum Available: ₹${lumpsumAvailable.toLocaleString('en-IN')}\n` +
                `• Interest Saved if Prepaying: ₹${(result.interestSavedByPrepayment || 0).toLocaleString('en-IN')}\n` +
                `• Potential Wealth if Investing: ₹${(result.investmentFutureValue || 0).toLocaleString('en-IN')}\n\n` +
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

          {/* Explanation */}
          <div className="calc-explanation">
            <h4>Decision Factors to Consider</h4>
            <p>
              We compare the guaranteed interest saved by paying down your loan early against the potential wealth you could build by investing that same money into mutual funds. The best choice depends on your loan interest rate, emergency safety buffer, and comfort with debt.
            </p>
            <p className="disclaimer-text">
              *Investment returns are illustrations based on assumptions entered and are not guaranteed. Prepayment interest savings assume constant interest rates.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        /* Component-Specific: Option Comparison Grid */
        .option-comparison-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .option-box {
          background-color: var(--color-white);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
        }

        .prepay-box {
          border-color: var(--color-border);
        }

        .invest-box {
          border-color: var(--color-growth-teal);
          background-color: var(--color-growth-teal-light);
        }

        .option-badge {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-primary-navy);
          margin-bottom: 0.5rem;
        }

        .teal-badge {
          color: var(--color-growth-teal);
        }

        .option-value {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--color-primary-navy);
          margin-bottom: 0.2rem;
        }

        .teal-value {
          color: var(--color-growth-teal);
        }

        .option-metric-name {
          font-size: 0.8rem;
          color: var(--color-slate-muted);
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .option-bullet-list {
          list-style: none;
          padding: 0;
          margin: 0;
          border-top: 1px solid var(--color-border);
          padding-top: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .option-bullet-list li {
          font-size: 0.775rem;
          color: var(--color-slate-text);
          line-height: 1.35;
        }

        /* Component-Specific: Educational Insight Card */
        .insight-summary-card {
          background-color: var(--color-white);
          border: 1px solid var(--color-border);
          border-left: 4px solid var(--color-growth-teal);
          border-radius: var(--radius-sm);
          padding: 1.25rem;
        }

        .insight-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--color-primary-navy);
          margin-bottom: 0.35rem;
        }

        .insight-text {
          font-size: 0.85rem;
          color: var(--color-slate-text);
          line-height: 1.5;
        }

        @media (max-width: 900px) {
          .option-comparison-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
