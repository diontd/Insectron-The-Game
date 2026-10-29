import test from 'node:test';
import assert from 'node:assert/strict';
import { INSECTOR_SPECIES, TOURNAMENT_PRESETS } from './species';
import {
  BOARD_COLS,
  BOARD_ROWS,
  DEFAULT_PLAYER_OPENING_SQUAD,
  MAX_SQUAD_POINTS,
  createMatchFromPreset,
  createMatchFromSquad,
  getValidMoves,
  getValidAttackTargets,
  getEnemiesAffectedBySpecial,
  getSquadTotalPoints,
  moveUnit,
  undoMove,
  advanceTurn,
  executeNormalAttack,
  executeSpecialMove,
  computeBestAITurn,
} from './rules';

test('minimum 12 playable insect species exist with 12 distinct signature moves', () => {
  assert.ok(
    INSECTOR_SPECIES.length >= 12,
    `Expected at least 12 species, got ${INSECTOR_SPECIES.length}`
  );
  const signatureIds = new Set<string>();
  for (const species of INSECTOR_SPECIES) {
    assert.ok(species.maxHp > 0, `${species.id} must have positive maxHp`);
    assert.ok(species.attack > 0, `${species.id} must have positive attack`);
    assert.ok(
      species.moveVectors.length >= 4,
      `${species.id} must have chess-like movement vectors`
    );
    assert.ok(
      species.specialMove.name.length > 0,
      `${species.id} must have a named special move`
    );
    signatureIds.add(species.specialMove.id);
  }
  assert.equal(
    signatureIds.size,
    INSECTOR_SPECIES.length,
    'Every insect species must have a unique signature move ID'
  );
});

test('createMatchFromSquad initializes a fresh Turn 1 5v5 opening formation and avoids selecting the King on Turn 1 (F-01)', () => {
  const match = createMatchFromSquad(DEFAULT_PLAYER_OPENING_SQUAD, 'A', 'Jaster');
  assert.equal(match.turn, 'player');
  assert.equal(match.turnNumber, 1);

  const playerUnits = match.units.filter((u) => u.team === 'player');
  const enemyUnits = match.units.filter((u) => u.team === 'enemy');
  assert.equal(playerUnits.length, 5);
  assert.equal(enemyUnits.length, 5);

  for (const u of playerUnits) {
    assert.equal(u.defeated, false);
    assert.equal(u.hp, u.maxHp);
    assert.ok(u.row === 4 || u.row === 5, 'Player unit must start on row 4 or 5');
  }
  for (const e of enemyUnits) {
    assert.equal(e.defeated, false);
    assert.equal(e.hp, e.maxHp);
    assert.ok(e.row === 0 || e.row === 1, 'Enemy unit must start on row 0 or 1');
  }
  assert.equal(playerUnits.filter((u) => u.isKing).length, 1);
  assert.equal(enemyUnits.filter((u) => u.isKing).length, 1);

  // [F-01] Turn 1 default selected unit must be a non-King front-row unit, not the King
  const selectedOnTurn1 = playerUnits.find((u) => u.id === match.selectedUnitId)!;
  assert.ok(selectedOnTurn1, 'A player unit should be selected on Turn 1');
  assert.equal(
    selectedOnTurn1.isKing,
    false,
    'Turn 1 default selection must not lock onto the King when front-line units exist'
  );
});

test('advanceTurn auto-cycles selection to a different non-King unit on the next Player turn (F-01)', () => {
  const match = createMatchFromSquad(DEFAULT_PLAYER_OPENING_SQUAD, 'A', 'Jaster');
  const firstUnitId = match.selectedUnitId!;
  const firstUnit = match.units.find((u) => u.id === firstUnitId)!;
  const moves = getValidMoves(match.units, firstUnit);
  assert.ok(moves.length > 0);

  const { nextState: afterMove } = moveUnit(match, firstUnitId, moves[0].col, moves[0].row);
  // Player turn -> Enemy turn
  const enemyTurn = advanceTurn(afterMove);
  assert.equal(enemyTurn.turn, 'enemy');

  // Enemy turn -> Player Turn 2
  const playerTurn2 = advanceTurn(enemyTurn);
  assert.equal(playerTurn2.turn, 'player');
  assert.notEqual(
    playerTurn2.selectedUnitId,
    firstUnitId,
    'Player Turn 2 should auto-cycle selection away from the unit that acted on Turn 1'
  );
  const turn2Unit = playerTurn2.units.find((u) => u.id === playerTurn2.selectedUnitId)!;
  assert.equal(turn2Unit.isKing, false, 'Auto-cycled unit should prioritize non-King units');
});

test('undoMove restores unit position and clears hasMovedThisTurn before attacking (F-05)', () => {
  const match = createMatchFromSquad(DEFAULT_PLAYER_OPENING_SQUAD, 'A', 'Jaster');
  const unit = match.units.find((u) => u.id === match.selectedUnitId)!;
  const origCol = unit.col;
  const origRow = unit.row;
  const moves = getValidMoves(match.units, unit);

  const { nextState: movedState } = moveUnit(match, unit.id, moves[0].col, moves[0].row);
  assert.equal(movedState.hasMovedThisTurn, true);
  assert.equal(movedState.movedUnitId, unit.id);
  assert.equal(movedState.moveOriginCol, origCol);
  assert.equal(movedState.moveOriginRow, origRow);

  const undoneState = undoMove(movedState);
  const restoredUnit = undoneState.units.find((u) => u.id === unit.id)!;
  assert.equal(undoneState.hasMovedThisTurn, false);
  assert.equal(undoneState.movedUnitId, null);
  assert.equal(undoneState.moveOriginCol, null);
  assert.equal(undoneState.moveOriginRow, null);
  assert.equal(restoredUnit.col, origCol);
  assert.equal(restoredUnit.row, origRow);
});

test('getEnemiesAffectedBySpecial detects 0 enemies in AoE for Agamel Fortress Quake on empty board (F-04)', () => {
  const squadWithAgamel = DEFAULT_PLAYER_OPENING_SQUAD.map((slot, idx) =>
    idx === 0 ? { ...slot, speciesId: 'agamel' } : slot
  );
  const match = createMatchFromSquad(squadWithAgamel, 'A', 'Jaster');
  const agamel = match.units.find((u) => u.team === 'player' && u.speciesId === 'agamel')!;
  const affectedAtStart = getEnemiesAffectedBySpecial(match.units, agamel);
  assert.equal(
    affectedAtStart.length,
    0,
    'Agamel at back row on Turn 1 should have 0 enemies in Fortress Quake AoE'
  );
});

test('combat logs include [ALLY] and [RIVAL] faction tags to prevent mirror-match ambiguity (F-03)', () => {
  const match = createMatchFromPreset(TOURNAMENT_PRESETS[0]);
  const bigAssBug = match.units.find((u) => u.name === 'BIG ASS BUG')!;
  const agamel = match.units.find((u) => u.name === 'AGAMEL')!;
  const { nextState } = executeNormalAttack(match, bigAssBug.id, agamel.id, () => 0.5);
  assert.ok(
    nextState.combatLog[0].includes('[ALLY] BIG ASS BUG') &&
      nextState.combatLog[0].includes('[RIVAL] AGAMEL'),
    `Expected [ALLY] and [RIVAL] tags in combat log, got: ${nextState.combatLog[0]}`
  );
});

test('getSquadTotalPoints enforces Squad Deployment Point Cap (F-08)', () => {
  const pts = getSquadTotalPoints(DEFAULT_PLAYER_OPENING_SQUAD);
  assert.ok(pts <= MAX_SQUAD_POINTS, `Default squad points (${pts}) must be <= ${MAX_SQUAD_POINTS}`);
});

test('classic Jaster vs Jin Red preset initializes 5x6 board accurately', () => {
  const match = createMatchFromPreset(TOURNAMENT_PRESETS[0]);
  assert.equal(match.playerName, 'Jaster');
  assert.equal(match.enemyName, 'Jin Red');
  assert.equal(match.turn, 'player');

  const bigAssBug = match.units.find((u) => u.name === 'BIG ASS BUG');
  const agamel = match.units.find((u) => u.name === 'AGAMEL');
  assert.ok(bigAssBug, 'BIG ASS BUG should be on the board');
  assert.ok(agamel, 'AGAMEL should be on the board');
  assert.equal(bigAssBug.hp, 511);
  assert.equal(agamel.hp, 900);

  const moves = getValidMoves(match.units, bigAssBug);
  assert.ok(moves.length > 0, 'BIG ASS BUG should have valid moves');
  assert.ok(
    moves.every(
      (m) => m.col >= 0 && m.col < BOARD_COLS && m.row >= 0 && m.row < BOARD_ROWS
    )
  );

  const attackTargets = getValidAttackTargets(match.units, bigAssBug);
  assert.ok(
    attackTargets.some((t) => t.name === 'AGAMEL'),
    'BIG ASS BUG at (2,3) should be able to attack AGAMEL at (3,2)'
  );
});

test('Edge Grip activates when HP > 50%, inflicting Wall Slam damage instead of instant Ring-Out (B-01)', () => {
  const match = createMatchFromPreset(TOURNAMENT_PRESETS[1]);
  const attacker = match.units.find((u) => u.team === 'player' && !u.defeated)!;
  const target = match.units.find(
    (u) => u.team === 'enemy' && !u.isKing && !u.defeated && u.speciesId !== 'agamel'
  )!;

  attacker.speciesId = 'big_ass_bug';
  attacker.col = 0;
  attacker.row = 1;
  target.col = 0;
  target.row = 0;
  target.hp = target.maxHp; // 100% HP -> Edge Grip active!

  const { nextState, events } = executeNormalAttack(
    match,
    attacker.id,
    target.id,
    () => 0.01 // triggers knockback
  );
  const updatedTarget = nextState.units.find((u) => u.id === target.id)!;
  assert.equal(updatedTarget.defeated, false, 'Edge Grip should prevent instant death at full HP');
  assert.equal(updatedTarget.col, 0);
  assert.equal(updatedTarget.row, 0);
  assert.ok(events.some((e) => e.wallSlam === true), 'Event must record wallSlam');
  assert.ok(events.some((e) => e.text.includes('EDGE GRIP')), 'Combat log must mention EDGE GRIP');
});

test('knockback off the 5x6 board triggers instant Out-of-Bounds Ring-Out once Edge Grip is broken (HP <= 50%)', () => {
  const match = createMatchFromPreset(TOURNAMENT_PRESETS[1]);
  const attacker = match.units.find((u) => u.team === 'player' && !u.defeated)!;
  const target = match.units.find(
    (u) => u.team === 'enemy' && !u.isKing && !u.defeated && u.speciesId !== 'agamel'
  )!;

  attacker.speciesId = 'big_ass_bug';
  attacker.col = 0;
  attacker.row = 1;
  target.col = 0;
  target.row = 0;
  target.hp = Math.round(target.maxHp * 0.4); // 40% HP <= 50% -> Edge Grip broken!

  const { nextState, events } = executeNormalAttack(
    match,
    attacker.id,
    target.id,
    () => 0.01
  );
  const updatedTarget = nextState.units.find((u) => u.id === target.id)!;
  assert.equal(updatedTarget.defeated, true);
  assert.equal(updatedTarget.defeatedReason, 'ring_out');
  assert.ok(events.some((e) => e.type === 'ring_out'));
  assert.equal(nextState.stats.playerRingOuts, 1);
});

test('defeating or ringing out the enemy King immediately wins the match and emits signatureId', () => {
  const match = createMatchFromPreset(TOURNAMENT_PRESETS[0]);
  const attacker = match.units.find((u) => u.name === 'BIG ASS BUG')!;
  const enemyKing = match.units.find((u) => u.team === 'enemy' && u.isKing)!;

  attacker.col = 1;
  attacker.row = 1;
  enemyKing.col = 0;
  enemyKing.row = 0;
  enemyKing.hp = 100; // Low HP so 1.8x Crushing Horn (180+ DMG) finishes off the King directly!

  const { nextState, events } = executeSpecialMove(match, attacker.id, enemyKing.id);
  assert.equal(nextState.winner, 'player');
  assert.ok(nextState.winReason?.includes('Enemy King'));
  assert.ok(events.some((e) => e.signatureId === 'crushing_horn'));
});

test('Noble Faerie Charm Beam converts weakened non-King enemy (HP <= 50%) temporarily (B-03)', () => {
  const match = createMatchFromPreset(TOURNAMENT_PRESETS[1]);
  const faerie = match.units.find(
    (u) => u.team === 'player' && u.speciesId === 'noble_faerie'
  )!;
  const enemyTarget = match.units.find(
    (u) => u.team === 'enemy' && !u.isKing
  )!;

  faerie.col = 2;
  faerie.row = 3;
  faerie.hp = 400;
  enemyTarget.col = 2;
  enemyTarget.row = 2;
  enemyTarget.hp = Math.round(enemyTarget.maxHp * 0.45); // <= 50% HP

  const { nextState, events } = executeSpecialMove(
    match,
    faerie.id,
    enemyTarget.id
  );
  const updatedFaerie = nextState.units.find((u) => u.id === faerie.id)!;
  const convertedUnit = nextState.units.find((u) => u.id === enemyTarget.id)!;

  assert.equal(updatedFaerie.hp, 200);
  assert.equal(convertedUnit.team, 'player');
  assert.equal(convertedUnit.originalTeam, 'enemy');
  assert.ok(events.some((e) => e.type === 'charm' && e.signatureId === 'charm_beam'));
});

test('Noble Faerie Charm Beam is resisted by healthy non-King enemy (HP > 50%) dealing psychic damage + confusion (B-03)', () => {
  const match = createMatchFromPreset(TOURNAMENT_PRESETS[1]);
  const faerie = match.units.find(
    (u) => u.team === 'player' && u.speciesId === 'noble_faerie'
  )!;
  const enemyTarget = match.units.find(
    (u) => u.team === 'enemy' && !u.isKing
  )!;

  faerie.col = 2;
  faerie.row = 3;
  faerie.hp = 400;
  enemyTarget.col = 2;
  enemyTarget.row = 2;
  enemyTarget.hp = enemyTarget.maxHp; // 100% HP

  const { nextState, events } = executeSpecialMove(
    match,
    faerie.id,
    enemyTarget.id
  );
  const convertedUnit = nextState.units.find((u) => u.id === enemyTarget.id)!;

  assert.equal(convertedUnit.team, 'enemy', 'Should not convert healthy target');
  assert.ok(convertedUnit.status.confusion > 0, 'Target should be confused');
  assert.ok(events.some((e) => e.text.includes('CHARM RESISTED')));
});

test('AI decision engine selects a legal move and action on enemy turn', () => {
  const match = createMatchFromSquad(DEFAULT_PLAYER_OPENING_SQUAD, 'A');
  match.turn = 'enemy';
  const decision = computeBestAITurn(match);
  assert.ok(decision, 'AI should return a valid decision');
  const actingUnit = match.units.find((u) => u.id === decision.unitId);
  assert.ok(actingUnit && actingUnit.team === 'enemy' && !actingUnit.defeated);
});

test('every insect starts with 3 charges (max 3) and consumes 1 charge when using skill', () => {
  const match = createMatchFromSquad(DEFAULT_PLAYER_OPENING_SQUAD, 'A');
  for (const u of match.units) {
    assert.equal(u.maxSpecialUses, 3, `${u.name} maxSpecialUses must be 3`);
    assert.equal(u.specialUses, 3, `${u.name} initial specialUses must be 3`);
  }

  const agamel = match.units.find(
    (u) => u.team === 'player' && u.speciesId === 'agamel'
  )!;
  const { nextState } = executeSpecialMove(match, agamel.id, agamel.id);
  const updatedAgamel = nextState.units.find((u) => u.id === agamel.id)!;
  assert.equal(
    updatedAgamel.specialUses,
    2,
    'Using Fortress Quake must decrement Agamel charges from 3 to 2'
  );
});


