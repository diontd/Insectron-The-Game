import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  BOARD_COLS,
  BOARD_ROWS,
  BoardUnit,
  CombatEvent,
  getSpecies,
} from '../game/rules';
import { SpecialMoveType } from '../game/species';
import { createInsector3DRig, Insector3DRig } from './Insector3DFactory';

export type CameraPresetMode = 'tactical' | 'topdown' | 'cinematic' | 'isometric';

interface ArenaCanvasProps {
  units: BoardUnit[];
  selectedUnit: BoardUnit | null;
  targetedUnit: BoardUnit | null;
  validMoves: Array<{ col: number; row: number }>;
  attackTargets: BoardUnit[];
  specialTargets: BoardUnit[];
  previewTiles?: Array<{ col: number; row: number }>;
  previewType?: 'attack' | 'special' | null;
  moveOriginTile?: { col: number; row: number } | null;
  actionMode: 'move_or_attack' | 'attack_confirm' | 'special';
  lastEvents: CombatEvent[];
  cameraMode?: CameraPresetMode;
  isTitleBackdrop?: boolean;
  winner?: 'player' | 'enemy' | null;
  enableScreenShake?: boolean;
  enableParticles?: boolean;
  onTileHover?: (tile: { col: number; row: number } | null) => void;
  onTileClick: (col: number, row: number) => void;
}

interface ProjectedTile {
  col: number;
  row: number;
  x: number;
  y: number;
}

interface ProjectedUnitHUD {
  id: string;
  name: string;
  team: 'player' | 'enemy';
  hp: number;
  maxHp: number;
  specialUses: number;
  maxSpecialUses: number;
  isKing: boolean;
  confusion: number;
  poison: number;
  shield: number;
  equippedBadge?: boolean;
  x: number;
  y: number;
  visible: boolean;
}

interface FloatingBanner {
  id: number;
  worldX: number;
  worldY: number;
  worldZ: number;
  text: string;
  subText?: string;
  color: string;
  createdAt: number;
  duration: number;
  isCrit?: boolean;
  isFumble?: boolean;
  isWallSlam?: boolean;
}

interface ActiveChoreography {
  type: 'attack' | 'special' | 'ring_out';
  signatureId?: SpecialMoveType;
  signatureName?: string;
  attackerId?: string;
  targetId?: string;
  fromWorld: THREE.Vector3;
  toWorld: THREE.Vector3;
  knockbackWorld?: THREE.Vector3;
  isRingOut: boolean;
  startTime: number;
  duration: number;
  impactTriggered: boolean;
}

const TILE_SIZE = 1.62;
const BOARD_ORIGIN_X = -((BOARD_COLS - 1) * TILE_SIZE) / 2;
const BOARD_ORIGIN_Z = -((BOARD_ROWS - 1) * TILE_SIZE) / 2;

export function boardToWorld(col: number, row: number, y = 0): THREE.Vector3 {
  return new THREE.Vector3(
    -BOARD_ORIGIN_Z - row * TILE_SIZE,
    y,
    BOARD_ORIGIN_X + col * TILE_SIZE
  );
}

// Detect CPU software WebGL (SwiftShader / llvmpipe) once per module load per Three.js skill
const isSoftwareGl = (() => {
  if (typeof document === 'undefined') return false;
  const gl = document.createElement('canvas').getContext('webgl2');
  if (!gl) return true;
  const ext = gl.getExtension('WEBGL_debug_renderer_info');
  const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
  const gpu = String(gl.getParameter(param));
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
})();

export const ArenaCanvas: React.FC<ArenaCanvasProps> = ({
  units,
  selectedUnit,
  targetedUnit,
  validMoves,
  attackTargets,
  specialTargets,
  previewTiles = [],
  previewType = null,
  moveOriginTile = null,
  actionMode,
  lastEvents,
  cameraMode = 'tactical',
  isTitleBackdrop = false,
  winner = null,
  enableScreenShake = true,
  enableParticles = true,
  onTileHover,
  onTileClick,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hudOverlayRef = useRef<HTMLDivElement | null>(null);
  const bannerOverlayRef = useRef<HTMLDivElement | null>(null);
  const [hoveredTile, setHoveredTile] = useState<{
    col: number;
    row: number;
  } | null>(null);
  const [projectedTiles, setProjectedTiles] = useState<ProjectedTile[]>([]);
  const [activeSignatureBanner, setActiveSignatureBanner] = useState<{
    actorName: string;
    moveName: string;
    team: 'player' | 'enemy';
  } | null>(null);

  // Refs to hold latest React state for the Three.js loop without recreating the scene
  const stateRef = useRef({
    units,
    selectedUnit,
    targetedUnit,
    validMoves,
    attackTargets,
    specialTargets,
    previewTiles,
    previewType,
    moveOriginTile,
    actionMode,
    cameraMode,
    isTitleBackdrop,
    winner,
    enableScreenShake,
    enableParticles,
    hoveredTile,
    onTileHover,
    onTileClick,
  });
  stateRef.current = {
    units,
    selectedUnit,
    targetedUnit,
    validMoves,
    attackTargets,
    specialTargets,
    previewTiles,
    previewType,
    moveOriginTile,
    actionMode,
    cameraMode,
    isTitleBackdrop,
    winner,
    enableScreenShake,
    enableParticles,
    hoveredTile,
    onTileHover,
    onTileClick,
  };

  const choreographyRef = useRef<ActiveChoreography | null>(null);
  const bannersRef = useRef<FloatingBanner[]>([]);
  const traumaRef = useRef<number>(0);
  const hitstopUntilRef = useRef<number>(0);
  const unitFlashMapRef = useRef<Map<string, number>>(new Map());
  const spawnBurstRef = useRef<
    ((pos: THREE.Vector3, colorHex: string, count?: number, speed?: number) => void) | null
  >(null);
  const triggerShockwaveRef = useRef<
    ((pos: THREE.Vector3, colorHex: string, maxScale?: number) => void) | null
  >(null);
  const renderNowRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    renderNowRef.current?.();
  }, [
    units,
    selectedUnit,
    targetedUnit,
    actionMode,
    cameraMode,
    isTitleBackdrop,
    winner,
  ]);

  // Trigger 3D combat choreography, camera zoom, hitstop, and floating banners when lastEvents changes
  useEffect(() => {
    if (!lastEvents || lastEvents.length === 0) return;
    const now = performance.now();

    let primaryAtkEvent: CombatEvent | undefined;
    let ringOutEvent: CombatEvent | undefined;
    let knockbackEvent: CombatEvent | undefined;

    for (const ev of lastEvents) {
      if (
        ev.type === 'special' ||
        ev.type === 'attack' ||
        ev.type === 'charm' ||
        ev.type === 'heal'
      ) {
        if (!primaryAtkEvent) primaryAtkEvent = ev;
      }
      if (ev.type === 'ring_out') ringOutEvent = ev;
      if (ev.type === 'knockback') knockbackEvent = ev;

      // Add floating world-space banner for damage, heal, status, or ring-out
      const tCol = ev.toCol ?? ev.fromCol ?? 2;
      const tRow = ev.toRow ?? ev.fromRow ?? 2;
      const wPos = boardToWorld(tCol, tRow, 1.35);

      if (ev.type === 'ring_out') {
        bannersRef.current.push({
          id: Math.random(),
          worldX: wPos.x,
          worldY: wPos.y + 0.45,
          worldZ: wPos.z,
          text: 'RING OUT!',
          subText: 'INSTANT KO',
          color: '#fbbf24',
          createdAt: now,
          duration: 2100,
        });
      } else if (ev.type === 'charm') {
        bannersRef.current.push({
          id: Math.random(),
          worldX: wPos.x,
          worldY: wPos.y + 0.4,
          worldZ: wPos.z,
          text: 'CHARMED!',
          subText: 'ALLY CONVERTED (2 TURNS)',
          color: '#f472b6',
          createdAt: now,
          duration: 1850,
        });
      } else if (ev.type === 'heal' && ev.heal) {
        bannersRef.current.push({
          id: Math.random(),
          worldX: wPos.x,
          worldY: wPos.y + 0.3,
          worldZ: wPos.z,
          text: `+${ev.heal} HP`,
          subText: 'HEALING JIG',
          color: '#4ade80',
          createdAt: now,
          duration: 1650,
        });
      } else if (ev.damage) {
        let subText = ev.signatureName
          ? ev.signatureName.toUpperCase()
          : ev.type === 'counter'
            ? 'COUNTER!'
            : 'HIT!';
        let color = ev.type === 'special' ? '#fde047' : '#f43f5e';

        if (ev.wallSlam) {
          subText = 'EDGE GRIP · WALL SLAM!';
          color = '#38bdf8';
        } else if (ev.crit) {
          subText = '★ CRITICAL HIT!';
          color = '#fbbf24';
        } else if (ev.fumble) {
          subText = 'FUMBLE...';
          color = '#c084fc';
        }

        bannersRef.current.push({
          id: Math.random(),
          worldX: wPos.x,
          worldY: wPos.y + 0.35,
          worldZ: wPos.z,
          text: `-${ev.damage}`,
          subText,
          color,
          createdAt: now,
          duration: 1800,
          isCrit: ev.crit,
          isFumble: ev.fumble,
          isWallSlam: ev.wallSlam,
        });
      }
    }

    if (primaryAtkEvent) {
      const fromW = boardToWorld(
        primaryAtkEvent.fromCol ?? 2,
        primaryAtkEvent.fromRow ?? 3,
        0
      );
      const toW = boardToWorld(
        primaryAtkEvent.toCol ?? 2,
        primaryAtkEvent.toRow ?? 2,
        0
      );

      let kbWorld: THREE.Vector3 | undefined;
      if (ringOutEvent && ringOutEvent.toCol !== undefined && ringOutEvent.toRow !== undefined) {
        kbWorld = boardToWorld(ringOutEvent.toCol, ringOutEvent.toRow, -2.6);
      } else if (
        knockbackEvent &&
        knockbackEvent.toCol !== undefined &&
        knockbackEvent.toRow !== undefined
      ) {
        kbWorld = boardToWorld(knockbackEvent.toCol, knockbackEvent.toRow, 0);
      }

      const isSpecial =
        primaryAtkEvent.type === 'special' ||
        primaryAtkEvent.type === 'charm' ||
        primaryAtkEvent.type === 'heal';

      choreographyRef.current = {
        type: ringOutEvent ? 'ring_out' : isSpecial ? 'special' : 'attack',
        signatureId: primaryAtkEvent.signatureId,
        signatureName: primaryAtkEvent.signatureName,
        attackerId: primaryAtkEvent.sourceUnitId,
        targetId: primaryAtkEvent.targetUnitId,
        fromWorld: fromW,
        toWorld: toW,
        knockbackWorld: kbWorld,
        isRingOut: Boolean(ringOutEvent),
        startTime: now,
        duration: ringOutEvent ? 2100 : isSpecial ? 1850 : 1100,
        impactTriggered: false,
      };

      // Show dramatic cinematic callout banner for Signature Moves
      if (isSpecial && primaryAtkEvent.signatureName) {
        const actor = stateRef.current.units.find(
          (u) => u.id === primaryAtkEvent?.sourceUnitId
        );
        setActiveSignatureBanner({
          actorName: actor?.name || 'INSECTOR',
          moveName: primaryAtkEvent.signatureName,
          team: actor?.team || 'player',
        });
        const bannerTimer = window.setTimeout(() => {
          setActiveSignatureBanner(null);
        }, 1650);
        return () => window.clearTimeout(bannerTimer);
      }
    }
  }, [lastEvents]);

  // Main Three.js WebGL Scene Setup & Render Loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    // Cap pixel ratio to 1.5 (or 1 on software/low-spec) to prevent 4x fill-rate bottleneck on high-DPI displays
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 1.5)
    );
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x233d3b);
    scene.fog = new THREE.FogExp2(0x274542, 0.015);

    // Environment IBL for tactile matte-satin Neo-Beasts & Chiseled Stone Sanctuary
    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmrem.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmrem.dispose();

    // Camera: Diagonal Isometric Bio-Dome Perspective framed cleanly between Top & Bottom HUD
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 120);
    const currentCamPos = stateRef.current.isTitleBackdrop
      ? new THREE.Vector3(-7.8, 12.8, 11.8)
      : new THREE.Vector3(-9.2, 13.6, 11.6);
    const currentLookAt = stateRef.current.isTitleBackdrop
      ? new THREE.Vector3(-1.95, -0.35, 0.5)
      : new THREE.Vector3(0.05, -0.5, 0.15);
    let prevTitleState = Boolean(stateRef.current.isTitleBackdrop);
    camera.position.copy(currentCamPos);
    camera.lookAt(currentLookAt);

    // ========================================================================
    // PENCAHAYAAN DUAL-TONE: SUNLIT CONSERVATORY CANOPY & WARM LANTERNS
    // ========================================================================
    const hemiLight = new THREE.HemisphereLight(0xc8f2d8, 0x1c2b24, 1.05);
    hemiLight.position.set(0, 22, 0);
    scene.add(hemiLight);

    // Main Golden Sunbeams from Upper-Left Glass Bio-Dome Canopy
    const keyLight = new THREE.DirectionalLight(0xffe8b3, 1.75);
    keyLight.position.set(-7, 17, -6);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.camera.near = 2;
      keyLight.shadow.camera.far = 36;
      const d = 9.5;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
    }
    scene.add(keyLight);

    // Cool Bio-Crystal & Mint Rim Light
    const rimLight = new THREE.DirectionalLight(0x52e59b, 0.72);
    rimLight.position.set(8.5, 10.5, 8.0);
    scene.add(rimLight);

    // Warm Hanging Lantern Point Lights on Left & Right Flanks
    const lanternLightRight = new THREE.PointLight(0xffaa33, 2.2, 14, 1.5);
    lanternLightRight.position.set(5.2, 2.3, 1.2);
    scene.add(lanternLightRight);

    const lanternLightLeft = new THREE.PointLight(0xffb838, 2.1, 14, 1.5);
    lanternLightLeft.position.set(-5.2, 2.3, 1.8);
    scene.add(lanternLightLeft);

    // Bio-Crystal Cyan Fill Lights at Four Corners
    const crystalLightLeft = new THREE.PointLight(0x3ce8ff, 1.65, 12, 1.5);
    crystalLightLeft.position.set(-5.0, 1.5, 0.2);
    scene.add(crystalLightLeft);

    const crystalLightRight = new THREE.PointLight(0x3ce8ff, 1.65, 12, 1.5);
    crystalLightRight.position.set(4.6, 1.5, 2.8);
    scene.add(crystalLightRight);

    // ========================================================================
    // BUILD ANCIENT SANCTUARY BIO-DOME ARENA & CHISELED STONE ALTAR (5x6)
    // ========================================================================
    const stadiumGroup = new THREE.Group();
    scene.add(stadiumGroup);

    const boardTotalW = BOARD_ROWS * TILE_SIZE;
    const boardTotalD = BOARD_COLS * TILE_SIZE;

    // 1. Lush Mossy Sanctuary Ground & Recessed Stone Altar Bed
    const meadowFloorGeo = new THREE.CylinderGeometry(22.0, 23.0, 0.7, 36);
    const meadowFloorMat = new THREE.MeshStandardMaterial({
      color: 0x35592b,
      roughness: 0.9,
      metalness: 0.04,
      flatShading: true,
    });
    const meadowFloor = new THREE.Mesh(meadowFloorGeo, meadowFloorMat);
    meadowFloor.position.set(0, -1.05, -0.8);
    stadiumGroup.add(meadowFloor);

    // Dark Mossy Trench Bed directly beneath the 5x6 Stone Board
    const abyssGeo = new THREE.BoxGeometry(boardTotalW + 2.4, 0.4, boardTotalD + 2.4);
    const abyssMat = new THREE.MeshStandardMaterial({
      color: 0x1e3023,
      roughness: 0.92,
      metalness: 0.05,
    });
    const abyssMesh = new THREE.Mesh(abyssGeo, abyssMat);
    abyssMesh.position.set(0, -0.58, 0);
    stadiumGroup.add(abyssMesh);

    // Chiseled Stone Altar Foundation under the 5x6 tiles
    const pedestalGeo = new THREE.BoxGeometry(boardTotalW + 0.55, 0.75, boardTotalD + 0.55);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x2c362e,
      roughness: 0.86,
      metalness: 0.06,
      flatShading: true,
    });
    const pedestalMesh = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestalMesh.position.set(0, -0.45, 0);
    stadiumGroup.add(pedestalMesh);

    // Weathered Stone Curb Rim framing the 5x6 Board
    const altarRimGeo = new THREE.BoxGeometry(boardTotalW + 0.88, 0.22, boardTotalD + 0.88);
    const altarRimMat = new THREE.MeshStandardMaterial({
      color: 0x5c665d,
      roughness: 0.82,
      metalness: 0.06,
      flatShading: true,
    });
    const altarRimMesh = new THREE.Mesh(altarRimGeo, altarRimMat);
    altarRimMesh.position.set(0, -0.16, 0);
    stadiumGroup.add(altarRimMesh);

    // Shared Sanctuary Environment Materials
    const chiseledWallMat = new THREE.MeshStandardMaterial({
      color: 0x626b63,
      roughness: 0.84,
      metalness: 0.06,
      flatShading: true,
    });
    const darkStoneMat = new THREE.MeshStandardMaterial({
      color: 0x454d46,
      roughness: 0.88,
      metalness: 0.05,
      flatShading: true,
    });
    const mossGrassMat = new THREE.MeshStandardMaterial({
      color: 0x558734,
      roughness: 0.86,
      metalness: 0.04,
      flatShading: true,
    });
    const deepCanopyMat = new THREE.MeshStandardMaterial({
      color: 0x2f5926,
      roughness: 0.9,
      metalness: 0.04,
      flatShading: true,
    });
    const woodTrunkMat = new THREE.MeshStandardMaterial({
      color: 0x5c3d24,
      roughness: 0.86,
      metalness: 0.05,
      flatShading: true,
    });
    const bioCrystalMat = new THREE.MeshStandardMaterial({
      color: 0x45f0ff,
      emissive: 0x16c8e8,
      emissiveIntensity: 0.95,
      roughness: 0.18,
      metalness: 0.15,
      flatShading: true,
    });
    const lanternGlowMat = new THREE.MeshStandardMaterial({
      color: 0xffe082,
      emissive: 0xffae2b,
      emissiveIntensity: 1.5,
      roughness: 0.2,
    });

    // ========================================================================
    // GLASS BIO-DOME CONSERVATORY RIBS & GOLDEN SUNBEAM SHAFTS (Upper Background)
    // ========================================================================
    const domeRibMat = new THREE.MeshStandardMaterial({
      color: 0x506e6a,
      roughness: 0.55,
      metalness: 0.25,
    });
    for (let r = -2; r <= 2; r++) {
      const rib = new THREE.Mesh(
        new THREE.TorusGeometry(15.5, 0.18, 8, 36, Math.PI),
        domeRibMat
      );
      rib.position.set(r * 2.8, -1.0, -9.5 - Math.abs(r) * 0.8);
      rib.rotation.y = r * 0.18;
      stadiumGroup.add(rib);
    }
    // Horizontal cross-Mullions on the Bio-Dome Glass
    for (let h = 3.5; h <= 9.5; h += 3.0) {
      const crossbar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.11, 24, 8),
        domeRibMat
      );
      crossbar.rotation.z = Math.PI / 2;
      crossbar.position.set(0, h, -10.2);
      stadiumGroup.add(crossbar);
    }

    // Warm Golden Sunbeam Shafts slanting from Upper-Left Bio-Dome Roof
    const sunbeamMat = new THREE.MeshBasicMaterial({
      color: 0xfff0b8,
      transparent: true,
      opacity: 0.11,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    for (let sb = 0; sb < 3; sb++) {
      const beamCone = new THREE.Mesh(
        new THREE.ConeGeometry(2.2 + sb * 0.5, 16, 12, 1, true),
        sunbeamMat
      );
      beamCone.position.set(-4.5 + sb * 2.2, 6.2, -5.8 + sb * 1.1);
      beamCone.rotation.z = -0.38;
      beamCone.rotation.x = 0.22;
      stadiumGroup.add(beamCone);
    }

    // Helper: Build a Glowing Bio-Crystal Cluster (4 corners of arena in reference image)
    const addCrystalCluster = (cx: number, cy: number, cz: number, scale = 1) => {
      const cluster = new THREE.Group();
      const shards = [
        { dx: 0, dz: 0, h: 1.25, r: 0.28, rx: 0.06, rz: -0.05 },
        { dx: -0.26, dz: 0.16, h: 0.88, r: 0.22, rx: -0.24, rz: 0.28 },
        { dx: 0.28, dz: -0.12, h: 0.95, r: 0.23, rx: 0.22, rz: -0.26 },
        { dx: 0.1, dz: 0.28, h: 0.65, r: 0.18, rx: 0.32, rz: 0.14 },
        { dx: -0.18, dz: -0.22, h: 0.72, r: 0.19, rx: -0.2, rz: -0.22 },
      ];
      for (const sh of shards) {
        const geo = new THREE.ConeGeometry(sh.r, sh.h, 6);
        const mesh = new THREE.Mesh(geo, bioCrystalMat);
        mesh.position.set(sh.dx, sh.h * 0.45, sh.dz);
        mesh.rotation.set(sh.rx, 0, sh.rz);
        cluster.add(mesh);
      }
      cluster.position.set(cx, cy, cz);
      cluster.scale.setScalar(scale);
      stadiumGroup.add(cluster);
    };

    // Helper: Build a Sculpted Pine Tree
    const addSculptedPineTree = (tx: number, ty: number, tz: number, scale = 1) => {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.32, 1.3, 7),
        woodTrunkMat
      );
      trunk.position.y = 0.65;
      tree.add(trunk);

      for (let tier = 0; tier < 3; tier++) {
        const cone = new THREE.Mesh(
          new THREE.ConeGeometry(1.15 - tier * 0.22, 1.5 - tier * 0.15, 7),
          tier === 2 ? mossGrassMat : deepCanopyMat
        );
        cone.position.y = 1.4 + tier * 0.8;
        tree.add(cone);
      }
      tree.position.set(tx, ty, tz);
      tree.scale.setScalar(scale);
      stadiumGroup.add(tree);
    };

    // Helper: Build a Hanging Wooden Gallows Lantern Post (matches left & right lanterns in reference image)
    const addHangingLanternPost = (lx: number, ly: number, lz: number, armDir = 1) => {
      const postGroup = new THREE.Group();
      const post = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 2.25, 0.24),
        woodTrunkMat
      );
      post.position.y = 1.12;
      postGroup.add(post);

      const crossArm = new THREE.Mesh(
        new THREE.BoxGeometry(0.85, 0.18, 0.18),
        woodTrunkMat
      );
      crossArm.position.set(armDir * 0.32, 2.05, 0);
      postGroup.add(crossArm);

      const lanternCage = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.16, 0.42, 6),
        lanternGlowMat
      );
      lanternCage.position.set(armDir * 0.62, 1.68, 0);
      postGroup.add(lanternCage);

      const lanternCap = new THREE.Mesh(
        new THREE.ConeGeometry(0.28, 0.2, 6),
        darkStoneMat
      );
      lanternCap.position.set(armDir * 0.62, 1.94, 0);
      postGroup.add(lanternCap);

      postGroup.position.set(lx, ly, lz);
      stadiumGroup.add(postGroup);
    };

    // ========================================================================
    // ICONIC LANDMARKS FROM REFERENCE IMAGE:
    // 1. Wide Ancient Stone Staircase & Twin Pillars (Upper-Left: -X, -Z)
    // 2. Freestanding Chiseled Stone Archway Portal (Upper-Right: +X, -Z)
    // 3. Low Weathered Stone Wall Blocks along the Board Edges
    // 4. Gnarled Ancient Tree Roots on Left & Right Banks
    // ========================================================================
    const stairsGroup = new THREE.Group();
    for (let s = 0; s < 7; s++) {
      const step = new THREE.Mesh(
        new THREE.BoxGeometry(3.4, 0.22, 0.55),
        s % 2 === 0 ? chiseledWallMat : darkStoneMat
      );
      step.position.set(0, s * 0.2, -s * 0.48);
      stairsGroup.add(step);
    }
    for (const side of [-1, 1]) {
      const balustrade = new THREE.Mesh(
        new THREE.BoxGeometry(0.48, 1.65, 3.8),
        darkStoneMat
      );
      balustrade.position.set(side * 1.85, 0.65, -1.4);
      stairsGroup.add(balustrade);

      const pillar = new THREE.Mesh(
        new THREE.BoxGeometry(0.68, 2.35, 0.68),
        chiseledWallMat
      );
      pillar.position.set(side * 1.85, 1.55, -3.1);
      stairsGroup.add(pillar);
    }
    stairsGroup.position.set(-2.6, -0.2, -(boardTotalD / 2 + 1.8));
    stairsGroup.rotation.y = 0.22;
    stadiumGroup.add(stairsGroup);

    // 2. Freestanding Chiseled Stone Archway Portal (Upper-Right of Board)
    const archPortalGroup = new THREE.Group();
    const archRadius = 1.85;
    const archBlocks = 11;
    for (let i = 0; i <= archBlocks; i++) {
      const ang = (i / archBlocks) * Math.PI;
      const voussoir = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 0.62, 0.68),
        i % 2 === 0 ? chiseledWallMat : darkStoneMat
      );
      voussoir.position.set(
        Math.cos(ang) * archRadius,
        1.45 + Math.sin(ang) * archRadius,
        0
      );
      voussoir.rotation.z = ang - Math.PI / 2;
      archPortalGroup.add(voussoir);
    }
    for (const side of [-1, 1]) {
      const pier = new THREE.Mesh(
        new THREE.BoxGeometry(0.68, 1.55, 0.72),
        chiseledWallMat
      );
      pier.position.set(side * archRadius, 0.75, 0);
      archPortalGroup.add(pier);
    }
    archPortalGroup.position.set(3.4, -0.3, -(boardTotalD / 2 + 1.5));
    archPortalGroup.rotation.y = -0.35;
    stadiumGroup.add(archPortalGroup);

    // 3. Low Chiseled Stone Wall Blocks flanking the Board Perimeter (matches the 3-block stone wall on the right & top of the board)
    const wallBlockPositions: Array<[number, number, number, number]> = [
      // Right-flank low stone wall blocks (between player & enemy right side)
      [boardTotalW / 2 + 0.58, 0.36, 0.45, 0],
      [boardTotalW / 2 + 0.58, 0.42, 1.38, 0],
      [boardTotalW / 2 + 0.58, 0.38, 2.3, 0],
      // Upper-middle stone ruin blocks near top of board
      [-0.4, 0.38, -(boardTotalD / 2 + 0.58), 0],
      [0.55, 0.44, -(boardTotalD / 2 + 0.58), 0],
      [1.48, 0.35, -(boardTotalD / 2 + 0.58), 0],
    ];
    for (const [wx, wy, wz, rotY] of wallBlockPositions) {
      const block = new THREE.Mesh(
        new THREE.BoxGeometry(0.86, 0.78, 0.84),
        chiseledWallMat
      );
      block.position.set(wx, wy, wz);
      block.rotation.y = rotY;
      block.castShadow = !isSoftwareGl;
      block.receiveShadow = !isSoftwareGl;
      stadiumGroup.add(block);
    }

    // 4. Mossy Side Embankments & Gnarled Tree Roots on Left & Right Flanks
    for (const side of [-1, 1]) {
      const mound = new THREE.Mesh(
        new THREE.DodecahedronGeometry(3.2, 1),
        mossGrassMat
      );
      mound.scale.set(1.3, 0.45, 2.2);
      mound.position.set(side * (boardTotalW / 2 + 3.8), -0.35, 0.2);
      stadiumGroup.add(mound);

      // Gnarled wooden roots curving down the embankment
      for (let r = 0; r < 3; r++) {
        const rootBranch = new THREE.Mesh(
          new THREE.CylinderGeometry(0.14, 0.28, 3.2, 7),
          woodTrunkMat
        );
        rootBranch.position.set(
          side * (boardTotalW / 2 + 2.8 + r * 0.35),
          0.55,
          -1.8 + r * 1.4
        );
        rootBranch.rotation.z = side * 0.85;
        rootBranch.rotation.x = 0.25 * (r - 1);
        stadiumGroup.add(rootBranch);
      }
    }

    // Place Hanging Wooden Lanterns on Left & Right Flanks
    addHangingLanternPost(-(boardTotalW / 2 + 1.55), -0.2, 1.9, 1);
    addHangingLanternPost(boardTotalW / 2 + 2.15, -0.2, 0.2, -1);

    // Place Glowing Cyan Bio-Crystal Clusters in the 4 Iconic Positions from Reference Image
    addCrystalCluster(-(boardTotalW / 2 + 1.65), -0.15, 0.1, 1.15); // Mid-Left large crystal
    addCrystalCluster(-(boardTotalW / 2 + 2.4), 0.45, -3.6, 0.95);  // Upper-Left crystal
    addCrystalCluster(0.35, 0.15, -(boardTotalD / 2 + 1.45), 1.05); // Upper-Center crystal
    addCrystalCluster(boardTotalW / 2 + 1.55, -0.15, 2.85, 1.25);   // Lower-Right large foreground crystal
    addCrystalCluster(boardTotalW / 2 + 1.85, 0.05, -2.4, 0.92);    // Upper-Right crystal behind red tortoise

    // Place Sculpted Pine Trees around the Conservatory Perimeter
    addSculptedPineTree(-(boardTotalW / 2 + 4.2), 0.2, -4.5, 1.45);
    addSculptedPineTree(-(boardTotalW / 2 + 4.8), 0.1, -1.6, 1.25);
    addSculptedPineTree(boardTotalW / 2 + 4.5, 0.1, -3.8, 1.4);
    addSculptedPineTree(boardTotalW / 2 + 5.2, 0.1, -0.8, 1.3);
    addSculptedPineTree(1.2, 0.25, -(boardTotalD / 2 + 4.2), 1.2);

    // ========================================================================
    // 2. BUILD 30 CHISELED STONE SLAB TILES + GLOWING CARVED RUNE OVERLAYS
    //    (Matches the glowing Mint-Emerald & Coral-Orange Rune Tiles in reference!)
    // ========================================================================
    const runeGlyphs = ['ᛟ', 'ᛉ', 'ᚠ', 'ᛜ', 'ᛇ', 'ᛞ', 'ᛏ', 'ᛗ'];
    const runeTextures: THREE.CanvasTexture[] = runeGlyphs.map((glyph) => {
      const c = document.createElement('canvas');
      c.width = 128;
      c.height = 128;
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, 128, 128);
        // Glowing outer square border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.92)';
        ctx.lineWidth = 6;
        ctx.strokeRect(8, 8, 112, 112);

        // Soft inner aura fill
        const grad = ctx.createRadialGradient(64, 64, 8, 64, 64, 58);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.42)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0.12)');
        ctx.fillStyle = grad;
        ctx.fillRect(10, 10, 108, 108);

        // Ancient carved rune glyph in center
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 64px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(glyph, 64, 68);
      }
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    });

    const tileMeshes: THREE.Mesh[] = [];
    const tileOverlayMap = new Map<
      string,
      {
        outerFrame: THREE.Mesh;
        innerPlate: THREE.Mesh;
        outerMat: THREE.MeshStandardMaterial;
        innerMat: THREE.MeshBasicMaterial;
      }
    >();

    // Extruded Chiseled Stone Geometry with beveled edges
    const slabShape = new THREE.Shape();
    const halfSlab = (TILE_SIZE * 0.89) / 2;
    slabShape.moveTo(-halfSlab, -halfSlab);
    slabShape.lineTo(halfSlab, -halfSlab);
    slabShape.lineTo(halfSlab, halfSlab);
    slabShape.lineTo(-halfSlab, halfSlab);
    slabShape.closePath();

    const chiseledTileGeo = new THREE.ExtrudeGeometry(slabShape, {
      depth: 0.22,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.05,
      bevelThickness: 0.05,
    });
    chiseledTileGeo.rotateX(Math.PI / 2);

    // Weathered Sanctuary Stone Palette (#6B7468 & #525B50)
    const lightTileMat = new THREE.MeshStandardMaterial({
      color: 0x6b7468,
      roughness: 0.85,
      metalness: 0.06,
      flatShading: true,
    });
    const darkTileMat = new THREE.MeshStandardMaterial({
      color: 0x525b50,
      roughness: 0.88,
      metalness: 0.06,
      flatShading: true,
    });

    // Full-Tile Glowing Rune Pad & Border Frame
    const overlayOuterGeo = new THREE.RingGeometry(
      TILE_SIZE * 0.52,
      TILE_SIZE * 0.61,
      4
    );
    overlayOuterGeo.rotateZ(Math.PI / 4);
    overlayOuterGeo.rotateX(-Math.PI / 2);

    const overlayInnerGeo = new THREE.PlaneGeometry(
      TILE_SIZE * 0.86,
      TILE_SIZE * 0.86
    );
    overlayInnerGeo.rotateX(-Math.PI / 2);

    for (let row = 0; row < BOARD_ROWS; row++) {
      for (let col = 0; col < BOARD_COLS; col++) {
        const isLight = (row + col) % 2 === 0;
        const tMesh = new THREE.Mesh(
          chiseledTileGeo,
          isLight ? lightTileMat : darkTileMat
        );
        const wPos = boardToWorld(col, row, 0.0);
        tMesh.position.copy(wPos);
        tMesh.receiveShadow = !isSoftwareGl;
        tMesh.castShadow = !isSoftwareGl;
        tMesh.userData = { col, row };
        stadiumGroup.add(tMesh);
        tileMeshes.push(tMesh);

        const runeTex = runeTextures[(row * BOARD_COLS + col) % runeTextures.length];

        const outerMat = new THREE.MeshStandardMaterial({
          color: '#4FFFB0',
          emissive: '#4FFFB0',
          emissiveIntensity: 0.95,
          transparent: true,
          opacity: 0,
          roughness: 0.2,
          side: THREE.DoubleSide,
          depthWrite: false,
        });
        const innerMat = new THREE.MeshBasicMaterial({
          color: '#4FFFB0',
          map: runeTex,
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide,
          depthWrite: false,
        });

        const outerFrame = new THREE.Mesh(overlayOuterGeo, outerMat);
        outerFrame.position.set(wPos.x, 0.062, wPos.z);
        outerFrame.visible = false;
        stadiumGroup.add(outerFrame);

        const innerPlate = new THREE.Mesh(overlayInnerGeo, innerMat);
        innerPlate.position.set(wPos.x, 0.068, wPos.z);
        innerPlate.visible = false;
        stadiumGroup.add(innerPlate);

        tileOverlayMap.set(`${col},${row}`, {
          outerFrame,
          innerPlate,
          outerMat,
          innerMat,
        });
      }
    }

    // 3. Ambient Sanctuary Forest Spores & Bio-Crystal Motes
    const SPORE_COUNT = 42;
    const sporePositions = new Float32Array(SPORE_COUNT * 3);
    const sporeColors = new Float32Array(SPORE_COUNT * 3);
    const paletteColors = [
      new THREE.Color('#FFB838'),
      new THREE.Color('#3CE8FF'),
      new THREE.Color('#A6E3C5'),
    ];
    for (let i = 0; i < SPORE_COUNT; i++) {
      const ang = (i / SPORE_COUNT) * Math.PI * 2;
      const rad = 5.4 + (i % 5) * 1.45;
      sporePositions[i * 3] = Math.cos(ang) * rad;
      sporePositions[i * 3 + 1] = -0.6 + (i % 6) * 0.65;
      sporePositions[i * 3 + 2] = Math.sin(ang) * rad;
      const c = paletteColors[i % paletteColors.length];
      sporeColors[i * 3] = c.r;
      sporeColors[i * 3 + 1] = c.g;
      sporeColors[i * 3 + 2] = c.b;
    }
    const sporeGeo = new THREE.BufferGeometry();
    sporeGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(sporePositions, 3)
    );
    sporeGeo.setAttribute('color', new THREE.BufferAttribute(sporeColors, 3));
    const sporeMat = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
    });
    const ambientSpores = new THREE.Points(sporeGeo, sporeMat);
    scene.add(ambientSpores);

    // ========================================================================
    // 3D VFX OBJECT POOL (Shockwave Ring, Beam Cylinder, Projectile, Particles)
    // ========================================================================
    const vfxGroup = new THREE.Group();
    scene.add(vfxGroup);

    // Expanding 3D Shockwave Ring
    const shockwaveMat = new THREE.MeshBasicMaterial({
      color: '#fde047',
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    const shockwaveMesh = new THREE.Mesh(
      new THREE.RingGeometry(0.35, 0.72, 32),
      shockwaveMat
    );
    shockwaveMesh.rotation.x = -Math.PI / 2;
    shockwaveMesh.visible = false;
    vfxGroup.add(shockwaveMesh);
    const shockwaveState = {
      active: false,
      startTime: 0,
      maxScale: 3.2,
    };

    triggerShockwaveRef.current = (
      pos: THREE.Vector3,
      colorHex: string,
      maxScale = 3.2
    ) => {
      shockwaveState.active = true;
      shockwaveState.startTime = performance.now();
      shockwaveState.maxScale = maxScale;
      shockwaveMesh.position.set(pos.x, 0.08, pos.z);
      shockwaveMesh.scale.setScalar(0.2);
      shockwaveMat.color.set(colorHex);
      shockwaveMat.opacity = 0.95;
      shockwaveMesh.visible = true;
    };

    // Signature Move Plasma Beam Cylinder (for Emperor's Rage / Charm Beam)
    const beamMat = new THREE.MeshBasicMaterial({
      color: '#ef4444',
      transparent: true,
      opacity: 0.9,
    });
    const beamMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.28, 1, 16),
      beamMat
    );
    beamMesh.visible = false;
    vfxGroup.add(beamMesh);

    // Signature Move 3D Projectile (for Cannon Blast, Rolling Thunder, Poison Needle, Charm Ring)
    const projMat = new THREE.MeshStandardMaterial({
      color: '#f97316',
      emissive: '#ef4444',
      emissiveIntensity: 1.2,
      roughness: 0.2,
    });
    const projectileMesh = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.42, 1),
      projMat
    );
    projectileMesh.visible = false;
    vfxGroup.add(projectileMesh);

    // Zero-GC 3D Particle Burst Pool (36 particles)
    const PARTICLE_COUNT = 36;
    const particlePool: Array<{
      mesh: THREE.Mesh;
      mat: THREE.MeshBasicMaterial;
      vel: THREE.Vector3;
      life: number;
      maxLife: number;
    }> = [];
    const pGeo = new THREE.OctahedronGeometry(0.14, 0);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const pMat = new THREE.MeshBasicMaterial({
        color: '#fde047',
        transparent: true,
        opacity: 0,
      });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.visible = false;
      vfxGroup.add(pMesh);
      particlePool.push({
        mesh: pMesh,
        mat: pMat,
        vel: new THREE.Vector3(),
        life: 0,
        maxLife: 0.5,
      });
    }

    spawnBurstRef.current = (
      pos: THREE.Vector3,
      colorHex: string,
      count = 18,
      speed = 5.5
    ) => {
      let spawned = 0;
      for (const p of particlePool) {
        if (p.life <= 0 && spawned < count) {
          p.life = 0.48 + Math.random() * 0.25;
          p.maxLife = p.life;
          p.mesh.position.copy(pos).add(new THREE.Vector3(0, 0.45, 0));
          const angle = Math.random() * Math.PI * 2;
          const up = 2.2 + Math.random() * 3.8;
          const out = (0.4 + Math.random() * 0.8) * speed;
          p.vel.set(Math.cos(angle) * out, up, Math.sin(angle) * out);
          p.mat.color.set(colorHex);
          p.mat.opacity = 1;
          p.mesh.scale.setScalar(0.8 + Math.random() * 0.8);
          p.mesh.visible = true;
          spawned++;
        }
      }
    };

    // ========================================================================
    // MANAGE 3D INSECTOR RIGS
    // ========================================================================
    const rigsMap = new Map<string, { rig: Insector3DRig; speciesId: string }>();
    const unitsGroup = new THREE.Group();
    scene.add(unitsGroup);

    // Raycaster for direct 3D mouse interaction on tiles and bugs
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const getTileFromPointerEvent = (
      e: MouseEvent
    ): { col: number; row: number } | null => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(tileMeshes, false);
      if (hits.length > 0) {
        const { col, row } = hits[0].object.userData as {
          col: number;
          row: number;
        };
        return { col, row };
      }
      return null;
    };

    const handlePointerMove = (e: MouseEvent) => {
      if (stateRef.current.isTitleBackdrop) return;
      const hit = getTileFromPointerEvent(e);
      setHoveredTile((prev) => {
        if (!hit && !prev) return null;
        if (hit && prev && hit.col === prev.col && hit.row === prev.row)
          return prev;
        stateRef.current.onTileHover?.(hit);
        return hit;
      });
    };

    const handlePointerDown = (e: MouseEvent) => {
      if (stateRef.current.isTitleBackdrop) return;
      const hit = getTileFromPointerEvent(e);
      if (hit) {
        stateRef.current.onTileClick(hit.col, hit.row);
      }
    };

    renderer.domElement.addEventListener('mousemove', handlePointerMove);
    renderer.domElement.addEventListener('click', handlePointerDown);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.render(scene, camera);
    };
    window.addEventListener('resize', handleResize);

    // Project 30 board tiles to screen space periodically for the accessible button grid
    let lastTileProjectTime = 0;

    // Software WebGL frame pacing helper (`afterDraw`) so headless Chromium never stalls
    let rafId = 0;
    let timeoutId = 0;
    let disposed = false;
    const gl = renderer.getContext() as WebGL2RenderingContext;

    const afterDraw = (cb: (now: number) => void) => {
      if (disposed) return;
      window.clearTimeout(timeoutId);
      cancelAnimationFrame(rafId);
      if (isSoftwareGl) {
        timeoutId = window.setTimeout(() => {
          if (!disposed) rafId = requestAnimationFrame(cb);
        }, 48);
      } else {
        rafId = requestAnimationFrame(cb);
      }
    };

    let prevTime = performance.now();

    const tick = (now: number, scheduleNext = true) => {
      if (disposed) return;
      const rawDt = Math.min(0.05, Math.max(0.001, (now - prevTime) / 1000));
      prevTime = now;

      // Sim-level hitstop freeze (freezes bug motion for ~65ms on heavy impact while camera shake continues!)
      const inHitstop = now < hitstopUntilRef.current;
      const simDt = inHitstop ? 0 : rawDt;

      const {
        units: curUnits,
        selectedUnit: curSelected,
        targetedUnit: curTargeted,
        validMoves: curMoves,
        attackTargets: curAttacks,
        specialTargets: curSpecials,
        previewTiles: curPreviewTiles,
        previewType: curPreviewType,
        moveOriginTile: curMoveOrigin,
        actionMode: curMode,
        cameraMode: curCamMode,
        isTitleBackdrop: curTitle,
        enableScreenShake: curShake,
        enableParticles: curParticles,
        hoveredTile: curHover,
      } = stateRef.current;

      // 1. Update 3D Neo-16 Tactical Tile Overlays & Dust Motes
      ambientSpores.visible = Boolean(curParticles);
      ambientSpores.rotation.y = now * 0.00015;
      ambientSpores.position.y = Math.sin(now * 0.001) * 0.18;

      for (let row = 0; row < BOARD_ROWS; row++) {
        for (let col = 0; col < BOARD_COLS; col++) {
          const ov = tileOverlayMap.get(`${col},${row}`);
          if (!ov) continue;

          const isMove = curMoves.some((m) => m.col === col && m.row === row);
          const isPreviewTile = curPreviewTiles.some(
            (p) => p.col === col && p.row === row
          );
          const isSpecialTile =
            curMode === 'special' &&
            curSpecials.some((t) => t.col === col && t.row === row);
          const isAttackTile =
            (curMode === 'move_or_attack' || curMode === 'attack_confirm') &&
            curAttacks.some((t) => t.col === col && t.row === row);
          const isSelectedTile =
            curSelected && curSelected.col === col && curSelected.row === row;
          const isOriginTile =
            curMoveOrigin &&
            curMoveOrigin.col === col &&
            curMoveOrigin.row === row;
          const isHovered =
            curHover && curHover.col === col && curHover.row === row;

          const isPlayerUnitTile = curUnits.some(
            (u) => !u.defeated && u.team === 'player' && u.col === col && u.row === row
          );
          const isEnemyThreatTile = curUnits.some(
            (u) =>
              !u.defeated &&
              u.team === 'enemy' &&
              Math.abs(u.col - col) <= 1 &&
              row >= u.row &&
              row <= Math.min(2, u.row + 1)
          );

          const pulse = 0.86 + 0.14 * Math.sin(now * 0.008 + col * 0.5 + row * 0.5);

          if (isPreviewTile) {
            // [F-04] Hover AoE / Range Preview from Attack or Signature Move button
            const previewHex =
              curPreviewType === 'attack' ? '#FF6E4A' : '#FFB838';
            ov.outerFrame.visible = true;
            ov.innerPlate.visible = true;
            ov.outerMat.color.set(previewHex);
            ov.outerMat.emissive.set(previewHex);
            ov.outerMat.opacity = 0.96 * pulse;
            ov.innerMat.color.set(previewHex);
            ov.innerMat.opacity = 0.88 * pulse;
          } else if (isSpecialTile) {
            // Valid Signature Target: Lantern Gold (#FFB838)
            ov.outerFrame.visible = true;
            ov.innerPlate.visible = true;
            ov.outerMat.color.set('#FFB838');
            ov.outerMat.emissive.set('#FFB838');
            ov.outerMat.opacity = 0.95 * pulse;
            ov.innerMat.color.set('#FFD269');
            ov.innerMat.opacity = 0.9 * pulse;
          } else if (isAttackTile) {
            // Valid Attack Target: Luminous Coral-Orange Rune (#FF6E4A)
            ov.outerFrame.visible = true;
            ov.innerPlate.visible = true;
            ov.outerMat.color.set('#FF6E4A');
            ov.outerMat.emissive.set('#FF6E4A');
            ov.outerMat.opacity = 0.95 * pulse;
            ov.innerMat.color.set('#FF6E4A');
            ov.innerMat.opacity = 0.9 * pulse;
          } else if (isMove && curMode === 'move_or_attack') {
            // Valid Move Destination: Luminous Mint-Emerald Carved Rune (#4FFFB0)
            ov.outerFrame.visible = true;
            ov.innerPlate.visible = true;
            ov.outerMat.color.set('#4FFFB0');
            ov.outerMat.emissive.set('#4FFFB0');
            ov.outerMat.opacity = 0.92 * pulse;
            ov.innerMat.color.set('#4FFFB0');
            ov.innerMat.opacity = 0.84 * pulse;
          } else if (isSelectedTile || isPlayerUnitTile) {
            // Active / Allied Unit Territory Tile: Glowing Mint-Emerald Rune Pad
            ov.outerFrame.visible = Boolean(isSelectedTile);
            ov.innerPlate.visible = true;
            ov.outerMat.color.set('#FFB838');
            ov.outerMat.emissive.set('#FFB838');
            ov.outerMat.opacity = 0.92;
            ov.innerMat.color.set('#4FFFB0');
            ov.innerMat.opacity = isSelectedTile ? 0.88 : 0.62;
          } else if (isEnemyThreatTile) {
            // Rival Territory / Threat Zone Tile: Glowing Warm Coral-Orange Rune Pad (matches upper-right of reference image!)
            ov.outerFrame.visible = false;
            ov.innerPlate.visible = true;
            ov.innerMat.color.set('#FF6E4A');
            ov.innerMat.opacity = 0.68 * pulse;
          } else if (isOriginTile) {
            // [F-05] Previous Origin Tile (Click to Undo Move)
            ov.outerFrame.visible = true;
            ov.innerPlate.visible = true;
            ov.outerMat.color.set('#3CE8FF');
            ov.outerMat.emissive.set('#3CE8FF');
            ov.outerMat.opacity = 0.75 * pulse;
            ov.innerMat.color.set('#3CE8FF');
            ov.innerMat.opacity = 0.65 * pulse;
          } else if (isHovered) {
            ov.outerFrame.visible = true;
            ov.innerPlate.visible = true;
            ov.outerMat.color.set('#F4F9F5');
            ov.outerMat.emissive.set('#4FFFB0');
            ov.outerMat.opacity = 0.7;
            ov.innerMat.color.set('#A6FFD6');
            ov.innerMat.opacity = 0.55;
          } else {
            ov.outerFrame.visible = false;
            ov.innerPlate.visible = false;
          }
        }
      }

      // 2. Sync & Animate 3D Insector Rigs + Choreographed Signature Moves
      const activeIds = new Set<string>();
      const choreo = choreographyRef.current;
      const choreoProgress = choreo
        ? Math.min(1, (now - choreo.startTime) / choreo.duration)
        : 0;

      // Trigger impact hitstop, camera trauma, shockwave & particle burst at peak of choreography
      if (choreo && !choreo.impactTriggered && choreoProgress >= 0.40) {
        choreo.impactTriggered = true;
        hitstopUntilRef.current = now + (choreo.isRingOut ? 160 : choreo.type === 'special' ? 130 : 85);
        traumaRef.current = Math.min(
          1.0,
          traumaRef.current +
            (choreo.isRingOut ? 0.98 : choreo.type === 'special' ? 0.85 : 0.65)
        );
        if (choreo.targetId) {
          unitFlashMapRef.current.set(choreo.targetId, now + 320);
        }
        const burstColor =
          choreo.signatureId === 'healing_jig'
            ? '#4ade80'
            : choreo.signatureId === 'charm_beam'
              ? '#f472b6'
              : choreo.signatureId === 'poison_needle'
                ? '#a855f7'
                : choreo.signatureId === 'sickle_dance'
                  ? '#22c55e'
                  : choreo.signatureId === 'sky_dive'
                    ? '#38bdf8'
                    : '#fbbf24';
        spawnBurstRef.current?.(
          choreo.toWorld,
          burstColor,
          choreo.type === 'special' ? 26 : 16,
          choreo.type === 'special' ? 6.8 : 4.8
        );
        triggerShockwaveRef.current?.(
          choreo.toWorld,
          burstColor,
          choreo.type === 'special' ? 3.8 : 2.4
        );
      }

      if (choreo && choreoProgress >= 1) {
        choreographyRef.current = null;
        beamMesh.visible = false;
        projectileMesh.visible = false;
      }

      // Default hide beam & projectile unless active in current choreography frame
      beamMesh.visible = false;
      projectileMesh.visible = false;

      for (const unit of curUnits) {
        // Keep Ring-Out unit visible while falling into the abyss during choreography
        const isFallingRingOut =
          choreo && choreo.isRingOut && choreo.targetId === unit.id;
        if (unit.defeated && !isFallingRingOut) continue;

        activeIds.add(unit.id);
        let entry = rigsMap.get(unit.id);
        if (!entry || entry.speciesId !== unit.speciesId) {
          if (entry) unitsGroup.remove(entry.rig.root);
          const spec = getSpecies(unit.speciesId);
          const newRig = createInsector3DRig(spec, unit.team, unit.isKing);
          unitsGroup.add(newRig.root);
          entry = { rig: newRig, speciesId: unit.speciesId };
          rigsMap.set(unit.id, entry);
          const initWorld = boardToWorld(unit.col, unit.row, 0);
          newRig.root.position.copy(initWorld);
          newRig.root.rotation.y =
            unit.team === 'player' ? Math.PI / 2 : -Math.PI / 2;
        }

        const { rig } = entry;
        rig.crownGroup.visible = unit.isKing;
        rig.shieldDome.visible = unit.status.shield > 0;
        if (rig.shieldDome.visible) {
          rig.shieldDome.rotation.y = now * 0.002;
        }

        // Update Team Ring color (#52E59B Meadow Mint vs #F05A46 Scorpion Coral)
        const teamRingMat = rig.teamRing.material as THREE.MeshBasicMaterial;
        teamRingMat.color.set(unit.team === 'player' ? '#52E59B' : '#F05A46');

        // Selection / Target Outer Halo (#FFB838 Lantern Gold for selected unit!)
        const haloMat = rig.selectionHalo.material as THREE.MeshBasicMaterial;
        if (curSelected?.id === unit.id) {
          haloMat.color.set('#FFB838');
          haloMat.opacity = 0.95;
          rig.selectionHalo.scale.setScalar(1.06 + 0.08 * Math.sin(now * 0.01));
        } else if (curTargeted?.id === unit.id) {
          haloMat.color.set('#F05A46');
          haloMat.opacity = 0.88;
          rig.selectionHalo.scale.setScalar(1.02 + 0.06 * Math.sin(now * 0.01));
        } else {
          haloMat.opacity = 0;
        }

        // Hit flash emissive highlight when struck (preserving base rune glow when not flashing)
        const flashUntil = unitFlashMapRef.current.get(unit.id) || 0;
        const isFlashing = now < flashUntil;
        for (const mat of rig.materials) {
          if (isFlashing) {
            mat.emissive.set('#ffffff');
            mat.emissiveIntensity = 0.95;
          } else {
            if (mat.userData.baseEmissive) {
              mat.emissive.copy(mat.userData.baseEmissive);
            } else {
              mat.emissive.set('#000000');
            }
            mat.emissiveIntensity = mat.userData.baseEmissiveIntensity ?? 0;
          }
        }

        // Reset local pose transforms before applying idle/choreography
        const targetBoardPos = boardToWorld(unit.col, unit.row, 0);
        rig.bodyGroup.position.set(
          0,
          rig.baseY +
            Math.sin(now * 0.005 + unit.slotIndex) *
              (rig.isHoveringSpecies ? 0.1 : 0.03),
          0
        );
        rig.bodyGroup.rotation.set(0, 0, 0);
        rig.weaponGroup.position.set(0, 0, 0);
        rig.weaponGroup.rotation.set(0, 0, 0);

        // Animate legs & wings rhythmically
        const distToTarget = rig.root.position.distanceTo(targetBoardPos);
        const legSpeed = distToTarget > 0.06 ? 0.028 : 0.006;
        const legAmp = distToTarget > 0.06 ? 0.36 : 0.07;
        rig.legs.forEach((leg, idx) => {
          leg.rotation.y =
            Math.sin(now * legSpeed + idx * 1.2) * legAmp * (idx % 2 === 0 ? 1 : -1);
        });
        rig.wings.forEach((wing, idx) => {
          const side = idx % 2 === 0 ? -1 : 1;
          wing.rotation.z =
            side *
            (0.28 +
              Math.sin(now * (rig.isHoveringSpecies ? 0.035 : 0.012)) *
                (rig.isHoveringSpecies ? 0.28 : 0.08));
        });

        // Smoothly interpolate board position
        if (!inHitstop) {
          rig.root.position.lerp(targetBoardPos, Math.min(1, simDt * 11));
          const defaultYaw =
            unit.team === 'player' ? Math.PI / 2 : -Math.PI / 2;
          rig.root.rotation.y = THREE.MathUtils.lerp(
            rig.root.rotation.y,
            defaultYaw,
            Math.min(1, simDt * 8)
          );
        }

        // ====================================================================
        // BESPOKE 3D SIGNATURE MOVE & ATTACK CHOREOGRAPHY PER SPECIES
        // ====================================================================
        if (choreo && choreo.attackerId === unit.id) {
          const p = choreoProgress;
          const sig = choreo.signatureId;
          const dir = new THREE.Vector3()
            .subVectors(choreo.toWorld, choreo.fromWorld)
            .normalize();
          const attackYaw = Math.atan2(dir.x, dir.z);
          rig.root.rotation.y = attackYaw;

          if (choreo.type === 'attack') {
            // Heavy Physical Strike with deliberate windup (0..0.35), lunging strike (0.35..0.68), and recovery
            if (p < 0.35) {
              const w = p / 0.35;
              rig.root.position.lerpVectors(
                choreo.fromWorld,
                choreo.fromWorld.clone().addScaledVector(dir, -0.42),
                w
              );
              rig.bodyGroup.rotation.x = 0.3 * w;
              rig.weaponGroup.rotation.x = 0.22 * w;
            } else if (p < 0.70) {
              const strikeT = (p - 0.35) / 0.35;
              const strike = Math.sin(strikeT * Math.PI);
              rig.root.position.lerpVectors(
                choreo.fromWorld,
                choreo.toWorld.clone().addScaledVector(dir, -0.45),
                strike
              );
              rig.weaponGroup.rotation.x = -0.75 * Math.sin(strikeT * Math.PI);
              rig.bodyGroup.rotation.x = -0.25 * strike;
            } else {
              const recT = (p - 0.70) / 0.30;
              rig.root.position.lerpVectors(
                choreo.toWorld.clone().addScaledVector(dir, -0.45),
                choreo.fromWorld,
                recT
              );
            }
          } else {
            // 12 UNIQUE 3D SIGNATURE MOVE ANIMATIONS!
            switch (sig) {
              case 'crushing_horn': {
                // 1. BIG ASS BUG: Deep crouch -> Supersonic charge -> Upward Horn Flip!
                const rush = Math.sin(Math.min(1, p * 1.35) * Math.PI);
                rig.root.position.lerpVectors(
                  choreo.fromWorld,
                  choreo.toWorld.clone().addScaledVector(dir, -0.45),
                  rush
                );
                rig.bodyGroup.rotation.x = p < 0.35 ? 0.38 : -0.55 * Math.sin(p * Math.PI);
                rig.weaponGroup.rotation.x = -0.75 * Math.sin(p * Math.PI);
                break;
              }

              case 'fortress_quake': {
                // 2. AGAMEL: High leap into the air -> Seismic slam & 3D Shield Dome expansion!
                const jumpArc = p < 0.45 ? Math.sin((p / 0.45) * (Math.PI / 2)) : Math.max(0, 1 - (p - 0.45) * 4);
                rig.bodyGroup.position.y = rig.baseY + jumpArc * 1.95;
                rig.bodyGroup.rotation.y = p * Math.PI * 2;
                rig.shieldDome.visible = true;
                rig.shieldDome.scale.setScalar(1.4 + 0.5 * Math.sin(p * Math.PI));
                break;
              }

              case 'emperor_rage': {
                // 3. DARK EMPEROR: Sovereign levitation + wing flare + 3D Crimson-Gold Plasma Beam!
                rig.bodyGroup.position.y = rig.baseY + Math.sin(p * Math.PI) * 1.25;
                rig.wings.forEach((w, idx) => {
                  w.rotation.z = (idx % 2 === 0 ? -1 : 1) * 0.85;
                });
                if (p >= 0.25 && p <= 0.85) {
                  beamMesh.visible = true;
                  beamMat.color.set(p % 0.1 < 0.05 ? '#ef4444' : '#fbbf24');
                  const startB = choreo.fromWorld.clone().add(new THREE.Vector3(0, 0.75, 0));
                  const endB = choreo.toWorld.clone().add(new THREE.Vector3(0, 0.55, 0));
                  const dist = startB.distanceTo(endB);
                  beamMesh.scale.set(
                    0.8 + 0.5 * Math.sin(p * 20),
                    dist,
                    0.8 + 0.5 * Math.sin(p * 20)
                  );
                  beamMesh.position.lerpVectors(startB, endB, 0.5);
                  beamMesh.quaternion.setFromUnitVectors(
                    new THREE.Vector3(0, 1, 0),
                    endB.clone().sub(startB).normalize()
                  );
                }
                break;
              }

              case 'charm_beam': {
                // 4. NOBLE FAERIE: Spiral Knight Lance spin + glowing magenta Charm Rings!
                rig.bodyGroup.position.y = rig.baseY + 0.65 * Math.sin(p * Math.PI);
                rig.weaponGroup.rotation.z = p * Math.PI * 8;
                if (p >= 0.2 && p <= 0.85) {
                  const tProj = (p - 0.2) / 0.65;
                  projectileMesh.visible = true;
                  projMat.color.set('#ec4899');
                  projMat.emissive.set('#f472b6');
                  projectileMesh.position.lerpVectors(
                    choreo.fromWorld,
                    choreo.toWorld,
                    tProj
                  );
                  projectileMesh.position.y =
                    0.75 + Math.sin(tProj * Math.PI * 3) * 0.35;
                  projectileMesh.rotation.set(tProj * 10, tProj * 12, 0);
                }
                break;
              }

              case 'sickle_dance': {
                // 5. TORNADO MANTIS: 720-degree high-speed cyclone spin through the enemy!
                const dash = Math.sin(p * Math.PI);
                rig.root.position.lerpVectors(
                  choreo.fromWorld,
                  choreo.toWorld.clone().addScaledVector(dir, -0.3),
                  dash
                );
                rig.bodyGroup.rotation.y = p * Math.PI * 6;
                rig.weaponGroup.rotation.x = Math.sin(p * 25) * 0.65;
                break;
              }

              case 'scissor_throw': {
                // 6. MICK STAGGER: Clamps mandibles & executes overhead suplex throw!
                const grab = Math.sin(Math.min(1, p * 1.4) * Math.PI);
                rig.root.position.lerpVectors(
                  choreo.fromWorld,
                  choreo.toWorld.clone().addScaledVector(dir, -0.45),
                  grab
                );
                rig.bodyGroup.rotation.x = -Math.sin(p * Math.PI) * 0.75;
                rig.weaponGroup.scale.set(
                  1 + 0.25 * Math.sin(p * Math.PI),
                  1,
                  1.2
                );
                break;
              }

              case 'body_blow': {
                // 7. DRILLERPILLAR: Burrows underground (y < 0) and erupts beneath the target!
                if (p < 0.35) {
                  rig.bodyGroup.position.y = -(p / 0.35) * 1.1;
                  rig.bodyGroup.rotation.x = 0.6;
                } else if (p < 0.75) {
                  const emerge = Math.sin(((p - 0.35) / 0.4) * Math.PI);
                  rig.root.position.copy(
                    choreo.toWorld.clone().addScaledVector(dir, -0.3)
                  );
                  rig.bodyGroup.position.y = -0.6 + emerge * 1.75;
                  rig.bodyGroup.rotation.x = -0.65;
                }
                break;
              }

              case 'cannon_blast': {
                // 8. BAZOO BEETLE: Dorsal mortar recoil + high ballistic 3D artillery shell!
                rig.weaponGroup.position.z = -0.35 * Math.sin(p * Math.PI);
                rig.bodyGroup.rotation.x = -0.25 * Math.sin(p * Math.PI);
                if (p >= 0.15 && p <= 0.75) {
                  const tShell = (p - 0.15) / 0.6;
                  projectileMesh.visible = true;
                  projMat.color.set('#f59e0b');
                  projMat.emissive.set('#ef4444');
                  projectileMesh.position.lerpVectors(
                    choreo.fromWorld,
                    choreo.toWorld,
                    tShell
                  );
                  projectileMesh.position.y =
                    0.85 + Math.sin(tShell * Math.PI) * 2.65;
                  projectileMesh.scale.setScalar(0.95);
                }
                break;
              }

              case 'poison_needle': {
                // 9. BEE BEE KING: High-altitude hover + rapid venomous stinger barrage!
                rig.bodyGroup.position.y = rig.baseY + 1.15 * Math.sin(p * Math.PI);
                rig.bodyGroup.rotation.x = 0.45 * Math.sin(p * Math.PI);
                if (p >= 0.18 && p <= 0.75) {
                  const tNeedle = (p - 0.18) / 0.57;
                  projectileMesh.visible = true;
                  projMat.color.set('#a855f7');
                  projMat.emissive.set('#c084fc');
                  projectileMesh.position.lerpVectors(
                    choreo.fromWorld.clone().add(new THREE.Vector3(0, 1.1, 0)),
                    choreo.toWorld.clone().add(new THREE.Vector3(0, 0.4, 0)),
                    tNeedle
                  );
                  projectileMesh.scale.set(0.35, 0.35, 1.4);
                  projectileMesh.lookAt(choreo.toWorld);
                }
                break;
              }

              case 'healing_jig': {
                // 10. LOVELY LADY: Radiant pirouette dance + starlight aura!
                rig.bodyGroup.position.y =
                  rig.baseY + Math.abs(Math.sin(p * Math.PI * 3)) * 0.85;
                rig.bodyGroup.rotation.y = p * Math.PI * 4;
                rig.bodyGroup.rotation.z = Math.sin(p * Math.PI * 4) * 0.28;
                break;
              }

              case 'sky_dive': {
                // 11. ITSAPEGASUS: Ascends high into the stadium lights -> Meteor dive-bomb!
                if (p < 0.42) {
                  const ascend = p / 0.42;
                  rig.bodyGroup.position.y = rig.baseY + ascend * 3.1;
                  rig.bodyGroup.rotation.x = -0.55;
                } else if (p < 0.82) {
                  const dive = (p - 0.42) / 0.4;
                  rig.root.position.lerpVectors(
                    choreo.fromWorld,
                    choreo.toWorld.clone().addScaledVector(dir, -0.35),
                    dive
                  );
                  rig.bodyGroup.position.y = rig.baseY + (1 - dive) * 3.1;
                  rig.bodyGroup.rotation.x = 0.75;
                }
                break;
              }

              case 'rolling_thunder':
              default: {
                // 12. ROCK 'N' ROLLER: Bowls a spinning giant molten boulder across the board!
                rig.bodyGroup.rotation.x = 0.32 * Math.sin(p * Math.PI);
                if (rig.boulderProp) rig.boulderProp.visible = p < 0.15 || p > 0.85;
                if (p >= 0.15 && p <= 0.85) {
                  const tRoll = (p - 0.15) / 0.7;
                  projectileMesh.visible = true;
                  projMat.color.set('#b45309');
                  projMat.emissive.set('#f97316');
                  projectileMesh.position.lerpVectors(
                    choreo.fromWorld,
                    choreo.toWorld,
                    tRoll
                  );
                  projectileMesh.position.y = 0.48;
                  projectileMesh.scale.setScalar(1.35);
                  projectileMesh.rotation.x = tRoll * Math.PI * 6;
                }
                break;
              }
            }
          }
        }

        // Target Reaction Choreography (Suplex arc, Parabolic Horn launch, or Ring-Out plunge!)
        if (choreo && choreo.targetId === unit.id && choreoProgress >= 0.38) {
          const rp = (choreoProgress - 0.38) / 0.62;
          if (choreo.signatureId === 'scissor_throw' && choreo.knockbackWorld) {
            // Overhead 180-degree suplex arc behind Mick Stagger
            rig.root.position.lerpVectors(
              choreo.toWorld,
              choreo.knockbackWorld,
              rp
            );
            rig.bodyGroup.position.y = Math.sin(rp * Math.PI) * 2.45;
            rig.bodyGroup.rotation.x = rp * Math.PI * 2;
          } else if (choreo.isRingOut && choreo.knockbackWorld) {
            // Dramatic Ring-Out launch over the parapet and down into the abyss trench!
            rig.root.position.lerpVectors(
              choreo.toWorld,
              choreo.knockbackWorld,
              rp
            );
            rig.bodyGroup.position.y =
              Math.sin(rp * Math.PI) * 1.65 - rp * rp * 2.8;
            rig.bodyGroup.rotation.x = rp * 5.0;
            rig.bodyGroup.rotation.z = rp * 3.5;
          } else if (choreo.signatureId === 'crushing_horn') {
            // High vertical horn flip
            rig.bodyGroup.position.y = Math.sin(rp * Math.PI) * 1.85;
            rig.bodyGroup.rotation.x = -rp * Math.PI * 2;
          } else {
            // Heavy hit recoil shudder
            rig.bodyGroup.rotation.x = -Math.sin(rp * Math.PI * 2) * 0.38;
          }
        }
      }

      // Remove defeated rigs that are no longer in activeIds
      for (const [uid, entry] of rigsMap.entries()) {
        if (!activeIds.has(uid)) {
          unitsGroup.remove(entry.rig.root);
          rigsMap.delete(uid);
        }
      }

      // 3. Update 3D Shockwave & Particle Pool
      if (shockwaveState.active) {
        const sp = (now - shockwaveState.startTime) / 480;
        if (sp >= 1) {
          shockwaveState.active = false;
          shockwaveMesh.visible = false;
        } else {
          shockwaveMesh.scale.setScalar(
            0.25 + sp * shockwaveState.maxScale
          );
          shockwaveMat.opacity = (1 - sp) * 0.9;
        }
      }

      for (const p of particlePool) {
        if (p.life > 0) {
          p.life -= rawDt;
          if (p.life <= 0) {
            p.mesh.visible = false;
          } else {
            p.vel.y -= 12.5 * rawDt; // gravity
            p.mesh.position.addScaledVector(p.vel, rawDt);
            if (p.mesh.position.y < 0.05) {
              p.mesh.position.y = 0.05;
              p.vel.y *= -0.45;
            }
            p.mesh.rotation.x += 6 * rawDt;
            p.mesh.rotation.y += 8 * rawDt;
            p.mat.opacity = Math.max(0, p.life / p.maxLife);
          }
        }
      }

      // 4. Dynamic 3D Camera Choreography, Victory MVP Orbit & Trauma Shake
      const desiredCamPos = new THREE.Vector3();
      const desiredLookAt = new THREE.Vector3();
      const curWinner = stateRef.current.winner;

      if (curWinner) {
        // Victory / Defeat MVP Orbit Camera rotating around the winning King
        const mvpUnit =
          curUnits.find((u) => u.team === curWinner && u.isKing && !u.defeated) ||
          curUnits.find((u) => u.team === curWinner && !u.defeated);
        const mvpPos = mvpUnit
          ? boardToWorld(mvpUnit.col, mvpUnit.row, 0.5)
          : new THREE.Vector3(0, 0.5, 0);
        const orbitAng = now * 0.00085;
        desiredCamPos.set(
          mvpPos.x + Math.sin(orbitAng) * 4.4,
          4.2,
          mvpPos.z + Math.cos(orbitAng) * 4.4
        );
        desiredLookAt.copy(mvpPos);
      } else if (curTitle) {
        // Key Art Framing on Main Menu: Diagonal view of the Bio-Dome Conservatory shifted right of menu card
        const orbitAngle = now * 0.0002;
        desiredCamPos.set(
          -7.8 + Math.sin(orbitAngle) * 0.7,
          12.8,
          11.8 + Math.cos(orbitAngle) * 0.4
        );
        desiredLookAt.set(-1.95, -0.35, 0.5);
      } else if (choreo && choreoProgress < 0.88) {
        // Dynamic Action Camera: Zooms and angles toward the active combat clash
        const mid = new THREE.Vector3()
          .addVectors(choreo.fromWorld, choreo.toWorld)
          .multiplyScalar(0.5);
        desiredLookAt.set(mid.x * 0.75, 0.45, mid.z * 0.75);
        desiredCamPos.set(
          mid.x * 0.65 - 4.4,
          choreo.type === 'special' ? 8.4 : 9.2,
          mid.z * 0.55 + 8.2
        );
      } else if (curCamMode === 'topdown') {
        // [S-01] 2D Top-Down Tactical View for crystal-clear 5x6 spatial orientation
        desiredCamPos.set(0, 19.2, 1.05);
        desiredLookAt.set(0, -0.25, 0.25);
      } else if (curCamMode === 'isometric') {
        // Alternate East-Diagonal Isometric Camera
        desiredCamPos.set(8.6, 13.0, 11.0);
        desiredLookAt.set(-0.05, -0.3, 0.15);
      } else if (curCamMode === 'cinematic' && curSelected) {
        const selW = boardToWorld(curSelected.col, curSelected.row, 0);
        desiredCamPos.set(selW.x - 4.8, 9.6, selW.z + 7.6);
        desiredLookAt.set(selW.x * 0.4, 0.15, selW.z * 0.4);
      } else {
        // Default 3D Tactical Camera: Framed cleanly in desktop viewport with zero HUD overlap
        desiredCamPos.set(-9.2, 13.6, 11.6);
        desiredLookAt.set(0.05, -0.5, 0.15);
      }

      if (Boolean(curTitle) !== prevTitleState) {
        prevTitleState = Boolean(curTitle);
        currentCamPos.copy(desiredCamPos);
        currentLookAt.copy(desiredLookAt);
      } else {
        currentCamPos.lerp(desiredCamPos, Math.min(1, rawDt * 6.5));
        currentLookAt.lerp(desiredLookAt, Math.min(1, rawDt * 7.5));
      }

      camera.position.copy(currentCamPos);
      if (curShake && traumaRef.current > 0.001) {
        const shake = traumaRef.current * traumaRef.current * 0.38;
        camera.position.x += (Math.random() - 0.5) * 2 * shake;
        camera.position.y += (Math.random() - 0.5) * 2 * shake;
        traumaRef.current = Math.max(0, traumaRef.current - rawDt * 2.4);
      } else {
        traumaRef.current = Math.max(0, traumaRef.current - rawDt * 2.4);
      }
      camera.lookAt(currentLookAt);

      // 5. Render 3D Scene
      renderer.render(scene, camera);

      // 6. Overhead Unit Health Bars (Matches reference image: Circular Left Medallion + Crisp Green/Red HP Bar)
      const canvasW = renderer.domElement.clientWidth || width;
      const canvasH = renderer.domElement.clientHeight || height;

      if (hudOverlayRef.current && !curTitle) {
        const hudItems: ProjectedUnitHUD[] = [];
        for (const unit of curUnits) {
          if (unit.defeated) continue;
          const entry = rigsMap.get(unit.id);
          if (!entry) continue;
          const worldHead = entry.rig.root.position
            .clone()
            .add(
              new THREE.Vector3(
                0,
                entry.rig.isHoveringSpecies ? 1.48 : 1.18,
                0
              )
            );
          worldHead.project(camera);
          const sx = (worldHead.x * 0.5 + 0.5) * canvasW;
          const sy = (-worldHead.y * 0.5 + 0.5) * canvasH;
          hudItems.push({
            id: unit.id,
            name: unit.name,
            team: unit.team,
            hp: unit.hp,
            maxHp: unit.maxHp,
            specialUses: unit.specialUses,
            maxSpecialUses: unit.maxSpecialUses,
            isKing: unit.isKing,
            confusion: unit.status.confusion,
            poison: unit.status.poison,
            shield: unit.status.shield,
            equippedBadge: unit.status.equippedBadge,
            x: sx,
            y: sy,
            visible: worldHead.z < 1,
          });
        }

        hudOverlayRef.current.innerHTML = hudItems
          .filter((h) => h.visible)
          .map((h) => {
            const hpPct = Math.max(0, Math.min(100, (h.hp / h.maxHp) * 100));
            const isSelected = curSelected?.id === h.id;
            const isPrimaryTarget = curTargeted?.id === h.id;
            const isValidTarget =
              curMode === 'special'
                ? curSpecials.some((t) => t.id === h.id)
                : curAttacks.some((t) => t.id === h.id);
            const barColor =
              h.team === 'player'
                ? 'linear-gradient(180deg,#8CE04A,#54A822)'
                : 'linear-gradient(180deg,#FF6E54,#C93824)';
            const badgeBg = h.team === 'player' ? '#468C2B' : '#B83828';
            const badgeBorder = isSelected ? '#FFD24C' : '#C8AA6E';

            // Current Skill Charge (Max 3, consumed when using skill) displayed at the top of each insect
            const maxCharges = 3;
            const curCharges = Math.max(
              0,
              Math.min(
                maxCharges,
                h.specialUses < 0 ? maxCharges : h.specialUses
              )
            );
            const chargePipsHtml = [0, 1, 2]
              .map((idx) => {
                const filled = idx < curCharges;
                return `<span style="width:6px;height:6px;border-radius:999px;display:inline-block;background:${
                  filled ? '#FFB838' : '#26231E'
                };border:1px solid ${
                  filled ? '#FFF2B2' : '#575044'
                };box-shadow:${
                  filled ? '0 0 4px rgba(255,184,56,0.9)' : 'none'
                };"></span>`;
              })
              .join('');

            const statusBadges = [
              h.confusion > 0
                ? `<span style="background:#2A2622;border:1px solid #B36BFF;color:#E2C4FF;font-weight:800;font-size:7px;padding:0 3px;border-radius:3px;">CNF</span>`
                : '',
              h.poison > 0
                ? `<span style="background:#2A2622;border:1px solid #F05A46;color:#FF8575;font-weight:800;font-size:7px;padding:0 3px;border-radius:3px;">PSN</span>`
                : '',
              h.shield > 0
                ? `<span style="background:#2A2622;border:1px solid #3CE8FF;color:#7CEBFF;font-weight:800;font-size:7px;padding:0 3px;border-radius:3px;">SHD</span>`
                : '',
            ]
              .filter(Boolean)
              .join('');

            const targetCallout =
              isValidTarget && isPrimaryTarget
                ? `<div style="background:rgba(184,56,40,0.92);color:#FFF4DC;border:1px solid #FFD269;font-family:'Cinzel',serif;font-weight:800;font-size:7px;padding:0px 4px;border-radius:3px;white-space:nowrap;">🎯 TARGET</div>`
                : '';

            const showChargePill = isSelected || isPrimaryTarget || isValidTarget;
            return `<div style="position:absolute;left:${h.x.toFixed(1)}px;top:${h.y.toFixed(
              1
            )}px;transform:translate(-50%,-100%);pointer-events:none;display:flex;flex-direction:column;align-items:center;gap:1.5px;z-index:${
              isSelected || (isValidTarget && isPrimaryTarget) ? 18 : isValidTarget ? 12 : 5
            };">
              ${targetCallout}
              ${
                statusBadges
                  ? `<div style="display:flex;gap:2px;align-items:center;">${statusBadges}</div>`
                  : ''
              }
              <div data-testid="unit-overhead-charge-${h.id}" style="${
                showChargePill
                  ? `display:flex;align-items:center;gap:2.5px;background:rgba(18,30,36,0.92);border:1px solid ${
                      curCharges > 0 ? '#FFB838' : '#3D5C6B'
                    };border-radius:999px;padding:1px 4px;box-shadow:0 1px 3px rgba(0,0,0,0.75);`
                  : 'opacity:0;height:0;overflow:hidden;pointer-events:none;'
              }">
                <span style="display:inline-flex;align-items:center;gap:2px;">${chargePipsHtml}</span>
                <span style="font-family:'DM Sans',sans-serif;font-size:8px;font-weight:800;line-height:1;color:${
                  curCharges > 0 ? '#FFE5A3' : '#8C857B'
                };">${curCharges}/${maxCharges}</span>
              </div>
              <div style="display:flex;align-items:center;position:relative;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.75));">
                <div style="width:13px;height:13px;border-radius:999px;background:${badgeBg};border:1.5px solid ${badgeBorder};display:flex;align-items:center;justify-content:center;z-index:2;margin-right:-3px;font-size:7px;color:#FFF4DC;font-weight:900;">
                  ${h.isKing ? '👑' : '•'}
                </div>
                <div style="width:42px;height:6px;background:#1E1C18;border:1.5px solid ${
                  isSelected ? '#FFD24C' : '#3A362E'
                };border-radius:3px;overflow:hidden;padding:0.5px;">
                  <div style="width:${hpPct.toFixed(0)}%;height:100%;background:${barColor};border-radius:1px;"></div>
                </div>
              </div>
            </div>`;
          })
          .join('');
      } else if (hudOverlayRef.current) {
        hudOverlayRef.current.innerHTML = '';
      }

      // Render Floating Damage / Signature Callouts
      if (bannerOverlayRef.current) {
        bannersRef.current = bannersRef.current.filter(
          (b) => now - b.createdAt < b.duration
        );
        bannerOverlayRef.current.innerHTML = bannersRef.current
          .map((b) => {
            const p = (now - b.createdAt) / b.duration;
            const wVec = new THREE.Vector3(
              b.worldX,
              b.worldY + p * 1.1,
              b.worldZ
            );
            wVec.project(camera);
            const sx = (wVec.x * 0.5 + 0.5) * canvasW;
            const sy = (-wVec.y * 0.5 + 0.5) * canvasH;
            const alpha = p < 0.8 ? 1 : 1 - (p - 0.8) / 0.2;
            const bounceScale =
              p < 0.16
                ? 0.7 + (p / 0.16) * 0.5
                : p < 0.32
                  ? 1.2 - ((p - 0.16) / 0.16) * 0.2
                  : 1.0;
            const fontSize = b.isCrit ? '26px' : b.isWallSlam ? '23px' : b.isFumble ? '15px' : '20px';
            const textShadow = b.isCrit
              ? '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 0 14px rgba(251,191,36,0.95), 0 4px 8px #000'
              : b.isWallSlam
                ? '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 0 12px rgba(56,189,248,0.95), 0 4px 8px #000'
                : '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 3px 6px rgba(0,0,0,0.95)';

            return `<div style="position:absolute;left:${sx.toFixed(
              1
            )}px;top:${sy.toFixed(
              1
            )}px;transform:translate(-50%,-50%) scale(${bounceScale.toFixed(2)});opacity:${alpha.toFixed(
              2
            )};pointer-events:none;text-align:center;font-family:'Chakra Petch',sans-serif;z-index:25;">
              ${
                b.subText
                  ? `<div style="font-size:${b.isCrit ? '11px' : '10px'};font-weight:900;color:${
                      b.isCrit ? '#fef08a' : b.isWallSlam ? '#bae6fd' : '#fef08a'
                    };text-shadow:0 2px 4px #000;letter-spacing:1px;margin-bottom:1px;">${b.subText}</div>`
                  : ''
              }
              <div style="font-size:${fontSize};font-weight:900;color:${
                b.color
              };text-shadow:${textShadow};">${
                b.text
              }</div>
            </div>`;
          })
          .join('');
      }

      // Project 30 accessible tile buttons every 250ms so playwright-cli and keyboard users can click any square
      if (now - lastTileProjectTime > 250) {
        lastTileProjectTime = now;
        const pts: ProjectedTile[] = [];
        for (let row = 0; row < BOARD_ROWS; row++) {
          for (let col = 0; col < BOARD_COLS; col++) {
            const wp = boardToWorld(col, row, 0.08);
            wp.project(camera);
            pts.push({
              col,
              row,
              x: (wp.x * 0.5 + 0.5) * canvasW,
              y: (-wp.y * 0.5 + 0.5) * canvasH,
            });
          }
        }
        setProjectedTiles(pts);
      }

      if (scheduleNext) {
        afterDraw(tick);
      }
    };

    renderNowRef.current = () => {
      tick(performance.now(), false);
    };

    // Render initial frame immediately so the 3D Sanctuary Bio-Dome is visible from frame 1
    tick(performance.now(), true);

    return () => {
      disposed = true;
      renderNowRef.current = null;
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousemove', handlePointerMove);
      renderer.domElement.removeEventListener('click', handlePointerDown);
      envTarget.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* 1. Three.js WebGL 3D Viewport */}
      <div
        ref={containerRef}
        data-testid="three-arena-canvas"
        className="w-full h-full"
      />

      {/* 2. Projected Overhead Unit Orbs, HP Bars & Status Icons */}
      <div
        ref={hudOverlayRef}
        className="pointer-events-none absolute inset-0 overflow-hidden"
      />

      {/* 3. Projected Floating Damage & Impact Callouts */}
      <div
        ref={bannerOverlayRef}
        className="pointer-events-none absolute inset-0 overflow-hidden"
      />

      {/* 4. [F-03] Compact Faction-Coded Signature Move Callout Pill ([ALLY] Mint/Amber vs [RIVAL] Coral) */}
      {activeSignatureBanner && (
        <div
          className="pointer-events-none fixed inset-x-0 top-14 z-20 flex justify-center px-4"
          aria-live="assertive"
        >
          <div
            className={`neo-panel px-3.5 py-1 border ${
              activeSignatureBanner.team === 'player'
                ? 'border-[#83D6B0] bg-[#171923]/95'
                : 'border-[#EF7168] bg-[#171923]/95'
            } flex items-center gap-2 rounded-full`}
          >
            <span
              className={`px-1.5 py-0.5 rounded font-arcade text-[10px] font-extrabold uppercase ${
                activeSignatureBanner.team === 'player'
                  ? 'bg-[#83D6B0] text-[#171923]'
                  : 'bg-[#EF7168] text-[#171923]'
              }`}
            >
              {activeSignatureBanner.team === 'player' ? 'ALLY' : 'RIVAL'}
            </span>
            <span className="text-[11px] font-arcade font-bold uppercase tracking-wider text-[#FFB547]">
              {activeSignatureBanner.actorName}
            </span>
            <span className="text-[#B7B7AD] text-xs">•</span>
            <span className="font-arcade text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#F4E8C8]">
              {activeSignatureBanner.moveName}!
            </span>
          </div>
        </div>
      )}

      {/* 5. Accessible Projected 30-Tile Interactive Grid Overlay */}
      {!isTitleBackdrop && (
        <div
          className="pointer-events-none absolute inset-0"
          role="grid"
          aria-label="Insectron 5x6 Tactical Board"
        >
          {projectedTiles.map((pt) => {
            const unitOnTile = units.find(
              (u) => !u.defeated && u.col === pt.col && u.row === pt.row
            );
            const isMove = validMoves.some(
              (m) => m.col === pt.col && m.row === pt.row
            );
            const isAtk = attackTargets.some(
              (t) => t.col === pt.col && t.row === pt.row
            );
            const isSpec = specialTargets.some(
              (t) => t.col === pt.col && t.row === pt.row
            );
            const coordName = `${String.fromCharCode(65 + pt.col)}${6 - pt.row}`;
            const labelParts = [`Tile ${coordName}`];
            if (unitOnTile) {
              labelParts.push(
                `${unitOnTile.team === 'player' ? 'Player' : 'Enemy'} ${unitOnTile.name} (${unitOnTile.hp}/${unitOnTile.maxHp} HP)${unitOnTile.isKing ? ' [KING]' : ''}`
              );
            }
            if (isMove) labelParts.push('[Valid Move]');
            if (isAtk) labelParts.push('[Attack Target]');
            if (isSpec && actionMode === 'special')
              labelParts.push('[Special Target]');

            return (
              <button
                key={`${pt.col}-${pt.row}`}
                type="button"
                data-testid={`board-tile-${pt.col}-${pt.row}`}
                aria-label={labelParts.join(' ')}
                onMouseEnter={() => {
                  const next = { col: pt.col, row: pt.row };
                  setHoveredTile(next);
                  onTileHover?.(next);
                }}
                onMouseLeave={() => {
                  setHoveredTile(null);
                  onTileHover?.(null);
                }}
                onClick={() => onTileClick(pt.col, pt.row)}
                style={{
                  position: 'absolute',
                  left: `${pt.x}px`,
                  top: `${pt.y}px`,
                  width: '54px',
                  height: '44px',
                  transform: 'translate(-50%, -50%)',
                }}
                className="pointer-events-auto bg-transparent border-0 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB547] cursor-pointer"
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
