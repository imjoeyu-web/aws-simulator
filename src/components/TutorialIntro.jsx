import React from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';

const INTROS = {
  1: {
    emoji: '🥟',
    color: '#e07b00',
    colorLight: '#fef6ec',
    colorBorder: '#f0d9b5',
    badge: 'Tutorial 1',
    headline: '만두 메뉴판을 인터넷에 올리자',
    subheadline: '아저씨의 첫 번째 디지털 도전',
    story: [
      '고향만두 아저씨, 카카오톡에 올린 메뉴판 사진이 흐릿하다는 단골 불만을 들었어요.',
      '이번엔 제대로 된 가게 소개 웹페이지를 만들어 인터넷에 공개하려 합니다.',
      '만두 종류, 가격, 위치 정보 — 누가 봐도 항상 똑같은 내용이에요. 주문은 아직 전화로 받아요.',
    ],
    analogy: [
      { real: '🏠 가게 컴퓨터', realDesc: '메뉴판 만드는 곳', aws: '💻 Cloud9', awsDesc: '클라우드 개발 환경' },
      { real: '📄 만두 메뉴판 파일', realDesc: '사진·가격·소개글', aws: '📦 빌드 파일', awsDesc: 'HTML / CSS / JS' },
      { real: '📱 스마트폰 화면', realDesc: '손님이 접속해서 보는 곳', aws: '🪣 S3 버킷', awsDesc: '퍼블릭 정적 스토리지' },
      { real: '🙋 인터넷 손님', realDesc: '누구나 볼 수 있음', aws: '🌐 웹 브라우저', awsDesc: '정적 웹사이트 엔드포인트' },
    ],
    steps: [
      { num: 1, label: 'Cloud9 환경 세팅', desc: '클라우드 IDE를 열고 코드 다운로드' },
      { num: 2, label: '웹사이트 빌드', desc: 'npm install → npm run build' },
      { num: 3, label: 'S3 버킷 만들기', desc: '버킷 정책 + 정적 호스팅 활성화' },
      { num: 4, label: '업로드 & 배포', desc: 'aws s3 cp → 인터넷에서 확인' },
    ],
    insight: '이번 실습의 핵심은 "정적(Static)"이에요. 서버가 없어도 파일만 있으면 전 세계에 공개할 수 있어요.',
  },
  2: {
    emoji: '📱',
    color: '#0073bb',
    colorLight: '#f0f7ff',
    colorBorder: '#b3d4f0',
    badge: 'Tutorial 2',
    headline: '앱에서 직접 만두 주문받자',
    subheadline: '손님 ↔ 서버 ↔ DB, 3계층 시스템 구축',
    story: [
      '메뉴판 페이지가 입소문 나면서 손님들이 묻기 시작했어요: "그냥 앱으로 주문하면 안 돼요?"',
      '전화 주문으로는 한계가 있어요. 이제 실제로 만두 주문을 받고, 처리하고, 기록하는 시스템이 필요해요.',
      '이걸 AWS에서는 3-Tier Architecture라고 부릅니다. 화면 · 서버 · DB가 각자 역할을 분담해요.',
    ],
    analogy: [
      { real: '📲 주문 앱 화면', realDesc: '손님이 터치하는 UI', aws: '🪣 S3 + 프론트엔드', awsDesc: '정적 파일 서빙 (React)' },
      { real: '🧾 카운터 점원', realDesc: '주문 접수 · 확인 · 주방에 전달', aws: '🖥️ EC2 서버', awsDesc: '백엔드 API 처리' },
      { real: '📒 만두 주문 장부', realDesc: '모든 주문 기록 보관', aws: '🗄️ RDS (MySQL)', awsDesc: '관계형 데이터베이스' },
    ],
    steps: [
      { num: 1, label: 'EC2 인스턴스 생성', desc: '서버 컴퓨터를 클라우드에 켠다' },
      { num: 2, label: 'RDS 데이터베이스 생성', desc: 'MySQL 주문 장부 세팅' },
      { num: 3, label: '앱 배포 및 연결', desc: 'S3 프론트 + EC2 백엔드 + RDS 연동' },
      { num: 4, label: '동작 확인', desc: '실제로 데이터가 오가는지 테스트' },
    ],
    insight: '튜토리얼 1은 파일만 올렸다면, 이번엔 "요청마다 서버가 처리"해요. 손님마다 다른 만두 주문을 처리할 수 있어요.',
  },
  3: {
    emoji: '🤖',
    color: '#6b21a8',
    colorLight: '#faf5ff',
    colorBorder: '#d8b4fe',
    badge: 'Tutorial 3',
    headline: 'AI 직원 뽑자 (인건비 0원)',
    subheadline: '24시간 일하고, 쉴 때는 급여 없는 Lambda',
    story: [
      '"오늘 어떤 만두 먹을까요?" 고민하는 손님 문의가 폭주해요. 아저씨 혼자 24시간 답할 수 없어요.',
      '기존 시스템(T2)은 그대로 두고, 필요할 때만 깨어나는 AI 직원을 추가합니다.',
      'Lambda는 손님 질문이 올 때만 실행돼요. 아무도 없으면 자고 있고, 인건비도 그때만 발생해요.',
    ],
    analogy: [
      { real: '📲 기존 주문 시스템', realDesc: 'T2에서 만든 그대로', aws: '🪣 S3 + EC2 + RDS', awsDesc: '프론트 · 백엔드 · DB' },
      { real: '🤖 24시간 AI 상담원', realDesc: '필요할 때만 소환', aws: '⚡ Lambda 함수', awsDesc: '서버리스 실행 환경' },
      { real: '🧠 AI 두뇌', realDesc: '만두 추천 · 문의 응답', aws: '💬 GPT API', awsDesc: '자연어 처리 모델' },
      { real: '🔔 손님이 질문할 때만', realDesc: '평소엔 인건비 0원', aws: '📡 이벤트 트리거', awsDesc: '요청 시에만 과금' },
    ],
    steps: [
      { num: 1, label: 'Lambda 함수 생성', desc: 'GPT API를 호출하는 함수 작성' },
      { num: 2, label: 'API Gateway 연결', desc: '프론트에서 Lambda를 호출할 엔드포인트' },
      { num: 3, label: '기존 앱과 통합', desc: 'T2 시스템에 AI 채팅 기능 추가' },
      { num: 4, label: '동작 확인', desc: 'AI가 메뉴를 추천하는지 테스트' },
    ],
    insight: '"서버리스"란 서버가 없는 게 아니라 서버 관리를 AWS에 맡기는 것이에요. 코드만 올리면 알아서 실행돼요.',
  },
};

export default function TutorialIntro({ tutorialId, onStart, onBack }) {
  const data = INTROS[tutorialId];
  if (!data) return null;

  return (
    <div style={{ minHeight: '100%', background: '#f4f6f6' }}>

      {/* 히어로 헤더 */}
      <div style={{
        background: `linear-gradient(135deg, ${data.color} 0%, ${data.color}cc 100%)`,
        padding: '48px 40px 40px',
        color: '#fff',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* 뒤로가기 */}
          <button
            onClick={onBack}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.75)', cursor: 'pointer', fontSize: '13px', padding: 0, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            ← 튜토리얼 목록으로
          </button>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
            <div style={{
              fontSize: '64px', lineHeight: 1,
              background: 'rgba(255,255,255,0.15)', borderRadius: '16px',
              padding: '12px 16px', flexShrink: 0,
            }}>
              {data.emoji}
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.75, marginBottom: '8px' }}>
                {data.badge} · 배달앱으로 이해하는 AWS
              </div>
              <h1 style={{ fontSize: '30px', fontWeight: 700, marginBottom: '8px', lineHeight: 1.2 }}>
                {data.headline}
              </h1>
              <p style={{ fontSize: '16px', opacity: 0.85, margin: 0 }}>
                {data.subheadline}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 본문 */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 40px 60px' }}>

        {/* 스토리 */}
        <div style={{
          background: '#fff', border: '1px solid var(--border-light)',
          borderRadius: '4px', padding: '24px 28px', marginBottom: '24px',
        }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: data.color, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
            🥟 고향만두 아저씨 상황
          </div>
          {data.story.map((line, i) => (
            <p key={i} style={{ fontSize: '14px', color: '#16191f', lineHeight: 1.75, margin: '0 0 4px 0' }}>
              {line}
            </p>
          ))}
        </div>

        {/* 비유 테이블 */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
            🔄 배달앱 세계 vs AWS 세계
          </div>
          <div style={{ background: '#fff', border: '1px solid var(--border-light)', borderRadius: '4px', overflow: 'hidden' }}>
            {/* 헤더 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1fr', background: '#f4f6f6', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ padding: '10px 20px', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>배달앱 세계</div>
              <div />
              <div style={{ padding: '10px 20px', fontSize: '12px', fontWeight: 700, color: data.color }}>AWS 세계</div>
            </div>
            {data.analogy.map((row, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '1fr 40px 1fr',
                borderBottom: i < data.analogy.length - 1 ? '1px solid var(--border-light)' : 'none',
                alignItems: 'center',
              }}>
                <div style={{ padding: '14px 20px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '2px' }}>{row.real}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{row.realDesc}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <ArrowRight size={16} color={data.color} />
                </div>
                <div style={{ padding: '14px 20px', background: data.colorLight, borderLeft: `2px solid ${data.colorBorder}` }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '2px', color: data.color }}>{row.aws}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{row.awsDesc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 실습 스텝 미리보기 */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
            🗺️ 이번 실습에서 할 것
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {data.steps.map((step, i) => (
              <div key={i} style={{
                background: '#fff', border: '1px solid var(--border-light)',
                borderRadius: '4px', padding: '16px',
                borderTop: `3px solid ${data.color}`,
              }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: data.color, marginBottom: '6px' }}>
                  STEP {step.num}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '4px', color: '#16191f' }}>
                  {step.label}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {step.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 핵심 인사이트 */}
        <div style={{
          background: data.colorLight, border: `1px solid ${data.colorBorder}`,
          borderRadius: '4px', padding: '16px 20px', marginBottom: '32px',
          display: 'flex', alignItems: 'flex-start', gap: '12px',
        }}>
          <span style={{ fontSize: '18px', flexShrink: 0 }}>💡</span>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: data.color, marginBottom: '4px' }}>핵심 개념</div>
            <p style={{ fontSize: '13px', color: '#16191f', lineHeight: 1.6, margin: 0 }}>{data.insight}</p>
          </div>
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={onStart}
            style={{
              background: data.color, color: '#fff',
              border: 'none', borderRadius: '2px',
              padding: '12px 32px', fontSize: '15px', fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
            }}
          >
            실습 시작하기 <ChevronRight size={18} />
          </button>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            아저씨와 함께 살아남아봐요!
          </span>
        </div>
      </div>
    </div>
  );
}
