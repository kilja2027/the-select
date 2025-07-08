import React from 'react';
import type { CompanyInfo, Feature, Product, NewsArticle, GalleryImage } from './types';
import { LeafIcon, SparklesIcon, TruckIcon, GlobeIcon, LocationMarkerIcon, MailIcon, PhoneIcon } from './components/icons';

export const COMPANY_INFO: CompanyInfo = {
  name: "더셀렉(The Select)",
  logo: "/photo/logo2.png",
  introduction: "농부의 정직함을 담다<br />오늘 수확한 신선함 <br> 바로 당신의 식탁으로",
  philosophy: "우리의 철학은 단순합니다.<br />고객에게 정직하고 신선한 먹거리를 전하기 위해 항상 <br /> 좋은 재료만 고집합니다",
  vision: "신뢰할 수 있는 먹거리로, 일상의 작은 행복을 전하고 싶습니다",
  address: "서울특별시 강서구 양천로 400-12 507호",
  phone: "010-4648-5106",
  email: "2025bestcompany@gmail.com",
  socialLinks: {
    youtube: "https://youtube.com/channel/UCn6d9RS4Tg-h6jeM6dcKVYg?si=yiJTIbXHIajfC2Nk",
  },
};

export const FEATURES: Feature[] = [
  {
    icon: React.createElement(SparklesIcon, { className: "w-10 h-10 text-brand-accent" }),
    title: "안심 할 수 있는 농산물",
    description: "자연의 힘으로만 키워낸\n건강한 농산물"
  },
  {
    icon: React.createElement(TruckIcon, { className: "w-10 h-10 text-brand-accent" }),
    title: "빠른 배송 시스템",
    description: "신선함을 바로 고객님의\n식탁 위로 전달해드립니다"
  },
  {
    icon: React.createElement(GlobeIcon, { className: "w-10 h-10 text-brand-accent" }),
    title: "엄선된 품질",
    description: "최상의 맛과 품질을 보장합니다"
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod1',
    name: "유기농 상추 2종 세트",
    summary: "아삭한 식감과 신선한 맛이 일품인 로메인과 버터헤드 상추.",
    imageUrl: "https://images.unsplash.com/photo-1556910110-a5a6350d308c?q=80&w=600&h=400&auto=format&fit=crop",
    description: "샐러드나 쌈 채소로 완벽한 유기농 상추입니다. 깨끗한 환경에서 정성껏 재배하여 믿고 드실 수 있습니다.",
    price: "4,500원",
    purchaseUrl: "",
    detailImageUrl: ""
  },
  {
    id: 'prod2',
    name: "고당도 논산 딸기 500g",
    summary: "입안 가득 퍼지는 달콤한 향기! 논산의 햇살을 듬뿍 받고 자란 명품 딸기입니다.",
    imageUrl: "https://images.unsplash.com/photo-1588661294863-7559599a8b30?q=80&w=600&h=400&auto=format&fit=crop",
    description: "엄격한 당도 선별을 거쳐 보내드리는 고품질 딸기로, 그냥 먹어도, 디저트로 활용해도 좋습니다.",
    price: "15,900원",
    purchaseUrl: "",
    detailImageUrl: ""
  },
  {
    id: 'prod3',
    name: "해남 황토 꿀고구마 3kg",
    summary: "밤처럼 포슬포슬하고 꿀처럼 달콤한 해남의 명물, 황토 꿀고구마입니다.",
    imageUrl: "https://images.unsplash.com/photo-1596649521483-a401bf925b45?q=80&w=600&h=400&auto=format&fit=crop",
    description: "식이섬유가 풍부하여 건강 간식으로 안성맞춤입니다. 구워 먹거나 쪄 먹어도 맛있습니다.",
    price: "18,000원",
    purchaseUrl: "",
    detailImageUrl: ""
  },
  {
    id: 'prod4',
    name: "무농약 블루베리 250g",
    summary: "슈퍼푸드의 대표주자! 탱글탱글한 식감과 새콤달콤한 맛의 무농약 블루베리.",
    imageUrl: "https://images.unsplash.com/photo-1498557850523-263378f16471?q=80&w=600&h=400&auto=format&fit=crop",
    description: "요거트나 시리얼에 곁들여 드시면 더욱 좋습니다. 자연 그대로의 맛과 영양을 느껴보세요.",
    price: "12,000원",
    purchaseUrl: "",
    detailImageUrl: ""
  },
  {
    id: 'prod5',
    name: "완숙 토마토 1kg",
    summary: "지중해의 태양을 닮은 붉은 빛깔, 라이코펜이 풍부한 완숙 토마토입니다.",
    imageUrl: "https://images.unsplash.com/photo-1561138241-9411e859c240?q=80&w=600&h=400&auto=format&fit=crop",
    description: "샐러드, 주스, 요리 등 다양하게 활용 가능한 만능 채소입니다. 신선함을 그대로 전해드립니다.",
    price: "8,900원",
    purchaseUrl: "",
    detailImageUrl: ""
  },
  {
    id: 'prod6',
    name: "제주산 미니 단호박 2개",
    summary: "달콤하고 부드러운 맛이 일품인 영양 만점 미니 단호박입니다.",
    imageUrl: "https://images.unsplash.com/photo-1621993206484-2337a4c42738?q=80&w=600&h=400&auto=format&fit=crop",
    description: "간편하게 쪄서 간식으로 먹거나, 죽이나 스프를 만들어 드시면 좋습니다.",
    price: "7,500원",
    purchaseUrl: "",
    detailImageUrl: ""
  }
];

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 1,
    title: "베스트컴퍼니, 스마트팜 기술로 생산성 20% 향상",
    date: "2024년 7월 22일",
    summary: "최첨단 스마트팜 기술 도입으로 더욱 정밀한 환경 제어가 가능해졌습니다. 이를 통해 고품질 농산물의 안정적인 대량 생산 기반을 마련했습니다.",
    imageUrl: "https://images.unsplash.com/photo-1598556282393-2c13b2d7fee9?q=80&w=600&h=400&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "올해의 친환경 농산물 대상 수상!",
    date: "2024년 6월 15일",
    summary: "소비자 신뢰도와 제품 품질을 인정받아 '2024 올해의 친환경 농산물' 대상을 수상하는 영예를 안았습니다. 언제나 믿을 수 있는 제품으로 보답하겠습니다.",
    imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=600&h=400&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "초등학생 대상 '주말 농장 체험' 프로그램 성황리 종료",
    date: "2024년 5월 30일",
    summary: "미래의 꿈나무들에게 자연의 소중함을 알리는 '주말 농장 체험' 프로그램을 성공적으로 마쳤습니다. 아이들의 웃음소리가 가득했던 행복한 시간이었습니다.",
    imageUrl: "https://images.unsplash.com/photo-1492496913980-501348b61469?q=80&w=600&h=400&auto=format&fit=crop"
  }
];

export const GALLERY_IMAGES: GalleryImage[] = [
  { id: 1, src: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=800&h=600&auto=format&fit=crop', alt: '싱그러운 채소밭' },
  { id: 2, src: 'https://images.unsplash.com/photo-1598198922833-25ab8a74c173?q=80&w=800&h=600&auto=format&fit=crop', alt: '트랙터가 있는 넓은 밭' },
  { id: 3, src: 'https://images.unsplash.com/photo-1627894002473-b463162386da?q=80&w=800&h=600&auto=format&fit=crop', alt: '농부의 손에 들린 흙' },
  { id: 4, src: 'https://images.unsplash.com/photo-1579292335184-a18a916327b8?q=80&w=800&h=600&auto=format&fit=crop', alt: '갓 수확한 신선한 채소들' },
  { id: 5, src: 'https://images.unsplash.com/photo-1500353393829-3a3c5a61845b?q=80&w=800&h=600&auto=format&fit=crop', alt: '온실 속에서 자라는 식물들' },
  { id: 6, src: 'https://images.unsplash.com/photo-1605799292398-316e6d1bdc75?q=80&w=800&h=600&auto=format&fit=crop', alt: '사과나무에 달린 빨간 사과' },
  { id: 7, src: 'https://images.unsplash.com/photo-1540343785233-3e2d04523295?q=80&w=800&h=600&auto=format&fit=crop', alt: '건강한 채소를 수확하는 모습' },
  { id: 8, src: 'https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?q=80&w=800&h=600&auto=format&fit=crop', alt: '농부와 아이가 함께 있는 모습' },
  { id: 9, src: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?q=80&w=800&h=600&auto=format&fit=crop', alt: '아름다운 농장의 해질녘 풍경' },
];