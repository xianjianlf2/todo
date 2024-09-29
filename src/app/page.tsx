"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

import { motion, useScroll, useTransform } from "framer-motion";
import { Check, Moon, Rocket, Sparkles, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function LandingPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { isSignedIn } = useUser();

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const featuresRef = useRef<HTMLDivElement>(null);

  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement>,
    index: number,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
    setHoveredCard(index);
  };

  const handleMouseLeave = () => {
    setHoveredCard(null);
  };

  const handleMouseEnter = (index: number) => {
    setHoveredCard(index);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (featuresRef.current) {
        const rect = featuresRef.current.getBoundingClientRect();
        setMousePosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto p-4">
        <motion.header
          className="sticky top-0 z-50 flex items-center justify-between bg-background/50 py-6 backdrop-blur-md"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
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
        </motion.header>

        <main className="mt-16 pb-16">
          <motion.section
            className="py-16 text-center"
            style={{ opacity, scale }}
          >
            <motion.h2
              className="mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-6xl font-extrabold text-transparent"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              AI-Powered Mind Mapping
            </motion.h2>
            <motion.p
              className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Create beautiful mind maps through natural conversations with AI.
              Organize your ideas and boost productivity effortlessly.
            </motion.p>
            <motion.div
              className="mb-12 flex justify-center space-x-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground shadow-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-xl"
              >
                <Link href="/mindmap/new" scroll={false}>
                  Get Started
                  <span className="ml-2 inline-block rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
                    Free Trial
                  </span>
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary text-primary shadow-lg transition-all duration-300 hover:bg-primary/10 hover:shadow-xl"
              >
                <Link href="/demo" scroll={false}>Watch Demo</Link>
              </Button>
            </motion.div>
            <motion.div
              className="relative mx-auto aspect-video w-full max-w-4xl overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 p-2 shadow-2xl dark:from-primary/5 dark:to-secondary/5"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="relative h-full w-full overflow-hidden rounded-xl bg-background/50 dark:bg-background/20">
                <Image
                  src="/snapshot.gif"
                  alt="AI-Generated Mind Map Example"
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                  className="rounded-xl"
                />
              </div>
            </motion.div>
          </motion.section>

          <section className="mt-32">
            <motion.h3
              className="mb-12 bg-gradient-to-r from-primary to-secondary bg-clip-text text-center text-4xl font-bold text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Choose Your Plan
            </motion.h3>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Card
                    className={`flex flex-col overflow-hidden border-2 border-transparent bg-gradient-to-br from-background to-secondary/10 shadow-lg transition-all duration-300 ${
                      hoveredCard === index
                        ? "scale-105 border-primary/50 bg-gradient-to-br from-primary/5 to-secondary/20 shadow-2xl"
                        : "hover:border-primary/30 hover:shadow-xl"
                    }`}
                  >
                    <CardHeader className="relative">
                      <CardTitle className="text-2xl font-bold">
                        {plan.name}
                      </CardTitle>
                      {plan.name === "Pro" && (
                        <Sparkles className="absolute right-4 top-4 h-6 w-6 text-yellow-400" />
                      )}
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-4xl font-extrabold text-transparent">
                        {plan.price}
                      </p>
                      <ul className="space-y-3">
                        {plan.features.map((feature, idx) => (
                          <motion.li
                            key={idx}
                            className="flex items-center"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.1 }}
                          >
                            <Check className="mr-2 h-5 w-5 text-green-500" />
                            <span className="text-sm">{feature}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </CardContent>
                    <div className="p-6 pt-0">
                      <Button
                        className={`w-full font-semibold transition-all duration-300 ${
                          hoveredCard === index
                            ? "bg-gradient-to-r from-primary to-secondary text-white"
                            : ""
                        }`}
                        variant={plan.buttonVariant}
                        size="lg"
                      >
                        {plan.buttonText}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          <motion.section
            className="mt-32 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-4xl font-bold text-transparent">
              Ready to Revolutionize Your Thinking?
            </h3>
            <p className="mb-8 text-xl text-muted-foreground">
              Start creating AI-powered mind maps today and unlock your full
              potential.
            </p>
            <Button
              asChild
              size="lg"
              className="cursor-pointer bg-gradient-to-r from-primary to-secondary text-white transition-all hover:scale-105 hover:opacity-90"
            >
              <Link href="/mindmap/new" scroll={false}>Create Your First Mind Map</Link>
            </Button>
            <p className="mt-6 text-sm text-muted-foreground">
              No credit card required. Free trial available.
            </p>
          </motion.section>
        </main>
      </div>
    </div>
  );
}

const pricingPlans = [
  {
    name: "Free",
    price: "$0/month",
    features: [
      "AI-Powered Mind Mapping",
      "Drag-and-Drop Interface",
      "Local Storage",
      "Limited AI requests (100/month)",
    ],
    buttonText: "Get Started",
    buttonVariant: "outline" as const,
  },
  {
    name: "Pro",
    price: "$7.9/month",
    features: [
      "All Free features",
      "Cloud Backup & Sync",
      "Real-time Collaboration",
      "Unlimited AI requests",
      "Priority Support",
      "Advanced Analytics",
    ],
    buttonText: "Upgrade to Pro",
    buttonVariant: "default" as const,
  },
];
