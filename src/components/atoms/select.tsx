"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  id?: string;
  value: string;
  options: SelectOption[] | string[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  /** Compact trigger for hero / dense layouts */
  size?: "sm" | "md";
  disabled?: boolean;
  "aria-label"?: string;
}

interface MenuPos {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
  openUp: boolean;
}

function normalizeOptions(options: SelectOption[] | string[]): SelectOption[] {
  return options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );
}

export function Select({
  id,
  value,
  options,
  onChange,
  placeholder = "Select…",
  className,
  size = "md",
  disabled = false,
  "aria-label": ariaLabel,
}: SelectProps) {
  const list = normalizeOptions(options);
  const autoId = useId();
  const triggerId = id ?? autoId;
  const listboxId = `${triggerId}-listbox`;
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const [pos, setPos] = useState<MenuPos | null>(null);
  const [mounted, setMounted] = useState(false);

  const selected = list.find((o) => o.value === value);
  const display = selected?.label ?? placeholder;

  useEffect(() => {
    setMounted(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setHighlight(-1);
    setPos(null);
  }, []);

  const measure = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const gap = 6;
    const spaceBelow = window.innerHeight - rect.bottom - gap - 12;
    const spaceAbove = rect.top - gap - 12;
    const openUp = spaceBelow < 200 && spaceAbove > spaceBelow;
    const maxHeight = Math.min(240, openUp ? spaceAbove : spaceBelow);

    setPos({
      top: openUp ? rect.top - gap : rect.bottom + gap,
      left: rect.left,
      width: rect.width,
      maxHeight: Math.max(120, maxHeight),
      openUp,
    });
  }, []);

  const openMenu = useCallback(() => {
    if (disabled) return;
    const idx = list.findIndex((o) => o.value === value);
    setHighlight(idx >= 0 ? idx : 0);
    measure();
    setOpen(true);
  }, [disabled, list, measure, value]);

  const selectValue = useCallback(
    (next: string) => {
      onChange(next);
      close();
    },
    [close, onChange]
  );

  useLayoutEffect(() => {
    if (!open) return;
    measure();
    const onReposition = () => measure();
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);
    return () => {
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
    };
  }, [measure, open]);

  useEffect(() => {
    if (!open) return;

    const onPointer = (e: MouseEvent) => {
      const target = e.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (listRef.current?.contains(target)) return;
      close();
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [close, open]);

  useEffect(() => {
    if (!open || highlight < 0) return;
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${highlight}"]`
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [highlight, open]);

  const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!open) openMenu();
      else if (e.key === "Enter" || e.key === " ") {
        const opt = list[highlight];
        if (opt) selectValue(opt.value);
      } else {
        setHighlight((h) => Math.min(list.length - 1, (h < 0 ? 0 : h) + 1));
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) openMenu();
      else setHighlight((h) => Math.max(0, (h < 0 ? 0 : h) - 1));
    } else if (e.key === "Home" && open) {
      e.preventDefault();
      setHighlight(0);
    } else if (e.key === "End" && open) {
      e.preventDefault();
      setHighlight(list.length - 1);
    }
  };

  const menu =
    mounted &&
    open &&
    pos &&
    createPortal(
      <ul
        ref={listRef}
        id={listboxId}
        role="listbox"
        aria-labelledby={triggerId}
        style={{
          position: "fixed",
          left: pos.left,
          width: pos.width,
          maxHeight: pos.maxHeight,
          ...(pos.openUp
            ? { bottom: window.innerHeight - pos.top, top: "auto" }
            : { top: pos.top }),
        }}
        className={cn(
          "z-[200] overflow-auto border border-border bg-background py-1 shadow-[0_16px_48px_rgba(0,0,0,0.18)]",
          "rounded-sm [scrollbar-width:thin]"
        )}
      >
        {list.map((opt, index) => {
          const isSelected = opt.value === value;
          const isHighlighted = index === highlight;
          return (
            <li
              key={opt.value || `opt-${index}`}
              role="option"
              aria-selected={isSelected}
              data-index={index}
              onMouseEnter={() => setHighlight(index)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => selectValue(opt.value)}
              className={cn(
                "relative cursor-pointer px-3.5 py-2.5 font-sans text-sm transition-colors",
                "before:absolute before:top-0 before:left-0 before:h-full before:w-[3px] before:bg-kyra-red before:opacity-0 before:transition-opacity",
                isHighlighted && "bg-muted before:opacity-100",
                isSelected && "font-medium text-kyra-red",
                !isSelected && "text-foreground"
              )}
            >
              {opt.label}
            </li>
          );
        })}
      </ul>,
      document.body
    );

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        id={triggerId}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-label={ariaLabel}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          "group flex w-full items-center justify-between gap-2 rounded-sm border bg-muted text-left font-sans text-foreground outline-none transition-all duration-200",
          "border-border hover:border-kyra-red/40",
          "focus-visible:border-kyra-red focus-visible:ring-2 focus-visible:ring-kyra-red/20",
          open && "border-kyra-red ring-2 ring-kyra-red/20",
          disabled && "cursor-not-allowed opacity-50",
          size === "sm" && "min-h-[42px] px-2.5 py-[10px] text-[13px]",
          size === "md" && "min-h-[44px] px-3.5 py-3 text-base sm:text-sm"
        )}
      >
        <span className={cn("min-w-0 truncate", !selected && "text-kyra-steel")}>
          {display}
        </span>
        <ChevronDown
          size={16}
          strokeWidth={2.25}
          aria-hidden
          className={cn(
            "shrink-0 text-kyra-steel transition-transform duration-200 group-hover:text-foreground",
            open && "rotate-180 text-kyra-red"
          )}
        />
      </button>
      {menu}
    </div>
  );
}
