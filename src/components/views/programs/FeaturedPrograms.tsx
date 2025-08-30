'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CalendarIcon, PersonIcon, StarIcon } from '@radix-ui/react-icons';
import type { LocalizedProgram } from '@/lib/content/content-utils';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

interface FeaturedProgramsProps {
  programs: LocalizedProgram[];
}

export default function FeaturedPrograms({ programs }: FeaturedProgramsProps) {
  const params = useParams();
  const locale = params.locale as string || 'es';

  const formatDate = (date: Date) => {
    return format(date, 'MMM yyyy', { 
      locale: locale === 'es' ? es : enUS 
    });
  };

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: { es: string, en: string }, color: string }> = {
      ACTIVE: { 
        label: { es: 'Activo', en: 'Active' }, 
        color: 'bg-green-500 text-white' 
      },
      COMPLETED: { 
        label: { es: 'Completado', en: 'Completed' }, 
        color: 'bg-blue-500 text-white' 
      },
      PLANNING: { 
        label: { es: 'En Planificación', en: 'Planning' }, 
        color: 'bg-yellow-500 text-white' 
      },
      PAUSED: { 
        label: { es: 'Pausado', en: 'Paused' }, 
        color: 'bg-gray-500 text-white' 
      }
    };
    
    return statusMap[status] || { 
      label: { es: status, en: status }, 
      color: 'bg-gray-500 text-white' 
    };
  };

  if (!programs || programs.length === 0) {
    return null;
  }

  return (
    <div className="mb-16">
      <div className="flex items-center mb-8">
        <StarIcon className="h-6 w-6 text-yellow-500 mr-3" />
        <h2 className="text-2xl font-bold text-foreground">
          {locale === 'es' ? 'Programas Destacados' : 'Featured Programs'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {programs.map((program) => {
          const statusInfo = getStatusInfo(program.status);
          
          return (
            <Card key={program.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-primary/10">
              <CardHeader className="p-0">
                {program.featuredImageUrl ? (
                  <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                    <img
                      src={program.featuredImageUrl}
                      alt={program.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Featured Badge */}
                    <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full flex items-center">
                      <StarIcon className="h-4 w-4 mr-1" />
                      <span className="text-xs font-semibold">
                        {locale === 'es' ? 'Destacado' : 'Featured'}
                      </span>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className={`${statusInfo.color} border-none`}>
                        {locale === 'es' ? statusInfo.label.es : statusInfo.label.en}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-secondary/10 flex flex-col items-center justify-center relative">
                    <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full flex items-center">
                      <StarIcon className="h-4 w-4 mr-1" />
                      <span className="text-xs font-semibold">
                        {locale === 'es' ? 'Destacado' : 'Featured'}
                      </span>
                    </div>
                    <div className="text-4xl mb-4">📋</div>
                    <div className="text-muted-foreground text-sm text-center px-4">
                      {locale === 'es' ? 'Programa' : 'Program'}
                    </div>
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  <Link href={`/${locale}/programs/${program.id}`}>
                    {program.title}
                  </Link>
                </h3>

                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {program.description}
                </p>

                {/* Program Details */}
                <div className="space-y-3 mb-4">
                  {/* Timeline */}
                  {program.startDate && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <CalendarIcon className="h-3 w-3 mr-2" />
                      <span>
                        {formatDate(new Date(program.startDate))}
                        {program.endDate && ` - ${formatDate(new Date(program.endDate))}`}
                      </span>
                    </div>
                  )}

                  {/* Progress Bar */}
                  {program.progressPercentage !== undefined && (
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>{locale === 'es' ? 'Progreso' : 'Progress'}</span>
                        <span>{program.progressPercentage}%</span>
                      </div>
                      <Progress value={program.progressPercentage} className="h-2" />
                    </div>
                  )}

                  {/* Location and Target */}
                  {(program.region || program.targetPopulation) && (
                    <div className="space-y-1">
                      {program.region && (
                        <div className="text-xs text-muted-foreground">
                          📍 {program.region}
                        </div>
                      )}
                      {program.targetPopulation && (
                        <div className="text-xs text-muted-foreground">
                          👥 {program.targetPopulation}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <PersonIcon className="h-3 w-3 mr-1" />
                    <span>{program.manager.firstName} {program.manager.lastName}</span>
                  </div>
                  <Link 
                    href={`/${locale}/programs/${program.id}`}
                    className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                  >
                    {locale === 'es' ? 'Ver más' : 'Learn more'}
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}