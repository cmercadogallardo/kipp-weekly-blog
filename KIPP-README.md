# KIPP-README.md

Guia operativa para que KIPP pueda dar mantenimiento al blog sin romper el diseño, la navegación ni la estructura del sitio.

## 1. Qué es este sitio

Este repo es un blog estático en HTML, CSS y JavaScript.

La lógica editorial del sitio ahora está organizada en 3 rutas principales:

1. `index.html`
   Portada del blog.
   Sirve para mostrar lo más nuevo y relevante.

2. `briefings.html`
   Feed de briefings estilo RSS premium.
   Sirve para escanear rápidamente todas las publicaciones como lista.

3. `indice-mensual.html`
   Índice por meses.
   Sirve para navegar el archivo por bloques cronológicos.

Además existen:

- `entrada-blog.html`
  Plantilla genérica para entradas editoriales o páginas explicativas.

- `archivos/...`
  Aquí viven los briefings reales ya publicados.

- `styles.css`
  Sistema visual completo.

- `main.js`
  Comportamientos del sitio: dark mode, navegación activa, menú móvil, TOC automático, mejoras de lectura.

## 2. Mapa del sitio

### Nivel 1: Navegación principal

En el menú superior solo deben existir estas 3 rutas:

- `Portada`
- `Briefings`
- `Indice por meses`

No metas más rutas al menú principal a menos que Cristian lo pida explícitamente.

### Nivel 2: Pantallas

#### `index.html` — Portada

Objetivo:
- Presentar el blog
- Destacar la publicación más nueva
- Dirigir al usuario hacia `briefings.html` o `indice-mensual.html`

Qué debe mostrar:
- Hero claro
- Explicación breve del blog
- Lo más nuevo y relevante
- Accesos rápidos a feed y archivo

No debe convertirse en:
- Dashboard complejo
- Timeline infinito
- Página con demasiadas decisiones

#### `briefings.html` — Feed de briefings

Objetivo:
- Funcionar como lista principal de lectura
- Parecer un RSS mejor presentado

Qué debe mostrar cada item:
- Fecha
- Título
- Descripción breve
- Tags
- Link directo al briefing

Orden:
- Más reciente primero
- Más antiguo después

Esta es la pantalla ideal para alguien que dice:
"Solo quiero ver la lista de publicaciones y abrir la que me interese."

#### `indice-mensual.html` — Archivo por meses

Objetivo:
- Agrupar briefings por mes
- Permitir navegar el histórico de forma cronológica

Qué debe mostrar:
- Mes
- Estado del mes
- Briefings contenidos en ese mes

Úsalo como archivo, no como feed principal.

#### `entrada-blog.html` — Plantilla editorial

Objetivo:
- Servir como base para páginas estáticas o editoriales
- No necesariamente para briefings automáticos

Incluye:
- Breadcrumb
- Metadata
- Sidebar contextual
- Layout de lectura larga

## 3. Dónde van los briefings reales

Los briefings publicados deben guardarse en:

`archivos/YYYYMM/YYYYMMDD/tech-briefing-YYYYMMDD.html`

Ejemplos actuales:

- `archivos/202605/20260517/tech-briefing-20260517.html`
- `archivos/202605/20260519/tech-briefing-20260519.html`

Regla:
- Un briefing por carpeta de fecha
- El nombre del archivo debe mantenerse consistente

## 4. Qué archivos hay que actualizar cuando se publica un briefing nuevo

Cuando agregues un nuevo briefing, normalmente debes tocar 4 lugares:

### A. Crear el briefing nuevo

Crea el archivo nuevo en:

`archivos/YYYYMM/YYYYMMDD/tech-briefing-YYYYMMDD.html`

Y asegúrate de que:
- Use `../../../styles.css`
- Use `../../../main.js`
- Mantenga la navegación principal con:
  - `Portada`
  - `Briefings`
  - `Indice por meses`

### B. Actualizar `briefings.html`

Agrega el briefing nuevo al inicio de la lista.

Cada item debe incluir:
- fecha visible
- título
- resumen breve
- tags
- link al archivo real

Importante:
- El más reciente siempre va arriba
- No borres los anteriores

### C. Actualizar `indice-mensual.html`

Debes:
- agregar el briefing dentro del mes correcto
- crear el bloque del mes si aún no existe
- actualizar el estado del mes si cambió

Ejemplo:
- si aparece un briefing de junio 2026, va en `#junio-2026`

### D. Actualizar `index.html`

Debes revisar si el briefing nuevo:
- reemplaza al briefing destacado
- debe ir primero en la sección de últimos briefings
- cambia el copy de “lo más nuevo”

No siempre necesitas reescribir toda la portada.
Solo actualiza las partes que dependen de la publicación más reciente.

## 5. Qué NO debes hacer

- No cambies el contenido editorial de briefings ya publicados salvo que sea una corrección autorizada.
- No rompas la navegación principal con anclas raras o rutas extras.
- No conviertas `indice-mensual.html` en la lista principal si ya existe `briefings.html`.
- No metas enlaces placeholder tipo `#` en navegación real.
- No cambies nombres de archivos sin actualizar todos los links.
- No pongas el briefing nuevo solo en `archivos/` y olvides el feed o el índice.

## 6. Reglas de diseño que debes conservar

Mantén estos patrones:

- Look editorial / tech
- Dark mode funcional
- Mobile first
- Superficies limpias y legibles
- Tipografía clara
- Jerarquía visual sencilla

La prioridad UX es esta:

1. Entender el sitio
2. Encontrar el briefing
3. Leer sin fricción

Si una mejora visual complica esos 3 puntos, no la hagas.

## 7. Cómo editar sin romper la navegación

### En HTML

Cada página principal usa:

- `body data-nav-section="home"`
- `body data-nav-section="briefings"`
- `body data-nav-section="archive"`

Esto ayuda a que `main.js` marque la navegación activa.

No quites esos atributos.

### En navegación principal

Los links deben usar:

- `data-nav-section="home"`
- `data-nav-section="briefings"`
- `data-nav-section="archive"`

No los cambies a otros nombres sin actualizar `main.js`.

### En páginas de briefings dentro de `archivos/`

Recuerda que las rutas son relativas.

Por eso deben usar:

- `../../../index.html`
- `../../../briefings.html`
- `../../../indice-mensual.html`
- `../../../styles.css`
- `../../../main.js`

## 8. Cómo redactar la descripción breve de cada briefing

Para `briefings.html`, cada resumen debe:

- estar en 1 o 2 líneas
- explicar rápidamente de qué trata la edición
- ayudar a decidir si vale la pena abrirla

Buen formato:

- tema central
- enfoque de la edición
- tipo de valor que aporta

Ejemplo:

"Robots físicos, simulación con Nvidia Isaac Sim, Agentic AI y hardware más eficiente en una sola edición."

Evita:

- resúmenes demasiado largos
- copiar párrafos enteros del briefing
- descripciones vagas como “nuevas noticias de tecnología”

## 9. Checklist para agregar un briefing nuevo

Antes de cerrar una publicación revisa:

- Existe el archivo nuevo en `archivos/YYYYMM/YYYYMMDD/`
- El archivo nuevo abre bien
- `briefings.html` ya lo muestra arriba
- `indice-mensual.html` ya lo muestra en el mes correcto
- `index.html` ya refleja el nuevo briefing si aplica
- Los links relativos funcionan
- El título y resumen breve son correctos
- No rompiste el menú principal

## 10. Checklist para modificar diseño

Si vas a tocar diseño:

- Revisa `styles.css`
- No dupliques patrones innecesarios
- Mantén consistencia entre:
  - `index.html`
  - `briefings.html`
  - `indice-mensual.html`
  - briefings de `archivos/...`

Si agregas una pantalla nueva, pregúntate:

"¿Esto realmente necesita existir en el menú principal?"

La respuesta casi siempre debe ser:

"No, salvo que reemplace a una de las 3 rutas principales."

## 11. Resumen operativo rápido para KIPP

Si solo quieres mantener el blog, recuerda esto:

- `index.html` = portada
- `briefings.html` = lista principal de publicaciones
- `indice-mensual.html` = archivo por mes
- `archivos/...` = contenido real

Flujo normal al publicar algo nuevo:

1. Crear briefing nuevo en `archivos/...`
2. Agregarlo arriba en `briefings.html`
3. Agregarlo en su mes dentro de `indice-mensual.html`
4. Actualizar portada en `index.html` si es la publicación más reciente
5. Verificar links

Eso es todo.
