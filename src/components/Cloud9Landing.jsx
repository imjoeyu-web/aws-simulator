import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function Cloud9Landing({ onCreateClick }) {
  return (
    <div style={{ width: '100%', margin: '0 auto', background: 'var(--bg-page)' }}>
      
      {/* 서브 헤더 메뉴 바 모방 */}
      <div style={{ height: '40px', background: '#fafafa', borderBottom: '1px solid var(--border-light)', padding: '0 24px', display: 'flex', alignItems: 'center', fontSize: '13px', fontWeight: 500 }}>
        <span style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>≡</span>
      </div>

      {/* Hero Banner Section */}
      <div style={{ background: '#0f1b2a', color: '#fff', padding: '40px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ maxWidth: '800px' }}>
          <div style={{ fontSize: '13px', color: '#aab7b8', marginBottom: '8px' }}>개발자 도구</div>
          <h1 style={{ fontSize: '36px', fontWeight: 700, marginBottom: '8px' }}>AWS Cloud9</h1>
          <h2 style={{ fontSize: '24px', fontWeight: 400, marginBottom: '24px', color: '#eaeded' }}>코드 작성, 실행 및 디버깅을 위한 클라우드 IDE</h2>
          <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#d5dbdb' }}>
            AWS Cloud9을 사용하면 브라우저만 이용하여 코드를 작성, 실행 및 디버깅할 수 있습니다. AWS Cloud9을 사용하면 코드 편집기, 통합 디버거 및 사전 구성된 AWS CLI가 포함된 기본 제공 터미널에 즉시 액세스할 수 있습니다.
            몇 분 안에 시작할 수 있으며 더 이상 로컬 애플리케이션을 설치하거나 개발 기계를 구성하는 데 시간을 소비하지 않아도 됩니다.
          </p>
        </div>

        {/* Floating Create Box in Hero */}
        <div style={{ background: '#fff', padding: '24px', borderRadius: '4px', width: '320px', marginLeft: '24px', position: 'relative' }}>
          <h3 style={{ color: 'var(--text-primary)', fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>새로운 AWS Cloud9 환경</h3>
          <button 
            onClick={onCreateClick}
            className="aws-btn-primary" 
            style={{ padding: '8px 24px', display: 'inline-block' }}
          >
            환경 생성
          </button>
          
          {/* 가짜 일러스트레이션 자리 */}
          <div style={{ position: 'absolute', right: '-80px', top: '10px', opacity: 0.8 }}>
            <div style={{ width: '60px', height: '40px', background: '#d15c42', borderRadius: '2px', display: 'flex', gap: '4px', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: '4px' }}>
              <div style={{ width: '8px', height: '16px', background: '#fff' }}></div>
              <div style={{ width: '8px', height: '24px', background: '#fff' }}></div>
              <div style={{ width: '8px', height: '12px', background: '#fff' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div style={{ display: 'flex', gap: '24px', padding: '32px 24px', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Left Content Area */}
        <div style={{ flex: 1 }}>
          
          {/* 작동 방식 */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>작동 방식</h2>
            <div style={{ background: '#fff', border: '1px solid var(--border-light)', padding: '24px', borderRadius: '2px' }}>
              <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
                새로운 Amazon EC2 인스턴스에 AWS Cloud9 개발 환경을 만들거나 SSH를 통해 자체 Linux 서버에 연결합니다. AWS Cloud9 환경을 만들고 나면 코드 편집기, 통합 디버거 및 사전 구성된 AWS CLI가 포함된 기본 제공 터미널을 모두 브라우저 내에서 즉시 액세스할 수 있습니다.
              </p>
              <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
                AWS Cloud9 대시보드를 사용하면 다양한 AWS Cloud9 환경을 만들 수 있고 다른 환경 간 전환이 가능합니다. 각 환경에는 특정 프로젝트에 대한 사용자 지정 도구, 런타임 및 파일이 포함되어 있습니다.
              </p>
              <a href="#" className="aws-info-link" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                자세히 알아보기 <ExternalLink size={14} />
              </a>
            </div>
          </section>

          {/* 장점 및 기능 */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>장점 및 기능</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              
              <div style={{ background: '#fff', border: '1px solid var(--border-light)', padding: '20px', borderRadius: '2px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>브라우저만으로 코딩하기</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  AWS Cloud9을 사용하면 데스크톱 IDE를 설치하거나 유지 관리할 필요 없이 브라우저만으로 애플리케이션을 작성, 실행 및 디버깅할 수 있습니다.
                </p>
              </div>

              <div style={{ background: '#fff', border: '1px solid var(--border-light)', padding: '20px', borderRadius: '2px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>실시간으로 함께 코딩하기</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  AWS Cloud9을 사용하면 코드 환경을 쉽게 공유할 수 있습니다. 팀원의 액세스 권한으로 개발 환경을 쉽게 공유하고 프로그램을 함께 페어 코딩할 수 있습니다.
                </p>
              </div>

              <div style={{ background: '#fff', border: '1px solid var(--border-light)', padding: '20px', borderRadius: '2px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>새로운 프로젝트를 빠르게 시작</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  AWS Cloud9 환경은 40개 이상의 프로그래밍 언어용 핵심 도구와 함께 사전 패키징되어 제공되므로, 단 몇 분 안에 인기 있는 애플리케이션 스택용 코드 작성을 시작할 수 있습니다.
                </p>
              </div>

              <div style={{ background: '#fff', border: '1px solid var(--border-light)', padding: '20px', borderRadius: '2px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>간편한 서버리스 애플리케이션 구축</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  AWS Cloud9은 서버리스 애플리케이션 개발을 위한 원활한 경험을 제공합니다. 리소스들을 쉽게 정의하고, 디버깅하고, 코드를 로컬 환경에서 실행하는 실제 상황 간 전환할 수 있습니다.
                </p>
              </div>

            </div>
          </section>

          {/* 관련 서비스 */}
          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>관련 서비스</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ background: '#fff', border: '1px solid var(--border-light)', padding: '20px', borderRadius: '2px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>
                  <a href="#" className="aws-info-link" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Amazon EC2 <ExternalLink size={14} />
                  </a>
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  Amazon Elastic Compute Cloud(Amazon EC2)는 클라우드에서 안전하고 크기 조정 가능한 컴퓨팅 파워를 제공하는 웹 서비스입니다. 
                </p>
                <a href="#" className="aws-info-link" style={{ fontSize: '13px' }}>자세히 알아보기 <ExternalLink size={12} style={{ display: 'inline' }} /></a>
              </div>

              <div style={{ background: '#fff', border: '1px solid var(--border-light)', padding: '20px', borderRadius: '2px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>
                  <a href="#" className="aws-info-link" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    AWS Lambda <ExternalLink size={14} />
                  </a>
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  AWS Lambda를 사용하면 서버를 프로비저닝하거나 관리하지 않고도 코드를 실행할 수 있습니다.
                </p>
                <a href="#" className="aws-info-link" style={{ fontSize: '13px' }}>자세히 알아보기 <ExternalLink size={12} style={{ display: 'inline' }} /></a>
              </div>
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <div style={{ width: '300px' }}>
          
          {/* 시작하기 패널 */}
          <div style={{ background: '#fff', border: '1px solid var(--border-light)', padding: '20px', borderRadius: '2px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              시작하기 <ExternalLink size={16} />
            </h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '16px' }}>
                <a href="#" className="aws-info-link">시작하기 안내 (2분 분량)</a>
              </li>
              <li style={{ marginBottom: '16px' }}>
                <a href="#" className="aws-info-link">환경 생성 (5분 분량)</a>
              </li>
              <li style={{ marginBottom: '16px' }}>
                <a href="#" className="aws-info-link">환경 사용하기 (15분 분량)</a>
              </li>
              <li style={{ marginBottom: '16px' }}>
                <a href="#" className="aws-info-link">IDE 사용하기 (10분 분량)</a>
              </li>
              <li>
                <a href="#" className="aws-info-link">AWS Lambda 사용하기 (5분 분량)</a>
              </li>
            </ul>
          </div>

          {/* 추가 리소스 패널 */}
          <div style={{ background: '#fff', border: '1px solid var(--border-light)', padding: '20px', borderRadius: '2px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              추가 리소스 <ExternalLink size={16} />
            </h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '16px' }}>
                <a href="#" className="aws-info-link">FAQ</a>
              </li>
              <li style={{ marginBottom: '16px' }}>
                <a href="#" className="aws-info-link">포럼</a>
              </li>
              <li>
                <a href="#" className="aws-info-link">문의처</a>
              </li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
