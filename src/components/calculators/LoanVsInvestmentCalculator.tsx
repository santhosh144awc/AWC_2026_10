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
              href="https://wa.me/918087971566?text=Hi%20Santhosh,%20I%20used%20the%20Loan%20vs%20Investment%20tool%20and%20want%20to%20evaluate%20prepaying%20my%20loan%20vs%20investing.%20Can%20we%20discuss?" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-whatsapp-consult"
            >
              Discuss Your Strategy with Santhosh
            </a>
            <a href="/contact" className="btn-book-consult">
              Book a Free Financial Strategy Call
            </a>
          </div>

          {/* Explanation */}
          <div className="calc-explanation">
            <h4>Decision Factors to Consider</h4>
            <p>
              Neither strategy is universally superior for every family. The optimal choice depends on your loan interest rate after tax deductions (e.g. Sec 24b), your emergency fund buffer, risk appetite, and psychological comfort with debt.
            </p>
            <p className="disclaimer-text">
              *Investment returns are illustrations based on assumptions entered and are not guaranteed. Prepayment interest savings assume constant interest rates.
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
          grid-template-columns: 1fr 1.1fr;
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
          margin-bottom: 1.5rem;
        }

        .two-col-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
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
          font-size: 0.85rem;
          font-weight: 600;
          color: #475569;
          margin-bottom: 0.4rem;
          display: block;
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
          width: 120px;
          border: none;
          background: transparent;
          font-size: 1rem;
          font-weight: 700;
          color: #00182A;
          text-align: right;
          outline: none;
        }

        .number-input-sm {
          width: 55px;
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

        /* Results */
        .calc-result-panel {
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 14px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .option-comparison-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .option-box {
          background-color: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
        }

        .prepay-box {
          border-color: #CBD5E1;
        }

        .invest-box {
          border-color: #00AB96;
          background-color: #F0FDF4;
        }

        .option-badge {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #00182A;
          margin-bottom: 0.5rem;
        }

        .teal-badge {
          color: #00AB96;
        }

        .option-value {
          font-family: 'Outfit', sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          color: #00182A;
          margin-bottom: 0.2rem;
        }

        .teal-value {
          color: #00AB96;
        }

        .option-metric-name {
          font-size: 0.8rem;
          color: #64748B;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .option-bullet-list {
          list-style: none;
          padding: 0;
          margin: 0;
          border-top: 1px solid #E2E8F0;
          padding-top: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .option-bullet-list li {
          font-size: 0.775rem;
          color: #475569;
          line-height: 1.35;
        }

        .insight-summary-card {
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-left: 4px solid #00AB96;
          border-radius: 8px;
          padding: 1.25rem;
        }

        .insight-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: #00182A;
          margin-bottom: 0.35rem;
        }

        .insight-text {
          font-size: 0.85rem;
          color: #334155;
          line-height: 1.5;
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
          .option-comparison-grid {
            grid-template-columns: 1fr;
          }
          .calc-container {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
