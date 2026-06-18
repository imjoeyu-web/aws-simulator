import React, { useState } from 'react';
import { Lock, Check, Clock, Star, ChevronRight } from 'lucide-react';

// 미션 카드 데이터 (난이도 / 예상시간 / 색상)
const MISSIONS = [
  {
    id: 1, title: '가게 홍보 홈페이지', emoji: '🥟',
    difficulty: 'EASY', diffColor: '#22c55e',
    time: '약 10분', services: 'Cloud9 · S3',
    accent: '#ff9900',
  },
  {
    id: 2, title: '만두 주문 앱', emoji: '📱',
    difficulty: 'NORMAL', diffColor: '#f97316',
    time: '약 20분', services: 'EC2 · RDS',
    accent: '#3b82f6',
  },
  {
    id: 3, title: 'AI 만두 추천', emoji: '🤖',
    difficulty: 'HARD', diffColor: '#ef4444',
    time: '약 15분', services: 'Lambda · GPT',
    accent: '#a855f7',
  },
];

function MissionCard({ mission, status, isRecommended, onClick }) {
  const [hover, setHover] = useState(false);
  const isLocked = status === 'locked';
  const isDone = status === 'done';
  const clickable = !isLocked;

  return (
    <div
      onClick={() => clickable && onClick(mission.id)}
      onMouseEnter={() => clickable && setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        width: 'clamp(180px, 17vw, 250px)',
        background: isLocked ? 'rgba(248,244,238,0.97)' : 'rgba(255,253,248,0.98)',
        border: `4px solid ${isDone ? '#22c55e' : isLocked ? '#cbb' : mission.accent}`,
        borderRadius: '18px',
        padding: 'clamp(16px, 2vh, 24px) clamp(14px, 1.2vw, 20px)',
        cursor: clickable ? 'pointer' : 'not-allowed',
        opacity: isLocked ? 0.85 : 1,
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        transform: hover ? 'translateY(-10px)' : 'translateY(0)',
        boxShadow: hover
          ? `0 14px 32px rgba(0,0,0,0.35), 0 0 0 5px ${mission.accent}40`
          : '0 6px 18px rgba(0,0,0,0.28)',
      }}
    >
      {/* 추천 뱃지 */}
      {isRecommended && !isDone && (
        <div style={{
          position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
          background: 'linear-gradient(90deg, #ffd700, #ffaa00)',
          color: '#5b2d00', fontSize: 'clamp(9px, 1.1vh, 11px)', fontWeight: 900,
          padding: '3px 12px', borderRadius: '20px', whiteSpace: 'nowrap',
          boxShadow: '0 2px 8px rgba(255,170,0,0.5)', border: '1.5px solid #fff',
          display: 'flex', alignItems: 'center', gap: '3px',
        }}>
          <Star size={10} fill="#5b2d00" /> 추천 미션
        </div>
      )}

      {/* 번호 + 난이도 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{
          width: 'clamp(30px, 3.6vh, 38px)', height: 'clamp(30px, 3.6vh, 38px)', borderRadius: '50%',
          background: isDone ? '#22c55e' : isLocked ? '#bbb' : mission.accent,
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 'clamp(16px, 2.1vh, 20px)', fontWeight: 900, flexShrink: 0,
        }}>
          {isDone ? <Check size={20} strokeWidth={3} /> : isLocked ? <Lock size={16} /> : mission.id}
        </div>
        <span style={{
          fontSize: 'clamp(10px, 1.3vh, 13px)', fontWeight: 800, letterSpacing: '0.5px',
          color: '#fff', background: isLocked ? '#bbb' : mission.diffColor,
          padding: '3px 11px', borderRadius: '20px',
        }}>
          {mission.difficulty}
        </span>
      </div>

      {/* 이모지 */}
      <div style={{ textAlign: 'center', fontSize: 'clamp(40px, 5.5vh, 58px)', marginBottom: '8px', filter: isLocked ? 'grayscale(1)' : 'none' }}>
        {mission.emoji}
      </div>

      {/* 제목 */}
      <div style={{
        textAlign: 'center', fontSize: 'clamp(16px, 2.1vh, 20px)', fontWeight: 900,
        color: isLocked ? '#999' : '#3d1c00', lineHeight: 1.3, marginBottom: '10px', minHeight: '2.6em',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {mission.title}
      </div>

      {/* 메타 정보 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: 'clamp(12px, 1.5vh, 15px)', color: isLocked ? '#aaa' : '#7a4a20', fontWeight: 700 }}>
          <Clock size={14} /> {mission.time}
        </div>
        <div style={{ fontSize: 'clamp(11px, 1.3vh, 13px)', color: isLocked ? '#bbb' : mission.accent, fontWeight: 700, background: isLocked ? '#eee' : `${mission.accent}15`, padding: '3px 11px', borderRadius: '12px' }}>
          {mission.services}
        </div>
      </div>

      {/* 상태 라벨 / CTA */}
      <div style={{ marginTop: '12px', textAlign: 'center' }}>
        {isDone ? (
          <span style={{ fontSize: 'clamp(13px, 1.6vh, 16px)', fontWeight: 800, color: '#22c55e' }}>✓ 완료!</span>
        ) : isLocked ? (
          <span style={{ fontSize: 'clamp(12px, 1.5vh, 15px)', fontWeight: 700, color: '#aaa' }}>🔒 이전 미션 먼저</span>
        ) : (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            fontSize: 'clamp(14px, 1.8vh, 18px)', fontWeight: 900, color: mission.accent,
          }}>
            {hover ? '시작하기' : '도전하기'} <ChevronRight size={17} />
          </span>
        )}
      </div>
    </div>
  );
}

export default function TutorialHome({ completedTutorials, onStart }) {
  // 추천 미션 = 완료 안 된 것 중 가장 빠른 것
  const recommendedId = MISSIONS.find(m => !completedTutorials.includes(m.id))?.id;

  const getStatus = (id) => {
    if (completedTutorials.includes(id)) return 'done';
    if (id > 1 && !completedTutorials.includes(id - 1)) return 'locked';
    return 'open';
  };

  return (
    <div style={{ position: 'absolute', inset: 0, userSelect: 'none' }}>
      {/* 배경 (입간판 제거된 버전) */}
      <img
        src="/bgi_clean.png"
        alt="미션 선택 배경"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />

      {/* 미션 카드 3개 — 오른쪽 거리 위에 (예전 입간판 자리) */}
      <div style={{
        position: 'absolute',
        right: 'clamp(20px, 4vw, 70px)',
        bottom: 'clamp(70px, 12vh, 130px)',
        display: 'flex', gap: 'clamp(14px, 1.8vw, 26px)',
        alignItems: 'flex-end',
        zIndex: 2,
      }}>
        {MISSIONS.map(mission => (
          <MissionCard
            key={mission.id}
            mission={mission}
            status={getStatus(mission.id)}
            isRecommended={mission.id === recommendedId}
            onClick={onStart}
          />
        ))}
      </div>

      {/* 하단 진행도 */}
      <div style={{
        position: 'absolute', bottom: '4%', left: 'clamp(16px, 4vw, 60px)',
        background: 'rgba(0,0,0,0.6)', borderRadius: '20px', padding: '8px 20px',
        display: 'flex', alignItems: 'center', gap: '12px',
        border: '2px solid rgba(255,215,0,0.5)', whiteSpace: 'nowrap', zIndex: 2,
      }}>
        <span style={{ fontSize: 'clamp(11px, 1.4vh, 14px)', fontWeight: 800, color: '#ffd700' }}>
          ⭐ {completedTutorials.length} / 3 완료
        </span>
        <div style={{ width: 'clamp(80px, 8vw, 120px)', height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(completedTutorials.length / 3) * 100}%`, background: 'linear-gradient(90deg, #ffd700, #ffaa00)', borderRadius: '4px', transition: 'width 0.6s ease' }} />
        </div>
      </div>
    </div>
  );
}
