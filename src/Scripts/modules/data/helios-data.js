/* Helios research data (placeholder scaffold until full Excel import is wired). */
(function () {
  'use strict';

  /**
   * @typedef {'marksman' | 'infantry' | 'lancer'} HeliosBranch
   * @typedef {{
   *  id: string;
   *  name: string;
   *  branch: HeliosBranch;
   *  maxLevel: number;
   *  icon: string;
   *  position: { x: number; y: number }; // grid coords for rendering
   *  parents: string[];
   *  type: 'unlock' | 'stat' | 'support' | 'flame-legion';
   *  levels: Array<{
   *    level: number;
   *    costs: { fc: number; meat: number; wood: number; coal: number; iron: number; steel: number };
   *    timeSeconds: number;
   *    stats: Record<string, number>; // e.g., { 'Infantry ATK %': 0.5 }
   *    power: number;
   *    svsPoints: number;
   *  }>;
   * }} HeliosNode
   */

  const branches = ['marksman', 'infantry', 'lancer'];

  // Simple helper to make dummy per-level rows while waiting for Excel import.
  function buildLevels(maxLevel, baseFc = 10, baseRes = 1000, baseTime = 1800, statKey) {
    const levels = [];
    for (let lvl = 1; lvl <= maxLevel; lvl++) {
      levels.push({
        level: lvl,
        costs: {
          fc: baseFc * lvl,
          meat: baseRes * lvl,
          wood: baseRes * lvl,
          coal: baseRes * lvl,
          iron: baseRes * lvl,
          steel: baseRes * lvl
        },
        timeSeconds: baseTime * lvl,
        stats: statKey ? { [statKey]: 0.5 * lvl } : {},
        power: 100 * lvl,
        svsPoints: 50 * lvl
      });
    }
    return levels;
  }

  /** @type {HeliosNode[]} */
  const nodes = [
    // Marksman branch
    {
      id: 'helios-marksman',
      name: 'Helios Marksman',
      branch: 'marksman',
      maxLevel: 1,
      icon: 'research-icons/Helios_Marksman.png',
      position: { x: 2, y: 1 },
      parents: [],
      type: 'unlock',
      variant: 'unlock',
      levels: buildLevels(1, 40, 5000, 7200, 'Marksman ATK %')
    },
    {
      id: 'helios-marksman-training',
      name: 'Helios Marksman Training',
      branch: 'marksman',
      maxLevel: 10,
      icon: 'research-icons/Helios_Marksman_Training.png',
      position: { x: 2, y: 0 },
      parents: ['helios-marksman'],
      type: 'support',
      levels: buildLevels(10, 5, 800, 1200, 'Training Capacity')
    },
    {
      id: 'helios-marksman-healing',
      name: 'Helios Marksman Healing',
      branch: 'marksman',
      maxLevel: 10,
      icon: 'research-icons/Helios_Marksman_Healing.png',
      position: { x: 1, y: 0 },
      parents: ['helios-marksman'],
      type: 'support',
      levels: buildLevels(10, 5, 800, 1200, 'Healing Speed %')
    },
    {
      id: 'helios-marksman-first-aid',
      name: 'Helios Marksman First Aid',
      branch: 'marksman',
      maxLevel: 10,
      icon: 'research-icons/Helios_Marksman_First_Aid.png',
      position: { x: 3, y: 0 },
      parents: ['helios-marksman'],
      type: 'support',
      levels: buildLevels(10, 5, 800, 1200, 'First Aid Capacity')
    },
    {
      id: 'flame-legion-marksman',
      name: 'Flame Legion (Marksman)',
      branch: 'marksman',
      maxLevel: 12,
      icon: 'research-icons/Flame_Legion.png',
      position: { x: 2, y: 2 },
      parents: ['helios-marksman'],
      type: 'flame-legion',
      variant: 'flame',
      levels: buildLevels(12, 8, 1200, 1500, 'Marksman ATK %')
    },
    {
      id: 'marksman-armor',
      name: 'Marksman Armor',
      branch: 'marksman',
      maxLevel: 6,
      icon: 'research-icons/Marksman_Armor_I.png',
      position: { x: 1, y: 2 },
      parents: ['flame-legion-marksman'],
      type: 'stat',
      levels: buildLevels(6, 6, 1000, 1300, 'Marksman HP %')
    },
    {
      id: 'marksman-upgrade',
      name: 'Marksman Upgrade',
      branch: 'marksman',
      maxLevel: 6,
      icon: 'research-icons/Regimental_Expansion_I.png',
      position: { x: 3, y: 2 },
      parents: ['flame-legion-marksman'],
      type: 'stat',
      levels: buildLevels(6, 6, 1000, 1300, 'Marksman ATK %')
    },

    // Infantry branch
    {
      id: 'helios-infantry',
      name: 'Helios Infantry',
      branch: 'infantry',
      maxLevel: 1,
      icon: 'research-icons/Helios_Infantry.png',
      position: { x: 8, y: 2 },
      parents: [],
      type: 'unlock',
      variant: 'unlock',
      levels: buildLevels(1, 40, 5000, 7200, 'Infantry HP %')
    },
    {
      id: 'infantry-training',
      name: 'Helios Infantry Training',
      branch: 'infantry',
      maxLevel: 10,
      icon: 'research-icons/Helios_Infantry_Training.png',
      position: { x: 9, y: 1 },
      parents: ['helios-infantry'],
      type: 'support',
      levels: buildLevels(10, 5, 800, 1200, 'Training Capacity')
    },
    {
      id: 'infantry-healing',
      name: 'Helios Infantry Healing',
      branch: 'infantry',
      maxLevel: 10,
      icon: 'research-icons/Helios_Infantry_Healing.png',
      position: { x: 7, y: 1 },
      parents: ['helios-infantry'],
      type: 'support',
      levels: buildLevels(10, 5, 800, 1200, 'Healing Speed %')
    },
    {
      id: 'infantry-first-aid',
      name: 'Helios Infantry First Aid',
      branch: 'infantry',
      maxLevel: 10,
      icon: 'research-icons/Helios_Infantry_First_Aid.png',
      position: { x: 8, y: 1 },
      parents: ['helios-infantry'],
      type: 'support',
      levels: buildLevels(10, 5, 800, 1200, 'First Aid Capacity')
    },
    {
      id: 'flame-legion-infantry',
      name: 'Flame Legion (Infantry)',
      branch: 'infantry',
      maxLevel: 12,
      icon: 'research-icons/Flame_Legion.png',
      position: { x: 8, y: 3 },
      parents: ['helios-infantry'],
      type: 'flame-legion',
      variant: 'flame',
      levels: buildLevels(12, 8, 1200, 1500, 'Infantry HP %')
    },
    {
      id: 'defensive-formation',
      name: 'Defensive Formation',
      branch: 'infantry',
      maxLevel: 6,
      icon: 'research-icons/Defensive_Formation_I.png',
      position: { x: 7, y: 3 },
      parents: ['flame-legion-infantry'],
      type: 'stat',
      levels: buildLevels(6, 6, 1000, 1300, 'Infantry DEF %')
    },
    {
      id: 'bulwark-formations',
      name: 'Bulwark Formations',
      branch: 'infantry',
      maxLevel: 6,
      icon: 'research-icons/Bulwark_Formations_I.png',
      position: { x: 9, y: 3 },
      parents: ['flame-legion-infantry'],
      type: 'stat',
      levels: buildLevels(6, 6, 1000, 1300, 'Infantry HP %')
    },

    // Lancer branch
    {
      id: 'helios-lancer',
      name: 'Helios Lancer',
      branch: 'lancer',
      maxLevel: 1,
      icon: 'research-icons/Helios_Lancer.png',
      position: { x: 5, y: 6 },
      parents: [],
      type: 'unlock',
      variant: 'unlock',
      levels: buildLevels(1, 40, 5000, 7200, 'Lancer ATK %')
    },
    {
      id: 'lancer-training',
      name: 'Helios Lancer Training',
      branch: 'lancer',
      maxLevel: 10,
      icon: 'research-icons/Helios_Lancer_Training.png',
      position: { x: 5, y: 7 },
      parents: ['helios-lancer'],
      type: 'support',
      levels: buildLevels(10, 5, 800, 1200, 'Training Capacity')
    },
    {
      id: 'lancer-healing',
      name: 'Helios Lancer Healing',
      branch: 'lancer',
      maxLevel: 10,
      icon: 'research-icons/Helios_Lancer_Healing.png',
      position: { x: 4, y: 7 },
      parents: ['helios-lancer'],
      type: 'support',
      levels: buildLevels(10, 5, 800, 1200, 'Healing Speed %')
    },
    {
      id: 'lancer-first-aid',
      name: 'Helios Lancer First Aid',
      branch: 'lancer',
      maxLevel: 10,
      icon: 'research-icons/Helios_Lancer_First_Aid.png',
      position: { x: 6, y: 7 },
      parents: ['helios-lancer'],
      type: 'support',
      levels: buildLevels(10, 5, 800, 1200, 'First Aid Capacity')
    },
    {
      id: 'flame-legion-lancer',
      name: 'Flame Legion (Lancer)',
      branch: 'lancer',
      maxLevel: 12,
      icon: 'research-icons/Flame_Legion.png',
      position: { x: 5, y: 5 },
      parents: ['helios-lancer'],
      type: 'flame-legion',
      variant: 'flame',
      levels: buildLevels(12, 8, 1200, 1500, 'Lancer ATK %')
    },
    {
      id: 'close-combat',
      name: 'Close Combat',
      branch: 'lancer',
      maxLevel: 6,
      icon: 'research-icons/Close_Combat_I.png',
      position: { x: 4, y: 5 },
      parents: ['flame-legion-lancer'],
      type: 'stat',
      levels: buildLevels(6, 6, 1000, 1300, 'Lancer ATK %')
    },
    {
      id: 'precision-targeting',
      name: 'Precision Targeting',
      branch: 'lancer',
      maxLevel: 6,
      icon: 'research-icons/Precision_Targeting_I.png',
      position: { x: 6, y: 5 },
      parents: ['flame-legion-lancer'],
      type: 'stat',
      levels: buildLevels(6, 6, 1000, 1300, 'Lancer HP %')
    }
  ];

  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

  function sumRange(nodeId, startLevel, endLevel) {
    const node = nodeMap[nodeId];
    if (!node) return null;
    const levels = node.levels.filter((lvl) => lvl.level > startLevel && lvl.level <= endLevel);
    const total = {
      fc: 0,
      meat: 0,
      wood: 0,
      coal: 0,
      iron: 0,
      steel: 0,
      timeSeconds: 0,
      stats: {},
      power: 0,
      svsPoints: 0
    };
    for (const lvl of levels) {
      total.fc += lvl.costs.fc;
      total.meat += lvl.costs.meat;
      total.wood += lvl.costs.wood;
      total.coal += lvl.costs.coal;
      total.iron += lvl.costs.iron;
      total.steel += lvl.costs.steel;
      total.timeSeconds += lvl.timeSeconds;
      total.power += lvl.power;
      total.svsPoints += lvl.svsPoints;
      for (const [stat, val] of Object.entries(lvl.stats || {})) {
        total.stats[stat] = (total.stats[stat] || 0) + val;
      }
    }
    return total;
  }

  window.WOSData = window.WOSData || {};
  window.WOSData.helios = {
    branches,
    nodes,
    nodeMap,
    sumRange
  };
})();
