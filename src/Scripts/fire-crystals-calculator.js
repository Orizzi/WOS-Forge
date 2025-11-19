(function() {
    'use strict';
    const FC_DEBUG = false;

    // Lazy-load shared modules when available (no HTML changes).
    async function ensureModules() {
        const scripts = [
            'Scripts/modules/helpers/number-format.js',
            'Scripts/modules/helpers/icons.js',
            'Scripts/modules/helpers/csv.js',
            'Scripts/modules/data/data-loader.js',
            'Scripts/modules/calculators/fire-crystals.js',
            'Scripts/modules/ui/fire-crystals-ui.js'
        ];
        const loaders = scripts.map((src) => loadScriptOnce(src));
        await Promise.all(loaders);
    }

    function loadScriptOnce(src) {
        return new Promise((resolve) => {
            if (typeof document === 'undefined') return resolve();
            if (document.querySelector(`script[data-wos="${src}"]`)) {
                resolve();
                return;
            }
            const s = document.createElement('script');
            s.src = src;
            s.dataset.wos = src;
            s.onload = () => resolve();
            s.onerror = () => resolve();
            document.head.appendChild(s);
        });
    }

    // Zinman helpers
    function getZinmanReduction(level){
        const lvl = Math.max(0, Math.min(5, parseInt(level, 10) || 0));
        const map = {0:0,1:0.03,2:0.06,3:0.09,4:0.12,5:0.15};
        return map[lvl] || 0;
    }

    function applyZinmanReductionToResources(totals, level){
        const factor = 1 - getZinmanReduction(level);
        const round = (v) => Math.round((v || 0) * factor);
        return {
            ...totals,
            meat: round(totals.meat),
            wood: round(totals.wood),
            coal: round(totals.coal),
            iron: round(totals.iron)
        };
    }

    function formatNumberLocale(value, options = {}){
        const num = Number(value) || 0;
        const helper = window.WOSHelpers && window.WOSHelpers.number;
        const merged = Object.assign({ maximumFractionDigits: 0 }, options);
        if(helper && typeof helper.formatNumber === 'function'){
            try{
                return helper.formatNumber(num, merged, 'en-US');
            }catch(e){}
        }
        try{
            return num.toLocaleString('en-US', merged);
        }catch(e){
            return String(num);
        }
    }

    function formatCompact(n){
        const helper = window.WOSHelpers && window.WOSHelpers.number;
        if (helper && typeof helper.formatCompact === 'function') {
            return helper.formatCompact(Number(n) || 0);
        }
        if (n === null || n === undefined) return '0';
        const sign = n < 0 ? '-' : '';
        const abs = Math.abs(Number(n)) || 0;
        const trim = (s) => s.replace(/\.0+$/,'').replace(/(\.[0-9]*?)0+$/,'$1');
        if (abs >= 1e9) return sign + trim((abs/1e9).toFixed(3)) + 'B';
        if (abs >= 1e6) return sign + trim((abs/1e6).toFixed(3)) + 'M';
        if (abs >= 1e3) return sign + trim((abs/1e3).toFixed(3)) + 'K';
        return formatNumberLocale(sign === '-' ? -Math.floor(abs) : Math.floor(abs));
    }

    // Fire Crystal Costs Data
    const fireCrystalCosts = {
        "Furnace": {
            "F30": { "time": 604800, "1": 132, "2": 132, "3": 132, "4": 132, "toFC1": 132 },
            "FC1": { "time": 777600, "1": 158, "2": 158, "3": 158, "4": 158, "toFC2": 158 },
            "FC2": { "time": 950400, "1": 238, "2": 238, "3": 238, "4": 238, "toFC3": 238 },
            "FC3": { "time": 1036800, "1": 280, "2": 280, "3": 280, "4": 280, "toFC4": 280 },
            "FC4": { "time": 1209600, "1": 335, "2": 335, "3": 335, "4": 335, "toFC5": 335 },
            "FC5": { "time": 1296000, "normal": { "1": 200, "2": 200, "3": 200, "4": 200, "toFC6": 100 }, "refine": { "1": 10, "2": 10, "3": 10, "4": 10, "toFC6": 20 } },
            "FC6": { "time": 1555200, "normal": { "1": 240, "2": 240, "3": 240, "4": 240, "toFC7": 120 }, "refine": { "1": 15, "2": 15, "3": 15, "4": 15, "toFC7": 30 } },
            "FC7": { "time": 1728000, "normal": { "1": 240, "2": 240, "3": 240, "4": 240, "toFC8": 120 }, "refine": { "1": 20, "2": 20, "3": 20, "4": 20, "toFC8": 40 } },
            "FC8": { "time": 1123200, "normal": { "1": 280, "2": 280, "3": 280, "4": 280, "toFC9": 140 }, "refine": { "1": 30, "2": 30, "3": 30, "4": 30, "toFC9": 60 } },
            "FC9": { "time": 1728000, "normal": { "1": 350, "2": 350, "3": 350, "4": 350, "toFC10": 175 }, "refine": { "1": 70, "2": 70, "3": 70, "4": 70, "toFC10": 140 } },
            "FC10": { "time": 0, "normal": { "1": 400, "2": 400, "3": 400, "4": 400 }, "refine": { "1": 80, "2": 80, "3": 80, "4": 80 } }
        },
        "Embassy": {
            "F30": { "time": 399120, "start": 0, "1": 33, "2": 33, "3": 33, "4": 33, "toFC1": 33 },
            "FC1": { "time": 513180, "start": 0, "1": 39, "2": 39, "3": 39, "4": 39, "toFC2": 39 },
            "FC2": { "time": 627240, "start": 0, "1": 59, "2": 59, "3": 59, "4": 59, "toFC3": 59 },
            "FC3": { "time": 684240, "start": 0, "1": 70, "2": 70, "3": 70, "4": 70, "toFC4": 70 },
            "FC4": { "time": 798300, "start": 0, "1": 83, "2": 83, "3": 83, "4": 83, "toFC5": 83 },
            "FC5": { "time": 855360, "normal": { "1": 50, "2": 50, "3": 50, "4": 50, "toFC6": 25 }, "refine": { "1": 2, "2": 2, "3": 2, "4": 2, "toFC6": 5 } },
            "FC6": { "time": 1026420, "normal": { "1": 60, "2": 60, "3": 60, "4": 60, "toFC7": 30 }, "refine": { "1": 3, "2": 3, "3": 3, "4": 3, "toFC7": 7 } },
            "FC7": { "time": 1140480, "normal": { "1": 60, "2": 60, "3": 60, "4": 60, "toFC8": 30 }, "refine": { "1": 5, "2": 5, "3": 5, "4": 5, "toFC8": 10 } },
            "FC8": { "time": 741300, "normal": { "1": 70, "2": 70, "3": 70, "4": 70, "toFC9": 35 }, "refine": { "1": 7, "2": 7, "3": 7, "4": 7, "toFC9": 15 } },
            "FC9": { "time": 1140480, "normal": { "1": 87, "2": 87, "3": 87, "4": 87, "toFC10": 43 }, "refine": { "1": 17, "2": 17, "3": 17, "4": 17, "toFC10": 35 } },
            "FC10": { "time": 0, "normal": { "1": 100, "2": 100, "3": 100, "4": 100 }, "refine": { "1": 20, "2": 20, "3": 20, "4": 20 } }
        },
        "Command Center": {
            "F30": { "time": 72570, "start": 0, "1": 26, "2": 26, "3": 26, "4": 26, "toFC1": 26 },
            "FC1": { "time": 93300, "start": 0, "1": 31, "2": 31, "3": 31, "4": 31, "toFC2": 31 },
            "FC2": { "time": 114000, "start": 0, "1": 47, "2": 47, "3": 47, "4": 47, "toFC3": 47 },
            "FC3": { "time": 124380, "start": 0, "1": 56, "2": 56, "3": 56, "4": 56, "toFC4": 56 },
            "FC4": { "time": 145860, "start": 0, "1": 67, "2": 67, "3": 67, "4": 67, "toFC5": 67 },
            "FC5": { "time": 155520, "normal": { "1": 40, "2": 40, "3": 40, "4": 40, "toFC6": 20 }, "refine": { "1": 2, "2": 2, "3": 2, "4": 2, "toFC6": 5 } },
            "FC6": { "time": 178200, "normal": { "1": 48, "2": 48, "3": 48, "4": 48, "toFC7": 24 }, "refine": { "1": 3, "2": 3, "3": 3, "4": 3, "toFC7": 7 } },
            "FC7": { "time": 207360, "normal": { "1": 48, "2": 48, "3": 48, "4": 48, "toFC8": 24 }, "refine": { "1": 4, "2": 4, "3": 4, "4": 4, "toFC8": 8 } },
            "FC8": { "time": 134760, "normal": { "1": 56, "2": 56, "3": 56, "4": 56, "toFC9": 28 }, "refine": { "1": 6, "2": 6, "3": 6, "4": 6, "toFC9": 12 } },
            "FC9": { "time": 207360, "normal": { "1": 70, "2": 70, "3": 70, "4": 70, "toFC10": 35 }, "refine": { "1": 14, "2": 14, "3": 14, "4": 14, "toFC10": 28 } },
            "FC10": { "time": 0, "normal": { "1": 80, "2": 80, "3": 80, "4": 80 }, "refine": { "1": 16, "2": 16, "3": 16, "4": 16 } }
        },
        "Infirmary": {
            "F30": { "time": 84660, "start": 0, "1": 26, "2": 26, "3": 26, "4": 26, "toFC1": 26 },
            "FC1": { "time": 108840, "start": 0, "1": 31, "2": 31, "3": 31, "4": 31, "toFC2": 31 },
            "FC2": { "time": 133020, "start": 0, "1": 47, "2": 47, "3": 47, "4": 47, "toFC3": 47 },
            "FC3": { "time": 145140, "start": 0, "1": 56, "2": 56, "3": 56, "4": 56, "toFC4": 56 },
            "FC4": { "time": 169320, "start": 0, "1": 67, "2": 67, "3": 67, "4": 67, "toFC5": 67 },
            "FC5": { "time": 181440, "normal": { "1": 40, "2": 40, "3": 40, "4": 40, "toFC6": 20 }, "refine": { "1": 2, "2": 2, "3": 2, "4": 2, "toFC6": 5 } },
            "FC6": { "time": 217680, "normal": { "1": 48, "2": 48, "3": 48, "4": 48, "toFC7": 24 }, "refine": { "1": 3, "2": 3, "3": 3, "4": 3, "toFC7": 7 } },
            "FC7": { "time": 241920, "normal": { "1": 48, "2": 48, "3": 48, "4": 48, "toFC8": 24 }, "refine": { "1": 4, "2": 4, "3": 4, "4": 4, "toFC8": 8 } },
            "FC8": { "time": 156600, "normal": { "1": 56, "2": 56, "3": 56, "4": 56, "toFC9": 28 }, "refine": { "1": 6, "2": 6, "3": 6, "4": 6, "toFC9": 12 } },
            "FC9": { "time": 241920, "normal": { "1": 70, "2": 70, "3": 70, "4": 70, "toFC10": 35 }, "refine": { "1": 14, "2": 14, "3": 14, "4": 14, "toFC10": 28 } },
            "FC10": { "time": 0, "normal": { "1": 80, "2": 80, "3": 80, "4": 80 }, "refine": { "1": 16, "2": 16, "3": 16, "4": 16 } }
        },
        "Infantry Camp": {
            "F30": { "time": 90720, "start": 0, "1": 59, "2": 59, "3": 59, "4": 59, "toFC1": 59 },
            "FC1": { "time": 116640, "start": 0, "1": 71, "2": 71, "3": 71, "4": 71, "toFC2": 71 },
            "FC2": { "time": 142560, "start": 0, "1": 107, "2": 107, "3": 107, "4": 107, "toFC3": 107 },
            "FC3": { "time": 155520, "start": 0, "1": 126, "2": 126, "3": 126, "4": 126, "toFC4": 126 },
            "FC4": { "time": 181440, "start": 0, "1": 150, "2": 150, "3": 150, "4": 150, "toFC5": 150 },
            "FC5": { "time": 194400, "normal": { "1": 90, "2": 90, "3": 90, "4": 90, "toFC6": 90 }, "refine": { "1": 4, "2": 4, "3": 4, "4": 4, "toFC6": 9 } },
            "FC6": { "time": 233280, "normal": { "1": 108, "2": 108, "3": 108, "4": 108, "toFC7": 54 }, "refine": { "1": 6, "2": 6, "3": 6, "4": 6, "toFC7": 13 } },
            "FC7": { "time": 259200, "normal": { "1": 108, "2": 108, "3": 108, "4": 108, "toFC8": 54 }, "refine": { "1": 9, "2": 9, "3": 9, "4": 9, "toFC8": 18 } },
            "FC8": { "time": 168480, "normal": { "1": 126, "2": 126, "3": 126, "4": 126, "toFC9": 63 }, "refine": { "1": 13, "2": 13, "3": 13, "4": 13, "toFC9": 26 } },
            "FC9": { "time": 259200, "normal": { "1": 157, "2": 157, "3": 157, "4": 157, "toFC10": 78 }, "refine": { "1": 31, "2": 31, "3": 31, "4": 31, "toFC10": 63 } },
            "FC10": { "time": 0, "normal": { "1": 180, "2": 180, "3": 180, "4": 180 }, "refine": { "1": 36, "2": 36, "3": 36, "4": 36 } }
        },
        "Marksman Camp": {
            "F30": { "time": 90720, "start": 0, "1": 59, "2": 59, "3": 59, "4": 59, "toFC1": 59 },
            "FC1": { "time": 116640, "start": 0, "1": 71, "2": 71, "3": 71, "4": 71, "toFC2": 71 },
            "FC2": { "time": 142560, "start": 0, "1": 107, "2": 107, "3": 107, "4": 107, "toFC3": 107 },
            "FC3": { "time": 155520, "start": 0, "1": 126, "2": 126, "3": 126, "4": 126, "toFC4": 126 },
            "FC4": { "time": 181440, "start": 0, "1": 150, "2": 150, "3": 150, "4": 150, "toFC5": 150 },
            "FC5": { "time": 194400, "normal": { "1": 90, "2": 90, "3": 90, "4": 90, "toFC6": 90 }, "refine": { "1": 4, "2": 4, "3": 4, "4": 4, "toFC6": 9 } },
            "FC6": { "time": 233280, "normal": { "1": 108, "2": 108, "3": 108, "4": 108, "toFC7": 54 }, "refine": { "1": 6, "2": 6, "3": 6, "4": 6, "toFC7": 13 } },
            "FC7": { "time": 259200, "normal": { "1": 108, "2": 108, "3": 108, "4": 108, "toFC8": 54 }, "refine": { "1": 9, "2": 9, "3": 9, "4": 9, "toFC8": 18 } },
            "FC8": { "time": 168480, "normal": { "1": 126, "2": 126, "3": 126, "4": 126, "toFC9": 63 }, "refine": { "1": 13, "2": 13, "3": 13, "4": 13, "toFC9": 26 } },
            "FC9": { "time": 259200, "normal": { "1": 157, "2": 157, "3": 157, "4": 157, "toFC10": 78 }, "refine": { "1": 31, "2": 31, "3": 31, "4": 31, "toFC10": 63 } },
            "FC10": { "time": 0, "normal": { "1": 180, "2": 180, "3": 180, "4": 180 }, "refine": { "1": 36, "2": 36, "3": 36, "4": 36 } }
        },
        "Lancer Camp": {
            "F30": { "time": 90720, "start": 0, "1": 59, "2": 59, "3": 59, "4": 59, "toFC1": 59 },
            "FC1": { "time": 116640, "start": 0, "1": 71, "2": 71, "3": 71, "4": 71, "toFC2": 71 },
            "FC2": { "time": 142560, "start": 0, "1": 107, "2": 107, "3": 107, "4": 107, "toFC3": 107 },
            "FC3": { "time": 155520, "start": 0, "1": 126, "2": 126, "3": 126, "4": 126, "toFC4": 126 },
            "FC4": { "time": 181440, "start": 0, "1": 150, "2": 150, "3": 150, "4": 150, "toFC5": 150 },
            "FC5": { "time": 194400, "normal": { "1": 90, "2": 90, "3": 90, "4": 90, "toFC6": 90 }, "refine": { "1": 4, "2": 4, "3": 4, "4": 4, "toFC6": 9 } },
            "FC6": { "time": 233280, "normal": { "1": 108, "2": 108, "3": 108, "4": 108, "toFC7": 54 }, "refine": { "1": 6, "2": 6, "3": 6, "4": 6, "toFC7": 13 } },
            "FC7": { "time": 259200, "normal": { "1": 108, "2": 108, "3": 108, "4": 108, "toFC8": 54 }, "refine": { "1": 9, "2": 9, "3": 9, "4": 9, "toFC8": 18 } },
            "FC8": { "time": 168480, "normal": { "1": 126, "2": 126, "3": 126, "4": 126, "toFC9": 63 }, "refine": { "1": 13, "2": 13, "3": 13, "4": 13, "toFC9": 26 } },
            "FC9": { "time": 259200, "normal": { "1": 157, "2": 157, "3": 157, "4": 157, "toFC10": 78 }, "refine": { "1": 31, "2": 31, "3": 31, "4": 31, "toFC10": 63 } },
            "FC10": { "time": 0, "normal": { "1": 180, "2": 180, "3": 180, "4": 180 }, "refine": { "1": 36, "2": 36, "3": 36, "4": 36 } }
        },
        "War Academy": {
            "FC1": { "time": 155520, "start": 0, "1": 71, "2": 71, "3": 71, "4": 71, "toFC2": 71 },
            "FC2": { "time": 190080, "start": 0, "1": 107, "2": 107, "3": 107, "4": 107, "toFC3": 107 },
            "FC3": { "time": 207360, "start": 0, "1": 126, "2": 126, "3": 126, "4": 126, "toFC4": 126 },
            "FC4": { "time": 241920, "start": 0, "1": 150, "2": 150, "3": 150, "4": 150, "toFC5": 150 },
            "FC5": { "time": 259200, "normal": { "1": 90, "2": 90, "3": 90, "4": 90, "toFC6": 45 }, "refine": { "1": 4, "2": 4, "3": 4, "4": 4, "toFC6": 9 } },
            "FC6": { "time": 300240, "normal": { "1": 108, "2": 108, "3": 108, "4": 108, "toFC7": 54 }, "refine": { "1": 6, "2": 6, "3": 6, "4": 6, "toFC7": 13 } },
            "FC7": { "time": 345600, "normal": { "1": 108, "2": 108, "3": 108, "4": 108, "toFC8": 54 }, "refine": { "1": 9, "2": 9, "3": 9, "4": 9, "toFC8": 18 } },
            "FC8": { "time": 224000, "normal": { "1": 126, "2": 126, "3": 126, "4": 126, "toFC9": 63 }, "refine": { "1": 13, "2": 13, "3": 13, "4": 13, "toFC9": 26 } },
            "FC9": { "time": 345600, "normal": { "1": 157, "2": 157, "3": 157, "4": 157, "toFC10": 78 }, "refine": { "1": 31, "2": 31, "3": 31, "4": 31, "toFC10": 63 } },
            "FC10": { "time": 0, "normal": { "1": 180, "2": 180, "3": 180, "4": 180 }, "refine": { "1": 36, "2": 36, "3": 36, "4": 36 } }
        }
    };

    // Level progression for Furnace
    const FURNACE_LEVELS = ['F30', '30-1', '30-2', '30-3', '30-4', 'FC1', 'FC1-1', 'FC1-2', 'FC1-3', 'FC1-4', 
                            'FC2', 'FC2-1', 'FC2-2', 'FC2-3', 'FC2-4', 'FC3', 'FC3-1', 'FC3-2', 'FC3-3', 'FC3-4',
                            'FC4', 'FC4-1', 'FC4-2', 'FC4-3', 'FC4-4', 'FC5', 'FC5-1', 'FC5-2', 'FC5-3', 'FC5-4',
                            'FC6', 'FC6-1', 'FC6-2', 'FC6-3', 'FC6-4', 'FC7', 'FC7-1', 'FC7-2', 'FC7-3', 'FC7-4',
                            'FC8', 'FC8-1', 'FC8-2', 'FC8-3', 'FC8-4', 'FC9', 'FC9-1', 'FC9-2', 'FC9-3', 'FC9-4', 'FC10'];

    // Level progression for other buildings now includes intermediate sub-levels (-1..-4)
    const BUILDING_LEVELS = ['F30', '30-1', '30-2', '30-3', '30-4', 'FC1', 'FC1-1', 'FC1-2', 'FC1-3', 'FC1-4',
                             'FC2', 'FC2-1', 'FC2-2', 'FC2-3', 'FC2-4', 'FC3', 'FC3-1', 'FC3-2', 'FC3-3', 'FC3-4',
                             'FC4', 'FC4-1', 'FC4-2', 'FC4-3', 'FC4-4', 'FC5', 'FC5-1', 'FC5-2', 'FC5-3', 'FC5-4',
                             'FC6', 'FC6-1', 'FC6-2', 'FC6-3', 'FC6-4', 'FC7', 'FC7-1', 'FC7-2', 'FC7-3', 'FC7-4',
                             'FC8', 'FC8-1', 'FC8-2', 'FC8-3', 'FC8-4', 'FC9', 'FC9-1', 'FC9-2', 'FC9-3', 'FC9-4', 'FC10'];
    const WAR_ACADEMY_LEVELS = ['FC1', 'FC1-1', 'FC1-2', 'FC1-3', 'FC1-4', 'FC2', 'FC2-1', 'FC2-2', 'FC2-3', 'FC2-4',
                                'FC3', 'FC3-1', 'FC3-2', 'FC3-3', 'FC3-4', 'FC4', 'FC4-1', 'FC4-2', 'FC4-3', 'FC4-4',
                                'FC5', 'FC5-1', 'FC5-2', 'FC5-3', 'FC5-4', 'FC6', 'FC6-1', 'FC6-2', 'FC6-3', 'FC6-4',
                                'FC7', 'FC7-1', 'FC7-2', 'FC7-3', 'FC7-4', 'FC8', 'FC8-1', 'FC8-2', 'FC8-3', 'FC8-4',
                                'FC9', 'FC9-1', 'FC9-2', 'FC9-3', 'FC9-4', 'FC10'];

    // Building types
    const BUILDINGS = ['Furnace', 'Embassy', 'Command Center', 'Infirmary', 'Infantry Camp', 'Marksman Camp', 'Lancer Camp', 'War Academy'];

    // Base resource costs for upgrades (meat, wood, coal, iron) per next level reached
    // Note: Currently populated for Furnace based on provided table. Other buildings can be added similarly.
    const buildingResourceCosts = {
        'Furnace': {
            '30-1': { meat: 67000000, wood: 67000000, coal: 13000000, iron: 3300000 },
            '30-2': { meat: 67000000, wood: 67000000, coal: 13000000, iron: 3300000 },
            '30-3': { meat: 67000000, wood: 67000000, coal: 13000000, iron: 3300000 },
            '30-4': { meat: 67000000, wood: 67000000, coal: 13000000, iron: 3300000 },
            'FC1':   { meat: 67000000, wood: 67000000, coal: 13000000, iron: 3300000 },

            'FC1-1': { meat: 72000000, wood: 72000000, coal: 14000000, iron: 3600000 },
            'FC1-2': { meat: 72000000, wood: 72000000, coal: 14000000, iron: 3600000 },
            'FC1-3': { meat: 72000000, wood: 72000000, coal: 14000000, iron: 3600000 },
            'FC1-4': { meat: 72000000, wood: 72000000, coal: 14000000, iron: 3600000 },
            'FC2':   { meat: 72000000, wood: 72000000, coal: 14000000, iron: 3600000 },

            'FC2-1': { meat: 79000000, wood: 79000000, coal: 15000000, iron: 3900000 },
            'FC2-2': { meat: 79000000, wood: 79000000, coal: 15000000, iron: 3900000 },
            'FC2-3': { meat: 79000000, wood: 79000000, coal: 15000000, iron: 3900000 },
            'FC2-4': { meat: 79000000, wood: 79000000, coal: 15000000, iron: 3900000 },
            'FC3':   { meat: 79000000, wood: 79000000, coal: 15000000, iron: 3900000 },

            'FC3-1': { meat: 82000000, wood: 82000000, coal: 16000000, iron: 4100000 },
            'FC3-2': { meat: 82000000, wood: 82000000, coal: 16000000, iron: 4100000 },
            'FC3-3': { meat: 82000000, wood: 82000000, coal: 16000000, iron: 4100000 },
            'FC3-4': { meat: 82000000, wood: 82000000, coal: 16000000, iron: 4100000 },
            'FC4':   { meat: 82000000, wood: 82000000, coal: 16000000, iron: 4100000 },

            'FC4-1': { meat: 84000000, wood: 84000000, coal: 16000000, iron: 4200000 },
            'FC4-2': { meat: 84000000, wood: 84000000, coal: 16000000, iron: 4200000 },
            'FC4-3': { meat: 84000000, wood: 84000000, coal: 16000000, iron: 4200000 },
            'FC4-4': { meat: 84000000, wood: 84000000, coal: 16000000, iron: 4200000 },
            'FC5':   { meat: 84000000, wood: 84000000, coal: 16000000, iron: 4200000 },

            'FC5-1': { meat: 96000000, wood: 96000000, coal: 19000000, iron: 4800000 },
            'FC5-2': { meat: 96000000, wood: 96000000, coal: 19000000, iron: 4800000 },
            'FC5-3': { meat: 96000000, wood: 96000000, coal: 19000000, iron: 4800000 },
            'FC5-4': { meat: 96000000, wood: 96000000, coal: 19000000, iron: 4800000 },
            'FC6':   { meat: 96000000, wood: 96000000, coal: 19000000, iron: 4800000 },

            'FC6-1': { meat: 100000000, wood: 100000000, coal: 21000000, iron: 5400000 },
            'FC6-2': { meat: 100000000, wood: 100000000, coal: 21000000, iron: 5400000 },
            'FC6-3': { meat: 100000000, wood: 100000000, coal: 21000000, iron: 5400000 },
            'FC6-4': { meat: 100000000, wood: 100000000, coal: 21000000, iron: 5400000 },
            'FC7':   { meat: 100000000, wood: 100000000, coal: 21000000, iron: 5400000 },

            'FC7-1': { meat: 130000000, wood: 130000000, coal: 26000000, iron: 6600000 },
            'FC7-2': { meat: 130000000, wood: 130000000, coal: 26000000, iron: 6600000 },
            'FC7-3': { meat: 130000000, wood: 130000000, coal: 26000000, iron: 6600000 },
            'FC7-4': { meat: 130000000, wood: 130000000, coal: 26000000, iron: 6600000 },
            'FC8':   { meat: 130000000, wood: 130000000, coal: 26000000, iron: 6600000 },

            'FC8-1': { meat: 140000000, wood: 140000000, coal: 29000000, iron: 7200000 },
            'FC8-2': { meat: 140000000, wood: 140000000, coal: 29000000, iron: 7200000 },
            'FC8-3': { meat: 140000000, wood: 140000000, coal: 29000000, iron: 7200000 },
            'FC8-4': { meat: 140000000, wood: 140000000, coal: 29000000, iron: 7200000 },
            'FC9':   { meat: 140000000, wood: 140000000, coal: 29000000, iron: 7200000 },

            'FC9-1': { meat: 160000000, wood: 160000000, coal: 33000000, iron: 8400000 },
            'FC9-2': { meat: 160000000, wood: 160000000, coal: 33000000, iron: 8400000 },
            'FC9-3': { meat: 160000000, wood: 160000000, coal: 33000000, iron: 8400000 },
            'FC9-4': { meat: 160000000, wood: 160000000, coal: 33000000, iron: 8400000 },
            'FC10':  { meat: 160000000, wood: 160000000, coal: 33000000, iron: 8400000 }
        },
        // TODO: Seed actual resource values for the following buildings
        // The keys below are prepared to match level progression; values are placeholders (0)
        'Embassy': {
            '30-1': { meat: 110000000, wood: 110000000, coal: 22000000, iron: 5600000 },
            '30-2': { meat: 120000000, wood: 120000000, coal: 23000000, iron: 5800000 },
            '30-3': { meat: 120000000, wood: 120000000, coal: 24000000, iron: 6000000 },
            '30-4': { meat: 130000000, wood: 130000000, coal: 25000000, iron: 6200000 },
            'FC1':   { meat: 130000000, wood: 130000000, coal: 26000000, iron: 6400000 },
            'FC1-1': { meat: 140000000, wood: 140000000, coal: 27000000, iron: 6700000 },
            'FC1-2': { meat: 140000000, wood: 140000000, coal: 28000000, iron: 6900000 },
            'FC1-3': { meat: 150000000, wood: 150000000, coal: 29000000, iron: 7100000 },
            'FC1-4': { meat: 150000000, wood: 150000000, coal: 30000000, iron: 7400000 },
            'FC2':   { meat: 160000000, wood: 160000000, coal: 31000000, iron: 7600000 },
            'FC2-1': { meat: 160000000, wood: 160000000, coal: 32000000, iron: 7900000 },
            'FC2-2': { meat: 170000000, wood: 170000000, coal: 33000000, iron: 8100000 },
            'FC2-3': { meat: 170000000, wood: 170000000, coal: 35000000, iron: 8400000 },
            'FC2-4': { meat: 180000000, wood: 180000000, coal: 36000000, iron: 8700000 },
            'FC3':   { meat: 180000000, wood: 180000000, coal: 37000000, iron: 8900000 },
            'FC3-1': { meat: 190000000, wood: 190000000, coal: 38000000, iron: 9200000 },
            'FC3-2': { meat: 200000000, wood: 200000000, coal: 39000000, iron: 9500000 },
            'FC3-3': { meat: 200000000, wood: 200000000, coal: 40000000, iron: 9800000 },
            'FC3-4': { meat: 210000000, wood: 210000000, coal: 42000000, iron: 10000000 },
            'FC4':   { meat: 210000000, wood: 210000000, coal: 43000000, iron: 11000000 },
            'FC4-1': { meat: 220000000, wood: 220000000, coal: 44000000, iron: 11000000 },
            'FC4-2': { meat: 230000000, wood: 230000000, coal: 45000000, iron: 11000000 },
            'FC4-3': { meat: 230000000, wood: 230000000, coal: 47000000, iron: 12000000 },
            'FC4-4': { meat: 240000000, wood: 240000000, coal: 48000000, iron: 12000000 },
            'FC5':   { meat: 250000000, wood: 250000000, coal: 49000000, iron: 12000000 },
            'FC5-1': { meat: 260000000, wood: 260000000, coal: 51000000, iron: 13000000 },
            'FC5-2': { meat: 260000000, wood: 260000000, coal: 52000000, iron: 13000000 },
            'FC5-3': { meat: 270000000, wood: 270000000, coal: 54000000, iron: 13000000 },
            'FC5-4': { meat: 280000000, wood: 280000000, coal: 55000000, iron: 14000000 },
            'FC6':   { meat: 290000000, wood: 290000000, coal: 57000000, iron: 14000000 },
            'FC6-1': { meat: 290000000, wood: 290000000, coal: 58000000, iron: 15000000 },
            'FC6-2': { meat: 300000000, wood: 300000000, coal: 60000000, iron: 15000000 },
            'FC6-3': { meat: 310000000, wood: 310000000, coal: 62000000, iron: 15000000 },
            'FC6-4': { meat: 320000000, wood: 320000000, coal: 63000000, iron: 16000000 },
            'FC7':   { meat: 330000000, wood: 330000000, coal: 65000000, iron: 16000000 },
            'FC7-1': { meat: 340000000, wood: 340000000, coal: 67000000, iron: 17000000 },
            'FC7-2': { meat: 350000000, wood: 350000000, coal: 69000000, iron: 17000000 },
            'FC7-3': { meat: 360000000, wood: 360000000, coal: 71000000, iron: 18000000 },
            'FC7-4': { meat: 370000000, wood: 370000000, coal: 73000000, iron: 18000000 },
            'FC8':   { meat: 380000000, wood: 380000000, coal: 75000000, iron: 19000000 },
            'FC8-1': { meat: 390000000, wood: 390000000, coal: 77000000, iron: 19000000 },
            'FC8-2': { meat: 400000000, wood: 400000000, coal: 79000000, iron: 20000000 },
            'FC8-3': { meat: 410000000, wood: 410000000, coal: 81000000, iron: 20000000 },
            'FC8-4': { meat: 420000000, wood: 420000000, coal: 83000000, iron: 21000000 },
            'FC9':   { meat: 430000000, wood: 430000000, coal: 85000000, iron: 21000000 },
            'FC9-1': { meat: 440000000, wood: 440000000, coal: 87000000, iron: 22000000 },
            'FC9-2': { meat: 450000000, wood: 450000000, coal: 89000000, iron: 22000000 },
            'FC9-3': { meat: 460000000, wood: 460000000, coal: 91000000, iron: 23000000 },
            'FC9-4': { meat: 470000000, wood: 470000000, coal: 93000000, iron: 23000000 },
            'FC10':  { meat: 480000000, wood: 480000000, coal: 95000000, iron: 24000000 }
        },
        'Command Center': {
            '30-1': { meat: 55000000, wood: 55000000, coal: 11000000, iron: 2800000 },
            '30-2': { meat: 57000000, wood: 57000000, coal: 11000000, iron: 2900000 },
            '30-3': { meat: 59000000, wood: 59000000, coal: 12000000, iron: 3000000 },
            '30-4': { meat: 61000000, wood: 61000000, coal: 12000000, iron: 3100000 },
            'FC1':   { meat: 63000000, wood: 63000000, coal: 13000000, iron: 3200000 },
            'FC1-1': { meat: 65000000, wood: 65000000, coal: 13000000, iron: 3300000 },
            'FC1-2': { meat: 67000000, wood: 67000000, coal: 13000000, iron: 3400000 },
            'FC1-3': { meat: 69000000, wood: 69000000, coal: 14000000, iron: 3500000 },
            'FC1-4': { meat: 71000000, wood: 71000000, coal: 14000000, iron: 3600000 },
            'FC2':   { meat: 73000000, wood: 73000000, coal: 15000000, iron: 3700000 },
            'FC2-1': { meat: 75000000, wood: 75000000, coal: 15000000, iron: 3800000 },
            'FC2-2': { meat: 77000000, wood: 77000000, coal: 15000000, iron: 3900000 },
            'FC2-3': { meat: 79000000, wood: 79000000, coal: 16000000, iron: 4000000 },
            'FC2-4': { meat: 81000000, wood: 81000000, coal: 16000000, iron: 4100000 },
            'FC3':   { meat: 83000000, wood: 83000000, coal: 17000000, iron: 4200000 },
            'FC3-1': { meat: 86000000, wood: 86000000, coal: 17000000, iron: 4300000 },
            'FC3-2': { meat: 88000000, wood: 88000000, coal: 18000000, iron: 4400000 },
            'FC3-3': { meat: 90000000, wood: 90000000, coal: 18000000, iron: 4500000 },
            'FC3-4': { meat: 92000000, wood: 92000000, coal: 18000000, iron: 4600000 },
            'FC4':   { meat: 94000000, wood: 94000000, coal: 19000000, iron: 4700000 },
            'FC4-1': { meat: 97000000, wood: 97000000, coal: 19000000, iron: 4900000 },
            'FC4-2': { meat: 99000000, wood: 99000000, coal: 20000000, iron: 5000000 },
            'FC4-3': { meat: 100000000, wood: 100000000, coal: 20000000, iron: 5100000 },
            'FC4-4': { meat: 100000000, wood: 100000000, coal: 21000000, iron: 5200000 },
            'FC5':   { meat: 110000000, wood: 110000000, coal: 21000000, iron: 5300000 },
            'FC5-1': { meat: 110000000, wood: 110000000, coal: 22000000, iron: 5400000 },
            'FC5-2': { meat: 110000000, wood: 110000000, coal: 22000000, iron: 5500000 },
            'FC5-3': { meat: 110000000, wood: 110000000, coal: 23000000, iron: 5600000 },
            'FC5-4': { meat: 110000000, wood: 110000000, coal: 23000000, iron: 5800000 },
            'FC6':   { meat: 120000000, wood: 120000000, coal: 23000000, iron: 5900000 },
            'FC6-1': { meat: 120000000, wood: 120000000, coal: 24000000, iron: 6000000 },
            'FC6-2': { meat: 120000000, wood: 120000000, coal: 24000000, iron: 6100000 },
            'FC6-3': { meat: 120000000, wood: 120000000, coal: 25000000, iron: 6200000 },
            'FC6-4': { meat: 130000000, wood: 130000000, coal: 25000000, iron: 6400000 },
            'FC7':   { meat: 130000000, wood: 130000000, coal: 26000000, iron: 6500000 },
            'FC7-1': { meat: 130000000, wood: 130000000, coal: 26000000, iron: 6600000 },
            'FC7-2': { meat: 130000000, wood: 130000000, coal: 27000000, iron: 6700000 },
            'FC7-3': { meat: 140000000, wood: 140000000, coal: 27000000, iron: 6800000 },
            'FC7-4': { meat: 140000000, wood: 140000000, coal: 28000000, iron: 6900000 },
            'FC8':   { meat: 140000000, wood: 140000000, coal: 28000000, iron: 7100000 },
            'FC8-1': { meat: 140000000, wood: 140000000, coal: 29000000, iron: 7200000 },
            'FC8-2': { meat: 140000000, wood: 140000000, coal: 29000000, iron: 7300000 },
            'FC8-3': { meat: 150000000, wood: 150000000, coal: 30000000, iron: 7400000 },
            'FC8-4': { meat: 150000000, wood: 150000000, coal: 30000000, iron: 7600000 },
            'FC9':   { meat: 150000000, wood: 150000000, coal: 31000000, iron: 7700000 },
            'FC9-1': { meat: 150000000, wood: 150000000, coal: 31000000, iron: 7800000 },
            'FC9-2': { meat: 150000000, wood: 150000000, coal: 32000000, iron: 7900000 },
            'FC9-3': { meat: 160000000, wood: 160000000, coal: 32000000, iron: 8100000 },
            'FC9-4': { meat: 160000000, wood: 160000000, coal: 33000000, iron: 8200000 },
            'FC10':  { meat: 160000000, wood: 160000000, coal: 33000000, iron: 8300000 }
        },
        'Infirmary': {
            '30-1': { meat: 95000000, wood: 95000000, coal: 19000000, iron: 4800000 },
            '30-2': { meat: 98000000, wood: 98000000, coal: 20000000, iron: 4900000 },
            '30-3': { meat: 100000000, wood: 100000000, coal: 20000000, iron: 5100000 },
            '30-4': { meat: 100000000, wood: 100000000, coal: 21000000, iron: 5200000 },
            'FC1':   { meat: 110000000, wood: 110000000, coal: 21000000, iron: 5300000 },
            'FC1-1': { meat: 110000000, wood: 110000000, coal: 22000000, iron: 5500000 },
            'FC1-2': { meat: 110000000, wood: 110000000, coal: 22000000, iron: 5600000 },
            'FC1-3': { meat: 110000000, wood: 110000000, coal: 23000000, iron: 5700000 },
            'FC1-4': { meat: 120000000, wood: 120000000, coal: 23000000, iron: 5900000 },
            'FC2':   { meat: 120000000, wood: 120000000, coal: 24000000, iron: 6000000 },
            'FC2-1': { meat: 120000000, wood: 120000000, coal: 25000000, iron: 6200000 },
            'FC2-2': { meat: 130000000, wood: 130000000, coal: 25000000, iron: 6300000 },
            'FC2-3': { meat: 130000000, wood: 130000000, coal: 26000000, iron: 6500000 },
            'FC2-4': { meat: 130000000, wood: 130000000, coal: 27000000, iron: 6600000 },
            'FC3':   { meat: 140000000, wood: 140000000, coal: 27000000, iron: 6800000 },
            'FC3-1': { meat: 140000000, wood: 140000000, coal: 28000000, iron: 7000000 },
            'FC3-2': { meat: 140000000, wood: 140000000, coal: 29000000, iron: 7100000 },
            'FC3-3': { meat: 150000000, wood: 150000000, coal: 29000000, iron: 7300000 },
            'FC3-4': { meat: 150000000, wood: 150000000, coal: 30000000, iron: 7500000 },
            'FC4':   { meat: 150000000, wood: 150000000, coal: 31000000, iron: 7600000 },
            'FC4-1': { meat: 160000000, wood: 160000000, coal: 32000000, iron: 7800000 },
            'FC4-2': { meat: 160000000, wood: 160000000, coal: 32000000, iron: 8000000 },
            'FC4-3': { meat: 160000000, wood: 160000000, coal: 33000000, iron: 8200000 },
            'FC4-4': { meat: 170000000, wood: 170000000, coal: 34000000, iron: 8300000 },
            'FC5':   { meat: 170000000, wood: 170000000, coal: 34000000, iron: 8500000 },
            'FC5-1': { meat: 180000000, wood: 180000000, coal: 35000000, iron: 8700000 },
            'FC5-2': { meat: 180000000, wood: 180000000, coal: 36000000, iron: 8900000 },
            'FC5-3': { meat: 180000000, wood: 180000000, coal: 37000000, iron: 9100000 },
            'FC5-4': { meat: 190000000, wood: 190000000, coal: 37000000, iron: 9300000 },
            'FC6':   { meat: 190000000, wood: 190000000, coal: 38000000, iron: 9500000 },
            'FC6-1': { meat: 200000000, wood: 200000000, coal: 39000000, iron: 9700000 },
            'FC6-2': { meat: 200000000, wood: 200000000, coal: 40000000, iron: 9900000 },
            'FC6-3': { meat: 200000000, wood: 200000000, coal: 40000000, iron: 10000000 },
            'FC6-4': { meat: 210000000, wood: 210000000, coal: 41000000, iron: 10000000 },
            'FC7':   { meat: 210000000, wood: 210000000, coal: 42000000, iron: 11000000 },
            'FC7-1': { meat: 220000000, wood: 220000000, coal: 43000000, iron: 11000000 },
            'FC7-2': { meat: 220000000, wood: 220000000, coal: 43000000, iron: 11000000 },
            'FC7-3': { meat: 220000000, wood: 220000000, coal: 44000000, iron: 11000000 },
            'FC7-4': { meat: 230000000, wood: 230000000, coal: 45000000, iron: 11000000 },
            'FC8':   { meat: 230000000, wood: 230000000, coal: 46000000, iron: 12000000 },
            'FC8-1': { meat: 240000000, wood: 240000000, coal: 47000000, iron: 12000000 },
            'FC8-2': { meat: 240000000, wood: 240000000, coal: 48000000, iron: 12000000 },
            'FC8-3': { meat: 250000000, wood: 250000000, coal: 49000000, iron: 12000000 },
            'FC8-4': { meat: 250000000, wood: 250000000, coal: 50000000, iron: 13000000 },
            'FC9':   { meat: 260000000, wood: 260000000, coal: 51000000, iron: 13000000 },
            'FC9-1': { meat: 260000000, wood: 260000000, coal: 52000000, iron: 13000000 },
            'FC9-2': { meat: 270000000, wood: 270000000, coal: 53000000, iron: 13000000 },
            'FC9-3': { meat: 270000000, wood: 270000000, coal: 54000000, iron: 14000000 },
            'FC9-4': { meat: 280000000, wood: 280000000, coal: 55000000, iron: 14000000 },
            'FC10':  { meat: 280000000, wood: 280000000, coal: 56000000, iron: 14000000 }
        },
        'Infantry Camp': {
            '30-1': { meat: 79000000, wood: 79000000, coal: 16000000, iron: 4000000 },
            '30-2': { meat: 82000000, wood: 82000000, coal: 16000000, iron: 4100000 },
            '30-3': { meat: 85000000, wood: 85000000, coal: 17000000, iron: 4200000 },
            '30-4': { meat: 88000000, wood: 88000000, coal: 17000000, iron: 4400000 },
            'FC1':   { meat: 91000000, wood: 91000000, coal: 18000000, iron: 4500000 },
            'FC1-1': { meat: 93000000, wood: 93000000, coal: 19000000, iron: 4700000 },
            'FC1-2': { meat: 96000000, wood: 96000000, coal: 19000000, iron: 4800000 },
            'FC1-3': { meat: 99000000, wood: 99000000, coal: 20000000, iron: 5000000 },
            'FC1-4': { meat: 100000000, wood: 100000000, coal: 20000000, iron: 5100000 },
            'FC2':   { meat: 100000000, wood: 100000000, coal: 21000000, iron: 5200000 },
            'FC2-1': { meat: 110000000, wood: 110000000, coal: 21000000, iron: 5400000 },
            'FC2-2': { meat: 110000000, wood: 110000000, coal: 22000000, iron: 5500000 },
            'FC2-3': { meat: 110000000, wood: 110000000, coal: 23000000, iron: 5700000 },
            'FC2-4': { meat: 120000000, wood: 120000000, coal: 23000000, iron: 5800000 },
            'FC3':   { meat: 120000000, wood: 120000000, coal: 24000000, iron: 6000000 },
            'FC3-1': { meat: 120000000, wood: 120000000, coal: 25000000, iron: 6100000 },
            'FC3-2': { meat: 130000000, wood: 130000000, coal: 25000000, iron: 6300000 },
            'FC3-3': { meat: 130000000, wood: 130000000, coal: 26000000, iron: 6400000 },
            'FC3-4': { meat: 130000000, wood: 130000000, coal: 26000000, iron: 6600000 },
            'FC4':   { meat: 140000000, wood: 140000000, coal: 27000000, iron: 6800000 },
            'FC4-1': { meat: 140000000, wood: 140000000, coal: 28000000, iron: 6900000 },
            'FC4-2': { meat: 140000000, wood: 140000000, coal: 28000000, iron: 7100000 },
            'FC4-3': { meat: 140000000, wood: 140000000, coal: 29000000, iron: 7200000 },
            'FC4-4': { meat: 150000000, wood: 150000000, coal: 29000000, iron: 7400000 },
            'FC5':   { meat: 150000000, wood: 150000000, coal: 30000000, iron: 7600000 },
            'FC5-1': { meat: 150000000, wood: 150000000, coal: 31000000, iron: 7700000 },
            'FC5-2': { meat: 160000000, wood: 160000000, coal: 31000000, iron: 7900000 },
            'FC5-3': { meat: 160000000, wood: 160000000, coal: 32000000, iron: 8100000 },
            'FC5-4': { meat: 160000000, wood: 160000000, coal: 33000000, iron: 8200000 },
            'FC6':   { meat: 170000000, wood: 170000000, coal: 33000000, iron: 8400000 },
            'FC6-1': { meat: 170000000, wood: 170000000, coal: 34000000, iron: 8600000 },
            'FC6-2': { meat: 170000000, wood: 170000000, coal: 35000000, iron: 8700000 },
            'FC6-3': { meat: 180000000, wood: 180000000, coal: 35000000, iron: 8900000 },
            'FC6-4': { meat: 180000000, wood: 180000000, coal: 36000000, iron: 9100000 },
            'FC7':   { meat: 190000000, wood: 190000000, coal: 37000000, iron: 9200000 },
            'FC7-1': { meat: 190000000, wood: 190000000, coal: 37000000, iron: 9400000 },
            'FC7-2': { meat: 190000000, wood: 190000000, coal: 38000000, iron: 9600000 },
            'FC7-3': { meat: 190000000, wood: 190000000, coal: 39000000, iron: 9700000 },
            'FC7-4': { meat: 200000000, wood: 200000000, coal: 39000000, iron: 9900000 },
            'FC8':   { meat: 200000000, wood: 200000000, coal: 40000000, iron: 10000000 },
            'FC8-1': { meat: 210000000, wood: 210000000, coal: 41000000, iron: 10000000 },
            'FC8-2': { meat: 210000000, wood: 210000000, coal: 42000000, iron: 10000000 },
            'FC8-3': { meat: 210000000, wood: 210000000, coal: 42000000, iron: 11000000 },
            'FC8-4': { meat: 220000000, wood: 220000000, coal: 43000000, iron: 11000000 },
            'FC9':   { meat: 220000000, wood: 220000000, coal: 44000000, iron: 11000000 },
            'FC9-1': { meat: 220000000, wood: 220000000, coal: 45000000, iron: 11000000 },
            'FC9-2': { meat: 230000000, wood: 230000000, coal: 45000000, iron: 11000000 },
            'FC9-3': { meat: 230000000, wood: 230000000, coal: 46000000, iron: 12000000 },
            'FC9-4': { meat: 230000000, wood: 230000000, coal: 47000000, iron: 12000000 },
            'FC10':  { meat: 240000000, wood: 240000000, coal: 47000000, iron: 12000000 }
        },
        'Marksman Camp': {
            '30-1': { meat: 79000000, wood: 79000000, coal: 16000000, iron: 4000000 },
            '30-2': { meat: 82000000, wood: 82000000, coal: 16000000, iron: 4100000 },
            '30-3': { meat: 85000000, wood: 85000000, coal: 17000000, iron: 4200000 },
            '30-4': { meat: 88000000, wood: 88000000, coal: 17000000, iron: 4400000 },
            'FC1':   { meat: 91000000, wood: 91000000, coal: 18000000, iron: 4500000 },
            'FC1-1': { meat: 93000000, wood: 93000000, coal: 19000000, iron: 4700000 },
            'FC1-2': { meat: 96000000, wood: 96000000, coal: 19000000, iron: 4800000 },
            'FC1-3': { meat: 99000000, wood: 99000000, coal: 20000000, iron: 5000000 },
            'FC1-4': { meat: 100000000, wood: 100000000, coal: 20000000, iron: 5100000 },
            'FC2':   { meat: 100000000, wood: 100000000, coal: 21000000, iron: 5200000 },
            'FC2-1': { meat: 110000000, wood: 110000000, coal: 21000000, iron: 5400000 },
            'FC2-2': { meat: 110000000, wood: 110000000, coal: 22000000, iron: 5500000 },
            'FC2-3': { meat: 110000000, wood: 110000000, coal: 23000000, iron: 5700000 },
            'FC2-4': { meat: 120000000, wood: 120000000, coal: 23000000, iron: 5800000 },
            'FC3':   { meat: 120000000, wood: 120000000, coal: 24000000, iron: 6000000 },
            'FC3-1': { meat: 120000000, wood: 120000000, coal: 25000000, iron: 6100000 },
            'FC3-2': { meat: 130000000, wood: 130000000, coal: 25000000, iron: 6300000 },
            'FC3-3': { meat: 130000000, wood: 130000000, coal: 26000000, iron: 6400000 },
            'FC3-4': { meat: 130000000, wood: 130000000, coal: 26000000, iron: 6600000 },
            'FC4':   { meat: 140000000, wood: 140000000, coal: 27000000, iron: 6800000 },
            'FC4-1': { meat: 140000000, wood: 140000000, coal: 28000000, iron: 6900000 },
            'FC4-2': { meat: 140000000, wood: 140000000, coal: 28000000, iron: 7100000 },
            'FC4-3': { meat: 140000000, wood: 140000000, coal: 29000000, iron: 7200000 },
            'FC4-4': { meat: 150000000, wood: 150000000, coal: 29000000, iron: 7400000 },
            'FC5':   { meat: 150000000, wood: 150000000, coal: 30000000, iron: 7600000 },
            'FC5-1': { meat: 150000000, wood: 150000000, coal: 31000000, iron: 7700000 },
            'FC5-2': { meat: 160000000, wood: 160000000, coal: 31000000, iron: 7900000 },
            'FC5-3': { meat: 160000000, wood: 160000000, coal: 32000000, iron: 8100000 },
            'FC5-4': { meat: 160000000, wood: 160000000, coal: 33000000, iron: 8200000 },
            'FC6':   { meat: 170000000, wood: 170000000, coal: 33000000, iron: 8400000 },
            'FC6-1': { meat: 170000000, wood: 170000000, coal: 34000000, iron: 8600000 },
            'FC6-2': { meat: 170000000, wood: 170000000, coal: 35000000, iron: 8700000 },
            'FC6-3': { meat: 180000000, wood: 180000000, coal: 35000000, iron: 8900000 },
            'FC6-4': { meat: 180000000, wood: 180000000, coal: 36000000, iron: 9100000 },
            'FC7':   { meat: 190000000, wood: 190000000, coal: 37000000, iron: 9200000 },
            'FC7-1': { meat: 190000000, wood: 190000000, coal: 37000000, iron: 9400000 },
            'FC7-2': { meat: 190000000, wood: 190000000, coal: 38000000, iron: 9600000 },
            'FC7-3': { meat: 190000000, wood: 190000000, coal: 39000000, iron: 9700000 },
            'FC7-4': { meat: 200000000, wood: 200000000, coal: 39000000, iron: 9900000 },
            'FC8':   { meat: 200000000, wood: 200000000, coal: 40000000, iron: 10000000 },
            'FC8-1': { meat: 210000000, wood: 210000000, coal: 41000000, iron: 10000000 },
            'FC8-2': { meat: 210000000, wood: 210000000, coal: 42000000, iron: 10000000 },
            'FC8-3': { meat: 210000000, wood: 210000000, coal: 42000000, iron: 11000000 },
            'FC8-4': { meat: 220000000, wood: 220000000, coal: 43000000, iron: 11000000 },
            'FC9':   { meat: 220000000, wood: 220000000, coal: 44000000, iron: 11000000 },
            'FC9-1': { meat: 220000000, wood: 220000000, coal: 45000000, iron: 11000000 },
            'FC9-2': { meat: 230000000, wood: 230000000, coal: 45000000, iron: 11000000 },
            'FC9-3': { meat: 230000000, wood: 230000000, coal: 46000000, iron: 12000000 },
            'FC9-4': { meat: 230000000, wood: 230000000, coal: 47000000, iron: 12000000 },
            'FC10':  { meat: 240000000, wood: 240000000, coal: 47000000, iron: 12000000 }
        },
        'Lancer Camp': {
            '30-1': { meat: 79000000, wood: 79000000, coal: 16000000, iron: 4000000 },
            '30-2': { meat: 82000000, wood: 82000000, coal: 16000000, iron: 4100000 },
            '30-3': { meat: 85000000, wood: 85000000, coal: 17000000, iron: 4200000 },
            '30-4': { meat: 88000000, wood: 88000000, coal: 17000000, iron: 4400000 },
            'FC1':   { meat: 91000000, wood: 91000000, coal: 18000000, iron: 4500000 },
            'FC1-1': { meat: 93000000, wood: 93000000, coal: 19000000, iron: 4700000 },
            'FC1-2': { meat: 96000000, wood: 96000000, coal: 19000000, iron: 4800000 },
            'FC1-3': { meat: 99000000, wood: 99000000, coal: 20000000, iron: 5000000 },
            'FC1-4': { meat: 100000000, wood: 100000000, coal: 20000000, iron: 5100000 },
            'FC2':   { meat: 100000000, wood: 100000000, coal: 21000000, iron: 5200000 },
            'FC2-1': { meat: 110000000, wood: 110000000, coal: 21000000, iron: 5400000 },
            'FC2-2': { meat: 110000000, wood: 110000000, coal: 22000000, iron: 5500000 },
            'FC2-3': { meat: 110000000, wood: 110000000, coal: 23000000, iron: 5700000 },
            'FC2-4': { meat: 120000000, wood: 120000000, coal: 23000000, iron: 5800000 },
            'FC3':   { meat: 120000000, wood: 120000000, coal: 24000000, iron: 6000000 },
            'FC3-1': { meat: 120000000, wood: 120000000, coal: 25000000, iron: 6100000 },
            'FC3-2': { meat: 130000000, wood: 130000000, coal: 25000000, iron: 6300000 },
            'FC3-3': { meat: 130000000, wood: 130000000, coal: 26000000, iron: 6400000 },
            'FC3-4': { meat: 130000000, wood: 130000000, coal: 26000000, iron: 6600000 },
            'FC4':   { meat: 140000000, wood: 140000000, coal: 27000000, iron: 6800000 },
            'FC4-1': { meat: 140000000, wood: 140000000, coal: 28000000, iron: 6900000 },
            'FC4-2': { meat: 140000000, wood: 140000000, coal: 28000000, iron: 7100000 },
            'FC4-3': { meat: 140000000, wood: 140000000, coal: 29000000, iron: 7200000 },
            'FC4-4': { meat: 150000000, wood: 150000000, coal: 29000000, iron: 7400000 },
            'FC5':   { meat: 150000000, wood: 150000000, coal: 30000000, iron: 7600000 },
            'FC5-1': { meat: 150000000, wood: 150000000, coal: 31000000, iron: 7700000 },
            'FC5-2': { meat: 160000000, wood: 160000000, coal: 31000000, iron: 7900000 },
            'FC5-3': { meat: 160000000, wood: 160000000, coal: 32000000, iron: 8100000 },
            'FC5-4': { meat: 160000000, wood: 160000000, coal: 33000000, iron: 8200000 },
            'FC6':   { meat: 170000000, wood: 170000000, coal: 33000000, iron: 8400000 },
            'FC6-1': { meat: 170000000, wood: 170000000, coal: 34000000, iron: 8600000 },
            'FC6-2': { meat: 170000000, wood: 170000000, coal: 35000000, iron: 8700000 },
            'FC6-3': { meat: 180000000, wood: 180000000, coal: 35000000, iron: 8900000 },
            'FC6-4': { meat: 180000000, wood: 180000000, coal: 36000000, iron: 9100000 },
            'FC7':   { meat: 190000000, wood: 190000000, coal: 37000000, iron: 9200000 },
            'FC7-1': { meat: 190000000, wood: 190000000, coal: 37000000, iron: 9400000 },
            'FC7-2': { meat: 190000000, wood: 190000000, coal: 38000000, iron: 9600000 },
            'FC7-3': { meat: 190000000, wood: 190000000, coal: 39000000, iron: 9700000 },
            'FC7-4': { meat: 200000000, wood: 200000000, coal: 39000000, iron: 9900000 },
            'FC8':   { meat: 200000000, wood: 200000000, coal: 40000000, iron: 10000000 },
            'FC8-1': { meat: 210000000, wood: 210000000, coal: 41000000, iron: 10000000 },
            'FC8-2': { meat: 210000000, wood: 210000000, coal: 42000000, iron: 10000000 },
            'FC8-3': { meat: 210000000, wood: 210000000, coal: 42000000, iron: 11000000 },
            'FC8-4': { meat: 220000000, wood: 220000000, coal: 43000000, iron: 11000000 },
            'FC9':   { meat: 220000000, wood: 220000000, coal: 44000000, iron: 11000000 },
            'FC9-1': { meat: 220000000, wood: 220000000, coal: 45000000, iron: 11000000 },
            'FC9-2': { meat: 230000000, wood: 230000000, coal: 45000000, iron: 11000000 },
            'FC9-3': { meat: 230000000, wood: 230000000, coal: 46000000, iron: 12000000 },
            'FC9-4': { meat: 230000000, wood: 230000000, coal: 47000000, iron: 12000000 },
            'FC10':  { meat: 240000000, wood: 240000000, coal: 47000000, iron: 12000000 }
        },
        'Marksman Camp': {
            '30-1': { meat: 79000000, wood: 79000000, coal: 16000000, iron: 4000000 },
            '30-2': { meat: 82000000, wood: 82000000, coal: 16000000, iron: 4100000 },
            '30-3': { meat: 85000000, wood: 85000000, coal: 17000000, iron: 4200000 },
            '30-4': { meat: 88000000, wood: 88000000, coal: 17000000, iron: 4400000 },
            'FC1':   { meat: 91000000, wood: 91000000, coal: 18000000, iron: 4500000 },
            'FC1-1': { meat: 93000000, wood: 93000000, coal: 19000000, iron: 4700000 },
            'FC1-2': { meat: 96000000, wood: 96000000, coal: 19000000, iron: 4800000 },
            'FC1-3': { meat: 99000000, wood: 99000000, coal: 20000000, iron: 5000000 },
            'FC1-4': { meat: 100000000, wood: 100000000, coal: 20000000, iron: 5100000 },
            'FC2':   { meat: 100000000, wood: 100000000, coal: 21000000, iron: 5200000 },
            'FC2-1': { meat: 110000000, wood: 110000000, coal: 21000000, iron: 5400000 },
            'FC2-2': { meat: 110000000, wood: 110000000, coal: 22000000, iron: 5500000 },
            'FC2-3': { meat: 110000000, wood: 110000000, coal: 23000000, iron: 5700000 },
            'FC2-4': { meat: 120000000, wood: 120000000, coal: 23000000, iron: 5800000 },
            'FC3':   { meat: 120000000, wood: 120000000, coal: 24000000, iron: 6000000 },
            'FC3-1': { meat: 120000000, wood: 120000000, coal: 25000000, iron: 6100000 },
            'FC3-2': { meat: 130000000, wood: 130000000, coal: 25000000, iron: 6300000 },
            'FC3-3': { meat: 130000000, wood: 130000000, coal: 26000000, iron: 6400000 },
            'FC3-4': { meat: 130000000, wood: 130000000, coal: 26000000, iron: 6600000 },
            'FC4':   { meat: 140000000, wood: 140000000, coal: 27000000, iron: 6800000 },
            'FC4-1': { meat: 140000000, wood: 140000000, coal: 28000000, iron: 6900000 },
            'FC4-2': { meat: 140000000, wood: 140000000, coal: 28000000, iron: 7100000 },
            'FC4-3': { meat: 140000000, wood: 140000000, coal: 29000000, iron: 7200000 },
            'FC4-4': { meat: 150000000, wood: 150000000, coal: 29000000, iron: 7400000 },
            'FC5':   { meat: 150000000, wood: 150000000, coal: 30000000, iron: 7600000 },
            'FC5-1': { meat: 150000000, wood: 150000000, coal: 31000000, iron: 7700000 },
            'FC5-2': { meat: 160000000, wood: 160000000, coal: 31000000, iron: 7900000 },
            'FC5-3': { meat: 160000000, wood: 160000000, coal: 32000000, iron: 8100000 },
            'FC5-4': { meat: 160000000, wood: 160000000, coal: 33000000, iron: 8200000 },
            'FC6':   { meat: 170000000, wood: 170000000, coal: 33000000, iron: 8400000 },
            'FC6-1': { meat: 170000000, wood: 170000000, coal: 34000000, iron: 8600000 },
            'FC6-2': { meat: 170000000, wood: 170000000, coal: 35000000, iron: 8700000 },
            'FC6-3': { meat: 180000000, wood: 180000000, coal: 35000000, iron: 8900000 },
            'FC6-4': { meat: 180000000, wood: 180000000, coal: 36000000, iron: 9100000 },
            'FC7':   { meat: 190000000, wood: 190000000, coal: 37000000, iron: 9200000 },
            'FC7-1': { meat: 190000000, wood: 190000000, coal: 37000000, iron: 9400000 },
            'FC7-2': { meat: 190000000, wood: 190000000, coal: 38000000, iron: 9600000 },
            'FC7-3': { meat: 190000000, wood: 190000000, coal: 39000000, iron: 9700000 },
            'FC7-4': { meat: 200000000, wood: 200000000, coal: 39000000, iron: 9900000 },
            'FC8':   { meat: 200000000, wood: 200000000, coal: 40000000, iron: 10000000 },
            'FC8-1': { meat: 210000000, wood: 210000000, coal: 41000000, iron: 10000000 },
            'FC8-2': { meat: 210000000, wood: 210000000, coal: 42000000, iron: 10000000 },
            'FC8-3': { meat: 210000000, wood: 210000000, coal: 42000000, iron: 11000000 },
            'FC8-4': { meat: 220000000, wood: 220000000, coal: 43000000, iron: 11000000 },
            'FC9':   { meat: 220000000, wood: 220000000, coal: 44000000, iron: 11000000 },
            'FC9-1': { meat: 220000000, wood: 220000000, coal: 45000000, iron: 11000000 },
            'FC9-2': { meat: 230000000, wood: 230000000, coal: 45000000, iron: 11000000 },
            'FC9-3': { meat: 230000000, wood: 230000000, coal: 46000000, iron: 12000000 },
            'FC9-4': { meat: 230000000, wood: 230000000, coal: 47000000, iron: 12000000 },
            'FC10':  { meat: 240000000, wood: 240000000, coal: 47000000, iron: 12000000 }
        },
        'Lancer Camp': {
            '30-1': { meat: 79000000, wood: 79000000, coal: 16000000, iron: 4000000 },
            '30-2': { meat: 82000000, wood: 82000000, coal: 16000000, iron: 4100000 },
            '30-3': { meat: 85000000, wood: 85000000, coal: 17000000, iron: 4200000 },
            '30-4': { meat: 88000000, wood: 88000000, coal: 17000000, iron: 4400000 },
            'FC1':   { meat: 91000000, wood: 91000000, coal: 18000000, iron: 4500000 },
            'FC1-1': { meat: 93000000, wood: 93000000, coal: 19000000, iron: 4700000 },
            'FC1-2': { meat: 96000000, wood: 96000000, coal: 19000000, iron: 4800000 },
            'FC1-3': { meat: 99000000, wood: 99000000, coal: 20000000, iron: 5000000 },
            'FC1-4': { meat: 100000000, wood: 100000000, coal: 20000000, iron: 5100000 },
            'FC2':   { meat: 100000000, wood: 100000000, coal: 21000000, iron: 5200000 },
            'FC2-1': { meat: 110000000, wood: 110000000, coal: 21000000, iron: 5400000 },
            'FC2-2': { meat: 110000000, wood: 110000000, coal: 22000000, iron: 5500000 },
            'FC2-3': { meat: 110000000, wood: 110000000, coal: 23000000, iron: 5700000 },
            'FC2-4': { meat: 120000000, wood: 120000000, coal: 23000000, iron: 5800000 },
            'FC3':   { meat: 120000000, wood: 120000000, coal: 24000000, iron: 6000000 },
            'FC3-1': { meat: 120000000, wood: 120000000, coal: 25000000, iron: 6100000 },
            'FC3-2': { meat: 130000000, wood: 130000000, coal: 25000000, iron: 6300000 },
            'FC3-3': { meat: 130000000, wood: 130000000, coal: 26000000, iron: 6400000 },
            'FC3-4': { meat: 130000000, wood: 130000000, coal: 26000000, iron: 6600000 },
            'FC4':   { meat: 140000000, wood: 140000000, coal: 27000000, iron: 6800000 },
            'FC4-1': { meat: 140000000, wood: 140000000, coal: 28000000, iron: 6900000 },
            'FC4-2': { meat: 140000000, wood: 140000000, coal: 28000000, iron: 7100000 },
            'FC4-3': { meat: 140000000, wood: 140000000, coal: 29000000, iron: 7200000 },
            'FC4-4': { meat: 150000000, wood: 150000000, coal: 29000000, iron: 7400000 },
            'FC5':   { meat: 150000000, wood: 150000000, coal: 30000000, iron: 7600000 },
            'FC5-1': { meat: 150000000, wood: 150000000, coal: 31000000, iron: 7700000 },
            'FC5-2': { meat: 160000000, wood: 160000000, coal: 31000000, iron: 7900000 },
            'FC5-3': { meat: 160000000, wood: 160000000, coal: 32000000, iron: 8100000 },
            'FC5-4': { meat: 160000000, wood: 160000000, coal: 33000000, iron: 8200000 },
            'FC6':   { meat: 170000000, wood: 170000000, coal: 33000000, iron: 8400000 },
            'FC6-1': { meat: 170000000, wood: 170000000, coal: 34000000, iron: 8600000 },
            'FC6-2': { meat: 170000000, wood: 170000000, coal: 35000000, iron: 8700000 },
            'FC6-3': { meat: 180000000, wood: 180000000, coal: 35000000, iron: 8900000 },
            'FC6-4': { meat: 180000000, wood: 180000000, coal: 36000000, iron: 9100000 },
            'FC7':   { meat: 190000000, wood: 190000000, coal: 37000000, iron: 9200000 },
            'FC7-1': { meat: 190000000, wood: 190000000, coal: 37000000, iron: 9400000 },
            'FC7-2': { meat: 190000000, wood: 190000000, coal: 38000000, iron: 9600000 },
            'FC7-3': { meat: 190000000, wood: 190000000, coal: 39000000, iron: 9700000 },
            'FC7-4': { meat: 200000000, wood: 200000000, coal: 39000000, iron: 9900000 },
            'FC8':   { meat: 200000000, wood: 200000000, coal: 40000000, iron: 10000000 },
            'FC8-1': { meat: 210000000, wood: 210000000, coal: 41000000, iron: 10000000 },
            'FC8-2': { meat: 210000000, wood: 210000000, coal: 42000000, iron: 10000000 },
            'FC8-3': { meat: 210000000, wood: 210000000, coal: 42000000, iron: 11000000 },
            'FC8-4': { meat: 220000000, wood: 220000000, coal: 43000000, iron: 11000000 },
            'FC9':   { meat: 220000000, wood: 220000000, coal: 44000000, iron: 11000000 },
            'FC9-1': { meat: 220000000, wood: 220000000, coal: 45000000, iron: 11000000 },
            'FC9-2': { meat: 230000000, wood: 230000000, coal: 45000000, iron: 11000000 },
            'FC9-3': { meat: 230000000, wood: 230000000, coal: 46000000, iron: 12000000 },
            'FC9-4': { meat: 230000000, wood: 230000000, coal: 47000000, iron: 12000000 },
            'FC10':  { meat: 240000000, wood: 240000000, coal: 47000000, iron: 12000000 }
        },
        'War Academy': {
            'FC1':   { meat: 55000000, wood: 55000000, coal: 11000000, iron: 2800000 },
            'FC1-1': { meat: 56000000, wood: 56000000, coal: 11000000, iron: 2800000 },
            'FC1-2': { meat: 58000000, wood: 58000000, coal: 12000000, iron: 2900000 },
            'FC1-3': { meat: 60000000, wood: 60000000, coal: 12000000, iron: 3000000 },
            'FC1-4': { meat: 61000000, wood: 61000000, coal: 12000000, iron: 3100000 },
            'FC2':   { meat: 63000000, wood: 63000000, coal: 13000000, iron: 3200000 },
            'FC2-1': { meat: 65000000, wood: 65000000, coal: 13000000, iron: 3300000 },
            'FC2-2': { meat: 66000000, wood: 66000000, coal: 13000000, iron: 3300000 },
            'FC2-3': { meat: 68000000, wood: 68000000, coal: 14000000, iron: 3400000 },
            'FC2-4': { meat: 70000000, wood: 70000000, coal: 14000000, iron: 3500000 },
            'FC3':   { meat: 72000000, wood: 72000000, coal: 14000000, iron: 3600000 },
            'FC3-1': { meat: 73000000, wood: 73000000, coal: 15000000, iron: 3700000 },
            'FC3-2': { meat: 75000000, wood: 75000000, coal: 15000000, iron: 3800000 },
            'FC3-3': { meat: 77000000, wood: 77000000, coal: 15000000, iron: 3900000 },
            'FC3-4': { meat: 79000000, wood: 79000000, coal: 16000000, iron: 4000000 },
            'FC4':   { meat: 81000000, wood: 81000000, coal: 16000000, iron: 4100000 },
            'FC4-1': { meat: 83000000, wood: 83000000, coal: 17000000, iron: 4200000 },
            'FC4-2': { meat: 85000000, wood: 85000000, coal: 17000000, iron: 4300000 },
            'FC4-3': { meat: 87000000, wood: 87000000, coal: 17000000, iron: 4400000 },
            'FC4-4': { meat: 89000000, wood: 89000000, coal: 18000000, iron: 4400000 },
            'FC5':   { meat: 90000000, wood: 90000000, coal: 18000000, iron: 4500000 },
            'FC5-1': { meat: 93000000, wood: 93000000, coal: 19000000, iron: 4700000 },
            'FC5-2': { meat: 95000000, wood: 95000000, coal: 19000000, iron: 4800000 },
            'FC5-3': { meat: 97000000, wood: 97000000, coal: 19000000, iron: 4900000 },
            'FC5-4': { meat: 99000000, wood: 99000000, coal: 20000000, iron: 5000000 },
            'FC6':   { meat: 100000000, wood: 100000000, coal: 20000000, iron: 5100000 },
            'FC6-1': { meat: 100000000, wood: 100000000, coal: 21000000, iron: 5200000 },
            'FC6-2': { meat: 100000000, wood: 100000000, coal: 21000000, iron: 5300000 },
            'FC6-3': { meat: 110000000, wood: 110000000, coal: 21000000, iron: 5400000 },
            'FC6-4': { meat: 110000000, wood: 110000000, coal: 22000000, iron: 5500000 },
            'FC7':   { meat: 110000000, wood: 110000000, coal: 22000000, iron: 5600000 },
            'FC7-1': { meat: 110000000, wood: 110000000, coal: 23000000, iron: 5700000 },
            'FC7-2': { meat: 110000000, wood: 110000000, coal: 23000000, iron: 5800000 },
            'FC7-3': { meat: 120000000, wood: 120000000, coal: 23000000, iron: 5900000 },
            'FC7-4': { meat: 120000000, wood: 120000000, coal: 24000000, iron: 6000000 },
            'FC8':   { meat: 120000000, wood: 120000000, coal: 24000000, iron: 6100000 },
            'FC8-1': { meat: 120000000, wood: 120000000, coal: 25000000, iron: 6200000 },
            'FC8-2': { meat: 130000000, wood: 130000000, coal: 25000000, iron: 6300000 },
            'FC8-3': { meat: 130000000, wood: 130000000, coal: 25000000, iron: 6400000 },
            'FC8-4': { meat: 130000000, wood: 130000000, coal: 26000000, iron: 6500000 },
            'FC9':   { meat: 130000000, wood: 130000000, coal: 26000000, iron: 6600000 },
            'FC9-1': { meat: 130000000, wood: 130000000, coal: 27000000, iron: 6700000 },
            'FC9-2': { meat: 140000000, wood: 140000000, coal: 27000000, iron: 6800000 },
            'FC9-3': { meat: 140000000, wood: 140000000, coal: 27000000, iron: 6900000 },
            'FC9-4': { meat: 140000000, wood: 140000000, coal: 28000000, iron: 7000000 },
            'FC10':  { meat: 140000000, wood: 140000000, coal: 28000000, iron: 7100000 }
        }
    };

    // Optional: CSV override for resource costs (F30 â†’ FC10 only)
    // Expected CSV header: building,level,meat,wood,coal,iron
    // Example level values: 30-1, 30-2, 30-3, 30-4, FC1, FC1-1, ..., FC9-4, FC10
    function getF30ToFC10Keys() {
        const keys = ['30-1', '30-2', '30-3', '30-4'];
        for (let n = 1; n <= 9; n++) {
            const base = `FC${n}`;
            keys.push(base);
            for (let s = 1; s <= 4; s++) keys.push(`${base}-${s}`);
        }
        keys.push('FC10');
        return new Set(keys);
    }

        function parseCsv(text) {
        const helper = window.WOSHelpers && window.WOSHelpers.csv;
        if (helper && typeof helper.parseCsv === 'function') {
            const parsed = helper.parseCsv(text);
            if (parsed && parsed.header && parsed.rows) {
                const header = parsed.header.map((h) => (h || '').toLowerCase());
                const getNum = (s) => {
                    const cleaned = String(s || '').replace(/[$�'�\s,]/g, '');
                    const n = parseInt(cleaned, 10);
                    return isNaN(n) ? 0 : n;
                };
                return parsed.rows.map((parts) => ({
                    building: (parts[header.indexOf('building')] || '').trim(),
                    level: (parts[header.indexOf('level')] || '').trim(),
                    meat: getNum(parts[header.indexOf('meat')]),
                    wood: getNum(parts[header.indexOf('wood')]),
                    coal: getNum(parts[header.indexOf('coal')]),
                    iron: getNum(parts[header.indexOf('iron')])
                }));
            }
        }

        const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
        if (lines.length === 0) return [];
        const header = lines[0].split(',').map(h => h.trim().toLowerCase());
        const idx = {
            building: header.indexOf('building'),
            level: header.indexOf('level'),
            meat: header.indexOf('meat'),
            wood: header.indexOf('wood'),
            coal: header.indexOf('coal'),
            iron: header.indexOf('iron')
        };
        if (Object.values(idx).some(v => v === -1)) return [];

        const rows = [];
        for (let i = 1; i < lines.length; i++) {
            const parts = lines[i].split(',');
            if (parts.length < header.length) continue;
            const getNum = (s) => {
                const cleaned = String(s || '').replace(/[$�'�\s,]/g, '');
                const n = parseInt(cleaned, 10);
                return isNaN(n) ? 0 : n;
            };
            const row = {
                building: (parts[idx.building] || '').trim(),
                level: (parts[idx.level] || '').trim(),
                meat: getNum(parts[idx.meat]),
                wood: getNum(parts[idx.wood]),
                coal: getNum(parts[idx.coal]),
                iron: getNum(parts[idx.iron])
            };
            rows.push(row);
        }
        return rows;
    }

        async function applyResourceOverridesFromCsv(url = 'assets/resource_costs.csv') {
        try {
            let rows = [];
            const loader = window.WOSData && window.WOSData.loader;
            if (loader && loader.loadCsv) {
                const parsed = await loader.loadCsv(url);
                if (parsed && parsed.header && parsed.rows) {
                    rows = parseCsv([parsed.header.join(','), ...parsed.rows.map(r => r.join(','))].join('\n'));
                }
            }
            if (!rows || rows.length === 0) {
                const res = await fetch(url, { cache: 'no-cache' });
                if (!res.ok) return;
                const text = await res.text();
                rows = parseCsv(text);
            }
            if (!rows || rows.length === 0) return;

            const allowed = getF30ToFC10Keys();
            let applied = 0;
            rows.forEach(({ building, level, meat, wood, coal, iron }) => {
                if (!building || !level) return;
                const b = building.trim();
                const k = level.trim();
                if (!allowed.has(k)) return;
                if (!buildingResourceCosts[b]) return;
                if (!buildingResourceCosts[b][k]) buildingResourceCosts[b][k] = { meat: 0, wood: 0, coal: 0, iron: 0 };
                buildingResourceCosts[b][k] = { meat, wood, coal, iron };
                applied++;
            });
            if (applied > 0) {
                console.info(`[FireCrystals] Applied ${applied} resource overrides from CSV (F30 -> FC10).`);
                try { calculateAll(); } catch (_) {}
            }
        } catch (e) {
            console.warn('[FireCrystals] Resource CSV override skipped:', e.message || e);
        }
    }

    /**
     * Validate that start level is not higher than finish level (simple rule: start <= finish)
     */
    function validateLevels(startSelect, finishSelect, levelsArray) {
        const startValue = startSelect.value;
        const finishValue = finishSelect.value;
        if (!startValue || !finishValue) return;

        const startIndex = levelsArray.indexOf(startValue);
        const finishIndex = levelsArray.indexOf(finishValue);
        if (startIndex === -1) return;

        // Only constrain finish based on start: disable all finish options before the selected start
        Array.from(finishSelect.options).forEach((option) => {
            const optionIndex = levelsArray.indexOf(option.value);
            option.disabled = optionIndex !== -1 && optionIndex < startIndex;
        });

        // If current finish is before start, snap it to start to keep start <= finish
        if (finishIndex !== -1 && finishIndex < startIndex) {
            finishSelect.value = startValue;
        }
    }

    /**
     * Get the level array for a specific building
     */
    function getLevelsForBuilding(buildingName) {
        if (buildingName === 'Furnace') return FURNACE_LEVELS;
        if (buildingName === 'War Academy') return WAR_ACADEMY_LEVELS;
        return BUILDING_LEVELS;
    }

    /**
     * Populate start/finish selects with the correct level list
     */
    function populateBuildingSelectOptions(buildingName) {
        const buildingId = buildingName.toLowerCase().replace(/ /g, '-');
        const startSelect = document.getElementById(`${buildingId}-start`);
        const finishSelect = document.getElementById(`${buildingId}-finish`);
        if (!startSelect || !finishSelect) return;

        const levels = getLevelsForBuilding(buildingName);

        const makeOptions = (selectedValue, isFinish) => {
            let html = '';
            levels.forEach(lvl => {
                const selected = (selectedValue ? selectedValue === lvl : (isFinish ? lvl === 'FC10' : lvl === levels[0]));
                html += `<option value="${lvl}"${selected ? ' selected' : ''}>${lvl}</option>`;
            });
            return html;
        };

        const prevStart = startSelect.value;
        const prevFinish = finishSelect.value;
        startSelect.innerHTML = makeOptions(prevStart, false);
        finishSelect.innerHTML = makeOptions(prevFinish, true);

        // Validate once after population
        validateLevels(startSelect, finishSelect, levels);
    }

    /**
     * Normalize a level id to its base (major) level key.
     * Examples: "FC9-1" -> "FC9", "30-1" -> "F30"
     */
    function getBaseLevel(levelId) {
        if (!levelId) return levelId;
        const base = levelId.split('-')[0];
        if (base === '30') return 'F30';
        if (/^\d+$/.test(base)) return `F${base}`;
        return base;
    }

    /**
     * Count how many upgrade steps (edges) exist for each base level.
     * Steps are counted on edges where the CURRENT level shares the base.
     */
    // --- Per-step Fire Crystal dataset (from fire_crystals_steps.json) ---
    let fireCrystalStepsCache = null;

    async function loadFireCrystalSteps() {
        if (fireCrystalStepsCache) return fireCrystalStepsCache;
        try {
            const res = await fetch('assets/fire_crystals_steps.json', { cache: 'no-cache' });
            if (!res.ok) {
                console.warn('[FireCrystals] Failed to load fire_crystals_steps.json');
                return null;
            }
            const data = await res.json();
            fireCrystalStepsCache = data;
            return data;
        } catch (e) {
            console.error('[FireCrystals] Error loading fire_crystals_steps.json', e);
            return null;
        }
    }

    function getStepsByBuilding(data) {
        const map = {};
        (data || []).forEach((row) => {
            if (!row.building) return;
            if (!map[row.building]) map[row.building] = [];
            map[row.building].push(row);
        });
        // Sort by orderIndex then levelId for stability
        Object.keys(map).forEach((b) => {
            map[b].sort((a, b) => {
                if (a.orderIndex !== b.orderIndex) return a.orderIndex - b.orderIndex;
                return a.levelId.localeCompare(b.levelId);
            });
        });
        return map;
    }

    /**
     * Compute totals for Fire Crystal upgrades using real per-step data.
     */
    async function computeFireCrystalsUpgrade(buildingId, fromId, toId) {
        const stepsData = await loadFireCrystalSteps();
        if (!stepsData) return null;
        const byBuilding = getStepsByBuilding(stepsData);
        const steps = byBuilding[buildingId];
        if (!steps || steps.length === 0) {
            console.warn('[FireCrystals] No step data for building', buildingId);
            return null;
        }

        const fromIndex = steps.findIndex((s) => s.levelId === fromId);
        const toIndex = steps.findIndex((s) => s.levelId === toId);
        if (fromIndex === -1 || toIndex === -1) {
            console.warn('[FireCrystals] Level not found in step data', { buildingId, fromId, toId });
            return null;
        }
        if (toIndex <= fromIndex) {
            return {
                totalFc: 0,
                totalRfc: 0,
                totalTimeSeconds: 0,
                totalMeat: 0,
                totalWood: 0,
                totalCoal: 0,
                totalIron: 0
            };
        }

        const totals = {
            totalFc: 0,
            totalRfc: 0,
            totalTimeSeconds: 0,
            totalMeat: 0,
            totalWood: 0,
            totalCoal: 0,
            totalIron: 0
        };

        if (FC_DEBUG) {
            console.debug('[FC DEBUG] computeFireCrystalsUpgrade', { buildingId, fromId, toId, steps: steps.length, fromIndex, toIndex });
        }

        for (let i = fromIndex + 1; i <= toIndex; i++) {
            const step = steps[i];
            if (!step) continue;
            totals.totalFc += step.fc || 0;
            totals.totalRfc += step.rfc || 0;
            totals.totalTimeSeconds += step.timeSeconds || 0;
            totals.totalMeat += step.meat || 0;
            totals.totalWood += step.wood || 0;
            totals.totalCoal += step.coal || 0;
            totals.totalIron += step.iron || 0;
        }

        if (FC_DEBUG) {
            console.debug('[FC DEBUG] totals', totals);
        }

        return totals;
    }

    /**
     * Calculate costs for a single building upgrade path
     * Now uses CSV data from Excel sheets
     */
    async function calculateBuildingCosts(buildingName, fromLevel, toLevel) {
        if (!fromLevel || !toLevel) return null;

        const levelsArray = getLevelsForBuilding(buildingName);
        const fromIndex = levelsArray.indexOf(fromLevel);
        const toIndex = levelsArray.indexOf(toLevel);

        if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex) {
            console.warn('[FireCrystals] Invalid level range', { buildingName, fromLevel, toLevel });
            return null;
        }

    const totals = await computeFireCrystalsUpgrade(buildingName, fromLevel, toLevel);
    if (!totals) return null;

    return {
        normalFC: totals.totalFc,
        refineFC: totals.totalRfc,
        time: totals.totalTimeSeconds,
        meat: totals.totalMeat,
        wood: totals.totalWood,
        coal: totals.totalCoal,
        iron: totals.totalIron
    };
    }

    /**
     * Format time in seconds to days, hours, minutes
     */
    function formatTime(seconds) {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return { days, hours, minutes };
    }

    /**
     * Calculate adjusted time with speed bonus
     * Uses the game's diminishing returns formula: finalValue = baseValue * (100 / (100 + bonusPercent))
     */
    function calculateAdjustedTime(totalSeconds, speedBonus) {
        const adjustedSeconds = totalSeconds * (100 / (100 + speedBonus));
        return adjustedSeconds;
    }

    // Built-in fallback removed: embedded flat data is authoritative

    /**
     * Main calculation function
     */
    async function calculateAll() {
        const results = {};
        let totalNormalFC = 0;
        let totalRefineFC = 0;
        let totalTime = 0;
        let totalMeat = 0, totalWood = 0, totalCoal = 0, totalIron = 0;
        const zinmanLevel = parseInt(document.getElementById('zinman-level')?.value || 0, 10) || 0;

        // Calculate for each building
        for (const building of BUILDINGS) {
            const buildingId = building.toLowerCase().replace(/ /g, '-');
            const startSelect = document.getElementById(`${buildingId}-start`);
            const finishSelect = document.getElementById(`${buildingId}-finish`);

            if (!startSelect || !finishSelect) continue;

            const fromVal = startSelect.value;
            const toVal = finishSelect.value;
            let costs = await calculateBuildingCosts(building, fromVal, toVal);
            
            if (costs) {
                const reduced = applyZinmanReductionToResources(costs, zinmanLevel);
                results[building] = { ...reduced, from: fromVal, to: toVal };
                totalNormalFC += reduced.normalFC;
                totalRefineFC += reduced.refineFC;
                totalTime += reduced.time;
                totalMeat += reduced.meat || 0;
                totalWood += reduced.wood || 0;
                totalCoal += reduced.coal || 0;
                totalIron += reduced.iron || 0;
            }
        }

        // Get inventory
    const inventoryFC = parseInt(document.getElementById('inventory-fire-crystals')?.value || 0);
    const inventoryRFC = parseInt(document.getElementById('inventory-refine-crystals')?.value || 0);
    const inventorySpeedupDays = parseInt(document.getElementById('inventory-speedup-days')?.value || 0);
    const constructionSpeed = parseInt(document.getElementById('inventory-construction-speed')?.value || 0);
    const inventoryMeat = parseInt(document.getElementById('inventory-meat')?.value || 0);
    const inventoryWood = parseInt(document.getElementById('inventory-wood')?.value || 0);
    const inventoryCoal = parseInt(document.getElementById('inventory-coal')?.value || 0);
    const inventoryIron = parseInt(document.getElementById('inventory-iron')?.value || 0);

        // Calculate adjusted time
        const adjustedTime = calculateAdjustedTime(totalTime, constructionSpeed);
        const inventorySpeedupSeconds = inventorySpeedupDays * 86400;

        displayResults({
            totalNormalFC,
            totalRefineFC,
            totalTime,
            adjustedTime,
            inventoryFC,
            inventoryRFC,
            inventorySpeedupSeconds,
            constructionSpeed,
            totalMeat,
            totalWood,
            totalCoal,
            totalIron,
            inventoryMeat,
            inventoryWood,
            inventoryCoal,
            inventoryIron
        }, results);
    }

    /**
     * Display calculation results with translations
     */
    function displayResults(totals, buildingResults) {
        const resultsDisplay = document.getElementById('results-display');
        if (!resultsDisplay) return;

        const lang = window.I18n ? window.I18n.getCurrentLanguage() : 'en';
        const t = window.I18n ? window.I18n.t : (key) => key;

        // Icon helper for resources (delegates to shared helpers when available)
        function labelWithIcon(key, overrideText) {
            const icons = window.WOSHelpers && window.WOSHelpers.icons;
            if (icons && typeof icons.label === 'function') {
                return icons.label(key, overrideText ? () => overrideText : (k) => t(k));
            }
            if (window.IconHelper && typeof window.IconHelper.label === 'function') {
                // If a short label override is provided (e.g., FC/RFC), use it
                if (overrideText) {
                    const shortT = () => overrideText;
                    return window.IconHelper.label(key, shortT);
                }
                return window.IconHelper.label(key, t);
            }
            // Fallback for when IconHelper isn't loaded
            const urlMap = {
                'fire-crystals': 'assets/resources/base/fire-crystals.png',
                'refine-crystals': 'assets/resources/base/refine-crystals.png',
                meat: 'assets/resources/base/meat.png',
                wood: 'assets/resources/base/wood.png',
                coal: 'assets/resources/base/coal.png',
                iron: 'assets/resources/base/iron.png'
            };
            const url = urlMap[key];
            const text = overrideText || t(key);
            if (!url) return text;
            return `<img class="res-icon" src="${url}" alt="${text}" onerror="this.style.display='none'"> ${text}`;
        }

        let html = '';

        // Base resources first (these will occupy the first grid rows)
        const hasCalc = (totals.totalTime || 0) > 0 || (totals.totalNormalFC || 0) > 0 || (totals.totalRefineFC || 0) > 0 ||
                        (totals.totalMeat || 0) > 0 || (totals.totalWood || 0) > 0 || (totals.totalCoal || 0) > 0 || (totals.totalIron || 0) > 0;

        const meatGap = (totals.totalMeat || 0) - (totals.inventoryMeat || 0);
        const meatGapClass = meatGap > 0 ? 'deficit' : 'surplus';
        const meatGapText = meatGap > 0 
            ? t('gap-need-more', lang).replace('%d', formatNumberLocale(Math.abs(meatGap)))
            : t('gap-have-left', lang).replace('%d', formatNumberLocale(Math.abs(meatGap)));
        html += `<div class="total-item">
            <span class="resource-label">${labelWithIcon('meat')}:</span>
            <span class="resource-value">${formatNumberLocale(totals.totalMeat || 0)}</span>
            ${hasCalc ? `<span class="gap ${meatGapClass}">${meatGapText}</span>` : ''}
        </div>`;

        const woodGap = (totals.totalWood || 0) - (totals.inventoryWood || 0);
        const woodGapClass = woodGap > 0 ? 'deficit' : 'surplus';
        const woodGapText = woodGap > 0 
            ? t('gap-need-more', lang).replace('%d', formatNumberLocale(Math.abs(woodGap)))
            : t('gap-have-left', lang).replace('%d', formatNumberLocale(Math.abs(woodGap)));
        html += `<div class="total-item">
            <span class="resource-label">${labelWithIcon('wood')}:</span>
            <span class="resource-value">${formatNumberLocale(totals.totalWood || 0)}</span>
            ${hasCalc ? `<span class="gap ${woodGapClass}">${woodGapText}</span>` : ''}
        </div>`;

        const coalGap = (totals.totalCoal || 0) - (totals.inventoryCoal || 0);
        const coalGapClass = coalGap > 0 ? 'deficit' : 'surplus';
        const coalGapText = coalGap > 0 
            ? t('gap-need-more', lang).replace('%d', formatNumberLocale(Math.abs(coalGap)))
            : t('gap-have-left', lang).replace('%d', formatNumberLocale(Math.abs(coalGap)));
        html += `<div class="total-item">
            <span class="resource-label">${labelWithIcon('coal')}:</span>
            <span class="resource-value">${formatNumberLocale(totals.totalCoal || 0)}</span>
            ${hasCalc ? `<span class="gap ${coalGapClass}">${coalGapText}</span>` : ''}
        </div>`;

        const ironGap = (totals.totalIron || 0) - (totals.inventoryIron || 0);
        const ironGapClass = ironGap > 0 ? 'deficit' : 'surplus';
        const ironGapText = ironGap > 0 
            ? t('gap-need-more', lang).replace('%d', formatNumberLocale(Math.abs(ironGap)))
            : t('gap-have-left', lang).replace('%d', formatNumberLocale(Math.abs(ironGap)));
        html += `<div class="total-item">
            <span class="resource-label">${labelWithIcon('iron')}:</span>
            <span class="resource-value">${formatNumberLocale(totals.totalIron || 0)}</span>
            ${hasCalc ? `<span class="gap ${ironGapClass}">${ironGapText}</span>` : ''}
        </div>`;

        

        // Fire/Refine Crystals after basic resources
        const fcGap = totals.totalNormalFC - totals.inventoryFC;
        const fcGapClass = fcGap > 0 ? 'deficit' : 'surplus';
        const fcGapText = fcGap > 0 
            ? t('gap-need-more', lang).replace('%d', formatNumberLocale(Math.abs(fcGap)))
            : t('gap-have-left', lang).replace('%d', formatNumberLocale(Math.abs(fcGap)));

        html += `<div class="total-item">
            <span class="resource-label">${labelWithIcon('fire-crystals')}:</span>
            <span class="resource-value">${formatNumberLocale(totals.totalNormalFC)}</span>
            ${hasCalc ? `<span class="gap ${fcGapClass}">${fcGapText}</span>` : ''}
        </div>`;

        const rfcGap = totals.totalRefineFC - totals.inventoryRFC;
        const rfcGapClass = rfcGap > 0 ? 'deficit' : 'surplus';
        const rfcGapText = rfcGap > 0 
            ? t('gap-need-more', lang).replace('%d', formatNumberLocale(Math.abs(rfcGap)))
            : t('gap-have-left', lang).replace('%d', formatNumberLocale(Math.abs(rfcGap)));

        html += `<div class="total-item">
            <span class="resource-label">${labelWithIcon('refine-crystals')}:</span>
            <span class="resource-value">${formatNumberLocale(totals.totalRefineFC)}</span>
            ${hasCalc ? `<span class="gap ${rfcGapClass}">${rfcGapText}</span>` : ''}
        </div>`;

        

        // Total construction time
        const totalTimeFormatted = formatTime(totals.totalTime);
        html += `<div class="total-item">
            <span class="resource-label">${t('total-time', lang)}:</span>
            <span class="resource-value">${totalTimeFormatted.days}d ${totalTimeFormatted.hours}h ${totalTimeFormatted.minutes}m</span>
        </div>`;

        // Adjusted time with speed bonus
        if (totals.constructionSpeed > 0) {
            const adjustedTimeFormatted = formatTime(totals.adjustedTime);
            html += `<div class="total-item">
                <span class="resource-label">${t('total-reduced-time', lang)}:</span>
                <span class="resource-value">${adjustedTimeFormatted.days}d ${adjustedTimeFormatted.hours}h ${adjustedTimeFormatted.minutes}m</span>
            </div>`;
        }

        // Speedup days comparison - only show gap message if calculations were made
        const timeGap = totals.adjustedTime - totals.inventorySpeedupSeconds;
        const timeGapFormatted = formatTime(Math.abs(timeGap));
        const timeGapClass = timeGap > 0 ? 'deficit' : 'surplus';
        const timeGapText = timeGap > 0 
            ? t('gap-time-need-more', lang).replace('%dd %dh %dm', `${timeGapFormatted.days}d ${timeGapFormatted.hours}h ${timeGapFormatted.minutes}m`)
            : t('gap-time-have-left', lang).replace('%dd %dh %dm', `${timeGapFormatted.days}d ${timeGapFormatted.hours}h ${timeGapFormatted.minutes}m`);

        html += `<div class="total-item">
            <span class="resource-label">${t('speedup-days', lang)}:</span>
            <span class="resource-value">${(totals.adjustedTime / 86400).toFixed(1)} days</span>
            ${hasCalc ? `<span class="gap ${timeGapClass}">${timeGapText}</span>` : ''}
        </div>`;
        
        // Calculate SVS points: 1 FC = 2000 points, 1 RFC = 30000 points, 1m speedup = 30 points
        const fcPoints = totals.totalNormalFC * 2000;
        const rfcPoints = totals.totalRefineFC * 30000;
        const speedupMinutes = totals.adjustedTime / 60; // Convert seconds to minutes
        const speedupPoints = speedupMinutes * 30;
        const totalSVSPoints = fcPoints + rfcPoints + speedupPoints;

        html += `<div class="total-item">
            <span class="resource-label">${t('svs-points-fc', lang)}:</span>
            <span class="resource-value">${formatNumberLocale(Math.floor(fcPoints))}</span>
        </div>`;

        html += `<div class="total-item">
            <span class="resource-label">${t('svs-points-rfc', lang)}:</span>
            <span class="resource-value">${formatNumberLocale(Math.floor(rfcPoints))}</span>
        </div>`;

        html += `<div class="total-item">
            <span class="resource-label">${t('svs-points-speedup', lang)}:</span>
            <span class="resource-value">${formatNumberLocale(Math.floor(speedupPoints))}</span>
        </div>`;

        html += `<div class="total-item">
            <span class="resource-label"><strong>${t('total-svs-points', lang)}:</strong></span>
            <span class="resource-value"><strong>${formatNumberLocale(Math.floor(totalSVSPoints))}</strong></span>
        </div>`;

        

                // Building breakdown - table like Charms slots
                if (Object.keys(buildingResults).length > 0) {
                        const rows = Object.entries(buildingResults).map(([building, costs]) => {
                                const tf = formatTime(costs.time || 0);
                                return `<tr>
                                        <td>${t(building, lang)}</td>
                                        <td>${costs.from || ''}</td>
                                        <td>${costs.to || ''}</td>
                                    <td>${formatCompact(Number(costs.normalFC || 0))}</td>
                                    <td>${formatCompact(Number(costs.refineFC || 0))}</td>
                                    <td>${formatCompact(Number(costs.meat || 0))}</td>
                                    <td>${formatCompact(Number(costs.wood || 0))}</td>
                                    <td>${formatCompact(Number(costs.coal || 0))}</td>
                                    <td>${formatCompact(Number(costs.iron || 0))}</td>
                                        <td>${tf.days}d ${tf.hours}h ${tf.minutes}m</td>
                                </tr>`;
                        }).join('');

                        const totalTf = formatTime(totals.totalTime || 0);
                        const buildingHeaderLabel = (t('building', lang) || 'Building');
                        const buildingHeaderText = buildingHeaderLabel.charAt(0).toUpperCase() + buildingHeaderLabel.slice(1);
                        html += `
                        <div class="results-wrap">
                            <h3>${t('building-breakdown', lang)}</h3>
                            <table class="results-table" aria-live="polite">
                                <thead>
                                    <tr>
                                        <th data-key="slot">${buildingHeaderText}</th>
                                        <th data-key="from">${t('from', lang)}</th>
                                        <th data-key="to">${t('to', lang)}</th>
                                        <th data-key="fc">${labelWithIcon('fire-crystals', 'FC')}</th>
                                        <th data-key="rfc">${labelWithIcon('refine-crystals', 'RFC')}</th>
                                        <th data-key="meat">${labelWithIcon('meat')}</th>
                                        <th data-key="wood">${labelWithIcon('wood')}</th>
                                        <th data-key="coal">${labelWithIcon('coal')}</th>
                                        <th data-key="iron">${labelWithIcon('iron')}</th>
                                        <th data-key="time">${t('total-time', lang)}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${rows}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colspan="3">${t('totals', lang)}</td>
                                        <td>${formatCompact(Number(totals.totalNormalFC || 0))}</td>
                                        <td>${formatCompact(Number(totals.totalRefineFC || 0))}</td>
                                        <td>${formatCompact(Number(totals.totalMeat || 0))}</td>
                                        <td>${formatCompact(Number(totals.totalWood || 0))}</td>
                                        <td>${formatCompact(Number(totals.totalCoal || 0))}</td>
                                        <td>${formatCompact(Number(totals.totalIron || 0))}</td>
                                        <td>${totalTf.days}d ${totalTf.hours}h ${totalTf.minutes}m</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>`;
                }

        resultsDisplay.innerHTML = html;
        // Make breakdown table sortable if present
        try {
            const table = resultsDisplay.querySelector('.results-table');
            if (table && typeof TableSortModule !== 'undefined') {
                TableSortModule.makeTableSortable(table);
            }
        } catch(_) {}
    }

    /**
     * Legacy initializer: binds DOM events and runs calculations.
     */
    async function legacyInit() {
        // Add event listeners to all building selects
        BUILDINGS.forEach(building => {
            const buildingId = building.toLowerCase().replace(/ /g, '-');
            const startSelect = document.getElementById(`${buildingId}-start`);
            const finishSelect = document.getElementById(`${buildingId}-finish`);

            if (startSelect && finishSelect) {
                const levelsArray = getLevelsForBuilding(building);
                
                // Populate options if empty or incomplete
                if (!startSelect.options.length || !finishSelect.options.length) {
                    populateBuildingSelectOptions(building);
                }

                startSelect.addEventListener('change', () => {
                    validateLevels(startSelect, finishSelect, levelsArray);
                    calculateAll();
                });

                finishSelect.addEventListener('change', () => {
                    validateLevels(startSelect, finishSelect, levelsArray);
                    calculateAll();
                });
            }
        });

        // Add event listeners to inventory inputs
        const inventoryInputs = [
            'inventory-fire-crystals',
            'inventory-refine-crystals',
            'inventory-speedup-days',
            'inventory-construction-speed',
            'inventory-meat',
            'inventory-wood',
            'inventory-coal',
            'inventory-iron',
            'zinman-level'
        ];

        inventoryInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                const evt = id === 'zinman-level' ? 'change' : 'input';
                input.addEventListener(evt, calculateAll);
            }
        });

        // Safety net: recalc on any building select change (delegated)
        document.addEventListener('change', (e) => {
            const el = e.target;
            if (el && el.classList && el.classList.contains('building-select')) {
                try { calculateAll(); } catch (_) {}
            }
        });

        // Fallback: recalc on any level select change (even if IDs change or were not wired above)
        const levelSelects = document.querySelectorAll('select[id$="-start"], select[id$="-finish"]');
        levelSelects.forEach(sel => {
            sel.addEventListener('change', () => {
                try { calculateAll(); } catch (_) {}
            });
        });

        // Recalculate once CSV data loads/refreshes
        try { window.addEventListener('fc-data-ready', () => { try { calculateAll(); } catch (_) {} }); } catch(_) {}

        // Try to apply CSV overrides for resource costs (F30 â†’ FC10)
        // This will re-run calculateAll once applied.
        applyResourceOverridesFromCsv().then(() => {
            // Initial calculation after potential overrides
            calculateAll();
        });

        // If CSV is missing, ensure we still render once at start after event wiring
        setTimeout(() => {
            try { calculateAll(); } catch (_) {}
        }, 0);
    }

    /**
     * Initialize the calculator (loads shared modules, then delegates to UI module or legacy init)
     */
    async function init() {
        await ensureModules();
        const ui = window.WOS && window.WOS.ui && window.WOS.ui.fireCrystals;
        if (ui && typeof ui.initPage === 'function') {
            return ui.initPage({ legacyInit });
        }
        return legacyInit();
    }

    // Public API
    window.FireCrystalsCalculator = {
        calculateAll: calculateAll,
        validateLevels: validateLevels,
        getLevelsForBuilding: getLevelsForBuilding,
        init: init,
        legacyInit: legacyInit
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();


