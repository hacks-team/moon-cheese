# 테스트 코드 수정 내역

## 수정된 테스트 파일: `iteration1.spec.tsx`

### 1. 통화 토글 테스트 수정

**문제:**
토글 클릭 후 USD 가격과 KRW 가격을 동시에 찾으려고 했지만, 통화가 변경되면 USD 가격은 더 이상 화면에 존재하지 않음.

**수정 전:**

```tsx
await user.click(currencyToggle);

const usdPrice = await screen.findByText('$12.34'); // ❌ 토글 후엔 없음
const krwPrice = await screen.findByText('16,887원');
```

**수정 후:**

```tsx
// 1. 토글 전 USD 가격 확인
const usdPrice = await screen.findByText('$12.34');
expect(usdPrice).toBeInTheDocument();

// 2. 토글 클릭
await user.click(currencyToggle);

// 3. 토글 후 KRW 가격 확인
const krwPrice = await screen.findByText('16,887원');
expect(krwPrice).toBeInTheDocument();
```

**이유:**
통화 토글은 UI 상태를 **교체**하는 것이지 **추가**하는 게 아님. 토글 후에는 이전 통화 가격이 DOM에서 사라지므로, 각 시점에 맞는 assertion이 필요.

---

### 2. 원화 소수점 반올림 테스트 수정

**문제:**
`expect(element).not.match()` 형태로 HTMLElement에 직접 regex 매칭 시도.

**수정 전:**

```tsx
const krwPrice = await screen.findByText('16,887원');
expect(krwPrice).not.match(/\.\d/); // ❌ HTMLElement에 match() 불가
```

**수정 후:**

```tsx
const krwPrice = await screen.findByText('16,887원');
expect(krwPrice.textContent).not.toMatch(/\.\d/); // ✅ 문자열로 변환 후 매칭
```

**이유:**

- `screen.findByText()`는 **HTMLElement**를 반환
- `.match()`는 **String.prototype** 메서드
- vitest의 `expect().match()`는 chai 스타일이지만, HTMLElement에 대해 예상치 못한 동작 발생
- `.textContent`로 문자열 추출 후 `.toMatch()` 매처 사용이 올바른 패턴

---

### 3. 포인트 표시 소수점 제거

**변경 사항:**
포인트 값 표시 시 소수점이 있으면 안 되므로, 계산 함수에서 `Math.floor()` 적용.

**관련 파일:** `src/pages/HomePage/utils/grade.ts`

```tsx
export function calcPointsToNextGrade(currentPoint: number, nextGradeMinPoint: number | undefined): number {
  if (nextGradeMinPoint === undefined) {
    return 0;
  }
  return Math.floor(Math.max(0, nextGradeMinPoint - currentPoint)); // 정수로 반환
}
```

**관련 파일:** `src/pages/HomePage/components/CurrentLevelSection.tsx`

```tsx
const displayPoint = Math.floor(currentPoint); // 현재 포인트도 정수로 표시
```

---

## 테스트 실행 방법

```bash
yarn test src/__test__/specs/iteration1.spec.tsx
```
