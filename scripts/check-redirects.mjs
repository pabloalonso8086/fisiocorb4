/**
 * Comprovació de SEO després de cada build:
 *  1. Cada adreça de la web antiga (scripts/urls-web-antiga.txt) ha de ser
 *     una pàgina del web nou o una redirecció 301 cap a una pàgina que existeixi.
 *  2. Cap redirecció pot apuntar a una pàgina inexistent.
 *  3. Cap redirecció pot amagar una pàgina que sí existeix.
 *  4. Cloudflare admet com a màxim 2000 regles estàtiques i 100 dinàmiques.
 * Si alguna cosa falla, el build s'atura.
 */
import { readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist";
const errors = [];
const exists = (url) => {
  const path = url.split("#")[0].split("?")[0];
  if (/^https?:/.test(path)) return true;
  const clean = decodeURIComponent(path).replace(/^\//, "");
  const file = join(DIST, clean);
  return existsSync(join(file, "index.html")) || (!!clean && existsSync(file) && statSync(file).isFile());
};

const rules = readFileSync(join(DIST, "_redirects"), "utf8")
  .split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#"))
  .map((l) => { const [from, to, code = "302"] = l.split(/\s+/); return { from, to, code }; });

const dynamic = rules.filter((r) => r.from.includes("*") || r.from.includes(":"));
const statics = rules.length - dynamic.length;
if (statics > 2000) errors.push(`Massa regles estàtiques (${statics} > 2000)`);
if (dynamic.length > 100) errors.push(`Massa regles dinàmiques (${dynamic.length} > 100)`);

const seen = new Set();
for (const r of rules) {
  if (r.code !== "301") errors.push(`Regla sense 301: ${r.from}`);
  if (seen.has(r.from)) errors.push(`Regla duplicada: ${r.from}`);
  seen.add(r.from);
  if (!exists(r.to)) errors.push(`Destí inexistent: ${r.from} → ${r.to}`);
  if (!r.from.includes("*") && r.from.endsWith("/") && exists(r.from)) errors.push(`La redirecció amaga una pàgina que existeix: ${r.from}`);
}

const match = (url) => rules.find((r) =>
  r.from.endsWith("*") ? url.startsWith(r.from.slice(0, -1)) : r.from === url);

const old = readFileSync("scripts/urls-web-antiga.txt", "utf8").split("\n").map((l) => l.trim()).filter(Boolean);
let pages = 0, redirected = 0;
for (const url of old) {
  for (const variant of url === "/" ? [url] : [url, url.replace(/\/$/, "")]) {
    if (exists(variant) && variant.endsWith("/")) { pages++; continue; }
    if (!variant.endsWith("/") && exists(variant + "/")) { const r = match(variant); if (r) redirected++; continue; } // Cloudflare afegeix la barra sol
    const r = match(variant);
    if (!r) errors.push(`Adreça antiga sense pàgina ni redirecció: ${variant}`);
    else redirected++;
  }
}

if (errors.length) {
  console.error(`\n✗ Comprovació de redireccions: ${errors.length} error(s)\n  - ` + errors.join("\n  - "));
  process.exit(1);
}
console.log(`✓ Redireccions correctes: ${old.length} adreces antigues → ${pages} pàgines que es mantenen, ${redirected} redireccions 301. Regles: ${statics} estàtiques, ${dynamic.length} dinàmiques.`);
