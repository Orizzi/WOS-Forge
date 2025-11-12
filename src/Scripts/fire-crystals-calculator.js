(function() {
    'use strict';

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
            '30-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            '30-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            '30-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            '30-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC1':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC1-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC1-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC1-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC1-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC2':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC2-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC2-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC2-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC2-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC3':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC3-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC3-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC3-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC3-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC4':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC4-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC4-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC4-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC4-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC5':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC5-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC5-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC5-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC5-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC6':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC6-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC6-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC6-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC6-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC7':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC7-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC7-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC7-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC7-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC8':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC8-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC8-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC8-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC8-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC9':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC9-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC9-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC9-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC9-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC10':  { meat: 0, wood: 0, coal: 0, iron: 0 }
        },
        'Command Center': {
            '30-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            '30-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            '30-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            '30-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC1':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC1-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC1-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC1-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC1-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC2':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC2-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC2-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC2-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC2-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC3':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC3-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC3-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC3-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC3-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC4':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC4-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC4-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC4-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC4-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC5':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC5-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC5-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC5-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC5-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC6':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC6-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC6-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC6-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC6-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC7':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC7-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC7-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC7-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC7-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC8':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC8-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC8-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC8-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC8-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC9':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC9-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC9-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC9-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC9-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC10':  { meat: 0, wood: 0, coal: 0, iron: 0 }
        },
        'Infirmary': {
            '30-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            '30-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            '30-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            '30-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC1':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC1-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC1-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC1-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC1-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC2':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC2-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC2-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC2-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC2-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC3':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC3-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC3-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC3-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC3-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC4':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC4-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC4-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC4-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC4-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC5':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC5-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC5-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC5-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC5-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC6':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC6-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC6-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC6-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC6-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC7':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC7-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC7-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC7-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC7-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC8':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC8-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC8-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC8-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC8-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC9':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC9-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC9-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC9-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC9-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC10':  { meat: 0, wood: 0, coal: 0, iron: 0 }
        },
        'Infantry Camp': {
            '30-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            '30-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            '30-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            '30-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC1':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC1-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC1-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC1-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC1-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC2':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC2-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC2-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC2-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC2-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC3':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC3-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC3-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC3-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC3-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC4':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC4-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC4-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC4-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC4-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC5':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC5-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC5-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC5-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC5-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC6':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC6-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC6-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC6-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC6-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC7':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC7-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC7-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC7-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC7-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC8':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC8-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC8-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC8-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC8-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC9':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC9-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC9-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC9-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC9-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC10':  { meat: 0, wood: 0, coal: 0, iron: 0 }
        },
        'Marksman Camp': {
            '30-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            '30-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            '30-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            '30-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC1':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC1-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC1-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC1-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC1-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC2':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC2-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC2-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC2-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC2-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC3':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC3-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC3-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC3-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC3-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC4':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC4-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC4-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC4-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC4-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC5':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC5-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC5-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC5-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC5-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC6':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC6-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC6-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC6-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC6-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC7':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC7-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC7-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC7-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC7-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC8':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC8-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC8-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC8-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC8-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC9':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC9-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC9-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC9-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC9-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC10':  { meat: 0, wood: 0, coal: 0, iron: 0 }
        },
        'Lancer Camp': {
            '30-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            '30-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            '30-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            '30-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC1':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC1-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC1-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC1-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC1-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC2':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC2-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC2-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC2-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC2-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC3':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC3-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC3-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC3-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC3-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC4':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC4-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC4-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC4-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC4-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC5':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC5-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC5-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC5-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC5-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC6':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC6-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC6-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC6-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC6-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC7':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC7-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC7-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC7-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC7-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC8':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC8-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC8-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC8-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC8-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC9':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC9-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC9-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC9-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC9-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC10':  { meat: 0, wood: 0, coal: 0, iron: 0 }
        },
        'War Academy': {
            'FC1-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC1-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC1-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC1-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC2':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC2-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC2-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC2-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC2-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC3':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC3-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC3-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC3-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC3-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC4':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC4-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC4-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC4-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC4-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC5':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC5-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC5-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC5-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC5-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC6':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC6-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC6-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC6-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC6-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC7':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC7-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC7-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC7-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC7-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC8':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC8-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC8-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC8-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC8-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC9':   { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC9-1': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC9-2': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC9-3': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC9-4': { meat: 0, wood: 0, coal: 0, iron: 0 },
            'FC10':  { meat: 0, wood: 0, coal: 0, iron: 0 }
        }
    };

    /**
     * Validate that current level is not higher than desired level
     */
    function validateLevels(currentSelect, desiredSelect, levelsArray) {
        const currentValue = currentSelect.value;
        const desiredValue = desiredSelect.value;

        if (!currentValue || !desiredValue) return;

        const currentIndex = levelsArray.indexOf(currentValue);
        const desiredIndex = levelsArray.indexOf(desiredValue);

        if (currentIndex > desiredIndex) {
            currentSelect.value = desiredValue;
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
     * Calculate costs for a single building upgrade path
     */
    function calculateBuildingCosts(buildingName, fromLevel, toLevel) {
        if (!fromLevel || !toLevel) return null;

        const levelsArray = getLevelsForBuilding(buildingName);
        const fromIndex = levelsArray.indexOf(fromLevel);
        const toIndex = levelsArray.indexOf(toLevel);

        if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex) {
            return null;
        }

        const buildingData = fireCrystalCosts[buildingName];
        let totalNormalFC = 0;
        let totalRefineFC = 0;
        let totalTime = 0;
        let totalMeat = 0, totalWood = 0, totalCoal = 0, totalIron = 0;

        // Calculate costs for each step in the range
        for (let i = fromIndex; i < toIndex; i++) {
            const currentLevel = levelsArray[i];
            const nextLevel = levelsArray[i + 1];
            
            // Determine the base level (major level without sub-step suffix)
            const baseCurrent = currentLevel.includes('-') ? currentLevel.split('-')[0] : currentLevel;
            const levelData = buildingData[baseCurrent];

            if (!levelData) continue;

            // Add time for this major level (only once per major level transition)
            // Time is added when transitioning FROM a major level (e.g., F30 → 30-1) or when already at last sub-step
            if (!currentLevel.includes('-')) {
                totalTime += levelData.time || 0;
            }

            // Determine the upgrade key for this specific step
            let upgradeKey = '';
            
            if (currentLevel.includes('-')) {
                // We're at a sub-level (e.g., 30-1, 30-2, etc.)
                const subStep = currentLevel.split('-')[1]; // '1', '2', '3', or '4'
                upgradeKey = subStep;
            } else {
                // We're at a major level (e.g., F30, FC1, etc.)
                // Determine what the next major level will be
                const nextBase = nextLevel.includes('-') ? nextLevel.split('-')[0] : nextLevel;
                
                if (nextBase === baseCurrent) {
                    // Transitioning to first sub-level (e.g., F30 → 30-1)
                    upgradeKey = '1';
                } else {
                    // Transitioning to next major level (e.g., 30-4 → FC1)
                    upgradeKey = 'to' + nextBase;
                }
            }

            // Add fire crystals based on level structure
            if (levelData.normal) {
                // FC5+ levels: use normal/refine structure
                totalNormalFC += levelData.normal[upgradeKey] || 0;
                totalRefineFC += (levelData.refine && levelData.refine[upgradeKey]) || 0;
            } else {
                // Pre-FC5 levels: direct properties
                totalNormalFC += levelData[upgradeKey] || 0;
            }

            // Add base resources using the nextLevel key
            const resMap = buildingResourceCosts[buildingName] && buildingResourceCosts[buildingName][nextLevel];
            if (resMap) {
                totalMeat += resMap.meat || 0;
                totalWood += resMap.wood || 0;
                totalCoal += resMap.coal || 0;
                totalIron += resMap.iron || 0;
            }
        }

        return {
            normalFC: totalNormalFC,
            refineFC: totalRefineFC,
            time: totalTime,
            meat: totalMeat,
            wood: totalWood,
            coal: totalCoal,
            iron: totalIron
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

    /**
     * Main calculation function
     */
    function calculateAll() {
        const results = {};
    let totalNormalFC = 0;
    let totalRefineFC = 0;
    let totalTime = 0;
    let totalMeat = 0, totalWood = 0, totalCoal = 0, totalIron = 0;

        // Calculate for each building
        BUILDINGS.forEach(building => {
            const buildingId = building.toLowerCase().replace(/ /g, '-');
            const currentSelect = document.getElementById(`${buildingId}-current`);
            const desiredSelect = document.getElementById(`${buildingId}-desired`);

            if (!currentSelect || !desiredSelect) return;

            const costs = calculateBuildingCosts(building, currentSelect.value, desiredSelect.value);
            
            if (costs) {
                results[building] = costs;
                totalNormalFC += costs.normalFC;
                totalRefineFC += costs.refineFC;
                totalTime += costs.time;
                totalMeat += costs.meat || 0;
                totalWood += costs.wood || 0;
                totalCoal += costs.coal || 0;
                totalIron += costs.iron || 0;
            }
        });

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

        // Icon helper for resources (supports base + crystals)
        function labelWithIcon(key) {
            const urlMap = {
                'fire-crystals': 'assets/resources/fire-crystals.png',
                'refine-crystals': 'assets/resources/refine-crystals.png',
                meat: 'assets/resources/meat.png',
                wood: 'assets/resources/wood.png',
                coal: 'assets/resources/coal.png',
                iron: 'assets/resources/iron.png'
            };
            const url = urlMap[key];
            if (!url) return t(key, lang);
            return `<img class="res-icon" src="${url}" alt="${t(key, lang)}" onerror="this.style.display='none'"> ${t(key, lang)}`;
        }

        let html = '<div class="totals-summary">';

        // Fire Crystals needed
        const fcGap = totals.totalNormalFC - totals.inventoryFC;
        const fcGapClass = fcGap > 0 ? 'deficit' : 'surplus';
        const fcGapText = fcGap > 0 
            ? t('gap-need-more', lang).replace('%d', Math.abs(fcGap))
            : t('gap-have-left', lang).replace('%d', Math.abs(fcGap));

        html += `<div class="total-item">
            <span class="resource-label">${labelWithIcon('fire-crystals')}:</span>
            <span class="resource-value">${totals.totalNormalFC.toLocaleString()}</span>
            <span class="gap ${fcGapClass}">${fcGapText}</span>
        </div>`;

        // Refine Crystals needed
        const rfcGap = totals.totalRefineFC - totals.inventoryRFC;
        const rfcGapClass = rfcGap > 0 ? 'deficit' : 'surplus';
        const rfcGapText = rfcGap > 0 
            ? t('gap-need-more', lang).replace('%d', Math.abs(rfcGap))
            : t('gap-have-left', lang).replace('%d', Math.abs(rfcGap));

        html += `<div class="total-item">
            <span class="resource-label">${labelWithIcon('refine-crystals')}:</span>
            <span class="resource-value">${totals.totalRefineFC.toLocaleString()}</span>
            <span class="gap ${rfcGapClass}">${rfcGapText}</span>
        </div>`;

        // Base resources (always display)
        const meatGap = (totals.totalMeat || 0) - (totals.inventoryMeat || 0);
        const meatGapClass = meatGap > 0 ? 'deficit' : 'surplus';
        const meatGapText = meatGap > 0 
            ? t('gap-need-more', lang).replace('%d', Math.abs(meatGap).toLocaleString())
            : t('gap-have-left', lang).replace('%d', Math.abs(meatGap).toLocaleString());
        html += `<div class="total-item">
            <span class="resource-label">${labelWithIcon('meat')}:</span>
            <span class="resource-value">${(totals.totalMeat || 0).toLocaleString()}</span>
            <span class="gap ${meatGapClass}">${meatGapText}</span>
        </div>`;

        const woodGap = (totals.totalWood || 0) - (totals.inventoryWood || 0);
        const woodGapClass = woodGap > 0 ? 'deficit' : 'surplus';
        const woodGapText = woodGap > 0 
            ? t('gap-need-more', lang).replace('%d', Math.abs(woodGap).toLocaleString())
            : t('gap-have-left', lang).replace('%d', Math.abs(woodGap).toLocaleString());
        html += `<div class="total-item">
            <span class="resource-label">${labelWithIcon('wood')}:</span>
            <span class="resource-value">${(totals.totalWood || 0).toLocaleString()}</span>
            <span class="gap ${woodGapClass}">${woodGapText}</span>
        </div>`;

        const coalGap = (totals.totalCoal || 0) - (totals.inventoryCoal || 0);
        const coalGapClass = coalGap > 0 ? 'deficit' : 'surplus';
        const coalGapText = coalGap > 0 
            ? t('gap-need-more', lang).replace('%d', Math.abs(coalGap).toLocaleString())
            : t('gap-have-left', lang).replace('%d', Math.abs(coalGap).toLocaleString());
        html += `<div class="total-item">
            <span class="resource-label">${labelWithIcon('coal')}:</span>
            <span class="resource-value">${(totals.totalCoal || 0).toLocaleString()}</span>
            <span class="gap ${coalGapClass}">${coalGapText}</span>
        </div>`;

        const ironGap = (totals.totalIron || 0) - (totals.inventoryIron || 0);
        const ironGapClass = ironGap > 0 ? 'deficit' : 'surplus';
        const ironGapText = ironGap > 0 
            ? t('gap-need-more', lang).replace('%d', Math.abs(ironGap).toLocaleString())
            : t('gap-have-left', lang).replace('%d', Math.abs(ironGap).toLocaleString());
        html += `<div class="total-item">
            <span class="resource-label">${labelWithIcon('iron')}:</span>
            <span class="resource-value">${(totals.totalIron || 0).toLocaleString()}</span>
            <span class="gap ${ironGapClass}">${ironGapText}</span>
        </div>`;

        html += '</div>';

        // Time section (separate from resources)
        html += '<div class="totals-summary time-section">';

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

        // Speedup days comparison
        const timeGap = totals.adjustedTime - totals.inventorySpeedupSeconds;
        const timeGapFormatted = formatTime(Math.abs(timeGap));
        const timeGapClass = timeGap > 0 ? 'deficit' : 'surplus';
        const timeGapText = timeGap > 0 
            ? t('gap-time-need-more', lang).replace('%dd %dh %dm', `${timeGapFormatted.days}d ${timeGapFormatted.hours}h ${timeGapFormatted.minutes}m`)
            : t('gap-time-have-left', lang).replace('%dd %dh %dm', `${timeGapFormatted.days}d ${timeGapFormatted.hours}h ${timeGapFormatted.minutes}m`);

        html += `<div class="total-item">
            <span class="resource-label">${t('speedup-days', lang)}:</span>
            <span class="resource-value">${(totals.adjustedTime / 86400).toFixed(1)} days</span>
            <span class="gap ${timeGapClass}">${timeGapText}</span>
        </div>`;

        html += '</div>';

        // Building breakdown - compact format
        if (Object.keys(buildingResults).length > 0) {
            html += `<div class="building-breakdown"><h3>${t('building-breakdown', lang)}</h3><div class="breakdown-grid">`;
            
            for (const [building, costs] of Object.entries(buildingResults)) {
                const timeFormatted = formatTime(costs.time);
                html += `<div class="building-result-compact">
                    <strong>${t(building, lang)}</strong>
                    <div class="compact-line">${labelWithIcon('fire-crystals')}: ${Number(costs.normalFC || 0).toLocaleString()}</div>
                    ${costs.refineFC > 0 ? `<div class="compact-line">${labelWithIcon('refine-crystals')}: ${Number(costs.refineFC || 0).toLocaleString()}</div>` : ''}
                    ${(costs.meat || 0) > 0 ? `<div class="compact-line">${labelWithIcon('meat')}: ${Number(costs.meat || 0).toLocaleString()}</div>` : ''}
                    ${(costs.wood || 0) > 0 ? `<div class="compact-line">${labelWithIcon('wood')}: ${Number(costs.wood || 0).toLocaleString()}</div>` : ''}
                    ${(costs.coal || 0) > 0 ? `<div class="compact-line">${labelWithIcon('coal')}: ${Number(costs.coal || 0).toLocaleString()}</div>` : ''}
                    ${(costs.iron || 0) > 0 ? `<div class="compact-line">${labelWithIcon('iron')}: ${Number(costs.iron || 0).toLocaleString()}</div>` : ''}
                    <div class="compact-line">${t('total-time', lang)}: ${timeFormatted.days}d ${timeFormatted.hours}h ${timeFormatted.minutes}m</div>
                </div>`;
            }
            
            html += '</div></div>';
        }

        resultsDisplay.innerHTML = html;
    }

    /**
     * Initialize the calculator
     */
    function init() {
        // Add event listeners to all building selects
        BUILDINGS.forEach(building => {
            const buildingId = building.toLowerCase().replace(/ /g, '-');
            const currentSelect = document.getElementById(`${buildingId}-current`);
            const desiredSelect = document.getElementById(`${buildingId}-desired`);

            if (currentSelect && desiredSelect) {
                const levelsArray = getLevelsForBuilding(building);
                
                currentSelect.addEventListener('change', () => {
                    validateLevels(currentSelect, desiredSelect, levelsArray);
                    calculateAll();
                });

                desiredSelect.addEventListener('change', () => {
                    validateLevels(currentSelect, desiredSelect, levelsArray);
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
            'inventory-iron'
        ];

        inventoryInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', calculateAll);
            }
        });

        // Initial calculation
        calculateAll();
    }

    // Public API
    window.FireCrystalsCalculator = {
        calculateAll: calculateAll,
        init: init
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
