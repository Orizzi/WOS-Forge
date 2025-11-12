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
            "nav-fire-crystals": "Fire Crystals",
            "nav-war-academy": "War Academy",
            "nav-pets": "Pets",
            
            // Headers
            header: "Chief Gear Calculator",
            "inventory-header": "Your Inventory",
            "select-all-header": "Set All Gear Levels",
            "totals-header": "Items You Need",
            
            // Resources
            "hardened-alloy": "Hardened Alloy",
            "polishing-solution": "Polishing Solution",
            "design-plans": "Design Plans",
            "lunar-amber": "Lunar Amber",
            
            // Gear types
            Helmet: "Helmet",
            Chestplate: "Chestplate",
            Ring: "Ring",
            Watch: "Watch",
            Pants: "Pants",
            Staff: "Staff",
            
            // Form labels
            "gear-current": "Current",
            "gear-desired": "Desired",
            "gear-type": "Gear",
            
            // Results (dynamically translated in calculator)
            "svs-points": "SvS Points",
            "still-needed": "Still Needed"
        },
        
        es: {
            // Page title and navigation
            title: "Calculadora de Equipo de Jefe - Whiteout Survival",
            "nav-charms": "Amuletos",
            "nav-chief-gear": "Equipo de Jefe",
            "nav-fire-crystals": "Cristales de Fuego",
            "nav-war-academy": "Academia de Guerra",
            "nav-pets": "Mascotas",
            
            // Headers
            header: "Calculadora de Equipo de Jefe",
            "inventory-header": "Tu Inventario",
            "select-all-header": "Establecer Todos los Niveles",
            "totals-header": "Artículos que Necesitas",
            
            // Resources
            "hardened-alloy": "Aleación Endurecida",
            "polishing-solution": "Solución Pulidora",
            "design-plans": "Planos de Diseño",
            "lunar-amber": "Ámbar Lunar",
            
            // Gear types
            Helmet: "Casco",
            Chestplate: "Peto",
            Ring: "Anillo",
            Watch: "Reloj",
            Pants: "Pantalones",
            Staff: "Bastón",
            
            // Form labels
            "gear-current": "Actual",
            "gear-desired": "Deseado",
            "gear-type": "Equipo",
            
            // Results
            "svs-points": "Puntos SvS",
            "still-needed": "Aún Necesario"
        },
        
        ko: {
            // Page title and navigation
            title: "화이트아웃 서바이벌 대장 장비 계산기",
            "nav-charms": "부적",
            "nav-chief-gear": "대장 장비",
            "nav-fire-crystals": "불 수정",
            "nav-war-academy": "전쟁 아카데미",
            "nav-pets": "펫",
            
            // Headers
            header: "대장 장비 계산기",
            "inventory-header": "인벤토리",
            "select-all-header": "모든 장비 레벨 설정",
            "totals-header": "필요한 아이템",
            
            // Resources
            "hardened-alloy": "강화 합금",
            "polishing-solution": "광택 용액",
            "design-plans": "설계도",
            "lunar-amber": "달 호박",
            
            // Gear types
            Helmet: "투구",
            Chestplate: "흉갑",
            Ring: "반지",
            Watch: "시계",
            Pants: "바지",
            Staff: "지팡이",
            
            // Form labels
            "gear-current": "현재",
            "gear-desired": "목표",
            "gear-type": "장비",
            
            // Results
            "svs-points": "SvS 포인트",
            "still-needed": "추가 필요"
        },
        
        ru: {
            // Page title and navigation
            title: "Калькулятор Снаряжения Главы - Whiteout Survival",
            "nav-charms": "Талисманы",
            "nav-chief-gear": "Снаряжение Главы",
            "nav-fire-crystals": "Огненные Кристаллы",
            "nav-war-academy": "Военная Академия",
            "nav-pets": "Питомцы",
            
            // Headers
            header: "Калькулятор Снаряжения Главы",
            "inventory-header": "Ваш Инвентарь",
            "select-all-header": "Установить Все Уровни",
            "totals-header": "Необходимые Предметы",
            
            // Resources
            "hardened-alloy": "Закаленный Сплав",
            "polishing-solution": "Полировочный Раствор",
            "design-plans": "Чертежи",
            "lunar-amber": "Лунный Янтарь",
            
            // Gear types
            Helmet: "Шлем",
            Chestplate: "Нагрудник",
            Ring: "Кольцо",
            Watch: "Часы",
            Pants: "Штаны",
            Staff: "Посох",
            
            // Form labels
            "gear-current": "Текущий",
            "gear-desired": "Желаемый",
            "gear-type": "Снаряжение",
            
            // Results
            "svs-points": "Очки SvS",
            "still-needed": "Еще Нужно"
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
