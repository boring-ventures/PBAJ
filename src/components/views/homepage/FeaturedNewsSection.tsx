"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, Clock, User } from "lucide-react";

// Mock data - in real implementation, this would come from your CMS/API
const featuredNews = [
  {
    id: 1,
    title: "Nueva red juvenil se forma en Tarija para promover derechos reproductivos",
    excerpt: "Más de 50 jóvenes se unen a nuestra plataforma para fortalecer el trabajo en derechos sexuales y reproductivos en el sur del país.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop",
    date: "2024-03-15",
    author: "Equipo PBAJ",
    readTime: "3 min",
    category: "Participación Juvenil"
  },
  {
    id: 2,
    title: "Taller sobre prevención de violencia de género capacita a 200 líderes juveniles",
    excerpt: "Una importante jornada de capacitación fortalece las habilidades de nuestros líderes para abordar la violencia de género en sus comunidades.",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop",
    date: "2024-03-10",
    author: "María González",
    readTime: "4 min",
    category: "Prevención de Violencia"
  },
  {
    id: 3,
    title: "Intercambio intercultural une a jóvenes de diferentes regiones de Bolivia",
    excerpt: "El encuentro anual de interculturalidad permite el diálogo y la construcción conjunta entre juventudes de distintas culturas del país.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop",
    date: "2024-03-05",
    author: "Carlos Mamani",
    readTime: "5 min",
    category: "Interculturalidad"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default function FeaturedNewsSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-neutral-50 to-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-16"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 leading-tight">
              Últimas{" "}
              <span className="text-blue-600">Noticias</span>
            </h2>
            
            <div className="flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-green-500 rounded-full"></div>
            </div>

            <p className="text-lg md:text-xl text-neutral-700 leading-relaxed max-w-3xl mx-auto">
              Mantente informado sobre nuestras acciones, logros y las novedades del{" "}
              <span className="font-semibold text-blue-600">movimiento juvenil boliviano.</span>
            </p>
          </motion.div>

          {/* News Grid */}
          <motion.div 
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuredNews.map((article, index) => (
              <motion.article
                key={article.id}
                variants={cardVariants}
                whileHover={{ y: -10 }}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-neutral-100"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                      {article.category}
                    </span>
                  </div>

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Meta info */}
                  <div className="flex items-center justify-between text-sm text-neutral-500">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(article.date)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{article.readTime}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span className="truncate max-w-20">{article.author}</span>
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg md:text-xl font-bold text-neutral-900 leading-tight group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-neutral-700 leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>

                  {/* Read more link */}
                  <div className="pt-2">
                    <Link 
                      href={`/news/${article.id}`}
                      className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium group-hover:translate-x-2 transition-transform duration-300"
                    >
                      <span>Leer más</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div variants={itemVariants} className="text-center pt-8">
            <Link href="/news">
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-6 text-lg font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Ver Todas las Noticias
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}