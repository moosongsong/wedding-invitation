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

// 네이버지도: 앱이 있으면 앱 실행, 없으면 웹으로 연결
function openNaverMap() {
  const { lat, lng, name } = venues[0];
  const appName = 'moosongsong.github.io';
  const ua = navigator.userAgent;
  const isAndroid = /android/i.test(ua);
  const isiOS = /iphone|ipad|ipod/i.test(ua);

  // 데스크톱 등 모바일이 아니면 웹으로만 연결
  if (!isAndroid && !isiOS) {
    window.open(NAVER_WEB_URL, '_blank', 'noopener');
    return;
  }

  const placeQuery = `place?lat=${lat}&lng=${lng}&name=${encodeURIComponent(name)}&appname=${appName}`;

  if (isAndroid) {
    // 미설치 시 browser_fallback_url 로 OS 가 자동 웹 전환
    window.location.href =
      `intent://${placeQuery}#Intent;scheme=nmap;package=com.nhn.android.nmap;` +
      `S.browser_fallback_url=${encodeURIComponent(NAVER_WEB_URL)};end`;
    return;
  }

  // iOS: 앱 스킴 시도 후, 전환되지 않으면(타이머 생존) 웹으로 폴백
  const start = Date.now();
  const timer = window.setTimeout(() => {
    if (Date.now() - start < 1800) window.location.href = NAVER_WEB_URL;
  }, 1200);
  // 앱으로 전환되면 페이지가 백그라운드로 → 폴백 취소
  window.addEventListener(
    'visibilitychange',
    () => {
      if (document.hidden) window.clearTimeout(timer);
    },
    { once: true },
  );
  window.location.href = `nmap://${placeQuery}`;
}

// 예식장 · 피로연장 위치 및 오시는 길 안내
export function Location() {
  const mapRef = useRef<HTMLDivElement>(null);
  const query = encodeURIComponent(`${wedding.venueName} ${wedding.venueAddress}`);
  const maps: { label: string; url?: string; onClick?: () => void }[] = [
    { label: '카카오맵', url: `https://map.kakao.com/?q=${query}` },
    { label: '네이버지도', onClick: openNaverMap },
    { label: '티맵', url: `https://tmap.life/route?goalname=${query}` },
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
