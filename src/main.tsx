import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { bride, groom } from './data/invitation';
import './index.css';

// 탭 제목을 이름 데이터 기준으로 설정 (index.html 의 %VITE_%가 미치환돼도 안전)
document.title = `${groom.name} ♥ ${bride.name}의 결혼식에 초대합니다`;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
