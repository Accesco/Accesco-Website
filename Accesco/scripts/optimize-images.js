// One-off batch pass: shrink oversized source images under public/ in place.
// Resizes anything wider than MAX_WIDTH and re-encodes with lossy compression,
// keeping the same filename/extension so no source-code references change.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const MAX_WIDTH = 1920;
const MIN_SIZE_BYTES = 150 * 1024; // skip anything already small
const DRY_RUN = process.argv.includes('--dry');

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

async function processFile(file) {
  const ext = path.extname(file).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) return null;

  const before = fs.statSync(file).size;
  if (before < MIN_SIZE_BYTES) return null;

  // Read into a buffer rather than passing the path to sharp: on Windows,
  // libvips can keep a memory-mapped handle on a path-based source open
  // after toBuffer() resolves, which then blocks overwriting the same file.
  const input = fs.readFileSync(file);
  const meta = await sharp(input, { limitInputPixels: false }).metadata();

  let pipeline = sharp(input, { limitInputPixels: false }).rotate();
  if (meta.width && meta.width > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  let buffer;
  if (ext === '.png') {
    buffer = await pipeline.png({ compressionLevel: 9, quality: 82, palette: true, effort: 8 }).toBuffer();
  } else {
    buffer = await pipeline.jpeg({ quality: 80, mozjpeg: true }).toBuffer();
  }

  const after = buffer.length;
  if (after >= before) return { file, before, after, skipped: true };

  if (!DRY_RUN) {
    await writeWithRetry(file, buffer);
  }
  return { file, before, after, skipped: false };
}

async function writeWithRetry(file, buffer, attempts = 5) {
  for (let i = 0; i < attempts; i++) {
    try {
      fs.writeFileSync(file, buffer);
      return;
    } catch (err) {
      if (i === attempts - 1) throw err;
      await new Promise((r) => setTimeout(r, 200 * (i + 1)));
    }
  }
}

(async () => {
  const files = walk(PUBLIC_DIR);
  let totalBefore = 0;
  let totalAfter = 0;
  let touched = 0;

  for (const file of files) {
    let result;
    try {
      result = await processFile(file);
    } catch (err) {
      console.log(`ERROR: ${path.relative(PUBLIC_DIR, file)}: ${err.message}`);
      continue;
    }
    if (!result) continue;
    if (result.skipped) {
      console.log(`SKIP (no gain): ${path.relative(PUBLIC_DIR, result.file)}`);
      continue;
    }
    touched++;
    totalBefore += result.before;
    totalAfter += result.after;
    const pct = (100 * (1 - result.after / result.before)).toFixed(0);
    console.log(
      `${DRY_RUN ? '[DRY] ' : ''}${path.relative(PUBLIC_DIR, result.file)}: ` +
      `${(result.before / 1024 / 1024).toFixed(2)}MB -> ${(result.after / 1024 / 1024).toFixed(2)}MB (-${pct}%)`
    );
  }

  console.log('\n--- Summary ---');
  console.log(`Files touched: ${touched}`);
  console.log(`Total before: ${(totalBefore / 1024 / 1024).toFixed(1)}MB`);
  console.log(`Total after:  ${(totalAfter / 1024 / 1024).toFixed(1)}MB`);
  console.log(`Saved: ${((totalBefore - totalAfter) / 1024 / 1024).toFixed(1)}MB`);
  if (DRY_RUN) console.log('(dry run — no files were modified)');
})();
