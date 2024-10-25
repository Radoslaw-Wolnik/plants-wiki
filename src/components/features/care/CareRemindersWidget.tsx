// src/components/features/care/CareRemindersWidget.tsx
import React from 'react';
import { Card, Badge } from '@/components/ui';
import { useCareReminders } from '@/hooks/features/plants/useCareReminders';
import { CalendarEvent } from '@/types/global';
import { formatDate } from '@/utils/general.util';
import { Droplet, Flower } from 'lucide-react';

export const CareRemindersWidget: React.FC = () => {
  const { upcomingReminders, isLoading } = useCareReminders();

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'watering':
        return <Droplet className="h-4 w-4 text-blue-500" />;
      case 'fertilizing':
        return <Flower className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <Card className="p-6">Loading reminders...</Card>;
  }

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4">Upcoming Care Tasks</h3>
        
        {upcomingReminders.length === 0 ? (
          <p className="text-neutral-600">No upcoming care tasks</p>
        ) : (
          <div className="space-y-4">
            {upcomingReminders.map((event, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getEventIcon(event.type)}
                  <div>
                    <p className="font-medium">{event.plantName}</p>
                    <p className="text-sm text-neutral-600">
                      {formatDate(event.date)}
                    </p>
                  </div>
                </div>
                <Badge variant={event.type === 'watering' ? 'info' : 'success'}>
                  {event.type}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};