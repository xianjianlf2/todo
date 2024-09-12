"use client";
import { ThemeProvider as NextThemeProvider } from "next-themes";

export default function ThemeProvider({
  children,
  ...props
}: {
  children: React.ReactNode;
  attribute: "class" | "data-mode";
  defaultTheme: "system" | "light" | "dark";
  enableSystem: boolean;
  disableTransitionOnChange: boolean;
}) {
  return <NextThemeProvider {...props}>{children}</NextThemeProvider>;
}
