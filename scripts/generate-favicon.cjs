const sharp = require("sharp");
const fs = require("fs");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#121214"/>
  <path fill="#E2131F" d="M16 5.2 27.6 26.6h-5.5L16 13.9 9.9 26.6H4.4L16 5.2Z"/>
</svg>`;

function pngToIco(pngBuffers) {
  const count = pngBuffers.length;
  const headerSize = 6 + count * 16;
  const dir = Buffer.alloc(headerSize);
  dir.writeUInt16LE(0, 0);
  dir.writeUInt16LE(1, 2);
  dir.writeUInt16LE(count, 4);

  let o = 6;
  let dataOffset = headerSize;
  const chunks = [dir];

  for (const buf of pngBuffers) {
    const w = buf.readUInt32BE(16);
    const h = buf.readUInt32BE(20);
    dir.writeUInt8(w >= 256 ? 0 : w, o);
    dir.writeUInt8(h >= 256 ? 0 : h, o + 1);
    dir.writeUInt8(0, o + 2);
    dir.writeUInt8(0, o + 3);
    dir.writeUInt16LE(1, o + 4);
    dir.writeUInt16LE(32, o + 6);
    dir.writeUInt32LE(buf.length, o + 8);
    dir.writeUInt32LE(dataOffset, o + 12);
    o += 16;
    dataOffset += buf.length;
    chunks.push(buf);
  }

  return Buffer.concat(chunks);
}

(async () => {
  const sizes = [16, 32, 48];
  const pngs = [];
  for (const s of sizes) {
    pngs.push(await sharp(Buffer.from(svg)).resize(s, s).png().toBuffer());
  }

  const ico = pngToIco(pngs);
  fs.writeFileSync("src/app/favicon.ico", ico);
  await sharp(Buffer.from(svg)).resize(32, 32).png().toFile("src/app/icon.png");
  await sharp(Buffer.from(svg))
    .resize(180, 180)
    .png()
    .toFile("src/app/apple-icon.png");

  console.log("OK favicon.ico", ico.length, "bytes");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
