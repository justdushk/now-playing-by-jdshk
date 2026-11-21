import type { MusicSourceId, PlaybackState, Track } from './music';

/**
 * Provider-independent music adapter contract.
 * In the future Tauri 2 application, each integration implements this interface:
 * - Windows SMTC via Rust `windows::Media::Control` crate + Tauri event stream
 * - Browser extension WebSocket bridge for YouTube Music, SoundCloud, and Spotify Web
 */
export interface MusicProviderAdapter {
  readonly sourceId: MusicSourceId;
  readonly displayName: string;
  readonly transportType: 'mock-prototype' | 'windows-smtc' | 'browser-extension-ws';
  subscribe(listener: (track: Track | null) => void): () => void;
  sendCommand(command: 'play' | 'pause' | 'next' | 'previous'): Promise<void>;
  seekTo(positionSeconds: number): Promise<void>;
}

export type TrayMenuAction =
  | 'toggle-visibility'
  | 'toggle-always-on-top'
  | 'switch-mode'
  | 'open-settings'
  | 'quit';

export interface WindowPlacement {
  x: number;
  y: number;
  width: number;
  height: number;
  alwaysOnTop: boolean;
  transparent: boolean;
  frameless: boolean;
}

export interface NativeCapabilitiesSnapshot {
  runtime: 'browser-prototype' | 'tauri-windows';
  supportsTransparentFramelessWindow: boolean;
  supportsSystemTray: boolean;
  supportsAlwaysOnTop: boolean;
  supportsWindowsStartup: boolean;
  supportsNativeSmtc: boolean;
}

/**
 * Clean integration boundary for Tauri 2 + Rust desktop commands.
 * In the browser prototype, methods update local preview state cleanly
 * without pretending native OS execution occurs.
 */
export interface DesktopPlatformBridge {
  getCapabilities(): NativeCapabilitiesSnapshot;
  setAlwaysOnTop(enabled: boolean): Promise<void>;
  setLaunchAtStartup(enabled: boolean): Promise<void>;
  hideMainWindowToTray(): Promise<void>;
  showMainWindow(): Promise<void>;
  saveWindowPlacement(placement: Partial<WindowPlacement>): Promise<void>;
  registerTrayActionHandler(handler: (action: TrayMenuAction) => void): () => void;
}

export interface NormalizedTrackEvent {
  track: Track;
  previousPlaybackState: PlaybackState;
  receivedAtIso: string;
}
