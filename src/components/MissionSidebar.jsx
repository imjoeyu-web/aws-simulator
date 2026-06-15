import { CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import SajangCharacter from './SajangCharacter';

const SERVICE_COSTS = {
  cloud9:   0.10,
  s3:       0.023,
  terminal: 0.004,
  ec2:      0.52,
  rds:      1.75,
  lambda:   0.0002,
};

const MOOD_CONFIG = {
  worried:    { label: '...이게 맞나?',      color: '#e53e3e' },
  determined: { label: '해보자고.',           color: '#d45b07' },
  happy:      { label: '오 되네?!',           color: '#0073bb' },
  ecstatic:   { label: '만두가게 살았다!!!', color: '#1d8102' },
};

const COST_REACTIONS = [
  { max: 1,    emoji: '😤', text: '아직 괜찮아' },
  { max: 5,    emoji: '🤔', text: '뭐 이 정도는...' },
  { max: 15,   emoji: '😰', text: '카드값이...' },
  { max: 30,   emoji: '😱', text: '파산 직전!!!' },
  { max: Infinity, emoji: '💀', text: '가게 문 닫았습니다' },
];

function getMood(completedSteps, totalSteps) {
  if (totalSteps === 0) return 'worried';
  const ratio = completedSteps / totalSteps;
  if (ratio >= 0.8) return 'ecstatic';
  if (ratio >= 0.5) return 'happy';
  if (ratio >= 0.2) return 'determined';
  return 'worried';
}

export default function MissionSidebar({ steps, currentStepIndex, completedSteps }) {
  const mood = getMood(completedSteps.length, steps.length);
  const moodCfg = MOOD_CONFIG[mood];

  const totalCost = completedSteps.reduce((sum, stepId) => {
    const step = steps.find(s => s.id === stepId);
    return sum + (SERVICE_COSTS[step?.service] ?? 0.05);
  }, 0);

  const costReaction = COST_REACTIONS.find(r => totalCost < r.max);

  return (
    <div style={{
      width: '320px',
      height: '100%',
      borderRight: '1px solid var(--border-light)',
      display: 'flex',
      flexDirection: 'column',
      background: '#fafafa'
    }}>

      {/* ── 아저씨 + 말풍선 ── */}
      <div style={{
        padding: '16px 20px 12px',
        borderBottom: '1px solid var(--border-light)',
        background: '#fff',
        display: 'flex',
        alignItems: 'flex-end',
        gap: '12px',
      }}>
        {/* 캐릭터 */}
        <div style={{ flexShrink: 0 }}>
          <SajangCharacter size={72} mood={mood} />
        </div>

        {/* 말풍선 + 진행도 */}
        <div style={{ flex: 1, paddingBottom: '4px' }}>
          {/* 말풍선 */}
          <div style={{
            background: moodCfg.color,
            color: '#fff',
            borderRadius: '10px 10px 10px 2px',
            padding: '7px 12px',
            fontSize: '12px',
            fontWeight: 700,
            marginBottom: '10px',
            display: 'inline-block',
            position: 'relative',
          }}>
            {moodCfg.label}
          </div>

          {/* 진행 바 */}
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
            <span>진행도</span>
            <span style={{ color: moodCfg.color }}>{Math.round((completedSteps.length / steps.length) * 100)}%</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: '#e9ecef', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              background: moodCfg.color,
              width: `${(completedSteps.length / steps.length) * 100}%`,
              transition: 'width 0.5s ease-out',
              borderRadius: '3px',
            }} />
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '3px' }}>
            {completedSteps.length} / {steps.length} 완료
          </div>
        </div>
      </div>

      {/* ── AWS 청구액 위젯 ── */}
      <div style={{
        padding: '10px 16px',
        borderBottom: '1px solid var(--border-light)',
        background: totalCost > 15 ? '#fff5f5' : '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '15px' }}>{costReaction.emoji}</span>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.3px' }}>이번 달 AWS 청구액</div>
            <div style={{ fontSize: '10px', color: totalCost > 15 ? '#e53e3e' : 'var(--text-secondary)' }}>{costReaction.text}</div>
          </div>
        </div>
        <div
          key={totalCost.toFixed(3)}
          className="billing-tick"
          style={{
            fontSize: '15px', fontWeight: 800,
            color: totalCost > 30 ? '#e53e3e' : totalCost > 15 ? '#d45b07' : '#1d8102',
            fontFamily: 'monospace',
          }}
        >
          ${totalCost.toFixed(2)}
        </div>
      </div>

      {/* ── 스텝 목록 ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', minHeight: 0 }}>
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = index === currentStepIndex;

          return (
            <div
              key={step.id}
              style={{
                display: 'flex',
                gap: '12px',
                padding: '16px 12px',
                borderRadius: '4px',
                background: isCurrent ? '#ffffff' : 'transparent',
                border: isCurrent ? '1px solid var(--aws-orange)' : '1px solid transparent',
                marginBottom: '4px',
                opacity: (isCompleted || isCurrent) ? 1 : 0.6,
                transition: 'all 0.2s ease',
                boxShadow: isCurrent ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                position: 'relative',
              }}
            >
              <div style={{ marginTop: '2px' }}>
                {isCompleted ? (
                  <CheckCircle2 size={18} color="#1d8102" />
                ) : (
                  <Circle size={18} color={isCurrent ? 'var(--aws-orange)' : '#aab7b8'} />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: '13px',
                  fontWeight: isCurrent ? 700 : 500,
                  color: isCurrent ? 'var(--aws-orange)' : (isCompleted ? '#16191f' : '#545b64'),
                }}>
                  {step.title}
                </h3>
                {(isCurrent || isCompleted) && (
                  <p style={{ fontSize: '12px', color: '#545b64', marginTop: '6px', lineHeight: 1.4 }}>
                    {step.description}
                  </p>
                )}

                {isCurrent && step.why && (
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed #f0d9b5' }}>
                    <div style={{
                      fontSize: '11px', fontWeight: 700, letterSpacing: '0.4px',
                      textTransform: 'uppercase', color: '#c45000', marginBottom: '5px',
                    }}>
                      💡 왜 이 단계인가요?
                    </div>
                    <p style={{ fontSize: '12px', color: '#545b64', lineHeight: 1.55, margin: 0 }}>
                      {step.why}
                    </p>
                    {step.concept && (
                      <div style={{
                        marginTop: '8px', background: '#fdf6ec',
                        border: '1px solid #f0d9b5', borderRadius: '3px',
                        padding: '7px 10px', fontSize: '11.5px', color: '#16191f', lineHeight: 1.5,
                      }}>
                        🔑 <strong>핵심 개념:</strong> {step.concept}
                      </div>
                    )}
                  </div>
                )}
              </div>
              {isCurrent && (
                <div style={{ position: 'absolute', right: '12px', top: '16px' }}>
                  <ChevronRight size={16} color="var(--aws-orange)" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
