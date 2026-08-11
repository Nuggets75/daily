// Download unit portrait icons from UnitDB into public/icons/ so the app serves
// them same-origin instead of hotlinking jsDelivr. This removes the CDN entirely
// as a failure point: no per-IP rate limiting (a page loads ~400 icons at once),
// no adblocker/tracking-protection blocks (Firefox/Opera GX block cdn.jsdelivr),
// and no cross-origin tainting of the share canvas (so copying the result works).
//
//   node scripts/fetch-icons.mjs      (or: npm run fetch-icons)
//
// Idempotent: skips icons already present. Re-run after adding new units.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const here = dirname(fileURLToPath(import.meta.url));
const units = JSON.parse(readFileSync(join(here, '..', 'src', 'data', 'units.json'), 'utf8'));
const outDir = join(here, '..', 'public', 'icons');
mkdirSync(outDir, { recursive: true });

const src = (id) => `https://cdn.jsdelivr.net/gh/FAForever/UnitDB@master/www/res/img/preview/${id}.png`;

let ok = 0;
let skip = 0;
const failed = [];
for (const u of units) {
  const dest = join(outDir, `${u.id}.png`);
  if (existsSync(dest)) {
    skip++;
    continue;
  }
  try {
    const res = await fetch(src(u.id));
    if (!res.ok) {
      failed.push(u.id);
      continue;
    }
    writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
    ok++;
  } catch {
    failed.push(u.id);
  }
}
console.log(`icons: downloaded ${ok}, already had ${skip}, missing ${failed.length}`);
if (failed.length) console.log('no icon (will use the faction fallback):', failed.join(', '));
