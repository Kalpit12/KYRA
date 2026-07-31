import { Suspense } from "react";
import type { Metadata } from "next";
import ResetPasswordForm from "./reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <p className="text-center font-mono text-xs tracking-[0.12em] text-kyra-steel uppercase">
          Loading…
        </p>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
