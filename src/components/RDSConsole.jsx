import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

const PULSE = { animation: 'step-panel-pulse 1.5s ease-in-out infinite', outline: '2px solid #ff9900', outlineOffset: '3px' };

function makeEndpoint(dbName) {
  const hash = dbName.split('').reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0);
  const h = Math.abs(hash).toString(36).padEnd(10, '0').slice(0, 10);
  return `${dbName}.${h}.ap-northeast-2.rds.amazonaws.com`;
}

// ── 생성 폼 ──────────────────────────────────────────────
function RDSCreateForm({ questState, onCreated, onBack }) {
  const [dbName, setDbName] = useState('');
  const [engine, setEngine] = useState('aurora-mysql');
  const [template, setTemplate] = useState('prod');
  const [publicAccess, setPublicAccess] = useState('no');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const isCreateStep = questState?.currentStep?.id?.includes('rds_create');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!dbName || !password) return;
    if (isCreateStep) questState.completeCurrentStep();
    onCreated({ name: dbName, engine, username, endpoint: makeEndpoint(dbName) });
  };

  const engines = [
    { id: 'aurora-mysql', label: 'Aurora (MySQL Compatible)', emoji: '⚡' },
    { id: 'aurora-pg',   label: 'Aurora (PostgreSQL Compatible)', emoji: '⚡' },
    { id: 'mysql',       label: 'MySQL',      emoji: '🐬' },
    { id: 'mariadb',     label: 'MariaDB',    emoji: '🦭' },
    { id: 'postgres',    label: 'PostgreSQL', emoji: '🐘' },
    { id: 'oracle',      label: 'Oracle',     emoji: '🔴' },
  ];
  const templates = [
    { id: 'prod', label: '프로덕션', sub: '고가용성 및 빠르고 일관된 성능을 위해 기본값을 사용하세요.' },
    { id: 'dev',  label: '개발/테스트', sub: '이 인스턴스는 프로덕션 환경 외부에서 개발 용도로 마련되었습니다.' },
    { id: 'free', label: '프리 티어', sub: 'RDS 프리 티어를 사용하여 새로운 애플리케이션을 개발하거나, 기존 애플리케이션을 테스트하거나 Amazon RDS에서 실무 경험을 쌓을 수 있습니다. 정보' },
  ];

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', width: '100%', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', marginBottom: '16px' }}>
        <a href="#" className="aws-info-link" onClick={e => { e.preventDefault(); onBack(); }}>RDS</a>
        <ChevronRight size={14} color="var(--text-secondary)" />
        <span style={{ color: 'var(--text-secondary)' }}>데이터베이스 생성</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 600 }}>데이터베이스 생성</h1>
        <span className="aws-info-link" style={{ fontSize: '13px' }}>정보</span>
      </div>

      <form onSubmit={handleCreate}>
        {/* 생성 방식 */}
        <div className={`aws-panel ${isCreateStep ? 'success-glow' : ''}`} style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>데이터베이스 생성 방식 선택</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxWidth: '700px' }}>
            <label className="aws-radio-box selected" style={{ cursor: 'pointer' }}>
              <div className="aws-radio-header">
                <input type="radio" className="aws-radio-input" defaultChecked readOnly />
                <div>
                  <div style={{ fontWeight: 700 }}>표준 생성</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px' }}>가용성, 보안, 백업 및 유지 관리에 대한 옵션을 포함하여 모든 구성 옵션을 설정합니다.</div>
                </div>
              </div>
            </label>
            <label className="aws-radio-box" style={{ cursor: 'pointer', opacity: 0.6 }}>
              <div className="aws-radio-header">
                <input type="radio" className="aws-radio-input" disabled />
                <div>
                  <div style={{ fontWeight: 700 }}>손쉬운 생성</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px' }}>권장 모범 사례 구성을 사용합니다. 일부 구성 옵션은 데이터베이스를 생성한 후 변경할 수 있습니다.</div>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* 엔진 옵션 */}
        <div className="aws-panel" style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>엔진 옵션</h2>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            엔진 유형 <span className="aws-info-link">정보</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxWidth: '800px' }}>
            {engines.map(e => (
              <label key={e.id} className={`aws-radio-box ${engine === e.id ? 'selected' : ''}`} onClick={() => setEngine(e.id)} style={{ cursor: 'pointer' }}>
                <div className="aws-radio-header">
                  <input type="radio" className="aws-radio-input" checked={engine === e.id} readOnly />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{ fontSize: '32px' }}>{e.emoji}</span>
                    <span style={{ fontWeight: 700, fontSize: '14px' }}>{e.label}</span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* 템플릿 */}
        <div className="aws-panel" style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>템플릿</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>해당 사용 사례를 충족하는 샘플 템플릿을 선택하세요.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            {templates.map(t => (
              <label key={t.id} className={`aws-radio-box ${template === t.id ? 'selected' : ''}`} onClick={() => setTemplate(t.id)} style={{ cursor: 'pointer' }}>
                <div className="aws-radio-header">
                  <input type="radio" className="aws-radio-input" checked={template === t.id} readOnly />
                  <div style={{ fontWeight: 700 }}>{t.label}</div>
                </div>
                <div style={{ paddingLeft: '28px', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.5 }}>{t.sub}</div>
              </label>
            ))}
          </div>
        </div>

        {/* 설정 */}
        <div className="aws-panel" style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>설정</h2>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
              <label className="aws-label">DB 인스턴스 식별자</label>
              <span className="aws-info-link" style={{ fontSize: '12px' }}>정보</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>DB 인스턴스 이름을 입력하세요. 이름은 현재 AWS 리전에서 AWS 계정이 소유하는 모든 DB 인스턴스에 대해 고유해야 합니다.</p>
            <input className="aws-input" value={dbName} onChange={e => setDbName(e.target.value)} style={{ maxWidth: '600px' }} placeholder="database-1" required />
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>DB 인스턴스 식별자는 대소문자를 구분하지 않지만 모두 소문자로 저장됩니다. 제약: 1~60자의 영숫자 또는 하이픈.</p>
          </div>

          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
            <p style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>▼ 자격 증명 설정</p>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                <label className="aws-label">마스터 사용자 이름</label>
                <span className="aws-info-link" style={{ fontSize: '12px' }}>정보</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>DB 인스턴스의 마스터 사용자에로 로그인 ID를 입력하세요.</p>
              <input className="aws-input" value={username} onChange={e => setUsername(e.target.value)} style={{ maxWidth: '400px' }} />
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>1~16자의 영숫자. 첫 번째 문자는 글자여야 합니다.</p>
            </div>

            <div style={{ marginBottom: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '800px' }}>
              <label className="aws-radio-box" style={{ opacity: 0.6 }}>
                <div className="aws-radio-header">
                  <input type="radio" className="aws-radio-input" disabled />
                  <div>
                    <div style={{ fontWeight: 700 }}>AWS Secrets Manager에서 관리 – <em>가장 뛰어난 안정성</em></div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>RDS는 자동으로 암호를 생성하고 AWS Secrets Manager를 사용하여 전체 수명 주기 동안 암호를 관리합니다.</div>
                  </div>
                </div>
              </label>
              <label className="aws-radio-box selected">
                <div className="aws-radio-header">
                  <input type="radio" className="aws-radio-input" defaultChecked readOnly />
                  <div>
                    <div style={{ fontWeight: 700 }}>자체 관리</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>사용자가 암호를 생성하거나 RDS에서 암호를 생성하고 사용자가 관리할 수 있습니다.</div>
                  </div>
                </div>
              </label>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                <label className="aws-label">마스터 암호</label>
                <span className="aws-info-link" style={{ fontSize: '12px' }}>정보</span>
              </div>
              <input className="aws-input" type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ maxWidth: '600px' }} required />
              {password.length > 0 && (
                <div style={{ marginTop: '6px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Password strength:
                  <span style={{ background: password.length >= 8 ? '#1d8102' : '#d13212', color: '#fff', padding: '2px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: 600 }}>
                    {password.length >= 8 ? 'Strong' : 'Weak'}
                  </span>
                </div>
              )}
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>최소 제약 조건: 8자 이상의 인쇄 가능한 ASCII 문자를 사용합니다. / ' " @ 기호는 포함할 수 없습니다.</p>
            </div>

            <div>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                <label className="aws-label">마스터 암호 확인</label>
                <span className="aws-info-link" style={{ fontSize: '12px' }}>정보</span>
              </div>
              <input className="aws-input" type="password" value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} style={{ maxWidth: '600px' }} />
            </div>
          </div>
        </div>

        {/* 연결 */}
        <div className="aws-panel" style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>연결</h2>

          <div style={{ background: '#f0f4ff', border: '1px solid #b0c4de', borderRadius: '4px', padding: '12px 16px', marginBottom: '20px', display: 'flex', gap: '8px', fontSize: '13px' }}>
            <span>ℹ️</span><span>데이터베이스를 생성한 후에는 VPC를 변경할 수 없습니다.</span>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label className="aws-label" style={{ marginBottom: '4px', display: 'block' }}>DB 서브넷 그룹 <span className="aws-info-link" style={{ fontSize: '12px' }}>정보</span></label>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>DB 서브넷 그룹을 선택합니다. DB 서브넷 그룹은 선택한 VPC에서 DB 클러스터가 어떤 서브넷과 IP 범위를 사용할 수 있는지를 정의합니다.</p>
            <select className="aws-input" style={{ maxWidth: '500px', appearance: 'auto' }}>
              <option>default-vpc-026e429eb34e47fb8 (6 서브넷, 6 가용 영역)</option>
            </select>
          </div>

          <div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
              <label className="aws-label">퍼블릭 액세스</label>
              <span className="aws-info-link" style={{ fontSize: '12px' }}>정보</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxWidth: '700px' }}>
              {[
                { id: 'yes', label: '예', desc: 'RDS는 클러스터에 퍼블릭 IP 주소를 할당합니다. VPC 외부의 Amazon EC2 인스턴스 및 다른 리소스가 클러스터에 연결할 수 있습니다.' },
                { id: 'no', label: '아니요', desc: 'RDS는 클러스터에 퍼블릭 IP 주소를 할당하지 않습니다. VPC 내부의 Amazon EC2 인스턴스 및 다른 리소스만 클러스터에 연결할 수 있습니다.' },
              ].map(o => (
                <label key={o.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', padding: '14px', border: `1px solid ${publicAccess === o.id ? '#0073bb' : 'var(--border-light)'}`, borderRadius: '4px', background: publicAccess === o.id ? '#f0f7ff' : '#fff' }} onClick={() => setPublicAccess(o.id)}>
                  <input type="radio" checked={publicAccess === o.id} readOnly style={{ marginTop: '3px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{o.label}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{o.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="submit" className="aws-btn-primary" style={{ padding: '10px 24px' }}>데이터베이스 생성</button>
          <button type="button" className="aws-input" style={{ width: 'auto', background: '#fff', padding: '10px 16px' }} onClick={onBack}>취소</button>
        </div>
      </form>
    </div>
  );
}

// ── DB 상세 페이지 ─────────────────────────────────────────
function RDSDetail({ db, questState, onBack, onSecurityGroup }) {
  const [activeTab, setActiveTab] = useState('conn');
  const TABS = ['연결 및 보안', '모니터링', '로그 및 이벤트', '구성', '제로 ETL 통합', '유지 관리 및 백업', '태그', '권장 사항'];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', marginBottom: '16px' }}>
        <a href="#" className="aws-info-link" onClick={e => { e.preventDefault(); onBack('list'); }}>RDS</a>
        <ChevronRight size={14} color="var(--text-secondary)" />
        <a href="#" className="aws-info-link" onClick={e => { e.preventDefault(); onBack('list'); }}>데이터베이스</a>
        <ChevronRight size={14} color="var(--text-secondary)" />
        <span style={{ color: 'var(--text-secondary)' }}>{db.name}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 600 }}>{db.name}</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="aws-input" style={{ width: 'auto', background: '#fff', padding: '6px 16px', fontSize: '13px' }}>🔄</button>
          <button className="aws-input" style={{ width: 'auto', background: '#fff', padding: '6px 16px', fontSize: '13px' }}>수정</button>
          <button className="aws-input" style={{ width: 'auto', background: '#fff', padding: '6px 16px', fontSize: '13px' }}>작업 ▼</button>
        </div>
      </div>

      {/* 요약 */}
      <div className="aws-panel" style={{ marginBottom: '0', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>요약</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '16px' }}>
          {[
            ['DB 식별자', db.name],
            ['상태', <span key="s" style={{ color: '#1d8102' }}>✅ 사용 가능</span>],
            ['역할', '인스턴스'],
            ['엔진', 'MySQL Community'],
            ['권장 사항', <span key="r" style={{ color: '#0073bb' }}>■ 2 유용</span>],
          ].map(([label, value], i) => (
            <div key={i}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '4px' }}>{label}</div>
              <div style={{ fontSize: '14px' }}>{value}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
          {[
            ['CPU', '2.95%'],
            ['클래스', 'db.t4g.micro'],
            ['현재 활동', '0 연결'],
            ['리전 및 AZ', 'ap-northeast-2a'],
            ['', ''],
          ].map(([label, value], i) => (
            <div key={i}>
              {label && <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '4px' }}>{label}</div>}
              {value && <div style={{ fontSize: '14px' }}>{value}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* 탭 */}
      <div style={{ background: '#fff', borderLeft: '1px solid var(--border-light)', borderRight: '1px solid var(--border-light)', display: 'flex', flexWrap: 'wrap', overflowX: 'auto' }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '10px 18px', border: 'none', background: 'transparent', cursor: 'pointer', whiteSpace: 'nowrap',
            fontSize: '13px', fontWeight: activeTab === tab ? 700 : 400,
            color: activeTab === tab ? '#0073bb' : 'var(--text-primary)',
            borderBottom: activeTab === tab ? '3px solid #0073bb' : '3px solid transparent',
          }}>
            {tab}
          </button>
        ))}
      </div>

      {/* 탭 내용 */}
      <div className="aws-panel" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
        {activeTab === '연결 및 보안' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '32px' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>엔드포인트 및 포트</h3>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '4px' }}>엔드포인트</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
                  <span>📋</span>
                  <span style={{ color: '#0073bb', wordBreak: 'break-all' }}>{db.endpoint}</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '4px' }}>포트</div>
                <div style={{ fontSize: '13px' }}>3306</div>
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>네트워킹</h3>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '4px' }}>가용 영역</div>
                <div style={{ fontSize: '13px' }}>ap-northeast-2a</div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '4px' }}>VPC</div>
                <div style={{ fontSize: '13px', color: '#0073bb' }}>vpc-026e429eb34e47fb8</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '4px' }}>서브넷 그룹</div>
                <div style={{ fontSize: '13px' }}>default-vpc-026e429eb34e47fb8</div>
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>보안</h3>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '4px' }}>VPC 보안 그룹</div>
                <a href="#" className="aws-info-link" style={{ fontSize: '13px' }} onClick={e => { e.preventDefault(); onSecurityGroup(db); }}>
                  default (sg-0ca0a81e2878d7541)
                </a>
                <div style={{ fontSize: '12px', color: '#1d8102', marginTop: '4px' }}>✅ 활성</div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '4px' }}>퍼블릭 액세스 가능</div>
                <div style={{ fontSize: '13px' }}>아니요</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '4px' }}>인증 기관</div>
                <div style={{ fontSize: '13px' }}>rds-ca-rsa2048-g1 (기본값)</div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
            실제 AWS 콘솔에서 확인하세요.
          </div>
        )}
      </div>
    </div>
  );
}

// ── DB 목록 ───────────────────────────────────────────────
function RDSList({ databases, questState, onCreate, onSelectDb }) {
  const isCreateStep = questState?.currentStep?.id?.includes('rds_create');

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', marginBottom: '12px' }}>
        <a href="#" className="aws-info-link">RDS</a>
        <ChevronRight size={13} color="var(--text-secondary)" style={{ display: 'inline', verticalAlign: 'middle', margin: '0 4px' }} />
        <span style={{ color: 'var(--text-secondary)' }}>데이터베이스</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600 }}>데이터베이스 ({databases.length})</h1>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>그룹 리소스 🔵</span>
          <button className="aws-input" style={{ width: 'auto', background: '#fff', padding: '5px 12px', fontSize: '13px' }}>🔄</button>
          <button className="aws-input" style={{ width: 'auto', background: '#fff', padding: '5px 12px', fontSize: '13px' }}>수정</button>
          <button className="aws-input" style={{ width: 'auto', background: '#fff', padding: '5px 12px', fontSize: '13px' }}>작업 ▼</button>
          <button className="aws-input" style={{ width: 'auto', background: '#fff', padding: '5px 12px', fontSize: '13px' }}>S3에서 복원</button>
          <button className="aws-btn-primary" onClick={onCreate} style={isCreateStep ? PULSE : {}}>데이터베이스 생성</button>
        </div>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <input placeholder="데이터베이스(를) 기준으로 필터링" className="aws-input" style={{ maxWidth: '400px', fontSize: '13px', padding: '6px 12px' }} readOnly />
      </div>

      <div style={{ background: '#fff', border: '1px solid var(--border-light)', borderRadius: '4px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '32px 2fr 1fr 1fr 1fr 1fr 1fr 1fr', padding: '10px 16px', borderBottom: '1px solid var(--border-light)', background: '#fafafa', fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)' }}>
          <span></span><span>DB 식별자 ▲</span><span>상태 ▼</span><span>역할 ▼</span><span>엔진 ▼</span><span>리전 및 AZ ▼</span><span>크기 ▼</span><span>CPU ▼</span>
        </div>
        {databases.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
            데이터베이스가 없습니다.<br />
            <span style={{ fontSize: '13px' }}>데이터베이스를 생성하여 시작하세요.</span>
          </div>
        ) : databases.map((db, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '32px 2fr 1fr 1fr 1fr 1fr 1fr 1fr', padding: '12px 16px', borderBottom: '1px solid var(--border-light)', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => onSelectDb(db)}>
            <input type="radio" readOnly style={{ cursor: 'pointer' }} />
            <a className="aws-info-link" style={{ fontWeight: 600, fontSize: '14px' }}>{db.name}</a>
            <span><span style={{ background: '#1d8102', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>✅ 사용 가능</span></span>
            <span style={{ fontSize: '13px' }}>인스턴스</span>
            <span style={{ fontSize: '13px' }}>MySQL Co...</span>
            <span style={{ fontSize: '13px' }}>ap-northeast-2a</span>
            <span style={{ fontSize: '13px' }}>db.t4g.micro</span>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>2.95%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 메인 컴포넌트 ──────────────────────────────────────────
export default function RDSConsole({ questState, onNavigate }) {
  const [view, setView] = useState('dashboard');
  const [databases, setDatabases] = useState([]);
  const [activeDb, setActiveDb] = useState(null);

  const isCreateStep = questState?.currentStep?.id?.includes('rds_create');

  if (view === 'create') {
    return (
      <RDSCreateForm
        questState={questState}
        onCreated={db => { setDatabases(prev => [...prev, db]); setView('list'); }}
        onBack={() => setView('dashboard')}
      />
    );
  }
  if (view === 'list') {
    return (
      <RDSList
        databases={databases}
        questState={questState}
        onCreate={() => setView('create')}
        onSelectDb={db => { setActiveDb(db); setView('detail'); }}
      />
    );
  }
  if (view === 'detail' && activeDb) {
    return (
      <RDSDetail
        db={activeDb}
        questState={questState}
        onBack={setView}
        onSecurityGroup={() => { if (onNavigate) onNavigate('ec2'); }}
      />
    );
  }

  // 대시보드
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', paddingBottom: '40px' }}>
      <div style={{ fontSize: '13px', marginBottom: '4px', color: 'var(--text-secondary)' }}>Amazon RDS &gt; 대시보드</div>
      <h1 style={{ fontSize: '26px', fontWeight: 600, marginBottom: '20px' }}>대시보드</h1>

      {/* 리소스 카드 */}
      <div className="aws-panel" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 700 }}>리소스</h2>
          <button className="aws-input" style={{ width: 'auto', background: '#fff', padding: '4px 12px', fontSize: '13px' }}>새로 고침</button>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          아시아 태평양 (서울) 리전에서 다음의 Amazon RDS 리소스를 사용하고 있습니다(사용량/할당량).
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div>
            <a className="aws-info-link" style={{ fontSize: '13px' }}>DB 인스턴스 ({databases.length}/40)</a>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>할당된 스토리지 (0.00 TB/100 TB)</div>
          </div>
          <div>
            <a className="aws-info-link" style={{ fontSize: '13px' }}>파라미터 그룹 (5)</a>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>기본값 (5)</div>
          </div>
        </div>
      </div>

      {/* 데이터베이스 생성 카드 */}
      <div className="aws-panel">
        <h2 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '16px' }}>데이터베이스 생성</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          <div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
              Amazon Relational Database Service(RDS)를 사용하면 클라우드에서 관계형 데이터베이스를 쉽게 설정, 운영 및 조정할 수 있습니다.
            </p>
            <button className="aws-btn-primary" onClick={() => setView('create')} style={isCreateStep ? PULSE : {}}>
              데이터베이스 생성
            </button>
          </div>
          <div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
              Amazon S3의 백업을 사용하여 새 Aurora MySQL 및 MySQL 데이터베이스를 복원하고 생성할 수 있습니다.
            </p>
            <button className="aws-input" style={{ width: 'auto', background: '#fff', padding: '8px 16px', fontSize: '13px' }}>
              S3에서 복원
            </button>
          </div>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '12px' }}>
          참고: DB 인스턴스가 <strong>아시아 태평양 (서울)</strong> 리전에서 시작됩니다.
        </p>
      </div>
    </div>
  );
}
