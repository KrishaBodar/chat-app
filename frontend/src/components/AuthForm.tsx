import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sendOtp, verifyOtp } from "@/services/api";
import { toast } from "sonner";
import { Loader2, ArrowRight, Mail, Shield } from "lucide-react";

interface AuthFormProps {
  mode: "signin" | "signup";
  onSuccess: (token: string, user: any) => void;
  onToggleMode: () => void;
}

/**
 * AuthForm — handles email input → OTP verification flow.
 * Both sign-in and sign-up use the same OTP-based flow.
 */
export function AuthForm({ mode, onSuccess, onToggleMode }: AuthFormProps) {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  // Start countdown timer for OTP resend
  const startTimer = () => {
    setTimer(30);
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  // Step 1: Send OTP to email
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await sendOtp(email);
      setStep("otp");
      startTimer();
      toast.success("OTP sent to your email!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length !== 6) return;
    setLoading(true);
    try {
      const { data } = await verifyOtp(email, code);
      // Store token and user data from response
      onSuccess(data.token, data.user || { id: data.userId, email });
      toast.success("Welcome!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP digit input with auto-focus
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }

    // Auto-submit when all digits filled
    if (newOtp.every((d) => d) && newOtp.join("").length === 6) {
      setTimeout(() => handleVerifyOtp(), 100);
    }
  };

  // Handle backspace in OTP fields
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setLoading(true);
    try {
      await sendOtp(email);
      startTimer();
      setOtp(["", "", "", "", "", ""]);
      toast.success("OTP resent!");
    } catch {
      toast.error("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {step === "email" ? (
          <motion.div
            key="email"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            {/* Heading */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary-foreground" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">
                  {mode === "signin" ? "Welcome back" : "Create account"}
                </h1>
              </div>
              <p className="text-muted-foreground">
                {mode === "signin"
                  ? "Sign in with your email to continue"
                  : "Enter your email to get started"}
              </p>
            </div>

            {/* Email form */}
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full h-12 px-4 rounded-lg bg-secondary text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  required
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full h-12 rounded-lg gradient-bg text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Toggle mode */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={onToggleMode}
                className="text-primary font-medium hover:underline"
              >
                {mode === "signin" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="otp"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            {/* OTP heading */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary-foreground" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">Verify email</h1>
              </div>
              <p className="text-muted-foreground">
                We sent a 6-digit code to{" "}
                <span className="text-foreground font-medium">{email}</span>
              </p>
            </div>

            {/* OTP inputs */}
            <div className="flex gap-3 mb-6 justify-center">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className="w-12 h-14 text-center text-xl font-bold rounded-lg bg-secondary text-foreground border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  autoFocus={i === 0}
                />
              ))}
            </div>

            {/* Verify button */}
            <button
              onClick={handleVerifyOtp}
              disabled={loading || otp.join("").length !== 6}
              className="w-full h-12 rounded-lg gradient-bg text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 mb-4"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Verify & Continue"
              )}
            </button>

            {/* Resend & back */}
            <div className="flex items-center justify-between text-sm">
              <button
                onClick={() => {
                  setStep("email");
                  setOtp(["", "", "", "", "", ""]);
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Change email
              </button>
              <button
                onClick={handleResend}
                disabled={timer > 0}
                className="text-primary font-medium disabled:text-muted-foreground transition-colors"
              >
                {timer > 0 ? `Resend in ${timer}s` : "Resend code"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
