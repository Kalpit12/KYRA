"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface WorkshopErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface WorkshopErrorBoundaryState {
  failed: boolean;
}

export function WorkshopModelFallback({ message }: { message?: string }) {
  return (
    <div className="flex h-full min-h-[240px] w-full flex-col items-center justify-center gap-3 bg-[#ececee] px-6 text-center">
      <p className="font-mono text-[10px] tracking-[0.16em] text-kyra-red uppercase">
        Studio preview
      </p>
      <p className="font-display text-xl italic uppercase text-foreground">
        3D model unavailable
      </p>
      <p className="max-w-sm text-sm text-foreground/70">
        {message ??
          "The wrap simulator could not load this vehicle. Please retry or contact KYRA Customs."}
      </p>
    </div>
  );
}

export class WorkshopErrorBoundary extends Component<
  WorkshopErrorBoundaryProps,
  WorkshopErrorBoundaryState
> {
  state: WorkshopErrorBoundaryState = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Workshop 3D preview failed", error, info.componentStack);
  }

  render() {
    if (this.state.failed) {
      return this.props.fallback ?? <WorkshopModelFallback />;
    }
    return this.props.children;
  }
}
