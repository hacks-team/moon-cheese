type ProductCategory = 'CHEESE' | 'CRACKER' | 'TEA';

export type Product = {
  id: number;
  name: string;
  category: ProductCategory;
  stock: number;
  price: number;
  description: string;
  detailDescription: string;
  images: string[];
  rating: number;
  isGlutenFree?: boolean;
  isCaffeineFree?: boolean;
};

export const products: Product[] = [
  {
    id: 1,
    name: '월레스의 오리지널 웬슬리데일',
    category: 'CHEESE',
    stock: 3,
    price: 12.99,
    description: '전통 영국식 크리미한 웬슬리데일 치즈',
    detailDescription:
      '"월레스가 아침마다 찾는 바로 그 치즈!" 전통 영국 웬슬리데일의 부드럽고 크리미한 풍미. 촘촘하고 촉촉한 질감 속에 은은한 단맛이 어우러져, 클래식한 영국식 브렉퍼스트에 완벽하게 어울립니다.',
    images: [
      '/moon-cheese-images/cheese-1-1.jpg',
      '/moon-cheese-images/cheese-1-2.jpg',
      '/moon-cheese-images/cheese-1-3.jpg',
      '/moon-cheese-images/cheese-1-4.jpg',
    ],
    rating: 4.8,
  },
  {
    id: 2,
    name: '그랜드 데이 아웃 체다',
    category: 'CHEESE',
    stock: 3,
    price: 14.87,
    description: '달 착륙 모험에서 영감받은 체다 치즈',
    detailDescription:
      '"달 착륙 기념, 한 조각의 체다." 월레스와 그로밋의 달 탐사를 기념하며 만든 깊고 진한 풍미의 체다 치즈. 우주선 모양의 전용 패키지에 담아, 한 입 베어물면 달까지 날아갈 듯한 진한 감칠맛을 경험하세요.',
    images: [
      '/moon-cheese-images/cheese-2-1.jpg',
      '/moon-cheese-images/cheese-2-2.jpg',
      '/moon-cheese-images/cheese-2-3.jpg',
      '/moon-cheese-images/cheese-2-4.jpg',
    ],
    rating: 4.9,
  },
  {
    id: 3,
    name: '전자바지 브리',
    category: 'CHEESE',
    stock: 1,
    price: 10,
    description: '전자바지를 모티브로 한 부드러운 브리',
    detailDescription:
      '"전자바지처럼 부드럽게 녹아내리는 브리." 월레스의 발명품 \'전자바지\'를 모티브로 한 유쾌한 브리 치즈. 크리미하고 입에서 녹는 식감은 물론, 고소하고 진한 풍미가 어떤 와인과도 찰떡 궁합입니다.',
    images: [
      '/moon-cheese-images/cheese-3-1.jpg',
      '/moon-cheese-images/cheese-3-2.jpg',
      '/moon-cheese-images/cheese-3-3.jpg',
      '/moon-cheese-images/cheese-3-4.jpg',
    ],
    rating: 4.6,
  },
  {
    id: 4,
    name: '숀 더 쉽 크림치즈',
    category: 'CHEESE',
    stock: 3,
    price: 13.55,
    description: '숀 더 쉽 크림치즈',
    detailDescription:
      '"양털처럼 부드러운, 숀이 전하는 하루의 휴식." 폭신한 양털을 닮은 휘핑 크림치즈. 신선한 우유와 상큼한 풍미가 어우러져, 베이글이나 디저트 토핑으로도 완벽한 다용도 치즈입니다.',
    images: [
      '/moon-cheese-images/cheese-4-1.jpg',
      '/moon-cheese-images/cheese-4-2.jpg',
      '/moon-cheese-images/cheese-4-3.jpg',
      '/moon-cheese-images/cheese-4-4.jpg',
    ],
    rating: 4.7,
  },
  {
    id: 5,
    name: '치즈홀 크래커',
    category: 'CRACKER',
    stock: 2,
    price: 10.85,
    description: '달 표면을 닮은 구멍 크래커',
    detailDescription:
      '"달 표면에서 갓 수확한 듯한 구멍난 크래커." 달의 분화구를 연상시키는 디자인과 고소한 풍미가 특징인 크래커. 치즈와의 궁합을 고려한 얇고 바삭한 식감으로, 어느 테이블에도 잘 어울립니다.',
    images: [
      '/moon-cheese-images/cracker-1-1.jpg',
      '/moon-cheese-images/cracker-1-2.jpg',
      '/moon-cheese-images/cracker-1-3.jpg',
      '/moon-cheese-images/cracker-1-4.jpg',
    ],
    rating: 4.5,
    isGlutenFree: true,
  },
  {
    id: 6,
    name: '로봇 크런치 비스킷',
    category: 'CRACKER',
    stock: 2,
    price: 5,
    description: '로봇 캐릭터 모양의 귀리 비스킷',
    detailDescription:
      '"딱딱하지만 정겨운 로봇처럼, 아삭한 매력." 로봇 친구들의 움직임을 담은 귀리 베이스의 비스킷. 건강한 곡물 맛과 고소한 텍스처가 매력적이며, 티타임 스낵으로도 제격입니다.',
    images: [
      '/moon-cheese-images/cracker-2-1.jpg',
      '/moon-cheese-images/cracker-2-2.jpg',
      '/moon-cheese-images/cracker-2-3.jpg',
      '/moon-cheese-images/cracker-2-4.jpg',
    ],
    rating: 4.4,
    isGlutenFree: false,
  },
  {
    id: 7,
    name: '펭귄 페퍼잭 크래커',
    category: 'CRACKER',
    stock: 1,
    price: 6.5,
    description: '매콤한 맛, 펭귄 페더스 테마',
    detailDescription:
      '"속을 알 수 없는 페더스처럼, 톡 쏘는 매력." 살짝 매콤한 페퍼잭 풍미가 살아 있는 크래커. 귀여운 펭귄 테마와 함께, 입 안에서 은근히 퍼지는 알싸한 맛이 중독적입니다.',
    images: [
      '/moon-cheese-images/cracker-3-1.jpg',
      '/moon-cheese-images/cracker-3-2.jpg',
      '/moon-cheese-images/cracker-3-3.jpg',
      '/moon-cheese-images/cracker-3-4.jpg',
    ],
    rating: 4.3,
    isGlutenFree: true,
  },
  {
    id: 8,
    name: '그로밋의 잉글리쉬 브렉퍼스트 티',
    category: 'TEA',
    stock: 2,
    price: 6.75,
    description: '영국식 클래식 블랙티',
    detailDescription:
      '"티포트 앞에 앉은 그로밋처럼, 조용한 아침 한 잔." 전통 잉글리쉬 브렉퍼스트 블렌드로 깊고 진한 맛이 특징. 클래식한 영국 티타임을 재현한 듯한 패키지와 함께 제공되어 선물용으로도 좋습니다.',
    images: ['/moon-cheese-images/tea-1-1.jpg', '/moon-cheese-images/tea-1-2.jpg', '/moon-cheese-images/tea-1-3.jpg'],
    rating: 4.8,
    isCaffeineFree: true,
  },
  {
    id: 9,
    name: '문라이트 카모마일 티',
    category: 'TEA',
    stock: 1,
    price: 7,
    description: '달빛 같은 부드러운 허브차',
    detailDescription:
      '"달빛 아래서 조용히 스며드는 평온한 휴식." 편안한 밤을 위한 카모마일 블렌드. 따뜻한 물에 우리면 달빛처럼 은은한 꽃향기가 퍼지며, 하루를 정리하는 시간에 안성맞춤입니다.',
    images: ['/moon-cheese-images/tea-2-1.jpg', '/moon-cheese-images/tea-2-2.jpg', '/moon-cheese-images/tea-2-3.jpg'],
    rating: 4.6,
    isCaffeineFree: false,
  },
  {
    id: 10,
    name: '레드 로켓 루이보스 티',
    category: 'TEA',
    stock: 1,
    price: 6.8,
    description: '우주선 컨셉의 루이보스 티',
    detailDescription:
      '"우주선을 타고 날아오르는 루이보스의 깊은 붉은빛." 남아프리카산 루이보스 티에 우주 탐사선 테마를 더한 유니크한 블렌드. 카페인이 없어 언제든 마시기 좋고, 순하고 고소한 끝맛이 특징입니다.',
    images: [
      '/moon-cheese-images/tea-3-1.jpg',
      '/moon-cheese-images/tea-3-2.jpg',
      '/moon-cheese-images/tea-3-3.jpg',
      '/moon-cheese-images/tea-3-4.jpg',
    ],
    rating: 4.7,
    isCaffeineFree: false,
  },
];

export const recommendProductIdMap = {
  // 월레스의 오리지널 웬슬리데일
  1: [5, 8],
  // 그랜드 데이 아웃 체다
  2: [6, 8, 10],
  // 전자바지 브리
  3: [7],
  // 숀 더 쉽 크림치즈
  4: [5, 9, 10],
  // 치즈홀 크레커
  5: [1, 8],
  // 로봇 크런치 비스킷
  6: [2, 10],
  // 펭귄 페퍼잭 크래커
  7: [3, 9],

  // 그로밋의 잉글리쉬 브렉퍼스트 티
  8: [1, 5],
  // 문라이트 카모마일 티
  9: [4, 7],
  // 레드 로켓 루이보스 티
  10: [2, 4, 6],
};

// 등급별 포인트 설정
export const GRADE_POINTS = {
  EXPLORER: 0,
  PILOT: 3.5,
  COMMANDER: 7,
} as const;

// 등급별 배송 설정
const GRADE_SHIPPING = {
  EXPLORER: {
    fee: 2,
    freeThreshold: 30,
  },
  PILOT: {
    fee: 1,
    freeThreshold: 30,
  },
  COMMANDER: {
    fee: 0,
    freeThreshold: 0, // 무조건 무료
  },
} as const;

// 등급 타입 정의
export type GradeType = 'EXPLORER' | 'PILOT' | 'COMMANDER';

// 포인트 관련 등급 타입
type GradePoint = {
  type: GradeType;
  minPoint: number;
};

// 등급별 포인트 데이터
const gradePointData: Record<GradeType, GradePoint> = {
  EXPLORER: {
    type: 'EXPLORER',
    minPoint: GRADE_POINTS.EXPLORER,
  },
  PILOT: {
    type: 'PILOT',
    minPoint: GRADE_POINTS.PILOT,
  },
  COMMANDER: {
    type: 'COMMANDER',
    minPoint: GRADE_POINTS.COMMANDER,
  },
};

export const gradePointList = [gradePointData.EXPLORER, gradePointData.PILOT, gradePointData.COMMANDER];

export const gradeShippingList = [
  {
    type: 'EXPLORER',
    shippingFee: GRADE_SHIPPING.EXPLORER.fee,
    freeShippingThreshold: GRADE_SHIPPING.EXPLORER.freeThreshold,
  },
  {
    type: 'PILOT',
    shippingFee: GRADE_SHIPPING.PILOT.fee,
    freeShippingThreshold: GRADE_SHIPPING.PILOT.freeThreshold,
  },
  {
    type: 'COMMANDER',
    shippingFee: GRADE_SHIPPING.COMMANDER.fee,
    freeShippingThreshold: GRADE_SHIPPING.COMMANDER.freeThreshold,
  },
];
