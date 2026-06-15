import React from 'react';
import Cloud9Landing from './Cloud9Landing';
import Cloud9CreateForm from './Cloud9CreateForm';
import Cloud9EnvList from './Cloud9EnvList';

export default function Cloud9Console({ questState, onNavigate, view, setView, createdEnv, setCreatedEnv }) {
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
    return (
      <Cloud9EnvList
        env={createdEnv}
        questState={questState}
        onNavigate={onNavigate}
        onBack={() => setView('landing')}
      />
    );
  }

  return (
    <Cloud9Landing 
      onCreateClick={() => setView('create')} 
    />
  );
}
