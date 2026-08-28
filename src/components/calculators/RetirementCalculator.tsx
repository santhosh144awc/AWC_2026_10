import React, { useState, useId } from 'react';
import { calculateRetirement } from '../../utils/calculations/retirement';

export default function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [currentMonthlyExpenses, setCurrentMonthlyExpenses] = useState(50000);
  const [currentSavings, setCurrentSavings] = useState(500000);
  const [expectedInflation, setExpectedInflation] = useState(6);
  const [preRetirementReturn, setPreRetirementReturn] = useState(12);
  const [postRetirementReturn, setPostRetirementReturn] = useState(8);
  const [lifeExpectancy, setLifeExpectancy] = useState(85);

  const curAgeId = useId();
  const retAgeId = useId();
  const expId = useId();
  const savId = useId();
  const infId = useId();
  const preRetId = useId();
  const postRetId = useId();

  const result = calculateRetirement({
    currentAge: Number(currentAge) || 20,
    retirementAge: Number(retirementAge) || 60,
    currentMonthlyExpenses: Number(currentMonthlyExpenses) || 0,
    currentSavings: Number(currentSavings) || 0,
    expectedInflation: Number(expectedInflation) || 0,
    preRetirementReturn: Number(preRetirementReturn) || 0,
    postRetirementReturn: Number(postRetirementReturn) || 0,
    lifeExpectancy: Number(lifeExpectancy) || 85
  });

  const handleReset = () => {
    setCurrentAge(30);
    setRetirementAge(60);
    setCurrentMonthlyExpenses(50000);
    setCurrentSavings(500000);
    setExpectedInflation(6);
    setPreRetirementReturn(12);
    setPostRetirementReturn(8);
    setLifeExpectancy(85);
  };

  return (
    <div className="calc-container">
      <div className="calc-grid">
        {/* Input Column */}
        <div className="calc-input-panel">
          <div className="panel-header">
            <h2 className="panel-title">Retirement Planning Profile</h2>
            <button onClick={handleReset} className="reset-btn" title="Reset all fields to default">
              ↺ Reset
            </button>
          </div>

          {/* Ages */}
          <div className="two-col-inputs">
            <div className="form-group">
              <label htmlFor={curAgeId} className="field-label">Current Age</label>
              <div className="input-currency-wrapper">
                <input
                  id={curAgeId}
                  type="number"
                  min="18"
                  max="70"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(Number(e.target.value))}
                  className="number-input-sm"
                />
                <span className="unit-suffix">Yrs</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor={retAgeId} className="field-label">Retirement Age</label>
              <div className="input-currency-wrapper">
                <input
                  id={retAgeId}
                  type="number"
                  min={currentAge + 1}
                  max="80"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(Number(e.target.value))}
                  className="number-input-sm"
                />
                <span className="unit-suffix">Yrs</span>
              </div>
            </div>
          </div>

          {/* Current Monthly Expenses */}
          <div className="form-group">
            <div className="label-row">
              <label htmlFor={expId} className="field-label">Current Monthly Living Expenses</label>
              <div className="input-currency-wrapper">
                <span className="currency-prefix">₹</span>
                <input
                  id={expId}
                  type="number"
                  min="5000"
                  max="2000000"
                  step="5000"
                  value={currentMonthlyExpenses}
                  onChange={(e) => setCurrentMonthlyExpenses(Number(e.target.value))}
                  className="number-input"
                />
              </div>
            </div>
            <input
              type="range"
              min="10000"
              max="300000"
              step="5000"
              value={currentMonthlyExpenses}
              onChange={(e) => setCurrentMonthlyExpenses(Number(e.target.value))}
              className="range-slider"
            />
            <div className="slider-limits">
              <span>₹10,000</span>
              <span>₹3,00,000 / mo</span>
            </div>
          </div>

          {/* Existing Savings */}
          <div className="form-group">
            <div className="label-row">
              <label htmlFor={savId} className="field-label">Existing Retirement Savings (PF / MF / FDs)</label>
              <div className="input-currency-wrapper">
                <span className="currency-prefix">₹</span>
                <input
                  id={savId}
                  type="number"
                  min="0"
                  max="50000000"
                  step="50000"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(Number(e.target.value))}
                  className="number-input"
                />
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="5000000"
              step="50000"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(Number(e.target.value))}
              className="range-slider"
            />
            <div className="slider-limits">
              <span>₹0</span>
              <span>₹50,00,000</span>
            </div>
          </div>

          {/* Rates Row */}
          <div className="three-col-inputs">
            <div className="form-group">
              <label htmlFor={infId} className="field-label-sub">Inflation</label>
              <div className="input-currency-wrapper">
                <input
                  id={infId}
                  type="number"
                  min="3"
                  max="12"
                  step="0.5"
                  value={expectedInflation}
                  onChange={(e) => setExpectedInflation(Number(e.target.value))}
                  className="number-input-sm"
                />
                <span className="unit-suffix">%</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor={preRetId} className="field-label-sub">Pre-Ret. Return</label>
              <div className="input-currency-wrapper">
                <input
                  id={preRetId}
                  type="number"
                  min="6"
                  max="18"
                  step="0.5"
                  value={preRetirementReturn}
                  onChange={(e) => setPreRetirementReturn(Number(e.target.value))}
                  className="number-input-sm"
                />
                <span className="unit-suffix">%</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor={postRetId} className="field-label-sub">Post-Ret. Return</label>
              <div className="input-currency-wrapper">
                <input
                  id={postRetId}
                  type="number"
                  min="4"
                  max="12"
                  step="0.5"
                  value={postRetirementReturn}
                  onChange={(e) => setPostRetirementReturn(Number(e.target.value))}
                  className="number-input-sm"
                />
                <span className="unit-suffix">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="calc-result-panel">
          <div className="result-hero-box">
            <span className="result-tag">Total Required Retirement Corpus</span>
            <div className="maturity-number">₹{result.requiredCorpus.toLocaleString('en-IN')}</div>
            <p className="result-note">
              To sustain monthly living expenses of ₹{result.futureMonthlyExpenses.toLocaleString('en-IN')} during your {result.yearsInRetirement}-year retirement till age {lifeExpectancy}.
            </p>
          </div>

          {/* Monthly SIP Required Box */}
          <div className="sip-highlight-box">
            <span className="sip-highlight-label">Recommended Monthly SIP to Reach Target</span>
            <div className="sip-highlight-value">₹{result.requiredMonthlySIP.toLocaleString('en-IN')} / month</div>
            <span className="sip-highlight-sub">Invested across equity & hybrid funds over {result.yearsToRetire} years till age {retirementAge}.</span>
          </div>

          {/* Metrics Grid */}
          <div className="result-metrics-grid">
            <div className="metric-box">
              <div className="metric-details">
                <span className="metric-title">Future Monthly Expenses</span>
                <span className="metric-value">₹{result.futureMonthlyExpenses.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="metric-box">
              <div className="metric-details">
                <span className="metric-title">Existing Corpus Growth</span>
                <span className="metric-value">₹{result.existingSavingsGrowth.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="calc-action-block">
            <a 
              href={`https://wa.me/918087971566?text=${encodeURIComponent(
                `Hi Santhosh, I used the Retirement Calculator on Ant Wealth Creation.\n\n` +
                `• Current Age: ${currentAge} | Retirement Age: ${retirementAge}\n` +
                `• Current Monthly Expenses: ₹${currentMonthlyExpenses.toLocaleString('en-IN')}\n` +
                `• Required Retirement Corpus: ₹${result.requiredCorpus.toLocaleString('en-IN')}\n` +
                `• Estimated Monthly SIP Needed: ₹${result.requiredMonthlySIP.toLocaleString('en-IN')}/month\n\n` +
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
            <h4>How this is calculated</h4>
            <p>
              We estimate how much your monthly expenses will increase due to inflation by the time you retire, and calculate the total savings corpus needed so you can safely withdraw that income throughout your retirement.
            </p>
            <p className="disclaimer-text">
              *Calculations are educational illustrations based on assumptions entered and are not guaranteed.
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
          margin-bottom: 1.5rem;
        }

        .two-col-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .three-col-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 0.75rem;
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
          font-size: 0.825rem;
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
          width: 110px;
          border: none;
          background: transparent;
          font-size: 1rem;
          font-weight: 700;
          color: #00182A;
          text-align: right;
          outline: none;
        }

        .number-input-sm {
          width: 50px;
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
          font-size: 2.3rem;
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

        .sip-highlight-box {
          background-color: #FFFFFF;
          border: 2px solid #00AB96;
          border-radius: 12px;
          padding: 1.25rem;
          text-align: center;
        }

        .sip-highlight-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: #00182A;
          display: block;
          margin-bottom: 0.25rem;
        }

        .sip-highlight-value {
          font-family: 'Outfit', sans-serif;
          font-size: 1.75rem;
          font-weight: 800;
          color: #00AB96;
          margin-bottom: 0.25rem;
        }

        .sip-highlight-sub {
          font-size: 0.8rem;
          color: #64748B;
          display: block;
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
        }

        .metric-title {
          font-size: 0.8rem;
          color: #64748B;
          font-weight: 600;
          display: block;
          margin-bottom: 0.2rem;
        }

        .metric-value {
          font-family: 'Outfit', sans-serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: #00182A;
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
          .three-col-inputs {
            grid-template-columns: 1fr;
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
