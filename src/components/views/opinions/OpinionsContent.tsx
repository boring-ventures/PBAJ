"use client";

import { useState, useEffect, Suspense } from "react";
import FeaturedOpinions from "@/components/views/opinions/FeaturedOpinions";
import OpinionsGrid from "@/components/views/opinions/OpinionsGrid";
import OpinionsSearch from "@/components/views/opinions/OpinionsSearch";
import OpinionsFilter from "@/components/views/opinions/OpinionsFilter";

interface OpinionsContentProps {
  locale: "es" | "en";
  t: (key: string) => string;
}

export default function OpinionsContent({ locale, t }: OpinionsContentProps) {
  const [featuredOpinions, setFeaturedOpinions] = useState<any[]>([]);
  const [allOpinions, setAllOpinions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpinions = async () => {
      setLoading(true);
      try {
        const [featuredResponse, allResponse] = await Promise.all([
          fetch(`/api/public/opinions?featured=true&limit=3&locale=${locale}`),
          fetch(`/api/public/opinions?limit=50&locale=${locale}`),
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

          setFeaturedOpinions(featuredFormatted);
          setAllOpinions(allFormatted);
        } else {
          console.error("Failed to fetch opinions");
        }
      } catch (error) {
        console.error("Error loading opinions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpinions();
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
      {/* Featured Opinions Section */}
      <FeaturedOpinions opinions={featuredOpinions} />

      {/* All Opinions Section */}
      <div className="mt-16">
        {/* Title */}
        <div className="flex items-center mb-8">
          <h2 className="text-6xl font-bold" style={{ color: "#000000" }}>
            {t("pages.opinions.allOpinions")}
          </h2>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-12">
          <Suspense fallback={<div>{t("common.loading")}</div>}>
            <OpinionsSearch />
          </Suspense>
          <div className="mt-6">
            <Suspense fallback={<div>{t("common.loading")}</div>}>
              <OpinionsFilter categories={[]} />
            </Suspense>
          </div>
        </div>

        <OpinionsGrid
          opinions={allOpinions}
          currentPage={1}
          totalPages={Math.ceil(allOpinions.length / 12)}
          totalResults={allOpinions.length}
        />
      </div>
    </>
  );
}
