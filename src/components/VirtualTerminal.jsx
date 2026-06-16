import React, { useState, useRef, useEffect } from 'react';
import { Terminal } from 'lucide-react';

export default function VirtualTerminal({ questState, onNavigate, s3Buckets = [] }) {
  const [logs, setLogs] = useState([
    { type: 'system', text: 'Welcome to AWS Cloud9 Terminal' },
    { type: 'system', text: 'Amazon Linux 2 AMI' }
  ]);
  const [input, setInput] = useState('');
  const [currentPath, setCurrentPath] = useState('~');
  const [inGitRepo, setInGitRepo] = useState(false);
  const endRef = useRef(null);

  const currentStepId = questState.currentStep.id;

  const getPrompt = () => {
    const branch = inGitRepo ? ' (main)' : '';
    return `ec2-user:${currentPath}${branch} $`;
  };

  const handleCommand = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim();
    const newLogs = [...logs, { type: 'input', text: `${getPrompt()} ${cmd}` }];

    // ── 실수 이벤트: git push (API 키 노출 위험) ──
    if (cmd.startsWith('git push')) {
      newLogs.push({ type: 'error', text: 'Enumerating objects: 12, done.' });
      newLogs.push({ type: 'error', text: 'remote: warning: Detected possible secret in commit!' });
      newLogs.push({ type: 'error', text: 'remote: ──────────────────────────────────────────' });
      newLogs.push({ type: 'error', text: 'remote: !! OPENAI_API_KEY detected in .env file !!' });
      newLogs.push({ type: 'error', text: 'remote: ──────────────────────────────────────────' });
      newLogs.push({ type: 'error', text: '⚠ .env 파일이 GitHub에 올라갔어요! .gitignore에 추가하세요.' });
      setTimeout(() => questState.triggerMistake?.('api_key_exposed'), 800);
      setLogs([...newLogs]);
      setInput('');
      return;
    }

    if (cmd.startsWith('git clone')) {
      newLogs.push({ type: 'output', text: 'Cloning into \'Nxt-Classic-Architecture\'...' });
      newLogs.push({ type: 'output', text: 'remote: Enumerating objects: 84, done.' });
      newLogs.push({ type: 'output', text: 'remote: Counting objects: 100% (84/84), done.' });
      newLogs.push({ type: 'output', text: 'Receiving objects: 100% (84/84), 1.23 MiB | 5.20 MiB/s, done.' });
      newLogs.push({ type: 'output', text: 'Resolving deltas: 100% (42/42), done.' });
      if (currentStepId.includes('clone') && cmd.includes('nxtcloud-org/Nxt-Classic-Architecture.git')) {
        setTimeout(() => questState.completeCurrentStep(), 500);
      }
    }
    else if (cmd.startsWith('cd ')) {
      const target = cmd.slice(3).trim();
      if (target.includes('1.Tutorial/3.Resume') || target.includes('3.Resume')) {
        const shortPath = '~/environment/Nxt-Classic-Architecture/1.Tutorial/3.Resume';
        setCurrentPath(shortPath);
        setInGitRepo(true);
        if (currentStepId.includes('_cd')) {
          setTimeout(() => questState.completeCurrentStep(), 300);
        }
      } else if (target === '..') {
        setCurrentPath(prev => prev.split('/').slice(0, -1).join('/') || '~');
      } else {
        setCurrentPath(prev => (prev === '~' ? `~/${target}` : `${prev}/${target}`));
      }
    }
    else if (cmd === 'npm install' || cmd === 'npm i') {
      newLogs.push({ type: 'output', text: '' });
      newLogs.push({ type: 'output', text: 'added 1423 packages, and audited 1424 packages in 28s' });
      newLogs.push({ type: 'output', text: '' });
      newLogs.push({ type: 'output', text: '221 packages are looking for funding' });
      newLogs.push({ type: 'output', text: '  run `npm fund` for details' });
      newLogs.push({ type: 'output', text: '' });
      newLogs.push({ type: 'output', text: 'found 0 vulnerabilities' });
      if (currentStepId.includes('npm_install')) {
        setTimeout(() => questState.completeCurrentStep(), 500);
      }
    }
    else if (cmd === 'npm run build') {
      newLogs.push({ type: 'output', text: '' });
      newLogs.push({ type: 'output', text: '> resume@0.1.0 build' });
      newLogs.push({ type: 'output', text: '> react-scripts build' });
      newLogs.push({ type: 'output', text: '' });
      newLogs.push({ type: 'output', text: 'Creating an optimized production build...' });
      newLogs.push({ type: 'output', text: 'Compiled successfully.' });
      newLogs.push({ type: 'output', text: '' });
      newLogs.push({ type: 'output', text: 'File sizes after gzip:' });
      newLogs.push({ type: 'output', text: '  52.4 kB  build/static/js/main.abc123.js' });
      newLogs.push({ type: 'output', text: '  1.78 kB  build/static/css/main.def456.css' });
      newLogs.push({ type: 'output', text: '' });
      newLogs.push({ type: 'output', text: 'Find out more about deployment here:' });
      newLogs.push({ type: 'link', text: '  https://cra.link/deployment' });
      if (currentStepId.includes('npm_build')) {
        setTimeout(() => questState.completeCurrentStep(), 500);
      }
    }
    else if (cmd.startsWith('aws s3 cp build s3://')) {
      const bucketPart = cmd.split('s3://')[1]?.split(' ')[0] || '';

      if (!bucketPart || bucketPart.startsWith('<')) {
        newLogs.push({ type: 'error', text: '오류: <버킷명> 부분을 실제 S3 버킷 이름으로 바꿔서 입력하세요.' });
        newLogs.push({ type: 'error', text: '예시) aws s3 cp build s3://my-bucket-name --recursive' });
      } else if (!s3Buckets.some(b => b.name === bucketPart)) {
        newLogs.push({ type: 'error', text: `An error occurred (NoSuchBucket) when calling the PutObject operation: The specified bucket does not exist` });
        newLogs.push({ type: 'error', text: `⚠ S3에서 버킷을 먼저 생성하거나 이름을 정확히 확인하세요.` });
      } else {
        newLogs.push({ type: 'output', text: `upload: build/index.html to s3://${bucketPart}/index.html` });
        newLogs.push({ type: 'output', text: `upload: build/asset-manifest.json to s3://${bucketPart}/asset-manifest.json` });
        newLogs.push({ type: 'output', text: `upload: build/static/css/main.def456.css to s3://${bucketPart}/static/css/main.def456.css` });
        newLogs.push({ type: 'output', text: `upload: build/static/js/main.abc123.js to s3://${bucketPart}/static/js/main.abc123.js` });
        newLogs.push({ type: 'output', text: `upload: build/static/media/profile.png to s3://${bucketPart}/static/media/profile.png` });
        if (currentStepId.includes('s3_cp')) {
          setTimeout(() => questState.completeCurrentStep(), 1500);
        }
      }
    }
    else if (cmd === 'ls' || cmd === 'ls -la') {
      if (currentPath.includes('3.Resume')) {
        newLogs.push({ type: 'output', text: 'build  node_modules  package.json  public  README.md  src' });
      } else if (currentPath === '~') {
        newLogs.push({ type: 'output', text: 'Nxt-Classic-Architecture' });
      } else {
        newLogs.push({ type: 'output', text: '.' });
      }
    }
    else if (cmd === 'pwd') {
      const fullPath = currentPath.replace('~', '/home/ec2-user');
      newLogs.push({ type: 'output', text: fullPath });
    }
    else if (cmd === 'clear') {
      setLogs([]);
      setInput('');
      return;
    }
    else {
      newLogs.push({ type: 'error', text: `bash: ${cmd.split(' ')[0]}: command not found` });
    }

    setLogs(newLogs);
    setInput('');
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#090a0f' }}>

      {/* Cloud9 상단 메뉴바 */}
      <div style={{
        background: '#333',
        borderBottom: '1px solid #555',
        display: 'flex',
        alignItems: 'center',
        height: '32px',
        padding: '0 12px',
        gap: '16px',
        flexShrink: 0
      }}>
        <button
          onClick={() => onNavigate && onNavigate('home')}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#ff9900',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: 700,
            padding: '0 8px 0 0',
            borderRight: '1px solid #555'
          }}
          title="AWS 콘솔로 돌아가기"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#ff9900">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
          </svg>
          AWS 콘솔
        </button>

        {['파일', '편집', '찾기', '보기', '이동', '실행', '도구', '창', '지원'].map(menu => (
          <span key={menu} style={{ fontSize: '12px', color: '#ccc', cursor: 'pointer' }}>{menu}</span>
        ))}
      </div>

      {/* 터미널 헤더 */}
      <div style={{ padding: '8px 16px', background: '#181c24', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Terminal size={16} color="#0f0" />
        <span style={{ fontSize: '13px', fontWeight: 500, color: '#ccc' }}>bash - ec2-user@ip-172-31-0-10</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', fontFamily: 'monospace', fontSize: '14px', lineHeight: 1.6 }}>
        {logs.map((log, i) => (
          <div key={i} style={{
            color: log.type === 'input' ? '#fff'
                 : log.type === 'system' ? '#0f0'
                 : log.type === 'link' ? '#5bc8f5'
                 : log.type === 'error' ? '#ff6b6b'
                 : '#ccc',
            whiteSpace: 'pre-wrap'
          }}>
            {log.text}
          </div>
        ))}
        <form onSubmit={handleCommand} style={{ display: 'flex', marginTop: '8px', alignItems: 'center' }}>
          <span style={{ color: '#0f0', marginRight: '8px', whiteSpace: 'nowrap' }}>{getPrompt()}</span>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            autoFocus
            style={{
              background: 'transparent', border: 'none', color: '#fff',
              fontFamily: 'monospace', fontSize: '14px', flex: 1, outline: 'none'
            }}
          />
        </form>
        <div ref={endRef} />
      </div>
    </div>
  );
}
