import React, { useState, useEffect } from 'react';

/**
 * HealthScoreGauge Component
 * NOTE: This is an interactive visual teaser for the homepage showcasing the
 * animated score gauge (0 -> 72/100) from the approved blueprint design.
 * It is clearly marked as sample/preview UI. The actual comprehensive scoring algorithm
 * will be dynamically computed on the dedicated /health-check questionnaire page.
 */
interface Props {
  targetScore?: number;
}

export const HealthScoreGauge: React.FC<Props> = ({ targetScore = 72 }) => {
  const [score, setScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1600; // ms
    const stepTime = 20;
    const totalSteps = duration / stepTime;
    const stepIncrement = targetScore / totalSteps;

    const timer = setInterval(() => {
      start += stepIncrement;
      if (start >= targetScore) {
        setScore(targetScore);
        clearInterval(timer);
      } else {
        setScore(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [targetScore]);

  // SVG Gauge calculations
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="gauge-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }} aria-hidden="true" focusable="false">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="#E2E8F0"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Animated score ring */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="#00AB96"
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{ transition: 'stroke-dashoffset 0.1s ease-out' }}
          />
        </svg>

        {/* Center Score Text */}
        <div style={{ position: 'absolute', textAlign: 'center' }}>
          <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#00182A', fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>
            {score}
          </span>
          <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
            /100
          </span>
        </div>
      </div>
    </div>
  );
};
