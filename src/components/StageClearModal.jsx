import { useRef, useState, useLayoutEffect } from 'react';
import SajangCharacter from './SajangCharacter';

const STEP_COSTS = {
  header: 0.001, cloud9: 0.10, terminal: 0.004,
  s3: 0.023, ec2: 0.52, rds: 1.75, lambda: 0.0002,
};

const REWARDS = {
  1: { badge: '🏅', title: '정적 호스팅 마스터', desc: '만두 메뉴판을 전 세계에 공개했어요!' },
  2: { badge: '🏆', title: '3티어 아키텍트', desc: '화면 · 서버 · DB가 연결된 진짜 앱을 만들었어요!' },
  3: { badge: '⚡', title: '서버리스 개척자', desc: 'AI 직원 채용 완료. 인건비 0원 달성!' },
};

const COST_GRADE = [
  { max: 1,        emoji: '🥇', label: '절약왕' },
  { max: 5,        emoji: '👍', label: '검소한 개발자' },
  { max: 15,       emoji: '😅', label: '뭐 이 정도는...' },
  { max: Infinity, emoji: '💸', label: '통장 탈탈' },
];

// 별 아이콘 (SVG) — 가운데 130px, 사이드 100px
function Star({ filled, delay = 0, big = false }) {
  const size = big ? 130 : 100;
  const id = `star-${big ? 'b' : 's'}-${filled ? 'on' : 'off'}`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100"
      style={{
        animation: `star-pop 0.45s ${delay}s cubic-bezier(0.34,1.8,0.64,1) both`,
        filter: filled ? 'drop-shadow(0 0 14px rgba(255,190,0,0.95))' : 'drop-shadow(0 2px 3px rgba(0,0,0,0.15))',
      }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          {filled ? (
            <>
              <stop offset="0%" stopColor="#ffe169" />
              <stop offset="55%" stopColor="#ffc400" />
              <stop offset="100%" stopColor="#ff9d00" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#e8e3d6" />
              <stop offset="100%" stopColor="#d2ccbd" />
            </>
          )}
        </linearGradient>
      </defs>
      <path d="M50 6 L62 38 L96 40 L69 62 L78 95 L50 76 L22 95 L31 62 L4 40 L38 38 Z"
        fill={`url(#${id})`}
        stroke={filled ? '#ff8a00' : '#c4bdaa'}
        strokeWidth="5" strokeLinejoin="round" />
      {filled && (
        <ellipse cx="40" cy="32" rx="9" ry="6" fill="rgba(255,255,255,0.75)" transform="rotate(-20 40 32)" />
      )}
    </svg>
  );
}

export default function StageClearModal({ tutorial, steps, completedSteps, credits = 0, onNext, onBack, nextTutorial }) {
  const totalCost = completedSteps.reduce((sum, stepId) => {
    const step = steps.find(s => s.id === stepId);
    return sum + (STEP_COSTS[step?.service] ?? 0.05);
  }, 0);

  const starCount = credits >= 80 ? 3 : credits >= 50 ? 2 : 1;
  const reward = REWARDS[tutorial?.id] ?? REWARDS[1];
  const grade = COST_GRADE.find(g => totalCost < g.max);
  const accent = tutorial?.color ?? '#ff9900';

  // 별 + 카드 전체를 감싸는 래퍼 기준으로 scale 계산
  const wrapRef = useRef(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const fit = () => {
      const el = wrapRef.current;
      if (!el) return;
      const margin = 0.94;
      const s = Math.min(1,
        (window.innerHeight * margin) / el.offsetHeight,
        (window.innerWidth  * margin) / el.offsetWidth
      );
      setScale(s);
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(60,28,0,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 200, backdropFilter: 'blur(4px)',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      {/* 별 + 카드 통합 스케일 래퍼 */}
      <div ref={wrapRef} style={{
        position: 'relative',
        maxWidth: '680px', width: '94%',
        paddingTop: '76px',   // 별이 카드 위로 돌출하는 공간
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
      }}>

        {/* 별 3개 — 카드 상단 테두리를 뚫고 위로 돌출 */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
          gap: '8px', zIndex: 10, pointerEvents: 'none',
        }}>
          <Star filled={starCount >= 1} delay={0.15} />
          <Star filled={starCount >= 2} delay={0.3} big />
          <Star filled={starCount >= 3} delay={0.45} />
        </div>

        {/* 카드 */}
        <div style={{
          background: 'linear-gradient(160deg, #fffdf8 0%, #fff3e0 100%)',
          border: `5px solid ${accent}`,
          borderRadius: '28px',
          padding: '26px 38px 26px',
          textAlign: 'center',
          boxShadow: `0 24px 80px rgba(0,0,0,0.45)`,
          animation: 'stage-clear-in 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* 광선 배경 */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.55,
            background: `radial-gradient(circle at 50% 0%, ${accent}33 0%, transparent 55%)` }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* 로고 */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
              <img src="/stage_clear.png" alt="STAGE CLEAR!"
                style={{ width: 'min(520px, 90%)', height: 'auto',
                  filter: 'drop-shadow(0 4px 8px rgba(204,85,0,0.3))',
                  animation: 'stage-clear-logo 0.5s cubic-bezier(0.34,1.56,0.64,1) both' }} />
            </div>

            {/* 사장님 */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
              <SajangCharacter size={116} mood="ecstatic" />
            </div>

            {/* 리본 — 미션 제목 */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
              <div style={{
                background: `linear-gradient(180deg, ${accent}, ${accent}dd)`,
                color: '#fff', fontWeight: 900, fontSize: '19px',
                padding: '10px 36px', borderRadius: '10px',
                boxShadow: `0 4px 0 rgba(0,0,0,0.18)`,
                border: '3px solid rgba(255,255,255,0.7)',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              }}>
                {tutorial?.subtitle ?? tutorial?.title} 완료!
              </div>
            </div>

            {/* 보상 뱃지 */}
            <div style={{
              background: '#fff', border: `3px solid ${accent}`,
              borderRadius: '18px', padding: '18px 22px', marginBottom: '16px',
              display: 'flex', alignItems: 'center', gap: '18px',
              boxShadow: `0 4px 0 ${accent}40`,
            }}>
              <div style={{ fontSize: '52px', flexShrink: 0 }}>{reward.badge}</div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '22px', fontWeight: 900, color: '#3d1c00', marginBottom: '4px' }}>{reward.title}</div>
                <div style={{ fontSize: '15px', color: '#7a4a20', fontWeight: 600 }}>{reward.desc}</div>
              </div>
            </div>

            {/* 결산 2칸 */}
            <div style={{ display: 'flex', gap: '14px', marginBottom: '26px' }}>
              <div style={{ flex: 1, background: '#fff', border: '3px solid #f0d9b0', borderRadius: '16px', padding: '16px' }}>
                <div style={{ fontSize: '14px', color: '#999', fontWeight: 800, marginBottom: '6px' }}>💰 총 AWS 청구액</div>
                <div style={{ fontSize: '30px', fontWeight: 900, color: '#ef4444', fontFamily: 'monospace' }}>${totalCost.toFixed(2)}</div>
              </div>
              <div style={{ flex: 1, background: '#fff', border: '3px solid #f0d9b0', borderRadius: '16px', padding: '16px' }}>
                <div style={{ fontSize: '14px', color: '#999', fontWeight: 800, marginBottom: '6px' }}>🏆 평가</div>
                <div style={{ fontSize: '26px' }}>{grade.emoji}</div>
                <div style={{ fontSize: '16px', color: '#7a4a20', fontWeight: 900 }}>{grade.label}</div>
              </div>
            </div>

            {/* 버튼 */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              {nextTutorial && (
                <button
                  onClick={onNext}
                  style={{
                    background: 'linear-gradient(90deg, #ff9900, #ff7700)', color: '#fff',
                    border: 'none', borderRadius: '14px',
                    padding: '17px 32px', fontSize: '19px', fontWeight: 900,
                    cursor: 'pointer', letterSpacing: '0.3px',
                    boxShadow: '0 6px 0 #c47a00',
                    transition: 'transform 0.1s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {nextTutorial.title} 시작하기 →
                </button>
              )}
              <button
                onClick={onBack}
                style={{
                  background: '#fff', color: '#7a4a20',
                  border: '3px solid #e0c89a', borderRadius: '14px',
                  padding: '17px 26px', fontSize: '17px', fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                목록으로
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
