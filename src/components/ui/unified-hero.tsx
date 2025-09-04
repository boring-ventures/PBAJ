'use client';

import { useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Typewriter } from '@/components/ui/typewriter';
import { cn } from '@/lib/utils';

interface UnifiedHeroProps {
  title: string;
  subtitle?: string | string[];
  backgroundImage: string;
  className?: string;
  locale?: 'es' | 'en';
  buttonColor?: string;
  buttonHoverColor?: string;
}

export default function UnifiedHero({
  title,
  subtitle,
  backgroundImage,
  className,
  locale = 'es',
  buttonColor = '#dd0282',
  buttonHoverColor = '#ff0099'
}: UnifiedHeroProps) {
  
  // Smooth scroll function
  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight * 0.8, // Scroll down 80% of viewport height
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    // Load DIMBO font if not already loaded
    const link = document.createElement('link');
    link.href = 'https://fonts.cdnfonts.com/css/dimbo';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <section className={cn("relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden", className)}>
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt="Hero background"
          className="w-full h-full object-cover"
        />
        
        {/* Textured Overlay - Multiple layers for depth */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        
        {/* Texture Pattern */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        />
        
        {/* Noise texture for depth */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            mixBlendMode: 'overlay'
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Title with DIMBO font */}
          <h1 
            className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 leading-tight tracking-wide"
            style={{ 
              fontFamily: '"DIMBO", sans-serif',
              textShadow: '2px 2px 4px rgba(0,0,0,0.7), 0 0 30px rgba(0,0,0,0.5)'
            }}
          >
            {title}
          </h1>
          
          {/* Subtitle with Typewriter effect */}
          {subtitle && (
            <div 
              className="text-xl md:text-2xl lg:text-3xl mb-12 max-w-3xl mx-auto leading-relaxed h-20"
              style={{ 
                fontFamily: 'Helvetica, Arial, sans-serif',
              }}
            >
              <Typewriter
                text={subtitle}
                speed={60}
                initialDelay={500}
                waitTime={3000}
                deleteSpeed={40}
                loop={Array.isArray(subtitle)}
                className="text-white font-semibold drop-shadow-2xl"
                showCursor={true}
                cursorChar="_"
                cursorClassName="font-bold animate-pulse"
              />
            </div>
          )}
          
          {/* Call to Action Button with custom color */}
          <Button
            onClick={handleScrollDown}
            size="lg"
            className="px-8 py-6 text-lg font-semibold rounded-full shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl text-white border-2"
            style={{ 
              fontFamily: 'Helvetica, Arial, sans-serif',
              backgroundColor: buttonColor,
              borderColor: buttonColor,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = buttonHoverColor;
              e.currentTarget.style.borderColor = buttonHoverColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = buttonColor;
              e.currentTarget.style.borderColor = buttonColor;
            }}
          >
            {locale === 'es' ? 'Saber Más' : 'Learn More'}
            <ChevronDown className="ml-2 h-5 w-5 animate-bounce" />
          </Button>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center">
          <span className="text-white/60 text-sm mb-2" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
            {locale === 'es' ? 'Desliza hacia abajo' : 'Scroll down'}
          </span>
          <div className="w-[30px] h-[50px] rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/60 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}