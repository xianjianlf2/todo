"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

import { Moon, Rocket, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="h-screen overflow-hidden">
      <ScrollArea className="h-full">
        <div className="container mx-auto p-4">
          <header className="flex items-center justify-between py-6">
            <h1 className="text-2xl font-bold">MindGenius AI</h1>
            <nav className="flex items-center">
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Toggle theme"
                  className="mr-2"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
              )}
              {isSignedIn ? (
                <>
                  <Button
                    onClick={() => router.push("/mindmap")}
                    className="mr-2 bg-gradient-to-r from-blue-500 to-purple-600 font-semibold text-white hover:from-blue-600 hover:to-purple-700"
                    size="sm"
                  >
                    <Rocket className="mr-2 h-4 w-4" />
                    Launch App
                  </Button>
                  <UserButton />
                </>
              ) : (
                <>
                  <Button asChild variant="ghost" className="mr-2">
                    <SignInButton mode="modal">
                      <span>Login</span>
                    </SignInButton>
                  </Button>
                  <Button asChild>
                    <SignUpButton mode="modal">
                      <span>Sign Up</span>
                    </SignUpButton>
                  </Button>
                </>
              )}
            </nav>
          </header>

          <main className="mt-16 pb-16">
            <section className="text-center py-16 bg-gradient-to-b from-background to-secondary/20">
              <h2 className="mb-6 text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                AI-Powered Mind Mapping
              </h2>
              <p className="mb-10 text-xl text-muted-foreground max-w-2xl mx-auto">
                Create beautiful mind maps through natural conversations with
                AI. Organize your ideas and boost productivity effortlessly.
              </p>
              <div className="mb-12 flex justify-center space-x-4">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link href="/mindmap/new">Get Started for Free</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link href="/demo">Watch Demo</Link>
                </Button>
              </div>
              <div className="relative aspect-video w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5 p-2">
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-background/50 dark:bg-background/20">
                  <Image
                    src="/snapshot.gif"
                    alt="AI-Generated Mind Map Example"
                    fill
                    style={{ objectFit: "cover" }}
                    priority
                    className="rounded-xl"
                  />
                </div>
              </div>
            </section>

            <section className="mt-16">
              <h3 className="mb-8 text-center text-2xl font-semibold">
                Key Features
              </h3>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {feature.title}
                        {feature.status === "coming_soon" && (
                          <span className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                            Coming Soon
                          </span>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="mt-16 text-center">
              <h3 className="mb-4 text-2xl font-semibold">
                Ready to get started?
              </h3>
              <Button asChild size="lg">
                <SignInButton mode="modal">
                  <span>Create Your First Mind Map</span>
                </SignInButton>
              </Button>
            </section>
          </main>
        </div>
      </ScrollArea>
    </div>
  );
}

const features = [
  {
    title: "AI-Powered Mind Mapping",
    description: "Generate mind maps through natural conversations with AI.",
    status: "available",
  },
  {
    title: "Drag-and-Drop Interface",
    description:
      "Easily create mind maps by dragging and dropping chat messages.",
    status: "available",
  },
  {
    title: "Local Storage",
    description: "Save your mind maps locally for offline access.",
    status: "available",
  },
  {
    title: "Collaboration",
    description: "Share and collaborate on mind maps in real-time.",
    status: "coming_soon",
  },
  {
    title: "Cloud Sync",
    description: "Automatically sync your mind maps across devices.",
    status: "coming_soon",
  },
  {
    title: "Version History",
    description: "Access and restore previous versions of your mind maps.",
    status: "coming_soon",
  },
];
