/** Dades estructurades de les pàgines de pobles (camí de navegació per a Google). */
import { negoci } from "../i18n";

export function breadcrumb(items: { nom: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.nom, item: negoci.url + it.url })),
  };
}
