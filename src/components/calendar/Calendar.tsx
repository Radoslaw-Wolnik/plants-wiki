// src/components/calendar/Calendar.tsx

import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { Card } from '../common';

interface CalendarEvent {
  id: number;
  date: string;
  type: string;
  plantName: string;
}

interface CalendarProps {
  events: CalendarEvent[];
}

const Calendar: React.FC<CalendarProps> = ({ events }) => {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const renderDay = (date: Date) => {
    const dayEvents = events.filter(
      (event) => format(new Date(event.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    return (
      <div
        key={date.toISOString()}
        className={`p-2 border ${
          format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
            ? 'bg-green-100'
            : ''
        }`}
      >
        <div className="text-right">{format(date, 'd')}</div>
        {dayEvents.map((event) => (
          <div
            key={event.id}
            className={`text-xs p-1 mt-1 rounded ${
              event.type === 'watering' ? 'bg-blue-100' : 'bg-yellow-100'
            }`}
          >
            {event.type}: {event.plantName}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-4 bg-green-500 text-white font-bold text-xl">
        {format(today, 'MMMM yyyy')}
      </div>
      <div className="grid grid-cols-7 gap-1 p-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center font-semibold">
            {day}
          </div>
        ))}
        {daysInMonth.map(renderDay)}
      </div>
    </Card>
  );
};

export default Calendar;