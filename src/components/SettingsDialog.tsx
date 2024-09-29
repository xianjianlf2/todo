import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useSettingsStore } from '@/store/settingsStore';
import React, { useEffect, useState } from 'react';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onOpenChange }) => {
  const { settings, updateSettings, resetSettings } = useSettingsStore();
  const [tempSettings, setTempSettings] = useState(settings);

  useEffect(() => {
    setTempSettings(settings);
  }, [settings]);

  const handleSettingsChange = (key: keyof typeof settings, value: string) => {
    setTempSettings({ ...tempSettings, [key]: value });
  };

  const handleSave = () => {
    updateSettings(tempSettings);
    toast({
        title: 'Settings saved successfully!',
        variant: 'default',
        duration: 2000,
    });
    onOpenChange(false);
  };

  const handleReset = () => {
    resetSettings();
    toast({
        title: 'Settings reset to default!',
        variant: 'default',
        duration: 2000,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="apiKey" className="text-right">
              API Key
            </Label>
            <Input
              id="apiKey"
              value={tempSettings.apiKey}
              onChange={(e) => handleSettingsChange("apiKey", e.target.value)}
              className="col-span-3"
              type="password"
              autoComplete="off"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="baseURL" className="text-right">
              Base URL
            </Label>
            <Input
              id="baseURL"
              value={tempSettings.baseURL}
              onChange={(e) => handleSettingsChange("baseURL", e.target.value)}
              className="col-span-3"
              autoComplete="off"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleReset} variant="outline">Reset</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
