import React, { useState } from 'react';
import { ChevronRight, ExternalLink } from 'lucide-react';

const DEFAULT_POLICY = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::BUCKET_NAME/*"
    }
  ]
}`;

export default function S3BucketDetail({ bucket, questState, onBack, onBucketUpdate }) {
  const [activeTab, setActiveTab] = useState('objects');
  const [policyJson, setPolicyJson] = useState(bucket.policyJson ?? '');
  const [hostingEnabled, setHostingEnabled] = useState(bucket.hostingEnabled ?? false);
  const [indexDoc, setIndexDoc] = useState(bucket.indexDoc ?? 'index.html');
  const [errorDoc, setErrorDoc] = useState(bucket.errorDoc ?? 'error.html');
  const [policySaved, setPolicySaved] = useState(bucket.policySaved ?? false);
  const [hostingSaved, setHostingSaved] = useState(bucket.hostingSaved ?? false);
  const [editingPolicy, setEditingPolicy] = useState(false);
  const [editingHosting, setEditingHosting] = useState(false);
  const [hostingEnabledDraft, setHostingEnabledDraft] = useState(bucket.hostingEnabled ?? false);
  const [indexDocDraft, setIndexDocDraft] = useState(bucket.indexDoc ?? 'index.html');
  const [errorDocDraft, setErrorDocDraft] = useState(bucket.errorDoc ?? 'error.html');

  const stepId = questState.currentStep.id;

  const handleSavePolicy = () => {
    if (policyJson.includes('s3:GetObject')) {
      setPolicySaved(true);
      onBucketUpdate?.({ ...bucket, policySaved: true, policyJson });
      if (stepId.includes('s3_policy')) questState.completeCurrentStep();
    }
  };

  const handleSaveHosting = () => {
    if (hostingEnabledDraft) {
      setHostingEnabled(true);
      setIndexDoc(indexDocDraft);
      setErrorDoc(errorDocDraft);
      setHostingSaved(true);
      setEditingHosting(false);
      onBucketUpdate?.({ ...bucket, hostingSaved: true, hostingEnabled: true, indexDoc: indexDocDraft, errorDoc: errorDocDraft });
      if (stepId.includes('s3_hosting')) questState.completeCurrentStep();
    } else {
      setHostingEnabled(false);
      setHostingSaved(false);
      setEditingHosting(false);
      onBucketUpdate?.({ ...bucket, hostingSaved: false, hostingEnabled: false });
    }
  };

  const handleEndpointClick = (e) => {
    e.preventDefault();
    if (stepId.includes('finish')) questState.completeCurrentStep();
  };

  const tabs = [
    { id: 'objects', label: '객체' },
    { id: 'properties', label: '속성' },
    { id: 'permissions', label: '권한' },
    { id: 'metrics', label: '지표' },
    { id: 'management', label: '관리' },
    { id: 'accesspoints', label: '액세스 지점' },
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', paddingBottom: '60px' }}>

      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', marginBottom: '12px' }}>
        <a href="#" className="aws-info-link" onClick={e => { e.preventDefault(); onBack('list'); }}>Amazon S3</a>
        <ChevronRight size={13} color="var(--text-secondary)" />
        <a href="#" className="aws-info-link" onClick={e => { e.preventDefault(); onBack('list'); }}>버킷</a>
        <ChevronRight size={13} color="var(--text-secondary)" />
        <span style={{ color: 'var(--text-secondary)' }}>{bucket.name}</span>
      </div>

      <h1 style={{ fontSize: '26px', fontWeight: 600, marginBottom: '20px' }}>{bucket.name}</h1>

      {/* 탭 네비게이션 */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', marginBottom: '24px' }}>
        {tabs.map(tab => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 16px',
              cursor: 'pointer',
              fontSize: '14px',
              borderBottom: activeTab === tab.id ? '2px solid #0073bb' : '2px solid transparent',
              color: activeTab === tab.id ? '#0073bb' : 'var(--text-primary)',
              fontWeight: activeTab === tab.id ? 700 : 400,
              marginBottom: '-1px',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* ─── 객체 탭 ─── */}
      {activeTab === 'objects' && (
        <div style={{ background: '#fff', border: '1px solid var(--border-light)', padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '14px' }}>이 버킷에 객체가 없습니다.</p>
          <p style={{ fontSize: '13px', marginTop: '8px' }}>터미널에서 <code style={{ background: '#f4f6f6', padding: '2px 6px', borderRadius: '2px' }}>aws s3 cp</code> 명령어로 파일을 업로드하세요.</p>
        </div>
      )}

      {/* ─── 속성 탭 ─── */}
      {activeTab === 'properties' && !editingHosting && (
        <div>
          <div style={{
            background: '#fff',
            border: `1px solid ${stepId.includes('s3_hosting') ? '#0073bb' : 'var(--border-light)'}`,
            boxShadow: stepId.includes('s3_hosting') ? '0 0 0 1px #0073bb' : 'none',
          }}>
            {/* 헤더 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid var(--border-light)' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>정적 웹 사이트 호스팅</h2>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  버킷을 정적 웹 사이트로 호스팅하도록 구성합니다.{' '}
                  <a href="#" className="aws-info-link" style={{ fontSize: '12px' }}>자세히 알아보기 <ExternalLink size={10} style={{ display: 'inline', verticalAlign: 'middle' }} /></a>
                </p>
              </div>
              <button
                className="aws-input"
                style={{ width: 'auto', background: '#fff', padding: '5px 16px', fontSize: '13px', flexShrink: 0, marginLeft: '16px' }}
                onClick={() => {
                  setHostingEnabledDraft(hostingEnabled);
                  setIndexDocDraft(indexDoc);
                  setErrorDocDraft(errorDoc);
                  setEditingHosting(true);
                }}
              >
                편집
              </button>
            </div>

            {/* 바디 */}
            <div style={{ padding: '20px 24px' }}>
              {!hostingSaved ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%',
                    background: '#d5dbdb', flexShrink: 0
                  }} />
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>비활성화됨</span>
                </div>
              ) : (
                <div>
                  {/* Amplify 안내 배너 */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: '#f0f7ff', border: '1px solid #0073bb', borderRadius: '2px',
                    padding: '12px 16px', marginBottom: '24px', gap: '16px'
                  }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <span style={{ color: '#0073bb', fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>ℹ</span>
                      <div style={{ fontSize: '12px', color: '#16191f', lineHeight: 1.6 }}>
                        정적 웹 사이트 호스팅에는 AWS Amplify Hosting을 사용하는 것을 권장합니다.
                        AWS Amplify Hosting을 사용하여 보다 안전하게 업데이트된 웹 사이트를 배포하세요.{' '}
                        <a href="#" className="aws-info-link" style={{ fontSize: '12px' }}>자세히 알아보기</a>
                      </div>
                    </div>
                    <button className="aws-input" style={{ width: 'auto', background: '#fff', padding: '5px 14px', fontSize: '12px', whiteSpace: 'nowrap' }}>
                      Amplify 앱 생성
                    </button>
                  </div>

                  {/* 상태 그리드 */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', border: '1px solid var(--border-light)', borderRadius: '2px', marginBottom: '20px' }}>
                    {[
                      { label: '정적 웹 사이트 호스팅', value: <span style={{ color: '#1d8102', fontWeight: 600 }}>활성화됨</span> },
                      { label: '호스트 유형', value: '버킷 호스팅' },
                      { label: '인덱스 문서', value: indexDoc },
                      { label: '오류 문서', value: errorDoc },
                    ].map(({ label, value }, i) => (
                      <div key={i} style={{
                        padding: '14px 20px',
                        borderRight: i % 2 === 0 ? '1px solid var(--border-light)' : 'none',
                        borderBottom: i < 2 ? '1px solid var(--border-light)' : 'none',
                        background: '#fff',
                      }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: '6px' }}>{label}</div>
                        <div style={{ fontSize: '13px' }}>{value}</div>
                      </div>
                    ))}
                  </div>

                  {/* 엔드포인트 박스 */}
                  <div style={{ border: '1px solid var(--border-light)', borderRadius: '2px', padding: '16px 20px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: '6px' }}>버킷 웹 사이트 엔드포인트</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px', lineHeight: 1.5 }}>
                      이 버킷 웹 사이트 엔드포인트는 버킷에 대한 액세스 지점 퍼블릭 정책과 AWS 서비스를 사용할 수 없습니다.{' '}
                      <a href="#" className="aws-info-link" style={{ fontSize: '12px' }}>자세히 알아보기</a>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <a href="#" onClick={handleEndpointClick} className="aws-info-link" style={{ fontSize: '13px' }}>
                        http://{bucket.name}.s3-website.ap-northeast-2.amazonaws.com
                      </a>
                      <ExternalLink size={12} color="#0073bb" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── 속성 탭 > 호스팅 편집 모드 ─── */}
      {activeTab === 'properties' && editingHosting && (
        <div style={{ maxWidth: '860px' }}>
          {/* 편집 페이지 헤더 */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              <a href="#" className="aws-info-link" onClick={e => { e.preventDefault(); setEditingHosting(false); }}>{bucket.name}</a>
              {' › '}속성 › 정적 웹 사이트 호스팅 편집
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 600 }}>정적 웹 사이트 호스팅 편집</h2>
          </div>

          {/* 섹션 1: 토글 */}
          <div style={{ background: '#fff', border: '1px solid var(--border-light)', borderRadius: '2px', marginBottom: '16px' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>정적 웹 사이트 호스팅</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                버킷의 정적 웹 사이트 호스팅을 비활성화하거나 활성화합니다.{' '}
                <a href="#" className="aws-info-link" style={{ fontSize: '12px' }}>자세히 알아보기 <ExternalLink size={10} style={{ display: 'inline', verticalAlign: 'middle' }} /></a>
              </p>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { val: false, label: '비활성화', desc: '정적 웹 사이트 호스팅을 끕니다.' },
                { val: true, label: '활성화', desc: '이 버킷을 정적 웹 사이트로 사용합니다.' },
              ].map(({ val, label, desc }) => (
                <label key={String(val)} style={{ display: 'flex', gap: '12px', cursor: 'pointer', alignItems: 'flex-start' }}>
                  <input
                    type="radio"
                    className="aws-radio-input"
                    style={{ marginTop: '2px', flexShrink: 0 }}
                    checked={hostingEnabledDraft === val}
                    onChange={() => setHostingEnabledDraft(val)}
                  />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>{label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* 섹션 2: 호스팅 유형 (활성화 시에만) */}
          {hostingEnabledDraft && (
            <>
              <div style={{ background: '#fff', border: '1px solid var(--border-light)', borderRadius: '2px', marginBottom: '16px' }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-light)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>호스팅 유형</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>이 버킷을 어떻게 사용할지 선택합니다.</p>
                </div>
                <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ display: 'flex', gap: '12px', cursor: 'pointer', alignItems: 'flex-start' }}>
                    <input type="radio" className="aws-radio-input" style={{ marginTop: '2px', flexShrink: 0 }} defaultChecked readOnly />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>정적 웹 사이트 호스팅</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>버킷을 사용하여 정적 웹 사이트를 호스팅합니다.</div>
                    </div>
                  </label>
                  <label style={{ display: 'flex', gap: '12px', cursor: 'pointer', alignItems: 'flex-start', opacity: 0.5 }}>
                    <input type="radio" className="aws-radio-input" style={{ marginTop: '2px', flexShrink: 0 }} disabled />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>다른 버킷으로 요청 리디렉션</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>모든 요청을 다른 버킷 또는 도메인으로 리디렉션합니다.</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* 섹션 3: 인덱스 / 오류 문서 */}
              <div style={{ background: '#fff', border: '1px solid var(--border-light)', borderRadius: '2px', marginBottom: '16px' }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-light)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>정적 웹 사이트 호스팅</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>인덱스 문서와 오류 문서를 지정합니다.</p>
                </div>
                <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label className="aws-label" style={{ marginBottom: '4px', display: 'block' }}>
                      인덱스 문서 <span style={{ color: '#d13212' }}>*</span>
                    </label>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      웹 사이트의 홈 페이지 파일 이름을 입력합니다. 파일은 버킷에 있어야 합니다.
                    </p>
                    <input
                      className="aws-input"
                      value={indexDocDraft}
                      onChange={e => setIndexDocDraft(e.target.value)}
                      placeholder="index.html"
                      style={{ maxWidth: '400px' }}
                    />
                  </div>
                  <div>
                    <label className="aws-label" style={{ marginBottom: '4px', display: 'block' }}>
                      오류 문서 <span style={{ fontWeight: 400, color: 'var(--text-secondary)' }}>- 선택 사항</span>
                    </label>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      오류가 발생할 경우 반환할 사용자 지정 오류 페이지를 입력합니다.
                    </p>
                    <input
                      className="aws-input"
                      value={errorDocDraft}
                      onChange={e => setErrorDocDraft(e.target.value)}
                      placeholder="error.html"
                      style={{ maxWidth: '400px' }}
                    />
                  </div>
                </div>
              </div>

              {/* 섹션 4: 리디렉션 규칙 (선택 사항) */}
              <div style={{ background: '#fff', border: '1px solid var(--border-light)', borderRadius: '2px', marginBottom: '16px' }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-light)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>
                    리디렉션 규칙 <span style={{ fontWeight: 400, fontSize: '13px', color: 'var(--text-secondary)' }}>- 선택 사항</span>
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    특정 요청에 대한 고급 조건부 리디렉션을 정의합니다.{' '}
                    <a href="#" className="aws-info-link" style={{ fontSize: '12px' }}>자세히 알아보기 <ExternalLink size={10} style={{ display: 'inline', verticalAlign: 'middle' }} /></a>
                  </p>
                </div>
                <div style={{ padding: '16px 24px' }}>
                  <textarea
                    className="aws-input"
                    placeholder="[&#10;  {&#10;    &quot;Condition&quot;: { &quot;HttpErrorCodeReturnedEquals&quot;: &quot;404&quot; },&#10;    &quot;Redirect&quot;: { &quot;ReplaceKeyPrefixWith&quot;: &quot;report-404/&quot; }&#10;  }&#10;]"
                    style={{ fontFamily: 'monospace', fontSize: '12px', height: '100px', resize: 'vertical' }}
                  />
                </div>
              </div>
            </>
          )}

          {/* 저장 / 취소 */}
          <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
            <button className="aws-btn-primary" onClick={handleSaveHosting}>
              변경 사항 저장
            </button>
            <button
              className="aws-input"
              style={{ width: 'auto', background: '#fff', padding: '6px 16px' }}
              onClick={() => setEditingHosting(false)}
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* ─── 권한 탭 ─── */}
      {activeTab === 'permissions' && (
        <div>
          <div style={{
            background: '#fff',
            border: `1px solid ${stepId.includes('s3_policy') ? '#0073bb' : 'var(--border-light)'}`,
            boxShadow: stepId.includes('s3_policy') ? '0 0 0 1px #0073bb' : 'none',
            marginBottom: '16px',
          }}>

            {/* ── 버킷 정책 헤더 ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid var(--border-light)' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>버킷 정책</h2>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  JSON으로 작성된 버킷 정책은 버킷에 저장된 객체에 대한 액세스 권한을 부여합니다.{' '}
                  <a href="#" className="aws-info-link" style={{ fontSize: '12px' }}>자세히 알아보기 <ExternalLink size={10} style={{ display: 'inline', verticalAlign: 'middle' }} /></a>
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0, marginLeft: '16px' }}>
                <button
                  className="aws-input"
                  style={{ width: 'auto', background: '#fff', padding: '5px 16px', fontSize: '13px' }}
                  onClick={() => setEditingPolicy(true)}
                >
                  편집
                </button>
                <button
                  className="aws-input"
                  disabled={!policySaved}
                  style={{ width: 'auto', background: '#fff', padding: '5px 16px', fontSize: '13px', opacity: policySaved ? 1 : 0.4, cursor: policySaved ? 'pointer' : 'not-allowed' }}
                >
                  삭제
                </button>
              </div>
            </div>

            {/* ── 뷰 모드 (편집 안 할 때) ── */}
            {!editingPolicy && (
              <div style={{ padding: '16px 24px' }}>
                {policySaved ? (
                  <div style={{ position: 'relative' }}>
                    <button style={{
                      position: 'absolute', top: '8px', right: '8px',
                      background: '#fff', border: '1px solid var(--border-light)',
                      borderRadius: '2px', padding: '3px 10px', fontSize: '12px', cursor: 'pointer'
                    }}>
                      복사
                    </button>
                    <pre style={{
                      background: '#f8f8f8', border: '1px solid var(--border-light)',
                      borderRadius: '2px', padding: '16px', margin: 0,
                      fontFamily: 'monospace', fontSize: '12px', lineHeight: 1.6,
                      whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                    }}>{policyJson}</pre>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '32px 0', color: 'var(--text-secondary)' }}>
                    <span style={{ fontSize: '13px' }}>표시할 정책이 없습니다.</span>
                    <button style={{
                      background: 'transparent', border: 'none', fontSize: '12px',
                      color: 'var(--text-secondary)', cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: '4px'
                    }}>
                      복사
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── 편집 모드 ── */}
            {editingPolicy && (
              <div style={{ padding: '20px 24px' }}>
                {/* 버킷 ARN */}
                <div style={{
                  background: '#f8f8f8', border: '1px solid var(--border-light)',
                  borderRadius: '2px', padding: '8px 14px', marginBottom: '16px',
                  display: 'inline-flex', alignItems: 'center', gap: '10px',
                }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>버킷 ARN</span>
                  <code style={{ fontSize: '13px', color: '#16191f' }}>arn:aws:s3:::{bucket.name}</code>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0073bb', fontSize: '12px', padding: 0 }}
                    onClick={() => navigator.clipboard?.writeText(`arn:aws:s3:::${bucket.name}`)}>
                    복사
                  </button>
                </div>

                {/* 정책 레이블 + 버튼 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700 }}>정책</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="aws-input" style={{ width: 'auto', background: '#fff', padding: '4px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      정책 예제 <ExternalLink size={11} />
                    </button>
                    <button className="aws-input" style={{ width: 'auto', background: '#fff', padding: '4px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      정책 생성기 <ExternalLink size={11} />
                    </button>
                  </div>
                </div>

                {/* 2단 레이아웃: 에디터 + 문 편집 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '12px', marginBottom: '16px' }}>
                  {/* 왼쪽: 에디터 */}
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      position: 'absolute', top: 0, left: 0, bottom: 0, width: '28px',
                      background: '#e8eaed', borderRadius: '2px 0 0 2px',
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      paddingTop: '9px', gap: '18.5px',
                      borderRight: '1px solid #d5dbdb',
                      overflow: 'hidden',
                    }}>
                      {Array.from({ length: 12 }, (_, i) => (
                        <span key={i} style={{ fontSize: '11px', color: '#687078', lineHeight: 1 }}>{i + 1}</span>
                      ))}
                    </div>
                    <textarea
                      className="aws-input"
                      value={policyJson}
                      onChange={e => setPolicyJson(e.target.value)}
                      placeholder={`{\n  "Version": "2012-10-17",\n  "Statement": [\n    {\n      "Sid": "...",\n      "Effect": "Allow",\n      "Principal": "*",\n      "Action": "s3:GetObject",\n      "Resource": "arn:aws:s3:::${bucket.name}/*"\n    }\n  ]\n}`}
                      style={{
                        fontFamily: 'monospace', fontSize: '12.5px', lineHeight: 1.55,
                        height: '240px', resize: 'vertical',
                        background: '#fff', paddingLeft: '36px', borderRadius: '2px',
                      }}
                    />
                  </div>

                  {/* 오른쪽: 문 편집 패널 */}
                  <div style={{
                    border: '1px solid var(--border-light)', borderRadius: '2px',
                    background: '#fafafa', padding: '16px',
                  }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>문 편집</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 600 }}>문 선택</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
                      정책에서 기존 문을 선택하거나 새 문을 추가합니다.
                    </div>
                    <button className="aws-input" style={{ width: '100%', background: '#fff', padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      + 새 문 추가
                    </button>
                  </div>
                </div>

                {/* 저장 / 취소 */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="aws-btn-primary" onClick={() => { handleSavePolicy(); setEditingPolicy(false); }}>
                    변경 사항 저장
                  </button>
                  <button className="aws-input" style={{ width: 'auto', background: '#fff', padding: '6px 16px' }}
                    onClick={() => setEditingPolicy(false)}>
                    취소
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
