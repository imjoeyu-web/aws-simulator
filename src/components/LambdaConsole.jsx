import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

const PULSE = { animation: 'step-panel-pulse 1.5s ease-in-out infinite', outline: '2px solid #ff9900', outlineOffset: '3px' };

const RUNTIMES = [
  'Node.js 20.x', 'Node.js 18.x', 'Python 3.12', 'Python 3.11',
  'Java 21', 'Ruby 3.2', 'Go 1.x', '.NET 8',
];

// ── 함수 생성 폼 ──────────────────────────────────────────
function LambdaCreateForm({ questState, onCreated, onBack }) {
  const isCreateStep = questState?.currentStep?.id?.includes('lambda_create');
  const [fnName, setFnName] = useState('');
  const [runtime, setRuntime] = useState('Node.js 18.x');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!fnName) return;
    if (isCreateStep) questState.completeCurrentStep?.();
    onCreated({ name: fnName, runtime, arn: `arn:aws:lambda:ap-northeast-2:123456789012:function:${fnName}` });
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', width: '100%', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', marginBottom: '16px' }}>
        <a href="#" className="aws-info-link" onClick={e => { e.preventDefault(); onBack(); }}>Lambda</a>
        <ChevronRight size={14} color="var(--text-secondary)" />
        <span style={{ color: 'var(--text-secondary)' }}>함수 생성</span>
      </div>
      <h1 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '24px' }}>함수 생성</h1>

      <form onSubmit={handleCreate}>
        {/* 생성 방법 */}
        <div className={`aws-panel ${isCreateStep ? 'success-glow' : ''}`} style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>함수 생성 방법 선택</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[
              { id: 'scratch', label: '새로 작성', desc: '간단한 Hello World 예제로 시작하세요.' },
              { id: 'blueprint', label: '블루프린트 사용', desc: '샘플 코드와 구성 사전 설정으로 시작하세요.', disabled: true },
              { id: 'container', label: '컨테이너 이미지', desc: '컨테이너 이미지로 패키징된 함수를 정의하세요.', disabled: true },
            ].map(o => (
              <label key={o.id} className={`aws-radio-box ${o.id === 'scratch' ? 'selected' : ''}`} style={{ cursor: o.disabled ? 'default' : 'pointer', opacity: o.disabled ? 0.5 : 1 }}>
                <div className="aws-radio-header">
                  <input type="radio" className="aws-radio-input" checked={o.id === 'scratch'} readOnly disabled={o.disabled} />
                  <div>
                    <div style={{ fontWeight: 700 }}>{o.label}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>{o.desc}</div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* 기본 정보 */}
        <div className="aws-panel" style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>기본 정보</h2>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
              <label className="aws-label">함수 이름</label>
              <span className="aws-info-link" style={{ fontSize: '12px' }}>정보</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Lambda 함수의 이름을 입력하세요.</p>
            <input className="aws-input" value={fnName} onChange={e => setFnName(e.target.value)} style={{ maxWidth: '500px' }} placeholder="my-function" required />
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>최대 64자. 문자, 숫자, 하이픈, 밑줄만 사용 가능합니다.</p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
              <label className="aws-label">런타임</label>
              <span className="aws-info-link" style={{ fontSize: '12px' }}>정보</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>함수를 실행하는 언어별 환경입니다.</p>
            <select className="aws-input" value={runtime} onChange={e => setRuntime(e.target.value)} style={{ maxWidth: '400px', appearance: 'auto' }}>
              {RUNTIMES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="aws-label" style={{ display: 'block', marginBottom: '4px' }}>아키텍처</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {['x86_64', 'arm64'].map(arch => (
                <label key={arch} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input type="radio" checked={arch === 'x86_64'} readOnly style={{ cursor: 'pointer' }} />
                  <span style={{ fontSize: '13px' }}>{arch}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 권한 */}
        <div className="aws-panel" style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>권한</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Lambda는 함수에서 생성하는 CloudWatch Logs 로그 스트림 및 항목에 대한 권한을 포함하는 실행 역할을 생성합니다.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { id: 'new', label: '기본 Lambda 권한을 가진 새 역할 생성', disabled: false },
              { id: 'template', label: '정책 템플릿에서 새 역할 생성', disabled: true },
              { id: 'existing', label: '기존 역할 사용', disabled: false },
            ].map(o => (
              <label key={o.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: o.disabled ? 'default' : 'pointer', opacity: o.disabled ? 0.5 : 1 }}>
                <input type="radio" checked={o.id === 'existing'} readOnly disabled={o.disabled} style={{ cursor: 'pointer' }} />
                <span style={{ fontSize: '13px' }}>{o.label}</span>
              </label>
            ))}
          </div>
          <div style={{ marginTop: '16px' }}>
            <label className="aws-label" style={{ display: 'block', marginBottom: '8px' }}>기존 역할</label>
            <select className="aws-input" style={{ maxWidth: '500px', appearance: 'auto' }}>
              <option>LabRole</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="submit" className="aws-btn-primary" style={{ padding: '10px 24px' }}>함수 생성</button>
          <button type="button" className="aws-input" style={{ width: 'auto', background: '#fff', padding: '10px 16px' }} onClick={onBack}>취소</button>
        </div>
      </form>
    </div>
  );
}

// ── 함수 상세 ─────────────────────────────────────────────
function LambdaDetail({ fn, questState, onBack }) {
  const [mainTab, setMainTab] = useState('구성');
  const [configTab, setConfigTab] = useState(() => {
    const id = questState?.currentStep?.id ?? '';
    if (id.includes('lambda_timeout')) return '일반 구성';
    if (id.includes('lambda_env')) return '환경 변수';
    if (id.includes('lambda_url')) return '함수 URL';
    return '일반 구성';
  });

  // URL step state
  const [hasUrl, setHasUrl] = useState(false);
  const [urlAuth, setUrlAuth] = useState('NONE');
  const [showUrlCreate, setShowUrlCreate] = useState(false);
  const [lambdaUrl] = useState(`https://abc123def456.lambda-url.ap-northeast-2.on.aws/`);

  // Env var step state
  const [envVars, setEnvVars] = useState([]);
  const [editingEnv, setEditingEnv] = useState(false);
  const [newEnvRows, setNewEnvRows] = useState([
    { key: 'DB_HOST', value: '' },
    { key: 'DB_USER', value: '' },
    { key: 'DB_PASSWORD', value: '' },
    { key: 'DB_NAME', value: '' },
    { key: 'OPENAI_API_KEY', value: '' },
  ]);

  // Timeout step state
  const [timeout, setTimeout_] = useState({ min: '0', sec: '3' });
  const [editingTimeout, setEditingTimeout] = useState(false);

  const isUrlStep = questState?.currentStep?.id?.includes('lambda_url');
  const isEnvStep = questState?.currentStep?.id?.includes('lambda_env');
  const isTimeoutStep = questState?.currentStep?.id?.includes('lambda_timeout');

  const handleSaveUrl = () => {
    setHasUrl(true);
    setShowUrlCreate(false);
    if (isUrlStep) questState.completeCurrentStep?.();
  };

  const handleSaveEnv = () => {
    const filled = newEnvRows.filter(r => r.key && r.value);
    setEnvVars(filled);
    setEditingEnv(false);
    if (isEnvStep && filled.length >= 4) questState.completeCurrentStep?.();
  };

  const handleSaveTimeout = () => {
    setEditingTimeout(false);
    const mins = parseInt(timeout.min) || 0;
    const secs = parseInt(timeout.sec) || 0;
    if (isTimeoutStep && (mins >= 1 || secs >= 30)) questState.completeCurrentStep?.();
  };

  const CONFIG_TABS = ['일반 구성', '권한', '환경 변수', 'VPC', '태그', '동시성', '모니터링 및 운영 도구', '함수 URL', '코드 서명'];
  const MAIN_TABS = ['코드', '테스트', '모니터링', '구성'];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', marginBottom: '16px' }}>
        <a href="#" className="aws-info-link" onClick={e => { e.preventDefault(); onBack(); }}>Lambda</a>
        <ChevronRight size={14} color="var(--text-secondary)" />
        <a href="#" className="aws-info-link" onClick={e => { e.preventDefault(); onBack(); }}>함수</a>
        <ChevronRight size={14} color="var(--text-secondary)" />
        <span style={{ color: 'var(--text-secondary)' }}>{fn.name}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 600 }}>{fn.name}</h1>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>함수 ARN: <span style={{ fontFamily: 'monospace' }}>{fn.arn}</span></div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="aws-input" style={{ width: 'auto', background: '#fff', padding: '6px 14px', fontSize: '13px' }}>제한 편집</button>
          <button className="aws-input" style={{ width: 'auto', background: '#fff', padding: '6px 14px', fontSize: '13px' }}>작업 ▼</button>
        </div>
      </div>

      {/* 함수 URL 배너 */}
      {hasUrl && (
        <div style={{ padding: '10px 16px', background: '#f0f7ff', border: '1px solid #b0c4de', borderRadius: '4px', marginBottom: '12px', fontSize: '13px', display: 'flex', gap: '8px' }}>
          <span>🔗 함수 URL:</span>
          <a className="aws-info-link" style={{ fontFamily: 'monospace' }}>{lambdaUrl}</a>
        </div>
      )}

      {/* 메인 탭 */}
      <div style={{ display: 'flex', borderBottom: '2px solid var(--border-light)', marginBottom: '0' }}>
        {MAIN_TABS.map(tab => (
          <button key={tab} onClick={() => setMainTab(tab)} style={{ padding: '10px 20px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', fontWeight: mainTab === tab ? 700 : 400, color: mainTab === tab ? '#0073bb' : 'var(--text-primary)', borderBottom: mainTab === tab ? '3px solid #0073bb' : '3px solid transparent', marginBottom: '-2px' }}>
            {tab}
          </button>
        ))}
      </div>

      {/* 코드 탭 */}
      {mainTab === '코드' && (
        <div className="aws-panel" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700 }}>소스 코드</h2>
            <button className="aws-btn-primary">Deploy</button>
          </div>
          <div style={{ background: '#1e1e1e', borderRadius: '4px', padding: '20px', fontFamily: 'monospace', fontSize: '13px', color: '#d4d4d4', lineHeight: 1.6, minHeight: '200px' }}>
            <span style={{ color: '#569cd6' }}>export const</span> <span style={{ color: '#dcdcaa' }}>handler</span> = <span style={{ color: '#569cd6' }}>async</span> (event) {'=> {'}<br />
            {'  '}<span style={{ color: '#4ec9b0' }}>const</span> response = {'{'}<br />
            {'    '}statusCode: <span style={{ color: '#b5cea8' }}>200</span>,<br />
            {'    '}body: <span style={{ color: '#ce9178' }}>JSON.stringify</span>(<span style={{ color: '#ce9178' }}>'Hello from Lambda!'</span>),<br />
            {'  '}{'}'}<span style={{ color: '#d4d4d4' }}>;</span><br />
            {'  '}<span style={{ color: '#c586c0' }}>return</span> response;<br />
            {'}'}<span style={{ color: '#d4d4d4' }}>;</span>
          </div>
        </div>
      )}

      {/* 구성 탭 */}
      {mainTab === '구성' && (
        <div style={{ display: 'flex', gap: '0', border: '1px solid var(--border-light)', borderTop: 'none', borderRadius: '0 0 4px 4px', background: '#fff' }}>
          {/* 사이드 탭 */}
          <div style={{ width: '200px', flexShrink: 0, borderRight: '1px solid var(--border-light)', padding: '8px 0' }}>
            {CONFIG_TABS.map(tab => (
              <button key={tab} onClick={() => setConfigTab(tab)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 16px', border: 'none', background: configTab === tab ? '#f0f7ff' : 'transparent', cursor: 'pointer', fontSize: '13px', fontWeight: configTab === tab ? 700 : 400, color: configTab === tab ? '#0073bb' : 'var(--text-primary)', borderRight: configTab === tab ? '3px solid #0073bb' : '3px solid transparent' }}>
                {tab}
              </button>
            ))}
          </div>

          {/* 구성 내용 */}
          <div style={{ flex: 1, padding: '20px' }}>

            {/* 일반 구성 */}
            {configTab === '일반 구성' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 700 }}>일반 구성</h2>
                  {!editingTimeout && (
                    <button className="aws-btn-primary" onClick={() => setEditingTimeout(true)} style={isTimeoutStep ? PULSE : {}}>편집</button>
                  )}
                </div>
                {editingTimeout ? (
                  <div className={isTimeoutStep ? 'success-glow' : ''} style={{ border: '1px solid var(--border-light)', borderRadius: '4px', padding: '20px' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <label className="aws-label" style={{ display: 'block', marginBottom: '8px' }}>제한 시간 <span className="aws-info-link" style={{ fontSize: '12px' }}>정보</span></label>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>함수가 실행을 완료해야 하는 시간입니다. 이 시간을 초과하면 Lambda가 함수를 종료합니다.</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>분</div>
                          <input className="aws-input" value={timeout.min} onChange={e => setTimeout_({ ...timeout, min: e.target.value })} style={{ width: '80px', padding: '6px 10px' }} type="number" min="0" max="15" />
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>초</div>
                          <input className="aws-input" value={timeout.sec} onChange={e => setTimeout_({ ...timeout, sec: e.target.value })} style={{ width: '80px', padding: '6px 10px' }} type="number" min="0" max="59" />
                        </div>
                      </div>
                      {isTimeoutStep && (
                        <div style={{ marginTop: '12px', fontSize: '13px', color: '#0073bb', background: '#f0f7ff', padding: '8px 12px', borderRadius: '4px', border: '1px solid #b0c4de' }}>
                          💡 퀘스트: OpenAI API 응답 시간을 고려해 제한 시간을 <strong>10분</strong>으로 설정하세요.
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="aws-btn-primary" onClick={handleSaveTimeout}>저장</button>
                      <button className="aws-input" style={{ width: 'auto', background: '#fff', padding: '6px 14px', fontSize: '13px' }} onClick={() => setEditingTimeout(false)}>취소</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                    {[
                      ['메모리', '128 MB'],
                      ['임시 스토리지', '512 MB'],
                      ['제한 시간', `${timeout.min}분 ${timeout.sec}초`],
                      ['실행 역할', 'LabRole'],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '4px' }}>{k}</div>
                        <div style={{ fontSize: '14px', fontWeight: k === '제한 시간' && isTimeoutStep ? 700 : 400, color: k === '제한 시간' && isTimeoutStep ? '#d13212' : 'inherit' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 환경 변수 */}
            {configTab === '환경 변수' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 700 }}>환경 변수</h2>
                  {!editingEnv && (
                    <button className="aws-btn-primary" onClick={() => setEditingEnv(true)} style={isEnvStep ? PULSE : {}}>편집</button>
                  )}
                </div>
                {editingEnv ? (
                  <div className={isEnvStep ? 'success-glow' : ''} style={{ border: '1px solid var(--border-light)', borderRadius: '4px', padding: '20px' }}>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                      환경 변수를 사용하면 코드를 업데이트하지 않고 함수 동작을 조정할 수 있습니다.
                    </p>
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '8px', marginBottom: '8px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>키</div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>값</div>
                        <div></div>
                      </div>
                      {newEnvRows.map((row, i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                          <input className="aws-input" value={row.key} onChange={e => setNewEnvRows(prev => prev.map((r, j) => j === i ? { ...r, key: e.target.value } : r))} style={{ padding: '6px 10px', fontSize: '13px', fontFamily: 'monospace' }} />
                          <input className="aws-input" value={row.value} onChange={e => setNewEnvRows(prev => prev.map((r, j) => j === i ? { ...r, value: e.target.value } : r))} style={{ padding: '6px 10px', fontSize: '13px', fontFamily: 'monospace' }} placeholder={row.key === 'OPENAI_API_KEY' ? 'sk-...' : ''} />
                          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d13212', fontSize: '16px' }} onClick={() => setNewEnvRows(prev => prev.filter((_, j) => j !== i))}>×</button>
                        </div>
                      ))}
                    </div>
                    <button className="aws-info-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', marginBottom: '16px' }} onClick={() => setNewEnvRows(prev => [...prev, { key: '', value: '' }])}>+ 환경 변수 추가</button>
                    {isEnvStep && (
                      <div style={{ marginBottom: '12px', fontSize: '13px', color: '#0073bb', background: '#f0f7ff', padding: '8px 12px', borderRadius: '4px', border: '1px solid #b0c4de' }}>
                        💡 퀘스트: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, OPENAI_API_KEY를 모두 입력 후 저장하세요.
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="aws-btn-primary" onClick={handleSaveEnv}>저장</button>
                      <button className="aws-input" style={{ width: 'auto', background: '#fff', padding: '6px 14px', fontSize: '13px' }} onClick={() => setEditingEnv(false)}>취소</button>
                    </div>
                  </div>
                ) : envVars.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    함수에 환경 변수가 없습니다.
                  </div>
                ) : (
                  <div style={{ border: '1px solid var(--border-light)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '8px 16px', background: '#fafafa', borderBottom: '1px solid var(--border-light)', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                      <span>키</span><span>값</span>
                    </div>
                    {envVars.map((ev, i) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '10px 16px', borderBottom: '1px solid var(--border-light)', fontSize: '13px' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{ev.key}</span>
                        <span style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{ev.key.includes('PASSWORD') || ev.key.includes('KEY') ? '••••••••' : ev.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 함수 URL */}
            {configTab === '함수 URL' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 700 }}>함수 URL</h2>
                  {!hasUrl && !showUrlCreate && (
                    <button className="aws-btn-primary" onClick={() => setShowUrlCreate(true)} style={isUrlStep ? PULSE : {}}>함수 URL 생성</button>
                  )}
                </div>
                {showUrlCreate ? (
                  <div className={isUrlStep ? 'success-glow' : ''} style={{ border: '1px solid var(--border-light)', borderRadius: '4px', padding: '20px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>함수 URL 생성</h3>
                    <div style={{ marginBottom: '20px' }}>
                      <label className="aws-label" style={{ display: 'block', marginBottom: '8px' }}>인증 유형 <span className="aws-info-link" style={{ fontSize: '12px' }}>정보</span></label>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>인증 유형을 사용하면 Lambda 함수 URL에 대한 요청에 서명하는 방법을 결정할 수 있습니다.</p>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        {['AWS_IAM', 'NONE'].map(auth => (
                          <label key={auth} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', border: `1px solid ${urlAuth === auth ? '#0073bb' : 'var(--border-light)'}`, borderRadius: '4px', cursor: 'pointer', background: urlAuth === auth ? '#f0f7ff' : '#fff', minWidth: '200px' }} onClick={() => setUrlAuth(auth)}>
                            <input type="radio" checked={urlAuth === auth} readOnly style={{ cursor: 'pointer' }} />
                            <div>
                              <div style={{ fontWeight: 700 }}>{auth}</div>
                              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                {auth === 'NONE' ? '누구나 함수 URL을 호출할 수 있습니다.' : 'IAM 사용자 및 역할만 호출할 수 있습니다.'}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                    {isUrlStep && (
                      <div style={{ marginBottom: '12px', fontSize: '13px', color: '#0073bb', background: '#f0f7ff', padding: '8px 12px', borderRadius: '4px', border: '1px solid #b0c4de' }}>
                        💡 퀘스트: 인증 유형을 <strong>NONE</strong>으로 선택하고 함수 URL을 생성하세요.
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="aws-btn-primary" onClick={handleSaveUrl}>저장</button>
                      <button className="aws-input" style={{ width: 'auto', background: '#fff', padding: '6px 14px', fontSize: '13px' }} onClick={() => setShowUrlCreate(false)}>취소</button>
                    </div>
                  </div>
                ) : hasUrl ? (
                  <div style={{ border: '1px solid var(--border-light)', borderRadius: '4px', padding: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                      {[['함수 URL', lambdaUrl], ['인증 유형', urlAuth], ['CORS', '비활성화됨'], ['호출 모드', 'BUFFERED']].map(([k, v]) => (
                        <div key={k}>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '4px' }}>{k}</div>
                          <div style={{ fontSize: '13px', color: k === '함수 URL' ? '#0073bb' : 'inherit', fontFamily: k === '함수 URL' ? 'monospace' : 'inherit', wordBreak: 'break-all' }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    이 함수에 대한 함수 URL이 없습니다.
                  </div>
                )}
              </div>
            )}

            {/* 그 외 구성 탭 */}
            {!['일반 구성', '환경 변수', '함수 URL'].includes(configTab) && (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
                실제 AWS 콘솔에서 확인하세요.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 테스트/모니터링 탭 */}
      {['테스트', '모니터링'].includes(mainTab) && (
        <div className="aws-panel" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
          실제 AWS 콘솔에서 확인하세요.
        </div>
      )}
    </div>
  );
}

// ── 함수 목록 ─────────────────────────────────────────────
function LambdaList({ questState, functions, onCreate, onSelect }) {
  const isCreateStep = questState?.currentStep?.id?.includes('lambda_create');

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', paddingBottom: '40px' }}>
      <div style={{ fontSize: '13px', marginBottom: '12px' }}>
        <a href="#" className="aws-info-link">Lambda</a>
        <ChevronRight size={13} color="var(--text-secondary)" style={{ display: 'inline', verticalAlign: 'middle', margin: '0 4px' }} />
        <span style={{ color: 'var(--text-secondary)' }}>함수</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600 }}>함수 ({functions.length})</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="aws-input" style={{ width: 'auto', background: '#fff', padding: '6px 14px', fontSize: '13px' }}>작업 ▼</button>
          <button className="aws-btn-primary" onClick={onCreate} style={isCreateStep ? PULSE : {}}>함수 생성</button>
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid var(--border-light)', borderRadius: '4px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '32px 2.5fr 1.5fr 1fr 1fr 1fr', padding: '10px 16px', background: '#fafafa', borderBottom: '1px solid var(--border-light)', fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)' }}>
          <span></span><span>함수 이름 ▲</span><span>런타임</span><span>패키지 유형</span><span>리전</span><span>마지막 수정</span>
        </div>
        {functions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
            함수가 없습니다.<br />
            <span style={{ fontSize: '13px' }}>함수를 생성하여 시작하세요.</span>
          </div>
        ) : functions.map((fn, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '32px 2.5fr 1.5fr 1fr 1fr 1fr', padding: '12px 16px', borderBottom: '1px solid var(--border-light)', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => onSelect(fn)}>
            <input type="radio" readOnly />
            <a className="aws-info-link" style={{ fontWeight: 600 }}>{fn.name}</a>
            <span style={{ fontSize: '13px' }}>{fn.runtime}</span>
            <span style={{ fontSize: '13px' }}>Zip</span>
            <span style={{ fontSize: '13px' }}>ap-northeast-2</span>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>방금 전</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 메인 컴포넌트 ──────────────────────────────────────────
export default function LambdaConsole({ questState }) {
  const [view, setView] = useState('list');
  const [functions, setFunctions] = useState([]);
  const [activeFunction, setActiveFunction] = useState(null);

  if (view === 'create') {
    return (
      <LambdaCreateForm
        questState={questState}
        onCreated={fn => { setFunctions(prev => [...prev, fn]); setActiveFunction(fn); setView('detail'); }}
        onBack={() => setView('list')}
      />
    );
  }
  if (view === 'detail' && activeFunction) {
    return (
      <LambdaDetail
        fn={activeFunction}
        questState={questState}
        onBack={() => setView('list')}
      />
    );
  }
  return (
    <LambdaList
      questState={questState}
      functions={functions}
      onCreate={() => setView('create')}
      onSelect={fn => { setActiveFunction(fn); setView('detail'); }}
    />
  );
}
