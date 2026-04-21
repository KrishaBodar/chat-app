import { useState } from "react";
import { AuthForm } from "@/components/AuthForm";
import { MessageCircle, Sparkles, Lock, Zap } from "lucide-react";

interface AuthPageProps {
  onSuccess: (token: string, user: any) => void;
}

/**
 * AuthPage — split-screen layout with branding left, form right.
 * Glassmorphism card on gradient background.
 */
export default function AuthPage({ onSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  return (
    <div className="min-h-screen flex">
      {/* Left — Branding panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-bg relative overflow-hidden flex-col justify-between p-12">
        {/* Decorative circles */}
        <div className="absolute top-20 -left-20 w-72 h-72 rounded-full bg-primary-foreground/10 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center backdrop-blur-sm">
              <MessageCircle className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-primary-foreground">Pulse</span>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <h2 className="text-4xl font-bold text-primary-foreground leading-tight">
            Connect instantly,
            <br />
            communicate
            <br />
            beautifully.
          </h2>
          <div className="space-y-4">
            {[
              { icon: Zap, text: "Real-time messaging" },
              { icon: Lock, text: "End-to-end secure" },
              { icon: Sparkles, text: "Modern experience" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-primary-foreground/80 font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-primary-foreground/50 text-sm">
          © 2026 Pulse. All rights reserved.
        </p>
      </div>

      {/* Right — Auth form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background relative">
        {/* Subtle gradient overlay for mobile */}
        <div className="absolute inset-0 lg:hidden gradient-bg opacity-5" />

        <div className="relative z-10 w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-10 justify-center">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">Pulse</span>
          </div>

          {/* Glass card */}
          <div className="glass rounded-2xl p-8 shadow-xl">
            <AuthForm
              mode={mode}
              onSuccess={onSuccess}
              onToggleMode={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
