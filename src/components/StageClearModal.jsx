import SajangCharacter from './SajangCharacter';

const STEP_COSTS = {
  header: 0.001, cloud9: 0.10, terminal: 0.004,
  s3: 0.023, ec2: 0.52, rds: 1.75, lambda: 0.0002,
};

const ARCH = {
  1: [
    { emoji: '💻', label: 'Cloud9', sub: 'EC2 개발 환경' },
    { emoji: '🪣', label: 'S3 버킷', sub: '정적 호스팅' },
    { emoji: '🌐', label: '인터넷', sub: '전 세계 공개' },
  ],
  2: [
    { emoji: '💻', label: 'Cloud9', sub: '개발 환경' },
    { emoji: '🪣', label: 'S3', sub: '프론트엔드' },
    { emoji: '🖥️', label: 'EC2', sub: '백엔드 API' },
    { emoji: '🗄️', label: 'RDS', sub: 'MySQL DB' },
  ],
  3: [
    { emoji: '🪣', label: 'S3', sub: '프론트엔드' },
    { emoji: '🖥️', label: 'EC2', sub: '백엔드' },
    { emoji: '🗄️', label: 'RDS', sub: 'MySQL DB' },
    { emoji: '⚡', label: 'Lambda', sub: 'AI 추천' },
  ],
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
  { max: Infinity, emoji: '💸', label: '아저씨 통장 탈탈' },
];

export default function StageClearModal({ tutorial, steps, completedSteps, onNext, onBack, nextTutorial }) {
  const totalCost = completedSteps.reduce((sum, stepId) => {
    const step = steps.find(s => s.id === stepId);
    return sum + (STEP_COSTS[step?.service] ?? 0.05);
  }, 0);

  const reward = REWARDS[tutorial?.id] ?? REWARDS[1];
  const arch = ARCH[tutorial?.id] ?? ARCH[1];
  const grade = COST_GRADE.find(g => totalCost < g.max);
  const color = tutorial?.color ?? '#0073bb';

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(10,12,16,0.88)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 200,
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        background: '#1a1d23',
        border: `1px solid ${color}44`,
        borderTop: `4px solid ${color}`,
        borderRadius: '16px',
        padding: '40px 44px',
        maxWidth: '580px',
        width: '92%',
        textAlign: 'center',
        boxShadow: `0 24px 80px rgba(0,0,0,0.7), 0 0 40px ${color}22`,
        animation: 'stage-clear-in 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards',
      }}>

        {/* 아저씨 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
          <SajangCharacter size={120} mood="ecstatic" />
        </div>

        {/* STAGE CLEAR */}
        <div style={{
          fontSize: '11px', fontWeight: 800, letterSpacing: '3px',
          color: color, textTransform: 'uppercase', marginBottom: '6px',
        }}>
          {tutorial?.title}
        </div>
        <div style={{
          fontSize: '34px', fontWeight: 900, color: '#fff',
          letterSpacing: '-0.5px', lineHeight: 1.1, marginBottom: '6px',
        }}>
          STAGE CLEAR!
        </div>
        <div style={{ fontSize: '15px', color: '#a0aec0', marginBottom: '28px' }}>
          {tutorial?.subtitle}
        </div>

        {/* 보상 뱃지 */}
        <div style={{
          background: `${color}18`,
          border: `1px solid ${color}44`,
          borderRadius: '10px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex', alignItems: 'center', gap: '14px',
        }}>
          <div style={{ fontSize: '40px', flexShrink: 0 }}>{reward.badge}</div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff', marginBottom: '3px' }}>
              {reward.title}
            </div>
            <div style={{ fontSize: '12px', color: '#a0aec0' }}>{reward.desc}</div>
          </div>
        </div>

        {/* 아키텍처 노드 */}
        <div style={{
          background: '#12151a',
          border: '1px solid #2d3748',
          borderRadius: '10px',
          padding: '16px',
          marginBottom: '20px',
        }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#718096', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '14px' }}>
            🏗️ 네가 만든 아키텍처
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {arch.map((node, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                  background: '#1e2330',
                  border: `1px solid ${color}66`,
                  borderRadius: '8px',
                  padding: '10px 14px',
                  minWidth: '72px',
                  boxShadow: `0 0 12px ${color}22`,
                  animation: `step-clear-pop 0.4s ${i * 0.1}s both`,
                }}>
                  <span style={{ fontSize: '22px' }}>{node.emoji}</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#e2e8f0' }}>{node.label}</span>
                  <span style={{ fontSize: '9px', color: '#718096' }}>{node.sub}</span>
                </div>
                {i < arch.length - 1 && (
                  <div style={{ color: color, fontSize: '16px', fontWeight: 700, flexShrink: 0 }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 결산 */}
        <div style={{
          display: 'flex', gap: '12px', marginBottom: '28px',
        }}>
          <div style={{
            flex: 1, background: '#12151a', border: '1px solid #2d3748',
            borderRadius: '8px', padding: '12px',
          }}>
            <div style={{ fontSize: '10px', color: '#718096', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>완료 스텝</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#68d391' }}>{completedSteps.length}<span style={{ fontSize: '12px', color: '#718096' }}> / {steps.length}</span></div>
          </div>
          <div style={{
            flex: 1, background: '#12151a', border: '1px solid #2d3748',
            borderRadius: '8px', padding: '12px',
          }}>
            <div style={{ fontSize: '10px', color: '#718096', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>총 AWS 청구액</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#fc8181', fontFamily: 'monospace' }}>${totalCost.toFixed(2)}</div>
          </div>
          <div style={{
            flex: 1, background: '#12151a', border: '1px solid #2d3748',
            borderRadius: '8px', padding: '12px',
          }}>
            <div style={{ fontSize: '10px', color: '#718096', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>평가</div>
            <div style={{ fontSize: '18px' }}>{grade.emoji}</div>
            <div style={{ fontSize: '10px', color: '#a0aec0', fontWeight: 600 }}>{grade.label}</div>
          </div>
        </div>

        {/* 버튼 */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          {nextTutorial && (
            <button
              onClick={onNext}
              style={{
                background: color, color: '#fff',
                border: 'none', borderRadius: '8px',
                padding: '12px 28px', fontSize: '14px', fontWeight: 800,
                cursor: 'pointer', letterSpacing: '0.3px',
              }}
            >
              {nextTutorial.title} 시작하기 →
            </button>
          )}
          <button
            onClick={onBack}
            style={{
              background: 'transparent', color: '#718096',
              border: '1px solid #2d3748', borderRadius: '8px',
              padding: '12px 20px', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            목록으로
          </button>
        </div>
      </div>
    </div>
  );
}
