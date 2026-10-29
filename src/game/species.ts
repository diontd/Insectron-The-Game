export type InsectorFamily =
  | 'Emperor'
  | 'Blade Beetle'
  | 'Roller Shield'
  | 'Staggy Beetle'
  | 'Artillery Beetle'
  | 'Faerie'
  | 'Mantis'
  | 'Bee'
  | 'Lady Beetle'
  | 'Cutterpillar'
  | 'Itsa-Insector'
  | 'Dung Roller';

export type SpecialMoveType =
  | 'emperor_rage'
  | 'crushing_horn'
  | 'fortress_quake'
  | 'scissor_throw'
  | 'cannon_blast'
  | 'charm_beam'
  | 'sickle_dance'
  | 'poison_needle'
  | 'healing_jig'
  | 'body_blow'
  | 'sky_dive'
  | 'rolling_thunder';

export interface MoveVector {
  dx: number;
  dy: number; // Note: defined from Player's perspective where -1 dy is FORWARD (toward row 0)
  slide?: boolean; // If true, requires clear path along intermediate steps
  jump?: boolean;  // If true, leaps over intervening bugs
}

export interface SpecialMoveSpec {
  id: SpecialMoveType;
  name: string;
  description: string;
  maxUses: number; // 3 for standard bugs, -1 for Dark Emperor (unlimited)
  range: number;
  powerMultiplier: number;
  knockbackTiles: number;
  inflictsStatus?: 'poison' | 'confusion' | 'charm' | 'shield' | 'heal';
  targetType: 'enemy' | 'ally_aoe' | 'empty_tile' | 'self_aoe';
}

export interface InsectorSpecies {
  id: string;
  name: string;        // Famous Rogue Galaxy name / nickname (e.g. "BIG ASS BUG", "AGAMEL")
  speciesName: string; // Formal family species name
  family: InsectorFamily;
  rank: 'S' | 'A' | 'B' | 'C';
  role: string;
  lore: string;
  maxHp: number;
  attack: number;
  defense: number;
  knockbackChance: number;   // 0..100
  knockbackDistance: number; // 1 or 2 tiles
  poisonChance: number;      // 0..100
  confusionChance: number;   // 0..100
  counterChance: number;     // 0..100
  knockbackImmune?: boolean;
  moveVectors: MoveVector[];
  specialMove: SpecialMoveSpec;
  visual: {
    bodyShape:
      | 'rhino_beetle'
      | 'emperor_beetle'
      | 'tortoise_shell'
      | 'stag_beetle'
      | 'cannon_beetle'
      | 'lance_faerie'
      | 'winged_mantis'
      | 'royal_hornet'
      | 'lady_beetle'
      | 'spiked_crawler'
      | 'pegasus_beetle'
      | 'boulder_roller';
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    eyeColor: string;
    scale: number;
  };
}

export const INSECTOR_SPECIES: InsectorSpecies[] = [
  {
    id: 'big_ass_bug',
    name: 'BIG ASS BUG',
    speciesName: 'Hercules Blade Beetle',
    family: 'Blade Beetle',
    rank: 'A',
    role: 'Heavy Ring-Out Striker',
    lore: 'Jaster’s signature cobalt-black horned Goliath beetle. Its upward horn thrust launches opponents backward across the board.',
    maxHp: 511,
    attack: 175,
    defense: 65,
    knockbackChance: 75,
    knockbackDistance: 1,
    poisonChance: 0,
    confusionChance: 10,
    counterChance: 25,
    moveVectors: [
      { dx: 0, dy: -1, slide: true },
      { dx: 0, dy: -2, slide: true },
      { dx: 0, dy: 1, slide: true },
      { dx: -1, dy: 0, slide: true },
      { dx: 1, dy: 0, slide: true },
      { dx: -1, dy: -1 },
      { dx: 1, dy: -1 },
      { dx: -1, dy: 1 },
      { dx: 1, dy: 1 },
    ],
    specialMove: {
      id: 'crushing_horn',
      name: 'Crushing Horn',
      description: 'Devastating 1.8x horn uppercut that hurls an adjacent enemy 2 tiles backward—prime for instant Ring-Outs.',
      maxUses: 3,
      range: 1,
      powerMultiplier: 1.8,
      knockbackTiles: 2,
      targetType: 'enemy',
    },
    visual: {
      bodyShape: 'rhino_beetle',
      primaryColor: '#3A3548',
      secondaryColor: '#9B8AE6',
      accentColor: '#D8B4FF',
      eyeColor: '#FFFFFF',
      scale: 1.15,
    },
  },
  {
    id: 'agamel',
    name: 'AGAMEL',
    speciesName: 'Crimson Tortoise Roller',
    family: 'Roller Shield',
    rank: 'A',
    role: 'Unmovable Colossal Tank',
    lore: 'Jin Red’s infamous 900-HP ironclad fortress insect. Anchored spikes make it completely immune to enemy Knockback.',
    maxHp: 900,
    attack: 145,
    defense: 95,
    knockbackChance: 40,
    knockbackDistance: 1,
    poisonChance: 0,
    confusionChance: 15,
    counterChance: 40,
    knockbackImmune: true,
    moveVectors: [
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 },
      { dx: -1, dy: -1 },
      { dx: 1, dy: -1 },
      { dx: -1, dy: 1 },
      { dx: 1, dy: 1 },
    ],
    specialMove: {
      id: 'fortress_quake',
      name: 'Fortress Quake',
      description: 'Slams the arena to damage all adjacent enemies, push them 1 tile away, and erect an Armored Shield (+45% DEF).',
      maxUses: 3,
      range: 1,
      powerMultiplier: 1.35,
      knockbackTiles: 1,
      inflictsStatus: 'shield',
      targetType: 'self_aoe',
    },
    visual: {
      bodyShape: 'tortoise_shell',
      primaryColor: '#26738D',
      secondaryColor: '#1B5266',
      accentColor: '#3CE8FF',
      eyeColor: '#FFFFFF',
      scale: 1.08,
    },
  },
  {
    id: 'dark_emperor',
    name: 'DARK EMPEROR',
    speciesName: 'Sovereign Gulza Beetle',
    family: 'Emperor',
    rank: 'S',
    role: 'Legendary Sovereign',
    lore: 'Captured with Royal Fruit in Mariglenn’s Gulza Sanctuary. Possesses guaranteed Flipper Knockback and unlimited Emperor’s Rage.',
    maxHp: 780,
    attack: 210,
    defense: 85,
    knockbackChance: 100,
    knockbackDistance: 1,
    poisonChance: 15,
    confusionChance: 25,
    counterChance: 35,
    knockbackImmune: true,
    moveVectors: [
      { dx: 0, dy: -1, slide: true },
      { dx: 0, dy: -2, slide: true },
      { dx: 0, dy: 1, slide: true },
      { dx: 0, dy: 2, slide: true },
      { dx: -1, dy: 0, slide: true },
      { dx: -2, dy: 0, slide: true },
      { dx: 1, dy: 0, slide: true },
      { dx: 2, dy: 0, slide: true },
      { dx: -1, dy: -1, slide: true },
      { dx: 1, dy: -1, slide: true },
      { dx: -1, dy: 1, slide: true },
      { dx: 1, dy: 1, slide: true },
    ],
    specialMove: {
      id: 'emperor_rage',
      name: "Emperor's Rage",
      description: 'Unleashes a 3-tile crimson plasma beam that pierces defenses and blasts the target backward.',
      maxUses: 3,
      range: 3,
      powerMultiplier: 1.65,
      knockbackTiles: 1,
      targetType: 'enemy',
    },
    visual: {
      bodyShape: 'emperor_beetle',
      primaryColor: '#2B2D38',
      secondaryColor: '#52586E',
      accentColor: '#FFB838',
      eyeColor: '#FFFFFF',
      scale: 1.2,
    },
  },
  {
    id: 'noble_faerie',
    name: 'NOBLE FAERIE',
    speciesName: 'Valkyrie Drill Sylph',
    family: 'Faerie',
    rank: 'A',
    role: 'Mind-Control Lancer',
    lore: 'Armed with a spiral knight lance and gossamer wings. Can sacrifice half its HP to Charm an enemy Insector onto your squad.',
    maxHp: 420,
    attack: 140,
    defense: 45,
    knockbackChance: 25,
    knockbackDistance: 1,
    poisonChance: 0,
    confusionChance: 35,
    counterChance: 20,
    moveVectors: [
      { dx: 0, dy: -1, jump: true },
      { dx: 0, dy: -2, jump: true },
      { dx: -1, dy: -1, jump: true },
      { dx: 1, dy: -1, jump: true },
      { dx: -1, dy: 0, jump: true },
      { dx: 1, dy: 0, jump: true },
      { dx: 0, dy: 1, jump: true },
    ],
    specialMove: {
      id: 'charm_beam',
      name: 'Charm Beam',
      description: 'Costs 50% current HP. Converts a non-King enemy within 2 tiles to join your team (or deals heavy Confusion damage to Kings)!',
      maxUses: 3,
      range: 2,
      powerMultiplier: 1.4,
      knockbackTiles: 0,
      inflictsStatus: 'charm',
      targetType: 'enemy',
    },
    visual: {
      bodyShape: 'lance_faerie',
      primaryColor: '#8C2CE6',
      secondaryColor: '#D8B4FF',
      accentColor: '#F5E6FF',
      eyeColor: '#FFFFFF',
      scale: 1.04,
    },
  },
  {
    id: 'tornado_mantis',
    name: 'TORNADO MANTIS',
    speciesName: 'Zephyr Scythe Mantis',
    family: 'Mantis',
    rank: 'A',
    role: 'Whirlwind Confusion Striker',
    lore: 'Agile winged predator with twin emerald sickles. Its dazzling blade dance scrambles enemy equilibrium with Confusion (∞).',
    maxHp: 460,
    attack: 168,
    defense: 50,
    knockbackChance: 20,
    knockbackDistance: 1,
    poisonChance: 0,
    confusionChance: 45,
    counterChance: 35,
    moveVectors: [
      { dx: 0, dy: -1, slide: true },
      { dx: 0, dy: -2, slide: true },
      { dx: -1, dy: -1, slide: true },
      { dx: 1, dy: -1, slide: true },
      { dx: -1, dy: 0, slide: true },
      { dx: 1, dy: 0, slide: true },
      { dx: 0, dy: 1, slide: true },
    ],
    specialMove: {
      id: 'sickle_dance',
      name: 'Sickle Dance',
      description: 'Slices a target within 2 tiles with twin gale blades, dealing 1.5x Cut damage and guaranteeing Confusion (∞).',
      maxUses: 3,
      range: 2,
      powerMultiplier: 1.5,
      knockbackTiles: 0,
      inflictsStatus: 'confusion',
      targetType: 'enemy',
    },
    visual: {
      bodyShape: 'winged_mantis',
      primaryColor: '#4E9A42',
      secondaryColor: '#A6E3C5',
      accentColor: '#FFE066',
      eyeColor: '#FFFFFF',
      scale: 1.05,
    },
  },
  {
    id: 'mick_stagger',
    name: 'MICK STAGGER',
    speciesName: 'Grand Scissor Stag',
    family: 'Staggy Beetle',
    rank: 'A',
    role: 'Diagonal Grappler & Suplexer',
    lore: 'Bishop-striding stag beetle with hydraulic mandibles that clamp onto enemies and hurl them overhead.',
    maxHp: 540,
    attack: 172,
    defense: 62,
    knockbackChance: 50,
    knockbackDistance: 1,
    poisonChance: 0,
    confusionChance: 15,
    counterChance: 30,
    moveVectors: [
      { dx: -1, dy: -1, slide: true },
      { dx: -2, dy: -2, slide: true },
      { dx: 1, dy: -1, slide: true },
      { dx: 2, dy: -2, slide: true },
      { dx: -1, dy: 1, slide: true },
      { dx: 1, dy: 1, slide: true },
      { dx: 0, dy: -1 },
    ],
    specialMove: {
      id: 'scissor_throw',
      name: 'Scissor Throw',
      description: 'Clamps an adjacent enemy and suplexes them directly behind Mick Stagger—lethal near your own board edge!',
      maxUses: 3,
      range: 1,
      powerMultiplier: 1.6,
      knockbackTiles: 1,
      targetType: 'enemy',
    },
    visual: {
      bodyShape: 'stag_beetle',
      primaryColor: '#E08232',
      secondaryColor: '#6E472B',
      accentColor: '#22252A',
      eyeColor: '#FFFFFF',
      scale: 1.1,
    },
  },
  {
    id: 'driller_pillar',
    name: 'DRILLERPILLAR',
    speciesName: 'Abyssal Fang Crawler',
    family: 'Cutterpillar',
    rank: 'B',
    role: 'Subterranean Disruptor',
    lore: 'Spiked obsidian crawler with twin ivory fangs. Tunnels beneath other bugs and erupts with disorienting Body Blows.',
    maxHp: 490,
    attack: 150,
    defense: 70,
    knockbackChance: 30,
    knockbackDistance: 1,
    poisonChance: 35,
    confusionChance: 35,
    counterChance: 25,
    moveVectors: [
      { dx: 0, dy: -1, jump: true },
      { dx: 0, dy: -2, jump: true },
      { dx: -1, dy: 0, jump: true },
      { dx: 1, dy: 0, jump: true },
      { dx: -1, dy: -1, jump: true },
      { dx: 1, dy: -1, jump: true },
      { dx: 0, dy: 1, jump: true },
    ],
    specialMove: {
      id: 'body_blow',
      name: 'Body Blow',
      description: 'Burrows underground to strike an enemy up to 2 tiles away, inflicting heavy trauma + Confusion (∞).',
      maxUses: 3,
      range: 2,
      powerMultiplier: 1.45,
      knockbackTiles: 0,
      inflictsStatus: 'confusion',
      targetType: 'enemy',
    },
    visual: {
      bodyShape: 'spiked_crawler',
      primaryColor: '#F27D5E',
      secondaryColor: '#D95B3D',
      accentColor: '#FFE5D9',
      eyeColor: '#FFFFFF',
      scale: 1.04,
    },
  },
  {
    id: 'bazoo_beetle',
    name: 'BAZOO BEETLE',
    speciesName: 'Howitzer Horn Beetle',
    family: 'Artillery Beetle',
    rank: 'A',
    role: 'Long-Range Siege Artillery',
    lore: 'Heavy carapace beetle fitted with an organic dorsal mortar that shells targets across the entire 6-row arena.',
    maxHp: 560,
    attack: 162,
    defense: 75,
    knockbackChance: 60,
    knockbackDistance: 1,
    poisonChance: 0,
    confusionChance: 20,
    counterChance: 15,
    moveVectors: [
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 },
      { dx: -1, dy: -1 },
      { dx: 1, dy: -1 },
    ],
    specialMove: {
      id: 'cannon_blast',
      name: 'Cannon Blast',
      description: 'Fires a high-explosive shell up to 4 tiles away, blasting the target for 1.55x damage and 1-tile Knockback.',
      maxUses: 3,
      range: 4,
      powerMultiplier: 1.55,
      knockbackTiles: 1,
      targetType: 'enemy',
    },
    visual: {
      bodyShape: 'cannon_beetle',
      primaryColor: '#525B6C',
      secondaryColor: '#363D4A',
      accentColor: '#3CE8FF',
      eyeColor: '#FFFFFF',
      scale: 1.1,
    },
  },
  {
    id: 'bee_bee_king',
    name: 'BEE BEE KING',
    speciesName: 'Sovereign Venom Hornet',
    family: 'Bee',
    rank: 'A',
    role: 'Aerial Toxic Assassin',
    lore: 'Jet-fast royal hornet that flies over congested board lines to inject armor-melting neurotoxins into enemy Kings.',
    maxHp: 410,
    attack: 158,
    defense: 42,
    knockbackChance: 15,
    knockbackDistance: 1,
    poisonChance: 60,
    confusionChance: 10,
    counterChance: 25,
    moveVectors: [
      { dx: 0, dy: -1, jump: true },
      { dx: 0, dy: -2, jump: true },
      { dx: -1, dy: -1, jump: true },
      { dx: 1, dy: -1, jump: true },
      { dx: -2, dy: 0, jump: true },
      { dx: 2, dy: 0, jump: true },
      { dx: -1, dy: 0, jump: true },
      { dx: 1, dy: 0, jump: true },
      { dx: 0, dy: 1, jump: true },
    ],
    specialMove: {
      id: 'poison_needle',
      name: 'Poison Needle',
      description: 'Fires a venomous stinger up to 3 tiles away, dealing 1.4x piercing damage and guaranteeing virulent Poison.',
      maxUses: 3,
      range: 3,
      powerMultiplier: 1.4,
      knockbackTiles: 0,
      inflictsStatus: 'poison',
      targetType: 'enemy',
    },
    visual: {
      bodyShape: 'royal_hornet',
      primaryColor: '#B8252A',
      secondaryColor: '#282930',
      accentColor: '#FFFFFF',
      eyeColor: '#FFFFFF',
      scale: 1.02,
    },
  },
  {
    id: 'lovely_lady',
    name: 'LOVELY LADY',
    speciesName: 'Starlight Lady Beetle',
    family: 'Lady Beetle',
    rank: 'B',
    role: 'Squad Cleric & Cleanser',
    lore: 'Beloved scarlet-spotted beetle whose rhythmic Healing Jig mends cracked carapaces and purges Poison and Confusion.',
    maxHp: 480,
    attack: 125,
    defense: 68,
    knockbackChance: 20,
    knockbackDistance: 1,
    poisonChance: 0,
    confusionChance: 30,
    counterChance: 30,
    moveVectors: [
      { dx: -1, dy: -1, slide: true },
      { dx: 1, dy: -1, slide: true },
      { dx: -1, dy: 1, slide: true },
      { dx: 1, dy: 1, slide: true },
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 },
    ],
    specialMove: {
      id: 'healing_jig',
      name: 'Healing Jig',
      description: 'Performs a radiant dance that restores 40% Max HP to this unit and all allies within 2 tiles while curing all ailments!',
      maxUses: 3,
      range: 2,
      powerMultiplier: 0.4,
      knockbackTiles: 0,
      inflictsStatus: 'heal',
      targetType: 'ally_aoe',
    },
    visual: {
      bodyShape: 'lady_beetle',
      primaryColor: '#F4F4EE',
      secondaryColor: '#2D3038',
      accentColor: '#F05A46',
      eyeColor: '#FFFFFF',
      scale: 1.0,
    },
  },
  {
    id: 'itsapegasus',
    name: 'ITSAPEGASUS',
    speciesName: 'Cerulean Winged Courser',
    family: 'Itsa-Insector',
    rank: 'A',
    role: 'Knight-Leaping Flanker',
    lore: 'Mythic Juraika insect that bounds in chess Knight L-jumps over frontlines to ambush unguarded enemy Kings.',
    maxHp: 500,
    attack: 165,
    defense: 58,
    knockbackChance: 55,
    knockbackDistance: 1,
    poisonChance: 0,
    confusionChance: 15,
    counterChance: 25,
    moveVectors: [
      { dx: -1, dy: -2, jump: true },
      { dx: 1, dy: -2, jump: true },
      { dx: -2, dy: -1, jump: true },
      { dx: 2, dy: -1, jump: true },
      { dx: -2, dy: 1, jump: true },
      { dx: 2, dy: 1, jump: true },
      { dx: -1, dy: 2, jump: true },
      { dx: 1, dy: 2, jump: true },
      { dx: 0, dy: -1 },
    ],
    specialMove: {
      id: 'sky_dive',
      name: 'Sky Dive',
      description: 'Soars into the air and slams an enemy up to 3 tiles away for 1.5x damage, knocking them 1 tile backward.',
      maxUses: 3,
      range: 3,
      powerMultiplier: 1.5,
      knockbackTiles: 1,
      targetType: 'enemy',
    },
    visual: {
      bodyShape: 'pegasus_beetle',
      primaryColor: '#258EA6',
      secondaryColor: '#5CE6FF',
      accentColor: '#FFB838',
      eyeColor: '#FFFFFF',
      scale: 1.08,
    },
  },
  {
    id: 'rock_n_roller',
    name: "ROCK 'N' ROLLER",
    speciesName: 'Magma Dung Juggernaut',
    family: 'Dung Roller',
    rank: 'B',
    role: 'Rook-Line Bulldozer',
    lore: 'Desert scarab from Rosa that charges up to 3 tiles in straight Rook lines, bowling opposing bugs off the platform.',
    maxHp: 620,
    attack: 160,
    defense: 82,
    knockbackChance: 70,
    knockbackDistance: 1,
    poisonChance: 0,
    confusionChance: 10,
    counterChance: 25,
    knockbackImmune: true,
    moveVectors: [
      { dx: 0, dy: -1, slide: true },
      { dx: 0, dy: -2, slide: true },
      { dx: 0, dy: -3, slide: true },
      { dx: 0, dy: 1, slide: true },
      { dx: 0, dy: 2, slide: true },
      { dx: -1, dy: 0, slide: true },
      { dx: -2, dy: 0, slide: true },
      { dx: 1, dy: 0, slide: true },
      { dx: 2, dy: 0, slide: true },
    ],
    specialMove: {
      id: 'rolling_thunder',
      name: 'Rolling Thunder',
      description: 'Hurls a molten boulder up to 3 tiles in a line, dealing 1.55x damage and shoving the target 2 tiles backward!',
      maxUses: 3,
      range: 3,
      powerMultiplier: 1.55,
      knockbackTiles: 2,
      targetType: 'enemy',
    },
    visual: {
      bodyShape: 'boulder_roller',
      primaryColor: '#2E313D',
      secondaryColor: '#565B6E',
      accentColor: '#A6E3C5',
      eyeColor: '#FFFFFF',
      scale: 1.1,
    },
  },
];

export const SPECIES_MAP: Record<string, InsectorSpecies> = Object.fromEntries(
  INSECTOR_SPECIES.map((s) => [s.id, s])
);

export interface PresetUnitPlacement {
  slotIndex: number; // 0..4 (for the 5 top HUD orb sockets)
  speciesId: string;
  customName?: string;
  col: number;
  row: number;
  isKing: boolean;
  hp?: number;
  maxHp?: number;
  specialUses?: number;
  status?: {
    confusion?: number;
    poison?: number;
    shield?: number;
    equippedBadge?: boolean;
  };
  defeated?: boolean;
}

export interface TournamentPreset {
  id: string;
  title: string;
  rankLabel: string;
  playerName: string;
  enemyName: string;
  description: string;
  selectedPlayerSlot?: number;
  targetedEnemySlot?: number;
  playerUnits: PresetUnitPlacement[];
  enemyUnits: PresetUnitPlacement[];
}

export const TOURNAMENT_PRESETS: TournamentPreset[] = [
  {
    id: 'jaster_vs_jin_red',
    title: 'Jaster vs. Jin Red (Classic Arena Match)',
    rankLabel: 'RANK A · ZERARD ARENA SHOWDOWN',
    playerName: 'Jaster',
    enemyName: 'Jin Red',
    description: 'The iconic Rogue Galaxy showdown from the reference screenshot: Big Ass Bug (511/511) faces off against Jin Red’s 900-HP Agamel in mid-board tactical combat.',
    selectedPlayerSlot: 4, // BIG ASS BUG at (2, 3)
    targetedEnemySlot: 3,  // AGAMEL at (3, 2)
    playerUnits: [
      {
        slotIndex: 0,
        speciesId: 'rock_n_roller',
        customName: 'KING ROLLER',
        col: 0,
        row: 5,
        isKing: true,
        hp: 620,
        maxHp: 620,
        specialUses: 3,
      },
      {
        slotIndex: 1,
        speciesId: 'itsapegasus',
        customName: 'PEGASUS',
        col: 0,
        row: 4,
        isKing: false,
        hp: 0,
        maxHp: 500,
        specialUses: 2,
        defeated: true, // Matches the 2nd dark socket on Jaster's bar in the reference screenshot!
      },
      {
        slotIndex: 2,
        speciesId: 'mick_stagger',
        customName: 'STAGGY',
        col: 1,
        row: 5,
        isKing: false,
        hp: 540,
        maxHp: 540,
        specialUses: 3,
      },
      {
        slotIndex: 3,
        speciesId: 'tornado_mantis',
        customName: 'TORNADO MANTIS',
        col: 2,
        row: 2,
        isKing: false,
        hp: 410,
        maxHp: 460,
        specialUses: 3,
        status: { confusion: 2 },
      },
      {
        slotIndex: 4,
        speciesId: 'big_ass_bug',
        customName: 'BIG ASS BUG',
        col: 2,
        row: 3,
        isKing: false,
        hp: 511,
        maxHp: 511,
        specialUses: 3,
      },
    ],
    enemyUnits: [
      {
        slotIndex: 0,
        speciesId: 'dark_emperor',
        customName: 'CRIMSON KING',
        col: 0,
        row: 0,
        isKing: true,
        hp: 680,
        maxHp: 780,
        specialUses: 3,
        status: { confusion: 2 },
      },
      {
        slotIndex: 1,
        speciesId: 'driller_pillar',
        customName: 'DRILLERPILLAR',
        col: 1,
        row: 2,
        isKing: false,
        hp: 450,
        maxHp: 490,
        specialUses: 2,
      },
      {
        slotIndex: 2,
        speciesId: 'bee_bee_king',
        customName: 'MOTH WING',
        col: 2,
        row: 1,
        isKing: false,
        hp: 410,
        maxHp: 410,
        specialUses: 3,
      },
      {
        slotIndex: 3,
        speciesId: 'agamel',
        customName: 'AGAMEL',
        col: 3,
        row: 2,
        isKing: false,
        hp: 900,
        maxHp: 900,
        specialUses: 2,
      },
      {
        slotIndex: 4,
        speciesId: 'noble_faerie',
        customName: 'LANCE ELF',
        col: 3,
        row: 1,
        isKing: false,
        hp: 390,
        maxHp: 420,
        specialUses: 3,
        status: { equippedBadge: true },
      },
    ],
  },
  {
    id: 'zerard_cup',
    title: 'Rank B: Zerard Silver Cup',
    rankLabel: 'RANK B · FULL 5v5 OPENING FORMATION',
    playerName: 'Jaster',
    enemyName: 'Capt. Dario',
    description: 'Standard symmetrical 5v5 opening formation. Test your frontline beetles, artillery, and aerial flankers from Turn 1.',
    selectedPlayerSlot: 2,
    targetedEnemySlot: 2,
    playerUnits: [
      { slotIndex: 0, speciesId: 'rock_n_roller', col: 2, row: 5, isKing: true },
      { slotIndex: 1, speciesId: 'lovely_lady', col: 1, row: 5, isKing: false },
      { slotIndex: 2, speciesId: 'big_ass_bug', col: 2, row: 4, isKing: false },
      { slotIndex: 3, speciesId: 'mick_stagger', col: 1, row: 4, isKing: false },
      { slotIndex: 4, speciesId: 'noble_faerie', col: 3, row: 4, isKing: false },
    ],
    enemyUnits: [
      { slotIndex: 0, speciesId: 'agamel', col: 2, row: 0, isKing: true },
      { slotIndex: 1, speciesId: 'bazoo_beetle', col: 3, row: 0, isKing: false },
      { slotIndex: 2, speciesId: 'driller_pillar', col: 2, row: 1, isKing: false },
      { slotIndex: 3, speciesId: 'tornado_mantis', col: 1, row: 1, isKing: false },
      { slotIndex: 4, speciesId: 'bee_bee_king', col: 3, row: 1, isKing: false },
    ],
  },
  {
    id: 'emperors_sanctuary',
    title: 'Rank S: Royal Platinum Championship',
    rankLabel: 'RANK S · GRAND MASTER FINALS',
    playerName: 'Jaster',
    enemyName: 'Emperor Vagnard',
    description: 'High-stakes championship match featuring the legendary Dark Emperor and elite S-Rank Insectors.',
    selectedPlayerSlot: 0,
    targetedEnemySlot: 0,
    playerUnits: [
      { slotIndex: 0, speciesId: 'dark_emperor', col: 2, row: 5, isKing: true },
      { slotIndex: 1, speciesId: 'big_ass_bug', col: 1, row: 4, isKing: false },
      { slotIndex: 2, speciesId: 'itsapegasus', col: 3, row: 4, isKing: false },
      { slotIndex: 3, speciesId: 'bazoo_beetle', col: 0, row: 5, isKing: false },
      { slotIndex: 4, speciesId: 'lovely_lady', col: 4, row: 5, isKing: false },
    ],
    enemyUnits: [
      { slotIndex: 0, speciesId: 'dark_emperor', customName: 'KAISER BUG', col: 2, row: 0, isKing: true },
      { slotIndex: 1, speciesId: 'agamel', col: 2, row: 1, isKing: false },
      { slotIndex: 2, speciesId: 'mick_stagger', col: 1, row: 1, isKing: false },
      { slotIndex: 3, speciesId: 'noble_faerie', col: 3, row: 1, isKing: false },
      { slotIndex: 4, speciesId: 'bee_bee_king', col: 4, row: 0, isKing: false },
    ],
  },
];
