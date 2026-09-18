import React, { useState, useEffect } from 'react';
import { 
  HEALTH_PILLARS, 
  calculateFinancialHealth, 
  getPillarStatusColor,
  type HealthCheckAnswers, 
  type HealthCheckResult,
  type HealthPillar
} from '../../utils/calculations/financialHealth';

export default function HealthQuestionnaire() {
  const [answers, setAnswers] = useState<HealthCheckAnswers>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [result, setResult] = useState<HealthCheckResult | null>(null);
  const [animatedScore, setAnimatedScore] = useState(0);

  const totalSteps = HEALTH_PILLARS.length;
  const currentPillar = HEALTH_PILLARS[currentStep];
  const isLastStep = currentStep === totalSteps - 1;
  const currentAnswer = answers[currentPillar?.id];
  const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100);

  const handleSelectOption = (optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentPillar.id]: optionId
    }));
  };

  const handleNext = () => {
    if (!currentAnswer) return;

    if (isLastStep) {
      const allAnswers = {
        ...answers,
        [currentPillar.id]: currentAnswer
      };
      const finalResult = calculateFinancialHealth(allAnswers);
      setResult(finalResult);
      setIsCompleted(true);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentStep(0);
    setIsCompleted(false);
    setResult(null);
    setAnimatedScore(0);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Keyboard navigation for options (Space or Enter to select)
  const handleKeyDown = (e: React.KeyboardEvent, optionId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelectOption(optionId);
    }
  };

  // Animated score counter on result reveal
  useEffect(() => {
    if (isCompleted && result) {
      // Check prefers-reduced-motion
      const prefersReducedMotion = typeof window !== 'undefined' && 
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        setAnimatedScore(result.overallScore);
        return;
      }

      let start = 0;
      const target = result.overallScore;
      const duration = 1000; // 1s smooth counter
      const increment = target / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setAnimatedScore(target);
          clearInterval(timer);
        } else {
          setAnimatedScore(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isCompleted, result]);

  // Construct helpful topics for WhatsApp message
  const getWhatsAppTopics = (res: HealthCheckResult): string => {
    const focusPillars = [
      ...res.priorityAreas.map(p => p.title),
      ...res.areasToStrengthen.map(p => p.title)
    ];

    if (focusPillars.length === 0) {
      return 'maintaining my financial roadmap and asset allocation';
    }
    if (focusPillars.length === 1) {
      return focusPillars[0];
    }
    return `${focusPillars[0]} and ${focusPillars[1]}`;
  };

  return (
    <div className="health-check-component">
      {isCompleted && result ? (
        /* =========================================================
           V4.0 RESULT SCREEN: YOUR FINANCIAL HEALTH SNAPSHOT
           Ordered Sections:
           1. Overall Score & Band Badge
           2. Short Explanation
           3. Your Key Strengths (score >= 80)
           4. Areas to Strengthen (50 <= score < 80)
           5. Priority Areas (score < 50, if applicable)
           6. Your Next 3 Steps (Max 3, structured)
           7. Important Context / Limitation / Disclosure
           8. Optional Ant Wealth Creation CTA & WhatsApp Link
           ========================================================= */
        <div className="health-result-wrapper">
          {/* Section 1 & 2: Overall Score & Short Explanation */}
          <div className="result-snapshot-card">
            <div className="snapshot-header">
              <span className="snapshot-tag">Self-Assessment Diagnostic</span>
              <h2 className="snapshot-title">Your Financial Health Snapshot</h2>
              <p className="snapshot-disclaimer-lead">
                This quick check is a starting point, not a complete financial plan.
              </p>
            </div>

            <div className="snapshot-hero-row">
              <div 
                className="score-circle-display"
                style={{ borderColor: result.band.badgeColor }}
                aria-label={`Your Financial Health Score is ${result.overallScore} out of 100, classified as ${result.band.title}`}
              >
                <span className="score-number-value" style={{ color: result.band.badgeColor }}>
                  {animatedScore}
                </span>
                <span className="score-denominator">/ 100</span>
              </div>

              <div className="score-narrative">
                <div 
                  className="status-band-badge"
                  style={{ 
                    backgroundColor: `${result.band.badgeColor}15`, 
                    color: result.band.badgeColor,
                    borderColor: `${result.band.badgeColor}30`
                  }}
                >
                  <span className="badge-bullet">•</span>
                  <span>{result.band.title}</span>
                </div>
                <p className="band-short-explanation">
                  {result.band.shortExplanation}
                </p>
              </div>
            </div>

            {/* Granular Pillar Score Status Track */}
            <div className="pillars-status-overview">
              <h3 className="sub-section-title">Pillar Evaluation Summary</h3>
              <div className="pillars-status-grid">
                {result.pillarScores.map((p) => (
                  <div key={p.pillar} className="pillar-mini-card">
                    <div className="pillar-mini-header">
                      <span className="pillar-mini-name">{p.shortTitle}</span>
                      <span 
                        className={`pillar-badge badge-${p.status}`}
                        style={{
                          color: p.statusColor,
                          backgroundColor: `${p.statusColor}12`,
                          borderColor: `${p.statusColor}25`
                        }}
                      >
                        <span className="badge-icon">{p.icon}</span>
                        <span>{p.statusLabel}</span>
                      </span>
                    </div>
                    <div className="pillar-bar-bg" aria-hidden="true">
                      <div 
                        className="pillar-bar-fill" 
                        style={{ width: `${p.score}%`, backgroundColor: p.statusColor }}
                      />
                    </div>
                    <div className="pillar-mini-footer">
                      <span className="pillar-mini-score">{p.score}/100</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Your Key Strengths (score >= 80) */}
          {result.strengths.length > 0 && (
            <div className="result-section strengths-section">
              <div className="section-header-row">
                <div className="section-icon-badge icon-strong">✓</div>
                <div>
                  <h3 className="section-heading">Your Key Strengths</h3>
                  <p className="section-subtext">Core foundational areas where your habits and resilience are well-established.</p>
                </div>
              </div>

              <div className="insights-grid">
                {result.strengths.map((s) => (
                  <div key={s.pillar} className="insight-item-card card-strong">
                    <div className="insight-card-header">
                      <span className="insight-pillar-name">{s.title}</span>
                      <span className="insight-pill pill-strong">Strong</span>
                    </div>
                    <p className="insight-card-text">{s.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: Areas to Strengthen (50 <= score < 80) */}
          {result.areasToStrengthen.length > 0 && (
            <div className="result-section strengthen-section">
              <div className="section-header-row">
                <div className="section-icon-badge icon-building">↗</div>
                <div>
                  <h3 className="section-heading">Areas to Strengthen</h3>
                  <p className="section-subtext">Areas with a good start that would benefit from clearer planning or optimization.</p>
                </div>
              </div>

              <div className="insights-grid">
                {result.areasToStrengthen.map((a) => (
                  <div key={a.pillar} className="insight-item-card card-building">
                    <div className="insight-card-header">
                      <span className="insight-pillar-name">{a.title}</span>
                      <span className="insight-pill pill-building">Building</span>
                    </div>
                    <p className="insight-card-text">{a.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 5: Priority Areas (score < 50) */}
          {result.priorityAreas.length > 0 && (
            <div className="result-section priority-section">
              <div className="section-header-row">
                <div className="section-icon-badge icon-attention">!</div>
                <div>
                  <h3 className="section-heading">Priority Areas</h3>
                  <p className="section-subtext">Foundational vulnerabilities that deserve prioritized focus to protect family stability.</p>
                </div>
              </div>

              <div className="insights-grid">
                {result.priorityAreas.map((p) => (
                  <div key={p.pillar} className="insight-item-card card-attention">
                    <div className="insight-card-header">
                      <span className="insight-pillar-name">{p.title}</span>
                      <span className="insight-pill pill-attention">Needs Attention</span>
                    </div>
                    <p className="insight-card-text">{p.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 6: Your Next 3 Steps (Max 3, Dependency-Aware) */}
          <div className="result-section next-steps-section">
            <div className="section-header-row">
              <div className="section-icon-badge icon-steps">⚡</div>
              <div>
                <h3 className="section-heading">Your Next 3 Steps</h3>
                <p className="section-subtext">
                  Practical, dependency-aware actions sequenced to strengthen foundation first, followed by planning and compounding.
                </p>
              </div>
            </div>

            <div className="recommendations-stack">
              {result.recommendations.map((rec, index) => (
                <div key={rec.pillar + index} className="recommendation-card">
                  <div className="step-priority-badge" aria-label={`Step ${index + 1}`}>
                    {index + 1}
                  </div>
                  <div className="recommendation-content">
                    <div className="recommendation-header">
                      <h4 className="rec-title">{rec.title}</h4>
                      <span className="rec-pillar-tag">{rec.pillar}</span>
                    </div>
                    <p className="rec-action-text">{rec.action}</p>
                    <p className="rec-desc-subtext">{rec.description}</p>
                    {rec.route && (
                      <div className="rec-tool-link-wrapper">
                        <a href={rec.route} className="btn-rec-tool">
                          {rec.routeLabel || 'Explore Tool →'}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 7: Important Context / Limitation / Disclosure */}
          <div className="result-section limitation-section">
            <h4 className="disclosure-heading">Important Context & Scope</h4>
            <p className="disclosure-text">
              This is an educational self-assessment designed to give you a quick view of areas of financial strength and areas that may need attention. It is not a complete financial plan or a personalised investment recommendation. Insurance, retirement, investment and other financial needs require additional information to assess properly.
            </p>
            <p className="compliance-text">
              <strong>Statutory Disclosure:</strong> Ant Wealth Creation is an AMFI-Registered Mutual Fund Distributor (ARN: 266896). Mutual fund investments are subject to market risks; read all scheme-related documents carefully.
            </p>
          </div>

          {/* Section 8: Optional Ant Wealth Creation CTA & WhatsApp Bridge */}
          <div className="cta-box-card">
            <h3 className="cta-heading">Want to discuss your results?</h3>
            <p className="cta-subtext">
              Ant Wealth Creation can help you understand the areas identified in this check and explore your options. You can connect with C. Santhosh Sathriyan (QPFP Certified, AMFI-Registered MFD, ARN: 266896).
            </p>

            <div className="cta-actions-group">
              <a 
                href={`https://wa.me/918087971566?text=${encodeURIComponent(
                  `Hi Santhosh, I completed the Ant Wealth Creation Financial Health Check.\n\n` +
                  `• Score: ${result.overallScore}/100 (${result.band.title})\n` +
                  `• Areas to discuss: ${getWhatsAppTopics(result)}\n\n` +
                  `Can we connect to discuss this plan?`
                )}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-action-primary"
              >
                💬 Talk to Santhosh
              </a>

              <a href="/contact" className="btn-action-secondary">
                Book a Free Consultation
              </a>
            </div>

            <div className="retake-link-wrapper">
              <button 
                type="button"
                onClick={handleRetake} 
                className="btn-action-retake"
              >
                ↺ Retake Health Check
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================
           V4.0 QUESTIONNAIRE WORKSPACE
           One clear question at a time, clear progress indicator,
           selectable answer cards with sublabels, large touch targets.
           ========================================================= */
        <div className="questionnaire-card">
          {/* Progress Header */}
          <div className="questionnaire-header">
            <div className="progress-meta-row">
              <span className="pillar-badge-tag">{currentPillar?.shortTitle}</span>
              <span className="step-counter-text" aria-live="polite">
                Step {currentStep + 1} of {totalSteps}
              </span>
            </div>

            <div className="progress-track-wrapper" aria-hidden="true">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Question & Helper Text */}
          <div className="question-body">
            <h2 className="question-title-text">{currentPillar?.question}</h2>
            <p className="question-helper-text">{currentPillar?.helperText}</p>

            {/* 4 Accessible Option Cards */}
            <div 
              className="options-grid" 
              role="radiogroup" 
              aria-label={currentPillar?.question}
            >
              {currentPillar?.options.map((opt, idx) => {
                const isSelected = currentAnswer === opt.id;
                return (
                  <div
                    key={opt.id}
                    role="radio"
                    aria-checked={isSelected}
                    tabIndex={0}
                    onClick={() => handleSelectOption(opt.id)}
                    onKeyDown={(e) => handleKeyDown(e, opt.id)}
                    className={`option-tile option-card ${isSelected ? 'is-selected' : ''}`}
                  >
                    <div className="option-radio-indicator">
                      <div className={`radio-dot ${isSelected ? 'radio-checked' : ''}`} />
                    </div>
                    <div className="option-label-wrapper">
                      <div className="option-text-main">{opt.label}</div>
                      {opt.sublabel && (
                        <div className="option-text-sub">{opt.sublabel}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="questionnaire-nav-footer">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`btn-nav-back nav-back-btn ${currentStep === 0 ? 'is-disabled' : ''}`}
            >
              ← Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!currentAnswer}
              className={`btn-nav-next nav-next-btn ${!currentAnswer ? 'is-disabled' : ''}`}
            >
              {isLastStep ? 'Calculate My Score →' : 'Next Question →'}
            </button>
          </div>
        </div>
      )}

      {/* Embedded Component Styles adhering to AWC Design Tokens */}
      <style>{`
        /* Questionnaire Card Styles */
        .questionnaire-card {
          background-color: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 16px;
          padding: 2.5rem;
          box-shadow: 0 4px 20px rgba(0, 24, 42, 0.04);
          max-width: 820px;
          margin: 0 auto;
        }

        .questionnaire-header {
          margin-bottom: 2rem;
        }

        .progress-meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .pillar-badge-tag {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #00AB96;
          background-color: rgba(0, 171, 150, 0.1);
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
        }

        .step-counter-text {
          font-size: 0.9rem;
          font-weight: 600;
          color: #64748B;
        }

        .progress-track-wrapper {
          width: 100%;
          height: 8px;
          background-color: #F1F5F9;
          border-radius: 9999px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #00AB96 0%, #00182A 100%);
          border-radius: 9999px;
          transition: width 0.3s ease;
        }

        .question-title-text {
          font-family: 'Outfit', sans-serif;
          font-size: 1.55rem;
          font-weight: 700;
          color: #00182A;
          line-height: 1.35;
          margin-bottom: 0.5rem;
        }

        .question-helper-text {
          font-size: 0.95rem;
          color: #64748B;
          line-height: 1.55;
          margin-bottom: 2rem;
        }

        .options-grid {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
          margin-bottom: 2.5rem;
        }

        .option-tile {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.15rem 1.25rem;
          background-color: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
          min-height: 52px;
        }

        .option-tile:hover {
          border-color: #00AB96;
          background-color: #F8FAFC;
          transform: translateY(-1px);
        }

        .option-tile:focus-visible {
          outline: 2px solid #00AB96;
          outline-offset: 2px;
        }

        .option-tile.is-selected {
          border-color: #00AB96;
          background-color: rgba(0, 171, 150, 0.05);
          box-shadow: 0 0 0 1px #00AB96;
        }

        .option-radio-indicator {
          margin-top: 2px;
          flex-shrink: 0;
        }

        .radio-dot {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid #CBD5E1;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .radio-dot.radio-checked {
          border-color: #00AB96;
          background-color: #00AB96;
        }

        .radio-dot.radio-checked::after {
          content: '';
          width: 8px;
          height: 8px;
          background-color: #FFFFFF;
          border-radius: 50%;
        }

        .option-label-wrapper {
          flex: 1;
        }

        .option-text-main {
          font-size: 1rem;
          font-weight: 600;
          color: #00182A;
          line-height: 1.45;
        }

        .option-text-sub {
          font-size: 0.85rem;
          color: #64748B;
          margin-top: 0.25rem;
          line-height: 1.4;
        }

        .questionnaire-nav-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1.5rem;
          border-top: 1px solid #F1F5F9;
        }

        .btn-nav-back {
          background: transparent;
          border: none;
          color: #64748B;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0.65rem 1.25rem;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .btn-nav-back:hover:not(.is-disabled) {
          color: #00182A;
          background-color: #F1F5F9;
        }

        .btn-nav-next {
          background-color: #00182A;
          color: #FFFFFF;
          border: none;
          font-size: 1rem;
          font-weight: 600;
          padding: 0.85rem 1.8rem;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(0, 24, 42, 0.15);
        }

        .btn-nav-next:hover:not(.is-disabled) {
          background-color: #002845;
          transform: translateY(-2px);
        }

        .is-disabled {
          opacity: 0.35;
          cursor: not-allowed;
          box-shadow: none;
        }

        /* Results Snapshot Container */
        .health-result-wrapper {
          max-width: 880px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .result-snapshot-card {
          background: linear-gradient(135deg, #00182A 0%, #002642 100%);
          border-radius: 20px;
          padding: 2.5rem;
          color: #FFFFFF;
          box-shadow: 0 10px 30px rgba(0, 24, 42, 0.15);
        }

        .snapshot-header {
          margin-bottom: 1.75rem;
        }

        .snapshot-tag {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #00AB96;
          background-color: rgba(0, 171, 150, 0.15);
          padding: 0.25rem 0.65rem;
          border-radius: 9999px;
          margin-bottom: 0.5rem;
        }

        .snapshot-title {
          font-family: 'Outfit', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          color: #FFFFFF;
          line-height: 1.2;
          margin-bottom: 0.35rem;
        }

        .snapshot-disclaimer-lead {
          font-size: 0.95rem;
          color: #94A3B8;
          margin: 0;
        }

        .snapshot-hero-row {
          display: flex;
          align-items: center;
          gap: 2.25rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 2rem;
        }

        .score-circle-display {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.05);
          border: 4px solid #00AB96;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .score-number-value {
          font-family: 'Outfit', sans-serif;
          font-size: 3.3rem;
          font-weight: 800;
          line-height: 1;
        }

        .score-denominator {
          font-size: 0.85rem;
          color: #94A3B8;
          font-weight: 600;
          margin-top: 2px;
        }

        .score-narrative {
          flex: 1;
        }

        .status-band-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.9rem;
          font-weight: 700;
          padding: 0.35rem 0.85rem;
          border-radius: 9999px;
          border: 1px solid;
          margin-bottom: 0.75rem;
        }

        .badge-bullet {
          font-size: 1.1rem;
          line-height: 1;
        }

        .band-short-explanation {
          font-size: 1.05rem;
          color: #E2E8F0;
          line-height: 1.6;
          margin: 0;
        }

        .sub-section-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #CBD5E1;
          margin-bottom: 1rem;
        }

        .pillars-status-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 0.875rem;
        }

        .pillar-mini-card {
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 0.85rem 1rem;
        }

        .pillar-mini-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.6rem;
        }

        .pillar-mini-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: #F8FAFC;
        }

        .pillar-badge {
          font-size: 0.725rem;
          font-weight: 700;
          padding: 0.15rem 0.5rem;
          border-radius: 9999px;
          border: 1px solid;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .pillar-bar-bg {
          height: 5px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 9999px;
          overflow: hidden;
          margin-bottom: 0.4rem;
        }

        .pillar-bar-fill {
          height: 100%;
          border-radius: 9999px;
          transition: width 0.6s ease;
        }

        .pillar-mini-footer {
          display: flex;
          justify-content: flex-end;
        }

        .pillar-mini-score {
          font-size: 0.75rem;
          color: #94A3B8;
          font-weight: 600;
        }

        /* Generic Result Section */
        .result-section {
          background-color: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 16px;
          padding: 2rem 2.25rem;
        }

        .section-header-row {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .section-icon-badge {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        .icon-strong {
          background-color: rgba(0, 171, 150, 0.12);
          color: #00AB96;
        }

        .icon-building {
          background-color: rgba(37, 99, 235, 0.12);
          color: #2563EB;
        }

        .icon-attention {
          background-color: rgba(225, 29, 72, 0.12);
          color: #E11D48;
        }

        .icon-steps {
          background-color: rgba(0, 24, 42, 0.08);
          color: #00182A;
        }

        .section-heading {
          font-family: 'Outfit', sans-serif;
          font-size: 1.35rem;
          font-weight: 700;
          color: #00182A;
          margin-bottom: 0.25rem;
        }

        .section-subtext {
          font-size: 0.95rem;
          color: #64748B;
          margin: 0;
          line-height: 1.5;
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
        }

        .insight-item-card {
          border-radius: 12px;
          padding: 1.25rem;
          border: 1px solid #E2E8F0;
          background-color: #F8FAFC;
        }

        .card-strong {
          border-left: 4px solid #00AB96;
        }

        .card-building {
          border-left: 4px solid #2563EB;
        }

        .card-attention {
          border-left: 4px solid #E11D48;
        }

        .insight-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .insight-pillar-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: #00182A;
        }

        .insight-pill {
          font-size: 0.725rem;
          font-weight: 700;
          padding: 0.15rem 0.55rem;
          border-radius: 9999px;
        }

        .pill-strong {
          background-color: rgba(0, 171, 150, 0.12);
          color: #00AB96;
        }

        .pill-building {
          background-color: rgba(37, 99, 235, 0.12);
          color: #2563EB;
        }

        .pill-attention {
          background-color: rgba(225, 29, 72, 0.12);
          color: #E11D48;
        }

        .insight-card-text {
          font-size: 0.9rem;
          color: #334155;
          line-height: 1.55;
          margin: 0;
        }

        /* Next 3 Steps Stack */
        .recommendations-stack {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .recommendation-card {
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
          padding: 1.35rem 1.5rem;
          background-color: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 14px;
          transition: all 0.2s ease;
        }

        .recommendation-card:hover {
          border-color: #00AB96;
          background-color: #FFFFFF;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
        }

        .step-priority-badge {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background-color: #00182A;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Outfit', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        .recommendation-content {
          flex: 1;
        }

        .recommendation-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.4rem;
        }

        .rec-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: #00182A;
          margin: 0;
        }

        .rec-pillar-tag {
          font-size: 0.725rem;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: #64748B;
          background-color: #E2E8F0;
          padding: 0.15rem 0.5rem;
          border-radius: 6px;
        }

        .rec-action-text {
          font-size: 0.95rem;
          color: #1E293B;
          font-weight: 600;
          line-height: 1.55;
          margin-bottom: 0.35rem;
        }

        .rec-desc-subtext {
          font-size: 0.85rem;
          color: #64748B;
          line-height: 1.5;
          margin: 0 0 0.85rem 0;
        }

        .rec-tool-link-wrapper {
          margin-top: 0.5rem;
        }

        .btn-rec-tool {
          display: inline-flex;
          align-items: center;
          font-size: 0.85rem;
          font-weight: 700;
          color: #00AB96;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .btn-rec-tool:hover {
          color: #007d6e;
          transform: translateX(3px);
        }

        /* Scope & Disclosure */
        .limitation-section {
          background-color: #F8FAFC;
          border-left: 4px solid #64748B;
          padding: 1.5rem 1.75rem;
        }

        .disclosure-heading {
          font-family: 'Outfit', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #00182A;
          margin-bottom: 0.5rem;
        }

        .disclosure-text {
          font-size: 0.875rem;
          color: #475569;
          line-height: 1.6;
          margin-bottom: 0.75rem;
        }

        .compliance-text {
          font-size: 0.8rem;
          color: #64748B;
          line-height: 1.5;
          margin: 0;
        }

        /* Optional Consultation CTA Box */
        .cta-box-card {
          background: linear-gradient(135deg, #F8FAFC 0%, #EDF2F7 100%);
          border: 1.5px solid #CBD5E1;
          border-radius: 16px;
          padding: 2.5rem;
          text-align: center;
        }

        .cta-heading {
          font-family: 'Outfit', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #00182A;
          margin-bottom: 0.5rem;
        }

        .cta-subtext {
          font-size: 1rem;
          color: #475569;
          max-width: 640px;
          margin: 0 auto 1.75rem auto;
          line-height: 1.6;
        }

        .cta-actions-group {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }

        .btn-action-primary {
          background-color: #00AB96;
          color: #FFFFFF;
          font-size: 0.95rem;
          font-weight: 600;
          padding: 0.85rem 1.75rem;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(0, 171, 150, 0.2);
        }

        .btn-action-primary:hover {
          background-color: #008f7d;
          transform: translateY(-2px);
        }

        .btn-action-secondary {
          background-color: #00182A;
          color: #FFFFFF;
          font-size: 0.95rem;
          font-weight: 600;
          padding: 0.85rem 1.75rem;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .btn-action-secondary:hover {
          background-color: #002845;
          transform: translateY(-2px);
        }

        .retake-link-wrapper {
          display: flex;
          justify-content: center;
        }

        .btn-action-retake {
          background: transparent;
          border: none;
          color: #64748B;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0.5rem 1rem;
          transition: color 0.2s ease;
        }

        .btn-action-retake:hover {
          color: #00182A;
          text-decoration: underline;
        }

        /* Responsive Breakpoints */
        @media (max-width: 768px) {
          .questionnaire-card {
            padding: 1.5rem;
          }

          .question-title-text {
            font-size: 1.3rem;
          }

          .result-snapshot-card {
            padding: 1.75rem 1.5rem;
          }

          .snapshot-title {
            font-size: 1.6rem;
          }

          .snapshot-hero-row {
            flex-direction: column;
            text-align: center;
            gap: 1.5rem;
          }

          .result-section {
            padding: 1.5rem;
          }

          .recommendation-card {
            flex-direction: column;
            gap: 0.75rem;
          }

          .cta-box-card {
            padding: 1.75rem 1.25rem;
          }

          .cta-actions-group {
            flex-direction: column;
            width: 100%;
          }

          .btn-action-primary,
          .btn-action-secondary {
            width: 100%;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .questionnaire-card {
            padding: 1.25rem 1rem;
            border-radius: 14px;
          }

          .option-tile {
            padding: 1rem;
          }

          .questionnaire-nav-footer {
            padding-top: 1.25rem;
          }

          .btn-nav-next,
          .btn-nav-back {
            padding: 0.75rem 1.25rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}
