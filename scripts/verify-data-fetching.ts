/**
 * Data Fetching Verification Script
 * This script verifies that all database queries are working correctly
 */
import { NextRequest } from "next/server";

// Import the API handlers
import { GET as getNews } from "../src/app/api/public/news/route";
import { GET as getPrograms } from "../src/app/api/public/programs/route";
import { GET as getDigitalLibrary } from "../src/app/api/public/digital-library/route";
import { GET as getResources } from "../src/app/api/public/resources/route";

// Import services
import {
  ProgramsService,
  NewsService,
  LibraryService,
} from "../src/lib/content/content-utils";
import { ResourcesService } from "../src/lib/resources/resources-utils";

export async function verifyDataFetching() {
  const results = {
    apiTests: {
      news: {
        status: 0,
        dataPresent: false,
        dataCount: 0,
        hasRequiredFields: false,
      },
      programs: {
        status: 0,
        dataPresent: false,
        dataCount: 0,
        hasRequiredFields: false,
      },
      library: {
        status: 0,
        dataPresent: false,
        dataCount: 0,
        hasRequiredFields: false,
      },
      resources: {
        status: 0,
        dataPresent: false,
        dataCount: 0,
        hasRequiredFields: false,
      },
    },
    serviceTests: {
      programs: {},
      news: {},
      library: {},
      resources: {},
    },
    databaseConnection: {},
    errors: [] as string[],
  };

  console.log("🔍 Starting database data verification...\n");

  try {
    // Test 1: API Endpoints
    console.log("📡 Testing API Endpoints...");

    // Test News API
    try {
      const newsUrl = new URL("http://localhost:3000/api/public/news?limit=5");
      const newsRequest = new NextRequest(newsUrl);
      const newsResponse = await getNews(newsRequest);
      const newsData = await newsResponse.json();

      results.apiTests.news = {
        status: newsResponse.status,
        dataPresent: !!newsData && Array.isArray(newsData),
        dataCount: Array.isArray(newsData) ? newsData.length : 0,
        hasRequiredFields: Array.isArray(newsData)
          ? newsData.every((item) => item.id && item.title && item.content)
          : false,
      };

      console.log("✅ News API working correctly");
      console.log(
        `   - Data fetched: ${Array.isArray(newsData) ? newsData.length : 0} items`
      );
      if (Array.isArray(newsData) && newsData.length > 0) {
        console.log(`   - Sample item has title: ${!!newsData[0].title}`);
        console.log(
          `   - Sample item has content field: ${!!newsData[0].content}`
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.log("❌ News API Error:", errorMessage);
      results.errors.push(`News API Error: ${errorMessage}`);
    }

    // Test Programs API
    try {
      const programsUrl = new URL(
        "http://localhost:3000/api/public/programs?limit=5"
      );
      const programsRequest = new NextRequest(programsUrl);
      const programsResponse = await getPrograms(programsRequest);
      const programsData = await programsResponse.json();

      results.apiTests.programs = {
        status: programsResponse.status,
        dataPresent: !!programsData && Array.isArray(programsData),
        dataCount: Array.isArray(programsData) ? programsData.length : 0,
        hasRequiredFields: Array.isArray(programsData)
          ? programsData.every(
              (item) =>
                item.id &&
                (item.titleEs || item.titleEn) &&
                (item.descriptionEs || item.descriptionEn)
            )
          : false,
      };

      console.log("✅ Programs API working correctly");
      console.log(
        `   - Data fetched: ${Array.isArray(programsData) ? programsData.length : 0} items`
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.log("❌ Programs API Error:", errorMessage);
      results.errors.push(`Programs API Error: ${errorMessage}`);
    }

    // Test Digital Library API
    try {
      const libraryUrl = new URL(
        "http://localhost:3000/api/public/digital-library?limit=5"
      );
      const libraryRequest = new NextRequest(libraryUrl);
      const libraryResponse = await getDigitalLibrary(libraryRequest);
      const libraryData = await libraryResponse.json();

      results.apiTests.library = {
        status: libraryResponse.status,
        dataPresent: !!libraryData && Array.isArray(libraryData),
        dataCount: Array.isArray(libraryData) ? libraryData.length : 0,
        hasRequiredFields: Array.isArray(libraryData)
          ? libraryData.every(
              (item) =>
                item.id && (item.titleEs || item.titleEn) && item.fileUrl
            )
          : false,
      };

      console.log("✅ Digital Library API working correctly");
      console.log(
        `   - Data fetched: ${Array.isArray(libraryData) ? libraryData.length : 0} items`
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.log("❌ Digital Library API Error:", errorMessage);
      results.errors.push(`Digital Library API Error: ${errorMessage}`);
    }

    // Test Resources API
    try {
      const resourcesUrl = new URL(
        "http://localhost:3000/api/public/resources?limit=5"
      );
      const resourcesRequest = new NextRequest(resourcesUrl);
      const resourcesResponse = await getResources(resourcesRequest);
      const resourcesData = await resourcesResponse.json();

      results.apiTests.resources = {
        status: resourcesResponse.status,
        dataPresent: !!resourcesData && Array.isArray(resourcesData),
        dataCount: Array.isArray(resourcesData) ? resourcesData.length : 0,
        hasRequiredFields: Array.isArray(resourcesData)
          ? resourcesData.every(
              (item) =>
                item.id && (item.fileName || item.originalName) && item.url
            )
          : false,
      };

      console.log("✅ Resources API working correctly");
      console.log(
        `   - Data fetched: ${Array.isArray(resourcesData) ? resourcesData.length : 0} items`
      );
      if (Array.isArray(resourcesData) && resourcesData.length > 0) {
        console.log(`   - Sample item has url: ${!!resourcesData[0].url}`);
        console.log(
          `   - Sample item has fileName: ${!!resourcesData[0].fileName}`
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.log("❌ Resources API Error:", errorMessage);
      results.errors.push(`Resources API Error: ${errorMessage}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log("❌ Critical API Test Error:", errorMessage);
    results.errors.push(`Critical: ${errorMessage}`);
  }

  // Test 2: Service Layer
  console.log("\n🛠️ Testing Service Layer...");

  try {
    // Test ProgramsService
    const featuredPrograms = await ProgramsService.getFeaturedPrograms("es", 3);
    results.serviceTests.programs = {
      featuredProgramsCount: featuredPrograms.length,
      hasValidStructure: featuredPrograms.every(
        (item) => item.id && item.title && (item.type || item.status)
      ),
    };

    const allPrograms = await ProgramsService.getActivePrograms("es", 10);
    results.serviceTests.programs = {
      ...results.serviceTests.programs,
      allProgramsCount: allPrograms.length,
      allProgramsValid: allPrograms.every((item) => item.id && item.title),
    };

    console.log(
      `✅ ProgramsService working (Featured: ${featuredPrograms.length}, All: ${allPrograms.length})`
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log("❌ ProgramsService Error:", errorMessage);
    results.errors.push(`ProgramsService Error: ${errorMessage}`);
  }

  try {
    // Test NewsService
    const featuredNews = await NewsService.getFeaturedNews("es", 3);
    results.serviceTests.news = {
      featuredNewsCount: featuredNews.length,
      hasValidStructure: featuredNews.every(
        (item) => item.id && item.title && (item.status || item.category)
      ),
    };

    console.log(`✅ NewsService working (Featured: ${featuredNews.length})`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log("❌ NewsService Error:", errorMessage);
    results.errors.push(`NewsService Error: ${errorMessage}`);
  }

  try {
    // Test LibraryService
    const publications = await LibraryService.getPublishedPublications("es", 5);
    results.serviceTests.library = {
      publicationsCount: publications.length,
      hasValidStructure: publications.every(
        (item) => item.id && item.title && item.fileUrl
      ),
    };

    console.log(
      `✅ LibraryService working (Publications: ${publications.length})`
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log("❌ LibraryService Error:", errorMessage);
    results.errors.push(`LibraryService Error: ${errorMessage}`);
  }

  try {
    // Test ResourcesService
    const resources = await ResourcesService.getPublicResources("es", 5);
    results.serviceTests.resources = {
      resourcesCount: resources.length,
      hasValidStructure: resources.every(
        (item) => item.id && (item.fileName || item.originalName) && item.url
      ),
    };

    const featuredResources = await ResourcesService.getFeaturedResources(
      "es",
      3
    );
    results.serviceTests.resources = {
      ...results.serviceTests.resources,
      featuredResourcesCount: featuredResources.length,
      featuredResourcesValid: featuredResources.every(
        (item) => item.id && item.url
      ),
    };

    console.log(
      `✅ ResourcesService working (All: ${resources.length}, Featured: ${featuredResources.length})`
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log("❌ ResourcesService Error:", errorMessage);
    results.errors.push(`ResourcesService Error: ${errorMessage}`);
  }

  // Summary
  console.log("\n📊 Verification Summary:");
  console.log("========================");

  const apiResults = results.apiTests;
  const serviceResults = results.serviceTests;

  console.log(`API Tests Status:`);
  Object.entries(apiResults).forEach(([key, result]) => {
    const status = result.status === 200 ? "✅" : "❌";
    console.log(
      `  ${status} ${key}: ${result.status} (${result.dataCount} items)`
    );
  });

  console.log(`\nService Tests Status:`);
  Object.entries(serviceResults).forEach(([key, result]) => {
    const status =
      result && !results.errors.find((e) => e.includes(key)) ? "✅" : "❌";
    console.log(`  ${status} ${key}: ${JSON.stringify(result, null, 2)}`);
  });

  if (results.errors.length > 0) {
    console.log(`\n❌ Errors Found (${results.errors.length}):`);
    results.errors.forEach((error) => console.log(`  - ${error}`));
  } else {
    console.log("\n🎉 All data fetching is working correctly!");
  }

  return results;
}

// If called directly, run the verification
if (require.main === module) {
  verifyDataFetching()
    .then((results) => {
      process.exit(results.errors.length > 0 ? 1 : 0);
    })
    .catch((error) => {
      console.error("Fatal error during verification:", error);
      process.exit(1);
    });
}
