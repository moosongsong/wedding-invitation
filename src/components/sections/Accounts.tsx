import { useState } from 'react';
import { Section } from '../common/Section';
import { SectionTitle } from '../common/SectionTitle';
import { accounts } from '../../data/invitation';
import type { Account } from '../../types';
import styles from './Accounts.module.css';

function AccountCard({ account }: { account: Account }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const text = `${account.bank} ${account.number}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // 클립보드 API 미지원 환경 대비 fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <span className={styles.role}>{account.label}</span>
        <span className={styles.holder}>{account.holder}</span>
      </div>

      <div className={styles.accountBox}>
        <div className={styles.accountInfo}>
          <span className={styles.bank}>{account.bank}</span>
          <span className={styles.number}>{account.number}</span>
        </div>
        <button
          className={`${styles.copyBtn} ${copied ? styles.copyBtnDone : ''}`}
          onClick={copy}
          aria-label="계좌번호 복사"
        >
          {copied ? (
            '복사됨'
          ) : (
            <>
              <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinejoin="round"
                  d="M9 9h9v11H9zM6 15H4V4h11v2"
                />
              </svg>
              복사
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function AccountGroup({
  side,
  label,
}: {
  side: 'groom' | 'bride';
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const items = accounts.filter((a) => a.side === side);

  return (
    <div className={`${styles.accordion} ${open ? styles.accordionOpen : ''}`}>
      <button className={styles.head} onClick={() => setOpen((v) => !v)}>
        <span className={styles.headLabel}>{label}</span>
        <span className={`${styles.arrow} ${open ? styles.arrowOpen : ''}`}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 9l6 6 6-6"
            />
          </svg>
        </span>
      </button>
      {open && (
        <div className={styles.body}>
          {items.map((a) => (
            <AccountCard key={a.label} account={a} />
          ))}
        </div>
      )}
    </div>
  );
}

// 마음 전하실 곳 - 양가 계좌번호 (아코디언 + 인물별 카드 + 복사)
export function Accounts() {
  return (
    <Section>
      <SectionTitle
        title="마음 전하실 곳"
        subtitle="참석이 어려우신 분들을 위해 기재했습니다"
      />
      <p className={styles.desc}>너그러운 마음으로 양해 부탁드립니다</p>

      <div className={styles.groups}>
        <AccountGroup side="groom" label="신랑측에게" />
        <AccountGroup side="bride" label="신부측에게" />
      </div>
    </Section>
  );
}
