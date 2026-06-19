import React from 'react';
import Cloud9Landing from './Cloud9Landing';
import Cloud9CreateForm from './Cloud9CreateForm';
import Cloud9EnvList from './Cloud9EnvList';
import Cloud9IDE from './Cloud9IDE';

const ENV_STEP_IDS = ['env_server', 'client_env', 'env_files'];

export default function Cloud9Console({ questState, onNavigate, view, setView, createdEnv, setCreatedEnv }) {
  const currentStepId = questState?.currentStep?.id ?? '';
  const isEnvStep = ENV_STEP_IDS.some(s => currentStepId.includes(s));

  const handleEnvCreated = (envInfo) => {
    setCreatedEnv(envInfo);
    setView('envlist');
  };

  if (view === 'create') {
    return (
      <Cloud9CreateForm
        questState={questState}
        onNavigate={onNavigate}
        onEnvCreated={handleEnvCreated}
        onBack={() => setView('landing')}
      />
    );
  }

  if (view === 'envlist') {
    // .env 편집 스텝이면 IDE 뷰 노출
    if (isEnvStep) {
      return (
        <Cloud9IDE
          questState={questState}
          onComplete={() => setView('envlist')}
        />
      );
    }
    return (
      <Cloud9EnvList
        env={createdEnv}
        questState={questState}
        onNavigate={onNavigate}
        onBack={() => setView('landing')}
      />
    );
  }

  // 랜딩: .env 스텝인데 환경이 이미 있으면 IDE로 바로 연결
  if (isEnvStep && createdEnv) {
    return (
      <Cloud9IDE
        questState={questState}
        onComplete={() => {}}
      />
    );
  }

  return (
    <Cloud9Landing
      onCreateClick={() => setView('create')}
      questState={questState}
    />
  );
}
