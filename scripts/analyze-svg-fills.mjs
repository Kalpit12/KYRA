import fs from "fs";

function luminance(hex) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function analyze(file, options) {
  const text = fs.readFileSync(file, "utf8");
  const fills = [...text.matchAll(/fill="(#[0-9A-Fa-f]{6})"/g)].map((m) => m[1]);
  const uniq = [...new Set(fills)];
  const body = uniq.filter((f) => {
    if (options.exclude.includes(f)) return false;
    const l = luminance(f);
    if (options.minL !== undefined && l < options.minL) return false;
    if (options.maxL !== undefined && l > options.maxL) return false;
    if (options.hue === "yellow") {
      const h = f.replace("#", "");
      const r = parseInt(h.slice(0, 2), 16);
      const g = parseInt(h.slice(2, 4), 16);
      const b = parseInt(h.slice(4, 6), 16);
      return r > 150 && g > 120 && b < 120;
    }
    return true;
  });
  console.log(JSON.stringify({ file, count: body.length, fills: body }, null, 2));
}

analyze("c:/Users/PC/Downloads/Gwagon.svg", {
  exclude: ["#F2F2F2"],
  minL: 0.5,
  maxL: 0.92,
});

analyze("c:/Users/PC/Downloads/Bmw M4.svg", {
  exclude: ["#DCDCDC"],
  hue: "yellow",
});
