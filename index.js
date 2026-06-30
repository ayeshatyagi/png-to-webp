#!/usr/bin/env node

import sharp from "sharp";
import { readdir, stat } from "fs/promises";
import { join, dirname, basename, extname } from "path";
import { existsSync } from "fs";

const QUALITY = 80;
const PNG_EXT = /\.png$/i;

async function convertFile(inputPath, outputDir, quality) {
  const name = basename(inputPath, extname(inputPath));
  const outPath = join(outputDir, `${name}.webp`);
  await sharp(inputPath)
    .webp({ quality })
    .toFile(outPath);
  return outPath;
}

async function collectPngs(path) {
  const s = await stat(path);
  if (s.isFile()) {
    return PNG_EXT.test(path) ? [path] : [];
  }
  const entries = await readdir(path, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = join(path, e.name);
    if (e.isDirectory()) {
      files.push(...(await collectPngs(full)));
    } else if (e.isFile() && PNG_EXT.test(e.name)) {
      files.push(full);
    }
  }
  return files;
}

async function main() {
  const args = process.argv.slice(2);
  let quality = QUALITY;
  let inputPaths = [];
  let outputDir = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "-q" || args[i] === "--quality") {
      quality = parseInt(args[++i], 10) || QUALITY;
    } else if (args[i] === "-o" || args[i] === "--output") {
      outputDir = args[++i];
    } else if (!args[i].startsWith("-")) {
      inputPaths.push(args[i]);
    }
  }

  if (inputPaths.length === 0) {
    console.error("Usage: node index.js [options] <file|dir> [file|dir...]");
    console.error("  -q, --quality <1-100>  WebP quality (default: 80)");
    console.error("  -o, --output <dir>      Output directory (default: same as input)");
    process.exit(1);
  }

  const pngs = [];
  for (const p of inputPaths) {
    if (!existsSync(p)) {
      console.error(`Not found: ${p}`);
      continue;
    }
    pngs.push(...(await collectPngs(p)));
  }

  if (pngs.length === 0) {
    console.error("No PNG files found.");
    process.exit(1);
  }

  for (const p of pngs) {
    const outDir = outputDir ?? dirname(p);
    const out = await convertFile(p, outDir, quality);
    console.log(`${p} -> ${out}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
