import React from 'react';

/**
 * 콘솔 내 특정 영역을 현재 스텝에 맞춰 하이라이트/딤 처리하는 래퍼.
 *
 * 사용 예:
 *   <FocusZone stepIds={['t1_c9_create']} currentStepId={currentStep?.id}>
 *     <button>환경 생성</button>
 *   </FocusZone>
 *
 * - stepIds 중 currentStepId가 포함되면 → focus-active (주황 링 + z-index 상승)
 * - hasActiveSibling=true 이고 비활성이면 → focus-dimmed (블러)
 * - 둘 다 아니면 → 기본 상태
 */
export default function FocusZone({
  stepIds,
  currentStepId,
  hasActiveSibling = false,
  children,
  style,
  className = '',
}) {
  const ids = Array.isArray(stepIds) ? stepIds : [stepIds];
  const isActive = currentStepId != null && ids.includes(currentStepId);
  const isDimmed = !isActive && hasActiveSibling;

  const cls = [
    'focus-zone',
    isActive ? 'focus-active' : '',
    isDimmed ? 'focus-dimmed' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={cls} style={style}>
      {children}
    </div>
  );
}
