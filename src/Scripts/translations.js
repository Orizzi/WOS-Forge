// Translations Module
// Handles multi-language support for the WOS Calculator

(function() {
    'use strict';

    const LANGUAGE_KEY = 'wos-language';

    // Translation data for all supported languages
    const translations = {
        en: {
            // Page title and navigation
            title: "Whiteout Survival Chief Gear Calculator",
            "nav-home": "Home",
            "nav-charms": "Charms",
            "nav-chief-gear": "Chief Gear",
                "nav-hero-gear": "Hero Gear",
            "nav-fire-crystals": "Fire Crystals",
            "nav-war-academy": "War Academy",
            "nav-pets": "Pets",
            "nav-experts": "Experts",

            // Home (index)
            "home-hero-title": "Welcome to the WOS Calculator",
            "home-hero-body-1": "This calculator is designed to help you optimize your gameplay in Whiteout Survival (WOS). Whether you're looking to enhance your charms, upgrade your chief gear, or manage your fire crystals, our tools are here to assist you.",
            "home-hero-body-2": "Use the navigation links above to explore different sections of the calculator tailored to various aspects of the game. Happy gaming!",

            // Coming soon page
            "coming-title": "New Calculators Are Coming Soon",
            "coming-lede": "We're forging brand new tools for War Academy research and Pets progression. These will plug straight into your existing profiles so you can plan smarter, faster, and with more confidence.",
            "coming-highlights-label": "Highlights on the way:",
            "coming-highlight-research": "Research roadmaps with resource, time, and power projections",
            "coming-highlight-pets": "Pet upgrade planners with feeding, evolution, and synergy tracking",
            "coming-highlight-experts": "Expert upgrade planner to map out boosts and resource needs",
            "coming-highlight-combined": "Combined profile view that blends charms, chief gear, fire crystals, pets, and academy boosts",
            "coming-outro": "Stay tuned—this page will light up with the new calculators as soon as they're ready.",
            
            // Charms page additions
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
            
            // Headers
            header: "Chief Gear Calculator",
            "inventory-header": "Your Inventory",
            "select-all-header": "Set All Gear Levels",
            "totals-header": "Items You Need",
            "building-breakdown": "Building Breakdown",
            
            // Resources
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
                "construction-speed": "Construction speed (%)",
                "speedup-days": "Speedup Days",
                "total-time": "Total Time",
                "total-reduced-time": "Total Reduced Time",
            
            // Gear types
            Helmet: "Helmet",
            Chestplate: "Chestplate",
            Ring: "Ring",
            Watch: "Watch",
            Pants: "Pants",
            Staff: "Staff",
            
                // Buildings
                Furnace: "Furnace",
                Embassy: "Embassy",
                "Command Center": "Command Center",
                Infirmary: "Infirmary",
                "Infantry Camp": "Infantry Camp",
                "Marksman Camp": "Marksman Camp",
                "Lancer Camp": "Lancer Camp",
                "War Academy": "War Academy",
            
            // Form labels
            "gear-current": "Current",
            "gear-desired": "Desired",
            "gear-type": "Gear",
                "building-current": "Current",
                "building-desired": "Desired",
            "level.start": "Start",
            "level.finish": "Finish",
            
            // Results (dynamically translated in calculator)
            "svs-points": "SvS Points",
                "still-needed": "Still Needed",
                "gap-need-more": "need <span class=\"number\">%d</span> more!",
                "gap-have-left": "will have <span class=\"number\">%d</span> left!",
                "gap-time-need-more": "Need <span class=\"number\">%dd %dh %dm</span> more!",
                "gap-time-have-left": "Will have <span class=\"number\">%dd %dh %dm</span> left!",
                "support-header": "Support This Project",
                "support-message": "I hope these calculators were helpful! If you'd like to support the project, my WOS ID is: 146631801. Thanks and happy surviving!"
        },
        
        es: {
            // Page title and navigation
            title: "Calculadora de Equipo de Jefe - Whiteout Survival",
            "nav-home": "Inicio",
            "nav-charms": "Amuletos",
            "nav-chief-gear": "Equipo de Jefe",
                "nav-hero-gear": "Equipo de Héroe",
            "nav-fire-crystals": "Cristales de Fuego",
            "nav-war-academy": "Academia de Guerra",
            "nav-pets": "Mascotas",
            "nav-experts": "Expertos",
            
            // Home (index)
            "home-hero-title": "Bienvenido al Calculador de WOS",
            "home-hero-body-1": "Este calculador te ayuda a optimizar tu progreso en Whiteout Survival (WOS). Ya sea que mejores amuletos, equipo de jefe o gestiones cristales de fuego, las herramientas están aquí para ayudarte.",
            "home-hero-body-2": "Usa la navegación superior para explorar cada sección del calculador según lo que quieras planificar.",

            // Coming soon page
            "coming-title": "Nuevos calculadores llegan pronto",
            "coming-lede": "Estamos forjando nuevas herramientas para la Academia de Guerra y la progresión de Mascotas. Se conectarán con tus perfiles actuales para que planifiques más rápido y con confianza.",
            "coming-highlights-label": "Lo que viene:",
            "coming-highlight-research": "Rutas de investigación con recursos, tiempo y proyecciones de poder",
            "coming-highlight-pets": "Planificadores de mejora de mascotas con alimentación, evolución y sinergias",
            "coming-highlight-experts": "Planificador de expertos para mapear impulsos y recursos necesarios",
            "coming-highlight-combined": "Vista combinada que mezcla amuletos, equipo de jefe, cristales de fuego, mascotas y la Academia",
            "coming-outro": "Muy pronto esta página se encenderá con los nuevos calculadores.",
            
            // Charms page additions
            "charms-header": "Calculadora de Amuletos",
            "charms-inventory": "Inventario de Amuletos",
            "profile-name-placeholder": "Nombre del perfil",
            results: "Resultados",
            total: "Total",
            "total-power": "Poder Total",
            "total-svs-points": "Puntos SvS Totales",
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
            
            // Headers
            header: "Calculadora de Equipo de Jefe",
            "inventory-header": "Tu Inventario",
            "select-all-header": "Establecer Todos los Niveles",
            "totals-header": "Artículos que Necesitas",
            "building-breakdown": "Desglose por edificio",
            
            // Resources
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
                "construction-speed": "Bono de Velocidad de Construcción (%)",
                "speedup-days": "Días de Aceleración",
                "total-time": "Tiempo Total",
                "total-reduced-time": "Tiempo Total Reducido",
            
            // Gear types
            Helmet: "Casco",
            Chestplate: "Peto",
            Ring: "Anillo",
            Watch: "Reloj",
            Pants: "Pantalones",
            Staff: "Bastón",
            
              // Buildings
              Furnace: "Horno",
              Embassy: "Embajada",
              "Command Center": "Centro de Comando",
              Infirmary: "Enfermería",
              "Infantry Camp": "Campamento de Infantería",
              "Marksman Camp": "Campamento de Tiradores",
              "Lancer Camp": "Campamento de Lanceros",
              "War Academy": "Academia de Guerra",
            
            // Form labels
            "gear-current": "Actual",
            "gear-desired": "Deseado",
            "gear-type": "Equipo",
                            "building-current": "Actual",
                            "building-desired": "Deseado",
                        "level.start": "Inicio",
                        "level.finish": "Fin",
            
            // Results
            "svs-points": "Puntos SvS",
              "still-needed": "Aún Necesario",
              "gap-need-more": "necesita <span class=\"number\">%d</span> más!",
              "gap-have-left": "tendrá <span class=\"number\">%d</span> de sobra!",
              "gap-time-need-more": "¡Necesita <span class=\"number\">%dd %dh %dm</span> más!",
              "gap-time-have-left": "¡Tendrá <span class=\"number\">%dd %dh %dm</span> de sobra!",
              "support-header": "Apoya Este Proyecto",
              "support-message": "¡Espero que estas calculadoras hayan sido útiles! Si quieres apoyar el proyecto, mi ID de WOS es: 146631801. ¡Gracias y feliz supervivencia!"
        },
        
        ko: {
            // Page title and navigation
            title: "화이트아웃 서바이벌 대장 장비 계산기",
            "nav-home": "홈",
            "nav-charms": "부적",
            "nav-chief-gear": "대장 장비",
              "nav-hero-gear": "영웅 장비",
            "nav-fire-crystals": "불 수정",
            "nav-war-academy": "전쟁 아카데미",
            "nav-pets": "펫",
            
            // Charms page additions
            "charms-header": "부적 계산기",
            "charms-inventory": "부적 인벤토리",
            guides: "가이드",
            designs: "도면",
            secrets: "비밀",
            "reset-all": "전체 초기화",
            "profiles-header": "프로필",
            delete: "삭제",
            batch: "일괄",
            from: "부터:",
            to: "까지:",
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
            "profile-name-placeholder": "프로필 이름",
            results: "결과",
            total: "총",
            "total-power": "총 파워",
            "total-svs-points": "총 SvS 포인트",
            totals: "합계",
            slot: "슬롯",
            "need-more": "필요",
            more: "더",
            "will-have": "남음",
            left: "!",
            
            // Headers
            header: "대장 장비 계산기",
            "inventory-header": "인벤토리",
            "select-all-header": "모든 장비 레벨 설정",
            "totals-header": "필요한 아이템",
            "building-breakdown": "건물별 내역",
            
                        // Resources
            "hardened-alloy": "강화 합금",
            "polishing-solution": "광택 용액",
            "design-plans": "설계도",
            "lunar-amber": "달 호박",
              "fire-crystals": "불꽃 수정",
              "refine-crystals": "정제된 불꽃 수정",
              "meat": "고기",
              "wood": "목재",
              "coal": "석탄",
              "iron": "철",
              "construction-speed": "건설 속도 보너스 (%)",
              "speedup-days": "스피드업 일수",
              "total-time": "총 시간",
              "total-reduced-time": "총 감소 시간",
            
            // Gear types
            Helmet: "투구",
            Chestplate: "흉갑",
            Ring: "반지",
            Watch: "시계",
            Pants: "바지",
            Staff: "지팡이",
            
              // Buildings
              Furnace: "용광로",
              Embassy: "대사관",
              "Command Center": "지휘 센터",
              Infirmary: "의무실",
              "Infantry Camp": "보병 캠프",
              "Marksman Camp": "사수 캠프",
              "Lancer Camp": "창병 캠프",
              "War Academy": "전쟁 아카데미",
            
            // Form labels
            "gear-current": "현재",
            "gear-desired": "목표",
            "gear-type": "장비",
                            "building-current": "현재",
                            "building-desired": "원하는",
                        "level.start": "시작",
                        "level.finish": "완료",
            
            // Resources
            "svs-points": "SvS 포인트",
              "still-needed": "추가 필요",
              "gap-need-more": "<span class=\"number\">%d</span> 더 필요합니다!",
              "gap-have-left": "<span class=\"number\">%d</span> 남습니다!",
              "gap-time-need-more": "<span class=\"number\">%dd %dh %dm</span> 더 필요합니다!",
              "gap-time-have-left": "<span class=\"number\">%dd %dh %dm</span> 남습니다!",
                "meat": "Мясо",
                "wood": "Дерево",
                "coal": "Уголь",
                "iron": "Железо",
              "support-header": "이 프로젝트 지원",
              "support-message": "이 계산기가 도움이 되었기를 바랍니다! 프로젝트를 지원하고 싶다면 제 WOS ID는 146631801입니다. 감사하고 행복한 생존을 기원합니다!"
        },
        
        ru: {
            // Page title and navigation
            title: "Калькулятор Снаряжения Главы - Whiteout Survival",
            "nav-home": "Главная",
            "nav-charms": "Талисманы",
            "nav-chief-gear": "Снаряжение Главы",
                "nav-hero-gear": "Снаряжение Героя",
            "nav-fire-crystals": "Огненные Кристаллы",
            "nav-war-academy": "Военная Академия",
            "nav-pets": "Питомцы",
            
            // Charms page additions
            "charms-header": "Калькулятор Талисманов",
            "charms-inventory": "Инвентарь Талисманов",
            guides: "Гайды",
            designs: "Чертежи",
            secrets: "Секреты",
            "reset-all": "Сбросить Всё",
            "profiles-header": "Профили",
            delete: "Удалить",
            batch: "ПАКЕТ",
            from: "С:",
            to: "ПО:",
            charm: "Талисман",
            "charm-1": "Талисман 1:",
            "charm-2": "Талисман 2:",
            "charm-3": "Талисман 3:",
            "hat-charms": "Талисманы для Шлема",
            "chestplate-charms": "Талисманы для Нагрудника",
            "ring-charms": "Талисманы для Кольца",
            "watch-charms": "Талисманы для Часов",
            "pants-charms": "Талисманы для Штанов",
            "staff-charms": "Талисманы для Посоха",
            "profile-name-placeholder": "Имя профиля",
            results: "Результаты",
            total: "Всего",
            "total-power": "Общая Мощь",
            "total-svs-points": "Общие Очки SvS",
            totals: "Итого",
            slot: "Слот",
            "need-more": "нужно",
            more: "больше",
            "will-have": "останется",
            left: "!",
            
            // Headers
            header: "Калькулятор Снаряжения Главы",
            "inventory-header": "Ваш Инвентарь",
            "select-all-header": "Установить Все Уровни",
            "totals-header": "Необходимые Предметы",
            "building-breakdown": "Разбивка по зданиям",
            
            // Resources
            "hardened-alloy": "Закаленный Сплав",
            "polishing-solution": "Полировочный Раствор",
            "design-plans": "Чертежи",
            "lunar-amber": "Лунный Янтарь",
                "fire-crystals": "Огненные Кристаллы",
                "refine-crystals": "Кристаллы Очистки",
                "meat": "Мясо",
                "wood": "Дерево",
                "coal": "Уголь",
                "iron": "Железо",
                "construction-speed": "Бонус Скорости Строительства (%)",
                "speedup-days": "Дни Ускорения",
                "total-time": "Общее Время",
                "total-reduced-time": "Общее Сокращённое Время",
            
            // Gear types
            Helmet: "Шлем",
            Chestplate: "Нагрудник",
            Ring: "Кольцо",
            Watch: "Часы",
            Pants: "Штаны",
            Staff: "Посох",
            
                // Buildings
                Furnace: "Печь",
                Embassy: "Посольство",
                "Command Center": "Центр Командования",
                Infirmary: "Лазарет",
                "Infantry Camp": "Лагерь Пехоты",
                "Marksman Camp": "Лагерь Стрелков",
                "Lancer Camp": "Лагерь Копейщиков",
                "War Academy": "Академия Войны",
            
            // Form labels
            "gear-current": "Текущий",
            "gear-desired": "Желаемый",
            "gear-type": "Снаряжение",
                "building-current": "Текущий",
                "building-desired": "Желаемый",
            "level.start": "Начало",
            "level.finish": "Конец",
            
            // Results
            "svs-points": "Очки SvS",
                "still-needed": "Еще Нужно",
                "gap-need-more": "нужно ещё <span class=\"number\">%d</span>!",
                "gap-have-left": "останется <span class=\"number\">%d</span>!",
                "gap-time-need-more": "Нужно ещё <span class=\"number\">%dd %dh %dm</span>!",
                "gap-time-have-left": "Останется <span class=\"number\">%dd %dh %dm</span>!",
                "support-header": "Поддержать Проект",
                "support-message": "Надеюсь, калькуляторы были полезны! Если хотите поддержать проект, мой ID в WOS: 146631801. Спасибо и удачной игры!"
        }
    };

    // Additional translations for home and coming-soon pages + Experts nav
    const translationExtensions = {
        en: {
            "nav-experts": "Experts",
            "home-hero-title": "Welcome to the WOS Calculator",
            "home-hero-body-1": "This calculator is designed to help you optimize your gameplay in Whiteout Survival (WOS). Whether you're looking to enhance your charms, upgrade your chief gear, or manage your fire crystals, our tools are here to assist you.",
            "home-hero-body-2": "Use the navigation links above to explore different sections of the calculator tailored to various aspects of the game. Happy gaming!",
            "coming-title": "New Calculators Are Coming Soon",
            "coming-lede": "We're forging brand new tools for War Academy research and Pets progression. These will plug straight into your existing profiles so you can plan smarter, faster, and with more confidence.",
            "coming-highlights-label": "Highlights on the way:",
            "coming-highlight-research": "Research roadmaps with resource, time, and power projections",
            "coming-highlight-pets": "Pet upgrade planners with feeding, evolution, and synergy tracking",
            "coming-highlight-experts": "Expert upgrade planner to map out boosts and resource needs",
            "coming-highlight-combined": "Combined profile view that blends charms, chief gear, fire crystals, pets, and academy boosts",
            "coming-outro": "Stay tuned—this page will light up with the new calculators as soon as they're ready."
        },
        es: {
            "nav-experts": "Expertos",
            "home-hero-title": "Bienvenido al Calculador de WOS",
            "home-hero-body-1": "Este calculador te ayuda a optimizar tu progreso en Whiteout Survival (WOS). Ya sea que mejores amuletos, equipo de jefe o gestiones cristales de fuego, las herramientas están aquí para ayudarte.",
            "home-hero-body-2": "Usa la navegación superior para explorar cada sección del calculador según lo que quieras planificar.",
            "coming-title": "Nuevos calculadores llegan pronto",
            "coming-lede": "Estamos forjando nuevas herramientas para la Academia de Guerra y la progresión de Mascotas. Se conectarán con tus perfiles actuales para que planifiques más rápido y con confianza.",
            "coming-highlights-label": "Lo que viene:",
            "coming-highlight-research": "Rutas de investigación con recursos, tiempo y proyecciones de poder",
            "coming-highlight-pets": "Planificadores de mejora de mascotas con alimentación, evolución y sinergias",
            "coming-highlight-experts": "Planificador de expertos para mapear impulsos y recursos necesarios",
            "coming-highlight-combined": "Vista combinada que mezcla amuletos, equipo de jefe, cristales de fuego, mascotas y la Academia",
            "coming-outro": "Muy pronto esta página se encenderá con los nuevos calculadores."
        },
        ko: {
            "nav-experts": "전문가",
            "home-hero-title": "WOS 계산기에 오신 것을 환영합니다",
            "home-hero-body-1": "이 계산기는 화이트아웃 서바이벌(WOS)에서 부적, 치프 장비, 화염 크리스탈을 더 효율적으로 관리하도록 도와줍니다.",
            "home-hero-body-2": "상단 내비게이션을 사용해 원하는 기능을 빠르게 찾아보세요.",
            "coming-title": "새 계산기가 곧 공개됩니다",
            "coming-lede": "전쟁 아카데미와 펫 성장을 위한 새로운 도구를 준비 중입니다. 기존 프로필과 바로 연결되어 더 빠르고 정확하게 계획할 수 있습니다.",
            "coming-highlights-label": "예정 기능:",
            "coming-highlight-research": "자원·시간·전투력 전망을 포함한 연구 로드맵",
            "coming-highlight-pets": "먹이·진화·시너지 추적을 포함한 펫 성장 플래너",
            "coming-highlight-experts": "강화 자원과 부스트를 정리하는 전문가 업그레이드 플래너",
            "coming-highlight-combined": "부적, 치프 장비, 화염 크리스탈, 펫, 아카데미를 아우르는 통합 프로필 뷰",
            "coming-outro": "신규 계산기가 준비되는 대로 이 페이지에서 바로 만나보세요."
        },
        ru: {
            "nav-experts": "Эксперты",
            "home-hero-title": "Добро пожаловать в калькулятор WOS",
            "home-hero-body-1": "Этот калькулятор помогает оптимизировать игру в Whiteout Survival (WOS): улучшайте амулеты, снаряжение вождя и управляйте огненными кристаллами эффективнее.",
            "home-hero-body-2": "Используйте навигацию сверху, чтобы перейти к нужному разделу калькулятора.",
            "coming-title": "Новые калькуляторы скоро",
            "coming-lede": "Мы готовим новые инструменты для исследований в Военной академии и развития Питомцев. Они подключатся к вашим текущим профилям, чтобы планировать быстрее и точнее.",
            "coming-highlights-label": "Скоро появится:",
            "coming-highlight-research": "Дорожные карты исследований с ресурсами, временем и приростом мощи",
            "coming-highlight-pets": "Планировщик прокачки питомцев (корм, эволюция, синергии)",
            "coming-highlight-experts": "Планировщик улучшений экспертов с расчётом бустов и ресурсов",
            "coming-highlight-combined": "Единый профиль: амулеты, снаряжение вождя, огненные кристаллы, питомцы и академия",
            "coming-outro": "Страница обновится, как только новые калькуляторы будут готовы."
        }
    };

    Object.entries(translationExtensions).forEach(([lang, data]) => {
        translations[lang] = translations[lang] || {};
        Object.assign(translations[lang], data);
    });

    // Get current language from localStorage or default to English
    function getCurrentLanguage() {
        try {
            return localStorage.getItem(LANGUAGE_KEY) || 'en';
        } catch(e) {
            return 'en';
        }
    }

    // Save language preference
    function saveLanguage(lang) {
        try {
            localStorage.setItem(LANGUAGE_KEY, lang);
        } catch(e) {
            console.warn('Could not save language preference');
        }
    }

    // Apply translations to all elements with data-i18n attribute
    function applyTranslations(lang) {
        if (!translations[lang]) {
            console.warn(`Language ${lang} not found, falling back to English`);
            lang = 'en';
        }

        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                // Update text content or title based on element type
                if (el.tagName === 'TITLE') {
                    el.textContent = translations[lang][key];
                } else if (el.hasAttribute('title')) {
                    el.setAttribute('title', translations[lang][key]);
                }
                
                // Update text content for regular elements
                if (el.tagName !== 'INPUT' && el.tagName !== 'SELECT') {
                    el.textContent = translations[lang][key];
                }
            }
        });
        
        // Handle placeholder translations
        const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
        placeholderElements.forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[lang][key]) {
                el.setAttribute('placeholder', translations[lang][key]);
            }
        });
    }

    // Get translated text by key
    function t(key, lang) {
        lang = lang || getCurrentLanguage();
        return translations[lang] && translations[lang][key] ? translations[lang][key] : key;
    }

    // Initialize language selector and apply translations
    function init() {
        const selector = document.getElementById('language-selector');
        if (!selector) return;

        // Set current language in selector
        const currentLang = getCurrentLanguage();
        selector.value = currentLang;

        // Apply translations on page load
        applyTranslations(currentLang);

        // Handle language change
        selector.addEventListener('change', (e) => {
            const newLang = e.target.value;
            saveLanguage(newLang);
            applyTranslations(newLang);

            // Trigger recalculation to update results with new language
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

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export public API
    window.I18n = {
        t,
        getCurrentLanguage,
        applyTranslations,
        translations
    };

})();
