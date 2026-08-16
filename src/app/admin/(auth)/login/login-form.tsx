"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { KyraLogo, KyraWordmark } from "@/components/atoms/kyra-logo";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Mode = "login" | "forgot";

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError) throw signInError;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Sign in failed");

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role !== "admin") {
      await supabase.auth.signOut();
      throw new Error("This account does not have admin access.");
    }

    router.push(next);
    router.refresh();
  };

  const handleForgot = async () => {
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/admin/reset-password`;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo }
    );
    if (resetError) throw resetError;
    setSuccess(
      "Password reset link sent. Check your inbox and follow the email to set a new password."
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (mode === "forgot") {
        await handleForgot();
      } else {
        await handleLogin();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md border border-border bg-background p-6 sm:p-8">
        <div className="flex flex-col items-center text-center">
          <KyraLogo size="md" href={null} removeBackground priority />
          <div className="mt-4">
            <KyraWordmark size="md" href={null} showTagline />
          </div>
        </div>

        <h1 className="mt-8 text-center font-display text-2xl font-semibold italic uppercase text-foreground">
          {mode === "forgot" ? "Reset password" : "Login into Admin"}
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {mode === "forgot"
            ? "Enter your admin email and we’ll send a reset link."
            : "Sign in to manage KYRA inventory and inquiries."}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="form-label !mb-2 inline-flex items-center gap-2" htmlFor="email">
              <Mail size={14} className="text-kyra-red" aria-hidden />
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="you@example.com"
            />
          </div>

          {mode === "login" && (
            <div>
              <label
                className="form-label !mb-2 inline-flex items-center gap-2"
                htmlFor="password"
              >
                <Lock size={14} className="text-kyra-red" aria-hidden />
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input pr-11"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-kyra-steel transition-colors hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setMode("forgot");
                    setError(null);
                    setSuccess(null);
                  }}
                  className="font-mono text-[10px] tracking-[0.12em] text-kyra-steel uppercase transition-colors hover:text-kyra-red"
                >
                  Forgot password?
                </button>
              </div>
            </div>
          )}

          {error && (
            <p className="border border-kyra-red/30 bg-kyra-red/5 px-3 py-2 text-sm text-kyra-red">
              {error}
            </p>
          )}

          {success && (
            <p className="border border-border bg-muted px-3 py-2 text-sm text-foreground">
              {success}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading
              ? "Please wait…"
              : mode === "forgot"
                ? "Send reset link"
                : "Sign in"}
          </Button>

          {mode === "forgot" && (
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
                setSuccess(null);
              }}
              className={cn(
                "w-full text-center font-mono text-[10px] tracking-[0.12em] text-kyra-steel uppercase transition-colors hover:text-foreground"
              )}
            >
              Back to login
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
