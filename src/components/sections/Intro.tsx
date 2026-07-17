import { bride, groom, wedding } from '../../data/invitation';
import styles from './Intro.module.css';

// 첫 화면 커버. 신랑·신부 영문 이름과 인용구, 예식일을 보여준다.
export function Intro() {
  return (
    <section className={styles.intro}>
      {/* 상단 여백용 (이름을 중앙에 유지) */}
      <span aria-hidden="true" />

      <div className={styles.center}>
        <h1 className={styles.names}>
          {groom.nameEn}
          <span className={styles.amp}>&amp;</span>
          {bride.nameEn}
        </h1>
      </div>

      <div className={styles.bottom}>
        <p className={styles.date}>{wedding.dateDot}</p>
        <p className={styles.dateSub}>{wedding.dateDaytime}</p>
        <p className={styles.venue}>{wedding.venueName}</p>
        <div className={styles.scroll}>
          SCROLL
          <span>⌄</span>
        </div>
      </div>
    </section>
  );
}
