import React, { useState, useEffect } from 'react';
import { 
  HEALTH_CHECK_QUESTIONS, 
  calculateFinancialHealth, 
  type HealthCheckAnswers, 
  type HealthCheckResult 
} from '../../utils/calculations/financialHealth';

export default function HealthQuestionnaire() {
  const [answers, setAnswers] = useState<HealthCheckAnswers>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [result, setResult] = useState<HealthCheckResult | null>(null);
  const [animatedScore, setAnimatedScore] = useState(0);

  const totalSteps = HEALTH_CHECK_QUESTIONS.length;
  const currentQuestion = HEALTH_CHECK_QUESTIONS[currentStep];
  const isLastStep = currentStep === totalSteps - 1;
  const currentAnswer = answers[currentQuestion?.id];
  const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100);

  const handleSelectOption = (optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionId
    }));
  };

  const handleNext = () => {
    if (!currentAnswer) return;

    if (isLastStep) {
      const finalResult = calculateFinancialHealth(answers);
      setResult(finalResult);
      setIsCompleted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Score counter animation on result reveal
  useEffect(() => {
    if (isCompleted && result) {
      let start = 0;
      const target = result.overallScore;
      const duration = 1200;
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

  const scoreColor = 
    (result?.overallScore ?? 0) >= 80 ? '#00AB96' : 
    (result?.overallScore ?? 0) >= 60 ? '#2563EB' : 
    (result?.overallScore ?? 0) >= 40 ? '#F59E0B' : '#EF4444';

  // Render either Result State or Questionnaire State wrapped in common styles
  return (
    <div className="health-check-component">
      {isCompleted && result ? (
        <div className="health-result-wrapper">
          {/* Score Banner */}
          <div className="result-hero-card">
            <div className="result-score-circle" style={{ borderColor: scoreColor }}>
              <span className="score-number" style={{ color: scoreColor }}>{animatedScore}</span>
              <span className="score-max">/ 100</span>
            </div>

            <div className="result-summary-text">
              <span className="result-badge" style={{ backgroundColor: `${scoreColor}18`, color: scoreColor }}>
                {result.ratingTitle}
              </span>
              <h2 className="result-main-title">Your Financial Health Diagnostic</h2>
              <p className="result-desc">{result.ratingDescription}</p>
            </div>
          </div>

          {/* Category Breakdown Grid */}
          <div className="result-section">
            <h3 className="section-title">Category Breakdown</h3>
            <p className="section-subtitle">A granular view of your financial foundation across the 7 vital pillars.</p>

            <div className="category-grid">
              {result.categoryScores.map((cat) => (
                <div key={cat.category} className="category-card">
                  <div className="category-header">
                    <span className="category-name">{cat.title}</span>
                    <span 
                      className="category-status" 
                      style={{ backgroundColor: `${cat.statusColor}15`, color: cat.statusColor }}
                    >
                      {cat.status}
                    </span>
                  </div>
                  <div className="category-bar-bg">
                    <div 
                      className="category-bar-fill" 
                      style={{ width: `${cat.score}%`, backgroundColor: cat.statusColor }}
                    />
                  </div>
                  <div className="category-footer">
                    <span className="category-score-text">{cat.score} / 100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Attention Areas */}
          <div className="insights-two-col">
            <div className="insight-card strengths-card">
              <div className="insight-header">
                <span className="insight-icon strength-icon">✓</span>
                <h4>Your Key Strengths</h4>
              </div>
              <ul className="insight-list">
                {result.strengths.length > 0 ? (
                  result.strengths.map((str, idx) => (
                    <li key={idx} className="strength-item">
                      <span className="bullet-check">✓</span>
                      <span>{str}</span>
                    </li>
                  ))
                ) : (
                  <li className="neutral-item">Establishing basic emergency and savings habits will unlock rapid improvements.</li>
                )}
              </ul>
            </div>

            <div className="insight-card attention-card">
              <div className="insight-header">
                <span className="insight-icon attention-icon">!</span>
                <h4>Areas Needing Attention</h4>
              </div>
              <ul className="insight-list">
                {result.needsAttention.length > 0 ? (
                  result.needsAttention.map((att, idx) => (
                    <li key={idx} className="attention-item">
                      <span className="bullet-dot">•</span>
                      <span>{att}</span>
                    </li>
                  ))
                ) : (
                  <li className="strength-item">
                    <span className="bullet-check">✓</span>
                    <span>Excellent all-round balance across all 7 financial dimensions.</span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Actionable Next Steps */}
          <div className="result-section">
            <h3 className="section-title">Recommended Next Steps</h3>
            <p className="section-subtitle">Goal-oriented, educational actions to enhance your compounding and risk resilience.</p>

            <div className="next-steps-list">
              {result.nextSteps.map((step, idx) => (
                <div key={idx} className="step-action-item">
                  <div className="step-number-badge">{idx + 1}</div>
                  <p className="step-action-text">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Optional Action CTAs */}
          <div className="result-cta-box">
            <h3 className="cta-box-title">Ready to structure your personalised roadmap?</h3>
            <p className="cta-box-desc">
              Speak directly with C. Santhosh Sathriyan (AMFI-Registered MFD, ARN: 266896) to turn these insights into an actionable, goal-based mutual fund plan.
            </p>
            <div className="cta-buttons-group">
              <a 
                href={`https://wa.me/918087971566?text=${encodeURIComponent(
                  `Hi Santhosh, I used the Financial Health Check on Ant Wealth Creation.\n\n` +
                  `• Health Score: ${result.overallScore} / 100 (${result.ratingTitle})\n` +
                  `• Key Priority: ${result.actionRecommendations[0]?.title || 'Review Plan'}\n\n` +
                  `Can we connect to discuss this plan?`
                )}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary-action"
              >
                💬 Talk to Santhosh
              </a>
              <a href="/contact" className="btn-secondary-action">
                Book a Free Consultation
              </a>
              <a href="/tools" className="btn-tertiary-action">
                Explore Calculators
              </a>
            </div>

            <div className="retake-container">
              <button onClick={handleRetake} className="btn-retake">
                ↺ Retake Health Check
              </button>
            </div>
          </div>

          {/* Regulatory Disclaimer */}
          <div className="result-disclaimer">
            <p>
              <strong>Illustrative Benchmark Notice:</strong> Category scores and recommendations reflect illustrative financial-health benchmarks. Actual requirements vary based on individual circumstances, family structure, and personal goals. Ant Wealth Creation is an AMFI-Registered Mutual Fund Distributor (ARN: 266896). This assessment is an educational self-diagnostic and does not constitute formal SEBI RIA investment advice or promise guaranteed returns. Mutual fund investments are subject to market risks; read all scheme-related documents carefully.
            </p>
          </div>
        </div>
      ) : (
        <div className="questionnaire-card">
          {/* Step Header & Progress */}
          <div className="questionnaire-header">
            <div className="progress-meta">
              <span className="step-category-tag">{currentQuestion?.categoryTitle}</span>
              <span className="step-counter-text">Step {currentStep + 1} of {totalSteps}</span>
            </div>

            <div className="progress-track">
              <div 
                className="progress-fill" 
                style={{ width: `${progressPercent}%` }} 
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>

          {/* Question Block */}
          <div className="question-content">
            <h2 className="question-heading">{currentQuestion?.question}</h2>
            <p className="question-hint">{currentQuestion?.description}</p>

            {/* Options List */}
            <div className="options-container" role="radiogroup" aria-label={currentQuestion?.question}>
              {currentQuestion?.options.map((option) => {
                const isSelected = currentAnswer === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleSelectOption(option.id)}
                    className={`option-card ${isSelected ? 'option-selected' : ''}`}
                  >
                    <div className="option-indicator">
                      <div className={`radio-dot ${isSelected ? 'dot-active' : ''}`} />
                    </div>
                    <div className="option-text-group">
                      <div className="option-label">{option.label}</div>
                      {option.sublabel && (
                        <div className="option-sublabel">{option.sublabel}</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="questionnaire-footer">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`nav-back-btn ${currentStep === 0 ? 'btn-disabled' : ''}`}
            >
              ← Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!currentAnswer}
              className={`nav-next-btn ${!currentAnswer ? 'btn-disabled' : ''}`}
            >
              {isLastStep ? 'Calculate My Score →' : 'Next Question →'}
            </button>
          </div>
        </div>
      )}

      <style>{`
        .questionnaire-card {
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 2.5rem;
          box-shadow: 0 4px 20px rgba(0, 24, 42, 0.04);
          max-width: 780px;
          margin: 0 auto;
        }

        .questionnaire-header {
          margin-bottom: 2rem;
        }

        .progress-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .step-category-tag {
          font-size: 0.85rem;
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

        .progress-track {
          width: 100%;
          height: 8px;
          background-color: #F1F5F9;
          border-radius: 9999px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #00AB96, #00182A);
          border-radius: 9999px;
          transition: width 0.3s ease;
        }

        .question-heading {
          font-family: 'Outfit', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #00182A;
          line-height: 1.35;
          margin-bottom: 0.5rem;
        }

        .question-hint {
          font-size: 0.95rem;
          color: #64748B;
          line-height: 1.5;
          margin-bottom: 2rem;
        }

        .options-container {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
          margin-bottom: 2.5rem;
        }

        .option-card {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.15rem 1.25rem;
          background-color: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 12px;
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: all 0.2s ease;
        }

        .option-card:hover {
          border-color: #00AB96;
          background-color: #F8FAFC;
          transform: translateY(-1px);
        }

        .option-card.option-selected {
          border-color: #00AB96;
          background-color: rgba(0, 171, 150, 0.05);
          box-shadow: 0 0 0 1px #00AB96;
        }

        .option-indicator {
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

        .radio-dot.dot-active {
          border-color: #00AB96;
          background-color: #00AB96;
        }

        .radio-dot.dot-active::after {
          content: '';
          width: 8px;
          height: 8px;
          background-color: #FFFFFF;
          border-radius: 50%;
        }

        .option-text-group {
          flex: 1;
        }

        .option-label {
          font-size: 1rem;
          font-weight: 600;
          color: #00182A;
          line-height: 1.4;
          margin-bottom: 0.2rem;
        }

        .option-sublabel {
          font-size: 0.85rem;
          color: #64748B;
          line-height: 1.4;
        }

        .questionnaire-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1.5rem;
          border-top: 1px solid #F1F5F9;
        }

        .nav-back-btn {
          background: transparent;
          border: none;
          color: #64748B;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0.6rem 1rem;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .nav-back-btn:hover:not(.btn-disabled) {
          color: #00182A;
          background-color: #F1F5F9;
        }

        .nav-next-btn {
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

        .nav-next-btn:hover:not(.btn-disabled) {
          background-color: #002845;
          transform: translateY(-2px);
        }

        .btn-disabled {
          opacity: 0.4;
          cursor: not-allowed;
          box-shadow: none;
        }

        /* Result View Styles */
        .health-result-wrapper {
          max-width: 880px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .result-hero-card {
          background: linear-gradient(135deg, #00182A 0%, #002B49 100%);
          border-radius: 20px;
          padding: 2.5rem;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          gap: 2.5rem;
          box-shadow: 0 10px 30px rgba(0, 24, 42, 0.15);
        }

        .result-score-circle {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.08);
          border: 4px solid #00AB96;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .score-number {
          font-family: 'Outfit', sans-serif;
          font-size: 3.2rem;
          font-weight: 800;
          line-height: 1;
        }

        .score-max {
          font-size: 0.85rem;
          color: #94A3B8;
          font-weight: 600;
          margin-top: 2px;
        }

        .result-summary-text {
          flex: 1;
        }

        .result-badge {
          display: inline-block;
          font-size: 0.85rem;
          font-weight: 700;
          padding: 0.3rem 0.85rem;
          border-radius: 9999px;
          margin-bottom: 0.75rem;
        }

        .result-main-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.85rem;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 0.5rem;
          line-height: 1.2;
        }

        .result-desc {
          font-size: 1rem;
          color: #CBD5E1;
          line-height: 1.6;
        }

        .result-section {
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 2rem;
        }

        .section-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.35rem;
          font-weight: 700;
          color: #00182A;
          margin-bottom: 0.35rem;
        }

        .section-subtitle {
          font-size: 0.95rem;
          color: #64748B;
          margin-bottom: 1.5rem;
        }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.25rem;
        }

        .category-card {
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.25rem;
        }

        .category-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.85rem;
        }

        .category-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: #00182A;
        }

        .category-status {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.2rem 0.6rem;
          border-radius: 9999px;
        }

        .category-bar-bg {
          height: 6px;
          background-color: #E2E8F0;
          border-radius: 9999px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .category-bar-fill {
          height: 100%;
          border-radius: 9999px;
          transition: width 0.6s ease;
        }

        .category-footer {
          display: flex;
          justify-content: flex-end;
        }

        .category-score-text {
          font-size: 0.8rem;
          font-weight: 600;
          color: #64748B;
        }

        .insights-two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .insight-card {
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 1.75rem;
        }

        .strengths-card {
          border-left: 4px solid #00AB96;
        }

        .attention-card {
          border-left: 4px solid #F59E0B;
        }

        .insight-header {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 1.25rem;
        }

        .insight-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          font-weight: 800;
        }

        .strength-icon {
          background-color: rgba(0, 171, 150, 0.15);
          color: #00AB96;
        }

        .attention-icon {
          background-color: rgba(245, 158, 11, 0.15);
          color: #F59E0B;
        }

        .insight-header h4 {
          font-family: 'Outfit', sans-serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: #00182A;
        }

        .insight-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .strength-item, .attention-item, .neutral-item {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          font-size: 0.95rem;
          line-height: 1.5;
          color: #334155;
        }

        .bullet-check {
          color: #00AB96;
          font-weight: 800;
          font-size: 0.95rem;
        }

        .bullet-dot {
          color: #F59E0B;
          font-weight: 800;
          font-size: 1.2rem;
          line-height: 1;
        }

        .next-steps-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .step-action-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem 1.25rem;
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
        }

        .step-number-badge {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: #00182A;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        .step-action-text {
          font-size: 0.95rem;
          color: #1E293B;
          line-height: 1.5;
          font-weight: 500;
        }

        .result-cta-box {
          background: linear-gradient(135deg, #F8FAFC 0%, #EDF2F7 100%);
          border: 1.5px solid #CBD5E1;
          border-radius: 16px;
          padding: 2.25rem;
          text-align: center;
        }

        .cta-box-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.45rem;
          font-weight: 700;
          color: #00182A;
          margin-bottom: 0.5rem;
        }

        .cta-box-desc {
          font-size: 1rem;
          color: #475569;
          max-width: 620px;
          margin: 0 auto 1.75rem auto;
          line-height: 1.6;
        }

        .cta-buttons-group {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }

        .btn-primary-action {
          background-color: #00AB96;
          color: #FFFFFF;
          font-size: 0.95rem;
          font-weight: 600;
          padding: 0.85rem 1.6rem;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(0, 171, 150, 0.2);
        }

        .btn-primary-action:hover {
          background-color: #008f7d;
          transform: translateY(-2px);
        }

        .btn-secondary-action {
          background-color: #00182A;
          color: #FFFFFF;
          font-size: 0.95rem;
          font-weight: 600;
          padding: 0.85rem 1.6rem;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .btn-secondary-action:hover {
          background-color: #002845;
          transform: translateY(-2px);
        }

        .btn-tertiary-action {
          background-color: #FFFFFF;
          color: #00182A;
          border: 1.5px solid #CBD5E1;
          font-size: 0.95rem;
          font-weight: 600;
          padding: 0.85rem 1.5rem;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .btn-tertiary-action:hover {
          background-color: #F1F5F9;
        }

        .btn-retake {
          background: transparent;
          border: none;
          color: #64748B;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0.5rem 1rem;
          transition: color 0.2s ease;
        }

        .btn-retake:hover {
          color: #00182A;
          text-decoration: underline;
        }

        .result-disclaimer {
          padding: 1.25rem 1.5rem;
          background-color: #F8FAFC;
          border-radius: 12px;
          border-left: 3px solid #94A3B8;
        }

        .result-disclaimer p {
          font-size: 0.825rem;
          color: #64748B;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .questionnaire-card {
            padding: 1.5rem;
          }

          .question-heading {
            font-size: 1.25rem;
          }

          .result-hero-card {
            flex-direction: column;
            text-align: center;
            padding: 2rem 1.5rem;
          }

          .insights-two-col {
            grid-template-columns: 1fr;
          }

          .cta-buttons-group {
            flex-direction: column;
            width: 100%;
          }

          .btn-primary-action, .btn-secondary-action, .btn-tertiary-action {
            width: 100%;
            text-align: center;
          }
        }

        @media (max-width: 540px) {
          .questionnaire-card {
            padding: 1.25rem 0.875rem;
            border-radius: 12px;
          }

          .result-hero-card {
            padding: 1.5rem 1rem;
            border-radius: 14px;
          }

          .result-section {
            padding: 1.25rem 0.875rem;
            border-radius: 12px;
          }

          .step-actions-row.split {
            flex-direction: column-reverse;
            gap: 0.75rem;
          }

          .btn-next-step,
          .btn-back-step {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
