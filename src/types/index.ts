// 청첩장 전역에서 사용하는 도메인 타입 정의

export interface Person {
  role: 'groom' | 'bride';
  name: string;
  nameEn: string;
  birth: string;
  intro: string;
  phone: string;
  father: string;
  mother: string;
  fatherPhone: string;
  motherPhone: string;
}

export interface WeddingInfo {
  date: string;
  dateLabel: string;
  dateLabelEn: string;
  dateDot: string;
  dateDaytime: string;
  venueName: string;
  venueHall: string;
  venueAddress: string;
}

export interface VenuePoint {
  type: string; // 예: '예식장', '피로연장'
  name: string; // 예: '충현서원', '한국관'
  lat: number;
  lng: number;
}

export interface TransportItem {
  type: string;
  lines: string[];
}

export interface Account {
  side: 'groom' | 'bride';
  label: string;
  bank: string;
  number: string;
  holder: string;
}
