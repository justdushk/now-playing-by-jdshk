import {
  DEFAULT_WIDGET_SETTINGS,
  VINYL_COLOR_OPTIONS,
  type WidgetSettings,
} from '../types/music';

const STORAGE_KEY = 'now-playing:widget-settings:v1';

const VALID_VINYL_COLORS = new Set(VINYL_COLOR_OPTIONS.map((option) => option.id));

export function loadWidgetSettings(): WidgetSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_WIDGET_SETTINGS;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_WIDGET_SETTINGS;
    }

    const parsed = JSON.parse(raw) as Partial<WidgetSettings>;

    return {
      mode:
        parsed.mode === 'persistent' || parsed.mode === 'notification'
          ? parsed.mode
          : DEFAULT_WIDGET_SETTINGS.mode,
      vinylPosition:
        parsed.vinylPosition === 'left' || parsed.vinylPosition === 'right'
          ? parsed.vinylPosition
          : DEFAULT_WIDGET_SETTINGS.vinylPosition,
      vinylColor:
        parsed.vinylColor && VALID_VINYL_COLORS.has(parsed.vinylColor)
          ? parsed.vinylColor
          : DEFAULT_WIDGET_SETTINGS.vinylColor,
      rotationSpeed:
        typeof parsed.rotationSpeed === 'number' &&
        parsed.rotationSpeed >= 0.3 &&
        parsed.rotationSpeed <= 2.5
          ? parsed.rotationSpeed
          : DEFAULT_WIDGET_SETTINGS.rotationSpeed,
      notificationDurationSeconds:
        typeof parsed.notificationDurationSeconds === 'number' &&
        parsed.notificationDurationSeconds >= 2 &&
        parsed.notificationDurationSeconds <= 15
          ? parsed.notificationDurationSeconds
          : DEFAULT_WIDGET_SETTINGS.notificationDurationSeconds,
      showInlineControls:
        typeof parsed.showInlineControls === 'boolean'
          ? parsed.showInlineControls
          : DEFAULT_WIDGET_SETTINGS.showInlineControls,
      widgetSize:
        parsed.widgetSize === 'compact' ||
        parsed.widgetSize === 'standard' ||
        parsed.widgetSize === 'large'
          ? parsed.widgetSize
          : DEFAULT_WIDGET_SETTINGS.widgetSize,
    };
  } catch {
    return DEFAULT_WIDGET_SETTINGS;
  }
}

export function saveWidgetSettings(settings: WidgetSettings): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage quota or private-mode failures cleanly
  }
}

export function resetWidgetSettings(): WidgetSettings {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage failures
    }
  }
  return DEFAULT_WIDGET_SETTINGS;
}
