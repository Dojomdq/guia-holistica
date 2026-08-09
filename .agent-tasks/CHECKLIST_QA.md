# QA Checklist - Guía de Bienestar

> Completar después de cada deploy. Marcar ✅ o ❌ con comentario.

---

## HOME

- [ ] Hero carga correctamente (imagen de fondo, texto, beneficios, botón "Explorá el mapa")
- [ ] Buscador: tabs Actividad/Ciudad/Nombre cambian el placeholder
- [ ] Buscador: escribir "yoga" y presionar Enter → redirige a /mapa?q=yoga
- [ ] Mapa (home): se carga automáticamente al hacer scroll
- [ ] Testimonio: se ve con estrellas, nombre y link a Instagram
- [ ] Banner "Sumá tu perfil": texto y botón visibles, link a WhatsApp con mensaje
- [ ] FAQ: acordeón abre/cierra correctamente, todas las preguntas visibles

---

## MAPA (/mapa)

- [ ] OSM tiles cargan correctamente (calles visibles, sin tiles rotos)
- [ ] Puntos de color visibles (sin emojis, sin clústeres)
- [ ] Buscar "yoga" → lista de facilitadores coincide con puntos en el mapa
- [ ] Click en facilitador de la lista → mapa hace fly-to al punto
- [ ] Click en punto del mapa → popup con nombre, actividades, dirección, WhatsApp
- [ ] Click en "Ver perfil" del popup → abre /facilitadores/[id]
- [ ] Burbujas de ciudad funcionan (si hay 2+ ciudades)
- [ ] Mobile: sidebar ocupa máximo 40vh, mapa visible
- [ ] Floating WhatsApp NO aparece en /mapa (solo en otras páginas)

---

## ACTIVIDADES (/actividades)

- [ ] Grid de categorías carga correctamente (íconos, nombres, contadores)
- [ ] Click en "Yoga" → /actividades/yoga con sub-actividades (Hatha, Vinyasa, etc.)
- [ ] Click en sub-actividad → redirige a /mapa?q=hatha-yoga
- [ ] Categoría vacía (ej: sin actividades) muestra mensaje

---

## FACILITADORES (/facilitadores)

- [ ] Grid de facilitadores carga correctamente (nombre, ciudad, actividades)
- [ ] Buscar "artes marciales" → muestra facilitadores de esa categoría
- [ ] Burbuja de categoría se marca al llegar con ?q=aikido
- [ ] Burbuja "Artes marciales no competitivas" filtra correctamente
- [ ] Click en facilitador → /facilitadores/[id]

---

## PERFIL FACILITADOR (/facilitadores/[id])

- [ ] Foto o avatar visible (iniciales si no hay foto)
- [ ] Badges agrupados por categoría: "Yoga → Hatha Yoga, Vinyasa"
- [ ] Botones WhatsApp, Instagram, Email, Sitio Web visibles
- [ ] Horarios: solo aparece si el facilitador tiene datos
- [ ] Ubicaciones: dirección, ciudad, mapa por cada una
- [ ] Descripción de ubicación visible (si tiene)
- [ ] Bio ("Sobre el profesional") visible si tiene datos

---

## ADMIN (/admin)

- [ ] Login: usuario/contraseña funciona, redirige al panel
- [ ] Lista de facilitadores carga correctamente
- [ ] Crear facilitador: guarda nombre, actividades, ubicaciones
- [ ] Editar: todos los campos se cargan al abrir (incluyendo descripción de ubicaciones)
- [ ] Segunda ubicación: mapa carga en cada una
- [ ] Eliminar: confirmación y borrado correcto

---

## DARK MODE

- [ ] Toggle ☀️/🌙 en header funciona
- [ ] Home: fondo, cards, texto cambian
- [ ] Mapa: sidebar, popups cambian
- [ ] Actividades: cards cambian
- [ ] Facilitadores: lista y perfil cambian
- [ ] Preferencia se guarda (recargar página mantiene el tema)

---

## MOBILE (repetir todo arriba en celu)

- [ ] Home: no hay overflow horizontal, texto legible
- [ ] Mapa: sidebar no tapa el mapa, botones accesibles
- [ ] Actividades: grid 1 columna
- [ ] Facilitadores: lista scrolleable, toques funcionan
- [ ] Perfil: foto + badges no se descuadran
- [ ] Admin: formularios usables

---

## SEO

- [ ] Canonical apunta a guiadebienestar.com.ar en todas las páginas
- [ ] No hay "Mar del Plata" hardcodeado en títulos (usa CITY_NAME o "tu ciudad")
- [ ] No hay "holísticos" en texto visible
- [ ] No hay "gratuito" en texto visible
- [ ] Sitemap accesible en /sitemap.xml
- [ ] Robots.txt permite indexación en producción

---

*Última actualización: 2026-08-09*
