import React from 'react';
import SajangCharacter from './SajangCharacter';

const MOOD_QUOTES = {
  worried:    '...일단은 됐군.',
  determined: '좋아. 다음 단계 가자.',
  happy:      '오, 이거 되는 거잖아!',
  ecstatic:   '만두가게 살았다!!!',
};

const MOOD_COLOR = {
  worried:    '#fc8181',
  determined: '#f6ad55',
  happy:      '#63b3ed',
  ecstatic:   '#68d391',
};

export default function StepCompleteToast({ step, cost, mood, stepNumber }) {
  if (!step) return null;
  const accent = MOOD_COLOR[mood] ?? '#ff9900';

  return (
    <div style={{
      position: 'fixed',
      bottom: '28px',
      right: '28px',
      zIndex: 500,
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      background: '#1a1d23',
      border: '1px solid #2d3748',
      borderLeft: `4px solid ${accent}`,
      borderRadius: '10px',
      padding: '14px 20px 14px 14px',
      minWidth: '290px',
      boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
      animation: 'toast-slide 3s cubic-bezier(0.22,1,0.36,1) forwards',
      pointerEvents: 'none',
    }}>
      <div style={{ flexShrink: 0 }}>
        <SajangCharacter size={56} mood={mood} />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: '10px', fontWeight: 800,
          color: accent, letterSpacing: '1.5px',
          textTransform: 'uppercase', marginBottom: '5px',
        }}>
          ✓ STEP {stepNumber} 완료
        </div>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#f7fafc', marginBottom: '3px' }}>
          {step.title}
        </div>
        <div style={{ fontSize: '12px', color: '#a0aec0', marginBottom: '8px' }}>
          {MOOD_QUOTES[mood]}
        </div>

        {/* 비용 뱃지 */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '5px',
          background: 'rgba(252,129,129,0.12)',
          border: '1px solid rgba(252,129,129,0.25)',
          borderRadius: '4px', padding: '3px 8px',
        }}>
          <span style={{ fontSize: '10px', color: '#fc8181' }}>💸</span>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#fc8181', fontFamily: 'monospace' }}>
            +${cost.toFixed(3)} 청구됨
          </span>
        </div>
      </div>
    </div>
  );
}
