import { useEffect, useState } from 'react';
import { Disc3 } from 'lucide-react';
import { VINYL_COLOR_OPTIONS, type VinylColorPresetId } from '../../types/music';

interface VinylDiscProps {
  sizePx: number;
  isPlaying: boolean;
  rotationSpeed: number;
  vinylColor: VinylColorPresetId;
  labelAccentHex: string;
  artworkUrl: string;
  albumTitle: string;
}

export function VinylDisc({
  sizePx,
  isPlaying,
  rotationSpeed,
  vinylColor,
  labelAccentHex,
  artworkUrl,
  albumTitle,
}: VinylDiscProps) {
  const [labelImgFailed, setLabelImgFailed] = useState(false);

  useEffect(() => {
    setLabelImgFailed(false);
  }, [artworkUrl]);

  const palette =
    VINYL_COLOR_OPTIONS.find((option) => option.id === vinylColor) ??
    VINYL_COLOR_OPTIONS[0];

  const isLightWax = vinylColor === 'bone-ivory';
  const labelSize = Math.round(sizePx * 0.35);
  const spindleSize = Math.max(10, Math.round(sizePx * 0.068));
  const holeRadiusPx = spindleSize / 2;
  const holeMask = `radial-gradient(circle at 50% 50%, transparent 0px, transparent ${holeRadiusPx}px, black ${holeRadiusPx + 0.75}px)`;
  const maskStyles = {
    maskImage: holeMask,
    WebkitMaskImage: holeMask,
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    maskPosition: 'center',
    WebkitMaskPosition: 'center',
    maskSize: '100% 100%',
    WebkitMaskSize: '100% 100%',
  } as const;
  const spinDurationSeconds = 6 / Math.max(0.25, rotationSpeed);

  return (
    <div
      className="relative rounded-full select-none"
      style={{
        width: `${sizePx}px`,
        height: `${sizePx}px`,
        filter:
          'drop-shadow(0 18px 28px rgba(0, 0, 0, 0.72)) drop-shadow(0 4px 10px rgba(0, 0, 0, 0.45))',
      }}
      aria-hidden="true"
    >
      {/* Pure CSS rotating vinyl disc body + grooves + central artwork label + center cutout */}
      <div
        className="absolute inset-0 rounded-full will-change-transform"
        style={{
          animationName: 'vinyl-spin',
          animationDuration: `${spinDurationSeconds.toFixed(3)}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          animationPlayState: isPlaying ? 'running' : 'paused',
          transformOrigin: 'center center',
          ...maskStyles,
          backgroundColor: palette.baseHex,
          boxShadow: `inset 0 0 0 1.5px ${palette.rimHex}`,
          backgroundImage: `
            radial-gradient(circle at center,
              transparent 0%,
              transparent 18%,
              ${palette.grooveHighlightHex} 18.4%,
              transparent 19%,
              transparent 24%,
              ${palette.grooveHighlightHex} 24.4%,
              transparent 25.1%,
              transparent 32%,
              ${palette.grooveHighlightHex} 32.3%,
              transparent 33%,
              transparent 41%,
              ${palette.grooveHighlightHex} 41.3%,
              transparent 42%
            ),
            repeating-radial-gradient(circle at center,
              transparent 0px,
              transparent 2px,
              ${palette.grooveHighlightHex} 2.6px,
              transparent 3.3px
            )
          `,
        }}
      >
        {/* Asymmetric tonal bands rotating with the disc so groove motion is visibly tactile */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: isLightWax
              ? 'conic-gradient(from 15deg, rgba(0,0,0,0.08) 0deg, transparent 55deg, rgba(0,0,0,0.05) 170deg, transparent 245deg, rgba(0,0,0,0.08) 360deg)'
              : 'conic-gradient(from 15deg, rgba(255,255,255,0.075) 0deg, transparent 55deg, rgba(255,255,255,0.045) 170deg, transparent 245deg, rgba(255,255,255,0.075) 360deg)',
          }}
        />

        {/* Lead-in outer lip */}
        <div
          className="absolute inset-[2.5%] rounded-full pointer-events-none"
          style={{
            border: `1px solid ${isLightWax ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.09)'}`,
          }}
        />

        {/* Run-out inner groove divider */}
        <div
          className="absolute inset-[29%] rounded-full pointer-events-none"
          style={{
            border: `1px solid ${isLightWax ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.12)'}`,
          }}
        />

        {/* Central circular album artwork label (rotates with the vinyl disc, masked at center) */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-[#191B20]"
          style={{
            width: `${labelSize}px`,
            height: `${labelSize}px`,
            borderRadius: '50%',
            border: `1.5px solid ${labelAccentHex}`,
            boxShadow:
              'inset 0 0 6px rgba(0, 0, 0, 0.5), 0 0 0 2px rgba(0, 0, 0, 0.55)',
            ...maskStyles,
          }}
        >
          {!labelImgFailed ? (
            <img
              src={artworkUrl}
              alt={`${albumTitle} vinyl center label`}
              referrerPolicy="no-referrer"
              onError={() => setLabelImgFailed(true)}
              className="w-full h-full object-cover scale-[1.06]"
              style={{ borderRadius: '50%' }}
              draggable={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#232630]">
              <Disc3 className="w-5 h-5 text-white/45" />
            </div>
          )}

          {/* Subtle paper label inner vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: '50%',
              boxShadow: 'inset 0 0 8px rgba(0, 0, 0, 0.35)',
            }}
          />
        </div>

        {/* Thin bevel rim strictly around the transparent center cutout (rotates with disc) */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: `${spindleSize + 3}px`,
            height: `${spindleSize + 3}px`,
            borderRadius: '50%',
            backgroundColor: 'transparent',
            borderWidth: '1.5px',
            borderStyle: 'solid',
            borderTopColor: 'rgba(255, 255, 255, 0.30)',
            borderRightColor: 'rgba(255, 255, 255, 0.16)',
            borderBottomColor: 'rgba(0, 0, 0, 0.55)',
            borderLeftColor: 'rgba(255, 255, 255, 0.16)',
            boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.55)',
          }}
        />
      </div>

      {/* Stationary anisotropic light sheen (does NOT spin — simulates overhead reflection) */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          opacity: palette.sheenOpacity,
          background:
            'conic-gradient(from -35deg at 50% 50%, rgba(255,255,255,0.34) 0deg, rgba(255,255,255,0.03) 38deg, transparent 78deg, transparent 142deg, rgba(255,255,255,0.22) 182deg, rgba(255,255,255,0.02) 225deg, transparent 275deg, rgba(255,255,255,0.34) 360deg)',
          maskImage:
            'radial-gradient(circle at center, transparent 17%, black 19%, black 98%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(circle at center, transparent 17%, black 19%, black 98%, transparent 100%)',
        }}
      />
    </div>
  );
}
