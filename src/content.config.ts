import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

/**
 * Articles del blog: src/content/blog/ca/<url>.md i src/content/blog/es/<url>.md
 * El nom del fitxer és l'adreça de l'article (no canviar-lo: es perd posicionament).
 */
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    titol: z.string(),
    descripcio: z.string(),
    data: z.coerce.date(),
    imatge: z.string().optional(),
    imatgeAlt: z.string().optional(),
    autor: z.string().default("Òscar González Masana, fisioterapeuta"),
    /** Nom del fitxer de la mateixa entrada en l'altre idioma (si existeix) */
    traduccio: z.string().optional(),
  }),
});

/** Textos legals: src/content/legal/<ca|es>/<avisLegal|privacitat|cookies>.md */
const legal = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/legal" }),
  schema: z.object({
    titol: z.string(),
    descripcio: z.string(),
  }),
});

export const collections = { blog, legal };
