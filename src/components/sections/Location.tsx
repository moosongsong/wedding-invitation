import { useEffect, useRef } from 'react';
import { Section } from '../common/Section';
import { SectionTitle } from '../common/SectionTitle';
import { transports, venues, wedding } from '../../data/invitation';
import { loadNaverMaps } from '../../lib/naverMap';
import styles from './Location.module.css';

// 장소별 마커 색상 (예식장 / 피로연장)
const VENUE_COLORS = ['#9c8140', '#6b7f8a'];

// 라벨이 붙은 커스텀 마커 HTML
function markerContent(label: string, color: string) {
  return `<div style="transform:translate(-50%,-100%);text-align:center;">
    <div style="background:${color};color:#fff;font-size:11px;font-weight:600;padding:4px 9px;border-radius:14px;box-shadow:0 2px 6px rgba(0,0,0,.3);white-space:nowrap;">${label}</div>
    <div style="width:8px;height:8px;background:${color};transform:rotate(45deg);margin:-4px auto 0;"></div>
  </div>`;
}

// 한국민속촌 공식 네이버 지도 단축링크 (앱 미설치 시 웹 폴백 대상)
const NAVER_WEB_URL = 'https://naver.me/x8tpn3OO';

// 지도 앱 딥링크를 실행하되, 앱이 없으면 웹으로 연결한다.
// - Android: intent:// (browser_fallback_url 로 OS 가 미설치 시 자동 웹 전환)
// - iOS: 커스텀 스킴 시도 후, 전환되지 않으면(타이머 생존) 웹으로 폴백
// - 데스크톱: 웹으로만 연결
function openMapApp(opts: {
  scheme: string; // iOS 스킴 URL (예: 'nmap://place?...')
  path: string; // intent 경로 (스킴 제외, 예: 'place?...')
  androidScheme: string; // intent 의 scheme (예: 'nmap')
  androidPackage: string; // Android 패키지명
  webUrl: string; // 웹 폴백 URL
}) {
  const ua = navigator.userAgent;
  const isAndroid = /android/i.test(ua);
  const isiOS = /iphone|ipad|ipod/i.test(ua);

  if (!isAndroid && !isiOS) {
    window.open(opts.webUrl, '_blank', 'noopener');
    return;
  }

  if (isAndroid) {
    window.location.href =
      `intent://${opts.path}#Intent;scheme=${opts.androidScheme};package=${opts.androidPackage};` +
      `S.browser_fallback_url=${encodeURIComponent(opts.webUrl)};end`;
    return;
  }

  const start = Date.now();
  const timer = window.setTimeout(() => {
    if (Date.now() - start < 1800) window.location.href = opts.webUrl;
  }, 1200);
  window.addEventListener(
    'visibilitychange',
    () => {
      if (document.hidden) window.clearTimeout(timer);
    },
    { once: true },
  );
  window.location.href = opts.scheme;
}

// 네이버지도: 앱이 있으면 앱 실행, 없으면 웹으로 연결
function openNaverMap() {
  const { lat, lng, name } = venues[0];
  const path = `place?lat=${lat}&lng=${lng}&name=${encodeURIComponent(name)}&appname=moosongsong.github.io`;
  openMapApp({
    scheme: `nmap://${path}`,
    path,
    androidScheme: 'nmap',
    androidPackage: 'com.nhn.android.nmap',
    webUrl: NAVER_WEB_URL,
  });
}

// 카카오맵: 앱이 있으면 앱 실행, 없으면 웹으로 연결
function openKakaoMap(webUrl: string) {
  const { lat, lng } = venues[0];
  const path = `look?p=${lat},${lng}`;
  openMapApp({
    scheme: `kakaomap://${path}`,
    path,
    androidScheme: 'kakaomap',
    androidPackage: 'net.daum.android.map',
    webUrl,
  });
}

// 예식장 · 피로연장 위치 및 오시는 길 안내
export function Location() {
  const mapRef = useRef<HTMLDivElement>(null);
  const query = encodeURIComponent(`${wedding.venueName} ${wedding.venueAddress}`);
  const kakaoWebUrl = `https://map.kakao.com/?q=${query}`;
  const maps: { label: string; url?: string; onClick?: () => void }[] = [
    { label: '카카오맵', onClick: () => openKakaoMap(kakaoWebUrl) },
    { label: '네이버지도', onClick: openNaverMap },
  ];

  // 네이버 지도 로드 후 예식장·피로연장 마커 표시 + 두 지점이 모두 보이도록 범위 조정
  useEffect(() => {
    let cancelled = false;
    loadNaverMaps()
      .then(() => {
        if (cancelled || !mapRef.current || !window.naver?.maps) return;
        const { naver } = window;
        const map = new naver.maps.Map(mapRef.current, {
          center: new naver.maps.LatLng(venues[0].lat, venues[0].lng),
          zoom: 16,
          scrollWheel: false, // 페이지 스크롤 방해 방지
        });

        const bounds = new naver.maps.LatLngBounds();
        venues.forEach((v, i) => {
          const position = new naver.maps.LatLng(v.lat, v.lng);
          bounds.extend(position);
          new naver.maps.Marker({
            position,
            map,
            icon: {
              content: markerContent(v.type, VENUE_COLORS[i % VENUE_COLORS.length]),
              anchor: new naver.maps.Point(0, 0),
            },
          });
        });
        map.fitBounds(bounds, { top: 70, right: 60, bottom: 50, left: 60 });
      })
      .catch(() => {
        // 로드/인증 실패 시 지도 영역만 비워둔다
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Section alt>
      <SectionTitle eyebrow="Location" subtitle="오시는 길을 안내합니다" />

      <div className={styles.venue}>
        <p className={styles.venueName}>{wedding.venueName}</p>
        <p className={styles.venueAddr}>{wedding.venueAddress}</p>
      </div>

      <div className={styles.map}>
        <div ref={mapRef} className={styles.mapFrame} />
      </div>

      <ul className={styles.legend}>
        {venues.map((v, i) => (
          <li key={v.type}>
            <span className={styles.legendType}>
              <span
                className={styles.legendDot}
                style={{ background: VENUE_COLORS[i % VENUE_COLORS.length] }}
              />
              {v.type}
            </span>
            <span className={styles.legendName}>{v.name}</span>
          </li>
        ))}
      </ul>

      <div className={styles.mapButtons}>
        {maps.map((m) =>
          m.onClick ? (
            <button
              key={m.label}
              type="button"
              className={styles.mapBtn}
              onClick={m.onClick}
            >
              {m.label}
            </button>
          ) : (
            <a
              key={m.label}
              className={styles.mapBtn}
              href={m.url}
              target="_blank"
              rel="noreferrer"
            >
              {m.label}
            </a>
          ),
        )}
      </div>

      <div className={styles.transports}>
        {transports.map((t) => (
          <div key={t.type} className={styles.transport}>
            <div className={styles.tType}>{t.type}</div>
            <div className={styles.tLines}>
              {t.lines.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
