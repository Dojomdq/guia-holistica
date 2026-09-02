// Escapa un objeto para incrustarlo seguro en <script type="application/ld+json">.
// JSON.stringify NO escapa "</script>", lo que permite romper el bloque y
// ejecutar HTML/JS arbitrario si el objeto contiene datos no confiables.
export function safeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}