import React, { useState, useRef, useEffect } from 'react';
import { Search, HelpCircle, Settings, User } from 'lucide-react';

const REGIONS = [
  {
    group: '미국',
    items: [
      { name: '버지니아 북부', code: 'us-east-1' },
      { name: '오하이오',     code: 'us-east-2' },
      { name: '캘리포니아',   code: 'us-west-1' },
      { name: '오레곤',       code: 'us-west-2' },
    ],
  },
  {
    group: '아시아 태평양',
    items: [
      { name: '뭄바이',   code: 'ap-south-1' },
      { name: '오사카',   code: 'ap-northeast-3' },
      { name: '서울',     code: 'ap-northeast-2' },
      { name: '싱가포르', code: 'ap-southeast-1' },
      { name: '시드니',   code: 'ap-southeast-2' },
      { name: '도쿄',     code: 'ap-northeast-1' },
    ],
  },
  {
    group: '캐나다',
    items: [
      { name: '중부', code: 'ca-central-1' },
    ],
  },
  {
    group: '유럽',
    items: [
      { name: '프랑크푸르트', code: 'eu-central-1' },
      { name: '아일랜드',     code: 'eu-west-1' },
      { name: '런던',         code: 'eu-west-2' },
      { name: '파리',         code: 'eu-west-3' },
      { name: '스톡홀름',     code: 'eu-north-1' },
    ],
  },
  {
    group: '남아메리카',
    items: [
      { name: '상파울루', code: 'sa-east-1' },
    ],
  },
];

function getRegionDisplay(code) {
  for (const g of REGIONS) {
    const item = g.items.find(i => i.code === code);
    if (item) return `${g.group} (${item.name})`;
  }
  return code;
}

function hasBatchim(word) {
  const code = word.charCodeAt(word.length - 1);
  if (code < 0xAC00 || code > 0xD7A3) return false;
  return (code - 0xAC00) % 28 !== 0;
}

export default function Header({ currentService, onServiceSelect, questState, selectedRegion, setSelectedRegion, locked = false }) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [regionOpen, setRegionOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setRegionOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentStep = questState?.steps?.[questState?.currentStepIndex];
  const isRegionStep = currentStep?.id?.includes('region') ?? false;

  const handleRegionSelect = (code) => {
    setSelectedRegion(code);
    setRegionOpen(false);

    const isSeoul = code === 'ap-northeast-2';
    const regionStep = questState?.steps?.find(s => s.id?.includes('region'));
    const alreadyDone = questState?.completedSteps?.includes(regionStep?.id);

    if (isSeoul) {
      if (regionStep && !alreadyDone) questState.completeStep?.(regionStep.id);
    } else {
      let regionName = code;
      for (const g of REGIONS) {
        const item = g.items.find(i => i.code === code);
        if (item) { regionName = item.name; break; }
      }
      const copula = hasBatchim(regionName) ? '이었어' : '였어';
      questState.triggerMistake?.('wrong_region', {
        message: `서울인 줄 알았는데 ${regionName}${copula}... 리전마다 요금이 달라요 😅`,
      });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const term = searchTerm.toLowerCase();
    if (term.includes('cloud9') || term.includes('c9')) {
      onServiceSelect('cloud9');
    } else if (term.includes('s3')) {
      onServiceSelect('s3');
    } else if (term.includes('ec2')) {
      onServiceSelect('ec2');
    } else if (term.includes('rds') || term.includes('relational') || term.includes('mysql')) {
      onServiceSelect('rds');
    } else if (term.includes('lambda')) {
      onServiceSelect('lambda');
    } else if (term.includes('api gateway') || term.includes('apigateway')) {
      onServiceSelect('apigateway');
    }
    setSearchTerm('');
  };

  return (
    <header style={{
      display: 'flex', alignItems: 'center', padding: '0 16px', height: '40px',
      background: '#232f3e', color: '#ffffff', position: 'sticky', top: 0, zIndex: 10
    }}>
      {/* 로고 */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flexShrink: 0 }}
        onClick={() => onServiceSelect('home')}
      >
        <div style={{ color: '#ff9900' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
          </svg>
        </div>
        <span style={{ fontWeight: 600, fontSize: '15px' }}>AWS Simulator</span>
      </div>

      {/* 검색창 */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', padding: '0 24px' }}>
        <form
          onSubmit={handleSearchSubmit}
          style={{
            display: 'flex', alignItems: 'center',
            background: searchFocused ? '#ffffff' : '#16191f',
            border: `1px solid ${searchFocused ? 'var(--border-focus)' : 'transparent'}`,
            borderRadius: '2px', padding: '2px 8px',
            width: '100%', maxWidth: '400px', transition: 'all 0.1s'
          }}
        >
          <Search size={14} color={searchFocused ? '#545b64' : '#aab7b8'} style={{ marginRight: '6px' }} />
          <input
            type="text"
            placeholder="Search for services, features, blogs, docs, and more"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              background: 'transparent', border: 'none',
              color: searchFocused ? '#16191f' : '#ffffff',
              width: '100%', outline: 'none', fontSize: '13px'
            }}
          />
        </form>
      </div>

      {/* 우측 아이콘 + 리전 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>

        {/* 리전 드롭다운 */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            onClick={() => !locked && setRegionOpen(v => !v)}
            style={{
              background: 'transparent', color: locked ? '#888' : '#ffffff',
              fontSize: '13px', cursor: locked ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
              border: !locked && isRegionStep ? '2px solid #ff9900' : 'none',
              padding: !locked && isRegionStep ? '3px 8px' : '4px 0',
              borderRadius: !locked && isRegionStep ? '6px' : '0',
              animation: !locked && isRegionStep ? 'region-pulse 1.5s ease-in-out infinite' : 'none',
            }}
          >
            {getRegionDisplay(selectedRegion)}
            <span style={{ fontSize: '10px', marginLeft: '2px' }}>{regionOpen ? '▲' : '▼'}</span>
          </button>

          {regionOpen && (
            <div style={{
              position: 'absolute', right: 0, top: '36px',
              background: '#1a2332', color: '#d5dbdb',
              borderRadius: '4px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              width: '320px', zIndex: 100,
              border: '1px solid #2d3a4a', overflow: 'hidden'
            }}>
              {/* 탭 */}
              <div style={{
                display: 'flex', padding: '10px 12px 0', borderBottom: '1px solid #2d3a4a',
                gap: '4px'
              }}>
                <div style={{
                  padding: '4px 14px', borderRadius: '12px',
                  background: '#0073bb', color: '#fff',
                  fontSize: '12px', fontWeight: 600, cursor: 'pointer'
                }}>
                  리전
                </div>
                <div style={{
                  padding: '4px 14px', borderRadius: '12px',
                  color: '#aab7b8', fontSize: '12px', cursor: 'pointer'
                }}>
                  로컬 영역
                </div>
              </div>

              {/* 리전 목록 */}
              <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '8px 0' }}>
                {REGIONS.map(group => (
                  <div key={group.group}>
                    <div style={{
                      padding: '8px 16px 4px',
                      fontSize: '11px', fontWeight: 700,
                      color: '#8d9aab', textTransform: 'uppercase', letterSpacing: '0.5px'
                    }}>
                      {group.group}
                    </div>
                    {group.items.map(item => {
                      const isSelected = item.code === selectedRegion;
                      return (
                        <div
                          key={item.code}
                          onClick={() => handleRegionSelect(item.code)}
                          style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '6px 16px', cursor: 'pointer',
                            background: isSelected ? 'rgba(0,115,187,0.15)' : 'transparent',
                            transition: 'background 0.1s',
                          }}
                          onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
                          onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                        >
                          <span style={{
                            fontSize: '13px',
                            color: isSelected ? '#5dade2' : '#d5dbdb',
                            fontWeight: isSelected ? 700 : 400
                          }}>
                            {item.name}
                          </span>
                          <span style={{
                            fontSize: '12px',
                            color: isSelected ? '#5dade2' : '#8d9aab',
                            fontFamily: 'monospace'
                          }}>
                            {item.code}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* 하단 링크 */}
              <div style={{
                borderTop: '1px solid #2d3a4a', padding: '10px 16px',
                display: 'flex', gap: '16px'
              }}>
                <span style={{ fontSize: '12px', color: '#0073bb', cursor: 'pointer' }}>리전 관리</span>
                <span style={{ fontSize: '12px', color: '#0073bb', cursor: 'pointer' }}>로컬 영역 관리</span>
              </div>
            </div>
          )}
        </div>

        <HelpCircle size={16} style={{ cursor: 'pointer' }} />
        <Settings size={16} style={{ cursor: 'pointer' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
          <User size={16} />
          <span style={{ fontSize: '13px' }}>myjeong@daton.ai</span>
        </div>
      </div>
    </header>
  );
}
