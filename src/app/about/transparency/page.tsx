"use client";

import { useLanguage } from "@/context/language-context";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import TransparencyHero from "@/components/views/about/TransparencyHero";

export default function TransparencyPage() {
  const { locale, t } = useLanguage();
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <TransparencyHero />

        {/* Transparency Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Annual Reports */}
              <div className="bg-white p-8 rounded-lg shadow-sm border">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {locale === "es" ? "Informes Anuales" : "Annual Reports"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {locale === "es"
                    ? "Accede a nuestros informes anuales con información detallada sobre nuestras actividades y resultados."
                    : "Access our annual reports with detailed information about our activities and results."
                  }
                </p>
                <div className="space-y-3">
                  <a href="#" className="block text-blue-600 hover:text-blue-700 font-medium">
                    {locale === "es" ? "Informe Anual 2023 ↓" : "Annual Report 2023 ↓"}
                  </a>
                  <a href="#" className="block text-blue-600 hover:text-blue-700 font-medium">
                    {locale === "es" ? "Informe Anual 2022 ↓" : "Annual Report 2022 ↓"}
                  </a>
                  <a href="#" className="block text-blue-600 hover:text-blue-700 font-medium">
                    {locale === "es" ? "Informe Anual 2021 ↓" : "Annual Report 2021 ↓"}
                  </a>
                </div>
              </div>

              {/* Financial Statements */}
              <div className="bg-white p-8 rounded-lg shadow-sm border">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {locale === "es" ? "Estados Financieros" : "Financial Statements"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {locale === "es"
                    ? "Consulta nuestros estados financieros auditados y el uso transparente de los recursos."
                    : "Review our audited financial statements and transparent use of resources."
                  }
                </p>
                <div className="space-y-3">
                  <a href="#" className="block text-blue-600 hover:text-blue-700 font-medium">
                    {locale === "es" ? "Estados Financieros 2023 ↓" : "Financial Statements 2023 ↓"}
                  </a>
                  <a href="#" className="block text-blue-600 hover:text-blue-700 font-medium">
                    {locale === "es" ? "Estados Financieros 2022 ↓" : "Financial Statements 2022 ↓"}
                  </a>
                  <a href="#" className="block text-blue-600 hover:text-blue-700 font-medium">
                    {locale === "es" ? "Auditoría Externa 2023 ↓" : "External Audit 2023 ↓"}
                  </a>
                </div>
              </div>

              {/* Policies and Governance */}
              <div className="bg-white p-8 rounded-lg shadow-sm border">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {locale === "es" ? "Políticas y Gobernanza" : "Policies and Governance"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {locale === "es"
                    ? "Conoce nuestras políticas internas y estructura de gobernanza organizacional."
                    : "Learn about our internal policies and organizational governance structure."
                  }
                </p>
                <div className="space-y-3">
                  <a href="#" className="block text-blue-600 hover:text-blue-700 font-medium">
                    {locale === "es" ? "Código de Ética ↓" : "Code of Ethics ↓"}
                  </a>
                  <a href="#" className="block text-blue-600 hover:text-blue-700 font-medium">
                    {locale === "es" ? "Manual de Procedimientos ↓" : "Procedures Manual ↓"}
                  </a>
                  <a href="#" className="block text-blue-600 hover:text-blue-700 font-medium">
                    {locale === "es" ? "Estructura Organizacional ↓" : "Organizational Structure ↓"}
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