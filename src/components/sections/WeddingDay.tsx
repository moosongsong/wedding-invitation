import { Section } from '../common/Section';
import { SectionTitle } from '../common/SectionTitle';
import { useCountdown } from '../../hooks/useCountdown';
import { bride, groom, wedding } from '../../data/invitation';
import styles from './WeddingDay.module.css';

const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// 달력 데이터 계산 (예식일이 속한 달)
function buildCalendar(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i += 1) cells.push(null);
  for (let d = 1; d <= lastDate; d += 1) cells.push(d);
  return cells;
}

export function WeddingDay() {
  const target = new Date(wedding.date);
  const weddingDate = target.getDate();
  const cells = buildCalendar(target);
  const { days, hours, minutes, seconds, isPast } = useCountdown(wedding.date);

  const units = [
    { num: days, label: 'DAYS' },
    { num: hours, label: 'HOURS' },
    { num: minutes, label: 'MINUTES' },
    { num: seconds, label: 'SECONDS' },
  ];

  return (
    <Section>
      <SectionTitle eyebrow="Wedding Day" />

      <p className={styles.dateLabel}>{wedding.dateLabel}</p>
      <p className={styles.dateLabelEn}>{wedding.dateLabelEn}</p>

      <div className={styles.calendar}>
        <div className={styles.grid}>
          {DOW.map((d, i) => (
            <div
              key={`dow-${i}`}
              className={`${styles.dow} ${i === 0 ? styles.sun : ''}`}
            >
              {d}
            </div>
          ))}
          {cells.map((c, i) => {
            if (c === null) return <div key={`e-${i}`} className={styles.empty} />;
            const isSun = i % 7 === 0;
            const isWedding = c === weddingDate;
            return (
              <div
                key={`d-${c}`}
                className={`${styles.day} ${isSun ? styles.sun : ''} ${
                  isWedding ? styles.wedding : ''
                }`}
              >
                {c}
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.countdown}>
        {units.map((u) => (
          <div key={u.label} className={styles.unit}>
            <div className={styles.num}>{String(u.num).padStart(2, '0')}</div>
            <div className={styles.label}>{u.label}</div>
          </div>
        ))}
      </div>

      <p className={styles.dday}>
        {isPast ? (
          <>
            {groom.name} ♥ {bride.name}, 결혼을 진심으로 축하합니다
          </>
        ) : (
          <>
            {groom.name} · {bride.name}의 결혼식이 <b>{days}일</b> 남았습니다
          </>
        )}
      </p>
    </Section>
  );
}
