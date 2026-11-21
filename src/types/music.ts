export type MusicSourceId =
  | 'spotify'
  | 'youtube-music'
  | 'soundcloud'
  | 'windows-smtc';

export type PlaybackState = 'playing' | 'paused' | 'stopped';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  artworkUrl: string;
  durationSeconds: number;
  positionSeconds: number;
  playbackState: PlaybackState;
  source: MusicSourceId;
  /** Subtle warm or cool hue used only for the vinyl center label ring */
  labelAccentHex: string;
  releaseYear: number;
}

export type WidgetDisplayMode = 'persistent' | 'notification';

export type VinylPosition = 'left' | 'right';

export type VinylColorPresetId =
  | 'classic-black'
  | 'obsidian-smoke'
  | 'midnight-slate'
  | 'warm-amber'
  | 'crimson-wax'
  | 'bone-ivory';

export interface VinylColorOption {
  id: VinylColorPresetId;
  label: string;
  baseHex: string;
  grooveHighlightHex: string;
  sheenOpacity: number;
  rimHex: string;
}

export type WidgetSizePreset = 'compact' | 'standard' | 'large';

export interface WidgetSettings {
  mode: WidgetDisplayMode;
  vinylPosition: VinylPosition;
  vinylColor: VinylColorPresetId;
  /** Multiplier where 1.0 = 33.3 RPM (~1.8s per revolution visual cadence or natural 3.2s smooth rotation) */
  rotationSpeed: number;
  /** Duration in seconds before notification mode smoothly hides */
  notificationDurationSeconds: number;
  /** Toggle inline transport buttons on hover/widget */
  showInlineControls: boolean;
  widgetSize: WidgetSizePreset;
}

export const VINYL_COLOR_OPTIONS: VinylColorOption[] = [
  {
    id: 'classic-black',
    label: 'Classic Black',
    baseHex: '#0D0E11',
    grooveHighlightHex: 'rgba(255, 255, 255, 0.085)',
    sheenOpacity: 0.22,
    rimHex: '#1F2229',
  },
  {
    id: 'obsidian-smoke',
    label: 'Obsidian Smoke',
    baseHex: '#1D2026',
    grooveHighlightHex: 'rgba(255, 255, 255, 0.11)',
    sheenOpacity: 0.26,
    rimHex: '#323742',
  },
  {
    id: 'midnight-slate',
    label: 'Midnight Blue',
    baseHex: '#111A2B',
    grooveHighlightHex: 'rgba(165, 198, 255, 0.12)',
    sheenOpacity: 0.24,
    rimHex: '#233454',
  },
  {
    id: 'warm-amber',
    label: 'Amber Wax',
    baseHex: '#4F2F12',
    grooveHighlightHex: 'rgba(255, 210, 148, 0.15)',
    sheenOpacity: 0.25,
    rimHex: '#7A4A1D',
  },
  {
    id: 'crimson-wax',
    label: 'Oxblood Red',
    baseHex: '#3E1419',
    grooveHighlightHex: 'rgba(255, 175, 180, 0.13)',
    sheenOpacity: 0.24,
    rimHex: '#632129',
  },
  {
    id: 'bone-ivory',
    label: 'Bone Ivory',
    baseHex: '#CFC9BE',
    grooveHighlightHex: 'rgba(20, 20, 24, 0.11)',
    sheenOpacity: 0.18,
    rimHex: '#DFDBD2',
  },
];

export const SOURCE_LABELS: Record<MusicSourceId, string> = {
  spotify: 'Spotify',
  'youtube-music': 'YouTube Music',
  soundcloud: 'SoundCloud',
  'windows-smtc': 'Windows SMTC',
};

export const DEFAULT_WIDGET_SETTINGS: WidgetSettings = {
  mode: 'persistent',
  vinylPosition: 'left',
  vinylColor: 'classic-black',
  rotationSpeed: 1.0,
  notificationDurationSeconds: 5,
  showInlineControls: true,
  widgetSize: 'standard',
};
