'use client';

import { useState } from 'react';
import { Search, Calendar, Users, Mail, Phone, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/contexts/TranslationContext';

export default function MyReservationsPage() {
  const [email, setEmail] = useState('');
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { tSync } = useTranslation();

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      const response = await fetch(`/api/reservations?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      
      if (response.ok) {
        setReservations(data);
      } else {
        setReservations([]);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservationNumber) => {
    if (!confirm(tSync('Êtes-vous sûr de vouloir annuler cette réservation ?'))) {
      return;
    }

    try {
      const response = await fetch(`/api/reservations/${reservationNumber}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Recharger les réservations
        handleSearch({ preventDefault: () => {} });
        alert(tSync('Réservation annulée avec succès'));
      } else {
        alert(tSync('Erreur lors de l\'annulation'));
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert(tSync('Erreur lors de l\'annulation'));
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      confirmed: {
        icon: CheckCircle,
        color: 'bg-green-100 text-green-800',
        text: tSync('Confirmée')
      },
      pending: {
        icon: AlertCircle,
        color: 'bg-yellow-100 text-yellow-800',
        text: tSync('En attente')
      },
      cancelled: {
        icon: XCircle,
        color: 'bg-red-100 text-red-800',
        text: tSync('Annulée')
      }
    };

    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${badge.color}`}>
        <Icon className="w-4 h-4" />
        {badge.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 to-orange-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {tSync('Mes Réservations')}
          </h1>
          <p className="text-xl text-amber-100">
            {tSync('Consultez et gérez vos réservations')}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Formulaire de recherche */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {tSync('Rechercher mes réservations')}
          </h2>
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={tSync('Entrez votre email')}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {tSync('Recherche...')}
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  {tSync('Rechercher')}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Résultats */}
        {searched && (
          <>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-12 h-12 animate-spin text-amber-600" />
              </div>
            ) : reservations.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {tSync('Aucune réservation trouvée pour cet email')}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {reservations.length} {tSync('réservation(s) trouvée(s)')}
                </h3>
                {reservations.map((reservation) => (
                  <div
                    key={reservation._id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {reservation.eventTitle}
                          </h3>
                          <p className="text-sm text-gray-500 font-mono">
                            {reservation.reservationNumber}
                          </p>
                        </div>
                        {getStatusBadge(reservation.status)}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-3 text-gray-700">
                          <Calendar className="w-5 h-5 text-amber-600" />
                          <div>
                            <p className="text-xs text-gray-500">{tSync('Date de l\'événement')}</p>
                            <p className="font-semibold">
                              {new Date(reservation.eventDate).toLocaleDateString('fr-FR', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-gray-700">
                          <Users className="w-5 h-5 text-amber-600" />
                          <div>
                            <p className="text-xs text-gray-500">{tSync('Nombre de personnes')}</p>
                            <p className="font-semibold">{reservation.numberOfPeople} {tSync('personne(s)')}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-gray-700">
                          <Mail className="w-5 h-5 text-amber-600" />
                          <div>
                            <p className="text-xs text-gray-500">{tSync('Email')}</p>
                            <p className="font-semibold">{reservation.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-gray-700">
                          <Phone className="w-5 h-5 text-amber-600" />
                          <div>
                            <p className="text-xs text-gray-500">{tSync('Téléphone')}</p>
                            <p className="font-semibold">{reservation.phone}</p>
                          </div>
                        </div>
                      </div>

                      {reservation.notes && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <p className="text-sm text-gray-600">
                            <strong>{tSync('Notes')}:</strong> {reservation.notes}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-sm text-gray-500">{tSync('Montant total')}</p>
                          <p className="text-2xl font-bold text-amber-600">{reservation.totalAmount}</p>
                        </div>
                        {reservation.status === 'confirmed' && (
                          <button
                            onClick={() => handleCancelReservation(reservation.reservationNumber)}
                            className="text-red-600 hover:text-red-700 font-semibold px-4 py-2 rounded-lg hover:bg-red-50 transition-all"
                          >
                            {tSync('Annuler la réservation')}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Lien vers les événements */}
        <div className="mt-12 text-center">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-900 font-semibold"
          >
            {tSync('Découvrir tous les événements')} →
          </Link>
        </div>
      </div>
    </div>
  );
}