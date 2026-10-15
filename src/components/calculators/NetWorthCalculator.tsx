import React, { useState, useId } from 'react';
import { calculateNetWorth } from '../../utils/calculations/netWorth';

export default function NetWorthCalculator() {
  const [bankSavings, setBankSavings] = useState(250000);
  const [mutualFunds, setMutualFunds] = useState(1200000);
  const [stocks, setStocks] = useState(400000);
  const [epfPpf, setEpfPpf] = useState(850000);
  const [gold, setGold] = useState(500000);
  const [realEstate, setRealEstate] = useState(4500000);
  const [otherAssets, setOtherAssets] = useState(100000);

  const [homeLoan, setHomeLoan] = useState(2200000);
  const [personalLoan, setPersonalLoan] = useState(0);
  const [carLoan, setCarLoan] = useState(250000);
  const [creditCardDebt, setCreditCardDebt] = useState(15000);
  const [otherLiabilities, setOtherLiabilities] = useState(0);

  const result = calculateNetWorth({
    assets: {
      bankSavings: Number(bankSavings) || 0,
      mutualFunds: Number(mutualFunds) || 0,
      stocks: Number(stocks) || 0,
      epfPpf: Number(epfPpf) || 0,
      gold: Number(gold) || 0,
      realEstate: Number(realEstate) || 0,
      otherAssets: Number(otherAssets) || 0
    },
    liabilities: {
      homeLoan: Number(homeLoan) || 0,
      personalLoan: Number(personalLoan) || 0,
      carLoan: Number(carLoan) || 0,
      creditCardDebt: Number(creditCardDebt) || 0,
      otherLiabilities: Number(otherLiabilities) || 0
    }
  });

  const handleReset = () => {
    setBankSavings(250000);
    setMutualFunds(1200000);
    setStocks(400000);
    setEpfPpf(850000);
    setGold(500000);
    setRealEstate(4500000);
    setOtherAssets(100000);

    setHomeLoan(2200000);
    setPersonalLoan(0);
    setCarLoan(250000);
    setCreditCardDebt(15000);
    setOtherLiabilities(0);
  };

  const baseId = useId();

  return (
    <div className="calc-container">
      <div className="networth-grid">
        {/* Left: Asset & Liability Inputs */}
        <div className="networth-inputs-panel">
          <div className="panel-header">
            <h2 className="panel-title">Asset & Liability Inventory</h2>
            <button onClick={handleReset} className="reset-btn" title="Reset all values">
              ↺ Reset
            </button>
          </div>

          {/* Assets Section */}
          <div className="inventory-section">
            <h3 className="inventory-title title-teal">Assets (What You Own)</h3>
            
            <div className="two-col-inputs">
              <div className="form-group-compact">
                <label htmlFor={`${baseId}-bankSavings`} className="field-label-compact">Bank Savings & FDs</label>
                <div className="input-currency-wrapper">
                  <span className="currency-prefix">₹</span>
                  <input
                    id={`${baseId}-bankSavings`}
                    type="number"
                    min="0"
                    step="10000"
                    value={bankSavings}
                    onChange={(e) => setBankSavings(Number(e.target.value))}
                    className="number-input"
                    aria-label="Bank Savings & Fixed Deposits asset"
                  />
                </div>
              </div>

              <div className="form-group-compact">
                <label htmlFor={`${baseId}-mutualFunds`} className="field-label-compact">Mutual Funds</label>
                <div className="input-currency-wrapper">
                  <span className="currency-prefix">₹</span>
                  <input
                    id={`${baseId}-mutualFunds`}
                    type="number"
                    min="0"
                    step="10000"
                    value={mutualFunds}
                    onChange={(e) => setMutualFunds(Number(e.target.value))}
                    className="number-input"
                    aria-label="Mutual Funds asset"
                  />
                </div>
              </div>

              <div className="form-group-compact">
                <label htmlFor={`${baseId}-stocks`} className="field-label-compact">Direct Stocks & Shares</label>
                <div className="input-currency-wrapper">
                  <span className="currency-prefix">₹</span>
                  <input
                    id={`${baseId}-stocks`}
                    type="number"
                    min="0"
                    step="10000"
                    value={stocks}
                    onChange={(e) => setStocks(Number(e.target.value))}
                    className="number-input"
                    aria-label="Direct Stocks & Shares asset"
                  />
                </div>
              </div>

              <div className="form-group-compact">
                <label htmlFor={`${baseId}-epfPpf`} className="field-label-compact">EPF / PPF / NPS</label>
                <div className="input-currency-wrapper">
                  <span className="currency-prefix">₹</span>
                  <input
                    id={`${baseId}-epfPpf`}
                    type="number"
                    min="0"
                    step="10000"
                    value={epfPpf}
                    onChange={(e) => setEpfPpf(Number(e.target.value))}
                    className="number-input"
                    aria-label="EPF, PPF, and NPS retirement savings asset"
                  />
                </div>
              </div>

              <div className="form-group-compact">
                <label htmlFor={`${baseId}-gold`} className="field-label-compact">Gold & SGBs</label>
                <div className="input-currency-wrapper">
                  <span className="currency-prefix">₹</span>
                  <input
                    id={`${baseId}-gold`}
                    type="number"
                    min="0"
                    step="10000"
                    value={gold}
                    onChange={(e) => setGold(Number(e.target.value))}
                    className="number-input"
                    aria-label="Gold and Sovereign Gold Bonds asset"
                  />
                </div>
              </div>

              <div className="form-group-compact">
                <label htmlFor={`${baseId}-realEstate`} className="field-label-compact">Real Estate / Land</label>
                <div className="input-currency-wrapper">
                  <span className="currency-prefix">₹</span>
                  <input
                    id={`${baseId}-realEstate`}
                    type="number"
                    min="0"
                    step="50000"
                    value={realEstate}
                    onChange={(e) => setRealEstate(Number(e.target.value))}
                    className="number-input"
                    aria-label="Real Estate and Land asset"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Liabilities Section */}
          <div className="inventory-section mt-4">
            <h3 className="inventory-title title-navy">Liabilities (What You Owe)</h3>

            <div className="two-col-inputs">
              <div className="form-group-compact">
                <label htmlFor={`${baseId}-homeLoan`} className="field-label-compact">Home Loan</label>
                <div className="input-currency-wrapper">
                  <span className="currency-prefix">₹</span>
                  <input
                    id={`${baseId}-homeLoan`}
                    type="number"
                    min="0"
                    step="25000"
                    value={homeLoan}
                    onChange={(e) => setHomeLoan(Number(e.target.value))}
                    className="number-input"
                    aria-label="Home Loan liability"
                  />
                </div>
              </div>

              <div className="form-group-compact">
                <label htmlFor={`${baseId}-carLoan`} className="field-label-compact">Car / Vehicle Loan</label>
                <div className="input-currency-wrapper">
                  <span className="currency-prefix">₹</span>
                  <input
                    id={`${baseId}-carLoan`}
                    type="number"
                    min="0"
                    step="10000"
                    value={carLoan}
                    onChange={(e) => setCarLoan(Number(e.target.value))}
                    className="number-input"
                    aria-label="Car or Vehicle Loan liability"
                  />
                </div>
              </div>

              <div className="form-group-compact">
                <label htmlFor={`${baseId}-personalLoan`} className="field-label-compact">Personal / Other Loans</label>
                <div className="input-currency-wrapper">
                  <span className="currency-prefix">₹</span>
                  <input
                    id={`${baseId}-personalLoan`}
                    type="number"
                    min="0"
                    step="10000"
                    value={personalLoan}
                    onChange={(e) => setPersonalLoan(Number(e.target.value))}
                    className="number-input"
                    aria-label="Personal and Other Loans liability"
                  />
                </div>
              </div>

              <div className="form-group-compact">
                <label htmlFor={`${baseId}-creditCardDebt`} className="field-label-compact">Credit Card Dues</label>
                <div className="input-currency-wrapper">
                  <span className="currency-prefix">₹</span>
                  <input
                    id={`${baseId}-creditCardDebt`}
                    type="number"
                    min="0"
                    step="5000"
                    value={creditCardDebt}
                    onChange={(e) => setCreditCardDebt(Number(e.target.value))}
                    className="number-input"
                    aria-label="Credit Card Dues liability"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Net Worth Results */}
        <div className="calc-result-panel">
          <div className="result-hero-box">
            <span className="result-tag">Your Net Financial Worth</span>
            <div className="maturity-number">₹{result.netWorth.toLocaleString('en-IN')}</div>
            <p className="result-note">
              Total Assets (₹{result.totalAssets.toLocaleString('en-IN')}) minus Total Liabilities (₹{result.totalLiabilities.toLocaleString('en-IN')}).
            </p>
          </div>

          {/* Key Financial Ratios */}
          <div className="result-metrics-grid">
            <div className="metric-box">
              <div className="metric-details">
                <span className="metric-title">Liquid Assets (Bank+MF+Stocks)</span>
                <span className="metric-value">₹{result.liquidAssets.toLocaleString('en-IN')} ({result.liquidPercentage}%)</span>
              </div>
            </div>

            <div className="metric-box">
              <div className="metric-details">
                <span className="metric-title">Debt-to-Asset Ratio</span>
                <span className="metric-value">{result.debtToAssetRatio}%</span>
              </div>
            </div>
          </div>

          {/* Assets Breakdown Bar */}
          <div className="asset-composition-card">
            <span className="asset-comp-title">Asset Allocation Distribution</span>
            <div className="comp-bar-container">
              <div className="comp-segment seg-mf" style={{ width: `${result.assetPercentages.mutualFunds}%` }} title={`Mutual Funds: ${result.assetPercentages.mutualFunds}%`} />
              <div className="comp-segment seg-stocks" style={{ width: `${result.assetPercentages.stocks}%` }} title={`Stocks: ${result.assetPercentages.stocks}%`} />
              <div className="comp-segment seg-re" style={{ width: `${result.assetPercentages.realEstate}%` }} title={`Real Estate: ${result.assetPercentages.realEstate}%`} />
              <div className="comp-segment seg-gold" style={{ width: `${result.assetPercentages.gold}%` }} title={`Gold: ${result.assetPercentages.gold}%`} />
              <div className="comp-segment seg-epf" style={{ width: `${result.assetPercentages.epfPpf}%` }} title={`EPF/PPF: ${result.assetPercentages.epfPpf}%`} />
              <div className="comp-segment seg-bank" style={{ width: `${result.assetPercentages.bankSavings}%` }} title={`Bank: ${result.assetPercentages.bankSavings}%`} />
            </div>

            <div className="comp-legend-grid">
              <div className="legend-item"><span className="legend-dot seg-mf"></span> MF ({result.assetPercentages.mutualFunds}%)</div>
              <div className="legend-item"><span className="legend-dot seg-stocks"></span> Stocks ({result.assetPercentages.stocks}%)</div>
              <div className="legend-item"><span className="legend-dot seg-re"></span> Real Estate ({result.assetPercentages.realEstate}%)</div>
              <div className="legend-item"><span className="legend-dot seg-gold"></span> Gold ({result.assetPercentages.gold}%)</div>
              <div className="legend-item"><span className="legend-dot seg-epf"></span> EPF ({result.assetPercentages.epfPpf}%)</div>
              <div className="legend-item"><span className="legend-dot seg-bank"></span> Bank ({result.assetPercentages.bankSavings}%)</div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="calc-action-block">
            <a 
              href={`https://wa.me/918087971566?text=${encodeURIComponent(
                `Hi Santhosh, I used the Net Worth Calculator on Ant Wealth Creation.\n\n` +
                `• Total Assets: ₹${result.totalAssets.toLocaleString('en-IN')}\n` +
                `• Total Liabilities: ₹${result.totalLiabilities.toLocaleString('en-IN')}\n` +
                `• Net Worth: ₹${result.netWorth.toLocaleString('en-IN')}\n` +
                `• Debt-to-Asset Ratio: ${result.debtToAssetRatio}%\n\n` +
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
              Your net worth is everything you own (savings, mutual funds, property, gold) minus everything you owe (home loans, personal loans, credit cards). Having a healthy share of growth assets helps protect your long-term purchasing power.
            </p>
            <p className="disclaimer-text">
              *Illustrative financial-health benchmark. Actual requirements vary based on individual circumstances.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        /* Component-Specific: Inventory Input Sections */
        .inventory-section {
          background-color: var(--color-bg-light);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 1.25rem;
        }

        .inventory-title {
          font-size: 0.9rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
        }

        .title-teal { color: var(--color-growth-teal); }
        .title-navy { color: var(--color-primary-navy); }

        .form-group-compact {
          margin-bottom: 0.75rem;
        }

        .field-label-compact {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--color-slate-text);
          margin-bottom: 0.25rem;
          display: block;
        }

        .mt-4 {
          margin-top: 1.25rem;
        }

        /* Component-Specific: Asset Composition Card & Stacked Bar */
        .asset-composition-card {
          background-color: var(--color-white);
          border: 1px solid var(--color-border);
          border-radius: 10px;
          padding: 1.25rem;
        }

        .asset-comp-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-primary-navy);
          display: block;
          margin-bottom: 0.75rem;
        }

        .comp-bar-container {
          height: 12px;
          background-color: var(--color-border);
          border-radius: 9999px;
          display: flex;
          overflow: hidden;
          margin-bottom: 0.75rem;
        }

        .comp-segment {
          height: 100%;
          transition: width 0.3s ease;
        }

        .seg-mf { background-color: var(--color-growth-teal); }
        .seg-stocks { background-color: #2563EB; }
        .seg-re { background-color: var(--color-primary-navy); }
        .seg-gold { background-color: var(--color-warm-gold); }
        .seg-epf { background-color: #8B5CF6; }
        .seg-bank { background-color: var(--color-slate-light); }

        .comp-legend-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-slate-text);
        }

        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
        }

        @media (max-width: 540px) {
          .comp-legend-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
