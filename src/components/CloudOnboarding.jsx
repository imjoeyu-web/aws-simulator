import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

export default function CloudOnboarding({ onDone }) {
  const [hover, setHover] = useState(false);

  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* 배경 — 타이틀 로고가 이미 그림에 포함됨 */}
      <img
        src="/bgi_home.png"
        alt="고향만두 아저씨 살아남기"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />

      {/* 시작 버튼 — 하단 중앙 */}
      <div style={{
        position: 'absolute',
        bottom: 'clamp(50px, 9vh, 100px)',
        left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
        zIndex: 2,
      }}>
        <button
          onClick={onDone}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            background: 'linear-gradient(180deg, #ffb524, #ff7a00)',
            color: '#fff',
            border: '4px solid #fff',
            borderRadius: '50px',
            padding: '20px 56px',
            fontSize: '28px', fontWeight: 900, letterSpacing: '1px',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '10px',
            boxShadow: hover
              ? '0 8px 0 #c75e00, 0 14px 30px rgba(0,0,0,0.4)'
              : '0 6px 0 #c75e00, 0 10px 22px rgba(0,0,0,0.35)',
            transform: hover ? 'translateY(-3px) scale(1.03)' : 'translateY(0) scale(1)',
            transition: 'all 0.15s ease',
            textShadow: '0 2px 3px rgba(0,0,0,0.3)',
            animation: 'cta-pulse 1.6s ease-in-out infinite',
          }}
        >
          🚀 지금 시작하기 <ChevronRight size={30} strokeWidth={3} />
        </button>
        <div style={{
          fontSize: '15px', fontWeight: 700, color: '#fff',
          textShadow: '0 2px 4px rgba(0,0,0,0.7)',
          background: 'rgba(0,0,0,0.35)', padding: '5px 16px', borderRadius: '20px',
        }}>
          첫 미션은 약 10분 · 무료
        </div>
      </div>

      <style>{`
        @keyframes cta-pulse {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.12); }
        }
      `}</style>
    </div>
  );
}
