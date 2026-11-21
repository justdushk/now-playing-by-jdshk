import { RotateCcw } from 'lucide-react';
import {
  VINYL_COLOR_OPTIONS,
  type VinylColorPresetId,
  type VinylPosition,
  type WidgetDisplayMode,
  type WidgetSettings,
  type WidgetSizePreset,
} from '../../types/music';

interface SettingsPanelProps {
  settings: WidgetSettings;
  onUpdateSettings: (patch: Partial<WidgetSettings>) => void;
  onResetSettings: () => void;
}

const SPEED_PRESETS = [
  { label: 'Slow', value: 0.5 },
  { label: '33⅓ RPM', value: 1.0 },
  { label: '45 RPM', value: 1.35 },
  { label: 'Fast', value: 1.9 },
];

export function SettingsPanel({
  settings,
  onUpdateSettings,
  onResetSettings,
}: SettingsPanelProps) {
  return (
    <aside
      aria-label="Widget customization settings"
      className="rounded-2xl border border-white/[0.08] bg-[#13151B] p-6 space-y-6"
    >
      <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] pb-4">
        <div>
          <h2 className="text-base font-semibold text-[#F3F4F6]">
            Widget Settings
          </h2>
          <p className="text-xs text-[#88909E] mt-1">
            Preferences save locally in your browser.
          </p>
        </div>

        <button
          type="button"
          onClick={onResetSettings}
          title="Reset all widget settings to defaults"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#9CA3B0] hover:text-white hover:bg-white/[0.06] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A952]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Application Mode */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[#D6DAE2]">Display Mode</span>
          <span className="text-[11px] text-[#7C8391]">
            {settings.mode === 'persistent' ? 'Always visible' : 'Auto-dismiss'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#0B0C10] border border-white/[0.06]">
          {(['persistent', 'notification'] as WidgetDisplayMode[]).map((modeOption) => {
            const active = settings.mode === modeOption;
            return (
              <button
                key={modeOption}
                type="button"
                onClick={() => onUpdateSettings({ mode: modeOption })}
                className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A952] ${
                  active
                    ? 'bg-[#222631] text-white shadow-sm'
                    : 'text-[#88909E] hover:text-[#D6DAE2]'
                }`}
              >
                {modeOption === 'persistent' ? 'Persistent' : 'Notification'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notification Duration */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="notification-duration-slider"
            className="text-xs font-medium text-[#D6DAE2]"
          >
            Notification Duration
          </label>
          <span className="text-xs font-mono tabular-nums text-[#E5A952]">
            {settings.notificationDurationSeconds}s
          </span>
        </div>
        <input
          id="notification-duration-slider"
          type="range"
          min={2}
          max={15}
          step={1}
          value={settings.notificationDurationSeconds}
          onChange={(e) =>
            onUpdateSettings({ notificationDurationSeconds: Number(e.target.value) })
          }
          className="w-full np-slider"
        />
        <div className="flex justify-between text-[11px] font-mono tabular-nums text-[#666D7A]">
          <span>2s</span>
          <span>8s</span>
          <span>15s</span>
        </div>
      </div>

      {/* Vinyl Position */}
      <div className="space-y-2.5 pt-2 border-t border-white/[0.06]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[#D6DAE2]">Vinyl Position</span>
          <span className="text-[11px] text-[#7C8391]">Behind cover</span>
        </div>

        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#0B0C10] border border-white/[0.06]">
          {(['left', 'right'] as VinylPosition[]).map((pos) => {
            const active = settings.vinylPosition === pos;
            return (
              <button
                key={pos}
                type="button"
                onClick={() => onUpdateSettings({ vinylPosition: pos })}
                className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A952] ${
                  active
                    ? 'bg-[#222631] text-white shadow-sm'
                    : 'text-[#88909E] hover:text-[#D6DAE2]'
                }`}
              >
                {pos === 'left' ? 'Left of Cover' : 'Right of Cover'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Vinyl Color Swatches */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[#D6DAE2]">Vinyl Color</span>
          <span className="text-[11px] text-[#88909E]">
            {VINYL_COLOR_OPTIONS.find((c) => c.id === settings.vinylColor)?.label}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {VINYL_COLOR_OPTIONS.map((option) => {
            const active = settings.vinylColor === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() =>
                  onUpdateSettings({ vinylColor: option.id as VinylColorPresetId })
                }
                className={`flex items-center gap-2 px-2.5 py-2 rounded-lg border text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A952] ${
                  active
                    ? 'border-[#E5A952]/70 bg-white/[0.06] text-white'
                    : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] text-[#9CA3B0]'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0 ring-1 ring-white/20"
                  style={{ backgroundColor: option.baseHex }}
                  aria-hidden="true"
                />
                <span className="text-[11px] font-medium truncate">
                  {option.label.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Rotation Speed */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="rotation-speed-slider"
            className="text-xs font-medium text-[#D6DAE2]"
          >
            Rotation Speed
          </label>
          <span className="text-xs font-mono tabular-nums text-[#E5A952]">
            {settings.rotationSpeed.toFixed(2)}x
          </span>
        </div>
        <input
          id="rotation-speed-slider"
          type="range"
          min={0.3}
          max={2.4}
          step={0.05}
          value={settings.rotationSpeed}
          onChange={(e) =>
            onUpdateSettings({ rotationSpeed: Number(e.target.value) })
          }
          className="w-full np-slider"
        />
        <div className="grid grid-cols-4 gap-1.5 pt-0.5">
          {SPEED_PRESETS.map((preset) => {
            const isClose = Math.abs(settings.rotationSpeed - preset.value) < 0.06;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => onUpdateSettings({ rotationSpeed: preset.value })}
                className={`py-1.5 px-2 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A952] ${
                  isClose
                    ? 'bg-[#222631] text-white'
                    : 'bg-white/[0.03] text-[#88909E] hover:text-[#D6DAE2]'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Widget Scale & Inline Controls */}
      <div className="space-y-4 pt-2 border-t border-white/[0.06]">
        <div className="space-y-2">
          <span className="text-xs font-medium text-[#D6DAE2]">Widget Size</span>
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#0B0C10] border border-white/[0.06]">
            {(['compact', 'standard', 'large'] as WidgetSizePreset[]).map((size) => {
              const active = settings.widgetSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => onUpdateSettings({ widgetSize: size })}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium capitalize transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A952] ${
                    active
                      ? 'bg-[#222631] text-white shadow-sm'
                      : 'text-[#88909E] hover:text-[#D6DAE2]'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        <label className="flex items-center justify-between gap-3 cursor-pointer py-1">
          <div>
            <span className="block text-xs font-medium text-[#D6DAE2]">
              Inline Transport Controls
            </span>
            <span className="block text-[11px] text-[#7C8391]">
              Show play, pause, and skip inside the widget
            </span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.showInlineControls}
            onClick={() =>
              onUpdateSettings({ showInlineControls: !settings.showInlineControls })
            }
            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A952] ${
              settings.showInlineControls ? 'bg-[#E5A952]' : 'bg-white/[0.14]'
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 rounded-full bg-[#111318] transition-transform ${
                settings.showInlineControls ? 'translate-x-4.5' : 'translate-x-1'
              }`}
            />
          </button>
        </label>
      </div>
    </aside>
  );
}
