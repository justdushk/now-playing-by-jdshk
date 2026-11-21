import { Bell, Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import {
  SOURCE_LABELS,
  type Track,
  type WidgetSettings,
} from '../../types/music';
import { formatDuration } from '../../services/musicSourceManager';
import { NowPlayingWidget } from '../widget/NowPlayingWidget';

interface DesktopStageProps {
  tracks: Track[];
  currentTrack: Track;
  settings: WidgetSettings;
  isWidgetVisible: boolean;
  notificationSecondsLeft: number | null;
  onSelectTrack: (trackId: string) => void;
  onTogglePlayPause: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  onSeek: (positionSeconds: number) => void;
  onTriggerNotification: () => void;
}

export function DesktopStage({
  tracks,
  currentTrack,
  settings,
  isWidgetVisible,
  notificationSecondsLeft,
  onSelectTrack,
  onTogglePlayPause,
  onNextTrack,
  onPrevTrack,
  onSeek,
  onTriggerNotification,
}: DesktopStageProps) {
  const isPlaying = currentTrack.playbackState === 'playing';
  const isNotificationMode = settings.mode === 'notification';

  return (
    <div className="flex flex-col gap-6">
      {/* Desktop Preview Frame */}
      <section
        aria-label="Desktop widget preview stage"
        className="relative rounded-2xl border border-white/[0.08] bg-[#0F1116] overflow-hidden min-h-[450px] sm:min-h-[490px] flex flex-col justify-between p-5"
      >
        {/* Subtle matte desktop wallpaper surface (calm, zero neon clutter) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 30% 24%, rgba(255, 255, 255, 0.035), transparent 55%), radial-gradient(circle at 75% 78%, rgba(229, 169, 82, 0.03), transparent 50%)',
          }}
        />

        {/* Top quiet stage caption */}
        <div className="relative z-10 flex items-center justify-between gap-4 text-xs text-[#88909E]">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-medium text-[#C5CAD3] whitespace-nowrap">
              {isNotificationMode ? 'Notification Overlay Preview' : 'Persistent Desktop Widget'}
            </span>
            <span aria-hidden="true" className="text-[#4F5563]">
              ·
            </span>
            <span className="truncate">
              {isNotificationMode
                ? `Auto-hides after ${settings.notificationDurationSeconds}s`
                : 'Stays visible on desktop'}
            </span>
          </div>

          {isNotificationMode && (
            <div className="flex items-center gap-3 shrink-0">
              {isWidgetVisible && notificationSecondsLeft !== null ? (
                <span className="font-mono tabular-nums text-[#D4A45B] whitespace-nowrap">
                  Visible · {notificationSecondsLeft.toFixed(1)}s
                </span>
              ) : (
                <span className="text-[#6F7685] whitespace-nowrap">Hidden</span>
              )}
              <button
                type="button"
                onClick={onTriggerNotification}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.11] text-[#ECEEF2] text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A952]"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Replay Notification</span>
              </button>
            </div>
          )}
        </div>

        {/* Center / Anchored Widget Presentation */}
        <div
          className={`relative z-10 flex-1 flex my-4 ${
            isNotificationMode
              ? 'items-end justify-end sm:p-3'
              : 'items-center justify-center'
          }`}
        >
          <NowPlayingWidget
            track={currentTrack}
            settings={settings}
            isVisible={isWidgetVisible}
            onTogglePlayPause={onTogglePlayPause}
            onNextTrack={onNextTrack}
            onPrevTrack={onPrevTrack}
            onSeek={onSeek}
          />

          {/* Quiet empty-stage prompt when Notification Mode has auto-dismissed */}
          {isNotificationMode && !isWidgetVisible && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <p className="text-sm text-[#9CA3B0] max-w-sm">
                Notification dismissed after {settings.notificationDurationSeconds} seconds.
                Switch tracks or replay to preview entry and exit motion.
              </p>
              <button
                type="button"
                onClick={onTriggerNotification}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ECEEF2] text-[#111318] hover:bg-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A952]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Show Track Notification</span>
              </button>
            </div>
          )}
        </div>

        {/* Minimal bottom desktop taskbar hint (purely spatial framing) */}
        <div className="relative z-10 pt-3 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-[#666D7A]">
          <span>Simulated Windows 11 Desktop Surface</span>
          <span className="font-mono tabular-nums">
            Vinyl: {settings.vinylPosition === 'left' ? 'Left' : 'Right'} · {settings.rotationSpeed.toFixed(2)}x
          </span>
        </div>
      </section>

      {/* Mock Playback Simulator & Track Switcher */}
      <section
        aria-label="Mock playback simulator"
        className="rounded-2xl border border-white/[0.08] bg-[#13151B] p-5 space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-[#F3F4F6]">
              Mock Playback Simulator
            </h3>
            <p className="text-xs text-[#88909E] mt-0.5">
              Switch tracks to test source metadata, artwork transitions, and notification triggers.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onPrevTrack}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] text-xs font-medium text-[#D6DAE2] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A952]"
            >
              <SkipBack className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              onClick={onTogglePlayPause}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#ECEEF2] hover:bg-white text-[#111318] text-xs font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A952]"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onNextTrack}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] text-xs font-medium text-[#D6DAE2] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A952]"
            >
              <span>Next Track</span>
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Clean track selector list (unboxed metadata, single-elevation rows) */}
        <div className="divide-y divide-white/[0.06] border-t border-white/[0.06]">
          {tracks.map((item) => {
            const isActive = item.id === currentTrack.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTrack(item.id)}
                className={`w-full flex items-center justify-between gap-4 py-2.5 px-2 text-left transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A952] ${
                  isActive
                    ? 'bg-white/[0.06] text-white'
                    : 'hover:bg-white/[0.03] text-[#B4BAC5]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.artworkUrl}
                    alt={`${item.album} cover`}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-md object-cover shrink-0 bg-[#1D2027]"
                  />
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium truncate text-[#F3F4F6]">
                      {item.title}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#88909E] truncate">
                      <span className="truncate">{item.artist}</span>
                      <span aria-hidden="true">·</span>
                      <span className="whitespace-nowrap shrink-0">
                        {SOURCE_LABELS[item.source]}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {isActive && (
                    <span className="text-[11px] font-medium text-[#E5A952] whitespace-nowrap">
                      {isPlaying ? 'Playing' : 'Paused'}
                    </span>
                  )}
                  <span className="text-xs font-mono tabular-nums text-[#7C8391]">
                    {formatDuration(item.durationSeconds)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
