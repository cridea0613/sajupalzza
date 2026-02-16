import { getTojeong } from './tojeong.js';

// --- 데이터 정의부 ---
const CHEONGAN = {
    "甲": { element: "목", yin_yang: "양", hangeul: "갑" }, "乙": { element: "목", yin_yang: "음", hangeul: "을" }, "丙": { element: "화", yin_yang: "양", hangeul: "병" }, "丁": { element: "화", yin_yang: "음", hangeul: "정" },
    "戊": { element: "토", yin_yang: "양", hangeul: "무" }, "己": { element: "토", yin_yang: "음", hangeul: "기" }, "庚": { element: "금", yin_yang: "양", hangeul: "경" }, "辛": { element: "금", yin_yang: "음", hangeul: "신" },
    "壬": { element: "수", yin_yang: "양", hangeul: "임" }, "癸": { element: "수", yin_yang: "음", hangeul: "계" },
};
const JIJI = {
    "子": { element: "수", yin_yang: "양", hangeul: "자" }, "丑": { element: "토", yin_yang: "음", hangeul: "축" }, "寅": { element: "목", yin_yang: "양", hangeul: "인" }, "卯": { element: "목", yin_yang: "음", hangeul: "묘" },
    "辰": { element: "토", yin_yang: "양", hangeul: "진" }, "巳": { element: "화", yin_yang: "양", hangeul: "사" }, "午": { element: "화", yin_yang: "음", hangeul: "오" }, "未": { element: "토", yin_yang: "음", hangeul: "미" },
    "申": { element: "금", yin_yang: "양", hangeul: "신" }, "酉": { element: "금", yin_yang: "음", hangeul: "유" }, "戌": { element: "토", yin_yang: "양", hangeul: "술" }, "亥": { element: "수", yin_yang: "음", hangeul: "해" },
};

const ELEMENTS = { "목": 0, "화": 1, "토": 2, "금": 3, "수": 4 };
const SIPSIN_TABLE = [["비견", "겁재"], ["식신", "상관"], ["편재", "정재"], ["편관", "정관"], ["편인", "정인"]];
const CHEONGAN_LIST = Object.keys(CHEONGAN);
const JIJI_LIST = Object.keys(JIJI);
const SOLAR_TERMS = { 1: { "소한": 5, "대한": 20 }, 2: { "입춘": 4, "우수": 19 }, 3: { "경칩": 5, "춘분": 20 }, 4: { "청명": 4, "곡우": 19 }, 5: { "입하": 5, "소만": 20 }, 6: { "망종": 5, "하지": 21 }, 7: { "소서": 6, "대서": 22 }, 8: { "입추": 7, "처서": 22 }, 9: { "백로": 7, "추분": 22 }, 10: { "한로": 8, "상강": 23 }, 11: { "입동": 7, "소설": 22 }, 12: { "대설": 7, "동지": 21 } };
const ZODIAC_ANIMALS = ["쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양", "원숭이", "닭", "개", "돼지"];

const CHEONGAN_HAP_MAP = { "甲": "己", "己": "甲", "乙": "庚", "庚": "乙", "丙": "辛", "辛": "丙", "丁": "壬", "壬": "丁", "戊": "癸", "癸": "戊" };
const ELEMENT_RELATIONS = {
    generates: { "목": "화", "화": "토", "토": "금", "금": "수", "수": "목" },
    generated_by: { "화": "목", "토": "화", "금": "토", "수": "금", "목": "수" },
};

const ILGAN_DESCRIPTION_MAP = {
    "甲": "큰 나무처럼 리더십이 있고 의지가 강하며, 항상 위를 향해 나아가려는 성향이 있습니다.",
    "乙": "부드러운 풀이나 꽃과 같아 유연하고 적응력이 뛰어나며, 강한 생명력을 가지고 있습니다.",
    "丙": "태양처럼 밝고 정열적이며, 명랑하고 활동적입니다. 사람들을 이끄는 매력이 있습니다.",
    "丁": "촛불이나 모닥불처럼 따뜻하고 섬세하며, 타인을 배려하는 마음이 깊습니다.",
    "戊": "넓은 대지나 산처럼 포용력이 있고 믿음직스러우며, 쉽게 흔들리지 않는 뚝심이 있습니다.",
    "己": "비옥한 논밭과 같아 생산력이 뛰어나고 실용적이며, 포근하고 안정적인 성품을 지녔습니다.",
    "庚": "가공되지 않은 원석이나 바위처럼 강인하고 결단력이 있으며, 의리와 정의를 중시합니다.",
    "辛": "날카로운 보석이나 칼처럼 예리하고 정확하며, 완벽을 추구하는 장인정신이 있습니다.",
    "壬": "바다나 강처럼 지혜롭고 유연하며, 큰 그림을 볼 줄 아는 포용력을 가지고 있습니다.",
    "癸": "이슬비나 시냇물처럼 섬세하고 부드러우며, 총명하고 순수한 마음을 지녔습니다."
};

const SIPSIN_ANALYSIS_MAP = {
    "비견": "주체성과 독립심이 강해지는 시기입니다. 동료나 친구와 함께 새로운 일을 도모하기 좋습니다.",
    "겁재": "경쟁심과 승부욕이 강해지지만, 때로는 재물의 손실이 있을 수 있으니 신중한 판단이 필요합니다.",
    "식신": "새로운 아이디어가 샘솟고 창의적인 활동에서 큰 성과를 거둘 수 있는 안정적인 시기입니다.",
    "상관": "자신의 재능을 세상에 드러내고 싶은 욕구가 강해집니다. 기존의 틀을 깨는 혁신을 시도할 수 있습니다.",
    "편재": "사업적 수완이 발휘되고 재물의 흐름이 활발해지는 시기입니다. 과감한 투자를 고려해볼 수 있습니다.",
    "정재": "안정적이고 꾸준한 재물 활동이 기대되는 시기입니다. 결혼이나 안정적인 직장 생활에 유리합니다.",
    "편관": "책임감이 막중해지고 도전적인 과제를 마주하게 됩니다. 명예를 얻을 수 있는 기회이기도 합니다.",
    "정관": "사회적 지위가 상승하고 명예를 얻게 되는 시기입니다. 승진이나 합격의 기쁨을 누릴 수 있습니다.",
    "편인": "학문이나 예술, 종교 등 정신적인 분야에 대한 깊은 탐구가 이루어지는 시기입니다.",
    "정인": "학업에 성취가 따르고, 윗사람의 도움이나 인정을 받아 안정적인 환경에서 발전하는 시기입니다.",
};

// --- 계산 함수 ---
const getSipsin = (ilgan, otherGanji) => {
    const ilganData = CHEONGAN[ilgan];
    const otherData = CHEONGAN[otherGanji] || JIJI[otherGanji];
    if (!ilganData || !otherData) return '';
    const relationship = (ELEMENTS[otherData.element] - ELEMENTS[ilganData.element] + 5) % 5;
    const yinYangFactor = ilganData.yin_yang === otherData.yin_yang ? 0 : 1;
    return SIPSIN_TABLE[relationship][yinYangFactor];
};

const getYearPillar = (year, month, day) => {
    const isPreviousYear = month < 2 || (month === 2 && day < 4);
    const adjustedYear = isPreviousYear ? year - 1 : year;
    const cheonganIndex = (adjustedYear - 4) % 10;
    const jijiIndex = (adjustedYear - 4) % 12;
    return { cheongan: CHEONGAN_LIST[cheonganIndex], jiji: JIJI_LIST[jijiIndex] };
};

const getMonthPillar = (year, month, day) => {
    const monthStartTerms = ["입춘", "경칩", "청명", "입하", "망종", "소서", "입추", "백로", "한로", "입동", "대설", "소한"];
    const termDate = (y, termName) => {
        for (const m in SOLAR_TERMS) { if (SOLAR_TERMS[m][termName]) return new Date(y, parseInt(m) - 1, SOLAR_TERMS[m][termName]); }
        return null;
    }
    let monthJijiIndex = 0;
    for (let i = monthStartTerms.length - 1; i >= 0; i--) {
        const d = termDate(year, monthStartTerms[i]);
        if (d && (new Date(year, month - 1, day) >= d)) { monthJijiIndex = (i + 2) % 12; break; }
    }
    const yearCheonganIndex = (year - 4) % 10;
    const monthCheonganIndex = ((yearCheonganIndex + 1) * 2 + monthJijiIndex) % 10;
    return { cheongan: CHEONGAN_LIST[monthCheonganIndex], jiji: JIJI_LIST[monthJijiIndex] };
};

const getDayPillar = (year, month, day) => {
    const date = new Date(year, month - 1, day);
    const baseDate = new Date(1900, 0, 1);
    const diff = Math.floor((date - baseDate) / (1000 * 60 * 60 * 24));
    const dayIndex = (diff + 46) % 60;
    return { cheongan: CHEONGAN_LIST[dayIndex % 10], jiji: JIJI_LIST[dayIndex % 12] };
};

const getHourPillar = (dayCheongan, hour) => {
    const hourJijiIndex = Math.floor((hour + 1) / 2) % 12;
    const dayCheonganIndex = CHEONGAN_LIST.indexOf(dayCheongan);
    const startCheonganOffset = [0, 2, 4, 6, 8][Math.floor(dayCheonganIndex / 2)];
    const hourCheonganIndex = (startCheonganOffset + hourJijiIndex) % 10;
    return { cheongan: CHEONGAN_LIST[hourCheonganIndex], jiji: JIJI_LIST[hourJijiIndex] };
};

const getDaeunInfo = (birthDate, gender, yearCheongan) => {
    const yearYinYang = CHEONGAN[yearCheongan].yin_yang;
    const direction = (gender === 'male' && yearYinYang === '양') || (gender === 'female' && yearYinYang === '음') ? 'forward' : 'backward';
    const termOrder = ["소한", "대한", "입춘", "우수", "경칩", "춘분", "청명", "곡우", "입하", "소만", "망종", "하지", "소서", "대서", "입추", "처서", "백로", "추분", "한로", "상강", "입동", "소설", "대설", "동지"];
    const getTermDate = (year, termName) => {
        for (const month in SOLAR_TERMS) { if (SOLAR_TERMS[month][termName]) return new Date(year, parseInt(month) - 1, SOLAR_TERMS[month][termName]); }
        return null;
    };
    let birthYear = birthDate.getFullYear();
    let lastTermDate = null, nextTermDate = null;
    for(let i=-2; i < termOrder.length * 2; i++){
        const yearOffset = Math.floor(i / termOrder.length);
        const currentTermName = termOrder[ (i + termOrder.length) % termOrder.length ];
        const currentTermDate = getTermDate(birthYear + yearOffset, currentTermName);
        if(!currentTermDate) continue;
        if (currentTermDate <= birthDate) { lastTermDate = currentTermDate; } else { nextTermDate = currentTermDate; break; }
    }
    if(!lastTermDate || !nextTermDate) return { direction, startAge: 1 };
    const diffDays = direction === 'forward' ? (nextTermDate - birthDate) / (1000 * 60 * 60 * 24) : (birthDate - lastTermDate) / (1000 * 60 * 60 * 24);
    const startAge = Math.floor(diffDays / 3) + 1;
    return { direction, startAge };
};

const getDaeunPeriods = (monthPillar, daeunInfo, ilgan) => {
    const periods = [];
    let cheonganIdx = CHEONGAN_LIST.indexOf(monthPillar.cheongan);
    let jijiIdx = JIJI_LIST.indexOf(monthPillar.jiji);
    const step = daeunInfo.direction === 'forward' ? 1 : -1;
    for (let i = 0; i < 9; i++) {
        cheonganIdx = (cheonganIdx + step + 10) % 10;
        jijiIdx = (jijiIdx + step + 12) % 12;
        const cheongan = CHEONGAN_LIST[cheonganIdx];
        const jiji = JIJI_LIST[jijiIdx];
        const sipsinKey = getSipsin(ilgan, cheongan);
        periods.push({ age: `${daeunInfo.startAge + i * 10}`, daeun: `${CHEONGAN[cheongan].hangeul}${JIJI[jiji].hangeul}`, sipsin: { type: 'term', category: '십신', key: sipsinKey, hangeul: sipsinKey } });
    }
    return periods;
};

// --- 궁합 추천 함수 (개선) ---
const getCompatibility = (ilgan) => {
    const recommendations = [];
    const ilganData = CHEONGAN[ilgan];
    if (!ilganData) return [];

    const addRecommendation = (type, gan, relationDescription) => {
        const ganData = CHEONGAN[gan];
        recommendations.push({
            type: type,
            ilju: `${ganData.hangeul}(${gan}) 일주`,
            compatibilityDescription: relationDescription,
            ilganDescription: ILGAN_DESCRIPTION_MAP[gan]
        });
    };

    // 1. 천생연분 (천간합)
    const soulmateGan = CHEONGAN_HAP_MAP[ilgan];
    if (soulmateGan) {
        addRecommendation("천생연분", soulmateGan, `나의 일간 '${ilganData.hangeul}'과 하늘의 기운이 합을 이루는 최고의 궁합입니다. 서로에게 강하게 끌리며, 안정적인 관계를 만들어갑니다.`);
    }

    // 2. 좋은 궁합 (내가 생해주는 오행)
    const generatedElement = ELEMENT_RELATIONS.generates[ilganData.element];
    const goodMatchGan = Object.keys(CHEONGAN).find(gan => gan !== ilgan && CHEONGAN[gan].element === generatedElement && CHEONGAN[gan].yin_yang !== ilganData.yin_yang)
                       || Object.keys(CHEONGAN).find(gan => gan !== ilgan && CHEONGAN[gan].element === generatedElement);
    if (goodMatchGan) {
        addRecommendation("좋은 궁합", goodMatchGan, `내가 도움을 주고 이끌어줄 수 있는 관계입니다. 나의 에너지가 상대방에게 힘이 되어주며, 함께 성장하는 즐거움이 있습니다.`);
    }

    // 3. 친구 같은 궁합 (나를 생해주는 오행)
    const generatingElement = ELEMENT_RELATIONS.generated_by[ilganData.element];
    const supportiveMatchGan = Object.keys(CHEONGAN).find(gan => gan !== ilgan && CHEONGAN[gan].element === generatingElement && CHEONGAN[gan].yin_yang !== ilganData.yin_yang)
                             || Object.keys(CHEONGAN).find(gan => gan !== ilgan && CHEONGAN[gan].element === generatingElement);
    if (supportiveMatchGan) {
        addRecommendation("친구 같은 궁합", supportiveMatchGan, `나에게 도움을 주고 기운을 북돋아 주는 든든한 관계입니다. 함께 있으면 편안하고, 안정감을 느낄 수 있습니다.`);
    }

    return recommendations.slice(0, 3);
};


// --- 메인 함수 ---
export const getSaju = (birthDate, gender, timeUnknown = false) => {
    try {
        const year = birthDate.getFullYear();
        const month = birthDate.getMonth() + 1;
        const day = birthDate.getDate();
        
        const yearPillar = getYearPillar(year, month, day);
        const monthPillar = getMonthPillar(year, month, day);
        const dayPillar = getDayPillar(year, month, day);
        const hourPillar = !timeUnknown ? getHourPillar(dayPillar.cheongan, birthDate.getHours()) : { cheongan: '?', jiji: '?' };

        const ilgan = dayPillar.cheongan;
        const ilji = dayPillar.jiji;
        const iljuSipsin = getSipsin(ilgan, ilji);
        const zodiacAnimal = ZODIAC_ANIMALS[JIJI_LIST.indexOf(yearPillar.jiji)];

        const palja = [
            { title: "시주", cheongan: hourPillar.cheongan, jiji: hourPillar.jiji },
            { title: "일주", cheongan: dayPillar.cheongan, jiji: dayPillar.jiji },
            { title: "월주", cheongan: monthPillar.cheongan, jiji: monthPillar.jiji },
            { title: "년주", cheongan: yearPillar.cheongan, jiji: yearPillar.jiji },
        ];
        
        const daeunInfo = getDaeunInfo(birthDate, gender, yearPillar.cheongan);
        const daeunPeriods = getDaeunPeriods(monthPillar, daeunInfo, ilgan);
        const tojeongData = getTojeong(birthDate, new Date().getFullYear());
        const compatibilityResults = getCompatibility(ilgan); // 궁합 데이터 생성

        const ilganTerm = { type: 'term', category: '천간', key: ilgan, hangeul: CHEONGAN[ilgan].hangeul + '일간' };
        const iljuSipsinTerm = { type: 'term', category: '십신', key: iljuSipsin, hangeul: iljuSipsin };
        const summaryPrefix = timeUnknown ? '태어난 시간을 몰라 시주(時柱)를 제외한 육자(六字)를 기반으로 풀이합니다. 시주를 제외하므로 일부 정확도가 떨어질 수 있습니다.\n\n' : '';
        const paljaSectionTitle = timeUnknown ? "나의 사주 구조 (육자)" : "나의 사주팔자 구조";
        const paljaParagraph = timeUnknown ? "태어난 시간을 알 수 없어, 시주(時柱)를 제외한 년주, 월주, 일주 세 기둥(육자)을 바탕으로 당신의 타고난 기질과 운명의 흐름을 분석합니다." : "사주팔자는 태어난 연, 월, 일, 시를 바탕으로 한 네 개의 기둥(사주)과 여덟 개의 글자(팔자)로 구성됩니다. 각 기둥은 천간과 지지로 이루어져 있으며, 이들의 상호작용을 통해 당신의 타고난 기질과 운명의 흐름을 분석할 수 있습니다.";

        const narrative = {
            headline: {
                title_parts: [ ilganTerm, { type: 'text', value: '으로 태어난 당신,' }],
                text: "주체적인 삶을 개척하는 강한 의지를 지녔습니다."
            },
            summary: {
                content: [
                    { type: 'text', value: summaryPrefix },
                    { type: 'text', value: `당신은 ${zodiacAnimal}띠 해에, ` },
                    ilganTerm,
                    { type: 'text', value: `(${CHEONGAN[ilgan].element} ${CHEONGAN[ilgan].yin_yang})으로 태어났습니다.\n${ILGAN_DESCRIPTION_MAP[ilgan]}\n\n` },
                    { type: 'text', value: `일주(${CHEONGAN[ilgan].hangeul}${JIJI[ilji].hangeul})는 당신의 핵심적인 성향을 보여줍니다. ${JIJI[ilji].element}의 기운 위에 앉은 당신은 '` },
                    iljuSipsinTerm,
                    { type: 'text', value: `'의 특성을 강하게 드러냅니다.\n${SIPSIN_ANALYSIS_MAP[iljuSipsin] || ''}\n\n` },
                    { type: 'text', value: '이는 당신의 삶 전반에 걸쳐 중요한 영향을 미치며, 대인관계, 직업, 재물 활동 등에서 구체적인 모습으로 나타나게 됩니다. 아래에서는 당신의 사주 구조와 인생의 큰 흐름인 대운(大運)을 더 자세히 살펴보겠습니다.' },
                ]
            },
            sections: [
                {
                    id: "palja_summary",
                    title: paljaSectionTitle,
                    blocks: [
                         { type: "paragraph", content: {text: paljaParagraph}},
                         {
                            type: "table",
                            content: {
                                columns: ["구분", "천간", "오행", "지지", "십신"],
                                rows: palja.map(p => {
                                    if (timeUnknown && p.title === '시주') return [p.title, '모름', '-', '모름', '-'];
                                    const sipsinKey = getSipsin(ilgan, p.cheongan);
                                    return [ p.title, `${CHEONGAN[p.cheongan].hangeul}(${p.cheongan})`, CHEONGAN[p.cheongan].element, `${JIJI[p.jiji].hangeul}(${p.jiji})`, { type: 'term', category: '십신', key: sipsinKey, hangeul: sipsinKey }];
                                })
                            }
                        }
                    ]
                },
                {
                    id: "daeun_analysis",
                    title: "인생의 10년 주기별 흐름 (대운)",
                    blocks: [
                        { type: "paragraph", content: { text: `대운은 약 10년 주기로 바뀌는 인생의 큰 환경과 운의 흐름을 나타냅니다. 당신의 대운은 ${daeunInfo.startAge}세에 처음 시작되어, ${daeunInfo.direction === 'forward' ? '미래 방향으로(순행)' : '과거 방향으로(역행)'}으로 10년마다 변화합니다.` } },
                        { type: "daeun_table", content: { periods: daeunPeriods } }
                    ]
                },
                {
                    id: "tojeong_analysis",
                    title: `${new Date().getFullYear()}년 토정비결`,
                    blocks: [
                        { type: "tojeong_result", content: tojeongData }
                    ]
                },
                {
                    id: "compatibility_analysis",
                    title: "나와 잘 맞는 사주 추천",
                    blocks: [
                        { type: "paragraph", content: { text: "사주 궁합은 두 사람의 관계를 이해하는 데 도움을 주는 지표입니다. 당신의 일간을 기준으로, 오행의 상생과 합의 원리에 따라 좋은 시너지를 낼 수 있는 사주 유형을 추천해 드립니다." } },
                        { type: "compatibility_cards", content: { recommendations: compatibilityResults } }
                    ]
                }
            ]
        };

        return { narrative, evidence: {} };

    } catch (error) {
        console.error("Error in getSaju:", error);
        return {
            narrative: {
                headline: { title_parts: [{type:"text", value: "오류"}], text: "사주 정보를 계산하는 중 오류가 발생했습니다." },
                summary: { content: [{type:"text", value: "입력 값을 확인하시거나 잠시 후 다시 시도해주세요." }]},
                sections: []
            },
            evidence: {}
        };
    }
};