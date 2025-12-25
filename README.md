# 설계 원칙

---

## 1. 상태 관리

### Context는 진짜 전역 상태만

- 서버 상태는 React Query 캐시 활용
- Context에 서버 데이터 중복 저장 금지

### Context 반환 형태는 배열로 통일

```tsx
// ✅ useState와 동일한 패턴으로 예측 가능
const [currency, setCurrency] = useCurrencyContext();

// ❌ 객체 반환은 패턴이 다름
const { currency, setCurrency } = useCurrencyContext();
```

`useState`가 `[value, setter]` 튜플을 반환하듯, 커스텀 Context도 동일한 패턴을 따르면 사용처에서 예측 가능합니다.

---

## 2. Suspense & ErrorBoundary

### 핵심 원칙: 관심사의 수직 분리

컴포넌트가 처리해야 할 상태를 계층별로 분리합니다:

| 계층      | 담당          | 처리 위치 |
| --------- | ------------- | --------- |
| 로딩      | Suspense      | 상위      |
| 에러      | ErrorBoundary | 상위      |
| 빈 데이터 | 컴포넌트      | 내부      |

이 구조를 통해 **각 컴포넌트는 자신의 성공 케이스에만 집중**할 수 있습니다.
옵셔널 체이닝(`?.`)이 코드 전체로 전염되는 것을 방지합니다.

### Compound Component 패턴

```tsx
// 컴포넌트와 관련 상태 UI를 논리적으로 함께 관리
<Suspense fallback={<UserProfile.Skeleton />}>
  <ErrorBoundary FallbackComponent={UserProfile.Error}>
    <UserProfile />
  </ErrorBoundary>
</Suspense>
```

---

## 3. 컴포넌트 설계

### 단일 책임 원칙

- 분기 담당 컴포넌트와 UI 컴포넌트를 분리
- 한 컴포넌트가 여러 역할을 하지 않도록 구성

```tsx
// 분기 담당
function RecentPurchaseSection() {
  const { data } = useSuspenseQuery(...);

  if (data.products.length === 0) {
    return <RecentPurchaseSectionEmpty />;
  }
  return <RecentPurchaseSectionList />;
}

// UI 담당 (각자 한 가지 케이스만)
function RecentPurchaseSectionEmpty() { ... }
function RecentPurchaseSectionList() { ... }
```

### JSX 내 조건문 최소화

- JSX 안에 삼항연산자 사용 지양
- 컴포넌트 레벨에서 early return으로 분기

## 4. SSOT (Single Source of Truth)

- 단 한곳에서 변경시 파생된 다른 요소들에게 영향이 가 휴먼에러를 방지하도록 구성
- value -> type 변환만 가능한 만큼 소스 데이터는 객체 배열로 구성

```tsx
// coreBusiness/grade.ts
export const GRADE_CONFIG = {
  EXPLORER: { label: 'Explorer' },
  PILOT: { label: 'Pilot' },
  COMMANDER: { label: 'Commander' },
} as const;

// 타입은 Config에서 추출
export type GradeType = keyof typeof GRADE_CONFIG;

// 매퍼 함수
export function getGradeLabel(grade: GradeType): string {
  return GRADE_CONFIG[grade].label;
}
```

### 장점

- 새 항목 추가 시 Config 한 곳만 수정
- 타입 안전성 자동 보장

### 주의

- base config 데이터끼리 계층 역전 시 사이드이펙트 유발
- 원천 데이터끼리의 계층화 필요시 하위 폴더 생성 등으로 명시적 분리 필요

---

## 5. 이정표 vs 상수

### 구분 기준

| 구분        | 처리            | 예시                    |
| ----------- | --------------- | ----------------------- |
| UI 이정표   | JSX에 직접 작성 | `"최근 구매한 상품"`    |
| 데이터 변환 | SSOT Config     | `EXPLORER` → `Explorer` |

UI에서 "여기가 어디인지" 알려주는 텍스트는 그 자리에 있어야 가독성이 높아집니다. 모든 스트링 리터럴이 매직넘버가 아닙니다

---

## 6. 함수 설계

### 순수 함수로 로직 분리

- 계산 로직은 순수 함수로 추출
- 단일 책임 원칙 준수
- 테스트 용이성 확보

---

## 7. Query Key Factory

```tsx
// 도메인별 분리
export const userQueries = createQueryKeys('user', {
  me: {
    queryKey: null,
    queryFn: () => http.get('/api/me'),
  },
});

// 통합
export const queries = mergeQueryKeys(userQueries, gradeQueries, ...);

// 사용
useSuspenseQuery(queries.user.me);
queryClient.invalidateQueries({ queryKey: queries.user.me.queryKey });
```

### 원칙

- `queryKey`와 `queryFn`을 함께 정의
- 책임이 다르면 파일 분리
- API 응답 타입은 해당 query 파일에 정의

### 현재 구조

현재 API들은 각각 독립적인 책임을 가지므로 별도 파일로 분리:

| 파일               | 책임             |
| ------------------ | ---------------- |
| `user.ts`          | 사용자 정보      |
| `grade.ts`         | 등급 포인트 정보 |
| `recentProduct.ts` | 최근 구매 상품   |
| `exchangeRate.ts`  | 환율 정보        |

책임이 겹치거나 확장 시 연관성이 생기면 통합을 고려합니다.

---

## 8. 에러 처리

| 레벨   | 방식                                |
| ------ | ----------------------------------- |
| 글로벌 | `router.tsx`의 `errorElement`       |
| 섹션별 | `ErrorBoundary` + `.Error` 컴포넌트 |

```tsx
// react-router 네이티브 방식
{
  path: '/',
  element: <PageLayout />,
  errorElement: <GlobalErrorPage />,
}
```
---

## 9. 폴더 구조

```
src/
├── coreBusiness/     # SSOT Config
├── queries/          # React Query + API 타입
├── providers/        # Context Provider
├── utils/            # 글로벌 유틸리티
├── types/            # 공통 타입
├── components/       # 공통 컴포넌트
└── pages/
    └── [Page]/
        ├── components/
        └── utils/
```




# 🌙 Moon Cheese

[과제 진행 문서 보러가기](https://raymondanything.notion.site/25-Moon-Cheese-2411b06afbf180e583bed6420680b14b?pvs=74)

치즈 전문 쇼핑몰 **Moon Cheese**의 프론트엔드 애플리케이션입니다.

## About Hacks!

> 🚀 **hacks!** 는 프론트엔드 개발자의 폭발적인 성장을 위해 모의과제를 만들어 배포하는 팀이에요.
>
> 혼자보다 함께 라는 가치를 추구하며, 열정있는 사람들과 함께하는 것을 중요하게 생각해요.

**hacks!** 팀은 실무에서 마주할 수 있는 다양한 상황들을 모의과제로 재현하여, 개발자들이 안전한 환경에서 충분히 연습하고 성장할 수 있도록 돕습니다. 단순한 튜토리얼이 아닌, 실제 프로덕션 환경과 유사한 복잡성을 가진 과제들을 통해 실전 경험을 쌓을 수 있습니다.

### Thanks to

[@minr2kb](https://github.com/minr2kb) [@JUCHEOLJIN](https://github.com/JUCHEOLJIN) [@raymondanything](https://github.com/raymondanythings) [@white](https://notefolio.net/white_note)

이 프로젝트는 [`moon-cheese`](https://github.com/hacks-team/moon-cheese-react) 레포지토리를 기반으로 구성되어 있습니다. 필요한 컴포넌트는 이미 모두 구현되어 있으며, **요구사항에 맞게 적절한 위치에 가져다 사용**하시면 됩니다.

## 시작하기

### 필수 요구사항

- Node.js 22+
- Yarn 4.9.2

> 본 프로젝트는 Yarn 4.9.2 버전을 사용합니다.
>
> `yarn -v` 명령어로 버전을 먼저 확인해주세요.

## 프로젝트 초기 세팅 및 최초 커밋 가이드

### 1. Fork 및 Clone

원본 저장소를 **fork**한 후 본인 저장소를 클론해주세요.

```bash
git clone https://github.com/<your-github-id>/moon-cheese.git
cd moon-cheese
```

### 2. 의존성 설치

```bash
yarn install
```

### 3. 최초 커밋 및 푸시

초기 설정 확인 후 다음 명령어로 최초 커밋을 생성해주세요:

```bash
git add .
git commit -m "init"
git push origin main
```

### 4. 서버 실행

```bash
yarn dev
```

실행 후 브라우저에서 http://localhost:5173/ 주소로 접속해주세요.

> 🧀 "문치즈" 시작 화면이 보이면 세팅 완료!

---

**Moon Cheese** - 치즈의 달빛을 담은 쇼핑몰 🌙🧀
