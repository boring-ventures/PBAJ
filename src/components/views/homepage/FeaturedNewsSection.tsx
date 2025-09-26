"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, Clock, User } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useState, useEffect } from "react";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  featured: boolean;
  featuredImageUrl: string | null;
  publishDate: string;
  createdAt: string;
  author: {
    firstName: string;
    lastName: string;
  } | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const formatDate = (dateString: string, locale: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function FeaturedNewsSection() {
  const { locale } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log(`Fetching news with locale: ${locale}`); // Debug log
        const response = await fetch(`/api/public/news?featured=true&limit=3&locale=${locale}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Received ${data.length} news items:`, data); // Debug log

        if (Array.isArray(data)) {
          setNews(data);
        } else {
          console.error("API returned non-array data:", data);
          setError("Invalid data format received");
        }
      } catch (error) {
        console.error("Error fetching news:", error);
        setError(error instanceof Error ? error.message : "Failed to load news");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [locale, retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-neutral-50 to-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-16"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 leading-tight">
              {locale === "es" ? "Últimas" : "Latest"}{" "}
              <span className="text-blue-600">
                {locale === "es" ? "Noticias" : "News"}
              </span>
            </h2>

            <div className="flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-green-500 rounded-full"></div>
            </div>

            <p className="text-lg md:text-xl text-neutral-700 leading-relaxed max-w-3xl mx-auto">
              {locale === "es" ? (
                <>
                  Mantente informado sobre nuestras acciones, logros y las
                  novedades del{" "}
                  <span className="font-semibold text-blue-600">
                    movimiento juvenil boliviano.
                  </span>
                </>
              ) : (
                <>
                  Stay informed about our actions, achievements and news from
                  the{" "}
                  <span className="font-semibold text-blue-600">
                    Bolivian youth movement.
                  </span>
                </>
              )}
            </p>
          </motion.div>

          {/* News Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-neutral-100 animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-200 rounded"></div>
                    <div className="h-16 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  {locale === "es" ? "Error al cargar noticias" : "Error loading news"}
                </h3>
                <p className="text-red-600 text-sm mb-4">{error}</p>
                <Button
                  onClick={handleRetry}
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  {locale === "es" ? "Intentar de nuevo" : "Try again"}
                </Button>
              </div>
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  {locale === "es" ? "No hay noticias disponibles" : "No news available"}
                </h3>
                <p className="text-gray-500 text-sm">
                  {locale === "es" ? "Vuelve pronto para ver las últimas actualizaciones" : "Check back soon for the latest updates"}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Debug info - remove in production */}
              {process.env.NODE_ENV === 'development' && (
                <div className="text-xs text-gray-400 text-center mb-4">
                  Debug: Loaded {news.length} news items | Locale: {locale}
                </div>
              )}
              <motion.div
                variants={containerVariants}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {news.map((article, index) => (
              <motion.article
                key={article.id}
                variants={cardVariants}
                whileHover={{ y: -10 }}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-neutral-100"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.featuredImageUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop"}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop";
                    }}
                  />

                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                      {article.category}
                    </span>
                  </div>

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Meta info */}
                  <div className="flex items-center justify-between text-sm text-neutral-500">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(article.publishDate, locale)}</span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{locale === "es" ? "3 min" : "3 min"}</span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span className="truncate max-w-20">
                          {article.author ? `${article.author.firstName} ${article.author.lastName}` : (locale === "es" ? "Equipo PBAJ" : "PBAJ Team")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg md:text-xl font-bold text-neutral-900 leading-tight group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-neutral-700 leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>

                  {/* Read more link */}
                  <div className="pt-2">
                    <Link
                      href={`/news/${article.id}`}
                      className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium group-hover:translate-x-2 transition-transform duration-300"
                    >
                      <span>{locale === "es" ? "Leer más" : "Read more"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
              </motion.div>
            </>
          )}

          {/* CTA */}
          <motion.div variants={itemVariants} className="text-center pt-8">
            <Link href="/news">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-6 text-lg font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {locale === "es" ? "Ver Todas las Noticias" : "View All News"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
