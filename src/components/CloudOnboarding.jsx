import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function CloudOnboarding({ onDone }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#7c4daa', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* 배경 이미지 */}
      <img src="/bgi_home2.png" alt="홈 배경" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />

      {/* 콘텐츠 — 오른쪽 반투명 패널 위에 */}
      <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', padding: '40px 3% 40px 0', overflowY: 'auto' }}>
        <div style={{ width: '48%', display: 'flex', flexDirection: 'column', gap: '20px', paddingTop: '20px' }}>

          {/* 타이틀 */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '3px', color: '#ffd700', textTransform: 'uppercase', marginBottom: '10px', background: 'rgba(0,0,0,0.3)', display: 'inline-block', padding: '4px 12px', borderRadius: '20px' }}>
              🥟 고향만두 아저씨 살아남기
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#3d1c00', lineHeight: 1.2, marginBottom: '8px', textShadow: '1px 1px 0 rgba(255,255,255,0.5)' }}>
              만두만으론<br/>살아남을 수 없다…
            </h1>
            <p style={{ fontSize: '14px', color: '#5a2d00', lineHeight: 1.7 }}>
              대한민국 자영업의 험난함을 몸소 깨달은 고향만두 아저씨.<br/>
              결국 <strong style={{ color: '#cc5500' }}>클라우드</strong>를 배우기로 결심했다. ㅇㅁㅇ
            </p>
          </div>

          {/* 클라우드 한 줄 정의 */}
          <div style={{ background: 'rgba(255,255,255,0.96)', borderRadius: '12px', padding: '16px 20px', border: '2px solid rgba(255,153,0,0.3)' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#cc5500', marginBottom: '6px' }}>아저씨가 처음 들은 말: "클라우드가 뭔데?"</div>
            <p style={{ fontSize: '13px', color: '#3d1c00', lineHeight: 1.7, margin: 0 }}>
              쉽게 말하면 <strong style={{ color: '#cc5500' }}>남의 컴퓨터를 빌려 쓰는 것</strong>이에요.
              만두 반죽기를 사는 대신 필요할 때만 빌리는 것처럼, 쓴 만큼만 돈 내고 빌려 쓰면 돼요.
            </p>
          </div>

          {/* 세 가지 */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#cc5500', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>🥟 만두가게도 이 세 가지로 돌아가요</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {[
                { emoji: '🖥️', name: '서버', color: '#ff9900', analogy: '아저씨 본인', desc: 'EC2 · Lambda' },
                { emoji: '🛣️', name: '네트워크', color: '#3b82f6', analogy: '배달 도로', desc: 'VPC · API GW' },
                { emoji: '📦', name: '저장소', color: '#22c55e', analogy: '냉동창고+장부', desc: 'S3 · RDS' },
              ].map(item => (
                <div key={item.name} style={{ background: 'rgba(255,255,255,0.96)', border: `2px solid ${item.color}60`, borderRadius: '10px', padding: '12px 10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>{item.emoji}</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: item.color }}>{item.name}</div>
                  <div style={{ fontSize: '10px', color: '#7a4a20', marginBottom: '2px' }}>→ {item.analogy}</div>
                  <div style={{ fontSize: '10px', color: '#7a4a20', fontWeight: 700 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 로드맵 */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#cc5500', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>🗺️ 아저씨의 생존 로드맵</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { num: 1, color: '#ff9900', title: '가게 홍보 홈페이지', badge: 'S3' },
                { num: 2, color: '#3b82f6', title: '만두 주문 앱', badge: 'EC2 + RDS' },
                { num: 3, color: '#a855f7', title: 'AI 만두 추천', badge: 'Lambda' },
              ].map(item => (
                <div key={item.num} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.96)', borderRadius: '8px', padding: '8px 14px', border: `1px solid ${item.color}40` }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: item.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 900, flexShrink: 0 }}>{item.num}</div>
                  <div style={{ flex: 1, fontSize: '13px', fontWeight: 700, color: '#3d1c00' }}>{item.title}</div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: item.color, background: `${item.color}20`, border: `1px solid ${item.color}40`, padding: '2px 8px', borderRadius: '20px' }}>{item.badge}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center', paddingTop: '8px' }}>
            <button
              onClick={onDone}
              style={{
                background: 'linear-gradient(90deg, #ff9900, #ff7700)',
                color: '#3d1c00', border: 'none', borderRadius: '12px',
                padding: '14px 36px', fontSize: '16px', fontWeight: 900,
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px',
                boxShadow: '0 4px 0 #c47a00, 0 6px 20px rgba(255,153,0,0.4)',
                transition: 'transform 0.1s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              튜토리얼 선택하러 가기 <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
