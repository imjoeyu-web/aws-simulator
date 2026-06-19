import { useState } from 'react';
import { ChevronRight, Folder, FileText, Save } from 'lucide-react';

const PULSE = { animation: 'step-panel-pulse 1.5s ease-in-out infinite', outline: '2px solid #ff9900', outlineOffset: '3px' };

function getEnvConfig(stepId) {
  if (stepId?.includes('client_env')) {
    return {
      filename: 'client/.env',
      fields: [{ key: 'REACT_APP_SERVER_URL', placeholder: 'http://<EC2_퍼블릭_IP>:8080', hint: 'EC2 퍼블릭 IP 주소와 포트를 입력하세요.' }],
      hint: 'client .env에 서버 주소를 입력하고 저장하세요.',
    };
  }
  if (stepId?.includes('env_server')) {
    return {
      filename: 'server/.env',
      fields: [
        { key: 'DB_HOST', placeholder: '<RDS 엔드포인트>', hint: 'RDS 콘솔 → 연결 및 보안 탭에서 복사' },
        { key: 'DB_USER', placeholder: 'admin', hint: 'RDS 생성 시 설정한 마스터 사용자 이름' },
        { key: 'DB_PASSWORD', placeholder: '••••••••', hint: 'RDS 생성 시 설정한 마스터 암호', secret: true },
        { key: 'DB_NAME', placeholder: 'texts', hint: 'MySQL에서 생성한 데이터베이스 이름' },
      ],
      hint: 'DB 접속 정보를 입력하고 저장하세요.',
    };
  }
  if (stepId?.includes('env_files')) {
    return {
      filename: 'server/.env',
      fields: [
        { key: 'DB_HOST', placeholder: '<RDS 엔드포인트>', hint: 'RDS 콘솔 → 연결 및 보안 탭에서 복사' },
        { key: 'DB_USER', placeholder: 'admin', hint: 'RDS 생성 시 설정한 마스터 사용자 이름' },
        { key: 'DB_PASSWORD', placeholder: '••••••••', hint: 'RDS 생성 시 설정한 마스터 암호', secret: true },
        { key: 'DB_NAME', placeholder: 'notes', hint: 'MySQL에서 생성한 데이터베이스 이름' },
      ],
      hint: '.env 파일에 DB 접속 정보를 입력하고 저장하세요.',
    };
  }
  return null;
}

// 프로젝트 파일 트리 (튜토리얼에 따라 다른 구조)
function getFileTree(stepId) {
  const isT2 = stepId?.startsWith('t2_');
  const repoName = isT2 ? '2.RandomTextApp' : '3.AINotesApp';
  return [
    { name: repoName, type: 'folder', open: true, children: [
      { name: 'client', type: 'folder', open: stepId?.includes('client_env'), children: [
        { name: '.env', type: 'file', highlight: stepId?.includes('client_env') },
        { name: 'src', type: 'folder' },
        { name: 'package.json', type: 'file' },
      ]},
      { name: 'server', type: 'folder', open: stepId?.includes('env_server') || stepId?.includes('env_files'), children: [
        { name: '.env', type: 'file', highlight: stepId?.includes('env_server') || stepId?.includes('env_files') },
        { name: 'server.js', type: 'file' },
        { name: 'package.json', type: 'file' },
      ]},
      ...(stepId?.includes('env_files') ? [{ name: 'lambda', type: 'folder', children: [] }] : []),
      { name: 'README.md', type: 'file' },
    ]},
  ];
}

function FileTreeNode({ node, depth = 0 }) {
  const [open, setOpen] = useState(node.open ?? false);
  const indent = depth * 16;

  return (
    <div>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 8px', paddingLeft: `${8 + indent}px`, cursor: 'pointer', background: node.highlight ? 'rgba(255,153,0,0.15)' : 'transparent', color: node.highlight ? '#ff9900' : '#cccccc', fontSize: '13px' }}
        onClick={() => node.type === 'folder' && setOpen(v => !v)}
      >
        {node.type === 'folder'
          ? <Folder size={14} style={{ flexShrink: 0, color: '#f0c674' }} />
          : <FileText size={14} style={{ flexShrink: 0, color: node.highlight ? '#ff9900' : '#aaaaaa' }} />}
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{node.name}</span>
        {node.highlight && <span style={{ marginLeft: '4px', fontSize: '11px', color: '#ff9900' }}>●</span>}
      </div>
      {node.type === 'folder' && open && node.children?.map((child, i) => (
        <FileTreeNode key={i} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

export default function Cloud9IDE({ questState, onComplete }) {
  const stepId = questState?.currentStep?.id;
  const envConfig = getEnvConfig(stepId);
  const fileTree = getFileTree(stepId);
  const [values, setValues] = useState(() =>
    Object.fromEntries((envConfig?.fields ?? []).map(f => [f.key, '']))
  );
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    questState.completeCurrentStep?.();
    if (onComplete) onComplete();
  };

  const allFilled = envConfig?.fields.every(f => values[f.key]?.trim());

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', paddingBottom: '40px' }}>
      {/* 브레드크럼 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', marginBottom: '16px' }}>
        <a href="#" className="aws-info-link">AWS Cloud9</a>
        <ChevronRight size={14} color="var(--text-secondary)" />
        <span style={{ color: 'var(--text-secondary)' }}>IDE</span>
      </div>

      <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '4px' }}>Cloud9 IDE</h2>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
        {envConfig?.filename ? `파일 편집 중: ${envConfig.filename}` : '파일 편집기'}
      </p>

      <div style={{ border: '1px solid #333', borderRadius: '6px', overflow: 'hidden', background: '#1e1e1e', display: 'flex', minHeight: '500px' }}>
        {/* 파일 트리 */}
        <div style={{ width: '220px', flexShrink: 0, background: '#252526', borderRight: '1px solid #333', overflowY: 'auto' }}>
          <div style={{ padding: '8px 10px', fontSize: '11px', fontWeight: 700, color: '#858585', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #333' }}>탐색기</div>
          <div style={{ padding: '4px 0' }}>
            {fileTree.map((node, i) => <FileTreeNode key={i} node={node} depth={0} />)}
          </div>
        </div>

        {/* 에디터 영역 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* 탭 바 */}
          <div style={{ background: '#2d2d2d', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', gap: '0' }}>
            {envConfig?.filename && (
              <div style={{ padding: '8px 16px', fontSize: '13px', color: '#ff9900', background: '#1e1e1e', borderRight: '1px solid #333', borderBottom: '2px solid #ff9900', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={12} />
                {envConfig.filename.split('/').pop()}
              </div>
            )}
          </div>

          {/* 에디터 내용 */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
            {saved ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>✅</div>
                <div style={{ fontSize: '16px', color: '#4ec9b0', fontWeight: 700, marginBottom: '8px' }}>.env 파일이 저장되었습니다!</div>
                <div style={{ fontSize: '13px', color: '#858585' }}>다음 단계를 진행하세요.</div>
              </div>
            ) : envConfig ? (
              <div>
                {/* 퀘스트 힌트 */}
                <div style={{ background: 'rgba(255,153,0,0.1)', border: '1px solid rgba(255,153,0,0.4)', borderRadius: '4px', padding: '10px 14px', marginBottom: '20px', fontSize: '13px', color: '#ff9900' }}>
                  💡 퀘스트: {envConfig.hint}
                </div>

                {/* .env 라인들 */}
                <div style={{ fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.8' }}>
                  {envConfig.fields.map((field, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '4px' }}>
                      <span style={{ color: '#9cdcfe', minWidth: field.key.length * 8.5 + 'px' }}>{field.key}</span>
                      <span style={{ color: '#d4d4d4', margin: '0 4px' }}>=</span>
                      <input
                        type={field.secret ? 'password' : 'text'}
                        value={values[field.key]}
                        onChange={e => setValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        title={field.hint}
                        style={{ flex: 1, background: 'transparent', border: 'none', borderBottom: values[field.key] ? '1px solid #4ec9b0' : '1px solid #555', outline: 'none', color: '#ce9178', fontFamily: 'monospace', fontSize: '14px', padding: '2px 6px' }}
                      />
                    </div>
                  ))}
                </div>

                {/* 필드 힌트 */}
                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {envConfig.fields.map((field, i) => field.hint && (
                    <div key={i} style={{ fontSize: '12px', color: '#858585' }}>
                      <span style={{ color: '#9cdcfe', fontFamily: 'monospace' }}>{field.key}</span>: {field.hint}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ color: '#858585', fontSize: '13px' }}>파일을 선택하세요.</div>
            )}
          </div>

          {/* 하단 저장 바 */}
          {envConfig && !saved && (
            <div style={{ borderTop: '1px solid #333', padding: '12px 20px', background: '#252526', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: '#858585' }}>
                {allFilled ? '✅ 모든 필드가 입력되었습니다.' : `⚠ ${envConfig.fields.filter(f => !values[f.key]?.trim()).length}개 필드가 비어있습니다.`}
              </span>
              <button
                className="aws-btn-primary"
                onClick={handleSave}
                disabled={!allFilled}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', ...(allFilled ? PULSE : { opacity: 0.5, cursor: 'not-allowed' }) }}
              >
                <Save size={14} />
                저장 (Ctrl+S)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
