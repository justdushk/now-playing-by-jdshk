import { Layers, Monitor, Radio, ShieldCheck } from 'lucide-react';
import { desktopBridge } from '../../services/musicSourceManager';

const PLANNED_MUSIC_SOURCES = [
  {
    name: 'Windows SMTC',
    mechanism: 'Rust `windows::Media::Control` GlobalSystemMediaTransportControlsSessionManager',
    scope: 'Native OS session detection for Spotify Desktop, local players, and browsers',
    status: 'Planned Native Rust',
  },
  {
    name: 'YouTube Music',
    mechanism: 'Chromium / Edge extension observing MediaSession & DOM player state via local WebSocket',
    scope: 'Rich track metadata, high-res artwork URL, and accurate live scrub position',
    status: 'Planned Extension',
  },
  {
    name: 'SoundCloud',
    mechanism: 'Browser extension adapter normalized into provider-independent Track schema',
    scope: 'Stream title, artist handle, artwork, and playback progress events',
    status: 'Planned Extension',
  },
  {
    name: 'Spotify',
    mechanism: 'Windows SMTC primary capture + optional browser extension fallback',
    scope: 'Zero-OAuth local playback visibility with instant track-change notifications',
    status: 'Planned Native + Ext',
  },
];

const PLANNED_WINDOWS_FEATURES = [
  {
    title: 'Transparent, Frameless Window',
    detail: 'Tauri 2 window configuration with `transparent: true`, `decorations: false`, and DWM acrylic/mica surface.',
  },
  {
    title: 'Always-on-Top & Desktop Pinning',
    detail: 'Toggle floating overlay priority (`set_always_on_top`) or anchor cleanly to desktop corner coordinates.',
  },
  {
    title: 'System Tray & Background Persistence',
    detail: 'Windows notification-area tray icon with context menu to show/hide main window without terminating background listeners.',
  },
  {
    title: 'Window Positioning & Resizing',
    detail: 'Draggable widget surface with persisted X/Y monitor bounds and scale presets stored in local AppData.',
  },
  {
    title: 'Windows Startup Integration',
    detail: 'Opt-in launch at Windows sign-in via `tauri-plugin-autostart`.',
  },
  {
    title: 'Native Notification Timing',
    detail: 'Click-through overlay window (`set_ignore_cursor_events`) triggered automatically on track transitions.',
  },
];

export function ArchitectureView() {
  const capabilities = desktopBridge.getCapabilities();

  return (
    <div className="space-y-8">
      {/* Runtime Transparency Header */}
      <section className="rounded-2xl border border-white/[0.08] bg-[#13151B] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <h2 className="text-lg font-semibold text-[#F3F4F6]">
              Tauri 2 & Windows 11 Integration Architecture
            </h2>
            <p className="text-sm text-[#9CA3B0] leading-relaxed">
              This stage is a browser-hosted React and TypeScript UI prototype using simulated playback.
              OS-level media detection and window chrome are cleanly separated behind typed platform interfaces so they can be wired to Rust commands in Tauri 2 without refactoring the visual components.
            </p>
          </div>
          <div className="text-xs text-[#88909E] border border-white/[0.08] rounded-lg px-3 py-2 bg-[#0B0C10]">
            Runtime: <span className="font-mono text-[#E5A952]">{capabilities.runtime}</span>
          </div>
        </div>
      </section>

      {/* Two-Column Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Music Source Adapters */}
        <section className="rounded-2xl border border-white/[0.08] bg-[#13151B] p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <Radio className="w-4 h-4 text-[#E5A952]" />
              <h3 className="text-sm font-semibold text-[#F3F4F6]">
                Provider-Independent Source Adapters
              </h3>
            </div>
            <p className="text-xs text-[#88909E] leading-relaxed">
              Every integration normalizes into a single <code className="font-mono text-[#D6DAE2]">Track</code> contract containing title, artist, album artwork, duration, position, playback state, and source identifier.
            </p>

            <div className="divide-y divide-white/[0.06] border-t border-white/[0.06]">
              {PLANNED_MUSIC_SOURCES.map((source) => (
                <div key={source.name} className="py-3.5 space-y-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-[#ECEEF2]">
                      {source.name}
                    </span>
                    <span className="text-[11px] font-mono text-[#88909E]">
                      {source.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#9CA3B0]">{source.scope}</p>
                  <p className="text-[11px] font-mono text-[#6F7685]">{source.mechanism}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Planned Windows 11 Native Layer */}
        <section className="rounded-2xl border border-white/[0.08] bg-[#13151B] p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <Monitor className="w-4 h-4 text-[#E5A952]" />
              <h3 className="text-sm font-semibold text-[#F3F4F6]">
                Native Windows 11 Shell Capabilities (Rust)
              </h3>
            </div>
            <p className="text-xs text-[#88909E] leading-relaxed">
              Defined in <code className="font-mono text-[#D6DAE2]">DesktopPlatformBridge</code>. Not simulated with fake OS behavior inside the browser; ready for Tauri 2 command bindings.
            </p>

            <div className="divide-y divide-white/[0.06] border-t border-white/[0.06]">
              {PLANNED_WINDOWS_FEATURES.map((feat) => (
                <div key={feat.title} className="py-3 space-y-1">
                  <div className="text-xs font-semibold text-[#ECEEF2]">
                    {feat.title}
                  </div>
                  <p className="text-xs text-[#9CA3B0] leading-relaxed">
                    {feat.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Data Model Reference */}
      <section className="rounded-2xl border border-white/[0.08] bg-[#13151B] p-6 space-y-3">
        <div className="flex items-center gap-2.5">
          <Layers className="w-4 h-4 text-[#E5A952]" />
          <h3 className="text-sm font-semibold text-[#F3F4F6]">
            Normalized Track Contract
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-1">
          {[
            { field: 'title', type: 'string' },
            { field: 'artist', type: 'string' },
            { field: 'artworkUrl', type: 'string' },
            { field: 'durationSeconds', type: 'number' },
            { field: 'positionSeconds', type: 'number' },
            { field: 'playbackState', type: 'playing | paused | stopped' },
            { field: 'source', type: 'MusicSourceId' },
          ].map((col) => (
            <div
              key={col.field}
              className="rounded-xl bg-[#0B0C10] border border-white/[0.06] p-3 space-y-1"
            >
              <div className="text-xs font-mono text-[#ECEEF2] truncate">{col.field}</div>
              <div className="text-[11px] font-mono text-[#7C8391] truncate">{col.type}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 pt-2 text-xs text-[#7C8391]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#88909E] shrink-0" />
          <span>
            Zero external audio APIs or cloud dependencies required — all track state flows locally from OS/browser listeners to the React widget.
          </span>
        </div>
      </section>
    </div>
  );
}
