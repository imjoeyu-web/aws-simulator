import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

export default function Cloud9CreateForm({ questState, onNavigate, onEnvCreated, onBack }) {
  const [envName, setEnvName] = useState('');
  const [envDesc, setEnvDesc] = useState('');
  const [envType, setEnvType] = useState('new');
  const [instanceType, setInstanceType] = useState('t3.small');
  
  const isCreateStep = questState.currentStep.id.includes('c9_create');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!envName) return;
    // 퀘스트 완료 처리
    if (isCreateStep) {
      questState.completeCurrentStep();
    }
    // 환경 목록 화면으로 이동 (onEnvCreated 콜백)
    onEnvCreated({ name: envName, type: instanceType });
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', width: '100%', paddingBottom: '40px' }}>
      
      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', marginBottom: '16px' }}>
        <a href="#" className="aws-info-link" onClick={(e) => { e.preventDefault(); onBack(); }}>AWS Cloud9</a>
        <ChevronRight size={14} color="var(--text-secondary)" />
        <a href="#" className="aws-info-link">환경</a>
        <ChevronRight size={14} color="var(--text-secondary)" />
        <span style={{ color: 'var(--text-secondary)' }}>환경 생성</span>
      </div>

      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 600, letterSpacing: '-0.5px' }}>환경 생성</h1>
        <span className="aws-info-link" style={{ marginBottom: '4px' }}>Info</span>
      </div>

      <form onSubmit={handleCreate}>
        
        {/* 세부 정보 패널 */}
        <div className={`aws-panel ${isCreateStep ? 'success-glow' : ''}`} style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>세부 정보</h2>
          
          <div style={{ marginBottom: '24px' }}>
            <label className="aws-label">이름</label>
            <input 
              type="text" 
              className="aws-input" 
              value={envName}
              onChange={e => setEnvName(e.target.value)}
              style={{ maxWidth: '600px' }}
            />
            <span className="aws-hint">60자 제한, 영숫자, 사용자별로 고유해야 합니다.</span>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label className="aws-label">설명 - 선택 사항</label>
            <textarea 
              className="aws-input" 
              rows={2}
              value={envDesc}
              onChange={e => setEnvDesc(e.target.value)}
              style={{ maxWidth: '800px', resize: 'vertical' }}
            />
            <span className="aws-hint">200자로 제한됩니다.</span>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
              <label className="aws-label">환경 유형</label>
              <span className="aws-info-link">Info</span>
            </div>
            <span className="aws-hint" style={{ marginTop: '-4px', marginBottom: '12px' }}>
              Cloud9 IDE를 실행할 대상을 결정합니다.
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '800px' }}>
              
              <label className={`aws-radio-box ${envType === 'new' ? 'selected' : ''}`}>
                <div className="aws-radio-header">
                  <input 
                    type="radio" 
                    className="aws-radio-input" 
                    checked={envType === 'new'}
                    onChange={() => setEnvType('new')}
                  />
                  <div style={{ fontWeight: 700 }}>새로운 EC2 인스턴스</div>
                </div>
                <div style={{ paddingLeft: '28px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Cloud9은 계정에 EC2 인스턴스를 생성합니다. EC2 인스턴스의 구성은 생성 후 Cloud9에서 변경할 수 없습니다.
                </div>
              </label>

              <label className={`aws-radio-box ${envType === 'existing' ? 'selected' : ''}`}>
                <div className="aws-radio-header">
                  <input 
                    type="radio" 
                    className="aws-radio-input" 
                    checked={envType === 'existing'}
                    onChange={() => setEnvType('existing')}
                  />
                  <div style={{ fontWeight: 700 }}>기존 컴퓨팅</div>
                </div>
                <div style={{ paddingLeft: '28px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  사용하려는 기존 인스턴스 또는 서버가 있습니다.
                </div>
              </label>

            </div>
          </div>
        </div>

        {/* 새로운 EC2 인스턴스 섹션 */}
        {envType === 'new' && (
          <div className="aws-panel" style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>새로운 EC2 인스턴스</h2>
            
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                <label className="aws-label">인스턴스 유형</label>
                <span className="aws-info-link">Info</span>
              </div>
              <span className="aws-hint" style={{ marginTop: '0', marginBottom: '12px' }}>
                Cloud9을 실행할 수 있도록 생성될 EC2 인스턴스의 메모리와 CPU입니다.
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                
                <label className={`aws-radio-box ${instanceType === 't2.micro' ? 'selected' : ''}`}>
                  <div className="aws-radio-header">
                    <input type="radio" className="aws-radio-input" checked={instanceType === 't2.micro'} onChange={() => setInstanceType('t2.micro')} />
                    <div style={{ fontWeight: 700 }}>t2.micro(1 GiB RAM + 1 vCPU)</div>
                  </div>
                  <div style={{ paddingLeft: '28px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    프리 티어 이용 가능. 교육용 사용자 및 탐색에 적합합니다.
                  </div>
                </label>

                <label className={`aws-radio-box ${instanceType === 't3.small' ? 'selected' : ''}`} style={{ borderColor: isCreateStep && instanceType === 't3.small' ? 'var(--border-focus)' : '' }}>
                  <div className="aws-radio-header">
                    <input type="radio" className="aws-radio-input" checked={instanceType === 't3.small'} onChange={() => setInstanceType('t3.small')} />
                    <div style={{ fontWeight: 700 }}>t3.small(2 GiB RAM + 2 vCPU)</div>
                  </div>
                  <div style={{ paddingLeft: '28px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    소규모 웹 프로젝트에 적합합니다.
                  </div>
                </label>

                <label className={`aws-radio-box ${instanceType === 'm5.large' ? 'selected' : ''}`}>
                  <div className="aws-radio-header">
                    <input type="radio" className="aws-radio-input" checked={instanceType === 'm5.large'} onChange={() => setInstanceType('m5.large')} />
                    <div style={{ fontWeight: 700 }}>m5.large(8 GiB RAM + 2 vCPU)</div>
                  </div>
                  <div style={{ paddingLeft: '28px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    프로덕션 및 대부분의 범용 개발에 권장됩니다.
                  </div>
                </label>
                
                <label className="aws-radio-box" style={{ gridColumn: '1 / span 1' }}>
                  <div className="aws-radio-header">
                    <input type="radio" className="aws-radio-input" disabled />
                    <div style={{ fontWeight: 700 }}>추가 인스턴스 유형</div>
                  </div>
                  <div style={{ paddingLeft: '28px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    필요에 맞는 추가 인스턴스를 살펴보세요.
                  </div>
                </label>

              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                <label className="aws-label">플랫폼</label>
                <span className="aws-info-link">Info</span>
              </div>
              <span className="aws-hint" style={{ marginTop: '0', marginBottom: '8px' }}>
                이는 EC2 인스턴스에 설치됩니다. Amazon Linux 2023을 권장합니다.
              </span>
              <select className="aws-input" style={{ maxWidth: '400px', appearance: 'auto' }}>
                <option>Amazon Linux 2023</option>
              </select>
            </div>

            <div>
              <label className="aws-label">시간 제한</label>
              <span className="aws-hint" style={{ marginTop: '0', marginBottom: '8px' }}>
                Cloud9가 자동 최대 절전 모드로 전환되기 전에 비활성 상태(사용자 입력 없음)일 수 있는 시간입니다. 이렇게 하면 불필요한 청구를 방지할 수 있습니다.
              </span>
              <select className="aws-input" style={{ maxWidth: '400px', appearance: 'auto' }}>
                <option>30분</option>
              </select>
            </div>
            
          </div>
        )}

        <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
          <button type="submit" className="aws-btn-primary">
            생성
          </button>
          <button type="button" className="aws-input" style={{ width: 'auto', background: '#fff' }} onClick={onBack}>
            취소
          </button>
        </div>

      </form>
    </div>
  );
}
