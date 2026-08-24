import React, { useState } from 'react';
import { siteConfig } from '../../data/siteConfig';

export const ConsultationBooking: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [consultType, setConsultType] = useState<string>('Financial Health Discussion');
  const [selectedDate, setSelectedDate] = useState<string>('Tomorrow');
  const [selectedSlot, setSelectedSlot] = useState<string>('Evening (06:00 PM – 07:00 PM)');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const CONSULTATION_TYPES = [
    {
      id: 'health',
      title: 'Financial Health Discussion',
      icon: '🩺',
      desc: 'Review income, emergency savings, insurance adequacy, and debt-to-income balance.',
    },
    {
      id: 'goal',
      title: 'Goal Planning Discussion',
      icon: '🎯',
      desc: 'Map specific family milestones like child education, home buying, or retirement.',
    },
    {
      id: 'general',
      title: 'General Financial Conversation',
      icon: '💬',
      desc: 'Introductory discussion on starting mutual fund SIPs, asset allocation, or market queries.',
    },
  ];

  const DATE_OPTIONS = [
    { label: 'Tomorrow', desc: 'Next available day' },
    { label: 'In 2 Days', desc: 'Weekday slot' },
    { label: 'This Weekend', desc: 'Saturday / Sunday' },
    { label: 'Next Week', desc: 'Flexible weekday' },
  ];

  const TIME_SLOTS = [
    'Morning (10:00 AM – 11:30 AM)',
    'Afternoon (02:00 PM – 03:30 PM)',
    'Evening (06:00 PM – 07:30 PM)',
    'Night (08:00 PM – 09:00 PM)',
  ];

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsSubmitted(true);
      setStep(4);
    }
  };

  const getWhatsAppBookingUrl = () => {
    const text = `Hi Santhosh, I would like to schedule a ${consultType}.\n\nPreferred Time: ${selectedDate}, ${selectedSlot}\nName: ${formData.name}\nContact: ${formData.phone}${formData.email ? `\nEmail: ${formData.email}` : ''}${formData.notes ? `\nNote: ${formData.notes}` : ''}`;
    return `https://wa.me/918087971566?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="consultation-booking-wrapper" id="book-consultation">
      <div className="booking-card">
        {/* Step Indicator Header */}
        <div className="booking-header">
          <div className="steps-indicator">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`step-dot ${step === s ? 'active' : ''} ${step > s ? 'completed' : ''}`}
              >
                <span className="dot-number">{step > s ? '✓' : s}</span>
                <span className="dot-label">
                  {s === 1 ? 'Topic' : s === 2 ? 'Date & Time' : s === 3 ? 'Details' : 'Confirmed'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Choose Type */}
        {step === 1 && (
          <div className="step-pane">
            <div className="step-title-block">
              <span className="step-tag">Step 1 of 3</span>
              <h3 className="step-heading">What would you like to discuss?</h3>
              <p className="step-subheading">Select the focus area for your conversation with Santhosh.</p>
            </div>

            <div className="type-options-grid">
              {CONSULTATION_TYPES.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setConsultType(t.title)}
                  className={`type-option-card ${consultType === t.title ? 'selected' : ''}`}
                >
                  <span className="type-icon">{t.icon}</span>
                  <div className="type-info">
                    <h4 className="type-title">{t.title}</h4>
                    <p className="type-desc">{t.desc}</p>
                  </div>
                  <div className="selection-radio">
                    <div className="radio-circle"></div>
                  </div>
                </button>
              ))}
            </div>

            <div className="step-action-row">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn-next-step"
              >
                Continue to Select Time →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Choose Time */}
        {step === 2 && (
          <div className="step-pane">
            <div className="step-title-block">
              <span className="step-tag">Step 2 of 3</span>
              <h3 className="step-heading">Select Your Preferred Time Slot</h3>
              <p className="step-subheading">Choose when it is most convenient for you and your family.</p>
            </div>

            <div className="dates-selection-block">
              <label className="input-group-label">1. Preferred Day</label>
              <div className="dates-grid">
                {DATE_OPTIONS.map((d) => (
                  <button
                    type="button"
                    key={d.label}
                    onClick={() => setSelectedDate(d.label)}
                    className={`date-pill-btn ${selectedDate === d.label ? 'selected' : ''}`}
                  >
                    <span className="date-title">{d.label}</span>
                    <span className="date-sub">{d.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="slots-selection-block">
              <label className="input-group-label">2. Preferred Time Window</label>
              <div className="slots-grid">
                {TIME_SLOTS.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setSelectedSlot(s)}
                    className={`slot-pill-btn ${selectedSlot === s ? 'selected' : ''}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="step-action-row split">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-back-step"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn-next-step"
              >
                Continue to Basic Details →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Contact Details */}
        {step === 3 && (
          <form onSubmit={handleNext} className="step-pane">
            <div className="step-title-block">
              <span className="step-tag">Step 3 of 3</span>
              <h3 className="step-heading">Who is scheduling this conversation?</h3>
              <p className="step-subheading">Provide your basic contact information so Santhosh can confirm your session.</p>
            </div>

            <div className="form-fields-grid">
              <div className="form-field">
                <label htmlFor="name-input" className="form-field-label">Your Name *</label>
                <input
                  id="name-input"
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-text-input"
                />
              </div>

              <div className="form-field">
                <label htmlFor="phone-input" className="form-field-label">WhatsApp / Mobile Number *</label>
                <input
                  id="phone-input"
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="form-text-input"
                />
              </div>

              <div className="form-field full-width">
                <label htmlFor="email-input" className="form-field-label">Email Address (Optional)</label>
                <input
                  id="email-input"
                  type="email"
                  placeholder="e.g. ramesh@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-text-input"
                />
              </div>

              <div className="form-field full-width">
                <label htmlFor="notes-input" className="form-field-label">Any specific questions or goals? (Optional)</label>
                <textarea
                  id="notes-input"
                  rows={3}
                  placeholder="e.g. Want to calculate how much SIP is needed for my child's engineering college in 10 years..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="form-textarea-input"
                ></textarea>
              </div>
            </div>

            <div className="step-action-row split">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn-back-step"
              >
                ← Back
              </button>
              <button
                type="submit"
                className="btn-next-step"
              >
                Confirm Consultation Request ✓
              </button>
            </div>
          </form>
        )}

        {/* Step 4: Instant Confirmation */}
        {step === 4 && (
          <div className="step-pane text-center">
            <div className="success-icon-badge">🎉</div>
            <h3 className="success-heading">Consultation Request Received!</h3>
            <p className="success-message">
              Thank you, <strong>{formData.name || 'Friend'}</strong>. Santhosh has received your request and will reach out to confirm your session.
            </p>

            <div className="summary-box">
              <div className="summary-row">
                <span className="summary-label">Topic:</span>
                <span className="summary-val">{consultType}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Preferred Time:</span>
                <span className="summary-val">{selectedDate} ({selectedSlot})</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Contact:</span>
                <span className="summary-val">{formData.phone}</span>
              </div>
            </div>

            <div className="success-actions-row">
              <a
                href={getWhatsAppBookingUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp-confirm"
              >
                💬 Open in WhatsApp & Message Santhosh Directly
              </a>
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setStep(1);
                  setFormData({ name: '', phone: '', email: '', notes: '' });
                }}
                className="btn-reset-booking"
              >
                Schedule Another Discussion
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .consultation-booking-wrapper {
          max-width: 780px;
          margin: 0 auto;
        }

        .booking-card {
          background-color: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 18px;
          padding: 2.5rem;
          box-shadow: 0 10px 30px rgba(0, 24, 42, 0.05);
        }

        .booking-header {
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #F1F5F9;
        }

        .steps-indicator {
          display: flex;
          justify-content: space-between;
          position: relative;
        }

        .step-dot {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
          flex: 1;
        }

        .dot-number {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: #F1F5F9;
          color: #64748B;
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .dot-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #94A3B8;
        }

        .step-dot.active .dot-number {
          background-color: #00182A;
          color: #FFFFFF;
        }

        .step-dot.active .dot-label {
          color: #00182A;
          font-weight: 700;
        }

        .step-dot.completed .dot-number {
          background-color: #00AB96;
          color: #FFFFFF;
        }

        .step-dot.completed .dot-label {
          color: #00AB96;
        }

        .step-title-block {
          margin-bottom: 1.75rem;
        }

        .step-tag {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #00AB96;
          display: block;
          margin-bottom: 0.25rem;
        }

        .step-heading {
          font-family: 'Outfit', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #00182A;
          margin-bottom: 0.35rem;
        }

        .step-subheading {
          font-size: 0.9rem;
          color: #64748B;
        }

        /* Type Options */
        .type-options-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .type-option-card {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.25rem;
          border: 1.5px solid #E2E8F0;
          border-radius: 12px;
          background-color: #FFFFFF;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
          width: 100%;
        }

        .type-option-card:hover {
          border-color: #00AB96;
          background-color: #F8FAFC;
        }

        .type-option-card.selected {
          border-color: #00AB96;
          background-color: rgba(0, 171, 150, 0.04);
        }

        .type-icon {
          font-size: 2rem;
          flex-shrink: 0;
        }

        .type-info {
          flex: 1;
        }

        .type-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: #00182A;
          margin-bottom: 0.2rem;
        }

        .type-desc {
          font-size: 0.85rem;
          color: #64748B;
          line-height: 1.4;
        }

        .selection-radio {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid #CBD5E1;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .type-option-card.selected .selection-radio {
          border-color: #00AB96;
        }

        .type-option-card.selected .radio-circle {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #00AB96;
        }

        /* Step 2 Date and Slots */
        .dates-selection-block,
        .slots-selection-block {
          margin-bottom: 1.75rem;
        }

        .input-group-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: #00182A;
          display: block;
          margin-bottom: 0.75rem;
        }

        .dates-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
        }

        .date-pill-btn {
          padding: 0.85rem 0.75rem;
          border: 1.5px solid #E2E8F0;
          border-radius: 10px;
          background-color: #FFFFFF;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
          transition: all 0.2s ease;
        }

        .date-pill-btn:hover {
          border-color: #00AB96;
        }

        .date-pill-btn.selected {
          border-color: #00AB96;
          background-color: #00182A;
          color: #FFFFFF;
        }

        .date-pill-btn.selected .date-sub {
          color: #94A3B8;
        }

        .date-title {
          font-size: 0.9rem;
          font-weight: 700;
        }

        .date-sub {
          font-size: 0.75rem;
          color: #64748B;
        }

        .slots-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .slot-pill-btn {
          padding: 0.75rem 1rem;
          border: 1.5px solid #E2E8F0;
          border-radius: 8px;
          background-color: #FFFFFF;
          font-size: 0.85rem;
          font-weight: 600;
          color: #00182A;
          cursor: pointer;
          text-align: center;
          transition: all 0.2s ease;
        }

        .slot-pill-btn:hover {
          border-color: #00AB96;
        }

        .slot-pill-btn.selected {
          border-color: #00AB96;
          background-color: rgba(0, 171, 150, 0.1);
          color: #00AB96;
          font-weight: 700;
        }

        /* Form fields */
        .form-fields-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
          margin-bottom: 2rem;
        }

        .form-field.full-width {
          grid-column: 1 / -1;
        }

        .form-field-label {
          display: block;
          font-size: 0.825rem;
          font-weight: 700;
          color: #334155;
          margin-bottom: 0.4rem;
        }

        .form-text-input,
        .form-textarea-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1.5px solid #CBD5E1;
          border-radius: 8px;
          font-size: 0.95rem;
          font-family: inherit;
          color: #00182A;
          background-color: #FFFFFF;
          transition: border-color 0.2s ease;
        }

        .form-text-input:focus,
        .form-textarea-input:focus {
          outline: none;
          border-color: #00AB96;
          box-shadow: 0 0 0 3px rgba(0, 171, 150, 0.15);
        }

        /* Buttons */
        .step-action-row {
          display: flex;
          justify-content: flex-end;
          padding-top: 1.25rem;
          border-top: 1px solid #F1F5F9;
        }

        .step-action-row.split {
          justify-content: space-between;
        }

        .btn-next-step {
          background-color: #00AB96;
          color: #FFFFFF;
          font-size: 0.95rem;
          font-weight: 700;
          padding: 0.85rem 1.75rem;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-next-step:hover {
          background-color: #008f7d;
          transform: translateY(-2px);
        }

        .btn-back-step {
          background-color: transparent;
          color: #64748B;
          font-size: 0.95rem;
          font-weight: 600;
          padding: 0.85rem 1.25rem;
          border: 1.5px solid #CBD5E1;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-back-step:hover {
          background-color: #F1F5F9;
          color: #00182A;
        }

        /* Success Step */
        .success-icon-badge {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .success-heading {
          font-family: 'Outfit', sans-serif;
          font-size: 1.75rem;
          font-weight: 800;
          color: #00182A;
          margin-bottom: 0.5rem;
        }

        .success-message {
          font-size: 1rem;
          color: #475569;
          max-width: 540px;
          margin: 0 auto 2rem;
          line-height: 1.5;
        }

        .summary-box {
          background-color: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.5rem;
          max-width: 500px;
          margin: 0 auto 2rem;
          text-align: left;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 0.4rem 0;
          border-bottom: 1px solid #E2E8F0;
          font-size: 0.9rem;
        }

        .summary-row:last-child {
          border-bottom: none;
        }

        .summary-label {
          color: #64748B;
          font-weight: 600;
        }

        .summary-val {
          color: #00182A;
          font-weight: 700;
        }

        .success-actions-row {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-width: 440px;
          margin: 0 auto;
        }

        .btn-whatsapp-confirm {
          display: inline-block;
          background-color: #25D366;
          color: #FFFFFF;
          font-size: 0.95rem;
          font-weight: 700;
          padding: 0.9rem 1.5rem;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .btn-whatsapp-confirm:hover {
          background-color: #20BA5A;
          transform: translateY(-2px);
        }

        .btn-reset-booking {
          background-color: transparent;
          color: #64748B;
          font-size: 0.85rem;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
        }

        .btn-reset-booking:hover {
          color: #00182A;
          text-decoration: underline;
        }

        @media (max-width: 640px) {
          .booking-card {
            padding: 1.5rem;
          }
          .dates-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .slots-grid {
            grid-template-columns: 1fr;
          }
          .form-fields-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
