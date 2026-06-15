import React, { useState } from 'react';
import { ChevronRight, ExternalLink, AlertTriangle } from 'lucide-react';

export default function S3CreateForm({ questState, onCreated, onBack }) {
  const [bucketName, setBucketName] = useState('');
  const [bucketType, setBucketType] = useState('general'); // 'general' | 'directory'
  
  // 퍼블릭 액세스 차단 설정
  const [blockAll, setBlockAll] = useState(true);
  const [blockNewAcl, setBlockNewAcl] = useState(true);
  const [blockAnyAcl, setBlockAnyAcl] = useState(true);
  const [blockNewPolicy, setBlockNewPolicy] = useState(true);
  const [blockAnyPolicy, setBlockAnyPolicy] = useState(true);
  const [acknowledged, setAcknowledged] = useState(false);

  const isS3Step = questState.currentStep.id.includes('s3_create');
  const allPublicBlocked = blockAll;

  // 모든 퍼블릭 액세스 차단 토글 시 하위 체크박스도 동기화
  const handleBlockAll = (checked) => {
    setBlockAll(checked);
    setBlockNewAcl(checked);
    setBlockAnyAcl(checked);
    setBlockNewPolicy(checked);
    setBlockAnyPolicy(checked);
    if (checked) setAcknowledged(false);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!bucketName) return;
    if (!allPublicBlocked && !acknowledged) return; // 퍼블릭 해제 시 acknowledgement 필수

    if (isS3Step && !allPublicBlocked) {
      questState.completeCurrentStep();
    }
    onCreated({ name: bucketName, type: bucketType, public: !allPublicBlocked });
  };

  const sectionStyle = {
    background: '#fff',
    border: '1px solid var(--border-light)',
    padding: '24px',
    marginBottom: '24px',
  };

  const sectionTitleStyle = {
    fontSize: '18px',
    fontWeight: 700,
    marginBottom: '20px',
  };

  const subCheckboxStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '12px 0 12px 24px',
    borderTop: '1px solid var(--border-light)',
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', width: '100%', paddingBottom: '60px' }}>

      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', marginBottom: '16px' }}>
        <a href="#" className="aws-info-link" onClick={e => { e.preventDefault(); onBack('list'); }}>Amazon S3</a>
        <ChevronRight size={14} color="var(--text-secondary)" />
        <a href="#" className="aws-info-link" onClick={e => { e.preventDefault(); onBack('list'); }}>버킷</a>
        <ChevronRight size={14} color="var(--text-secondary)" />
        <span style={{ color: 'var(--text-secondary)' }}>버킷 만들기</span>
      </div>

      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 600 }}>버킷 만들기</h1>
        <span className="aws-info-link" style={{ fontSize: '14px' }}>정보</span>
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px' }}>
        버킷은 S3에 저장되는 데이터의 컨테이너입니다.
      </p>

      <form onSubmit={handleCreate}>

        {/* ─── 일반 구성 ─── */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>일반 구성</h2>

          {/* AWS 리전 */}
          <div style={{ marginBottom: '20px' }}>
            <div className="aws-label" style={{ marginBottom: '4px' }}>AWS 리전</div>
            <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
              아시아 태평양(서울) ap-northeast-2
            </div>
          </div>

          {/* 버킷 유형 */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
              <label className="aws-label">버킷 유형</label>
              <span className="aws-info-link" style={{ fontSize: '13px' }}>정보</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '800px' }}>
              <label className={`aws-radio-box ${bucketType === 'general' ? 'selected' : ''}`}>
                <div className="aws-radio-header">
                  <input type="radio" className="aws-radio-input" checked={bucketType === 'general'} onChange={() => setBucketType('general')} />
                  <div style={{ fontWeight: 700 }}>범용</div>
                </div>
                <div style={{ paddingLeft: '28px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  대부분의 사용 사례 및 액세스 패턴에 권장합니다. 범용 버킷은 버킷 유형 확인인합니다. 범용 버킷을 통해 여러 가용 영역에 개체를 중복 저장하는 스토리지 클래스를 포함하여 사용합니다.
                </div>
              </label>
              <label className={`aws-radio-box ${bucketType === 'directory' ? 'selected' : ''}`}>
                <div className="aws-radio-header">
                  <input type="radio" className="aws-radio-input" checked={bucketType === 'directory'} onChange={() => setBucketType('directory')} />
                  <div style={{ fontWeight: 700 }}>디렉토리</div>
                </div>
                <div style={{ paddingLeft: '28px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  지연 시간이 짧은 사용 사례에 권장합니다. 이 버킷은 단일 가용 영역 내에서 더 빠른 데이터 처리를 제공하는 S3 Express One Zone 스토리지 클래스만 사용합니다.
                </div>
              </label>
            </div>
          </div>

          {/* 버킷 이름 */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
              <label className="aws-label">버킷 이름</label>
              <span className="aws-info-link" style={{ fontSize: '13px' }}>정보</span>
            </div>
            <input
              className="aws-input"
              style={{ maxWidth: '600px' }}
              placeholder="예: my-bucket-name"
              value={bucketName}
              onChange={e => setBucketName(e.target.value)}
            />
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              버킷 이름은 글로벌 네임스페이스에서 고유해야 하며 버킷 이름 지정 규칙을 따라야 합니다.{' '}
              <a href="#" className="aws-info-link" style={{ fontSize: '12px' }}>버킷 이름 지정 규칙 보기 <ExternalLink size={11} style={{ display: 'inline', verticalAlign: 'middle' }} /></a>
            </div>
          </div>

          {/* 기존 버킷에서 설정 복사 */}
          <div>
            <label className="aws-label" style={{ marginBottom: '4px' }}>기존 버킷에서 설정 복사 <span style={{ fontWeight: 400, color: 'var(--text-secondary)' }}>- 선택 사항</span></label>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              다음 구성의 버킷 설정 복사합니다.
            </p>
            <button type="button" className="aws-input" style={{ width: 'auto', background: '#fff', padding: '6px 16px', fontSize: '13px' }}>
              버킷 선택
            </button>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>형식: s3://bucket/prefix</div>
          </div>
        </div>

        {/* ─── 퍼블릭 액세스 차단 설정 ─── */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>이 버킷의 퍼블릭 액세스 차단 설정</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>
            퍼블릭 액세스는 ACL(액세스 제어 목록), 버킷 정책, 액세스 지점 정책 또는 모두를 통해 버킷 및 객체에 부여됩니다. 이 버킷 및 해당 객체에 대한 퍼블릭 액세스가 차단되지 않아야한다면 이 설정을 해제하십시오. 이 설정은 이 버킷 및 객체 액세스 지점에서 모든 퍼블릭 액세스 차단을 활성화합니다. 이 설정은 이 버킷에 적용되는 모든 퍼블릭 액세스가 없는지 확인인합니다. AWS에서는 모든 퍼블릭 액세스 차단을 활성화하도록 권장하지만, 이 설정을 적용하기 전에 퍼블릭 액세스가 없는 애플리케이션이 올바르게 작동하는지 확인인합니다.{' '}
            <a href="#" className="aws-info-link" style={{ fontSize: '13px' }}>자세히 알아보기 <ExternalLink size={11} style={{ display: 'inline', verticalAlign: 'middle' }} /></a>
          </p>

          {/* 모든 퍼블릭 액세스 차단 (상위 체크박스) */}
          <div style={{ border: '1px solid var(--border-light)', borderRadius: '2px' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '16px', cursor: 'pointer', background: blockAll ? '#fff' : '#fff' }}>
              <input
                type="checkbox"
                checked={blockAll}
                onChange={e => handleBlockAll(e.target.checked)}
                style={{ width: '15px', height: '15px', marginTop: '2px', flexShrink: 0 }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>모든 퍼블릭 액세스 차단</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  이 설정을 활성화하면 아래 4개의 설정을 모두 활성화한 것과 같습니다. 다음 설정 각각은 서로 독립됩니다.
                </div>
              </div>
            </label>

            {/* 하위 체크박스 1 */}
            <div style={subCheckboxStyle}>
              <input type="checkbox" checked={blockNewAcl} disabled={blockAll}
                onChange={e => setBlockNewAcl(e.target.checked)}
                style={{ width: '15px', height: '15px', marginTop: '2px', flexShrink: 0, opacity: blockAll ? 0.5 : 1 }} />
              <div style={{ opacity: blockAll ? 0.6 : 1 }}>
                <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '3px' }}>새 ACL(액세스 제어 목록)을 통해 부여된 버킷 및 객체에 대한 퍼블릭 액세스 차단</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>S3은 새로 추가된 버킷 또는 객체에 적용되는 퍼블릭 액세스 권한을 차단합니다. 기존 버킷 및 객체에 대한 새 퍼블릭 액세스 ACL 생성을 금지합니다. 이 설정은 ACL에 대한 퍼블릭 액세스를 차단하지 않으며, S3 리소스에 대한 퍼블릭 액세스를 허용하는 기존 권한을 변경하지 않습니다.</div>
              </div>
            </div>

            {/* 하위 체크박스 2 */}
            <div style={subCheckboxStyle}>
              <input type="checkbox" checked={blockAnyAcl} disabled={blockAll}
                onChange={e => setBlockAnyAcl(e.target.checked)}
                style={{ width: '15px', height: '15px', marginTop: '2px', flexShrink: 0, opacity: blockAll ? 0.5 : 1 }} />
              <div style={{ opacity: blockAll ? 0.6 : 1 }}>
                <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '3px' }}>임의의 ACL(액세스 제어 목록)을 통해 부여된 버킷 및 객체에 대한 퍼블릭 액세스 차단</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>S3은 버킷 및 객체에 대한 퍼블릭 액세스를 부여하는 모든 ACL을 무시합니다.</div>
              </div>
            </div>

            {/* 하위 체크박스 3 */}
            <div style={subCheckboxStyle}>
              <input type="checkbox" checked={blockNewPolicy} disabled={blockAll}
                onChange={e => setBlockNewPolicy(e.target.checked)}
                style={{ width: '15px', height: '15px', marginTop: '2px', flexShrink: 0, opacity: blockAll ? 0.5 : 1 }} />
              <div style={{ opacity: blockAll ? 0.6 : 1 }}>
                <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '3px' }}>새 퍼블릭 버킷 또는 액세스 지점 정책을 통해 부여된 버킷 및 객체에 대한 퍼블릭 액세스 차단</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>S3은 버킷 및 객체에 대한 퍼블릭 액세스를 부여하는 새 버킷 및 액세스 지점 정책을 차단합니다. 이 설정은 S3 리소스에 대한 퍼블릭 액세스를 허용하는 기존 정책을 변경하지 않습니다.</div>
              </div>
            </div>

            {/* 하위 체크박스 4 */}
            <div style={subCheckboxStyle}>
              <input type="checkbox" checked={blockAnyPolicy} disabled={blockAll}
                onChange={e => setBlockAnyPolicy(e.target.checked)}
                style={{ width: '15px', height: '15px', marginTop: '2px', flexShrink: 0, opacity: blockAll ? 0.5 : 1 }} />
              <div style={{ opacity: blockAll ? 0.6 : 1 }}>
                <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '3px' }}>임의의 퍼블릭 버킷 또는 액세스 지점 정책을 통해 부여된 버킷 및 객체에 대한 퍼블릭 및 교차 계정 액세스 차단</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>S3은 버킷 및 객체에 대한 퍼블릭 액세스를 부여하는 정책을 사용하는 버킷 또는 액세스 지점에 대한 퍼블릭 및 교차 계정 액세스를 무시합니다.</div>
              </div>
            </div>
          </div>

          {/* 경고 박스 (퍼블릭 허용 시) */}
          {!blockAll && (
            <div style={{
              marginTop: '16px',
              padding: '16px',
              background: '#fdf3f1',
              border: '1px solid #d13212',
              borderRadius: '2px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <AlertTriangle size={18} color="#d13212" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 700, color: '#d13212', marginBottom: '6px' }}>모든 퍼블릭 액세스 차단을 비활성화하면 이 버킷과 그 안에 포함된 객체가 퍼블릭 상태가 될 수 있습니다.</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    정적 웹 사이트 호스팅과 같은 구체적으로 확인된 사용 사례에서 퍼블릭 액세스가 필요한 경우가 아니라면 모든 퍼블릭 액세스 차단을 활성화하는 것이 좋습니다.
                  </div>
                </div>
              </div>
              {/* Acknowledgement 체크박스 */}
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', paddingTop: '8px', borderTop: '1px solid #f5c6bc' }}>
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={e => setAcknowledged(e.target.checked)}
                  style={{ width: '15px', height: '15px', marginTop: '2px', flexShrink: 0, accentColor: '#d13212' }}
                />
                <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                  현재 설정으로 인해 이 버킷과 그 안에 포함된 객체가 퍼블릭 상태가 될 수 있음을 알고 있습니다.
                </span>
              </label>
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="submit"
            className="aws-btn-primary"
            disabled={!bucketName || (!blockAll && !acknowledged)}
            style={{ opacity: (!bucketName || (!blockAll && !acknowledged)) ? 0.5 : 1, cursor: (!bucketName || (!blockAll && !acknowledged)) ? 'not-allowed' : 'pointer' }}
          >
            버킷 만들기
          </button>
          <button type="button" className="aws-input" style={{ width: 'auto', background: '#fff', padding: '6px 16px' }} onClick={() => onBack('list')}>
            취소
          </button>
        </div>

      </form>
    </div>
  );
}
