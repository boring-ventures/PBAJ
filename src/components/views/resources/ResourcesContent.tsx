"use client";

import { useState, useEffect, Suspense } from "react";
import FeaturedResources from "@/components/views/resources/FeaturedResources";
import ResourcesGrid from "@/components/views/resources/ResourcesGrid";
import ResourcesSearch from "@/components/views/resources/ResourcesSearch";
import ResourcesFilter from "@/components/views/resources/ResourcesFilter";

interface ResourcesContentProps {
  locale: "es" | "en";
  t: (key: string) => string;
}

export default function ResourcesContent({ locale, t }: ResourcesContentProps) {
  const [featuredResources, setFeaturedResources] = useState<any[]>([]);
  const [allResources, setAllResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const [featuredResponse, allResponse] = await Promise.all([
          fetch(`/api/public/resources?featured=true&limit=3&locale=${locale}`),
          fetch(`/api/public/resources?limit=50&locale=${locale}`)
        ]);

        if (featuredResponse.ok && allResponse.ok) {
          const featuredData = await featuredResponse.json();
          const allData = await allResponse.json();

          // Convert dates to strings for components
          const featuredFormatted = featuredData.map((item: any) => ({
            ...item,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            uploader: {
              ...item.uploader,
              firstName: item.uploader.firstName ?? undefined,
              lastName: item.uploader.lastName ?? undefined,
            },
          }));

          const allFormatted = allData.map((item: any) => ({
            ...item,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            uploader: {
              ...item.uploader,
              firstName: item.uploader.firstName ?? undefined,
              lastName: item.uploader.lastName ?? undefined,
            },
          }));

          setFeaturedResources(featuredFormatted);
          setAllResources(allFormatted);
        } else {
          console.error("Failed to fetch resources");
        }
      } catch (error) {
        console.error("Error loading resources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
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
      {/* Featured Resources Section */}
      <FeaturedResources resources={featuredResources} />

      {/* All Resources Section */}
      <div className="mt-16">
        {/* Title */}
        <div className="flex items-center mb-8">
          <h2
            className="text-6xl font-bold"
            style={{ color: "#000000" }}
          >
            {t("pages.resources.allResources")}
          </h2>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-12">
          <Suspense fallback={<div>{t("common.loading")}</div>}>
            <ResourcesSearch />
          </Suspense>
          <div className="mt-6">
            <Suspense fallback={<div>{t("common.loading")}</div>}>
              <ResourcesFilter categories={[]} />
            </Suspense>
          </div>
        </div>

        <ResourcesGrid
          resources={allResources}
          currentPage={1}
          totalPages={Math.ceil(allResources.length / 12)}
          totalResults={allResources.length}
        />
      </div>
    </>
  );
}