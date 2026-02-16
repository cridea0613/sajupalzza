# 페이지별 컴포넌트 명세

이 문서는 `wireframe.md`에 정의된 화면 설계를 기반으로 각 컴포넌트의 Props, State, 이벤트를 상세히 정의합니다. MVP와 Post-MVP로 나누어 명확한 개발 계약을 수립합니다.

- **Props**: 부모 컴포넌트로부터 받는 데이터 또는 함수
- **State**: 컴포넌트 내부에서 관리하는 상태
- **Events**: 사용자 상호작용 또는 내부 로직에 의해 발생하는 이벤트 및 그 핸들러

---

## 1. MVP 컴포넌트 명세

### 1.1. 최상위 컨테이너 (`App.jsx`)

- **역할**: 애플리케이션의 메인 컨테이너. 하위 컴포넌트들을 조립하고 상태를 관리합니다.
- **State**:
  - `sajuData: object | null`: API로부터 받아온 사주 결과 JSON 데이터. 초기값은 `null`.
  - `isLoading: boolean`: API 호출 중 로딩 상태.
  - `error: Error | null`: API 호출 실패 시 에러 객체.
- **Events**:
  - `handleFormSubmit(formData)`: `SajuForm`으로부터 `birthDate`, `birthTime`을 받아 API를 호출하고, 성공 시 `sajuData`를 업데이트하며, 로딩 및 에러 상태를 관리합니다.

### 1.2. 레이아웃 컴포넌트 (`src/components/Layout.jsx`)

- **역할**: 헤더, 메인 콘텐츠 영역, 푸터 등 앱의 전체적인 시각적 구조를 제공합니다.
- **Props**:
  - `children: React.ReactNode`: 내부에 렌더링될 자식 컴포넌트들.

### 1.3. 사주 정보 입력 폼 (`src/components/SajuForm.jsx`)

- **역할**: 사용자의 생년월일과 시간을 입력받습니다.
- **Props**:
  - `onFormSubmit: (formData: { birthDate: string, birthTime: string }) => void`: 폼 제출 시 부모(`App`)에게 입력 데이터를 전달하는 콜백 함수.
  - `isLoading: boolean` (Optional): 부모의 로딩 상태를 받아 버튼을 비활성화할 수 있습니다.
- **State**:
  - `birthDate: string`: 사용자가 입력한 생년월일 값 (YYYY-MM-DD).
  - `birthTime: string`: 사용자가 입력한 시간 값 (HH:mm).
- **Events**:
  - `handleSubmit(event)`: 폼의 `onSubmit` 이벤트 핸들러. `event.preventDefault()`를 호출하고, `birthDate`와 `birthTime`을 객체로 묶어 `onFormSubmit`을 호출합니다.

### 1.4. 사주 결과 표시 (`src/components/SajuResult.jsx`)

- **역할**: `sajuData`를 받아 사주 리포트를 UI로 렌더링합니다.
- **Props**:
  - `data: object | null`: `App`의 `sajuData` 상태. `null`이면 아무것도 렌더링하지 않습니다.
- **내부 로직**:
  - `data`가 존재할 경우, `data.narrative` 객체를 순회하며 `wireframe.md`에 정의된 대로 헤드라인, 요약, 사주표, 항목별 운세를 렌더링합니다.
  - 항목별 운세 섹션 렌더링 시, `section.state` 값을 확인합니다.
    - `state === 'free'`: 모든 콘텐츠 블록을 렌더링합니다.
    - `state === 'locked'`: 첫 번째 문단만 보여주고, 그 아래에 향후 유료화를 암시하는 CTA 요소를 렌더링합니다. (예: "전체 내용 보기" 버튼)

---

## 2. Post-MVP 컴포넌트 명세 (확장 계획)

> 💡 **참고**: 아래는 `docs/json_schema.md`의 전체 스키마를 기반으로 한 미래 확장 계획입니다. 기존 `page_component_specs.md`의 내용을 이전했습니다.

### 2.1. 공통 컴포넌트

- **`AppHeader`**: 로그인 상태에 따라 다른 UI (로그인/마이페이지 버튼) 표시
- **`StickyUpsellBar`**: 결과 미리보기 상단에 고정되어 결제를 유도하는 바
- **`Stepper`**: 멀티스텝 입력 폼의 현재 단계를 시각적으로 표시
- **`LockedContentBlock`**: 유료 콘텐츠를 블러 처리하고 결제 유도 CTA를 포함하는 블록
- **`EvidenceDrawer`**: '근거 보기' 클릭 시 특정 풀이의 상세 근거를 보여주는 사이드 패널
- **`FeedbackWidget`**: 결과에 대한 사용자 피드백(좋아요/별로예요, 태그) 수집
- ... (기존 문서의 `0) 공통(Shared) 컴포넌트` 전체)

### 2.2. 페이지별 컴포넌트

- **랜딩 페이지 (`/`)**: `LandingHero`, `TrustFeatureCards`, `FAQAccordion` 등
- **입력 페이지 (`/input`)**: `InputStepperPage`, `Step1_BirthDateForm`, `Step2_BirthTimeForm` 등 멀티스텝 폼 관련 컴포넌트와 전역 상태 관리(Zustand 등) 도입
- **결과 미리보기 페이지 (`/result/preview/:token`)**: `ResultPreviewPage`, `SummaryCard`, `CategorySectionList` 등 `visibility="preview"` 상태의 리포트를 렌더링하는 컴포넌트
- **결제 페이지 (`/checkout/:token`)**: `CheckoutPage`, `OrderSummaryCard`, `PlanTabs` 등 결제 관련 컴포넌트
- **전체 결과 페이지 (`/result/full/:reportId`)**: `ResultFullPage`, `ReportTabs`, `TojeongMonthlyGrid` 등 `visibility="full"` 상태의 리포트를 렌더링하는 컴포넌트
- **로그인, 마이페이지, 관리자 페이지**: 관련 컴포넌트 전체
- ... (기존 문서의 `1) ~ 9)` 페이지별 명세 전체)

### 2.3. 이벤트 트래킹

- `landing_cta_click`, `report_generate_success`, `unlock_click`, `payment_success` 등 서비스 분석을 위한 필수 이벤트 트래킹 계획 (기존 문서의 `10)` 전체)
