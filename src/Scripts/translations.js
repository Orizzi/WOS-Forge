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
            "coming-outro": "Stay tuned - this page will light up with the new calculators as soon as they're ready.",
            "fire-buildings": "Buildings",
            "pets-coming-title": "Creature Companion Calculators Arriving Soon ??",
            "pets-body-1": "We're taming the data for Pets to let you:",
            "pets-body-2": "<strong>Roadmap:</strong> After War Academy & Fire Crystal power refinements. Your feedback can reprioritize features.",
            "pets-bullet-1": "Project upgrade materials & feeding costs",
            "pets-bullet-2": "Track power impact of fully evolved companions",
            "pets-bullet-3": "Simulate optimal XP vs. resource usage routes",
            "pets-bullet-4": "Integrate pet boosts into global profile plans",
            "pets-roadmap-label": "Roadmap:",
            "pets-roadmap-body": "After War Academy & Fire Crystal power refinements. Your feedback can reprioritize features.",
            "pets-teaser-label": "Teaser:",
            "pets-teaser-body": "A synergy matrix will soon cross-reference pet buffs with gear & charm stats.",
            "zinman-level-label": "Zinman skill level",
            "zinman-level-note": "Applies only to construction resource costs.",
            "zinman-level-0": "Level 0 (no bonus)",
            "zinman-level-1": "Level 1 (3% reduction)",
            "zinman-level-2": "Level 2 (6% reduction)",
            "zinman-level-3": "Level 3 (9% reduction)",
            "zinman-level-4": "Level 4 (12% reduction)",
            "zinman-level-5": "Level 5 (15% reduction)",

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
            "support-message": "I hope these calculators were helpful! If you'd like to support the project, my WOS ID is: 146631801. Thanks and happy surviving!",

            // War Academy specific
            "war-academy-title": "War Academy – Helios Research",
            "your-inventory": "Your Inventory",
            "speedups-days": "Speedups (days)",
            "research-reduction": "Research % reduction",
            "marksman": "Marksman",
            "infantry": "Infantry",
            "lancer": "Lancer",
            "stat-recap": "Stat recap",
            "select-node-prompt": "Select a node to view totals.",
            "slot-recap": "Slot recap",
            "icon": "Icon",
            "name": "Name",
            "steel": "Steel",
            "need-x-more": "Need %s more",
            "have-x-extra": "Have %s extra",
            "no-selections": "No active selections. Pick nodes in the tree to begin.",
            "range": "Range",
            "time": "Time",
            "power": "Power",
            "data-ok": "Data OK",
            "data-failed": "Data failed to load",
            "data-not-loaded": "Data not loaded"
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
            "zinman-level-label": "Nivel de habilidad de Zinman",
            "zinman-level-note": "Se aplica solo a los costos de construcción (recursos).",
            "zinman-level-0": "Nivel 0 (sin bonificación)",
            "zinman-level-1": "Nivel 1 (3% reducción)",
            "zinman-level-2": "Nivel 2 (6% reducción)",
            "zinman-level-3": "Nivel 3 (9% reducción)",
            "zinman-level-4": "Nivel 4 (12% reducción)",
            "zinman-level-5": "Nivel 5 (15% reducción)",

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
            "support-message": "Espero que estas calculadoras hayan sido útiles. Si deseas apoyar el proyecto, mi ID de WOS es: 146631801. ¡Gracias!",

            // War Academy specific
            "war-academy-title": "Academia de Guerra – Investigación Helios",
            "your-inventory": "Tu Inventario",
            "speedups-days": "Aceleradores (días)",
            "research-reduction": "Reducción de Investigación %",
            "marksman": "Tirador",
            "infantry": "Infantería",
            "lancer": "Lancero",
            "stat-recap": "Resumen de Stats",
            "select-node-prompt": "Selecciona un nodo para ver totales.",
            "slot-recap": "Resumen de Slots",
            "icon": "Icono",
            "name": "Nombre",
            "steel": "Acero",
            "need-x-more": "Necesitas %s más",
            "have-x-extra": "Tendrás %s extra",
            "no-selections": "Sin selecciones activas. Elige nodos en el árbol para comenzar.",
            "range": "Rango",
            "time": "Tiempo",
            "power": "Poder",
            "data-ok": "Datos OK",
            "data-failed": "Error al cargar datos",
            "data-not-loaded": "Datos no cargados"
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
            "zinman-level-label": "Zinman 스킬 레벨",
            "zinman-level-note": "건설 자원 비용에만 적용됩니다.",
            "zinman-level-0": "레벨 0 (보너스 없음)",
            "zinman-level-1": "레벨 1 (3% 감소)",
            "zinman-level-2": "레벨 2 (6% 감소)",
            "zinman-level-3": "레벨 3 (9% 감소)",
            "zinman-level-4": "레벨 4 (12% 감소)",
            "zinman-level-5": "레벨 5 (15% 감소)",

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
            "support-message": "이 계산기가 도움이 되셨기를 바랍니다! 프로젝트를 지원하고 싶다면 제 WOS ID는 146631801입니다. 감사합니다!",

            // War Academy specific
            "war-academy-title": "전쟁 아카데미 – 헬리오스 연구",
            "your-inventory": "보유 현황",
            "speedups-days": "가속 (일)",
            "research-reduction": "연구 감소 %",
            "marksman": "사수",
            "infantry": "보병",
            "lancer": "창병",
            "stat-recap": "스탯 요약",
            "select-node-prompt": "총계를 보려면 노드를 선택하세요.",
            "slot-recap": "슬롯 요약",
            "icon": "아이콘",
            "name": "이름",
            "steel": "강철",
            "need-x-more": "%s 더 필요",
            "have-x-extra": "%s 남음",
            "no-selections": "활성 선택이 없습니다. 트리에서 노드를 선택하세요.",
            "range": "범위",
            "time": "시간",
            "power": "전투력",
            "data-ok": "데이터 정상",
            "data-failed": "데이터 로드 실패",
            "data-not-loaded": "데이터가 로드되지 않음"
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
            "zinman-level-label": "Уровень навыка Зинмана",
            "zinman-level-note": "Применяется только к расходам ресурсов на строительство.",
            "zinman-level-0": "Уровень 0 (без бонуса)",
            "zinman-level-1": "Уровень 1 (‑3% стоимости)",
            "zinman-level-2": "Уровень 2 (‑6% стоимости)",
            "zinman-level-3": "Уровень 3 (‑9% стоимости)",
            "zinman-level-4": "Уровень 4 (‑12% стоимости)",
            "zinman-level-5": "Уровень 5 (‑15% стоимости)",

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
            "support-message": "Надеюсь, эти калькуляторы были полезны! Если хотите поддержать проект, мой WOS ID: 146631801. Спасибо!",

            // War Academy specific
            "war-academy-title": "Военная академия – Исследования Гелиос",
            "your-inventory": "Ваш инвентарь",
            "speedups-days": "Ускорения (дни)",
            "research-reduction": "Снижение времени исследований %",
            "marksman": "Стрелок",
            "infantry": "Пехота",
            "lancer": "Копейщик",
            "stat-recap": "Итоги характеристик",
            "select-node-prompt": "Выберите узел для просмотра итогов.",
            "slot-recap": "Итоги слотов",
            "icon": "Иконка",
            "name": "Название",
            "steel": "Сталь",
            "need-x-more": "Нужно ещё %s",
            "have-x-extra": "Останется %s",
            "no-selections": "Нет активных выборов. Выберите узлы в дереве для начала.",
            "range": "Диапазон",
            "time": "Время",
            "power": "Мощь",
            "data-ok": "Данные ОК",
            "data-failed": "Ошибка загрузки данных",
            "data-not-loaded": "Данные не загружены"
        },

        /* ===========================
           FRENCH
        ============================ */
        fr: {
            title: "Calculateur d'équipement de chef - Whiteout Survival",

            "nav-home": "Accueil",
            "nav-charms": "Charmes",
            "nav-chief-gear": "Équipement de Chef",
            "nav-hero-gear": "Équipement de Héros",
            "nav-fire-crystals": "Cristaux de Feu",
            "nav-war-academy": "Académie de Guerre",
            "nav-pets": "Animaux",
            "nav-experts": "Experts",

            "home-hero-title": "Bienvenue sur le calculateur WOS",
            "home-hero-body-1": "Ce calculateur vous aide à optimiser votre progression dans Whiteout Survival (WOS). Que vous amélioriez vos charmes, votre équipement de chef ou gériez vos cristaux de feu, ces outils sont là pour vous aider.",
            "home-hero-body-2": "Utilisez la navigation ci-dessus pour explorer les différentes sections du calculateur adaptées aux divers aspects du jeu. Bon jeu !",

            "coming-title": "Nouveaux calculateurs bientôt disponibles",
            "coming-lede": "Nous développons de nouveaux outils pour les recherches de l'Académie de Guerre et la progression des animaux. Ils s'intégreront directement à vos profils existants pour planifier plus intelligemment, plus rapidement et avec plus de confiance.",
            "coming-highlights-label": "À venir :",
            "coming-highlight-research": "Feuilles de route de recherche avec projections de ressources, de temps et de puissance",
            "coming-highlight-pets": "Planificateurs d'amélioration des animaux avec suivi de l'alimentation, de l'évolution et des synergies",
            "coming-highlight-experts": "Planificateur d'amélioration des experts pour cartographier les bonus et les besoins en ressources",
            "coming-highlight-combined": "Vue de profil combinée mélangeant charmes, équipement de chef, cristaux de feu, animaux et bonus de l'académie",
            "coming-outro": "Restez à l'écoute - cette page s'illuminera avec les nouveaux calculateurs dès qu'ils seront prêts.",
            "fire-buildings": "Bâtiments",
            "pets-coming-title": "Calculateurs de compagnons à venir bientôt 🐾",
            "pets-body-1": "Nous préparons les données pour les animaux afin de vous permettre de :",
            "pets-body-2": "<strong>Feuille de route :</strong> Après les améliorations de l'Académie de Guerre et des Cristaux de Feu. Vos retours peuvent reprioriser les fonctionnalités.",
            "pets-bullet-1": "Projeter les matériaux d'amélioration et les coûts d'alimentation",
            "pets-bullet-2": "Suivre l'impact sur la puissance des compagnons complètement évolués",
            "pets-bullet-3": "Simuler les routes optimales XP vs utilisation des ressources",
            "pets-bullet-4": "Intégrer les bonus des animaux dans les plans de profil globaux",
            "pets-roadmap-label": "Feuille de route :",
            "pets-roadmap-body": "Après les améliorations de l'Académie de Guerre et des Cristaux de Feu. Vos retours peuvent reprioriser les fonctionnalités.",
            "pets-teaser-label": "Aperçu :",
            "pets-teaser-body": "Une matrice de synergie fera bientôt des références croisées entre les bonus des animaux et les stats d'équipement et de charmes.",
            "zinman-level-label": "Niveau de compétence de Zinman",
            "zinman-level-note": "S'applique uniquement aux coûts de ressources de construction.",
            "zinman-level-0": "Niveau 0 (pas de bonus)",
            "zinman-level-1": "Niveau 1 (réduction de 3%)",
            "zinman-level-2": "Niveau 2 (réduction de 6%)",
            "zinman-level-3": "Niveau 3 (réduction de 9%)",
            "zinman-level-4": "Niveau 4 (réduction de 12%)",
            "zinman-level-5": "Niveau 5 (réduction de 15%)",

            "storage-consent-title": "Autoriser l'enregistrement des profils sur cet appareil ?",
            "storage-consent-body": "<p>Nous stockons vos plans dans votre navigateur afin que vous puissiez y accéder après actualisation.</p><p>Ces données restent sur cet appareil (localStorage) ; rien n'est envoyé à un serveur.</p><p>Vous pouvez changer ou supprimer les profils à tout moment.</p>",
            "storage-consent-allow": "Autoriser",
            "storage-consent-deny": "Non merci",
            "delete-profile-title": "Supprimer le profil",
            "delete-profile-confirm": "Supprimer",
            "delete-profile-cancel": "Annuler",
            "delete-profile-message": "<p>Êtes-vous sûr de vouloir supprimer le profil %s ?<br>Cette action ne peut pas être annulée.</p>",

            "charms-header": "Calculateur de charmes",
            "charms-inventory": "Inventaire de charmes",
            "profile-name-placeholder": "Nom du nouveau profil",

            results: "Résultats",
            total: "Total",
            "total-power": "Puissance totale",
            "total-svs-points": "Points SvS totaux",
            totals: "Totaux",
            slot: "Emplacement",
            "need-more": "besoin de",
            more: "de plus",
            "will-have": "restera",
            left: "en réserve !",
            guides: "Guides",
            designs: "Conceptions",
            secrets: "Secrets",
            "reset-all": "Tout réinitialiser",
            "profiles-header": "Profils",
            delete: "Supprimer",
            batch: "LOT",
            from: "DE :",
            to: "À :",
            charm: "Charme",
            "charm-1": "Charme 1 :",
            "charm-2": "Charme 2 :",
            "charm-3": "Charme 3 :",
            "hat-charms": "Charmes de chapeau",
            "chestplate-charms": "Charmes de plastron",
            "ring-charms": "Charmes d'anneau",
            "watch-charms": "Charmes de montre",
            "pants-charms": "Charmes de pantalon",
            "staff-charms": "Charmes de bâton",

            header: "Calculateur d'équipement de chef",
            "inventory-header": "Votre inventaire",
            "select-all-header": "Définir tous les niveaux d'équipement",
            "totals-header": "Articles dont vous avez besoin",
            "building-breakdown": "Détail par bâtiment",

            building: "Bâtiment",

            "hardened-alloy": "Alliage renforcé",
            "polishing-solution": "Solution de polissage",
            "design-plans": "Plans de conception",
            "lunar-amber": "Ambre lunaire",
            "fire-crystals": "Cristaux de feu",
            "refine-crystals": "Cristaux raffinés",
            "meat": "Viande",
            "wood": "Bois",
            "coal": "Charbon",
            "iron": "Fer",
            "construction-speed": "Vitesse de construction (%)",
            "speedup-days": "Jours d'accélération",
            "total-time": "Temps total",
            "total-reduced-time": "Temps total réduit",

            Helmet: "Casque",
            Chestplate: "Plastron",
            Ring: "Anneau",
            Watch: "Montre",
            Pants: "Pantalon",
            Staff: "Bâton",

            Furnace: "Fournaise",
            Embassy: "Ambassade",
            "Command Center": "Centre de commandement",
            Infirmary: "Infirmerie",
            "Infantry Camp": "Camp d'infanterie",
            "Marksman Camp": "Camp de tireurs",
            "Lancer Camp": "Camp de lanciers",
            "War Academy": "Académie de guerre",

            "gear-current": "Actuel",
            "gear-desired": "Désiré",
            "gear-type": "Équipement",
            "building-current": "Actuel",
            "building-desired": "Désiré",
            "level.start": "Début",
            "level.finish": "Fin",

            "svs-points": "Points SvS",
            "svs-points-fc": "Points SvS (Cristaux de feu)",
            "svs-points-rfc": "Points SvS (Cristaux raffinés)",
            "svs-points-speedup": "Points SvS (Accélérations)",
            "total-svs-points": "Total des points SvS",
            "still-needed": "Encore nécessaire",

            "gap-need-more": "besoin de <span class=\"number\">%d</span> de plus !",
            "gap-have-left": "il restera <span class=\"number\">%d</span> !",
            "gap-time-need-more": "Besoin de <span class=\"number\">%dd %dh %dm</span> de plus !",
            "gap-time-have-left": "Il restera <span class=\"number\">%dd %dh %dm</span> !",

            "support-header": "Soutenir ce projet",
            "support-message": "J'espère que ces calculateurs vous ont été utiles ! Si vous souhaitez soutenir le projet, mon ID WOS est : 146631801. Merci et bonne survie !",

            "war-academy-title": "Académie de Guerre – Recherche Hélios",
            "your-inventory": "Votre inventaire",
            "speedups-days": "Accélérations (jours)",
            "research-reduction": "Réduction recherche %",
            "marksman": "Tireur",
            "infantry": "Infanterie",
            "lancer": "Lancier",
            "stat-recap": "Récapitulatif des stats",
            "select-node-prompt": "Sélectionnez un nœud pour voir les totaux.",
            "slot-recap": "Récapitulatif des emplacements",
            "icon": "Icône",
            "name": "Nom",
            "steel": "Acier",
            "need-x-more": "Besoin de %s de plus",
            "have-x-extra": "Vous aurez %s en plus",
            "no-selections": "Aucune sélection active. Choisissez des nœuds dans l'arbre pour commencer.",
            "range": "Plage",
            "time": "Temps",
            "power": "Puissance",
            "exact-match": "Correspondance exacte",
            "days": "jours",
            "hours": "heures",
            "minutes": "minutes",
            "data-ok": "Données OK",
            "data-failed": "Échec du chargement des données",
            "data-not-loaded": "Données non chargées"
        },

        /* ===========================
           GERMAN
        ============================ */
        de: {
            title: "Häuptlingsausrüstung-Rechner - Whiteout Survival",

            "nav-home": "Startseite",
            "nav-charms": "Amulette",
            "nav-chief-gear": "Häuptlingsausrüstung",
            "nav-hero-gear": "Heldenausrüstung",
            "nav-fire-crystals": "Feuerkristalle",
            "nav-war-academy": "Kriegsakademie",
            "nav-pets": "Haustiere",
            "nav-experts": "Experten",

            "home-hero-title": "Willkommen beim WOS-Rechner",
            "home-hero-body-1": "Dieser Rechner hilft Ihnen, Ihr Spielerlebnis in Whiteout Survival (WOS) zu optimieren. Ob Sie Ihre Amulette verbessern, Ihre Häuptlingsausrüstung aufwerten oder Ihre Feuerkristalle verwalten – diese Tools unterstützen Sie dabei.",
            "home-hero-body-2": "Nutzen Sie die obigen Navigationslinks, um verschiedene Bereiche des Rechners zu erkunden, die auf verschiedene Spielaspekte zugeschnitten sind. Viel Spaß beim Spielen!",

            "coming-title": "Neue Rechner kommen bald",
            "coming-lede": "Wir entwickeln brandneue Tools für Kriegsakademie-Forschung und Haustier-Fortschritt. Diese werden direkt in Ihre bestehenden Profile integriert, sodass Sie smarter, schneller und mit mehr Vertrauen planen können.",
            "coming-highlights-label": "Highlights auf dem Weg:",
            "coming-highlight-research": "Forschungs-Roadmaps mit Ressourcen-, Zeit- und Machtprognosen",
            "coming-highlight-pets": "Haustier-Upgrade-Planer mit Fütterungs-, Evolutions- und Synergie-Tracking",
            "coming-highlight-experts": "Experten-Upgrade-Planer zur Kartierung von Boni und Ressourcenanforderungen",
            "coming-highlight-combined": "Kombinierte Profilansicht, die Amulette, Häuptlingsausrüstung, Feuerkristalle, Haustiere und Akademie-Boni vereint",
            "coming-outro": "Bleiben Sie dran – diese Seite wird mit den neuen Rechnern aufleuchten, sobald sie fertig sind.",
            "fire-buildings": "Gebäude",
            "pets-coming-title": "Begleiter-Rechner kommen bald 🐾",
            "pets-body-1": "Wir bändigen die Daten für Haustiere, damit Sie:",
            "pets-body-2": "<strong>Roadmap:</strong> Nach Kriegsakademie & Feuerkristall-Machtverfeinerungen. Ihr Feedback kann Funktionen neu priorisieren.",
            "pets-bullet-1": "Upgrade-Materialien & Fütterungskosten projizieren",
            "pets-bullet-2": "Machteinfluss vollständig entwickelter Begleiter verfolgen",
            "pets-bullet-3": "Optimale XP- vs. Ressourcennutzungsrouten simulieren",
            "pets-bullet-4": "Haustier-Boni in globale Profilpläne integrieren",
            "pets-roadmap-label": "Roadmap:",
            "pets-roadmap-body": "Nach Kriegsakademie & Feuerkristall-Machtverfeinerungen. Ihr Feedback kann Funktionen neu priorisieren.",
            "pets-teaser-label": "Teaser:",
            "pets-teaser-body": "Eine Synergie-Matrix wird bald Haustier-Buffs mit Ausrüstungs- & Amulett-Werten kreuzen.",
            "zinman-level-label": "Zinman-Fähigkeitsstufe",
            "zinman-level-note": "Gilt nur für Bauressourcenkosten.",
            "zinman-level-0": "Stufe 0 (kein Bonus)",
            "zinman-level-1": "Stufe 1 (3% Reduzierung)",
            "zinman-level-2": "Stufe 2 (6% Reduzierung)",
            "zinman-level-3": "Stufe 3 (9% Reduzierung)",
            "zinman-level-4": "Stufe 4 (12% Reduzierung)",
            "zinman-level-5": "Stufe 5 (15% Reduzierung)",

            "storage-consent-title": "Profile auf diesem Gerät speichern zulassen?",
            "storage-consent-body": "<p>Wir speichern Ihre Pläne in Ihrem Browser, damit Sie nach dem Aktualisieren darauf zugreifen können.</p><p>Diese Daten bleiben auf diesem Gerät (localStorage); nichts wird an einen Server gesendet.</p><p>Sie können Profile jederzeit wechseln oder löschen.</p>",
            "storage-consent-allow": "Zulassen",
            "storage-consent-deny": "Nein danke",
            "delete-profile-title": "Profil löschen",
            "delete-profile-confirm": "Löschen",
            "delete-profile-cancel": "Abbrechen",
            "delete-profile-message": "<p>Sind Sie sicher, dass Sie das Profil %s löschen möchten?<br>Diese Aktion kann nicht rückgängig gemacht werden.</p>",

            "charms-header": "Amulett-Rechner",
            "charms-inventory": "Amulett-Inventar",
            "profile-name-placeholder": "Neuer Profilname",

            results: "Ergebnisse",
            total: "Gesamt",
            "total-power": "Gesamtmacht",
            "total-svs-points": "Gesamt-SvS-Punkte",
            totals: "Summen",
            slot: "Slot",
            "need-more": "benötigt",
            more: "mehr",
            "will-have": "wird haben",
            left: "übrig!",
            guides: "Leitfäden",
            designs: "Entwürfe",
            secrets: "Geheimnisse",
            "reset-all": "Alles zurücksetzen",
            "profiles-header": "Profile",
            delete: "Löschen",
            batch: "STAPEL",
            from: "VON:",
            to: "BIS:",
            charm: "Amulett",
            "charm-1": "Amulett 1:",
            "charm-2": "Amulett 2:",
            "charm-3": "Amulett 3:",
            "hat-charms": "Helm-Amulette",
            "chestplate-charms": "Brustpanzer-Amulette",
            "ring-charms": "Ring-Amulette",
            "watch-charms": "Uhr-Amulette",
            "pants-charms": "Hosen-Amulette",
            "staff-charms": "Stab-Amulette",

            header: "Häuptlingsausrüstung-Rechner",
            "inventory-header": "Ihr Inventar",
            "select-all-header": "Alle Ausrüstungsstufen festlegen",
            "totals-header": "Benötigte Artikel",
            "building-breakdown": "Aufschlüsselung nach Gebäuden",

            building: "Gebäude",

            "hardened-alloy": "Gehärtete Legierung",
            "polishing-solution": "Polierlösung",
            "design-plans": "Baupläne",
            "lunar-amber": "Mondsteinbernstein",
            "fire-crystals": "Feuerkristalle",
            "refine-crystals": "Raffinierte Kristalle",
            "meat": "Fleisch",
            "wood": "Holz",
            "coal": "Kohle",
            "iron": "Eisen",
            "construction-speed": "Baugeschwindigkeit (%)",
            "speedup-days": "Beschleunigungstage",
            "total-time": "Gesamtzeit",
            "total-reduced-time": "Gesamt reduzierte Zeit",

            Helmet: "Helm",
            Chestplate: "Brustpanzer",
            Ring: "Ring",
            Watch: "Uhr",
            Pants: "Hose",
            Staff: "Stab",

            Furnace: "Schmelzofen",
            Embassy: "Botschaft",
            "Command Center": "Kommandozentrale",
            Infirmary: "Krankenstation",
            "Infantry Camp": "Infanterielager",
            "Marksman Camp": "Schützenlager",
            "Lancer Camp": "Lanzenlager",
            "War Academy": "Kriegsakademie",

            "gear-current": "Aktuell",
            "gear-desired": "Gewünscht",
            "gear-type": "Ausrüstung",
            "building-current": "Aktuell",
            "building-desired": "Gewünscht",
            "level.start": "Start",
            "level.finish": "Ende",

            "svs-points": "SvS-Punkte",
            "svs-points-fc": "SvS-Punkte (Feuerkristalle)",
            "svs-points-rfc": "SvS-Punkte (Raffiniert)",
            "svs-points-speedup": "SvS-Punkte (Beschleunigung)",
            "total-svs-points": "Gesamt-SvS-Punkte",
            "still-needed": "Noch benötigt",

            "gap-need-more": "benötigt <span class=\"number\">%d</span> mehr!",
            "gap-have-left": "wird <span class=\"number\">%d</span> übrig haben!",
            "gap-time-need-more": "Benötigt <span class=\"number\">%dd %dh %dm</span> mehr!",
            "gap-time-have-left": "Wird <span class=\"number\">%dd %dh %dm</span> übrig haben!",

            "support-header": "Dieses Projekt unterstützen",
            "support-message": "Ich hoffe, diese Rechner waren hilfreich! Wenn Sie das Projekt unterstützen möchten, meine WOS-ID ist: 146631801. Danke und fröhliches Überleben!",

            "war-academy-title": "Kriegsakademie – Helios-Forschung",
            "your-inventory": "Dein Inventar",
            "speedups-days": "Beschleunigungen (Tage)",
            "research-reduction": "Forschungsreduzierung %",
            "marksman": "Schütze",
            "infantry": "Infanterie",
            "lancer": "Lanzenträger",
            "stat-recap": "Statistik-Zusammenfassung",
            "select-node-prompt": "Wähle einen Knoten, um Summen anzuzeigen.",
            "slot-recap": "Slot-Zusammenfassung",
            "icon": "Symbol",
            "name": "Name",
            "steel": "Stahl",
            "need-x-more": "Benötigt %s mehr",
            "have-x-extra": "Wird %s extra haben",
            "no-selections": "Keine aktiven Auswahlen. Wähle Knoten im Baum, um zu beginnen.",
            "range": "Bereich",
            "time": "Zeit",
            "power": "Macht",
            "exact-match": "Exakte Übereinstimmung",
            "days": "Tage",
            "hours": "Stunden",
            "minutes": "Minuten",
            "data-ok": "Daten OK",
            "data-failed": "Daten konnten nicht geladen werden",
            "data-not-loaded": "Daten nicht geladen"
        },

        /* ===========================
           PORTUGUESE
        ============================ */
        pt: {
            title: "Calculadora de Equipamento de Chefe - Whiteout Survival",

            "nav-home": "Início",
            "nav-charms": "Amuletos",
            "nav-chief-gear": "Equipamento de Chefe",
            "nav-hero-gear": "Equipamento de Herói",
            "nav-fire-crystals": "Cristais de Fogo",
            "nav-war-academy": "Academia de Guerra",
            "nav-pets": "Animais de Estimação",
            "nav-experts": "Especialistas",

            "home-hero-title": "Bem-vindo à Calculadora WOS",
            "home-hero-body-1": "Esta calculadora foi projetada para ajudá-lo a otimizar sua jogabilidade em Whiteout Survival (WOS). Se você quer melhorar seus amuletos, atualizar seu equipamento de chefe ou gerenciar seus cristais de fogo, essas ferramentas estão aqui para ajudá-lo.",
            "home-hero-body-2": "Use os links de navegação acima para explorar diferentes seções da calculadora adaptadas a vários aspectos do jogo. Bom jogo!",

            "coming-title": "Novas calculadoras em breve",
            "coming-lede": "Estamos criando novas ferramentas para pesquisa da Academia de Guerra e progressão de animais. Elas se integrarão diretamente aos seus perfis existentes para que você possa planejar de forma mais inteligente, rápida e com mais confiança.",
            "coming-highlights-label": "Destaques a caminho:",
            "coming-highlight-research": "Roteiros de pesquisa com projeções de recursos, tempo e poder",
            "coming-highlight-pets": "Planejadores de upgrade de animais com rastreamento de alimentação, evolução e sinergia",
            "coming-highlight-experts": "Planejador de upgrade de especialistas para mapear bônus e necessidades de recursos",
            "coming-highlight-combined": "Visão de perfil combinada que mescla amuletos, equipamento de chefe, cristais de fogo, animais e bônus da academia",
            "coming-outro": "Fique ligado - esta página se iluminará com as novas calculadoras assim que estiverem prontas.",
            "fire-buildings": "Edifícios",
            "pets-coming-title": "Calculadoras de Companheiros Chegando em Breve 🐾",
            "pets-body-1": "Estamos domesticando os dados para animais para permitir que você:",
            "pets-body-2": "<strong>Roteiro:</strong> Após refinamentos de poder da Academia de Guerra e Cristais de Fogo. Seu feedback pode repriorizar recursos.",
            "pets-bullet-1": "Projetar materiais de upgrade e custos de alimentação",
            "pets-bullet-2": "Rastrear impacto de poder de companheiros totalmente evoluídos",
            "pets-bullet-3": "Simular rotas ótimas de XP vs uso de recursos",
            "pets-bullet-4": "Integrar bônus de animais em planos de perfil globais",
            "pets-roadmap-label": "Roteiro:",
            "pets-roadmap-body": "Após refinamentos de poder da Academia de Guerra e Cristais de Fogo. Seu feedback pode repriorizar recursos.",
            "pets-teaser-label": "Prévia:",
            "pets-teaser-body": "Uma matriz de sinergia em breve fará referências cruzadas de buffs de animais com stats de equipamento e amuleto.",
            "zinman-level-label": "Nível de habilidade do Zinman",
            "zinman-level-note": "Aplica-se apenas aos custos de recursos de construção.",
            "zinman-level-0": "Nível 0 (sem bônus)",
            "zinman-level-1": "Nível 1 (redução de 3%)",
            "zinman-level-2": "Nível 2 (redução de 6%)",
            "zinman-level-3": "Nível 3 (redução de 9%)",
            "zinman-level-4": "Nível 4 (redução de 12%)",
            "zinman-level-5": "Nível 5 (redução de 15%)",

            "storage-consent-title": "Permitir salvar perfis neste dispositivo?",
            "storage-consent-body": "<p>Armazenamos seus planos no navegador para que você possa acessá-los após atualizar.</p><p>Esses dados permanecem neste dispositivo (localStorage); nada é enviado para um servidor.</p><p>Você pode alternar ou excluir perfis a qualquer momento.</p>",
            "storage-consent-allow": "Permitir",
            "storage-consent-deny": "Não, obrigado",
            "delete-profile-title": "Excluir perfil",
            "delete-profile-confirm": "Excluir",
            "delete-profile-cancel": "Cancelar",
            "delete-profile-message": "<p>Tem certeza de que deseja excluir o perfil %s?<br>Esta ação não pode ser desfeita.</p>",

            "charms-header": "Calculadora de amuletos",
            "charms-inventory": "Inventário de amuletos",
            "profile-name-placeholder": "Nome do novo perfil",

            results: "Resultados",
            total: "Total",
            "total-power": "Poder total",
            "total-svs-points": "Pontos SvS totais",
            totals: "Totais",
            slot: "Slot",
            "need-more": "precisa",
            more: "mais",
            "will-have": "terá",
            left: "sobrando!",
            guides: "Guias",
            designs: "Designs",
            secrets: "Segredos",
            "reset-all": "Redefinir tudo",
            "profiles-header": "Perfis",
            delete: "Excluir",
            batch: "LOTE",
            from: "DE:",
            to: "PARA:",
            charm: "Amuleto",
            "charm-1": "Amuleto 1:",
            "charm-2": "Amuleto 2:",
            "charm-3": "Amuleto 3:",
            "hat-charms": "Amuletos de capacete",
            "chestplate-charms": "Amuletos de peitoral",
            "ring-charms": "Amuletos de anel",
            "watch-charms": "Amuletos de relógio",
            "pants-charms": "Amuletos de calças",
            "staff-charms": "Amuletos de cajado",

            header: "Calculadora de equipamento de chefe",
            "inventory-header": "Seu inventário",
            "select-all-header": "Definir todos os níveis de equipamento",
            "totals-header": "Itens que você precisa",
            "building-breakdown": "Detalhamento por edifício",

            building: "Edifício",

            "hardened-alloy": "Liga endurecida",
            "polishing-solution": "Solução de polimento",
            "design-plans": "Planos de design",
            "lunar-amber": "Âmbar lunar",
            "fire-crystals": "Cristais de fogo",
            "refine-crystals": "Cristais refinados",
            "meat": "Carne",
            "wood": "Madeira",
            "coal": "Carvão",
            "iron": "Ferro",
            "construction-speed": "Velocidade de construção (%)",
            "speedup-days": "Dias de aceleração",
            "total-time": "Tempo total",
            "total-reduced-time": "Tempo total reduzido",

            Helmet: "Capacete",
            Chestplate: "Peitoral",
            Ring: "Anel",
            Watch: "Relógio",
            Pants: "Calças",
            Staff: "Cajado",

            Furnace: "Fornalha",
            Embassy: "Embaixada",
            "Command Center": "Centro de comando",
            Infirmary: "Enfermaria",
            "Infantry Camp": "Acampamento de infantaria",
            "Marksman Camp": "Acampamento de atiradores",
            "Lancer Camp": "Acampamento de lanceiros",
            "War Academy": "Academia de guerra",

            "gear-current": "Atual",
            "gear-desired": "Desejado",
            "gear-type": "Equipamento",
            "building-current": "Atual",
            "building-desired": "Desejado",
            "level.start": "Início",
            "level.finish": "Fim",

            "svs-points": "Pontos SvS",
            "svs-points-fc": "Pontos SvS (Cristais de fogo)",
            "svs-points-rfc": "Pontos SvS (Refinados)",
            "svs-points-speedup": "Pontos SvS (Aceleração)",
            "total-svs-points": "Total de pontos SvS",
            "still-needed": "Ainda necessário",

            "gap-need-more": "precisa de <span class=\"number\">%d</span> a mais!",
            "gap-have-left": "terá <span class=\"number\">%d</span> sobrando!",
            "gap-time-need-more": "Precisa de <span class=\"number\">%dd %dh %dm</span> a mais!",
            "gap-time-have-left": "Terá <span class=\"number\">%dd %dh %dm</span> sobrando!",

            "support-header": "Apoiar este projeto",
            "support-message": "Espero que essas calculadoras tenham sido úteis! Se você gostaria de apoiar o projeto, meu ID WOS é: 146631801. Obrigado e boa sobrevivência!",

            "war-academy-title": "Academia de Guerra – Pesquisa Helios",
            "your-inventory": "Seu inventário",
            "speedups-days": "Acelerações (dias)",
            "research-reduction": "Redução de pesquisa %",
            "marksman": "Atirador",
            "infantry": "Infantaria",
            "lancer": "Lanceiro",
            "stat-recap": "Resumo de estatísticas",
            "select-node-prompt": "Selecione um nó para ver os totais.",
            "slot-recap": "Resumo de slots",
            "icon": "Ícone",
            "name": "Nome",
            "steel": "Aço",
            "need-x-more": "Precisa de %s a mais",
            "have-x-extra": "Terá %s extra",
            "no-selections": "Nenhuma seleção ativa. Escolha nós na árvore para começar.",
            "range": "Intervalo",
            "time": "Tempo",
            "power": "Poder",
            "exact-match": "Correspondência exata",
            "days": "dias",
            "hours": "horas",
            "minutes": "minutos",
            "data-ok": "Dados OK",
            "data-failed": "Falha ao carregar dados",
            "data-not-loaded": "Dados não carregados"
        },

        /* ===========================
           ITALIAN
        ============================ */
        it: {
            title: "Calcolatore equipaggiamento Capo - Whiteout Survival",

            "nav-home": "Home",
            "nav-charms": "Amuleti",
            "nav-chief-gear": "Equipaggiamento Capo",
            "nav-hero-gear": "Equipaggiamento Eroe",
            "nav-fire-crystals": "Cristalli di fuoco",
            "nav-war-academy": "Accademia di guerra",
            "nav-pets": "Animali domestici",
            "nav-experts": "Esperti",

            "home-hero-title": "Benvenuto al calcolatore WOS",
            "home-hero-body-1": "Questo calcolatore è progettato per aiutarti a ottimizzare il tuo gameplay in Whiteout Survival (WOS). Che tu voglia migliorare i tuoi amuleti, aggiornare il tuo equipaggiamento da capo o gestire i tuoi cristalli di fuoco, questi strumenti sono qui per assisterti.",
            "home-hero-body-2": "Usa i link di navigazione qui sopra per esplorare diverse sezioni del calcolatore su misura per vari aspetti del gioco. Buon gioco!",

            "coming-title": "Nuovi calcolatori in arrivo presto",
            "coming-lede": "Stiamo creando nuovi strumenti per la ricerca dell'Accademia di Guerra e la progressione degli animali domestici. Si integreranno direttamente nei tuoi profili esistenti così potrai pianificare in modo più intelligente, veloce e con maggiore sicurezza.",
            "coming-highlights-label": "Punti salienti in arrivo:",
            "coming-highlight-research": "Roadmap di ricerca con proiezioni di risorse, tempo e potenza",
            "coming-highlight-pets": "Pianificatori di aggiornamento degli animali con tracciamento alimentazione, evoluzione e sinergie",
            "coming-highlight-experts": "Pianificatore di aggiornamento esperti per mappare potenziamenti e necessità di risorse",
            "coming-highlight-combined": "Vista profilo combinata che mescola amuleti, equipaggiamento capo, cristalli di fuoco, animali e bonus accademia",
            "coming-outro": "Rimani sintonizzato - questa pagina si illuminerà con i nuovi calcolatori non appena saranno pronti.",
            "fire-buildings": "Edifici",
            "pets-coming-title": "Calcolatori Compagni in Arrivo Presto 🐾",
            "pets-body-1": "Stiamo addomesticando i dati per gli animali domestici per permetterti di:",
            "pets-body-2": "<strong>Roadmap:</strong> Dopo i perfezionamenti dell'Accademia di Guerra e Potenza dei Cristalli di Fuoco. Il tuo feedback può dare nuove priorità alle funzionalità.",
            "pets-bullet-1": "Proiettare materiali di aggiornamento e costi di alimentazione",
            "pets-bullet-2": "Tracciare impatto potenza di compagni completamente evoluti",
            "pets-bullet-3": "Simulare percorsi ottimali XP vs utilizzo risorse",
            "pets-bullet-4": "Integrare bonus animali nei piani profilo globali",
            "pets-roadmap-label": "Roadmap:",
            "pets-roadmap-body": "Dopo i perfezionamenti dell'Accademia di Guerra e Potenza dei Cristalli di Fuoco. Il tuo feedback può dare nuove priorità alle funzionalità.",
            "pets-teaser-label": "Anteprima:",
            "pets-teaser-body": "Una matrice di sinergia presto farà riferimenti incrociati tra buff animali e statistiche equipaggiamento e amuleti.",
            "zinman-level-label": "Livello abilità Zinman",
            "zinman-level-note": "Si applica solo ai costi risorse di costruzione.",
            "zinman-level-0": "Livello 0 (nessun bonus)",
            "zinman-level-1": "Livello 1 (riduzione 3%)",
            "zinman-level-2": "Livello 2 (riduzione 6%)",
            "zinman-level-3": "Livello 3 (riduzione 9%)",
            "zinman-level-4": "Livello 4 (riduzione 12%)",
            "zinman-level-5": "Livello 5 (riduzione 15%)",

            "storage-consent-title": "Consentire il salvataggio dei profili su questo dispositivo?",
            "storage-consent-body": "<p>Memorizziamo i tuoi piani nel browser così puoi accedervi dopo l'aggiornamento.</p><p>Questi dati rimangono su questo dispositivo (localStorage); nulla viene inviato a un server.</p><p>Puoi cambiare o eliminare profili in qualsiasi momento.</p>",
            "storage-consent-allow": "Consenti",
            "storage-consent-deny": "No grazie",
            "delete-profile-title": "Elimina profilo",
            "delete-profile-confirm": "Elimina",
            "delete-profile-cancel": "Annulla",
            "delete-profile-message": "<p>Sei sicuro di voler eliminare il profilo %s?<br>Questa azione non può essere annullata.</p>",

            "charms-header": "Calcolatore amuleti",
            "charms-inventory": "Inventario amuleti",
            "profile-name-placeholder": "Nome nuovo profilo",

            results: "Risultati",
            total: "Totale",
            "total-power": "Potenza totale",
            "total-svs-points": "Punti SvS totali",
            totals: "Totali",
            slot: "Slot",
            "need-more": "serve",
            more: "di più",
            "will-have": "avrà",
            left: "in avanzo!",
            guides: "Guide",
            designs: "Design",
            secrets: "Segreti",
            "reset-all": "Reimposta tutto",
            "profiles-header": "Profili",
            delete: "Elimina",
            batch: "LOTTO",
            from: "DA:",
            to: "A:",
            charm: "Amuleto",
            "charm-1": "Amuleto 1:",
            "charm-2": "Amuleto 2:",
            "charm-3": "Amuleto 3:",
            "hat-charms": "Amuleti elmo",
            "chestplate-charms": "Amuleti pettorale",
            "ring-charms": "Amuleti anello",
            "watch-charms": "Amuleti orologio",
            "pants-charms": "Amuleti pantaloni",
            "staff-charms": "Amuleti bastone",

            header: "Calcolatore equipaggiamento capo",
            "inventory-header": "Il tuo inventario",
            "select-all-header": "Imposta tutti i livelli equipaggiamento",
            "totals-header": "Oggetti di cui hai bisogno",
            "building-breakdown": "Ripartizione per edificio",

            building: "Edificio",

            "hardened-alloy": "Lega indurita",
            "polishing-solution": "Soluzione lucidante",
            "design-plans": "Piani di progettazione",
            "lunar-amber": "Ambra lunare",
            "fire-crystals": "Cristalli di fuoco",
            "refine-crystals": "Cristalli raffinati",
            "meat": "Carne",
            "wood": "Legno",
            "coal": "Carbone",
            "iron": "Ferro",
            "construction-speed": "Velocità costruzione (%)",
            "speedup-days": "Giorni accelerazione",
            "total-time": "Tempo totale",
            "total-reduced-time": "Tempo totale ridotto",

            Helmet: "Elmo",
            Chestplate: "Pettorale",
            Ring: "Anello",
            Watch: "Orologio",
            Pants: "Pantaloni",
            Staff: "Bastone",

            Furnace: "Fornace",
            Embassy: "Ambasciata",
            "Command Center": "Centro di comando",
            Infirmary: "Infermeria",
            "Infantry Camp": "Campo fanteria",
            "Marksman Camp": "Campo tiratori",
            "Lancer Camp": "Campo lancieri",
            "War Academy": "Accademia di guerra",

            "gear-current": "Attuale",
            "gear-desired": "Desiderato",
            "gear-type": "Equipaggiamento",
            "building-current": "Attuale",
            "building-desired": "Desiderato",
            "level.start": "Inizio",
            "level.finish": "Fine",

            "svs-points": "Punti SvS",
            "svs-points-fc": "Punti SvS (Cristalli di fuoco)",
            "svs-points-rfc": "Punti SvS (Raffinati)",
            "svs-points-speedup": "Punti SvS (Accelerazione)",
            "total-svs-points": "Totale punti SvS",
            "still-needed": "Ancora necessario",

            "gap-need-more": "serve <span class=\"number\">%d</span> in più!",
            "gap-have-left": "avrà <span class=\"number\">%d</span> in avanzo!",
            "gap-time-need-more": "Serve <span class=\"number\">%dd %dh %dm</span> in più!",
            "gap-time-have-left": "Avrà <span class=\"number\">%dd %dh %dm</span> in avanzo!",

            "support-header": "Sostieni questo progetto",
            "support-message": "Spero che questi calcolatori siano stati utili! Se vuoi sostenere il progetto, il mio ID WOS è: 146631801. Grazie e buona sopravvivenza!",

            "war-academy-title": "Accademia di Guerra – Ricerca Helios",
            "your-inventory": "Il tuo inventario",
            "speedups-days": "Accelerazioni (giorni)",
            "research-reduction": "Riduzione ricerca %",
            "marksman": "Tiratore",
            "infantry": "Fanteria",
            "lancer": "Lanciere",
            "stat-recap": "Riepilogo statistiche",
            "select-node-prompt": "Seleziona un nodo per vedere i totali.",
            "slot-recap": "Riepilogo slot",
            "icon": "Icona",
            "name": "Nome",
            "steel": "Acciaio",
            "need-x-more": "Serve %s in più",
            "have-x-extra": "Avrà %s extra",
            "no-selections": "Nessuna selezione attiva. Scegli nodi nell'albero per iniziare.",
            "range": "Intervallo",
            "time": "Tempo",
            "power": "Potenza",
            "exact-match": "Corrispondenza esatta",
            "days": "giorni",
            "hours": "ore",
            "minutes": "minuti",
            "data-ok": "Dati OK",
            "data-failed": "Caricamento dati fallito",
            "data-not-loaded": "Dati non caricati"
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
            if (stored && translations[stored]) {
                return stored;
            } else if (stored) {
                // Clear invalid stored language
                console.warn('[I18n] Invalid language in storage:', stored, 'Clearing...');
                localStorage.removeItem(LANGUAGE_KEY);
            }
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
        // Only save if it's a valid language
        if (!translations[lang]) {
            console.warn('[I18n] Attempted to save invalid language:', lang);
            return;
        }
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

        // Update the html lang attribute for proper language detection
        if (document.documentElement) {
            document.documentElement.setAttribute('lang', lang);
        }

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

        // Apply saved language immediately, even before selector is found
        const currentLang = getCurrentLanguage();
        applyTranslations(currentLang);

        const selector = document.getElementById('language-selector');
        if (!selector) {
            console.error('[I18n] init aborted: language selector not found');
            return;
        }

        selector.value = currentLang;
        if (!selector.value || selector.selectedIndex === -1) {
            selector.value = 'en';
            saveLanguage('en');
        }
        console.debug('[I18n] init: language set to', currentLang);

        selector.addEventListener('change', (e) => {
            const newLang = e.target.value;
            console.debug('[I18n] language changed', { newLang });
            saveLanguage(newLang);
            applyTranslations(newLang);

            if (window.WOSCalcCore && typeof window.WOSCalcCore.runActive === 'function') {
                window.WOSCalcCore.runActive();
            } else {
                if (typeof ChiefGearCalculator !== 'undefined') {
                    ChiefGearCalculator.calculateAll();
                }
                if (typeof CalculatorModule !== 'undefined') {
                    CalculatorModule.calculateAll();
                }
                if (typeof FireCrystalsCalculator !== 'undefined') {
                    FireCrystalsCalculator.calculateAll();
                }
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
