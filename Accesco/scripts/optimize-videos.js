// One-off batch pass: re-encode oversized videos under public/ in place with ffmpeg.
// Downscales anything taller/wider than MAX_HEIGHT/MAX_WIDTH, re-encodes H.264 at a
// web-friendly CRF, strips audio from muted background/decorative clips, and keeps
// the same filename/extension so no source-code references change.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const MAX_HEIGHT = 1080;
const MIN_SIZE_BYTES = 300 * 1024; // skip anything already small
const CRF = 28; // higher = smaller/lower quality; 23 default, 28 is a solid web trade-off
const DRY_RUN = process.argv.includes('--dry');
// Muted, looping, decorative/background clips never need an audio track.
const STRIP_AUDIO_HINTS = ['hero', 'background', 'bg', 'reel', 'restaurant', 'loading', 'plane'];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function ffprobe(file) {
  const out = execFileSync('ffprobe', [
    '-v', 'error',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height',
    '-of', 'csv=p=0:s=x',
    file,
  ]).toString().trim();
  const [width, height] = out.split('x').map(Number);
  return { width, height };
}

function shouldStripAudio(file) {
  const lower = file.toLowerCase();
  return STRIP_AUDIO_HINTS.some((hint) => lower.includes(hint));
}

async function processFile(file) {
  const ext = path.extname(file).toLowerCase();
  if (!['.mp4', '.mov', '.webm'].includes(ext)) return null;

  const before = fs.statSync(file).size;
  if (before < MIN_SIZE_BYTES) return null;

  const { width, height } = ffprobe(file);
  if (!width || !height) return { file, before, after: before, skipped: true, reason: 'no dims' };

  const needsScale = height > MAX_HEIGHT;
  const tmpOut = file + '.tmp.mp4';

  const args = ['-y', '-i', file];
  if (needsScale) {
    args.push('-vf', `scale=-2:${MAX_HEIGHT}`);
  }
  args.push('-c:v', 'libx264', '-crf', String(CRF), '-preset', 'slower', '-movflags', '+faststart');
  if (shouldStripAudio(file)) {
    args.push('-an');
  } else {
    args.push('-c:a', 'aac', '-b:a', '96k');
  }
  args.push(tmpOut);

  if (DRY_RUN) {
    return { file, before, after: before, skipped: false, dims: `${width}x${height}`, plannedArgs: args };
  }

  execFileSync('ffmpeg', args, { stdio: 'ignore' });
  const after = fs.statSync(tmpOut).size;

  if (after >= before) {
    fs.unlinkSync(tmpOut);
    return { file, before, after: before, skipped: true, reason: 'no gain' };
  }

  fs.renameSync(tmpOut, file);
  return { file, before, after, skipped: false };
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
      console.log(`SKIP (${result.reason}): ${path.relative(PUBLIC_DIR, result.file)}`);
      continue;
    }
    touched++;
    totalBefore += result.before;
    totalAfter += result.after;
    const pct = (100 * (1 - result.after / result.before)).toFixed(0);
    console.log(
      `${DRY_RUN ? '[DRY] ' : ''}${path.relative(PUBLIC_DIR, result.file)} ${result.dims || ''}: ` +
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
