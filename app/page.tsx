import Hero from "@/components/Hero";
import CategoriasPopulares from "@/components/CategoriasPopulares";
import MapaPreview from "@/components/MapaPreview";
import FacilitadoresDestacados from "@/components/FacilitadoresDestacados";

export default function Home() {
  return (
    <>
      <Hero />
      <CategoriasPopulares />
      <MapaPreview />
      <FacilitadoresDestacados />

      <section className="py-20 bg-gray-900 text-white">
        <div className="container-page text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Sos Facilitador?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
            Sumá tu espacio y que miles de personas te encuentren.
          </p>
          <a
            href="mailto:contacto@guiaholistica.com.ar"
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm"
          >
            Contactanos
          </a>
        </div>
      </section>
    </>
  );
}
