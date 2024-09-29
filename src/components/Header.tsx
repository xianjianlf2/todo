import { Button } from "@/components/ui/button";
import { useSettingsDialog } from "@/hooks/useSettingsDialog";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { Settings } from "lucide-react";
import Link from "next/link";
import { SettingsDialog } from "./SettingsDialog";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const { isSignedIn } = useAuth();
  const { isOpen, openSettings, closeSettings } = useSettingsDialog();

  return (
    <nav className="flex h-[60px] w-full items-center justify-between p-4">
      <Link
        href="/"
        className="text-2xl font-bold transition-opacity hover:opacity-80"
      >
        MindGenius
      </Link>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={openSettings}
        >
          <Settings className="h-5 w-5" />
        </Button>
        <ThemeToggle />
        {isSignedIn ? (
          <UserButton />
        ) : (
          <Button asChild variant="ghost" className="mr-2">
            <SignInButton mode="modal">
              <span>Login</span>
            </SignInButton>
          </Button>
        )}
      </div>

      <SettingsDialog open={isOpen} onOpenChange={closeSettings} />
    </nav>
  );
}
