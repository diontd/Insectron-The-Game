import React, { useMemo, useState } from 'react';
import {
  INSECTOR_SPECIES,
  InsectorSpecies,
  PresetUnitPlacement,
  SPECIES_MAP,
} from '../game/species';
import {
  MAX_SQUAD_POINTS,
  OPPONENT_TIER_CONFIG,
  TIER_POINT_COST,
  getSquadTotalPoints,
} from '../game/rules';
import {
  InsectPortraitSVG,
  KingCrownSVG,
  MovePatternMatrix,
} from './InsectIllustration';
import { soundFX } from '../utils/sound';

interface SquadBuilderModalProps {
  isOpen: boolean;
  currentPlayerUnits: PresetUnitPlacement[];
  opponentRank: 'B' | 'A' | 'S';
  onChangeOpponentRank: (rank: 'B' | 'A' | 'S') => void;
  onClose: () => void;
  onDeploySquad: (
    newPlayerUnits: PresetUnitPlacement[],
    rank: 'B' | 'A' | 'S'
  ) => void;
}

type CatalogFilter = 'all' | 'available' | 'assigned';

const DEFAULT_SLOT_COORDS: Array<{ col: number; row: number }> = [
  { col: 2, row: 5 }, // Slot 0 (King Backline Center)
  { col: 2, row: 4 }, // Slot 1 (Frontline Center)
  { col: 1, row: 4 }, // Slot 2 (Frontline Left)
  { col: 3, row: 4 }, // Slot 3 (Frontline Right)
  { col: 1, row: 5 }, // Slot 4 (Backline Flank)
];

const COL_LETTERS = ['A', 'B', 'C', 'D', 'E'] as const;

const triggerHaptic = (ms = 12) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate(ms);
    } catch {
      // Ignore on unsupported devices
    }
  }
};

export const SquadBuilderModal: React.FC<SquadBuilderModalProps> = ({
  isOpen,
  currentPlayerUnits,
  opponentRank,
  onChangeOpponentRank,
  onClose,
  onDeploySquad,
}) => {
  const [draftSlots, setDraftSlots] = useState<PresetUnitPlacement[]>(() =>
    currentPlayerUnits.slice(0, 5).map((u, idx) => ({
      slotIndex: idx,
      speciesId: u.speciesId,
      col:
        u.row >= 4 && u.row <= 5
          ? u.col
          : (DEFAULT_SLOT_COORDS[idx]?.col ?? idx),
      row:
        u.row >= 4 && u.row <= 5
          ? u.row
          : (DEFAULT_SLOT_COORDS[idx]?.row ?? 5),
      isKing: u.isKing,
    }))
  );
  const [activeSlotIdx, setActiveSlotIdx] = useState<number>(0);
  const [inspectedSpeciesId, setInspectedSpeciesId] = useState<string>(
    currentPlayerUnits[0]?.speciesId || INSECTOR_SPECIES[0].id
  );
  const [catalogFilter, setCatalogFilter] = useState<CatalogFilter>('all');
  const [isRankEditorOpen, setIsRankEditorOpen] = useState<boolean>(false);

  const filteredSpecies = useMemo(() => {
    return INSECTOR_SPECIES.filter((sp) => {
      const isAssigned = draftSlots.some((s) => s.speciesId === sp.id);
      if (catalogFilter === 'available') return !isAssigned;
      if (catalogFilter === 'assigned') return isAssigned;
      return true;
    });
  }, [catalogFilter, draftSlots]);

  if (!isOpen) return null;

  const inspectedSpecies: InsectorSpecies =
    SPECIES_MAP[inspectedSpeciesId] || INSECTOR_SPECIES[0];

  const kingSlot = draftSlots.find((s) => s.isKing) || draftSlots[0];
  const kingSpecies = kingSlot
    ? SPECIES_MAP[kingSlot.speciesId] || INSECTOR_SPECIES[0]
    : null;
  const hasKing = draftSlots.some((s) => s.isKing);
  const readyCount = draftSlots.length;
  const totalSquadPoints = getSquadTotalPoints(draftSlots);
  const isWithinPointCap = totalSquadPoints <= MAX_SQUAD_POINTS;
  const isReadyToBattle = hasKing && readyCount === 5 && isWithinPointCap;

  const handleAssignSpeciesToSlot = (speciesId: string, targetSlotIdx: number) => {
    soundFX.playSelect();
    triggerHaptic(14);
    setInspectedSpeciesId(speciesId);
    setDraftSlots((prev) => {
      const existingSlotIdx = prev.findIndex(
        (s, idx) => idx !== targetSlotIdx && s.speciesId === speciesId
      );
      const currentTargetSpecies = prev[targetSlotIdx]?.speciesId;
      return prev.map((slot, idx) => {
        if (idx === targetSlotIdx) {
          return { ...slot, speciesId, customName: undefined };
        }
        if (idx === existingSlotIdx && currentTargetSpecies) {
          return {
            ...slot,
            speciesId: currentTargetSpecies,
            customName: undefined,
          };
        }
        return slot;
      });
    });
  };

  const handleSetKingSlot = (kingIdx: number) => {
    soundFX.playSelect();
    triggerHaptic(18);
    setDraftSlots((prev) =>
      prev.map((slot, idx) => ({
        ...slot,
        isKing: idx === kingIdx,
      }))
    );
  };

  // Place active slot onto a specific deployment tile on Row 4 (FRONT) or Row 5 (BACK)
  const handlePlaceSlotOnTile = (col: number, row: number) => {
    soundFX.playMove();
    triggerHaptic(12);
    setDraftSlots((prev) => {
      const occupantIdx = prev.findIndex(
        (s, idx) => idx !== activeSlotIdx && s.col === col && s.row === row
      );
      const currentSlot = prev[activeSlotIdx];
      return prev.map((s, idx) => {
        if (idx === activeSlotIdx) {
          return { ...s, col, row };
        }
        if (idx === occupantIdx && currentSlot) {
          return { ...s, col: currentSlot.col, row: currentSlot.row };
        }
        return s;
      });
    });
  };

  const assignedCount = INSECTOR_SPECIES.filter((sp) =>
    draftSlots.some((s) => s.speciesId === sp.id)
  ).length;
  const availableCount = INSECTOR_SPECIES.length - assignedCount;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f191e]/92 p-2 sm:p-3"
      role="dialog"
      aria-modal="true"
      aria-label="Build Your Squad"
    >
      <div className="sanctuary-panel w-full max-w-[1140px] h-[95vh] max-h-[820px] lg:max-h-[768px] flex flex-col overflow-hidden bg-[#121E24] text-[#F4F9F5]">
        {/* ====================================================================
            HEADER: Title · Squad Readiness · Deployment Point Cap · Rank · Back
            ==================================================================== */}
        <div className="shrink-0 px-4 py-2 bg-[#1B2C35] border-b-2 border-[#3D5C6B] neo-pixel-trim flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="font-arcade text-lg sm:text-xl font-extrabold tracking-wider text-[#F4F9F5] uppercase">
              BUILD YOUR SQUAD
            </h2>
            <span
              data-testid="squad-point-cap-badge"
              title="Squad Deployment Cap: Tier S = 3 PT, Tier A = 2 PT, Tier B = 1 PT (Max 12 PTS)"
              className={`toy-pill px-2.5 py-0.5 text-xs font-num font-extrabold uppercase border-2 ${
                isWithinPointCap
                  ? 'bg-[#121E24] border-[#3D5C6B] text-[#52E59B]'
                  : 'bg-[#F05A46]/20 border-[#F05A46] text-[#F05A46]'
              }`}
            >
              COST: {totalSquadPoints} / {MAX_SQUAD_POINTS} PTS
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Single Source of Truth Rank Summary + Change Toggle */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#121E24] border-2 border-[#3D5C6B]">
              <span className="text-xs text-[#B2C8CE] font-semibold">
                CHALLENGE:
              </span>
              <span className="font-arcade text-xs sm:text-sm font-extrabold text-[#FFB838] uppercase">
                RANK {opponentRank} · {OPPONENT_TIER_CONFIG[opponentRank].enemyName}
              </span>
              <button
                type="button"
                onClick={() => {
                  soundFX.playSelect();
                  setIsRankEditorOpen((prev) => !prev);
                }}
                className="arcade-press ml-1 px-2 py-0.5 rounded-full bg-[#243B47] hover:bg-[#2E4A58] text-[#F4F9F5] text-[11px] font-bold border border-[#436778] cursor-pointer"
              >
                {isRankEditorOpen ? 'Done' : 'Change'}
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="btn-tactile btn-tactile--stone px-3 py-1 text-xs font-bold uppercase cursor-pointer whitespace-nowrap"
            >
              Back [Esc]
            </button>
          </div>
        </div>

        {/* Collapsible Challenger Rank Drawer (Only shown when user clicks "Change") */}
        {isRankEditorOpen && (
          <div className="shrink-0 px-4 py-1.5 bg-[#1B2C35] border-b-2 border-[#3D5C6B] flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#F4F9F5]">
              Select Challenger Rank (Changes Rival AI &amp; Opening Formation):
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {(['B', 'A', 'S'] as const).map((r) => {
                const cfg = OPPONENT_TIER_CONFIG[r];
                const selected = opponentRank === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      soundFX.playSelect();
                      triggerHaptic(12);
                      onChangeOpponentRank(r);
                      setIsRankEditorOpen(false);
                    }}
                    className={`arcade-press px-3 py-1 rounded-lg border-2 text-left cursor-pointer flex items-center gap-2 ${
                      selected
                        ? 'btn-tactile--gold font-extrabold'
                        : 'bg-[#121E24] border-[#3D5C6B] text-[#F4F9F5] hover:border-[#3CE8FF]'
                    }`}
                  >
                    <span className="font-arcade text-xs font-extrabold uppercase">
                      Rank {r}: {cfg.enemyName}
                    </span>
                    <span
                      className={`text-[11px] ${
                        selected ? 'text-[#122128]/80' : 'text-[#B2C8CE]'
                      }`}
                    >
                      ({r === 'B' ? 'Standard' : r === 'A' ? 'Tactical' : 'Master'})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ====================================================================
            MAIN 2-COLUMN BODY ([F-06] Linear Step 1 -> Step 2 on Left, Step 3 on Right, Zero Overlap on Mobile & Desktop)
            ==================================================================== */}
        <div className="flex-1 min-h-0 flex flex-col lg:grid lg:grid-cols-12 gap-2.5 p-2.5 overflow-y-auto lg:overflow-hidden bg-[#121E24]">
          {/* LEFT COLUMN (5 cols): Step 1 Squad Slots + Step 2 Formation + Compact Unit Inspector */}
          <div
            data-testid="squad-builder-left-col"
            className="lg:col-span-5 shrink-0 lg:shrink flex flex-col gap-2 lg:min-h-0 lg:overflow-hidden"
          >
            {/* STEP 1: SELECT SQUAD SLOT (1-5) */}
            <div className="sanctuary-panel p-2 shrink-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="toy-pill px-2 py-0.5 bg-[#FFB838] text-[#122128] text-[10px] font-extrabold">
                    STEP 1
                  </span>
                  <span className="font-arcade text-xs font-extrabold uppercase text-[#F4F9F5]">
                    SQUAD SLOTS (1–5)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-1.5">
                {draftSlots.map((slot, idx) => {
                  const sp = SPECIES_MAP[slot.speciesId] || INSECTOR_SPECIES[0];
                  const isEditing = activeSlotIdx === idx;
                  const rowLabel = slot.row === 4 ? 'FRONT' : 'BACK';
                  const colLetter = COL_LETTERS[slot.col] || 'C';

                  return (
                    <div
                      key={idx}
                      className={`relative rounded-[10px] p-1 flex flex-col items-center border-2 transition-all ${
                        isEditing
                          ? 'bg-[#243B47] border-[#FFB838] shadow-[0_0_12px_rgba(255,184,56,0.3)]'
                          : slot.isKing
                            ? 'neo-king-slot'
                            : 'bg-[#182830] border-[#3D5C6B] hover:border-[#3CE8FF]'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          soundFX.playSelect();
                          triggerHaptic(10);
                          setActiveSlotIdx(idx);
                          setInspectedSpeciesId(slot.speciesId);
                        }}
                        aria-label={`Select Squad Slot ${idx + 1}: ${sp.name}`}
                        className="w-full flex flex-col items-center cursor-pointer"
                      >
                        <div className="flex items-center justify-between w-full px-0.5 text-[9px] font-arcade font-bold text-[#B2C8CE]">
                          <span className={isEditing ? 'text-[#FFB838] font-extrabold' : ''}>
                            #{idx + 1}
                          </span>
                          <span className="text-[#52E59B]">
                            {rowLabel[0]}-{colLetter}
                          </span>
                        </div>

                        <div className="bug-portrait-box--sm my-0.5">
                          <InsectPortraitSVG
                            species={sp}
                            isKing={slot.isKing}
                            className="w-6 h-6"
                          />
                        </div>

                        <span className="text-[10px] font-arcade font-extrabold text-center line-clamp-2 min-h-[22px] flex items-center justify-center w-full text-[#F4F9F5] leading-[1.1]">
                          {sp.name}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSetKingSlot(idx)}
                        aria-label={`Make Slot ${idx + 1} King`}
                        className={`arcade-press toy-pill mt-1 w-full py-0.5 text-[9px] font-extrabold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                          slot.isKing
                            ? 'bg-[#FFB838] text-[#122128] border border-[#FFE5A3]'
                            : 'bg-[#121E24]/80 text-[#74929B] border border-[#2E4957] hover:border-[#FFB838] hover:text-[#FFB838]'
                        }`}
                      >
                        <KingCrownSVG className="w-2.5 h-2 shrink-0" />
                        <span>{slot.isKing ? 'KING' : 'Crown'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: SET ARENA FORMATION (FRONT / BACK ROWS + COLUMNS A-E) */}
            <div className="sanctuary-panel p-2 shrink-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="toy-pill px-2 py-0.5 bg-[#52E59B] text-[#122128] text-[10px] font-extrabold">
                    STEP 2
                  </span>
                  <span className="font-arcade text-xs font-extrabold uppercase text-[#F4F9F5]">
                    FORMATION (FRONT / BACK)
                  </span>
                </div>
              </div>

              {/* Column Headers A B C D E */}
              <div className="grid grid-cols-[52px_1fr] gap-1 items-center mb-0.5">
                <div />
                <div className="grid grid-cols-5 gap-1 text-center font-arcade text-[9px] font-bold text-[#B2C8CE]">
                  {COL_LETTERS.map((letter) => (
                    <span key={letter}>COL {letter}</span>
                  ))}
                </div>
              </div>

              {/* FRONT ROW (Row 4) & BACK ROW (Row 5) */}
              <div className="flex flex-col gap-1">
                {[
                  { row: 4, label: 'FRONT' },
                  { row: 5, label: 'BACK' },
                ].map(({ row, label }) => (
                  <div
                    key={row}
                    className="grid grid-cols-[52px_1fr] gap-1 items-center"
                  >
                    <div className="px-1 py-0.5 rounded bg-[#121E24] border border-[#3D5C6B] font-arcade text-[10px] font-extrabold text-center text-[#F4F9F5]">
                      {label}
                    </div>
                    <div className="grid grid-cols-5 gap-1">
                      {[0, 1, 2, 3, 4].map((col) => {
                        const slotIdx = draftSlots.findIndex(
                          (s) => s.col === col && s.row === row
                        );
                        const slot = slotIdx !== -1 ? draftSlots[slotIdx] : null;
                        const sp = slot ? SPECIES_MAP[slot.speciesId] : null;
                        const isActiveTile = slotIdx === activeSlotIdx;

                        return (
                          <button
                            key={`${col}-${row}`}
                            type="button"
                            onClick={() => handlePlaceSlotOnTile(col, row)}
                            aria-label={`${label} Column ${COL_LETTERS[col]}${
                              sp ? `: Assigned Slot #${slotIdx + 1} (${sp.name})` : ': Empty'
                            }`}
                            className={`arcade-press h-8 rounded-md border-2 text-xs font-arcade font-bold flex flex-col items-center justify-center px-1 cursor-pointer transition-all ${
                              isActiveTile
                                ? 'bg-[#243B47] border-[#FFB838] text-[#F4F9F5] shadow-[0_0_8px_rgba(255,184,56,0.28)]'
                                : slot
                                  ? 'bg-[#19302c] border-[#52E59B] text-[#52E59B]'
                                  : 'bg-[#121E24] border-[#2e4957] text-[#74929B] hover:border-[#3CE8FF]'
                            }`}
                          >
                            {sp ? (
                              <span className="text-[9.5px] font-extrabold leading-none text-[#F4F9F5] whitespace-nowrap text-center">
                                #{slotIdx + 1}
                                {slot?.isKing ? (
                                  ' 👑'
                                ) : (
                                  <span className="hidden sm:inline">
                                    {' '}
                                    {sp.name.split(' ')[0]}
                                  </span>
                                )}
                              </span>
                            ) : (
                              <span className="text-[9px] opacity-75">+ Place</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SELECTED UNIT INSPECTOR (100% visible with zero scrollbar at 1280x800 & 1366x768) */}
            <div className="sanctuary-panel p-2.5 flex-1 min-h-0 flex flex-col justify-between bg-[#1F3F37]/35">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Soft Mint-Sage Specimen Portrait Box */}
                    <div className="bug-portrait-box">
                      <InsectPortraitSVG
                        species={inspectedSpecies}
                        className="w-8 h-8"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="toy-pill px-2 py-0.2 bg-[#243B47] border border-[#436778] text-[9px] font-bold text-[#FFB838]">
                          TIER {inspectedSpecies.rank} ({TIER_POINT_COST[inspectedSpecies.rank]} PT)
                        </span>
                        <span className="text-[11px] text-[#A6E3C5] font-semibold">
                          {inspectedSpecies.role}
                        </span>
                      </div>
                      <h3 className="font-arcade text-base font-extrabold text-[#F4F9F5] leading-tight mt-0.5">
                        {inspectedSpecies.name}
                      </h3>
                    </div>
                  </div>
                  <MovePatternMatrix species={inspectedSpecies} />
                </div>

                {/* Clear 4-Stat Readout (Full word "Knockback" instead of cryptic "KB") */}
                <div className="mt-1.5 grid grid-cols-4 gap-1.5 text-xs">
                  <div className="px-2 py-1 rounded-md bg-[#121E24] border border-[#2e4957]">
                    <span className="text-[#B2C8CE] block text-[9px] font-semibold leading-none">
                      Max HP
                    </span>
                    <span className="font-num font-extrabold text-xs text-[#52E59B]">
                      {inspectedSpecies.maxHp}
                    </span>
                  </div>
                  <div className="px-2 py-1 rounded-md bg-[#121E24] border border-[#2e4957]">
                    <span className="text-[#B2C8CE] block text-[9px] font-semibold leading-none">
                      Attack
                    </span>
                    <span className="font-num font-extrabold text-xs text-[#F05A46]">
                      {inspectedSpecies.attack}
                    </span>
                  </div>
                  <div className="px-2 py-1 rounded-md bg-[#121E24] border border-[#2e4957]">
                    <span className="text-[#B2C8CE] block text-[9px] font-semibold leading-none">
                      Defense
                    </span>
                    <span className="font-num font-extrabold text-xs text-[#3CE8FF]">
                      {inspectedSpecies.defense}
                    </span>
                  </div>
                  <div className="px-2 py-1 rounded-md bg-[#121E24] border border-[#2e4957]">
                    <span className="text-[#B2C8CE] block text-[9px] font-semibold leading-none">
                      Knockback
                    </span>
                    <span className="font-num font-extrabold text-xs text-[#FFB838]">
                      {inspectedSpecies.knockbackChance}%
                    </span>
                  </div>
                </div>

                {/* Signature Move Box: Separates Flavor Name, Cost, and Functional Effect */}
                <div className="mt-1.5 p-2 rounded-lg bg-[#121E24] border-2 border-[#3D5C6B]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-arcade text-xs font-extrabold text-[#FFB838] uppercase">
                      ★ SIGNATURE: {inspectedSpecies.specialMove.name}
                    </span>
                    <span className="toy-pill px-2 py-0.2 bg-[#213641] border border-[#436778] font-num text-[10px] font-bold text-[#3CE8FF]">
                      Cost:{' '}
                      {inspectedSpecies.specialMove.maxUses === -1
                        ? 'Unlimited'
                        : `${inspectedSpecies.specialMove.maxUses} Charges`}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#F4F9F5] mt-0.5 leading-snug">
                    {inspectedSpecies.specialMove.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (7 cols): Step 3 Species Catalog (All 12 Specimen Cards with Zero Text Truncation & Clear Affordance) */}
          <div className="lg:col-span-7 shrink-0 lg:shrink sanctuary-panel p-2.5 flex flex-col lg:min-h-0 lg:overflow-hidden">
            {/* Catalog Header + Lightweight Filter Tabs (ALL / AVAILABLE / ASSIGNED) */}
            <div className="shrink-0 flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b-2 border-[#2e4957]">
              <div className="flex items-center gap-2">
                <span className="toy-pill px-2 py-0.5 bg-[#FFB838] text-[#122128] text-[10px] font-extrabold">
                  STEP 3
                </span>
                <h3 className="font-arcade text-sm sm:text-base font-extrabold uppercase text-[#F4F9F5]">
                  ASSIGN TO SLOT #{activeSlotIdx + 1}
                </h3>
              </div>

              {/* Filter Tabs */}
              <div
                className="flex items-center gap-1.5"
                role="tablist"
                aria-label="Filter Species Catalog"
              >
                {(
                  [
                    { id: 'all', label: `ALL (${INSECTOR_SPECIES.length})` },
                    { id: 'available', label: `AVAILABLE (${availableCount})` },
                    { id: 'assigned', label: `ASSIGNED (${assignedCount})` },
                  ] as const
                ).map((tab) => {
                  const active = catalogFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => {
                        soundFX.playSelect();
                        setCatalogFilter(tab.id);
                      }}
                      className={`arcade-press toy-pill px-2.5 py-1 text-xs font-extrabold border-2 cursor-pointer ${
                        active
                          ? 'bg-[#FFB838] border-[#FFE5A3] text-[#122128]'
                          : 'bg-[#121E24] border-[#3D5C6B] text-[#B2C8CE] hover:text-[#F4F9F5]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 12-Species Card Grid (3x4 layout fits all 12 cards 100% above the fold at 1280x800 without ellipsis truncation) */}
            <div className="flex-1 lg:min-h-0 lg:overflow-y-auto pt-1.5 pb-0.5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5 content-start">
              {filteredSpecies.map((sp) => {
                const assignedSlotIdx = draftSlots.findIndex(
                  (s) => s.speciesId === sp.id
                );
                const isSelectedForActiveSlot = assignedSlotIdx === activeSlotIdx;
                const isAssignedElsewhere =
                  assignedSlotIdx !== -1 && assignedSlotIdx !== activeSlotIdx;
                const isKingCard =
                  assignedSlotIdx !== -1 && draftSlots[assignedSlotIdx]?.isKing;
                const ptCost = TIER_POINT_COST[sp.rank] ?? 2;

                return (
                  <button
                    key={sp.id}
                    type="button"
                    onClick={() => handleAssignSpeciesToSlot(sp.id, activeSlotIdx)}
                    aria-label={`Assign ${sp.name} to Slot ${activeSlotIdx + 1}`}
                    className={`group neo-beast-card text-left justify-between ${
                      isSelectedForActiveSlot
                        ? 'is-selected'
                        : isAssignedElsewhere
                          ? 'is-assigned'
                          : ''
                    }`}
                  >
                    {/* Top Row: Mint-Sage Specimen Portrait Box + Name + HP + Tier & Point Cost */}
                    <div className="flex items-center gap-2">
                      <div className="bug-portrait-box !w-9 !h-9">
                        <InsectPortraitSVG
                          species={sp}
                          isKing={isKingCard}
                          className="w-7 h-7"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-num text-[10.5px] font-extrabold text-[#52E59B] leading-none">
                            {sp.maxHp} HP
                          </span>
                          <span
                            className={`toy-pill px-1.5 py-0.2 text-[8.5px] font-bold leading-none ${
                              sp.rank === 'S'
                                ? 'bg-[#B36BFF]/25 border border-[#B36BFF] text-[#D8B4FF]'
                                : 'bg-[#121E24] border border-[#3D5C6B] text-[#B2C8CE]'
                            }`}
                          >
                            Tier {sp.rank} · {ptCost}PT
                          </span>
                        </div>

                        <div className="font-arcade font-extrabold text-xs text-[#F4F9F5] group-hover:text-[#FFB838] leading-tight mt-0.5 transition-colors">
                          {sp.name}
                        </div>

                        <div className="text-[9.5px] text-[#B2C8CE] leading-tight mt-0.5">
                          {sp.role}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: Signature Move + Semantic Affordance Status Badge */}
                    <div className="pt-1 border-t border-[#3D5C6B]/60 flex items-center justify-between gap-1">
                      <span className="text-[10px] font-semibold text-[#FFB838] leading-none">
                        ★ {sp.specialMove.name}
                      </span>

                      {isSelectedForActiveSlot ? (
                        <span className="toy-pill shrink-0 px-2 py-0.5 bg-[#FFB838] text-[#122128] text-[9.5px] font-extrabold shadow-sm leading-none">
                          ✓ SLOT #{activeSlotIdx + 1}
                        </span>
                      ) : isAssignedElsewhere ? (
                        <span className="inline-flex items-center gap-1 shrink-0 px-1.5 py-0.5 rounded bg-[#16262E] border border-[#2E4A58] text-[#74929B] text-[9.5px] font-mono font-bold leading-none">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#5CE6A0]" />
                          {isKingCard ? '👑 ' : ''}SLOT #{assignedSlotIdx + 1}
                        </span>
                      ) : (
                        <span className="toy-pill shrink-0 px-2 py-0.5 bg-[#243B47] group-hover:bg-[#FFB838] border border-[#436778] group-hover:border-[#FFE5A3] text-[#F4F9F5] group-hover:text-[#122128] text-[9.5px] font-extrabold transition-colors leading-none">
                          + ASSIGN
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ====================================================================
            FIXED FOOTER: Balanced Squad Readiness Summary + Primary BATTLE CTA
            ==================================================================== */}
        <div className="shrink-0 px-4 py-2 bg-[#1B2C35] border-t-2 border-[#3D5C6B] flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs sm:text-sm text-[#F4F9F5] flex items-center gap-3 flex-wrap">
            {!isWithinPointCap ? (
              <span className="text-[#F05A46] font-bold">
                ⚠️ Squad cost ({totalSquadPoints}/{MAX_SQUAD_POINTS} PTS) exceeds cap!
              </span>
            ) : isReadyToBattle ? (
              <>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#121E24] border border-[#3D5C6B]">
                  <span className="text-[#B2C8CE] text-xs">King:</span>
                  <strong className="text-[#FFB838] font-arcade text-xs uppercase">
                    👑 {kingSpecies?.name}
                  </strong>
                </div>
                <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#121E24] border border-[#3D5C6B] text-xs text-[#52E59B] font-bold">
                  <span>● 5/5 Units Deployed</span>
                </div>
              </>
            ) : (
              <span className="text-[#FFB838] font-bold">
                Choose 1 King and fill all 5 slots.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              disabled={!isReadyToBattle}
              data-testid="deploy-squad-play-btn"
              onClick={() => {
                triggerHaptic(25);
                onDeploySquad(draftSlots, opponentRank);
              }}
              className={`btn-tactile px-7 py-1.5 text-base font-extrabold tracking-wider uppercase cursor-pointer whitespace-nowrap ${
                isReadyToBattle ? 'btn-tactile--gold' : 'is-disabled'
              }`}
            >
              START BATTLE ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

