import { useEffect, useState } from 'react';
import { Section } from '../common/Section';
import { SectionTitle } from '../common/SectionTitle';
import { bride, groom, interview } from '../../data/invitation';
import type { Person } from '../../types';
import styles from './AboutUs.module.css';

function ProfileCard({ person }: { person: Person }) {
  const isGroom = person.role === 'groom';
  return (
    <div className={`${styles.card} ${isGroom ? '' : styles.reverse}`}>
      <div
        className={`${styles.avatar} ${
          isGroom ? styles.groomAvatar : styles.brideAvatar
        }`}
      >
        {isGroom ? '🤵' : '👰‍♀️'}
      </div>
      <div>
        <p className={styles.role}>{isGroom ? 'GROOM' : 'BRIDE'}</p>
        <p className={styles.name}>
          {person.name}
          <small>{person.nameEn}</small>
        </p>
        <p className={styles.detail}>
          {person.birth}
          <br />
          {person.intro}
        </p>
      </div>
    </div>
  );
}

// 이모지(🤵/👰)로 시작하는 줄은 소제목처럼 강조
function isHeading(line: string) {
  return /^[🤵👰]/.test(line);
}

// 신랑·신부 개별 소개 + 인터뷰(버튼 → 전체 화면 모달)
export function AboutUs() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <Section alt>
      <SectionTitle eyebrow="About Us" subtitle="저희 커플을 소개합니다" />
      <p className={styles.tagline}>하나로 이어진 두 개의 우주</p>
      <div className={styles.cards}>
        <ProfileCard person={groom} />
        <ProfileCard person={bride} />
      </div>

      <p className={styles.interviewDesc}>{interview.subtitle}</p>
      <button className={styles.openBtn} onClick={() => setOpen(true)}>
        ✉️ 신랑 &amp; 신부의 인터뷰 읽어보기
      </button>

      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)}>
          <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
            <div className={styles.panelHead}>
              <span className={styles.panelTitle}>우리 두 사람의 이야기</span>
              <button
                className={styles.closeBtn}
                onClick={() => setOpen(false)}
                aria-label="닫기"
              >
                ×
              </button>
            </div>
            <div className={styles.panelBody}>
              {interview.qna.map((item, i) => (
                <div key={i} className={styles.qna}>
                  <p className={styles.q}>{item.q}</p>
                  {item.a.map((line, j) => (
                    <p
                      key={j}
                      className={isHeading(line) ? styles.aHead : styles.a}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
