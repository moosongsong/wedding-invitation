import { useEffect, useState } from 'react';

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function calc(target: number): Countdown {
  const diff = target - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { days, hours, minutes, seconds, isPast: false };
}

// 예식일까지 남은 시간을 1초 단위로 갱신한다.
export function useCountdown(targetDate: string): Countdown {
  const target = new Date(targetDate).getTime();
  const [countdown, setCountdown] = useState<Countdown>(() => calc(target));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(calc(target));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  return countdown;
}
