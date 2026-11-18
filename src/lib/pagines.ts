/**
 * Registre de pàgines: clau de textos.json → "rutes"  ⇒  vista que la pinta.
 * Per afegir una pàgina nova: crear la vista a src/views, afegir-la aquí i
 * afegir la ruta a textos.json → "rutes".
 * Cada entrada és una vista, o bé { view, props } si la vista necessita dades fixes.
 */
import Inici from "../views/Inici.astro";
import BlogIndex from "../views/BlogIndex.astro";
import Legal from "../views/Legal.astro";
import ComTreballo from "../views/ComTreballo.astro";
import Consulta from "../views/Consulta.astro";
import Bici from "../views/Bici.astro";
import Domicili from "../views/Domicili.astro";
import Poble from "../views/Poble.astro";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Vista = any | { view: any; props: Record<string, unknown> };

export const VISTES: Record<string, Vista> = {
  inici: Inici,
  comTreballo: ComTreballo,
  consulta: Consulta,
  bici: Bici,
  domicili: Domicili,
  tarrega: { view: Poble, props: { poble: "tarrega" } },
  arbeca: { view: Poble, props: { poble: "arbeca" } },
  juneda: { view: Poble, props: { poble: "juneda" } },
  borges: { view: Poble, props: { poble: "borges" } },
  blog: BlogIndex,
  avisLegal: { view: Legal, props: { doc: "avisLegal" } },
  privacitat: { view: Legal, props: { doc: "privacitat" } },
  cookies: { view: Legal, props: { doc: "cookies" } },
};

export function resolveVista(key: string) {
  const v = VISTES[key];
  if (!v) return null;
  return v.view ? { View: v.view, extra: v.props } : { View: v, extra: {} };
}
