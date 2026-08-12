import { closeSync, openSync, readdirSync, readSync, statSync } from "fs";
import { join } from "path";

const MODELS_DIR = join(process.cwd(), "public", "models");
const GLB_MAGIC = "glTF";
const MIN_BYTES = 1024;

function readMagic(filePath) {
  const fd = openSync(filePath, "r");
  try {
    const buf = Buffer.alloc(4);
    const bytesRead = readSync(fd, buf, 0, 4, 0);
    return buf.subarray(0, bytesRead).toString("utf8");
  } finally {
    closeSync(fd);
  }
}

const files = readdirSync(MODELS_DIR).filter((name) => name.endsWith(".glb"));

if (files.length === 0) {
  console.error("No .glb files found in public/models");
  process.exit(1);
}

let failed = false;

for (const file of files) {
  const filePath = join(MODELS_DIR, file);
  const size = statSync(filePath).size;
  const magic = readMagic(filePath);

  if (magic.startsWith("vers") || magic === "vers") {
    console.error(
      `[verify-glb] ${file} is a Git LFS pointer, not a binary GLB (${size} bytes).`
    );
    failed = true;
    continue;
  }

  if (magic !== GLB_MAGIC) {
    console.error(
      `[verify-glb] ${file} does not start with glTF magic (got ${JSON.stringify(magic)}, ${size} bytes).`
    );
    failed = true;
    continue;
  }

  if (size < MIN_BYTES) {
    console.error(`[verify-glb] ${file} is suspiciously small (${size} bytes).`);
    failed = true;
    continue;
  }

  console.log(`[verify-glb] ok  ${file}  ${(size / (1024 * 1024)).toFixed(2)} MB`);
}

if (failed) {
  console.error(`
Simulator models must be real .glb binaries.

If these files are tracked with Git LFS, either:
  1. Enable Git LFS in Vercel → Project Settings → Git, then redeploy, or
  2. Stop tracking *.glb with LFS and commit the actual binaries (safe under ~90MB).
`);
  process.exit(1);
}
