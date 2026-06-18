import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

const PULSE = { animation: 'step-panel-pulse 1.5s ease-in-out infinite', outline: '2px solid #ff9900', outlineOffset: '3px' };

const SG_ID = 'sg-0ca0a81e2878d7541';
const SG_NAME = 'default';

function InboundRuleEditor({ questState, onSaved, onCancel }) {
  const isSgStep = questState?.currentStep?.id?.includes('sg_rds');

  const [rules, setRules] = useState([
    { id: 1, type: 'SSH', protocol: 'TCP', port: '22', source: '0.0.0.0/0', desc: '' },
  ]);
  const [newRule, setNewRule] = useState({ type: 'MYSQL/Aurora', protocol: 'TCP', port: '3306', source: '0.0.0.0/0', desc: '' });

  const handleSave = () => {
    const saved = [...rules, { ...newRule, id: 2 }];
    if (isSgStep) questState.completeCurrentStep();
    onSaved(saved);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', marginBottom: '16px' }}>
        <a href="#" className="aws-info-link" onClick={e => { e.preventDefault(); onCancel(); }}>EC2</a>
        <ChevronRight size={14} color="var(--text-secondary)" />
        <a href="#" className="aws-info-link" onClick={e => { e.preventDefault(); onCancel(); }}>보안 그룹</a>
        <ChevronRight size={14} color="var(--text-secondary)" />
        <span style={{ color: 'var(--text-secondary)' }}>인바운드 규칙 편집</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600 }}>인바운드 규칙 편집</h1>
      </div>

      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
        보안 그룹: <strong>{SG_NAME}</strong> ({SG_ID})
      </div>

      <div className={`aws-panel ${isSgStep ? 'success-glow' : ''}`} style={{ padding: 0, marginBottom: '20px' }}>
        {/* 헤더 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 2fr 2fr auto', padding: '10px 16px', background: '#fafafa', borderBottom: '1px solid var(--border-light)', fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)' }}>
          <span>유형</span><span>프로토콜</span><span>포트 범위</span><span>소스</span><span>설명 - 선택 사항</span><span></span>
        </div>

        {/* 기존 규칙 */}
        {rules.map(r => (
          <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 2fr 2fr auto', padding: '10px 16px', borderBottom: '1px solid var(--border-light)', alignItems: 'center', gap: '8px' }}>
            <div className="aws-input" style={{ padding: '5px 10px', fontSize: '13px', background: '#f0f0f0', color: 'var(--text-secondary)' }}>{r.type}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{r.protocol}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{r.port}</div>
            <div className="aws-input" style={{ padding: '5px 10px', fontSize: '13px', background: '#f0f0f0', color: 'var(--text-secondary)' }}>{r.source}</div>
            <div className="aws-input" style={{ padding: '5px 10px', fontSize: '13px', background: '#f0f0f0', color: 'var(--text-secondary)' }}>{r.desc || '—'}</div>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d13212', fontSize: '18px', lineHeight: 1 }} onClick={() => setRules(prev => prev.filter(x => x.id !== r.id))}>×</button>
          </div>
        ))}

        {/* 새 규칙 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 2fr 2fr auto', padding: '10px 16px', alignItems: 'center', gap: '8px', background: '#fffbf0', borderBottom: '1px solid var(--border-light)' }}>
          <select className="aws-input" value={newRule.type} onChange={e => {
            const t = e.target.value;
            const port = t === 'MYSQL/Aurora' ? '3306' : t === 'SSH' ? '22' : t === 'HTTP' ? '80' : t === 'HTTPS' ? '443' : '';
            setNewRule(prev => ({ ...prev, type: t, port }));
          }} style={{ fontSize: '13px', padding: '5px 10px', appearance: 'auto' }}>
            <option>MYSQL/Aurora</option>
            <option>SSH</option>
            <option>HTTP</option>
            <option>HTTPS</option>
            <option>사용자 지정 TCP</option>
            <option>모든 트래픽</option>
          </select>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', padding: '5px 0' }}>TCP</div>
          <input className="aws-input" value={newRule.port} onChange={e => setNewRule(prev => ({ ...prev, port: e.target.value }))} style={{ fontSize: '13px', padding: '5px 10px' }} />
          <input className="aws-input" value={newRule.source} onChange={e => setNewRule(prev => ({ ...prev, source: e.target.value }))} style={{ fontSize: '13px', padding: '5px 10px' }} placeholder="0.0.0.0/0" />
          <input className="aws-input" value={newRule.desc} onChange={e => setNewRule(prev => ({ ...prev, desc: e.target.value }))} style={{ fontSize: '13px', padding: '5px 10px' }} placeholder="설명" />
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d13212', fontSize: '18px', lineHeight: 1 }} onClick={() => setNewRule({ type: 'MYSQL/Aurora', protocol: 'TCP', port: '3306', source: '0.0.0.0/0', desc: '' })}>×</button>
        </div>

        <div style={{ padding: '12px 16px' }}>
          <button className="aws-info-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => {}}>
            + 규칙 추가
          </button>
        </div>
      </div>

      {isSgStep && (
        <div style={{ marginBottom: '16px', padding: '12px 16px', background: '#f1f8fa', border: '1px solid #0073bb', borderRadius: '4px', fontSize: '13px', color: '#0073bb' }}>
          💡 퀘스트: MYSQL/Aurora (포트 3306, 소스 0.0.0.0/0) 규칙이 추가되었습니다. <strong>규칙 저장</strong> 버튼을 눌러 완료하세요.
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px' }}>
        <button className="aws-btn-primary" onClick={handleSave} style={isSgStep ? PULSE : {}}>규칙 저장</button>
        <button className="aws-input" style={{ width: 'auto', background: '#fff', padding: '8px 16px', fontSize: '13px' }} onClick={onCancel}>취소</button>
      </div>
    </div>
  );
}

function SecurityGroupDetail({ questState, savedRules, onEditInbound, onBack }) {
  const isSgStep = questState?.currentStep?.id?.includes('sg_rds');

  const inboundRules = savedRules ?? [
    { type: 'SSH', protocol: 'TCP', port: '22', source: '0.0.0.0/0', desc: '' },
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', marginBottom: '16px' }}>
        <a href="#" className="aws-info-link" onClick={e => { e.preventDefault(); onBack('list'); }}>EC2</a>
        <ChevronRight size={14} color="var(--text-secondary)" />
        <a href="#" className="aws-info-link" onClick={e => { e.preventDefault(); onBack('list'); }}>보안 그룹</a>
        <ChevronRight size={14} color="var(--text-secondary)" />
        <span style={{ color: 'var(--text-secondary)' }}>{SG_NAME}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600 }}>{SG_NAME}</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="aws-input" style={{ width: 'auto', background: '#fff', padding: '6px 14px', fontSize: '13px' }}>작업 ▼</button>
        </div>
      </div>

      <div className="aws-panel" style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>세부 정보</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[['보안 그룹 ID', SG_ID], ['이름', SG_NAME], ['설명', 'default VPC security group'], ['VPC ID', 'vpc-026e429eb34e47fb8'], ['소유자', '123456789012'], ['인바운드 규칙 수', String(inboundRules.length)]].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '2px' }}>{k}</div>
              <div style={{ fontSize: '13px' }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 탭 */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', marginBottom: '0' }}>
        {['인바운드 규칙', '아웃바운드 규칙', '태그'].map(tab => (
          <button key={tab} style={{ padding: '8px 16px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '13px', fontWeight: tab === '인바운드 규칙' ? 700 : 400, borderBottom: tab === '인바운드 규칙' ? '3px solid #0073bb' : '3px solid transparent', color: tab === '인바운드 규칙' ? '#0073bb' : 'var(--text-primary)' }}>
            {tab}
          </button>
        ))}
      </div>

      <div className={`aws-panel ${isSgStep && !savedRules ? 'success-glow' : ''}`} style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700 }}>인바운드 규칙</h3>
          <button className="aws-btn-primary" onClick={onEditInbound} style={isSgStep && !savedRules ? PULSE : {}}>인바운드 규칙 편집</button>
        </div>

        <div style={{ border: '1px solid var(--border-light)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 2fr 2fr', padding: '8px 16px', background: '#fafafa', borderBottom: '1px solid var(--border-light)', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
            <span>유형</span><span>프로토콜</span><span>포트 범위</span><span>소스</span><span>설명</span>
          </div>
          {inboundRules.map((r, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 2fr 2fr', padding: '10px 16px', borderBottom: '1px solid var(--border-light)', fontSize: '13px', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, color: '#0073bb' }}>{r.type}</span>
              <span>{r.protocol}</span>
              <span>{r.port}</span>
              <span style={{ color: '#0073bb' }}>{r.source}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{r.desc || '—'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SecurityGroupList({ questState, onSelectSg }) {
  const isSgStep = questState?.currentStep?.id?.includes('sg_rds');

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', paddingBottom: '40px' }}>
      <div style={{ fontSize: '13px', marginBottom: '12px' }}>
        <a href="#" className="aws-info-link">EC2</a>
        <ChevronRight size={13} color="var(--text-secondary)" style={{ display: 'inline', verticalAlign: 'middle', margin: '0 4px' }} />
        <span style={{ color: 'var(--text-secondary)' }}>보안 그룹</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600 }}>보안 그룹</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="aws-input" style={{ width: 'auto', background: '#fff', padding: '6px 14px', fontSize: '13px' }}>작업 ▼</button>
          <button className="aws-btn-primary">보안 그룹 생성</button>
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid var(--border-light)', borderRadius: '4px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '32px 2fr 2fr 2fr 2fr 2fr', padding: '10px 16px', background: '#fafafa', borderBottom: '1px solid var(--border-light)', fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)' }}>
          <span></span><span>보안 그룹 ID ▲</span><span>보안 그룹 이름</span><span>설명</span><span>VPC ID</span><span>소유자</span>
        </div>
        <div
          style={{ display: 'grid', gridTemplateColumns: '32px 2fr 2fr 2fr 2fr 2fr', padding: '12px 16px', borderBottom: '1px solid var(--border-light)', alignItems: 'center', cursor: 'pointer', background: isSgStep ? '#fffbf0' : '#fff', outline: isSgStep ? '2px solid #ff9900' : 'none' }}
          onClick={() => onSelectSg()}
        >
          <input type="radio" readOnly />
          <a className="aws-info-link" style={{ fontWeight: 600, fontSize: '13px' }}>{SG_ID}</a>
          <span style={{ fontSize: '13px' }}>{SG_NAME}</span>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>default VPC security group</span>
          <span style={{ fontSize: '13px', color: '#0073bb' }}>vpc-026e429eb34e47fb8</span>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>123456789012</span>
        </div>
      </div>

      {isSgStep && (
        <div style={{ marginTop: '16px', padding: '12px 16px', background: '#f1f8fa', border: '1px solid #0073bb', borderRadius: '4px', fontSize: '13px', color: '#0073bb' }}>
          💡 퀘스트: <strong>default</strong> 보안 그룹을 클릭하여 인바운드 규칙을 편집하세요.
        </div>
      )}
    </div>
  );
}

export default function EC2Console({ questState, onNavigate }) {
  const [view, setView] = useState('sg-list');
  const [savedRules, setSavedRules] = useState(null);

  if (view === 'sg-edit') {
    return (
      <InboundRuleEditor
        questState={questState}
        onSaved={rules => { setSavedRules(rules); setView('sg-detail'); }}
        onCancel={() => setView('sg-detail')}
      />
    );
  }
  if (view === 'sg-detail') {
    return (
      <SecurityGroupDetail
        questState={questState}
        savedRules={savedRules}
        onEditInbound={() => setView('sg-edit')}
        onBack={setView}
      />
    );
  }

  return (
    <SecurityGroupList
      questState={questState}
      onSelectSg={() => setView('sg-detail')}
    />
  );
}
