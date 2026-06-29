import React, { useState } from 'react';
import ProgressBar from '../components/ProgressBar';
import OptionChip from '../components/OptionChip';
import CompletionScreen from '../components/CompletionScreen';
import BrandCard from '../components/BrandCard';
import { BRAND_OPTIONS, JEAN_SIZES, STEP_GROUPS, QUESTION_BY_KEY } from '../data/quizData';
import { convertWeight } from '../utils/fitProfile';

export default function ManualQuiz({ onBack }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({ weightUnit: 'lb' });
  const [weightUnit, setWeightUnit] = useState('lb');
  const [animating, setAnimating] = useState(false);
  const [done, setDone] = useState(false);

  const stepKeys = STEP_GROUPS[currentStep];
  const stepQuestions = stepKeys.map(key => QUESTION_BY_KEY[key]);

  const transitionToStep = (nextStep) => {
    if (nextStep >= STEP_GROUPS.length) {
      setDone(true);
      return;
    }
    setAnimating(true);
    setTimeout(() => {
      setCurrentStep(nextStep);
      setAnimating(false);
    }, 280);
  };

  const handleNext = () => {
    transitionToStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep === 0) {
      onBack();
      return;
    }
    transitionToStep(currentStep - 1);
  };

  const setAnswer = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const setBrands = (brands) => {
    setAnswers(prev => {
      const currentSizes = prev.brandSizes || {};
      const nextSizes = Object.fromEntries(
        Object.entries(currentSizes).filter(([brand]) => brands.includes(brand))
      );
      return { ...prev, brands, brandSizes: nextSizes };
    });
  };

  const handleWeightUnitChange = (nextUnit) => {
    setAnswers(prev => ({
      ...prev,
      weight: convertWeight(prev.weight, weightUnit, nextUnit),
      weightUnit: nextUnit,
    }));
    setWeightUnit(nextUnit);
  };

  const canProceed = () => {
    return stepQuestions.every(question => {
      if (!question.required) return true;
      const val = answers[question.key];
      if (question.type === 'number') return val !== undefined && val !== '';
      return !!val;
    });
  };

  if (done) {
    return <CompletionScreen answers={answers} />;
  }

  return (
    <div
      className="page"
      style={{ background: 'var(--bg)', minHeight: '100dvh', flexDirection: 'column' }}
    >
      <div
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <button
          className="btn-icon btn"
          onClick={handleBack}
          aria-label="Go back"
          style={{ flexShrink: 0 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <div style={{ flex: 1 }}>
          <ProgressBar current={currentStep + 1} total={STEP_GROUPS.length} />
        </div>
      </div>

      <div
        style={{
          flex: 1,
          padding: '30px 20px 120px',
          overflowY: 'auto',
        }}
      >
        <div
          key={currentStep}
          style={{
            animation: animating ? 'none' : 'slideIn 0.35s ease both',
            maxWidth: 520,
            margin: '0 auto',
          }}
        >
          <p className="label-sm" style={{ marginBottom: 12 }}>
            Step {currentStep + 1}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
            {currentStep === 0 && (
              <>
                <QuestionSection question={QUESTION_BY_KEY.height}>
                  <DropdownQuestion
                    question={QUESTION_BY_KEY.height}
                    value={answers.height || ''}
                    onChange={v => setAnswer('height', v)}
                  />
                </QuestionSection>

                <QuestionSection
                  question={QUESTION_BY_KEY.weight}
                  onSkip={() => setAnswer('weight', null)}
                >
                  <NumberQuestion
                    question={QUESTION_BY_KEY.weight}
                    unit={weightUnit}
                    value={answers.weight || ''}
                    onChange={v => setAnswer('weight', v)}
                    onUnitChange={handleWeightUnitChange}
                  />
                </QuestionSection>
              </>
            )}

            {currentStep === 1 && (
              <>
                <QuestionSection question={QUESTION_BY_KEY.waist}>
                  <DropdownQuestion
                    question={QUESTION_BY_KEY.waist}
                    value={answers.waist || ''}
                    onChange={v => setAnswer('waist', v)}
                  />
                </QuestionSection>

                <QuestionSection question={QUESTION_BY_KEY.hip}>
                  <DropdownQuestion
                    question={QUESTION_BY_KEY.hip}
                    value={answers.hip || ''}
                    onChange={v => setAnswer('hip', v)}
                  />
                </QuestionSection>
              </>
            )}

            {currentStep === 2 && (
              <>
                <QuestionSection question={QUESTION_BY_KEY.waistFit}>
                  <SingleSelectQuestion
                    question={QUESTION_BY_KEY.waistFit}
                    value={answers.waistFit || ''}
                    onChange={v => setAnswer('waistFit', v)}
                  />
                </QuestionSection>

                <QuestionSection question={QUESTION_BY_KEY.rise}>
                  <SingleSelectQuestion
                    question={QUESTION_BY_KEY.rise}
                    value={answers.rise || ''}
                    onChange={v => setAnswer('rise', v)}
                  />
                </QuestionSection>

                <QuestionSection question={QUESTION_BY_KEY.thighFit}>
                  <SingleSelectQuestion
                    question={QUESTION_BY_KEY.thighFit}
                    value={answers.thighFit || ''}
                    onChange={v => setAnswer('thighFit', v)}
                  />
                </QuestionSection>
              </>
            )}

            {currentStep === 3 && (
              <QuestionSection question={QUESTION_BY_KEY.brands}>
                <BrandSelectionQuestion
                  brands={answers.brands || []}
                  brandSizes={answers.brandSizes || {}}
                  onBrandsChange={setBrands}
                  onBrandSizesChange={v => setAnswer('brandSizes', v)}
                />
              </QuestionSection>
            )}

            {currentStep === 4 && (
              <QuestionSection question={QUESTION_BY_KEY.frustration}>
                <SingleSelectQuestion
                  question={QUESTION_BY_KEY.frustration}
                  value={answers.frustration || ''}
                  onChange={v => setAnswer('frustration', v)}
                />
              </QuestionSection>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px 20px 32px',
          background: 'linear-gradient(to top, var(--bg) 70%, transparent)',
          maxWidth: 520,
          margin: '0 auto',
        }}
      >
        <button
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1rem' }}
          onClick={handleNext}
          disabled={!canProceed()}
        >
          {currentStep === STEP_GROUPS.length - 1 ? 'See my fit' : 'Continue'}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function QuestionSection({ question, children, onSkip }) {
  return (
    <section>
      <div className="question-header">
        <h2 className="heading-md">
          {question.question}
        </h2>
        {onSkip && (
          <button className="question-skip" type="button" onClick={onSkip}>
            Skip
          </button>
        )}
      </div>
      {question.hint && (
        <p className="hint-text" style={{ marginBottom: 18 }}>
          {question.hint}
        </p>
      )}
      {children}
    </section>
  );
}

function DropdownQuestion({ question, value, onChange }) {
  return (
    <div className="select-wrapper">
      <select
        id={`q-${question.id}`}
        className="select-native"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        <option value="" disabled>Select {question.question.split('?')[0].toLowerCase()}...</option>
        {question.options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function NumberQuestion({ question, unit, value, onChange, onUnitChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="number-input-wrap">
        <input
          id={`q-${question.id}`}
          type="number"
          className="number-input"
          placeholder={`Enter your weight in ${unit}`}
          value={value}
          onChange={e => onChange(e.target.value)}
          min={unit === 'lb' ? '50' : '23'}
          max={unit === 'lb' ? '500' : '227'}
          inputMode="numeric"
        />
        <span className="number-unit">{unit}</span>
      </div>

      <div className="segmented-toggle weight-unit-toggle" aria-label="Weight unit">
        {['lb', 'kg'].map(option => (
          <button
            key={option}
            type="button"
            className={`segment${unit === option ? ' active' : ''}`}
            onClick={() => onUnitChange(option)}
            aria-pressed={unit === option}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function SizeChip({ size, selected, onClick }) {
  return (
    <button
      type="button"
      className={`size-chip${selected ? ' selected' : ''}`}
      onClick={onClick}
      aria-pressed={selected}
    >
      {size}
    </button>
  );
}

function BrandSizeSelector({ brand, brandSizes, onSizeChange }) {
  const option = BRAND_OPTIONS.find(item => item.name === brand);

  return (
    <div className="brand-size-panel">
      <div className="brand-size-panel-header">
        {option?.logo && (
          <span className="brand-size-panel-logo-wrap">
            <img
              className="brand-size-panel-logo"
              src={option.logo}
              alt=""
              aria-hidden="true"
            />
          </span>
        )}
        <div>
          <p className="brand-size-panel-name">{brand}</p>
          <p className="brand-size-panel-label">Size</p>
        </div>
      </div>

      <div className="size-chip-grid">
        {JEAN_SIZES.map(size => (
          <SizeChip
            key={size}
            size={size}
            selected={brandSizes[brand] === size}
            onClick={() => onSizeChange(brand, size)}
          />
        ))}
      </div>
    </div>
  );
}

function SingleSelectQuestion({ question, value, onChange }) {
  return (
    <div className="chip-grid">
      {question.options.map(opt => (
        <OptionChip
          key={opt}
          label={opt}
          active={value === opt}
          onClick={() => onChange(opt)}
        />
      ))}
    </div>
  );
}

function BrandSelectionQuestion({
  brands,
  brandSizes,
  onBrandsChange,
  onBrandSizesChange,
}) {
  const toggle = (brand) => {
    if (brands.includes(brand)) {
      onBrandsChange(brands.filter(v => v !== brand));
    } else {
      onBrandsChange([...brands, brand]);
    }
  };

  const updateSize = (brand, size) => {
    onBrandSizesChange({ ...brandSizes, [brand]: size });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="brand-card-grid">
        {BRAND_OPTIONS.map(brand => {
          const selected = brands.includes(brand.name);
          return (
            <BrandCard
              key={brand.name}
              name={brand.name}
              logo={brand.logo}
              selected={selected}
              onClick={() => toggle(brand.name)}
            />
          );
        })}
      </div>

      {brands.length > 0 && (
        <div className="brand-size-list animate-fade-in">
          {brands.map(brand => (
            <BrandSizeSelector
              key={brand}
              brand={brand}
              brandSizes={brandSizes}
              onSizeChange={updateSize}
            />
          ))}
        </div>
      )}

      {brands.length > 0 && (
        <p style={{ fontSize: '0.8rem', color: 'var(--fg-muted)', fontWeight: 500 }}>
          {brands.length} brand{brands.length !== 1 ? 's' : ''} selected
        </p>
      )}

    </div>
  );
}
