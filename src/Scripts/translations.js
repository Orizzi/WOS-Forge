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
            "nav-charms": "Charms",
            "nav-chief-gear": "Chief Gear",
                "nav-hero-gear": "Hero Gear",
            "nav-fire-crystals": "Fire Crystals",
            "nav-war-academy": "War Academy",
            "nav-pets": "Pets",
            
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
                "construction-speed": "Construction Speed Bonus (%)",
                "speedup-days": "Speedup Days",
                "total-time": "Total Time",
            
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
            
            // Results (dynamically translated in calculator)
            "svs-points": "SvS Points",
                "still-needed": "Still Needed",
                "gap-need-more": "need <span class=\"number\">%d</span> more!",
                "gap-have-left": "will have <span class=\"number\">%d</span> left!",
                "gap-time-need-more": "Need <span class=\"number\">%dd %dh %dm</span> more!",
                "gap-time-have-left": "Will have <span class=\"number\">%dd %dh %dm</span> left!",
                "support-header": "Support This Project",
                "support-message": "I hope these calculators were helpful! If you'd like to support the project, my WOS ID is: 273994720. Thanks and happy surviving!"
        },
        
        es: {
            // Page title and navigation
            title: "Calculadora de Equipo de Jefe - Whiteout Survival",
            "nav-charms": "Amuletos",
            "nav-chief-gear": "Equipo de Jefe",
                "nav-hero-gear": "Equipo de Héroe",
            "nav-fire-crystals": "Cristales de Fuego",
            "nav-war-academy": "Academia de Guerra",
            "nav-pets": "Mascotas",
            
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
            
            // Results
            "svs-points": "Puntos SvS",
              "still-needed": "Aún Necesario",
              "gap-need-more": "necesita <span class=\"number\">%d</span> más!",
              "gap-have-left": "tendrá <span class=\"number\">%d</span> de sobra!",
              "gap-time-need-more": "¡Necesita <span class=\"number\">%dd %dh %dm</span> más!",
              "gap-time-have-left": "¡Tendrá <span class=\"number\">%dd %dh %dm</span> de sobra!",
              "support-header": "Apoya Este Proyecto",
              "support-message": "¡Espero que estas calculadoras hayan sido útiles! Si quieres apoyar el proyecto, mi ID de WOS es: 273994720. ¡Gracias y feliz supervivencia!"
        },
        
        ko: {
            // Page title and navigation
            title: "화이트아웃 서바이벌 대장 장비 계산기",
            "nav-charms": "부적",
            "nav-chief-gear": "대장 장비",
              "nav-hero-gear": "영웅 장비",
            "nav-fire-crystals": "불 수정",
            "nav-war-academy": "전쟁 아카데미",
            "nav-pets": "펫",
            
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
              "support-message": "이 계산기가 도움이 되었기를 바랍니다! 프로젝트를 지원하고 싶다면 제 WOS ID는 273994720입니다. 감사하고 행복한 생존을 기원합니다!"
        },
        
        ru: {
            // Page title and navigation
            title: "Калькулятор Снаряжения Главы - Whiteout Survival",
            "nav-charms": "Талисманы",
            "nav-chief-gear": "Снаряжение Главы",
                "nav-hero-gear": "Снаряжение Героя",
            "nav-fire-crystals": "Огненные Кристаллы",
            "nav-war-academy": "Военная Академия",
            "nav-pets": "Питомцы",
            
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
            
            // Results
            "svs-points": "Очки SvS",
                "still-needed": "Еще Нужно",
                "gap-need-more": "нужно ещё <span class=\"number\">%d</span>!",
                "gap-have-left": "останется <span class=\"number\">%d</span>!",
                "gap-time-need-more": "Нужно ещё <span class=\"number\">%dd %dh %dm</span>!",
                "gap-time-have-left": "Останется <span class=\"number\">%dd %dh %dm</span>!",
                "support-header": "Поддержать Проект",
                "support-message": "Надеюсь, калькуляторы были полезны! Если хотите поддержать проект, мой ID в WOS: 273994720. Спасибо и удачной игры!"
        }
    };

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
