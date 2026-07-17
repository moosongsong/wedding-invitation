declare global {
  interface Window {
    naver?: any;
  }
}

// 네이버 지도 스크립트는 index.html 에서 로드된다.
// 여기서는 window.naver.maps 가 준비될 때까지 폴링만 한다.
let readyPromise: Promise<void> | null = null;

export function loadNaverMaps(): Promise<void> {
  if (readyPromise) return readyPromise;

  readyPromise = new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      if (window.naver?.maps) {
        resolve();
      } else if (Date.now() - start >= 10000) {
        reject(new Error('네이버 지도 로드 실패'));
      } else {
        window.setTimeout(check, 100);
      }
    };
    check();
  });

  return readyPromise;
}
