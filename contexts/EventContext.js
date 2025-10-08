'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const EventContext = createContext({});

export function EventProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/events');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des événements');
      }

      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err.message);
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (eventData) => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout');
      }

      const newEvent = await response.json();
      
      // Mettre à jour l'état local
      setEvents(prev => [newEvent, ...prev]);
      
      return newEvent;
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  };

  const updateEvent = async (eventId, eventData) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la modification');
      }

      const updatedEvent = await response.json();
      
      // Mettre à jour l'état local
      setEvents(prev => 
        prev.map(event => 
          (event.id || event._id) === eventId ? updatedEvent : event
        )
      );
      
      return updatedEvent;
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      // Mettre à jour l'état local
      setEvents(prev => 
        prev.filter(event => (event.id || event._id) !== eventId)
      );
      
      return true;
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  };

  const getEventById = (eventId) => {
    return events.find(event => 
      (event.id || event._id) === eventId
    );
  };

  const value = {
    events,
    loading,
    error,
    fetchEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventById
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}