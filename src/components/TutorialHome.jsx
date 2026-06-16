import React, { useState } from 'react';
import { ALL_TUTORIALS } from '../hooks/useQuestState';

// 위치 안 맞으면 true로 바꿔서 빨간 테두리 확인 후 값 조정
const DEBUG = false;

const MISSION_BUTTONS = [
  { id: 1, left: '51%', top: '57%', width: '12%', height: '40%' },
  { id: 2, left: '67%', top: '57%', width: '12%', height: '40%' },
  { id: 3, left: '83%', top: '57%', width: '12%', height: '40%' },
];

export default function TutorialHome({ completedTutorials, onStart }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      background: '#87CEEB',
      userSelect: 'none',
    }}>
      {/* 배경 이미지 */}
      <img
        src="/bgi.png"
        alt="고향만두 미션 선택 배경"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {/* 입간판 버튼 오버레이 */}
      {MISSION_BUTTONS.map((btn) => {
        const isCompleted = completedTutorials.includes(btn.id);
        const isLocked = btn.id > 1 && !completedTutorials.includes(btn.id - 1);
        const isHovered = hovered === btn.id;

        return (
          <div
            key={btn.id}
            onClick={() => !isLocked && onStart(btn.id)}
            onMouseEnter={() => !isLocked && setHovered(btn.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: 'absolute',
              left: btn.left,
              top: btn.top,
              width: btn.width,
              height: btn.height,
              cursor: isLocked ? 'not-allowed' : 'pointer',
              borderRadius: '8px',
              background: isHovered
                ? 'rgba(255, 200, 50, 0.25)'
                : isCompleted
                  ? 'rgba(100, 220, 100, 0.15)'
                  : 'transparent',
              border: isHovered
                ? '3px solid rgba(255, 180, 0, 0.8)'
                : DEBUG
                  ? `2px dashed rgba(255,${btn.id === 1 ? '0,0' : btn.id === 2 ? '180,0' : '0,180'},0.7)`
                  : '3px solid transparent',
              transition: 'all 0.15s ease',
              transform: isHovered ? 'scale(1.03)' : 'scale(1)',
              boxShadow: isHovered ? '0 0 20px rgba(255,180,0,0.5)' : 'none',
            }}
          />
        );
      })}

      {/* 하단 진행도 */}
      <div style={{
        position: 'absolute',
        bottom: '4%',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.55)',
        borderRadius: '20px',
        padding: '6px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        border: '2px solid rgba(255,215,0,0.4)',
        whiteSpace: 'nowrap',
      }}>
        <span style={{ fontSize: '13px', fontWeight: 800, color: '#ffd700' }}>
          ⭐ {completedTutorials.length} / 3 완료
        </span>
        <div style={{ width: '120px', height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${(completedTutorials.length / 3) * 100}%`,
            background: 'linear-gradient(90deg, #ffd700, #ffaa00)',
            borderRadius: '4px',
            transition: 'width 0.6s ease',
          }} />
        </div>
      </div>
    </div>
  );
}
