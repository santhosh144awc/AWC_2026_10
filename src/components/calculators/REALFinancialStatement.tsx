import React, { useState, useId } from 'react';
import {
  calculateRealStatement,
  DEFAULT_INCOME_INPUT,
  DEFAULT_EXPENSES_INPUT,
  DEFAULT_INVESTMENTS_INPUT,
  DEFAULT_ASSETS_INPUT,
  DEFAULT_LIABILITIES_INPUT,
  type IncomeInput,
  type ExpensesInput,
  type InvestmentsInput,
  type AssetsInput,
  type LiabilitiesInput,
  type RealStatementInput,
  type RealStatementResult,
} from '../../utils/calculations/realFinancialStatement';

function formatIndianCurrency(amount: number): string {
  if (isNaN(amount) || amount === 0) return '₹0';
  const prefix = amount < 0 ? '-₹' : '₹';
  return `${prefix}${Math.abs(amount).toLocaleString('en-IN')}`;
}

function formatLakhsCrores(amount: number): string {
  if (isNaN(amount) || amount === 0) return '₹0';
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const prefix = isNegative ? '-₹' : '₹';

  if (absAmount >= 10000000) {
    const cr = absAmount / 10000000;
    return `${prefix}${cr.toFixed(2)} Cr`;
  }
  if (absAmount >= 100000) {
    const lk = absAmount / 100000;
    return `${prefix}${lk.toFixed(2)} Lakh`;
  }
  return `${prefix}${absAmount.toLocaleString('en-IN')}`;
}

// Sample scenario for user quick demonstration
const SAMPLE_INPUT: RealStatementInput = {
  income: {
    primarySalary: 1800000,
    spouseSalary: 600000,
    bonus: 120000,
    businessIncome: 0,
    rentalIncome: 0,
    investmentIncome: 24000,
    otherIncome: 0,
  },
  expenses: {
    household: {
      rent: 0,
      groceries: 22000,
      transport: 7000,
      utilities: 5000,
      domesticHelp: 4000,
      otherHousehold: 3000,
    },
    lifestyle: {
      shopping: 6000,
      dining: 5000,
      travel: 4000,
      personalCare: 3000,
      hobbies: 2000,
      otherLifestyle: 0,
    },
    family: {
      education: 12000,
      dependents: 6000,
      otherFamily: 0,
    },
    insurance: {
      lifeInsurance: 4000,
      healthInsurance: 3000,
      generalInsurance: 1000,
    },
    loanEmis: {
      homeLoanEmi: 32000,
      vehicleLoanEmi: 6000,
      otherLoanEmi: 0,
    },
  },
  investments: {
    mutualFundSips: 35000,
    recurringDepositsPolicies: 10000,
    otherInvestments: 5000,
  },
  assets: {
    liquid: {
      savingsBank: 150000,
      cash: 30000,
      liquidFunds: 200000,
    },
    debt: {
      fixedDeposits: 400000,
      ppf: 300000,
      epf: 600000,
      npsDebt: 100000,
      debtMutualFunds: 100000,
      bondsOther: 0,
    },
    equity: {
      directEquity: 600000,
      equityMutualFunds: 1200000,
      npsEquity: 200000,
      ulips: 0,
    },
    gold: {
      physicalGold: 300000,
      goldEtfsSgb: 150000,
    },
    realEstate: {
      primaryResidence: 4500000,
      investmentProperty: 0,
      land: 0,
      reits: 0,
    },
    personal: {
      vehicles: 400000,
      jewellery: 300000,
      otherPersonal: 100000,
    },
  },
  liabilities: {
    homeLoan: 2200000,
    vehicleLoan: 150000,
    personalLoan: 0,
    educationLoan: 0,
    otherLoans: 0,
    creditCardDebt: 25000,
  },
};

type FormStep = 1 | 2 | 3 | 4 | 5 | 'results';

export default function REALFinancialStatement() {
  const [step, setStep] = useState<FormStep>(1);
  const [income, setIncome] = useState<IncomeInput>(DEFAULT_INCOME_INPUT);
  const [expenses, setExpenses] = useState<ExpensesInput>(DEFAULT_EXPENSES_INPUT);
  const [investments, setInvestments] = useState<InvestmentsInput>(DEFAULT_INVESTMENTS_INPUT);
  const [assets, setAssets] = useState<AssetsInput>(DEFAULT_ASSETS_INPUT);
  const [liabilities, setLiabilities] = useState<LiabilitiesInput>(DEFAULT_LIABILITIES_INPUT);

  // Accordion expansion states
  const [openExpenseAccordions, setOpenExpenseAccordions] = useState<Record<string, boolean>>({
    household: true,
    lifestyle: false,
    family: false,
    insurance: false,
    loanEmis: false,
  });

  const [openAssetAccordions, setOpenAssetAccordions] = useState<Record<string, boolean>>({
    liquid: true,
    debt: false,
    equity: false,
    gold: false,
    realEstate: false,
    personal: false,
  });

  // Calculate live results
  const result: RealStatementResult = calculateRealStatement({
    income,
    expenses,
    investments,
    assets,
    liabilities,
  });

  const toggleExpenseAccordion = (category: string) => {
    setOpenExpenseAccordions((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const toggleAssetAccordion = (category: string) => {
    setOpenAssetAccordions((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const loadSampleData = () => {
    setIncome(SAMPLE_INPUT.income);
    setExpenses(SAMPLE_INPUT.expenses);
    setInvestments(SAMPLE_INPUT.investments);
    setAssets(SAMPLE_INPUT.assets);
    setLiabilities(SAMPLE_INPUT.liabilities);
    setStep('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetAllData = () => {
    setIncome(DEFAULT_INCOME_INPUT);
    setExpenses(DEFAULT_EXPENSES_INPUT);
    setInvestments(DEFAULT_INVESTMENTS_INPUT);
    setAssets(DEFAULT_ASSETS_INPUT);
    setLiabilities(DEFAULT_LIABILITIES_INPUT);
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextStep = () => {
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else if (step === 3) setStep(4);
    else if (step === 4) setStep(5);
    else if (step === 5) setStep('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
    else if (step === 4) setStep(3);
    else if (step === 5) setStep(4);
    else if (step === 'results') setStep(5);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // WhatsApp formatted share link
  const getWhatsAppMessageUrl = () => {
    const summaryText = `Hi Santhosh, I completed my REAL Financial Statement on Ant Wealth Creation.\n\n*My Financial Snapshot:*\n• Annual Income: ${formatLakhsCrores(result.income.totalAnnualIncome)}\n• Annual Expenses: ${formatLakhsCrores(result.expenses.totalAnnualExpenses)}\n• Annual Savings: ${formatLakhsCrores(result.savings.annualSavings)} (${result.savings.savingsRate}% Savings Rate)\n• Ongoing Investments: ${formatRupees(result.investments.totalMonthlyInvestments)}/mo\n• Surplus for New Investments: ${formatRupees(result.surplus.monthlySurplus)}/mo\n• Total Assets: ${formatLakhsCrores(result.assets.totalAssets)}\n• Total Liabilities: ${formatLakhsCrores(result.liabilities.totalLiabilities)}\n• *Actual Net Worth:* ${formatLakhsCrores(result.actualNetWorth)}\n\nI would like to discuss turning this snapshot into a disciplined mutual fund investment roadmap.`;
    return `https://wa.me/918087971566?text=${encodeURIComponent(summaryText)}`;
  };

  const formatRupees = (val: number) => {
    if (isNaN(val) || val === 0) return '₹0';
    return `₹${Math.abs(val).toLocaleString('en-IN')}`;
  };

  const stepNumbers: { num: FormStep; label: string; icon: string }[] = [
    { num: 1, label: 'Income', icon: '💰' },
    { num: 2, label: 'Expenses', icon: '🧾' },
    { num: 3, label: 'Investing', icon: '📈' },
    { num: 4, label: 'Assets', icon: '🏦' },
    { num: 5, label: 'Liabilities', icon: '💳' },
  ];

  return (
    <div className="real-statement-container">
      {/* Quick Action Top Bar */}
      <div className="planner-top-actions">
        <div className="tool-badge">
          <span className="badge-pulse"></span>
          5-Step Financial Assessment
        </div>
        <div className="sample-btn-group">
          <button type="button" onClick={loadSampleData} className="btn-secondary-sm">
            ⚡ Fill Sample Example
          </button>
          <button type="button" onClick={resetAllData} className="btn-secondary-sm">
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Stepper Navigation */}
      <nav className="stepper-nav" aria-label="Assessment Steps">
        {stepNumbers.map((s) => {
          const isActive = step === s.num;
          const isCompleted = typeof step === 'number' ? step > (s.num as number) : true;
          return (
            <button
              key={s.num}
              type="button"
              onClick={() => setStep(s.num)}
              className={`step-pill ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
            >
              <span className="step-icon">{s.icon}</span>
              <span className="step-num">{s.num}</span>
              <span className="step-label">{s.label}</span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setStep('results')}
          className={`step-pill results-pill ${step === 'results' ? 'active' : ''}`}
        >
          <span className="step-icon">📊</span>
          <span className="step-label">Snapshot</span>
        </button>
      </nav>

      {/* STEP 1: INCOME */}
      {step === 1 && (
        <section className="step-card fade-in">
          <div className="step-header">
            <div>
              <span className="step-subtitle">Step 1 of 5</span>
              <h2 className="step-title">Annual Income Sources</h2>
              <p className="step-desc">
                Enter your annual gross income. Annual earnings represent the source of truth for planning.
              </p>
            </div>
            <div className="live-stat-card">
              <span className="stat-label">Total Annual Income</span>
              <span className="stat-value">{formatLakhsCrores(result.income.totalAnnualIncome)}</span>
              <span className="stat-sub">≈ {formatIndianCurrency(result.income.monthlyEquivalentIncome)} / month</span>
            </div>
          </div>

          <div className="inputs-grid">
            <div className="input-field">
              <label htmlFor="primarySalary" className="input-label">
                Primary Person Annual Salary (₹/yr)
              </label>
              <div className="input-wrapper">
                <span className="input-prefix">₹</span>
                <input
                  id="primarySalary"
                  type="number"
                  min="0"
                  step="10000"
                  value={income.primarySalary || ''}
                  onChange={(e) => setIncome({ ...income, primarySalary: Math.max(0, Number(e.target.value)) })}
                  placeholder="e.g. 1200000"
                  className="number-input"
                />
              </div>
              <span className="input-helper">{formatLakhsCrores(income.primarySalary)}</span>
            </div>

            <div className="input-field">
              <label htmlFor="spouseSalary" className="input-label">
                Spouse Annual Salary (₹/yr) <span className="optional-tag">(Optional)</span>
              </label>
              <div className="input-wrapper">
                <span className="input-prefix">₹</span>
                <input
                  id="spouseSalary"
                  type="number"
                  min="0"
                  step="10000"
                  value={income.spouseSalary || ''}
                  onChange={(e) => setIncome({ ...income, spouseSalary: Math.max(0, Number(e.target.value)) })}
                  placeholder="e.g. 600000"
                  className="number-input"
                />
              </div>
              <span className="input-helper">{formatLakhsCrores(income.spouseSalary)}</span>
            </div>

            <div className="input-field">
              <label htmlFor="bonus" className="input-label">
                Annual Performance Bonus (₹/yr)
              </label>
              <div className="input-wrapper">
                <span className="input-prefix">₹</span>
                <input
                  id="bonus"
                  type="number"
                  min="0"
                  step="10000"
                  value={income.bonus || ''}
                  onChange={(e) => setIncome({ ...income, bonus: Math.max(0, Number(e.target.value)) })}
                  placeholder="e.g. 100000"
                  className="number-input"
                />
              </div>
              <span className="input-helper">{formatLakhsCrores(income.bonus)}</span>
            </div>

            <div className="input-field">
              <label htmlFor="businessIncome" className="input-label">
                Business / Professional Income (₹/yr)
              </label>
              <div className="input-wrapper">
                <span className="input-prefix">₹</span>
                <input
                  id="businessIncome"
                  type="number"
                  min="0"
                  step="10000"
                  value={income.businessIncome || ''}
                  onChange={(e) => setIncome({ ...income, businessIncome: Math.max(0, Number(e.target.value)) })}
                  placeholder="e.g. 300000"
                  className="number-input"
                />
              </div>
              <span className="input-helper">{formatLakhsCrores(income.businessIncome)}</span>
            </div>

            <div className="input-field">
              <label htmlFor="rentalIncome" className="input-label">
                Annual Rental Income (₹/yr)
              </label>
              <div className="input-wrapper">
                <span className="input-prefix">₹</span>
                <input
                  id="rentalIncome"
                  type="number"
                  min="0"
                  step="10000"
                  value={income.rentalIncome || ''}
                  onChange={(e) => setIncome({ ...income, rentalIncome: Math.max(0, Number(e.target.value)) })}
                  placeholder="e.g. 180000"
                  className="number-input"
                />
              </div>
              <span className="input-helper">{formatLakhsCrores(income.rentalIncome)}</span>
            </div>

            <div className="input-field">
              <label htmlFor="investmentIncome" className="input-label">
                Dividends & Interest Income (₹/yr)
              </label>
              <div className="input-wrapper">
                <span className="input-prefix">₹</span>
                <input
                  id="investmentIncome"
                  type="number"
                  min="0"
                  step="5000"
                  value={income.investmentIncome || ''}
                  onChange={(e) => setIncome({ ...income, investmentIncome: Math.max(0, Number(e.target.value)) })}
                  placeholder="e.g. 24000"
                  className="number-input"
                />
              </div>
              <span className="input-helper">{formatLakhsCrores(income.investmentIncome)}</span>
            </div>

            <div className="input-field">
              <label htmlFor="otherIncome" className="input-label">
                Other Annual Income (₹/yr)
              </label>
              <div className="input-wrapper">
                <span className="input-prefix">₹</span>
                <input
                  id="otherIncome"
                  type="number"
                  min="0"
                  step="5000"
                  value={income.otherIncome || ''}
                  onChange={(e) => setIncome({ ...income, otherIncome: Math.max(0, Number(e.target.value)) })}
                  placeholder="e.g. 50000"
                  className="number-input"
                />
              </div>
              <span className="input-helper">{formatLakhsCrores(income.otherIncome)}</span>
            </div>
          </div>

          <div className="step-actions">
            <div></div>
            <button type="button" onClick={handleNextStep} className="btn-primary">
              Continue to Expenses →
            </button>
          </div>
        </section>
      )}

      {/* STEP 2: EXPENSES */}
      {step === 2 && (
        <section className="step-card fade-in">
          <div className="step-header">
            <div>
              <span className="step-subtitle">Step 2 of 5</span>
              <h2 className="step-title">Monthly Living Expenses</h2>
              <p className="step-desc">
                Enter your average monthly spending across 5 categories. Annual expenses are calculated automatically.
              </p>
            </div>
            <div className="live-stat-card">
              <span className="stat-label">Total Monthly Expenses</span>
              <span className="stat-value">{formatIndianCurrency(result.expenses.totalMonthlyExpenses)} / mo</span>
              <span className="stat-sub">Annual Total: {formatLakhsCrores(result.expenses.totalAnnualExpenses)}</span>
            </div>
          </div>

          {/* Category 1: Household */}
          <div className="accordion-group">
            <button
              type="button"
              onClick={() => toggleExpenseAccordion('household')}
              className="accordion-header"
            >
              <div className="accordion-title-box">
                <span className="accordion-icon">🏠</span>
                <div>
                  <span className="accordion-title">1. Household & Groceries</span>
                  <span className="accordion-sub">Rent, food, transport, electricity & utilities</span>
                </div>
              </div>
              <div className="accordion-meta">
                <span className="accordion-val">{formatIndianCurrency(result.expenses.monthlyHousehold)}/mo</span>
                <span className="accordion-arrow">{openExpenseAccordions.household ? '▲' : '▼'}</span>
              </div>
            </button>

            {openExpenseAccordions.household && (
              <div className="accordion-content">
                <div className="inputs-grid">
                  <div className="input-field">
                    <label className="input-label">Rent / Society Maintenance (₹/mo)</label>
                    <div className="input-wrapper">
                      <span className="input-prefix">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={expenses.household.rent || ''}
                        onChange={(e) =>
                          setExpenses({
                            ...expenses,
                            household: { ...expenses.household, rent: Math.max(0, Number(e.target.value)) },
                          })
                        }
                        placeholder="0"
                        className="number-input"
                      />
                    </div>
                  </div>
                  <div className="input-field">
                    <label className="input-label">Food, Groceries & Milk (₹/mo)</label>
                    <div className="input-wrapper">
                      <span className="input-prefix">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={expenses.household.groceries || ''}
                        onChange={(e) =>
                          setExpenses({
                            ...expenses,
                            household: { ...expenses.household, groceries: Math.max(0, Number(e.target.value)) },
                          })
                        }
                        placeholder="0"
                        className="number-input"
                      />
                    </div>
                  </div>
                  <div className="input-field">
                    <label className="input-label">Transport & Fuel (₹/mo)</label>
                    <div className="input-wrapper">
                      <span className="input-prefix">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={expenses.household.transport || ''}
                        onChange={(e) =>
                          setExpenses({
                            ...expenses,
                            household: { ...expenses.household, transport: Math.max(0, Number(e.target.value)) },
                          })
                        }
                        placeholder="0"
                        className="number-input"
                      />
                    </div>
                  </div>
                  <div className="input-field">
                    <label className="input-label">Electricity, Gas, Water & Internet (₹/mo)</label>
                    <div className="input-wrapper">
                      <span className="input-prefix">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={expenses.household.utilities || ''}
                        onChange={(e) =>
                          setExpenses({
                            ...expenses,
                            household: { ...expenses.household, utilities: Math.max(0, Number(e.target.value)) },
                          })
                        }
                        placeholder="0"
                        className="number-input"
                      />
                    </div>
                  </div>
                  <div className="input-field">
                    <label className="input-label">Domestic Help / Maid / Cook (₹/mo)</label>
                    <div className="input-wrapper">
                      <span className="input-prefix">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={expenses.household.domesticHelp || ''}
                        onChange={(e) =>
                          setExpenses({
                            ...expenses,
                            household: { ...expenses.household, domesticHelp: Math.max(0, Number(e.target.value)) },
                          })
                        }
                        placeholder="0"
                        className="number-input"
                      />
                    </div>
                  </div>
                  <div className="input-field">
                    <label className="input-label">Other Household Expenses (₹/mo)</label>
                    <div className="input-wrapper">
                      <span className="input-prefix">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={expenses.household.otherHousehold || ''}
                        onChange={(e) =>
                          setExpenses({
                            ...expenses,
                            household: { ...expenses.household, otherHousehold: Math.max(0, Number(e.target.value)) },
                          })
                        }
                        placeholder="0"
                        className="number-input"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Category 2: Lifestyle */}
          <div className="accordion-group">
            <button
              type="button"
              onClick={() => toggleExpenseAccordion('lifestyle')}
              className="accordion-header"
            >
              <div className="accordion-title-box">
                <span className="accordion-icon">🛍️</span>
                <div>
                  <span className="accordion-title">2. Lifestyle & Entertainment</span>
                  <span className="accordion-sub">Shopping, dining out, weekend travel & subscriptions</span>
                </div>
              </div>
              <div className="accordion-meta">
                <span className="accordion-val">{formatIndianCurrency(result.expenses.monthlyLifestyle)}/mo</span>
                <span className="accordion-arrow">{openExpenseAccordions.lifestyle ? '▲' : '▼'}</span>
              </div>
            </button>

            {openExpenseAccordions.lifestyle && (
              <div className="accordion-content">
                <div className="inputs-grid">
                  <div className="input-field">
                    <label className="input-label">Shopping & Clothing (₹/mo)</label>
                    <div className="input-wrapper">
                      <span className="input-prefix">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={expenses.lifestyle.shopping || ''}
                        onChange={(e) =>
                          setExpenses({
                            ...expenses,
                            lifestyle: { ...expenses.lifestyle, shopping: Math.max(0, Number(e.target.value)) },
                          })
                        }
                        placeholder="0"
                        className="number-input"
                      />
                    </div>
                  </div>
                  <div className="input-field">
                    <label className="input-label">Dining Out & Entertainment (₹/mo)</label>
                    <div className="input-wrapper">
                      <span className="input-prefix">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={expenses.lifestyle.dining || ''}
                        onChange={(e) =>
                          setExpenses({
                            ...expenses,
                            lifestyle: { ...expenses.lifestyle, dining: Math.max(0, Number(e.target.value)) },
                          })
                        }
                        placeholder="0"
                        className="number-input"
                      />
                    </div>
                  </div>
                  <div className="input-field">
                    <label className="input-label">Travel & Holidays (Monthly Portion ₹/mo)</label>
                    <div className="input-wrapper">
                      <span className="input-prefix">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={expenses.lifestyle.travel || ''}
                        onChange={(e) =>
                          setExpenses({
                            ...expenses,
                            lifestyle: { ...expenses.lifestyle, travel: Math.max(0, Number(e.target.value)) },
                          })
                        }
                        placeholder="0"
                        className="number-input"
                      />
                    </div>
                  </div>
                  <div className="input-field">
                    <label className="input-label">Personal Care, Grooming & Fitness (₹/mo)</label>
                    <div className="input-wrapper">
                      <span className="input-prefix">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={expenses.lifestyle.personalCare || ''}
                        onChange={(e) =>
                          setExpenses({
                            ...expenses,
                            lifestyle: { ...expenses.lifestyle, personalCare: Math.max(0, Number(e.target.value)) },
                          })
                        }
                        placeholder="0"
                        className="number-input"
                      />
                    </div>
                  </div>
                  <div className="input-field">
                    <label className="input-label">OTT, Subscriptions & Hobbies (₹/mo)</label>
                    <div className="input-wrapper">
                      <span className="input-prefix">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={expenses.lifestyle.hobbies || ''}
                        onChange={(e) =>
                          setExpenses({
                            ...expenses,
                            lifestyle: { ...expenses.lifestyle, hobbies: Math.max(0, Number(e.target.value)) },
                          })
                        }
                        placeholder="0"
                        className="number-input"
                      />
                    </div>
                  </div>
                  <div className="input-field">
                    <label className="input-label">Other Lifestyle Spending (₹/mo)</label>
                    <div className="input-wrapper">
                      <span className="input-prefix">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={expenses.lifestyle.otherLifestyle || ''}
                        onChange={(e) =>
                          setExpenses({
                            ...expenses,
                            lifestyle: { ...expenses.lifestyle, otherLifestyle: Math.max(0, Number(e.target.value)) },
                          })
                        }
                        placeholder="0"
                        className="number-input"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Category 3: Family */}
          <div className="accordion-group">
            <button
              type="button"
              onClick={() => toggleExpenseAccordion('family')}
              className="accordion-header"
            >
              <div className="accordion-title-box">
                <span className="accordion-icon">👨‍👩‍👧</span>
                <div>
                  <span className="accordion-title">3. Family & Dependents</span>
                  <span className="accordion-sub">School fees, coaching, parents support</span>
                </div>
              </div>
              <div className="accordion-meta">
                <span className="accordion-val">{formatIndianCurrency(result.expenses.monthlyFamily)}/mo</span>
                <span className="accordion-arrow">{openExpenseAccordions.family ? '▲' : '▼'}</span>
              </div>
            </button>

            {openExpenseAccordions.family && (
              <div className="accordion-content">
                <div className="inputs-grid">
                  <div className="input-field">
                    <label className="input-label">Children's School / College Fees (Monthly Equivalent ₹/mo)</label>
                    <div className="input-wrapper">
                      <span className="input-prefix">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={expenses.family.education || ''}
                        onChange={(e) =>
                          setExpenses({
                            ...expenses,
                            family: { ...expenses.family, education: Math.max(0, Number(e.target.value)) },
                          })
                        }
                        placeholder="0"
                        className="number-input"
                      />
                    </div>
                  </div>
                  <div className="input-field">
                    <label className="input-label">Parents & Dependent Care (₹/mo)</label>
                    <div className="input-wrapper">
                      <span className="input-prefix">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={expenses.family.dependents || ''}
                        onChange={(e) =>
                          setExpenses({
                            ...expenses,
                            family: { ...expenses.family, dependents: Math.max(0, Number(e.target.value)) },
                          })
                        }
                        placeholder="0"
                        className="number-input"
                      />
                    </div>
                  </div>
                  <div className="input-field">
                    <label className="input-label">Other Family Commitments (₹/mo)</label>
                    <div className="input-wrapper">
                      <span className="input-prefix">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={expenses.family.otherFamily || ''}
                        onChange={(e) =>
                          setExpenses({
                            ...expenses,
                            family: { ...expenses.family, otherFamily: Math.max(0, Number(e.target.value)) },
                          })
                        }
                        placeholder="0"
                        className="number-input"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Category 4: Insurance */}
          <div className="accordion-group">
            <button
              type="button"
              onClick={() => toggleExpenseAccordion('insurance')}
              className="accordion-header"
            >
              <div className="accordion-title-box">
                <span className="accordion-icon">🛡️</span>
                <div>
                  <span className="accordion-title">4. Insurance Premiums</span>
                  <span className="accordion-sub">Life, health & general insurance (monthly equivalent)</span>
                </div>
              </div>
              <div className="accordion-meta">
                <span className="accordion-val">{formatIndianCurrency(result.expenses.monthlyInsurance)}/mo</span>
                <span className="accordion-arrow">{openExpenseAccordions.insurance ? '▲' : '▼'}</span>
              </div>
            </button>

            {openExpenseAccordions.insurance && (
              <div className="accordion-content">
                <div className="inputs-grid">
                  <div className="input-field">
                    <label className="input-label">Term / Life Insurance (Monthly Portion ₹/mo)</label>
                    <div className="input-wrapper">
                      <span className="input-prefix">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={expenses.insurance.lifeInsurance || ''}
                        onChange={(e) =>
                          setExpenses({
                            ...expenses,
                            insurance: { ...expenses.insurance, lifeInsurance: Math.max(0, Number(e.target.value)) },
                          })
                        }
                        placeholder="0"
                        className="number-input"
                      />
                    </div>
                  </div>
                  <div className="input-field">
                    <label className="input-label">Health / Mediclaim Insurance (Monthly Portion ₹/mo)</label>
                    <div className="input-wrapper">
                      <span className="input-prefix">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={expenses.insurance.healthInsurance || ''}
                        onChange={(e) =>
                          setExpenses({
                            ...expenses,
                            insurance: { ...expenses.insurance, healthInsurance: Math.max(0, Number(e.target.value)) },
                          })
                        }
                        placeholder="0"
                        className="number-input"
                      />
                    </div>
                  </div>
                  <div className="input-field">
                    <label className="input-label">Vehicle & General Insurance (Monthly Portion ₹/mo)</label>
                    <div className="input-wrapper">
                      <span className="input-prefix">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={expenses.insurance.generalInsurance || ''}
                        onChange={(e) =>
                          setExpenses({
                            ...expenses,
                            insurance: { ...expenses.insurance, generalInsurance: Math.max(0, Number(e.target.value)) },
                          })
                        }
                        placeholder="0"
                        className="number-input"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Category 5: Loan EMIs */}
          <div className="accordion-group">
            <button
              type="button"
              onClick={() => toggleExpenseAccordion('loanEmis')}
              className="accordion-header"
            >
              <div className="accordion-title-box">
                <span className="accordion-icon">🏦</span>
                <div>
                  <span className="accordion-title">5. Loan EMIs</span>
                  <span className="accordion-sub">Home loan, vehicle loan & personal loan monthly EMIs</span>
                </div>
              </div>
              <div className="accordion-meta">
                <span className="accordion-val">{formatIndianCurrency(result.expenses.monthlyLoanEmis)}/mo</span>
                <span className="accordion-arrow">{openExpenseAccordions.loanEmis ? '▲' : '▼'}</span>
              </div>
            </button>

            {openExpenseAccordions.loanEmis && (
              <div className="accordion-content">
                <div className="inputs-grid">
                  <div className="input-field">
                    <label className="input-label">Home Loan EMI (₹/mo)</label>
                    <div className="input-wrapper">
                      <span className="input-prefix">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={expenses.loanEmis.homeLoanEmi || ''}
                        onChange={(e) =>
                          setExpenses({
                            ...expenses,
                            loanEmis: { ...expenses.loanEmis, homeLoanEmi: Math.max(0, Number(e.target.value)) },
                          })
                        }
                        placeholder="0"
                        className="number-input"
                      />
                    </div>
                  </div>
                  <div className="input-field">
                    <label className="input-label">Car / Vehicle Loan EMI (₹/mo)</label>
                    <div className="input-wrapper">
                      <span className="input-prefix">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={expenses.loanEmis.vehicleLoanEmi || ''}
                        onChange={(e) =>
                          setExpenses({
                            ...expenses,
                            loanEmis: { ...expenses.loanEmis, vehicleLoanEmi: Math.max(0, Number(e.target.value)) },
                          })
                        }
                        placeholder="0"
                        className="number-input"
                      />
                    </div>
                  </div>
                  <div className="input-field">
                    <label className="input-label">Other Loans / Credit Card EMIs (₹/mo)</label>
                    <div className="input-wrapper">
                      <span className="input-prefix">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={expenses.loanEmis.otherLoanEmi || ''}
                        onChange={(e) =>
                          setExpenses({
                            ...expenses,
                            loanEmis: { ...expenses.loanEmis, otherLoanEmi: Math.max(0, Number(e.target.value)) },
                          })
                        }
                        placeholder="0"
                        className="number-input"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="step-actions">
            <button type="button" onClick={handlePrevStep} className="btn-secondary">
              ← Back to Income
            </button>
            <button type="button" onClick={handleNextStep} className="btn-primary">
              Continue to Savings & Investing →
            </button>
          </div>
        </section>
      )}

      {/* STEP 3: SAVINGS & INVESTMENTS */}
      {step === 3 && (
        <section className="step-card fade-in">
          <div className="step-header">
            <div>
              <span className="step-subtitle">Step 3 of 5</span>
              <h2 className="step-title">Savings & Ongoing Investments</h2>
              <p className="step-desc">
                Review your calculated savings capacity and specify existing monthly investments.
              </p>
            </div>
            <div className="live-stat-card">
              <span className="stat-label">Calculated Annual Savings</span>
              <span className="stat-value">{formatLakhsCrores(result.savings.annualSavings)}</span>
              <span className="stat-sub">Savings Rate: {result.income.totalAnnualIncome > 0 ? `${result.savings.savingsRate}%` : '—'}</span>
            </div>
          </div>

          {/* Savings Highlight Banner */}
          <div className="savings-highlight-card">
            <div className="highlight-column">
              <span className="highlight-label">Annual Income</span>
              <span className="highlight-value">{formatLakhsCrores(result.income.totalAnnualIncome)}</span>
            </div>
            <div className="highlight-sep">−</div>
            <div className="highlight-column">
              <span className="highlight-label">Annual Expenses</span>
              <span className="highlight-value">{formatLakhsCrores(result.expenses.totalAnnualExpenses)}</span>
            </div>
            <div className="highlight-sep">=</div>
            <div className="highlight-column primary-col">
              <span className="highlight-label">Annual Savings</span>
              <span className="highlight-value text-teal">{formatLakhsCrores(result.savings.annualSavings)}</span>
              <span className="highlight-sub">≈ {formatIndianCurrency(result.savings.monthlySavings)} / mo</span>
            </div>
          </div>

          <div className="section-divider-title">Existing Ongoing Investments (Monthly)</div>

          <div className="inputs-grid">
            <div className="input-field">
              <label htmlFor="mutualFundSips" className="input-label">
                Mutual Fund SIPs (₹/mo)
              </label>
              <div className="input-wrapper">
                <span className="input-prefix">₹</span>
                <input
                  id="mutualFundSips"
                  type="number"
                  min="0"
                  step="1000"
                  value={investments.mutualFundSips || ''}
                  onChange={(e) => setInvestments({ ...investments, mutualFundSips: Math.max(0, Number(e.target.value)) })}
                  placeholder="e.g. 25000"
                  className="number-input"
                />
              </div>
              <span className="input-helper">Annual: {formatLakhsCrores((investments.mutualFundSips || 0) * 12)}</span>
            </div>

            <div className="input-field">
              <label htmlFor="recurringDepositsPolicies" className="input-label">
                Policies / Recurring Deposits / PPF (₹/mo)
              </label>
              <div className="input-wrapper">
                <span className="input-prefix">₹</span>
                <input
                  id="recurringDepositsPolicies"
                  type="number"
                  min="0"
                  step="1000"
                  value={investments.recurringDepositsPolicies || ''}
                  onChange={(e) => setInvestments({ ...investments, recurringDepositsPolicies: Math.max(0, Number(e.target.value)) })}
                  placeholder="e.g. 10000"
                  className="number-input"
                />
              </div>
              <span className="input-helper">Annual: {formatLakhsCrores((investments.recurringDepositsPolicies || 0) * 12)}</span>
            </div>

            <div className="input-field">
              <label htmlFor="otherInvestments" className="input-label">
                Other Ongoing Investments (₹/mo)
              </label>
              <div className="input-wrapper">
                <span className="input-prefix">₹</span>
                <input
                  id="otherInvestments"
                  type="number"
                  min="0"
                  step="1000"
                  value={investments.otherInvestments || ''}
                  onChange={(e) => setInvestments({ ...investments, otherInvestments: Math.max(0, Number(e.target.value)) })}
                  placeholder="e.g. 5000"
                  className="number-input"
                />
              </div>
              <span className="input-helper">Annual: {formatLakhsCrores((investments.otherInvestments || 0) * 12)}</span>
            </div>
          </div>

          {/* Key Output: Surplus Available for New Investments */}
          <div className="surplus-hero-box">
            <div className="surplus-content">
              <span className="surplus-badge">Key Cash Flow Metric</span>
              <h3 className="surplus-title">Surplus Available for New Investments</h3>
              <p className="surplus-desc">
                Calculated as Annual Savings ({formatLakhsCrores(result.savings.annualSavings)}) minus Existing Ongoing Investments ({formatLakhsCrores(result.investments.totalAnnualInvestments)}).
              </p>
            </div>
            <div className="surplus-figure-box">
              <span className="surplus-monthly">{formatIndianCurrency(result.surplus.monthlySurplus)} <small>/ month</small></span>
              <span className="surplus-annual">Annual Surplus: {formatLakhsCrores(result.surplus.annualSurplus)}</span>
            </div>
          </div>

          <div className="step-actions">
            <button type="button" onClick={handlePrevStep} className="btn-secondary">
              ← Back to Expenses
            </button>
            <button type="button" onClick={handleNextStep} className="btn-primary">
              Continue to Assets →
            </button>
          </div>
        </section>
      )}

      {/* STEP 4: ASSETS */}
      {step === 4 && (
        <section className="step-card fade-in">
          <div className="step-header">
            <div>
              <span className="step-subtitle">Step 4 of 5</span>
              <h2 className="step-title">Current Assets & Investments</h2>
              <p className="step-desc">
                Enter current market values. Personal-use assets (home, vehicles, jewellery) are tracked to calculate your Actual Net Worth.
              </p>
            </div>
            <div className="live-stat-card">
              <span className="stat-label">Total Assets</span>
              <span className="stat-value">{formatLakhsCrores(result.assets.totalAssets)}</span>
              <span className="stat-sub">Productive Assets: {formatLakhsCrores(result.assets.productiveAssets)}</span>
            </div>
          </div>

          {/* 1. Liquid Assets */}
          <div className="accordion-group">
            <button type="button" onClick={() => toggleAssetAccordion('liquid')} className="accordion-header">
              <div className="accordion-title-box">
                <span className="accordion-icon">💧</span>
                <div>
                  <span className="accordion-title">1. Liquid Assets</span>
                  <span className="accordion-sub">Savings account, cash & liquid/overnight mutual funds</span>
                </div>
              </div>
              <div className="accordion-meta">
                <span className="accordion-val">{formatLakhsCrores(result.assets.categoryTotals.liquid)}</span>
                <span className="accordion-arrow">{openAssetAccordions.liquid ? '▲' : '▼'}</span>
              </div>
            </button>

            {openAssetAccordions.liquid && (
              <div className="accordion-content">
                <div className="inputs-grid">
                  <div className="input-field">
                    <label className="input-label">Savings Bank Balance (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={assets.liquid.savingsBank || ''}
                      onChange={(e) => setAssets({ ...assets, liquid: { ...assets.liquid, savingsBank: Math.max(0, Number(e.target.value)) } })}
                      placeholder="0"
                      className="number-input"
                    />
                  </div>
                  <div className="input-field">
                    <label className="input-label">Liquid / Overnight Mutual Funds (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={assets.liquid.liquidFunds || ''}
                      onChange={(e) => setAssets({ ...assets, liquid: { ...assets.liquid, liquidFunds: Math.max(0, Number(e.target.value)) } })}
                      placeholder="0"
                      className="number-input"
                    />
                  </div>
                  <div className="input-field">
                    <label className="input-label">Cash on Hand (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={assets.liquid.cash || ''}
                      onChange={(e) => setAssets({ ...assets, liquid: { ...assets.liquid, cash: Math.max(0, Number(e.target.value)) } })}
                      placeholder="0"
                      className="number-input"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. Debt Assets */}
          <div className="accordion-group">
            <button type="button" onClick={() => toggleAssetAccordion('debt')} className="accordion-header">
              <div className="accordion-title-box">
                <span className="accordion-icon">🛡️</span>
                <div>
                  <span className="accordion-title">2. Fixed Income & Debt Assets</span>
                  <span className="accordion-sub">Fixed deposits, PPF, EPF, NPS debt & debt funds</span>
                </div>
              </div>
              <div className="accordion-meta">
                <span className="accordion-val">{formatLakhsCrores(result.assets.categoryTotals.debt)}</span>
                <span className="accordion-arrow">{openAssetAccordions.debt ? '▲' : '▼'}</span>
              </div>
            </button>

            {openAssetAccordions.debt && (
              <div className="accordion-content">
                <div className="inputs-grid">
                  <div className="input-field">
                    <label className="input-label">Fixed Deposits & RDs (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={assets.debt.fixedDeposits || ''}
                      onChange={(e) => setAssets({ ...assets, debt: { ...assets.debt, fixedDeposits: Math.max(0, Number(e.target.value)) } })}
                      placeholder="0"
                      className="number-input"
                    />
                  </div>
                  <div className="input-field">
                    <label className="input-label">EPF / VPF Balance (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={assets.debt.epf || ''}
                      onChange={(e) => setAssets({ ...assets, debt: { ...assets.debt, epf: Math.max(0, Number(e.target.value)) } })}
                      placeholder="0"
                      className="number-input"
                    />
                  </div>
                  <div className="input-field">
                    <label className="input-label">PPF (Public Provident Fund) (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={assets.debt.ppf || ''}
                      onChange={(e) => setAssets({ ...assets, debt: { ...assets.debt, ppf: Math.max(0, Number(e.target.value)) } })}
                      placeholder="0"
                      className="number-input"
                    />
                  </div>
                  <div className="input-field">
                    <label className="input-label">NPS (Tier 1 Debt Portions) (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={assets.debt.npsDebt || ''}
                      onChange={(e) => setAssets({ ...assets, debt: { ...assets.debt, npsDebt: Math.max(0, Number(e.target.value)) } })}
                      placeholder="0"
                      className="number-input"
                    />
                  </div>
                  <div className="input-field">
                    <label className="input-label">Debt Mutual Funds (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={assets.debt.debtMutualFunds || ''}
                      onChange={(e) => setAssets({ ...assets, debt: { ...assets.debt, debtMutualFunds: Math.max(0, Number(e.target.value)) } })}
                      placeholder="0"
                      className="number-input"
                    />
                  </div>
                  <div className="input-field">
                    <label className="input-label">Bonds & Government Securities (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={assets.debt.bondsOther || ''}
                      onChange={(e) => setAssets({ ...assets, debt: { ...assets.debt, bondsOther: Math.max(0, Number(e.target.value)) } })}
                      placeholder="0"
                      className="number-input"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Equity Assets */}
          <div className="accordion-group">
            <button type="button" onClick={() => toggleAssetAccordion('equity')} className="accordion-header">
              <div className="accordion-title-box">
                <span className="accordion-icon">📈</span>
                <div>
                  <span className="accordion-title">3. Equity & Growth Assets</span>
                  <span className="accordion-sub">Equity mutual funds, direct stocks, NPS equity & ULIPs</span>
                </div>
              </div>
              <div className="accordion-meta">
                <span className="accordion-val">{formatLakhsCrores(result.assets.categoryTotals.equity)}</span>
                <span className="accordion-arrow">{openAssetAccordions.equity ? '▲' : '▼'}</span>
              </div>
            </button>

            {openAssetAccordions.equity && (
              <div className="accordion-content">
                <div className="inputs-grid">
                  <div className="input-field">
                    <label className="input-label">Equity Mutual Funds Portfolio (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={assets.equity.equityMutualFunds || ''}
                      onChange={(e) => setAssets({ ...assets, equity: { ...assets.equity, equityMutualFunds: Math.max(0, Number(e.target.value)) } })}
                      placeholder="0"
                      className="number-input"
                    />
                  </div>
                  <div className="input-field">
                    <label className="input-label">Direct Stocks / Shares (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={assets.equity.directEquity || ''}
                      onChange={(e) => setAssets({ ...assets, equity: { ...assets.equity, directEquity: Math.max(0, Number(e.target.value)) } })}
                      placeholder="0"
                      className="number-input"
                    />
                  </div>
                  <div className="input-field">
                    <label className="input-label">NPS (Tier 1 Equity E-Scheme) (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={assets.equity.npsEquity || ''}
                      onChange={(e) => setAssets({ ...assets, equity: { ...assets.equity, npsEquity: Math.max(0, Number(e.target.value)) } })}
                      placeholder="0"
                      className="number-input"
                    />
                  </div>
                  <div className="input-field">
                    <label className="input-label">ULIPs / Unit Linked Fund Value (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={assets.equity.ulips || ''}
                      onChange={(e) => setAssets({ ...assets, equity: { ...assets.equity, ulips: Math.max(0, Number(e.target.value)) } })}
                      placeholder="0"
                      className="number-input"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. Gold Assets */}
          <div className="accordion-group">
            <button type="button" onClick={() => toggleAssetAccordion('gold')} className="accordion-header">
              <div className="accordion-title-box">
                <span className="accordion-icon">🪙</span>
                <div>
                  <span className="accordion-title">4. Gold & Precious Metals</span>
                  <span className="accordion-sub">Physical gold/silver & Sovereign Gold Bonds / ETFs</span>
                </div>
              </div>
              <div className="accordion-meta">
                <span className="accordion-val">{formatLakhsCrores(result.assets.categoryTotals.gold)}</span>
                <span className="accordion-arrow">{openAssetAccordions.gold ? '▲' : '▼'}</span>
              </div>
            </button>

            {openAssetAccordions.gold && (
              <div className="accordion-content">
                <div className="inputs-grid">
                  <div className="input-field">
                    <label className="input-label">Gold ETFs / Sovereign Gold Bonds (SGB) (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={assets.gold.goldEtfsSgb || ''}
                      onChange={(e) => setAssets({ ...assets, gold: { ...assets.gold, goldEtfsSgb: Math.max(0, Number(e.target.value)) } })}
                      placeholder="0"
                      className="number-input"
                    />
                  </div>
                  <div className="input-field">
                    <label className="input-label">Physical Gold / Coins / Bars (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={assets.gold.physicalGold || ''}
                      onChange={(e) => setAssets({ ...assets, gold: { ...assets.gold, physicalGold: Math.max(0, Number(e.target.value)) } })}
                      placeholder="0"
                      className="number-input"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 5. Real Estate */}
          <div className="accordion-group">
            <button type="button" onClick={() => toggleAssetAccordion('realEstate')} className="accordion-header">
              <div className="accordion-title-box">
                <span className="accordion-icon">🏡</span>
                <div>
                  <span className="accordion-title">5. Real Estate Property</span>
                  <span className="accordion-sub">Primary home (personal) + investment properties & land</span>
                </div>
              </div>
              <div className="accordion-meta">
                <span className="accordion-val">{formatLakhsCrores(result.assets.categoryTotals.realEstate)}</span>
                <span className="accordion-arrow">{openAssetAccordions.realEstate ? '▲' : '▼'}</span>
              </div>
            </button>

            {openAssetAccordions.realEstate && (
              <div className="accordion-content">
                <div className="inputs-grid">
                  <div className="input-field">
                    <label className="input-label">
                      Primary Residence (Self-Occupied Home) (₹) <span className="badge-personal">Personal-Use</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={assets.realEstate.primaryResidence || ''}
                      onChange={(e) => setAssets({ ...assets, realEstate: { ...assets.realEstate, primaryResidence: Math.max(0, Number(e.target.value)) } })}
                      placeholder="0"
                      className="number-input"
                    />
                    <span className="input-helper">Excluded from Actual Net Worth calculation</span>
                  </div>
                  <div className="input-field">
                    <label className="input-label">Investment Property / Commercial Flat (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={assets.realEstate.investmentProperty || ''}
                      onChange={(e) => setAssets({ ...assets, realEstate: { ...assets.realEstate, investmentProperty: Math.max(0, Number(e.target.value)) } })}
                      placeholder="0"
                      className="number-input"
                    />
                  </div>
                  <div className="input-field">
                    <label className="input-label">Land / Plots (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={assets.realEstate.land || ''}
                      onChange={(e) => setAssets({ ...assets, realEstate: { ...assets.realEstate, land: Math.max(0, Number(e.target.value)) } })}
                      placeholder="0"
                      className="number-input"
                    />
                  </div>
                  <div className="input-field">
                    <label className="input-label">REITs (Real Estate Investment Trusts) (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={assets.realEstate.reits || ''}
                      onChange={(e) => setAssets({ ...assets, realEstate: { ...assets.realEstate, reits: Math.max(0, Number(e.target.value)) } })}
                      placeholder="0"
                      className="number-input"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 6. Personal Assets */}
          <div className="accordion-group">
            <button type="button" onClick={() => toggleAssetAccordion('personal')} className="accordion-header">
              <div className="accordion-title-box">
                <span className="accordion-icon">🚗</span>
                <div>
                  <span className="accordion-title">6. Personal-Use Assets</span>
                  <span className="accordion-sub">Vehicles, personal jewellery & consumer assets</span>
                </div>
              </div>
              <div className="accordion-meta">
                <span className="accordion-val">{formatLakhsCrores(result.assets.categoryTotals.personal)}</span>
                <span className="accordion-arrow">{openAssetAccordions.personal ? '▲' : '▼'}</span>
              </div>
            </button>

            {openAssetAccordions.personal && (
              <div className="accordion-content">
                <div className="inputs-grid">
                  <div className="input-field">
                    <label className="input-label">
                      Vehicles (Cars / Two-Wheelers Current Resale Value) (₹) <span className="badge-personal">Personal-Use</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={assets.personal.vehicles || ''}
                      onChange={(e) => setAssets({ ...assets, personal: { ...assets.personal, vehicles: Math.max(0, Number(e.target.value)) } })}
                      placeholder="0"
                      className="number-input"
                    />
                  </div>
                  <div className="input-field">
                    <label className="input-label">
                      Personal Jewellery (₹) <span className="badge-personal">Personal-Use</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={assets.personal.jewellery || ''}
                      onChange={(e) => setAssets({ ...assets, personal: { ...assets.personal, jewellery: Math.max(0, Number(e.target.value)) } })}
                      placeholder="0"
                      className="number-input"
                    />
                  </div>
                  <div className="input-field">
                    <label className="input-label">
                      Other Personal Effects / Electronics (₹) <span className="badge-personal">Personal-Use</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={assets.personal.otherPersonal || ''}
                      onChange={(e) => setAssets({ ...assets, personal: { ...assets.personal, otherPersonal: Math.max(0, Number(e.target.value)) } })}
                      placeholder="0"
                      className="number-input"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="step-actions">
            <button type="button" onClick={handlePrevStep} className="btn-secondary">
              ← Back to Investing
            </button>
            <button type="button" onClick={handleNextStep} className="btn-primary">
              Continue to Liabilities →
            </button>
          </div>
        </section>
      )}

      {/* STEP 5: LIABILITIES */}
      {step === 5 && (
        <section className="step-card fade-in">
          <div className="step-header">
            <div>
              <span className="step-subtitle">Step 5 of 5</span>
              <h2 className="step-title">Outstanding Liabilities & Debt</h2>
              <p className="step-desc">
                Enter current outstanding principal balances across all loans and obligations.
              </p>
            </div>
            <div className="live-stat-card">
              <span className="stat-label">Total Liabilities</span>
              <span className="stat-value">{formatLakhsCrores(result.liabilities.totalLiabilities)}</span>
              <span className="stat-sub">Debt-to-Asset: {result.assets.totalAssets > 0 ? `${result.metrics.debtToAssetRatio}%` : '0%'}</span>
            </div>
          </div>

          <div className="inputs-grid">
            <div className="input-field">
              <label htmlFor="homeLoan" className="input-label">
                Home Loan Outstanding Balance (₹)
              </label>
              <div className="input-wrapper">
                <span className="input-prefix">₹</span>
                <input
                  id="homeLoan"
                  type="number"
                  min="0"
                  step="50000"
                  value={liabilities.homeLoan || ''}
                  onChange={(e) => setLiabilities({ ...liabilities, homeLoan: Math.max(0, Number(e.target.value)) })}
                  placeholder="e.g. 2000000"
                  className="number-input"
                />
              </div>
              <span className="input-helper">{formatLakhsCrores(liabilities.homeLoan)}</span>
            </div>

            <div className="input-field">
              <label htmlFor="vehicleLoan" className="input-label">
                Car / Vehicle Loan Outstanding (₹)
              </label>
              <div className="input-wrapper">
                <span className="input-prefix">₹</span>
                <input
                  id="vehicleLoan"
                  type="number"
                  min="0"
                  step="20000"
                  value={liabilities.vehicleLoan || ''}
                  onChange={(e) => setLiabilities({ ...liabilities, vehicleLoan: Math.max(0, Number(e.target.value)) })}
                  placeholder="e.g. 300000"
                  className="number-input"
                />
              </div>
              <span className="input-helper">{formatLakhsCrores(liabilities.vehicleLoan)}</span>
            </div>

            <div className="input-field">
              <label htmlFor="personalLoan" className="input-label">
                Personal Loan Outstanding (₹)
              </label>
              <div className="input-wrapper">
                <span className="input-prefix">₹</span>
                <input
                  id="personalLoan"
                  type="number"
                  min="0"
                  step="10000"
                  value={liabilities.personalLoan || ''}
                  onChange={(e) => setLiabilities({ ...liabilities, personalLoan: Math.max(0, Number(e.target.value)) })}
                  placeholder="0"
                  className="number-input"
                />
              </div>
              <span className="input-helper">{formatLakhsCrores(liabilities.personalLoan)}</span>
            </div>

            <div className="input-field">
              <label htmlFor="educationLoan" className="input-label">
                Education Loan Outstanding (₹)
              </label>
              <div className="input-wrapper">
                <span className="input-prefix">₹</span>
                <input
                  id="educationLoan"
                  type="number"
                  min="0"
                  step="20000"
                  value={liabilities.educationLoan || ''}
                  onChange={(e) => setLiabilities({ ...liabilities, educationLoan: Math.max(0, Number(e.target.value)) })}
                  placeholder="0"
                  className="number-input"
                />
              </div>
              <span className="input-helper">{formatLakhsCrores(liabilities.educationLoan)}</span>
            </div>

            <div className="input-field">
              <label htmlFor="otherLoans" className="input-label">
                Other Loans / Gold Loans / Hand Loans (₹)
              </label>
              <div className="input-wrapper">
                <span className="input-prefix">₹</span>
                <input
                  id="otherLoans"
                  type="number"
                  min="0"
                  step="10000"
                  value={liabilities.otherLoans || ''}
                  onChange={(e) => setLiabilities({ ...liabilities, otherLoans: Math.max(0, Number(e.target.value)) })}
                  placeholder="0"
                  className="number-input"
                />
              </div>
              <span className="input-helper">{formatLakhsCrores(liabilities.otherLoans)}</span>
            </div>

            <div className="input-field">
              <label htmlFor="creditCardDebt" className="input-label">
                Credit Card Outstanding Balance (₹)
              </label>
              <div className="input-wrapper">
                <span className="input-prefix">₹</span>
                <input
                  id="creditCardDebt"
                  type="number"
                  min="0"
                  step="5000"
                  value={liabilities.creditCardDebt || ''}
                  onChange={(e) => setLiabilities({ ...liabilities, creditCardDebt: Math.max(0, Number(e.target.value)) })}
                  placeholder="0"
                  className="number-input"
                />
              </div>
              <span className="input-helper">{formatLakhsCrores(liabilities.creditCardDebt)}</span>
            </div>
          </div>

          <div className="step-actions">
            <button type="button" onClick={handlePrevStep} className="btn-secondary">
              ← Back to Assets
            </button>
            <button type="button" onClick={() => { setStep('results'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="btn-primary">
              View Your Financial Snapshot 📊
            </button>
          </div>
        </section>
      )}

      {/* RESULTS: FINANCIAL SNAPSHOT DASHBOARD */}
      {step === 'results' && (
        <section className="results-dashboard fade-in">
          {/* Main Hero Card: Actual Net Worth */}
          <div className="networth-hero-card">
            <div className="hero-top-row">
              <span className="hero-badge">Primary Financial Health Benchmark</span>
              <span className="hero-methodology-tag">QPFP Verified Methodology</span>
            </div>

            <span className="hero-main-label">YOUR ACTUAL NET WORTH</span>
            <div className="hero-primary-val">{formatLakhsCrores(result.actualNetWorth)}</div>

            <p className="hero-explainer">
              <strong>Actual Net Worth</strong> reflects your real financial security by subtracting personal-use assets (primary residence, vehicles, jewellery) and liabilities from your total assets.
            </p>

            {/* Supporting Net Worth Breakdown Grid */}
            <div className="hero-breakdown-grid">
              <div className="breakdown-item">
                <span className="breakdown-label">Total Assets</span>
                <span className="breakdown-val">{formatLakhsCrores(result.assets.totalAssets)}</span>
              </div>
              <div className="breakdown-sep">−</div>
              <div className="breakdown-item">
                <span className="breakdown-label">Personal-Use Assets</span>
                <span className="breakdown-val">{formatLakhsCrores(result.assets.personalUseAssets)}</span>
              </div>
              <div className="breakdown-sep">−</div>
              <div className="breakdown-item">
                <span className="breakdown-label">Total Liabilities</span>
                <span className="breakdown-val">{formatLakhsCrores(result.liabilities.totalLiabilities)}</span>
              </div>
              <div className="breakdown-sep">=</div>
              <div className="breakdown-item highlight-item">
                <span className="breakdown-label">Actual Net Worth</span>
                <span className="breakdown-val text-teal">{formatLakhsCrores(result.actualNetWorth)}</span>
              </div>
            </div>

            <div className="notional-note-box">
              <span><strong>Notional Net Worth</strong> (Total Assets − Total Liabilities): <strong>{formatLakhsCrores(result.notionalNetWorth)}</strong></span>
            </div>
          </div>

          {/* Key Financial Metrics Grid */}
          <div className="dashboard-metrics-grid">
            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-icon">💰</span>
                <span className="metric-title">Savings Rate</span>
              </div>
              <div className="metric-value">{result.income.totalAnnualIncome > 0 ? `${result.savings.savingsRate}%` : '—'}</div>
              <span className="metric-sub">{formatLakhsCrores(result.savings.annualSavings)} / year saved</span>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-icon">📈</span>
                <span className="metric-title">Investment Rate</span>
              </div>
              <div className="metric-value">{result.income.totalAnnualIncome > 0 ? `${result.investments.investmentRate}%` : '—'}</div>
              <span className="metric-sub">{formatRupees(result.investments.totalMonthlyInvestments)} / mo deployed</span>
            </div>

            <div className="metric-card highlight-metric">
              <div className="metric-header">
                <span className="metric-icon">✨</span>
                <span className="metric-title">Surplus for New Goals</span>
              </div>
              <div className="metric-value text-teal">{formatIndianCurrency(result.surplus.monthlySurplus)} <small>/ mo</small></div>
              <span className="metric-sub">Annual: {formatLakhsCrores(result.surplus.annualSurplus)}</span>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-icon">⚖️</span>
                <span className="metric-title">Debt-to-Asset Ratio</span>
              </div>
              <div className="metric-value">{result.assets.totalAssets > 0 ? `${result.metrics.debtToAssetRatio}%` : '0%'}</div>
              <span className="metric-sub">{result.metrics.debtToAssetRatio <= 30 ? 'Manageable leverage' : 'Active review suggested'}</span>
            </div>
          </div>

          {/* Financial Story Visual Flow */}
          <div className="story-flow-card">
            <h3 className="card-section-title">Your Complete Cash Flow & Balance Sheet Story</h3>
            <div className="flow-steps-track">
              <div className="flow-node">
                <span className="flow-label">1. EARN</span>
                <span className="flow-val">{formatLakhsCrores(result.income.totalAnnualIncome)}</span>
                <span className="flow-sub">Annual Gross</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-node">
                <span className="flow-label">2. SPEND</span>
                <span className="flow-val">{formatLakhsCrores(result.expenses.totalAnnualExpenses)}</span>
                <span className="flow-sub">Annual Living</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-node">
                <span className="flow-label">3. SAVE</span>
                <span className="flow-val">{formatLakhsCrores(result.savings.annualSavings)}</span>
                <span className="flow-sub">{result.savings.savingsRate}% Rate</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-node">
                <span className="flow-label">4. INVEST</span>
                <span className="flow-val">{formatLakhsCrores(result.investments.totalAnnualInvestments)}</span>
                <span className="flow-sub">Existing SIPs</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-node highlight-node">
                <span className="flow-label">5. SURPLUS</span>
                <span className="flow-val text-teal">{formatIndianCurrency(result.surplus.monthlySurplus)}</span>
                <span className="flow-sub">per month</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-node">
                <span className="flow-label">6. OWN</span>
                <span className="flow-val">{formatLakhsCrores(result.assets.totalAssets)}</span>
                <span className="flow-sub">Total Assets</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-node">
                <span className="flow-label">7. OWE</span>
                <span className="flow-val">{formatLakhsCrores(result.liabilities.totalLiabilities)}</span>
                <span className="flow-sub">Liabilities</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-node hero-node">
                <span className="flow-label">NET WORTH</span>
                <span className="flow-val text-gold">{formatLakhsCrores(result.actualNetWorth)}</span>
                <span className="flow-sub">Actual Liquid/Productive</span>
              </div>
            </div>
          </div>

          {/* Asset Allocation Breakdown */}
          <div className="allocation-card">
            <h3 className="card-section-title">Asset Allocation Distribution</h3>
            <p className="card-section-desc">
              How your ₹{formatLakhsCrores(result.assets.totalAssets)} total assets are distributed across asset classes.
            </p>

            {/* Visual Stacked Progress Bar */}
            {result.assets.totalAssets > 0 && (
              <div className="stacked-allocation-bar">
                <div className="bar-segment seg-liquid" style={{ width: `${result.assets.allocationPercentages.liquid}%` }} title={`Liquid: ${result.assets.allocationPercentages.liquid}%`}></div>
                <div className="bar-segment seg-debt" style={{ width: `${result.assets.allocationPercentages.debt}%` }} title={`Debt: ${result.assets.allocationPercentages.debt}%`}></div>
                <div className="bar-segment seg-equity" style={{ width: `${result.assets.allocationPercentages.equity}%` }} title={`Equity: ${result.assets.allocationPercentages.equity}%`}></div>
                <div className="bar-segment seg-gold" style={{ width: `${result.assets.allocationPercentages.gold}%` }} title={`Gold: ${result.assets.allocationPercentages.gold}%`}></div>
                <div className="bar-segment seg-re" style={{ width: `${result.assets.allocationPercentages.realEstate}%` }} title={`Real Estate: ${result.assets.allocationPercentages.realEstate}%`}></div>
                <div className="bar-segment seg-personal" style={{ width: `${result.assets.allocationPercentages.personal}%` }} title={`Personal: ${result.assets.allocationPercentages.personal}%`}></div>
              </div>
            )}

            <div className="allocation-table">
              <div className="alloc-row">
                <div className="alloc-name"><span className="dot dot-liquid"></span> Liquid Assets</div>
                <div className="alloc-amount">{formatLakhsCrores(result.assets.categoryTotals.liquid)}</div>
                <div className="alloc-percent">{result.assets.allocationPercentages.liquid}%</div>
              </div>
              <div className="alloc-row">
                <div className="alloc-name"><span className="dot dot-debt"></span> Debt / Fixed Income</div>
                <div className="alloc-amount">{formatLakhsCrores(result.assets.categoryTotals.debt)}</div>
                <div className="alloc-percent">{result.assets.allocationPercentages.debt}%</div>
              </div>
              <div className="alloc-row">
                <div className="alloc-name"><span className="dot dot-equity"></span> Equity & Growth Assets</div>
                <div className="alloc-amount">{formatLakhsCrores(result.assets.categoryTotals.equity)}</div>
                <div className="alloc-percent">{result.assets.allocationPercentages.equity}%</div>
              </div>
              <div className="alloc-row">
                <div className="alloc-name"><span className="dot dot-gold"></span> Gold & Precious Metals</div>
                <div className="alloc-amount">{formatLakhsCrores(result.assets.categoryTotals.gold)}</div>
                <div className="alloc-percent">{result.assets.allocationPercentages.gold}%</div>
              </div>
              <div className="alloc-row">
                <div className="alloc-name"><span className="dot dot-re"></span> Real Estate</div>
                <div className="alloc-amount">{formatLakhsCrores(result.assets.categoryTotals.realEstate)}</div>
                <div className="alloc-percent">{result.assets.allocationPercentages.realEstate}%</div>
              </div>
              <div className="alloc-row">
                <div className="alloc-name"><span className="dot dot-personal"></span> Personal-Use Assets</div>
                <div className="alloc-amount">{formatLakhsCrores(result.assets.categoryTotals.personal)}</div>
                <div className="alloc-percent">{result.assets.allocationPercentages.personal}%</div>
              </div>
            </div>
          </div>

          {/* Factual Observation Cards */}
          {result.observations.length > 0 && (
            <div className="observations-section">
              <h3 className="card-section-title">Factual Financial Observations</h3>
              <div className="observations-grid">
                {result.observations.map((obs) => (
                  <div key={obs.id} className={`obs-card obs-${obs.type}`}>
                    <div className="obs-header">
                      <span className="obs-badge">{obs.category.toUpperCase()}</span>
                      <h4 className="obs-title">{obs.title}</h4>
                    </div>
                    <p className="obs-desc">{obs.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action CTA & WhatsApp Bridge */}
          <div className="consultation-cta-card">
            <div className="cta-content">
              <span className="cta-badge">Next Step</span>
              <h3 className="cta-title">Want help turning this financial snapshot into a clear action plan?</h3>
              <p className="cta-desc">
                Share your financial summary with Santhosh for a confidential, transparent review of your mutual fund roadmap and milestone planning.
              </p>
            </div>
            <div className="cta-actions">
              <a
                href={getWhatsAppMessageUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                <span className="wa-icon">💬</span>
                Talk to Ant Wealth on WhatsApp
              </a>
              <a href="/contact" className="btn-secondary-link">
                Schedule a Consultation →
              </a>
            </div>
          </div>

          {/* Discovery Links */}
          <div className="discovery-links-row">
            <a href="/health-check" className="discovery-card">
              <span className="disc-icon">🩺</span>
              <div>
                <span className="disc-title">3-Minute Financial Health Check</span>
                <span className="disc-sub">Evaluate your risk score, emergency buffer & insurance cover</span>
              </div>
              <span className="disc-arrow">→</span>
            </a>

            <a href="/plan/children" className="discovery-card">
              <span className="disc-icon">🎓</span>
              <div>
                <span className="disc-title">Children's Future Planner</span>
                <span className="disc-sub">Calculate inflation-adjusted milestone costs & step-up SIPs</span>
              </div>
              <span className="disc-arrow">→</span>
            </a>

            <a href="/tools?calc=retirement" className="discovery-card">
              <span className="disc-icon">🌅</span>
              <div>
                <span className="disc-title">Retirement Readiness Calculator</span>
                <span className="disc-sub">Estimate your required retirement corpus & monthly SIP</span>
              </div>
              <span className="disc-arrow">→</span>
            </a>
          </div>

          {/* Regulatory Compliance Footer */}
          <div className="compliance-footnote">
            <p>
              <strong>Ant Wealth Creation</strong> • AMFI-Registered Mutual Fund Distributor (ARN: 266896) • QPFP Certified.
            </p>
            <p>
              Mutual fund investments are subject to market risks, read all scheme related documents carefully. This REAL Financial Statement is an educational diagnostic assessment designed to illustrate your financial position and does not constitute guaranteed return or financial advice.
            </p>
          </div>

          <div className="dashboard-bottom-actions">
            <button type="button" onClick={() => setStep(1)} className="btn-secondary">
              ← Edit Financial Inputs
            </button>
            <button type="button" onClick={resetAllData} className="btn-secondary">
              🔄 Start Fresh Assessment
            </button>
          </div>
        </section>
      )}

      {/* Styled JSX / Scoped Vanilla CSS */}
      <style>{`
        .real-statement-container {
          max-width: 1000px;
          margin: 0 auto;
          font-family: 'Inter', sans-serif;
          color: #00182A;
        }

        .planner-top-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .tool-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 0.85rem;
          background-color: rgba(0, 171, 150, 0.1);
          color: #00AB96;
          border-radius: 9999px;
          font-size: 0.85rem;
          font-weight: 700;
        }

        .badge-pulse {
          width: 8px;
          height: 8px;
          background-color: #00AB96;
          border-radius: 50%;
        }

        .sample-btn-group {
          display: flex;
          gap: 0.5rem;
        }

        .btn-secondary-sm {
          padding: 0.4rem 0.75rem;
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 6px;
          color: #334155;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-secondary-sm:hover {
          background-color: #F1F5F9;
          border-color: #CBD5E1;
        }

        /* Stepper Navigation */
        .stepper-nav {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
          scrollbar-width: thin;
        }

        .step-pill {
          flex: 1;
          min-width: 110px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding: 0.75rem 0.5rem;
          background-color: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 10px;
          color: #64748B;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .step-pill:hover {
          border-color: #00AB96;
          color: #00182A;
        }

        .step-pill.active {
          background-color: #00182A;
          border-color: #00182A;
          color: #FFFFFF;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(0, 24, 42, 0.15);
        }

        .step-pill.completed:not(.active) {
          border-color: #00AB96;
          color: #00AB96;
          background-color: rgba(0, 171, 150, 0.04);
        }

        .step-num {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          background-color: rgba(0, 0, 0, 0.06);
          border-radius: 50%;
          font-size: 0.75rem;
        }

        .step-pill.active .step-num {
          background-color: #00AB96;
          color: #FFFFFF;
        }

        .results-pill.active {
          background-color: #00AB96;
          border-color: #00AB96;
        }

        /* Step Card */
        .step-card {
          background-color: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        }

        .step-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          gap: 1.5rem;
          border-bottom: 1px solid #F1F5F9;
          padding-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .step-subtitle {
          font-size: 0.8rem;
          font-weight: 700;
          color: #00AB96;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: block;
          margin-bottom: 0.25rem;
        }

        .step-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.75rem;
          font-weight: 700;
          color: #00182A;
          margin: 0 0 0.5rem 0;
        }

        .step-desc {
          color: #64748B;
          font-size: 0.95rem;
          margin: 0;
          max-width: 540px;
          line-height: 1.5;
        }

        .live-stat-card {
          background: linear-gradient(135deg, #00182A 0%, #0B2B43 100%);
          color: #FFFFFF;
          padding: 1rem 1.25rem;
          border-radius: 12px;
          min-width: 220px;
          text-align: right;
        }

        .stat-label {
          display: block;
          font-size: 0.75rem;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
        }

        .stat-value {
          display: block;
          font-family: 'Outfit', sans-serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: #FFC107;
        }

        .stat-sub {
          display: block;
          font-size: 0.8rem;
          color: #CBD5E1;
          margin-top: 0.25rem;
        }

        /* Inputs Grid */
        .inputs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .input-field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .input-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #334155;
        }

        .optional-tag {
          font-size: 0.75rem;
          color: #94A3B8;
          font-weight: 400;
        }

        .badge-personal {
          display: inline-block;
          font-size: 0.7rem;
          background-color: #FEF3C7;
          color: #92400E;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          font-weight: 700;
          margin-left: 0.4rem;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-prefix {
          position: absolute;
          left: 0.85rem;
          color: #64748B;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .number-input {
          width: 100%;
          padding: 0.65rem 0.85rem 0.65rem 2rem;
          border: 1.5px solid #CBD5E1;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          color: #00182A;
          background-color: #F8FAFC;
          transition: all 0.2s ease;
        }

        .number-input:focus {
          outline: none;
          border-color: #00AB96;
          background-color: #FFFFFF;
          box-shadow: 0 0 0 3px rgba(0, 171, 150, 0.15);
        }

        .input-helper {
          font-size: 0.78rem;
          color: #00AB96;
          font-weight: 600;
        }

        /* Accordion Groups */
        .accordion-group {
          border: 1.5px solid #E2E8F0;
          border-radius: 12px;
          margin-bottom: 1rem;
          overflow: hidden;
          background-color: #FFFFFF;
        }

        .accordion-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.25rem;
          background-color: #F8FAFC;
          border: none;
          cursor: pointer;
          text-align: left;
          transition: background-color 0.2s ease;
        }

        .accordion-header:hover {
          background-color: #F1F5F9;
        }

        .accordion-title-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .accordion-icon {
          font-size: 1.4rem;
        }

        .accordion-title {
          display: block;
          font-family: 'Outfit', sans-serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: #00182A;
        }

        .accordion-sub {
          display: block;
          font-size: 0.8rem;
          color: #64748B;
        }

        .accordion-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .accordion-val {
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          color: #00182A;
          font-size: 1rem;
        }

        .accordion-arrow {
          color: #94A3B8;
          font-size: 0.8rem;
        }

        .accordion-content {
          padding: 1.25rem;
          border-top: 1px solid #E2E8F0;
          background-color: #FFFFFF;
        }

        /* Step 3 Highlights */
        .savings-highlight-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
          margin-bottom: 1.75rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .highlight-column {
          display: flex;
          flex-direction: column;
        }

        .highlight-label {
          font-size: 0.8rem;
          color: #64748B;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .highlight-value {
          font-family: 'Outfit', sans-serif;
          font-size: 1.3rem;
          font-weight: 700;
          color: #00182A;
        }

        .highlight-sub {
          font-size: 0.8rem;
          color: #00AB96;
          font-weight: 600;
        }

        .highlight-sep {
          font-size: 1.5rem;
          font-weight: 700;
          color: #94A3B8;
        }

        .section-divider-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #00182A;
          margin: 1.5rem 0 1rem 0;
        }

        /* Surplus Hero Box */
        .surplus-hero-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, rgba(0, 171, 150, 0.08) 0%, rgba(0, 24, 42, 0.04) 100%);
          border: 1.5px solid #00AB96;
          border-radius: 14px;
          padding: 1.5rem 1.75rem;
          margin-top: 1.5rem;
          flex-wrap: wrap;
          gap: 1.25rem;
        }

        .surplus-badge {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          color: #00AB96;
          background-color: #FFFFFF;
          padding: 0.2rem 0.6rem;
          border-radius: 9999px;
          margin-bottom: 0.35rem;
        }

        .surplus-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.35rem;
          font-weight: 700;
          color: #00182A;
          margin: 0 0 0.25rem 0;
        }

        .surplus-desc {
          font-size: 0.85rem;
          color: #475569;
          margin: 0;
          max-width: 480px;
        }

        .surplus-figure-box {
          text-align: right;
        }

        .surplus-monthly {
          display: block;
          font-family: 'Outfit', sans-serif;
          font-size: 1.85rem;
          font-weight: 800;
          color: #00AB96;
        }

        .surplus-monthly small {
          font-size: 1rem;
          color: #64748B;
          font-weight: 600;
        }

        .surplus-annual {
          display: block;
          font-size: 0.85rem;
          color: #64748B;
          font-weight: 600;
          margin-top: 0.25rem;
        }

        /* Actions */
        .step-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #F1F5F9;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn-primary {
          padding: 0.85rem 1.75rem;
          background-color: #00AB96;
          color: #FFFFFF;
          border: none;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-primary:hover {
          background-color: #009684;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 171, 150, 0.25);
        }

        .btn-secondary {
          padding: 0.85rem 1.5rem;
          background-color: #F8FAFC;
          color: #334155;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-secondary:hover {
          background-color: #E2E8F0;
        }

        /* RESULTS DASHBOARD */
        .results-dashboard {
          margin-bottom: 3rem;
        }

        .networth-hero-card {
          background: linear-gradient(145deg, #00182A 0%, #0B2B43 100%);
          color: #FFFFFF;
          border-radius: 20px;
          padding: 2.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 10px 30px rgba(0, 24, 42, 0.18);
          position: relative;
          overflow: hidden;
        }

        .hero-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .hero-badge {
          display: inline-block;
          padding: 0.35rem 0.85rem;
          background-color: rgba(255, 193, 7, 0.15);
          color: #FFC107;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .hero-methodology-tag {
          font-size: 0.8rem;
          color: #94A3B8;
        }

        .hero-main-label {
          display: block;
          font-size: 0.9rem;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .hero-primary-val {
          font-family: 'Outfit', sans-serif;
          font-size: 3.5rem;
          font-weight: 800;
          color: #00AB96;
          line-height: 1.1;
          margin-bottom: 1rem;
        }

        .hero-explainer {
          font-size: 0.95rem;
          color: #CBD5E1;
          line-height: 1.6;
          max-width: 720px;
          margin: 0 0 2rem 0;
        }

        .hero-breakdown-grid {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .breakdown-item {
          display: flex;
          flex-direction: column;
        }

        .breakdown-label {
          font-size: 0.75rem;
          color: #94A3B8;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .breakdown-val {
          font-family: 'Outfit', sans-serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: #FFFFFF;
        }

        .breakdown-sep {
          font-size: 1.3rem;
          font-weight: 700;
          color: #64748B;
        }

        .notional-note-box {
          font-size: 0.85rem;
          color: #94A3B8;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 0.85rem;
        }

        .notional-note-box strong {
          color: #FFFFFF;
        }

        /* Metrics Grid */
        .dashboard-metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.25rem;
          margin-bottom: 2rem;
        }

        .metric-card {
          background-color: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 14px;
          padding: 1.5rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
        }

        .metric-card.highlight-metric {
          border-color: #00AB96;
          background: linear-gradient(145deg, #FFFFFF 0%, rgba(0, 171, 150, 0.04) 100%);
        }

        .metric-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .metric-icon {
          font-size: 1.2rem;
        }

        .metric-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: #64748B;
        }

        .metric-value {
          font-family: 'Outfit', sans-serif;
          font-size: 1.85rem;
          font-weight: 800;
          color: #00182A;
          margin-bottom: 0.25rem;
        }

        .metric-sub {
          font-size: 0.8rem;
          color: #64748B;
          font-weight: 500;
        }

        /* Story Flow Track */
        .story-flow-card {
          background-color: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .card-section-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.35rem;
          font-weight: 700;
          color: #00182A;
          margin: 0 0 0.5rem 0;
        }

        .card-section-desc {
          font-size: 0.9rem;
          color: #64748B;
          margin: 0 0 1.5rem 0;
        }

        .flow-steps-track {
          display: flex;
          align-items: center;
          justify-content: space-between;
          overflow-x: auto;
          padding: 1rem 0.5rem;
          gap: 0.5rem;
        }

        .flow-node {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          min-width: 90px;
          padding: 0.75rem 0.5rem;
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
        }

        .flow-node.highlight-node {
          border-color: #00AB96;
          background-color: rgba(0, 171, 150, 0.05);
        }

        .flow-node.hero-node {
          border-color: #00182A;
          background-color: #00182A;
          color: #FFFFFF;
        }

        .flow-label {
          font-size: 0.7rem;
          font-weight: 700;
          color: #64748B;
          margin-bottom: 0.25rem;
        }

        .flow-node.hero-node .flow-label {
          color: #FFC107;
        }

        .flow-val {
          font-family: 'Outfit', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          color: #00182A;
        }

        .flow-node.hero-node .flow-val {
          color: #FFFFFF;
        }

        .flow-sub {
          font-size: 0.7rem;
          color: #94A3B8;
          margin-top: 0.2rem;
        }

        .flow-arrow {
          font-size: 1.1rem;
          color: #CBD5E1;
          font-weight: 700;
        }

        /* Allocation Card */
        .allocation-card {
          background-color: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .stacked-allocation-bar {
          display: flex;
          height: 18px;
          border-radius: 9999px;
          overflow: hidden;
          margin-bottom: 1.5rem;
          background-color: #E2E8F0;
        }

        .bar-segment {
          height: 100%;
          transition: width 0.3s ease;
        }

        .seg-liquid { background-color: #06B6D4; }
        .seg-debt { background-color: #3B82F6; }
        .seg-equity { background-color: #00AB96; }
        .seg-gold { background-color: #F59E0B; }
        .seg-re { background-color: #8B5CF6; }
        .seg-personal { background-color: #94A3B8; }

        .allocation-table {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 0.75rem;
        }

        .alloc-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          background-color: #F8FAFC;
          border-radius: 8px;
          border: 1px solid #E2E8F0;
        }

        .alloc-name {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: #334155;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .dot-liquid { background-color: #06B6D4; }
        .dot-debt { background-color: #3B82F6; }
        .dot-equity { background-color: #00AB96; }
        .dot-gold { background-color: #F59E0B; }
        .dot-re { background-color: #8B5CF6; }
        .dot-personal { background-color: #94A3B8; }

        .alloc-amount {
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          color: #00182A;
          font-size: 0.9rem;
        }

        .alloc-percent {
          font-size: 0.8rem;
          font-weight: 700;
          color: #64748B;
          min-width: 40px;
          text-align: right;
        }

        /* Observations */
        .observations-section {
          margin-bottom: 2rem;
        }

        .observations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
        }

        .obs-card {
          padding: 1.25rem;
          border-radius: 12px;
          background-color: #FFFFFF;
          border: 1.5px solid #E2E8F0;
        }

        .obs-card.obs-positive {
          border-left: 4px solid #00AB96;
        }

        .obs-card.obs-neutral {
          border-left: 4px solid #3B82F6;
        }

        .obs-card.obs-caution {
          border-left: 4px solid #F59E0B;
        }

        .obs-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.4rem;
        }

        .obs-badge {
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          background-color: #F1F5F9;
          color: #64748B;
        }

        .obs-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #00182A;
          margin: 0;
        }

        .obs-desc {
          font-size: 0.85rem;
          color: #475569;
          line-height: 1.5;
          margin: 0;
        }

        /* Consultation CTA Card */
        .consultation-cta-card {
          background: linear-gradient(135deg, #00182A 0%, #0B2B43 100%);
          color: #FFFFFF;
          border-radius: 16px;
          padding: 2.25rem;
          margin-bottom: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .cta-badge {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          color: #00AB96;
          background-color: rgba(0, 171, 150, 0.15);
          padding: 0.25rem 0.65rem;
          border-radius: 9999px;
          margin-bottom: 0.5rem;
        }

        .cta-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 0.5rem 0;
        }

        .cta-desc {
          font-size: 0.9rem;
          color: #CBD5E1;
          margin: 0;
          max-width: 520px;
          line-height: 1.5;
        }

        .cta-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          min-width: 260px;
        }

        .btn-whatsapp {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background-color: #25D366;
          color: #FFFFFF;
          padding: 0.9rem 1.25rem;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.95rem;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .btn-whatsapp:hover {
          background-color: #20BA5A;
          transform: translateY(-1px);
        }

        .btn-secondary-link {
          text-align: center;
          color: #CBD5E1;
          font-size: 0.85rem;
          font-weight: 600;
          text-decoration: none;
        }

        .btn-secondary-link:hover {
          color: #FFFFFF;
          text-decoration: underline;
        }

        /* Discovery Links */
        .discovery-links-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .discovery-card {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 1.25rem;
          background-color: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 12px;
          text-decoration: none;
          color: #00182A;
          transition: all 0.2s ease;
        }

        .discovery-card:hover {
          border-color: #00AB96;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .disc-icon {
          font-size: 1.5rem;
        }

        .disc-title {
          display: block;
          font-family: 'Outfit', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          color: #00182A;
        }

        .disc-sub {
          display: block;
          font-size: 0.75rem;
          color: #64748B;
        }

        .disc-arrow {
          margin-left: auto;
          color: #00AB96;
          font-weight: 700;
        }

        /* Compliance Footnote */
        .compliance-footnote {
          padding: 1.25rem;
          background-color: #F8FAFC;
          border-radius: 10px;
          border: 1px solid #E2E8F0;
          font-size: 0.78rem;
          color: #64748B;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .compliance-footnote p {
          margin: 0 0 0.4rem 0;
        }

        .compliance-footnote p:last-child {
          margin-bottom: 0;
        }

        .dashboard-bottom-actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        /* Utility classes */
        .text-teal { color: #00AB96; }
        .text-gold { color: #FFC107; }

        .fade-in {
          animation: fadeIn 0.25s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .step-card {
            padding: 1.25rem 1rem;
          }

          .networth-hero-card {
            padding: 1.5rem 1.25rem;
          }

          .hero-primary-val {
            font-size: 2.6rem;
          }

          .inputs-grid {
            grid-template-columns: 1fr;
          }

          .consultation-cta-card {
            padding: 1.5rem 1.25rem;
          }

          .cta-actions {
            width: 100%;
          }

          .savings-highlight-card {
            flex-direction: column;
            align-items: flex-start;
          }

          .highlight-sep {
            display: none;
          }

          .surplus-hero-box {
            flex-direction: column;
            align-items: flex-start;
          }

          .surplus-figure-box {
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
}
