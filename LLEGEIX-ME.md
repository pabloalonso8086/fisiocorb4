# Fisio Vall del Corb · web (fisiocorb.cat)

Web en **català** (adreces sense prefix) i **castellà** (adreces que comencen per `/es/`).

## Com canviar els textos (sense programador)

**Tots els textos de les pàgines són al fitxer `textos.json`**, a l'arrel del projecte.

1. Obre `textos.json` amb qualsevol editor de text (el Bloc de notes serveix, però és millor el VS Code).
2. Busca la frase que vols canviar (Ctrl+F).
3. Cada text té les dues versions, una al costat de l'altra:
   ```json
   "boto": { "ca": "Demana cita per WhatsApp", "es": "Pide cita por WhatsApp" }
   ```
4. Canvia només el que hi ha **entre les cometes**. No esborris les cometes, els dos punts ni les comes.
5. Desa el fitxer i publica (vegeu més avall).

Format que es pot fer servir dins dels textos:

| Escrius | Surt |
|---|---|
| `**paraula**` | **paraula** en negreta |
| `[text](ruta:consulta)` | enllaç a una pàgina del web, en l'idioma que toqui |
| `[text](ruta:inici#faq)` | enllaç a una secció d'una pàgina |
| `[text](https://...)` | enllaç a un altre web (s'obre en una pestanya nova) |
| `\n` | salt de línia |

Les claus de pàgina que es poden fer servir a `ruta:` són les de la secció `"rutes"` del mateix fitxer.

Les dades del negoci (telèfon, WhatsApp, nota de Google, preus, pobles) són a la secció `"negoci"` i s'actualitzen a tot el web alhora.

⚠️ **No canviïs les adreces de la secció `"rutes"`** sense parlar-ne abans: Google té aquestes adreces indexades i es perdria posicionament.

Si t'equivoques amb una coma o una cometa, la publicació s'atura i diu en quina línia és l'error: no es pot espatllar el web publicat.

## Articles del blog

Els articles **no** són a `textos.json` (serien massa llargs). Cada article és un fitxer:

- `src/content/blog/ca/nom-de-l-article.md` → `fisiocorb.cat/blog/nom-de-l-article/`
- `src/content/blog/es/nombre-del-articulo.md` → `fisiocorb.cat/es/blog/nombre-del-articulo/`

Per crear-ne un de nou, copia un article existent, canvia-li el nom del fitxer i edita la capçalera:

```markdown
---
titol: "Títol de l'article"
descripcio: "Resum d'una o dues frases (surt a Google i a la llista del blog)."
data: 2026-11-17
imatge: "/wp-content/uploads/2026/11/foto.jpg"
imatgeAlt: "Descripció de la foto"
traduccio: "nom-de-l-article-en-l-altre-idioma"
---

Aquí va el text. Un paràgraf per bloc, separats per una línia en blanc.

## Subtítol

- llista
- de punts
```

`traduccio` és opcional: si l'article existeix en l'altre idioma, posa-hi el nom del fitxer (sense `.md`) i el selector d'idioma hi portarà directament.

Les fotos es posen a la carpeta `public/` (per exemple `public/img/`) i s'escriuen començant per `/` (`/img/foto.webp`).

## Textos legals

Avís legal, privacitat i cookies: `src/content/legal/ca/*.md` i `src/content/legal/es/*.md`. Es canvien igual que un article.

## Publicar

Cal tenir instal·lat Node.js i pnpm.

```bash
pnpm install      # només la primera vegada
pnpm dev          # veure el web a l'ordinador: http://localhost:4321
pnpm build        # generar el web i comprovar-lo
pnpm run deploy   # publicar a Cloudflare
```

`pnpm build` comprova automàticament que **totes les adreces de la web antiga** (llista a `scripts/urls-web-antiga.txt`) continuïn funcionant, ja sigui com a pàgina o com a redirecció 301 (`public/_redirects`). Si en falla alguna, no deixa publicar.

## Pendent abans de publicar

- [ ] Fotos reals en B/N de la consulta de Bellpuig.
- [ ] Logo en alta resolució (`public/img/logo-fisio-vall-del-corb.png`).
- [ ] La imatge de «Lesions que tornen» està generada amb IA: substituir-la per una foto real quan es pugui.
- [ ] Foto de Belianes del peu (`public/img/belianes-bn.webp`) en versió gran i horitzontal.
- [ ] Ressenyes: a la portada hi ha un comentari `<!-- AQUÍ: widget de ressenyes… -->` (a `src/views/Inici.astro`) per posar-hi el widget de Google si es vol.
- [ ] Revisar que l'horari, la zona i els preus de la fitxa de Google coincideixin amb el web.
- [ ] Exportar de Search Console les adreces antigues amb visites i afegir-les a `scripts/urls-web-antiga.txt` (els duplicats per data, `/2016/…`, ja es redirigeixen al blog).
- [ ] Revisar els textos legals: la política de cookies (original) parla de Google Analytics i Twitter, però aquest web **no posa cookies** ni té cap eina de seguiment.
