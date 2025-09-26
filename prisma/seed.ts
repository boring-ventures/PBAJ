import {
  PrismaClient,
  UserRole,
  NewsCategory,
  NewsStatus,
  ProgramType,
  ProgramStatus,
  PublicationType,
  PublicationStatus,
  MediaType,
  MediaCategory,
  ContentType,
  ScheduleStatus,
  ScheduleAction,
  ScheduledContentType,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clean existing data (except profiles - we'll keep those)
  console.log("🧹 Cleaning existing data...");
  await prisma.contentSchedule.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.mediaAsset.deleteMany();
  await prisma.digitalLibrary.deleteMany();
  await prisma.program.deleteMany();
  await prisma.news.deleteMany();

  // Get existing admin profile
  console.log("👤 Finding admin profile...");
  const adminProfile = await prisma.profile.findFirst({
    where: { role: UserRole.SUPERADMIN },
  });

  if (!adminProfile) {
    console.log("❌ No admin profile found. Please create one first.");
    return;
  }

  const authorId = adminProfile.id;

  // Create Categories (using Spanish as default, will be translated on frontend)
  console.log("📂 Creating categories...");
  const advocacyCategory = await prisma.category.create({
    data: {
      name: "Defensa y Justicia",
      description: "Organizaciones e iniciativas dedicadas a la defensa de derechos humanos",
      slug: "defensa-justicia",
      contentType: ContentType.PROGRAM,
      color: "#3B82F6",
      iconName: "shield-check",
      isActive: true,
      sortOrder: 1,
      createdById: authorId,
    },
  });

  const researchCategory = await prisma.category.create({
    data: {
      name: "Investigación e Información",
      description: "Estudios, reportes y análisis sobre la situación en Bolivia",
      slug: "investigacion-informacion",
      contentType: ContentType.PUBLICATION,
      color: "#8B5CF6",
      iconName: "book-open",
      isActive: true,
      sortOrder: 2,
      createdById: authorId,
    },
  });

  const educationCategory = await prisma.category.create({
    data: {
      name: "Educación y Capacitación",
      description: "Programas educativos y de capacitación ciudadana",
      slug: "educacion-capacitacion",
      contentType: ContentType.PROGRAM,
      color: "#10B981",
      iconName: "graduation-cap",
      isActive: true,
      sortOrder: 3,
      createdById: authorId,
    },
  });

  // Create Tags (using Spanish as default)
  console.log("🏷️  Creating tags...");
  const democracyTag = await prisma.tag.create({
    data: {
      name: "Democracia",
      slug: "democracia",
      contentType: ContentType.NEWS,
      color: "#8B5CF6",
      usageCount: 0,
      isActive: true,
      createdById: authorId,
    },
  });

  const humanRightsTag = await prisma.tag.create({
    data: {
      name: "Derechos Humanos",
      slug: "derechos-humanos",
      contentType: ContentType.NEWS,
      color: "#EF4444",
      usageCount: 0,
      isActive: true,
      createdById: authorId,
    },
  });

  const corruptionTag = await prisma.tag.create({
    data: {
      name: "Corrupción",
      slug: "corrupcion",
      contentType: ContentType.NEWS,
      color: "#F59E0B",
      usageCount: 0,
      isActive: true,
      createdById: authorId,
    },
  });

  const governanceTag = await prisma.tag.create({
    data: {
      name: "Gobernanza",
      slug: "gobernanza",
      contentType: ContentType.PROGRAM,
      color: "#06B6D4",
      usageCount: 0,
      isActive: true,
      createdById: authorId,
    },
  });

  // Create News Articles (using Spanish content, will be auto-translated)
  console.log("📰 Creating news articles...");
  const newsArticles = await Promise.all([
    prisma.news.create({
      data: {
        title: "Nueva Ley de Transparencia en Bolivia: Un Paso Hacia la Democracia",
        content: "La reciente aprobación de la nueva ley de transparencia en Bolivia marca un hito crucial en la lucha contra la corrupción y el fortalecimiento de los valores democráticos. Esta legislación representa un compromiso serio del gobierno para garantizar el acceso público a la información gubernamental.\n\nLa ley incluye disposiciones para la transparencia en contrataciones públicas, obligaciones de reporte para funcionarios públicos, y mecanismos claros para la participación ciudadana en la toma de decisiones. Los ciudadanos ahora tendrán herramientas más robustas para ejercer su derecho a la información y supervisar el uso de recursos públicos.\n\nEsta iniciativa forma parte de una serie de reformas que buscan consolidar las instituciones democráticas y construir una sociedad más justa e inclusiva.",
        excerpt: "La nueva ley de transparencia aprobada en Bolivia marca un hito en la lucha contra la corrupción y el fortalecimiento democrático.",
        category: NewsCategory.ANNOUNCEMENT,
        status: NewsStatus.PUBLISHED,
        featured: true,
        featuredImageUrl: "/images/transparency-law.jpg",
        publishDate: new Date("2024-01-15"),
        authorId: authorId,
      },
    }),
    prisma.news.create({
      data: {
        title: "Plan Estratégico 2024: Construyendo Una Sociedad Más Justa",
        content: "El nuevo plan estratégico de la Plataforma Boliviana de Actores por la Justicia establece un marco de acción integral para promover la justicia, la transparencia y la participación ciudadana en Bolivia.\n\nLos pilares fundamentales de este plan incluyen:\n\n1. **Fortalecimiento de la transparencia gubernamental**\n2. **Promoción de la participación ciudadana en procesos democráticos**\n3. **Defensa de los derechos humanos fundamentales**\n4. **Fortalecimiento de organizaciones de la sociedad civil**\n5. **Investigación y denuncia de casos de corrupción**\n\nEste plan representa nuestra visión de una Bolivia más democrática, transparente y participativa.",
        excerpt: "La Plataforma presenta un plan estratégico integral para promover la justicia y la transparencia en Bolivia durante 2024.",
        category: NewsCategory.UPDATE,
        status: NewsStatus.PUBLISHED,
        featured: false,
        featuredImageUrl: "/images/strategic-plan.jpg",
        publishDate: new Date("2024-02-01"),
        authorId: authorId,
      },
    }),
    prisma.news.create({
      data: {
        title: "Seminario Internacional: Democracia y Transparencia",
        content: 'El próximo 15 de marzo, la Plataforma junto con organizaciones internacionales, realizará el seminario "Democracia y Transparencia: Experiencias de América Latina" en La Paz.\n\nEste evento contará con la participación de expertos internacionales y nacionales en temas de transparencia, lucha contra la corrupción y fortalecimiento democrático.\n\n**Los participantes incluyen:**\n- Dra. María González (España) - Experta en políticas de transparencia\n- Dr. Carlos Méndez (Uruguay) - Especialista en reformas institucionales\n- Lic. Ana Fernández (Bolivia) - Defensora de derechos humanos\n\nEste seminario es una oportunidad única para intercambiar experiencias y fortalecer nuestras estrategias de promoción de derechos.',
        excerpt: "La Plataforma organiza un seminario internacional sobre democracia y transparencia con expertos de América Latina.",
        category: NewsCategory.EVENT,
        status: NewsStatus.PUBLISHED,
        featured: false,
        publishDate: new Date("2024-02-10"),
        authorId: authorId,
      },
    }),
  ]);

  // Create Programs (using Spanish content)
  console.log("🎯 Creating programs...");
  const programs = await Promise.all([
    prisma.program.create({
      data: {
        title: "Iniciativa de Participación Ciudadana Digital",
        description: "Programa destinado a facilitar la participación ciudadana en procesos democráticos mediante plataformas digitales seguras y accesibles.",
        overview: "Esta iniciativa busca digitalizar y democratizar la participación ciudadana en las decisiones públicas. A través de una plataforma web segura, los ciudadanos pueden:\n\n- Votar en consultas públicas\n- Proponer iniciativas legislativas\n- Seguir el trabajo parlamentario\n- Reportar irregularidades\n\nEl programa incluye formación ciudadana en el uso de estas herramientas digitales y talleres de empoderamiento democrático.",
        objectives: "1. Fortalecer la participación ciudadana en procesos democráticos\n2. Generar transparencia en la gestión pública\n3. Empoderar a grupos históricamente excluidos\n4. Digitalizar procesos participativos\n5. Construir ciudadanía crítica e informada",
        type: ProgramType.CAPACITY_BUILDING,
        status: ProgramStatus.ACTIVE,
        featured: true,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31"),
        featuredImageUrl: "/images/digital-participation.jpg",
        galleryImages: ["/images/workshop1.jpg", "/images/workshop2.jpg"],
        documentUrls: ["/documents/digital-participation-guide.pdf"],
        targetPopulation: "Ciudadanos de todas las clases sociales, organizaciones sociales, jóvenes",
        region: "Bolivia",
        budget: 150000.0,
        progressPercentage: 45,
        managerId: authorId,
      },
    }),
    prisma.program.create({
      data: {
        title: "Observatorio de Corrupción",
        description: "Proyecto de investigación para monitorear y documentar casos de corrupción en el país, generando alertas tempranas y propuestas de reformas institucionales.",
        overview: "El Observatorio de Corrupción es una unidad especializada en investigación y análisis de casos de corrupción. Utilizamos metodologías científicas para analizar patrones y tendencias corruptivas en Bolivia.\n\n**Metodología incluye:**\n- Análisis de datos públicos\n- Investigación de campo\n- Entrevistas con afectados\n- Análisis legal y normativo\n- Documentación multimedia",
        objectives: "1. Identificar patrones corruptivos en el sector público\n2. Proponer reformas institucionales específicas\n3. Empoderar a la sociedad civil con información\n4. Contribuir a la reforma judicial\n5. Prevenir futuros casos de corrupción",
        type: ProgramType.RESEARCH,
        status: ProgramStatus.ACTIVE,
        featured: false,
        startDate: new Date("2024-01-15"),
        endDate: new Date("2024-12-15"),
        featuredImageUrl: "/images/corruption-observatory.jpg",
        targetPopulation: "Investigadores, periodistas, organizaciones de derechos humanos, estudiantes",
        region: "Bolivia",
        budget: 200000.0,
        progressPercentage: 30,
        managerId: authorId,
      },
    }),
  ]);

  // Create Digital Library Publications (using Spanish content)
  console.log("📚 Creating digital library publications...");
  await prisma.digitalLibrary.createMany({
    data: [
      {
        title: "Estado de la Democracia en Bolivia 2024",
        description: "Análisis integral sobre el estado actual de la democracia en Bolivia, incluyendo indicadores de participación, transparencia e institucionalidad.",
        abstract: "Este informe analiza el estado de la democracia en Bolivia durante 2024, evaluando aspectos clave como la participación ciudadana, la transparencia gubernamental, y la calidad institucional. El estudio incluye recomendaciones específicas para el fortalecimiento democrático.",
        type: PublicationType.REPORT,
        status: PublicationStatus.PUBLISHED,
        featured: true,
        fileUrl: "/documents/democracy-report-2024.pdf",
        fileName: "democracy-report-2024.pdf",
        fileSize: 2048000,
        mimeType: "application/pdf",
        coverImageUrl: "/images/democracy-report-cover.jpg",
        thumbnailUrl: "/images/democracy-report-thumb.jpg",
        tags: ["democracia", "transparencia", "institucionalidad"],
        keywords: ["democracia", "participación", "transparencia", "gobernanza"],
        publishDate: new Date("2024-02-01"),
        doi: "10.1000/2024.bolt.democracy-report",
        citationFormat: "Plataforma Boliviana de Actores por la Justicia. (2024). Estado de la Democracia en Bolivia 2024. La Paz: PBAJ.",
        downloadCount: 156,
        viewCount: 1240,
        relatedPrograms: [programs[0].id],
        authorId: authorId,
      },
      {
        title: "Guía de Acceso a la Información Pública",
        description: "Manual práctico para que los ciudadanos puedan solicitar información pública y ejercer efectivamente su derecho a la transparencia.",
        abstract: "Esta guía práctica explica paso a paso cómo los ciudadanos pueden ejercer su derecho al acceso a la información pública en Bolivia, incluyendo trámites, formularios y estrategias de seguimiento.",
        type: PublicationType.GUIDE,
        status: PublicationStatus.PUBLISHED,
        featured: false,
        fileUrl: "/documents/guide-public-info-access.pdf",
        fileName: "guide-public-info-access.pdf",
        fileSize: 1024000,
        mimeType: "application/pdf",
        coverImageUrl: "/images/guide-cover.jpg",
        tags: ["transparencia", "acceso-información", "derechos-ciudadanos"],
        keywords: ["información pública", "transparencia", "derechos", "guía"],
        publishDate: new Date("2024-01-20"),
        downloadCount: 89,
        viewCount: 567,
        authorId: authorId,
      },
    ],
  });

  // Create Media Assets (using Spanish content)
  console.log("🖼️  Creating media assets...");
  await prisma.mediaAsset.createMany({
    data: [
      {
        fileName: "transparency-workshop.jpg",
        originalName: "Transparency Workshop Group Photo.jpg",
        url: "/images/transparency-workshop.jpg",
        thumbnailUrl: "/images/thumbs/transparency-workshop.jpg",
        type: MediaType.IMAGE,
        category: MediaCategory.PROGRAM_MEDIA,
        mimeType: "image/jpeg",
        fileSize: 512000,
        altText: "Encuentro de transparencia con participantes de diferentes organizaciones sociales",
        caption: "Participantes del taller de transparencia en La Paz",
        dimensions: "1920x1280",
        tags: ["taller", "transparencia", "participación"],
        isPublic: true,
        usageCount: 5,
        uploaderId: authorId,
      },
      {
        fileName: "democracy-reform-document.pdf",
        originalName: "Bolivia Democracy Reform Proposals.pdf",
        url: "/documents/democracy-reform.pdf",
        type: MediaType.DOCUMENT,
        category: MediaCategory.LIBRARY_COVER,
        mimeType: "application/pdf",
        fileSize: 1536000,
        altText: "Documento de propuestas de reforma democrática",
        caption: "Propuestas de reforma institucional para el sistema democrático",
        tags: ["reforma", "democracia", "desarrollo-institucional"],
        isPublic: true,
        usageCount: 12,
        uploaderId: authorId,
      },
    ],
  });

  // Create some content schedules
  console.log("⏰ Creating content schedules...");
  await prisma.contentSchedule.create({
    data: {
      contentId: newsArticles[0].id,
      contentType: ScheduledContentType.NEWS,
      scheduledDate: new Date("2024-03-15T10:00:00Z"),
      timezone: "America/La_Paz",
      action: ScheduleAction.PUBLISH,
      status: ScheduleStatus.PENDING,
      metadata: {
        broadcastChannels: ["email", "social_media"],
        priority: "high",
      },
      createdById: authorId,
    },
  });

  console.log("✅ Database seeding completed successfully!");
  console.log(`📊 Summary:`);
  console.log(`   - News articles: ${newsArticles.length}`);
  console.log(`   - Programs: ${programs.length}`);
  console.log(`   - Categories: 3`);
  console.log(`   - Tags: 4`);
  console.log(`   - Media assets: 2`);
  console.log(`   - Digital library publications: 2`);
  console.log(`   - Content schedules: 1`);
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });