import React from 'react';
import { Play, ChevronRight } from 'lucide-react';

export default function Cloud9EnvList({ env, questState, onNavigate, onBack }) {
  const isOpenStep = questState.currentStep.id.includes('c9_open');

  const handleOpen = () => {
    if (isOpenStep) {
      questState.completeCurrentStep();
    }
    onNavigate('terminal');
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', width: '100%', paddingBottom: '40px' }}>

      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', marginBottom: '16px' }}>
        <a href="#" className="aws-info-link" onClick={(e) => { e.preventDefault(); onBack(); }}>AWS Cloud9</a>
        <ChevronRight size={14} color="var(--text-secondary)" />
        <span style={{ color: 'var(--text-secondary)' }}>환경</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 600 }}>환경</h1>
        <button className="aws-btn-primary" onClick={() => onBack()}>환경 생성</button>
      </div>

      {/* Env Table */}
      <div className="aws-panel" style={{ padding: 0 }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
          padding: '12px 20px',
          background: '#fafafa',
          borderBottom: '1px solid var(--border-light)',
          fontSize: '13px',
          fontWeight: 700,
          color: 'var(--text-secondary)'
        }}>
          <span>이름</span>
          <span>상태</span>
          <span>유형</span>
          <span>마지막 액세스</span>
          <span></span>
        </div>

        {/* Table Row */}
        {env && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
            padding: '16px 20px',
            alignItems: 'center',
            borderBottom: '1px solid var(--border-light)',
            background: isOpenStep ? '#f1f8fa' : '#fff',
            border: isOpenStep ? '1px solid #0073bb' : undefined,
          }}>
            <span style={{ fontWeight: 600 }}>{env.name}</span>
            <span>
              <span style={{
                background: '#1d8102',
                color: '#fff',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 600
              }}>Ready</span>
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>EC2 인스턴스</span>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>방금 전</span>
            <button
              onClick={handleOpen}
              style={{
                background: '#fff',
                border: '1px solid var(--border-medium)',
                borderRadius: '2px',
                padding: '5px 16px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--text-primary)',
                ...(isOpenStep ? { borderColor: '#ff9900', color: '#ff9900', animation: 'step-panel-pulse 1.5s ease-in-out infinite' } : {})
              }}
            >
              <Play size={13} fill="currentColor" />
              열림
            </button>
          </div>
        )}
      </div>

      {isOpenStep && (
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          background: '#f1f8fa',
          border: '1px solid #0073bb',
          borderRadius: '2px',
          fontSize: '13px',
          color: '#0073bb',
          fontWeight: 500
        }}>
          💡 퀘스트: 위의 <strong>열림</strong> 버튼을 눌러 Cloud9 IDE에 진입하세요.
        </div>
      )}
    </div>
  );
}
