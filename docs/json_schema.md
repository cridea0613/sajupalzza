리포트 JSON 스키마(사주/토정/근거 구조) (MVP)

목표
- “계산 결과(룰엔진)”와 “표현(콘텐츠 템플릿/문장)”을 분리한다.
- 리포트는 ‘결정론적’이어야 하며(같은 입력=같은 결과), 버전 관리가 가능해야 한다.
- UI는 result_json만으로 렌더링할 수 있게 구조화한다.
- 근거(Explainable)는 “문장/항목 ↔ 사용된 규칙/지표”를 매핑한다.

============================================================
1) 최상위 구조(Report Document)
============================================================
- report_id: string (UUID)
- type: "saju_tojeong" | "saju_only" | "tojeong_only" | "monthly"
- visibility: "preview" | "full"
- locale: "ko-KR"
- created_at: string (ISO8601)
- engine_version: string  (예: "engine-1.0.0")
- content_version: string (예: "content-1.0.0")
- pricing_context:
  - product: "one_time" | "subscription"
  - entitlements: string[] (예: ["full_sections","monthly_detail","evidence_expand","save_report"])
- input: (입력 스냅샷; 개인정보 최소화/마스킹 가능)
  - calendar: "solar" | "lunar"
  - birth:
    - date: "YYYY-MM-DD"
    - time: "HH:mm" | null
    - time_unknown: boolean
    - is_leap_month: boolean (lunar일 때만 의미)
    - timezone: "Asia/Seoul"
    - place:
      - country: "KR"
      - region: string|null (MVP optional)
  - gender: "male" | "female" | "unspecified"
  - display_name: string|null
- computed: (룰엔진 산출물; UI/근거의 기반)
  - pillars: (사주 4주)
    - year/month/day/hour:
      - stem: string  (천간 코드/한자/한글 중 택1 + 별도 표기 필드 권장)
      - branch: string (지지)
      - stem_label: string (UI 표기용; 예 "갑")
      - branch_label: string (UI 표기용; 예 "자")
      - hidden_stems: [{stem, stem_label, weight}] (optional)
  - day_master:
    - stem: string
    - label: string
    - element: "wood"|"fire"|"earth"|"metal"|"water"
    - yin_yang: "yin"|"yang"
  - elements:
    - distribution: {wood:int, fire:int, earth:int, metal:int, water:int} (0~100 또는 점수)
    - balance_summary_key: string (콘텐츠 템플릿 키)
  - ten_gods:
    - by_stem: {year:string, month:string, day:string, hour:string} (일간 기준 십신 라벨)
    - summary_key: string
  - relations:
    - combinations: [{type:"heavenly"|"earthly", code:string, label:string, strength:"low"|"mid"|"high"}]
    - clashes:      [{type:"heavenly"|"earthly", code:string, label:string, strength:"low"|"mid"|"high"}]
    - harms:        [{code,label}] (optional)
    - penalties:    [{code,label}] (optional)
  - boundaries:
    - month_pillar_rule: {basis:"solar_terms", note_key:string}
    - day_boundary_rule: {basis:"zi_hour_rule", note_key:string}
  - tojeong:
    - year: int
    - annual_key: string
    - monthly_keys: [{month:int, key:string}]
- narrative: (문장/섹션; content_version의 템플릿으로 생성)
  - headline:
    - title: string
    - subtitle: string|null
  - summary:
    - one_liner: string
    - bullets: string[] (3~5)
    - action_guide: string[] (0~3; full에서만)
  - sections: (화면 탭/앵커 단위)
    - id: "saju_table" | "love" | "work" | "money" | "health" | "relationship" | "tojeong_annual" | "tojeong_monthly" | "evidence"
    - title: string
    - state: "free" | "locked" | "full"   (preview에서 잠금 표시용)
    - blocks: (렌더링 단위)
      - type: "paragraph"|"bullets"|"callout"|"table"|"chips"
      - content: (타입별 상이; 아래 예시 참고)
      - evidence_refs: string[] (evidence.id 목록)
- evidence: (근거; “왜 이렇게 말했는지”를 링크로 제공)
  - items: EvidenceItem[]
- ui_hints: (프론트 편의)
  - recommended_tabs: string[]
  - highlight_month: int|null
  - warnings: [{level:"info"|"warn", message:string}]
- feedback_hooks: (분석/QA용)
  - rubric_version: string
  - tags: string[] (예: ["time_unknown","lunar_leap"])
============================================================
2) EvidenceItem 구조
============================================================
EvidenceItem
- id: string (예: "ev_001")
- title: string (예: "오행 균형: 수(水) 약함")
- short: string (1~2문장)
- sources: (근거의 계산 근원)
  - computed_paths: string[] (예: ["computed.elements.distribution.water","computed.day_master.element"])
  - rule_ids: string[] (내부 규칙/템플릿 ID; 예: ["R_ELM_BAL_01","R_SUMMARY_03"])
  - keys: string[] (콘텐츠 키; 예: ["balance_summary_key:WATER_LOW"])
- strength: "low"|"mid"|"high"
- related_sections: string[] (narrative.sections[].id)

============================================================
3) Block 타입별 content 예시
============================================================
- paragraph:
  - content: {text:string}
- bullets:
  - content: {items:string[]}
- callout:
  - content: {tone:"info"|"warn", text:string}
- table (사주표):
  - content: {
      columns:["구분","천간","지지"],
      rows:[
        ["연","갑","자"],
        ["월","...","..."]
      ]
    }
- chips (오행):
  - content: {items:[{label:"목", value:20},{label:"화", value:15}]}  

============================================================
4) 잠금(Preview/Full) 처리 규칙
============================================================
- preview에서는 narrative.sections[].state가 "free" 또는 "locked"만 존재
- locked 섹션은 blocks 일부만 노출(예: 첫 paragraph 1개) + CTA 렌더
- full에서는 state가 "full"이며 entitlements에 따라 근거 확장/월간 상세 노출

============================================================
5) 샘플 JSON (축약 예시)
============================================================
{
  "report_id": "c2b5f6b6-1b2d-4d6f-9e4b-8a2c7d6f0a11",
  "type": "saju_tojeong",
  "visibility": "preview",
  "locale": "ko-KR",
  "created_at": "2026-02-16T10:10:00+09:00",
  "engine_version": "engine-1.0.0",
  "content_version": "content-1.0.0",
  "pricing_context": {
    "product": "one_time",
    "entitlements": ["preview_sections"]
  },
  "input": {
    "calendar": "solar",
    "birth": {
      "date": "1990-01-01",
      "time": "13:20",
      "time_unknown": false,
      "is_leap_month": false,
      "timezone": "Asia/Seoul",
      "place": {"country":"KR","region":"Seoul"}
    },
    "gender": "female",
    "display_name": "홍길동"
  },
  "computed": {
    "pillars": {
      "year":  {"stem":"JIA","branch":"ZI","stem_label":"갑","branch_label":"자"},
      "month": {"stem":"BING","branch":"YIN","stem_label":"병","branch_label":"인"},
      "day":   {"stem":"XIN","branch":"YOU","stem_label":"신","branch_label":"유"},
      "hour":  {"stem":"DING","branch":"WEI","stem_label":"정","branch_label":"미"}
    },
    "day_master": {"stem":"XIN","label":"신","element":"metal","yin_yang":"yin"},
    "elements": {"distribution":{"wood":25,"fire":15,"earth":20,"metal":30,"water":10},"balance_summary_key":"WATER_LOW"},
    "ten_gods": {"by_stem":{"year":"정인","month":"편관","day":"비견","hour":"식신"},"summary_key":"TG_MIXED"},
    "relations": {
      "combinations":[{"type":"earthly","code":"COMB_01","label":"삼합(예시)","strength":"mid"}],
      "clashes":[{"type":"earthly","code":"CLASH_02","label":"충(예시)","strength":"low"}]
    },
    "boundaries":{
      "month_pillar_rule":{"basis":"solar_terms","note_key":"MONTH_BY_SOLAR_TERMS"},
      "day_boundary_rule":{"basis":"zi_hour_rule","note_key":"DAY_BOUNDARY_ZI"}
    },
    "tojeong":{"year":2026,"annual_key":"TJ_2026_A1","monthly_keys":[{"month":2,"key":"TJ_2026_M02_B3"}]}
  },
  "narrative": {
    "headline":{"title":"올해는 ‘정리 후 확장’ 흐름이 강해요","subtitle":"근거 기반 요약 리포트"},
    "summary":{
      "one_liner":"큰 방향은 안정화 → 기회 포착으로 이어지는 흐름입니다.",
      "bullets":["관계의 선 긋기","재정은 보수적으로","일은 역할 재정의"],
      "action_guide":[]
    },
    "sections":[
      {
        "id":"saju_table",
        "title":"사주표",
        "state":"free",
        "blocks":[
          {"type":"table","content":{"columns":["구분","천간","지지"],"rows":[["연","갑","자"],["월","병","인"],["일","신","유"],["시","정","미"]]},
           "evidence_refs":["ev_001"]}
        ]
      },
      {
        "id":"money",
        "title":"금전",
        "state":"locked",
        "blocks":[
          {"type":"paragraph","content":{"text":"지출을 통제하면 후반에 여유가 커지는 타입입니다."},"evidence_refs":["ev_002"]}
        ]
      }
    ]
  },
  "evidence":{
    "items":[
      {
        "id":"ev_001",
        "title":"월주 산출 기준: 절기 기반",
        "short":"월주는 24절기 절입 시각 기준으로 전환됩니다.",
        "sources":{"computed_paths":["computed.boundaries.month_pillar_rule"],"rule_ids":["R_BOUNDARY_01"],"keys":["MONTH_BY_SOLAR_TERMS"]},
        "strength":"high",
        "related_sections":["saju_table"]
      },
      {
        "id":"ev_002",
        "title":"오행 균형: 수(水) 약함",
        "short":"수 기운이 상대적으로 낮아 과도한 확장보다 관리/정리가 유리합니다.",
        "sources":{"computed_paths":["computed.elements.distribution.water"],"rule_ids":["R_ELM_BAL_01"],"keys":["WATER_LOW"]},
        "strength":"mid",
        "related_sections":["money"]
      }
    ]
  },
  "ui_hints":{
    "recommended_tabs":["summary","money","tojeong_monthly"],
    "highlight_month": 2,
    "warnings":[]
  },
  "feedback_hooks":{
    "rubric_version":"fb-1.0",
    "tags":[]
  }
}

============================================================
6) JSON Schema(검증용) - Draft 2020-12 (요약)
============================================================
아래는 서버/QA에서 구조 검증에 사용하는 “형태 검증용” 스키마 요약본이다.
(전체 엄격 스키마는 v1.1에서 필드별 enum/패턴을 더 강화 권장)

{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["report_id","type","visibility","locale","created_at","engine_version","content_version","input","computed","narrative","evidence"],
  "properties": {
    "report_id": {"type":"string"},
    "type": {"type":"string"},
    "visibility": {"type":"string"},
    "locale": {"type":"string"},
    "created_at": {"type":"string"},
    "engine_version": {"type":"string"},
    "content_version": {"type":"string"},
    "pricing_context": {"type":"object"},
    "input": {"type":"object"},
    "computed": {"type":"object"},
    "narrative": {"type":"object"},
    "evidence": {"type":"object"},
    "ui_hints": {"type":"object"},
    "feedback_hooks": {"type":"object"}
  }
}

권장 규칙(실무 팁)
- computed는 “절대 LLM이 수정하지 않음” (서버에서 서명/해시 가능)
- narrative는 content_version 기반으로 언제든 재생성 가능(캐시 저장은 OK)
- evidence_refs는 narrative.blocks에서만 참조하고, evidence.items에 반드시 존재해야 함(참조 무결성 테스트)
