import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import MissionSidebar from './components/MissionSidebar';
import Cloud9Console from './components/Cloud9Console';
import S3Console from './components/S3Console';
import VirtualTerminal from './components/VirtualTerminal';
import TutorialHome from './components/TutorialHome';
import TutorialIntro from './components/TutorialIntro';
import CloudOnboarding from './components/CloudOnboarding';
import StepCompleteToast from './components/StepCompleteToast';
import StageClearModal from './components/StageClearModal';
import ConsoleHome from './components/ConsoleHome';
import { useQuestState, ALL_TUTORIALS } from './hooks/useQuestState';
import BankruptModal from './components/BankruptModal';
import MistakeToast from './components/MistakeToast';


function App() {
  const [currentService, setCurrentService] = useState('home');
  const [selectedTutorialId, setSelectedTutorialId] = useState(1);
  const [completedTutorials, setCompletedTutorials] = useState([]);
  const [introTutorialId, setIntroTutorialId] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [toast, setToast] = useState(null);
  const [mistakeToast, setMistakeToast] = useState(null);
  const prevCompletedLenRef = useRef(0);

  const [cloud9View, setCloud9View] = useState('landing');
  const [cloud9Env, setCloud9Env] = useState(null);
  const [s3View, setS3View] = useState('list');
  const [s3Buckets, setS3Buckets] = useState([]);
  const [s3ActiveBucket, setS3ActiveBucket] = useState(null);

  const questState = useQuestState(selectedTutorialId);

  useEffect(() => {
    const newLen = questState.completedSteps.length;
    if (newLen > prevCompletedLenRef.current) {
      const stepId = questState.completedSteps[newLen - 1];
      const step = questState.steps.find(s => s.id === stepId);
      setToast({ step, mood: questState.mood, stepNumber: newLen, key: Date.now() });
      prevCompletedLenRef.current = newLen;
      setTimeout(() => setToast(null), 3200);
    }
  }, [questState.completedSteps.length]);

  useEffect(() => {
    if (questState.lastEvent?.type === 'mistake') {
      setMistakeToast({ ...questState.lastEvent, key: Date.now() });
      setTimeout(() => setMistakeToast(null), 4000);
    }
  }, [questState.lastEvent]);

  useEffect(() => {
    if (questState.isQuestComplete && questState.totalSteps > 0 && !completedTutorials.includes(selectedTutorialId)) {
      setCompletedTutorials(prev => [...prev, selectedTutorialId]);
    }
  }, [questState.isQuestComplete, selectedTutorialId]);

  const handleShowIntro = (tutorialId) => setIntroTutorialId(tutorialId);

  const handleStartTutorial = (tutorialId) => {
    setIntroTutorialId(null);
    setSelectedTutorialId(tutorialId);
    setCurrentService('console-home');
    setCloud9View('landing');
    setCloud9Env(null);
    setS3View('list');
    setS3Buckets([]);
    setS3ActiveBucket(null);
  };

  const isHome = currentService === 'home' && introTutorialId === null;
  const isGameScreen = isHome || introTutorialId !== null;
  const currentTutorial = ALL_TUTORIALS.find(t => t.id === selectedTutorialId);
  const isComplete = questState.isQuestComplete && questState.totalSteps > 0 && !isHome;
  const nextTutorial = ALL_TUTORIALS.find(t => t.id === selectedTutorialId + 1);

  return (
    <div className="app-container">
      <Header
        currentService={currentService}
        onServiceSelect={setCurrentService}
        questState={questState}
      />

      <div className="main-content">
        {!isHome && (
          <MissionSidebar
            steps={questState.steps}
            currentStepIndex={questState.currentStepIndex}
            completedSteps={questState.completedSteps}
            credits={questState.credits}
            mood={questState.mood}
          />
        )}

        <main className="console-area" style={isGameScreen ? { padding: 0, position: 'relative', overflow: 'hidden' } : {}}>

          {/* 홈/인트로/미션 선택 — console-area 꽉 채움 */}
          {currentService === 'home' && introTutorialId === null && showOnboarding && (
            <CloudOnboarding onDone={() => setShowOnboarding(false)} />
          )}
          {currentService === 'home' && introTutorialId === null && !showOnboarding && (
            <TutorialHome
              completedTutorials={completedTutorials}
              onStart={handleShowIntro}
            />
          )}
          {introTutorialId !== null && (
            <TutorialIntro
              tutorialId={introTutorialId}
              onStart={() => handleStartTutorial(introTutorialId)}
              onBack={() => setIntroTutorialId(null)}
            />
          )}

          {/* 콘솔 화면 — 일반 스크롤 */}
          {currentService === 'console-home' && (
            <ConsoleHome tutorial={currentTutorial} questState={questState} onNavigate={setCurrentService} />
          )}
          {currentService === 'cloud9' && (
            <Cloud9Console
              questState={questState} onNavigate={setCurrentService}
              view={cloud9View} setView={setCloud9View}
              createdEnv={cloud9Env} setCreatedEnv={setCloud9Env}
            />
          )}
          {currentService === 's3' && (
            <S3Console
              questState={questState}
              view={s3View} setView={setS3View}
              buckets={s3Buckets} setBuckets={setS3Buckets}
              activeBucket={s3ActiveBucket} setActiveBucket={setS3ActiveBucket}
            />
          )}
          {currentService === 'terminal' && (
            <VirtualTerminal questState={questState} onNavigate={setCurrentService} s3Buckets={s3Buckets} />
          )}
        </main>
      </div>

      {mistakeToast && <MistakeToast key={mistakeToast.key} event={mistakeToast} />}
      {toast && <StepCompleteToast key={toast.key} step={toast.step} cost={toast.cost} mood={toast.mood} stepNumber={toast.stepNumber} />}

      {questState.credits <= 0 && !isHome && (
        <BankruptModal onRestart={() => { questState.reset(); setCurrentService('home'); setShowOnboarding(false); }} />
      )}

      {isComplete && (
        <StageClearModal
          tutorial={currentTutorial}
          steps={questState.steps}
          completedSteps={questState.completedSteps}
          nextTutorial={nextTutorial}
          onNext={() => { setCurrentService('home'); handleShowIntro(nextTutorial.id); }}
          onBack={() => { setCurrentService('home'); setShowOnboarding(false); }}
        />
      )}
    </div>
  );
}

export default App;
