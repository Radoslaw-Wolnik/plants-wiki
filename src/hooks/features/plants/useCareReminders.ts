// src/hooks/useCareReminders.ts
import { useApi } from '@/hooks/useApi';
import { useState, useEffect } from 'react';

export function useCareReminders() {
  const { data, error, isLoading, get } = 
    useApi<CalendarEvent[]>('/users/calendar/care-events');
  const [upcomingReminders, setUpcomingReminders] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    if (data) {
      const now = new Date();
      const upcoming = data.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate > now && 
          eventDate <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      });
      setUpcomingReminders(upcoming);
    }
  }, [data]);

  return {
    allEvents: data ?? [],
    upcomingReminders,
    isLoading,
    error,
    refresh: get,
  };
}