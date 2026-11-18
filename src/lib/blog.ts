import { getCollection, type CollectionEntry } from "astro:content";
import { route, type Lang } from "../i18n";

export type Post = CollectionEntry<"blog">;

export const postLang = (p: Post) => p.id.split("/")[0] as Lang;
export const postSlug = (p: Post) => p.id.split("/").slice(1).join("/");
export const postUrl = (lang: Lang, slug: string) => `${route("blog", lang)}${slug}/`;

export async function getPosts(lang: Lang) {
  const all = await getCollection("blog", (p) => postLang(p) === lang);
  return all.sort((a, b) => b.data.data.getTime() - a.data.data.getTime());
}

export function formatDate(d: Date, lang: Lang) {
  return new Intl.DateTimeFormat(lang === "ca" ? "ca-ES" : "es-ES", { day: "numeric", month: "long", year: "numeric" }).format(d);
}
