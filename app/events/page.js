'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Filter, Search, Loader2, Plus, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/contexts/TranslationContext';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/contexts/EventContext';
import AddEventModal from '@/components/AddEventModal';
import EditEventModal from '@/components/EditEventModal';

export default function EventsPage() {
  const [filter, setFilter] = useState('all'); // all, upcoming, past
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  
  const { tSync, currentLang } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const { events, loading, addEvent, deleteEvent } = useEvents();
  
  const isAdmin = isAuthenticated && user?.role === 'admin';

  const handleDeleteEvent = async (eventId, eventTitle) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'événement "${eventTitle}" ?`)) {
      try {
        await deleteEvent(eventId);
      } catch (error) {
        alert('Erreur lors de la suppression de l\'événement');
      }
    }
  };

  const handleAddEvent = async (eventData) => {
    try {
      await addEvent(eventData);
    } catch (error) {
      alert('Erreur lors de l\'ajout de l\'événement');
      throw error;
    }
  };

  const handleEditEvent = (eventId) => {
    setEditingEventId(eventId);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingEventId(null);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const filteredEvents = events.filter(event => {
    const matchesCategory = category === 'all' || event.category === category;
    const matchesSearch = searchQuery === '' || 
      event.title[currentLang]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description[currentLang]?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['all', 'spectacle', 'atelier', 'conférence', 'exposition', 'visite'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 to-orange-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {tSync('Événements')}
              </h1>
              <p className="text-xl text-amber-100">
                {tSync('Découvrez tous nos événements culturels')}
              </p>
            </div>
            {isAdmin && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-white text-amber-800 px-6 py-3 rounded-xl font-semibold hover:bg-amber-50 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                {tSync('Ajouter un événement')}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filtres et recherche */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={tSync('Rechercher un événement...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            {/* Filtre temporel */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none"
              >
                <option value="all">{tSync('Tous les événements')}</option>
                <option value="upcoming">{tSync('À venir')}</option>
                <option value="past">{tSync('Passés')}</option>
              </select>
            </div>

            {/* Filtre catégorie */}
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {tSync(cat === 'all' ? 'Toutes catégories' : cat)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Liste des événements */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-amber-600" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {tSync('Aucun événement trouvé')}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative"
              >
                {/* Admin Controls */}
                {isAdmin && (
                  <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleEditEvent(event.id);
                      }}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                      title={tSync('Modifier')}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteEvent(event.id, event.title[currentLang]);
                      }}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg"
                      title={tSync('Supprimer')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <Link href={`/events/${event.id}`} className="block">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    {event.imageUrl ? (
                      <img
                        src={event.imageUrl}
                        alt={event.title[currentLang]}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-600" />
                    )}
                    <div className="absolute top-4 left-4 bg-amber-600 px-3 py-1 rounded-full text-white text-xs font-semibold">
                      {tSync(event.category)}
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-700 transition-colors line-clamp-2">
                      {event.title[currentLang]}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {event.description[currentLang]}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar className="w-4 h-4 text-amber-600" />
                        <span>{formatDate(event.date)}</span>
                      </div>

                      {(event.startTime || event.endTime) && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Clock className="w-4 h-4 text-amber-600" />
                          <span>
                            {event.startTime && event.endTime 
                              ? `${event.startTime} - ${event.endTime}`
                              : event.startTime || event.endTime
                            }
                          </span>
                        </div>
                      )}

                      {event.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <MapPin className="w-4 h-4 text-amber-600" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-lg font-bold text-amber-600">
                        {event.price}
                      </span>
                      <span className="text-amber-700 font-semibold group-hover:translate-x-1 transition-transform">
                        {tSync('En savoir plus')} →
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Event Modal */}
      <AddEventModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddEvent}
      />

      {/* Edit Event Modal */}
      <EditEventModal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        eventId={editingEventId}
      />
    </div>
  );
}