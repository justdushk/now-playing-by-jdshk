import type { Track } from '../types/music';
import type {
  DesktopPlatformBridge,
  NativeCapabilitiesSnapshot,
  TrayMenuAction,
  WindowPlacement,
} from '../types/platform';

/**
 * Formats seconds as mm:ss with clean padding for tabular-nums display.
 */
export function formatDuration(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Advances a mock track's playback position cleanly, wrapping or signaling
 * track completion so the prototype simulates continuous playback.
 */
export function advanceTrackPosition(
  track: Track,
  deltaSeconds: number,
): { updatedTrack: Track; didFinish: boolean } {
  if (track.playbackState !== 'playing') {
    return { updatedTrack: track, didFinish: false };
  }

  const nextPos = track.positionSeconds + deltaSeconds;
  if (nextPos >= track.durationSeconds) {
    return {
      updatedTrack: { ...track, positionSeconds: track.durationSeconds },
      didFinish: true,
    };
  }

  return {
    updatedTrack: { ...track, positionSeconds: nextPos },
    didFinish: false,
  };
}

/**
 * Browser-safe prototype implementation of DesktopPlatformBridge.
 * Exposes the exact surface a Tauri 2 Rust backend will fulfill later,
 * while clearly reporting runtime capabilities as 'browser-prototype'.
 */
export class BrowserPrototypeBridge implements DesktopPlatformBridge {
  private trayListeners = new Set<(action: TrayMenuAction) => void>();

  getCapabilities(): NativeCapabilitiesSnapshot {
    return {
      runtime: 'browser-prototype',
      supportsTransparentFramelessWindow: false,
      supportsSystemTray: false,
      supportsAlwaysOnTop: false,
      supportsWindowsStartup: false,
      supportsNativeSmtc: false,
    };
  }

  async setAlwaysOnTop(_enabled: boolean): Promise<void> {
    // Future Tauri 2 implementation: invoke('set_always_on_top', { enabled })
  }

  async setLaunchAtStartup(_enabled: boolean): Promise<void> {
    // Future Tauri 2 implementation: tauri-plugin-autostart enable/disable
  }

  async hideMainWindowToTray(): Promise<void> {
    // Future Tauri 2 implementation: appWindow.hide()
  }

  async showMainWindow(): Promise<void> {
    // Future Tauri 2 implementation: appWindow.show() + setFocus()
  }

  async saveWindowPlacement(_placement: Partial<WindowPlacement>): Promise<void> {
    // Future Tauri 2 implementation: persist window coordinates to AppData
  }

  registerTrayActionHandler(handler: (action: TrayMenuAction) => void): () => void {
    this.trayListeners.add(handler);
    return () => {
      this.trayListeners.delete(handler);
    };
  }
}

export const desktopBridge = new BrowserPrototypeBridge();
