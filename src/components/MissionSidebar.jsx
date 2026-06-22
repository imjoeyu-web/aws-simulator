import { useState } from 'react';
import { CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import SajangCharacter from './SajangCharacter';

function getStepSection(id) {
  if (/region|c9_create|c9_open|c9_ide|clone/.test(id))       return '🔧 작업환경 구축';
  if (/rds_create|sg_rds|mysql|create_db/.test(id))           return '🗄️ 데이터베이스 (RDS)';
  if (/cd_server|npm_install_server|env_server|node_server|sg_ec2|env_files|server_run/.test(id)) return '⚙️ 서버 (EC2)';
  if (/lambda/.test(id))                                       return '🤖 Lambda (AI)';
  if (/cd_client|t\d+_cd$|npm_install|npm_build|s3_/.test(id)) return '💻 클라이언트 (S3)';
  return null;
}

function SectionDivider({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '16px 0 6px' }}>
      <div style={{ flex: 1, height: '1px', background: '#d0d8e4' }} />
      <span style={{
        fontSize: '12px', fontWeight: 800, color: '#4a6080',
        letterSpacing: '0.3px', whiteSpace: 'nowrap', userSelect: 'none',
      }}>
        {label}
      </span>
      <div style={{ flex: 1, height: '1px', background: '#d0d8e4' }} />
    </div>
  );
}

function CopyableTemplate({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div style={{ marginTop: '10px', position: 'relative' }}>
      <pre style={{
        background: '#1e2330', color: '#a8d8b0',
        fontSize: '10.5px', fontFamily: 'monospace', lineHeight: 1.55,
        padding: '10px 12px', borderRadius: '4px',
        whiteSpace: 'pre-wrap', wordBreak: 'break-all', margin: 0,
        border: '1px solid #2d3748',
      }}>{text}</pre>
      <button
        onClick={handleCopy}
        style={{
          position: 'absolute', top: '6px', right: '6px',
          background: copied ? '#1d8102' : '#2d3748',
          color: '#fff', border: 'none', borderRadius: '3px',
          fontSize: '10px', fontWeight: 700, padding: '2px 8px',
          cursor: 'pointer', transition: 'background 0.2s',
        }}
      >
        {copied ? '복사됨!' : '복사'}
      </button>
    </div>
  );
}

const MOOD_CONFIG = {
  worried:    { label: '...이게 맞나?',      color: '#e53e3e' },
  determined: { label: '해보자고.',           color: '#d45b07' },
  happy:      { label: '오 되네?!',           color: '#0073bb' },
  ecstatic:   { label: '만두가게 살았다!!!', color: '#1d8102' },
};

function getCreditColor(credits) {
  if (credits >= 60) return '#1d8102';
  if (credits >= 30) return '#d45b07';
  return '#e53e3e';
}

function getCreditLabel(credits) {
  if (credits >= 80) return '절약왕';
  if (credits >= 60) return '괜찮아요';
  if (credits >= 30) return '조금 위험해요';
  if (credits > 0)   return '파산 직전!!!';
  return '파산했습니다';
}

export default function MissionSidebar({ steps, currentStepIndex, completedSteps, credits = 100, mood = 'worried' }) {
  const moodCfg = MOOD_CONFIG[mood] ?? MOOD_CONFIG.worried;
  const creditColor = getCreditColor(credits);
  const creditLabel = getCreditLabel(credits);

  return (
    <div style={{
      width: '320px',
      height: '100%',
      borderRight: '1px solid var(--border-light)',
      display: 'flex',
      flexDirection: 'column',
      background: '#fafafa',
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
        <div style={{ flexShrink: 0 }}>
          <SajangCharacter size={72} mood={mood} />
        </div>

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

      {/* ── 크레딧 게이지 ── */}
      <div style={{
        padding: '10px 16px',
        borderBottom: '1px solid var(--border-light)',
        background: credits <= 25 ? '#fff5f5' : '#fff',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px' }}>💰</span>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.3px' }}>
                남은 크레딧
              </div>
              <div style={{ fontSize: '10px', color: creditColor, fontWeight: 600 }}>{creditLabel}</div>
            </div>
          </div>
          <div
            key={credits}
            className="billing-tick"
            style={{
              fontSize: '15px',
              fontWeight: 800,
              color: creditColor,
              fontFamily: 'monospace',
            }}
          >
            ${credits}
          </div>
        </div>
        {/* 게이지 바 */}
        <div style={{ width: '100%', height: '7px', background: '#e9ecef', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${Math.max(0, Math.min(100, credits))}%`,
            background: creditColor,
            borderRadius: '4px',
            transition: 'width 0.5s ease-out, background 0.3s',
          }} />
        </div>
      </div>

      {/* ── 스텝 목록 ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', minHeight: 0 }}>
        {(() => {
          let lastSection = null;
          return steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = index === currentStepIndex;
            const isFuture = !isCompleted && !isCurrent;
            const section = getStepSection(step.id);
            const showDivider = section && section !== lastSection;
            if (showDivider) lastSection = section;

            return (
              <div key={step.id}>
                {showDivider && <SectionDivider label={section} />}
                <div
                  className={isFuture ? 'step-future' : isCurrent ? 'step-current' : ''}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '16px 12px',
                    borderRadius: '4px',
                    background: isCurrent ? '#ffffff' : 'transparent',
                    border: isCurrent ? '1px solid var(--aws-orange)' : '1px solid transparent',
                    marginBottom: '4px',
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
                    {isCurrent && step.template && (
                      <CopyableTemplate text={step.template} />
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
              </div>
            );
          });
        })()}
      </div>
    </div>
  );
}
