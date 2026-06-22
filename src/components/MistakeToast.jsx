import SajangCharacter from './SajangCharacter';

export default function MistakeToast({ event }) {
  if (!event) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '28px',
      right: '28px',
      zIndex: 500,
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      background: '#1a1d23',
      border: '1px solid #2d3748',
      borderLeft: '4px solid #e53e3e',
      borderRadius: '10px',
      padding: '14px 20px 14px 14px',
      minWidth: '320px',
      maxWidth: '400px',
      boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
      animation: 'toast-slide 4s cubic-bezier(0.22,1,0.36,1) forwards',
      pointerEvents: 'none',
    }}>
      <div style={{ flexShrink: 0 }}>
        <SajangCharacter size={56} mood="worried" />
      </div>

      <div style={{ flex: 1 }}>
        {/* 라벨 */}
        <div style={{
          fontSize: '10px', fontWeight: 800,
          color: '#e53e3e', letterSpacing: '1.5px',
          textTransform: 'uppercase', marginBottom: '5px',
        }}>
          ⚠ 실수 발생
        </div>

        {/* 이벤트 타이틀 */}
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#f7fafc', marginBottom: '4px' }}>
          {event.label}
        </div>

        {/* 아저씨 대사 */}
        <div style={{ fontSize: '12px', color: '#a0aec0', marginBottom: '8px', lineHeight: 1.4 }}>
          {event.message}
        </div>

        {/* 크레딧 패널티 뱃지 */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '5px',
          background: 'rgba(229,62,62,0.12)',
          border: '1px solid rgba(229,62,62,0.3)',
          borderRadius: '4px', padding: '3px 8px',
        }}>
          <span style={{ fontSize: '10px', color: '#e53e3e' }}>💸</span>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#e53e3e', fontFamily: 'monospace' }}>
            크레딧 -{Math.abs(event.delta)}
          </span>
        </div>
      </div>
    </div>
  );
}
