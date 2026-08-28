import React, { useState, useEffect, useId } from 'react';
import { calculateGoal } from '../../utils/calculations/goalPlanner';

export interface GoalPreset {
  id: string;
  name: string;
  icon: string;
  defaultCost: number;
  defaultYears: number;
  defaultInflation: number;
  defaultReturn: number;
  description: string;
}

export const GOAL_PRESETS: GoalPreset[] = [
  {
    id: 'home',
    name: 'Buy a Home',
    icon: '🏡',
    defaultCost: 3500000,
    defaultYears: 7,
    defaultInflation: 5,
    defaultReturn: 11,
    description: 'Build a comfortable 20-30% down payment cushion for your family home.'
  },
  {
    id: 'education',
    name: "Child's Education",
    icon: '🎓',
    defaultCost: 2500000,
    defaultYears: 12,
    defaultInflation: 8,
    defaultReturn: 12,
    description: 'Ensure college and higher education fees are ready without student debt.'
  },
  {
    id: 'retirement',
    name: 'Retirement',
    icon: '🌅',
    defaultCost: 15000000,
    defaultYears: 20,
    defaultInflation: 6,
    defaultReturn: 12,
    description: 'Create an enduring retirement nest egg that generates perpetual passive income.'
  },
  {
    id: 'wealth',
    name: 'Build Long-Term Wealth',
    icon: '📈',
    defaultCost: 10000000,
    defaultYears: 15,
    defaultInflation: 6,
    defaultReturn: 13,
    description: 'Harness 15+ years of equity compounding to build long-term security.'
  },
  {
    id: 'wedding',
    name: 'Wedding',
    icon: '💍',
    defaultCost: 2000000,
    defaultYears: 8,
    defaultInflation: 7,
    defaultReturn: 11,
    description: 'Celebrate important life milestones joyfully with zero high-interest personal loans.'
  },
  {
    id: 'car',
    name: 'Buy a Car',
    icon: '🚗',
    defaultCost: 1500000,
    defaultYears: 4,
    defaultInflation: 4,
    defaultReturn: 10,
    description: 'Accumulate capital for your dream vehicle with minimal loan financing.'
  },
  {
    id: 'custom',
    name: 'Something Else',
    icon: '🎯',
    defaultCost: 3000000,
    defaultYears: 10,
    defaultInflation: 6,
    defaultReturn: 12,
    description: 'Tailor-make an investment plan for any personal milestone.'
  }
];

function getInitialPreset(initialGoalId: string = 'education'): GoalPreset {
  if (typeof window !== 'undefined') {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const queryGoal = urlParams.get('goal');
      const goalKey = queryGoal || initialGoalId;
      const found = GOAL_PRESETS.find(p => p.id === goalKey || p.id.toLowerCase() === goalKey.toLowerCase());
      if (found) return found;
    } catch {
      // Fallback
    }
  }
  return GOAL_PRESETS.find(p => p.id === initialGoalId) || GOAL_PRESETS[0];
}

interface GoalPlannerProps {
  initialGoalId?: string;
}

export default function GoalPlannerCalculator({ initialGoalId = 'education' }: GoalPlannerProps) {
  const defaultPreset = GOAL_PRESETS.find(p => p.id === initialGoalId) || GOAL_PRESETS[0];
  const [selectedGoalId, setSelectedGoalId] = useState<string>(defaultPreset.id);
  const [goalName, setGoalName] = useState<string>(defaultPreset.name);
  const [targetCostToday, setTargetCostToday] = useState<number>(defaultPreset.defaultCost);
  const [yearsToGoal, setYearsToGoal] = useState<number>(defaultPreset.defaultYears);
  const [expectedInflation, setExpectedInflation] = useState<number>(defaultPreset.defaultInflation);
  const [currentSavings, setCurrentSavings] = useState<number>(200000);
  const [expectedReturnRate, setExpectedReturnRate] = useState<number>(defaultPreset.defaultReturn);
  const [stepUpPercentage, setStepUpPercentage] = useState<number>(5);
  const [enableStepUp, setEnableStepUp] = useState<boolean>(false);

  const costId = useId();
  const yearsId = useId();
  const infId = useId();
  const savId = useId();
  const retId = useId();
  const stepUpId = useId();

  // Listen to initialGoalId changes and popstate events
  useEffect(() => {
    const handlePopState = () => {
      const preset = getInitialPreset(initialGoalId);
      setSelectedGoalId(preset.id);
      setGoalName(preset.name);
      setTargetCostToday(preset.defaultCost);
      setYearsToGoal(preset.defaultYears);
      setExpectedInflation(preset.defaultInflation);
      setExpectedReturnRate(preset.defaultReturn);
    };

    // Sync on initial mount in browser
    handlePopState();

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [initialGoalId]);

  const handleSelectPreset = (preset: GoalPreset) => {
    setSelectedGoalId(preset.id);
    setGoalName(preset.name);
    setTargetCostToday(preset.defaultCost);
    setYearsToGoal(preset.defaultYears);
    setExpectedInflation(preset.defaultInflation);
    setExpectedReturnRate(preset.defaultReturn);

    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('goal', preset.id);
        window.history.pushState({ goal: preset.id }, '', url.toString());
      } catch {
        const newUrl = `${window.location.pathname}?goal=${preset.id}`;
        window.history.pushState({ goal: preset.id }, '', newUrl);
      }
    }
  };

  const result = calculateGoal({
    goalName,
    targetCostToday: Number(targetCostToday) || 0,
    yearsToGoal: Number(yearsToGoal) || 1,
    expectedInflation: Number(expectedInflation) || 0,
    currentSavings: Number(currentSavings) || 0,
    expectedReturnRate: Number(expectedReturnRate) || 0,
    stepUpPercentage: enableStepUp ? Number(stepUpPercentage) || 0 : 0
  });

  return (
    <div className="goal-planner-wrapper">
      {/* Preset Goal Selector Cards */}
      <div className="preset-selector-row">
        <span className="preset-row-label">Select Your Goal:</span>
        <div className="preset-chips">
          {GOAL_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className={`preset-chip ${selectedGoalId === preset.id ? 'chip-active' : ''}`}
            >
              <span className="chip-icon">{preset.icon}</span>
              <span className="chip-name">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {(selectedGoalId === 'education' || selectedGoalId === 'wedding') && (
        <div className="child-planner-discovery-banner">
          <div className="discovery-banner-content">
            <span className="discovery-icon">👶</span>
            <div className="discovery-text">
              <strong>Planning multiple milestones for your child?</strong>
              <span>Use our comprehensive multi-goal Children's Future Planner to model Graduation, Post-Graduation, and Marriage together in one plan.</span>
            </div>
          </div>
          <a href="/plan/children" className="discovery-btn">
            Open Children's Future Planner →
          </a>
        </div>
      )}

      <div className="calc-grid">
        {/* Inputs */}
        <div className="calc-input-panel">
          <div className="panel-header">
            <h2 className="panel-title">{goalName} Parameters</h2>
            <span className="goal-type-badge">Inflation-Adjusted</span>
          </div>

          {/* Goal Cost in Today's Money */}
          <div className="form-group">
            <div className="label-row">
              <label htmlFor={costId} className="field-label">Target Cost in Today's Rupees</label>
              <div className="input-currency-wrapper">
                <span className="currency-prefix">₹</span>
                <input
                  id={costId}
                  type="number"
                  min="50000"
                  max="100000000"
                  step="50000"
                  value={targetCostToday}
                  onChange={(e) => setTargetCostToday(Number(e.target.value))}
                  className="number-input"
                />
              </div>
            </div>
            <input
              type="range"
              min="100000"
              max="20000000"
              step="50000"
              value={targetCostToday}
              onChange={(e) => setTargetCostToday(Number(e.target.value))}
              className="range-slider"
            />
            <div className="slider-limits">
              <span>₹1 Lakh</span>
              <span>₹2 Crore</span>
            </div>
          </div>

          {/* Years to Goal */}
          <div className="form-group">
            <div className="label-row">
              <label htmlFor={yearsId} className="field-label">Years Until Goal</label>
              <div className="input-currency-wrapper">
                <input
                  id={yearsId}
                  type="number"
                  min="1"
                  max="40"
                  value={yearsToGoal}
                  onChange={(e) => setYearsToGoal(Number(e.target.value))}
                  className="number-input-sm"
                />
                <span className="unit-suffix">Yrs</span>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={yearsToGoal}
              onChange={(e) => setYearsToGoal(Number(e.target.value))}
              className="range-slider"
            />
            <div className="slider-limits">
              <span>1 Year</span>
              <span>30 Years</span>
            </div>
          </div>

          {/* Current Savings Assigned */}
          <div className="form-group">
            <div className="label-row">
              <label htmlFor={savId} className="field-label">Current Savings Earmarked</label>
              <div className="input-currency-wrapper">
                <span className="currency-prefix">₹</span>
                <input
                  id={savId}
                  type="number"
                  min="0"
                  max="50000000"
                  step="25000"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(Number(e.target.value))}
                  className="number-input"
                />
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="3000000"
              step="25000"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(Number(e.target.value))}
              className="range-slider"
            />
            <div className="slider-limits">
              <span>₹0</span>
              <span>₹30 Lakh</span>
            </div>
          </div>

          {/* Inflation and Return Rates */}
          <div className="two-col-inputs">
            <div className="form-group">
              <label htmlFor={infId} className="field-label-sub">Expected Inflation</label>
              <div className="input-currency-wrapper">
                <input
                  id={infId}
                  type="number"
                  min="2"
                  max="15"
                  step="0.5"
                  value={expectedInflation}
                  onChange={(e) => setExpectedInflation(Number(e.target.value))}
                  className="number-input-sm"
                />
                <span className="unit-suffix">%</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor={retId} className="field-label-sub">Expected Investment Return</label>
              <div className="input-currency-wrapper">
                <input
                  id={retId}
                  type="number"
                  min="4"
                  max="20"
                  step="0.5"
                  value={expectedReturnRate}
                  onChange={(e) => setExpectedReturnRate(Number(e.target.value))}
                  className="number-input-sm"
                />
                <span className="unit-suffix">%</span>
              </div>
            </div>
          </div>

          {/* Step-up toggle */}
          <div className="step-up-box">
            <div className="step-up-toggle-row">
              <label className="switch-label">
                <input
                  type="checkbox"
                  checked={enableStepUp}
                  onChange={(e) => setEnableStepUp(e.target.checked)}
                  className="checkbox-input"
                />
                <span className="switch-text">Plan with Annual Step-Up SIP (+{stepUpPercentage}%)</span>
              </label>
            </div>
            {enableStepUp && (
              <div className="step-up-control">
                <input
                  id={stepUpId}
                  type="range"
                  min="1"
                  max="20"
                  step="1"
                  value={stepUpPercentage}
                  onChange={(e) => setStepUpPercentage(Number(e.target.value))}
                  className="range-slider"
                />
                <span className="step-up-hint">
                  Starting with lower monthly SIP and increasing by {stepUpPercentage}% annually as salary increments arrive.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="calc-result-panel">
          <div className="result-hero-box">
            <span className="result-tag">Estimated Future Cost ({yearsToGoal} Years)</span>
            <div className="maturity-number">₹{result.futureGoalCost.toLocaleString('en-IN')}</div>
            <p className="result-note">
              Adjusted for {expectedInflation}% annual inflation from today's ₹{targetCostToday.toLocaleString('en-IN')}.
            </p>
          </div>

          {/* Estimated Monthly SIP Box */}
          <div className="sip-highlight-box">
            <span className="sip-highlight-label">Estimated Monthly SIP to Achieve Goal</span>
            <div className="sip-highlight-value">₹{result.requiredMonthlySIP.toLocaleString('en-IN')} / month</div>
            <span className="sip-highlight-sub">
              {enableStepUp 
                ? `Starting monthly SIP with ${stepUpPercentage}% annual step-up` 
                : `Fixed monthly SIP invested for ${yearsToGoal} years @ ${expectedReturnRate}%`}
            </span>
          </div>

          {/* Breakdown Cards */}
          <div className="result-metrics-grid">
            <div className="metric-box">
              <div className="metric-details">
                <span className="metric-title">Existing Corpus Growth</span>
                <span className="metric-value">₹{result.existingSavingsGrowth.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="metric-box">
              <div className="metric-details">
                <span className="metric-title">Net Target Shortfall</span>
                <span className="metric-value">₹{result.shortfall.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="calc-action-block">
            <a 
              href={`https://wa.me/918087971566?text=${encodeURIComponent(
                `Hi Santhosh, I used the Goal Planner on Ant Wealth Creation.\n\n` +
                `• Goal: ${goalName}\n` +
                `• Time Horizon: ${yearsToGoal} Years\n` +
                `• Target Future Cost: ₹${result.futureGoalCost.toLocaleString('en-IN')}\n` +
                `• Estimated Monthly SIP: ₹${result.requiredMonthlySIP.toLocaleString('en-IN')}/month\n\n` +
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

          {/* Educational Notes */}
          <div className="calc-explanation">
            <h4>How this goal is planned</h4>
            <p>
              We first adjust today's cost for {expectedInflation}% inflation, subtract the compounding growth of your existing savings, and then calculate the estimated monthly SIP requirement needed to potentially build the remaining corpus on schedule.
            </p>
            <p className="disclaimer-text">
              *All projections are educational illustrations based on the assumptions entered and do not guarantee market returns.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .goal-planner-wrapper {
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 2.25rem;
          box-shadow: 0 4px 20px rgba(0, 24, 42, 0.04);
        }

        .preset-selector-row {
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #E2E8F0;
        }

        .preset-row-label {
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748B;
          display: block;
          margin-bottom: 0.75rem;
        }

        .preset-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
        }

        .preset-chip {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 9999px;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .preset-chip:hover {
          background-color: #F1F5F9;
          border-color: #CBD5E1;
        }

        .chip-active {
          background-color: #00182A !important;
          border-color: #00182A !important;
          color: #FFFFFF !important;
        }

        .chip-icon {
          font-size: 1rem;
        }

        .child-planner-discovery-banner {
          background: linear-gradient(135deg, #00182A 0%, #002B49 100%);
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
          margin-bottom: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
          color: #FFFFFF;
          box-shadow: 0 4px 15px rgba(0, 24, 42, 0.08);
        }

        .discovery-banner-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .discovery-icon {
          font-size: 2rem;
          background-color: rgba(255, 255, 255, 0.1);
          width: 48px;
          height: 48px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .discovery-text {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .discovery-text strong {
          font-family: 'Outfit', sans-serif;
          font-size: 1.05rem;
          color: #FFC107;
        }

        .discovery-text span {
          font-size: 0.85rem;
          color: #CBD5E1;
          line-height: 1.4;
        }

        .discovery-btn {
          background-color: #00AB96;
          color: #FFFFFF;
          padding: 0.65rem 1.15rem;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.875rem;
          text-decoration: none;
          white-space: nowrap;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .discovery-btn:hover {
          background-color: #008F7D;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .child-planner-discovery-banner {
            flex-direction: column;
            align-items: flex-start;
          }
          .discovery-btn {
            width: 100%;
            text-align: center;
          }
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

        .goal-type-badge {
          font-size: 0.75rem;
          font-weight: 700;
          color: #00AB96;
          background-color: rgba(0, 171, 150, 0.1);
          padding: 0.2rem 0.5rem;
          border-radius: 9999px;
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

        .step-up-box {
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.25rem;
          margin-top: 1rem;
        }

        .step-up-toggle-row {
          display: flex;
          align-items: center;
        }

        .switch-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 600;
          color: #00182A;
        }

        .checkbox-input {
          width: 18px;
          height: 18px;
          accent-color: #00AB96;
          cursor: pointer;
        }

        .step-up-control {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid #E2E8F0;
        }

        .step-up-hint {
          display: block;
          font-size: 0.8rem;
          color: #64748B;
          margin-top: 0.4rem;
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
          .goal-planner-wrapper {
            padding: 1.5rem;
          }
          .two-col-inputs {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 540px) {
          .goal-planner-wrapper {
            padding: 1.25rem 0.875rem;
            border-radius: 12px;
          }

          .preset-selector-row {
            margin-bottom: 1.25rem;
            padding-bottom: 1rem;
          }

          .preset-chips {
            gap: 0.4rem;
          }

          .preset-chip {
            padding: 0.4rem 0.75rem;
            font-size: 0.8rem;
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

          .sip-number {
            font-size: 1.85rem;
          }

          .sip-words {
            font-size: 1rem;
          }

          .metrics-summary-grid {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }

          .summary-card {
            padding: 0.75rem 0.85rem;
          }

          .funding-breakdown-row {
            flex-direction: column;
            gap: 0.35rem;
            padding: 0.6rem 0.85rem;
          }
        }
      `}</style>
    </div>
  );
}
