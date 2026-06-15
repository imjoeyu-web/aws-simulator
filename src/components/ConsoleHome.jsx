import React, { useState } from 'react';

const SERVICE_ICON = {
  cloud9:  { label: 'Cloud9',  bg: '#1a9c3e', text: 'C9'  },
  s3:      { label: 'S3',      bg: '#7b2d8b', text: 'S3'  },
  ec2:     { label: 'EC2',     bg: '#e07b00', text: 'EC2' },
  rds:     { label: 'RDS',     bg: '#1a7cc2', text: 'RDS' },
  lambda:  { label: 'Lambda',  bg: '#e07b00', text: 'λ'   },
  terminal:{ label: 'Terminal',bg: '#232f3e', text: '>_'  },
};

const SOLUTIONS = {
  '인공 지능': [
    { title: '최소한의 코딩으로 생성형 AI 애플리케이션 출시', time: '10분' },
    { title: '대화형 AI 기반 비즈니스 애플리케이션 배포', time: '35분' },
    { title: '개발부터 생산까지 기계 학습 모델 구축', time: '3분' },
    { title: '코딩 오류 탐지 및 해결', time: '15분' },
  ],
  '보안': [
    { title: 'AWS IAM을 사용하여 권한 관리', time: '20분' },
    { title: '멀티 계정 보안 전략 구성', time: '30분' },
    { title: 'CloudTrail로 감사 로그 활성화', time: '10분' },
    { title: 'VPC 보안 그룹 모범 사례', time: '15분' },
  ],
  '인프라': [
    { title: 'EC2 Auto Scaling 구성', time: '25분' },
    { title: 'CloudFormation으로 인프라 코드화', time: '40분' },
    { title: 'Elastic Load Balancer 설정', time: '20분' },
    { title: 'VPC 및 서브넷 설계', time: '30분' },
  ],
  '데이터베이스': [
    { title: 'RDS Multi-AZ 배포 구성', time: '30분' },
    { title: 'DynamoDB 테이블 생성 및 쿼리', time: '15분' },
    { title: 'Aurora Serverless 설정', time: '20분' },
    { title: 'ElastiCache 캐싱 전략', time: '25분' },
  ],
};

const NOTICES = [
  { month: '6월', day: '10', title: 'Amazon SageMaker Unified Studio 노트북, 이제 EMR Serverless 지원' },
  { month: '6월', day: '10', title: 'Amazon S3 Access Grants, 이제 AWS European Sovereign Cloud(독일) 리전에서 사용 가능' },
  { month: '6월', day: '10', title: 'AWS FinOps 에이전트, 이제 청구서로 사용 가능' },
  { month: '6월', day: '9',  title: 'Amazon EKS에 대한 AWS Backup 지원, 이제 AWS European Sovereign Cloud(독일) 리전에서 사용 가능' },
];

const BLOGS = [
  { month: '6월', day: '12', title: 'AWS Graviton5 프로세서 기반 Amazon EC2 M9g 및 M9gd 인스턴스 정식 출시' },
  { month: '6월', day: '10', title: 'Sim-to-Real과 Real-to-Sim: 유능한 Physical AI를 가능하게 하는 핵심 엔진' },
  { month: '6월', day: '10', title: 'AWS 공간 데이터를 활용한 건물 검사 인텔리전스 구축' },
  { month: '6월', day: '8',  title: 'AWS와 NVIDIA의 Physical AI 가속화: 시뮬레이션 실제 학습을 통한 프로덕션 레디 애플리케이션 구축' },
];

function Widget({ children, style = {}, span = 1 }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #d5dbdb',
      borderRadius: '0px',
      padding: '16px 20px',
      gridColumn: `span ${span}`,
      position: 'relative',
      ...style,
    }}>
      {children}
      {/* 우측 하단 리사이즈 핸들 */}
      <div style={{
        position: 'absolute', bottom: '6px', right: '8px',
        color: '#aab7b8', fontSize: '12px', cursor: 'pointer', lineHeight: 1,
        transform: 'rotate(45deg)',
      }}>✎</div>
    </div>
  );
}

function WidgetHeader({ title, sub }) {
  return (
    <div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eaeded' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#687078', fontSize: '11px', fontWeight: 900, letterSpacing: '-1px' }}>⠿⠿</span>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#16191f' }}>{title}</span>
          <a style={{ fontSize: '12px', color: '#0073bb', cursor: 'pointer', textDecoration: 'none' }}>정보</a>
        </div>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#687078', fontSize: '20px', lineHeight: 1, padding: '0 2px' }}>⋮</button>
      </div>
      {sub && <div style={{ fontSize: '12px', color: '#687078', marginTop: '2px' }}>{sub}</div>}
    </div>
  );
}

function ServiceIconBox({ svc }) {
  const m = SERVICE_ICON[svc];
  if (!m) return null;
  return (
    <div style={{
      width: '28px', height: '28px', borderRadius: '3px',
      background: m.bg, display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexShrink: 0,
    }}>
      <span style={{ fontSize: '9px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>{m.text}</span>
    </div>
  );
}

function FooterLink({ children }) {
  return (
    <button style={{
      fontSize: '12px', color: '#0073bb', background: 'none',
      border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '3px',
    }}>
      {children} <span style={{ fontSize: '10px' }}>↗</span>
    </button>
  );
}

export default function ConsoleHome({ tutorial, questState, onNavigate }) {
  const [activeTab, setActiveTab] = useState('인공 지능');
  const availableServices = tutorial?.services
    ?.map(s => s.toLowerCase())
    ?.filter(s => SERVICE_ICON[s]) ?? ['cloud9', 's3'];
  const currentStep = questState?.currentStep;
  const color = tutorial?.color ?? '#e07b00';

  return (
    <div style={{ background: '#f2f3f3', minHeight: '100%' }}>

      {/* 페이지 헤더 */}
      <div style={{
        padding: '16px 28px 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#16191f', display: 'flex', alignItems: 'center', gap: '6px' }}>
          콘솔 홈
          <a style={{ fontSize: '13px', fontWeight: 400, color: '#0073bb', cursor: 'pointer' }}>정보</a>
        </h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{
            background: '#fff', border: '1px solid #687078', borderRadius: '2px',
            padding: '5px 14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', color: '#16191f',
          }}>기본 레이아웃으로 재설정</button>
          <button style={{
            background: '#ff9900', border: '1px solid #c97900', borderRadius: '2px',
            padding: '5px 14px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', color: '#111',
          }}>+ 위젯 추가</button>
        </div>
      </div>

      <div style={{ padding: '0 28px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* ── 1행: 4컬럼 ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>

          {/* 최근에 방문한 서비스 */}
          <Widget>
            <WidgetHeader title="최근에 방문한 서비스" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {availableServices.map(svc => (
                <button key={svc} onClick={() => onNavigate(svc)}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 6px', background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', borderRadius: '2px' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f4f6f6'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <ServiceIconBox svc={svc} />
                  <span style={{ fontSize: '13px', color: '#0073bb' }}>{SERVICE_ICON[svc]?.label}</span>
                </button>
              ))}
            </div>
            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #eaeded' }}>
              <FooterLink>모든 서비스 보기</FooterLink>
            </div>
          </Widget>

          {/* 현재 미션 (애플리케이션 자리) */}
          <Widget>
            <WidgetHeader
              title={`미션 현황 (${questState?.completedSteps?.length ?? 0})`}
              sub={tutorial?.subtitle}
            />
            {currentStep ? (
              <>
                <div style={{
                  background: '#fdf6ec', border: '1px solid #f0d9b5',
                  borderLeft: `3px solid ${color}`,
                  padding: '10px 12px', marginBottom: '10px',
                }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#c45000', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>현재 진행 중</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#16191f', marginBottom: '3px' }}>{currentStep.title}</div>
                  <div style={{ fontSize: '11px', color: '#545b64', lineHeight: 1.5 }}>
                    {currentStep.description?.length > 70 ? currentStep.description.slice(0, 70) + '…' : currentStep.description}
                  </div>
                </div>
                {currentStep.service && SERVICE_ICON[currentStep.service] && (
                  <button onClick={() => onNavigate(currentStep.service)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '7px 10px', background: color + '10',
                      border: `1px solid ${color}44`, borderRadius: '2px', cursor: 'pointer',
                    }}
                  >
                    <ServiceIconBox svc={currentStep.service} />
                    <span style={{ fontSize: '13px', fontWeight: 600, color }}>{SERVICE_ICON[currentStep.service].label} 열기 →</span>
                  </button>
                )}
              </>
            ) : (
              <div style={{ fontSize: '13px', color: '#687078', textAlign: 'center', padding: '20px 0' }}>
                진행 중인 미션이 없습니다.
              </div>
            )}
            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #eaeded' }}>
              <FooterLink>myApplications 이동</FooterLink>
            </div>
          </Widget>

          {/* AWS 시작 */}
          <Widget>
            <WidgetHeader title="AWS 시작" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { icon: '🚀', label: 'AWS 시작하기', desc: 'AWS를 최대한 활용하는 데 도움이 되는 기초 지식을 배우고 유용한 정보를 찾아봅니다.' },
                { icon: '🎓', label: '교육 및 자격증', desc: 'AWS 전문가로부터 배우고 기술과 지식을 발전시킵니다.' },
                { icon: '🏗️', label: 'AWS Builder 센터', desc: 'AWS 커뮤니티에서 배우고, 구축하고, 빌더와 소통하세요.' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', background: '#f4f6f6', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', color: '#0073bb', fontWeight: 600, marginBottom: '2px', cursor: 'pointer' }}>{item.label} ↗</div>
                    <div style={{ fontSize: '11px', color: '#545b64', lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </Widget>

          {/* AWS Health */}
          <Widget>
            <WidgetHeader title="AWS Health" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: '열린 문제', value: '0', sub: '지난 7일' },
                { label: '예정된 변경 사항', value: '0', sub: '향후 7일 및 지난 7일' },
                { label: '기타 알림', value: '0', sub: '지난 7일' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '13px', color: '#16191f' }}>{row.label}</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '22px', fontWeight: 700, color: '#16191f', lineHeight: 1 }}>{row.value}</div>
                    <div style={{ fontSize: '10px', color: '#687078' }}>{row.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #eaeded' }}>
              <FooterLink>AWS Health로 이동</FooterLink>
            </div>
          </Widget>
        </div>

        {/* ── 2행: 1+2+1 ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>

          {/* 비용 및 사용량 */}
          <Widget>
            <WidgetHeader title="비용 및 사용량" />
            <div style={{ marginBottom: '6px' }}>
              <div style={{ fontSize: '11px', color: '#687078', marginBottom: '1px' }}>이번 달</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'monospace' }}>US$0.00</span>
                <span style={{ fontSize: '12px', color: '#1d8102', fontWeight: 600 }}>↓ 100%</span>
              </div>
            </div>
            <div style={{ marginBottom: '6px' }}>
              <div style={{ fontSize: '11px', color: '#687078', marginBottom: '1px' }}>예상 월말</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'monospace' }}>US$0.00</span>
                <span style={{ fontSize: '12px', color: '#1d8102', fontWeight: 600 }}>↓ 100%</span>
              </div>
            </div>
            <div style={{ fontSize: '11px', color: '#687078', marginBottom: '10px' }}>
              절감 기회 <span style={{ color: '#0073bb' }}>① 활성화하지 않음</span>
            </div>
            {/* 차트 */}
            <div style={{ fontSize: '11px', color: '#687078', marginBottom: '6px', fontWeight: 600 }}>비용(US$)</div>
            <div style={{ position: 'relative', height: '80px', marginBottom: '6px' }}>
              {/* Y축 라인 */}
              {[0, 25, 50, 75].map(v => (
                <div key={v} style={{ position: 'absolute', bottom: `${v}%`, left: 0, right: 0, height: '1px', background: '#eaeded' }} />
              ))}
              {/* 바 */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', gap: '4px', padding: '0 4px' }}>
                {[
                  [0.3, 0.15, 0.05, 0.07, 0.03],
                  [0.5, 0.25, 0.08, 0.1, 0.04],
                  [0.4, 0.2, 0.06, 0.08, 0.03],
                  [0.6, 0.3, 0.1, 0.12, 0.05],
                  [0.2, 0.1, 0.04, 0.05, 0.02],
                  [0.1, 0.05, 0.02, 0.03, 0.01],
                ].map((stack, i) => {
                  const colors = ['#1a7cc2', '#e07b00', '#1d8102', '#7b2d8b', '#e53e3e'];
                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column-reverse', height: '100%', justifyContent: 'flex-start' }}>
                      {stack.map((h, j) => (
                        <div key={j} style={{ height: `${h * 100}%`, background: colors[j], flexShrink: 0 }} />
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
            {/* X축 라벨 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#687078', marginBottom: '8px', padding: '0 4px' }}>
              {['26년 1월', '26년 2월', '26년 3월', '26년 4월', '26년 5월', '26년 6월'].map(m => (
                <span key={m}>{m}</span>
              ))}
            </div>
            {/* 범례 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
              {[
                { color: '#1a7cc2', label: 'EC2 - Other' },
                { color: '#e07b00', label: 'Relational Database Service' },
                { color: '#1d8102', label: 'Tax' },
                { color: '#7b2d8b', label: 'Virtual Private Cloud' },
                { color: '#e53e3e', label: 'WAF' },
              ].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <div style={{ width: '8px', height: '8px', background: l.color, borderRadius: '1px' }} />
                  <span style={{ fontSize: '10px', color: '#687078' }}>{l.label}</span>
                </div>
              ))}
            </div>
            <div style={{ paddingTop: '10px', borderTop: '1px solid #eaeded' }}>
              <FooterLink>과금 정보 및 비용 관리로 이동</FooterLink>
            </div>
          </Widget>

          {/* 솔루션 (span 2) */}
          <Widget span={2}>
            <WidgetHeader title={`솔루션 (${Object.values(SOLUTIONS).flat().length})`} />
            <div style={{ fontSize: '12px', color: '#687078', marginBottom: '10px' }}>
              널리 사용되는 비즈니스 및 기술 사용 사례에 대해 AWS의 검증된 솔루션
            </div>
            {/* 탭 */}
            <div style={{ display: 'flex', borderBottom: '1px solid #eaeded', marginBottom: '12px', gap: 0 }}>
              {Object.keys(SOLUTIONS).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '6px 14px', fontSize: '13px', fontWeight: 600,
                    border: 'none', background: 'none', cursor: 'pointer',
                    borderBottom: activeTab === tab ? '2px solid #0073bb' : '2px solid transparent',
                    color: activeTab === tab ? '#0073bb' : '#545b64',
                    marginBottom: '-1px',
                  }}
                >
                  {tab} ({SOLUTIONS[tab].length})
                </button>
              ))}
            </div>
            {/* 솔루션 목록 */}
            <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
              {(SOLUTIONS[activeTab] ?? []).map((sol, i) => (
                <div key={i} style={{
                  padding: '9px 0', borderBottom: i < SOLUTIONS[activeTab].length - 1 ? '1px solid #f4f6f6' : 'none',
                }}>
                  <div style={{ fontSize: '13px', color: '#0073bb', cursor: 'pointer', marginBottom: '2px' }}>
                    {sol.title} ↗
                  </div>
                  <div style={{ fontSize: '11px', color: '#687078' }}>
                    완료하는 데 걸리는 시간: {sol.time}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ paddingTop: '10px', borderTop: '1px solid #eaeded', marginTop: '8px' }}>
              <FooterLink>AWS Solutions Library로 이동</FooterLink>
            </div>
          </Widget>

          {/* AWS 살펴보기 */}
          <Widget>
            <WidgetHeader title="AWS 살펴보기" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { title: 'Amazon Redshift', desc: '쿼리를 데이터 레이크로 확장할 수 있는 빠르고 간단하며 비용 효율적인 데이터 웨어하우스입니다.' },
                { title: 'Amazon S3', desc: '이를 이용하여 AWS에서 백업 및 복원 솔루션을 구축하여 비용을 절감하고 있는지에 대해 알아보세요.' },
                { title: 'AWS Fargate', desc: '서버 또는 클러스터를 관리할 필요 없이 컨테이너를 실행하고 규모를 조정합니다.' },
                { title: 'AWS Marketplace', desc: 'AWS에서 실행되는 인기 있는 소프트웨어 제품을 검색하여 구매 및 배포할 수 있습니다.' },
              ].map(item => (
                <div key={item.title}>
                  <div style={{ fontSize: '13px', color: '#0073bb', fontWeight: 600, marginBottom: '3px', cursor: 'pointer' }}>{item.title} ↗</div>
                  <div style={{ fontSize: '11px', color: '#545b64', lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </Widget>
        </div>

        {/* ── 3행: 4컬럼 ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>

          {/* Security */}
          <Widget>
            <WidgetHeader title="Security" sub="리전: 아시아 태평양 (서울)" />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0 10px' }}>
              {/* 쉴드 아이콘 */}
              <svg width="52" height="52" viewBox="0 0 52 52" fill="none" style={{ marginBottom: '10px' }}>
                <path d="M26 4L6 12V26C6 37 15 47 26 50C37 47 46 37 46 26V12L26 4Z" stroke="#aab7b8" strokeWidth="2" fill="none"/>
                <circle cx="26" cy="26" r="6" stroke="#aab7b8" strokeWidth="1.5" fill="none"/>
                <line x1="26" y1="20" x2="26" y2="16" stroke="#aab7b8" strokeWidth="1.5"/>
              </svg>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#16191f', marginBottom: '6px' }}>보안 데이터 없음</div>
              <div style={{ fontSize: '12px', color: '#545b64', textAlign: 'center', lineHeight: 1.6, marginBottom: '14px' }}>
                Security Hub를 사용하여 우선순위가 가장 높은 조사 결과 및 보안 태세를 신속하게 평가하세요.
              </div>
              <button style={{
                background: '#fff', border: '1px solid #687078', borderRadius: '2px',
                padding: '5px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              }}>시작하기</button>
            </div>
            <div style={{ paddingTop: '10px', borderTop: '1px solid #eaeded' }}>
              <FooterLink>Security Hub로 이동</FooterLink>
            </div>
          </Widget>

          {/* 최신 공지 */}
          <Widget>
            <WidgetHeader title="최신 공지" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {NOTICES.map((n, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '10px', alignItems: 'flex-start',
                  padding: '8px 0',
                  borderBottom: i < NOTICES.length - 1 ? '1px solid #f4f6f6' : 'none',
                }}>
                  <div style={{ flexShrink: 0, textAlign: 'center', minWidth: '28px' }}>
                    <div style={{ fontSize: '10px', color: '#687078' }}>{n.month}</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#16191f', lineHeight: 1 }}>{n.day}</div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#0073bb', cursor: 'pointer', lineHeight: 1.5 }}>{n.title} ↗</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '8px', paddingTop: '10px', borderTop: '1px solid #eaeded' }}>
              <FooterLink>모든 공지 사항 보기</FooterLink>
            </div>
          </Widget>

          {/* 최근 AWS 블로그 게시물 */}
          <Widget>
            <WidgetHeader title="최근 AWS 블로그 게시물" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {BLOGS.map((b, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '10px', alignItems: 'flex-start',
                  padding: '8px 0',
                  borderBottom: i < BLOGS.length - 1 ? '1px solid #f4f6f6' : 'none',
                }}>
                  <div style={{ flexShrink: 0, textAlign: 'center', minWidth: '28px' }}>
                    <div style={{ fontSize: '10px', color: '#687078' }}>{b.month}</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#16191f', lineHeight: 1 }}>{b.day}</div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#0073bb', cursor: 'pointer', lineHeight: 1.5 }}>{b.title} ↗</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '8px', paddingTop: '10px', borderTop: '1px solid #eaeded' }}>
              <FooterLink>모든 블로그 게시물 보기</FooterLink>
            </div>
          </Widget>

          {/* Trusted Advisor */}
          <Widget>
            <WidgetHeader title="Trusted Advisor" />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0 10px' }}>
              <svg width="52" height="52" viewBox="0 0 52 52" fill="none" style={{ marginBottom: '10px' }}>
                <path d="M26 4L6 12V26C6 37 15 47 26 50C37 47 46 37 46 26V12L26 4Z" stroke="#0073bb" strokeWidth="2" fill="#e8f4fb"/>
                <path d="M26 16V28" stroke="#0073bb" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="26" cy="34" r="1.5" fill="#0073bb"/>
              </svg>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#16191f', marginBottom: '6px' }}>권장 사항 없음</div>
              <div style={{ fontSize: '12px', color: '#545b64', textAlign: 'center', lineHeight: 1.6 }}>
                AWS Business 또는 AWS Enterprise support 플랜이 없습니다.
              </div>
            </div>
            <div style={{ paddingTop: '10px', borderTop: '1px solid #eaeded' }}>
              <FooterLink>Trusted Advisor로 이동</FooterLink>
            </div>
          </Widget>
        </div>

        {/* ── 하단 바 ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
          <button style={{ fontSize: '13px', color: '#0073bb', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 600 }}>
            다른 위젯을 보고 싶다면 알려주세요!
          </button>
          <button style={{
            background: '#ff9900', border: '1px solid #c97900', borderRadius: '2px',
            padding: '5px 14px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', color: '#111',
          }}>+ 위젯 추가</button>
        </div>

      </div>
    </div>
  );
}
