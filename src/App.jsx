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

const STEP_COSTS = {
  header:   0.001,
  cloud9:   0.10,
  terminal: 0.004,
  s3:       0.023,
  ec2:      0.52,
  rds:      1.75,
  lambda:   0.0002,
};

function getMood(completed, total) {
  if (total === 0) return 'worried';
  const r = completed / total;
  if (r >= 0.8) return 'ecstatic';
  if (r >= 0.5) return 'happy';
  if (r >= 0.2) return 'determined';
  return 'worried';
}

function App() {
  const [currentService, setCurrentService] = useState('home');
  const [selectedTutorialId, setSelectedTutorialId] = useState(1);
  const [completedTutorials, setCompletedTutorials] = useState([]);
  const [introTutorialId, setIntroTutorialId] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [toast, setToast] = useState(null);
  const prevCompletedLenRef = useRef(0);

  // Cloud9 state — App 레벨에서 유지해야 페이지 이동 후 돌아와도 리셋 안 됨
  const [cloud9View, setCloud9View] = useState('landing');
  const [cloud9Env, setCloud9Env] = useState(null);

  // S3 state — 동일한 이유
  const [s3View, setS3View] = useState('list');
  const [s3Buckets, setS3Buckets] = useState([]);
  const [s3ActiveBucket, setS3ActiveBucket] = useState(null);

  const questState = useQuestState(selectedTutorialId);

  // 스텝 완료 감지 → 토스트
  useEffect(() => {
    const newLen = questState.completedSteps.length;
    if (newLen > prevCompletedLenRef.current) {
      const stepId = questState.completedSteps[newLen - 1];
      const step = questState.steps.find(s => s.id === stepId);
      const cost = STEP_COSTS[step?.service] ?? 0.05;
      const mood = getMood(newLen, questState.steps.length);
      setToast({ step, cost, mood, stepNumber: newLen, key: Date.now() });
      prevCompletedLenRef.current = newLen;
      setTimeout(() => setToast(null), 3200);
    }
  }, [questState.completedSteps.length]);

  // 퀘스트 전부 완료 시 completedTutorials에 추가
  useEffect(() => {
    if (
      questState.isQuestComplete &&
      questState.totalSteps > 0 &&
      !completedTutorials.includes(selectedTutorialId)
    ) {
      setCompletedTutorials(prev => [...prev, selectedTutorialId]);
    }
  }, [questState.isQuestComplete, selectedTutorialId]);

  const handleShowIntro = (tutorialId) => {
    setIntroTutorialId(tutorialId);
  };

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

  const isHome = currentService === 'home' && introTutorialId === null; // 온보딩·홈 모두 사이드바 숨김
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
          />
        )}

        <main className="console-area" style={showOnboarding && isHome ? { background: '#16191f', padding: 0 } : {}}>
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
          {currentService === 'console-home' && (
            <ConsoleHome
              tutorial={currentTutorial}
              questState={questState}
              onNavigate={setCurrentService}
            />
          )}
          {currentService === 'cloud9' && (
            <Cloud9Console
              questState={questState}
              onNavigate={setCurrentService}
              view={cloud9View}
              setView={setCloud9View}
              createdEnv={cloud9Env}
              setCreatedEnv={setCloud9Env}
            />
          )}
          {currentService === 's3' && (
            <S3Console
              questState={questState}
              view={s3View}
              setView={setS3View}
              buckets={s3Buckets}
              setBuckets={setS3Buckets}
              activeBucket={s3ActiveBucket}
              setActiveBucket={setS3ActiveBucket}
            />
          )}
          {currentService === 'terminal' && (
            <VirtualTerminal questState={questState} onNavigate={setCurrentService} s3Buckets={s3Buckets} />
          )}
        </main>

      </div>
      {/* 스텝 완료 토스트 */}
      {toast && (
        <StepCompleteToast
          key={toast.key}
          step={toast.step}
          cost={toast.cost}
          mood={toast.mood}
          stepNumber={toast.stepNumber}
        />
      )}

      {/* 스테이지 클리어 모달 */}
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
