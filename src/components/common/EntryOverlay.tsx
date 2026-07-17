import { useState } from 'react';
import { activeVariant, bride, groom, wedding } from '../../data/invitation';
import styles from './EntryOverlay.module.css';

// URL 쿼리(?to=이름 또는 ?guest=이름)에서 하객 이름을 읽는다.
function getGuestName(): string {
  try {
    const params = new URLSearchParams(window.location.search);
    return (params.get('to') || params.get('guest') || '').trim();
  } catch {
    return '';
  }
}

// 입장 화면. 어두운 화면에서 터치하면 서서히 밝아지며(페이드아웃) 커버가 드러난다.
// 이 터치가 배경음악 자동재생(브라우저 정책)을 해제하는 사용자 동작이 된다.
// ?to=하객이름 이 있으면 "OOO 님을 초대합니다" 문구를 함께 보여준다.
export function EntryOverlay({ onEnter }: { onEnter: () => void }) {
  const [opening, setOpening] = useState(false);
  const guest = getGuestName();

  const open = () => {
    if (opening) return;
    setOpening(true);
    // 밝아지는 전환이 끝난 뒤 오버레이 제거
    window.setTimeout(onEnter, 1200);
  };

  return (
    <div
      className={`${styles.overlay} ${opening ? styles.opening : ''}`}
      onClick={open}
    >
      <div className={styles.content}>
        <p className={styles.eyebrow}>THE WEDDING OF</p>
        <p className={styles.names}>
          {groom.name} · {bride.name}
        </p>
        <p className={styles.date}>{wedding.dateDot}</p>

        {guest && (
          <p className={styles.guest}>
            <b>{guest}</b> 님을 초대합니다
          </p>
        )}

        <p className={styles.hint}>{activeVariant.entryHint}</p>
      </div>
    </div>
  );
}
