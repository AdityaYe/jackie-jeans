import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import VoiceOrb from '../components/VoiceOrb';
import CompletionScreen from '../components/CompletionScreen';
import { QUIZ_QUESTIONS, QUIZ_STEPS, QUESTION_BY_KEY, BRANDS, JEAN_SIZES } from '../data/quizData';
import { formatAnswerValue } from '../utils/fitProfile';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const hasSpeechRecognition = !!SpeechRecognition;
const hasSpeechSynthesis = !!window.speechSynthesis;
const STEPS = QUIZ_STEPS;

const NUMBER_WORDS = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15,
  sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
  twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60,
  seventy: 70, eighty: 80, ninety: 90, hundred: 100,
};

const HEIGHT_WORD_MAP = {
  'four ten': '4\'10"', 'four eleven': '4\'11"',
  'five zero': '5\'0"', 'five oh': '5\'0"', 'five foot': '5\'0"', 'five feet': '5\'0"',
  'five one': '5\'1"', 'five two': '5\'2"', 'five three': '5\'3"',
  'five four': '5\'4"', 'five five': '5\'5"', 'five six': '5\'6"',
  'five seven': '5\'7"', 'five eight': '5\'8"', 'five nine': '5\'9"',
  'five ten': '5\'10"', 'five eleven': '5\'11"',
  'six zero': '6\'0"', 'six oh': '6\'0"', 'six foot': '6\'0"', 'six feet': '6\'0"',
  'six one': '6\'1"', 'six two': '6\'2"',
};

const SKIP_RE = /skip|pass|rather not|prefer not|no thanks|don.?t want|none|not share/i;

function speak(text, onEnd) {
  if (!hasSpeechSynthesis) {
    onEnd?.();
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1.04;
  utterance.volume = 1;

  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v =>
    /samantha|karen|moira|zira|google us english|microsoft zira|allison/i.test(v.name)
  ) || voices.find(v => v.lang === 'en-US') || voices[0];
  if (preferred) utterance.voice = preferred;

  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();
  window.speechSynthesis.speak(utterance);
}

function normalizeText(raw) {
  return raw.toLowerCase().replace(/[.,!?]/g, ' ').replace(/\s+/g, ' ').trim();
}

function parseWordNumber(raw) {
  const lower = normalizeText(raw).replace(/-/g, ' ');
  const direct = lower.match(/\b\d{1,3}\b/);
  if (direct) return Number(direct[0]);

  const tokens = lower.split(' ');
  let total = 0;
  let found = false;

  for (const token of tokens) {
    if (token === 'and' || token === 'about' || token === 'around' || token === 'maybe') continue;
    const value = NUMBER_WORDS[token];
    if (value === undefined) continue;
    found = true;
    if (value === 100) {
      total = Math.max(total, 1) * 100;
    } else {
      total += value;
    }
  }

  return found ? total : null;
}

function parseHeight(raw) {
  const lower = normalizeText(raw);

  for (const [phrase, value] of Object.entries(HEIGHT_WORD_MAP)) {
    if (lower.includes(phrase)) return value;
  }

  const numeric = lower.match(/\b([4-6])\s*(?:'|ft|foot|feet)?\s*[- ]\s*(\d{1,2})\b/);
  if (numeric) return `${numeric[1]}'${Number(numeric[2])}"`;

  const footMatch = lower.match(/\b(four|five|six|[4-6])\s*(?:foot|feet|ft|')\s*(zero|oh|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|\d{1,2})?\b/);
  if (footMatch) {
    const feet = NUMBER_WORDS[footMatch[1]] ?? Number(footMatch[1]);
    const inches = footMatch[2] ? (footMatch[2] === 'oh' ? 0 : NUMBER_WORDS[footMatch[2]] ?? Number(footMatch[2])) : 0;
    if (feet >= 4 && feet <= 6 && inches >= 0 && inches <= 11) return `${feet}'${inches}"`;
  }

  return null;
}

function parseMeasurement(raw, min, max) {
  const value = parseWordNumber(raw);
  if (value && value >= min && value <= max) return `${value}"`;
  return null;
}

function parseWeight(raw) {
  if (SKIP_RE.test(raw)) return { skipped: true };
  const value = parseWordNumber(raw);
  if (!value) return null;

  const lower = normalizeText(raw);
  if (/\bkg|kilo|kilos|kilogram|kilograms\b/.test(lower) && value >= 23 && value <= 227) {
    return { value: String(Math.round(value * 2.20462)), unit: 'lb', spoken: `${value} kg` };
  }

  if (value > 50 && value < 500) return { value: String(value), unit: 'lb', spoken: `${value} lbs` };
  return null;
}

function parseSingleSelect(raw, options) {
  const lower = normalizeText(raw);

  for (const option of options) {
    if (lower.includes(option.toLowerCase())) return option;
  }

  const aliases = {
    tight: 'Snug',
    close: 'Snug',
    fitted: 'Fitted',
    slim: 'Fitted',
    easy: 'Relaxed',
    comfort: 'Relaxed',
    relaxed: 'Relaxed',
    loose: 'Loose',
    baggy: 'Loose',
    high: 'High rise',
    mid: 'Mid rise',
    medium: 'Mid rise',
    low: 'Low rise',
    gap: 'Waist gap at the back',
    gapping: 'Waist gap at the back',
    waist: 'Waist gap at the back',
    hip: 'Hip tightness',
    length: 'Wrong length',
    long: 'Wrong length',
    short: 'Wrong length',
    thigh: 'Thigh fit',
    rise: "Rise doesn't work",
    other: 'Other',
  };

  for (const [alias, value] of Object.entries(aliases)) {
    if (lower.includes(alias) && options.includes(value)) return value;
  }

  return null;
}

function parseBrands(raw) {
  const lower = normalizeText(raw).replace(/&/g, 'and');
  const found = [];

  for (const brand of BRANDS) {
    const normalized = normalizeText(brand).replace(/&/g, 'and');
    const shortName = normalized.split(' ')[0];
    if (lower.includes(normalized) || (shortName.length > 2 && lower.includes(shortName))) {
      found.push(brand);
    }
  }

  return found.length ? found : null;
}

function parseSize(raw) {
  const lower = normalizeText(raw);
  const numeric = lower.match(/\b([0-9]{1,2})\b/);
  if (numeric && JEAN_SIZES.includes(numeric[1])) return numeric[1];

  const letter = lower.match(/\b(xxs|xs|s|m|l|xl|xxl)\b/i);
  if (letter) return letter[1].toUpperCase();

  const wordNumber = parseWordNumber(raw);
  if (wordNumber !== null && JEAN_SIZES.includes(String(wordNumber))) return String(wordNumber);

  return null;
}

function getNextStepKey(key, answers, submittedValue) {
  const curIdx = STEPS.indexOf(key);
  let nextKey = STEPS[curIdx + 1] || null;

  if (nextKey === 'brandSizes') {
    const brands = key === 'brands' ? submittedValue : answers.brands;
    if (!brands?.length) nextKey = STEPS[curIdx + 2] || null;
  }

  return nextKey;
}

export default function VoiceQuiz({ onBack }) {
  const [orbState, setOrbState] = useState('idle');
  const [stepKey, setStepKey] = useState(STEPS[0]);
  const [answers, setAnswers] = useState({ weightUnit: 'lb' });
  const [typedInput, setTypedInput] = useState('');
  const [transcript, setTranscript] = useState('');
  const [caption, setCaption] = useState('');
  const [statusMsg, setStatusMsg] = useState('Ready when you are');
  const [errorMsg, setErrorMsg] = useState('');
  const [done, setDone] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReturnKey, setEditingReturnKey] = useState(null);
  const [brandSizeIndex, setBrandSizeIndex] = useState(0);
  const [speechUnavailable, setSpeechUnavailable] = useState(!hasSpeechRecognition);

  const recognizerRef = useRef(null);
  const finalTranscriptRef = useRef('');
  const answersRef = useRef(answers);
  const stepKeyRef = useRef(stepKey);
  const submitRef = useRef(null);
  const startListeningRef = useRef(null);
  const listenTimerRef = useRef(null);

  answersRef.current = answers;
  stepKeyRef.current = stepKey;

  const currentQuestion = QUESTION_BY_KEY[stepKey];
  const stepIndex = Math.max(STEPS.indexOf(stepKey), 0);
  const brands = answers.brands || [];
  const activeBrand = stepKey === 'brandSizes' ? brands[brandSizeIndex] : null;
  const answeredQuestions = QUIZ_QUESTIONS.filter(q => {
    if (q.key === 'weightUnit') return false;
    if (q.key === 'brandSizes') return answers.brands?.length || Object.keys(answers.brandSizes || {}).length;
    return Object.prototype.hasOwnProperty.call(answers, q.key);
  });

  const PLACEHOLDERS = {
    height:     "Recommended: 5'6\"",
    weight:     'Recommended: 140 lbs',
    waist:      'Recommended: 30"',
    hip:        'Recommended: 38"',
    fit:        'Recommended: Relaxed',
    rise:       'Recommended: Mid rise',
    fitIssue:   'Recommended: Waist gap at the back',
    brands:     "Recommended: Levi's, Wrangler",
    brandSizes: activeBrand ? `Recommended: 32 or M` : 'Recommended: 32 or M',
  };

  const displayQuestion = useMemo(() => {
    if (stepKey === 'brandSizes' && activeBrand) return `What size did you buy in ${activeBrand}?`;
    return currentQuestion?.question || '';
  }, [activeBrand, currentQuestion, stepKey]);

  const stopRecognition = useCallback(() => {
    if (listenTimerRef.current) {
      window.clearTimeout(listenTimerRef.current);
      listenTimerRef.current = null;
    }

    const recognizer = recognizerRef.current;
    if (!recognizer) return;
    recognizer.onend = null;
    recognizer.onerror = null;
    recognizer.onresult = null;
    try {
      recognizer.abort();
    } catch {
      // Some browsers throw if recognition is already inactive.
    }
    recognizerRef.current = null;
  }, []);

  const scheduleListening = useCallback((delay = 380) => {
    if (speechUnavailable || !hasSpeechRecognition) {
      setOrbState('idle');
      setStatusMsg('Ready for your typed answer');
      return;
    }

    if (listenTimerRef.current) window.clearTimeout(listenTimerRef.current);
    setOrbState('idle');
    setStatusMsg('Ready for your answer');
    listenTimerRef.current = window.setTimeout(() => {
      listenTimerRef.current = null;
      startListeningRef.current?.();
    }, delay);
  }, [speechUnavailable]);

  const saveAnswer = useCallback((updates) => {
    setAnswers(prev => {
      const next = { ...prev, ...updates };
      answersRef.current = next;
      return next;
    });
  }, []);

  const validateAnswer = useCallback((raw, key = stepKeyRef.current) => {
    const q = QUESTION_BY_KEY[key];
    if (!q) return { ok: false, message: 'I need one more answer before we continue.' };

    if (key === 'brandSizes') {
      const brand = (answersRef.current.brands || [])[brandSizeIndex];
      const size = parseSize(raw);
      if (!brand) return { ok: true, updates: { brandSizes: answersRef.current.brandSizes || {} }, spoken: 'all brand sizes' };
      if (!size) return { ok: false, message: `Tell me the size you usually buy in ${brand}.` };
      return {
        ok: true,
        updates: { brandSizes: { ...(answersRef.current.brandSizes || {}), [brand]: size } },
        value: size,
        spoken: `${brand}, size ${size}`,
      };
    }

    if (q.type === 'dropdown') {
      const parsed = key === 'height'
        ? parseHeight(raw)
        : key === 'waist'
          ? parseMeasurement(raw, 24, 52)
          : parseMeasurement(raw, 32, 60);

      return parsed
        ? { ok: true, updates: { [key]: parsed }, value: parsed, spoken: parsed }
        : { ok: false, message: key === 'height' ? 'Try a height like five foot six.' : 'Try a measurement in inches, like thirty.' };
    }

    if (q.type === 'number') {
      const parsed = parseWeight(raw);
      if (parsed?.skipped && q.skippable) {
        return { ok: true, updates: { [key]: null, weightUnit: 'lb' }, value: null, spoken: 'skipped' };
      }
      return parsed
        ? { ok: true, updates: { [key]: parsed.value, weightUnit: parsed.unit }, value: parsed.value, spoken: parsed.spoken }
        : { ok: false, message: 'Try a weight like 140 pounds, seventy kilos, or say skip.' };
    }

    if (q.type === 'single-select') {
      const parsed = parseSingleSelect(raw, q.options);
      return parsed
        ? { ok: true, updates: { [key]: parsed }, value: parsed, spoken: parsed }
        : { ok: false, message: `Choose one of: ${q.options.join(', ')}.` };
    }

    if (q.type === 'multi-select') {
      const isDone = /done|that.?s it|that.?s all|finish|finished|no more|those are/i.test(raw);
      if (SKIP_RE.test(raw)) {
        return { ok: true, updates: { brands: [], brandSizes: {} }, value: [], spoken: 'no previous brands' };
      }

      const found = parseBrands(raw);
      const currentBrands = answersRef.current.brands || [];
      const merged = found ? [...new Set([...currentBrands, ...found])] : currentBrands;

      if (found?.length || (isDone && merged.length)) {
        return {
          ok: true,
          updates: { brands: merged },
          value: merged,
          spoken: merged.length ? merged.join(', ') : 'no previous brands',
          needsMoreBrands: found?.length && !isDone && merged.length < 5,
        };
      }

      if (isDone) {
        return { ok: true, updates: { brands: [], brandSizes: {} }, value: [], spoken: 'no previous brands' };
      }

      return { ok: false, message: 'Name a brand like Levi\'s or Wrangler, or say skip.' };
    }

    return { ok: true, updates: { [key]: raw }, value: raw, spoken: raw };
  }, [brandSizeIndex]);

  const askQuestion = useCallback((key = stepKeyRef.current, customPrompt = null) => {
    const q = QUESTION_BY_KEY[key];
    if (!q) return;

    stopRecognition();
    setTypedInput('');
    setTranscript('');
    setErrorMsg('');

    const brand = key === 'brandSizes' ? (answersRef.current.brands || [])[brandSizeIndex] : null;
    const prompt = customPrompt || (brand ? `What size do you usually buy in ${brand}?` : q.voicePrompt);

    setCaption(prompt);
    setOrbState('speaking');
    setStatusMsg('Speaking...');
    speak(prompt, () => {
      scheduleListening();
    });
  }, [brandSizeIndex, scheduleListening, stopRecognition]);

  const moveAfterSave = useCallback((key, value) => {
    if (editingReturnKey) {
      setEditingReturnKey(null);
      setStepKey(editingReturnKey);
      setTimeout(() => askQuestion(editingReturnKey, 'Updated. Let\'s pick up where we left off.'), 250);
      return;
    }

    if (key === 'brandSizes') {
      const nextBrandIndex = brandSizeIndex + 1;
      if (nextBrandIndex < (answersRef.current.brands || []).length) {
        setBrandSizeIndex(nextBrandIndex);
        setTimeout(() => askQuestion('brandSizes'), 250);
        return;
      }
    }

    const nextKey = getNextStepKey(key, answersRef.current, value);
    if (!nextKey) {
      setDone(true);
      return;
    }

    setStepKey(nextKey);
    if (nextKey === 'brandSizes') setBrandSizeIndex(0);
    setTimeout(() => askQuestion(nextKey), 250);
  }, [askQuestion, brandSizeIndex, editingReturnKey]);

  const submitAnswer = useCallback((raw, source = 'typed') => {
    const cleaned = raw.trim();
    if (!cleaned) {
      setErrorMsg('Add an answer first.');
      return false;
    }

    stopRecognition();
    setOrbState('processing');
    setStatusMsg('Processing...');
    setTranscript(cleaned);

    const key = stepKeyRef.current;
    const result = validateAnswer(cleaned, key);
    if (!result.ok) {
      setOrbState('idle');
      setStatusMsg(speechUnavailable ? 'Ready for your typed answer' : 'Ready for your answer');
      setErrorMsg(result.message);
      if (source === 'voice') scheduleListening(700);
      return false;
    }

    saveAnswer(result.updates);
    setTypedInput('');
    setErrorMsg('');

    if (result.needsMoreBrands) {
      const confirm = `Got ${result.spoken}. Any others? Say done when finished.`;
      setCaption(confirm);
      setOrbState('speaking');
      setStatusMsg('Speaking...');
      speak(confirm, () => {
        scheduleListening();
      });
      return true;
    }

    const confirm = result.spoken === 'skipped' ? 'No problem, we will skip that.' : `Got it: ${result.spoken}.`;
    setCaption(confirm);
    setOrbState('speaking');
    setStatusMsg('Speaking...');
    speak(confirm, () => moveAfterSave(key, result.value));
    return true;
  }, [moveAfterSave, saveAnswer, scheduleListening, speechUnavailable, stopRecognition, validateAnswer]);

  submitRef.current = submitAnswer;

  const startListening = useCallback(() => {
    if (speechUnavailable || !hasSpeechRecognition) {
      setStatusMsg('Voice is unavailable. Type your answer below.');
      return;
    }

    stopRecognition();
    finalTranscriptRef.current = '';
    setTranscript('');
    setErrorMsg('');
    setOrbState('listening');
    setStatusMsg('Listening...');

    const recognizer = new SpeechRecognition();
    recognizer.lang = 'en-US';
    recognizer.interimResults = true;
    recognizer.continuous = false;
    recognizer.maxAlternatives = 3;
    recognizerRef.current = recognizer;

    recognizer.onresult = (event) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const phrase = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += phrase;
        else interim += phrase;
      }
      if (final.trim()) finalTranscriptRef.current = `${finalTranscriptRef.current} ${final}`.trim();
      setTranscript((finalTranscriptRef.current || interim).trim());
    };

    recognizer.onend = () => {
      recognizerRef.current = null;
      const final = finalTranscriptRef.current.trim();
      if (final) {
        submitRef.current?.(final, 'voice');
      } else {
        setOrbState('idle');
        setStatusMsg('I did not catch that. Listening again...');
        if (!speechUnavailable) {
          listenTimerRef.current = window.setTimeout(() => {
            listenTimerRef.current = null;
            startListeningRef.current?.();
          }, 500);
        }
      }
    };

    recognizer.onerror = (event) => {
      recognizerRef.current = null;
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setSpeechUnavailable(true);
        setErrorMsg('Microphone access is not available. You can type instead.');
      } else if (event.error !== 'aborted') {
        setErrorMsg('I did not catch that. Try speaking again or type your answer.');
      }
      setOrbState('idle');
      setStatusMsg('Ready for your answer');
    };

    try {
      recognizer.start();
    } catch {
      setOrbState('idle');
      setStatusMsg('Ready for your answer');
    }
  }, [speechUnavailable, stopRecognition]);

  startListeningRef.current = startListening;

  const handleNext = useCallback(() => {
    const key = stepKeyRef.current;
    const currentValue = key === 'brandSizes'
      ? answersRef.current.brandSizes?.[(answersRef.current.brands || [])[brandSizeIndex]]
      : answersRef.current[key];

    const candidate = typedInput.trim() || formatAnswerValue(key, currentValue);
    submitAnswer(candidate, 'next');
  }, [brandSizeIndex, submitAnswer, typedInput]);

  const startQuiz = () => {
    setIsStarted(true);
    const intro = 'Hi, I am your Jackie Jeans fit stylist. I will guide you through a few quick questions so we can understand what feels best on you.';
    setCaption(intro);
    setOrbState('speaking');
    setStatusMsg('Speaking...');
    window.speechSynthesis?.getVoices();
    setTimeout(() => speak(intro, () => askQuestion(STEPS[0])), 180);
  };

  const handleEdit = (key) => {
    stopRecognition();
    setIsModalOpen(false);
    setEditingReturnKey(stepKeyRef.current);
    setStepKey(key);
    setErrorMsg('');
    setTypedInput('');

    if (key === 'brandSizes') {
      const firstMissing = (answersRef.current.brands || []).findIndex(brand => !answersRef.current.brandSizes?.[brand]);
      setBrandSizeIndex(Math.max(firstMissing, 0));
    }

    setTimeout(() => askQuestion(key, `Let's update ${QUESTION_BY_KEY[key].question.toLowerCase()}`), 220);
  };

  useEffect(() => () => {
    stopRecognition();
    window.speechSynthesis?.cancel();
  }, [stopRecognition]);

  const progressPct = Math.round(((stepIndex + 1) / QUIZ_QUESTIONS.length) * 100);
  const currentAnswer = stepKey === 'brandSizes'
    ? answers.brandSizes?.[activeBrand]
    : answers[stepKey];

  if (done) return <CompletionScreen answers={answers} />;

  return (
    <div className="page voice-page">
      <header className="voice-header">
        <button
          className="btn btn-icon"
          onClick={() => {
            stopRecognition();
            window.speechSynthesis?.cancel();
            onBack();
          }}
          aria-label="Go back"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span className="label-sm">Fit Stylist</span>
            <span className="voice-count">{stepIndex + 1} / {QUIZ_QUESTIONS.length}</span>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </header>

      {!isStarted ? (
        <main className="voice-start animate-fade-in-up">
          <VoiceOrb state="idle" size={132} />
          <p className="label-sm" style={{ marginTop: 34, marginBottom: 12 }}>AI Voice Assistant</p>
          <h1 className="heading-md" style={{ marginBottom: 12 }}>A calmer way to find your fit.</h1>
          <p className="body-sm" style={{ maxWidth: 320, marginBottom: 28 }}>
            Speak naturally, type whenever you prefer, and review your answers before we build your fit profile.
          </p>
          {!hasSpeechRecognition && (
            <p className="voice-note">Voice input is not available in this browser, so typing is ready from the start.</p>
          )}
          <button className="btn btn-primary voice-full-button" onClick={startQuiz}>
            Start voice quiz
          </button>
        </main>
      ) : (
        <main className="voice-session">
          <section className="voice-question-block">
            <p className="label-sm">Jackie Jeans</p>
            <h1>{displayQuestion}</h1>
            {currentQuestion?.hint && <p>{currentQuestion.hint}</p>}
          </section>

          <section className="voice-orb-block">
            <VoiceOrb state={orbState} size={142} />
            <div className="voice-status">
              <span className={`voice-status-dot ${orbState}`} />
              {statusMsg}
            </div>
          </section>

          <section className="voice-card">
            <div className="voice-caption">
              <span>Fit Stylist</span>
              <p>{caption || 'Ready for your answer.'}</p>
            </div>
            {(transcript || currentAnswer !== undefined) && (
              <div className="voice-transcript">
                <span>You</span>
                <p>{transcript || formatAnswerValue(stepKey, currentAnswer)}</p>
              </div>
            )}
          </section>

          <form
            className="voice-input-row"
            onSubmit={(event) => {
              event.preventDefault();
              submitAnswer(typedInput, 'typed');
            }}
          >
            <input
              className="number-input"
              value={typedInput}
              onChange={event => {
                setTypedInput(event.target.value);
                setErrorMsg('');
              }}
              placeholder={PLACEHOLDERS[stepKey] ?? 'Recommended: type your answer'}
              inputMode={stepKey === 'weight' || stepKey === 'waist' || stepKey === 'hip' || stepKey === 'brandSizes' ? 'numeric' : 'text'}
            />
          </form>

          {errorMsg && <p className="voice-error">{errorMsg}</p>}

          <nav className="voice-bottom-actions" aria-label="Voice quiz actions">
            <button className="btn btn-ghost" type="button" onClick={() => setIsModalOpen(true)}>
              My Answers
            </button>
            <button className="btn btn-primary" type="button" onClick={handleNext}>
              Next
            </button>
          </nav>
        </main>
      )}

      {isModalOpen && (
        <AnswersSheet
          answers={answers}
          answeredQuestions={answeredQuestions}
          onClose={() => setIsModalOpen(false)}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}

function AnswersSheet({ answers, answeredQuestions, onClose, onEdit }) {
  return (
    <div className="answers-backdrop" onClick={onClose}>
      <section className="answers-sheet animate-sheet-up" onClick={event => event.stopPropagation()} aria-modal="true" role="dialog">
        <div className="answers-handle" />
        <div className="answers-heading">
          <div>
            <p className="label-sm">My Answers</p>
            <h2>Your fit profile so far</h2>
          </div>
          <button className="btn btn-icon" type="button" onClick={onClose} aria-label="Close answers">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="answers-list">
          {answeredQuestions.length === 0 ? (
            <p className="body-sm">Your answers will appear here as you move through the assistant.</p>
          ) : answeredQuestions.map(question => (
            <article className="answer-row" key={question.key}>
              <div>
                <span>{question.question.replace('?', '')}</span>
                <strong>{formatAnswerValue(question.key, answers[question.key])}</strong>
              </div>
              <button className="answer-edit" type="button" onClick={() => onEdit(question.key)}>
                Edit
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}