import * as THREE from 'three';
import { InsectorSpecies } from '../game/species';
import { TeamSide } from '../game/rules';

/**
 * 1. PALET SPESIES NEO-BEASTS (Diekstrak dari image_5d0ddf.png & image_5d0dfb.jpg)
 * Menggantikan warna hitam seragam dengan warna matte-satin yang unik per spesies.
 */
export const NEO_BEAST_PALETTES: Record<
  string,
  { primary: number; secondary: number; accent: number; archetype: string }
> = {
  AGAMEL:         { primary: 0x26738d, secondary: 0x1b5266, accent: 0x3ce8ff, archetype: 'beetle_tank' },
  BIG_ASS_BUG:    { primary: 0x3a3548, secondary: 0x262230, accent: 0x9b8ae6, archetype: 'rhino_horn' },
  DARK_EMPEROR:   { primary: 0x2b2d38, secondary: 0x52586e, accent: 0xffb838, archetype: 'stag_king' },
  NOBLE_FAERIE:   { primary: 0x8c2ce6, secondary: 0xd8b4ff, accent: 0xffffff, archetype: 'dragonfly' },
  TORNADO_MANTIS: { primary: 0x4e9a42, secondary: 0xa6e3c5, accent: 0xffe066, archetype: 'mantis' },
  MICK_STAGGER:   { primary: 0xe08232, secondary: 0x6e472b, accent: 0x22252a, archetype: 'earwig' },
  DRILLERPILLAR:  { primary: 0xf27d5e, secondary: 0xd95b3d, accent: 0xffe5d9, archetype: 'larva_segmented' },
  BAZOO_BEETLE:   { primary: 0x525b6c, secondary: 0x363d4a, accent: 0x3ce8ff, archetype: 'artillery_beetle' },
  BEE_BEE_KING:   { primary: 0xb8252a, secondary: 0x282930, accent: 0xffffff, archetype: 'scorpion_wasp' },
  ROCK_N_ROLLER:  { primary: 0x2e313d, secondary: 0x565b6e, accent: 0xa6e3c5, archetype: 'pillbug' },
  LOVELY_LADY:    { primary: 0xf4f4ee, secondary: 0x2d3038, accent: 0xf05a46, archetype: 'weevil_lady' },
  ITSAPEGASUS:    { primary: 0x258ea6, secondary: 0x5ce6ff, accent: 0xffb838, archetype: 'crystal_skitter' },
};

export interface Insector3DRig {
  root: THREE.Group;
  bodyGroup: THREE.Group;
  weaponGroup: THREE.Group;
  crownGroup: THREE.Group;
  legs: THREE.Object3D[];
  wings: THREE.Object3D[];
  teamRing: THREE.Mesh;
  selectionHalo: THREE.Mesh;
  shieldDome: THREE.Mesh;
  boulderProp?: THREE.Mesh;
  materials: THREE.MeshStandardMaterial[];
  baseY: number;
  isHoveringSpecies: boolean;
}

const sharedGeos = {
  sphere: new THREE.SphereGeometry(1, 20, 16),
  box: new THREE.BoxGeometry(1, 1, 1),
  cone: new THREE.ConeGeometry(0.5, 1.2, 14),
  cylinder: new THREE.CylinderGeometry(0.4, 0.5, 1, 16),
  pedestalDisc: new THREE.CylinderGeometry(0.54, 0.58, 0.07, 28),
  capsuleLeg: new THREE.CapsuleGeometry(0.042, 0.2, 4, 8),
  torus: new THREE.TorusGeometry(0.68, 0.065, 10, 32),
  haloTorus: new THREE.TorusGeometry(0.84, 0.05, 10, 36),
  dodeca: new THREE.DodecahedronGeometry(0.55, 1),
  octa: new THREE.OctahedronGeometry(0.5, 0),
};

const sharedEyeMats = {
  sclera: new THREE.MeshBasicMaterial({ color: 0xffffff }),
  pupil: new THREE.MeshBasicMaterial({ color: 0x141619 }),
};

export function createInsector3DRig(
  species: InsectorSpecies,
  team: TeamSide,
  isKing: boolean
): Insector3DRig {
  const root = new THREE.Group();
  const bodyGroup = new THREE.Group();
  const weaponGroup = new THREE.Group();
  const crownGroup = new THREE.Group();
  const legs: THREE.Object3D[] = [];
  const wings: THREE.Object3D[] = [];
  const materials: THREE.MeshStandardMaterial[] = [];

  const registerMat = (params: THREE.MeshStandardMaterialParameters) => {
    const mat = new THREE.MeshStandardMaterial(params);
    mat.userData.baseEmissive = mat.emissive.clone();
    mat.userData.baseEmissiveIntensity = mat.emissiveIntensity;
    materials.push(mat);
    return mat;
  };

  const shape = species.visual.bodyShape;
  const scale = species.visual.scale || 1.0;
  const isAlly = team === 'player';

  // Tactile Toy-Entomology Matte-Satin Materials (roughness 0.65 - 0.78, metalness 0.05 per image_5d0ddf.png)
  const primaryMat = registerMat({
    color: new THREE.Color(species.visual.primaryColor),
    roughness: 0.68,
    metalness: 0.05,
  });
  const secondaryMat = registerMat({
    color: new THREE.Color(species.visual.secondaryColor),
    roughness: 0.72,
    metalness: 0.05,
  });
  const accentMat = registerMat({
    color: new THREE.Color(species.visual.accentColor),
    roughness: 0.52,
    metalness: 0.08,
    emissive: new THREE.Color(species.visual.accentColor),
    emissiveIntensity: 0.14,
  });
  const legMat = registerMat({
    color: new THREE.Color('#262932'),
    roughness: 0.8,
    metalness: 0.05,
  });

  // Translucent White Gossamer Wing Material (from image_5d0ddf.png dragonfly & scorpion-wasp)
  const wingMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#FFFFFF'),
    transparent: true,
    opacity: 0.85,
    roughness: 0.3,
    metalness: 0.05,
    side: THREE.DoubleSide,
  });

  // 1. Tactical Pedestal Base & Team Ring (Meadow Mint #52E59B for Ally, Spiked Scorpion Coral #F05A46 for Rival)
  const pedestalMat = new THREE.MeshStandardMaterial({
    color: isAlly ? 0x264d42 : 0x4d2220,
    roughness: 0.65,
    metalness: 0.1,
  });
  const pedestalBase = new THREE.Mesh(sharedGeos.pedestalDisc, pedestalMat);
  pedestalBase.position.y = 0.035;
  pedestalBase.receiveShadow = true;
  root.add(pedestalBase);

  const teamColor = isAlly ? '#52E59B' : '#F05A46';
  const teamRingMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(teamColor),
    transparent: true,
    opacity: 0.95,
  });
  const teamRing = new THREE.Mesh(sharedGeos.torus, teamRingMat);
  teamRing.rotation.x = -Math.PI / 2;
  teamRing.position.y = 0.06;
  root.add(teamRing);

  // Add 4 subtle coral spikes on Rival pedestal ring for color-blind & mirror-match disambiguation
  if (!isAlly) {
    for (let i = 0; i < 4; i++) {
      const ang = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const spike = new THREE.Mesh(sharedGeos.cone, teamRingMat);
      spike.scale.set(0.14, 0.16, 0.14);
      spike.position.set(Math.sin(ang) * 0.72, 0.07, Math.cos(ang) * 0.72);
      spike.rotation.x = Math.cos(ang) * 1.25;
      spike.rotation.z = -Math.sin(ang) * 1.25;
      root.add(spike);
    }
  }

  // Selection / Target outer halo (Warm Lantern Gold #FFB838)
  const haloMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#FFB838'),
    transparent: true,
    opacity: 0.0,
  });
  const selectionHalo = new THREE.Mesh(sharedGeos.haloTorus, haloMat);
  selectionHalo.rotation.x = -Math.PI / 2;
  selectionHalo.position.y = 0.07;
  root.add(selectionHalo);

  // 2. Bio-Crystal Cyan Shield Dome (visible when unit.status.shield > 0)
  const shieldMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#3CE8FF'),
    emissive: new THREE.Color('#18C5E0'),
    emissiveIntensity: 0.55,
    transparent: true,
    opacity: 0.32,
    roughness: 0.15,
  });
  const shieldDome = new THREE.Mesh(sharedGeos.dodeca, shieldMat);
  shieldDome.scale.set(1.65, 1.45, 1.65);
  shieldDome.position.y = 0.55;
  shieldDome.visible = false;
  root.add(shieldDome);

  // 3. Six Blunt Tactile Toy Legs (Capsule cylinders per image_5d0ddf.png)
  for (const side of [-1, 1]) {
    for (const zOffset of [-0.22, 0.02, 0.24]) {
      const legPivot = new THREE.Group();
      legPivot.position.set(side * 0.34, 0.19, zOffset);

      const legMesh = new THREE.Mesh(sharedGeos.capsuleLeg, legMat);
      legMesh.position.set(side * 0.08, -0.02, 0);
      legMesh.rotation.z = side * 0.58;
      legMesh.castShadow = true;
      legPivot.add(legMesh);

      bodyGroup.add(legPivot);
      legs.push(legPivot);
    }
  }

  // 4. SIGNATURE STYLIZED TOY EYES (White Sclera Ring #FFFFFF + Large Black Pupil #141619 from image_5d0ddf.png)
  const addStylizedToyEyes = (
    y: number,
    z: number,
    spread = 0.21,
    radius = 0.095,
    yaw = 0.35
  ) => {
    for (const side of [-1, 1]) {
      const eyeGroup = new THREE.Group();

      const sclera = new THREE.Mesh(sharedGeos.sphere, sharedEyeMats.sclera);
      sclera.scale.set(radius * 0.55, radius * 1.08, radius * 1.08);

      const pupil = new THREE.Mesh(sharedGeos.sphere, sharedEyeMats.pupil);
      pupil.scale.set(radius * 0.38, radius * 0.72, radius * 0.72);
      pupil.position.set(side * (radius * 0.28), 0, radius * 0.14);

      eyeGroup.add(sclera, pupil);
      eyeGroup.position.set(side * spread, y, z);
      eyeGroup.rotation.y = side * -yaw;
      bodyGroup.add(eyeGroup);
    }
  };

  let isHoveringSpecies = false;
  let boulderProp: THREE.Mesh | undefined;

  // 5. Species-Specific 3D Tactile Toy Anatomy & Segmented Color-Blocked Silhouettes
  switch (shape) {
    case 'rhino_beetle': {
      // BIG ASS BUG: Dark Plum (#3A3548) & Lilac (#9B8AE6) Rhino Beetle (bottom-left of image_5d0ddf.png)
      const abdomen = new THREE.Mesh(sharedGeos.sphere, primaryMat);
      abdomen.scale.set(0.48, 0.38, 0.56);
      abdomen.position.set(0, 0.36, -0.14);
      abdomen.castShadow = true;
      bodyGroup.add(abdomen);

      // Lilac patterned wing-cases (elytra)
      for (const s of [-1, 1]) {
        const wingCase = new THREE.Mesh(sharedGeos.sphere, secondaryMat);
        wingCase.scale.set(0.24, 0.32, 0.48);
        wingCase.position.set(s * 0.19, 0.41, -0.14);
        wingCase.rotation.z = -s * 0.15;
        wingCase.castShadow = true;
        bodyGroup.add(wingCase);
      }

      const thorax = new THREE.Mesh(sharedGeos.sphere, primaryMat);
      thorax.scale.set(0.42, 0.34, 0.36);
      thorax.position.set(0, 0.37, 0.22);
      thorax.castShadow = true;
      bodyGroup.add(thorax);

      const head = new THREE.Mesh(sharedGeos.sphere, primaryMat);
      head.scale.set(0.28, 0.25, 0.26);
      head.position.set(0, 0.34, 0.44);
      head.castShadow = true;
      bodyGroup.add(head);

      addStylizedToyEyes(0.37, 0.48, 0.23, 0.095, 0.32);

      // Chunky Lilac Rhino Horn in weaponGroup
      const hornBase = new THREE.Mesh(sharedGeos.cylinder, secondaryMat);
      hornBase.scale.set(0.2, 0.52, 0.2);
      hornBase.rotation.x = Math.PI * 0.3;
      hornBase.position.set(0, 0.46, 0.64);
      weaponGroup.add(hornBase);

      const hornTip = new THREE.Mesh(sharedGeos.cone, accentMat);
      hornTip.scale.set(0.28, 0.46, 0.28);
      hornTip.rotation.x = Math.PI * 0.1;
      hornTip.position.set(0, 0.7, 0.84);
      weaponGroup.add(hornTip);

      for (const s of [-1, 1]) {
        const browHorn = new THREE.Mesh(sharedGeos.cone, secondaryMat);
        browHorn.scale.set(0.14, 0.28, 0.14);
        browHorn.rotation.x = Math.PI * 0.36;
        browHorn.position.set(s * 0.22, 0.48, 0.52);
        weaponGroup.add(browHorn);
      }
      break;
    }

    case 'tortoise_shell': {
      // AGAMEL: Mossy-Green Armored Runic Tortoise (Ally) or Crimson-Obsidian Runic Tortoise (Rival)
      // Build procedural Hexagonal Scute & Glowing Rune Carapace Texture
      let shellTex: THREE.CanvasTexture | undefined;
      if (typeof document !== 'undefined') {
        const c = document.createElement('canvas');
        c.width = 512;
        c.height = 512;
        const ctx = c.getContext('2d');
        if (ctx) {
          ctx.fillStyle = isAlly ? '#3A542B' : '#421C18';
          ctx.fillRect(0, 0, 512, 512);

          const runeList = ['ᛟ', 'ᛉ', 'ᚠ', 'ᛜ', 'ᛇ', 'ᛞ', 'ᛏ', 'ᛗ'];
          let rIdx = 0;
          const hexR = 52;
          for (let row = 0; row < 7; row++) {
            for (let col = 0; col < 7; col++) {
              const cx = col * 86 + (row % 2 === 1 ? 43 : 0) + 28;
              const cy = row * 74 + 32;

              // Dark chiseled groove + mossy/crimson scute plate fill
              ctx.beginPath();
              for (let k = 0; k < 6; k++) {
                const ang = (k * Math.PI) / 3;
                const px = cx + Math.cos(ang) * (hexR - 5);
                const py = cy + Math.sin(ang) * (hexR - 5);
                if (k === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
              }
              ctx.closePath();
              ctx.fillStyle = isAlly ? '#4F723B' : '#632B24';
              ctx.fill();
              ctx.lineWidth = 6;
              ctx.strokeStyle = isAlly ? '#24361A' : '#260E0C';
              ctx.stroke();

              // Glowing Golden (Ally) or Fiery Orange-Red (Rival) Rune inside each scute
              ctx.strokeStyle = isAlly ? '#FFE055' : '#FF6E4A';
              ctx.lineWidth = 3.5;
              ctx.strokeRect(cx - 16, cy - 16, 32, 32);

              ctx.fillStyle = isAlly ? '#FFF29C' : '#FF9E7A';
              ctx.font = 'bold 28px serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(runeList[rIdx % runeList.length], cx, cy + 1);
              rIdx++;
            }
          }
        }
        shellTex = new THREE.CanvasTexture(c);
        shellTex.colorSpace = THREE.SRGBColorSpace;
      }

      const shellBaseMat = registerMat({
        color: new THREE.Color('#FFFFFF'),
        map: shellTex,
        roughness: 0.72,
        metalness: 0.08,
      });
      const shellPlateMat = registerMat({
        color: new THREE.Color(isAlly ? '#3D592C' : '#4A1F1B'),
        roughness: 0.8,
        metalness: 0.06,
      });
      const skinMat = registerMat({
        color: new THREE.Color(isAlly ? '#566644' : '#4A2B28'),
        roughness: 0.78,
        metalness: 0.05,
      });
      const runeGlowMat = registerMat({
        color: new THREE.Color(isAlly ? '#FFE066' : '#FF6E4A'),
        emissive: new THREE.Color(isAlly ? '#FFB82E' : '#FF3B1F'),
        emissiveIntensity: 1.45,
        roughness: 0.25,
        metalness: 0.2,
      });

      // Hide default thin insect legs for the heavy 4-legged Tortoise Behemoth
      legs.forEach((l) => {
        l.visible = false;
      });

      // 4 Thick Scaled Tortoise Pillar Legs with Glowing Runes on the Outer Side
      const legCoords: Array<[number, number]> = [
        [-0.48, 0.36],
        [0.48, 0.36],
        [-0.5, -0.36],
        [0.5, -0.36],
      ];
      for (const [lx, lz] of legCoords) {
        const tLegGroup = new THREE.Group();
        tLegGroup.position.set(lx, 0.22, lz);

        const column = new THREE.Mesh(sharedGeos.cylinder, skinMat);
        column.scale.set(0.38, 0.42, 0.38);
        column.castShadow = true;
        tLegGroup.add(column);

        // Glowing rune emblem on the outer face of each leg
        const legRune = new THREE.Mesh(sharedGeos.torus, runeGlowMat);
        legRune.scale.set(0.18, 0.18, 0.38);
        legRune.position.set(lx > 0 ? 0.16 : -0.16, 0.02, 0.08);
        legRune.rotation.y = Math.PI / 2;
        tLegGroup.add(legRune);

        bodyGroup.add(tLegGroup);
        legs.push(tLegGroup);
      }

      // Main Domed Tortoise Carapace with Hexagonal Scutes & Glowing Runes Texture
      const shell = new THREE.Mesh(sharedGeos.sphere, shellBaseMat);
      shell.scale.set(0.76, 0.52, 0.84);
      shell.position.set(0, 0.42, -0.05);
      shell.castShadow = true;
      bodyGroup.add(shell);

      // Thick Chiseled Shell Rim
      const shellRim = new THREE.Mesh(sharedGeos.torus, shellPlateMat);
      shellRim.rotation.x = Math.PI / 2;
      shellRim.scale.set(1.08, 1.2, 1.45);
      shellRim.position.set(0, 0.28, -0.05);
      bodyGroup.add(shellRim);

      // Raised 3D Hexagonal Scute Plates + Glowing Runes ON TOP of the Carapace Surface (y = 0.78..0.94)
      const scuteOffsets: Array<[number, number, number, number, number]> = [
        [0, 0.93, -0.05, 0, 0],
        [0, 0.84, 0.36, 0.42, 0],
        [0, 0.84, -0.46, -0.42, 0],
        [-0.44, 0.78, 0.16, 0.22, 0.55],
        [0.44, 0.78, 0.16, 0.22, -0.55],
        [-0.44, 0.78, -0.28, -0.22, 0.55],
        [0.44, 0.78, -0.28, -0.22, -0.55],
      ];
      for (const [sx, sy, sz, rx, rz] of scuteOffsets) {
        const scute = new THREE.Mesh(sharedGeos.cylinder, shellPlateMat);
        scute.scale.set(0.38, 0.06, 0.38);
        scute.position.set(sx, sy, sz);
        scute.rotation.set(rx, 0, rz);
        bodyGroup.add(scute);

        const runeInlay = new THREE.Mesh(sharedGeos.torus, runeGlowMat);
        runeInlay.scale.set(0.16, 0.16, 0.35);
        runeInlay.position.set(sx, sy + 0.04, sz);
        runeInlay.rotation.set(Math.PI / 2 + rx, 0, rz);
        bodyGroup.add(runeInlay);
      }

      // Armored Snapping Tortoise Head & Golden Brow Horns
      const head = new THREE.Mesh(sharedGeos.sphere, skinMat);
      head.scale.set(0.32, 0.26, 0.36);
      head.position.set(0, 0.36, 0.68);
      head.castShadow = true;
      bodyGroup.add(head);

      addStylizedToyEyes(0.4, 0.78, 0.22, 0.08, 0.35);

      for (const s of [-1, 1]) {
        const browHorn = new THREE.Mesh(sharedGeos.cone, runeGlowMat);
        browHorn.scale.set(0.16, 0.38, 0.16);
        browHorn.rotation.x = -Math.PI * 0.28;
        browHorn.rotation.z = -s * 0.35;
        browHorn.position.set(s * 0.2, 0.54, 0.68);
        weaponGroup.add(browHorn);
      }
      break;
    }

    case 'emperor_beetle': {
      // DARK EMPEROR: Obsidian (#2B2D38) & Slate (#52586E) Sovereign Stag with Golden Horns (#FFB838)
      const abdomen = new THREE.Mesh(sharedGeos.sphere, primaryMat);
      abdomen.scale.set(0.5, 0.4, 0.6);
      abdomen.position.set(0, 0.38, -0.12);
      abdomen.castShadow = true;
      bodyGroup.add(abdomen);

      const dorsalShield = new THREE.Mesh(sharedGeos.sphere, secondaryMat);
      dorsalShield.scale.set(0.44, 0.34, 0.48);
      dorsalShield.position.set(0, 0.45, -0.1);
      bodyGroup.add(dorsalShield);

      const head = new THREE.Mesh(sharedGeos.sphere, primaryMat);
      head.scale.set(0.32, 0.28, 0.3);
      head.position.set(0, 0.38, 0.4);
      head.castShadow = true;
      bodyGroup.add(head);

      addStylizedToyEyes(0.42, 0.46, 0.24, 0.095, 0.35);

      // Golden Sovereign Trident Horn
      const mainHorn = new THREE.Mesh(sharedGeos.cone, accentMat);
      mainHorn.scale.set(0.26, 0.82, 0.26);
      mainHorn.rotation.x = Math.PI * 0.34;
      mainHorn.position.set(0, 0.58, 0.76);
      weaponGroup.add(mainHorn);

      for (const s of [-1, 1]) {
        const prong = new THREE.Mesh(sharedGeos.cone, accentMat);
        prong.scale.set(0.16, 0.5, 0.16);
        prong.rotation.x = Math.PI * 0.3;
        prong.rotation.z = -s * 0.35;
        prong.position.set(s * 0.28, 0.54, 0.64);
        weaponGroup.add(prong);

        const wing = new THREE.Mesh(sharedGeos.box, wingMat);
        wing.scale.set(0.52, 0.025, 0.72);
        wing.position.set(s * 0.36, 0.54, -0.1);
        wing.rotation.z = s * 0.25;
        bodyGroup.add(wing);
        wings.push(wing);
      }
      break;
    }

    case 'lance_faerie': {
      // NOBLE FAERIE: Vibrant Violet Dragonfly (#8C2CE6 / #D8B4FF) with 4 White Wings (top-center of image_5d0ddf.png)
      isHoveringSpecies = true;

      // Segmented Dragonfly Tail
      for (let seg = 0; seg < 3; seg++) {
        const tailSeg = new THREE.Mesh(
          sharedGeos.sphere,
          seg % 2 === 0 ? primaryMat : secondaryMat
        );
        const r = 0.22 - seg * 0.03;
        tailSeg.scale.set(r, r * 0.9, r * 1.35);
        tailSeg.position.set(0, 0.48 - seg * 0.04, -0.18 - seg * 0.22);
        tailSeg.castShadow = true;
        bodyGroup.add(tailSeg);
      }

      const thorax = new THREE.Mesh(sharedGeos.sphere, primaryMat);
      thorax.scale.set(0.32, 0.3, 0.34);
      thorax.position.set(0, 0.54, 0.12);
      thorax.castShadow = true;
      bodyGroup.add(thorax);

      const head = new THREE.Mesh(sharedGeos.sphere, primaryMat);
      head.scale.set(0.26, 0.25, 0.25);
      head.position.set(0, 0.58, 0.38);
      head.castShadow = true;
      bodyGroup.add(head);

      addStylizedToyEyes(0.6, 0.44, 0.21, 0.095, 0.32);

      // 4 Crisp White Semi-Transparent Dragonfly Wings
      for (const s of [-1, 1]) {
        const upperWing = new THREE.Mesh(sharedGeos.box, wingMat);
        upperWing.scale.set(0.62, 0.025, 0.18);
        upperWing.position.set(s * 0.44, 0.68, 0.1);
        upperWing.rotation.z = s * 0.22;
        upperWing.rotation.y = s * -0.15;
        bodyGroup.add(upperWing);
        wings.push(upperWing);

        const lowerWing = new THREE.Mesh(sharedGeos.box, wingMat);
        lowerWing.scale.set(0.48, 0.025, 0.15);
        lowerWing.position.set(s * 0.36, 0.58, -0.08);
        lowerWing.rotation.z = s * 0.12;
        lowerWing.rotation.y = s * 0.15;
        bodyGroup.add(lowerWing);
        wings.push(lowerWing);
      }

      // Spiral Knight Lance
      const lanceCone = new THREE.Mesh(sharedGeos.cone, secondaryMat);
      lanceCone.scale.set(0.26, 0.85, 0.26);
      lanceCone.rotation.x = Math.PI / 2;
      lanceCone.position.set(0.32, 0.52, 0.72);
      weaponGroup.add(lanceCone);
      break;
    }

    case 'winged_mantis': {
      // TORNADO MANTIS: Lush Canopy Green Mantis (#4E9A42) with Mint-Sage Scythes (#A6E3C5)
      isHoveringSpecies = true;
      const abdomen = new THREE.Mesh(sharedGeos.sphere, primaryMat);
      abdomen.scale.set(0.28, 0.26, 0.54);
      abdomen.position.set(0, 0.36, -0.24);
      abdomen.rotation.x = 0.25;
      abdomen.castShadow = true;
      bodyGroup.add(abdomen);

      const thorax = new THREE.Mesh(sharedGeos.cylinder, primaryMat);
      thorax.scale.set(0.34, 0.48, 0.34);
      thorax.position.set(0, 0.54, 0.12);
      thorax.rotation.x = -0.3;
      thorax.castShadow = true;
      bodyGroup.add(thorax);

      const head = new THREE.Mesh(sharedGeos.sphere, primaryMat);
      head.scale.set(0.28, 0.24, 0.24);
      head.position.set(0, 0.76, 0.28);
      head.castShadow = true;
      bodyGroup.add(head);

      addStylizedToyEyes(0.78, 0.34, 0.22, 0.095, 0.32);

      // Twin Mint-Sage Scythe Blades + White Gossamer Wings
      for (const s of [-1, 1]) {
        const scytheArm = new THREE.Mesh(sharedGeos.box, secondaryMat);
        scytheArm.scale.set(0.09, 0.38, 0.46);
        scytheArm.position.set(s * 0.32, 0.58, 0.46);
        scytheArm.rotation.x = 0.42;
        scytheArm.rotation.y = -s * 0.22;
        weaponGroup.add(scytheArm);

        const wing = new THREE.Mesh(sharedGeos.box, wingMat);
        wing.scale.set(0.54, 0.025, 0.22);
        wing.position.set(s * 0.42, 0.58, -0.04);
        wing.rotation.z = s * 0.25;
        bodyGroup.add(wing);
        wings.push(wing);
      }
      break;
    }

    case 'stag_beetle': {
      // MICK STAGGER: Earwig Ochre (#E08232) & Chestnut (#6E472B) with Charcoal Pincers (top-left of image_5d0ddf.png)
      const abdomen = new THREE.Mesh(sharedGeos.sphere, secondaryMat);
      abdomen.scale.set(0.44, 0.34, 0.54);
      abdomen.position.set(0, 0.34, -0.14);
      abdomen.castShadow = true;
      bodyGroup.add(abdomen);

      const thorax = new THREE.Mesh(sharedGeos.sphere, primaryMat);
      thorax.scale.set(0.42, 0.34, 0.38);
      thorax.position.set(0, 0.35, 0.22);
      thorax.castShadow = true;
      bodyGroup.add(thorax);

      const head = new THREE.Mesh(sharedGeos.sphere, primaryMat);
      head.scale.set(0.32, 0.26, 0.28);
      head.position.set(0, 0.34, 0.44);
      head.castShadow = true;
      bodyGroup.add(head);

      addStylizedToyEyes(0.37, 0.5, 0.24, 0.095, 0.35);

      // Heavy Charcoal Twin Pincers
      for (const s of [-1, 1]) {
        const jawBase = new THREE.Mesh(sharedGeos.box, accentMat);
        jawBase.scale.set(0.14, 0.13, 0.52);
        jawBase.position.set(s * 0.26, 0.34, 0.68);
        jawBase.rotation.y = -s * 0.2;
        weaponGroup.add(jawBase);

        const jawTip = new THREE.Mesh(sharedGeos.cone, accentMat);
        jawTip.scale.set(0.18, 0.3, 0.18);
        jawTip.position.set(s * 0.16, 0.34, 0.94);
        jawTip.rotation.x = Math.PI / 2;
        jawTip.rotation.z = s * 0.55;
        weaponGroup.add(jawTip);
      }
      break;
    }

    case 'spiked_crawler': {
      // DRILLERPILLAR: Coral-Orange Striped Segmented Larva (#F27D5E & #D95B3D, bottom-left of image_5d0ddf.png)
      for (let seg = 0; seg < 4; seg++) {
        const sMesh = new THREE.Mesh(
          sharedGeos.sphere,
          seg % 2 === 0 ? primaryMat : secondaryMat
        );
        const r = 0.38 - seg * 0.035;
        sMesh.scale.set(r * 1.05, r * 0.88, r * 0.95);
        sMesh.position.set(0, 0.32, 0.32 - seg * 0.24);
        sMesh.castShadow = true;
        bodyGroup.add(sMesh);
      }

      addStylizedToyEyes(0.36, 0.54, 0.21, 0.09, 0.32);

      // Twin Cream Fangs
      for (const s of [-1, 1]) {
        const fang = new THREE.Mesh(sharedGeos.cone, accentMat);
        fang.scale.set(0.2, 0.48, 0.2);
        fang.rotation.x = Math.PI * 0.45;
        fang.position.set(s * 0.18, 0.28, 0.68);
        weaponGroup.add(fang);
      }
      break;
    }

    case 'cannon_beetle': {
      // BAZOO BEETLE: Slate-Grey Bombardier (#525B6C / #363D4A) with Cyan Bio-Cannon (bottom-center of image_5d0ddf.png)
      const hull = new THREE.Mesh(sharedGeos.sphere, primaryMat);
      hull.scale.set(0.52, 0.38, 0.58);
      hull.position.set(0, 0.34, -0.06);
      hull.castShadow = true;
      bodyGroup.add(hull);

      const head = new THREE.Mesh(sharedGeos.sphere, secondaryMat);
      head.scale.set(0.32, 0.26, 0.28);
      head.position.set(0, 0.32, 0.44);
      head.castShadow = true;
      bodyGroup.add(head);

      addStylizedToyEyes(0.35, 0.52, 0.23, 0.095, 0.35);

      const turret = new THREE.Mesh(sharedGeos.sphere, secondaryMat);
      turret.scale.set(0.34, 0.28, 0.34);
      turret.position.set(0, 0.56, -0.05);
      weaponGroup.add(turret);

      const barrel = new THREE.Mesh(sharedGeos.cylinder, secondaryMat);
      barrel.scale.set(0.34, 0.72, 0.34);
      barrel.rotation.x = Math.PI * 0.34;
      barrel.position.set(0, 0.72, 0.32);
      weaponGroup.add(barrel);

      const muzzle = new THREE.Mesh(sharedGeos.torus, accentMat);
      muzzle.scale.setScalar(0.24);
      muzzle.position.set(0, 0.89, 0.62);
      weaponGroup.add(muzzle);
      break;
    }

    case 'royal_hornet': {
      // BEE BEE KING: Crimson (#B8252A) & Charcoal (#282930) Scorpion-Wasp with White Wings (center of image_5d0ddf.png)
      isHoveringSpecies = true;
      const abdomen = new THREE.Mesh(sharedGeos.sphere, primaryMat);
      abdomen.scale.set(0.35, 0.32, 0.52);
      abdomen.position.set(0, 0.44, -0.22);
      abdomen.rotation.x = -0.28;
      abdomen.castShadow = true;
      bodyGroup.add(abdomen);

      for (let i = -1; i <= 1; i++) {
        const stripe = new THREE.Mesh(sharedGeos.cylinder, secondaryMat);
        stripe.scale.set(0.78, 0.08, 0.78);
        stripe.rotation.x = Math.PI / 2 - 0.28;
        stripe.position.set(0, 0.44 - i * 0.04, -0.22 + i * 0.12);
        bodyGroup.add(stripe);
      }

      const thorax = new THREE.Mesh(sharedGeos.sphere, primaryMat);
      thorax.scale.set(0.3, 0.28, 0.32);
      thorax.position.set(0, 0.52, 0.18);
      thorax.castShadow = true;
      bodyGroup.add(thorax);

      const head = new THREE.Mesh(sharedGeos.sphere, secondaryMat);
      head.scale.set(0.24, 0.24, 0.24);
      head.position.set(0, 0.54, 0.4);
      head.castShadow = true;
      bodyGroup.add(head);

      addStylizedToyEyes(0.56, 0.46, 0.2, 0.09, 0.32);

      // Stinger Lance
      const stinger = new THREE.Mesh(sharedGeos.cone, primaryMat);
      stinger.scale.set(0.2, 0.58, 0.2);
      stinger.rotation.x = Math.PI * 0.48;
      stinger.position.set(0, 0.46, 0.68);
      weaponGroup.add(stinger);

      for (const s of [-1, 1]) {
        const wing = new THREE.Mesh(sharedGeos.box, wingMat);
        wing.scale.set(0.54, 0.025, 0.18);
        wing.position.set(s * 0.38, 0.68, 0.1);
        wing.rotation.z = s * 0.25;
        wing.rotation.y = s * -0.18;
        bodyGroup.add(wing);
        wings.push(wing);
      }
      break;
    }

    case 'lady_beetle': {
      // LOVELY LADY: Ivory (#F4F4EE) & Charcoal (#2D3038) Spotted/Spiked Weevil Beetle (bottom-right of image_5d0ddf.png)
      const dome = new THREE.Mesh(sharedGeos.sphere, primaryMat);
      dome.scale.set(0.5, 0.42, 0.54);
      dome.position.set(0, 0.34, -0.06);
      dome.castShadow = true;
      bodyGroup.add(dome);

      const head = new THREE.Mesh(sharedGeos.sphere, secondaryMat);
      head.scale.set(0.32, 0.26, 0.3);
      head.position.set(0, 0.3, 0.42);
      head.castShadow = true;
      bodyGroup.add(head);

      addStylizedToyEyes(0.35, 0.52, 0.22, 0.09, 0.34);

      // Bold Charcoal Spots on Ivory Carapace (matching bottom-right bug in image_5d0ddf.png)
      const spotCoords = [
        [-0.22, 0.62, 0.06],
        [0.22, 0.62, 0.06],
        [-0.25, 0.56, -0.22],
        [0.25, 0.56, -0.22],
        [0, 0.68, -0.08],
      ];
      for (const [sx, sy, sz] of spotCoords) {
        const spot = new THREE.Mesh(sharedGeos.sphere, secondaryMat);
        spot.scale.set(0.12, 0.06, 0.12);
        spot.position.set(sx, sy, sz);
        bodyGroup.add(spot);
      }

      for (const s of [-1, 1]) {
        const ant = new THREE.Mesh(sharedGeos.sphere, accentMat);
        ant.scale.setScalar(0.085);
        ant.position.set(s * 0.2, 0.54, 0.54);
        weaponGroup.add(ant);
      }
      break;
    }

    case 'pegasus_beetle': {
      // ITSAPEGASUS: Bio-Luminescent Azure Bug (#258EA6 / #5CE6FF) with Golden Jousting Horn
      isHoveringSpecies = true;
      const body = new THREE.Mesh(sharedGeos.sphere, primaryMat);
      body.scale.set(0.44, 0.36, 0.56);
      body.position.set(0, 0.46, -0.08);
      body.castShadow = true;
      bodyGroup.add(body);

      const head = new THREE.Mesh(sharedGeos.sphere, secondaryMat);
      head.scale.set(0.32, 0.28, 0.32);
      head.position.set(0, 0.52, 0.34);
      head.castShadow = true;
      bodyGroup.add(head);

      addStylizedToyEyes(0.56, 0.46, 0.22, 0.095, 0.32);

      const horn = new THREE.Mesh(sharedGeos.cone, accentMat);
      horn.scale.set(0.22, 0.68, 0.22);
      horn.rotation.x = Math.PI * 0.36;
      horn.position.set(0, 0.68, 0.72);
      weaponGroup.add(horn);

      for (const s of [-1, 1]) {
        const wing = new THREE.Mesh(sharedGeos.box, wingMat);
        wing.scale.set(0.58, 0.03, 0.28);
        wing.position.set(s * 0.46, 0.64, -0.02);
        wing.rotation.z = s * 0.28;
        bodyGroup.add(wing);
        wings.push(wing);
      }
      break;
    }

    case 'boulder_roller':
    default: {
      // ROCK 'N' ROLLER: Striped Charcoal Pillbug / Isopod (#2E313D & #565B6E, bottom-center of image_5d0ddf.png)
      const scarab = new THREE.Mesh(sharedGeos.sphere, primaryMat);
      scarab.scale.set(0.48, 0.38, 0.54);
      scarab.position.set(0, 0.34, -0.14);
      scarab.castShadow = true;
      bodyGroup.add(scarab);

      // Segmented Pillbug Ridges
      for (let i = -1; i <= 1; i++) {
        const ridge = new THREE.Mesh(sharedGeos.cylinder, secondaryMat);
        ridge.scale.set(1.06 - Math.abs(i) * 0.1, 0.14, 0.28);
        ridge.position.set(0, 0.42, -0.14 + i * 0.18);
        bodyGroup.add(ridge);
      }

      const head = new THREE.Mesh(sharedGeos.sphere, secondaryMat);
      head.scale.set(0.3, 0.24, 0.26);
      head.position.set(0, 0.3, 0.3);
      head.castShadow = true;
      bodyGroup.add(head);

      addStylizedToyEyes(0.34, 0.38, 0.22, 0.09, 0.35);

      // Sculpted Moss-Stone Boulder Prop in weaponGroup
      const boulderMat = registerMat({
        color: new THREE.Color('#566B73'),
        roughness: 0.78,
        metalness: 0.08,
        emissive: new THREE.Color('#3CE8FF'),
        emissiveIntensity: 0.18,
      });
      boulderProp = new THREE.Mesh(sharedGeos.dodeca, boulderMat);
      boulderProp.scale.setScalar(0.48);
      boulderProp.position.set(0, 0.32, 0.64);
      weaponGroup.add(boulderProp);
      break;
    }
  }

  bodyGroup.add(weaponGroup);

  // 6. 3D Warm Lantern Gold Crown for the King Insector
  const goldMat = registerMat({
    color: new THREE.Color('#FFB838'),
    roughness: 0.32,
    metalness: 0.45,
    emissive: new THREE.Color('#C87A12'),
    emissiveIntensity: 0.25,
  });
  const crownBase = new THREE.Mesh(sharedGeos.cylinder, goldMat);
  crownBase.scale.set(0.42, 0.14, 0.42);
  crownGroup.add(crownBase);

  for (let p = 0; p < 5; p++) {
    const a = (p / 5) * Math.PI * 2;
    const spire = new THREE.Mesh(sharedGeos.cone, goldMat);
    spire.scale.set(0.12, 0.22, 0.12);
    spire.position.set(Math.sin(a) * 0.16, 0.15, Math.cos(a) * 0.16);
    crownGroup.add(spire);
  }
  crownGroup.position.set(0, isHoveringSpecies ? 1.22 : 0.88, 0.05);
  crownGroup.visible = isKing;
  bodyGroup.add(crownGroup);

  bodyGroup.scale.setScalar(scale);
  root.add(bodyGroup);

  // Orient Player bugs toward -Z (enemy side) and Enemy bugs toward +Z (player side)
  root.rotation.y = team === 'player' ? Math.PI : 0;

  return {
    root,
    bodyGroup,
    weaponGroup,
    crownGroup,
    legs,
    wings,
    teamRing,
    selectionHalo,
    shieldDome,
    boulderProp,
    materials,
    baseY: isHoveringSpecies ? 0.16 : 0.0,
    isHoveringSpecies,
  };
}
