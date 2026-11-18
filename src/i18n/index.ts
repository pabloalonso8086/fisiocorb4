/**
 * Sistema de traduccions.
 *
 * TOTS els textos del web (en català i castellà) són a `textos.json`, a l'arrel
 * del projecte. Aquest fitxer només sap llegir-los; no cal tocar-lo per canviar textos.
 *
 * Format dins del JSON:
 *   - Cada text és un objecte { "ca": "...", "es": "..." }.
 *   - **paraula**          → negreta
 *   - [text](ruta:consulta) → enllaç a una pàgina del web (s'adapta a l'idioma)
 *   - [text](https://...)   → enllaç extern
 *   - Salt de línia (\n)    → salt de línia a la pàgina
 */
import textos from "../../textos.json";

export type Lang = "ca" | "es";
export const LANGS: Lang[] = ["ca", "es"];
export const DEFAULT_LANG: Lang = "ca";

type Leaf = { ca: string; es: string };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Node = any;

const data: Node = textos;

export const isLeaf = (n: Node): n is Leaf =>
  n !== null && typeof n === "object" && !Array.isArray(n) && "ca" in n && "es" in n;

/** Retorna el node del JSON en una ruta del tipus "inici.hero.titol". */
export function node(path: string): Node {
  const out = path.split(".").reduce((acc: Node, k) => (acc == null ? acc : acc[k]), data);
  if (out === undefined) throw new Error(`[textos.json] No existeix la clau «${path}»`);
  return out;
}

/** Escull l'idioma d'un text { ca, es }. Si no és un text traduïble, el retorna tal qual. */
export function pick(n: Node, lang: Lang): string {
  if (isLeaf(n)) return n[lang] ?? n.ca;
  if (typeof n === "string" || typeof n === "number") return String(n);
  throw new Error(`[textos.json] S'esperava un text { ca, es } i s'ha trobat: ${JSON.stringify(n).slice(0, 80)}`);
}

/** URL d'una pàgina en un idioma (les rutes són a textos.json → "rutes"). */
export function route(key: string, lang: Lang): string {
  const r = data.rutes?.[key];
  if (!r) throw new Error(`[textos.json] La ruta «${key}» no existeix a "rutes"`);
  return r[lang];
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Converteix el format senzill del JSON a HTML segur. */
export function format(text: string, lang: Lang): string {
  let html = escapeHtml(text);
  html = html.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label: string, href: string) => {
    let url = href;
    let hash = "";
    if (href.startsWith("ruta:")) {
      const [k, h] = href.slice(5).split("#");
      url = route(k, lang);
      hash = h ? `#${h}` : "";
    }
    const ext = /^https?:/.test(url) && !url.includes("fisiocorb.cat");
    return `<a href="${url}${hash}"${ext ? ' target="_blank" rel="noopener"' : ""}>${label}</a>`;
  });
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\n/g, "<br>");
  return html;
}

/** Eines per a una pàgina en un idioma concret. */
export function useT(lang: Lang) {
  return {
    lang,
    /** Text pla */
    t: (path: string) => pick(node(path), lang),
    /** Text amb format (negreta, enllaços, salts de línia) → per a set:html */
    h: (path: string) => format(pick(node(path), lang), lang),
    /** Format sobre un node ja obtingut (per a llistes) */
    hf: (n: Node) => format(pick(n, lang), lang),
    /** Escull idioma d'un node ja obtingut */
    p: (n: Node) => pick(n, lang),
    /** Node cru (per a llistes i objectes) */
    raw: (path: string) => node(path),
    /** URL d'una pàgina */
    r: (key: string, hash?: string) => route(key, lang) + (hash ? `#${hash}` : ""),
  };
}

export const negoci = data.negoci as {
  nom: string;
  url: string;
  telefon: string;
  telefonVisible: string;
  whatsapp: string;
  googleMaps: string;
  googleRessenyes: string;
  logo: string;
  [k: string]: unknown;
};

export const rutes = data.rutes as Record<string, Leaf>;
export const paginesData = data;
