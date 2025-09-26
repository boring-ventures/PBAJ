/**
 * Simple script to test database connection and data fetching
 */

const { PrismaClient } = require("@prisma/client");

async function testDatabaseConnection() {
  console.log("🔍 Testing database connection and data fetching...\n");

  const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

  const testResults = {
    connection: false,
    programs: { success: false, count: 0, error: null },
    news: { success: false, count: 0, error: null },
    profiles: { success: false, count: 0, error: null },
    library: { success: false, count: 0, error: null },
    media: { success: false, count: 0, error: null },
    resources: { success: false, count: 0, error: null },
  };

  try {
    // Test database connection
    console.log("1. Testing database connection...");
    await prisma.$connect();
    testResults.connection = true;
    console.log("✅ Database connection successful\n");

    // Test Programs table
    console.log("2. Testing Programs table...");
    try {
      const programs = await prisma.program.findMany({
        where: { status: "ACTIVE" },
        take: 5,
        select: {
          id: true,
          titleEs: true,
          titleEn: true,
          status: true,
          featured: true,
          type: true,
        },
      });
      testResults.programs.success = true;
      testResults.programs.count = programs.length;
      console.log(`✅ Programs: Found ${programs.length} active programs`);
      if (programs.length > 0) {
        const sample = programs[0];
        console.log(
          `   - Sample: ${sample.titleEs}, Status: ${sample.status}, Type: ${sample.type}`
        );
      }
    } catch (error) {
      testResults.programs.error = error.message;
      console.log(`❌ Programs Error: ${error.message}`);
    }

    // Test News table
    console.log("\n3. Testing News table...");
    try {
      // Test published news query
      const news = await prisma.news.findMany({
        where: { status: "PUBLISHED" },
        take: 5,
        select: {
          id: true,
          titleEs: true,
          titleEn: true,
          status: true,
          category: true,
          featured: true,
          publishDate: true,
          author: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      // Test featured news query like NewsService.getFeaturedNews()
      const featuredNews = await prisma.news.findMany({
        where: {
          status: "PUBLISHED",
          featured: true,
          publishDate: {
            lte: new Date(),
          },
        },
        take: 3,
        select: {
          id: true,
          titleEs: true,
          titleEn: true,
          featured: true,
          publishDate: true,
        },
      });

      testResults.news.success = true;
      testResults.news.count = news.length;
      console.log(`✅ News: Found ${news.length} published news articles`);
      console.log(
        `✅ Featured News: Found ${featuredNews.length} featured articles`
      );

      if (news.length > 0) {
        const sample = news[0];
        const title = sample.titleEs || sample.titleEn || "Unnamed";
        console.log(
          `   - Sample: ${title}, Status: ${sample.status}, Category: ${sample.category}`
        );
        console.log(`   - Featured: ${sample.featured ? "Yes" : "No"}`);

        if (sample.author) {
          const authorName =
            `${sample.author.firstName || ""} ${sample.author.lastName || ""}`.trim() ||
            "Unknown";
          console.log(`   - Author: ${authorName}`);
        }
        if (sample.publishDate) {
          console.log(
            `   - Publish Date: ${sample.publishDate.toISOString().split("T")[0]}`
          );
        }
      }

      if (featuredNews.length > 0) {
        console.log(
          `   - Featured News Sample: ${featuredNews[0].titleEs || featuredNews[0].titleEn || "Unnamed"}`
        );
      }
    } catch (error) {
      testResults.news.error = error.message;
      console.log(`❌ News Error: ${error.message}`);
    }

    // Test Profiles table
    console.log("\n4. Testing Profiles table...");
    try {
      const profiles = await prisma.profile.findMany({
        take: 5,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      });
      testResults.profiles.success = true;
      testResults.profiles.count = profiles.length;
      console.log(`✅ Profiles: Found ${profiles.length} profiles`);
      if (profiles.length > 0) {
        const sample = profiles[0];
        console.log(
          `   - Sample: ${sample.firstName} ${sample.lastName}, Role: ${sample.role}`
        );
      }
    } catch (error) {
      testResults.profiles.error = error.message;
      console.log(`❌ Profiles Error: ${error.message}`);
    }

    // Test Digital Library table
    console.log("\n5. Testing Digital Library table...");
    try {
      const library = await prisma.digitalLibrary.findMany({
        where: { status: "PUBLISHED" },
        take: 5,
        select: {
          id: true,
          titleEs: true,
          titleEn: true,
          type: true,
          status: true,
          fileName: true,
        },
      });
      testResults.library.success = true;
      testResults.library.count = library.length;
      console.log(`✅ Digital Library: Found ${library.length} publications`);
      if (library.length > 0) {
        const sample = library[0];
        console.log(
          `   - Sample: ${sample.titleEs}, Type: ${sample.type}, Status: ${sample.status}`
        );
      }
    } catch (error) {
      testResults.library.error = error.message;
      console.log(`❌ Digital Library Error: ${error.message}`);
    }

    // Test Media Assets table
    console.log("\n6. Testing Media Assets table...");
    try {
      const media = await prisma.mediaAsset.findMany({
        take: 5,
        select: {
          id: true,
          fileName: true,
          type: true,
          category: true,
          isPublic: true,
        },
      });
      testResults.media.success = true;
      testResults.media.count = media.length;
      console.log(`✅ Media Assets: Found ${media.length} media assets`);
      if (media.length > 0) {
        const sample = media[0];
        console.log(
          `   - Sample: ${sample.fileName}, Type: ${sample.type}, Is Public: ${sample.isPublic}`
        );
      }
    } catch (error) {
      testResults.media.error = error.message;
      console.log(`❌ Media Assets Error: ${error.message}`);
    }

    // Test Resources functionality (Media Assets filtered for public resources)
    console.log("\n7. Testing Resources table...");
    try {
      const resources = await prisma.mediaAsset.findMany({
        where: { isPublic: true },
        take: 10,
        include: {
          uploader: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });
      testResults.resources.success = true;
      testResults.resources.count = resources.length;
      console.log(`✅ Resources: Found ${resources.length} public resources`);
      if (resources.length > 0) {
        const sample = resources[0];
        console.log(
          `   - Sample: ${sample.originalName || sample.fileName}, Type: ${sample.type}, Category: ${sample.category}, Downloads: ${sample.downloadCount || 0}`
        );
        console.log(
          `   - Uploader: ${
            sample.uploader?.firstName
              ? `${sample.uploader.firstName} ${sample.uploader.lastName || ""}`.trim()
              : "Unknown"
          }`
        );
      }
    } catch (error) {
      testResults.resources.error = error.message;
      console.log(`❌ Resources Error: ${error.message}`);
    }
  } catch (error) {
    console.log(`❌ Database connection failed: ${error.message}`);
    return false;
  } finally {
    await prisma.$disconnect();
  }

  // Print summary
  console.log("\n📊 Test Summary:");
  console.log("================");

  const allTests = [
    { name: "Connection", result: testResults.connection },
    { name: "Programs", result: testResults.programs.success },
    { name: "News", result: testResults.news.success },
    { name: "Profiles", result: testResults.profiles.success },
    { name: "Digital Library", result: testResults.library.success },
    { name: "Media Assets", result: testResults.media.success },
    { name: "Resources", result: testResults.resources.success },
  ];

  allTests.forEach((test) => {
    const status = test.result ? "✅" : "❌";
    console.log(`${status} ${test.name}`);
  });

  const failedTests = allTests.filter((test) => !test.result);

  if (failedTests.length === 0) {
    console.log("\n🎉 All data fetching tests passed!");
  } else {
    console.log(`\n⚠️ ${failedTests.length} test(s) failed`);
  }

  return failedTests.length === 0;
}

// Run the test if this script is executed directly
if (require.main === module) {
  testDatabaseConnection()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error("Fatal error:", error);
      process.exit(1);
    });
}

module.exports = { testDatabaseConnection };
