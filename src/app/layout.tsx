import Metrics from "@/app/metrics";
import Footer from "@/components/Footer";
import LayoutWrapper from "@/components/LayoutWrapper";
import ThemeProvider from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import zhCNlocales from "@/locales/zh.json";
import "@/styles/globals.css";
import { zhCN } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import merge from "lodash.merge";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "MindGenius AI",
  description: "AI-Powered Mind Mapping",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const localization = merge(zhCN, zhCNlocales);
  const clerkAppearance = {
    baseTheme: [dark],
  };

  return (
    <ClerkProvider localization={localization} appearance={clerkAppearance}>
      <html lang="zh-CN" suppressHydrationWarning className="h-full">
        <body className="bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-gray-800">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col min-h-screen">
              <LayoutWrapper className="flex-grow">{children}</LayoutWrapper>
              <Footer />
            </div>
            <Toaster />
          </ThemeProvider>
          <Metrics />
        </body>
      </html>
    </ClerkProvider>
  );
}
