import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
// GitHub Pages 프로젝트 사이트(https://moosongsong.github.io/wedding-invitation/)
// 배포 시 하위 경로가 필요하므로 build 에서만 base 를 지정한다. (dev 는 '/')
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/wedding-invitation/' : '/',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
}));
