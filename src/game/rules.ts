import {
  INSECTOR_SPECIES,
  SPECIES_MAP,
  InsectorSpecies,
  PresetUnitPlacement,
  SpecialMoveType,
  TournamentPreset,
  TOURNAMENT_PRESETS,
} from './species';

export const BOARD_COLS = 5;
export const BOARD_ROWS = 6;

export type TeamSide = 'player' | 'enemy';

export interface UnitStatus {
  confusion: number; // turns remaining (0 = none)
  poison: number;    // turns remaining (0 = none)
  shield: number;    // turns remaining (0 = none)
  charm?: number;    // [B-03] rounds of borrowed allegiance remaining (0 = none)
  equippedBadge?: boolean; // shows 'E' icon like in screenshot
}

// ====================================================================
// [B-01..B-05] BATTLE FAIRNESS & FEEL TUNING CONSTANTS
// ====================================================================
/** Chance (0..1) that a strike lands as a CRITICAL hit. */
export const CRIT_CHANCE = 0.1;
/** Damage multiplier applied on CRITICAL hits. */
export const CRIT_MULTIPLIER = 1.5;
/** ±spread applied to every damage roll so hits feel organic, not robotic. */
export const DAMAGE_VARIANCE = 0.08;
/** Chance (0..1) that a Confused insect fumbles its strike (half damage, no knockback, no ailment). */
export const CONFUSION_FUMBLE_CHANCE = 0.4;
/** [B-01] Edge Grip: non-King insects can only be Rung-Out at or below this HP ratio. */
export const EDGE_GRIP_HP_RATIO = 0.5;
/** [B-01] Royal Edge Grip: Kings can only be Rung-Out at or below this HP ratio. */
export const ROYAL_EDGE_GRIP_HP_RATIO = 0.3;
/** [B-03] Charm Beam only converts non-King targets at or below this HP ratio. */
export const CHARM_HP_RATIO = 0.5;
/** [B-03] Internal charm counter (ticks at the start of the controller's turn → 2 usable turns). */
export const CHARM_DURATION = 3;

export function getRingOutHpRatio(unit: Pick<BoardUnit, 'isKing'>): number {
  return unit.isKing ? ROYAL_EDGE_GRIP_HP_RATIO : EDGE_GRIP_HP_RATIO;
}

/** [B-01] A unit can be knocked Out of Bounds only once it has been worn down (Edge Grip broken). */
export function canBeRungOut(
  unit: Pick<BoardUnit, 'hp' | 'maxHp' | 'isKing'>
): boolean {
  return unit.hp <= unit.maxHp * getRingOutHpRatio(unit);
}

/** [B-03] Charm Beam can only steal weakened, non-King insects. */
export function canBeCharmed(
  unit: Pick<BoardUnit, 'hp' | 'maxHp' | 'isKing'>
): boolean {
  return !unit.isKing && unit.hp <= unit.maxHp * CHARM_HP_RATIO;
}

export interface BoardUnit {
  id: string;
  slotIndex: number; // 0..4
  team: TeamSide;
  speciesId: string;
  name: string;
  col: number;
  row: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  isKing: boolean;
  specialUses: number; // -1 for unlimited (Dark Emperor), 0..3 otherwise
  maxSpecialUses: number;
  status: UnitStatus;
  defeated: boolean;
  defeatedReason?: 'hp' | 'ring_out';
  /** [B-03] Original allegiance while Charmed (restored when the charm wears off). */
  originalTeam?: TeamSide;
}

export interface CombatEvent {
  type:
    | 'move'
    | 'attack'
    | 'special'
    | 'counter'
    | 'knockback'
    | 'ring_out'
    | 'status'
    | 'heal'
    | 'charm';
  sourceUnitId?: string;
  targetUnitId?: string;
  fromCol?: number;
  fromRow?: number;
  toCol?: number;
  toRow?: number;
  damage?: number;
  heal?: number;
  text: string;
  statusApplied?: 'poison' | 'confusion' | 'shield' | 'charm';
  signatureId?: SpecialMoveType;
  signatureName?: string;
  /** [B-02] Feel metadata so the arena can scale hitstop, shake, SFX & numbers. */
  crit?: boolean;
  fumble?: boolean;
  lethal?: boolean;
  wallSlam?: boolean;
}

export interface MatchState {
  presetId: string;
  playerName: string;
  enemyName: string;
  turn: TeamSide;
  turnNumber: number;
  units: BoardUnit[];
  selectedUnitId: string | null;
  targetedUnitId: string | null;
  hasMovedThisTurn: boolean;
  movedUnitId: string | null;
  moveOriginCol?: number | null;
  moveOriginRow?: number | null;
  lastActedPlayerUnitId?: string | null;
  actedPlayerUnitIds?: string[];
  winner: TeamSide | null;
  winReason: string | null;
  combatLog: string[];
  stats: {
    playerKOs: number;
    playerRingOuts: number;
    damageDealt: number;
    specialsUsed: number;
  };
}

export const TIER_POINT_COST: Record<'S' | 'A' | 'B' | 'C', number> = {
  S: 3,
  A: 2,
  B: 1,
  C: 1,
};

export const MAX_SQUAD_POINTS = 12;

export function getSquadTotalPoints(
  squad: Array<{ speciesId: string }>
): number {
  return squad.reduce((sum, item) => {
    const sp = getSpecies(item.speciesId);
    return sum + (TIER_POINT_COST[sp.rank] ?? 2);
  }, 0);
}

export function formatUnitTag(
  unit: Pick<BoardUnit, 'name' | 'team'>
): string {
  return `${unit.team === 'player' ? '[ALLY]' : '[RIVAL]'} ${unit.name}`;
}

export function isInsideBoard(col: number, row: number): boolean {
  return col >= 0 && col < BOARD_COLS && row >= 0 && row < BOARD_ROWS;
}

export function getUnitAt(
  units: BoardUnit[],
  col: number,
  row: number
): BoardUnit | undefined {
  return units.find((u) => !u.defeated && u.col === col && u.row === row);
}

export function getSpecies(speciesId: string): InsectorSpecies {
  return SPECIES_MAP[speciesId] || INSECTOR_SPECIES[0];
}

export const DEFAULT_PLAYER_OPENING_SQUAD: PresetUnitPlacement[] = [
  { slotIndex: 0, speciesId: 'rock_n_roller', col: 1, row: 5, isKing: true },
  { slotIndex: 1, speciesId: 'agamel', col: 3, row: 4, isKing: false },
  { slotIndex: 2, speciesId: 'noble_faerie', col: 2, row: 4, isKing: false },
  { slotIndex: 3, speciesId: 'big_ass_bug', col: 1, row: 4, isKing: false },
  { slotIndex: 4, speciesId: 'tornado_mantis', col: 0, row: 4, isKing: false },
];

export const OPPONENT_TIER_CONFIG: Record<
  'B' | 'A' | 'S',
  {
    rank: 'B' | 'A' | 'S';
    title: string;
    enemyName: string;
    description: string;
    enemyUnits: PresetUnitPlacement[];
  }
> = {
  B: {
    rank: 'B',
    title: 'Rank B · Zerard Silver Cup',
    enemyName: 'Capt. Dario',
    description: 'Balanced 5v5 opening formation with frontline crawlers and aerial hornets.',
    enemyUnits: [
      { slotIndex: 0, speciesId: 'rock_n_roller', customName: 'DARIO ROLLER', col: 2, row: 0, isKing: true },
      { slotIndex: 1, speciesId: 'bazoo_beetle', col: 3, row: 0, isKing: false },
      { slotIndex: 2, speciesId: 'driller_pillar', col: 2, row: 1, isKing: false },
      { slotIndex: 3, speciesId: 'tornado_mantis', col: 1, row: 1, isKing: false },
      { slotIndex: 4, speciesId: 'bee_bee_king', col: 3, row: 1, isKing: false },
    ],
  },
  A: {
    rank: 'A',
    title: 'Rank A · Gold Arena Championship',
    enemyName: 'Jin Red',
    description: 'Jin Red’s elite Zerard squad anchored by his 900-HP Agamel and Crimson King.',
    enemyUnits: [
      { slotIndex: 0, speciesId: 'dark_emperor', customName: 'CRIMSON KING', col: 2, row: 0, isKing: true },
      { slotIndex: 1, speciesId: 'agamel', customName: 'AGAMEL', col: 3, row: 1, isKing: false },
      { slotIndex: 2, speciesId: 'bee_bee_king', col: 1, row: 1, isKing: false },
      { slotIndex: 3, speciesId: 'noble_faerie', col: 2, row: 1, isKing: false, status: { equippedBadge: true } },
      { slotIndex: 4, speciesId: 'driller_pillar', col: 1, row: 0, isKing: false },
    ],
  },
  S: {
    rank: 'S',
    title: 'Rank S · Royal Platinum Finals',
    enemyName: 'Emperor Vagnard',
    description: 'Supreme Sovereign finals featuring Kaiser Bug (Dark Emperor) and heavy knockback strikers.',
    enemyUnits: [
      { slotIndex: 0, speciesId: 'dark_emperor', customName: 'KAISER BUG', col: 2, row: 0, isKing: true },
      { slotIndex: 1, speciesId: 'agamel', col: 2, row: 1, isKing: false },
      { slotIndex: 2, speciesId: 'big_ass_bug', customName: 'GOLIATH HORN', col: 1, row: 1, isKing: false },
      { slotIndex: 3, speciesId: 'mick_stagger', col: 3, row: 1, isKing: false },
      { slotIndex: 4, speciesId: 'itsapegasus', col: 3, row: 0, isKing: false, status: { equippedBadge: true } },
    ],
  },
};

export function createMatchFromSquad(
  playerSquad: PresetUnitPlacement[] = DEFAULT_PLAYER_OPENING_SQUAD,
  opponentRank: 'B' | 'A' | 'S' = 'A',
  playerName = 'Jaster'
): MatchState {
  const tier = OPPONENT_TIER_CONFIG[opponentRank] || OPPONENT_TIER_CONFIG.A;
  // Normalize player squad to ensure exactly 1 King and valid distinct tiles on rows 4 & 5
  const usedCoords = new Set<string>();
  const fallbackCoords = [
    { col: 2, row: 5 },
    { col: 2, row: 4 },
    { col: 1, row: 4 },
    { col: 3, row: 4 },
    { col: 1, row: 5 },
    { col: 3, row: 5 },
    { col: 0, row: 4 },
    { col: 4, row: 4 },
    { col: 0, row: 5 },
    { col: 4, row: 5 },
  ];

  const hasKing = playerSquad.some((u) => u.isKing);
  const normalizedPlayer: PresetUnitPlacement[] = playerSquad
    .slice(0, 5)
    .map((u, idx) => {
      let col = Math.max(0, Math.min(BOARD_COLS - 1, u.col));
      let row = u.row >= 4 && u.row <= 5 ? u.row : idx === 0 ? 5 : 4;
      if (usedCoords.has(`${col},${row}`)) {
        const free = fallbackCoords.find((c) => !usedCoords.has(`${c.col},${c.row}`)) || {
          col: idx,
          row: 5,
        };
        col = free.col;
        row = free.row;
      }
      usedCoords.add(`${col},${row}`);
      return {
        ...u,
        slotIndex: idx,
        col,
        row,
        isKing: hasKing ? u.isKing : idx === 0,
        defeated: false,
      };
    });

  // [F-01] Select a non-King Frontline unit by default on Turn 1 so players don't solo-rush their King!
  const frontlineSlot =
    normalizedPlayer.find((u) => !u.isKing && u.row === 4)?.slotIndex ??
    normalizedPlayer.find((u) => !u.isKing)?.slotIndex ??
    normalizedPlayer.find((u) => u.row === 4)?.slotIndex ??
    0;
  const enemyFrontSlot =
    tier.enemyUnits.find((u) => u.row === 1)?.slotIndex ?? 0;

  return createMatchFromPreset({
    id: `custom_rank_${opponentRank.toLowerCase()}`,
    title: tier.title,
    rankLabel: tier.title,
    playerName,
    enemyName: tier.enemyName,
    description: tier.description,
    selectedPlayerSlot: frontlineSlot,
    targetedEnemySlot: enemyFrontSlot,
    playerUnits: normalizedPlayer,
    enemyUnits: tier.enemyUnits,
  });
}

export function createMatchFromPreset(
  preset: TournamentPreset = TOURNAMENT_PRESETS[0]
): MatchState {
  const units: BoardUnit[] = [];

  for (const p of preset.playerUnits) {
    const spec = getSpecies(p.speciesId);
    units.push({
      id: `player_${p.slotIndex}`,
      slotIndex: p.slotIndex,
      team: 'player',
      speciesId: spec.id,
      name: p.customName || spec.name,
      col: p.col,
      row: p.row,
      hp: p.hp !== undefined ? p.hp : spec.maxHp,
      maxHp: p.maxHp !== undefined ? p.maxHp : spec.maxHp,
      attack: spec.attack,
      defense: spec.defense,
      isKing: p.isKing,
      specialUses:
        p.specialUses !== undefined && p.specialUses >= 0
          ? Math.min(3, p.specialUses)
          : 3,
      maxSpecialUses: 3,
      status: {
        confusion: p.status?.confusion || 0,
        poison: p.status?.poison || 0,
        shield: p.status?.shield || 0,
        charm: 0,
        equippedBadge: p.status?.equippedBadge || false,
      },
      defeated: Boolean(p.defeated),
      defeatedReason: p.defeated ? 'hp' : undefined,
    });
  }

  for (const e of preset.enemyUnits) {
    const spec = getSpecies(e.speciesId);
    units.push({
      id: `enemy_${e.slotIndex}`,
      slotIndex: e.slotIndex,
      team: 'enemy',
      speciesId: spec.id,
      name: e.customName || spec.name,
      col: e.col,
      row: e.row,
      hp: e.hp !== undefined ? e.hp : spec.maxHp,
      maxHp: e.maxHp !== undefined ? e.maxHp : spec.maxHp,
      attack: spec.attack,
      defense: spec.defense,
      isKing: e.isKing,
      specialUses:
        e.specialUses !== undefined && e.specialUses >= 0
          ? Math.min(3, e.specialUses)
          : 3,
      maxSpecialUses: 3,
      status: {
        confusion: e.status?.confusion || 0,
        poison: e.status?.poison || 0,
        shield: e.status?.shield || 0,
        charm: 0,
        equippedBadge: e.status?.equippedBadge || false,
      },
      defeated: Boolean(e.defeated),
      defeatedReason: e.defeated ? 'hp' : undefined,
    });
  }

  const selectedId =
    preset.selectedPlayerSlot !== undefined
      ? `player_${preset.selectedPlayerSlot}`
      : units.find((u) => u.team === 'player' && !u.defeated)?.id || null;

  const targetedId =
    preset.targetedEnemySlot !== undefined
      ? `enemy_${preset.targetedEnemySlot}`
      : units.find((u) => u.team === 'enemy' && !u.defeated)?.id || null;

  return {
    presetId: preset.id,
    playerName: preset.playerName,
    enemyName: preset.enemyName,
    turn: 'player',
    turnNumber: 1,
    units,
    selectedUnitId: selectedId,
    targetedUnitId: targetedId,
    hasMovedThisTurn: false,
    movedUnitId: null,
    moveOriginCol: null,
    moveOriginRow: null,
    lastActedPlayerUnitId: null,
    actedPlayerUnitIds: [],
    winner: null,
    winReason: null,
    combatLog: [],
    stats: {
      playerKOs: 0,
      playerRingOuts: 0,
      damageDealt: 0,
      specialsUsed: 0,
    },
  };
}

/**
 * Computes valid board coordinates that `unit` can move to.
 * Note: MoveVector.dy is defined from Player's perspective (-1 = forward toward row 0).
 * For Enemy team, forward is +1 toward row 5, so dy is inverted.
 */
export function getValidMoves(
  units: BoardUnit[],
  unit: BoardUnit
): Array<{ col: number; row: number }> {
  if (unit.defeated) return [];
  const spec = getSpecies(unit.speciesId);
  const dirMultiplier = unit.team === 'player' ? 1 : -1;
  const result: Array<{ col: number; row: number }> = [];
  const seen = new Set<string>();

  for (const vec of spec.moveVectors) {
    const actualDx = vec.dx;
    const actualDy = vec.dy * dirMultiplier;
    const targetCol = unit.col + actualDx;
    const targetRow = unit.row + actualDy;

    if (!isInsideBoard(targetCol, targetRow)) continue;
    if (getUnitAt(units, targetCol, targetRow)) continue;

    // If sliding > 1 tile and not jumping, check intermediate tiles
    const steps = Math.max(Math.abs(actualDx), Math.abs(actualDy));
    if (steps > 1 && vec.slide && !vec.jump) {
      const stepX = Math.sign(actualDx);
      const stepY = Math.sign(actualDy);
      let blocked = false;
      for (let s = 1; s < steps; s++) {
        const midCol = unit.col + stepX * s;
        const midRow = unit.row + stepY * s;
        if (getUnitAt(units, midCol, midRow)) {
          blocked = true;
          break;
        }
      }
      if (blocked) continue;
    }

    const key = `${targetCol},${targetRow}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push({ col: targetCol, row: targetRow });
    }
  }

  return result;
}

/**
 * Computes enemy units that `unit` can attack with a basic physical attack from `(fromCol, fromRow)`.
 * Standard attacks can hit any adjacent enemy (orthogonal or diagonal, Chebyshev distance 1).
 */
export function getValidAttackTargets(
  units: BoardUnit[],
  unit: BoardUnit,
  fromCol: number = unit.col,
  fromRow: number = unit.row
): BoardUnit[] {
  if (unit.defeated) return [];
  return units.filter((other) => {
    if (other.defeated || other.team === unit.team) return false;
    const dist = Math.max(
      Math.abs(other.col - fromCol),
      Math.abs(other.row - fromRow)
    );
    return dist === 1;
  });
}

/**
 * Computes valid target units for `unit`'s Special Move from `(fromCol, fromRow)`.
 */
export function getValidSpecialTargets(
  units: BoardUnit[],
  unit: BoardUnit,
  fromCol: number = unit.col,
  fromRow: number = unit.row
): BoardUnit[] {
  if (unit.defeated) return [];
  if (unit.specialUses === 0) return [];
  const spec = getSpecies(unit.speciesId);
  const move = spec.specialMove;

  if (move.targetType === 'self_aoe') {
    // Fortress Quake triggers on self if at least 1 enemy is within range, or anytime for shield
    return [unit];
  }

  if (move.targetType === 'ally_aoe') {
    // Healing Jig triggers on self and heals nearby allies
    return [unit];
  }

  // Enemy-targeted specials
  return units.filter((other) => {
    if (other.defeated || other.team === unit.team) return false;
    const dx = Math.abs(other.col - fromCol);
    const dy = Math.abs(other.row - fromRow);
    const chebyshev = Math.max(dx, dy);

    // Line-based specials (Emperor's Rage, Cannon Blast, Rolling Thunder) require straight or diagonal alignment
    if (
      move.id === 'emperor_rage' ||
      move.id === 'cannon_blast' ||
      move.id === 'rolling_thunder'
    ) {
      const aligned = dx === 0 || dy === 0 || dx === dy;
      return aligned && chebyshev >= 1 && chebyshev <= move.range;
    }

    return chebyshev >= 1 && chebyshev <= move.range;
  });
}

/**
 * [F-04] Returns the exact enemy units that will be hit/affected if `unit` triggers its Signature Move now.
 * For `self_aoe` (Fortress Quake), returns adjacent living enemies so the UI can warn "0 in range (Shield Only)".
 */
export function getEnemiesAffectedBySpecial(
  units: BoardUnit[],
  unit: BoardUnit,
  fromCol: number = unit.col,
  fromRow: number = unit.row
): BoardUnit[] {
  if (unit.defeated || unit.specialUses === 0) return [];
  const spec = getSpecies(unit.speciesId);
  const move = spec.specialMove;

  if (move.targetType === 'self_aoe') {
    return units.filter(
      (other) =>
        !other.defeated &&
        other.team !== unit.team &&
        Math.max(Math.abs(other.col - fromCol), Math.abs(other.row - fromRow)) <=
          move.range
    );
  }

  if (move.targetType === 'ally_aoe') {
    return units.filter(
      (other) =>
        !other.defeated &&
        other.team === unit.team &&
        Math.max(Math.abs(other.col - fromCol), Math.abs(other.row - fromRow)) <=
          move.range
    );
  }

  return getValidSpecialTargets(units, unit, fromCol, fromRow);
}

/**
 * [F-04] Computes all board tiles inside `unit`'s Basic Attack range (adjacent 8 tiles) for Hover Preview.
 */
export function getAttackPreviewTiles(
  unit: BoardUnit | null
): Array<{ col: number; row: number }> {
  if (!unit || unit.defeated) return [];
  const tiles: Array<{ col: number; row: number }> = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const c = unit.col + dc;
      const r = unit.row + dr;
      if (isInsideBoard(c, r)) {
        tiles.push({ col: c, row: r });
      }
    }
  }
  return tiles;
}

/**
 * [F-04] Computes all board tiles inside `unit`'s Signature Move AoE/Range for Hover Preview on the 3D board.
 */
export function getSpecialPreviewTiles(
  unit: BoardUnit | null
): Array<{ col: number; row: number }> {
  if (!unit || unit.defeated) return [];
  const spec = getSpecies(unit.speciesId);
  const move = spec.specialMove;
  const tiles: Array<{ col: number; row: number }> = [];

  for (let r = 0; r < BOARD_ROWS; r++) {
    for (let c = 0; c < BOARD_COLS; c++) {
      const dx = Math.abs(c - unit.col);
      const dy = Math.abs(r - unit.row);
      const chebyshev = Math.max(dx, dy);
      if (chebyshev === 0) {
        if (move.targetType === 'self_aoe' || move.targetType === 'ally_aoe') {
          tiles.push({ col: c, row: r });
        }
        continue;
      }
      if (chebyshev > move.range) continue;

      if (
        move.id === 'emperor_rage' ||
        move.id === 'cannon_blast' ||
        move.id === 'rolling_thunder'
      ) {
        if (dx === 0 || dy === 0 || dx === dy) {
          tiles.push({ col: c, row: r });
        }
      } else {
        tiles.push({ col: c, row: r });
      }
    }
  }
  return tiles;
}

/**
 * [F-01] Detects if a team's King is in immediate danger (<50% HP, surrounded by >=2 enemies, or over-extended solo).
 */
export function getKingDangerStatus(
  units: BoardUnit[],
  team: TeamSide = 'player'
): { inDanger: boolean; reason: string | null } {
  const king = units.find((u) => u.team === team && u.isKing && !u.defeated);
  if (!king) return { inDanger: false, reason: null };

  const hpPct = king.hp / king.maxHp;
  const nearbyEnemies = units.filter(
    (u) =>
      !u.defeated &&
      u.team !== team &&
      Math.max(Math.abs(u.col - king.col), Math.abs(u.row - king.row)) <= 1
  );
  const alliesBehind = units.filter(
    (u) => !u.defeated && u.team === team && !u.isKing && u.row >= 4
  );

  if (hpPct < 0.5) {
    return {
      inDanger: true,
      reason: `KING HP CRITICAL (${king.hp}/${king.maxHp})! Protect ${king.name} or support with squad mates.`,
    };
  }
  if (nearbyEnemies.length >= 2) {
    return {
      inDanger: true,
      reason: `KING SURROUNDED (${nearbyEnemies.length} enemies adjacent)! Move allies to assist ${king.name}.`,
    };
  }
  if (team === 'player' && king.row <= 3 && alliesBehind.length >= 3) {
    return {
      inDanger: true,
      reason: `KING EXPOSED SOLO! Advance your other 4 squad units to shield ${king.name}.`,
    };
  }
  return { inDanger: false, reason: null };
}

/**
 * [F-01] Contextual Tactical Tip for the DEFEAT screen based on match telemetry.
 */
export function getDefeatTacticalTip(state: MatchState): string {
  const distinctActed = state.actedPlayerUnitIds?.length ?? 0;
  const playerKing = state.units.find((u) => u.team === 'player' && u.isKing);
  const untouchedAllies = state.units.filter(
    (u) => u.team === 'player' && !u.isKing && !u.defeated && u.hp === u.maxHp
  );

  if (distinctActed <= 2 || untouchedAllies.length >= 3) {
    return 'Tactical Tip: Do not rush your 👑 King alone! Activate your other 4 frontline squad members to screen enemies and control the 5×6 Bio-Dome.';
  }
  if (playerKing?.defeatedReason === 'ring_out') {
    return 'Tactical Tip: Keep your 👑 King away from the outer rim tiles (Cols A/E, Rows 1/6) so heavy knockback beetles cannot Ring-Out your King!';
  }
  return 'Tactical Tip: Combine knockback strikes to push enemies Out of Bounds for instant Ring-Outs, and save Signature Charges for targets in range!';
}

export function checkMatchOutcome(
  units: BoardUnit[]
): { winner: TeamSide | null; reason: string | null } {
  const playerKing = units.find((u) => u.team === 'player' && u.isKing);
  const enemyKing = units.find((u) => u.team === 'enemy' && u.isKing);

  if (enemyKing && enemyKing.defeated) {
    return {
      winner: 'player',
      reason:
        enemyKing.defeatedReason === 'ring_out'
          ? `Enemy King (${enemyKing.name}) was knocked Out of Bounds!`
          : `Enemy King (${enemyKing.name}) was defeated!`,
    };
  }

  if (playerKing && playerKing.defeated) {
    return {
      winner: 'enemy',
      reason:
        playerKing.defeatedReason === 'ring_out'
          ? `Your King (${playerKing.name}) was knocked Out of Bounds!`
          : `Your King (${playerKing.name}) was defeated!`,
    };
  }

  const aliveEnemy = units.filter((u) => u.team === 'enemy' && !u.defeated);
  if (aliveEnemy.length === 0) {
    return { winner: 'player', reason: 'All enemy Insectors eliminated!' };
  }

  const alivePlayer = units.filter((u) => u.team === 'player' && !u.defeated);
  if (alivePlayer.length === 0) {
    return { winner: 'enemy', reason: 'All your Insectors were eliminated!' };
  }

  return { winner: null, reason: null };
}

export function moveUnit(
  state: MatchState,
  unitId: string,
  toCol: number,
  toRow: number
): { nextState: MatchState; events: CombatEvent[] } {
  const nextUnits = state.units.map((u) => ({
    ...u,
    status: { ...u.status },
  }));
  const unit = nextUnits.find((u) => u.id === unitId);
  if (!unit || unit.defeated || unit.team !== state.turn) {
    return { nextState: state, events: [] };
  }

  const valid = getValidMoves(nextUnits, unit);
  if (!valid.some((m) => m.col === toCol && m.row === toRow)) {
    return { nextState: state, events: [] };
  }

  const fromCol = unit.col;
  const fromRow = unit.row;
  unit.col = toCol;
  unit.row = toRow;

  const event: CombatEvent = {
    type: 'move',
    sourceUnitId: unit.id,
    fromCol,
    fromRow,
    toCol,
    toRow,
    text: `${formatUnitTag(unit)} moved to (${String.fromCharCode(65 + toCol)}${6 - toRow}).`,
  };

  const nextActedList =
    unit.team === 'player'
      ? Array.from(new Set([...(state.actedPlayerUnitIds || []), unit.id]))
      : state.actedPlayerUnitIds || [];

  return {
    nextState: {
      ...state,
      units: nextUnits,
      selectedUnitId: unit.id,
      hasMovedThisTurn: true,
      movedUnitId: unit.id,
      moveOriginCol: fromCol,
      moveOriginRow: fromRow,
      lastActedPlayerUnitId:
        unit.team === 'player' ? unit.id : state.lastActedPlayerUnitId,
      actedPlayerUnitIds: nextActedList,
      combatLog: [event.text, ...state.combatLog].slice(0, 30),
    },
    events: [event],
  };
}

/**
 * [F-05] Undoes the player's current-turn move before an Attack/Signature/End Turn is committed.
 */
export function undoMove(state: MatchState): MatchState {
  if (
    state.turn !== 'player' ||
    !state.hasMovedThisTurn ||
    !state.movedUnitId ||
    state.moveOriginCol === undefined ||
    state.moveOriginCol === null ||
    state.moveOriginRow === undefined ||
    state.moveOriginRow === null
  ) {
    return state;
  }

  const originCol = state.moveOriginCol;
  const originRow = state.moveOriginRow;
  const nextUnits = state.units.map((u) =>
    u.id === state.movedUnitId
      ? { ...u, col: originCol, row: originRow, status: { ...u.status } }
      : { ...u, status: { ...u.status } }
  );
  const movedUnit = nextUnits.find((u) => u.id === state.movedUnitId);
  const undoLog = movedUnit
    ? `${formatUnitTag(movedUnit)} undone move back to (${String.fromCharCode(65 + originCol)}${6 - originRow}).`
    : 'Move undone.';

  return {
    ...state,
    units: nextUnits,
    hasMovedThisTurn: false,
    movedUnitId: null,
    moveOriginCol: null,
    moveOriginRow: null,
    combatLog: [undoLog, ...state.combatLog].slice(0, 30),
  };
}

export interface DamageResult {
  damage: number;
  crit: boolean;
  fumble: boolean;
}

export function calculateDamage(
  attacker: BoardUnit,
  defender: BoardUnit,
  multiplier = 1.0,
  rng: () => number = Math.random
): DamageResult {
  // Confusion fumble check (40% fumble chance while confused)
  const isConfused = attacker.status.confusion > 0;
  const isFumble = isConfused && rng() < CONFUSION_FUMBLE_CHANCE;

  const shieldBonus = defender.status.shield > 0 ? 55 : 0;
  const effectiveDef = defender.defense + shieldBonus;

  // Base damage formula tuned for 8-16 turn strategic pacing
  let raw = attacker.attack * multiplier * (110 / (100 + effectiveDef));

  // Critical hit check (10% chance for 1.5x damage, unless fumbling)
  const isCrit = !isFumble && rng() < CRIT_CHANCE;
  if (isCrit) {
    raw *= CRIT_MULTIPLIER;
  }

  // Fumble penalty: 55% normal damage
  if (isFumble) {
    raw *= 0.55;
  }

  // Organic damage variance (+/- 8%)
  const variance = 1 - DAMAGE_VARIANCE + rng() * (DAMAGE_VARIANCE * 2);
  const finalDamage = Math.max(20, Math.round(raw * variance));

  return {
    damage: finalDamage,
    crit: isCrit,
    fumble: isFumble,
  };
}

function applyPushDisplacement(
  units: BoardUnit[],
  target: BoardUnit,
  pushDirX: number,
  pushDirY: number,
  tiles: number,
  events: CombatEvent[],
  stats: MatchState['stats'],
  actorTeam: TeamSide
): void {
  const spec = getSpecies(target.speciesId);
  if (spec.knockbackImmune || tiles <= 0 || (pushDirX === 0 && pushDirY === 0)) {
    return;
  }

  let curCol = target.col;
  let curRow = target.row;

  for (let step = 0; step < tiles; step++) {
    const nextCol = curCol + pushDirX;
    const nextRow = curRow + pushDirY;

    // Approaching out of bounds: check Edge Grip!
    if (!isInsideBoard(nextCol, nextRow)) {
      if (canBeRungOut(target)) {
        // Edge Grip broken (HP <= 50%, or <= 30% for King) -> Instant RING OUT!
        const prevCol = target.col;
        const prevRow = target.row;
        target.col = nextCol;
        target.row = nextRow;
        target.hp = 0;
        target.defeated = true;
        target.defeatedReason = 'ring_out';
        if (actorTeam === 'player') {
          stats.playerRingOuts += 1;
          stats.playerKOs += 1;
        }
        events.push({
          type: 'ring_out',
          targetUnitId: target.id,
          fromCol: prevCol,
          fromRow: prevRow,
          toCol: nextCol,
          toRow: nextRow,
          lethal: true,
          text: `RING OUT! ${formatUnitTag(target)} was knocked Out of Bounds!`,
        });
        return;
      } else {
        // [B-01] EDGE GRIP ACTIVATED! Carapace clings to the arena stone parapet!
        const wallSlamDmg = Math.max(35, Math.round(target.maxHp * 0.16 + 15));
        target.hp = Math.max(1, target.hp - wallSlamDmg);
        target.col = curCol;
        target.row = curRow;
        events.push({
          type: 'knockback',
          targetUnitId: target.id,
          fromCol: curCol,
          fromRow: curRow,
          toCol: curCol,
          toRow: curRow,
          damage: wallSlamDmg,
          wallSlam: true,
          text: `EDGE GRIP! ${formatUnitTag(target)} clung to the parapet, taking ${wallSlamDmg} Wall Slam DMG!`,
        });
        return;
      }
    }

    // Check collision with another unit
    const obstacle = getUnitAt(units, nextCol, nextRow);
    if (obstacle) {
      const collisionDmg = Math.max(30, Math.round(target.maxHp * 0.12 + 10));
      target.hp = Math.max(1, target.hp - collisionDmg);
      obstacle.hp = Math.max(1, obstacle.hp - collisionDmg);
      events.push({
        type: 'knockback',
        targetUnitId: target.id,
        fromCol: curCol,
        fromRow: curRow,
        toCol: curCol,
        toRow: curRow,
        damage: collisionDmg,
        wallSlam: true,
        text: `${formatUnitTag(target)} slammed into ${formatUnitTag(obstacle)} for ${collisionDmg} collision damage!`,
      });
      return;
    }

    curCol = nextCol;
    curRow = nextRow;
  }

  if (curCol !== target.col || curRow !== target.row) {
    const fromCol = target.col;
    const fromRow = target.row;
    target.col = curCol;
    target.row = curRow;
    events.push({
      type: 'knockback',
      targetUnitId: target.id,
      fromCol,
      fromRow,
      toCol: curCol,
      toRow: curRow,
      text: `${formatUnitTag(target)} was knocked back to (${String.fromCharCode(65 + curCol)}${6 - curRow})!`,
    });
  }
}

export function executeNormalAttack(
  state: MatchState,
  attackerId: string,
  targetId: string,
  rng: () => number = Math.random
): { nextState: MatchState; events: CombatEvent[] } {
  const nextUnits = state.units.map((u) => ({
    ...u,
    status: { ...u.status },
  }));
  const nextStats = { ...state.stats };
  const attacker = nextUnits.find((u) => u.id === attackerId);
  const target = nextUnits.find((u) => u.id === targetId);

  if (
    !attacker ||
    !target ||
    attacker.defeated ||
    target.defeated ||
    attacker.team === target.team
  ) {
    return { nextState: state, events: [] };
  }

  const events: CombatEvent[] = [];
  const attackerSpec = getSpecies(attacker.speciesId);
  const targetSpec = getSpecies(target.speciesId);

  // Calculate damage with confusion fumble, critical chance and variance
  const dmgRes = calculateDamage(attacker, target, 1.0, rng);
  const dmg = dmgRes.damage;
  target.hp = Math.max(0, target.hp - dmg);
  if (attacker.team === 'player') {
    nextStats.damageDealt += dmg;
  }

  let atkText = `${formatUnitTag(attacker)} struck ${formatUnitTag(target)} for ${dmg} DMG!`;
  if (dmgRes.fumble) {
    atkText = `FUMBLE! Confused ${formatUnitTag(attacker)} fumbled strike on ${formatUnitTag(target)} for ${dmg} DMG!`;
  } else if (dmgRes.crit) {
    atkText = `CRITICAL STRIKE! ${formatUnitTag(attacker)} pierced ${formatUnitTag(target)} for ${dmg} DMG!`;
  }

  events.push({
    type: 'attack',
    sourceUnitId: attacker.id,
    targetUnitId: target.id,
    fromCol: attacker.col,
    fromRow: attacker.row,
    toCol: target.col,
    toRow: target.row,
    damage: dmg,
    crit: dmgRes.crit,
    fumble: dmgRes.fumble,
    lethal: target.hp <= 0,
    text: atkText,
  });

  if (target.hp <= 0) {
    target.hp = 0;
    target.defeated = true;
    target.defeatedReason = 'hp';
    if (attacker.team === 'player') nextStats.playerKOs += 1;
    events.push({
      type: 'status',
      targetUnitId: target.id,
      text: `${formatUnitTag(target)} was defeated!`,
    });
  } else if (!dmgRes.fumble) {
    // Check Knockback (fumbles do not knock back)
    const rollKb = rng() * 100;
    if (rollKb < attackerSpec.knockbackChance) {
      const pushDirX = Math.sign(target.col - attacker.col);
      const pushDirY = Math.sign(target.row - attacker.row);
      applyPushDisplacement(
        nextUnits,
        target,
        pushDirX,
        pushDirY,
        attackerSpec.knockbackDistance,
        events,
        nextStats,
        attacker.team
      );
    }

    // Check Status Ailment (Poison / Confusion) if still alive
    if (!target.defeated) {
      if (
        attackerSpec.poisonChance > 0 &&
        rng() * 100 < attackerSpec.poisonChance
      ) {
        target.status.poison = 3;
        events.push({
          type: 'status',
          targetUnitId: target.id,
          statusApplied: 'poison',
          text: `${formatUnitTag(target)} was afflicted with Poison!`,
        });
      } else if (
        attackerSpec.confusionChance > 0 &&
        rng() * 100 < attackerSpec.confusionChance
      ) {
        target.status.confusion = 2;
        events.push({
          type: 'status',
          targetUnitId: target.id,
          statusApplied: 'confusion',
          text: `${formatUnitTag(target)} became Confused (∞)!`,
        });
      }
    }

    // Check Counterattack if target is still alive and adjacent
    const stillAdjacent =
      !target.defeated &&
      Math.max(
        Math.abs(target.col - attacker.col),
        Math.abs(target.row - attacker.row)
      ) === 1;

    if (stillAdjacent && rng() * 100 < targetSpec.counterChance) {
      const counterRes = calculateDamage(target, attacker, 0.55, rng);
      const counterDmg = counterRes.damage;
      attacker.hp = Math.max(0, attacker.hp - counterDmg);
      events.push({
        type: 'counter',
        sourceUnitId: target.id,
        targetUnitId: attacker.id,
        damage: counterDmg,
        crit: counterRes.crit,
        text: `COUNTER! ${formatUnitTag(target)} retaliated against ${formatUnitTag(attacker)} for ${counterDmg} DMG!`,
      });
      if (attacker.hp <= 0) {
        attacker.hp = 0;
        attacker.defeated = true;
        attacker.defeatedReason = 'hp';
      }
    }
  }

  const outcome = checkMatchOutcome(nextUnits);
  const newLogs = [...events.map((e) => e.text).reverse(), ...state.combatLog].slice(
    0,
    30
  );

  const nextActedList =
    attacker.team === 'player'
      ? Array.from(new Set([...(state.actedPlayerUnitIds || []), attacker.id]))
      : state.actedPlayerUnitIds || [];

  const intermediateState: MatchState = {
    ...state,
    units: nextUnits,
    targetedUnitId: target.id,
    lastActedPlayerUnitId:
      attacker.team === 'player' ? attacker.id : state.lastActedPlayerUnitId,
    actedPlayerUnitIds: nextActedList,
    winner: outcome.winner,
    winReason: outcome.reason,
    combatLog: newLogs,
    stats: nextStats,
  };

  if (outcome.winner) {
    return { nextState: intermediateState, events };
  }

  return {
    nextState: advanceTurn(intermediateState),
    events,
  };
}

export function executeSpecialMove(
  state: MatchState,
  attackerId: string,
  targetId: string
): { nextState: MatchState; events: CombatEvent[] } {
  const nextUnits = state.units.map((u) => ({
    ...u,
    status: { ...u.status },
  }));
  const nextStats = { ...state.stats };
  const attacker = nextUnits.find((u) => u.id === attackerId);
  const target = nextUnits.find((u) => u.id === targetId);

  if (!attacker || attacker.defeated || attacker.specialUses === 0) {
    return { nextState: state, events: [] };
  }

  const spec = getSpecies(attacker.speciesId);
  const move = spec.specialMove;
  const events: CombatEvent[] = [];

  // Consume special orb unless unlimited (-1)
  if (attacker.specialUses > 0) {
    attacker.specialUses -= 1;
  }
  if (attacker.team === 'player') {
    nextStats.specialsUsed += 1;
  }

  // 1. Healing Jig (Lovely Lady)
  if (move.id === 'healing_jig') {
    const allies = nextUnits.filter(
      (u) =>
        !u.defeated &&
        u.team === attacker.team &&
        Math.max(Math.abs(u.col - attacker.col), Math.abs(u.row - attacker.row)) <=
          move.range
    );
    for (const ally of allies) {
      const healAmount = Math.round(ally.maxHp * 0.4);
      ally.hp = Math.min(ally.maxHp, ally.hp + healAmount);
      ally.status.poison = 0;
      ally.status.confusion = 0;
      events.push({
        type: 'heal',
        sourceUnitId: attacker.id,
        targetUnitId: ally.id,
        fromCol: attacker.col,
        fromRow: attacker.row,
        toCol: ally.col,
        toRow: ally.row,
        heal: healAmount,
        signatureId: move.id,
        signatureName: move.name,
        text: `${formatUnitTag(attacker)}'s ${move.name} restored ${healAmount} HP to ${formatUnitTag(ally)} & cured ailments!`,
      });
    }
  }
  // 2. Fortress Quake (Agamel)
  else if (move.id === 'fortress_quake') {
    attacker.status.shield = 2;
    events.push({
      type: 'special',
      sourceUnitId: attacker.id,
      targetUnitId: attacker.id,
      fromCol: attacker.col,
      fromRow: attacker.row,
      toCol: attacker.col,
      toRow: attacker.row,
      statusApplied: 'shield',
      signatureId: move.id,
      signatureName: move.name,
      text: `${formatUnitTag(attacker)} unleashed ${move.name} and raised an Iron Shield!`,
    });
    const adjEnemies = nextUnits.filter(
      (u) =>
        !u.defeated &&
        u.team !== attacker.team &&
        Math.max(Math.abs(u.col - attacker.col), Math.abs(u.row - attacker.row)) ===
          1
    );
    for (const enemy of adjEnemies) {
      const dmgRes = calculateDamage(attacker, enemy, move.powerMultiplier, Math.random);
      const dmg = dmgRes.damage;
      enemy.hp = Math.max(0, enemy.hp - dmg);
      if (attacker.team === 'player') nextStats.damageDealt += dmg;
      events.push({
        type: 'special',
        sourceUnitId: attacker.id,
        targetUnitId: enemy.id,
        fromCol: attacker.col,
        fromRow: attacker.row,
        toCol: enemy.col,
        toRow: enemy.row,
        damage: dmg,
        crit: dmgRes.crit,
        signatureId: move.id,
        signatureName: move.name,
        text: `${formatUnitTag(attacker)}'s ${move.name} blasted ${formatUnitTag(enemy)} for ${dmg} DMG!`,
      });
      if (enemy.hp <= 0) {
        enemy.hp = 0;
        enemy.defeated = true;
        enemy.defeatedReason = 'hp';
        if (attacker.team === 'player') nextStats.playerKOs += 1;
      } else {
        const pushX = Math.sign(enemy.col - attacker.col);
        const pushY = Math.sign(enemy.row - attacker.row);
        applyPushDisplacement(
          nextUnits,
          enemy,
          pushX,
          pushY,
          1,
          events,
          nextStats,
          attacker.team
        );
      }
    }
  }
  // 3. Charm Beam (Noble Faerie) — Steals weakened non-King enemy (HP <= 50%) for 2 turns!
  else if (move.id === 'charm_beam' && target) {
    const hpCost = Math.floor(attacker.hp * 0.5);
    attacker.hp = Math.max(1, attacker.hp - hpCost);

    if (!target.isKing && canBeCharmed(target)) {
      const previousTag = formatUnitTag(target);
      target.originalTeam = target.team;
      target.team = attacker.team;
      target.status.charm = CHARM_DURATION;
      target.status.confusion = 0;
      events.push({
        type: 'charm',
        sourceUnitId: attacker.id,
        targetUnitId: target.id,
        fromCol: attacker.col,
        fromRow: attacker.row,
        toCol: target.col,
        toRow: target.row,
        signatureId: move.id,
        signatureName: move.name,
        text: `CHARM BEAM! ${formatUnitTag(attacker)} sacrificed ${hpCost} HP to enthrall ${previousTag} for 2 turns!`,
      });
    } else if (!target.isKing) {
      // Non-King with >50% HP resists total conversion! Takes heavy damage + Confusion
      const dmgRes = calculateDamage(attacker, target, move.powerMultiplier, Math.random);
      const dmg = dmgRes.damage;
      target.hp = Math.max(0, target.hp - dmg);
      target.status.confusion = 3;
      if (attacker.team === 'player') nextStats.damageDealt += dmg;
      events.push({
        type: 'special',
        sourceUnitId: attacker.id,
        targetUnitId: target.id,
        fromCol: attacker.col,
        fromRow: attacker.row,
        toCol: target.col,
        toRow: target.row,
        damage: dmg,
        statusApplied: 'confusion',
        signatureId: move.id,
        signatureName: move.name,
        text: `CHARM RESISTED! ${formatUnitTag(target)} was too steadfast (>50% HP) to be captured; took ${dmg} psychic DMG & Confusion (∞)!`,
      });
      if (target.hp <= 0) {
        target.hp = 0;
        target.defeated = true;
        target.defeatedReason = 'hp';
      }
    } else {
      // Kings cannot be stolen, instead take heavy psychic damage + Confusion
      const dmgRes = calculateDamage(attacker, target, move.powerMultiplier, Math.random);
      const dmg = dmgRes.damage;
      target.hp = Math.max(0, target.hp - dmg);
      target.status.confusion = 3;
      if (attacker.team === 'player') nextStats.damageDealt += dmg;
      events.push({
        type: 'special',
        sourceUnitId: attacker.id,
        targetUnitId: target.id,
        fromCol: attacker.col,
        fromRow: attacker.row,
        toCol: target.col,
        toRow: target.row,
        damage: dmg,
        statusApplied: 'confusion',
        signatureId: move.id,
        signatureName: move.name,
        text: `CHARM BEAM! ${formatUnitTag(target)} (King) resisted capture from ${formatUnitTag(attacker)} but took ${dmg} DMG & Confusion (∞)!`,
      });
      if (target.hp <= 0) {
        target.hp = 0;
        target.defeated = true;
        target.defeatedReason = 'hp';
      }
    }
  }
  // 4. Scissor Throw (Mick Stagger) — Flings adjacent enemy behind the user!
  else if (move.id === 'scissor_throw' && target) {
    const dmgRes = calculateDamage(attacker, target, move.powerMultiplier, Math.random);
    const dmg = dmgRes.damage;
    target.hp = Math.max(0, target.hp - dmg);
    if (attacker.team === 'player') nextStats.damageDealt += dmg;

    const dirX = Math.sign(target.col - attacker.col);
    const dirY = Math.sign(target.row - attacker.row);
    const behindCol = attacker.col - dirX;
    const behindRow = attacker.row - dirY;

    events.push({
      type: 'special',
      sourceUnitId: attacker.id,
      targetUnitId: target.id,
      fromCol: attacker.col,
      fromRow: attacker.row,
      toCol: target.col,
      toRow: target.row,
      damage: dmg,
      crit: dmgRes.crit,
      signatureId: move.id,
      signatureName: move.name,
      text: `SCISSOR THROW! ${formatUnitTag(attacker)} suplexed ${formatUnitTag(target)} overhead for ${dmg} DMG!`,
    });

    if (target.hp <= 0) {
      target.hp = 0;
      target.defeated = true;
      target.defeatedReason = 'hp';
      if (attacker.team === 'player') nextStats.playerKOs += 1;
    } else if (!isInsideBoard(behindCol, behindRow)) {
      if (canBeRungOut(target)) {
        // Thrown right off the board!
        const prevCol = target.col;
        const prevRow = target.row;
        target.col = behindCol;
        target.row = behindRow;
        target.hp = 0;
        target.defeated = true;
        target.defeatedReason = 'ring_out';
        if (attacker.team === 'player') {
          nextStats.playerRingOuts += 1;
          nextStats.playerKOs += 1;
        }
        events.push({
          type: 'ring_out',
          targetUnitId: target.id,
          fromCol: prevCol,
          fromRow: prevRow,
          toCol: behindCol,
          toRow: behindRow,
          signatureId: move.id,
          signatureName: move.name,
          lethal: true,
          text: `RING OUT! ${formatUnitTag(target)} was thrown Out of Bounds by ${formatUnitTag(attacker)}'s Scissor Throw!`,
        });
      } else {
        // Edge Grip active: clung to parapet wall behind attacker!
        const wallDmg = Math.max(35, Math.round(target.maxHp * 0.16 + 15));
        target.hp = Math.max(1, target.hp - wallDmg);
        events.push({
          type: 'knockback',
          targetUnitId: target.id,
          fromCol: target.col,
          fromRow: target.row,
          toCol: target.col,
          toRow: target.row,
          damage: wallDmg,
          wallSlam: true,
          signatureId: move.id,
          signatureName: move.name,
          text: `EDGE GRIP! ${formatUnitTag(target)} gripped the parapet behind ${formatUnitTag(attacker)}, taking ${wallDmg} Wall Slam DMG!`,
        });
      }
    } else if (!getUnitAt(nextUnits, behindCol, behindRow)) {
      const prevCol = target.col;
      const prevRow = target.row;
      target.col = behindCol;
      target.row = behindRow;
      events.push({
        type: 'knockback',
        targetUnitId: target.id,
        fromCol: prevCol,
        fromRow: prevRow,
        toCol: behindCol,
        toRow: behindRow,
        signatureId: move.id,
        signatureName: move.name,
        text: `${formatUnitTag(target)} landed at (${String.fromCharCode(65 + behindCol)}${6 - behindRow})!`,
      });
    }
  }
  // 5. All other offensive Special Moves (Emperor's Rage, Crushing Horn, Cannon Blast, Sickle Dance, Poison Needle, Body Blow, Sky Dive, Rolling Thunder)
  else if (target) {
    const dmgRes = calculateDamage(attacker, target, move.powerMultiplier, Math.random);
    const dmg = dmgRes.damage;
    target.hp = Math.max(0, target.hp - dmg);
    if (attacker.team === 'player') nextStats.damageDealt += dmg;

    events.push({
      type: 'special',
      sourceUnitId: attacker.id,
      targetUnitId: target.id,
      fromCol: attacker.col,
      fromRow: attacker.row,
      toCol: target.col,
      toRow: target.row,
      damage: dmg,
      crit: dmgRes.crit,
      signatureId: move.id,
      signatureName: move.name,
      text: `${move.name.toUpperCase()}! ${formatUnitTag(attacker)} blasted ${formatUnitTag(target)} for ${dmg} DMG!${dmgRes.crit ? ' (CRITICAL!)' : ''}`,
    });

    if (target.hp <= 0) {
      target.hp = 0;
      target.defeated = true;
      target.defeatedReason = 'hp';
      if (attacker.team === 'player') nextStats.playerKOs += 1;
    } else {
      if (move.inflictsStatus === 'poison') {
        target.status.poison = 3;
        events.push({
          type: 'status',
          targetUnitId: target.id,
          statusApplied: 'poison',
          text: `${formatUnitTag(target)} was injected with lethal Poison!`,
        });
      } else if (move.inflictsStatus === 'confusion') {
        target.status.confusion = 3;
        events.push({
          type: 'status',
          targetUnitId: target.id,
          statusApplied: 'confusion',
          text: `${formatUnitTag(target)} was thrown into Confusion (∞)!`,
        });
      }

      if (move.knockbackTiles > 0) {
        const pushX = Math.sign(target.col - attacker.col);
        const pushY = Math.sign(target.row - attacker.row);
        applyPushDisplacement(
          nextUnits,
          target,
          pushX,
          pushY,
          move.knockbackTiles,
          events,
          nextStats,
          attacker.team
        );
      }
    }
  }

  const outcome = checkMatchOutcome(nextUnits);
  const newLogs = [...events.map((e) => e.text).reverse(), ...state.combatLog].slice(
    0,
    30
  );

  const nextActedList =
    attacker.team === 'player'
      ? Array.from(new Set([...(state.actedPlayerUnitIds || []), attacker.id]))
      : state.actedPlayerUnitIds || [];

  const intermediateState: MatchState = {
    ...state,
    units: nextUnits,
    targetedUnitId: target ? target.id : state.targetedUnitId,
    lastActedPlayerUnitId:
      attacker.team === 'player' ? attacker.id : state.lastActedPlayerUnitId,
    actedPlayerUnitIds: nextActedList,
    winner: outcome.winner,
    winReason: outcome.reason,
    combatLog: newLogs,
    stats: nextStats,
  };

  if (outcome.winner) {
    return { nextState: intermediateState, events };
  }

  return {
    nextState: advanceTurn(intermediateState),
    events,
  };
}

export function advanceTurn(state: MatchState): MatchState {
  if (state.winner) return state;

  const nextTeam: TeamSide = state.turn === 'player' ? 'enemy' : 'player';
  const nextUnits = state.units.map((u) => ({
    ...u,
    status: { ...u.status },
  }));
  const poisonLogs: string[] = [];

  for (const unit of nextUnits) {
    if (unit.defeated || unit.team !== nextTeam) continue;

    // Tick down shield
    if (unit.status.shield > 0) {
      unit.status.shield -= 1;
    }

    // Tick poison damage
    if (unit.status.poison > 0) {
      const poisonDmg = Math.max(20, Math.round(unit.maxHp * 0.12));
      unit.hp = Math.max(1, unit.hp - poisonDmg);
      unit.status.poison -= 1;
      poisonLogs.push(`${formatUnitTag(unit)} suffered ${poisonDmg} Poison DMG!`);
    }

    // Tick down confusion at end of turn
    if (unit.status.confusion > 0) {
      unit.status.confusion = Math.max(0, unit.status.confusion - 1);
    }

    // Tick down charm at end of controller's turn
    if (unit.status.charm && unit.status.charm > 0) {
      unit.status.charm -= 1;
      if (unit.status.charm === 0 && unit.originalTeam) {
        const formerTag = formatUnitTag(unit);
        unit.team = unit.originalTeam;
        unit.originalTeam = undefined;
        poisonLogs.push(
          `${formerTag} broke free from Charm and returned to original allegiance!`
        );
      }
    }
  }

  const outcome = checkMatchOutcome(nextUnits);

  // [F-01] Auto-Cycle Player Unit Selection on new Player Turn so the player naturally commands all 5 squad members
  let nextSelected = state.selectedUnitId;
  if (nextTeam === 'player') {
    const alivePlayerUnits = nextUnits.filter(
      (u) => !u.defeated && u.team === 'player'
    );
    const actedSet = new Set(state.actedPlayerUnitIds || []);
    const lastActedId = state.lastActedPlayerUnitId || state.selectedUnitId;

    // 1. Prefer a living non-King squad member that has not acted yet in the match
    const unactedNonKing = alivePlayerUnits.find(
      (u) => !u.isKing && !actedSet.has(u.id) && u.id !== lastActedId
    );
    // 2. Otherwise rotate to the next living non-King unit in slot order after lastActedId
    const lastIdx = alivePlayerUnits.findIndex((u) => u.id === lastActedId);
    let rotatedNonKing: BoardUnit | undefined;
    if (alivePlayerUnits.length > 1) {
      for (let offset = 1; offset <= alivePlayerUnits.length; offset++) {
        const candidate =
          alivePlayerUnits[(Math.max(0, lastIdx) + offset) % alivePlayerUnits.length];
        if (candidate && !candidate.isKing && candidate.id !== lastActedId) {
          rotatedNonKing = candidate;
          break;
        }
      }
    }
    const fallbackUnit =
      alivePlayerUnits.find((u) => u.id !== lastActedId) || alivePlayerUnits[0];

    nextSelected =
      unactedNonKing?.id ||
      rotatedNonKing?.id ||
      fallbackUnit?.id ||
      null;
  }

  return {
    ...state,
    turn: nextTeam,
    turnNumber: nextTeam === 'player' ? state.turnNumber + 1 : state.turnNumber,
    units: nextUnits,
    selectedUnitId: nextSelected,
    hasMovedThisTurn: false,
    movedUnitId: null,
    moveOriginCol: null,
    moveOriginRow: null,
    winner: outcome.winner,
    winReason: outcome.reason,
    combatLog: [...poisonLogs, ...state.combatLog].slice(0, 30),
  };
}

export interface AIDecision {
  unitId: string;
  moveTo?: { col: number; row: number };
  actionType: 'attack' | 'special' | 'wait';
  targetUnitId?: string;
}

/**
 * Evaluates all living Enemy units, their reachable move tiles, and available
 * Normal Attacks or Special Moves to select the highest-value tactical turn.
 */
export function computeBestAITurn(state: MatchState): AIDecision | null {
  const aiUnits = state.units.filter(
    (u) => u.team === 'enemy' && !u.defeated
  );
  if (aiUnits.length === 0) return null;

  let bestScore = -Infinity;
  let bestDecision: AIDecision | null = null;

  for (const unit of aiUnits) {
    const spec = getSpecies(unit.speciesId);
    const candidatePositions = [
      { col: unit.col, row: unit.row, moved: false },
      ...getValidMoves(state.units, unit).map((m) => ({
        col: m.col,
        row: m.row,
        moved: true,
      })),
    ];

    for (const pos of candidatePositions) {
      // Simulate unit at pos
      const simUnits = state.units.map((u) =>
        u.id === unit.id ? { ...u, col: pos.col, row: pos.row } : u
      );
      const simUnit = simUnits.find((u) => u.id === unit.id)!;

      // Base positional score: advance toward player's King, stay away from board rim if King
      const playerKing = simUnits.find((u) => u.team === 'player' && u.isKing && !u.defeated);
      let posScore = 0;
      if (playerKing) {
        const distToKing =
          Math.abs(pos.col - playerKing.col) + Math.abs(pos.row - playerKing.row);
        posScore += (10 - distToKing) * 6;
      }
      if (unit.isKing) {
        const onEdge =
          pos.col === 0 ||
          pos.col === BOARD_COLS - 1 ||
          pos.row === 0 ||
          pos.row === BOARD_ROWS - 1;
        if (onEdge) posScore -= 45;
        // Keep King behind non-King guards
        const alliesAhead = simUnits.filter((u) => u.team === 'enemy' && !u.isKing && !u.defeated && u.row > pos.row);
        if (alliesAhead.length >= 2) posScore += 20;
      }

      // 1. Evaluate Special Moves from pos
      const specialTargets = getValidSpecialTargets(
        simUnits,
        simUnit,
        pos.col,
        pos.row
      );
      for (const target of specialTargets) {
        let score = posScore + 120;
        if (target.isKing) score += 180;
        const pushX = Math.sign(target.col - pos.col);
        const pushY = Math.sign(target.row - pos.row);
        if (
          spec.specialMove.knockbackTiles > 0 &&
          !getSpecies(target.speciesId).knockbackImmune &&
          !isInsideBoard(
            target.col + pushX * spec.specialMove.knockbackTiles,
            target.row + pushY * spec.specialMove.knockbackTiles
          )
        ) {
          if (canBeRungOut(target)) {
            score += target.isKing ? 1500 : 650; // True ring-out!
          } else {
            score += 260; // Edge Grip wall slam damage bonus
          }
        }
        if (spec.specialMove.id === 'charm_beam') {
          if (target.isKing) {
            score -= 100; // Kings cannot be stolen, prefer non-King targets
          } else if (canBeCharmed(target)) {
            score += 750; // High value target capture
          }
        }
        if (score > bestScore) {
          bestScore = score;
          bestDecision = {
            unitId: unit.id,
            moveTo: pos.moved ? { col: pos.col, row: pos.row } : undefined,
            actionType: 'special',
            targetUnitId: target.id,
          };
        }
      }

      // 2. Evaluate Normal Attacks from pos
      const attackTargets = getValidAttackTargets(
        simUnits,
        simUnit,
        pos.col,
        pos.row
      );
      for (const target of attackTargets) {
        let score = posScore + 95;
        if (target.isKing) score += 150;
        if (target.hp <= unit.attack) score += 300;
        const pushX = Math.sign(target.col - pos.col);
        const pushY = Math.sign(target.row - pos.row);
        if (
          spec.knockbackChance >= 50 &&
          !getSpecies(target.speciesId).knockbackImmune &&
          !isInsideBoard(target.col + pushX, target.row + pushY)
        ) {
          if (canBeRungOut(target)) {
            score += target.isKing ? 1200 : 450;
          } else {
            score += 190;
          }
        }
        if (score > bestScore) {
          bestScore = score;
          bestDecision = {
            unitId: unit.id,
            moveTo: pos.moved ? { col: pos.col, row: pos.row } : undefined,
            actionType: 'attack',
            targetUnitId: target.id,
          };
        }
      }

      // 3. Evaluate pure movement (Wait) if moving improves board position
      if (pos.moved && posScore > bestScore) {
        bestScore = posScore;
        bestDecision = {
          unitId: unit.id,
          moveTo: { col: pos.col, row: pos.row },
          actionType: 'wait',
        };
      }
    }
  }

  return bestDecision;
}
