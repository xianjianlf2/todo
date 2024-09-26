"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="container mx-auto p-4">
      <header className="flex items-center justify-between py-6">
        <h1 className="text-2xl font-bold">MindGenius AI</h1>
        <nav>
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
        </nav>
      </header>

      <main className="mt-16">
        <section className="text-center">
          <h2 className="mb-4 text-4xl font-bold">AI-Powered Mind Mapping</h2>
          <p className="mb-8 text-xl text-muted-foreground">
            Create beautiful mind maps through natural conversations with AI.
            Organize your ideas and boost productivity effortlessly.
          </p>
          <div className="mb-8 flex justify-center">
            <Button asChild size="lg" className="mr-4">
              <Link href="/mindmap/new">Get Started for Free</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/demo">Watch Demo</Link>
            </Button>
          </div>
          <div className="relative h-[400px] w-full overflow-hidden rounded-lg">
            <Image
              src="/ai-mindmap-example.jpg"
              alt="AI-Generated Mind Map Example"
              layout="fill"
              objectFit="cover"
            />
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
          <h3 className="mb-4 text-2xl font-semibold">Ready to get started?</h3>
          <Button asChild size="lg">
            <Link href="/signup">Create Your First Mind Map</Link>
          </Button>
        </section>
      </main>

      <footer className="mt-16 py-8 text-center text-muted-foreground">
        <p>&copy; 2023 MindMapper. All rights reserved.</p>
      </footer>
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
