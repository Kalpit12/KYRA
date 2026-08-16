import { washTagline } from "@/lib/data/wash";

export function WashHeroTitle() {
  return (
    <h1
      className="font-hero mt-4 max-w-3xl text-[clamp(2rem,6vw,4.5rem)] leading-[0.95]"
      aria-label={`${washTagline.lines.join(" ")} ${washTagline.subtitle}`}
    >
      <span className="block text-foreground">{washTagline.lines[0]}</span>
      <span className="text-flow-silver mt-1 block">{washTagline.lines[1]}</span>
      <span className="mt-1 block text-foreground">{washTagline.lines[2]}</span>
    </h1>
  );
}
