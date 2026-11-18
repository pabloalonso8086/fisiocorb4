/** Dades estructurades (JSON-LD) per a Google. Es generen a partir de textos.json → negoci. */
import { negoci, route, type Lang } from "../i18n";

export function localBusiness(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "Physiotherapy",
    name: negoci.nom,
    url: negoci.url + route("inici", lang),
    telephone: negoci.telefon,
    image: negoci.url + negoci.logo,
    priceRange: negoci.preus,
    inLanguage: lang === "ca" ? "ca-ES" : "es-ES",
    areaServed: negoci.zonaServei,
    founder: { "@type": "Person", name: negoci.fundador, jobTitle: "Fisioterapeuta" },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Wednesday"], opens: "09:00", closes: "14:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"], opens: "15:00", closes: "20:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "09:00", closes: "14:00" },
    ],
  };
}

export function faqPage(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a.replace(/\*\*/g, "") } })),
  };
}

export function blogPosting(o: { titol: string; descripcio: string; data: Date; url: string; imatge?: string; autor: string; lang: Lang }) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: o.titol,
    description: o.descripcio,
    datePublished: o.data.toISOString().slice(0, 10),
    inLanguage: o.lang === "ca" ? "ca-ES" : "es-ES",
    mainEntityOfPage: negoci.url + o.url,
    image: o.imatge ? (o.imatge.startsWith("http") ? o.imatge : negoci.url + o.imatge) : undefined,
    author: { "@type": "Person", name: o.autor.split(",")[0] },
    publisher: { "@type": "Organization", name: negoci.nom, logo: { "@type": "ImageObject", url: negoci.url + negoci.logo } },
  };
}
