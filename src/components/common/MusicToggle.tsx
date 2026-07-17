import { useEffect, useRef, useState } from 'react';
import styles from './MusicToggle.module.css';

// 우측 상단 배경음악 토글 버튼.
// public/music/bgm.mp3 파일이 있으면 재생되며, 없어도 UI 는 정상 동작한다.
// 진입 시 자동 재생을 시도하고, 브라우저 정책으로 막히면
// 첫 사용자 상호작용(탭/클릭/스크롤/키 입력)에서 자동으로 재생을 시작한다.
export function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    // 배포 경로(base) 대응: dev 는 /music/..., 빌드는 /wedding-invitation/music/...
    const audio = new Audio(`${import.meta.env.BASE_URL}music/bgm.mp3`);
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    let started = false;
    const start = () => {
      if (started) return;
      audio
        .play()
        .then(() => {
          started = true;
          setPlaying(true);
          removeGestureListeners();
        })
        .catch(() => {
          // 아직 사용자 동작 전 → 첫 상호작용 대기
        });
    };

    const events: (keyof WindowEventMap)[] = [
      'pointerdown',
      'touchstart',
      'click',
      'keydown',
      'scroll',
    ];
    const onGesture = () => start();
    const removeGestureListeners = () => {
      events.forEach((e) => window.removeEventListener(e, onGesture));
    };

    // 1) 진입 즉시 자동 재생 시도
    start();
    // 2) 막히면 첫 상호작용에서 재생
    events.forEach((e) =>
      window.addEventListener(e, onGesture, { once: false, passive: true }),
    );

    return () => {
      removeGestureListeners();
      audio.pause();
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  };

  return (
    <button
      className={styles.toggle}
      onClick={toggle}
      aria-label={playing ? '배경음악 끄기' : '배경음악 켜기'}
    >
      <span className={`${styles.bars} ${playing ? styles.playing : ''}`}>
        <span />
        <span />
        <span />
        <span />
      </span>
    </button>
  );
}
