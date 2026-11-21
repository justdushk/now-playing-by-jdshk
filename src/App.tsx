import { useState } from 'react';
import { Disc3 } from 'lucide-react';
import { ArchitectureView } from './components/prototype/ArchitectureView';
import { DesktopStage } from './components/prototype/DesktopStage';
import { SettingsPanel } from './components/prototype/SettingsPanel';
import { useNowPlayingPrototype } from './hooks/useNowPlayingPrototype';

type WorkspaceTab = 'stage' | 'architecture';

export default function App() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('stage');
  const {
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
  } = useNowPlayingPrototype();

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#ECEEF2] flex flex-col">
      {/* Clean 3-Zone Top Bar */}
      <header className="border-b border-white/[0.07] bg-[#0B0C10]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-[1240px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-element wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('stage');
            }}
            className="text-base font-semibold tracking-tight text-[#F3F4F6] whitespace-nowrap shrink-0"
          >
            Now Playing
          </a>

          {/* Zone 2: Concise single-line navigation tabs */}
          <nav
            aria-label="Workspace sections"
            className="flex items-center gap-6 text-sm font-medium"
          >
            <button
              type="button"
              onClick={() => setActiveTab('stage')}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A952] rounded-xs ${
                activeTab === 'stage'
                  ? 'text-white border-[#E5A952]'
                  : 'text-[#88909E] border-transparent hover:text-[#D6DAE2]'
              }`}
            >
              Widget Preview
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('architecture')}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A952] rounded-xs ${
                activeTab === 'architecture'
                  ? 'text-white border-[#E5A952]'
                  : 'text-[#88909E] border-transparent hover:text-[#D6DAE2]'
              }`}
            >
              Native Architecture
            </button>
          </nav>

          {/* Zone 3: Primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => {
                setActiveTab('stage');
                handleNextTrack();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ECEEF2] hover:bg-white text-[#111318] text-xs font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A952]"
            >
              <Disc3 className="w-3.5 h-3.5" />
              <span>Simulate Track Change</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Container */}
      <main className="flex-1 w-full max-w-[1240px] mx-auto px-6 py-8">
        {activeTab === 'stage' ? (
          <div className="space-y-6">
            {/* Concise Prototype Intro */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight text-[#F3F4F6] text-balance">
                  Windows 11 Desktop Widget Prototype
                </h1>
                <p className="text-sm text-[#88909E] max-w-2xl">
                  Interactive preview of the layered album sleeve and spinning vinyl widget using simulated playback data.
                </p>
              </div>
              <div className="text-xs text-[#7C8391] whitespace-nowrap shrink-0">
                Mock Playback · Local Settings Persistence
              </div>
            </div>

            {/* 2-Column Workspace: Preview Stage + Live Settings */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8">
                <DesktopStage
                  tracks={tracks}
                  currentTrack={currentTrack}
                  settings={settings}
                  isWidgetVisible={isWidgetVisible}
                  notificationSecondsLeft={notificationSecondsLeft}
                  onSelectTrack={handleSelectTrack}
                  onTogglePlayPause={handleTogglePlayPause}
                  onNextTrack={handleNextTrack}
                  onPrevTrack={handlePrevTrack}
                  onSeek={handleSeek}
                  onTriggerNotification={() => triggerNotification()}
                />
              </div>

              <div className="lg:col-span-4">
                <SettingsPanel
                  settings={settings}
                  onUpdateSettings={updateSettings}
                  onResetSettings={resetSettings}
                />
              </div>
            </div>
          </div>
        ) : (
          <ArchitectureView />
        )}
      </main>
    </div>
  );
}
