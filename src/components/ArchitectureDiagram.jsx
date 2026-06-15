import React from 'react';

function Node({ emoji, label, sublabel, active, badges = [] }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      opacity: active ? 1 : 0.3,
      transition: 'opacity 0.4s ease',
    }}>
      {/* 아이콘 박스 */}
      <div style={{
        width: '52px', height: '52px', borderRadius: '10px', flexShrink: 0,
        background: active ? '#fff' : '#f4f6f6',
        border: `2px solid ${active ? '#0073bb' : '#d5dbdb'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '24px',
        boxShadow: active ? '0 2px 10px rgba(0,115,187,0.2)' : 'none',
        transition: 'all 0.4s ease',
      }}>
        {emoji}
      </div>
      {/* 텍스트 + 배지 */}
      <div>
        <div style={{
          fontSize: '13px', fontWeight: 700,
          color: active ? '#16191f' : '#aab7b8',
          transition: 'color 0.4s',
        }}>
          {label}
        </div>
        <div style={{ fontSize: '11px', color: '#687078', marginTop: '1px' }}>
          {sublabel}
        </div>
        {badges.length > 0 && (
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
            {badges.map(b => (
              <span key={b} style={{
                fontSize: '10px', fontWeight: 700,
                background: '#1d8102', color: '#fff',
                padding: '1px 7px', borderRadius: '8px',
              }}>
                {b}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function VerticalArrow({ active, label }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '10px',
      paddingLeft: '24px', // 아이콘 중앙 정렬 (52px / 2 - 2px)
    }}>
      {/* 세로 선 + 화살촉 */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '4px' }}>
        <div style={{
          width: '2px', height: '20px',
          background: active ? '#0073bb' : '#d5dbdb',
          transition: 'background 0.4s',
        }} />
        <div style={{
          width: 0, height: 0,
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderTop: `6px solid ${active ? '#0073bb' : '#d5dbdb'}`,
          transition: 'border-top-color 0.4s',
        }} />
      </div>
      {/* 레이블 */}
      {label && (
        <div style={{
          fontSize: '10px', fontWeight: 600,
          color: active ? '#0073bb' : '#aab7b8',
          marginTop: '4px',
          transition: 'color 0.4s',
        }}>
          {label}
        </div>
      )}
    </div>
  );
}

function T1Diagram({ completedSteps }) {
  const has = (key) => completedSteps.some(id => id.includes(key));

  const cloud9Active  = has('c9');
  const buildDone     = has('npm_build');
  const s3Active      = has('s3_create');
  const policyDone    = has('s3_policy');
  const hostingDone   = has('s3_hosting');
  const uploadDone    = has('s3_cp');
  const finished      = has('finish');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      <Node
        emoji="💻"
        label="Cloud9"
        sublabel="EC2 인스턴스"
        active={cloud9Active}
        badges={buildDone ? ['build ✓'] : []}
      />
      <VerticalArrow active={uploadDone} label="aws s3 cp" />
      <Node
        emoji="🪣"
        label="S3 버킷"
        sublabel="정적 스토리지"
        active={s3Active}
        badges={[
          ...(policyDone  ? ['정책 ✓']   : []),
          ...(hostingDone ? ['호스팅 ✓'] : []),
        ]}
      />
      <VerticalArrow active={finished} label="HTTP" />
      <Node
        emoji="🌐"
        label="인터넷"
        sublabel="사용자"
        active={finished}
        badges={[]}
      />
    </div>
  );
}

const DIAGRAMS = { 1: T1Diagram };

export default function ArchitectureDiagram({ tutorialId, completedSteps }) {
  const Diagram = DIAGRAMS[tutorialId];

  return (
    <div style={{
      width: '260px', flexShrink: 0,
      borderLeft: '1px solid var(--border-light)',
      background: '#fafafa',
      display: 'flex', flexDirection: 'column',
      overflowY: 'auto',
    }}>
      {/* 헤더 */}
      <div style={{
        padding: '16px 20px 12px',
        borderBottom: '1px solid var(--border-light)',
        background: '#fff',
      }}>
        <div style={{
          fontSize: '12px', fontWeight: 700, color: '#16191f',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <span>🏗️</span> 배포 아키텍처
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
          스텝 완료 시 실시간 업데이트
        </div>
      </div>

      {/* 다이어그램 본문 */}
      <div style={{ padding: '20px 20px' }}>
        {Diagram
          ? <Diagram completedSteps={completedSteps} />
          : (
            <div style={{ fontSize: '12px', color: '#aab7b8', textAlign: 'center', paddingTop: '24px' }}>
              준비 중이에요.
            </div>
          )
        }
      </div>
    </div>
  );
}
