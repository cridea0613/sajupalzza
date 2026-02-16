const TOJEONG_GWAE = {
    "111": { name: "건(乾)", summary: "하늘 위 하늘이니, 뜻이 높고 크게 이루어진다. 교만함을 경계하라.", keywords: ["성취", "리더십", "과유불급"] },
    "112": { name: "태(兌)", summary: "연못에 물이 가득하니, 기쁨과 재물이 넘친다. 구설수를 조심하라.", keywords: ["기쁨", "재물", "사교"] },
    "121": { name: "리(離)", summary: "불이 세상을 밝히니, 명예가 높아지고 앞길이 밝다. 경거망동을 삼가라.", keywords: ["명예", "열정", "드러남"] },
    "122": { name: "진(震)", summary: "천둥이 울려 퍼지니, 새로운 시작과 변화의 조짐이다. 용기를 내어 나아가라.", keywords: ["시작", "용기", "변화"] },
    "211": { name: "손(巽)", summary: "바람이 부드럽게 부니, 겸손하면 큰 이로움을 얻는다. 꾸준함이 중요하다.", keywords: ["겸손", "순종", "이익"] },
    "212": { name: "감(坎)", summary: "험난한 물길을 만나니, 어려움 속에 기회가 있다. 지혜롭게 대처하라.", keywords: ["고난", "지혜", "기회"] },
    "221": { name: "간(艮)", summary: "산처럼 멈춰 서니, 현재를 지키고 내실을 다질 때이다. 성급함을 버려라.", keywords: ["멈춤", "내실", "안정"] },
    "222": { name: "곤(坤)", summary: "어머니의 땅과 같으니, 포용력으로 만물을 생성한다. 순리를 따르면 길하다.", keywords: ["포용", "안정", "결실"] },
};

const MONTHLY_ANALYSIS = [
    "새로운 계획을 시작하기 좋은 달입니다. 귀인의 도움을 받을 수 있습니다.",
    "인간관계에 힘쓰면 좋은 결과가 따릅니다. 이동이나 변화는 신중하게 결정하세요.",
    "재물운이 상승하지만, 예상치 못한 지출도 발생할 수 있습니다.",
    "문서나 계약과 관련된 일에서 좋은 성과를 기대할 수 있습니다.",
    "가장 왕성한 활동이 예상되는 달입니다. 자신감을 가지고 나아가세요.",
    "주변 사람들의 의견을 경청하면 어려움을 피할 수 있습니다.",
    "노력의 결실을 맺는 시기입니다. 겸손한 자세를 잃지 마세요.",
    "건강에 유의해야 할 시기입니다. 무리한 활동은 피하는 것이 좋습니다.",
    "여행이나 이동을 통해 새로운 기회를 발견할 수 있습니다.",
    "윗사람의 인정을 받아 명예를 얻게 될 수 있습니다.",
    "잠시 숨을 고르며 재충전의 시간을 갖는 것이 좋습니다.",
    "한 해를 마무리하며 주변 사람들에게 감사를 표하면 복이 따릅니다."
];


export const getTojeong = (birthDate) => {
    const year = birthDate.getFullYear();
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();
    const currentYear = new Date().getFullYear();

    // 토정비결 괘를 구하는 단순화된 로직
    const upperGwae = ((currentYear % 8) + (month % 8)) % 8 + 1;
    const middleGwae = ((year % 12) + (month % 12) + (day % 12)) % 8 + 1;
    const lowerGwae = (day % 8) + 1;

    // 3개의 숫자를 조합하여 괘 인덱스 생성 (1 또는 2로 변환)
    const gwaeIndex = `${upperGwae % 2 + 1}${middleGwae % 2 + 1}${lowerGwae % 2 + 1}`;

    const mainGwae = TOJEONG_GWAE[gwaeIndex] || TOJEONG_GWAE["111"];

    const monthly = MONTHLY_ANALYSIS.map((analysis, index) => {
        // 월별 운세에 간단한 변화를 주기 위한 로직
        const monthGwaeIndex = `${(upperGwae + index) % 2 + 1}${(middleGwae + index) % 2 + 1}${(lowerGwae + index) % 2 + 1}`;
        const monthGwae = TOJEONG_GWAE[monthGwaeIndex] || TOJEONG_GWAE["111"];
        return {
            month: index + 1,
            summary: analysis,
            keywords: monthGwae.keywords
        };
    });

    return {
        title: `${currentYear}년 토정비결`,
        summary: mainGwae.summary,
        keywords: mainGwae.keywords,
        monthly: monthly
    };
};