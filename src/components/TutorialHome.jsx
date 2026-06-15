import React from 'react';
import { CheckCircle2, Lock, ChevronRight } from 'lucide-react';
import { ALL_TUTORIALS } from '../hooks/useQuestState';

const SERVICE_ICONS = {
  'Cloud9': '💻',
  'S3': '🪣',
  'EC2': '🖥️',
  'RDS': '🗄️',
  'Lambda': '⚡',
};

export default function TutorialHome({ completedTutorials, onStart }) {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>

      {/* 헤더 */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '2px', color: '#d45b07', textTransform: 'uppercase', marginBottom: '10px' }}>
          🥟 고향만두 아저씨 살아남기
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>
          어떤 미션부터 도전할까요?
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto' }}>
          만두가게 아저씨가 AWS를 배워 살아남는 3단계 여정이에요.
          각 단계를 완료해야 다음 단계가 열립니다.
        </p>

        {/* 전체 진행 바 */}
        <div style={{ marginTop: '28px', maxWidth: '400px', margin: '28px auto 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <span>전체 진행도</span>
            <span>{completedTutorials.length} / 3 완료</span>
          </div>
          <div style={{ height: '8px', background: '#eaeded', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, #0073bb, #1d8102)',
              width: `${(completedTutorials.length / 3) * 100}%`,
              transition: 'width 0.6s ease',
              borderRadius: '4px'
            }} />
          </div>
        </div>
      </div>

      {/* Tutorial 카드들 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {ALL_TUTORIALS.map((tutorial, index) => {
          const isCompleted = completedTutorials.includes(tutorial.id);
          const isUnlocked = true; // TODO: 잠금 복원 — tutorial.id === 1 || completedTutorials.includes(tutorial.id - 1)
          const isLocked = !isUnlocked;

          return (
            <div
              key={tutorial.id}
              style={{
                background: '#fff',
                border: `1px solid ${isCompleted ? '#1d8102' : isLocked ? '#eaeded' : '#aab7b8'}`,
                borderLeft: `4px solid ${isCompleted ? '#1d8102' : isLocked ? '#d5dbdb' : tutorial.color}`,
                borderRadius: '2px',
                padding: '24px 28px',
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                opacity: isLocked ? 0.55 : 1,
                transition: 'all 0.2s',
                boxShadow: isLocked ? 'none' : '0 1px 4px rgba(0,0,0,0.06)',
              }}
            >
              {/* 스텝 번호 / 완료 아이콘 */}
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: isCompleted ? '#1d8102' : isLocked ? '#eaeded' : tutorial.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {isCompleted ? (
                  <CheckCircle2 size={24} color="#fff" />
                ) : isLocked ? (
                  <Lock size={20} color="#aab7b8" />
                ) : (
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: '18px' }}>{tutorial.id}</span>
                )}
              </div>

              {/* 텍스트 */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: tutorial.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {tutorial.title}
                  </span>
                  {isCompleted && (
                    <span style={{ fontSize: '11px', background: '#1d8102', color: '#fff', padding: '1px 8px', borderRadius: '10px', fontWeight: 700 }}>완료</span>
                  )}
                  {isLocked && (
                    <span style={{ fontSize: '11px', background: '#eaeded', color: '#687078', padding: '1px 8px', borderRadius: '10px', fontWeight: 600 }}>이전 단계 완료 후 해금</span>
                  )}
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '6px', color: isLocked ? '#aab7b8' : 'var(--text-primary)' }}>
                  {tutorial.subtitle}
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  {tutorial.description}
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {tutorial.services.map(svc => (
                    <span key={svc} style={{
                      fontSize: '12px',
                      background: '#f4f6f6',
                      border: '1px solid #eaeded',
                      padding: '2px 10px',
                      borderRadius: '10px',
                      color: 'var(--text-secondary)',
                    }}>
                      {SERVICE_ICONS[svc]} {svc}
                    </span>
                  ))}
                </div>
              </div>

              {/* 퀘스트 수 */}
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div style={{ fontSize: '24px', fontWeight: 700, color: isLocked ? '#aab7b8' : tutorial.color }}>
                  {tutorial.steps.length}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>퀘스트</div>
              </div>

              {/* 시작/계속 버튼 */}
              <button
                disabled={isLocked}
                onClick={() => !isLocked && onStart(tutorial.id)}
                style={{
                  background: isCompleted ? '#fff' : isLocked ? '#f4f6f6' : tutorial.color,
                  color: isCompleted ? '#1d8102' : isLocked ? '#aab7b8' : '#fff',
                  border: isCompleted ? '1px solid #1d8102' : isLocked ? '1px solid #d5dbdb' : 'none',
                  borderRadius: '2px',
                  padding: '10px 24px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                }}
              >
                {isLocked ? <Lock size={14} /> : isCompleted ? <CheckCircle2 size={14} /> : null}
                {isCompleted ? '다시 하기' : isLocked ? '잠김' : tutorial.id === 1 ? '시작하기' : '시작하기'}
                {!isLocked && !isCompleted && <ChevronRight size={14} />}
              </button>
            </div>
          );
        })}
      </div>

      {/* 하단 안내 */}
      <div style={{ marginTop: '40px', padding: '20px', background: '#f4f6f6', border: '1px solid #eaeded', borderRadius: '2px', fontSize: '13px', color: 'var(--text-secondary)' }}>
        💡 <strong>사용 방법:</strong> 상단 검색창에 서비스 이름(Cloud9, S3, RDS, Lambda 등)을 검색하면 해당 콘솔로 이동해요. 좌측 미션 패널의 아저씨 지시를 따라 진행하세요. 아저씨를 실망시키면 안 돼요.
      </div>
    </div>
  );
}
