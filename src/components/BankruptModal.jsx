import { useEffect, useState } from 'react';
import SajangCharacter from './SajangCharacter';

export default function BankruptModal({ onRestart }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.4s ease',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '40px 48px',
        maxWidth: '480px',
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'transform 0.4s ease',
      }}>

        {/* 아저씨 (걱정 표정) */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
          <SajangCharacter size={80} mood="worried" />
        </div>

        {/* 타이틀 */}
        <div style={{ fontSize: '13px', color: '#e53e3e', fontWeight: 700, letterSpacing: '1px', marginBottom: '8px' }}>
          💸 AWS 파산
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#16191f', marginBottom: '8px' }}>
          고향으로 돌아갑니다...
        </h2>
        <p style={{ fontSize: '14px', color: '#545b64', lineHeight: 1.6, marginBottom: '24px' }}>
          크레딧이 모두 소진되었어요.<br/>
          아저씨의 클라우드 꿈은 여기서 끝났습니다. 😢
        </p>

        {/* 청구서 */}
        <div style={{
          background: '#fff5f5',
          border: '1px solid #fcc',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '28px',
          textAlign: 'left',
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#e53e3e', marginBottom: '8px', letterSpacing: '0.5px' }}>
            📄 이번 달 AWS 청구서
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#545b64', marginBottom: '4px' }}>
            <span>사용 크레딧</span>
            <span style={{ fontWeight: 700, color: '#e53e3e' }}>$100.00</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#545b64' }}>
            <span>남은 크레딧</span>
            <span style={{ fontWeight: 700 }}>$0.00</span>
          </div>
          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #fcc', fontSize: '12px', color: '#e53e3e' }}>
            💡 다음엔 리소스를 쓰지 않을 때 꼭 삭제하세요!
          </div>
        </div>

        {/* 재시작 버튼 */}
        <button
          onClick={onRestart}
          style={{
            background: '#e53e3e',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '12px 32px',
            fontSize: '15px',
            fontWeight: 700,
            cursor: 'pointer',
            width: '100%',
            transition: 'background 0.2s',
          }}
          onMouseOver={e => e.target.style.background = '#c53030'}
          onMouseOut={e => e.target.style.background = '#e53e3e'}
        >
          다시 도전하기
        </button>
      </div>
    </div>
  );
}
