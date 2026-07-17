import { useState } from 'react';
import { activeVariant, bride, groom, wedding } from '../../data/invitation';
import styles from './Closing.module.css';

// 마무리 인용구 + 청첩장 공유 버튼
export function Closing() {
  const [toast, setToast] = useState('');
  const closingQuote = activeVariant.closingQuote;

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(''), 1800);
  };

  const copyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    showToast('청첩장 주소가 복사되었습니다');
  };

  return (
    <section className={styles.closing}>
      <div className={styles.inner}>
        <p className={styles.quote}>{closingQuote.text}</p>
        {closingQuote.author && (
          <p className={styles.quoteAuthor}>{closingQuote.author}</p>
        )}

        <p className={styles.names}>
          {groom.nameEn} &amp; {bride.nameEn}
        </p>
        <p className={styles.date}>{wedding.dateDot}</p>

        <div className={styles.buttons}>
          <button className={styles.copy} onClick={copyLink}>
            🔗 청첩장 주소 복사하기
          </button>
        </div>

        <p className={styles.footer}>THANK YOU</p>
      </div>

      {toast && <div className={styles.toast}>{toast}</div>}
    </section>
  );
}
