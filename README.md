# 💌 모바일 청첩장 (Wedding Invitation)

React + Vite + TypeScript 기반의 세로 스크롤 단일 페이지로 구성되어 있습니다.

## 실행 방법

```bash
npm install
npm run dev      # 개발 서버 (http://localhost:5173)
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기
```

## 구성 섹션

| 순서 | 섹션 | 설명 |
|------|------|------|
| 1 | Intro | 커버 — 신랑·신부 영문 이름, 인용구, 예식일 |
| 2 | Invitation | 초대 인사말 + 양가 혼주 소개 + 연락하기 |
| 3 | Wedding Day | 달력 + D-day 실시간 카운트다운 |
| 4 | About Us | 신랑·신부 개별 소개 + 인터뷰(모달) |
| 5 | Information | 결혼식 안내 |
| 6 | Location | 지도(예식장·피로연장) + 오시는 길 |
| 7 | 마음 전하실 곳 | 양가 계좌번호 — 복사 |
| 8 | Closing | 마무리 인용구 + 청첩장 공유 |

## 내용 수정

**`src/data/invitation.ts` 파일 하나만 수정하면** 청첩장 전체 내용(이름, 날짜, 계좌, 타임라인 등)이 교체됩니다.

- 사진: `public/images/gallery/` 에 `photo-1.jpg` ~ 넣기
- 배경음악: `public/music/bgm.mp3` 넣기
- 공유 대표 이미지: `public/images/og.jpg`

## 기술 참고

- **카카오톡 공유**: Web Share API 로 구현되어 있으며, 실제 카카오 공유는
  Kakao SDK(`Kakao.Share.sendDefault`) 연동이 필요합니다. (`Closing.tsx` 주석 참고)
- **지도**: 외부 지도 앱(카카오맵/네이버지도/티맵) 검색 링크로 연결됩니다.

## 폴더 구조

```
src/
├─ data/invitation.ts      # 청첩장 전체 콘텐츠 (여기만 수정)
├─ types/                  # 도메인 타입
├─ hooks/                  # useCountdown, useScrollReveal, useGuestbook
├─ components/
│  ├─ common/              # Section, SectionTitle, MusicToggle
│  └─ sections/            # 9개 섹션 컴포넌트
├─ App.tsx
└─ main.tsx
```
