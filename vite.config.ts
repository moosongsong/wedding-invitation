import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

// 공유(og) 설명 문구를 기존 날짜·장소 변수로 조합한다.
// 예: "2027년 4월 24일 토요일 오전 11시 · 한국민속촌 충현서원"
function buildOgDesc(env: Record<string, string>): string {
  const iso = env.VITE_WEDDING_DATE || '2099-01-01T00:00:00';
  const d = new Date(iso);
  const h = d.getHours();
  const min = d.getMinutes();
  const ampm = h < 12 ? '오전' : '오후';
  const h12 = h % 12 || 12;
  const timeKo = `${ampm} ${h12}시${min ? ` ${min}분` : ''}`;
  const when = `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${WEEKDAYS[d.getDay()]}요일 ${timeKo}`;
  const where = [env.VITE_VENUE_NAME, env.VITE_VENUE_HALL].filter(Boolean).join(' ');
  return where ? `${when} · ${where}` : when;
}

// index.html 의 %VITE_OG_DESC% 를 조합된 문구로 치환하는 플러그인
function ogDescPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'og-desc',
    enforce: 'pre',
    transformIndexHtml(html) {
      return html.replaceAll('%VITE_OG_DESC%', buildOgDesc(env));
    },
  };
}

// https://vite.dev/config/
// GitHub Pages 프로젝트 사이트(https://moosongsong.github.io/wedding-invitation/)
// 배포 시 하위 경로가 필요하므로 build 에서만 base 를 지정한다. (dev 는 '/')
export default defineConfig(({ command, mode }) => {
  // .env 파일 값 + CI 의 process.env(워크플로 env) 병합 (CI 값 우선)
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env } as Record<string, string>;
  return {
    base: command === 'build' ? '/wedding-invitation/' : '/',
    plugins: [react(), ogDescPlugin(env)],
    server: {
      host: true,
      port: 5173,
    },
  };
});
