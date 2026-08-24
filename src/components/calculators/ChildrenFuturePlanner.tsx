import React, { useState, useId } from 'react';
import {
  calculateChildrenFuturePlan,
  getDefaultReturnForHorizon,
  getGoalInflationConfig,
  PLANNER_DEFAULTS,
  type ChildGoalInput,
  type GoalPresetType,
  type ChildPlannerSummaryResult,
} from '../../utils/calculations/childrenFuturePlanner';

export interface GoalPresetOption {
  type: GoalPresetType;
  name: string;
  icon: string;
  defaultAge: number;
  defaultCost: number;
  defaultInflation: number;
  description: string;
}

const PRESET_OPTIONS: GoalPresetOption[] = [
  {
    type: 'graduation',
    name: 'Graduation (Bachelor Degree)',
    icon: '🎓',
    defaultAge: 18,
    defaultCost: 2000000,
    defaultInflation: 6,
    description: 'College tuition, professional course fees & campus living expenses.',
  },
  {
    type: 'post-graduation',
    name: 'Post-Graduation (Master / MBA)',
    icon: '📜',
    defaultAge: 21,
    defaultCost: 2500000,
    defaultInflation: 6,
    description: 'Specialization, MBA, post-grad entrance & career launch pad.',
  },
  {
    type: 'marriage',
    name: 'Marriage',
    icon: '💍',
    defaultAge: 26,
    defaultCost: 2000000,
    defaultInflation: 6,
    description: 'Plan your child wedding joyfully with zero debt.',
  },
  {
    type: 'schooling',
    name: 'High School & Coaching Foundation',
    icon: '🏫',
    defaultAge: 14,
    defaultCost: 600000,
    defaultInflation: 6,
    description: 'Competitive exam coaching, high school admission & skill development.',
  },
  {
    type: 'overseas-masters',
    name: 'Overseas Higher Education',
    icon: '✈️',
    defaultAge: 22,
    defaultCost: 5000000,
    defaultInflation: 6,
    description: 'Foreign university tuition, travel, visa & international living.',
  },
  {
    type: 'dream-venture',
    name: 'Career Starter & Dream Venture',
    icon: '🚀',
    defaultAge: 25,
    defaultCost: 1500000,
    defaultInflation: 6,
    description: 'Seed capital to support your child startup or career foundation.',
  },
  {
    type: 'custom',
    name: 'Custom Milestone Goal',
    icon: '🎯',
    defaultAge: 20,
    defaultCost: 1000000,
    defaultInflation: 6,
    description: 'Tailor-make any unique milestone for your child future.',
  },
];

const INITIAL_GOALS: ChildGoalInput[] = [
  {
    id: 'goal-1',
    name: 'Graduation (Bachelor Degree)',
    type: 'graduation',
    goalAge: 18,
    targetCostToday: 2000000,
    inflationRate: 6,
    existingAssets: { mutualFunds: 0, fixedDeposits: 0, gold: 0, stocks: 0, endowment: 0 },
    startDelayYears: 0,
    stopBeforeYears: 0,
  },
  {
    id: 'goal-2',
    name: 'Post-Graduation (Master / MBA)',
    type: 'post-graduation',
    goalAge: 21,
    targetCostToday: 2500000,
    inflationRate: 6,
    existingAssets: { mutualFunds: 0, fixedDeposits: 0, gold: 0, stocks: 0, endowment: 0 },
    startDelayYears: 0,
    stopBeforeYears: 0,
  },
  {
    id: 'goal-3',
    name: 'Marriage',
    type: 'marriage',
    goalAge: 26,
    targetCostToday: 2000000,
    inflationRate: 6,
    existingAssets: { mutualFunds: 0, fixedDeposits: 0, gold: 0, stocks: 0, endowment: 0 },
    startDelayYears: 0,
    stopBeforeYears: 0,
  },
];

function formatRupees(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0';
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

function formatLakhsCrores(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined || amount === 0) return '₹0';
  const abs = Math.abs(amount);
  if (abs >= 10000000) {
    const cr = amount / 10000000;
    return `₹${cr.toFixed(2)} Cr`;
  }
  if (abs >= 100000) {
    const lakh = amount / 100000;
    return `₹${lakh.toFixed(2)} Lakh`;
  }
  return formatRupees(amount);
}

export default function ChildrenFuturePlanner() {
  const [childName, setChildName] = useState<string>('My Child');
  const [childAge, setChildAge] = useState<number>(5);
  const [goals, setGoals] = useState<ChildGoalInput[]>(INITIAL_GOALS);
  const [globalStepUp, setGlobalStepUp] = useState<number>(10);
  const [expandedGoalId, setExpandedGoalId] = useState<string>(INITIAL_GOALS[0].id);
  const [activeAssetsGoalId, setActiveAssetsGoalId] = useState<string | null>(null);
  const [activeAdvancedGoalId, setActiveAdvancedGoalId] = useState<string | null>(null);
  const [showAddGoalModal, setShowAddGoalModal] = useState<boolean>(false);

  const currentPlanningYear = new Date().getFullYear();
  const childAgeInputId = useId();
  const childNameInputId = useId();

  // Handle adding a new goal from presets
  const handleAddGoal = (preset: GoalPresetOption) => {
    const newGoalAge = Math.max(childAge + 2, preset.defaultAge);
    const newGoal: ChildGoalInput = {
      id: `goal-${Date.now()}`,
      name: preset.name,
      type: preset.type,
      goalAge: newGoalAge,
      targetCostToday: preset.defaultCost,
      inflationRate: preset.defaultInflation,
      existingAssets: { mutualFunds: 0, fixedDeposits: 0, gold: 0, stocks: 0, endowment: 0 },
      startDelayYears: 0,
      stopBeforeYears: 0,
    };
    setGoals((prev) => [...prev, newGoal]);
    setExpandedGoalId(newGoal.id);
    setShowAddGoalModal(false);
  };

  // Handle removing a goal
  const handleRemoveGoal = (id: string) => {
    if (goals.length <= 1) {
      alert('You must keep at least one goal in your plan.');
      return;
    }
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // Handle updating goal field
  const handleUpdateGoal = (id: string, updates: Partial<ChildGoalInput>) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        return { ...g, ...updates };
      })
    );
  };

  // Handle updating an existing asset category for a goal
  const handleUpdateAsset = (
    goalId: string,
    category: keyof NonNullable<ChildGoalInput['existingAssets']>,
    value: number
  ) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const currentAssets = g.existingAssets || {};
        return {
          ...g,
          existingAssets: {
            ...currentAssets,
            [category]: Math.max(0, value),
          },
        };
      })
    );
  };

  // Master calculation
  const planResult: ChildPlannerSummaryResult = calculateChildrenFuturePlan({
    childName,
    childCurrentAge: childAge,
    currentPlanningYear,
    goals,
    globalStepUpPercentage: globalStepUp,
  });

  const getPresetIcon = (type: GoalPresetType) => {
    const found = PRESET_OPTIONS.find((p) => p.type === type);
    return found ? found.icon : '🎯';
  };

  // Prepare WhatsApp pre-filled message
  const getWhatsAppMessageUrl = () => {
    const summaryText = `Hi Santhosh, I planned my child (${childName}) future milestones on Ant Wealth Creation.\n\nTotal Estimated Future Cost: ${formatLakhsCrores(planResult.totalFutureGoalCost)}\nProjected Existing Assets: ${formatLakhsCrores(planResult.totalProjectedAssets)}\nTotal Net Funding Gap: ${formatLakhsCrores(planResult.totalFundingGap)}\nRequired Starting Step-Up SIP: ${formatRupees(planResult.totalStepUpSIPStarting)}/month\n\nI would like to review our mutual fund investment roadmap.`;
    return `https://wa.me/918087971566?text=${encodeURIComponent(summaryText)}`;
  };

  return (
    <div className="children-planner-wrapper">
      {/* Top Banner / Child Profile Bar */}
      <div className="planner-profile-card">
        <div className="profile-grid">
          <div className="profile-input-group">
            <label htmlFor={childNameInputId} className="profile-label">Child Name</label>
            <input
              id={childNameInputId}
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="e.g. Aarav / Ananya"
              className="profile-text-input"
            />
          </div>

          <div className="profile-input-group">
            <div className="age-label-row">
              <label htmlFor={childAgeInputId} className="profile-label">Child Current Age</label>
              <span className="age-badge">{childAge} Years Old</span>
            </div>
            <div className="age-slider-row">
              <input
                id={childAgeInputId}
                type="range"
                min="0"
                max="20"
                step="1"
                value={childAge}
                onChange={(e) => {
                  const newAge = Number(e.target.value);
                  setChildAge(newAge);
                  // Ensure all goal ages remain higher than child age
                  setGoals((prev) =>
                    prev.map((g) => ({
                      ...g,
                      goalAge: Math.max(newAge + 1, g.goalAge),
                    }))
                  );
                }}
                className="profile-range-slider"
              />
              <div className="slider-ticks">
                <span>Newborn (0)</span>
                <span>10 Yrs</span>
                <span>20 Yrs</span>
              </div>
            </div>
          </div>

          <div className="profile-meta-group">
            <span className="meta-tag">Planning Horizon</span>
            <div className="meta-year">{currentPlanningYear} → {currentPlanningYear + (goals.length > 0 ? Math.max(...goals.map((g) => Math.max(1, g.goalAge - childAge))) : 20)}</div>
            <span className="meta-sub">{goals.length} Future Milestones Configured</span>
          </div>
        </div>
      </div>

      <div className="planner-main-layout">
        {/* LEFT COLUMN: Multi-Goal Builder & Assumptions */}
        <div className="planner-inputs-column">
          <div className="section-title-row">
            <div>
              <h2 className="section-title">Milestone Goals for {childName}</h2>
              <p className="section-subtitle">
                Customize target ages, estimated costs in today money, inflation, and earmarked assets.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddGoalModal(true)}
              className="btn-add-goal-header"
            >
              + Add Milestone
            </button>
          </div>

          {/* Add Goal Preset Modal / Drawer */}
          {showAddGoalModal && (
            <div className="modal-backdrop" onClick={() => setShowAddGoalModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3 className="modal-title">Select a Goal to Add</h3>
                  <button
                    type="button"
                    onClick={() => setShowAddGoalModal(false)}
                    className="modal-close-btn"
                  >
                    ✕
                  </button>
                </div>
                <div className="preset-grid">
                  {PRESET_OPTIONS.map((preset) => (
                    <button
                      key={preset.type}
                      type="button"
                      onClick={() => handleAddGoal(preset)}
                      className="preset-card-btn"
                    >
                      <span className="preset-btn-icon">{preset.icon}</span>
                      <div className="preset-btn-text">
                        <span className="preset-btn-name">{preset.name}</span>
                        <span className="preset-btn-desc">{preset.description}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Goal Cards List */}
          <div className="goal-cards-stack">
            {goals.map((goal, index) => {
              const isExpanded = expandedGoalId === goal.id;
              const yearsRemaining = Math.max(1, goal.goalAge - childAge);
              const targetYear = currentPlanningYear + yearsRemaining;
              const defaultHorizonReturn = getDefaultReturnForHorizon(yearsRemaining);
              const activeReturn = goal.isCustomReturn && goal.expectedReturnRate !== undefined
                ? goal.expectedReturnRate
                : defaultHorizonReturn;
              const goalRes = planResult.goals.find((r) => r.id === goal.id);

              return (
                <div
                  key={goal.id}
                  className={`goal-builder-card ${isExpanded ? 'card-expanded' : ''}`}
                >
                  {/* Goal Summary Header */}
                  <div
                    className="goal-card-header"
                    onClick={() => setExpandedGoalId(isExpanded ? '' : goal.id)}
                  >
                    <div className="goal-header-left">
                      <span className="goal-icon-badge">{getPresetIcon(goal.type)}</span>
                      <div>
                        <div className="goal-title-line">
                          <span className="goal-name-text">{goal.name}</span>
                          <span className="goal-age-pill">
                            Age {goal.goalAge} ({targetYear}) • in {yearsRemaining} Yrs
                          </span>
                        </div>
                        <div className="goal-quick-meta">
                          <span>Today: {formatLakhsCrores(goal.targetCostToday)}</span>
                          <span className="meta-bullet">•</span>
                          <span>Future: {goalRes ? formatLakhsCrores(goalRes.futureGoalCost) : '...'}</span>
                          {goalRes && goalRes.currentAssetsTotal > 0 && (
                            <>
                              <span className="meta-bullet">•</span>
                              <span className="meta-funded-pill">{goalRes.percentageFunded}% Funded</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="goal-header-actions" onClick={(e) => e.stopPropagation()}>
                      {goals.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveGoal(goal.id)}
                          className="btn-remove-goal"
                          title="Remove this goal"
                          aria-label={`Remove ${goal.name}`}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setExpandedGoalId(isExpanded ? '' : goal.id)}
                        className="btn-expand-toggle"
                        aria-label="Toggle goal settings"
                      >
                        {isExpanded ? '▲ Close' : '▼ Edit'}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Goal Inputs */}
                  {isExpanded && (
                    <div className="goal-card-body">
                      {/* Goal Name Field */}
                      <div className="form-field-row">
                        <label className="field-label">Milestone Name</label>
                        <input
                          type="text"
                          value={goal.name}
                          onChange={(e) => handleUpdateGoal(goal.id, { name: e.target.value })}
                          className="text-input-field"
                        />
                      </div>

                      {/* Goal Age & Target Cost Grid */}
                      <div className="two-col-fields">
                        {/* Goal Age */}
                        <div className="field-block">
                          <div className="label-with-val">
                            <label className="field-label">Child Age at Milestone</label>
                            <span className="val-display">{goal.goalAge} Yrs (Year {targetYear})</span>
                          </div>
                          <input
                            type="range"
                            min={childAge + 1}
                            max="35"
                            step="1"
                            value={goal.goalAge}
                            onChange={(e) =>
                              handleUpdateGoal(goal.id, { goalAge: Number(e.target.value) })
                            }
                            className="input-slider"
                          />
                          <div className="slider-sub-text">
                            <span>{childAge + 1} Yrs</span>
                            <span>{yearsRemaining} Years Remaining</span>
                            <span>35 Yrs</span>
                          </div>
                        </div>

                        {/* Estimated Cost Today */}
                        <div className="field-block">
                          <div className="label-with-val">
                            <label className="field-label">Estimated Cost in Today Money</label>
                            <div className="currency-box">
                              <span className="currency-symbol">₹</span>
                              <input
                                type="number"
                                min="50000"
                                max="100000000"
                                step="50000"
                                value={goal.targetCostToday}
                                onChange={(e) =>
                                  handleUpdateGoal(goal.id, {
                                    targetCostToday: Math.max(0, Number(e.target.value)),
                                  })
                                }
                                className="currency-input-field"
                              />
                            </div>
                          </div>
                          <input
                            type="range"
                            min="100000"
                            max="10000000"
                            step="50000"
                            value={goal.targetCostToday}
                            onChange={(e) =>
                              handleUpdateGoal(goal.id, {
                                targetCostToday: Number(e.target.value),
                              })
                            }
                            className="input-slider"
                          />
                          <div className="slider-sub-text">
                            <span>₹1 Lakh</span>
                            <span>{formatLakhsCrores(goal.targetCostToday)}</span>
                            <span>₹1 Crore</span>
                          </div>
                        </div>
                      </div>

                      {/* Inflation & Expected Return Row */}
                      <div className="two-col-fields">
                        {/* Expected Cost Inflation */}
                        <div className="field-block">
                          <div className="label-with-val">
                            <label className="field-label">Expected Cost Inflation</label>
                            <span className="val-display">{goal.inflationRate ?? PLANNER_DEFAULTS.INFLATION_RATE}% / year</span>
                          </div>
                          <input
                            type="range"
                            min="3"
                            max="15"
                            step="0.5"
                            value={goal.inflationRate ?? PLANNER_DEFAULTS.INFLATION_RATE}
                            onChange={(e) =>
                              handleUpdateGoal(goal.id, {
                                inflationRate: Number(e.target.value),
                              })
                            }
                            className="input-slider"
                          />
                          <p className="field-hint-desc">
                            {getGoalInflationConfig(goal.type).explanation}
                          </p>
                          <div className="field-range-helper">
                            <span className="range-highlight">{getGoalInflationConfig(goal.type).planningRange}</span>
                            <span className="range-qualifier">• Planning range only — actual costs may vary.</span>
                          </div>
                        </div>

                        {/* Expected Return */}
                        <div className="field-block">
                          <div className="label-with-val">
                            <label className="field-label">Expected Investment Return</label>
                            <span className="val-display">{activeReturn}% / year</span>
                          </div>
                          <input
                            type="range"
                            min="4"
                            max="18"
                            step="0.5"
                            value={activeReturn}
                            onChange={(e) =>
                              handleUpdateGoal(goal.id, {
                                expectedReturnRate: Number(e.target.value),
                                isCustomReturn: true,
                              })
                            }
                            className="input-slider"
                          />
                          <span className="field-hint">
                            Auto-default: {defaultHorizonReturn}% for {yearsRemaining}-year horizon.
                          </span>
                        </div>
                      </div>

                      {/* Optional Earmarked Assets Accordion */}
                      <div className="sub-accordion-box">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveAssetsGoalId(
                              activeAssetsGoalId === goal.id ? null : goal.id
                            )
                          }
                          className="sub-accordion-toggle"
                        >
                          <span>💼 Earmark Existing Savings / Assets for this Goal (Optional)</span>
                          <span>{activeAssetsGoalId === goal.id ? '▲ Hide' : '▼ Add Assets'}</span>
                        </button>

                        {activeAssetsGoalId === goal.id && (
                          <div className="sub-accordion-content">
                            <p className="assets-intro-note">
                              Enter the <strong>Current Value (Today)</strong> of any investments earmarked for this goal. We will project their growth to {targetYear} at {activeReturn}% expected return.
                            </p>

                            <div className="asset-inputs-grid">
                              <div className="asset-input-item">
                                <label className="asset-label">Mutual Funds (Today Value)</label>
                                <div className="currency-box">
                                  <span className="currency-symbol">₹</span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="10000"
                                    value={goal.existingAssets?.mutualFunds || ''}
                                    onChange={(e) =>
                                      handleUpdateAsset(
                                        goal.id,
                                        'mutualFunds',
                                        Number(e.target.value)
                                      )
                                    }
                                    placeholder="0"
                                    className="currency-input-field"
                                  />
                                </div>
                              </div>

                              <div className="asset-input-item">
                                <label className="asset-label">Fixed Deposits (Today Value)</label>
                                <div className="currency-box">
                                  <span className="currency-symbol">₹</span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="10000"
                                    value={goal.existingAssets?.fixedDeposits || ''}
                                    onChange={(e) =>
                                      handleUpdateAsset(
                                        goal.id,
                                        'fixedDeposits',
                                        Number(e.target.value)
                                      )
                                    }
                                    placeholder="0"
                                    className="currency-input-field"
                                  />
                                </div>
                              </div>

                              <div className="asset-input-item">
                                <label className="asset-label">Gold / Sovereign Gold Bonds</label>
                                <div className="currency-box">
                                  <span className="currency-symbol">₹</span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="10000"
                                    value={goal.existingAssets?.gold || ''}
                                    onChange={(e) =>
                                      handleUpdateAsset(
                                        goal.id,
                                        'gold',
                                        Number(e.target.value)
                                      )
                                    }
                                    placeholder="0"
                                    className="currency-input-field"
                                  />
                                </div>
                              </div>

                              <div className="asset-input-item">
                                <label className="asset-label">Stocks / Shares</label>
                                <div className="currency-box">
                                  <span className="currency-symbol">₹</span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="10000"
                                    value={goal.existingAssets?.stocks || ''}
                                    onChange={(e) =>
                                      handleUpdateAsset(
                                        goal.id,
                                        'stocks',
                                        Number(e.target.value)
                                      )
                                    }
                                    placeholder="0"
                                    className="currency-input-field"
                                  />
                                </div>
                              </div>

                              <div className="asset-input-item">
                                <label className="asset-label">Endowment / Insurance Policies</label>
                                <div className="currency-box">
                                  <span className="currency-symbol">₹</span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="10000"
                                    value={goal.existingAssets?.endowment || ''}
                                    onChange={(e) =>
                                      handleUpdateAsset(
                                        goal.id,
                                        'endowment',
                                        Number(e.target.value)
                                      )
                                    }
                                    placeholder="0"
                                    className="currency-input-field"
                                  />
                                </div>
                              </div>
                            </div>

                            {goalRes && goalRes.currentAssetsTotal > 0 && (
                              <div className="asset-projection-preview">
                                <span>Total Earmarked: <strong>{formatRupees(goalRes.currentAssetsTotal)}</strong></span>
                                <span className="preview-arrow">→</span>
                                <span>Projected at Age {goal.goalAge}: <strong className="teal-text">{formatRupees(goalRes.projectedAssetsTotal)}</strong></span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Optional Advanced Investment Timing */}
                      <div className="sub-accordion-box">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveAdvancedGoalId(
                              activeAdvancedGoalId === goal.id ? null : goal.id
                            )
                          }
                          className="sub-accordion-toggle"
                        >
                          <span>⚙️ Fine-Tune Investment Timing (Advanced)</span>
                          <span>{activeAdvancedGoalId === goal.id ? '▲ Hide' : '▼ Adjust'}</span>
                        </button>

                        {activeAdvancedGoalId === goal.id && (
                          <div className="sub-accordion-content">
                            <div className="two-col-fields">
                              <div className="field-block">
                                <label className="field-label">Start Investing After (Delay)</label>
                                <div className="input-with-suffix">
                                  <input
                                    type="number"
                                    min="0"
                                    max={Math.max(0, yearsRemaining - 1)}
                                    value={goal.startDelayYears || 0}
                                    onChange={(e) =>
                                      handleUpdateGoal(goal.id, {
                                        startDelayYears: Number(e.target.value),
                                      })
                                    }
                                    className="number-input-sm"
                                  />
                                  <span className="suffix-text">Years</span>
                                </div>
                                <span className="field-hint">Default 0 (Starts immediately)</span>
                              </div>

                              <div className="field-block">
                                <label className="field-label">Stop Investing Before Goal</label>
                                <div className="input-with-suffix">
                                  <input
                                    type="number"
                                    min="0"
                                    max={Math.max(0, yearsRemaining - (goal.startDelayYears || 0) - 1)}
                                    value={goal.stopBeforeYears || 0}
                                    onChange={(e) =>
                                      handleUpdateGoal(goal.id, {
                                        stopBeforeYears: Number(e.target.value),
                                      })
                                    }
                                    className="number-input-sm"
                                  />
                                  <span className="suffix-text">Years</span>
                                </div>
                                <span className="field-hint">e.g. Shift to debt 2 years prior</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add Goal Bottom CTA */}
          <div className="add-goal-bottom-row">
            <button
              type="button"
              onClick={() => setShowAddGoalModal(true)}
              className="btn-add-goal-large"
            >
              <span className="plus-icon">+</span> Add Another Milestone (Schooling, Foreign Education, Venture)
            </button>
          </div>

          {/* Global Step-Up SIP Assumptions Card */}
          <div className="global-assumptions-card">
            <div className="assumptions-header">
              <h3 className="assumptions-title">Annual Step-Up SIP Strategy</h3>
              <span className="assumptions-badge">Recommended for Growing Incomes</span>
            </div>
            <p className="assumptions-desc">
              Instead of committing to a high fixed monthly amount today, start with a comfortable SIP and increase it by <strong>{globalStepUp}% every year</strong> as your salary and business earnings grow.
            </p>
            <div className="step-up-slider-wrapper">
              <div className="step-up-label-row">
                <span className="slider-label">Annual Step-Up Increment Rate:</span>
                <span className="slider-val-badge">+{globalStepUp}% every year</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="1"
                value={globalStepUp}
                onChange={(e) => setGlobalStepUp(Number(e.target.value))}
                className="input-slider"
              />
              <div className="slider-sub-text">
                <span>0% (Fixed SIP)</span>
                <span>10% (Standard Increment)</span>
                <span>25% (Aggressive)</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Results Dashboard */}
        <div className="planner-results-column">
          {/* Master Grand Summary Card */}
          <div className="results-hero-card">
            <div className="hero-header">
              <span className="hero-tag">Comprehensive Plan Summary</span>
              <span className="hero-child-tag">{childName} ({childAge} Yrs)</span>
            </div>

            <div className="hero-headline">
              <span className="hero-subtext">Total Estimated Future Requirement:</span>
              <div className="hero-main-figure">{formatLakhsCrores(planResult.totalFutureGoalCost)}</div>
              <p className="hero-rupees-detail">
                Across {planResult.goals.length} milestones • {formatRupees(planResult.totalFutureGoalCost)} total corpus
              </p>
            </div>

            {/* Progress / Funded Status Bar */}
            <div className="funding-progress-section">
              <div className="progress-label-row">
                <span className="progress-label">Milestone Funded Progress</span>
                <span className="progress-percent-badge">{planResult.overallPercentageFunded}% Funded</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${Math.min(100, Math.max(0, planResult.overallPercentageFunded))}%` }}
                ></div>
              </div>
            </div>

            {/* 3 Key Financial Metrics Grid */}
            <div className="hero-metrics-grid">
              <div className="metric-cell">
                <span className="metric-lbl">Total Goal Cost in Today's Money</span>
                <span className="metric-val">{formatLakhsCrores(planResult.totalTargetCostToday)}</span>
              </div>
              <div className="metric-cell">
                <span className="metric-lbl">{planResult.totalProjectedAssets > 0 ? 'Projected Value at Goal' : 'Existing Assets'}</span>
                <span className={`metric-val ${planResult.totalProjectedAssets > 0 ? 'teal-text' : 'muted-val'}`}>
                  {planResult.totalProjectedAssets > 0 ? formatLakhsCrores(planResult.totalProjectedAssets) : 'None added yet'}
                </span>
              </div>
              <div className="metric-cell">
                <span className="metric-lbl">Net Funding Gap</span>
                <span className="metric-val gold-text">{formatLakhsCrores(planResult.totalFundingGap)}</span>
              </div>
            </div>
          </div>

          {/* 3-Way Funding Strategies Comparison */}
          <div className="strategies-container">
            <h3 className="strategies-title">How to Fund {childName} Goals</h3>
            <p className="strategies-subtitle">
              Choose the investment roadmap that best fits your family cashflow.
            </p>

            {planResult.totalFundingGap <= 0 ? (
              <div className="fully-funded-banner">
                <span className="banner-icon">🎉</span>
                <div className="banner-text">
                  <h4>Goals Fully Funded!</h4>
                  <p>
                    Your projected existing assets ({formatLakhsCrores(planResult.totalProjectedAssets)}) are estimated to fully cover the future milestone requirements. Keep reviewing your asset allocation regularly.
                  </p>
                </div>
              </div>
            ) : (
              <div className="strategies-grid">
                {/* Option 3: Step-Up SIP (Recommended) */}
                <div className="strategy-card strategy-featured">
                  <div className="featured-badge">⭐ Recommended Strategy</div>
                  <div className="strategy-header">
                    <span className="strategy-opt-tag">Option 1: Step-Up SIP</span>
                    <h4 className="strategy-name">Growing Monthly SIP</h4>
                  </div>
                  <div className="strategy-amount-box">
                    <div className="strategy-amount">{formatRupees(planResult.totalStepUpSIPStarting)}<span className="amount-period"> / month</span></div>
                    <div className="strategy-increment-note">Starting monthly SIP with +{planResult.activeStepUpPercentage}% annual step-up</div>
                  </div>
                  <p className="strategy-explanation">
                    Easiest on family budget today. Increases automatically in step with salary increments and business profits.
                  </p>
                </div>

                {/* Option 2: Fixed Monthly SIP */}
                <div className="strategy-card">
                  <div className="strategy-header">
                    <span className="strategy-opt-tag">Option 2: Fixed SIP</span>
                    <h4 className="strategy-name">Constant Monthly SIP</h4>
                  </div>
                  <div className="strategy-amount-box">
                    <div className="strategy-amount">{formatRupees(planResult.totalMonthlySIPRequired)}<span className="amount-period"> / month</span></div>
                    <div className="strategy-increment-note">Fixed monthly contribution across goal horizons</div>
                  </div>
                  <p className="strategy-explanation">
                    Constant monthly savings discipline without annual increments.
                  </p>
                </div>

                {/* Option 1: Lump Sum Today */}
                <div className="strategy-card">
                  <div className="strategy-header">
                    <span className="strategy-opt-tag">Option 3: Lump Sum</span>
                    <h4 className="strategy-name">One-Time Allocation Today</h4>
                  </div>
                  <div className="strategy-amount-box">
                    <div className="strategy-amount">{formatLakhsCrores(planResult.totalLumpSumRequired)}</div>
                    <div className="strategy-increment-note">({formatRupees(planResult.totalLumpSumRequired)} invested today)</div>
                  </div>
                  <p className="strategy-explanation">
                    Deploy existing surplus or capital today and let market compounding work uninterrupted.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Individual Milestone Breakdown Cards */}
          <div className="milestones-breakdown-section">
            <h3 className="breakdown-section-title">Milestone-by-Milestone Roadmap</h3>
            <div className="milestones-results-stack">
              {planResult.goals.map((res) => (
                <div key={res.id} className="milestone-result-card">
                  <div className="milestone-res-top">
                    <div className="milestone-res-title">
                      <span className="milestone-res-icon">{getPresetIcon(res.type)}</span>
                      <div>
                        <h4 className="res-title-text">{res.name}</h4>
                        <span className="res-subtitle-text">
                          Target Year {res.targetYear} (Age {res.goalAge} • in {res.yearsRemaining} Years)
                        </span>
                      </div>
                    </div>
                    <div className="milestone-res-future">
                      <span className="future-tag">Future Target</span>
                      <span className="future-val">{formatLakhsCrores(res.futureGoalCost)}</span>
                    </div>
                  </div>

                  <div className="milestone-metrics-row">
                    <div className="m-metric">
                      <span className="m-lbl">Today Cost:</span>
                      <span className="m-val">{formatRupees(res.targetCostToday)}</span>
                    </div>
                    <div className="m-metric">
                      <span className="m-lbl">Cost Inflation:</span>
                      <span className="m-val">{res.inflationRate}% / yr</span>
                    </div>
                    <div className="m-metric">
                      <span className="m-lbl">Projected Assets:</span>
                      <span className="m-val teal-text">{res.projectedAssetsTotal > 0 ? formatRupees(res.projectedAssetsTotal) : '₹0'}</span>
                    </div>
                    <div className="m-metric">
                      <span className="m-lbl">Net Gap:</span>
                      <span className="m-val gold-text">{formatRupees(res.fundingGap)}</span>
                    </div>
                  </div>

                  {res.fundingGap > 0 ? (
                    <div className="milestone-sip-summary">
                      <div className="sip-recommend-item">
                        <span className="sip-item-lbl">Step-Up SIP (+{res.stepUpPercentage}%/yr):</span>
                        <span className="sip-item-val teal-val">{formatRupees(res.requiredStepUpSIP)} / mo</span>
                      </div>
                      <div className="sip-recommend-item">
                        <span className="sip-item-lbl">Fixed Monthly SIP:</span>
                        <span className="sip-item-val">{formatRupees(res.requiredMonthlySIP)} / mo</span>
                      </div>
                    </div>
                  ) : (
                    <div className="milestone-funded-note">
                      ✅ Milestone fully funded with current projected assets.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Soft Consultation CTA Card */}
          <div className="advisory-cta-card">
            <div className="cta-icon-badge">🤝</div>
            <div className="cta-content">
              <h3 className="cta-heading">
                Want to know whether your current investments are on track for {childName}?
              </h3>
              <p className="cta-description">
                Talk to <strong>Santhosh (QPFP Certified, AMFI Registered MFD)</strong> for a personalized, un-gated review of your child education portfolio, asset allocation, and mutual fund SIP selection.
              </p>
              <div className="cta-buttons-row">
                <a
                  href={getWhatsAppMessageUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp-action"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  Discuss with Santhosh on WhatsApp
                </a>
                <a href="/contact" className="btn-secondary-action">
                  Book a Consultation Call
                </a>
              </div>
            </div>
          </div>

          {/* Statutory Regulatory Disclaimer */}
          <div className="regulatory-disclaimer-box">
            <p className="disclaimer-note">
              <strong>Statutory Compliance & Regulatory Notice:</strong> Ant Wealth Creation is an AMFI-Registered Mutual Fund Distributor (ARN: 266896). Calculations generated above are for educational financial planning and milestone simulation purposes only. Projections are based on mathematical assumptions (effective monthly compounding and annual step-up increment) and do not represent guaranteed returns or specific mutual fund recommendations. Actual cost increases vary by category, location and circumstances. The ranges shown are intended only as planning assumptions. Mutual fund investments are subject to market risks, read all scheme-related documents carefully.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .children-planner-wrapper {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          max-width: 1320px;
          margin: 0 auto;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        /* Profile Top Card */
        .planner-profile-card {
          background: linear-gradient(135deg, #00182A 0%, #002B49 100%);
          border-radius: 16px;
          padding: 1.75rem 2rem;
          color: #FFFFFF;
          box-shadow: 0 10px 30px rgba(0, 24, 42, 0.12);
        }

        .profile-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr 1fr;
          gap: 2rem;
          align-items: center;
        }

        .profile-input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .profile-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .profile-text-input {
          background-color: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          font-size: 1.1rem;
          font-weight: 700;
          color: #FFFFFF;
          outline: none;
          transition: all 0.2s;
        }

        .profile-text-input:focus {
          border-color: #00AB96;
          background-color: rgba(255, 255, 255, 0.15);
        }

        .age-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .age-badge {
          background-color: #00AB96;
          color: #FFFFFF;
          font-size: 0.85rem;
          font-weight: 700;
          padding: 0.2rem 0.6rem;
          border-radius: 9999px;
        }

        .profile-range-slider {
          width: 100%;
          accent-color: #00AB96;
          height: 6px;
          border-radius: 3px;
          cursor: pointer;
        }

        .profile-meta-group {
          background-color: rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 1rem 1.25rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          text-align: right;
        }

        .meta-tag {
          font-size: 0.75rem;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: block;
        }

        .meta-year {
          font-family: 'Outfit', sans-serif;
          font-size: 1.6rem;
          font-weight: 800;
          color: #FFC107;
          line-height: 1.2;
          margin: 0.2rem 0;
        }

        .meta-sub {
          font-size: 0.8rem;
          color: #CBD5E1;
        }

        /* 2-Column Main Layout */
        .planner-main-layout {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 2rem;
          align-items: start;
        }

        /* Left Column: Inputs & Goal Stack */
        .planner-inputs-column {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .section-title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
        }

        .section-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          color: #00182A;
          margin: 0 0 0.35rem;
        }

        .section-subtitle {
          font-size: 0.9rem;
          color: #64748B;
          margin: 0;
          line-height: 1.5;
        }

        .btn-add-goal-header {
          background-color: #00AB96;
          color: #FFFFFF;
          border: none;
          padding: 0.55rem 1rem;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }

        .btn-add-goal-header:hover {
          background-color: #008f7d;
          transform: translateY(-1px);
        }

        /* Goal Cards Stack */
        .goal-cards-stack {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .goal-builder-card {
          background-color: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 14px;
          overflow: hidden;
          transition: all 0.25s ease;
          box-shadow: 0 2px 8px rgba(0, 24, 42, 0.03);
        }

        .goal-builder-card.card-expanded {
          border-color: #00AB96;
          box-shadow: 0 8px 24px rgba(0, 171, 150, 0.08);
        }

        .goal-card-header {
          padding: 1.25rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          background-color: #FAFCFD;
          user-select: none;
        }

        .goal-header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .goal-icon-badge {
          font-size: 1.75rem;
          background-color: rgba(0, 171, 150, 0.08);
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }

        .goal-title-line {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .goal-name-text {
          font-weight: 800;
          font-size: 1.05rem;
          color: #00182A;
          font-family: 'Outfit', sans-serif;
        }

        .goal-age-pill {
          background-color: #E6FFFA;
          color: #008F7D;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.2rem 0.6rem;
          border-radius: 9999px;
        }

        .goal-quick-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: #64748B;
          margin-top: 0.25rem;
        }

        .meta-bullet {
          color: #CBD5E1;
        }

        .meta-funded-pill {
          background-color: #FEF3C7;
          color: #92400E;
          font-weight: 700;
          padding: 0.1rem 0.45rem;
          border-radius: 4px;
          font-size: 0.75rem;
        }

        .goal-header-actions {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .btn-remove-goal {
          background: none;
          border: 1px solid #CBD5E1;
          color: #EF4444;
          width: 34px;
          height: 34px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-remove-goal:hover {
          background-color: #FEF2F2;
          border-color: #EF4444;
        }

        .btn-expand-toggle {
          background-color: #F1F5F9;
          border: 1px solid #CBD5E1;
          color: #334155;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 0.45rem 0.8rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-expand-toggle:hover {
          background-color: #E2E8F0;
        }

        /* Goal Body */
        .goal-card-body {
          padding: 1.5rem;
          border-top: 1px solid #E2E8F0;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-field-row {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .text-input-field {
          padding: 0.65rem 0.9rem;
          border: 1.5px solid #CBD5E1;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 600;
          color: #00182A;
          outline: none;
        }

        .text-input-field:focus {
          border-color: #00AB96;
        }

        .two-col-fields {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        .field-block {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .label-with-val {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .field-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: #334155;
        }

        .val-display {
          font-size: 0.85rem;
          font-weight: 700;
          color: #00AB96;
        }

        .currency-box {
          display: flex;
          align-items: center;
          border: 1.5px solid #CBD5E1;
          border-radius: 8px;
          padding: 0.2rem 0.6rem;
          background-color: #FFFFFF;
        }

        .currency-symbol {
          font-weight: 700;
          color: #64748B;
          margin-right: 0.25rem;
        }

        .currency-input-field {
          border: none;
          outline: none;
          font-size: 0.95rem;
          font-weight: 700;
          color: #00182A;
          width: 100%;
        }

        .input-slider {
          width: 100%;
          accent-color: #00AB96;
          height: 6px;
          border-radius: 3px;
          cursor: pointer;
        }

        .slider-sub-text, .slider-ticks {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #94A3B8;
        }

        .field-hint {
          font-size: 0.75rem;
          color: #64748B;
          line-height: 1.4;
        }

        .field-hint-desc {
          font-size: 0.785rem;
          color: #475569;
          line-height: 1.45;
          margin-top: 0.35rem;
          margin-bottom: 0.25rem;
        }

        .field-range-helper {
          font-size: 0.735rem;
          color: #64748B;
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          align-items: center;
        }

        .range-highlight {
          font-weight: 600;
          color: #00AB96;
        }

        .range-qualifier {
          color: #94A3B8;
        }

        .muted-val {
          color: #94A3B8 !important;
          font-size: 0.95rem !important;
          font-weight: 600 !important;
        }

        /* Sub-Accordions for Assets & Timing */
        .sub-accordion-box {
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          overflow: hidden;
          background-color: #F8FAFC;
        }

        .sub-accordion-toggle {
          width: 100%;
          padding: 0.85rem 1rem;
          background: none;
          border: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          font-weight: 700;
          color: #00182A;
          cursor: pointer;
        }

        .sub-accordion-toggle:hover {
          background-color: #F1F5F9;
        }

        .sub-accordion-content {
          padding: 1rem 1.25rem 1.25rem;
          border-top: 1px solid #E2E8F0;
          background-color: #FFFFFF;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .assets-intro-note {
          font-size: 0.82rem;
          color: #475569;
          margin: 0;
          line-height: 1.5;
        }

        .asset-inputs-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .asset-input-item {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .asset-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: #475569;
        }

        .asset-projection-preview {
          background-color: #F0FDF4;
          border: 1px solid #BBF7D0;
          border-radius: 8px;
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.85rem;
          color: #166534;
          flex-wrap: wrap;
        }

        .preview-arrow {
          font-weight: 800;
          color: #00AB96;
        }

        .input-with-suffix {
          display: flex;
          align-items: center;
          border: 1.5px solid #CBD5E1;
          border-radius: 8px;
          padding: 0.4rem 0.75rem;
          background-color: #FFFFFF;
        }

        .number-input-sm {
          border: none;
          outline: none;
          font-size: 0.95rem;
          font-weight: 700;
          color: #00182A;
          width: 60px;
        }

        .suffix-text {
          font-size: 0.85rem;
          font-weight: 600;
          color: #64748B;
        }

        /* Add Goal Bottom Button */
        .add-goal-bottom-row {
          text-align: center;
        }

        .btn-add-goal-large {
          width: 100%;
          padding: 0.9rem 1.5rem;
          background-color: #FFFFFF;
          border: 2px dashed #00AB96;
          border-radius: 12px;
          color: #00AB96;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .btn-add-goal-large:hover {
          background-color: #F0FDFA;
          border-style: solid;
        }

        .plus-icon {
          font-size: 1.25rem;
          font-weight: 800;
        }

        /* Global Assumptions Card */
        .global-assumptions-card {
          background-color: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 14px;
          padding: 1.5rem;
        }

        .assumptions-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .assumptions-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.15rem;
          font-weight: 800;
          color: #00182A;
          margin: 0;
        }

        .assumptions-badge {
          background-color: #FEF3C7;
          color: #92400E;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.2rem 0.6rem;
          border-radius: 9999px;
        }

        .assumptions-desc {
          font-size: 0.85rem;
          color: #475569;
          line-height: 1.5;
          margin: 0 0 1rem;
        }

        .step-up-slider-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .step-up-label-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          font-weight: 700;
        }

        .slider-label {
          color: #334155;
        }

        .slider-val-badge {
          color: #00AB96;
        }

        /* Modal / Drawer */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 24, 42, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 1.5rem;
        }

        .modal-content {
          background-color: #FFFFFF;
          border-radius: 16px;
          max-width: 600px;
          width: 100%;
          padding: 1.75rem;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }

        .modal-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.25rem;
          font-weight: 800;
          color: #00182A;
          margin: 0;
        }

        .modal-close-btn {
          background: none;
          border: none;
          font-size: 1.25rem;
          color: #64748B;
          cursor: pointer;
        }

        .preset-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }

        .preset-card-btn {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.85rem 1rem;
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
        }

        .preset-card-btn:hover {
          background-color: #F0FDFA;
          border-color: #00AB96;
          transform: translateY(-2px);
        }

        .preset-btn-icon {
          font-size: 1.75rem;
        }

        .preset-btn-text {
          display: flex;
          flex-direction: column;
        }

        .preset-btn-name {
          font-weight: 700;
          font-size: 0.95rem;
          color: #00182A;
        }

        .preset-btn-desc {
          font-size: 0.8rem;
          color: #64748B;
        }

        /* RIGHT COLUMN: Results Dashboard */
        .planner-results-column {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          position: sticky;
          top: 2rem;
        }

        /* Hero Results Card */
        .results-hero-card {
          background: linear-gradient(135deg, #00182A 0%, #002B49 100%);
          border-radius: 16px;
          padding: 2rem;
          color: #FFFFFF;
          box-shadow: 0 10px 30px rgba(0, 24, 42, 0.12);
        }

        .hero-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .hero-tag {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #00AB96;
        }

        .hero-child-tag {
          background-color: rgba(255, 255, 255, 0.1);
          padding: 0.2rem 0.6rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #E2E8F0;
        }

        .hero-subtext {
          font-size: 0.85rem;
          color: #94A3B8;
          display: block;
        }

        .hero-main-figure {
          font-family: 'Outfit', sans-serif;
          font-size: 2.5rem;
          font-weight: 800;
          color: #FFFFFF;
          line-height: 1.1;
          margin: 0.35rem 0;
        }

        .hero-rupees-detail {
          font-size: 0.85rem;
          color: #CBD5E1;
          margin: 0 0 1.25rem;
        }

        /* Progress Bar */
        .funding-progress-section {
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          padding: 0.9rem 1rem;
          margin-bottom: 1.25rem;
        }

        .progress-label-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          font-weight: 700;
          margin-bottom: 0.4rem;
        }

        .progress-percent-badge {
          color: #FFC107;
        }

        .progress-track {
          height: 8px;
          background-color: rgba(255, 255, 255, 0.15);
          border-radius: 9999px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #00AB96 0%, #FFC107 100%);
          border-radius: 9999px;
          transition: width 0.4s ease;
        }

        /* Hero 3 Metrics Grid */
        .hero-metrics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 1.25rem;
        }

        .metric-cell {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .metric-lbl {
          font-size: 0.72rem;
          color: #94A3B8;
        }

        .metric-val {
          font-size: 1rem;
          font-weight: 700;
          color: #FFFFFF;
        }

        .teal-text {
          color: #00AB96 !important;
        }

        .gold-text {
          color: #FFC107 !important;
        }

        /* 3 Strategies Cards */
        .strategies-container {
          background-color: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 16px;
          padding: 1.75rem;
          box-shadow: 0 4px 15px rgba(0, 24, 42, 0.04);
        }

        .strategies-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.25rem;
          font-weight: 800;
          color: #00182A;
          margin: 0 0 0.25rem;
        }

        .strategies-subtitle {
          font-size: 0.85rem;
          color: #64748B;
          margin: 0 0 1.25rem;
        }

        .strategies-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .strategy-card {
          border: 1.5px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.25rem;
          background-color: #FAFCFD;
          position: relative;
          transition: all 0.2s;
        }

        .strategy-card.strategy-featured {
          border-color: #00AB96;
          background-color: #F0FDFA;
        }

        .featured-badge {
          position: absolute;
          top: -10px;
          right: 14px;
          background-color: #FFC107;
          color: #00182A;
          font-size: 0.72rem;
          font-weight: 800;
          padding: 0.2rem 0.6rem;
          border-radius: 9999px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }

        .strategy-opt-tag {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748B;
        }

        .strategy-name {
          font-family: 'Outfit', sans-serif;
          font-size: 1.05rem;
          font-weight: 800;
          color: #00182A;
          margin: 0.15rem 0 0.5rem;
        }

        .strategy-amount {
          font-family: 'Outfit', sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          color: #008F7D;
        }

        .amount-period {
          font-size: 0.9rem;
          font-weight: 600;
          color: #64748B;
        }

        .strategy-increment-note {
          font-size: 0.78rem;
          font-weight: 700;
          color: #00182A;
          margin: 0.2rem 0 0.5rem;
        }

        .strategy-explanation {
          font-size: 0.8rem;
          color: #475569;
          margin: 0;
          line-height: 1.4;
        }

        .fully-funded-banner {
          background-color: #F0FDF4;
          border: 1.5px solid #86EFAC;
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .banner-icon {
          font-size: 2rem;
        }

        .banner-text h4 {
          margin: 0 0 0.25rem;
          color: #166534;
          font-family: 'Outfit', sans-serif;
        }

        .banner-text p {
          margin: 0;
          font-size: 0.85rem;
          color: #15803D;
          line-height: 1.4;
        }

        /* Milestones Results Breakdown */
        .milestones-breakdown-section {
          background-color: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 16px;
          padding: 1.75rem;
          box-shadow: 0 4px 15px rgba(0, 24, 42, 0.04);
        }

        .breakdown-section-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.15rem;
          font-weight: 800;
          color: #00182A;
          margin: 0 0 1rem;
        }

        .milestones-results-stack {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .milestone-result-card {
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 1rem;
          background-color: #F8FAFC;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .milestone-res-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .milestone-res-title {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .milestone-res-icon {
          font-size: 1.4rem;
        }

        .res-title-text {
          font-family: 'Outfit', sans-serif;
          font-size: 0.95rem;
          font-weight: 800;
          color: #00182A;
          margin: 0;
        }

        .res-subtitle-text {
          font-size: 0.75rem;
          color: #64748B;
        }

        .milestone-res-future {
          text-align: right;
        }

        .future-tag {
          font-size: 0.7rem;
          color: #64748B;
          display: block;
        }

        .future-val {
          font-weight: 800;
          font-size: 1rem;
          color: #00182A;
        }

        .milestone-metrics-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1.2fr 1fr;
          gap: 0.5rem;
          font-size: 0.78rem;
          border-top: 1px dashed #CBD5E1;
          padding-top: 0.5rem;
        }

        .m-metric {
          display: flex;
          flex-direction: column;
        }

        .m-lbl {
          color: #64748B;
        }

        .m-val {
          font-weight: 700;
          color: #00182A;
        }

        .milestone-sip-summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #FFFFFF;
          border-radius: 6px;
          padding: 0.4rem 0.75rem;
          font-size: 0.78rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .sip-recommend-item {
          display: flex;
          gap: 0.35rem;
          align-items: center;
        }

        .sip-item-lbl {
          color: #475569;
        }

        .sip-item-val {
          font-weight: 700;
          color: #00182A;
        }

        .teal-val {
          color: #008F7D;
        }

        .milestone-funded-note {
          font-size: 0.8rem;
          color: #166534;
          font-weight: 600;
        }

        /* Advisory Soft CTA Card */
        .advisory-cta-card {
          background: linear-gradient(135deg, #00182A 0%, #002B49 100%);
          border-radius: 16px;
          padding: 1.75rem;
          color: #FFFFFF;
          display: flex;
          gap: 1.25rem;
          align-items: flex-start;
          box-shadow: 0 8px 25px rgba(0, 24, 42, 0.1);
        }

        .cta-icon-badge {
          font-size: 2.25rem;
          background-color: rgba(255, 255, 255, 0.1);
          width: 52px;
          height: 52px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .cta-heading {
          font-family: 'Outfit', sans-serif;
          font-size: 1.15rem;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 0.5rem;
          line-height: 1.35;
        }

        .cta-description {
          font-size: 0.85rem;
          color: #CBD5E1;
          line-height: 1.5;
          margin: 0 0 1.25rem;
        }

        .cta-buttons-row {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .btn-whatsapp-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          background-color: #25D366;
          color: #FFFFFF;
          padding: 0.75rem 1.25rem;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.9rem;
          text-decoration: none;
          transition: all 0.2s;
        }

        .btn-whatsapp-action:hover {
          background-color: #20BA5A;
          transform: translateY(-2px);
        }

        .btn-secondary-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(255, 255, 255, 0.1);
          color: #FFFFFF;
          padding: 0.65rem 1.25rem;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.85rem;
          text-decoration: none;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.2s;
        }

        .btn-secondary-action:hover {
          background-color: rgba(255, 255, 255, 0.15);
        }

        /* Regulatory Disclaimer */
        .regulatory-disclaimer-box {
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 1rem 1.25rem;
        }

        .disclaimer-note {
          font-size: 0.75rem;
          color: #64748B;
          line-height: 1.5;
          margin: 0;
        }

        /* Responsive Mobile Styles */
        @media (max-width: 1024px) {
          .planner-main-layout {
            grid-template-columns: 1fr;
          }
          .planner-results-column {
            position: static;
          }
          .profile-grid {
            grid-template-columns: 1fr 1fr;
          }
          .profile-meta-group {
            grid-column: span 2;
            text-align: left;
          }
        }

        @media (max-width: 640px) {
          .planner-profile-card {
            padding: 1.25rem 1rem;
          }
          .planner-card {
            padding: 1.25rem 1rem;
          }
          .profile-grid {
            grid-template-columns: 1fr;
          }
          .profile-meta-group {
            grid-column: span 1;
          }
          .two-col-fields, .asset-inputs-grid {
            grid-template-columns: 1fr;
          }
          .hero-metrics-grid {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }
          .milestone-metrics-row {
            grid-template-columns: 1fr;
            gap: 0.4rem;
          }
          .strategy-summary-grid {
            grid-template-columns: 1fr;
          }
          .advisory-cta-card {
            flex-direction: column;
            padding: 1.25rem 1rem;
          }
        }
      `}</style>
    </div>
  );
}
