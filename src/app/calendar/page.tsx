// src/app/calendar/page.tsx

import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Calendar from '../components/Calendar';
import AddEventModal from '../components/AddEventModal';

const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState([]);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const response = await fetch('/api/users/calendar');
    const data = await response.json();
    setEvents(data);
  };

  const handleAddEvent = async (newEvent) => {
    const response = await fetch('/api/users/calendar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent),
    });

    if (response.ok) {
      fetchEvents();
      setIsAddEventModalOpen(false);
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Plant Care Calendar</h1>
        <button
          onClick={() => setIsAddEventModalOpen(true)}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Add Event
        </button>
      </div>
      <Calendar events={events} />
      <AddEventModal
        isOpen={isAddEventModalOpen}
        onClose={() => setIsAddEventModalOpen(false)}
        onAddEvent={handleAddEvent}
      />
    </Layout>
  );
};

export default CalendarPage;