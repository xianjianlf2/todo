import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <nav className="flex h-[60px] w-full items-center justify-between p-4">
      <Link
        href="/"
        className="text-2xl font-bold transition-opacity hover:opacity-80"
      >
        MindGenius
      </Link>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserButton />
      </div>
    </nav>
  );
}
