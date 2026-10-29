import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  INSECTOR_SPECIES,
  PresetUnitPlacement,
} from './game/species';
import {
  BoardUnit,
  CombatEvent,
  DEFAULT_PLAYER_OPENING_SQUAD,
  MatchState,
  OPPONENT_TIER_CONFIG,
  advanceTurn,
  computeBestAITurn,
  createMatchFromSquad,
  executeNormalAttack,
  executeSpecialMove,
  getAttackPreviewTiles,
  getDefeatTacticalTip,
  getEnemiesAffectedBySpecial,
  getKingDangerStatus,
  getSpecialPreviewTiles,
  getSpecies,
  getUnitAt,
  getValidAttackTargets,
  getValidMoves,
  getValidSpecialTargets,
  moveUnit,
  undoMove,
} from './game/rules';
import { ArenaCanvas, CameraPresetMode } from './components/ArenaCanvas';
import { InsectPortraitSVG, KingCrownSVG } from './components/InsectIllustration';
import { SquadBuilderModal } from './components/SquadBuilderModal';
import { soundFX } from './utils/sound';

type ShellState = 'title' | 'select' | 'playing' | 'paused' | 'gameover';

const triggerHaptic = (pattern: number | number[] = 15) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore on unsupported browsers
    }
  }
};

const dispatchCombatImpactEffects = (events: CombatEvent[]) => {
  const hasRingOut = events.some((e) => e.type === 'ring_out');
  const hasWallSlam = events.some((e) => e.wallSlam);
  const hasCrit = events.some((e) => e.crit);
  const hasFumble = events.some((e) => e.fumble);
  const isSpecial = events.some(
    (e) => e.type === 'special' || e.type === 'charm' || e.type === 'heal'
  );
  const sigId = events.find((e) => e.signatureId)?.signatureId;

  if (hasRingOut) {
    soundFX.playRingOut();
    triggerHaptic([45, 55, 60]);
  } else if (hasWallSlam) {
    soundFX.playWallSlam();
    triggerHaptic([35, 45]);
  } else if (hasCrit) {
    soundFX.playCriticalHit();
    triggerHaptic([30, 40]);
  } else if (hasFumble) {
    soundFX.playFumble();
    triggerHaptic(12);
  } else if (isSpecial) {
    soundFX.playSignatureMove(sigId);
    triggerHaptic([25, 35, 30]);
  } else {
    soundFX.playAttack();
    triggerHaptic(20);
  }
};

// [F-03] Render color-coded unit names and ability highlights inside the Floating Sanctuary Combat Log
function renderFactionLogText(text: string, lineIndex = 0): React.ReactNode {
  if (!text) return null;
  const isAlly = text.includes('[ALLY]');
  const cleaned = text.replace(/\[ALLY\]\s*/g, '').replace(/\[RIVAL\]\s*/g, '');

  const tokenRegex =
    /(AGAMEL|KABUTO|KUWAGA|MANTIS|SCORPIO|HERCULES|ATLAS|VESPA|FIREFLY|DRAGONFLY|CENTIPEDE|TARANTULA|Fortress Quake|Iron Shield|Crushing Horn|Scissor Throw|Venom Sting|Sky Dive|Solar Flare|Tectonic Slam|Royal Decree|Ring-Out!?)/g;

  const parts = cleaned.split(tokenRegex);
  return parts.map((part, idx) => {
    if (!part) return null;
    if (
      /^(AGAMEL|KABUTO|KUWAGA|MANTIS|SCORPIO|HERCULES|ATLAS|VESPA|FIREFLY|DRAGONFLY|CENTIPEDE|TARANTULA)$/.test(
        part
      )
    ) {
      const colorClass =
        !isAlly
          ? 'text-[#FF6E4A] font-bold'
          : lineIndex === 0
            ? 'text-[#52E59B] font-bold'
            : 'text-[#FFB838] font-bold';
      return (
        <span key={idx} className={colorClass}>
          {part}
        </span>
      );
    }
    if (
      /^(Fortress Quake|Iron Shield|Crushing Horn|Scissor Throw|Venom Sting|Sky Dive|Solar Flare|Tectonic Slam|Royal Decree|Ring-Out!?)$/.test(
        part
      )
    ) {
      return (
        <span key={idx} className="text-[#FFB838] font-bold">
          {part}
        </span>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

export default function App() {
  // Support ?autostart=1 to jump directly to a fresh Turn-1 3D match
  const initialShellState = useMemo<ShellState>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        return 'playing';
      }
    }
    return 'title';
  }, []);

  const [shellState, setShellState] = useState<ShellState>(initialShellState);
  const [playerSquad, setPlayerSquad] = useState<PresetUnitPlacement[]>(
    DEFAULT_PLAYER_OPENING_SQUAD
  );
  const [opponentRank, setOpponentRank] = useState<'B' | 'A' | 'S'>('A');
  const [match, setMatch] = useState<MatchState>(() =>
    createMatchFromSquad(DEFAULT_PLAYER_OPENING_SQUAD, 'A', 'Jaster')
  );
  const [actionMode, setActionMode] = useState<
    'move_or_attack' | 'attack_confirm' | 'special'
  >('move_or_attack');
  const [cameraMode, setCameraMode] = useState<CameraPresetMode>('tactical');
  const [lastEvents, setLastEvents] = useState<CombatEvent[]>([]);
  const [hoveredBoardTile, setHoveredBoardTile] = useState<{
    col: number;
    row: number;
  } | null>(null);
  // [F-04] Hover AoE Preview state when hovering over Attack or Signature Move button
  const [hoveredActionButton, setHoveredActionButton] = useState<
    'attack' | 'special' | null
  >(null);
  // [F-02] 680ms Post-Action Digest Buffer before switching banner to RIVAL'S TURN & triggering AI
  const [isPostActionHold, setIsPostActionHold] = useState<boolean>(false);

  // UI Modals & Accessibility Preferences (Section 7 & 8)
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isMenuRankOpen, setIsMenuRankOpen] = useState<boolean>(false);
  const [isCombatLogOpen, setIsCombatLogOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [enableScreenShake, setEnableScreenShake] = useState<boolean>(true);
  const [enableParticles, setEnableParticles] = useState<boolean>(true);

  const aiTimeoutRef = useRef<number | null>(null);
  const postActionTimerRef = useRef<number | null>(null);

  // Sync shell state to document.body.dataset.state
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.dataset.state = shellState;
    }
  }, [shellState]);

  // Transition to 'gameover' when match has a winner
  useEffect(() => {
    if (match.winner && shellState === 'playing') {
      if (match.winner === 'player') {
        soundFX.playVictory();
        triggerHaptic([30, 50, 60]);
      } else {
        soundFX.playRingOut();
        triggerHaptic([40, 40, 40]);
      }
      const timer = window.setTimeout(() => {
        setShellState('gameover');
      }, 650);
      return () => window.clearTimeout(timer);
    }
  }, [match.winner, shellState]);

  const selectedUnit: BoardUnit | null = useMemo(() => {
    return (
      match.units.find((u) => u.id === match.selectedUnitId && !u.defeated) ||
      match.units.find((u) => u.team === 'player' && !u.defeated) ||
      null
    );
  }, [match.units, match.selectedUnitId]);

  // If player hovers over an enemy on the 3D board, preview that enemy in the Target box!
  const hoveredUnit: BoardUnit | null = useMemo(() => {
    if (!hoveredBoardTile) return null;
    return getUnitAt(match.units, hoveredBoardTile.col, hoveredBoardTile.row) || null;
  }, [match.units, hoveredBoardTile]);

  const targetedUnit: BoardUnit | null = useMemo(() => {
    if (hoveredUnit && hoveredUnit.team === 'enemy' && !hoveredUnit.defeated) {
      return hoveredUnit;
    }
    return (
      match.units.find((u) => u.id === match.targetedUnitId && !u.defeated) ||
      match.units.find((u) => u.team === 'enemy' && !u.defeated) ||
      null
    );
  }, [match.units, match.targetedUnitId, hoveredUnit]);

  const validMoves = useMemo(() => {
    if (
      shellState !== 'playing' ||
      match.turn !== 'player' ||
      match.hasMovedThisTurn ||
      !selectedUnit ||
      selectedUnit.team !== 'player'
    ) {
      return [];
    }
    return getValidMoves(match.units, selectedUnit);
  }, [shellState, match.turn, match.hasMovedThisTurn, match.units, selectedUnit]);

  const attackTargets = useMemo(() => {
    if (
      shellState !== 'playing' ||
      match.turn !== 'player' ||
      !selectedUnit ||
      selectedUnit.team !== 'player'
    ) {
      return [];
    }
    if (
      match.hasMovedThisTurn &&
      match.movedUnitId &&
      match.movedUnitId !== selectedUnit.id
    ) {
      return [];
    }
    return getValidAttackTargets(match.units, selectedUnit);
  }, [
    shellState,
    match.turn,
    match.hasMovedThisTurn,
    match.movedUnitId,
    match.units,
    selectedUnit,
  ]);

  const specialTargets = useMemo(() => {
    if (
      shellState !== 'playing' ||
      match.turn !== 'player' ||
      !selectedUnit ||
      selectedUnit.team !== 'player'
    ) {
      return [];
    }
    if (
      match.hasMovedThisTurn &&
      match.movedUnitId &&
      match.movedUnitId !== selectedUnit.id
    ) {
      return [];
    }
    return getValidSpecialTargets(match.units, selectedUnit);
  }, [
    shellState,
    match.turn,
    match.hasMovedThisTurn,
    match.movedUnitId,
    match.units,
    selectedUnit,
  ]);

  // [F-02] Execute AI turn ONLY after the 680ms Post-Action Digest Buffer completes
  useEffect(() => {
    if (
      shellState !== 'playing' ||
      match.turn !== 'enemy' ||
      match.winner ||
      isPostActionHold
    ) {
      return;
    }

    aiTimeoutRef.current = window.setTimeout(() => {
      const decision = computeBestAITurn(match);
      if (!decision) {
        setMatch((prev) => advanceTurn(prev));
        return;
      }

      let workingState = match;
      const collectedEvents: CombatEvent[] = [];

      if (decision.moveTo) {
        const moved = moveUnit(
          workingState,
          decision.unitId,
          decision.moveTo.col,
          decision.moveTo.row
        );
        workingState = moved.nextState;
        collectedEvents.push(...moved.events);
        soundFX.playMove();
      }

      if (decision.actionType === 'special' && decision.targetUnitId) {
        const specRes = executeSpecialMove(
          workingState,
          decision.unitId,
          decision.targetUnitId
        );
        workingState = specRes.nextState;
        collectedEvents.push(...specRes.events);
        dispatchCombatImpactEffects(specRes.events);
      } else if (decision.actionType === 'attack' && decision.targetUnitId) {
        const atkRes = executeNormalAttack(
          workingState,
          decision.unitId,
          decision.targetUnitId
        );
        workingState = atkRes.nextState;
        collectedEvents.push(...atkRes.events);
        dispatchCombatImpactEffects(atkRes.events);
      } else {
        workingState = advanceTurn(workingState);
      }

      setLastEvents(collectedEvents);
      setMatch(workingState);
      setActionMode('move_or_attack');
    }, 1100);

    return () => {
      if (aiTimeoutRef.current) {
        window.clearTimeout(aiTimeoutRef.current);
      }
    };
  }, [shellState, match, isPostActionHold]);

  // [F-02] Helper to commit a player combat action with deliberate pacing buffer before AI starts
  const commitPlayerCombatAction = useCallback(
    (nextState: MatchState, events: CombatEvent[]) => {
      setLastEvents(events);
      setHoveredActionButton(null);
      setActionMode('move_or_attack');
      setMatch(nextState);

      if (!nextState.winner && nextState.turn === 'enemy') {
        if (postActionTimerRef.current) {
          window.clearTimeout(postActionTimerRef.current);
        }
        setIsPostActionHold(true);
        // Deliberate cinematic buffer: allows player to watch attack windup, hitstop & damage bounce
        const holdDuration = events.some((e) => e.type === 'ring_out')
          ? 2200
          : events.some(
              (e) =>
                e.type === 'special' ||
                e.type === 'charm' ||
                e.type === 'heal'
            )
            ? 1950
            : 1250;
        postActionTimerRef.current = window.setTimeout(() => {
          setIsPostActionHold(false);
        }, holdDuration);
      } else {
        setIsPostActionHold(false);
      }
    },
    []
  );

  // [F-05] Undo current-turn move before attacking or ending turn
  const handleUndoMove = useCallback(() => {
    if (
      shellState !== 'playing' ||
      match.turn !== 'player' ||
      !match.hasMovedThisTurn ||
      match.winner
    ) {
      return;
    }
    soundFX.playSelect();
    triggerHaptic(10);
    setActionMode('move_or_attack');
    setHoveredActionButton(null);
    setMatch((prev) => undoMove(prev));
  }, [shellState, match.turn, match.hasMovedThisTurn, match.winner]);

  // Start a fresh Turn-1 match from the current drafted 5-Insector squad
  const handleStartFreshMatch = useCallback(
    (
      squadOverride?: PresetUnitPlacement[],
      rankOverride?: 'B' | 'A' | 'S'
    ) => {
      const squad = squadOverride || playerSquad;
      const rank = rankOverride || opponentRank;
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      if (postActionTimerRef.current) {
        window.clearTimeout(postActionTimerRef.current);
      }
      soundFX.playSelect();
      triggerHaptic(20);
      setPlayerSquad(squad);
      setOpponentRank(rank);
      setMatch(createMatchFromSquad(squad, rank, 'Jaster'));
      setActionMode('move_or_attack');
      setHoveredActionButton(null);
      setIsPostActionHold(false);
      setLastEvents([]);
      setIsCombatLogOpen(false);
      setShellState('playing');
    },
    [playerSquad, opponentRank]
  );

  // Global keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isHowToPlayOpen) {
        if (e.key === 'Escape') setIsHowToPlayOpen(false);
        return;
      }
      if (isSettingsOpen) {
        if (e.key === 'Escape') setIsSettingsOpen(false);
        return;
      }
      if (shellState === 'select') {
        if (e.key === 'Escape') setShellState('title');
        return;
      }

      if (shellState === 'title' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        setShellState('select');
        return;
      }

      const key = e.key.toLowerCase();
      if (e.key === 'Escape' || key === 'p') {
        if (shellState === 'playing') {
          setShellState('paused');
        } else if (shellState === 'paused') {
          setShellState('playing');
        }
      } else if (key === 'm') {
        soundFX.muted = !soundFX.muted;
        setIsMuted(soundFX.muted);
      } else if (key === 'z' && shellState === 'playing') {
        handleUndoMove();
      } else if (key === 'q' && shellState === 'playing') {
        if (match.turnNumber === 1 && !match.hasMovedThisTurn) {
          setShellState('select');
        }
      } else if (key === 'r' && shellState === 'playing') {
        handleStartFreshMatch();
      } else if (key === 'c' && shellState === 'playing') {
        setCameraMode((prev) =>
          prev === 'tactical' ? 'topdown' : 'tactical'
        );
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    shellState,
    isHowToPlayOpen,
    isSettingsOpen,
    match.turnNumber,
    match.hasMovedThisTurn,
    handleUndoMove,
    handleStartFreshMatch,
  ]);

  // Handle clicking any tile on the 3D 5x6 board
  const handleTileClick = (col: number, row: number) => {
    if (
      shellState !== 'playing' ||
      match.turn !== 'player' ||
      match.winner ||
      isPostActionHold
    ) {
      return;
    }

    // [F-05] Clicking the move origin tile while hasMovedThisTurn === true undoes the move!
    if (
      match.hasMovedThisTurn &&
      match.moveOriginCol === col &&
      match.moveOriginRow === row
    ) {
      handleUndoMove();
      return;
    }

    const clickedUnit = getUnitAt(match.units, col, row);

    // 1. If in Special Move targeting mode and clicked unit is a valid special target
    if (
      actionMode === 'special' &&
      selectedUnit &&
      clickedUnit &&
      specialTargets.some((t) => t.id === clickedUnit.id)
    ) {
      const { nextState, events } = executeSpecialMove(
        match,
        selectedUnit.id,
        clickedUnit.id
      );
      dispatchCombatImpactEffects(events);
      commitPlayerCombatAction(nextState, events);
      return;
    }

    // 2. If clicked unit is an attackable Enemy in normal or attack_confirm mode -> Execute Attack!
    if (
      (actionMode === 'move_or_attack' || actionMode === 'attack_confirm') &&
      selectedUnit &&
      clickedUnit &&
      clickedUnit.team === 'enemy' &&
      attackTargets.some((t) => t.id === clickedUnit.id)
    ) {
      const { nextState, events } = executeNormalAttack(
        match,
        selectedUnit.id,
        clickedUnit.id
      );
      dispatchCombatImpactEffects(events);
      commitPlayerCombatAction(nextState, events);
      return;
    }

    // 3. If clicked unit is one of Player's own living Insectors (and haven't moved another bug yet)
    if (clickedUnit && clickedUnit.team === 'player') {
      if (!match.hasMovedThisTurn || match.movedUnitId === clickedUnit.id) {
        soundFX.playSelect();
        triggerHaptic(10);
        setMatch((prev) => ({ ...prev, selectedUnitId: clickedUnit.id }));
        setActionMode('move_or_attack');
      }
      return;
    }

    // 4. If clicked unit is an Enemy out of range -> inspect it in the Target Preview
    if (clickedUnit && clickedUnit.team === 'enemy') {
      soundFX.playSelect();
      triggerHaptic(10);
      setMatch((prev) => ({ ...prev, targetedUnitId: clickedUnit.id }));
      return;
    }

    // 5. If clicked an empty tile that is a valid Move destination -> Move there!
    // [F-05] Never auto-end the turn on move so the player can always inspect or click Undo Move [Z]!
    if (
      !clickedUnit &&
      selectedUnit &&
      !match.hasMovedThisTurn &&
      validMoves.some((m) => m.col === col && m.row === row)
    ) {
      const { nextState, events } = moveUnit(
        match,
        selectedUnit.id,
        col,
        row
      );
      soundFX.playMove();
      triggerHaptic(12);
      setLastEvents(events);

      const movedUnit = nextState.units.find((u) => u.id === selectedUnit.id)!;
      const newAttacks = getValidAttackTargets(nextState.units, movedUnit);
      const newSpecials = getValidSpecialTargets(nextState.units, movedUnit);

      const nextTargetId =
        newAttacks[0]?.id ||
        (newSpecials[0]?.team === 'enemy' ? newSpecials[0]?.id : undefined) ||
        nextState.targetedUnitId;

      setMatch({
        ...nextState,
        targetedUnitId: nextTargetId,
      });
      setActionMode('move_or_attack');
    }
  };

  // [F-05] Trigger Attack button from Command Bar (1-click if 1 target, or Target Confirmation if >1 targets)
  const handleTriggerAttackButton = () => {
    if (!selectedUnit || attackTargets.length === 0 || isPostActionHold) return;
    const preferredTarget =
      attackTargets.find((t) => t.id === targetedUnit?.id) || attackTargets[0];

    if (attackTargets.length > 1 && actionMode !== 'attack_confirm') {
      soundFX.playSelect();
      triggerHaptic(12);
      setMatch((prev) => ({ ...prev, targetedUnitId: preferredTarget.id }));
      setActionMode('attack_confirm');
      return;
    }

    const { nextState, events } = executeNormalAttack(
      match,
      selectedUnit.id,
      preferredTarget.id
    );
    dispatchCombatImpactEffects(events);
    commitPlayerCombatAction(nextState, events);
  };

  // Trigger Signature Move button from Command Bar
  const handleTriggerSpecialButton = () => {
    if (!selectedUnit || specialTargets.length === 0 || isPostActionHold) return;
    const spec = getSpecies(selectedUnit.speciesId);
    if (
      spec.specialMove.targetType === 'self_aoe' ||
      spec.specialMove.targetType === 'ally_aoe' ||
      specialTargets.length === 1
    ) {
      const target =
        specialTargets.find((t) => t.id === targetedUnit?.id) ||
        specialTargets[0];
      const { nextState, events } = executeSpecialMove(
        match,
        selectedUnit.id,
        target.id
      );
      dispatchCombatImpactEffects(events);
      commitPlayerCombatAction(nextState, events);
    } else {
      soundFX.playSelect();
      triggerHaptic(12);
      setActionMode((prev) =>
        prev === 'special' ? 'move_or_attack' : 'special'
      );
    }
  };

  // End Turn / Standby button
  const handleStandbyTurn = () => {
    if (match.turn !== 'player' || match.winner || isPostActionHold) return;
    soundFX.playSelect();
    triggerHaptic(12);
    setActionMode('move_or_attack');
    setHoveredActionButton(null);
    setMatch((prev) => advanceTurn(prev));
  };

  const selectedSpecies = selectedUnit
    ? getSpecies(selectedUnit.speciesId)
    : INSECTOR_SPECIES[0];

  const targetedSpecies = targetedUnit
    ? getSpecies(targetedUnit.speciesId)
    : INSECTOR_SPECIES[1];

  // Ensure 5 slots (0..4) for top HUD unit trays
  const playerSlots = [0, 1, 2, 3, 4].map((slotIdx) =>
    match.units.find((u) => u.id === `player_${slotIdx}`)
  );
  const enemySlots = [0, 1, 2, 3, 4].map((slotIdx) =>
    match.units.find((u) => u.id === `enemy_${slotIdx}`)
  );

  const playerAliveCount = playerSlots.filter((u) => u && !u.defeated).length;
  const enemyAliveCount = enemySlots.filter((u) => u && !u.defeated).length;

  const playerHpPct = selectedUnit
    ? Math.max(0, Math.min(100, (selectedUnit.hp / selectedUnit.maxHp) * 100))
    : 0;
  const enemyHpPct = targetedUnit
    ? Math.max(0, Math.min(100, (targetedUnit.hp / targetedUnit.maxHp) * 100))
    : 0;

  // Estimate damage & knockback for tactical preview before committing an action
  const estNormalDamage = useMemo(() => {
    if (!selectedUnit || !targetedUnit) return 110;
    const raw = Math.round(
      selectedUnit.attack * 1.15 - targetedUnit.defense * 0.52
    );
    return Math.max(35, raw);
  }, [selectedUnit, targetedUnit]);

  const estSpecialDamage = useMemo(() => {
    if (!selectedUnit || !targetedUnit) return 165;
    const mult = selectedSpecies.specialMove.powerMultiplier || 1.45;
    const raw = Math.round(
      selectedUnit.attack * mult - targetedUnit.defense * 0.42
    );
    return Math.max(55, raw);
  }, [selectedUnit, targetedUnit, selectedSpecies]);

  const canAttackNow =
    match.turn === 'player' && !isPostActionHold && attackTargets.length > 0;
  const hasSpecialCharges =
    selectedUnit?.specialUses === -1 || (selectedUnit?.specialUses ?? 0) > 0;
  const canUseSpecialNow =
    match.turn === 'player' &&
    !isPostActionHold &&
    specialTargets.length > 0 &&
    hasSpecialCharges;

  // [F-04] Compute actual enemies in range for self_aoe (Fortress Quake) & Hover AoE Preview tiles
  const specialAffectedUnits = useMemo(() => {
    if (!selectedUnit) return [];
    return getEnemiesAffectedBySpecial(match.units, selectedUnit);
  }, [match.units, selectedUnit]);

  const isSelfAoEShieldOnly =
    selectedSpecies.specialMove.targetType === 'self_aoe' &&
    specialAffectedUnits.length === 0;

  const previewTiles = useMemo(() => {
    if (hoveredActionButton === 'attack') {
      return getAttackPreviewTiles(selectedUnit);
    }
    if (hoveredActionButton === 'special') {
      return getSpecialPreviewTiles(selectedUnit);
    }
    return [];
  }, [hoveredActionButton, selectedUnit]);

  const moveOriginTile = useMemo(() => {
    if (
      match.turn === 'player' &&
      match.hasMovedThisTurn &&
      match.moveOriginCol !== undefined &&
      match.moveOriginCol !== null &&
      match.moveOriginRow !== undefined &&
      match.moveOriginRow !== null
    ) {
      return { col: match.moveOriginCol, row: match.moveOriginRow };
    }
    return null;
  }, [
    match.turn,
    match.hasMovedThisTurn,
    match.moveOriginCol,
    match.moveOriginRow,
  ]);

  const kingDanger = useMemo(
    () => getKingDangerStatus(match.units, 'player'),
    [match.units]
  );

  const canEditSquadNow =
    match.turn === 'player' &&
    match.turnNumber === 1 &&
    !match.hasMovedThisTurn &&
    !isPostActionHold;

  const playerShieldPct = useMemo(() => {
    if (!selectedUnit) return 0;
    if (selectedUnit.status.shield > 0) {
      return 85;
    }
    return Math.max(25, Math.min(95, Math.round((selectedUnit.defense / 95) * 65)));
  }, [selectedUnit]);

  const recentLogPair = useMemo(() => {
    return match.combatLog.slice(0, 2).reverse();
  }, [match.combatLog]);

  const handleCycleCompassCamera = () => {
    soundFX.playSelect();
    triggerHaptic(10);
    setCameraMode((prev) => {
      if (prev === 'tactical') return 'isometric';
      if (prev === 'isometric') return 'cinematic';
      if (prev === 'cinematic') return 'topdown';
      return 'tactical';
    });
  };

  const compassNeedleRotation = useMemo(() => {
    if (cameraMode === 'tactical') return 'rotate-[36deg]';
    if (cameraMode === 'isometric') return 'rotate-[125deg]';
    if (cameraMode === 'cinematic') return 'rotate-[215deg]';
    return 'rotate-0';
  }, [cameraMode]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#121E24] text-[#F4F9F5] select-none">
      {/* 1. FULL 3D THREE.JS BIO-DOME ARENA & 3D CREATURES */}
      <div className="absolute inset-0">
        <ArenaCanvas
          units={match.units}
          selectedUnit={selectedUnit}
          targetedUnit={targetedUnit}
          validMoves={validMoves}
          attackTargets={attackTargets}
          specialTargets={specialTargets}
          previewTiles={previewTiles}
          previewType={hoveredActionButton}
          moveOriginTile={moveOriginTile}
          actionMode={actionMode}
          lastEvents={lastEvents}
          cameraMode={cameraMode}
          isTitleBackdrop={shellState === 'title' || shellState === 'select'}
          winner={match.winner}
          enableScreenShake={enableScreenShake}
          enableParticles={enableParticles}
          onTileHover={setHoveredBoardTile}
          onTileClick={handleTileClick}
        />
      </div>

      {/* ====================================================================
          2. BATTLE ARENA HUD (Proportional Desktop Layout — Zero Overlap)
          ==================================================================== */}
      {(shellState === 'playing' ||
        shellState === 'paused' ||
        shellState === 'gameover') && (
        <div className="fixed inset-0 pointer-events-none flex flex-col justify-between px-3 pb-2 pt-0 sm:px-4 sm:pb-2.5 z-10">
          {/* TOP BAR: Left Faction Banner (JASTER) | Center Compact Stone Arch (INSECTRON) | Right Controls + Faction Banner (JIN RED) */}
          <div className="w-full max-w-[1440px] mx-auto flex flex-wrap sm:flex-nowrap items-start justify-between gap-1.5 sm:gap-2">
            {/* TOP-LEFT: JASTER Sage-Mint Faction Banner + Compact 5-Unit Quick Selector Tray */}
            <div className="order-2 sm:order-1 flex flex-col items-start gap-1 sm:gap-1.5 pt-1 sm:pt-2 pointer-events-auto">
              {/* Sage-Mint Faction Banner (JASTER) with Circular Green Crown Medallion */}
              <div className="relative flex items-center">
                <div className="z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-b from-[#7CEAA9] to-[#3B9464] border-2 border-[#3B423C] shadow-[0_3px_8px_rgba(0,0,0,0.65),inset_0_1.5px_0_rgba(255,255,255,0.4)] flex items-center justify-center shrink-0">
                  <KingCrownSVG className="w-3.5 h-3.5 sm:w-4 sm:h-4 drop-shadow" />
                </div>
                <div className="faction-banner-ally -ml-2.5 pl-3.5 pr-3 sm:pl-4 sm:pr-4 py-1 min-w-[115px] sm:min-w-[155px] flex items-center justify-between gap-2">
                  <span className="font-stone-serif text-xs sm:text-base font-extrabold tracking-wider text-[#F7F3E8] uppercase drop-shadow-[0_2px_2px_rgba(0,0,0,0.75)]">
                    {match.playerName}
                  </span>
                  <span className="text-[10px] font-num font-bold text-[#D7F5E3]">
                    {playerAliveCount}/5
                  </span>
                </div>
              </div>

              {/* Compact 5-Unit Quick Selector Pills underneath JASTER Banner */}
              <div className="flex items-center gap-1 pl-0.5">
                {playerSlots.map((unit, idx) => {
                  const alive = Boolean(unit && !unit.defeated);
                  const isCurrentSel = Boolean(
                    alive && selectedUnit && unit && selectedUnit.id === unit.id
                  );
                  const isKing = Boolean(unit?.isKing);
                  const sp = unit ? getSpecies(unit.speciesId) : null;
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={!alive}
                      onClick={() => {
                        if (
                          alive &&
                          unit &&
                          (!match.hasMovedThisTurn ||
                            match.movedUnitId === unit.id)
                        ) {
                          soundFX.playSelect();
                          triggerHaptic(10);
                          setMatch((prev) => ({
                            ...prev,
                            selectedUnitId: unit.id,
                          }));
                          setActionMode('move_or_attack');
                        }
                      }}
                      title={`${unit?.name || 'Empty'} ${
                        alive
                          ? `(${unit?.hp}/${unit?.maxHp} HP · ⚡${unit?.specialUses ?? 0}/3)`
                          : '(KO)'
                      }${isKing ? ' [KING]' : ''}`}
                      aria-label={`Player Slot ${idx + 1}: ${unit?.name || 'Empty'}`}
                      className={`arcade-press relative w-6 h-6 sm:w-7 sm:h-7 rounded-md border flex items-center justify-center cursor-pointer transition-all ${
                        !alive
                          ? 'bg-[#161916]/70 border-[#3A3D38] opacity-40 cursor-not-allowed'
                          : isCurrentSel
                            ? 'bg-[#2C3E34] border-2 border-[#FFB838] ring-1 ring-[#FFB838]/60 scale-105'
                            : 'bg-[#1D2822]/90 border-[#52E59B]/70 hover:border-[#FFB838]'
                      }`}
                    >
                      {sp && alive ? (
                        <InsectPortraitSVG
                          species={sp}
                          isKing={isKing}
                          className="w-5 h-5"
                        />
                      ) : (
                        <span className="font-stone-serif text-[8px] font-bold text-[#7897A1]">
                          KO
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TOP-CENTER: Compact Semicircular Sanctuary Slate Arch Medallion + Turn Ribbon */}
            <div className="order-1 sm:order-2 w-full sm:w-auto flex flex-col items-center pointer-events-auto">
              <div className="sanctuary-arch-medallion relative px-5 sm:px-8 pt-1 sm:pt-1.5 pb-2.5 sm:pb-3 flex items-center justify-center min-w-[180px] sm:min-w-[240px]">
                {/* Center Engraved Title (Runic Sidebar Noise Removed) */}
                <div className="text-center">
                  <div className="font-stone-serif text-sm sm:text-xl font-extrabold tracking-[0.14em] text-[#F4F9F5] drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)] leading-tight">
                    INSECTRON
                  </div>
                </div>
              </div>

              {/* Compact Turn Ribbon Overlapping Arch Base */}
              <div className="sanctuary-turn-ribbon -mt-2.5 z-10 px-3.5 sm:px-4 py-0.5 flex items-center justify-center gap-1.5">
                <span className="text-[8px] text-[#FFB838]">●</span>
                <span className="font-stone-serif text-[10px] sm:text-xs font-extrabold tracking-[0.08em] text-[#F4F9F5] uppercase">
                  TURN {match.turnNumber} •{' '}
                </span>
                <span
                  data-testid="turn-banner"
                  className={`font-stone-serif text-[10px] sm:text-xs font-extrabold tracking-[0.08em] uppercase ${
                    match.turn === 'player' || isPostActionHold
                      ? 'text-[#5CE6A0]'
                      : 'text-[#FF8E72]'
                  }`}
                >
                  {isPostActionHold
                    ? 'RESOLVING'
                    : match.turn === 'player'
                      ? "PLAYER'S TURN"
                      : "RIVAL'S TURN"}
                </span>
              </div>
            </div>

            {/* TOP-RIGHT: JIN RED Terracotta Faction Banner + Rival Unit Slots + Unified Utility Dock */}
            <div className="order-3 sm:order-3 flex flex-col items-end gap-1 sm:gap-1.5 pt-1 sm:pt-2 pointer-events-auto">
              {/* Terracotta-Coral Rival Faction Banner (JIN RED) with Circular Red Crown Medallion */}
              <div className="relative flex items-center">
                <div className="faction-banner-rival -mr-2.5 pl-3 pr-3.5 sm:pl-4 sm:pr-4 py-1 min-w-[115px] sm:min-w-[155px] flex items-center justify-between gap-2">
                  <span className="text-[10px] font-num font-bold text-[#FFD9CF]">
                    {enemyAliveCount}/5
                  </span>
                  <span className="font-stone-serif text-xs sm:text-base font-extrabold tracking-wider text-[#F4F9F5] uppercase">
                    {match.enemyName}
                  </span>
                </div>
                <div className="z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-b from-[#F07D67] to-[#9E3827] border-2 border-[#3D5C6B] shadow-[0_3px_8px_rgba(0,0,0,0.65),inset_0_1.5px_0_rgba(255,255,255,0.4)] flex items-center justify-center shrink-0">
                  <KingCrownSVG className="w-3.5 h-3.5 sm:w-4 sm:h-4 drop-shadow" />
                </div>
              </div>

              {/* Compact 5-Rival Unit Target Selector Pills + Unified System Utility Dock */}
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-end gap-1.5 sm:gap-2 pr-0.5 max-w-[170px] sm:max-w-none">
                <div className="flex items-center gap-1">
                  {enemySlots.map((unit, idx) => {
                    const alive = Boolean(unit && !unit.defeated);
                    const isCurrentTarget = Boolean(
                      alive && targetedUnit && unit && targetedUnit.id === unit.id
                    );
                    const isKing = Boolean(unit?.isKing);
                    const sp = unit ? getSpecies(unit.speciesId) : null;
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={!alive}
                        onClick={() => {
                          if (alive && unit) {
                            soundFX.playSelect();
                            triggerHaptic(10);
                            setMatch((prev) => ({
                              ...prev,
                              targetedUnitId: unit.id,
                            }));
                          }
                        }}
                        title={`${unit?.name || 'Empty'} ${
                          alive
                            ? `(${unit?.hp}/${unit?.maxHp} HP · ⚡${unit?.specialUses ?? 0}/3)`
                            : '(KO)'
                        }${isKing ? ' [KING]' : ''}`}
                        aria-label={`Enemy Slot ${idx + 1}: ${unit?.name || 'Empty'}`}
                        className={`arcade-press relative w-6 h-6 sm:w-7 sm:h-7 rounded-md border flex items-center justify-center cursor-pointer transition-all ${
                          !alive
                            ? 'bg-[#121E24]/70 border-[#2E4957] opacity-40 cursor-not-allowed'
                            : isCurrentTarget
                              ? 'bg-[#3D2522] border-2 border-[#FFB838] ring-1 ring-[#FFB838]/60 scale-105'
                              : 'bg-[#2B1D1B]/90 border-[#FF6E4A]/70 hover:border-[#FFB838]'
                        }`}
                      >
                        {sp && alive ? (
                          <InsectPortraitSVG
                            species={sp}
                            isKing={isKing}
                            className="w-5 h-5"
                          />
                        ) : (
                          <span className="font-stone-serif text-[8px] font-bold text-[#7897A1]">
                            KO
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Unified System Utility Dock (Guide, Settings, Pause) */}
                <div className="flex items-center gap-1 bg-[#1B2C35]/95 border border-[#3D5C6B] p-0.5 rounded-lg shadow-md">
                  <button
                    type="button"
                    aria-label="How to Play"
                    onClick={() => {
                      soundFX.playSelect();
                      setIsHowToPlayOpen(true);
                    }}
                    className="arcade-press w-7 h-6 rounded-md bg-[#243B47] hover:bg-[#2E4A58] border border-[#436778] text-[#F4F9F5] hover:text-[#FFB838] font-arcade text-[10px] font-bold flex items-center justify-center cursor-pointer"
                    title="How to Play"
                  >
                    ?
                  </button>
                  <button
                    type="button"
                    aria-label="Settings & Accessibility"
                    onClick={() => {
                      soundFX.playSelect();
                      setIsSettingsOpen(true);
                    }}
                    className="arcade-press w-7 h-6 rounded-md bg-[#243B47] hover:bg-[#2E4A58] border border-[#436778] text-[#F4F9F5] hover:text-[#FFB838] font-arcade text-[10px] font-bold flex items-center justify-center cursor-pointer"
                    title="Settings"
                  >
                    ⚙
                  </button>
                  <button
                    type="button"
                    aria-label="Pause Game [P]"
                    onClick={(e) => {
                      e.currentTarget.blur();
                      setShellState('paused');
                    }}
                    className="arcade-press w-7 h-6 rounded-md bg-[#243B47] hover:bg-[#2E4A58] border border-[#436778] text-[#F4F9F5] hover:text-[#FFB838] font-arcade text-[10px] font-bold flex items-center justify-center cursor-pointer"
                    title="Pause Game [P]"
                  >
                    II
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM DOCK (Proportional for Desktop — Zero Board Overlap) */}
          <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-1.5 pointer-events-none">
            {/* [F-01] King Danger Warning Banner when King is <50% HP or threatened */}
            {kingDanger.inDanger && (
              <div
                data-testid="king-danger-warning"
                role="status"
                className="pointer-events-auto self-start px-3 py-1 rounded-lg bg-[#2E1715]/95 border border-[#FF6E4A] text-[#F4F9F5] flex items-center gap-2 text-xs font-bold shadow-lg"
              >
                <span className="px-1.5 py-0.5 rounded bg-[#FF6E4A] text-[#121E24] font-stone-serif text-[9px] font-extrabold uppercase">
                  ⚠️ KING DANGER
                </span>
                <span>{kingDanger.reason}</span>
              </div>
            )}

            {/* HIGH-CONTRAST FLOATING COMBAT LOG PILL (WCAG 2.2 AA Compliant over 3D Foliage) */}
            {recentLogPair.length > 0 && (
              <div className="pointer-events-auto self-start w-[280px] sm:w-[310px] rounded-lg bg-[#121E24]/95 backdrop-blur-md border border-[#3D5C6B] px-3 py-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.75)]">
                <div className="space-y-0.5 text-[11px] leading-snug text-[#F4F9F5] font-medium">
                  {recentLogPair.slice(-1).map((entry, idx) => (
                    <div key={idx} className="truncate">
                      {renderFactionLogText(entry, idx)}
                    </div>
                  ))}
                </div>
                {isCombatLogOpen && match.combatLog.length > 1 && (
                  <div className="mt-1.5 pt-1.5 border-t border-[#2E4957] max-h-20 overflow-y-auto space-y-0.5 text-[10px] text-[#B2C8CE]">
                    {match.combatLog.slice(1).map((entry, idx) => (
                      <div key={idx} className="truncate">
                        • {renderFactionLogText(entry, 1)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Hidden accessibility target readouts so automated tests can always query targeted enemy */}
            <div className="sr-only">
              <span data-testid="targeted-enemy-bug-name">
                {targetedUnit ? targetedUnit.name : 'NONE'}
              </span>
              <span data-testid="targeted-enemy-bug-hp">
                {targetedUnit
                  ? `${targetedUnit.hp}/${targetedUnit.maxHp} HP`
                  : '0/0 HP'}
              </span>
            </div>

            {/* MAIN BOTTOM HUD ROW: Left Slate Unit Inspector | Center Balanced Command Dock | Right Squad [Q], 3D/2D & Slate Compass */}
            <div className="w-full flex flex-col lg:flex-row items-stretch lg:items-end justify-between gap-2.5 pointer-events-auto">
              {/* 1. BOTTOM-LEFT: SANCTUARY SLATE UNIT INSPECTOR CARD (Clipart Vine Removed, High Contrast Typography) */}
              <div className="parchment-unit-card relative p-2.5 flex items-center gap-3 w-full lg:w-[310px] shrink-0">
                {/* Left Square Illustrated Portrait Box */}
                <div className="bug-portrait-box !w-[64px] !h-[64px] sm:!w-[68px] sm:!h-[68px] !rounded-xl shrink-0 overflow-hidden">
                  <InsectPortraitSVG
                    species={selectedSpecies}
                    isKing={selectedUnit?.isKing}
                    className="w-[54px] h-[54px] sm:w-[58px] sm:h-[58px]"
                  />
                </div>

                {/* Right High-Contrast Sanctuary Slate Inset */}
                <div className="parchment-scroll-inner flex-1 px-3 py-2 flex flex-col justify-center min-w-0">
                  <div className="flex items-baseline justify-between gap-1">
                    <div className="truncate flex items-center gap-1.5">
                      <span
                        data-testid="selected-player-bug-name"
                        className="font-arcade text-xs sm:text-sm font-extrabold text-[#F4F9F5] tracking-wide uppercase truncate"
                      >
                        {selectedUnit ? selectedUnit.name : 'NONE'}
                      </span>
                      {selectedUnit?.isKing && (
                        <span className="font-arcade text-[10px] font-bold text-[#FFB838] shrink-0">
                          (King)
                        </span>
                      )}
                    </div>
                    <span
                      data-testid="selected-player-bug-hp"
                      className="font-num text-[11px] font-extrabold text-[#5CE6A0] shrink-0"
                    >
                      {selectedUnit
                        ? `${selectedUnit.hp}/${selectedUnit.maxHp}`
                        : '0/0'}
                    </span>
                  </div>

                  {/* Row 1: Red Heart Icon + Leaf-Green HP Bar */}
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-3.5 h-3.5 shrink-0 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]"
                    >
                      <path
                        d="M12 21s-7-4.5-9.5-9C.5 8 3 4 7 4c2.3 0 4 1.3 5 3 1-1.7 2.7-3 5-3 4 0 6.5 4 4.5 8-2.5 4.5-9.5 9-9.5 9z"
                        fill="#F05A46"
                        stroke="#0D171C"
                        strokeWidth="2"
                      />
                    </svg>
                    <div className="flex-1 h-3 rounded bg-[#0F191E] border border-[#2E4957] p-0.5 shadow-inner overflow-hidden">
                      <div
                        className="h-full rounded-xs bg-gradient-to-b from-[#79F2B5] to-[#3B9464] transition-all duration-200"
                        style={{ width: `${playerHpPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Row 2: Skill Charges (Max 3) */}
                  <div className="mt-1.5 flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-arcade text-[10px] font-extrabold text-[#FFB838] uppercase">
                        ⚡ CHARGE
                      </span>
                      <div className="flex items-center gap-1">
                        {[0, 1, 2].map((pipIdx) => {
                          const curCharges = Math.max(
                            0,
                            Math.min(3, selectedUnit?.specialUses ?? 0)
                          );
                          const filled = pipIdx < curCharges;
                          return (
                            <span
                              key={pipIdx}
                              className={`w-2.5 h-2.5 rounded-full border ${
                                filled
                                  ? 'bg-[#FFB838] border-[#FFE5A3] shadow-[0_0_4px_rgba(255,184,56,0.8)]'
                                  : 'bg-[#0F191E] border-[#3D5C6B]'
                              }`}
                            />
                          );
                        })}
                      </div>
                    </div>
                    <span className="font-num text-[10px] font-extrabold text-[#B2C8CE]">
                      {Math.max(0, Math.min(3, selectedUnit?.specialUses ?? 0))}/3
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. BOTTOM-CENTER: BALANCED 8PT COMMAND DOCK (ATTACK | SIGNATURE | END TURN — Equal 68px Height) */}
              <div className="flex items-center justify-center gap-2 p-2 rounded-2xl bg-[#16262E]/95 backdrop-blur-md border-2 border-[#3D5C6B] shadow-[0_8px_24px_rgba(0,0,0,0.75)]">
                {/* Button 1: ATTACK */}
                <button
                  type="button"
                  data-testid="action-attack-btn"
                  disabled={!canAttackNow}
                  onMouseEnter={() => setHoveredActionButton('attack')}
                  onMouseLeave={() => setHoveredActionButton(null)}
                  onClick={handleTriggerAttackButton}
                  className={`arcade-press stone-tablet-btn w-[100px] sm:w-[112px] h-[66px] sm:h-[68px] px-2 py-1.5 flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    canAttackNow
                      ? '!border-[#F05A46] hover:brightness-110'
                      : 'opacity-65'
                  }`}
                >
                  <svg
                    viewBox="0 0 36 36"
                    className="w-5 h-5 drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)]"
                  >
                    <path
                      d="M28 5L31 8L16 23L13 20L28 5Z"
                      fill="#FFB838"
                      stroke="#0D171C"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M10 17L19 26L17 28L8 19L10 17Z"
                      fill="#F05A46"
                      stroke="#0D171C"
                      strokeWidth="1.6"
                    />
                    <path
                      d="M7 24L12 29L8 32L5 29L7 24Z"
                      fill="#B2C8CE"
                      stroke="#0D171C"
                      strokeWidth="1.6"
                    />
                  </svg>
                  <span className="font-stone-serif text-xs font-extrabold tracking-wider text-[#F4F9F5] uppercase">
                    ATTACK
                  </span>
                </button>

                {/* Button 2: SIGNATURE MOVE (Balanced Equal Height with Inline Emblem & Charge Badge) */}
                <button
                  type="button"
                  data-testid="action-special-btn"
                  disabled={!canUseSpecialNow}
                  onMouseEnter={() => setHoveredActionButton('special')}
                  onMouseLeave={() => setHoveredActionButton(null)}
                  onClick={handleTriggerSpecialButton}
                  className={`arcade-press stone-tablet-special relative w-[132px] sm:w-[148px] h-[66px] sm:h-[68px] px-2.5 py-1.5 flex flex-col items-center justify-between cursor-pointer ${
                    !canUseSpecialNow ? 'opacity-60' : 'hover:brightness-110'
                  }`}
                >
                  {/* Top Row: Inline Star Emblem + Charge Counter ("⚡3/3") */}
                  <div className="w-full flex items-center justify-between px-0.5">
                    <span className="text-[11px] font-extrabold text-[#FFB838] leading-none">
                      ★ SPECIAL
                    </span>
                    <span className="font-num text-[10px] sm:text-[11px] font-extrabold text-[#FFE5A3] leading-none">
                      ⚡{Math.max(0, Math.min(3, selectedUnit?.specialUses ?? 0))}/3
                    </span>
                  </div>

                  {/* Signature Move Title */}
                  <span className="font-stone-serif text-[11px] sm:text-xs font-extrabold tracking-wide text-[#F4F9F5] uppercase text-center leading-tight">
                    {selectedSpecies.specialMove.name}
                  </span>
                </button>

                {/* Button 3: END TURN (with UNDO MOVE [Z] pill above when moved) */}
                <div className="relative flex flex-col items-center">
                  {match.turn === 'player' &&
                    match.hasMovedThisTurn &&
                    !isPostActionHold && (
                      <button
                        type="button"
                        data-testid="undo-move-btn"
                        onClick={handleUndoMove}
                        className="arcade-press absolute -top-8 w-full px-1.5 py-0.5 rounded-md bg-[#19302C] border border-[#5CE6A0] text-[#5CE6A0] font-stone-serif text-[9px] font-extrabold uppercase flex items-center justify-center gap-1 cursor-pointer shadow-md"
                      >
                        <span>↩ UNDO [Z]</span>
                      </button>
                    )}

                  <button
                    type="button"
                    data-testid="end-turn-btn"
                    disabled={match.turn !== 'player' || isPostActionHold}
                    onClick={handleStandbyTurn}
                    className={`arcade-press stone-tablet-btn w-[100px] sm:w-[112px] h-[66px] sm:h-[68px] px-2 py-1.5 flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      match.turn !== 'player' || isPostActionHold
                        ? 'opacity-60'
                        : 'hover:brightness-110'
                    }`}
                  >
                    <svg
                      viewBox="0 0 36 36"
                      className="w-5 h-5 drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)]"
                    >
                      <circle
                        cx="18"
                        cy="18"
                        r="11"
                        fill="none"
                        stroke="#3CE8FF"
                        strokeWidth="3.8"
                        strokeDasharray="12 5"
                      />
                    </svg>
                    <span className="font-stone-serif text-xs font-extrabold tracking-wider text-[#F4F9F5] uppercase">
                      END TURN
                    </span>
                  </button>
                </div>
              </div>

              {/* 3. BOTTOM-RIGHT: SQUAD [Q] + 3D/2D PILL + SANCTUARY SLATE COMPASS ROSE */}
              <div className="flex items-end justify-end gap-2 shrink-0">
                <button
                  type="button"
                  data-testid="top-squad-edit-btn"
                  disabled={!canEditSquadNow}
                  onClick={() => {
                    if (canEditSquadNow) {
                      soundFX.playSelect();
                      setShellState('select');
                    }
                  }}
                  title={
                    canEditSquadNow
                      ? 'Edit Squad & Formation (Turn 1 Only) [Q]'
                      : 'Squad Locked after Turn 1 starts'
                  }
                  className={`arcade-press stone-tablet-btn px-3.5 h-[46px] flex items-center justify-center cursor-pointer ${
                    !canEditSquadNow ? 'opacity-55 cursor-not-allowed' : ''
                  }`}
                >
                  <span className="font-stone-serif text-xs font-extrabold tracking-wider text-[#F4F9F5] uppercase">
                    SQUAD [Q]
                  </span>
                </button>

                <div className="flex flex-col items-center gap-1.5">
                  <button
                    type="button"
                    data-testid="camera-mode-toggle-btn"
                    aria-label="Toggle 3D Tactical and 2D Top-Down Camera [C]"
                    onClick={(e) => {
                      e.currentTarget.blur();
                      soundFX.playSelect();
                      setCameraMode((prev) =>
                        prev === 'topdown' ? 'tactical' : 'topdown'
                      );
                    }}
                    className="arcade-press stone-pill-btn px-3 py-1 font-stone-serif text-[10px] font-extrabold tracking-wider text-[#F4F9F5] uppercase cursor-pointer"
                  >
                    3D / 2D
                  </button>

                  {/* Harmonized Sanctuary Slate & Bio-Crystal Compass Rose */}
                  <button
                    type="button"
                    onClick={handleCycleCompassCamera}
                    title="Click Compass Rose to rotate 3D Bio-Dome camera angle"
                    aria-label="Compass Rose Camera Angle Selector"
                    className="arcade-press relative w-[64px] h-[64px] sm:w-[68px] sm:h-[68px] rounded-full bg-gradient-to-b from-[#2A4452] to-[#1B2C35] border-2 border-[#436778] hover:border-[#FFB838] shadow-[0_6px_14px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <div className="w-[48px] h-[48px] sm:w-[52px] sm:h-[52px] rounded-full bg-gradient-to-b from-[#16262E] to-[#0F191E] border border-[#2E4957] shadow-inner relative flex items-center justify-center">
                      <span className="absolute top-0.5 font-arcade text-[8px] font-extrabold text-[#FFB838]">
                        N
                      </span>
                      <span className="absolute bottom-0.5 font-arcade text-[8px] font-extrabold text-[#74929B]">
                        S
                      </span>
                      <span className="absolute left-1 font-arcade text-[8px] font-extrabold text-[#74929B]">
                        W
                      </span>
                      <span className="absolute right-1 font-arcade text-[8px] font-extrabold text-[#74929B]">
                        E
                      </span>

                      <div
                        className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${compassNeedleRotation}`}
                      >
                        <svg
                          viewBox="0 0 60 60"
                          className="w-8 h-8 drop-shadow-[0_1px_2px_rgba(0,0,0,0.65)]"
                        >
                          <polygon
                            points="30,10 34,30 26,30"
                            fill="#F05A46"
                            stroke="#0D171C"
                            strokeWidth="1.4"
                          />
                          <polygon
                            points="30,50 34,30 26,30"
                            fill="#3CE8FF"
                            stroke="#0D171C"
                            strokeWidth="1.4"
                          />
                          <circle
                            cx="30"
                            cy="30"
                            r="3"
                            fill="#FFB838"
                            stroke="#0D171C"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          3. MAIN MENU (Clean Desktop Proportions — Compact Left Card + 3D Right Arena)
          ==================================================================== */}
      {shellState === 'title' && (
        <div className="fixed inset-0 z-30 flex flex-col justify-between p-4 sm:p-6 pointer-events-none">
          {/* Top-Right Utility Bar Only (No redundant top-left title badge) */}
          <div className="w-full max-w-[1360px] mx-auto flex items-center justify-end gap-2 pointer-events-auto">
            <button
              type="button"
              onClick={() => {
                soundFX.playSelect();
                setIsHowToPlayOpen(true);
              }}
              className="arcade-press stone-pill-btn px-3.5 py-1.5 font-stone-serif text-xs font-bold uppercase cursor-pointer"
            >
              How to Play
            </button>
            <button
              type="button"
              onClick={() => {
                soundFX.playSelect();
                setIsSettingsOpen(true);
              }}
              className="arcade-press stone-pill-btn px-3.5 py-1.5 font-stone-serif text-xs font-bold uppercase cursor-pointer"
            >
              Settings
            </button>
          </div>

          {/* Left-Docked Compact Sanctuary Card (Proportioned for Computer View — Does Not Cover 3D Board!) */}
          <div className="w-full max-w-[1360px] mx-auto my-auto flex items-center">
            <div className="sanctuary-panel w-full max-w-[320px] p-4 sm:p-5 pointer-events-auto shadow-[0_14px_32px_rgba(0,0,0,0.75)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#121E24] border-2 border-[#FFB838] flex items-center justify-center shrink-0">
                  <KingCrownSVG className="w-6 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-arcade font-bold uppercase tracking-widest text-[#52E59B]">
                    3D BIO-DOME TACTICS
                  </div>
                  <h1 className="font-stone-serif text-3xl font-extrabold tracking-wider text-[#F4F9F5] leading-none">
                    INSECTRON
                  </h1>
                </div>
              </div>

              {/* Concise Action Buttons */}
              <div className="mt-5 flex flex-col gap-2.5">
                <button
                  type="button"
                  data-testid="menu-select-insects-btn"
                  onClick={() => {
                    soundFX.playSelect();
                    triggerHaptic(18);
                    setShellState('select');
                  }}
                  className="btn-tactile btn-tactile--gold w-full py-3 font-arcade text-base font-extrabold tracking-wider uppercase cursor-pointer text-center"
                >
                  BUILD YOUR SQUAD ▶
                </button>

                <button
                  type="button"
                  data-start="true"
                  onClick={() => handleStartFreshMatch()}
                  className="btn-tactile btn-tactile--stone w-full py-2.5 font-arcade text-sm font-extrabold uppercase cursor-pointer text-center text-[#52E59B]"
                >
                  QUICK BATTLE
                </button>
              </div>

              {/* Compact Rival Rank Selector */}
              <div className="mt-4 pt-3 border-t border-[#2A4350]">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs">
                    <span className="text-[#B2C8CE] font-semibold">RIVAL: </span>
                    <strong className="font-arcade text-[#FFB838] uppercase">
                      RANK {opponentRank} · {OPPONENT_TIER_CONFIG[opponentRank].enemyName}
                    </strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playSelect();
                      setIsMenuRankOpen((prev) => !prev);
                    }}
                    className="arcade-press px-2.5 py-0.5 rounded bg-[#243B47] hover:bg-[#2E4A58] border border-[#3D5C6B] font-arcade text-[11px] font-bold text-[#F4F9F5] uppercase cursor-pointer"
                  >
                    {isMenuRankOpen ? 'Done' : 'Change'}
                  </button>
                </div>

                {isMenuRankOpen && (
                  <div className="mt-2 grid grid-cols-3 gap-1.5">
                    {(['B', 'A', 'S'] as const).map((r) => {
                      const cfg = OPPONENT_TIER_CONFIG[r];
                      const active = opponentRank === r;
                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() => {
                            soundFX.playSelect();
                            triggerHaptic(12);
                            setOpponentRank(r);
                            setMatch(
                              createMatchFromSquad(playerSquad, r, 'Jaster')
                            );
                            setIsMenuRankOpen(false);
                          }}
                          className={`arcade-press p-1.5 rounded-lg border text-left cursor-pointer ${
                            active
                              ? 'bg-[#FFB838] border-[#F4F9F5] text-[#122128]'
                              : 'bg-[#121E24] border-[#3D5C6B] text-[#F4F9F5] hover:border-[#3CE8FF]'
                          }`}
                        >
                          <div className="font-arcade text-[11px] font-extrabold uppercase">
                            RANK {r}
                          </div>
                          <div
                            className={`text-[10px] font-bold truncate ${
                              active ? 'text-[#122128]' : 'text-[#FFB838]'
                            }`}
                          >
                            {cfg.enemyName}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div />
        </div>
      )}

      {/* ====================================================================
          4. SQUAD SELECTION & BIO-DOME FORMATION ('select')
          ==================================================================== */}
      <SquadBuilderModal
        isOpen={shellState === 'select'}
        currentPlayerUnits={playerSquad}
        opponentRank={opponentRank}
        onChangeOpponentRank={(r) => setOpponentRank(r)}
        onClose={() => setShellState('title')}
        onDeploySquad={(newSquad, rank) => {
          handleStartFreshMatch(newSquad, rank);
        }}
      />

      {/* ====================================================================
          5. HOW TO PLAY MODAL (Accessible from Menu & Battle HUD)
          ==================================================================== */}
      {isHowToPlayOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#171923]/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="How to Play Insectron"
        >
          <div className="neo-panel w-full max-w-xl p-6 bg-[#252A38] text-[#F4E8C8]">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#464D63]">
              <h2 className="font-arcade text-2xl font-extrabold uppercase text-[#FFB547]">
                HOW TO PLAY INSECTRON
              </h2>
              <button
                type="button"
                onClick={() => setIsHowToPlayOpen(false)}
                className="arcade-press px-3 py-1 neo-btn-secondary font-arcade text-xs font-bold uppercase cursor-pointer"
              >
                Close [Esc]
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm leading-relaxed">
              <div className="p-3 rounded bg-[#171923] border border-[#464D63]">
                <h3 className="font-arcade text-sm font-extrabold uppercase text-[#83D6B0]">
                  1. WIN CONDITION: PROTECT YOUR KING, DEFEAT RIVAL KING
                </h3>
                <p className="text-xs text-[#F4E8C8] mt-1">
                  One bug in each 5-unit squad wears the <strong>👑 King Crown</strong>. You win immediately when you reduce the Rival King&apos;s HP to 0 OR knock the Rival King off the 5×6 Bio-Dome edge (<strong>Instant Ring-Out!</strong>).
                </p>
              </div>

              <div className="p-3 rounded bg-[#171923] border border-[#464D63]">
                <h3 className="font-arcade text-sm font-extrabold uppercase text-[#FFB547]">
                  2. TURN LOOP: SELECT → MOVE → ATTACK OR SIGNATURE MOVE
                </h3>
                <p className="text-xs text-[#F4E8C8] mt-1">
                  On your turn, select one of your living units. Click a <strong className="text-[#83D6B0]">Mint Tile</strong> to move, then trigger <strong>⚔ Attack</strong> or your unit&apos;s <strong>★ Signature Move</strong> against an enemy on a <strong className="text-[#EF7168]">Coral/Amber Tile</strong>.
                </p>
              </div>

              <div className="p-3 rounded bg-[#171923] border border-[#464D63]">
                <h3 className="font-arcade text-sm font-extrabold uppercase text-[#EF7168]">
                  3. KNOCKBACK &amp; SIGNATURE CHARGES
                </h3>
                <p className="text-xs text-[#F4E8C8] mt-1">
                  Heavy beetles have a high <strong>Knockback %</strong> that pushes enemies backward. Each bug also has limited <strong>Signature Charges</strong> (usually 3 per match) for high-impact 3D special moves like <em>Crushing Horn</em>, <em>Scissor Throw</em>, or <em>Charm Beam</em>.
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setIsHowToPlayOpen(false)}
                className="arcade-press px-5 py-2 neo-btn-amber font-arcade text-sm font-extrabold uppercase cursor-pointer"
              >
                Got It ▶
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          6. SETTINGS & ACCESSIBILITY MODAL (Audio, Screen Shake, Particles)
          ==================================================================== */}
      {isSettingsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#171923]/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Game Settings"
        >
          <div className="neo-panel w-full max-w-md p-6 bg-[#252A38] text-[#F4E8C8]">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#464D63]">
              <h2 className="font-arcade text-2xl font-extrabold uppercase text-[#FFB547]">
                SETTINGS &amp; ACCESSIBILITY
              </h2>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="arcade-press px-3 py-1 neo-btn-secondary font-arcade text-xs font-bold uppercase cursor-pointer"
              >
                Close [Esc]
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3 rounded bg-[#171923] border border-[#464D63] flex items-center justify-between">
                <div>
                  <div className="font-arcade text-sm font-extrabold uppercase">
                    Sound Effects [M]
                  </div>
                  <div className="text-xs text-[#B7B7AD]">
                    Arcade selection, hit impact, and victory audio cues
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    soundFX.muted = !soundFX.muted;
                    setIsMuted(soundFX.muted);
                  }}
                  className={`arcade-press px-3.5 py-1.5 font-arcade text-xs font-extrabold uppercase cursor-pointer ${
                    !isMuted ? 'neo-btn-mint' : 'neo-btn-secondary'
                  }`}
                >
                  {!isMuted ? 'ON' : 'MUTED'}
                </button>
              </div>

              <div className="p-3 rounded bg-[#171923] border border-[#464D63] flex items-center justify-between">
                <div>
                  <div className="font-arcade text-sm font-extrabold uppercase">
                    Screen Shake
                  </div>
                  <div className="text-xs text-[#B7B7AD]">
                    Camera impact shake on heavy hits and Ring-Outs
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEnableScreenShake((prev) => !prev)}
                  className={`arcade-press px-3.5 py-1.5 font-arcade text-xs font-extrabold uppercase cursor-pointer ${
                    enableScreenShake ? 'neo-btn-mint' : 'neo-btn-secondary'
                  }`}
                >
                  {enableScreenShake ? 'ON' : 'OFF'}
                </button>
              </div>

              <div className="p-3 rounded bg-[#171923] border border-[#464D63] flex items-center justify-between">
                <div>
                  <div className="font-arcade text-sm font-extrabold uppercase">
                    Bio-Dome Ambient Particles
                  </div>
                  <div className="text-xs text-[#B7B7AD]">
                    Floating dust motes around the 3D arena
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEnableParticles((prev) => !prev)}
                  className={`arcade-press px-3.5 py-1.5 font-arcade text-xs font-extrabold uppercase cursor-pointer ${
                    enableParticles ? 'neo-btn-mint' : 'neo-btn-secondary'
                  }`}
                >
                  {enableParticles ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="arcade-press px-5 py-2 neo-btn-amber font-arcade text-sm font-extrabold uppercase cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          7. PAUSE / VICTORY / DEFEAT MODAL OVER 3D MVP ORBIT CAMERA
          ==================================================================== */}
      {(shellState === 'paused' || shellState === 'gameover') && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-[#171923]/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={
            shellState === 'paused'
              ? 'Game Paused'
              : match.winner === 'player'
                ? 'Victory Summary'
                : 'Defeat Summary'
          }
        >
          <div className="neo-panel w-full max-w-md p-6 bg-[#252A38] text-center border-2 border-[#FFB547]">
            {shellState === 'gameover' && (
              <span
                className={`inline-block px-3 py-0.5 rounded font-arcade text-xs font-extrabold uppercase tracking-wider mb-2 ${
                  match.winner === 'player'
                    ? 'bg-[#83D6B0] text-[#171923]'
                    : 'bg-[#EF7168] text-[#171923]'
                }`}
              >
                {match.winner === 'player'
                  ? '👑 MVP KING SPOTLIGHT'
                  : 'BIO-DOME MATCH OVER'}
              </span>
            )}
            <h2 className="font-arcade text-4xl sm:text-5xl font-extrabold tracking-wider uppercase text-[#FFB547] text-stroke-dark">
              {shellState === 'paused'
                ? 'MATCH PAUSED'
                : match.winner === 'player'
                  ? 'VICTORY!'
                  : 'DEFEAT'}
            </h2>
            <p className="mt-1.5 text-sm text-[#F4E8C8] font-medium">
              {shellState === 'paused'
                ? `${match.playerName} vs ${match.enemyName} · Turn ${match.turnNumber}`
                : match.winReason}
            </p>

            <div className="mt-5 grid grid-cols-3 gap-2.5 font-num">
              <div className="p-2.5 rounded bg-[#171923] border border-[#464D63]">
                <span className="text-[10px] text-[#B7B7AD] font-bold block">
                  TURNS
                </span>
                <span className="text-lg font-extrabold text-[#F4E8C8]">
                  {match.turnNumber}
                </span>
              </div>
              <div className="p-2.5 rounded bg-[#171923] border border-[#464D63]">
                <span className="text-[10px] text-[#B7B7AD] font-bold block">
                  RING-OUTS
                </span>
                <span className="text-lg font-extrabold text-[#FFB547]">
                  {match.stats.playerRingOuts}
                </span>
              </div>
              <div className="p-2.5 rounded bg-[#171923] border border-[#464D63]">
                <span className="text-[10px] text-[#B7B7AD] font-bold block">
                  DAMAGE DEALT
                </span>
                <span className="text-lg font-extrabold text-[#83D6B0]">
                  {match.stats.damageDealt}
                </span>
              </div>
            </div>

            {/* [F-01 & Section 9.2] Contextual Tactical Tip on DEFEAT */}
            {shellState === 'gameover' && match.winner === 'enemy' && (
              <div
                data-testid="defeat-tactical-tip"
                className="mt-4 p-3 rounded bg-[#171923] border-2 border-[#FFB547] text-left text-xs text-[#F4E8C8] leading-relaxed"
              >
                {getDefeatTacticalTip(match)}
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
              {shellState === 'paused' && (
                <button
                  type="button"
                  onClick={() => setShellState('playing')}
                  className="arcade-press px-4 py-2.5 neo-btn-mint font-arcade text-sm font-extrabold uppercase cursor-pointer whitespace-nowrap"
                >
                  Resume Match
                </button>
              )}
              <button
                type="button"
                data-start="true"
                onClick={() => handleStartFreshMatch()}
                className="arcade-press px-5 py-2.5 neo-btn-amber font-arcade text-sm font-extrabold uppercase cursor-pointer whitespace-nowrap"
              >
                Rematch (Turn 1)
              </button>
              <button
                type="button"
                onClick={() => setShellState('select')}
                className="arcade-press px-4 py-2.5 neo-btn-secondary font-arcade text-sm font-bold uppercase cursor-pointer whitespace-nowrap"
              >
                Build Squad
              </button>
              <button
                type="button"
                onClick={() => setShellState('title')}
                className="arcade-press px-4 py-2.5 neo-btn-secondary font-arcade text-sm font-bold uppercase cursor-pointer whitespace-nowrap"
              >
                Main Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
