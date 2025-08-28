import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";

export default function TransparencyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <section className="pt-24 pb-12 bg-gradient-to-br from-blue-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Transparencia
              </h1>
              <p className="text-xl text-gray-600">
                Nuestro compromiso con la rendición de cuentas y la transparencia
              </p>
            </div>
          </div>
        </section>

        {/* Transparency Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Annual Reports */}
              <div className="bg-white p-8 rounded-lg shadow-sm border">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Informes Anuales
                </h3>
                <p className="text-gray-600 mb-6">
                  Accede a nuestros informes anuales con información detallada sobre nuestras actividades y resultados.
                </p>
                <div className="space-y-3">
                  <a href="#" className="block text-blue-600 hover:text-blue-700 font-medium">
                    Informe Anual 2023 ↓
                  </a>
                  <a href="#" className="block text-blue-600 hover:text-blue-700 font-medium">
                    Informe Anual 2022 ↓
                  </a>
                  <a href="#" className="block text-blue-600 hover:text-blue-700 font-medium">
                    Informe Anual 2021 ↓
                  </a>
                </div>
              </div>

              {/* Financial Statements */}
              <div className="bg-white p-8 rounded-lg shadow-sm border">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Estados Financieros
                </h3>
                <p className="text-gray-600 mb-6">
                  Consulta nuestros estados financieros auditados y el uso transparente de los recursos.
                </p>
                <div className="space-y-3">
                  <a href="#" className="block text-blue-600 hover:text-blue-700 font-medium">
                    Estados Financieros 2023 ↓
                  </a>
                  <a href="#" className="block text-blue-600 hover:text-blue-700 font-medium">
                    Estados Financieros 2022 ↓
                  </a>
                  <a href="#" className="block text-blue-600 hover:text-blue-700 font-medium">
                    Auditoría Externa 2023 ↓
                  </a>
                </div>
              </div>

              {/* Policies and Governance */}
              <div className="bg-white p-8 rounded-lg shadow-sm border">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Políticas y Gobernanza
                </h3>
                <p className="text-gray-600 mb-6">
                  Conoce nuestras políticas internas y estructura de gobernanza organizacional.
                </p>
                <div className="space-y-3">
                  <a href="#" className="block text-blue-600 hover:text-blue-700 font-medium">
                    Código de Ética ↓
                  </a>
                  <a href="#" className="block text-blue-600 hover:text-blue-700 font-medium">
                    Manual de Procedimientos ↓
                  </a>
                  <a href="#" className="block text-blue-600 hover:text-blue-700 font-medium">
                    Estructura Organizacional ↓
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}