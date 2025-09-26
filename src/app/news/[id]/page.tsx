"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowLeft, Share2, Clock } from "lucide-react";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

interface NewsItem {
  id: string;
  title: string;
  content?: string;
  excerpt?: string;
  featuredImageUrl?: string;
  category?: string;
  publishDate?: string;
  createdAt?: string;
  author?: {
    firstName?: string;
    lastName?: string;
  };
}

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { locale, t } = useLanguage();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      if (!params.id) return;

      try {
        setLoading(true);
        const response = await fetch(
          `/api/public/news/${params.id}?locale=${locale}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            setError("Noticia no encontrada");
          } else {
            setError("Error al cargar la noticia");
          }
          return;
        }

        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error("Error fetching news:", error);
        setError("Error al cargar la noticia");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [params.id, locale]);

  const formatDate = (date: Date) => {
    return format(date, "dd MMMM yyyy", {
      locale: locale === "es" ? es : enUS,
    });
  };

  const formatTime = (date: Date) => {
    return format(date, "HH:mm", {
      locale: locale === "es" ? es : enUS,
    });
  };

  const getCategoryColor = (category?: string) => {
    const colorMap: Record<string, string> = {
      CAMPAIGN: "bg-purple-500",
      UPDATE: "bg-blue-500",
      EVENT: "bg-pink-500",
      ANNOUNCEMENT: "bg-yellow-500",
      PRESS_RELEASE: "bg-indigo-500",
      POLICY: "bg-blue-500",
      EDUCATION: "bg-green-500",
      HEALTH: "bg-red-500",
      ENVIRONMENT: "bg-emerald-500",
      CULTURE: "bg-purple-500",
      TECHNOLOGY: "bg-indigo-500",
      SOCIAL: "bg-pink-500",
      ECONOMY: "bg-orange-500",
    };
    return colorMap[category || ""] || "bg-gray-500";
  };

  const renderContent = (content?: string) => {
    if (!content) return null;

    // If content contains HTML tags, render it as HTML
    if (content.includes("<") && content.includes(">")) {
      return (
        <div
          className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700 prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }

    // If content is plain text, render it as paragraphs
    return (
      <div className="prose prose-lg max-w-none">
        {content.split("\n\n").map((paragraph, index) => (
          <p key={index} className="text-gray-700 leading-relaxed mb-4">
            {paragraph}
          </p>
        ))}
      </div>
    );
  };

  const handleShare = async () => {
    if (navigator.share && news) {
      try {
        await navigator.share({
          title: news.title,
          text: news.excerpt || news.title,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        // You could add a toast notification here
        alert(
          locale === "es"
            ? "Enlace copiado al portapapeles"
            : "Link copied to clipboard"
        );
      } catch (error) {
        console.log("Error copying to clipboard:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
              <Skeleton className="h-8 w-32 mb-8" />
              <Skeleton className="h-12 w-full mb-6" />
              <Skeleton className="h-64 w-full mb-6" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {locale === "es" ? "Noticia no encontrada" : "News not found"}
              </h1>
              <p className="text-gray-600 mb-8">
                {locale === "es"
                  ? "La noticia que buscas no existe o ha sido eliminada."
                  : "The news article you're looking for doesn't exist or has been removed."}
              </p>
              <Button
                onClick={() => router.push("/news")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {locale === "es" ? "Volver a noticias" : "Back to news"}
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => router.push("/news")}
              className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              {locale === "es" ? "Volver a noticias" : "Back to news"}
            </Button>

            {/* Article Header */}
            <header className="mb-8">
              {/* Category Badge */}
              {news.category && (
                <Badge
                  className={`${getCategoryColor(news.category)} text-white border-none mb-4`}
                >
                  {news.category}
                </Badge>
              )}

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {news.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
                {news.publishDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(new Date(news.publishDate))}</span>
                  </div>
                )}

                {news.publishDate && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(new Date(news.publishDate))}</span>
                  </div>
                )}

                {news.author && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>
                      {news.author.firstName} {news.author.lastName}
                    </span>
                  </div>
                )}
              </div>

              {/* Share Button */}
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="flex items-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  {locale === "es" ? "Compartir" : "Share"}
                </Button>
              </div>
            </header>

            {/* Featured Image */}
            {news.featuredImageUrl && (
              <div className="aspect-[16/9] bg-gray-100 rounded-2xl overflow-hidden mb-8 shadow-lg">
                <img
                  src={news.featuredImageUrl}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Excerpt */}
            {news.excerpt && (
              <div className="mb-8 p-6 bg-gray-50 rounded-2xl border-l-4 border-blue-500">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  {locale === "es" ? "Resumen" : "Summary"}
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {news.excerpt}
                </p>
              </div>
            )}

            {/* Content */}
            {news.content && (
              <article className="mb-12">
                <div className="prose prose-lg max-w-none">
                  {renderContent(news.content)}
                </div>
              </article>
            )}

            {/* Article Footer */}
            <footer className="border-t border-gray-200 pt-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="text-sm text-gray-600">
                  {locale === "es" ? "Publicado el" : "Published on"}{" "}
                  {news.publishDate && formatDate(new Date(news.publishDate))}
                  {news.author && (
                    <span className="ml-2">
                      {locale === "es" ? "por" : "by"} {news.author.firstName}{" "}
                      {news.author.lastName}
                    </span>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className="flex items-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    {locale === "es" ? "Compartir" : "Share"}
                  </Button>

                  <Button
                    onClick={() => router.push("/news")}
                    className="flex items-center gap-2"
                  >
                    {locale === "es" ? "Ver más noticias" : "View more news"}
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </Button>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
