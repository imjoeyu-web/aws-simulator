import React from 'react';
import { ExternalLink, ChevronRight } from 'lucide-react';
import S3CreateForm from './S3CreateForm';
import S3BucketDetail from './S3BucketDetail';

export default function S3Console({ questState, view, setView, buckets, setBuckets, activeBucket, setActiveBucket }) {
  const handleBack = (target) => {
    setView(target || 'list');
  };

  const handleCreated = (bucketInfo) => {
    setBuckets(prev => [...prev, bucketInfo]);
    setView('list');
  };

  if (view === 'create') {
    return <S3CreateForm questState={questState} onCreated={handleCreated} onBack={handleBack} />;
  }

  const handleBucketUpdate = (updatedBucket) => {
    setBuckets(prev => prev.map(b => b.name === updatedBucket.name ? updatedBucket : b));
    setActiveBucket(updatedBucket);
  };

  if (view === 'detail' && activeBucket) {
    return <S3BucketDetail bucket={activeBucket} questState={questState} onBack={handleBack} onBucketUpdate={handleBucketUpdate} />;
  }

  // ─── 버킷 목록 화면 ───
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', paddingBottom: '40px' }}>

      {/* Breadcrumbs */}
      <div style={{ fontSize: '13px', marginBottom: '12px' }}>
        <a href="#" className="aws-info-link">Amazon S3</a>
        <ChevronRight size={13} color="var(--text-secondary)" style={{ display: 'inline', verticalAlign: 'middle', margin: '0 4px' }} />
        <span style={{ color: 'var(--text-secondary)' }}>버킷</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 600 }}>버킷</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            버킷은 S3에 저장되는 데이터의 컨테이너입니다.{' '}
            <a href="#" className="aws-info-link" style={{ fontSize: '13px' }}>자세히 알아보기 <ExternalLink size={11} style={{ display: 'inline', verticalAlign: 'middle' }} /></a>
          </p>
        </div>
        <button className="aws-btn-primary" onClick={() => setView('create')}>버킷 만들기</button>
      </div>

      {/* 버킷 테이블 */}
      <div style={{ background: '#fff', border: '1px solid var(--border-light)' }}>
        {/* 검색 + 필터 바 */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '12px', background: '#fafafa' }}>
          <input
            placeholder="버킷 이름으로 찾기"
            className="aws-input"
            style={{ maxWidth: '300px', fontSize: '13px', padding: '5px 10px' }}
            readOnly
          />
          <button className="aws-input" style={{ width: 'auto', background: '#fff', padding: '5px 12px', fontSize: '13px' }}>새로 고침</button>
        </div>

        {/* 컬럼 헤더 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2.5fr 1fr 1.5fr 1.5fr',
          padding: '10px 16px',
          borderBottom: '1px solid var(--border-light)',
          background: '#fafafa',
          fontSize: '13px',
          fontWeight: 700,
          color: 'var(--text-secondary)'
        }}>
          <span>이름</span>
          <span>AWS 리전</span>
          <span>액세스</span>
          <span>생성 날짜</span>
        </div>

        {buckets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
            버킷이 없습니다.<br />
            <span style={{ fontSize: '13px' }}>버킷을 만들어 데이터 저장을 시작하세요.</span>
          </div>
        ) : (
          buckets.map((b, i) => (
            <div key={i} style={{
              display: 'grid',
              gridTemplateColumns: '2.5fr 1fr 1.5fr 1.5fr',
              padding: '12px 16px',
              borderBottom: '1px solid var(--border-light)',
              alignItems: 'center',
              cursor: 'pointer',
            }}
              onClick={() => { setActiveBucket(b); setView('detail'); }}
            >
              <a className="aws-info-link" style={{ fontWeight: 600, fontSize: '14px' }}>{b.name}</a>
              <span style={{ fontSize: '13px' }}>ap-northeast-2</span>
              <span style={{ fontSize: '13px', color: b.public ? '#d13212' : 'var(--text-secondary)' }}>
                {b.public ? '객체를 퍼블릭으로 설정할 수 있음' : '버킷 및 객체가 퍼블릭이 아님'}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{new Date().toLocaleDateString('ko-KR')}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
