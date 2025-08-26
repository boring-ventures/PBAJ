'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContentScheduleData, contentScheduleSchema, SCHEDULING_PRESETS, BOLIVIA_TIMEZONES } from '@/lib/validations/scheduling';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { 
  Calendar, 
  Clock, 
  Send, 
  X, 
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ContentSchedulerProps {
  contentId: string;
  contentType: 'news' | 'program' | 'publication';
  onSchedule?: (scheduleData: ContentScheduleData) => Promise<void>;
  onCancel?: () => void;
  existingSchedules?: ContentScheduleData[];
}

export function ContentScheduler({
  contentId,
  contentType,
  onSchedule,
  onCancel,
  existingSchedules = []
}: ContentSchedulerProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('quick');

  const form = useForm<Omit<ContentScheduleData, 'contentId' | 'contentType' | 'status' | 'executedAt' | 'failureReason' | 'createdBy'>>({
    resolver: zodResolver(contentScheduleSchema.omit({ 
      contentId: true, 
      contentType: true, 
      status: true, 
      executedAt: true, 
      failureReason: true,
      createdBy: true 
    })),
    defaultValues: {
      action: 'publish',
      timezone: 'America/La_Paz',
      scheduledDate: new Date(),
    },
  });

  const { register, handleSubmit, setValue, watch, formState: { errors } } = form;
  const watchedValues = watch();

  const onSubmit = async (data: Omit<ContentScheduleData, 'contentId' | 'contentType' | 'status' | 'executedAt' | 'failureReason' | 'createdBy'>) => {
    try {
      setLoading(true);
      
      const scheduleData: ContentScheduleData = {
        ...data,
        contentId,
        contentType,
        status: 'pending',
        createdBy: 'current-user', // This should come from auth context
      };
      
      await onSchedule?.(scheduleData);
      
      toast({
        title: 'Éxito',
        description: 'Contenido programado correctamente',
      });
      
      onCancel?.();
    } catch {
      toast({
        title: 'Error',
        description: 'Ocurrió un error al programar el contenido',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePresetSelect = (presetKey: keyof typeof SCHEDULING_PRESETS) => {
    const preset = SCHEDULING_PRESETS[presetKey];
    setValue('scheduledDate', preset.getDate());
  };

  const formatScheduleDate = (date: Date) => {
    return format(date, "dd 'de' MMMM, yyyy 'a las' HH:mm", { locale: es });
  };

  const getActionLabel = (action: string) => {
    const labels = {
      publish: 'Publicar',
      unpublish: 'Despublicar',
      archive: 'Archivar',
    };
    return labels[action as keyof typeof labels] || action;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: 'secondary' as const, label: 'Pendiente', icon: Clock },
      executed: { variant: 'default' as const, label: 'Ejecutado', icon: CheckCircle },
      failed: { variant: 'destructive' as const, label: 'Fallido', icon: AlertCircle },
      cancelled: { variant: 'outline' as const, label: 'Cancelado', icon: X },
    };
    
    const config = variants[status as keyof typeof variants] || variants.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Existing Schedules */}
      {existingSchedules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Programaciones Existentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {existingSchedules.map((schedule, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{getActionLabel(schedule.action)}</span>
                      {getStatusBadge(schedule.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatScheduleDate(new Date(schedule.scheduledDate))}
                    </p>
                  </div>
                  {schedule.status === 'pending' && (
                    <Button variant="outline" size="sm">
                      <X className="w-4 h-4 mr-1" />
                      Cancelar
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scheduler Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Programar Contenido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Action Selection */}
            <div>
              <Label htmlFor="action">Acción a Ejecutar</Label>
              <Select
                value={watchedValues.action}
                onValueChange={(value) => setValue('action', value as 'publish' | 'unpublish' | 'archive')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="publish">Publicar</SelectItem>
                  <SelectItem value="unpublish">Despublicar</SelectItem>
                  <SelectItem value="archive">Archivar</SelectItem>
                </SelectContent>
              </Select>
              {errors.action && (
                <p className="text-sm text-destructive mt-1">{errors.action.message}</p>
              )}
            </div>

            {/* Scheduling Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="quick">Programación Rápida</TabsTrigger>
                <TabsTrigger value="custom">Personalizada</TabsTrigger>
              </TabsList>

              {/* Quick Scheduling */}
              <TabsContent value="quick" className="space-y-4">
                <div>
                  <Label>Selecciona cuándo ejecutar la acción:</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {Object.entries(SCHEDULING_PRESETS).map(([key, preset]) => (
                      <Button
                        key={key}
                        type="button"
                        variant="outline"
                        onClick={() => handlePresetSelect(key as keyof typeof SCHEDULING_PRESETS)}
                        className="justify-start"
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Fecha programada:</span>
                  </div>
                  <p className="text-lg mt-1">
                    {formatScheduleDate(watchedValues.scheduledDate)}
                  </p>
                </div>
              </TabsContent>

              {/* Custom Scheduling */}
              <TabsContent value="custom" className="space-y-4">
                <div>
                  <Label htmlFor="scheduledDate">Fecha y Hora</Label>
                  <Input
                    id="scheduledDate"
                    type="datetime-local"
                    {...register('scheduledDate', {
                      setValueAs: (value) => value ? new Date(value) : new Date(),
                    })}
                    min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
                  />
                  {errors.scheduledDate && (
                    <p className="text-sm text-destructive mt-1">{errors.scheduledDate.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="timezone">Zona Horaria</Label>
                  <Select
                    value={watchedValues.timezone}
                    onValueChange={(value) => setValue('timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BOLIVIA_TIMEZONES.map(tz => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Vista Previa</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Acción:</span>
                      <span>{getActionLabel(watchedValues.action)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fecha:</span>
                      <span>{formatScheduleDate(watchedValues.scheduledDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Zona horaria:</span>
                      <span>{BOLIVIA_TIMEZONES.find(tz => tz.value === watchedValues.timezone)?.label}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                <Send className="w-4 h-4 mr-2" />
                Programar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}