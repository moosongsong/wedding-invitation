import { useEffect, useRef } from 'react';

// 요소가 뷰포트에 들어오면 is-visible 클래스를 붙여 페이드인 시킨다.
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      // 요소가 화면 하단에 들어오기 직전(아래쪽 여유 12%)부터 등장시켜
      // 스크롤 도착 시 콘텐츠가 이미 채워져 있도록 한다.
      { threshold: 0, rootMargin: '0px 0px 12% 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
