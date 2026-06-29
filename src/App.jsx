import React, { useState } from 'react';
import Landing from './pages/Landing';
import ManualQuiz from './pages/ManualQuiz';
import VoiceQuiz from './pages/VoiceQuiz';
import './index.css';

export default function App() {
  const [flow, setFlow] = useState('landing'); // 'landing' | 'manual' | 'voice'

  return (
    <>
      {flow === 'landing' && (
        <Landing
          onManual={() => setFlow('manual')}
          onVoice={() => setFlow('voice')}
        />
      )}
      {flow === 'manual' && (
        <ManualQuiz onBack={() => setFlow('landing')} />
      )}
      {flow === 'voice' && (
        <VoiceQuiz onBack={() => setFlow('landing')} />
      )}
    </>
  );
}
