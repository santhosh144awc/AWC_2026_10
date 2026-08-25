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
            <span className="result-tag">Recommended Pure Term Cover</span>
            <div className="maturity-number">₹{result.netAdditionalCoverRequired.toLocaleString('en-IN')}</div>
            <p className="result-note">
              Comprehensive protection calculated to replace income for {yearsOfIncomeReplacement} years and clear all liabilities.
            </p>
          </div>

          {/* Breakdown Grid */}
          <div className="result-metrics-grid">
            <div className="metric-box">
              <div className="metric-details">
                <span className="metric-title">Gross Protection Need</span>
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
              href={`https://wa.me/918087971566?text=Hi%20Santhosh,%20I%20used%20the%20Insurance%20Calculator%20and%20calculated%20a%20pure%20term%20cover%20need%20of%20₹${result.netAdditionalCoverRequired}.%20Can%20we%20review%20my%20insurance?`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-whatsapp-consult"
            >
              Review Life Cover with Santhosh
            </a>
            <a href="/contact" className="btn-book-consult">
              Book a Free Risk & Protection Review
            </a>
          </div>

          {/* Explanation */}
          <div className="calc-explanation">
            <h4>Needs-Based Protection Philosophy</h4>
            <p>
              Rather than using a rigid rule of thumb (e.g. 10x salary), this tool uses the comprehensive Needs-Based Human Life Value approach: calculating the exact capital needed to sustain your family's lifestyle, pay off debts, and safeguard milestone goals minus your existing assets.
            </p>
            <p className="disclaimer-text">
              *Illustrative financial-health benchmark. Actual requirements vary based on individual circumstances. Ant Wealth Creation does not solicit specific insurance policies or promise insurer payouts.
            </p>
          </div>

          {/* Discovery Banner to Comprehensive 5-Step Tool */}
          <div className="comprehensive-calc-banner">
            <div className="comp-banner-left">
              <span className="comp-banner-badge">QPFP Advanced Tool</span>
              <h5 className="comp-banner-title">Need a Comprehensive Protection Analysis?</h5>
              <p className="comp-banner-desc">
                Evaluate individual outstanding loans, milestone goals, discounted family living expenses, inflation, and spouse earnings with our 5-step Annuity-Due calculator.
              </p>
            </div>
            <a href="/tools/life-insurance" className="btn-goto-life-insurance">
              Open 5-Step Calculator →
            </a>
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

        .sub-breakdown-card {
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .sub-breakdown-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: #475569;
        }

        .sub-breakdown-row strong {
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

        .comprehensive-calc-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          background: linear-gradient(135deg, #00182A 0%, #002B49 100%);
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
          margin-top: 1.5rem;
          color: #FFFFFF;
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
          color: #00AB96;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          margin-bottom: 0.25rem;
        }

        .comp-banner-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #FFFFFF;
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
          background: #00AB96;
          color: #FFFFFF;
          font-size: 0.85rem;
          font-weight: 700;
          padding: 0.65rem 1rem;
          border-radius: 8px;
          text-decoration: none;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .btn-goto-life-insurance:hover {
          background: #008f7d;
          transform: translateY(-1px);
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

        @media (max-width: 900px) {
          .calc-grid {
            grid-template-columns: 1fr;
          }
          .calc-container {
            padding: 1.5rem;
          }
          .two-col-inputs {
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

          .breakdown-row {
            flex-direction: column;
            gap: 0.35rem;
            padding: 0.6rem 0.85rem;
          }
        }
      `}</style>
    </div>
  );
}
