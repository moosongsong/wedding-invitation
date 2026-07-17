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

// 예식장 · 피로연장 위치 및 오시는 길 안내
export function Location() {
  const mapRef = useRef<HTMLDivElement>(null);
  const query = encodeURIComponent(`${wedding.venueName} ${wedding.venueAddress}`);
  const maps = [
    { label: '카카오맵', url: `https://map.kakao.com/?q=${query}` },
    // 한국민속촌 공식 네이버 지도 단축링크
    { label: '네이버지도', url: 'https://naver.me/x8tpn3OO' },
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
        {maps.map((m) => (
          <a
            key={m.label}
            className={styles.mapBtn}
            href={m.url}
            target="_blank"
            rel="noreferrer"
          >
            {m.label}
          </a>
        ))}
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
