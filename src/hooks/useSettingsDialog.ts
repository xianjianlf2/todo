import { useSettingsStore } from '../store/settingsStore';

export const useSettingsDialog = () => {
    const {
        settings,
        isSettingsOpen,
        updateSettings,
        resetSettings,
        openSettings,
        closeSettings,
    } = useSettingsStore();

    return {
        isOpen: isSettingsOpen,
        openSettings,
        closeSettings,
        settings,
        updateSettings,
        resetSettings,
    };
};