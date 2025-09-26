"use client";

import { useLanguage } from "@/context/language-context";

export default function OpinionsHero() {
  const { t } = useLanguage();

  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            {t("pages.opinions.title")}
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {t("pages.opinions.subtitle")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg px-6 py-3 shadow-sm">
              <span className="text-sm font-medium text-gray-700">
                {t("pages.opinions.features.analysis")}
              </span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg px-6 py-3 shadow-sm">
              <span className="text-sm font-medium text-gray-700">
                {t("pages.opinions.features.commentary")}
              </span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg px-6 py-3 shadow-sm">
              <span className="text-sm font-medium text-gray-700">
                {t("pages.opinions.features.perspectives")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
