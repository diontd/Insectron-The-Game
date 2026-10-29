import React from 'react';
import { InsectorSpecies } from '../game/species';

export const KingCrownSVG: React.FC<{ className?: string }> = ({
  className = 'w-4 h-3.5',
}) => (
  <svg
    viewBox="0 0 24 18"
    className={className}
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M2 15L4 5L9 10L12 2L15 10L20 5L22 15H2Z"
      fill="url(#crownGold)"
      stroke="#1e1405"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <rect
      x="2.5"
      y="14"
      width="19"
      height="2.5"
      rx="1"
      fill="#d97706"
      stroke="#1e1405"
      strokeWidth="1.2"
    />
    <circle cx="4" cy="4.5" r="1.4" fill="#fef08a" stroke="#1e1405" strokeWidth="1" />
    <circle cx="12" cy="1.8" r="1.6" fill="#fef08a" stroke="#1e1405" strokeWidth="1" />
    <circle cx="20" cy="4.5" r="1.4" fill="#fef08a" stroke="#1e1405" strokeWidth="1" />
    <defs>
      <linearGradient id="crownGold" x1="12" y1="2" x2="12" y2="16" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="55%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
    </defs>
  </svg>
);

export const InsectPortraitSVG: React.FC<{
  species: InsectorSpecies;
  isKing?: boolean;
  className?: string;
}> = ({ species, isKing = false, className = 'w-14 h-14' }) => {
  const { bodyShape, primaryColor, secondaryColor, accentColor, eyeColor } =
    species.visual;

  return (
    <svg viewBox="0 0 64 64" className={className} aria-label={species.name}>
      {/* Team/Aura Backdrop */}
      <ellipse
        cx="32"
        cy="50"
        rx="20"
        ry="7"
        fill={secondaryColor}
        fillOpacity="0.28"
      />
      {/* Legs (skip generic stick legs for armored tortoise_shell) */}
      {bodyShape !== 'tortoise_shell' && (
        <g stroke="#111827" strokeWidth="2.6" strokeLinecap="round">
          <path d="M20 34L8 28M20 40L6 40M22 46L10 54" />
          <path d="M44 34L56 28M44 40L58 40M42 46L54 54" />
        </g>
      )}

      {/* Body Variants */}
      {bodyShape === 'rhino_beetle' && (
        <g>
          <ellipse
            cx="32"
            cy="40"
            rx="15"
            ry="14"
            fill={primaryColor}
            stroke="#090d16"
            strokeWidth="2.5"
          />
          <path
            d="M21 36C25 30 39 30 43 36"
            stroke={secondaryColor}
            strokeWidth="2.5"
            fill="none"
          />
          {/* Giant Rhino Horn */}
          <path
            d="M28 28L32 9L36 28Z"
            fill={secondaryColor}
            stroke="#090d16"
            strokeWidth="2.2"
          />
          <path d="M24 24L18 16M40 24L46 16" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )}

      {bodyShape === 'emperor_beetle' && (
        <g>
          {/* Crimson Wings Flare */}
          <path
            d="M16 36L6 20L22 28ZM48 36L58 20L42 28Z"
            fill={secondaryColor}
            stroke="#090d16"
            strokeWidth="2"
          />
          <ellipse
            cx="32"
            cy="40"
            rx="16"
            ry="14"
            fill={primaryColor}
            stroke="#090d16"
            strokeWidth="2.5"
          />
          {/* Sovereign Triple Horn */}
          <path
            d="M29 28L32 7L35 28Z"
            fill={accentColor}
            stroke="#090d16"
            strokeWidth="2"
          />
          <path
            d="M24 27L15 13L27 23ZM40 27L49 13L37 23Z"
            fill={secondaryColor}
            stroke="#090d16"
            strokeWidth="1.8"
          />
        </g>
      )}

      {bodyShape === 'tortoise_shell' && (
        <g>
          {/* Detailed Mossy Armored Runic Tortoise Portrait (Matches bottom-left portrait of Gemini_Generated_Image__0229a466.jpg) */}
          {/* Domed Moss-Green Carapace */}
          <path
            d="M4 38 C4 14, 42 10, 50 32 C42 42, 16 44, 4 38 Z"
            fill="#4E7338"
            stroke="#1A2614"
            strokeWidth="2.5"
          />
          {/* Chiseled Carapace Rim */}
          <path
            d="M4 38 C16 44, 38 42, 50 33"
            stroke="#7C8B62"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Hexagonal Scute Segments */}
          <polygon
            points="14,26 26,18 39,23 36,34 18,35"
            fill="#3B5929"
            stroke="#1D2E14"
            strokeWidth="1.8"
          />
          {/* Glowing Golden Shell Runes */}
          <path
            d="M21 26 L26 22 L31 26 L26 30 Z M10 31 L14 28 M36 27 L41 29"
            stroke="#FFE066"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Thick Scaled Front Tortoise Pillar Leg with Glowing Golden Runes */}
          <path
            d="M8 40 C8 36, 22 36, 23 42 L22 59 L6 59 Z"
            fill="#5E6B4C"
            stroke="#1A2614"
            strokeWidth="2.2"
          />
          <path
            d="M12 46 L15 43 L18 46 M11 52 L15 49 L18 53"
            stroke="#FFE066"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Secondary Right Leg */}
          <path
            d="M36 44 L48 44 L49 59 L35 59 Z"
            fill="#4B573D"
            stroke="#1A2614"
            strokeWidth="2"
          />
          <path
            d="M40 50 L43 47 L45 52"
            stroke="#FFE066"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
          {/* Armored Snapping Tortoise Head */}
          <path
            d="M27 36 C28 27, 52 26, 57 37 C58 45, 44 49, 31 45 Z"
            fill="#687A53"
            stroke="#1A2614"
            strokeWidth="2.3"
          />
          {/* Jaw & Snapping Beak Line */}
          <path
            d="M34 42 L45 43 L54 40"
            stroke="#1A2614"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
          {/* Fierce Amber-Gold Reptilian Eyes under Armored Brow */}
          <ellipse cx="40" cy="36.5" rx="2.6" ry="1.9" fill="#FFB838" stroke="#1A2614" strokeWidth="1.2" />
          <circle cx="40.5" cy="36.5" r="0.9" fill="#1A2614" />
          <ellipse cx="52" cy="36" rx="2.1" ry="1.6" fill="#FFB838" stroke="#1A2614" strokeWidth="1.1" />
          {/* Twin Curved Golden Brow Horns */}
          <polygon
            points="35,32 25,19 41,29"
            fill="#F5C84C"
            stroke="#2B1E08"
            strokeWidth="1.6"
          />
          <polygon
            points="48,30 58,19 54,32"
            fill="#F5C84C"
            stroke="#2B1E08"
            strokeWidth="1.6"
          />
        </g>
      )}

      {bodyShape === 'stag_beetle' && (
        <g>
          <ellipse
            cx="32"
            cy="41"
            rx="14"
            ry="13"
            fill={primaryColor}
            stroke="#090d16"
            strokeWidth="2.5"
          />
          {/* Serrated Stag Mandibles */}
          <path
            d="M25 29C17 20 17 11 25 8L27 14L23 18L27 22"
            fill="none"
            stroke={secondaryColor}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M39 29C47 20 47 11 39 8L37 14L41 18L37 22"
            fill="none"
            stroke={secondaryColor}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>
      )}

      {bodyShape === 'cannon_beetle' && (
        <g>
          <ellipse
            cx="32"
            cy="41"
            rx="16"
            ry="13"
            fill={primaryColor}
            stroke="#090d16"
            strokeWidth="2.5"
          />
          {/* Dorsal Bio-Cannon Barrel */}
          <rect
            x="27"
            y="12"
            width="10"
            height="24"
            rx="3"
            fill="#374151"
            stroke="#090d16"
            strokeWidth="2.2"
          />
          <circle cx="32" cy="13" r="4" fill={accentColor} />
        </g>
      )}

      {bodyShape === 'lance_faerie' && (
        <g>
          {/* Sylph Wings */}
          <ellipse
            cx="17"
            cy="34"
            rx="11"
            ry="6"
            transform="rotate(-25 17 34)"
            fill="#bae6fd"
            stroke="#0284c7"
            strokeWidth="1.8"
          />
          <ellipse
            cx="47"
            cy="34"
            rx="11"
            ry="6"
            transform="rotate(25 47 34)"
            fill="#bae6fd"
            stroke="#0284c7"
            strokeWidth="1.8"
          />
          <ellipse
            cx="32"
            cy="38"
            rx="9"
            ry="12"
            fill={primaryColor}
            stroke="#090d16"
            strokeWidth="2.2"
          />
          {/* Spiral Knight Lance */}
          <polygon
            points="46,8 41,28 51,28"
            fill="#f8fafc"
            stroke="#090d16"
            strokeWidth="2"
          />
          <circle cx="32" cy="24" r="6" fill={accentColor} stroke="#090d16" strokeWidth="2" />
        </g>
      )}

      {bodyShape === 'winged_mantis' && (
        <g>
          {/* Butterfly/Mantis Wings */}
          <path
            d="M32 34L10 18L14 38L32 40ZM32 34L54 18L50 38L32 40Z"
            fill={primaryColor}
            stroke="#090d16"
            strokeWidth="2"
          />
          <ellipse
            cx="32"
            cy="37"
            rx="7"
            ry="14"
            fill={secondaryColor}
            stroke="#090d16"
            strokeWidth="2.2"
          />
          {/* Scythes */}
          <path
            d="M25 28L12 22L18 14M39 28L52 22L46 14"
            fill="none"
            stroke={accentColor}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      )}

      {bodyShape === 'royal_hornet' && (
        <g>
          <ellipse
            cx="17"
            cy="31"
            rx="11"
            ry="5"
            transform="rotate(-20 17 31)"
            fill="#e0f2fe"
            stroke="#090d16"
            strokeWidth="1.6"
          />
          <ellipse
            cx="47"
            cy="31"
            rx="11"
            ry="5"
            transform="rotate(20 47 31)"
            fill="#e0f2fe"
            stroke="#090d16"
            strokeWidth="1.6"
          />
          <ellipse
            cx="32"
            cy="39"
            rx="12"
            ry="14"
            fill={primaryColor}
            stroke="#090d16"
            strokeWidth="2.4"
          />
          <path d="M21 36H43M22 42H42" stroke={secondaryColor} strokeWidth="3.5" />
          {/* Stinger */}
          <polygon points="32,11 28,25 36,25" fill={accentColor} stroke="#090d16" strokeWidth="1.8" />
        </g>
      )}

      {bodyShape === 'lady_beetle' && (
        <g>
          <ellipse
            cx="32"
            cy="39"
            rx="16"
            ry="15"
            fill={primaryColor}
            stroke="#090d16"
            strokeWidth="2.5"
          />
          <line x1="32" y1="24" x2="32" y2="54" stroke="#090d16" strokeWidth="2.2" />
          <circle cx="24" cy="34" r="3" fill={secondaryColor} />
          <circle cx="40" cy="34" r="3" fill={secondaryColor} />
          <circle cx="25" cy="44" r="2.8" fill={secondaryColor} />
          <circle cx="39" cy="44" r="2.8" fill={secondaryColor} />
        </g>
      )}

      {bodyShape === 'spiked_crawler' && (
        <g>
          <ellipse
            cx="32"
            cy="42"
            rx="15"
            ry="12"
            fill={primaryColor}
            stroke="#090d16"
            strokeWidth="2.5"
          />
          <ellipse
            cx="32"
            cy="31"
            rx="13"
            ry="10"
            fill={primaryColor}
            stroke="#090d16"
            strokeWidth="2.5"
          />
          {/* Twin White Fangs */}
          <polygon points="24,14 21,26 28,25" fill={secondaryColor} stroke="#090d16" strokeWidth="1.6" />
          <polygon points="40,14 36,25 43,26" fill={secondaryColor} stroke="#090d16" strokeWidth="1.6" />
        </g>
      )}

      {bodyShape === 'pegasus_beetle' && (
        <g>
          <path
            d="M18 38L6 20L22 26ZM46 38L58 20L42 26Z"
            fill={secondaryColor}
            stroke="#090d16"
            strokeWidth="2"
          />
          <ellipse
            cx="32"
            cy="40"
            rx="14"
            ry="13"
            fill={primaryColor}
            stroke="#090d16"
            strokeWidth="2.4"
          />
          <polygon points="32,8 28,28 36,28" fill={accentColor} stroke="#090d16" strokeWidth="2" />
        </g>
      )}

      {bodyShape === 'boulder_roller' && (
        <g>
          {/* Magma Boulder in front */}
          <circle
            cx="32"
            cy="20"
            r="10"
            fill={accentColor}
            stroke="#090d16"
            strokeWidth="2.2"
          />
          <ellipse
            cx="32"
            cy="42"
            rx="15"
            ry="12"
            fill={primaryColor}
            stroke="#090d16"
            strokeWidth="2.5"
          />
        </g>
      )}

      {/* Signature Tactile Toy Googly Eyes (skip for tortoise_shell which has armored brow eyes) */}
      {bodyShape !== 'tortoise_shell' && (
        <g>
          <circle cx="24" cy="27" r="4.6" fill="#FFFFFF" stroke="#141619" strokeWidth="1.4" />
          <circle cx="24.5" cy="27" r="2.5" fill="#141619" />
          <circle cx="40" cy="27" r="4.6" fill="#FFFFFF" stroke="#141619" strokeWidth="1.4" />
          <circle cx="39.5" cy="27" r="2.5" fill="#141619" />
        </g>
      )}

      {/* Optional King Crown on Head */}
      {isKing && (
        <g transform="translate(20, 1)">
          <path
            d="M2 13L4 4L9 9L12 1L15 9L20 4L22 13H2Z"
            fill="#FFB838"
            stroke="#122128"
            strokeWidth="1.8"
          />
        </g>
      )}
    </svg>
  );
};

export const MovePatternMatrix: React.FC<{ species: InsectorSpecies }> = ({
  species,
}) => {
  // 5x5 grid centered at (0, 0)
  const cells = [];
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      const isCenter = r === 0 && c === 0;
      const move = species.moveVectors.find((v) => v.dx === c && v.dy === r);
      cells.push({ r, c, isCenter, move });
    }
  }

  return (
    <div
      className="flex items-center gap-2 shrink-0"
      aria-label={`${species.name} Movement Pattern`}
    >
      <div className="grid grid-cols-5 gap-0.5 p-1 bg-[#121E24] border-2 border-[#3D5C6B] rounded-lg w-16 h-16 shrink-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
        {cells.map(({ r, c, isCenter, move }) => {
          let bg = 'bg-[#213641]';
          if (isCenter) bg = 'bg-[#FFB838] border border-[#F4F9F5] text-[#122128]';
          else if (move?.jump) bg = 'bg-[#F05A46] border border-[#F4F9F5] text-[#FFFFFF]';
          else if (move) bg = 'bg-[#52E59B] border border-[#F4F9F5] text-[#122128]';

          return (
            <div
              key={`${r}_${c}`}
              className={`w-full h-full rounded-[2px] flex items-center justify-center text-[7px] font-extrabold ${bg}`}
              title={
                isCenter
                  ? 'Unit Position (★)'
                  : move?.jump
                    ? 'Jump Move (J) — Leaps over units'
                    : move
                      ? 'Standard Move (Mint)'
                      : ''
              }
            >
              {isCenter ? '★' : move?.jump ? 'J' : ''}
            </div>
          );
        })}
      </div>

      {/* [F-09] Explicit Move Pattern Color Legend */}
      <div className="flex flex-col gap-0.5 text-[9px] font-arcade font-bold text-[#B2C8CE] leading-tight">
        <div className="flex items-center gap-1">
          <span className="inline-block w-2.5 h-2.5 rounded-[2px] bg-[#FFB838] border border-[#F4F9F5] text-[#122128] text-[7px] flex items-center justify-center">
            ★
          </span>
          <span className="text-[#F4F9F5]">Unit</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-2.5 h-2.5 rounded-[2px] bg-[#52E59B] border border-[#F4F9F5]" />
          <span className="text-[#52E59B]">Move</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-2.5 h-2.5 rounded-[2px] bg-[#F05A46] border border-[#F4F9F5] text-[#FFFFFF] text-[7px] flex items-center justify-center">
            J
          </span>
          <span className="text-[#F05A46]">Jump</span>
        </div>
      </div>
    </div>
  );
};

