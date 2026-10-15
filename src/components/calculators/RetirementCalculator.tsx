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
              aria-label="Current Monthly Living Expenses (₹)"
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
              aria-label="Existing Retirement Savings (PF / MF / FDs) (₹)"
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
        .maturity-number {
          color: var(--color-white);
        }
      `}</style>
    </div>
  );
}
