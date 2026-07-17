import type { ReactNode } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './Section.module.css';

interface SectionProps {
  children: ReactNode;
  alt?: boolean;
  id?: string;
}

// 모든 섹션을 감싸는 래퍼.
// 배경색은 <section> 에 항상 불투명하게 유지하고,
// 페이드인 애니메이션은 안쪽 콘텐츠(inner)에만 적용해
// 스크롤 시 배경이 늦게 채워지는 현상을 방지한다.
export function Section({ children, alt = false, id }: SectionProps) {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section id={id} className={`${styles.section} ${alt ? styles.alt : ''}`}>
      <div ref={ref} className={`${styles.inner} reveal`}>
        {children}
      </div>
    </section>
  );
}
