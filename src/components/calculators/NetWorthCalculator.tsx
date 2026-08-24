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
                <label className="field-label-compact">Bank Savings & FDs</label>
                <div className="input-currency-wrapper">
                  <span className="currency-prefix">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    value={bankSavings}
                    onChange={(e) => setBankSavings(Number(e.target.value))}
                    className="number-input"
                  />
                </div>
              </div>

              <div className="form-group-compact">
                <label className="field-label-compact">Mutual Funds</label>
                <div className="input-currency-wrapper">
                  <span className="currency-prefix">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    value={mutualFunds}
                    onChange={(e) => setMutualFunds(Number(e.target.value))}
                    className="number-input"
                  />
                </div>
              </div>

              <div className="form-group-compact">
                <label className="field-label-compact">Direct Stocks & Shares</label>
                <div className="input-currency-wrapper">
                  <span className="currency-prefix">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    value={stocks}
                    onChange={(e) => setStocks(Number(e.target.value))}
                    className="number-input"
                  />
                </div>
              </div>

              <div className="form-group-compact">
                <label className="field-label-compact">EPF / PPF / NPS</label>
                <div className="input-currency-wrapper">
                  <span className="currency-prefix">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    value={epfPpf}
                    onChange={(e) => setEpfPpf(Number(e.target.value))}
                    className="number-input"
                  />
                </div>
              </div>

              <div className="form-group-compact">
                <label className="field-label-compact">Gold & SGBs</label>
                <div className="input-currency-wrapper">
                  <span className="currency-prefix">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    value={gold}
                    onChange={(e) => setGold(Number(e.target.value))}
                    className="number-input"
                  />
                </div>
              </div>

              <div className="form-group-compact">
                <label className="field-label-compact">Real Estate / Land</label>
                <div className="input-currency-wrapper">
                  <span className="currency-prefix">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="50000"
                    value={realEstate}
                    onChange={(e) => setRealEstate(Number(e.target.value))}
                    className="number-input"
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
                <label className="field-label-compact">Home Loan</label>
                <div className="input-currency-wrapper">
                  <span className="currency-prefix">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="25000"
                    value={homeLoan}
                    onChange={(e) => setHomeLoan(Number(e.target.value))}
                    className="number-input"
                  />
                </div>
              </div>

              <div className="form-group-compact">
                <label className="field-label-compact">Car / Vehicle Loan</label>
                <div className="input-currency-wrapper">
                  <span className="currency-prefix">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    value={carLoan}
                    onChange={(e) => setCarLoan(Number(e.target.value))}
                    className="number-input"
                  />
                </div>
              </div>

              <div className="form-group-compact">
                <label className="field-label-compact">Personal / Other Loans</label>
                <div className="input-currency-wrapper">
                  <span className="currency-prefix">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    value={personalLoan}
                    onChange={(e) => setPersonalLoan(Number(e.target.value))}
                    className="number-input"
                  />
                </div>
              </div>

              <div className="form-group-compact">
                <label className="field-label-compact">Credit Card Dues</label>
                <div className="input-currency-wrapper">
                  <span className="currency-prefix">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="5000"
                    value={creditCardDebt}
                    onChange={(e) => setCreditCardDebt(Number(e.target.value))}
                    className="number-input"
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
              href={`https://wa.me/918087971566?text=Hi%20Santhosh,%20I%20just%20calculated%20my%20Net%20Worth%20of%20₹${result.netWorth}%20on%20Ant%20Wealth%20Creation%20and%20would%20like%20to%20review%20my%20asset%20allocation.`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-whatsapp-consult"
            >
              Optimize Your Portfolio with Santhosh
            </a>
            <a href="/contact" className="btn-book-consult">
              Book a Comprehensive Portfolio Checkup
            </a>
          </div>

          {/* Explanation */}
          <div className="calc-explanation">
            <h4>Balance Sheet Insights</h4>
            <p>
              Maintaining a debt-to-asset ratio under 30% and having at least 20–40% in liquid growth assets (mutual funds & equities) ensures strong resilience against financial shocks and high long-term compounding velocity.
            </p>
            <p className="disclaimer-text">
              *Illustrative financial-health benchmark. Actual requirements vary based on individual circumstances.
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

        .networth-grid {
          display: grid;
          grid-template-columns: 1fr 1.05fr;
          gap: 2.5rem;
          align-items: start;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
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

        .inventory-section {
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.25rem;
        }

        .inventory-title {
          font-size: 0.9rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
        }

        .title-teal { color: #00AB96; }
        .title-navy { color: #00182A; }

        .two-col-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem 1rem;
        }

        .form-group-compact {
          margin-bottom: 0.75rem;
        }

        .field-label-compact {
          font-size: 0.8rem;
          font-weight: 600;
          color: #334155;
          margin-bottom: 0.25rem;
          display: block;
        }

        .input-currency-wrapper {
          display: flex;
          align-items: center;
          background-color: #FFFFFF;
          border: 1.5px solid #CBD5E1;
          border-radius: 8px;
          padding: 0.25rem 0.5rem;
          font-weight: 600;
          color: #00182A;
        }

        .currency-prefix {
          color: #64748B;
          font-size: 0.85rem;
          margin-right: 2px;
        }

        .number-input {
          width: 100%;
          border: none;
          background: transparent;
          font-size: 0.95rem;
          font-weight: 700;
          color: #00182A;
          text-align: right;
          outline: none;
        }

        .mt-4 {
          margin-top: 1.25rem;
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

        .asset-composition-card {
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 1.25rem;
        }

        .asset-comp-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: #00182A;
          display: block;
          margin-bottom: 0.75rem;
        }

        .comp-bar-container {
          height: 12px;
          background-color: #E2E8F0;
          border-radius: 9999px;
          display: flex;
          overflow: hidden;
          margin-bottom: 0.75rem;
        }

        .comp-segment {
          height: 100%;
          transition: width 0.3s ease;
        }

        .seg-mf { background-color: #00AB96; }
        .seg-stocks { background-color: #2563EB; }
        .seg-re { background-color: #00182A; }
        .seg-gold { background-color: #F59E0B; }
        .seg-epf { background-color: #8B5CF6; }
        .seg-bank { background-color: #94A3B8; }

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
          color: #475569;
        }

        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
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
          .networth-grid {
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

          .asset-liability-row {
            flex-direction: column;
            align-items: stretch;
            gap: 0.35rem;
          }

          .item-label {
            font-size: 0.875rem;
          }

          .input-currency-wrapper {
            width: 100%;
            justify-content: space-between;
            padding: 0.4rem 0.75rem;
          }

          .number-input {
            width: 100%;
            flex: 1;
            font-size: 1rem;
          }

          .networth-hero-box {
            padding: 1.25rem 1rem;
          }

          .networth-number {
            font-size: 1.85rem;
          }

          .networth-words {
            font-size: 1rem;
          }

          .summary-card {
            padding: 0.75rem 0.85rem;
          }
        }
      `}</style>
    </div>
  );
}
