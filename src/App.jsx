import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import MissionSidebar from './components/MissionSidebar';
import Cloud9Console from './components/Cloud9Console';
import S3Console from './components/S3Console';
import RDSConsole from './components/RDSConsole';
import EC2Console from './components/EC2Console';
import LambdaConsole from './components/LambdaConsole';
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

// 게임 화면 — 1600×900 기준으로 디자인하고 창 크기에 맞춰 통째로 scale
function GameScreen({ children }) {
  const wrapRef = useRef(null);
  const [scale, setScale] = useState(1);

  const BASE_W = 1600;
  const BASE_H = 900;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const { width, height } = el.getBoundingClientRect();
      const s = Math.min(width / BASE_W, height / BASE_H);
      setScale(s);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapRef} style={{
      position: 'relative',
      width: '100%', height: '100%',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        width: BASE_W, height: BASE_H,
        transform: `translate(-50%, -50%) scale(${scale})`,
        transformOrigin: 'center center',
      }}>
        {children}
      </div>
    </div>
  );
}

function App() {
  const [currentService, setCurrentService] = useState('home');
  const [selectedTutorialId, setSelectedTutorialId] = useState(1);
  const [completedTutorials, setCompletedTutorials] = useState([]);
  const [introTutorialId, setIntroTutorialId] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [toast, setToast] = useState(null);
  const [mistakeToast, setMistakeToast] = useState(null);
  const prevCompletedLenRef = useRef(0);

  const [selectedRegion, setSelectedRegion] = useState('us-east-1');

  const [cloud9View, setCloud9View] = useState('landing');
  const [cloud9Env, setCloud9Env] = useState(null);
  const [s3View, setS3View] = useState('list');
  const [s3Buckets, setS3Buckets] = useState([]);
  const [s3ActiveBucket, setS3ActiveBucket] = useState(null);

  const questState = useQuestState(selectedTutorialId);

  // 🐛 디버그 단축키 (개발용 — 배포 시 이 useEffect 블록만 삭제)
  useEffect(() => {
    const handler = (e) => {
      if (!e.shiftKey) return;
      if (currentService === 'home' || introTutorialId !== null) return;
      if (e.key === 'S' || e.key === 's') {
        const next = questState.steps.find(s => !questState.completedSteps.includes(s.id));
        if (next) questState.completeStep(next.id);
      } else if (e.key === 'C' || e.key === 'c') {
        questState.debugClearAll();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentService, introTutorialId, questState]);

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
    setSelectedRegion('us-east-1');
    setCloud9View('landing');
    setCloud9Env(null);
    setS3View('list');
    setS3Buckets([]);
    setS3ActiveBucket(null);
  };

  const isHome = currentService === 'home' && introTutorialId === null;
  const isGameScreen = isHome || introTutorialId !== null;
  const currentTutorial = ALL_TUTORIALS.find(t => t.id === selectedTutorialId);
  const isComplete = questState.isQuestComplete && questState.totalSteps > 0 && !isHome && introTutorialId === null;
  const nextTutorial = ALL_TUTORIALS.find(t => t.id === selectedTutorialId + 1);

  return (
    <div className="app-container">
      <Header
        currentService={currentService}
        onServiceSelect={setCurrentService}
        questState={questState}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        locked={introTutorialId !== null || isHome}
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

        <main className={`console-area${isGameScreen ? ' game-mode' : ''}`}>

          {/* 홈/인트로/미션 선택 — scale 고정 */}
          {isGameScreen && (
            <GameScreen>
              {currentService === 'home' && introTutorialId === null && showOnboarding && (
                <CloudOnboarding onDone={() => {
                  setShowOnboarding(false);
                  setCompletedTutorials([]);
                  setSelectedTutorialId(1);
                }} />
              )}
              {currentService === 'home' && introTutorialId === null && !showOnboarding && (
                <TutorialHome
                  completedTutorials={completedTutorials}
                  onStart={handleShowIntro}
                  onHome={() => setShowOnboarding(true)}
                />
              )}
              {introTutorialId !== null && (
                <TutorialIntro
                  tutorialId={introTutorialId}
                  onStart={() => handleStartTutorial(introTutorialId)}
                  onBack={() => setIntroTutorialId(null)}
                />
              )}
            </GameScreen>
          )}

          {/* 콘솔 화면 — 인트로 모달이 열려있는 동안은 렌더링 차단 */}
          {introTutorialId === null && currentService === 'console-home' && (
            <ConsoleHome tutorial={currentTutorial} questState={questState} onNavigate={setCurrentService} />
          )}
          {introTutorialId === null && currentService === 'cloud9' && (
            <Cloud9Console
              questState={questState} onNavigate={setCurrentService}
              view={cloud9View} setView={setCloud9View}
              createdEnv={cloud9Env} setCreatedEnv={setCloud9Env}
            />
          )}
          {introTutorialId === null && currentService === 's3' && (
            <S3Console
              questState={questState}
              view={s3View} setView={setS3View}
              buckets={s3Buckets} setBuckets={setS3Buckets}
              activeBucket={s3ActiveBucket} setActiveBucket={setS3ActiveBucket}
            />
          )}
          {introTutorialId === null && currentService === 'rds' && (
            <RDSConsole questState={questState} onNavigate={setCurrentService} />
          )}
          {introTutorialId === null && currentService === 'ec2' && (
            <EC2Console questState={questState} onNavigate={setCurrentService} />
          )}
          {introTutorialId === null && currentService === 'lambda' && (
            <LambdaConsole questState={questState} />
          )}
          {introTutorialId === null && currentService === 'terminal' && (
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
          credits={questState.credits}
          nextTutorial={nextTutorial}
          onNext={() => { setSelectedTutorialId(nextTutorial.id); setCurrentService('home'); handleShowIntro(nextTutorial.id); }}
          onBack={() => { setCurrentService('home'); setShowOnboarding(false); }}
        />
      )}
    </div>
  );
}

export default App;
