# Prompt: Guía de Bienestar — Directorio de Facilitadores Holísticos

Arma una web de directorio de facilitadores holísticos en Mar del Plata llamada **"Guía de Bienestar"** con mapa interactivo. Stack: Next.js 14, React, Tailwind CSS, react-leaflet, Supabase.

## Referencia visual
Usá como referencia estética el sitio https://01a02b74-19b1-7f25-b5f7-b410d64a54f4.arena.site/ (Danza Mar del Plata). Buscá ese mismo nivel de pulido, profundidad y cohesión visual, pero con una paleta de colores clara y cálida (cremas, verdes sage, terracota). Fuentes: serif para headlines, sans-serif para body.

## Estructura de secciones

1. **HERO** — Imagen de fondo con gradiente animado sutil. Texto grande con sombra. CTA principal. Badge animado arriba.

2. **BÚSQUEDA** — Barra de búsqueda semitransparente con backdrop-blur. Chips de categorías seleccionables con iconos.

3. **MAPA INTERACTIVO** — Página dedicada /mapa. Leaflet con tiles claros. Marcadores con color por categoría. Popups con info del facilitador, link a Google Maps ("Cómo llego"), Instagram, WhatsApp. Floating search y filtros. Contador de lugares en pantalla. Leyenda de colores. Botón "Activar zoom con el scroll".

4. **CATEGORÍAS** — Grid de cards con iconos por categoría (yoga, reiki, meditación, chamanismo, tarot, astrología, etc.). Hover con scale y sombra. Conteo de facilitadores.

5. **EVENTOS** — Cards con imagen, fecha, ubicación.

6. **DESTACADOS** — Cards de facilitadores premium con logo personalizado en marcador del mapa.

7. **TESTIMONIOS** — Testimonio grande + cards más pequeñas. Rating con estrellas.

8. **FAQ** — Accordion con preguntas frecuentes.

9. **CTA** — Email capture. "Sumá tu perfil".

10. **FOOTER** — Logo, redes, links por secciones.

## Mapa
- Centro: Mar del Plata (-38.0055, -57.5426)
- Marcadores con icono de color por categoría
- Popups con nombre, dirección, horario, precio, nivel, link a Google Maps
- Filtros: ciudad, actividad, búsqueda por texto
- City chips que centran el mapa
- Marcador con logo personalizado si el facilitador tiene logo_url

## Base de datos (Supabase)
- Tablas: facilitadores, actividades, categorias, ubicaciones, facilitador_actividades, eventos, destacados, planes, pagos, representantes, clicks
- Admin en /admin con login básico (Basic Auth)
- CRUD de facilitadores, actividades, categorías, eventos, destacados
- Geocoding automático con Nominatim

## Funcionalidades
- SEO: metadata, OpenGraph, JSON-LD, sitemap.xml, robots.txt
- Responsive mobile first
- Instagram link con SVG custom (lucide-react v1 eliminó el icono de Instagram)
- Tracking de clicks
- Sistema de planes (gratis, mensual, anual)

## Reglas
- Todo en español argentino
- Componentes modulares y reutilizables
- lucide-react para iconos (excepto Instagram)
- Build deve compilar sin errores
- Deploy a preview primero
