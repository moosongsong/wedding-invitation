import type {
  Account,
  Person,
  TransportItem,
  VenuePoint,
  WeddingInfo,
} from '../types';

// 이 파일 하나만 수정하면 청첩장 전체 내용이 교체됩니다.

// ===== 이름 (실제 값은 .env / GitHub Secret 으로 주입, 코드/커밋엔 안 남김) =====
// 미설정 시 아래 fallback(일반 명칭)이 표시됩니다.
const env = import.meta.env;
const GROOM_NAME = env.VITE_GROOM_NAME || '신랑';
const GROOM_NAME_EN = env.VITE_GROOM_NAME_EN || 'GROOM';
const GROOM_FIRST = env.VITE_GROOM_FIRST || GROOM_NAME; // 성 제외 이름 (캐주얼 문구용)
const BRIDE_NAME = env.VITE_BRIDE_NAME || '신부';
const BRIDE_NAME_EN = env.VITE_BRIDE_NAME_EN || 'BRIDE';
const BRIDE_FIRST = env.VITE_BRIDE_FIRST || BRIDE_NAME;
const GROOM_FATHER = env.VITE_GROOM_FATHER || '아버님';
const GROOM_MOTHER = env.VITE_GROOM_MOTHER || '어머님';
const BRIDE_FATHER = env.VITE_BRIDE_FATHER || '아버님';
const BRIDE_MOTHER = env.VITE_BRIDE_MOTHER || '어머님';

export const groom: Person = {
  role: 'groom',
  name: GROOM_NAME,
  nameEn: GROOM_NAME_EN,
  birth: '1996년 7월 용인 출생',
  intro: '동네를 지키는 멋진 경찰관👮‍♂️',
  phone: env.VITE_PHONE_GROOM || '010-0000-0000',
  father: GROOM_FATHER,
  mother: GROOM_MOTHER,
  fatherPhone: env.VITE_PHONE_GROOM_FATHER || '010-0000-0000',
  motherPhone: env.VITE_PHONE_GROOM_MOTHER || '010-0000-0000',
};

export const bride: Person = {
  role: 'bride',
  name: BRIDE_NAME,
  nameEn: BRIDE_NAME_EN,
  birth: '1998년 2월 서울 출생',
  intro: '방송국으로 출근하는 개발자 👩‍💻',
  phone: env.VITE_PHONE_BRIDE || '010-0000-0000',
  father: BRIDE_FATHER,
  mother: BRIDE_MOTHER,
  fatherPhone: env.VITE_PHONE_BRIDE_FATHER || '010-0000-0000',
  motherPhone: env.VITE_PHONE_BRIDE_MOTHER || '010-0000-0000',
};

// ===== 예식 일시 · 장소 (실제 값은 .env / GitHub Secret 으로 주입) =====
// 날짜는 ISO 값 하나로 모든 표시 문구를 자동 생성한다.
const WEDDING_DATE = env.VITE_WEDDING_DATE || '2099-01-01T00:00:00';
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

function buildDateLabels(iso: string) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const mo = d.getMonth() + 1;
  const day = d.getDate();
  const wd = WEEKDAYS[d.getDay()];
  const h = d.getHours();
  const min = d.getMinutes();
  const ampm = h < 12 ? '오전' : '오후';
  const h12 = h % 12 || 12;
  const timeKo = `${ampm} ${h12}시${min ? ` ${min}분` : ''}`;
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    dateLabel: `${y}년 ${mo}월 ${day}일 ${wd}요일 | ${timeKo}`,
    dateLabelEn: `${d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })} | ${h < 12 ? 'AM' : 'PM'} ${pad(h12)}:${pad(min)}`,
    dateDot: `${y} . ${pad(mo)} . ${pad(day)}`,
    dateDaytime: `${wd}요일 · ${timeKo}`,
  };
}

export const wedding: WeddingInfo = {
  date: WEDDING_DATE,
  ...buildDateLabels(WEDDING_DATE),
  venueName: env.VITE_VENUE_NAME || '웨딩홀',
  venueHall: env.VITE_VENUE_HALL || '',
  venueAddress: env.VITE_VENUE_ADDRESS || '',
};

// Location 지도에 표시할 장소들 (예식장 · 피로연장)
export const venues: VenuePoint[] = [
  {
    type: '예식장',
    name: env.VITE_VENUE_HALL || '예식장',
    lat: Number(env.VITE_CEREMONY_LAT) || 37.5665,
    lng: Number(env.VITE_CEREMONY_LNG) || 126.978,
  },
  {
    type: '피로연장',
    name: env.VITE_RECEPTION_NAME || '피로연장',
    lat: Number(env.VITE_RECEPTION_LAT) || 37.5665,
    lng: Number(env.VITE_RECEPTION_LNG) || 126.978,
  },
];

export const introQuote = {
  text: 'A successful marriage requires falling in love many times, always with the same person.',
  author: 'Mignon McLaughlin',
};

// ===== 대상별 버전 (친구용 / 부모님 지인용) =====
// 링크에 ?v=friend 를 붙이면 친구용, 없으면 기본(부모님 지인용)이 표시됩니다.
//   예) .../wedding-invitation/?v=friend
//   ?to=이름 과 함께 사용 가능: ?v=friend&to=홍길동
type VariantKey = 'family' | 'friend';

interface Variant {
  invitation: { poem: string[]; poemAuthor: string; message: string[] };
  entryHint: string;
  closingQuote: { text: string; author: string };
}

export const variants: Record<VariantKey, Variant> = {
  // 기본: 부모님 지인용 (정중한 톤)
  family: {
    invitation: {
      poem: [
        '사람이 온다는 건 실은 어마어마한 일이다.',
        '그는 그의 과거와 현재와 그리고',
        '그의 미래와 함께 오기 때문이다.',
        '한 사람의 일생이 오기 때문이다.',
      ],
      poemAuthor: "- 정현종, '방문객'",
      message: [
        '저희 두 사람이 함께하는 새로운 시작에',
        '귀한 발걸음으로 축복해 주시면 감사하겠습니다.',
      ],
    },
    entryHint: '터치하여 초대장을 열어주세요',
    closingQuote: {
      text: '"당신은 내가 더 좋은 사람이고 싶게 만들어요."',
      author: "- 영화 '이보다 더 좋을 순 없다' 중",
    },
  },

  // 친구용 (편안한 톤)
  friend: {
    invitation: {
      poem: [],
      poemAuthor: '',
      message: [
        '우리 드디어 결혼해! 🎉',
        '늘 곁에서 함께해준 너희에게',
        '가장 먼저 이 소식을 전하고 싶었어.',
        '',
        '바쁘겠지만 꼭 와서 축하해 주라!',
      ],
    },
    entryHint: '터치해서 청첩장 열어보기 🎉',
    closingQuote: {
      text: '"우리 결혼식에서 꼭 보자!"',
      author: '',
    },
  },
};

function currentVariantKey(): VariantKey {
  try {
    return new URLSearchParams(window.location.search).get('v') === 'friend'
      ? 'friend'
      : 'family';
  } catch {
    return 'family';
  }
}

// 현재 URL 에 맞는 버전 (컴포넌트에서 이 값을 사용)
export const activeVariant: Variant = variants[currentVariantKey()];

export const transports: TransportItem[] = [
  {
    type: '자차',
    lines: [`내비게이션 : '${wedding.venueName}' 검색`, wedding.venueAddress],
  },
  {
    type: '버스',
    lines: [
      '직행 5001-1(신논현) · 1560(강남역) · 4101(서울역)',
      '공항버스 A8877 (인천공항 → 한국민속촌)',
    ],
  },
  {
    type: '지하철',
    lines: [
      '수인분당선 상갈역 3번 출구 → 37·10-5번 버스 환승',
      '1호선 수원역 → 37·10-5번 버스 환승',
    ],
  },
  {
    type: '주차',
    lines: [
      '소형 2,000원 · 대형 3,000원',
      '장애인 등록차량 50% 할인',
    ],
  },
];

export const accounts: Account[] = [
  {
    side: 'groom',
    label: '신랑',
    bank: '신한은행',
    number: env.VITE_ACCOUNT_GROOM || '000-000-000000',
    holder: GROOM_NAME,
  },
  {
    side: 'groom',
    label: '신랑 아버지',
    bank: '국민은행',
    number: env.VITE_ACCOUNT_GROOM_FATHER || '000-000-000000',
    holder: GROOM_FATHER,
  },
  {
    side: 'groom',
    label: '신랑 어머니',
    bank: '하나은행',
    number: env.VITE_ACCOUNT_GROOM_MOTHER || '000-000-000000',
    holder: GROOM_MOTHER,
  },
  {
    side: 'bride',
    label: '신부',
    bank: '카카오뱅크',
    number: env.VITE_ACCOUNT_BRIDE || '000-000-000000',
    holder: BRIDE_NAME,
  },
  {
    side: 'bride',
    label: '신부 아버지',
    bank: '우리은행',
    number: env.VITE_ACCOUNT_BRIDE_FATHER || '000-000-000000',
    holder: BRIDE_FATHER,
  },
  {
    side: 'bride',
    label: '신부 어머니',
    bank: '농협은행',
    number: env.VITE_ACCOUNT_BRIDE_MOTHER || '000-000-000000',
    holder: BRIDE_MOTHER,
  },
];

// 강조하고 싶은 부분은 **별표** 로 감싸면 굵게 표시됩니다.
export const information = {
  intro: [
    '저희 결혼식은 **한국민속촌 충현서원**에서 진행되는 **야외 전통혼례**입니다.',
    '자연 속에서 전통 방식으로 예를 올리는 특별한 순간을 함께해 주시면 감사하겠습니다.',
  ],
  blocks: [
    {
      icon: '🌿',
      title: '예식 안내',
      items: [
        '예식은 **야외**에서 진행됩니다.',
        '**우천 시에도 천막이 설치되어 예정대로 진행**됩니다.',
      ],
    },
    {
      icon: '🍽',
      title: '식사 안내',
      items: [
        '식사는 **한식 뷔페**로 준비되어 있습니다.',
        '예식 간 간격이 약 **4시간**으로 여유롭게 운영되어, 서두르지 않고 편안하게 식사를 즐기실 수 있습니다.',
      ],
    },
    {
      icon: '🎟',
      title: '입장 안내',
      items: [
        '한국민속촌 **입장권은 신랑·신부가 준비**합니다.',
        '방문 시 **청첩장을 제시**해 주시면 입장권을 받으실 수 있으니, **청첩장을 꼭 지참**해 주세요.',
      ],
    },
    {
      icon: '🎡',
      title: '민속촌 이용 안내',
      items: [
        '제공되는 입장권에는 **놀이공원 이용도 함께 포함**되어 있습니다.',
        '한국민속촌은 **오후 10시까지 운영**되므로, 예식 후에는 공연과 놀이공원, 다양한 체험을 마음껏 즐기시며 천천히 시간을 보내시길 바랍니다.',
      ],
    },
  ],
  outro: [
    '결혼식에 참석해 주시는 하루가 단순한 예식이 아닌,',
    '작은 여행처럼 오래 기억될 소중한 추억이 되었으면 합니다.',
    '소중한 걸음으로 함께해 주셔서 진심으로 감사합니다.',
  ],
};

// 인터뷰 (About Us 하단 버튼 → 모달로 표시). 문구는 자유롭게 수정하세요.
export const interview = {
  subtitle: '결혼을 앞두고 저희 두 사람의 인터뷰를 준비했습니다.',
  qna: [
    {
      q: 'Q1. 신랑 신부를 소개해주세요',
      a: [
        `🤵 신랑 ${GROOM_NAME}`,
        '계획은 꼼꼼하게, 표현은 서툴러도 마음은 누구보다 깊은 사람이에요. 말보다 행동으로 먼저 챙겨주는 사람입니다.',
        `👰‍♀️ 신부 ${BRIDE_NAME}`,
        '하루에도 몇 번씩 웃고 떠드는 감성 가득한 사람이에요. 함께 있으면 늘 웃음이 끊이지 않습니다.',
      ],
    },
    {
      q: 'Q2. 두 분은 어떻게 만나게 되었나요?',
      a: [
        `지인들과의 모임에서 우연히 옆자리에 앉게 되었어요. 조용한 ${GROOM_FIRST}과 이야기 많은 ${BRIDE_FIRST}의 대화가 신기하게도 참 편안했고, 그날 이후 자연스럽게 연락이 이어졌습니다.`,
      ],
    },
    {
      q: 'Q3. 결혼을 결심하게 된 계기는요?',
      a: [
        '시간이 흐를수록 서로가 더 편하고 소중해졌어요. 다투는 날에도 결국 함께 밥을 먹고 웃으며 하루를 마무리하는 서로를 보며, 평생을 함께하고 싶다고 확신하게 되었습니다.',
      ],
    },
    {
      q: 'Q4. 서로에게 한마디 한다면?',
      a: [
        `${GROOM_FIRST} → ${BRIDE_FIRST} : 늘 밝은 웃음으로 내 하루를 채워줘서 고마워. 지금처럼 오래오래 함께하자.`,
        `${BRIDE_FIRST} → ${GROOM_FIRST} : 묵묵히 곁을 지켜줘서 든든해. 우리 서로에게 가장 편한 사람으로 살자.`,
      ],
    },
  ],
};
