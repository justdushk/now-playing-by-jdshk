import { useCallback, useEffect, useRef, useState } from 'react';
import { MOCK_TRACKS } from '../data/mockTracks';
import {
  advanceTrackPosition,
} from '../services/musicSourceManager';
import {
  loadWidgetSettings,
  resetWidgetSettings,
  saveWidgetSettings,
} from '../services/settingsStorage';
import type { Track, WidgetSettings } from '../types/music';

export function useNowPlayingPrototype() {
  const [settings, setSettings] = useState<WidgetSettings>(() => loadWidgetSettings());
  const [tracks] = useState<Track[]>(MOCK_TRACKS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentTrack, setCurrentTrack] = useState<Track>(() => MOCK_TRACKS[0]);

  const [notificationVisible, setNotificationVisible] = useState<boolean>(true);
  const [notificationSecondsLeft, setNotificationSecondsLeft] = useState<number | null>(
    null,
  );
  const notificationDeadlineRef = useRef<number | null>(null);

  const triggerNotification = useCallback(
    (durationSecondsOverride?: number) => {
      const duration = durationSecondsOverride ?? settings.notificationDurationSeconds;
      notificationDeadlineRef.current = Date.now() + duration * 1000;
      setNotificationVisible(true);
      setNotificationSecondsLeft(duration);
    },
    [settings.notificationDurationSeconds],
  );

  // Persist settings whenever updated
  useEffect(() => {
    saveWidgetSettings(settings);
  }, [settings]);

  // Manage notification timer countdown when in Notification mode
  useEffect(() => {
    if (settings.mode === 'persistent') {
      notificationDeadlineRef.current = null;
      setNotificationVisible(true);
      setNotificationSecondsLeft(null);
      return;
    }

    // Entering notification mode immediately previews a fresh notification
    triggerNotification(settings.notificationDurationSeconds);

    const intervalId = window.setInterval(() => {
      const deadline = notificationDeadlineRef.current;
      if (deadline === null) {
        return;
      }
      const remainingMs = deadline - Date.now();
      if (remainingMs <= 0) {
        notificationDeadlineRef.current = null;
        setNotificationVisible(false);
        setNotificationSecondsLeft(null);
      } else {
        setNotificationVisible(true);
        setNotificationSecondsLeft(remainingMs / 1000);
      }
    }, 100);

    return () => window.clearInterval(intervalId);
  }, [settings.mode, settings.notificationDurationSeconds, triggerNotification]);

  const switchToIndex = useCallback(
    (nextIndex: number) => {
      const wrappedIndex = ((nextIndex % tracks.length) + tracks.length) % tracks.length;
      const baseTrack = tracks[wrappedIndex];
      setCurrentIndex(wrappedIndex);
      setCurrentTrack({
        ...baseTrack,
        positionSeconds: 0,
        playbackState: 'playing',
      });
      if (settings.mode === 'notification') {
        triggerNotification();
      }
    },
    [tracks, settings.mode, triggerNotification],
  );

  const handleNextTrack = useCallback(() => {
    switchToIndex(currentIndex + 1);
  }, [currentIndex, switchToIndex]);

  const handlePrevTrack = useCallback(() => {
    // If more than 4 seconds in, restart current track cleanly like real media players
    if (currentTrack.positionSeconds > 4) {
      setCurrentTrack((prev) => ({
        ...prev,
        positionSeconds: 0,
        playbackState: 'playing',
      }));
      if (settings.mode === 'notification') {
        triggerNotification();
      }
      return;
    }
    switchToIndex(currentIndex - 1);
  }, [currentIndex, currentTrack.positionSeconds, settings.mode, switchToIndex, triggerNotification]);

  const handleSelectTrack = useCallback(
    (trackId: string) => {
      const foundIndex = tracks.findIndex((t) => t.id === trackId);
      if (foundIndex >= 0) {
        switchToIndex(foundIndex);
      }
    },
    [tracks, switchToIndex],
  );

  const handleTogglePlayPause = useCallback(() => {
    setCurrentTrack((prev) => ({
      ...prev,
      playbackState: prev.playbackState === 'playing' ? 'paused' : 'playing',
    }));
  }, []);

  const handleSeek = useCallback((positionSeconds: number) => {
    setCurrentTrack((prev) => ({
      ...prev,
      positionSeconds: Math.min(prev.durationSeconds, Math.max(0, positionSeconds)),
    }));
  }, []);

  // Simulate smooth playback progress tick
  useEffect(() => {
    if (currentTrack.playbackState !== 'playing') {
      return;
    }

    const tickMs = 250;
    const intervalId = window.setInterval(() => {
      setCurrentTrack((prev) => advanceTrackPosition(prev, tickMs / 1000).updatedTrack);
    }, tickMs);

    return () => window.clearInterval(intervalId);
  }, [currentTrack.playbackState]);

  // Advance cleanly when simulated track reaches its end
  useEffect(() => {
    if (
      currentTrack.playbackState === 'playing' &&
      currentTrack.positionSeconds >= currentTrack.durationSeconds
    ) {
      switchToIndex(currentIndex + 1);
    }
  }, [
    currentTrack.playbackState,
    currentTrack.positionSeconds,
    currentTrack.durationSeconds,
    currentIndex,
    switchToIndex,
  ]);

  const updateSettings = useCallback((patch: Partial<WidgetSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(resetWidgetSettings());
  }, []);

  const isWidgetVisible =
    settings.mode === 'persistent' ? true : notificationVisible;

  return {
    tracks,
    currentTrack,
    settings,
    isWidgetVisible,
    notificationSecondsLeft,
    updateSettings,
    resetSettings,
    handleSelectTrack,
    handleTogglePlayPause,
    handleNextTrack,
    handlePrevTrack,
    handleSeek,
    triggerNotification,
  };
}
