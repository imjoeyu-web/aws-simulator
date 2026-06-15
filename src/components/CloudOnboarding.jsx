import React from 'react';
import { ChevronRight } from 'lucide-react';
import SajangCharacter from './SajangCharacter';

export default function CloudOnboarding({ onDone }) {
  return (
    <div style={{ minHeight: '100vh', background: '#16191f', color: '#fff', display: 'flex', flexDirection: 'column' }}>

      {/* 히어로 */}
      <div style={{
        background: 'linear-gradient(160deg, #1a2332 0%, #0d1b2a 60%, #16191f 100%)',
        padding: '48px 40px 40px',
        borderBottom: '1px solid #2d3748',
      }}>
        <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '40px' }}>
          {/* 왼쪽: 텍스트 */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '3px', color: '#f0b429', textTransform: 'uppercase', marginBottom: '16px' }}>
              고향만두 아저씨 살아남기
            </div>
            <h1 style={{ fontSize: '36px', fontWeight: 800, lineHeight: 1.25, marginBottom: '16px' }}>
              만두만으론<br />살아남을 수 없다…
            </h1>
            <p style={{ fontSize: '14px', color: '#a0aec0', lineHeight: 1.9, margin: 0 }}>
              대한민국 자영업의 험난함을 몸소 깨달은<br />
              고향만두 아저씨.<br />
              결국 <strong style={{ color: '#f0b429' }}>클라우드</strong>를 배우기로 결심했다. <span style={{ color: '#718096' }}>ㅇㅁㅇ</span>
            </p>
          </div>

          {/* 오른쪽: 캐릭터 */}
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <SajangCharacter size={190} />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '820px', margin: '0 auto', width: '100%', padding: '48px 40px 64px' }}>

        {/* 클라우드 한 줄 정의 */}
        <div style={{
          background: '#1e2a3a', border: '1px solid #2d4a6b',
          borderRadius: '8px', padding: '24px 28px', marginBottom: '40px',
          display: 'flex', gap: '16px', alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: '28px', flexShrink: 0 }}>🥟</span>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#63b3ed', marginBottom: '6px', letterSpacing: '0.5px' }}>
              아저씨가 처음 들은 말: "클라우드가 뭔데?"
            </div>
            <p style={{ fontSize: '15px', color: '#e2e8f0', lineHeight: 1.8, margin: 0 }}>
              쉽게 말하면 <strong style={{ color: '#f6e05e' }}>남의 컴퓨터를 빌려 쓰는 것</strong>이에요.
              만두 반죽기를 사는 대신 필요할 때만 빌리는 것처럼, 아마존(AWS)의 컴퓨터를
              쓴 만큼만 돈 내고 빌려 쓰면 돼요. 안 쓰면 반납하면 그만이고요.
            </p>
          </div>
        </div>

        {/* 세 가지 재료 */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#718096', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            🥟 만두가게도 이 세 가지로 돌아가요
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[
              {
                emoji: '🖥️', name: '서버', sub: 'Compute',
                color: '#f6ad55', bg: '#2d1f0a',
                analogy: '아저씨 본인',
                desc: '"만두 주문 들어왔다!" 요청을 받아서 처리하는 두뇌예요. 아저씨가 혼자 다 처리하듯, EC2·Lambda가 이 역할이에요.',
              },
              {
                emoji: '🛣️', name: '네트워크', sub: 'Network',
                color: '#63b3ed', bg: '#0a1f2d',
                analogy: '배달 도로',
                desc: '손님 폰 → 주방 → 다시 손님 폰. 데이터가 안전하게 오가는 통로예요. VPC, API Gateway가 이 도로 역할이에요.',
              },
              {
                emoji: '📦', name: '저장소', sub: 'Storage',
                color: '#68d391', bg: '#0a2d1a',
                analogy: '냉동창고 + 장부',
                desc: '만두 재료는 냉동창고(S3)에, 주문·고객 기록은 장부(RDS)에. 필요할 때 꺼내쓰면 돼요.',
              },
            ].map(item => (
              <div key={item.name} style={{
                background: item.bg, border: `1px solid ${item.color}33`,
                borderTop: `3px solid ${item.color}`,
                borderRadius: '8px', padding: '20px',
              }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>{item.emoji}</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: item.color, marginBottom: '2px' }}>
                  {item.name}
                </div>
                <div style={{ fontSize: '11px', color: '#718096', marginBottom: '10px', letterSpacing: '0.5px' }}>
                  만두가게로는 → <span style={{ color: '#a0aec0' }}>{item.analogy}</span>
                </div>
                <p style={{ fontSize: '12px', color: '#a0aec0', lineHeight: 1.7, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 튜토리얼 미리보기 로드맵 */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#718096', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            🗺️ 아저씨의 생존 로드맵
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              { num: 1, emoji: '📄', color: '#f6ad55', title: '만두 메뉴판을 인터넷에 올리자', desc: '정적 호스팅 — 서버 없이 파일만으로 가게 소개 페이지 공개', badge: 'S3' },
              { num: 2, emoji: '📱', color: '#63b3ed', title: '앱에서 직접 만두 주문받자', desc: '3-Tier — 화면 · 서버 · DB가 협력하는 진짜 주문 시스템', badge: 'EC2 + RDS' },
              { num: 3, emoji: '🤖', color: '#b794f4', title: 'AI 직원을 뽑자 (인건비 0원)', desc: '서버리스 — Lambda + GPT로 24시간 만두 추천 AI 추가', badge: 'Lambda' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '0' }}>
                {/* 타임라인 선 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '48px', flexShrink: 0 }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: item.color, color: '#16191f',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '15px', fontWeight: 800, flexShrink: 0,
                    boxShadow: `0 0 12px ${item.color}66`,
                  }}>
                    {item.num}
                  </div>
                  {i < 2 && <div style={{ width: '2px', flex: 1, background: '#2d3748', minHeight: '24px', margin: '4px 0' }} />}
                </div>

                {/* 카드 */}
                <div style={{
                  flex: 1, marginLeft: '16px',
                  background: '#1e2533', border: '1px solid #2d3748',
                  borderRadius: '6px', padding: '14px 18px',
                  marginBottom: i < 2 ? '8px' : '0',
                  display: 'flex', alignItems: 'center', gap: '12px',
                }}>
                  <span style={{ fontSize: '24px', flexShrink: 0 }}>{item.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0', marginBottom: '3px' }}>{item.title}</div>
                    <div style={{ fontSize: '12px', color: '#718096' }}>{item.desc}</div>
                  </div>
                  <span style={{
                    fontSize: '11px', fontWeight: 700, color: item.color,
                    background: `${item.color}22`, border: `1px solid ${item.color}44`,
                    padding: '3px 10px', borderRadius: '20px', flexShrink: 0,
                  }}>
                    {item.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '15px', color: '#718096', marginBottom: '20px' }}>
            아저씨와 함께 살아남을 준비 됐나요?
          </p>
          <button
            onClick={onDone}
            style={{
              background: 'linear-gradient(90deg, #f6ad55, #ed8936)',
              color: '#16191f', border: 'none', borderRadius: '4px',
              padding: '14px 40px', fontSize: '16px', fontWeight: 800,
              cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 4px 20px rgba(246, 173, 85, 0.4)',
              transition: 'transform 0.1s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            튜토리얼 선택하러 가기 <ChevronRight size={20} />
          </button>
        </div>

      </div>
    </div>
  );
}
