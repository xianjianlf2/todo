import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Settings {
    apiKey: string;
    baseURL: string;
}

export interface SettingsStore {
    settings: Settings;
    isSettingsOpen: boolean;
    updateSettings: (newSettings: Partial<Settings>) => void;
    resetSettings: () => void;
    openSettings: () => void;
    closeSettings: () => void;
}

const DEFAULT_SETTINGS: Settings = {
    apiKey: '',
    baseURL: '',
};

export const useSettingsStore = create<SettingsStore>()(
    persist(
        (set) => ({
            settings: DEFAULT_SETTINGS,
            isSettingsOpen: false,
            updateSettings: (newSettings) =>
                set((state) => ({
                    settings: { ...state.settings, ...newSettings },
                })),
            resetSettings: () => set({ settings: DEFAULT_SETTINGS }),
            openSettings: () => set({ isSettingsOpen: true }),
            closeSettings: () => set({ isSettingsOpen: false }),
        }),
        {
            name: 'mindgenius-settings',
        }
    )
);