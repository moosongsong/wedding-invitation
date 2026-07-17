import styles from './SectionTitle.module.css';

interface SectionTitleProps {
  eyebrow?: string; // 영문 대문자 제목 (생략 가능)
  title?: string; // 한글 굵은 제목 (영문 eyebrow 대신 사용)
  subtitle?: string;
}

// 영문 대문자 제목(또는 한글 제목) + 구분선 + 한글 부제 형태의 공통 섹션 헤더
export function SectionTitle({ eyebrow, title, subtitle }: SectionTitleProps) {
  return (
    <div className={styles.wrap}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <div className={styles.divider} />
      {title && <h3 className={styles.title}>{title}</h3>}
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}
