import { ChevronRight } from 'lucide-react';

const INTROS = {
  1: {
    color: '#e07b00', badge: 'TUTORIAL 1',
    headline: '가게 홍보 홈페이지 만들기',
    story: '덤플링클럽은 앱으로 주문받는데 나는 아직 전화로 받고 있어... 일단 가게 소개 홈페이지라도 만들어서 인터넷에 올려보자!',
    analogy: [
      { real: '🏠 가게 컴퓨터', aws: '💻 Cloud9' },
      { real: '📄 메뉴판 파일', aws: '📦 빌드 파일 (HTML/JS)' },
      { real: '📱 손님 스마트폰', aws: '🪣 S3 버킷' },
    ],
    steps: [
      { num: 1, label: 'Cloud9 세팅' },
      { num: 2, label: '웹사이트 빌드' },
      { num: 3, label: 'S3 버킷 생성' },
      { num: 4, label: '업로드 & 배포' },
    ],
    insight: '서버 없이 파일만 있으면 전 세계에 공개 가능 — 이게 "정적 호스팅"이에요.',
  },
  2: {
    color: '#0073bb', badge: 'TUTORIAL 2',
    headline: '만두 주문 앱 만들기',
    story: '"그냥 앱으로 주문하면 안 돼요?" 전화 주문으론 한계가 있어요. 이제 3계층 주문 시스템을 만들어봐요!',
    analogy: [
      { real: '📲 주문 앱 화면', aws: '🪣 S3 + React' },
      { real: '🧾 카운터 점원', aws: '🖥️ EC2 서버' },
      { real: '📒 주문 장부', aws: '🗄️ RDS (MySQL)' },
    ],
    steps: [
      { num: 1, label: 'EC2 생성' },
      { num: 2, label: 'RDS 생성' },
      { num: 3, label: '앱 배포' },
      { num: 4, label: '동작 확인' },
    ],
    insight: '튜토리얼 1은 파일만 올렸다면, 이번엔 서버가 요청을 처리해요.',
  },
  3: {
    color: '#6b21a8', badge: 'TUTORIAL 3',
    headline: 'AI 직원 뽑기 (인건비 0원)',
    story: '"오늘 어떤 만두 먹을까요?" 문의가 폭주해요. 필요할 때만 깨어나는 AI 직원을 추가합니다!',
    analogy: [
      { real: '🤖 AI 상담원', aws: '⚡ Lambda 함수' },
      { real: '🧠 AI 두뇌', aws: '💬 GPT API' },
      { real: '🔔 질문할 때만', aws: '📡 이벤트 트리거' },
    ],
    steps: [
      { num: 1, label: 'Lambda 생성' },
      { num: 2, label: 'API Gateway' },
      { num: 3, label: '기존 앱 통합' },
      { num: 4, label: '동작 확인' },
    ],
    insight: '"서버리스" = 서버 관리를 AWS에 맡기는 것. 코드만 올리면 알아서 실행돼요.',
  },
};

export default function TutorialIntro({ tutorialId, onStart, onBack }) {
  const data = INTROS[tutorialId];
  if (!data) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <img src="/bgi_intro.png" alt="인트로 배경" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />

      {/* 뒤로가기 */}
      <button onClick={onBack} style={{ position: 'absolute', top: '3%', left: '2%', zIndex: 10, background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '12px', padding: '5px 12px', borderRadius: '20px', fontWeight: 700 }}>
        ← 목록으로
      </button>

      {/* 칠판 위 오버레이 — 오른쪽, 화면 높이에 맞게 자동 조정 */}
      <div style={{
        position: 'absolute', left: '38%', right: '8%', top: '8%', bottom: '6%',
        zIndex: 1,
        display: 'flex', flexDirection: 'column', gap: 'clamp(7px, 1.4vh, 14px)',
        justifyContent: 'center', padding: '0 clamp(14px, 2vw, 24px) 0 clamp(6px, 0.8vw, 12px)',
        boxSizing: 'border-box', overflowX: 'hidden',
      }}>
        {/* 배지 + 제목 */}
        <div>
          <div style={{ fontSize: 'clamp(10px, 1.2vh, 12px)', fontWeight: 800, color: data.color, letterSpacing: '2px', marginBottom: 'clamp(2px, 0.5vh, 5px)' }}>{data.badge}</div>
          <h1 style={{ fontSize: 'clamp(18px, 2.8vh, 26px)', fontWeight: 900, color: '#3d1c00', margin: 0, lineHeight: 1.2 }}>{data.headline}</h1>
        </div>

        {/* 스토리 */}
        <div style={{ background: 'rgba(255,255,255,0.96)', borderRadius: '10px', padding: 'clamp(9px, 1.4vh, 15px)', border: `2px solid ${data.color}50` }}>
          <div style={{ fontSize: 'clamp(10px, 1.2vh, 12px)', fontWeight: 800, color: data.color, letterSpacing: '0.5px', marginBottom: 'clamp(3px, 0.6vh, 6px)' }}>🥟 아저씨 상황</div>
          <p style={{ fontSize: 'clamp(12px, 1.5vh, 15px)', color: '#3d1c00', lineHeight: 1.55, margin: 0 }}>{data.story}</p>
        </div>

        {/* 비유 */}
        <div style={{ background: 'rgba(255,255,255,0.96)', borderRadius: '10px', padding: 'clamp(9px, 1.4vh, 15px)', border: `2px solid ${data.color}50` }}>
          <div style={{ fontSize: 'clamp(10px, 1.2vh, 12px)', fontWeight: 800, color: data.color, letterSpacing: '0.5px', marginBottom: 'clamp(5px, 0.9vh, 9px)' }}>🔄 배달앱 → AWS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(5px, 0.9vh, 8px)' }}>
            {data.analogy.map((row, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: 'clamp(12px, 1.5vh, 15px)', color: '#3d1c00', fontWeight: 600, flex: 1 }}>{row.real}</span>
                <ChevronRight size={18} strokeWidth={2.5} style={{ flexShrink: 0, color: data.color }} />
                <span style={{ fontSize: 'clamp(12px, 1.5vh, 15px)', color: data.color, fontWeight: 700, flex: 1 }}>{row.aws}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 스텝 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
          {data.steps.map((step) => (
            <div key={step.num} style={{ background: 'rgba(255,255,255,0.96)', borderRadius: '8px', padding: 'clamp(6px, 1vh, 10px)', textAlign: 'center', borderTop: `3px solid ${data.color}` }}>
              <div style={{ fontSize: 'clamp(10px, 1.2vh, 12px)', fontWeight: 800, color: data.color }}>STEP {step.num}</div>
              <div style={{ fontSize: 'clamp(11px, 1.4vh, 13px)', fontWeight: 700, color: '#3d1c00', marginTop: '2px' }}>{step.label}</div>
            </div>
          ))}
        </div>

        {/* 인사이트 + 버튼 */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ flex: 1, background: `${data.color}18`, border: `1.5px solid ${data.color}50`, borderRadius: '8px', padding: 'clamp(8px, 1.3vh, 12px)', fontSize: 'clamp(11px, 1.4vh, 14px)', color: '#3d1c00', lineHeight: 1.5 }}>
            💡 {data.insight}
          </div>
          <button
            onClick={onStart}
            style={{
              background: data.color, color: '#fff', border: 'none', borderRadius: '10px',
              padding: 'clamp(10px, 1.5vh, 14px) clamp(14px, 1.5vw, 18px)', fontSize: 'clamp(12px, 1.6vh, 15px)', fontWeight: 900,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
              boxShadow: `0 3px 0 ${data.color}88`, whiteSpace: 'nowrap',
              transition: 'transform 0.1s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            시작하기 <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
