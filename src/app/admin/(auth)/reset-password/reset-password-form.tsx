"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { KyraLogo } from "@/components/atoms/kyra-logo";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setReady(true);
      }
    });

    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });
      if (updateError) throw updateError;

      setSuccess("Password updated. Redirecting to admin…");
      setTimeout(() => {
        router.push("/admin");
        router.refresh();
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md border border-border bg-background p-6 sm:p-8">
        <div className="flex flex-col items-center text-center">
          <KyraLogo size="md" href={null} removeBackground priority />
          <span className="mt-4 font-hero text-[2.25rem] font-extrabold leading-none tracking-[-0.045em]">
            <span className="text-flow-red">KYRΛ</span>
          </span>
          <small className="mt-2 font-mono text-[9px] tracking-[0.22em] text-kyra-steel uppercase">
            Import · Customize · Maintain
          </small>
        </div>

        <h1 className="mt-8 text-center font-display text-2xl font-semibold italic uppercase text-foreground">
          Set new password
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {ready
            ? "Choose a new password for your admin account."
            : "Open this page from the reset link in your email to continue."}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="form-label !mb-2 inline-flex items-center gap-2" htmlFor="password">
              <Lock size={14} className="text-kyra-red" aria-hidden />
              New password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input pr-11"
                disabled={!ready}
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
          </div>

          <div>
            <label className="form-label !mb-2 inline-flex items-center gap-2" htmlFor="confirm">
              <Lock size={14} className="text-kyra-red" aria-hidden />
              Confirm password
            </label>
            <input
              id="confirm"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="form-input"
              disabled={!ready}
            />
          </div>

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
            disabled={loading || !ready}
          >
            {loading ? "Updating…" : "Update password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
