/* Helios research data normalized from Excel (War Academy sheet). */
(function(){
  'use strict';
  const BRANCHES = ['marksman','infantry','lancer'];
  const SLOT_TEMPLATE = [
  {
    "id": "healing",
    "row": 0,
    "col": -1,
    "parents": [
      "helios_unlock"
    ],
    "category": "support"
  },
  {
    "id": "training",
    "row": 0,
    "col": 0,
    "parents": [
      "helios_unlock"
    ],
    "category": "support"
  },
  {
    "id": "first_aid",
    "row": 0,
    "col": 1,
    "parents": [
      "helios_unlock"
    ],
    "category": "support"
  },
  {
    "id": "helios_unlock",
    "row": 1.5,
    "col": 0,
    "parents": [
      "flame_legion",
      "crystal_arrow",
      "crystal_protection"
    ],
    "category": "unlock",
    "variant": "unlock",
    "isUnlockNode": true
  },
  {
    "id": "flame_legion",
    "row": 3.5,
    "col": 0,
    "parents": [
      "crystal_armor",
      "crystal_vision"
    ],
    "category": "flame_legion"
  },
  {
    "id": "crystal_protection",
    "row": 3,
    "col": -1,
    "parents": [
      "crystal_armor"
    ],
    "category": "defense"
  },
  {
    "id": "crystal_arrow",
    "row": 3,
    "col": 1,
    "parents": [
      "crystal_vision"
    ],
    "category": "damage"
  },
  {
    "id": "crystal_armor",
    "row": 4,
    "col": -1,
    "parents": [
      "flame_squad"
    ],
    "category": "defense"
  },
  {
    "id": "crystal_vision",
    "row": 4,
    "col": 1,
    "parents": [
      "flame_squad"
    ],
    "category": "damage"
  },
  {
    "id": "flame_squad",
    "row": 5,
    "col": 0,
    "parents": [
      "root"
    ],
    "category": "utility"
  },
  {
    "id": "root",
    "row": 6,
    "col": 0,
    "parents": [],
    "category": "root"
  }
];
  const NODES = [
  {
    "id": "marksman-healing",
    "slotId": "healing",
    "name": "Helios Marksman Healing",
    "branch": "marksman",
    "maxLevel": 10,
    "icon": "../research-icons/Helios_Marksman_Healing.png",
    "position": {
      "x": -1,
      "y": 0
    },
    "parents": [
      "marksman-helios_unlock"
    ],
    "type": "support",
    "variant": null,
    "levels": [
      {
        "level": 1,
        "costs": {
          "fc": 0,
          "meat": 2500000,
          "wood": 2500000,
          "coal": 500000,
          "iron": 120000,
          "steel": 30000
        },
        "timeSeconds": 180000,
        "stats": {
          "Helios Healing Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 2,
        "costs": {
          "fc": 0,
          "meat": 3300000,
          "wood": 3300000,
          "coal": 670000,
          "iron": 160000,
          "steel": 40000
        },
        "timeSeconds": 243000,
        "stats": {
          "Helios Healing Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 3,
        "costs": {
          "fc": 0,
          "meat": 4600000,
          "wood": 4600000,
          "coal": 920000,
          "iron": 230000,
          "steel": 55000
        },
        "timeSeconds": 333000,
        "stats": {
          "Helios Healing Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 4,
        "costs": {
          "fc": 0,
          "meat": 6200000,
          "wood": 6200000,
          "coal": 1200000,
          "iron": 310000,
          "steel": 75000
        },
        "timeSeconds": 450000,
        "stats": {
          "Helios Healing Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 5,
        "costs": {
          "fc": 0,
          "meat": 8300000,
          "wood": 8300000,
          "coal": 1600000,
          "iron": 410000,
          "steel": 100000
        },
        "timeSeconds": 603000,
        "stats": {
          "Helios Healing Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 6,
        "costs": {
          "fc": 0,
          "meat": 11000000,
          "wood": 11000000,
          "coal": 2200000,
          "iron": 560000,
          "steel": 130000
        },
        "timeSeconds": 810000,
        "stats": {
          "Helios Healing Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 7,
        "costs": {
          "fc": 0,
          "meat": 15000000,
          "wood": 15000000,
          "coal": 3000000,
          "iron": 750000,
          "steel": 180000
        },
        "timeSeconds": 1080000,
        "stats": {
          "Helios Healing Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 8,
        "costs": {
          "fc": 0,
          "meat": 20000000,
          "wood": 20000000,
          "coal": 4100000,
          "iron": 1000000,
          "steel": 240000
        },
        "timeSeconds": 1476000,
        "stats": {
          "Helios Healing Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 9,
        "costs": {
          "fc": 0,
          "meat": 27000000,
          "wood": 27000000,
          "coal": 5500000,
          "iron": 1300000,
          "steel": 330000
        },
        "timeSeconds": 1980000,
        "stats": {
          "Helios Healing Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 10,
        "costs": {
          "fc": 0,
          "meat": 0,
          "wood": 0,
          "coal": 0,
          "iron": 0,
          "steel": 0
        },
        "timeSeconds": 0,
        "stats": {
          "Helios Healing Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      }
    ]
  },
  {
    "id": "infantry-healing",
    "slotId": "healing",
    "name": "Helios Infantry Healing",
    "branch": "infantry",
    "maxLevel": 10,
    "icon": "../research-icons/Helios_Infantry_Healing.png",
    "position": {
      "x": -1,
      "y": 0
    },
    "parents": [
      "infantry-helios_unlock"
    ],
    "type": "support",
    "variant": null,
    "levels": [
      {
        "level": 1,
        "costs": {
          "fc": 0,
          "meat": 2500000,
          "wood": 2500000,
          "coal": 500000,
          "iron": 120000,
          "steel": 30000
        },
        "timeSeconds": 180000,
        "stats": {
          "Helios Healing Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 2,
        "costs": {
          "fc": 0,
          "meat": 3300000,
          "wood": 3300000,
          "coal": 670000,
          "iron": 160000,
          "steel": 40000
        },
        "timeSeconds": 243000,
        "stats": {
          "Helios Healing Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 3,
        "costs": {
          "fc": 0,
          "meat": 4600000,
          "wood": 4600000,
          "coal": 920000,
          "iron": 230000,
          "steel": 55000
        },
        "timeSeconds": 333000,
        "stats": {
          "Helios Healing Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 4,
        "costs": {
          "fc": 0,
          "meat": 6200000,
          "wood": 6200000,
          "coal": 1200000,
          "iron": 310000,
          "steel": 75000
        },
        "timeSeconds": 450000,
        "stats": {
          "Helios Healing Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 5,
        "costs": {
          "fc": 0,
          "meat": 8300000,
          "wood": 8300000,
          "coal": 1600000,
          "iron": 410000,
          "steel": 100000
        },
        "timeSeconds": 603000,
        "stats": {
          "Helios Healing Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 6,
        "costs": {
          "fc": 0,
          "meat": 11000000,
          "wood": 11000000,
          "coal": 2200000,
          "iron": 560000,
          "steel": 130000
        },
        "timeSeconds": 810000,
        "stats": {
          "Helios Healing Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 7,
        "costs": {
          "fc": 0,
          "meat": 15000000,
          "wood": 15000000,
          "coal": 3000000,
          "iron": 750000,
          "steel": 180000
        },
        "timeSeconds": 1080000,
        "stats": {
          "Helios Healing Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 8,
        "costs": {
          "fc": 0,
          "meat": 20000000,
          "wood": 20000000,
          "coal": 4100000,
          "iron": 1000000,
          "steel": 240000
        },
        "timeSeconds": 1476000,
        "stats": {
          "Helios Healing Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 9,
        "costs": {
          "fc": 0,
          "meat": 27000000,
          "wood": 27000000,
          "coal": 5500000,
          "iron": 1300000,
          "steel": 330000
        },
        "timeSeconds": 1980000,
        "stats": {
          "Helios Healing Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 10,
        "costs": {
          "fc": 0,
          "meat": 0,
          "wood": 0,
          "coal": 0,
          "iron": 0,
          "steel": 0
        },
        "timeSeconds": 0,
        "stats": {
          "Helios Healing Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      }
    ]
  },
  {
    "id": "lancer-healing",
    "slotId": "healing",
    "name": "Helios Lancer Healing",
    "branch": "lancer",
    "maxLevel": 10,
    "icon": "../research-icons/Helios_Lancer_Healing.png",
    "position": {
      "x": -1,
      "y": 0
    },
    "parents": [
      "lancer-helios_unlock"
    ],
    "type": "support",
    "variant": null,
    "levels": [
      {
        "level": 1,
        "costs": {
          "fc": 0,
          "meat": 2500000,
          "wood": 2500000,
          "coal": 500000,
          "iron": 120000,
          "steel": 30000
        },
        "timeSeconds": 180000,
        "stats": {
          "Helios Healing Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 2,
        "costs": {
          "fc": 0,
          "meat": 3300000,
          "wood": 3300000,
          "coal": 670000,
          "iron": 160000,
          "steel": 40000
        },
        "timeSeconds": 243000,
        "stats": {
          "Helios Healing Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 3,
        "costs": {
          "fc": 0,
          "meat": 4600000,
          "wood": 4600000,
          "coal": 920000,
          "iron": 230000,
          "steel": 55000
        },
        "timeSeconds": 333000,
        "stats": {
          "Helios Healing Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 4,
        "costs": {
          "fc": 0,
          "meat": 6200000,
          "wood": 6200000,
          "coal": 1200000,
          "iron": 310000,
          "steel": 75000
        },
        "timeSeconds": 450000,
        "stats": {
          "Helios Healing Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 5,
        "costs": {
          "fc": 0,
          "meat": 8300000,
          "wood": 8300000,
          "coal": 1600000,
          "iron": 410000,
          "steel": 100000
        },
        "timeSeconds": 603000,
        "stats": {
          "Helios Healing Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 6,
        "costs": {
          "fc": 0,
          "meat": 11000000,
          "wood": 11000000,
          "coal": 2200000,
          "iron": 560000,
          "steel": 130000
        },
        "timeSeconds": 810000,
        "stats": {
          "Helios Healing Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 7,
        "costs": {
          "fc": 0,
          "meat": 15000000,
          "wood": 15000000,
          "coal": 3000000,
          "iron": 750000,
          "steel": 180000
        },
        "timeSeconds": 1080000,
        "stats": {
          "Helios Healing Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 8,
        "costs": {
          "fc": 0,
          "meat": 20000000,
          "wood": 20000000,
          "coal": 4100000,
          "iron": 1000000,
          "steel": 240000
        },
        "timeSeconds": 1476000,
        "stats": {
          "Helios Healing Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 9,
        "costs": {
          "fc": 0,
          "meat": 27000000,
          "wood": 27000000,
          "coal": 5500000,
          "iron": 1300000,
          "steel": 330000
        },
        "timeSeconds": 1980000,
        "stats": {
          "Helios Healing Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 10,
        "costs": {
          "fc": 0,
          "meat": 0,
          "wood": 0,
          "coal": 0,
          "iron": 0,
          "steel": 0
        },
        "timeSeconds": 0,
        "stats": {
          "Helios Healing Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      }
    ]
  },
  {
    "id": "marksman-training",
    "slotId": "training",
    "name": "Helios Marksman Training",
    "branch": "marksman",
    "maxLevel": 10,
    "icon": "../research-icons/Helios_Marksman_Training.png",
    "position": {
      "x": 0,
      "y": 0
    },
    "parents": [
      "marksman-helios_unlock"
    ],
    "type": "support",
    "variant": null,
    "levels": [
      {
        "level": 1,
        "costs": {
          "fc": 0,
          "meat": 2500000,
          "wood": 2500000,
          "coal": 500000,
          "iron": 120000,
          "steel": 30000
        },
        "timeSeconds": 180000,
        "stats": {
          "Helios Training Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 2,
        "costs": {
          "fc": 0,
          "meat": 3300000,
          "wood": 3300000,
          "coal": 670000,
          "iron": 160000,
          "steel": 40000
        },
        "timeSeconds": 243000,
        "stats": {
          "Helios Training Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 3,
        "costs": {
          "fc": 0,
          "meat": 4600000,
          "wood": 4600000,
          "coal": 920000,
          "iron": 230000,
          "steel": 55000
        },
        "timeSeconds": 333000,
        "stats": {
          "Helios Training Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 4,
        "costs": {
          "fc": 0,
          "meat": 6200000,
          "wood": 6200000,
          "coal": 1200000,
          "iron": 310000,
          "steel": 75000
        },
        "timeSeconds": 450000,
        "stats": {
          "Helios Training Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 5,
        "costs": {
          "fc": 0,
          "meat": 8300000,
          "wood": 8300000,
          "coal": 1600000,
          "iron": 410000,
          "steel": 100000
        },
        "timeSeconds": 603000,
        "stats": {
          "Helios Training Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 6,
        "costs": {
          "fc": 0,
          "meat": 11000000,
          "wood": 11000000,
          "coal": 2200000,
          "iron": 560000,
          "steel": 130000
        },
        "timeSeconds": 810000,
        "stats": {
          "Helios Training Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 7,
        "costs": {
          "fc": 0,
          "meat": 15000000,
          "wood": 15000000,
          "coal": 3000000,
          "iron": 750000,
          "steel": 180000
        },
        "timeSeconds": 1080000,
        "stats": {
          "Helios Training Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 8,
        "costs": {
          "fc": 0,
          "meat": 20000000,
          "wood": 20000000,
          "coal": 4100000,
          "iron": 1000000,
          "steel": 240000
        },
        "timeSeconds": 1476000,
        "stats": {
          "Helios Training Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 9,
        "costs": {
          "fc": 0,
          "meat": 27000000,
          "wood": 27000000,
          "coal": 5500000,
          "iron": 1300000,
          "steel": 330000
        },
        "timeSeconds": 1980000,
        "stats": {
          "Helios Training Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 10,
        "costs": {
          "fc": 0,
          "meat": 0,
          "wood": 0,
          "coal": 0,
          "iron": 0,
          "steel": 0
        },
        "timeSeconds": 0,
        "stats": {
          "Helios Training Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      }
    ]
  },
  {
    "id": "infantry-training",
    "slotId": "training",
    "name": "Helios Infantry Training",
    "branch": "infantry",
    "maxLevel": 10,
    "icon": "../research-icons/Helios_Infantry_Training.png",
    "position": {
      "x": 0,
      "y": 0
    },
    "parents": [
      "infantry-helios_unlock"
    ],
    "type": "support",
    "variant": null,
    "levels": [
      {
        "level": 1,
        "costs": {
          "fc": 0,
          "meat": 2500000,
          "wood": 2500000,
          "coal": 500000,
          "iron": 120000,
          "steel": 30000
        },
        "timeSeconds": 180000,
        "stats": {
          "Helios Training Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 2,
        "costs": {
          "fc": 0,
          "meat": 3300000,
          "wood": 3300000,
          "coal": 670000,
          "iron": 160000,
          "steel": 40000
        },
        "timeSeconds": 243000,
        "stats": {
          "Helios Training Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 3,
        "costs": {
          "fc": 0,
          "meat": 4600000,
          "wood": 4600000,
          "coal": 920000,
          "iron": 230000,
          "steel": 55000
        },
        "timeSeconds": 333000,
        "stats": {
          "Helios Training Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 4,
        "costs": {
          "fc": 0,
          "meat": 6200000,
          "wood": 6200000,
          "coal": 1200000,
          "iron": 310000,
          "steel": 75000
        },
        "timeSeconds": 450000,
        "stats": {
          "Helios Training Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 5,
        "costs": {
          "fc": 0,
          "meat": 8300000,
          "wood": 8300000,
          "coal": 1600000,
          "iron": 410000,
          "steel": 100000
        },
        "timeSeconds": 603000,
        "stats": {
          "Helios Training Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 6,
        "costs": {
          "fc": 0,
          "meat": 11000000,
          "wood": 11000000,
          "coal": 2200000,
          "iron": 560000,
          "steel": 130000
        },
        "timeSeconds": 810000,
        "stats": {
          "Helios Training Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 7,
        "costs": {
          "fc": 0,
          "meat": 15000000,
          "wood": 15000000,
          "coal": 3000000,
          "iron": 750000,
          "steel": 180000
        },
        "timeSeconds": 1080000,
        "stats": {
          "Helios Training Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 8,
        "costs": {
          "fc": 0,
          "meat": 20000000,
          "wood": 20000000,
          "coal": 4100000,
          "iron": 1000000,
          "steel": 240000
        },
        "timeSeconds": 1476000,
        "stats": {
          "Helios Training Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 9,
        "costs": {
          "fc": 0,
          "meat": 27000000,
          "wood": 27000000,
          "coal": 5500000,
          "iron": 1300000,
          "steel": 330000
        },
        "timeSeconds": 1980000,
        "stats": {
          "Helios Training Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 10,
        "costs": {
          "fc": 0,
          "meat": 0,
          "wood": 0,
          "coal": 0,
          "iron": 0,
          "steel": 0
        },
        "timeSeconds": 0,
        "stats": {
          "Helios Training Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      }
    ]
  },
  {
    "id": "lancer-training",
    "slotId": "training",
    "name": "Helios Lancer Training",
    "branch": "lancer",
    "maxLevel": 10,
    "icon": "../research-icons/Helios_Lancer_Training.png",
    "position": {
      "x": 0,
      "y": 0
    },
    "parents": [
      "lancer-helios_unlock"
    ],
    "type": "support",
    "variant": null,
    "levels": [
      {
        "level": 1,
        "costs": {
          "fc": 0,
          "meat": 2500000,
          "wood": 2500000,
          "coal": 500000,
          "iron": 120000,
          "steel": 30000
        },
        "timeSeconds": 180000,
        "stats": {
          "Helios Training Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 2,
        "costs": {
          "fc": 0,
          "meat": 3300000,
          "wood": 3300000,
          "coal": 670000,
          "iron": 160000,
          "steel": 40000
        },
        "timeSeconds": 243000,
        "stats": {
          "Helios Training Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 3,
        "costs": {
          "fc": 0,
          "meat": 4600000,
          "wood": 4600000,
          "coal": 920000,
          "iron": 230000,
          "steel": 55000
        },
        "timeSeconds": 333000,
        "stats": {
          "Helios Training Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 4,
        "costs": {
          "fc": 0,
          "meat": 6200000,
          "wood": 6200000,
          "coal": 1200000,
          "iron": 310000,
          "steel": 75000
        },
        "timeSeconds": 450000,
        "stats": {
          "Helios Training Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 5,
        "costs": {
          "fc": 0,
          "meat": 8300000,
          "wood": 8300000,
          "coal": 1600000,
          "iron": 410000,
          "steel": 100000
        },
        "timeSeconds": 603000,
        "stats": {
          "Helios Training Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 6,
        "costs": {
          "fc": 0,
          "meat": 11000000,
          "wood": 11000000,
          "coal": 2200000,
          "iron": 560000,
          "steel": 130000
        },
        "timeSeconds": 810000,
        "stats": {
          "Helios Training Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 7,
        "costs": {
          "fc": 0,
          "meat": 15000000,
          "wood": 15000000,
          "coal": 3000000,
          "iron": 750000,
          "steel": 180000
        },
        "timeSeconds": 1080000,
        "stats": {
          "Helios Training Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 8,
        "costs": {
          "fc": 0,
          "meat": 20000000,
          "wood": 20000000,
          "coal": 4100000,
          "iron": 1000000,
          "steel": 240000
        },
        "timeSeconds": 1476000,
        "stats": {
          "Helios Training Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 9,
        "costs": {
          "fc": 0,
          "meat": 27000000,
          "wood": 27000000,
          "coal": 5500000,
          "iron": 1300000,
          "steel": 330000
        },
        "timeSeconds": 1980000,
        "stats": {
          "Helios Training Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      },
      {
        "level": 10,
        "costs": {
          "fc": 0,
          "meat": 0,
          "wood": 0,
          "coal": 0,
          "iron": 0,
          "steel": 0
        },
        "timeSeconds": 0,
        "stats": {
          "Helios Training Cost Reduction %": 5.0
        },
        "power": 35000,
        "svsPoints": 0
      }
    ]
  },
  {
    "id": "marksman-first_aid",
    "slotId": "first_aid",
    "name": "Helios Marksman First Aid",
    "branch": "marksman",
    "maxLevel": 10,
    "icon": "../research-icons/Helios_Marksman_First_Aid.png",
    "position": {
      "x": 1,
      "y": 0
    },
    "parents": [
      "marksman-helios_unlock"
    ],
    "type": "support",
    "variant": null,
    "levels": [
      {
        "level": 1,
        "costs": {
          "fc": 0,
          "meat": 1200000,
          "wood": 1200000,
          "coal": 250000,
          "iron": 62000,
          "steel": 15000
        },
        "timeSeconds": 90000,
        "stats": {
          "Helios Healing Time Reduction %": 1.5
        },
        "power": 17250,
        "svsPoints": 0
      },
      {
        "level": 2,
        "costs": {
          "fc": 0,
          "meat": 1600000,
          "wood": 1600000,
          "coal": 330000,
          "iron": 84000,
          "steel": 20000
        },
        "timeSeconds": 121500,
        "stats": {
          "Helios Healing Time Reduction %": 1.5
        },
        "power": 17250,
        "svsPoints": 0
      },
      {
        "level": 3,
        "costs": {
          "fc": 0,
          "meat": 2300000,
          "wood": 2300000,
          "coal": 460000,
          "iron": 110000,
          "steel": 27000
        },
        "timeSeconds": 166500,
        "stats": {
          "Helios Healing Time Reduction %": 1.5
        },
        "power": 17250,
        "svsPoints": 0
      },
      {
        "level": 4,
        "costs": {
          "fc": 0,
          "meat": 3100000,
          "wood": 3100000,
          "coal": 620000,
          "iron": 150000,
          "steel": 37000
        },
        "timeSeconds": 225000,
        "stats": {
          "Helios Healing Time Reduction %": 1.5
        },
        "power": 17250,
        "svsPoints": 0
      },
      {
        "level": 5,
        "costs": {
          "fc": 0,
          "meat": 4100000,
          "wood": 4100000,
          "coal": 830000,
          "iron": 200000,
          "steel": 50000
        },
        "timeSeconds": 301500,
        "stats": {
          "Helios Healing Time Reduction %": 1.5
        },
        "power": 17250,
        "svsPoints": 0
      },
      {
        "level": 6,
        "costs": {
          "fc": 0,
          "meat": 5600000,
          "wood": 5600000,
          "coal": 1100000,
          "iron": 280000,
          "steel": 67000
        },
        "timeSeconds": 405000,
        "stats": {
          "Helios Healing Time Reduction %": 1.5
        },
        "power": 17250,
        "svsPoints": 0
      },
      {
        "level": 7,
        "costs": {
          "fc": 0,
          "meat": 7500000,
          "wood": 7500000,
          "coal": 1500000,
          "iron": 370000,
          "steel": 90000
        },
        "timeSeconds": 540000,
        "stats": {
          "Helios Healing Time Reduction %": 1.5
        },
        "power": 17250,
        "svsPoints": 0
      },
      {
        "level": 8,
        "costs": {
          "fc": 0,
          "meat": 10000000,
          "wood": 10000000,
          "coal": 2000000,
          "iron": 510000,
          "steel": 120000
        },
        "timeSeconds": 738000,
        "stats": {
          "Helios Healing Time Reduction %": 1.5
        },
        "power": 17250,
        "svsPoints": 0
      },
      {
        "level": 9,
        "costs": {
          "fc": 0,
          "meat": 13000000,
          "wood": 13000000,
          "coal": 2700000,
          "iron": 680000,
          "steel": 160000
        },
        "timeSeconds": 990000,
        "stats": {
          "Helios Healing Time Reduction %": 1.5
        },
        "power": 17250,
        "svsPoints": 0
      },
      {
        "level": 10,
        "costs": {
          "fc": 0,
          "meat": 18000000,
          "wood": 18000000,
          "coal": 3700000,
          "iron": 930000,
          "steel": 220000
        },
        "timeSeconds": 1350000,
        "stats": {
          "Helios Healing Time Reduction %": 1.5
        },
        "power": 17250,
        "svsPoints": 0
      }
    ]
  },
  {
    "id": "infantry-first_aid",
    "slotId": "first_aid",
    "name": "Helios Infantry First Aid",
    "branch": "infantry",
    "maxLevel": 10,
    "icon": "../research-icons/Helios_Infantry_First_Aid.png",
    "position": {
      "x": 1,
      "y": 0
    },
    "parents": [
      "infantry-helios_unlock"
    ],
    "type": "support",
    "variant": null,
    "levels": [
      {
        "level": 1,
        "costs": {
          "fc": 0,
          "meat": 1200000,
          "wood": 1200000,
          "coal": 250000,
          "iron": 62000,
          "steel": 15000
        },
        "timeSeconds": 90000,
        "stats": {
          "Helios Healing Time Reduction %": 1.5
        },
        "power": 17250,
        "svsPoints": 0
      },
      {
        "level": 2,
        "costs": {
          "fc": 0,
          "meat": 1600000,
          "wood": 1600000,
          "coal": 330000,
          "iron": 84000,
          "steel": 20000
        },
        "timeSeconds": 121500,
        "stats": {
          "Helios Healing Time Reduction %": 1.5
        },
        "power": 17250,
        "svsPoints": 0
      },
      {
        "level": 3,
        "costs": {
          "fc": 0,
          "meat": 2300000,
          "wood": 2300000,
          "coal": 460000,
          "iron": 110000,
          "steel": 27000
        },
        "timeSeconds": 166500,
        "stats": {
          "Helios Healing Time Reduction %": 1.5
        },
        "power": 17250,
        "svsPoints": 0
      },
      {
        "level": 4,
        "costs": {
          "fc": 0,
          "meat": 3100000,
          "wood": 3100000,
          "coal": 620000,
          "iron": 150000,
          "steel": 37000
        },
        "timeSeconds": 225000,
        "stats": {
          "Helios Healing Time Reduction %": 1.5
        },
        "power": 17250,
        "svsPoints": 0
      },
      {
        "level": 5,
        "costs": {
          "fc": 0,
          "meat": 4100000,
          "wood": 4100000,
          "coal": 830000,
          "iron": 200000,
          "steel": 50000
        },
        "timeSeconds": 301500,
        "stats": {
          "Helios Healing Time Reduction %": 1.5
        },
        "power": 17250,
        "svsPoints": 0
      },
      {
        "level": 6,
        "costs": {
          "fc": 0,
          "meat": 5600000,
          "wood": 5600000,
          "coal": 1100000,
          "iron": 280000,
          "steel": 67000
        },
        "timeSeconds": 405000,
        "stats": {
          "Helios Healing Time Reduction %": 1.5
        },
        "power": 17250,
        "svsPoints": 0
      },
      {
        "level": 7,
        "costs": {
          "fc": 0,
          "meat": 7500000,
          "wood": 7500000,
          "coal": 1500000,
          "iron": 370000,
          "steel": 90000
        },
        "timeSeconds": 540000,
        "stats": {
          "Helios Healing Time Reduction %": 1.5
        },
        "power": 17250,
        "svsPoints": 0
      },
      {
        "level": 8,
        "costs": {
          "fc": 0,
          "meat": 10000000,
          "wood": 10000000,
          "coal": 2000000,
          "iron": 510000,
          "steel": 120000
        },
        "timeSeconds": 738000,
        "stats": {
          "Helios Healing Time Reduction %": 1.5
        },
        "power": 17250,
        "svsPoints": 0
      },
      {
        "level": 9,
        "costs": {
          "fc": 0,
          "meat": 13000000,
          "wood": 13000000,
          "coal": 2700000,
          "iron": 680000,
          "steel": 160000
        },
        "timeSeconds": 990000,
        "stats": {
          "Helios Healing Time Reduction %": 1.5
        },
        "power": 17250,
        "svsPoints": 0
      },
      {
        "level": 10,
        "costs": {
          "fc": 0,
          "meat": 18000000,
          "wood": 18000000,
          "coal": 3700000,
          "iron": 930000,
          "steel": 220000
        },
        "timeSeconds": 1350000,
        "stats": {
          "Helios Healing Time Reduction %": 1.5
        },
        "power": 17250,
        "svsPoints": 0
      }
    ]
  },
  {
    "id": "lancer-first_aid",
    "slotId": "first_aid",
    "name": "Helios Lancer First Aid",
    "branch": "lancer",
    "maxLevel": 10,
    "icon": "../research-icons/Helios_Lancer_First_Aid.png",
    "position": {
      "x": 1,
      "y": 0
    },
    "parents": [
      "lancer-helios_unlock"
    ],
    "type": "support",
    "variant": null,
    "levels": [
      {
        "level": 1,
        "costs": {
          "fc": 0,
          "meat": 1200000,
          "wood": 1200000,
          "coal": 250000,
          "iron": 62000,
          "steel": 15000
        },
        "timeSeconds": 90000,
        "stats": {
          "Helios Healing Time Reduction %": 1.5
        },
        "power": 17250,
        "svsPoints": 0
      },
      {
        "level": 2,
        "costs": {
          "fc": 0,
          "meat": 1600000,
          "wood": 1600000,
          "coal": 330000,
          "iron": 84000,
          "steel": 20000
        },
        "timeSeconds": 121500,
        "stats": {
          "Helios Healing Time Reduction %": 1.5
        },
        "power": 17250,
        "svsPoints": 0
      },
      {
        "level": 3,
        "costs": {
          "fc": 0,
          "meat": 2300000,
          "wood": 2300000,
          "coal": 460000,
          "iron": 110000,
          "steel": 27000
        },
        "timeSeconds": 166500,
        "stats": {
          "Helios Healing Time Reduction %": 1.5
        },
        "power": 17250,
        "svsPoints": 0
      },
      {
        "level": 4,
        "costs": {
          "fc": 0,
          "meat": 3100000,
          "wood": 3100000,
          "coal": 620000,
          "iron": 150000,
          "steel": 37000
        },
        "timeSeconds": 225000,
        "stats": {
          "Helios Healing Time Reduction %": 1.5
        },
        "power": 17250,
        "svsPoints": 0
      },
      {
        "level": 5,
        "costs": {
          "fc": 0,
          "meat": 4100000,
          "wood": 4100000,
          "coal": 830000,
          "iron": 200000,
          "steel": 50000
        },
        "timeSeconds": 301500,
        "stats": {
          "Helios Healing Time Reduction %": 1.5
        },
        "power": 17250,
        "svsPoints": 0
      },
      {
        "level": 6,
        "costs": {
          "fc": 0,
          "meat": 5600000,
          "wood": 5600000,
          "coal": 1100000,
          "iron": 280000,
          "steel": 67000
        },
        "timeSeconds": 405000,
        "stats": {
          "Helios Healing Time Reduction %": 1.5
        },
        "power": 17250,
        "svsPoints": 0
      },
      {
        "level": 7,
        "costs": {
          "fc": 0,
          "meat": 7500000,
          "wood": 7500000,
          "coal": 1500000,
          "iron": 370000,
          "steel": 90000
        },
        "timeSeconds": 540000,
        "stats": {
          "Helios Healing Time Reduction %": 1.5
        },
        "power": 17250,
        "svsPoints": 0
      },
      {
        "level": 8,
        "costs": {
          "fc": 0,
          "meat": 10000000,
          "wood": 10000000,
          "coal": 2000000,
          "iron": 510000,
          "steel": 120000
        },
        "timeSeconds": 738000,
        "stats": {
          "Helios Healing Time Reduction %": 1.5
        },
        "power": 17250,
        "svsPoints": 0
      },
      {
        "level": 9,
        "costs": {
          "fc": 0,
          "meat": 13000000,
          "wood": 13000000,
          "coal": 2700000,
          "iron": 680000,
          "steel": 160000
        },
        "timeSeconds": 990000,
        "stats": {
          "Helios Healing Time Reduction %": 1.5
        },
        "power": 17250,
        "svsPoints": 0
      },
      {
        "level": 10,
        "costs": {
          "fc": 0,
          "meat": 18000000,
          "wood": 18000000,
          "coal": 3700000,
          "iron": 930000,
          "steel": 220000
        },
        "timeSeconds": 1350000,
        "stats": {
          "Helios Healing Time Reduction %": 1.5
        },
        "power": 17250,
        "svsPoints": 0
      }
    ]
  },
  {
    "id": "marksman-helios_unlock",
    "slotId": "helios_unlock",
    "name": "Helios Marksman",
    "branch": "marksman",
    "maxLevel": 1,
    "icon": "../research-icons/Helios_Marksman.png",
    "position": {
      "x": 0,
      "y": 1
    },
    "parents": [
      "marksman-flame_legion",
      "marksman-crystal_arrow",
      "marksman-crystal_protection"
    ],
    "type": "unlock",
    "variant": "unlock",
    "levels": [
      {
        "level": 1,
        "costs": {
          "fc": 0,
          "meat": 85000000,
          "wood": 85000000,
          "coal": 17000000,
          "iron": 4200000,
          "steel": 1000000
        },
        "timeSeconds": 7892100,
        "stats": {},
        "power": 8000000,
        "svsPoints": 0
      }
    ]
  },
  {
    "id": "infantry-helios_unlock",
    "slotId": "helios_unlock",
    "name": "Helios Infantry",
    "branch": "infantry",
    "maxLevel": 1,
    "icon": "../research-icons/Helios_Infantry.png",
    "position": {
      "x": 0,
      "y": 1
    },
    "parents": [
      "infantry-flame_legion",
      "infantry-crystal_arrow",
      "infantry-crystal_protection"
    ],
    "type": "unlock",
    "variant": "unlock",
    "levels": [
      {
        "level": 1,
        "costs": {
          "fc": 0,
          "meat": 85000000,
          "wood": 85000000,
          "coal": 17000000,
          "iron": 4200000,
          "steel": 1000000
        },
        "timeSeconds": 7892100,
        "stats": {},
        "power": 8000000,
        "svsPoints": 0
      }
    ]
  },
  {
    "id": "lancer-helios_unlock",
    "slotId": "helios_unlock",
    "name": "Helios Lancer",
    "branch": "lancer",
    "maxLevel": 1,
    "icon": "../research-icons/Helios_Lancer.png",
    "position": {
      "x": 0,
      "y": 1
    },
    "parents": [
      "lancer-flame_legion",
      "lancer-crystal_arrow",
      "lancer-crystal_protection"
    ],
    "type": "unlock",
    "variant": "unlock",
    "levels": [
      {
        "level": 1,
        "costs": {
          "fc": 0,
          "meat": 85000000,
          "wood": 85000000,
          "coal": 17000000,
          "iron": 4200000,
          "steel": 1000000
        },
        "timeSeconds": 7892100,
        "stats": {},
        "power": 8000000,
        "svsPoints": 0
      }
    ]
  },
  {
    "id": "marksman-flame_legion",
    "slotId": "flame_legion",
    "name": "Flame Legion",
    "branch": "marksman",
    "maxLevel": 12,
    "icon": "../research-icons/Flame_Legion.png",
    "position": {
      "x": 0,
      "y": 3.5
    },
    "parents": [
      "marksman-crystal_armor",
      "marksman-crystal_vision"
    ],
    "type": "flame_legion",
    "variant": null,
    "levels": [
      {
        "level": 1,
        "costs": {
          "fc": 0,
          "meat": 1000000,
          "wood": 1000000,
          "coal": 210000,
          "iron": 54000,
          "steel": 23000
        },
        "timeSeconds": 105617,
        "stats": {
          "Troop Deployment Capacity": 1500.0
        },
        "power": 150000,
        "svsPoints": 0
      },
      {
        "level": 2,
        "costs": {
          "fc": 0,
          "meat": 1300000,
          "wood": 1300000,
          "coal": 260000,
          "iron": 66000,
          "steel": 28000
        },
        "timeSeconds": 129908,
        "stats": {
          "Troop Deployment Capacity": 1500.0
        },
        "power": 135000,
        "svsPoints": 0
      },
      {
        "level": 3,
        "costs": {
          "fc": 0,
          "meat": 1600000,
          "wood": 1600000,
          "coal": 320000,
          "iron": 81000,
          "steel": 34000
        },
        "timeSeconds": 158425,
        "stats": {
          "Troop Deployment Capacity": 2000.0
        },
        "power": 175000,
        "svsPoints": 0
      },
      {
        "level": 4,
        "costs": {
          "fc": 0,
          "meat": 1900000,
          "wood": 1900000,
          "coal": 390000,
          "iron": 97000,
          "steel": 41000
        },
        "timeSeconds": 190110,
        "stats": {
          "Troop Deployment Capacity": 2000.0
        },
        "power": 135000,
        "svsPoints": 0
      },
      {
        "level": 5,
        "costs": {
          "fc": 0,
          "meat": 2300000,
          "wood": 2300000,
          "coal": 470000,
          "iron": 110000,
          "steel": 51000
        },
        "timeSeconds": 232357,
        "stats": {
          "Troop Deployment Capacity": 2500.0
        },
        "power": 174500,
        "svsPoints": 0
      },
      {
        "level": 6,
        "costs": {
          "fc": 0,
          "meat": 2900000,
          "wood": 2900000,
          "coal": 580000,
          "iron": 140000,
          "steel": 62000
        },
        "timeSeconds": 285165,
        "stats": {
          "Troop Deployment Capacity": 2500.0
        },
        "power": 142500,
        "svsPoints": 0
      },
      {
        "level": 7,
        "costs": {
          "fc": 0,
          "meat": 3500000,
          "wood": 3500000,
          "coal": 710000,
          "iron": 170000,
          "steel": 76000
        },
        "timeSeconds": 348536,
        "stats": {
          "Troop Deployment Capacity": 2500.0
        },
        "power": 146500,
        "svsPoints": 0
      },
      {
        "level": 8,
        "costs": {
          "fc": 0,
          "meat": 4300000,
          "wood": 4300000,
          "coal": 860000,
          "iron": 210000,
          "steel": 93000
        },
        "timeSeconds": 422468,
        "stats": {
          "Troop Deployment Capacity": 3000.0
        },
        "power": 184000,
        "svsPoints": 0
      },
      {
        "level": 9,
        "costs": {
          "fc": 0,
          "meat": 5400000,
          "wood": 5400000,
          "coal": 1000000,
          "iron": 270000,
          "steel": 110000
        },
        "timeSeconds": 528085,
        "stats": {
          "Troop Deployment Capacity": 3500.0
        },
        "power": 122500,
        "svsPoints": 0
      },
      {
        "level": 10,
        "costs": {
          "fc": 0,
          "meat": 6500000,
          "wood": 6500000,
          "coal": 1300000,
          "iron": 320000,
          "steel": 130000
        },
        "timeSeconds": 633702,
        "stats": {
          "Troop Deployment Capacity": 4000.0
        },
        "power": 160000,
        "svsPoints": 0
      },
      {
        "level": 11,
        "costs": {
          "fc": 0,
          "meat": 7800000,
          "wood": 7800000,
          "coal": 1500000,
          "iron": 390000,
          "steel": 160000
        },
        "timeSeconds": 760442,
        "stats": {
          "Troop Deployment Capacity": 4000.0
        },
        "power": 157000,
        "svsPoints": 0
      },
      {
        "level": 12,
        "costs": {
          "fc": 0,
          "meat": 9600000,
          "wood": 9600000,
          "coal": 1900000,
          "iron": 480000,
          "steel": 200000
        },
        "timeSeconds": 939991,
        "stats": {
          "Troop Deployment Capacity": 4500.0
        },
        "power": 194000,
        "svsPoints": 0
      }
    ]
  },
  {
    "id": "infantry-flame_legion",
    "slotId": "flame_legion",
    "name": "Flame Legion",
    "branch": "infantry",
    "maxLevel": 12,
    "icon": "../research-icons/Flame_Legion.png",
    "position": {
      "x": 0,
      "y": 3.5
    },
    "parents": [
      "infantry-crystal_armor",
      "infantry-crystal_vision"
    ],
    "type": "flame_legion",
    "variant": null,
    "levels": [
      {
        "level": 1,
        "costs": {
          "fc": 0,
          "meat": 1000000,
          "wood": 1000000,
          "coal": 210000,
          "iron": 54000,
          "steel": 23000
        },
        "timeSeconds": 105617,
        "stats": {
          "Troop Deployment Capacity": 1500.0
        },
        "power": 150000,
        "svsPoints": 0
      },
      {
        "level": 2,
        "costs": {
          "fc": 0,
          "meat": 1300000,
          "wood": 1300000,
          "coal": 260000,
          "iron": 66000,
          "steel": 28000
        },
        "timeSeconds": 129908,
        "stats": {
          "Troop Deployment Capacity": 1500.0
        },
        "power": 135000,
        "svsPoints": 0
      },
      {
        "level": 3,
        "costs": {
          "fc": 0,
          "meat": 1600000,
          "wood": 1600000,
          "coal": 320000,
          "iron": 81000,
          "steel": 34000
        },
        "timeSeconds": 158425,
        "stats": {
          "Troop Deployment Capacity": 2000.0
        },
        "power": 175000,
        "svsPoints": 0
      },
      {
        "level": 4,
        "costs": {
          "fc": 0,
          "meat": 1900000,
          "wood": 1900000,
          "coal": 390000,
          "iron": 97000,
          "steel": 41000
        },
        "timeSeconds": 190110,
        "stats": {
          "Troop Deployment Capacity": 2000.0
        },
        "power": 135000,
        "svsPoints": 0
      },
      {
        "level": 5,
        "costs": {
          "fc": 0,
          "meat": 2300000,
          "wood": 2300000,
          "coal": 470000,
          "iron": 110000,
          "steel": 51000
        },
        "timeSeconds": 232357,
        "stats": {
          "Troop Deployment Capacity": 2500.0
        },
        "power": 174500,
        "svsPoints": 0
      },
      {
        "level": 6,
        "costs": {
          "fc": 0,
          "meat": 2900000,
          "wood": 2900000,
          "coal": 580000,
          "iron": 140000,
          "steel": 62000
        },
        "timeSeconds": 285165,
        "stats": {
          "Troop Deployment Capacity": 2500.0
        },
        "power": 142500,
        "svsPoints": 0
      },
      {
        "level": 7,
        "costs": {
          "fc": 0,
          "meat": 3500000,
          "wood": 3500000,
          "coal": 710000,
          "iron": 170000,
          "steel": 76000
        },
        "timeSeconds": 348536,
        "stats": {
          "Troop Deployment Capacity": 2500.0
        },
        "power": 146500,
        "svsPoints": 0
      },
      {
        "level": 8,
        "costs": {
          "fc": 0,
          "meat": 4300000,
          "wood": 4300000,
          "coal": 860000,
          "iron": 210000,
          "steel": 93000
        },
        "timeSeconds": 422468,
        "stats": {
          "Troop Deployment Capacity": 3000.0
        },
        "power": 184000,
        "svsPoints": 0
      },
      {
        "level": 9,
        "costs": {
          "fc": 0,
          "meat": 5400000,
          "wood": 5400000,
          "coal": 1000000,
          "iron": 270000,
          "steel": 110000
        },
        "timeSeconds": 528085,
        "stats": {
          "Troop Deployment Capacity": 3500.0
        },
        "power": 122500,
        "svsPoints": 0
      },
      {
        "level": 10,
        "costs": {
          "fc": 0,
          "meat": 6500000,
          "wood": 6500000,
          "coal": 1300000,
          "iron": 320000,
          "steel": 130000
        },
        "timeSeconds": 633702,
        "stats": {
          "Troop Deployment Capacity": 4000.0
        },
        "power": 160000,
        "svsPoints": 0
      },
      {
        "level": 11,
        "costs": {
          "fc": 0,
          "meat": 7800000,
          "wood": 7800000,
          "coal": 1500000,
          "iron": 390000,
          "steel": 160000
        },
        "timeSeconds": 760442,
        "stats": {
          "Troop Deployment Capacity": 4000.0
        },
        "power": 157000,
        "svsPoints": 0
      },
      {
        "level": 12,
        "costs": {
          "fc": 0,
          "meat": 9600000,
          "wood": 9600000,
          "coal": 1900000,
          "iron": 480000,
          "steel": 200000
        },
        "timeSeconds": 939991,
        "stats": {
          "Troop Deployment Capacity": 4500.0
        },
        "power": 194000,
        "svsPoints": 0
      }
    ]
  },
  {
    "id": "lancer-flame_legion",
    "slotId": "flame_legion",
    "name": "Flame Legion",
    "branch": "lancer",
    "maxLevel": 12,
    "icon": "../research-icons/Flame_Legion.png",
    "position": {
      "x": 0,
      "y": 3.5
    },
    "parents": [
      "lancer-crystal_armor",
      "lancer-crystal_vision"
    ],
    "type": "flame_legion",
    "variant": null,
    "levels": [
      {
        "level": 1,
        "costs": {
          "fc": 0,
          "meat": 1000000,
          "wood": 1000000,
          "coal": 210000,
          "iron": 54000,
          "steel": 23000
        },
        "timeSeconds": 105617,
        "stats": {
          "Troop Deployment Capacity": 1500.0
        },
        "power": 150000,
        "svsPoints": 0
      },
      {
        "level": 2,
        "costs": {
          "fc": 0,
          "meat": 1300000,
          "wood": 1300000,
          "coal": 260000,
          "iron": 66000,
          "steel": 28000
        },
        "timeSeconds": 129908,
        "stats": {
          "Troop Deployment Capacity": 1500.0
        },
        "power": 135000,
        "svsPoints": 0
      },
      {
        "level": 3,
        "costs": {
          "fc": 0,
          "meat": 1600000,
          "wood": 1600000,
          "coal": 320000,
          "iron": 81000,
          "steel": 34000
        },
        "timeSeconds": 158425,
        "stats": {
          "Troop Deployment Capacity": 2000.0
        },
        "power": 175000,
        "svsPoints": 0
      },
      {
        "level": 4,
        "costs": {
          "fc": 0,
          "meat": 1900000,
          "wood": 1900000,
          "coal": 390000,
          "iron": 97000,
          "steel": 41000
        },
        "timeSeconds": 190110,
        "stats": {
          "Troop Deployment Capacity": 2000.0
        },
        "power": 135000,
        "svsPoints": 0
      },
      {
        "level": 5,
        "costs": {
          "fc": 0,
          "meat": 2300000,
          "wood": 2300000,
          "coal": 470000,
          "iron": 110000,
          "steel": 51000
        },
        "timeSeconds": 232357,
        "stats": {
          "Troop Deployment Capacity": 2500.0
        },
        "power": 174500,
        "svsPoints": 0
      },
      {
        "level": 6,
        "costs": {
          "fc": 0,
          "meat": 2900000,
          "wood": 2900000,
          "coal": 580000,
          "iron": 140000,
          "steel": 62000
        },
        "timeSeconds": 285165,
        "stats": {
          "Troop Deployment Capacity": 2500.0
        },
        "power": 142500,
        "svsPoints": 0
      },
      {
        "level": 7,
        "costs": {
          "fc": 0,
          "meat": 3500000,
          "wood": 3500000,
          "coal": 710000,
          "iron": 170000,
          "steel": 76000
        },
        "timeSeconds": 348536,
        "stats": {
          "Troop Deployment Capacity": 2500.0
        },
        "power": 146500,
        "svsPoints": 0
      },
      {
        "level": 8,
        "costs": {
          "fc": 0,
          "meat": 4300000,
          "wood": 4300000,
          "coal": 860000,
          "iron": 210000,
          "steel": 93000
        },
        "timeSeconds": 422468,
        "stats": {
          "Troop Deployment Capacity": 3000.0
        },
        "power": 184000,
        "svsPoints": 0
      },
      {
        "level": 9,
        "costs": {
          "fc": 0,
          "meat": 5400000,
          "wood": 5400000,
          "coal": 1000000,
          "iron": 270000,
          "steel": 110000
        },
        "timeSeconds": 528085,
        "stats": {
          "Troop Deployment Capacity": 3500.0
        },
        "power": 122500,
        "svsPoints": 0
      },
      {
        "level": 10,
        "costs": {
          "fc": 0,
          "meat": 6500000,
          "wood": 6500000,
          "coal": 1300000,
          "iron": 320000,
          "steel": 130000
        },
        "timeSeconds": 633702,
        "stats": {
          "Troop Deployment Capacity": 4000.0
        },
        "power": 160000,
        "svsPoints": 0
      },
      {
        "level": 11,
        "costs": {
          "fc": 0,
          "meat": 7800000,
          "wood": 7800000,
          "coal": 1500000,
          "iron": 390000,
          "steel": 160000
        },
        "timeSeconds": 760442,
        "stats": {
          "Troop Deployment Capacity": 4000.0
        },
        "power": 157000,
        "svsPoints": 0
      },
      {
        "level": 12,
        "costs": {
          "fc": 0,
          "meat": 9600000,
          "wood": 9600000,
          "coal": 1900000,
          "iron": 480000,
          "steel": 200000
        },
        "timeSeconds": 939991,
        "stats": {
          "Troop Deployment Capacity": 4500.0
        },
        "power": 194000,
        "svsPoints": 0
      }
    ]
  },
  {
    "id": "marksman-crystal_protection",
    "slotId": "crystal_protection",
    "name": "Flame Protection",
    "branch": "marksman",
    "maxLevel": 12,
    "icon": "../research-icons/Flame_Protection.png",
    "position": {
      "x": -1,
      "y": 3
    },
    "parents": [
      "marksman-crystal_armor"
    ],
    "type": "defense",
    "variant": null,
    "levels": [
      {
        "level": 1,
        "costs": {
          "fc": 0,
          "meat": 700000,
          "wood": 700000,
          "coal": 140000,
          "iron": 35000,
          "steel": 15000
        },
        "timeSeconds": 68140,
        "stats": {
          "Marksman Defense %": 2.0
        },
        "power": 120000,
        "svsPoints": 0
      },
      {
        "level": 2,
        "costs": {
          "fc": 0,
          "meat": 860000,
          "wood": 860000,
          "coal": 170000,
          "iron": 43000,
          "steel": 18000
        },
        "timeSeconds": 83812,
        "stats": {
          "Marksman Defense %": 2.0
        },
        "power": 108000,
        "svsPoints": 0
      },
      {
        "level": 3,
        "costs": {
          "fc": 0,
          "meat": 1000000,
          "wood": 1000000,
          "coal": 210000,
          "iron": 52000,
          "steel": 22000
        },
        "timeSeconds": 102210,
        "stats": {
          "Marksman Defense %": 2.0
        },
        "power": 103200,
        "svsPoints": 0
      },
      {
        "level": 4,
        "costs": {
          "fc": 0,
          "meat": 1200000,
          "wood": 1200000,
          "coal": 250000,
          "iron": 63000,
          "steel": 27000
        },
        "timeSeconds": 122652,
        "stats": {
          "Marksman Defense %": 2.5
        },
        "power": 102300,
        "svsPoints": 0
      },
      {
        "level": 5,
        "costs": {
          "fc": 0,
          "meat": 1500000,
          "wood": 1500000,
          "coal": 300000,
          "iron": 77000,
          "steel": 33000
        },
        "timeSeconds": 149908,
        "stats": {
          "Marksman Defense %": 2.5
        },
        "power": 101100,
        "svsPoints": 0
      },
      {
        "level": 6,
        "costs": {
          "fc": 0,
          "meat": 1800000,
          "wood": 1800000,
          "coal": 370000,
          "iron": 94000,
          "steel": 40000
        },
        "timeSeconds": 183978,
        "stats": {
          "Marksman Defense %": 3.0
        },
        "power": 103800,
        "svsPoints": 0
      },
      {
        "level": 7,
        "costs": {
          "fc": 0,
          "meat": 2300000,
          "wood": 2300000,
          "coal": 460000,
          "iron": 110000,
          "steel": 49000
        },
        "timeSeconds": 224862,
        "stats": {
          "Marksman Defense %": 3.0
        },
        "power": 106200,
        "svsPoints": 0
      },
      {
        "level": 8,
        "costs": {
          "fc": 0,
          "meat": 2800000,
          "wood": 2800000,
          "coal": 560000,
          "iron": 140000,
          "steel": 60000
        },
        "timeSeconds": 272560,
        "stats": {
          "Marksman Defense %": 3.0
        },
        "power": 107400,
        "svsPoints": 0
      },
      {
        "level": 9,
        "costs": {
          "fc": 0,
          "meat": 3500000,
          "wood": 3500000,
          "coal": 700000,
          "iron": 170000,
          "steel": 75000
        },
        "timeSeconds": 340700,
        "stats": {
          "Marksman Defense %": 5.0
        },
        "power": 123000,
        "svsPoints": 0
      },
      {
        "level": 10,
        "costs": {
          "fc": 0,
          "meat": 4200000,
          "wood": 4200000,
          "coal": 840000,
          "iron": 210000,
          "steel": 90000
        },
        "timeSeconds": 408840,
        "stats": {
          "Marksman Defense %": 5.0
        },
        "power": 123000,
        "svsPoints": 0
      },
      {
        "level": 11,
        "costs": {
          "fc": 0,
          "meat": 5000000,
          "wood": 5000000,
          "coal": 1000000,
          "iron": 250000,
          "steel": 100000
        },
        "timeSeconds": 490608,
        "stats": {
          "Marksman Defense %": 5.0
        },
        "power": 120000,
        "svsPoints": 0
      },
      {
        "level": 12,
        "costs": {
          "fc": 0,
          "meat": 6200000,
          "wood": 6200000,
          "coal": 1200000,
          "iron": 310000,
          "steel": 130000
        },
        "timeSeconds": 606446,
        "stats": {
          "Marksman Defense %": 5.0
        },
        "power": 126000,
        "svsPoints": 0
      }
    ]
  },
  {
    "id": "infantry-crystal_protection",
    "slotId": "crystal_protection",
    "name": "Blazing Guardian",
    "branch": "infantry",
    "maxLevel": 12,
    "icon": "../research-icons/Blazing_Guardian.png",
    "position": {
      "x": -1,
      "y": 3
    },
    "parents": [
      "infantry-crystal_armor"
    ],
    "type": "defense",
    "variant": null,
    "levels": [
      {
        "level": 1,
        "costs": {
          "fc": 0,
          "meat": 700000,
          "wood": 700000,
          "coal": 140000,
          "iron": 35000,
          "steel": 15000
        },
        "timeSeconds": 68140,
        "stats": {
          "Infantry Defense %": 2.0
        },
        "power": 120000,
        "svsPoints": 0
      },
      {
        "level": 2,
        "costs": {
          "fc": 0,
          "meat": 860000,
          "wood": 860000,
          "coal": 170000,
          "iron": 43000,
          "steel": 18000
        },
        "timeSeconds": 83812,
        "stats": {
          "Infantry Defense %": 2.0
        },
        "power": 108000,
        "svsPoints": 0
      },
      {
        "level": 3,
        "costs": {
          "fc": 0,
          "meat": 1000000,
          "wood": 1000000,
          "coal": 210000,
          "iron": 52000,
          "steel": 22000
        },
        "timeSeconds": 102210,
        "stats": {
          "Infantry Defense %": 2.0
        },
        "power": 103200,
        "svsPoints": 0
      },
      {
        "level": 4,
        "costs": {
          "fc": 0,
          "meat": 1200000,
          "wood": 1200000,
          "coal": 250000,
          "iron": 63000,
          "steel": 27000
        },
        "timeSeconds": 122652,
        "stats": {
          "Infantry Defense %": 2.5
        },
        "power": 102300,
        "svsPoints": 0
      },
      {
        "level": 5,
        "costs": {
          "fc": 0,
          "meat": 1500000,
          "wood": 1500000,
          "coal": 300000,
          "iron": 77000,
          "steel": 33000
        },
        "timeSeconds": 149908,
        "stats": {
          "Infantry Defense %": 2.5
        },
        "power": 101100,
        "svsPoints": 0
      },
      {
        "level": 6,
        "costs": {
          "fc": 0,
          "meat": 1800000,
          "wood": 1800000,
          "coal": 370000,
          "iron": 94000,
          "steel": 40000
        },
        "timeSeconds": 183978,
        "stats": {
          "Infantry Defense %": 3.0
        },
        "power": 103800,
        "svsPoints": 0
      },
      {
        "level": 7,
        "costs": {
          "fc": 0,
          "meat": 2300000,
          "wood": 2300000,
          "coal": 460000,
          "iron": 110000,
          "steel": 49000
        },
        "timeSeconds": 224862,
        "stats": {
          "Infantry Defense %": 3.0
        },
        "power": 106200,
        "svsPoints": 0
      },
      {
        "level": 8,
        "costs": {
          "fc": 0,
          "meat": 2800000,
          "wood": 2800000,
          "coal": 560000,
          "iron": 140000,
          "steel": 60000
        },
        "timeSeconds": 272560,
        "stats": {
          "Infantry Defense %": 3.0
        },
        "power": 107400,
        "svsPoints": 0
      },
      {
        "level": 9,
        "costs": {
          "fc": 0,
          "meat": 3500000,
          "wood": 3500000,
          "coal": 700000,
          "iron": 170000,
          "steel": 75000
        },
        "timeSeconds": 340700,
        "stats": {
          "Infantry Defense %": 5.0
        },
        "power": 123000,
        "svsPoints": 0
      },
      {
        "level": 10,
        "costs": {
          "fc": 0,
          "meat": 4200000,
          "wood": 4200000,
          "coal": 840000,
          "iron": 210000,
          "steel": 90000
        },
        "timeSeconds": 408840,
        "stats": {
          "Infantry Defense %": 5.0
        },
        "power": 123000,
        "svsPoints": 0
      },
      {
        "level": 11,
        "costs": {
          "fc": 0,
          "meat": 5000000,
          "wood": 5000000,
          "coal": 1000000,
          "iron": 250000,
          "steel": 100000
        },
        "timeSeconds": 490608,
        "stats": {
          "Infantry Defense %": 5.0
        },
        "power": 120000,
        "svsPoints": 0
      },
      {
        "level": 12,
        "costs": {
          "fc": 0,
          "meat": 6200000,
          "wood": 6200000,
          "coal": 1200000,
          "iron": 310000,
          "steel": 130000
        },
        "timeSeconds": 606446,
        "stats": {
          "Infantry Defense %": 5.0
        },
        "power": 126000,
        "svsPoints": 0
      }
    ]
  },
  {
    "id": "lancer-crystal_protection",
    "slotId": "crystal_protection",
    "name": "Crystal Protection",
    "branch": "lancer",
    "maxLevel": 12,
    "icon": "../research-icons/Crystal_Protection.png",
    "position": {
      "x": -1,
      "y": 3
    },
    "parents": [
      "lancer-crystal_armor"
    ],
    "type": "defense",
    "variant": null,
    "levels": [
      {
        "level": 1,
        "costs": {
          "fc": 0,
          "meat": 700000,
          "wood": 700000,
          "coal": 140000,
          "iron": 35000,
          "steel": 15000
        },
        "timeSeconds": 68140,
        "stats": {
          "Lancer Defense %": 2.0
        },
        "power": 120000,
        "svsPoints": 0
      },
      {
        "level": 2,
        "costs": {
          "fc": 0,
          "meat": 860000,
          "wood": 860000,
          "coal": 170000,
          "iron": 43000,
          "steel": 18000
        },
        "timeSeconds": 83812,
        "stats": {
          "Lancer Defense %": 2.0
        },
        "power": 108000,
        "svsPoints": 0
      },
      {
        "level": 3,
        "costs": {
          "fc": 0,
          "meat": 1000000,
          "wood": 1000000,
          "coal": 210000,
          "iron": 52000,
          "steel": 22000
        },
        "timeSeconds": 102210,
        "stats": {
          "Lancer Defense %": 2.0
        },
        "power": 103200,
        "svsPoints": 0
      },
      {
        "level": 4,
        "costs": {
          "fc": 0,
          "meat": 1200000,
          "wood": 1200000,
          "coal": 250000,
          "iron": 63000,
          "steel": 27000
        },
        "timeSeconds": 122652,
        "stats": {
          "Lancer Defense %": 2.5
        },
        "power": 102300,
        "svsPoints": 0
      },
      {
        "level": 5,
        "costs": {
          "fc": 0,
          "meat": 1500000,
          "wood": 1500000,
          "coal": 300000,
          "iron": 77000,
          "steel": 33000
        },
        "timeSeconds": 149908,
        "stats": {
          "Lancer Defense %": 2.5
        },
        "power": 101100,
        "svsPoints": 0
      },
      {
        "level": 6,
        "costs": {
          "fc": 0,
          "meat": 1800000,
          "wood": 1800000,
          "coal": 370000,
          "iron": 94000,
          "steel": 40000
        },
        "timeSeconds": 183978,
        "stats": {
          "Lancer Defense %": 3.0
        },
        "power": 103800,
        "svsPoints": 0
      },
      {
        "level": 7,
        "costs": {
          "fc": 0,
          "meat": 2300000,
          "wood": 2300000,
          "coal": 460000,
          "iron": 110000,
          "steel": 49000
        },
        "timeSeconds": 224862,
        "stats": {
          "Lancer Defense %": 3.0
        },
        "power": 106200,
        "svsPoints": 0
      },
      {
        "level": 8,
        "costs": {
          "fc": 0,
          "meat": 2800000,
          "wood": 2800000,
          "coal": 560000,
          "iron": 140000,
          "steel": 60000
        },
        "timeSeconds": 272560,
        "stats": {
          "Lancer Defense %": 3.0
        },
        "power": 107400,
        "svsPoints": 0
      },
      {
        "level": 9,
        "costs": {
          "fc": 0,
          "meat": 3500000,
          "wood": 3500000,
          "coal": 700000,
          "iron": 170000,
          "steel": 75000
        },
        "timeSeconds": 340700,
        "stats": {
          "Lancer Defense %": 5.0
        },
        "power": 123000,
        "svsPoints": 0
      },
      {
        "level": 10,
        "costs": {
          "fc": 0,
          "meat": 4200000,
          "wood": 4200000,
          "coal": 840000,
          "iron": 210000,
          "steel": 90000
        },
        "timeSeconds": 408840,
        "stats": {
          "Lancer Defense %": 5.0
        },
        "power": 123000,
        "svsPoints": 0
      },
      {
        "level": 11,
        "costs": {
          "fc": 0,
          "meat": 5000000,
          "wood": 5000000,
          "coal": 1000000,
          "iron": 250000,
          "steel": 100000
        },
        "timeSeconds": 490608,
        "stats": {
          "Lancer Defense %": 5.0
        },
        "power": 120000,
        "svsPoints": 0
      },
      {
        "level": 12,
        "costs": {
          "fc": 0,
          "meat": 6200000,
          "wood": 6200000,
          "coal": 1200000,
          "iron": 310000,
          "steel": 130000
        },
        "timeSeconds": 606446,
        "stats": {
          "Lancer Defense %": 5.0
        },
        "power": 126000,
        "svsPoints": 0
      }
    ]
  },
  {
    "id": "marksman-crystal_arrow",
    "slotId": "crystal_arrow",
    "name": "Flame Tomahawk",
    "branch": "marksman",
    "maxLevel": 12,
    "icon": "../research-icons/Flame_Tomahawk.png",
    "position": {
      "x": 1,
      "y": 3
    },
    "parents": [
      "marksman-crystal_vision"
    ],
    "type": "damage",
    "variant": null,
    "levels": [
      {
        "level": 1,
        "costs": {
          "fc": 0,
          "meat": 700000,
          "wood": 700000,
          "coal": 140000,
          "iron": 35000,
          "steel": 15000
        },
        "timeSeconds": 68140,
        "stats": {
          "Marksman Attack %": 2.0
        },
        "power": 120000,
        "svsPoints": 0
      },
      {
        "level": 2,
        "costs": {
          "fc": 0,
          "meat": 860000,
          "wood": 860000,
          "coal": 170000,
          "iron": 43000,
          "steel": 18000
        },
        "timeSeconds": 83812,
        "stats": {
          "Marksman Attack %": 2.0
        },
        "power": 108000,
        "svsPoints": 0
      },
      {
        "level": 3,
        "costs": {
          "fc": 0,
          "meat": 1000000,
          "wood": 1000000,
          "coal": 210000,
          "iron": 52000,
          "steel": 22000
        },
        "timeSeconds": 102210,
        "stats": {
          "Marksman Attack %": 2.0
        },
        "power": 103200,
        "svsPoints": 0
      },
      {
        "level": 4,
        "costs": {
          "fc": 0,
          "meat": 1200000,
          "wood": 1200000,
          "coal": 250000,
          "iron": 63000,
          "steel": 27000
        },
        "timeSeconds": 122652,
        "stats": {
          "Marksman Attack %": 2.5
        },
        "power": 102300,
        "svsPoints": 0
      },
      {
        "level": 5,
        "costs": {
          "fc": 0,
          "meat": 1500000,
          "wood": 1500000,
          "coal": 300000,
          "iron": 77000,
          "steel": 33000
        },
        "timeSeconds": 149908,
        "stats": {
          "Marksman Attack %": 2.5
        },
        "power": 101100,
        "svsPoints": 0
      },
      {
        "level": 6,
        "costs": {
          "fc": 0,
          "meat": 1800000,
          "wood": 1800000,
          "coal": 370000,
          "iron": 94000,
          "steel": 40000
        },
        "timeSeconds": 183978,
        "stats": {
          "Marksman Attack %": 3.0
        },
        "power": 103800,
        "svsPoints": 0
      },
      {
        "level": 7,
        "costs": {
          "fc": 0,
          "meat": 2300000,
          "wood": 2300000,
          "coal": 460000,
          "iron": 110000,
          "steel": 49000
        },
        "timeSeconds": 224862,
        "stats": {
          "Marksman Attack %": 3.0
        },
        "power": 106200,
        "svsPoints": 0
      },
      {
        "level": 8,
        "costs": {
          "fc": 0,
          "meat": 2800000,
          "wood": 2800000,
          "coal": 560000,
          "iron": 140000,
          "steel": 60000
        },
        "timeSeconds": 272560,
        "stats": {
          "Marksman Attack %": 3.0
        },
        "power": 107400,
        "svsPoints": 0
      },
      {
        "level": 9,
        "costs": {
          "fc": 0,
          "meat": 3500000,
          "wood": 3500000,
          "coal": 700000,
          "iron": 170000,
          "steel": 75000
        },
        "timeSeconds": 340700,
        "stats": {
          "Marksman Attack %": 5.0
        },
        "power": 123000,
        "svsPoints": 0
      },
      {
        "level": 10,
        "costs": {
          "fc": 0,
          "meat": 4200000,
          "wood": 4200000,
          "coal": 840000,
          "iron": 210000,
          "steel": 90000
        },
        "timeSeconds": 408840,
        "stats": {
          "Marksman Attack %": 5.0
        },
        "power": 123000,
        "svsPoints": 0
      },
      {
        "level": 11,
        "costs": {
          "fc": 0,
          "meat": 5000000,
          "wood": 5000000,
          "coal": 1000000,
          "iron": 250000,
          "steel": 100000
        },
        "timeSeconds": 490608,
        "stats": {
          "Marksman Attack %": 5.0
        },
        "power": 120000,
        "svsPoints": 0
      },
      {
        "level": 12,
        "costs": {
          "fc": 0,
          "meat": 6200000,
          "wood": 6200000,
          "coal": 1200000,
          "iron": 310000,
          "steel": 130000
        },
        "timeSeconds": 606446,
        "stats": {
          "Marksman Attack %": 5.0
        },
        "power": 126000,
        "svsPoints": 0
      }
    ]
  },
  {
    "id": "infantry-crystal_arrow",
    "slotId": "crystal_arrow",
    "name": "Blazing Lance",
    "branch": "infantry",
    "maxLevel": 12,
    "icon": "../research-icons/Blazing_Lance.png",
    "position": {
      "x": 1,
      "y": 3
    },
    "parents": [
      "infantry-crystal_vision"
    ],
    "type": "damage",
    "variant": null,
    "levels": [
      {
        "level": 1,
        "costs": {
          "fc": 0,
          "meat": 700000,
          "wood": 700000,
          "coal": 140000,
          "iron": 35000,
          "steel": 15000
        },
        "timeSeconds": 68140,
        "stats": {
          "Infantry Attack %": 2.0
        },
        "power": 120000,
        "svsPoints": 0
      },
      {
        "level": 2,
        "costs": {
          "fc": 0,
          "meat": 860000,
          "wood": 860000,
          "coal": 170000,
          "iron": 43000,
          "steel": 18000
        },
        "timeSeconds": 83812,
        "stats": {
          "Infantry Attack %": 2.0
        },
        "power": 108000,
        "svsPoints": 0
      },
      {
        "level": 3,
        "costs": {
          "fc": 0,
          "meat": 1000000,
          "wood": 1000000,
          "coal": 210000,
          "iron": 52000,
          "steel": 22000
        },
        "timeSeconds": 102210,
        "stats": {
          "Infantry Attack %": 2.0
        },
        "power": 103200,
        "svsPoints": 0
      },
      {
        "level": 4,
        "costs": {
          "fc": 0,
          "meat": 1200000,
          "wood": 1200000,
          "coal": 250000,
          "iron": 63000,
          "steel": 27000
        },
        "timeSeconds": 122652,
        "stats": {
          "Infantry Attack %": 2.5
        },
        "power": 102300,
        "svsPoints": 0
      },
      {
        "level": 5,
        "costs": {
          "fc": 0,
          "meat": 1500000,
          "wood": 1500000,
          "coal": 300000,
          "iron": 77000,
          "steel": 33000
        },
        "timeSeconds": 149908,
        "stats": {
          "Infantry Attack %": 2.5
        },
        "power": 101100,
        "svsPoints": 0
      },
      {
        "level": 6,
        "costs": {
          "fc": 0,
          "meat": 1800000,
          "wood": 1800000,
          "coal": 370000,
          "iron": 94000,
          "steel": 40000
        },
        "timeSeconds": 183978,
        "stats": {
          "Infantry Attack %": 3.0
        },
        "power": 103800,
        "svsPoints": 0
      },
      {
        "level": 7,
        "costs": {
          "fc": 0,
          "meat": 2300000,
          "wood": 2300000,
          "coal": 460000,
          "iron": 110000,
          "steel": 49000
        },
        "timeSeconds": 224862,
        "stats": {
          "Infantry Attack %": 3.0
        },
        "power": 106200,
        "svsPoints": 0
      },
      {
        "level": 8,
        "costs": {
          "fc": 0,
          "meat": 2800000,
          "wood": 2800000,
          "coal": 560000,
          "iron": 140000,
          "steel": 60000
        },
        "timeSeconds": 272560,
        "stats": {
          "Infantry Attack %": 3.0
        },
        "power": 107400,
        "svsPoints": 0
      },
      {
        "level": 9,
        "costs": {
          "fc": 0,
          "meat": 3500000,
          "wood": 3500000,
          "coal": 700000,
          "iron": 170000,
          "steel": 75000
        },
        "timeSeconds": 340700,
        "stats": {
          "Infantry Attack %": 5.0
        },
        "power": 123000,
        "svsPoints": 0
      },
      {
        "level": 10,
        "costs": {
          "fc": 0,
          "meat": 4200000,
          "wood": 4200000,
          "coal": 840000,
          "iron": 210000,
          "steel": 90000
        },
        "timeSeconds": 408840,
        "stats": {
          "Infantry Attack %": 5.0
        },
        "power": 123000,
        "svsPoints": 0
      },
      {
        "level": 11,
        "costs": {
          "fc": 0,
          "meat": 5000000,
          "wood": 5000000,
          "coal": 1000000,
          "iron": 250000,
          "steel": 100000
        },
        "timeSeconds": 490608,
        "stats": {
          "Infantry Attack %": 5.0
        },
        "power": 120000,
        "svsPoints": 0
      },
      {
        "level": 12,
        "costs": {
          "fc": 0,
          "meat": 6200000,
          "wood": 6200000,
          "coal": 1200000,
          "iron": 310000,
          "steel": 130000
        },
        "timeSeconds": 606446,
        "stats": {
          "Infantry Attack %": 5.0
        },
        "power": 126000,
        "svsPoints": 0
      }
    ]
  },
  {
    "id": "lancer-crystal_arrow",
    "slotId": "crystal_arrow",
    "name": "Crystal Arrow",
    "branch": "lancer",
    "maxLevel": 12,
    "icon": "../research-icons/Crystal_Arrow.png",
    "position": {
      "x": 1,
      "y": 3
    },
    "parents": [
      "lancer-crystal_vision"
    ],
    "type": "damage",
    "variant": null,
    "levels": [
      {
        "level": 1,
        "costs": {
          "fc": 0,
          "meat": 700000,
          "wood": 700000,
          "coal": 140000,
          "iron": 35000,
          "steel": 15000
        },
        "timeSeconds": 68140,
        "stats": {
          "Lancer Attack %": 2.0
        },
        "power": 120000,
        "svsPoints": 0
      },
      {
        "level": 2,
        "costs": {
          "fc": 0,
          "meat": 860000,
          "wood": 860000,
          "coal": 170000,
          "iron": 43000,
          "steel": 18000
        },
        "timeSeconds": 83812,
        "stats": {
          "Lancer Attack %": 2.0
        },
        "power": 108000,
        "svsPoints": 0
      },
      {
        "level": 3,
        "costs": {
          "fc": 0,
          "meat": 1000000,
          "wood": 1000000,
          "coal": 210000,
          "iron": 52000,
          "steel": 22000
        },
        "timeSeconds": 102210,
        "stats": {
          "Lancer Attack %": 2.0
        },
        "power": 103200,
        "svsPoints": 0
      },
      {
        "level": 4,
        "costs": {
          "fc": 0,
          "meat": 1200000,
          "wood": 1200000,
          "coal": 250000,
          "iron": 63000,
          "steel": 27000
        },
        "timeSeconds": 122652,
        "stats": {
          "Lancer Attack %": 2.5
        },
        "power": 102300,
        "svsPoints": 0
      },
      {
        "level": 5,
        "costs": {
          "fc": 0,
          "meat": 1500000,
          "wood": 1500000,
          "coal": 300000,
          "iron": 77000,
          "steel": 33000
        },
        "timeSeconds": 149908,
        "stats": {
          "Lancer Attack %": 2.5
        },
        "power": 101100,
        "svsPoints": 0
      },
      {
        "level": 6,
        "costs": {
          "fc": 0,
          "meat": 1800000,
          "wood": 1800000,
          "coal": 370000,
          "iron": 94000,
          "steel": 40000
        },
        "timeSeconds": 183978,
        "stats": {
          "Lancer Attack %": 3.0
        },
        "power": 103800,
        "svsPoints": 0
      },
      {
        "level": 7,
        "costs": {
          "fc": 0,
          "meat": 2300000,
          "wood": 2300000,
          "coal": 460000,
          "iron": 110000,
          "steel": 49000
        },
        "timeSeconds": 224862,
        "stats": {
          "Lancer Attack %": 3.0
        },
        "power": 106200,
        "svsPoints": 0
      },
      {
        "level": 8,
        "costs": {
          "fc": 0,
          "meat": 2800000,
          "wood": 2800000,
          "coal": 560000,
          "iron": 140000,
          "steel": 60000
        },
        "timeSeconds": 272560,
        "stats": {
          "Lancer Attack %": 3.0
        },
        "power": 107400,
        "svsPoints": 0
      },
      {
        "level": 9,
        "costs": {
          "fc": 0,
          "meat": 3500000,
          "wood": 3500000,
          "coal": 700000,
          "iron": 170000,
          "steel": 75000
        },
        "timeSeconds": 340700,
        "stats": {
          "Lancer Attack %": 5.0
        },
        "power": 123000,
        "svsPoints": 0
      },
      {
        "level": 10,
        "costs": {
          "fc": 0,
          "meat": 4200000,
          "wood": 4200000,
          "coal": 840000,
          "iron": 210000,
          "steel": 90000
        },
        "timeSeconds": 408840,
        "stats": {
          "Lancer Attack %": 5.0
        },
        "power": 123000,
        "svsPoints": 0
      },
      {
        "level": 11,
        "costs": {
          "fc": 0,
          "meat": 5000000,
          "wood": 5000000,
          "coal": 1000000,
          "iron": 250000,
          "steel": 100000
        },
        "timeSeconds": 490608,
        "stats": {
          "Lancer Attack %": 5.0
        },
        "power": 120000,
        "svsPoints": 0
      },
      {
        "level": 12,
        "costs": {
          "fc": 0,
          "meat": 6200000,
          "wood": 6200000,
          "coal": 1200000,
          "iron": 310000,
          "steel": 130000
        },
        "timeSeconds": 606446,
        "stats": {
          "Lancer Attack %": 5.0
        },
        "power": 126000,
        "svsPoints": 0
      }
    ]
  },
  {
    "id": "marksman-crystal_armor",
    "slotId": "crystal_armor",
    "name": "Flame Shield",
    "branch": "marksman",
    "maxLevel": 8,
    "icon": "../research-icons/Flame_Shield.png",
    "position": {
      "x": -1,
      "y": 4
    },
    "parents": [
      "marksman-flame_squad"
    ],
    "type": "defense",
    "variant": null,
    "levels": [
      {
        "level": 1,
        "costs": {
          "fc": 0,
          "meat": 800000,
          "wood": 800000,
          "coal": 160000,
          "iron": 40000,
          "steel": 10000
        },
        "timeSeconds": 72000,
        "stats": {
          "Marksman Health %": 1.5
        },
        "power": 82500,
        "svsPoints": 0
      },
      {
        "level": 2,
        "costs": {
          "fc": 0,
          "meat": 1100000,
          "wood": 1100000,
          "coal": 290000,
          "iron": 56000,
          "steel": 14000
        },
        "timeSeconds": 100800,
        "stats": {
          "Marksman Health %": 1.5
        },
        "power": 74250,
        "svsPoints": 0
      },
      {
        "level": 3,
        "costs": {
          "fc": 0,
          "meat": 1400000,
          "wood": 1400000,
          "coal": 290000,
          "iron": 74000,
          "steel": 18000
        },
        "timeSeconds": 133200,
        "stats": {
          "Marksman Health %": 3.0
        },
        "power": 90750,
        "svsPoints": 0
      },
      {
        "level": 4,
        "costs": {
          "fc": 0,
          "meat": 2000000,
          "wood": 2000000,
          "coal": 400000,
          "iron": 100000,
          "steel": 25000
        },
        "timeSeconds": 183600,
        "stats": {
          "Marksman Health %": 3.0
        },
        "power": 99000,
        "svsPoints": 0
      },
      {
        "level": 5,
        "costs": {
          "fc": 0,
          "meat": 2700000,
          "wood": 2700000,
          "coal": 540000,
          "iron": 130000,
          "steel": 34000
        },
        "timeSeconds": 244800,
        "stats": {
          "Marksman Health %": 3.0
        },
        "power": 95700,
        "svsPoints": 0
      },
      {
        "level": 6,
        "costs": {
          "fc": 0,
          "meat": 3600000,
          "wood": 3600000,
          "coal": 730000,
          "iron": 180000,
          "steel": 46000
        },
        "timeSeconds": 331200,
        "stats": {
          "Marksman Health %": 3.0
        },
        "power": 98175,
        "svsPoints": 0
      },
      {
        "level": 7,
        "costs": {
          "fc": 0,
          "meat": 4900000,
          "wood": 4900000,
          "coal": 990000,
          "iron": 240000,
          "steel": 62000
        },
        "timeSeconds": 446400,
        "stats": {
          "Marksman Health %": 5.0
        },
        "power": 122925,
        "svsPoints": 0
      },
      {
        "level": 8,
        "costs": {
          "fc": 0,
          "meat": 6600000,
          "wood": 6600000,
          "coal": 1300000,
          "iron": 330000,
          "steel": 83000
        },
        "timeSeconds": 601200,
        "stats": {
          "Marksman Health %": 5.0
        },
        "power": 120450,
        "svsPoints": 0
      }
    ]
  },
  {
    "id": "infantry-crystal_armor",
    "slotId": "crystal_armor",
    "name": "Blazing Armor",
    "branch": "infantry",
    "maxLevel": 8,
    "icon": "../research-icons/Blazing_Armor.png",
    "position": {
      "x": -1,
      "y": 4
    },
    "parents": [
      "infantry-flame_squad"
    ],
    "type": "defense",
    "variant": null,
    "levels": [
      {
        "level": 1,
        "costs": {
          "fc": 0,
          "meat": 800000,
          "wood": 800000,
          "coal": 160000,
          "iron": 40000,
          "steel": 10000
        },
        "timeSeconds": 72000,
        "stats": {
          "Infantry Health %": 1.5
        },
        "power": 82500,
        "svsPoints": 0
      },
      {
        "level": 2,
        "costs": {
          "fc": 0,
          "meat": 1100000,
          "wood": 1100000,
          "coal": 290000,
          "iron": 56000,
          "steel": 14000
        },
        "timeSeconds": 100800,
        "stats": {
          "Infantry Health %": 1.5
        },
        "power": 74250,
        "svsPoints": 0
      },
      {
        "level": 3,
        "costs": {
          "fc": 0,
          "meat": 1400000,
          "wood": 1400000,
          "coal": 290000,
          "iron": 74000,
          "steel": 18000
        },
        "timeSeconds": 133200,
        "stats": {
          "Infantry Health %": 3.0
        },
        "power": 90750,
        "svsPoints": 0
      },
      {
        "level": 4,
        "costs": {
          "fc": 0,
          "meat": 2000000,
          "wood": 2000000,
          "coal": 400000,
          "iron": 100000,
          "steel": 25000
        },
        "timeSeconds": 183600,
        "stats": {
          "Infantry Health %": 3.0
        },
        "power": 99000,
        "svsPoints": 0
      },
      {
        "level": 5,
        "costs": {
          "fc": 0,
          "meat": 2700000,
          "wood": 2700000,
          "coal": 540000,
          "iron": 130000,
          "steel": 34000
        },
        "timeSeconds": 244800,
        "stats": {
          "Infantry Health %": 3.0
        },
        "power": 95700,
        "svsPoints": 0
      },
      {
        "level": 6,
        "costs": {
          "fc": 0,
          "meat": 3600000,
          "wood": 3600000,
          "coal": 730000,
          "iron": 180000,
          "steel": 46000
        },
        "timeSeconds": 331200,
        "stats": {
          "Infantry Health %": 3.0
        },
        "power": 98175,
        "svsPoints": 0
      },
      {
        "level": 7,
        "costs": {
          "fc": 0,
          "meat": 4900000,
          "wood": 4900000,
          "coal": 990000,
          "iron": 240000,
          "steel": 62000
        },
        "timeSeconds": 446400,
        "stats": {
          "Infantry Health %": 5.0
        },
        "power": 122925,
        "svsPoints": 0
      },
      {
        "level": 8,
        "costs": {
          "fc": 0,
          "meat": 6600000,
          "wood": 6600000,
          "coal": 1300000,
          "iron": 330000,
          "steel": 83000
        },
        "timeSeconds": 601200,
        "stats": {
          "Infantry Health %": 5.0
        },
        "power": 120450,
        "svsPoints": 0
      }
    ]
  },
  {
    "id": "lancer-crystal_armor",
    "slotId": "crystal_armor",
    "name": "Crystal Armor",
    "branch": "lancer",
    "maxLevel": 8,
    "icon": "../research-icons/Crystal_Armor.png",
    "position": {
      "x": -1,
      "y": 4
    },
    "parents": [
      "lancer-flame_squad"
    ],
    "type": "defense",
    "variant": null,
    "levels": [
      {
        "level": 1,
        "costs": {
          "fc": 0,
          "meat": 800000,
          "wood": 800000,
          "coal": 160000,
          "iron": 40000,
          "steel": 10000
        },
        "timeSeconds": 72000,
        "stats": {
          "Lancer Health %": 1.5
        },
        "power": 82500,
        "svsPoints": 0
      },
      {
        "level": 2,
        "costs": {
          "fc": 0,
          "meat": 1100000,
          "wood": 1100000,
          "coal": 290000,
          "iron": 56000,
          "steel": 14000
        },
        "timeSeconds": 100800,
        "stats": {
          "Lancer Health %": 1.5
        },
        "power": 74250,
        "svsPoints": 0
      },
      {
        "level": 3,
        "costs": {
          "fc": 0,
          "meat": 1400000,
          "wood": 1400000,
          "coal": 290000,
          "iron": 74000,
          "steel": 18000
        },
        "timeSeconds": 133200,
        "stats": {
          "Lancer Health %": 3.0
        },
        "power": 90750,
        "svsPoints": 0
      },
      {
        "level": 4,
        "costs": {
          "fc": 0,
          "meat": 2000000,
          "wood": 2000000,
          "coal": 400000,
          "iron": 100000,
          "steel": 25000
        },
        "timeSeconds": 183600,
        "stats": {
          "Lancer Health %": 3.0
        },
        "power": 99000,
        "svsPoints": 0
      },
      {
        "level": 5,
        "costs": {
          "fc": 0,
          "meat": 2700000,
          "wood": 2700000,
          "coal": 540000,
          "iron": 130000,
          "steel": 34000
        },
        "timeSeconds": 244800,
        "stats": {
          "Lancer Health %": 3.0
        },
        "power": 95700,
        "svsPoints": 0
      },
      {
        "level": 6,
        "costs": {
          "fc": 0,
          "meat": 3600000,
          "wood": 3600000,
          "coal": 730000,
          "iron": 180000,
          "steel": 46000
        },
        "timeSeconds": 331200,
        "stats": {
          "Lancer Health %": 3.0
        },
        "power": 98175,
        "svsPoints": 0
      },
      {
        "level": 7,
        "costs": {
          "fc": 0,
          "meat": 4900000,
          "wood": 4900000,
          "coal": 990000,
          "iron": 240000,
          "steel": 62000
        },
        "timeSeconds": 446400,
        "stats": {
          "Lancer Health %": 5.0
        },
        "power": 122925,
        "svsPoints": 0
      },
      {
        "level": 8,
        "costs": {
          "fc": 0,
          "meat": 6600000,
          "wood": 6600000,
          "coal": 1300000,
          "iron": 330000,
          "steel": 83000
        },
        "timeSeconds": 601200,
        "stats": {
          "Lancer Health %": 5.0
        },
        "power": 120450,
        "svsPoints": 0
      }
    ]
  },
  {
    "id": "marksman-crystal_vision",
    "slotId": "crystal_vision",
    "name": "Flame Strike",
    "branch": "marksman",
    "maxLevel": 8,
    "icon": "../research-icons/Flame_Strike.png",
    "position": {
      "x": 1,
      "y": 4
    },
    "parents": [
      "marksman-flame_squad"
    ],
    "type": "damage",
    "variant": null,
    "levels": [
      {
        "level": 1,
        "costs": {
          "fc": 0,
          "meat": 800000,
          "wood": 800000,
          "coal": 160000,
          "iron": 40000,
          "steel": 10000
        },
        "timeSeconds": 72000,
        "stats": {
          "Marksman Lethality %": 1.5
        },
        "power": 82500,
        "svsPoints": 0
      },
      {
        "level": 2,
        "costs": {
          "fc": 0,
          "meat": 1100000,
          "wood": 1100000,
          "coal": 290000,
          "iron": 56000,
          "steel": 14000
        },
        "timeSeconds": 100800,
        "stats": {
          "Marksman Lethality %": 1.5
        },
        "power": 74250,
        "svsPoints": 0
      },
      {
        "level": 3,
        "costs": {
          "fc": 0,
          "meat": 1400000,
          "wood": 1400000,
          "coal": 290000,
          "iron": 74000,
          "steel": 18000
        },
        "timeSeconds": 133200,
        "stats": {
          "Marksman Lethality %": 3.0
        },
        "power": 90750,
        "svsPoints": 0
      },
      {
        "level": 4,
        "costs": {
          "fc": 0,
          "meat": 2000000,
          "wood": 2000000,
          "coal": 400000,
          "iron": 100000,
          "steel": 25000
        },
        "timeSeconds": 183600,
        "stats": {
          "Marksman Lethality %": 3.0
        },
        "power": 99000,
        "svsPoints": 0
      },
      {
        "level": 5,
        "costs": {
          "fc": 0,
          "meat": 2700000,
          "wood": 2700000,
          "coal": 540000,
          "iron": 130000,
          "steel": 34000
        },
        "timeSeconds": 244800,
        "stats": {
          "Marksman Lethality %": 3.0
        },
        "power": 95700,
        "svsPoints": 0
      },
      {
        "level": 6,
        "costs": {
          "fc": 0,
          "meat": 3600000,
          "wood": 3600000,
          "coal": 730000,
          "iron": 180000,
          "steel": 46000
        },
        "timeSeconds": 331200,
        "stats": {
          "Marksman Lethality %": 3.0
        },
        "power": 98175,
        "svsPoints": 0
      },
      {
        "level": 7,
        "costs": {
          "fc": 0,
          "meat": 4900000,
          "wood": 4900000,
          "coal": 990000,
          "iron": 240000,
          "steel": 62000
        },
        "timeSeconds": 446400,
        "stats": {
          "Marksman Lethality %": 5.0
        },
        "power": 122925,
        "svsPoints": 0
      },
      {
        "level": 8,
        "costs": {
          "fc": 0,
          "meat": 6600000,
          "wood": 6600000,
          "coal": 1300000,
          "iron": 330000,
          "steel": 83000
        },
        "timeSeconds": 601200,
        "stats": {
          "Marksman Lethality %": 5.0
        },
        "power": 120450,
        "svsPoints": 0
      }
    ]
  },
  {
    "id": "infantry-crystal_vision",
    "slotId": "crystal_vision",
    "name": "Blazing Charge",
    "branch": "infantry",
    "maxLevel": 8,
    "icon": "../research-icons/Blazing_Charge.png",
    "position": {
      "x": 1,
      "y": 4
    },
    "parents": [
      "infantry-flame_squad"
    ],
    "type": "damage",
    "variant": null,
    "levels": [
      {
        "level": 1,
        "costs": {
          "fc": 0,
          "meat": 800000,
          "wood": 800000,
          "coal": 160000,
          "iron": 40000,
          "steel": 10000
        },
        "timeSeconds": 72000,
        "stats": {
          "Infantry Lethality %": 1.5
        },
        "power": 82500,
        "svsPoints": 0
      },
      {
        "level": 2,
        "costs": {
          "fc": 0,
          "meat": 1100000,
          "wood": 1100000,
          "coal": 290000,
          "iron": 56000,
          "steel": 14000
        },
        "timeSeconds": 100800,
        "stats": {
          "Infantry Lethality %": 1.5
        },
        "power": 74250,
        "svsPoints": 0
      },
      {
        "level": 3,
        "costs": {
          "fc": 0,
          "meat": 1400000,
          "wood": 1400000,
          "coal": 290000,
          "iron": 74000,
          "steel": 18000
        },
        "timeSeconds": 133200,
        "stats": {
          "Infantry Lethality %": 3.0
        },
        "power": 90750,
        "svsPoints": 0
      },
      {
        "level": 4,
        "costs": {
          "fc": 0,
          "meat": 2000000,
          "wood": 2000000,
          "coal": 400000,
          "iron": 100000,
          "steel": 25000
        },
        "timeSeconds": 183600,
        "stats": {
          "Infantry Lethality %": 3.0
        },
        "power": 99000,
        "svsPoints": 0
      },
      {
        "level": 5,
        "costs": {
          "fc": 0,
          "meat": 2700000,
          "wood": 2700000,
          "coal": 540000,
          "iron": 130000,
          "steel": 34000
        },
        "timeSeconds": 244800,
        "stats": {
          "Infantry Lethality %": 3.0
        },
        "power": 95700,
        "svsPoints": 0
      },
      {
        "level": 6,
        "costs": {
          "fc": 0,
          "meat": 3600000,
          "wood": 3600000,
          "coal": 730000,
          "iron": 180000,
          "steel": 46000
        },
        "timeSeconds": 331200,
        "stats": {
          "Infantry Lethality %": 3.0
        },
        "power": 98175,
        "svsPoints": 0
      },
      {
        "level": 7,
        "costs": {
          "fc": 0,
          "meat": 4900000,
          "wood": 4900000,
          "coal": 990000,
          "iron": 240000,
          "steel": 62000
        },
        "timeSeconds": 446400,
        "stats": {
          "Infantry Lethality %": 5.0
        },
        "power": 122925,
        "svsPoints": 0
      },
      {
        "level": 8,
        "costs": {
          "fc": 0,
          "meat": 6600000,
          "wood": 6600000,
          "coal": 1300000,
          "iron": 330000,
          "steel": 83000
        },
        "timeSeconds": 601200,
        "stats": {
          "Infantry Lethality %": 5.0
        },
        "power": 120450,
        "svsPoints": 0
      }
    ]
  },
  {
    "id": "lancer-crystal_vision",
    "slotId": "crystal_vision",
    "name": "Crystal Vision",
    "branch": "lancer",
    "maxLevel": 8,
    "icon": "../research-icons/Crystal_Vision.png",
    "position": {
      "x": 1,
      "y": 4
    },
    "parents": [
      "lancer-flame_squad"
    ],
    "type": "damage",
    "variant": null,
    "levels": [
      {
        "level": 1,
        "costs": {
          "fc": 0,
          "meat": 800000,
          "wood": 800000,
          "coal": 160000,
          "iron": 40000,
          "steel": 10000
        },
        "timeSeconds": 72000,
        "stats": {
          "Lancer Lethality %": 1.5
        },
        "power": 82500,
        "svsPoints": 0
      },
      {
        "level": 2,
        "costs": {
          "fc": 0,
          "meat": 1100000,
          "wood": 1100000,
          "coal": 290000,
          "iron": 56000,
          "steel": 14000
        },
        "timeSeconds": 100800,
        "stats": {
          "Lancer Lethality %": 1.5
        },
        "power": 74250,
        "svsPoints": 0
      },
      {
        "level": 3,
        "costs": {
          "fc": 0,
          "meat": 1400000,
          "wood": 1400000,
          "coal": 290000,
          "iron": 74000,
          "steel": 18000
        },
        "timeSeconds": 133200,
        "stats": {
          "Lancer Lethality %": 3.0
        },
        "power": 90750,
        "svsPoints": 0
      },
      {
        "level": 4,
        "costs": {
          "fc": 0,
          "meat": 2000000,
          "wood": 2000000,
          "coal": 400000,
          "iron": 100000,
          "steel": 25000
        },
        "timeSeconds": 183600,
        "stats": {
          "Lancer Lethality %": 3.0
        },
        "power": 99000,
        "svsPoints": 0
      },
      {
        "level": 5,
        "costs": {
          "fc": 0,
          "meat": 2700000,
          "wood": 2700000,
          "coal": 540000,
          "iron": 130000,
          "steel": 34000
        },
        "timeSeconds": 244800,
        "stats": {
          "Lancer Lethality %": 3.0
        },
        "power": 95700,
        "svsPoints": 0
      },
      {
        "level": 6,
        "costs": {
          "fc": 0,
          "meat": 3600000,
          "wood": 3600000,
          "coal": 730000,
          "iron": 180000,
          "steel": 46000
        },
        "timeSeconds": 331200,
        "stats": {
          "Lancer Lethality %": 3.0
        },
        "power": 98175,
        "svsPoints": 0
      },
      {
        "level": 7,
        "costs": {
          "fc": 0,
          "meat": 4900000,
          "wood": 4900000,
          "coal": 990000,
          "iron": 240000,
          "steel": 62000
        },
        "timeSeconds": 446400,
        "stats": {
          "Lancer Lethality %": 5.0
        },
        "power": 122925,
        "svsPoints": 0
      },
      {
        "level": 8,
        "costs": {
          "fc": 0,
          "meat": 6600000,
          "wood": 6600000,
          "coal": 1300000,
          "iron": 330000,
          "steel": 83000
        },
        "timeSeconds": 601200,
        "stats": {
          "Lancer Lethality %": 5.0
        },
        "power": 120450,
        "svsPoints": 0
      }
    ]
  },
  {
    "id": "marksman-flame_squad",
    "slotId": "flame_squad",
    "name": "Flame Squad",
    "branch": "marksman",
    "maxLevel": 5,
    "icon": "../research-icons/Flame_Squad.png",
    "position": {
      "x": 0,
      "y": 5
    },
    "parents": [
      "marksman-root"
    ],
    "type": "utility",
    "variant": null,
    "levels": [
      {
        "level": 1,
        "costs": {
          "fc": 0,
          "meat": 300000,
          "wood": 300000,
          "coal": 60000,
          "iron": 15000,
          "steel": 5000
        },
        "timeSeconds": 28800,
        "stats": {
          "Troop Deployment Capacity": 200.0
        },
        "power": 60000,
        "svsPoints": 0
      },
      {
        "level": 2,
        "costs": {
          "fc": 0,
          "meat": 480000,
          "wood": 480000,
          "coal": 96000,
          "iron": 24000,
          "steel": 8000
        },
        "timeSeconds": 46080,
        "stats": {
          "Troop Deployment Capacity": 200.0
        },
        "power": 60000,
        "svsPoints": 0
      },
      {
        "level": 3,
        "costs": {
          "fc": 0,
          "meat": 780000,
          "wood": 780000,
          "coal": 150000,
          "iron": 39000,
          "steel": 13000
        },
        "timeSeconds": 74880,
        "stats": {
          "Troop Deployment Capacity": 200.0
        },
        "power": 60000,
        "svsPoints": 0
      },
      {
        "level": 4,
        "costs": {
          "fc": 0,
          "meat": 1200000,
          "wood": 1200000,
          "coal": 250000,
          "iron": 64000,
          "steel": 21000
        },
        "timeSeconds": 123840,
        "stats": {
          "Troop Deployment Capacity": 200.0
        },
        "power": 60000,
        "svsPoints": 0
      },
      {
        "level": 5,
        "costs": {
          "fc": 0,
          "meat": 2000000,
          "wood": 2000000,
          "coal": 400000,
          "iron": 100000,
          "steel": 33000
        },
        "timeSeconds": 194400,
        "stats": {
          "Troop Deployment Capacity": 200.0
        },
        "power": 60000,
        "svsPoints": 0
      }
    ]
  },
  {
    "id": "infantry-flame_squad",
    "slotId": "flame_squad",
    "name": "Flame Squad",
    "branch": "infantry",
    "maxLevel": 5,
    "icon": "../research-icons/Flame_Squad.png",
    "position": {
      "x": 0,
      "y": 5
    },
    "parents": [
      "infantry-root"
    ],
    "type": "utility",
    "variant": null,
    "levels": [
      {
        "level": 1,
        "costs": {
          "fc": 0,
          "meat": 300000,
          "wood": 300000,
          "coal": 60000,
          "iron": 15000,
          "steel": 5000
        },
        "timeSeconds": 28800,
        "stats": {
          "Troop Deployment Capacity": 200.0
        },
        "power": 60000,
        "svsPoints": 0
      },
      {
        "level": 2,
        "costs": {
          "fc": 0,
          "meat": 480000,
          "wood": 480000,
          "coal": 96000,
          "iron": 24000,
          "steel": 8000
        },
        "timeSeconds": 46080,
        "stats": {
          "Troop Deployment Capacity": 200.0
        },
        "power": 60000,
        "svsPoints": 0
      },
      {
        "level": 3,
        "costs": {
          "fc": 0,
          "meat": 780000,
          "wood": 780000,
          "coal": 150000,
          "iron": 39000,
          "steel": 13000
        },
        "timeSeconds": 74880,
        "stats": {
          "Troop Deployment Capacity": 200.0
        },
        "power": 60000,
        "svsPoints": 0
      },
      {
        "level": 4,
        "costs": {
          "fc": 0,
          "meat": 1200000,
          "wood": 1200000,
          "coal": 250000,
          "iron": 64000,
          "steel": 21000
        },
        "timeSeconds": 123840,
        "stats": {
          "Troop Deployment Capacity": 200.0
        },
        "power": 60000,
        "svsPoints": 0
      },
      {
        "level": 5,
        "costs": {
          "fc": 0,
          "meat": 2000000,
          "wood": 2000000,
          "coal": 400000,
          "iron": 100000,
          "steel": 33000
        },
        "timeSeconds": 194400,
        "stats": {
          "Troop Deployment Capacity": 200.0
        },
        "power": 60000,
        "svsPoints": 0
      }
    ]
  },
  {
    "id": "lancer-flame_squad",
    "slotId": "flame_squad",
    "name": "Flame Squad",
    "branch": "lancer",
    "maxLevel": 5,
    "icon": "../research-icons/Flame_Squad.png",
    "position": {
      "x": 0,
      "y": 5
    },
    "parents": [
      "lancer-root"
    ],
    "type": "utility",
    "variant": null,
    "levels": [
      {
        "level": 1,
        "costs": {
          "fc": 0,
          "meat": 300000,
          "wood": 300000,
          "coal": 60000,
          "iron": 15000,
          "steel": 5000
        },
        "timeSeconds": 28800,
        "stats": {
          "Troop Deployment Capacity": 200.0
        },
        "power": 60000,
        "svsPoints": 0
      },
      {
        "level": 2,
        "costs": {
          "fc": 0,
          "meat": 480000,
          "wood": 480000,
          "coal": 96000,
          "iron": 24000,
          "steel": 8000
        },
        "timeSeconds": 46080,
        "stats": {
          "Troop Deployment Capacity": 200.0
        },
        "power": 60000,
        "svsPoints": 0
      },
      {
        "level": 3,
        "costs": {
          "fc": 0,
          "meat": 780000,
          "wood": 780000,
          "coal": 150000,
          "iron": 39000,
          "steel": 13000
        },
        "timeSeconds": 74880,
        "stats": {
          "Troop Deployment Capacity": 200.0
        },
        "power": 60000,
        "svsPoints": 0
      },
      {
        "level": 4,
        "costs": {
          "fc": 0,
          "meat": 1200000,
          "wood": 1200000,
          "coal": 250000,
          "iron": 64000,
          "steel": 21000
        },
        "timeSeconds": 123840,
        "stats": {
          "Troop Deployment Capacity": 200.0
        },
        "power": 60000,
        "svsPoints": 0
      },
      {
        "level": 5,
        "costs": {
          "fc": 0,
          "meat": 2000000,
          "wood": 2000000,
          "coal": 400000,
          "iron": 100000,
          "steel": 33000
        },
        "timeSeconds": 194400,
        "stats": {
          "Troop Deployment Capacity": 200.0
        },
        "power": 60000,
        "svsPoints": 0
      }
    ]
  },
  {
    "id": "marksman-root",
    "slotId": "root",
    "name": "Fire Crystal Wagon",
    "branch": "marksman",
    "maxLevel": 5,
    "icon": "../research-icons/Flame_Squad.png",
    "position": {
      "x": 0,
      "y": 6
    },
    "parents": [],
    "type": "root",
    "variant": null,
    "levels": [
      {
        "level": 1,
        "costs": {
          "fc": 0,
          "meat": 300000,
          "wood": 300000,
          "coal": 60000,
          "iron": 15000,
          "steel": 5000
        },
        "timeSeconds": 28800,
        "stats": {
          "Troop Deployment Capacity": 200.0
        },
        "power": 60000,
        "svsPoints": 0
      },
      {
        "level": 2,
        "costs": {
          "fc": 0,
          "meat": 480000,
          "wood": 480000,
          "coal": 96000,
          "iron": 24000,
          "steel": 8000
        },
        "timeSeconds": 46080,
        "stats": {
          "Troop Deployment Capacity": 200.0
        },
        "power": 60000,
        "svsPoints": 0
      },
      {
        "level": 3,
        "costs": {
          "fc": 0,
          "meat": 780000,
          "wood": 780000,
          "coal": 150000,
          "iron": 39000,
          "steel": 13000
        },
        "timeSeconds": 74880,
        "stats": {
          "Troop Deployment Capacity": 200.0
        },
        "power": 60000,
        "svsPoints": 0
      },
      {
        "level": 4,
        "costs": {
          "fc": 0,
          "meat": 1200000,
          "wood": 1200000,
          "coal": 250000,
          "iron": 64000,
          "steel": 21000
        },
        "timeSeconds": 123840,
        "stats": {
          "Troop Deployment Capacity": 200.0
        },
        "power": 60000,
        "svsPoints": 0
      },
      {
        "level": 5,
        "costs": {
          "fc": 0,
          "meat": 2000000,
          "wood": 2000000,
          "coal": 400000,
          "iron": 100000,
          "steel": 33000
        },
        "timeSeconds": 194400,
        "stats": {
          "Troop Deployment Capacity": 200.0
        },
        "power": 60000,
        "svsPoints": 0
      }
    ]
  },
  {
    "id": "infantry-root",
    "slotId": "root",
    "name": "Fire Crystal Wagon",
    "branch": "infantry",
    "maxLevel": 5,
    "icon": "../research-icons/Flame_Squad.png",
    "position": {
      "x": 0,
      "y": 6
    },
    "parents": [],
    "type": "root",
    "variant": null,
    "levels": [
      {
        "level": 1,
        "costs": {
          "fc": 0,
          "meat": 300000,
          "wood": 300000,
          "coal": 60000,
          "iron": 15000,
          "steel": 5000
        },
        "timeSeconds": 28800,
        "stats": {
          "Troop Deployment Capacity": 200.0
        },
        "power": 60000,
        "svsPoints": 0
      },
      {
        "level": 2,
        "costs": {
          "fc": 0,
          "meat": 480000,
          "wood": 480000,
          "coal": 96000,
          "iron": 24000,
          "steel": 8000
        },
        "timeSeconds": 46080,
        "stats": {
          "Troop Deployment Capacity": 200.0
        },
        "power": 60000,
        "svsPoints": 0
      },
      {
        "level": 3,
        "costs": {
          "fc": 0,
          "meat": 780000,
          "wood": 780000,
          "coal": 150000,
          "iron": 39000,
          "steel": 13000
        },
        "timeSeconds": 74880,
        "stats": {
          "Troop Deployment Capacity": 200.0
        },
        "power": 60000,
        "svsPoints": 0
      },
      {
        "level": 4,
        "costs": {
          "fc": 0,
          "meat": 1200000,
          "wood": 1200000,
          "coal": 250000,
          "iron": 64000,
          "steel": 21000
        },
        "timeSeconds": 123840,
        "stats": {
          "Troop Deployment Capacity": 200.0
        },
        "power": 60000,
        "svsPoints": 0
      },
      {
        "level": 5,
        "costs": {
          "fc": 0,
          "meat": 2000000,
          "wood": 2000000,
          "coal": 400000,
          "iron": 100000,
          "steel": 33000
        },
        "timeSeconds": 194400,
        "stats": {
          "Troop Deployment Capacity": 200.0
        },
        "power": 60000,
        "svsPoints": 0
      }
    ]
  },
  {
    "id": "lancer-root",
    "slotId": "root",
    "name": "Fire Crystal Wagon",
    "branch": "lancer",
    "maxLevel": 5,
    "icon": "../research-icons/Flame_Squad.png",
    "position": {
      "x": 0,
      "y": 6
    },
    "parents": [],
    "type": "root",
    "variant": null,
    "levels": [
      {
        "level": 1,
        "costs": {
          "fc": 0,
          "meat": 300000,
          "wood": 300000,
          "coal": 60000,
          "iron": 15000,
          "steel": 5000
        },
        "timeSeconds": 28800,
        "stats": {
          "Troop Deployment Capacity": 200.0
        },
        "power": 60000,
        "svsPoints": 0
      },
      {
        "level": 2,
        "costs": {
          "fc": 0,
          "meat": 480000,
          "wood": 480000,
          "coal": 96000,
          "iron": 24000,
          "steel": 8000
        },
        "timeSeconds": 46080,
        "stats": {
          "Troop Deployment Capacity": 200.0
        },
        "power": 60000,
        "svsPoints": 0
      },
      {
        "level": 3,
        "costs": {
          "fc": 0,
          "meat": 780000,
          "wood": 780000,
          "coal": 150000,
          "iron": 39000,
          "steel": 13000
        },
        "timeSeconds": 74880,
        "stats": {
          "Troop Deployment Capacity": 200.0
        },
        "power": 60000,
        "svsPoints": 0
      },
      {
        "level": 4,
        "costs": {
          "fc": 0,
          "meat": 1200000,
          "wood": 1200000,
          "coal": 250000,
          "iron": 64000,
          "steel": 21000
        },
        "timeSeconds": 123840,
        "stats": {
          "Troop Deployment Capacity": 200.0
        },
        "power": 60000,
        "svsPoints": 0
      },
      {
        "level": 5,
        "costs": {
          "fc": 0,
          "meat": 2000000,
          "wood": 2000000,
          "coal": 400000,
          "iron": 100000,
          "steel": 33000
        },
        "timeSeconds": 194400,
        "stats": {
          "Troop Deployment Capacity": 200.0
        },
        "power": 60000,
        "svsPoints": 0
      }
    ]
  }
];
  const nodeMap = Object.fromEntries(NODES.map(n => [n.id, n]));
  function sumRange(nodeId, startLevel, endLevel){
    const node = nodeMap[nodeId];
    if(!node || startLevel >= endLevel) return null;
    const levels = node.levels.filter(l => typeof l.level === 'number' && l.level > startLevel && l.level <= endLevel);
    const total = {fc:0, meat:0, wood:0, coal:0, iron:0, steel:0, timeSeconds:0, stats:{}, power:0, svsPoints:0};
    levels.forEach(l => {
      total.fc += l.costs.fc;
      total.meat += l.costs.meat;
      total.wood += l.costs.wood;
      total.coal += l.costs.coal;
      total.iron += l.costs.iron;
      total.steel += l.costs.steel;
      total.timeSeconds += l.timeSeconds;
      total.power += l.power;
      total.svsPoints += l.svsPoints;
      Object.entries(l.stats || {}).forEach(([k,v]) => { total.stats[k] = (total.stats[k]||0)+v; });
    });
    return total;
  }
  window.WOSData = window.WOSData || {};
  window.WOSData.helios = { branches: BRANCHES, slotTemplate: SLOT_TEMPLATE, nodes: NODES, nodeMap, sumRange };
})();
