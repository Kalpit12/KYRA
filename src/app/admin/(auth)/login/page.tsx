import { Suspense } from "react";
import type { Metadata } from "next";
import AdminLoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Login into Admin",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <p className="text-center font-mono text-xs tracking-[0.12em] text-kyra-steel uppercase">
          Loading…
        </p>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
