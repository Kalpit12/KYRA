import { cn } from "@/lib/utils";

interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
  showChevrons?: boolean;
}

export function Eyebrow({
  children,
  className,
  showChevrons = false,
}: EyebrowProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.22em] text-kyra-red",
        className
      )}
    >
      <span className="inline-block h-0.5 w-[18px] bg-kyra-red" aria-hidden />
      <span>{children}</span>
      {showChevrons && (
        <span className="inline-flex gap-0.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-0 w-0 border-y-[5px] border-y-transparent border-l-[7px] border-l-kyra-red"
            />
          ))}
        </span>
      )}
    </div>
  );
}
