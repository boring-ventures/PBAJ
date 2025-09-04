import { Suspense } from "react";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import ResourcesHero from "@/components/views/resources/ResourcesHero";
import ResourcesFilter from "@/components/views/resources/ResourcesFilter";
import ResourcesGrid from "@/components/views/resources/ResourcesGrid";
import FeaturedResources from "@/components/views/resources/FeaturedResources";
import ResourcesSearch from "@/components/views/resources/ResourcesSearch";
import { ResourcesService } from "@/lib/resources/resources-utils";

export default async function ResourcesPage() {
  // For now, default to Spanish locale
  // In a full implementation, this would come from the URL or context
  const locale = "es";

  // Fetch resources data
  const [featuredResources, allResources] = await Promise.all([
    ResourcesService.getFeaturedResources(locale, 3),
    ResourcesService.getPublicResources(locale, 50),
  ]);

  // Convert dates to strings for components
  const featuredResourcesFormatted = featuredResources.map(item => ({
    ...item,
    createdAt: item.createdAt?.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
    uploader: {
      ...item.uploader,
      firstName: item.uploader.firstName ?? undefined,
      lastName: item.uploader.lastName ?? undefined,
    },
  }));

  const allResourcesFormatted = allResources.map(item => ({
    ...item,
    createdAt: item.createdAt?.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
    uploader: {
      ...item.uploader,
      firstName: item.uploader.firstName ?? undefined,
      lastName: item.uploader.lastName ?? undefined,
    },
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <ResourcesHero />

        <section className="py-16">
          <div className="container mx-auto px-4">
            {/* Featured Resources Section */}
            <FeaturedResources resources={featuredResourcesFormatted} />

            {/* All Resources Section */}
            <div className="mt-16">
              {/* Title moved above search */}
              <div className="flex items-center mb-8">
                <h2
                  className="text-6xl font-bold"
                  style={{ color: "#000000" }}
                >
                  {locale === "es" ? "Todos los Recursos" : "All Resources"}
                </h2>
              </div>

              {/* Search and Filter Section */}
              <div className="mb-12">
                <Suspense fallback={<div>Loading search...</div>}>
                  <ResourcesSearch />
                </Suspense>
                <div className="mt-6">
                  <Suspense fallback={<div>Loading filters...</div>}>
                    <ResourcesFilter categories={[]} />
                  </Suspense>
                </div>
              </div>

              <ResourcesGrid
                resources={allResourcesFormatted}
                currentPage={1}
                totalPages={Math.ceil(allResourcesFormatted.length / 12)}
                totalResults={allResourcesFormatted.length}
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
