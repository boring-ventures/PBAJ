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

  // Create Categories
  console.log("📂 Creating categories...");
  const advocacyCategory = await prisma.category.create({
    data: {
      nameEs: "Defensa y Justicia",
      nameEn: "Defense and Justice",
      descriptionEs:
        "Organizaciones e iniciativas dedicadas a la defensa de derechos humanos",
      descriptionEn:
        "Organizations and initiatives dedicated to defending human rights",
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
      nameEs: "Investigación e Información",
      nameEn: "Research and Information",
      descriptionEs:
        "Estudios, reportes y análisis sobre la situación en Bolivia",
      descriptionEn:
        "Studies, reports and analysis on the situation in Bolivia",
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
      nameEs: "Educación y Capacitación",
      nameEn: "Education and Training",
      descriptionEs: "Programas educativos y de capacitación ciudadana",
      descriptionEn: "Educational and citizen training programs",
      slug: "educacion-capacitacion",
      contentType: ContentType.PROGRAM,
      color: "#10B981",
      iconName: "graduation-cap",
      isActive: true,
      sortOrder: 3,
      createdById: authorId,
    },
  });

  // Create Tags
  console.log("🏷️  Creating tags...");
  const democracyTag = await prisma.tag.create({
    data: {
      nameEs: "Democracia",
      nameEn: "Democracy",
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
      nameEs: "Derechos Humanos",
      nameEn: "Human Rights",
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
      nameEs: "Corrupción",
      nameEn: "Corruption",
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
      nameEs: "Gobernanza",
      nameEn: "Governance",
      slug: "gobernanza",
      contentType: ContentType.PROGRAM,
      color: "#06B6D4",
      usageCount: 0,
      isActive: true,
      createdById: authorId,
    },
  });

  // Create News Articles
  console.log("📰 Creating news articles...");
  const newsArticles = await Promise.all([
    prisma.news.create({
      data: {
        titleEs:
          "Nueva Ley de Transparencia en Bolivia: Un Paso Hacia la Democracia",
        titleEn: "New Transparency Law in Bolivia: A Step Towards Democracy",
        contentEs:
          "La reciente aprobación de la nueva ley de transparencia en Bolivia marca un hito crucial en la lucha contra la corrupción y el fortalecimiento de los valores democráticos. Esta legislación representa un compromiso serio del gobierno para garantizar el acceso público a la información gubernamental.\n\nLa ley incluye disposiciones para la transparencia en contrataciones públicas, obligaciones de reporte para funcionarios públicos, y mecanismos claros para la participación ciudadana en la toma de decisiones. Los ciudadanos ahora tendrán herramientas más robustas para ejercer su derecho a la información y supervisar el uso de recursos públicos.\n\nEsta iniciativa forma parte de una serie de reformas que buscan consolidar las instituciones democráticas y construir una sociedad más justa e inclusiva.",
        contentEn:
          "The recent approval of the new transparency law in Bolivia marks a crucial milestone in the fight against corruption and strengthening democratic values. This legislation represents a serious commitment from the government to guarantee public access to government information.\n\nThe law includes provisions for transparency in public procurement, reporting obligations for public officials, and clear mechanisms for citizen participation in decision-making. Citizens will now have more robust tools to exercise their right to information and oversee the use of public resources.\n\nThis initiative is part of a series of reforms that seek to consolidate democratic institutions and build a fairer and more inclusive society.",
        excerptEs:
          "La nueva ley de transparencia aprobada en Bolivia marca un hito en la lucha contra la corrupción y el fortalecimiento democrático.",
        excerptEn:
          "The new transparency law approved in Bolivia marks a milestone in the fight against corruption and democratic strengthening.",
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
        titleEs: "Plan Estratégico 2024: Construyendo Una Sociedad Más Justa",
        titleEn: "Strategic Plan 2024: Building a Fairer Society",
        contentEs:
          "El nuevo plan estratégico de la Plataforma Boliviana de Actores por la Justicia establece un marco de acción integral para promover la justicia, la transparencia y la participación ciudadana en Bolivia.\n\nLos pilares fundamentales de este plan incluyen:\n\n1. **Fortalecimiento de la transparencia gubernamental**\n2. **Promoción de la participación ciudadana en procesos democráticos**\n3. **Defensa de los derechos humanos fundamentales**\n4. **Fortalecimiento de organizaciones de la sociedad civil**\n5. **Investigación y denuncia de casos de corrupción**\n\nEste plan representa nuestra visión de una Bolivia más democrática, transparente y participativa.",
        contentEn:
          "The new strategic plan of the Bolivian Platform for Justice Actors establishes a comprehensive action framework to promote justice, transparency and citizen participation in Bolivia.\n\nThe fundamental pillars of this plan include:\n\n1. **Strengthening governmental transparency**\n2. **Promoting citizen participation in democratic processes**\n3. **Defending fundamental human rights**\n4. **Strengthening civil society organizations**\n5. **Research and reporting of corruption cases**\n\nThis plan represents our vision of a more democratic, transparent and participatory Bolivia.",
        excerptEs:
          "La Plataforma presenta un plan estratégico integral para promover la justicia y la transparencia en Bolivia durante 2024.",
        excerptEn:
          "The Platform presents a comprehensive strategic plan to promote justice and transparency in Bolivia during 2024.",
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
        titleEs: "Seminario Internacional: Democracia y Transparencia",
        titleEn: "International Seminar: Democracy and Transparency",
        contentEs:
          'El próximo 15 de marzo, la Plataforma junto con organizaciones internacionales, realizará el seminario "Democracia y Transparencia: Experiencias de América Latina" en La Paz.\n\nEste evento contará con la participación de expertos internacionales y nacionales en temas de transparencia, lucha contra la corrupción y fortalecimiento democrático.\n\n**Los participantes incluyen:**\n- Dra. María González (España) - Experta en políticas de transparencia\n- Dr. Carlos Méndez (Uruguay) - Especialista en reformas institucionales\n- Lic. Ana Fernández (Bolivia) - Defensora de derechos humanos\n\nEste seminario es una oportunidad única para intercambiar experiencias y fortalecer nuestras estrategias de promoción de derechos.',
        contentEn:
          'On March 15, the Platform together with international organizations will hold the seminar "Democracy and Transparency: Latin American Experiences" in La Paz.\n\nThis event will feature the participation of international and national experts on transparency, anti-corruption and democratic strengthening.\n\n**Participants include:**\n- Dr. María González (Spain) - Expert in transparency policies\n- Dr. Carlos Méndez (Uruguay) - Specialist in institutional reforms\n- Lic. Ana Fernández (Bolivia) - Human rights defender\n\nThis seminar is a unique opportunity to exchange experiences and strengthen our advocacy strategies.',
        excerptEs:
          "La Plataforma organiza un seminario internacional sobre democracia y transparencia con expertos de América Latina.",
        excerptEn:
          "The Platform organizes an international seminar on democracy and transparency with Latin American experts.",
        category: NewsCategory.EVENT,
        status: NewsStatus.PUBLISHED,
        featured: false,
        publishDate: new Date("2024-02-10"),
        authorId: authorId,
      },
    }),
  ]);

  // Create Programs
  console.log("🎯 Creating programs...");
  const programs = await Promise.all([
    prisma.program.create({
      data: {
        titleEs: "Iniciativa de Participación Ciudadana Digital",
        titleEn: "Digital Citizen Participation Initiative",
        descriptionEs:
          "Programa destinado a facilitar la participación ciudadana en procesos democráticos mediante plataformas digitales seguras y accesibles.",
        descriptionEn:
          "Program designed to facilitate citizen participation in democratic processes through secure and accessible digital platforms.",
        overviewEs:
          "Esta iniciativa busca digitalizar y democratizar la participación ciudadana en las decisiones públicas. A través de una plataforma web segura, los ciudadanos pueden:\n\n- Votar en consultas públicas\n- Proponer iniciativas legislativas\n- Seguir el trabajo parlamentario\n- Reportar irregularidades\n\nEl programa incluye formación ciudadana en el uso de estas herramientas digitales y talleres de empoderamiento democrático.",
        overviewEn:
          "This initiative seeks to digitize and democratize citizen participation in public decisions. Through a secure web platform, citizens can:\n\n- Vote in public consultations\n- Propose legislative initiatives\n- Follow parliamentary work\n- Report irregularities\n\nThe program includes citizen training in the use of these digital tools and democratic empowerment workshops.",
        objectivesEs:
          "1. Fortalecer la participación ciudadana en procesos democráticos\n2. Generar transparencia en la gestión pública\n3. Empoderar a grupos históricamente excluidos\n4. Digitalizar procesos participativos\n5. Construir ciudadanía crítica e informada",
        objectivesEn:
          "1. Strengthen citizen participation in democratic processes\n2. Generate transparency in public management\n3. Empower historically excluded groups\n4. Digitize participatory processes\n5. Build critical and informed citizenry",
        type: ProgramType.CAPACITY_BUILDING,
        status: ProgramStatus.ACTIVE,
        featured: true,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31"),
        featuredImageUrl: "/images/digital-participation.jpg",
        galleryImages: ["/images/workshop1.jpg", "/images/workshop2.jpg"],
        documentUrls: ["/documents/digital-participation-guide.pdf"],
        targetPopulation:
          "Ciudadanos de todas las clases sociales, organizaciones sociales, jóvenes",
        region: "Bolivia",
        budget: 150000.0,
        progressPercentage: 45,
        managerId: authorId,
      },
    }),
    prisma.program.create({
      data: {
        titleEs: "Observatorio de Corrupción",
        titleEn: "Corruption Observatory",
        descriptionEs:
          "Proyecto de investigación para monitorear y documentar casos de corrupción en el país, generando alertas tempranas y propuestas de reformas institucionales.",
        descriptionEn:
          "Research project to monitor and document corruption cases in the country, generating early warnings and proposals for institutional reforms.",
        overviewEs:
          "El Observatorio de Corrupción es una unidad especializada en investigación y análisis de casos de corrupción. Utilizamos metodologías científicas para analizar patrones y tendencias corruptivas en Bolivia.\n\n**Metodología incluye:**\n- Análisis de datos públicos\n- Investigación de campo\n- Entrevistas con afectados\n- Análisis legal y normativo\n- Documentación multimedia",
        overviewEn:
          "The Corruption Observatory is a specialized unit in research and analysis of corruption cases. We use scientific methodologies to analyze patterns and corruptive trends in Bolivia.\n\n**Methodology includes:**\n- Analysis of public data\n- Field research\n- Interviews with those affected\n- Legal and regulatory analysis\n- Multimedia documentation",
        objectivesEs:
          "1. Identificar patrones corruptivos en el sector público\n2. Proponer reformas institucionales específicas\n3. Empoderar a la sociedad civil con información\n4. Contribuir a la reforma judicial\n5. Prevenir futuros casos de corrupción",
        objectivesEn:
          "1. Identify corruptive patterns in the public sector\n2. Propose specific institutional reforms\n3. Empower civil society with information\n4. Contribute to judicial reform\n5. Prevent future corruption cases",
        type: ProgramType.RESEARCH,
        status: ProgramStatus.ACTIVE,
        featured: false,
        startDate: new Date("2024-01-15"),
        endDate: new Date("2024-12-15"),
        featuredImageUrl: "/images/corruption-observatory.jpg",
        targetPopulation:
          "Investigadores, periodistas, organizaciones de derechos humanos, estudiantes",
        region: "Bolivia",
        budget: 200000.0,
        progressPercentage: 30,
        managerId: authorId,
      },
    }),
  ]);

  // Create Digital Library Publications
  console.log("📚 Creating digital library publications...");
  await prisma.digitalLibrary.createMany({
    data: [
      {
        titleEs: "Estado de la Democracia en Bolivia 2024",
        titleEn: "State of Democracy in Bolivia 2024",
        descriptionEs:
          "Análisis integral sobre el estado actual de la democracia en Bolivia, incluyendo indicadores de participación, transparencia e institucionalidad.",
        descriptionEn:
          "Comprehensive analysis on the current state of democracy in Bolivia, including participation, transparency and institutional indicators.",
        abstractEs:
          "Este informe analiza el estado de la democracia en Bolivia durante 2024, evaluando aspectos clave como la participación ciudadana, la transparencia gubernamental, y la calidad institucional. El estudio incluye recomendaciones específicas para el fortalecimiento democrático.",
        abstractEn:
          "This report analyzes the state of democracy in Bolivia during 2024, evaluating key aspects such as citizen participation, government transparency, and institutional quality. The study includes specific recommendations for democratic strengthening.",
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
        keywords: [
          "democracia",
          "participación",
          "transparencia",
          "gobernanza",
        ],
        publishDate: new Date("2024-02-01"),
        doi: "10.1000/2024.bolt.democracy-report",
        citationFormat:
          "Plataforma Boliviana de Actores por la Justicia. (2024). Estado de la Democracia en Bolivia 2024. La Paz: PBAJ.",
        downloadCount: 156,
        viewCount: 1240,
        relatedPrograms: [programs[0].id],
        authorId: authorId,
      },
      {
        titleEs: "Guía de Acceso a la Información Pública",
        titleEn: "Public Information Access Guide",
        descriptionEs:
          "Manual práctico para que los ciudadanos puedan solicitar información pública y ejercer efectivamente su derecho a la transparencia.",
        descriptionEn:
          "Practical manual for citizens to request public information and effectively exercise their right to transparency.",
        abstractEs:
          "Esta guía práctica explica paso a paso cómo los ciudadanos pueden ejercer su derecho al acceso a la información pública en Bolivia, incluyendo trámites, formularios y estrategias de seguimiento.",
        abstractEn:
          "This practical guide explains step by step how citizens can exercise their right to access public information in Bolivia, including procedures, forms and follow-up strategies.",
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

  // Create Media Assets
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
        altTextEs:
          "Encuentro de transparencia con participantes de diferentes organizaciones sociales",
        altTextEn:
          "Transparency meeting with participants from different social organizations",
        captionEs: "Participantes del taller de transparencia en La Paz",
        captionEn: "Transparency workshop participants in La Paz",
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
        altTextEs: "Documento de propuestas de reforma democrática",
        altTextEn: "Democratic reform proposals document",
        captionEs:
          "Propuestas de reforma institucional para el sistema democrático",
        captionEn: "Institutional reform proposals for the democratic system",
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
