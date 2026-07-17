import type { ReactNode } from 'react';
import { Section } from '../common/Section';
import { SectionTitle } from '../common/SectionTitle';
import { information } from '../../data/invitation';
import styles from './Information.module.css';

// **별표**로 감싼 부분을 <strong> 으로 변환한다.
function renderRich(text: string): ReactNode[] {
  return text.split('**').map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>,
  );
}

// 결혼식 안내 - 예식/식사/입장/주차/민속촌 이용 안내
export function Information() {
  return (
    <Section>
      <SectionTitle eyebrow="Information" subtitle="결혼식 안내" />

      <div className={styles.intro}>
        {information.intro.map((line, i) => (
          <p key={i}>{renderRich(line)}</p>
        ))}
      </div>

      <div className={styles.blocks}>
        {information.blocks.map((block, i) => (
          <div key={i} className={styles.block}>
            <div className={styles.header}>
              <span className={styles.icon}>{block.icon}</span>
              <span className={styles.title}>{block.title}</span>
            </div>
            <ul className={styles.items}>
              {block.items.map((item, j) => (
                <li key={j}>{renderRich(item)}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={styles.outro}>
        {information.outro.map((line, i) => (
          <p key={i}>{renderRich(line)}</p>
        ))}
      </div>
    </Section>
  );
}
