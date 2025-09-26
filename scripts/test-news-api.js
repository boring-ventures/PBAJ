/**
 * News API Testing Script
 * Verifies the news page data fetching functionality
 */

const { PrismaClient } = require("@prisma/client");

async function testNewsAPI() {
  console.log("📰 Testing News API functionality...\n");

  const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

  const newsTests = {
    publishedNews: { success: false, count: 0, error: null },
    featuredNews: { success: false, count: 0, error: null },
    newsAPIEquivalent: { success: false, count: 0, error: null },
    localization: { success: false, count: 0, error: null },
  };

  try {
    // Test 1: Published News (NewsService.getPublishedNews)
    console.log(
      "1. Testing published news query (NewsService.getPublishedNews)..."
    );
    try {
      const publishedNews = await prisma.news.findMany({
        where: {
          status: "PUBLISHED",
          publishDate: {
            lte: new Date(),
          },
        },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          publishDate: "desc",
        },
        take: 50,
      });

      newsTests.publishedNews = { success: true, count: publishedNews.length };
      console.log(`✅ Found ${publishedNews.length} published news articles`);

      if (publishedNews.length > 0) {
        const sample = publishedNews[0];
        console.log(`   - Sample: ${sample.title || "No title"}`);
        console.log(
          `   - Author: ${sample.author.firstName || "Unknown"} ${sample.author.lastName || ""}`
        );
        console.log(
          `   - Publish Date: ${sample.publishDate?.toISOString().split("T")[0] || "N/A"}`
        );
      }
    } catch (error) {
      newsTests.publishedNews = { success: false, error: error.message };
      console.log(`❌ Published News Error: ${error.message}`);
    }

    // Test 2: Featured News (NewsService.getFeaturedNews)
    console.log(
      "\n2. Testing featured news query (NewsService.getFeaturedNews)..."
    );
    try {
      const featuredNews = await prisma.news.findMany({
        where: {
          status: "PUBLISHED",
          featured: true,
          publishDate: {
            lte: new Date(),
          },
        },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          publishDate: "desc",
        },
        take: 3,
      });

      newsTests.featuredNews = { success: true, count: featuredNews.length };
      console.log(`✅ Found ${featuredNews.length} featured news articles`);

      if (featuredNews.length > 0) {
        const sample = featuredNews[0];
        console.log(`   - Sample: ${sample.titleEs || "No Spanish title"}`);
        console.log(`   - Featured: ${sample.featured}`);
        console.log(`   - Category: ${sample.category}`);
      }
    } catch (error) {
      newsTests.featuredNews = { success: false, error: error.message };
      console.log(`❌ Featured News Error: ${error.message}`);
    }

    // Test 3: API Endpoint equivalent (news API route)
    console.log("\n3. Testing news API endpoint equivalent...");
    try {
      const apiNews = await prisma.news.findMany({
        where: {
          status: "PUBLISHED",
        },
        orderBy: [
          { featured: "desc" },
          { publishDate: "desc" },
          { createdAt: "desc" },
        ],
        take: 20,
        select: {
          id: true,
          titleEs: true,
          titleEn: true,
          contentEs: true,
          contentEn: true,
          excerptEs: true,
          excerptEn: true,
          category: true,
          featured: true,
          featuredImageUrl: true,
          publishDate: true,
          createdAt: true,
          author: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      newsTests.newsAPIEquivalent = { success: true, count: apiNews.length };
      console.log(
        `✅ Found ${apiNews.length} news articles via API equivalent`
      );

      if (apiNews.length > 0) {
        const sample = apiNews[0];
        console.log(
          `   - Sample: ${sample.titleEs || sample.titleEn || "Unnamed"}`
        );
        console.log(`   - Category: ${sample.category}`);
        console.log(`   - Has Content: ${sample.contentEs ? "Yes" : "No"}`);
        console.log(
          `   - Has Image: ${sample.featuredImageUrl ? "Yes" : "No"}`
        );
      }
    } catch (error) {
      newsTests.newsAPIEquivalent = { success: false, error: error.message };
      console.log(`❌ News API Error: ${error.message}`);
    }

    // Test 4: Localization functionality
    console.log("\n4. Testing multilingual content availability...");
    try {
      const allNews = await prisma.news.findMany({
        where: { status: "PUBLISHED" },
        select: {
          id: true,
          title: true,
          content: true,
          excerpt: true,
        },
        take: 10,
      });

      const hasContent = allNews.filter(
        (n) => n.title && n.title.trim() && n.content && n.content.trim()
      ).length;
      const hasTitle = allNews.filter((n) => n.title && n.title.trim()).length;
      const hasContentText = allNews.filter(
        (n) => n.content && n.content.trim()
      ).length;
      const hasExcerpt = allNews.filter(
        (n) => n.excerpt && n.excerpt.trim()
      ).length;

      newsTests.localization = {
        success: true,
        count: allNews.length,
        hasTitles: hasTitle,
        hasContents: hasContentText,
        hasContents: hasContentText,
      };

      console.log(`✅ Content Test Results:`);
      console.log(`   - Articles with titles: ${hasTitle}`);
      console.log(`   - Articles with content: ${hasContentText}`);
      console.log(`   - Articles with both: ${hasContent}`);
      console.log(`   - Articles with excerpts: ${hasExcerpt}`);
    } catch (error) {
      newsTests.localization = { success: false, error: error.message };
      console.log(`❌ Localization Error: ${error.message}`);
    }

    // Summary
    console.log("\n📊 News API Test Summary:");
    console.log(
      `Published News Test: ${newsTests.publishedNews.success ? "✅ PASS" : "❌ FAIL"}`
    );
    console.log(
      `Featured News Test: ${newsTests.featuredNews.success ? "✅ PASS" : "❌ FAIL"}`
    );
    console.log(
      `API Equivalent Test: ${newsTests.newsAPIEquivalent.success ? "✅ PASS" : "❌ FAIL"}`
    );
    console.log(
      `Localization Test: ${newsTests.localization.success ? "✅ PASS" : "❌ FAIL"}`
    );

    const allPassed = Object.values(newsTests).every(
      (test) => test.success !== false
    );

    if (allPassed) {
      console.log("\n🎉 All news data fetching tests passed successfully!");
    } else {
      console.log("\n⚠️ Some tests failed - check error messages above.");
    }
  } catch (error) {
    console.error("❌ Test suite error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testNewsAPI().catch(console.error);
