"use client";

import { useState, useEffect, Suspense } from "react";
import FeaturedNews from "@/components/views/news/FeaturedNews";
import NewsGrid from "@/components/views/news/NewsGrid";
import NewsSearch from "@/components/views/news/NewsSearch";
import NewsFilter from "@/components/views/news/NewsFilter";

interface NewsContentProps {
  locale: "es" | "en";
  t: (key: string) => string;
}

export default function NewsContent({ locale, t }: NewsContentProps) {
  const [featuredNews, setFeaturedNews] = useState<any[]>([]);
  const [allNews, setAllNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const [featuredResponse, allResponse] = await Promise.all([
          fetch(`/api/public/news?featured=true&limit=3&locale=${locale}`),
          fetch(`/api/public/news?limit=50&locale=${locale}`),
        ]);

        if (featuredResponse.ok && allResponse.ok) {
          const featuredData = await featuredResponse.json();
          const allData = await allResponse.json();

          // Convert dates to strings for components
          const featuredFormatted = featuredData.map((item: any) => ({
            ...item,
            publishDate: item.publishDate,
            author: {
              ...item.author,
              firstName: item.author.firstName ?? undefined,
              lastName: item.author.lastName ?? undefined,
            },
          }));

          const allFormatted = allData.map((item: any) => ({
            ...item,
            publishDate: item.publishDate,
            author: {
              ...item.author,
              firstName: item.author.firstName ?? undefined,
              lastName: item.author.lastName ?? undefined,
            },
          }));

          setFeaturedNews(featuredFormatted);
          setAllNews(allFormatted);
        } else {
          console.error("Failed to fetch news");
        }
      } catch (error) {
        console.error("Error loading news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [locale]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg">{t("common.loading")}</div>
      </div>
    );
  }

  return (
    <>
      {/* Featured News Section */}
      <FeaturedNews news={featuredNews} />

      {/* All News Section */}
      <div className="mt-16">
        {/* Title */}
        <div className="flex items-center mb-8">
          <h2 className="text-6xl font-bold" style={{ color: "#000000" }}>
            {t("pages.news.allNews")}
          </h2>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-12">
          <Suspense fallback={<div>{t("common.loading")}</div>}>
            <NewsSearch />
          </Suspense>
          <div className="mt-6">
            <Suspense fallback={<div>{t("common.loading")}</div>}>
              <NewsFilter categories={[]} />
            </Suspense>
          </div>
        </div>

        <NewsGrid
          news={allNews}
          currentPage={1}
          totalPages={Math.ceil(allNews.length / 12)}
          totalResults={allNews.length}
        />
      </div>
    </>
  );
}
