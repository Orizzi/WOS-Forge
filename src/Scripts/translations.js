// Translations Module
// Handles multi-language support for the WOS Calculator

(function () {
    'use strict';

    const LANGUAGE_KEY = 'wos-language';
    let initialized = false;

    const debug = (...args) => {
        if (typeof console !== 'undefined') {
            console.log('[I18n]', ...args);
        }
    };

    const translations = {

        /* ===========================
           ENGLISH
        ============================ */
        en: {
            title: "Whiteout Survival Chief Gear Calculator",

            "nav-home": "Home",
            "nav-charms": "Charms",
            "nav-chief-gear": "Chief Gear",
            "nav-hero-gear": "Hero Gear",
            "nav-fire-crystals": "Fire Crystals",
            "nav-war-academy": "War Academy",
            "nav-pets": "Pets",
            "nav-experts": "Experts",

            "home-hero-title": "Welcome to the WOS Calculator",
            "home-hero-body-1": "This calculator is designed to help you optimize your gameplay in Whiteout Survival (WOS). Whether you're looking to enhance your charms, upgrade your chief gear, or manage your fire crystals, these tools are here to assist you.",
            "home-hero-body-2": "Use the navigation links above to explore different sections of the calculator tailored to various aspects of the game. Happy gaming!",

            "coming-title": "New Calculators Are Coming Soon",
            "coming-lede": "We're forging brand new tools for War Academy research and Pets progression. These will plug straight into your existing profiles so you can plan smarter, faster, and with more confidence.",
            "coming-highlights-label": "Highlights on the way:",
            "coming-highlight-research": "Research roadmaps with resource, time, and power projections",
            "coming-highlight-pets": "Pet upgrade planners with feeding, evolution, and synergy tracking",
            "coming-highlight-experts": "Expert upgrade planner to map out boosts and resource needs",
            "coming-highlight-combined": "Combined profile view that blends charms, chief gear, fire crystals, pets, and academy boosts",
            "coming-outro": "Stay tuned — this page will light up with the new calculators as soon as they're ready.",

            "storage-consent-title": "Allow saving profiles on this device?",
            "storage-consent-body": "<p>We store your plans in your browser so you can access them after refreshing.</p><p>This data stays on this device (localStorage); nothing is sent to a server.</p><p>You can switch or delete profiles anytime.</p>",
            "storage-consent-allow": "Allow",
            "storage-consent-deny": "No thanks",
            "delete-profile-title": "Delete Profile",
            "delete-profile-confirm": "Delete",
            "delete-profile-cancel": "Cancel",
            "delete-profile-message": "<p>Are you sure you want to delete the profile %s?<br>This action cannot be undone.</p>",

            "charms-header": "Charms Calculator",
            "charms-inventory": "Charms Inventory",
            "profile-name-placeholder": "New profile name",

            results: "Results",
            total: "Total",
            "total-power": "Total Power",
            "total-svs-points": "Total SvS Points",
            totals: "Totals",
            slot: "Slot",
            "need-more": "need",
            more: "more",
            "will-have": "will have",
            left: "left!",
            guides: "Guides",
            designs: "Designs",
            secrets: "Secrets",
            "reset-all": "Reset All",
            "profiles-header": "Profiles",
            delete: "Delete",
            batch: "BATCH",
            from: "FROM:",
            to: "TO:",
            charm: "Charm",
            "charm-1": "Charm 1:",
            "charm-2": "Charm 2:",
            "charm-3": "Charm 3:",
            "hat-charms": "Hat Charms",
            "chestplate-charms": "Chestplate Charms",
            "ring-charms": "Ring Charms",
            "watch-charms": "Watch Charms",
            "pants-charms": "Pants Charms",
            "staff-charms": "Staff Charms",

            header: "Chief Gear Calculator",
            "inventory-header": "Your Inventory",
            "select-all-header": "Set All Gear Levels",
            "totals-header": "Items You Need",
            "building-breakdown": "Building Breakdown",

            building: "Building",

            "hardened-alloy": "Hardened Alloy",
            "polishing-solution": "Polishing Solution",
            "design-plans": "Design Plans",
            "lunar-amber": "Lunar Amber",
            "fire-crystals": "Fire Crystals",
            "refine-crystals": "Refine Crystals",
            "meat": "Meat",
            "wood": "Wood",
            "coal": "Coal",
            "iron": "Iron",
            "construction-speed": "Construction Speed (%)",
            "speedup-days": "Speedup Days",
            "total-time": "Total Time",
            "total-reduced-time": "Total Reduced Time",

            Helmet: "Helmet",
            Chestplate: "Chestplate",
            Ring: "Ring",
            Watch: "Watch",
            Pants: "Pants",
            Staff: "Staff",

            Furnace: "Furnace",
            Embassy: "Embassy",
            "Command Center": "Command Center",
            Infirmary: "Infirmary",
            "Infantry Camp": "Infantry Camp",
            "Marksman Camp": "Marksman Camp",
            "Lancer Camp": "Lancer Camp",
            "War Academy": "War Academy",

            "gear-current": "Current",
            "gear-desired": "Desired",
            "gear-type": "Gear",
            "building-current": "Current",
            "building-desired": "Desired",
            "level.start": "Start",
            "level.finish": "Finish",

            "svs-points": "SvS Points",
            "svs-points-fc": "SvS Points (FC)",
            "svs-points-rfc": "SvS Points (RFC)",
            "svs-points-speedup": "SvS Points (Speedup)",
            "total-svs-points": "Total SvS Points",
            "still-needed": "Still Needed",

            "gap-need-more": "need <span class=\"number\">%d</span> more!",
            "gap-have-left": "will have <span class=\"number\">%d</span> left!",
            "gap-time-need-more": "Need <span class=\"number\">%dd %dh %dm</span> more!",
            "gap-time-have-left": "Will have <span class=\"number\">%dd %dh %dm</span> left!",

            "support-header": "Support This Project",
            "support-message": "I hope these calculators were helpful! If you'd like to support the project, my WOS ID is: 146631801. Thanks and happy surviving!"
        },

        /* ===========================
           SPANISH
        ============================ */
        es: {
            title: "Calculadora de Equipo de Jefe - Whiteout Survival",

            "nav-home": "Inicio",
            "nav-charms": "Amuletos",
            "nav-chief-gear": "Equipo de Jefe",
            "nav-hero-gear": "Equipo de Héroe",
            "nav-fire-crystals": "Cristales de Fuego",
            "nav-war-academy": "Academia de Guerra",
            "nav-pets": "Mascotas",
            "nav-experts": "Expertos",

            "home-hero-title": "Bienvenido al Calculador de WOS",
            "home-hero-body-1": "Este calculador te ayuda a optimizar tu progreso en Whiteout Survival (WOS). Ya sea que mejores amuletos, equipo de jefe o gestiones cristales de fuego, estas herramientas están aquí para ayudarte.",
            "home-hero-body-2": "Usa la navegación superior para explorar las diferentes secciones del calculador según lo que quieras planificar.",

            "coming-title": "Nuevos calculadores llegan pronto",
            "coming-lede": "Estamos creando nuevas herramientas para la Academia de Guerra y la progresión de Mascotas. Se integrarán con tus perfiles actuales para que puedas planificar más rápido y con confianza.",
            "coming-highlights-label": "Lo que viene:",
            "coming-highlight-research": "Rutas de investigación con proyecciones de recursos, tiempo y poder",
            "coming-highlight-pets": "Planificadores de mejora de mascotas con alimentación, evolución y sinergias",
            "coming-highlight-experts": "Planificador de expertos para mapear impulsos y recursos necesarios",
            "coming-highlight-combined": "Vista combinada que mezcla amuletos, equipo de jefe, cristales de fuego, mascotas y la Academia",
            "coming-outro": "Muy pronto esta página se actualizará con los nuevos calculadores.",

            "storage-consent-title": "¿Permitir guardar perfiles en este dispositivo?",
            "storage-consent-body": "<p>Guardamos tus planes en el navegador para recuperarlos tras recargar.</p><p>Los datos se quedan en este dispositivo (localStorage); no se envían a ningún servidor.</p><p>Puedes cambiar o borrar perfiles cuando quieras.</p>",
            "storage-consent-allow": "Permitir",
            "storage-consent-deny": "No, gracias",
            "delete-profile-title": "Eliminar perfil",
            "delete-profile-confirm": "Eliminar",
            "delete-profile-cancel": "Cancelar",
            "delete-profile-message": "<p>¿Seguro que deseas borrar el perfil %s?<br>Esta acción no se puede deshacer.</p>",

            "charms-header": "Calculadora de Amuletos",
            "charms-inventory": "Inventario de Amuletos",
            "profile-name-placeholder": "Nombre del perfil",

            results: "Resultados",
            total: "Total",
            "total-power": "Poder Total",
            "total-svs-points": "Puntos totales de SvS",
            totals: "Totales",
            slot: "Ranura",
            "need-more": "necesita",
            more: "más",
            "will-have": "tendrá",
            left: "de sobra!",
            guides: "Guías",
            designs: "Diseños",
            secrets: "Secretos",
            "reset-all": "Restablecer Todo",
            "profiles-header": "Perfiles",
            delete: "Eliminar",
            batch: "LOTE",
            from: "DE:",
            to: "A:",
            charm: "Amuleto",
            "charm-1": "Amuleto 1:",
            "charm-2": "Amuleto 2:",
            "charm-3": "Amuleto 3:",
            "hat-charms": "Amuletos de Casco",
            "chestplate-charms": "Amuletos de Peto",
            "ring-charms": "Amuletos de Anillo",
            "watch-charms": "Amuletos de Reloj",
            "pants-charms": "Amuletos de Pantalones",
            "staff-charms": "Amuletos de Bastón",

            header: "Calculadora de Equipo de Jefe",
            "inventory-header": "Tu Inventario",
            "select-all-header": "Establecer todos los niveles",
            "totals-header": "Artículos que Necesitas",
            "building-breakdown": "Desglose por Edificio",

            building: "Edificio",

            "hardened-alloy": "Aleación Endurecida",
            "polishing-solution": "Solución Pulidora",
            "design-plans": "Planos de Diseño",
            "lunar-amber": "Ámbar Lunar",
            "fire-crystals": "Cristales de Fuego",
            "refine-crystals": "Cristales Refinados",
            "meat": "Carne",
            "wood": "Madera",
            "coal": "Carbón",
            "iron": "Hierro",
            "construction-speed": "Velocidad de Construcción (%)",
            "speedup-days": "Días de Aceleración",
            "total-time": "Tiempo Total",
            "total-reduced-time": "Tiempo Total Reducido",

            Helmet: "Casco",
            Chestplate: "Peto",
            Ring: "Anillo",
            Watch: "Reloj",
            Pants: "Pantalones",
            Staff: "Bastón",

            Furnace: "Horno",
            Embassy: "Embajada",
            "Command Center": "Centro de Comando",
            Infirmary: "Enfermería",
            "Infantry Camp": "Campamento de Infantería",
            "Marksman Camp": "Campamento de Tiradores",
            "Lancer Camp": "Campamento de Lanceros",
            "War Academy": "Academia de Guerra",

            "gear-current": "Actual",
            "gear-desired": "Deseado",
            "gear-type": "Equipo",
            "building-current": "Actual",
            "building-desired": "Deseado",
            "level.start": "Inicio",
            "level.finish": "Fin",

            "svs-points": "Puntos SvS",
            "svs-points-fc": "Puntos SvS (Cristales de Fuego)",
            "svs-points-rfc": "Puntos SvS (Refinados)",
            "svs-points-speedup": "Puntos SvS (Aceleraciones)",
            "total-svs-points": "Total SvS",
            "still-needed": "Aún necesario",

            "gap-need-more": "necesita <span class=\"number\">%d</span> más!",
            "gap-have-left": "tendrá <span class=\"number\">%d</span> de sobra!",
            "gap-time-need-more": "¡Necesita <span class=\"number\">%dd %dh %dm</span> más!",
            "gap-time-have-left": "¡Tendrá <span class=\"number\">%dd %dh %dm</span> de sobra!",

            "support-header": "Apoya Este Proyecto",
            "support-message": "Espero que estas calculadoras hayan sido útiles. Si deseas apoyar el proyecto, mi ID de WOS es: 146631801. ¡Gracias!"
        },

        /* ===========================
           KOREAN
        ============================ */
        ko: {
            title: "화이트아웃 서바이벌 지도자 장비 계산기",

            "nav-home": "홈",
            "nav-charms": "부적",
            "nav-chief-gear": "지도자 장비",
            "nav-hero-gear": "영웅 장비",
            "nav-fire-crystals": "화염 수정",
            "nav-war-academy": "전쟁 아카데미",
            "nav-pets": "펫",
            "nav-experts": "전문가",

            "home-hero-title": "WOS 계산기에 오신 것을 환영합니다",
            "home-hero-body-1": "이 계산기는 Whiteout Survival(WOS)에서 부적, 지도자 장비, 화염 수정 등 여러 요소를 효율적으로 관리하고 강화할 수 있도록 도와줍니다.",
            "home-hero-body-2": "상단 메뉴를 사용해 게임 요소별 계산기를 활용해 보세요. 즐거운 생존 되십시오!",

            "coming-title": "새로운 계산기가 곧 추가됩니다",
            "coming-lede": "전쟁 아카데미 연구와 펫 성장에 대한 새로운 도구를 제작 중입니다. 기존 프로필과 연동되어 더 빠르고 정확한 계획 수립이 가능합니다.",
            "coming-highlights-label": "예정 기능:",
            "coming-highlight-research": "자원·시간·전투력 예측이 포함된 연구 계획표",
            "coming-highlight-pets": "펫 급식·진화·시너지 추적을 포함한 성장 계획기",
            "coming-highlight-experts": "전문가 향상 및 자원 요구량 계산기",
            "coming-highlight-combined": "부적, 지도자 장비, 화염 수정, 펫, 아카데미 효과를 통합한 프로필 보기",
            "coming-outro": "새로운 계산기가 곧 업데이트됩니다. 기대해 주세요!",

            "storage-consent-title": "이 기기에 프로필을 저장하시겠습니까?",
            "storage-consent-body": "<p>계획은 브라우저에 저장되어 새로고침 후에도 유지됩니다.</p><p>데이터는 서버로 전송되지 않고 이 기기에만 저장됩니다.</p><p>언제든지 프로필을 변경하거나 삭제할 수 있습니다.</p>",
            "storage-consent-allow": "허용",
            "storage-consent-deny": "거부",
            "delete-profile-title": "프로필 삭제",
            "delete-profile-confirm": "삭제",
            "delete-profile-cancel": "취소",
            "delete-profile-message": "<p>정말로 프로필 %s을(를) 삭제하시겠습니까?<br>이 작업은 되돌릴 수 없습니다.</p>",

            "charms-header": "부적 계산기",
            "charms-inventory": "부적 보유 현황",
            "profile-name-placeholder": "새 프로필 이름",

            results: "결과",
            total: "총합",
            "total-power": "총 전투력",
            "total-svs-points": "총 SvS 점수",
            totals: "합계",
            slot: "슬롯",
            "need-more": "필요",
            more: "더 필요",
            "will-have": "남음",
            left: "남습니다!",
            guides: "가이드",
            designs: "도면",
            secrets: "비밀",
            "reset-all": "전체 초기화",
            "profiles-header": "프로필",
            delete: "삭제",
            batch: "일괄",
            from: "FROM:",
            to: "TO:",
            charm: "부적",
            "charm-1": "부적 1:",
            "charm-2": "부적 2:",
            "charm-3": "부적 3:",
            "hat-charms": "모자 부적",
            "chestplate-charms": "흉갑 부적",
            "ring-charms": "반지 부적",
            "watch-charms": "시계 부적",
            "pants-charms": "바지 부적",
            "staff-charms": "지팡이 부적",

            header: "지도자 장비 계산기",
            "inventory-header": "보유 장비",
            "select-all-header": "모든 장비 레벨 설정",
            "totals-header": "필요 자원",
            "building-breakdown": "건물별 분해",

            building: "건물",

            "hardened-alloy": "경화 합금",
            "polishing-solution": "연마액",
            "design-plans": "설계도",
            "lunar-amber": "달빛 호박석",
            "fire-crystals": "화염 수정",
            "refine-crystals": "정제 화염 수정",
            "meat": "고기",
            "wood": "목재",
            "coal": "석탄",
            "iron": "철",
            "construction-speed": "건설 속도 (%)",
            "speedup-days": "가속 일수",
            "total-time": "총 시간",
            "total-reduced-time": "감소된 총 시간",

            Helmet: "투구",
            Chestplate: "흉갑",
            Ring: "반지",
            Watch: "시계",
            Pants: "바지",
            Staff: "지팡이",

            Furnace: "용광로",
            Embassy: "대사관",
            "Command Center": "사령부",
            Infirmary: "의무실",
            "Infantry Camp": "보병 훈련소",
            "Marksman Camp": "궁수 훈련소",
            "Lancer Camp": "창기병 훈련소",
            "War Academy": "전쟁 아카데미",

            "gear-current": "현재",
            "gear-desired": "목표",
            "gear-type": "장비",
            "building-current": "현재",
            "building-desired": "목표",
            "level.start": "시작",
            "level.finish": "완료",

            "svs-points": "SvS 점수",
            "svs-points-fc": "SvS 점수 (화염 수정)",
            "svs-points-rfc": "SvS 점수 (정제 수정)",
            "svs-points-speedup": "SvS 점수 (가속)",
            "total-svs-points": "총 SvS 점수",
            "still-needed": "추가 필요",

            "gap-need-more": "<span class=\"number\">%d</span> 더 필요합니다!",
            "gap-have-left": "<span class=\"number\">%d</span> 남습니다!",
            "gap-time-need-more": "<span class=\"number\">%dd %dh %dm</span> 더 필요합니다!",
            "gap-time-have-left": "<span class=\"number\">%dd %dh %dm</span> 남습니다!",

            "support-header": "프로젝트 후원",
            "support-message": "이 계산기가 도움이 되셨기를 바랍니다! 프로젝트를 지원하고 싶다면 제 WOS ID는 146631801입니다. 감사합니다!"
        },

        /* ===========================
           RUSSIAN
        ============================ */
        ru: {
            title: "Калькулятор снаряжения Вождя — Whiteout Survival",

            "nav-home": "Главная",
            "nav-charms": "Амулеты",
            "nav-chief-gear": "Снаряжение Вождя",
            "nav-hero-gear": "Снаряжение Героя",
            "nav-fire-crystals": "Огненные кристаллы",
            "nav-war-academy": "Военная академия",
            "nav-pets": "Питомцы",
            "nav-experts": "Эксперты",

            "home-hero-title": "Добро пожаловать в калькулятор WOS",
            "home-hero-body-1": "Этот калькулятор помогает оптимизировать развитие в Whiteout Survival (WOS). Он упрощает расчёт амулетов, улучшений снаряжения Вождя и управления огненными кристаллами.",
            "home-hero-body-2": "Используйте меню сверху, чтобы перейти к нужному разделу. Приятной игры!",

            "coming-title": "Новые калькуляторы скоро появятся",
            "coming-lede": "Мы создаём новые инструменты для исследований Военной академии и развития питомцев. Они будут интегрированы с вашими профилями, чтобы вы могли планировать быстрее и точнее.",
            "coming-highlights-label": "Скоро будет:",
            "coming-highlight-research": "Планы исследований с прогнозом ресурсов, времени и боевой мощи",
            "coming-highlight-pets": "Планировщик развития питомцев: кормление, эволюции, синергии",
            "coming-highlight-experts": "Планировщик улучшений экспертов с расчётом бонусов и требований",
            "coming-highlight-combined": "Объединённый профиль: амулеты, снаряжение Вождя, кристаллы, питомцы и бонусы академии",
            "coming-outro": "Следите за обновлениями — новые калькуляторы появятся совсем скоро!",

            "storage-consent-title": "Разрешить сохранять профили на этом устройстве?",
            "storage-consent-body": "<p>Ваши планы сохраняются в браузере и доступны после обновления страницы.</p><p>Данные остаются на этом устройстве (localStorage) и не отправляются на сервер.</p><p>Вы можете изменять или удалять профили в любое время.</p>",
            "storage-consent-allow": "Разрешить",
            "storage-consent-deny": "Нет",
            "delete-profile-title": "Удалить профиль",
            "delete-profile-confirm": "Удалить",
            "delete-profile-cancel": "Отмена",
            "delete-profile-message": "<p>Вы уверены, что хотите удалить профиль %s?<br>Это действие нельзя отменить.</p>",

            "charms-header": "Калькулятор амулетов",
            "charms-inventory": "Инвентарь амулетов",
            "profile-name-placeholder": "Новое имя профиля",

            results: "Результаты",
            total: "Всего",
            "total-power": "Общая мощь",
            "total-svs-points": "Всего очков SvS",
            totals: "Итого",
            slot: "Слот",
            "need-more": "нужно",
            more: "больше",
            "will-have": "останется",
            left: "осталось!",
            guides: "Гайды",
            designs: "Чертежи",
            secrets: "Секреты",
            "reset-all": "Сбросить всё",
            "profiles-header": "Профили",
            delete: "Удалить",
            batch: "ПАКЕТ",
            from: "ОТ:",
            to: "ДО:",
            charm: "Амулет",
            "charm-1": "Амулет 1:",
            "charm-2": "Амулет 2:",
            "charm-3": "Амулет 3:",
            "hat-charms": "Амулеты шлема",
            "chestplate-charms": "Амулеты нагрудника",
            "ring-charms": "Амулеты кольца",
            "watch-charms": "Амулеты часов",
            "pants-charms": "Амулеты штанов",
            "staff-charms": "Амулеты посоха",

            header: "Калькулятор снаряжения Вождя",
            "inventory-header": "Ваш инвентарь",
            "select-all-header": "Установить уровни всей экипировки",
            "totals-header": "Требуемые материалы",
            "building-breakdown": "Разбор по зданиям",

            building: "Здание",

            "hardened-alloy": "Закалённый сплав",
            "polishing-solution": "Полировочный раствор",
            "design-plans": "Чертежи",
            "lunar-amber": "Лунный янтарь",
            "fire-crystals": "Огненные кристаллы",
            "refine-crystals": "Очищенные кристаллы",
            "meat": "Мясо",
            "wood": "Дерево",
            "coal": "Уголь",
            "iron": "Железо",
            "construction-speed": "Скорость строительства (%)",
            "speedup-days": "Дни ускорений",
            "total-time": "Общее время",
            "total-reduced-time": "Сокращённое время",

            Helmet: "Шлем",
            Chestplate: "Нагрудник",
            Ring: "Кольцо",
            Watch: "Часы",
            Pants: "Штаны",
            Staff: "Посох",

            Furnace: "Плавильня",
            Embassy: "Посольство",
            "Command Center": "Командный центр",
            Infirmary: "Медпункт",
            "Infantry Camp": "Лагерь пехоты",
            "Marksman Camp": "Лагерь стрелков",
            "Lancer Camp": "Лагерь копейщиков",
            "War Academy": "Военная академия",

            "gear-current": "Текущий",
            "gear-desired": "Цель",
            "gear-type": "Снаряжение",
            "building-current": "Текущее",
            "building-desired": "Цель",
            "level.start": "Начало",
            "level.finish": "Конец",

            "svs-points": "Очки SvS",
            "svs-points-fc": "Очки SvS (Огн. кристаллы)",
            "svs-points-rfc": "Очки SvS (Очищенные)",
            "svs-points-speedup": "Очки SvS (Ускорения)",
            "total-svs-points": "Всего очков SvS",
            "still-needed": "Дополнительно нужно",

            "gap-need-more": "нужно ещё <span class=\"number\">%d</span>!",
            "gap-have-left": "останется <span class=\"number\">%d</span>!",
            "gap-time-need-more": "нужно ещё <span class=\"number\">%dd %dh %dm</span>!",
            "gap-time-have-left": "останется <span class=\"number\">%dd %dh %dm</span>!",

            "support-header": "Поддержать проект",
            "support-message": "Надеюсь, эти калькуляторы были полезны! Если хотите поддержать проект, мой WOS ID: 146631801. Спасибо!"
        }
    };

    // Dev-time guard: surface any replacement-character junk in translations
    function validateTranslations() {
        const badKeys = [];
        const walk = (obj, path = []) => {
            Object.entries(obj || {}).forEach(([key, value]) => {
                if (value && typeof value === 'object') {
                    walk(value, path.concat(key));
                } else if (typeof value === 'string' && value.includes('\uFFFD')) {
                    badKeys.push(path.concat(key).join('.'));
                }
            });
        };
        walk(translations);
        if (badKeys.length) {
            console.warn('[I18n] Found invalid characters in translations (contains �):', badKeys);
        }
    }

    function getCurrentLanguage() {
        try {
            const stored = localStorage.getItem(LANGUAGE_KEY);
            if (stored && translations[stored]) return stored;
        } catch (e) {
            // ignore storage errors
        }
        const docLang = (document && document.documentElement && document.documentElement.lang)
            ? document.documentElement.lang.trim().toLowerCase()
            : '';
        if (docLang && translations[docLang]) return docLang;
        return 'en';
    }

    function saveLanguage(lang) {
        try {
            localStorage.setItem(LANGUAGE_KEY, lang);
        } catch (e) {
            console.warn('[I18n] Could not save language preference');
        }
    }

    function applyTranslations(lang) {
        if (!translations[lang]) {
            console.warn(`Language ${lang} not found, falling back to English`);
            lang = 'en';
        }

        debug('applyTranslations start', { lang });

        const elements = document.querySelectorAll('[data-i18n]');
        let translatedCount = 0;
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const value = translations[lang][key];
            if (!value) {
                debug('missing translation key', { lang, key });
                return;
            }

            if (el.tagName === 'TITLE') {
                el.textContent = value;
            } else if (el.hasAttribute('title')) {
                el.setAttribute('title', value);
            }

            if (el.tagName !== 'INPUT' && el.tagName !== 'SELECT') {
                el.textContent = value;
            }
            translatedCount++;
        });

        const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
        placeholderElements.forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const value = translations[lang][key];
            if (value) el.setAttribute('placeholder', value);
        });

        debug('applyTranslations complete', { lang, translatedCount });
    }

    function t(key, lang) {
        lang = lang || getCurrentLanguage();
        if (translations[lang] && translations[lang][key]) return translations[lang][key];
        if (translations.en && translations.en[key]) return translations.en[key];
        return key;
    }

    function init() {
        console.debug('[I18n] init start');
        validateTranslations();

        const selector = document.getElementById('language-selector');
        if (!selector) {
            console.error('[I18n] init aborted: language selector not found');
            return;
        }

        const currentLang = getCurrentLanguage();
        selector.value = currentLang;
        if (!selector.value || selector.selectedIndex === -1) {
            selector.value = 'en';
            saveLanguage('en');
        }
        console.debug('[I18n] init: applying language', currentLang);

        applyTranslations(currentLang);

        selector.addEventListener('change', (e) => {
            const newLang = e.target.value;
            console.debug('[I18n] language changed', { newLang });
            saveLanguage(newLang);
            applyTranslations(newLang);

            if (typeof ChiefGearCalculator !== 'undefined') {
                ChiefGearCalculator.calculateAll();
            }
            if (typeof CalculatorModule !== 'undefined') {
                CalculatorModule.calculateAll();
            }
            if (typeof FireCrystalsCalculator !== 'undefined') {
                FireCrystalsCalculator.calculateAll();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.I18n = {
        t,
        getCurrentLanguage,
        applyTranslations,
        translations
    };

})();
