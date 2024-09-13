import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <div className={cn("flex h-full flex-col p-6", className)}>{children}</div>
  );
}

export function PageHeader({ children, className }: PageLayoutProps) {
  return <header className={cn("mb-4", className)}>{children}</header>;
}

export function PageContent({ children, className }: PageLayoutProps) {
  return (
    <div className={cn("flex-1 overflow-hidden", className)}>{children}</div>
  );
}
