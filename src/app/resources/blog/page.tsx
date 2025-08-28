import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import OpinionHero from "@/components/views/opinion/OpinionHero";

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <OpinionHero />
        
        {/* Blog Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Opinion Articles */}
                <article className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="text-sm text-blue-600 font-semibold mb-2">ANÁLISIS</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      El futuro de la educación en Bolivia
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Reflexiones sobre los desafíos y oportunidades del sistema educativo boliviano.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">15 Mar 2024</span>
                      <a href="#" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                        Leer más →
                      </a>
                    </div>
                  </div>
                </article>

                <article className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="text-sm text-green-600 font-semibold mb-2">OPINIÓN</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      Desarrollo sostenible y justicia social
                    </h3>
                    <p className="text-gray-600 mb-4">
                      La importancia de un enfoque integral para el desarrollo nacional.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">12 Mar 2024</span>
                      <a href="#" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                        Leer más →
                      </a>
                    </div>
                  </div>
                </article>

                <article className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="text-sm text-purple-600 font-semibold mb-2">ENTREVISTA</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      Conversando con líderes comunitarios
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Perspectivas desde las comunidades sobre el desarrollo local.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">10 Mar 2024</span>
                      <a href="#" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                        Leer más →
                      </a>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}