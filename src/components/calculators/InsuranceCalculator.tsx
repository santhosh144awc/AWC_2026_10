import React, { useState, useId } from 'react';
import { calculateInsuranceNeed } from '../../utils/calculations/insurance';

export default function InsuranceCalculator() {
  const [annualIncome, setAnnualIncome] = useState(1200000);
  const [yearsOfIncomeReplacement, setYearsOfIncomeReplacement] = useState(15);
  const [outstandingLoans, setOutstandingLoans] = useState(3000000);
  const [futureMajorGoals, setFutureMajorGoals] = useState(2500000);
  const [existingLiquidAssets, setExistingLiquidAssets] = useState(800000);
  const [existingLifeCover, setExistingLifeCover] = useState(2500000);

  const incId = useId();
  const yrsId = useId();
  const loanId = useId();
  const goalId = useId();
  const assetId = useId();
  const coverId = useId();

  const result = calculateInsuranceNeed({
    annualIncome: Number(annualIncome) || 0,
    yearsOfIncomeReplacement: Number(yearsOfIncomeReplacement) || 10,
    outstandingLoans: Number(outstandingLoans) || 0,
    futureMajorGoals: Number(futureMajorGoals) || 0,
    existingLiquidAssets: Number(existingLiquidAssets) || 0,
    existingLifeCover: Number(existingLifeCover) || 0
  });

  const handleReset = () => {
    setAnnualIncome(1200000);
    setYearsOfIncomeReplacement(15);
    setOutstandingLoans(3000000);
    setFutureMajorGoals(2500000);
    setExistingLiquidAssets(800000);
    setExistingLifeCover(2500000);
  };

  return (
    <div className="calc-container">
      <div className="calc-grid">
        {/* Input Panel */}
        <div className="calc-input-panel">
          <div className="panel-header">
            <h2 className="panel-title">Protection Needs Profile</h2>
            <button onClick={handleReset} className="reset-btn" title="Reset all fields">
              ↺ Reset
            </button>
          </div>

          {/* Annual Income */}
          <div className="form-group">
            <div className="label-row">
              <label htmlFor={incId} className="field-label">Annual Take-Home Income</label>
              <div className="input-currency-wrapper">
                <span className="currency-prefix">₹</span>
                <input
                  id={incId}
                  type="number"
                  min="200000"
                  max="50000000"
                  step="50000"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(Number(e.target.value))}
                  className="number-input"
                />
              </div>
            </div>
            <input
              type="range"
              min="300000"
              max="5000000"
              step="50000"
              value={annualIncome}
              onChange={(e) => setAnnualIncome(Number(e.target.value))}
              className="range-slider"
              aria-label="Annual Take-Home Income slider"
            />
            <div className="slider-limits">
              <span>₹3 Lakh</span>
              <span>₹50 Lakh / year</span>
            </div>
          </div>

          {/* Years of Income Replacement */}
          <div className="form-group">
            <div className="label-row">
              <label htmlFor={yrsId} className="field-label">Years of Income Replacement Desired</label>
              <div className="input-currency-wrapper">
                <input
                  id={yrsId}
                  type="number"
                  min="5"
                  max="30"
                  value={yearsOfIncomeReplacement}
                  onChange={(e) => setYearsOfIncomeReplacement(Number(e.target.value))}
                  className="number-input-sm"
                />
                <span className="unit-suffix">Yrs</span>
              </div>
            </div>
            <input
              type="range"
              min="5"
              max="25"
              step="1"
              value={yearsOfIncomeReplacement}
              onChange={(e) => setYearsOfIncomeReplacement(Number(e.target.value))}
              className="range-slider"
              aria-label="Years of Income Replacement Desired slider"
            />
            <div className="slider-limits">
              <span>5 Years</span>
              <span>25 Years</span>
            </div>
          </div>

          {/* Outstanding Liabilities */}
          <div className="form-group">
            <div className="label-row">
              <label htmlFor={loanId} className="field-label">Outstanding Loans & Liabilities</label>
              <div className="input-currency-wrapper">
                <span className="currency-prefix">₹</span>
                <input
                  id={loanId}
                  type="number"
                  min="0"
                  max="50000000"
                  step="50000"
                  value={outstandingLoans}
                  onChange={(e) => setOutstandingLoans(Number(e.target.value))}
                  className="number-input"
                />
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="10000000"
              step="50000"
              value={outstandingLoans}
              onChange={(e) => setOutstandingLoans(Number(e.target.value))}
              className="range-slider"
              aria-label="Outstanding Loans & Liabilities slider"
            />
            <div className="slider-limits">
              <span>₹0</span>
              <span>₹1 Crore</span>
            </div>
          </div>

          {/* Future Major Goals */}
          <div className="form-group">
            <div className="label-row">
              <label htmlFor={goalId} className="field-label">Crucial Family Goals (Education/Marriage)</label>
              <div className="input-currency-wrapper">
                <span className="currency-prefix">₹</span>
                <input
                  id={goalId}
                  type="number"
                  min="0"
                  max="50000000"
                  step="50000"
                  value={futureMajorGoals}
                  onChange={(e) => setFutureMajorGoals(Number(e.target.value))}
                  className="number-input"
                />
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="10000000"
              step="50000"
              value={futureMajorGoals}
              onChange={(e) => setFutureMajorGoals(Number(e.target.value))}
              className="range-slider"
              aria-label="Crucial Family Goals slider"
            />
            <div className="slider-limits">
              <span>₹0</span>
              <span>₹1 Crore</span>
            </div>
          </div>

          {/* Existing Cover & Liquid Assets */}
          <div className="two-col-inputs">
            <div className="form-group">
              <label htmlFor={coverId} className="field-label-sub">Existing Term/Life Cover</label>
              <div className="input-currency-wrapper">
                <span className="currency-prefix">₹</span>
                <input
                  id={coverId}
                  type="number"
                  min="0"
                  max="50000000"
                  step="100000"
                  value={existingLifeCover}
                  onChange={(e) => setExistingLifeCover(Number(e.target.value))}
                  className="number-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor={assetId} className="field-label-sub">Existing Liquid Assets</label>
              <div className="input-currency-wrapper">
                <span className="currency-prefix">₹</span>
                <input
                  id={assetId}
                  type="number"
                  min="0"
                  max="50000000"
                  step="50000"
                  value={existingLiquidAssets}
                  onChange={(e) => setExistingLiquidAssets(Number(e.target.value))}
                  className="number-input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="calc-result-panel">
          <div className="result-hero-box">
            <span className="result-tag">Estimated Protection Gap</span>
            <div className="maturity-number">₹{result.netAdditionalCoverRequired.toLocaleString('en-IN')}</div>
            <p className="result-note">
              Illustrative life cover needed to replace income for {yearsOfIncomeReplacement} years, clear debts, and fund family milestones.
            </p>
          </div>

          {/* Conceptual Formula Breakdown Box */}
          <div className="insurance-formula-card">
            <span className="formula-card-title">How Your Protection Need Is Determined:</span>
            <div className="formula-equation-row">
              <span className="formula-pill add">Income Replacement (₹{result.incomeReplacementNeed.toLocaleString('en-IN')})</span>
              <span className="formula-op">+</span>
              <span className="formula-pill add">Outstanding Debts (₹{result.outstandingLoans.toLocaleString('en-IN')})</span>
              <span className="formula-op">+</span>
              <span className="formula-pill add">Future Goals (₹{result.futureMajorGoals.toLocaleString('en-IN')})</span>
              <span className="formula-op">-</span>
              <span className="formula-pill sub">Existing Cover (₹{existingLifeCover.toLocaleString('en-IN')})</span>
              <span className="formula-op">-</span>
              <span className="formula-pill sub">Liquid Assets (₹{existingLiquidAssets.toLocaleString('en-IN')})</span>
              <span className="formula-op">=</span>
              <span className="formula-pill result">Protection Gap: ₹{result.netAdditionalCoverRequired.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Breakdown Grid */}
          <div className="result-metrics-grid">
            <div className="metric-box">
              <div className="metric-details">
                <span className="metric-title">Gross Family Protection Need</span>
                <span className="metric-value">₹{result.totalGrossRequirement.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="metric-box">
              <div className="metric-details">
                <span className="metric-title">Existing Cushion (Assets + Cover)</span>
                <span className="metric-value">₹{result.totalExistingCushion.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Sub-breakdown rows */}
          <div className="sub-breakdown-card">
            <div className="sub-breakdown-row">
              <span>Income Replacement ({yearsOfIncomeReplacement} yrs)</span>
              <strong>₹{result.incomeReplacementNeed.toLocaleString('en-IN')}</strong>
            </div>
            <div className="sub-breakdown-row">
              <span>Outstanding Debt Clearance</span>
              <strong>₹{result.outstandingLoans.toLocaleString('en-IN')}</strong>
            </div>
            <div className="sub-breakdown-row">
              <span>Children & Family Goals</span>
              <strong>₹{result.futureMajorGoals.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="calc-action-block">
            <a 
              href={`https://wa.me/918087971566?text=${encodeURIComponent(
                `Hi Santhosh, I used the Life Insurance Calculator on Ant Wealth Creation.\n\n` +
                `• Annual Income: ₹${result.annualIncome.toLocaleString('en-IN')}\n` +
                `• Outstanding Loans: ₹${result.outstandingLoans.toLocaleString('en-IN')}\n` +
                `• Existing Life Cover: ₹${result.existingLifeCover.toLocaleString('en-IN')}\n` +
                `• Estimated Protection Gap: ₹${result.netAdditionalCoverRequired.toLocaleString('en-IN')}\n\n` +
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
              We add up what your family would need to clear debts, fund major goals, and replace monthly living expenses, then subtract what you already own to find any remaining protection gap.
            </p>
            <p className="disclaimer-text">
              *This is an illustrative estimate. Actual protection requirements depend on your family's circumstances, liabilities, assets, income, existing cover and future responsibilities. Ant Wealth Creation is an AMFI-Registered Mutual Fund Distributor (ARN: 266896) and does not solicit specific insurance policies.
            </p>
          </div>

          {/* Discovery Banner to Comprehensive 5-Step Tool */}
          <div className="comprehensive-calc-banner">
            <div className="comp-banner-left">
              <span className="comp-banner-badge">Comprehensive Analysis</span>
              <h5 className="comp-banner-title">Need a Comprehensive Protection Analysis?</h5>
              <p className="comp-banner-desc">
                Evaluate individual outstanding loans, milestone goals, discounted family living expenses, inflation, and spouse earnings with our comprehensive 5-step life insurance analysis.
              </p>
            </div>
            <a href="/tools/life-insurance" className="btn-goto-life-insurance">
              Open 5-Step Calculator →
            </a>
          </div>
        </div>
      </div>

      <style>{`
        /* Component-Specific: Formula Breakdown Card */
        .insurance-formula-card {
          background-color: var(--color-bg-light);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: 0.85rem 1rem;
        }

        .formula-card-title {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-slate-muted);
          display: block;
          margin-bottom: 0.5rem;
        }

        .formula-equation-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
        }

        .formula-pill {
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-sm);
          font-weight: 600;
        }

        .formula-pill.add {
          background-color: #EFF6FF;
          color: #1E40AF;
        }

        .formula-pill.sub {
          background-color: #FEF2F2;
          color: #991B1B;
        }

        .formula-pill.result {
          background-color: var(--color-growth-teal-light);
          color: #065F46;
          font-weight: 700;
        }

        .formula-op {
          color: var(--color-slate-light);
          font-weight: 700;
        }

        /* Component-Specific: Sub-breakdown Card */
        .sub-breakdown-card {
          background-color: var(--color-white);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .sub-breakdown-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--color-slate-text);
        }

        .sub-breakdown-row strong {
          color: var(--color-primary-navy);
        }

        /* Component-Specific: Comprehensive Calculator Banner */
        .comprehensive-calc-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          background: linear-gradient(135deg, var(--color-primary-navy) 0%, #002B49 100%);
          border-radius: var(--radius-md);
          padding: 1.25rem 1.5rem;
          margin-top: 1.5rem;
          color: var(--color-white);
        }

        .comp-banner-left {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .comp-banner-badge {
          display: inline-block;
          width: fit-content;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background: rgba(0, 171, 150, 0.2);
          color: var(--color-growth-teal);
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          margin-bottom: 0.25rem;
        }

        .comp-banner-title {
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 700;
          color: var(--color-white);
          margin: 0;
        }

        .comp-banner-desc {
          font-size: 0.8rem;
          color: #CBD5E1;
          line-height: 1.4;
          margin: 0;
        }

        .btn-goto-life-insurance {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          background: var(--color-growth-teal);
          color: var(--color-white);
          font-size: 0.85rem;
          font-weight: 700;
          padding: 0.65rem 1rem;
          border-radius: var(--radius-sm);
          text-decoration: none;
          white-space: nowrap;
          transition: all var(--transition-fast);
        }

        .btn-goto-life-insurance:hover {
          background: var(--color-growth-teal-hover);
          transform: translateY(-1px);
        }

        .btn-goto-life-insurance:focus-visible {
          outline: 2px solid var(--color-white);
          outline-offset: 2px;
        }

        @media (max-width: 900px) {
          .comprehensive-calc-banner {
            flex-direction: column;
            align-items: stretch;
          }
          .btn-goto-life-insurance {
            text-align: center;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
