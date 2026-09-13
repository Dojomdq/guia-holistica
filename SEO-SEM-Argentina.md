# Plan SEO & SEM — Guía de Bienestar

Objetivo: aparecer en los primeros resultados de Google para búsquedas de
bienestar en **toda la Argentina**, con prioridad en **Buenos Aires / CABA**.

---

## 1. Estado actual (relevamiento)

| Activo | Valor |
| --- | --- |
| Dominio | `guiadebienestar.com.ar` (www canonical) |
| Profesionales | 12 activos (8 Buenos Aires, 4 Mar del Plata) |
| Ubicaciones geocodificadas | 12 (8 BA, 4 MDQ) |
| Eventos | 1 (Mar del Plata) |
| Páginas by ciudad | `/ciudades/[slug]` — operativas |
| Sitemap | dinámico: páginas + actividades + ciudades |
| Indexación | `robots.txt` y `robots` meta indexan todo |

## 2. SEO técnico (ya implementado en el código)

- Landing por ciudad: `/ciudades/buenos-aires`, `/ciudades/mar-del-plata`, etc.
  con metadata, JSON-LD `LocalBusiness` + `ItemList` y breadcrumbs.
- Home con `areaServed: Country (Argentina)` + `WebSite` search action.
- Sitemap dinámico incluye todas las ciudades.
- Mapas: vista inicial nacional (toda la Argentina) + fit automático a marcadores.
- Keywords reforzadas: "bienestar argentina", "bienestar buenos aires",
  "profesionales de bienestar en buenos aires", "yoga buenos aires",
  "reiki caba", etc.

### Campaña de datos (siguiente paso)
1. Aumentar la cobertura: sumar profesionales de CABA con dirección real.
2. Eventos en BA/CABA (hoy solo hay 1 en MDQ).
3. Testimonios por ciudad.

## 3. SEM — estructura de campañas propuesta (Google Ads)

### Campaña 1: Marca (prioridad alta)
- Segmento: búsquedas de marca.
- Keywords:
  - `guia de bienestar`
  - `guia.debienestar`
  - `guia de bienestar argentina`
  - `guiadebienestar.com.ar`
- Aterrizaje: `/`

### Campaña 2: Categorías nacionales (prioridad alta)
- Keywords (match broad/frase, palabras clave de servicio):
  - `profesionales de bienestar argentina`
  - `terapias holísticas argentina`
  - `yoga`, `reiki`, `meditación`, `chamanismo`, `tarot` (con "argentina")
  - `masajes terapéuticos`, `flores de bach`, `sanación energética`
- Aterrizaje: `/actividades/[slug]` + mapa.

### Campaña 3: Local Buenos Aires / CABA (prioridad MAX — el mercado más grande)
- Keywords:
  - `yoga buenos aires`, `yoga caba`
  - `reiki buenos aires`, `reiki caba`
  - `meditación buenos aires`
  - `chamanismo buenos aires`
  - `tarot buenos aires`
  - `profesionales de bienestar buenos aires`
  - `terapias holísticas caba`
  - `masajes terapéuticos caba`
- Ubicación de orientación: CABA + GBA.
- Aterrizaje: `/ciudades/buenos-aires` + `/mapa?ciudad=Buenos+Afres`.

### Campaña 4: Local Mar del Plata (prioryity media — ciudad con 4 profesionales)
- Keywords:
  - `yoga mar del plata`
  - `reiki mar del plata`
  - `meditación mar del plata`
  - `tarot mar del plata`
  - `bienestar mar del plata`
- Aterrizaje: `/ciudades/mar-del-plata`.

### Campaña 5: Otras ciudades (opcional, cuando haya cobertura)
- `yoga la plata`, `yoga córdoba`, `yoga rosario`, `yoga mendoza`...

## 4. Aterrizajes (landing pages)

- `/ciudades/[slug]` listan a los profesionales de esa ciudad con H1,
  metadata y JSON-LD (LocalBusiness).
- `/mapa?ciudad=X` es el aterrizaje interactivo con filtro por ciudad.

## 5. Segmentación y presupuesto sugerido

- **Peso por geografía**: CABA/GBA 60%, resto del país 40%.
- **Presupuesto mínimo diario inicial**: USD 5–10/día (~150–300/mes) para
  arrancar; escalar según CPC real.
- **Yoga/reiki/tarot** son los términos con mayor volumen y competencia;
  pujas a keywords de long-tail (con ciudad) primero.

## 6. Métricas a seguir

- Clientes potenciales (clics a WhatsApp/Instagram/sitio desde el mapa).
- Clicks por keyword y CPC real.
- Conversiones: clic a `whatsapp`, `instagram`, `llamar`, `url externa`.
- CTR del anuncio y calidad del aterrizaje (velocidad móvil).

## 7. Notas

- El sitio ya está indexado; Google Search Console recomendado para
  monitorear impresiones por keyword y enviar el sitemap actualizado.
- Verificar que cada landing por ciudad tenga al menos 1 profesional antes de
  pujar con fuerza.