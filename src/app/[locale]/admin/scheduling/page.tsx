'use client';

import { useState, useEffect } from 'react';
import { ScheduleFilterData } from '@/lib/validations/scheduling';
import { ScheduleManager } from '@/components/cms/scheduling/schedule-manager';
import { toast } from '@/components/ui/use-toast';

interface ScheduleItem {
  id: string;
  contentId: string;
  contentType: 'news' | 'program' | 'publication';
  scheduledDate: Date;
  action: 'publish' | 'unpublish' | 'archive';
  status: 'pending' | 'executed' | 'failed' | 'cancelled';
  timezone: string;
  executedAt?: Date;
  failureReason?: string;
  createdBy: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
}

export default function SchedulingManagementPage() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ScheduleFilterData>({
    page: 1,
    limit: 10,
  });

  const fetchSchedules = async (currentFilters: ScheduleFilterData) => {
    try {
      setLoading(true);
      const searchParams = new URLSearchParams();
      
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (value instanceof Date) {
            searchParams.append(key, value.toISOString());
          } else {
            searchParams.append(key, value.toString());
          }
        }
      });

      const response = await fetch(`/api/admin/scheduling?${searchParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch schedules');
      }

      const data = await response.json();
      setSchedules(data.schedules);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las programaciones',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules(filters);
  }, [filters]);

  const handleFiltersChange = (newFilters: ScheduleFilterData) => {
    setFilters(newFilters);
  };

  const handleExecute = async (scheduleId: string) => {
    const response = await fetch(`/api/admin/scheduling/${scheduleId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'execute' }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to execute schedule');
    }

    fetchSchedules(filters);
  };

  const handleCancel = async (scheduleId: string) => {
    const response = await fetch(`/api/admin/scheduling/${scheduleId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'cancel' }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to cancel schedule');
    }

    fetchSchedules(filters);
  };

  const handleRetry = async (scheduleId: string) => {
    const response = await fetch(`/api/admin/scheduling/${scheduleId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'retry' }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to retry schedule');
    }

    fetchSchedules(filters);
  };

  return (
    <div className="container mx-auto p-6">
      <ScheduleManager
        schedules={schedules}
        totalCount={pagination.totalCount}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onFiltersChange={handleFiltersChange}
        onExecute={handleExecute}
        onCancel={handleCancel}
        onRetry={handleRetry}
        loading={loading}
      />
    </div>
  );
}