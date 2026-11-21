import { useEffect, useState, type MouseEvent } from 'react';
import { Disc3, Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import {
  SOURCE_LABELS,
  type Track,
  type WidgetSettings,
  type WidgetSizePreset,
} from '../../types/music';
import { formatDuration } from '../../services/musicSourceManager';
import { VinylDisc } from './VinylDisc';

interface NowPlayingWidgetProps {
  track: Track;
  settings: WidgetSettings;
  isVisible: boolean;
  onTogglePlayPause: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  onSeek: (positionSeconds: number) => void;
}

interface HorizontalSizeMetrics {
  coverPx: number;
  vinylPx: number;
  vinylProtrudePx: number;
  columnGapPx: number;
  infoWidthPx: number;
  cardPaddingPx: number;
  titleClass: string;
  subtitleClass: string;
  timeClass: string;
  playButtonClass: string;
  playIconClass: string;
  skipButtonClass: string;
  skipIconClass: string;
}

const SIZE_DIMENSIONS: Record<WidgetSizePreset, HorizontalSizeMetrics> = {
  compact: {
    coverPx: 116,
    vinylPx: 108,
    vinylProtrudePx: 62,
    columnGapPx: 16,
    infoWidthPx: 204,
    cardPaddingPx: 16,
    titleClass: 'text-[13.5px] leading-tight',
    subtitleClass: 'text-[11.5px] leading-tight',
    timeClass: 'text-[10px]',
    playButtonClass: 'w-7 h-7',
    playIconClass: 'w-3 h-3',
    skipButtonClass: 'p-1.5',
    skipIconClass: 'w-3 h-3',
  },
  standard: {
    coverPx: 140,
    vinylPx: 130,
    vinylProtrudePx: 75,
    columnGapPx: 20,
    infoWidthPx: 236,
    cardPaddingPx: 20,
    titleClass: 'text-[15px] leading-snug',
    subtitleClass: 'text-[12.5px] leading-snug',
    timeClass: 'text-[11px]',
    playButtonClass: 'w-8 h-8',
    playIconClass: 'w-3.5 h-3.5',
    skipButtonClass: 'p-1.5',
    skipIconClass: 'w-3.5 h-3.5',
  },
  large: {
    coverPx: 164,
    vinylPx: 152,
    vinylProtrudePx: 88,
    columnGapPx: 24,
    infoWidthPx: 268,
    cardPaddingPx: 22,
    titleClass: 'text-[16.5px] leading-snug',
    subtitleClass: 'text-[13.5px] leading-snug',
    timeClass: 'text-[11.5px]',
    playButtonClass: 'w-9 h-9',
    playIconClass: 'w-4 h-4',
    skipButtonClass: 'p-2',
    skipIconClass: 'w-4 h-4',
  },
};

export function NowPlayingWidget({
  track,
  settings,
  isVisible,
  onTogglePlayPause,
  onNextTrack,
  onPrevTrack,
  onSeek,
}: NowPlayingWidgetProps) {
  const [artworkFailed, setArtworkFailed] = useState(false);

  useEffect(() => {
    setArtworkFailed(false);
  }, [track.artworkUrl]);

  const dims = SIZE_DIMENSIONS[settings.widgetSize];
  const stageWidthPx = dims.coverPx + dims.vinylProtrudePx;
  const cardWidthPx =
    dims.cardPaddingPx * 2 + stageWidthPx + dims.columnGapPx + dims.infoWidthPx;
  const isPlaying = track.playbackState === 'playing';
  const isVinylLeft = settings.vinylPosition === 'left';

  const progressPct =
    track.durationSeconds > 0
      ? Math.min(100, Math.max(0, (track.positionSeconds / track.durationSeconds) * 100))
      : 0;

  const handleProgressClick = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width <= 0) return;
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    onSeek(Math.round(ratio * track.durationSeconds));
  };

  const coverTranslateX = isVinylLeft ? dims.vinylProtrudePx : 0;
  const vinylTranslateX = isVinylLeft ? 0 : stageWidthPx - dims.vinylPx;

  return (
    <aside
      aria-label="Now Playing desktop widget"
      aria-hidden={!isVisible}
      className={`motion-safe-only transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] max-w-full ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-3 scale-[0.97] pointer-events-none'
      }`}
    >
      {/* Horizontal dark desktop widget surface */}
      <div
        className="relative rounded-2xl bg-[#14161B]/92 backdrop-blur-xl border border-white/[0.08] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.78)] select-none flex items-center max-w-full"
        style={{
          width: `${cardWidthPx}px`,
          padding: `${dims.cardPaddingPx}px`,
          gap: `${dims.columnGapPx}px`,
        }}
      >
        {/* LEFT SECTION: Square Album Cover + Protruding Spinning Vinyl Behind It */}
        <div
          className="relative shrink-0"
          style={{
            width: `${stageWidthPx}px`,
            height: `${dims.coverPx}px`,
          }}
        >
          {/* Partially visible spinning vinyl record positioned behind album cover */}
          <div
            className="absolute left-0 top-1/2 z-0 motion-safe-only transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              transform: `translate3d(${vinylTranslateX}px, -50%, 0)`,
            }}
          >
            <VinylDisc
              sizePx={dims.vinylPx}
              isPlaying={isPlaying}
              rotationSpeed={settings.rotationSpeed}
              vinylColor={settings.vinylColor}
              labelAccentHex={track.labelAccentHex}
              artworkUrl={track.artworkUrl}
              albumTitle={track.album}
            />
          </div>

          {/* Foreground square album cover casting a directional shadow onto the vinyl */}
          <div
            className="absolute left-0 top-0 z-10 rounded-xl overflow-hidden bg-[#1D2027] ring-1 ring-white/10 motion-safe-only transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              width: `${dims.coverPx}px`,
              height: `${dims.coverPx}px`,
              transform: `translate3d(${coverTranslateX}px, 0, 0)`,
              boxShadow: isVinylLeft
                ? '-14px 12px 28px rgba(0, 0, 0, 0.72), 0 8px 20px rgba(0, 0, 0, 0.45)'
                : '14px 12px 28px rgba(0, 0, 0, 0.72), 0 8px 20px rgba(0, 0, 0, 0.45)',
            }}
          >
            {!artworkFailed ? (
              <img
                src={track.artworkUrl}
                alt={`${track.album} album artwork`}
                referrerPolicy="no-referrer"
                onError={() => setArtworkFailed(true)}
                className="w-full h-full object-cover scale-[1.06]"
                draggable={false}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#232630] to-[#15171D] p-3 text-center">
                <Disc3 className="w-8 h-8 text-white/40" />
                <span className="text-[11px] text-white/60 font-medium line-clamp-2">
                  {track.album}
                </span>
              </div>
            )}

            {/* Subtle top glass edge highlight */}
            <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10 pointer-events-none" />
          </div>
        </div>

        {/* RIGHT SECTION: Track Metadata, Progress & Playback Controls */}
        <div
          className={`flex-1 min-w-0 flex flex-col ${
            settings.showInlineControls ? 'justify-between' : 'justify-center gap-3.5'
          }`}
          style={{
            minHeight: `${dims.coverPx}px`,
          }}
        >
          {/* Track Title + Artist & Source */}
          <div className="space-y-1 min-w-0">
            <h2
              className={`font-semibold tracking-[-0.01em] text-[#F3F4F6] truncate ${dims.titleClass}`}
              title={track.title}
            >
              {track.title}
            </h2>

            <div
              className={`flex items-center gap-1.5 text-[#9CA3B0] min-w-0 ${dims.subtitleClass}`}
            >
              <span className="truncate">{track.artist}</span>
              <span aria-hidden="true" className="text-[#565C68] shrink-0">
                ·
              </span>
              <span className="text-[#78808E] whitespace-nowrap shrink-0">
                {SOURCE_LABELS[track.source]}
              </span>
            </div>
          </div>

          {/* Interactive Progress Bar + Tabular Timestamps */}
          <div className="space-y-1">
            <div
              role="slider"
              tabIndex={0}
              aria-label="Track playback position"
              aria-valuemin={0}
              aria-valuemax={track.durationSeconds}
              aria-valuenow={Math.round(track.positionSeconds)}
              onClick={handleProgressClick}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') {
                  onSeek(Math.min(track.durationSeconds, track.positionSeconds + 5));
                } else if (e.key === 'ArrowLeft') {
                  onSeek(Math.max(0, track.positionSeconds - 5));
                }
              }}
              className="group relative h-3 flex items-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A952]/70 rounded"
            >
              <div className="w-full h-[3px] rounded-full bg-white/[0.10] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#ECEEF2] transition-[width] duration-200 ease-linear"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div
                className="absolute w-2.5 h-2.5 rounded-full bg-white shadow-sm opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-150 -translate-x-1/2 pointer-events-none"
                style={{ left: `${progressPct}%` }}
              />
            </div>

            <div
              className={`flex items-center justify-between font-mono tabular-nums text-[#7C8391] ${dims.timeClass}`}
            >
              <span>{formatDuration(track.positionSeconds)}</span>
              <span>{formatDuration(track.durationSeconds)}</span>
            </div>
          </div>

          {/* Optional Clean Inline Transport Controls */}
          {settings.showInlineControls && (
            <div className="pt-1 border-t border-white/[0.06] flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={onPrevTrack}
                aria-label="Previous track"
                className={`rounded-lg text-[#9CA3B0] hover:text-white hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A952]/70 ${dims.skipButtonClass}`}
              >
                <SkipBack className={dims.skipIconClass} />
              </button>

              <button
                type="button"
                onClick={onTogglePlayPause}
                aria-label={isPlaying ? 'Pause playback' : 'Play playback'}
                className={`rounded-full bg-[#ECEEF2] text-[#111318] hover:bg-white flex items-center justify-center transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A952] ${dims.playButtonClass}`}
              >
                {isPlaying ? (
                  <Pause className={`${dims.playIconClass} fill-current`} />
                ) : (
                  <Play className={`${dims.playIconClass} fill-current translate-x-[0.5px]`} />
                )}
              </button>

              <button
                type="button"
                onClick={onNextTrack}
                aria-label="Next track"
                className={`rounded-lg text-[#9CA3B0] hover:text-white hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A952]/70 ${dims.skipButtonClass}`}
              >
                <SkipForward className={dims.skipIconClass} />
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
