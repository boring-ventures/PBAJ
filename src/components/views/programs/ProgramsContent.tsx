"use client";

import { useState, useEffect, Suspense } from "react";
import FeaturedPrograms from "@/components/views/programs/FeaturedPrograms";
import AllPrograms from "@/components/views/programs/AllPrograms";
import ProgramsSearch from "@/components/views/programs/ProgramsSearch";
import ProgramsFilter from "@/components/views/programs/ProgramsFilter";

interface ProgramsContentProps {
  locale: "es" | "en";
  t: (key: string) => string;
}

export default function ProgramsContent({ locale, t }: ProgramsContentProps) {
  const [featuredPrograms, setFeaturedPrograms] = useState<any[]>([]);
  const [allPrograms, setAllPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      try {
        const [featuredResponse, allResponse] = await Promise.all([
          fetch(`/api/public/programs?featured=true&limit=3&locale=${locale}`),
          fetch(`/api/public/programs?limit=50&locale=${locale}`)
        ]);

        if (featuredResponse.ok && allResponse.ok) {
          const featuredData = await featuredResponse.json();
          const allData = await allResponse.json();

          setFeaturedPrograms(featuredData);
          setAllPrograms(allData);
        } else {
          console.error("Failed to fetch programs");
        }
      } catch (error) {
        console.error("Error loading programs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
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
      {/* Featured Programs Section */}
      <FeaturedPrograms programs={featuredPrograms} />

      {/* All Programs Section */}
      <div className="mt-16">
        {/* Title */}
        <div className="flex items-center mb-8">
          <h2
            className="text-6xl font-bold"
            style={{ color: "#000000" }}
          >
            {t("pages.programs.allPrograms")}
          </h2>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-12">
          <Suspense fallback={<div>{t("common.loading")}</div>}>
            <ProgramsSearch />
          </Suspense>
          <div className="mt-6">
            <Suspense fallback={<div>{t("common.loading")}</div>}>
              <ProgramsFilter categories={[]} />
            </Suspense>
          </div>
        </div>

        <AllPrograms programs={allPrograms} />
      </div>
    </>
  );
}