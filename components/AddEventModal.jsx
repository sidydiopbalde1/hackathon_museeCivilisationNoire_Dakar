'use client';

import { useState, useRef } from 'react';
import { X, Upload, Save, Calendar, Clock, MapPin } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
import Image from 'next/image';

export default function AddEventModal({ isOpen, onClose, onSubmit }) {
  const { currentLang, tSync } = useTranslation();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: {
      fr: '',
      en: '',
      wo: ''
    },
    description: {
      fr: '',
      en: '',
      wo: ''
    },
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    category: 'exposition',
    price: 'Gratuit',
    capacity: '',
    imageFile: null,
    imagePreview: null
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [createdEvent, setCreatedEvent] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const categories = [
    { value: 'exposition', label: 'Exposition' },
    { value: 'conference', label: 'Conférence' },
    { value: 'atelier', label: 'Atelier' },
    { value: 'spectacle', label: 'Spectacle' },
    { value: 'visite', label: 'Visite guidée' }
  ];

  const handleInputChange = (field, value, lang = null) => {
    if (lang) {
      setFormData(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [lang]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Convertir l'image en base64
      let imageUrl = '';
      if (formData.imageFile) {
        imageUrl = await convertToBase64(formData.imageFile);
      }
      
      // Créer l'événement avec l'image base64
      const eventData = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
        category: formData.category,
        price: formData.price,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        imageUrl: imageUrl
      };
      
      const newEvent = await onSubmit(eventData);
      
      // Afficher le succès avec l'événement créé
      setCreatedEvent(newEvent);
      setShowSuccess(true);
      
      // Fermer le modal principal après 2 secondes
      setTimeout(() => {
        setShowSuccess(false);
        setCreatedEvent(null);
        onClose();
      }, 2000);
      
      // Réinitialiser le formulaire
      setFormData({
        title: { fr: '', en: '', wo: '' },
        description: { fr: '', en: '', wo: '' },
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        category: 'exposition',
        price: 'Gratuit',
        capacity: '',
        imageFile: null,
        imagePreview: null
      });
    } catch (error) {
      console.error('Erreur:', error);
      alert(error.message || 'Erreur lors de l\'ajout de l\'événement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowSuccess(false);
    setCreatedEvent(null);
    // Réinitialiser le formulaire
    setFormData({
      title: { fr: '', en: '', wo: '' },
      description: { fr: '', en: '', wo: '' },
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      category: 'exposition',
      price: 'Gratuit',
      capacity: '',
      imageFile: null,
      imagePreview: null
    });
    onClose();
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setCreatedEvent(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-amber-900">
            {tSync('Ajouter un nouvel événement')}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              {tSync('Image de l\'événement')}
            </label>
            
            <div className="flex gap-6">
              {/* Upload Button */}
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-48 border-2 border-dashed border-amber-300 rounded-xl flex flex-col items-center justify-center hover:border-amber-500 transition-colors"
                >
                  <Upload className="w-12 h-12 text-amber-600 mb-2" />
                  <span className="text-amber-700 font-medium">
                    {tSync('Cliquer pour télécharger')}
                  </span>
                  <span className="text-sm text-gray-500 mt-1">
                    {tSync('PNG, JPG, JPEG jusqu\'à 10MB')}
                  </span>
                </button>
              </div>

              {/* Image Preview */}
              {formData.imagePreview && (
                <div className="flex-1">
                  <div className="h-48 relative rounded-xl overflow-hidden">
                    <Image
                      src={formData.imagePreview}
                      alt="Prévisualisation"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Titles in 3 languages */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {tSync('Titre (Français)')} *
              </label>
              <input
                type="text"
                value={formData.title.fr}
                onChange={(e) => handleInputChange('title', e.target.value, 'fr')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {tSync('Titre (English)')} *
              </label>
              <input
                type="text"
                value={formData.title.en}
                onChange={(e) => handleInputChange('title', e.target.value, 'en')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {tSync('Titre (Wolof)')} *
              </label>
              <input
                type="text"
                value={formData.title.wo}
                onChange={(e) => handleInputChange('title', e.target.value, 'wo')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                required
              />
            </div>
          </div>

          {/* Descriptions in 3 languages */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {tSync('Description (Français)')} *
              </label>
              <textarea
                value={formData.description.fr}
                onChange={(e) => handleInputChange('description', e.target.value, 'fr')}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {tSync('Description (English)')} *
              </label>
              <textarea
                value={formData.description.en}
                onChange={(e) => handleInputChange('description', e.target.value, 'en')}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {tSync('Description (Wolof)')} *
              </label>
              <textarea
                value={formData.description.wo}
                onChange={(e) => handleInputChange('description', e.target.value, 'wo')}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                required
              />
            </div>
          </div>

          {/* Event details */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                {tSync('Date')} *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                {tSync('Heure de début')}
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                {tSync('Heure de fin')}
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                {tSync('Lieu')}
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Ex: Salle de conférence, Auditorium..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {tSync('Catégorie')} *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                required
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {tSync(cat.label)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {tSync('Prix')}
              </label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="Ex: Gratuit, 5000 FCFA..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {tSync('Capacité')}
              </label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => handleInputChange('capacity', e.target.value)}
                placeholder="Ex: 50, 100..."
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {tSync('Annuler')}
            </button>
            
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-700 text-white rounded-lg hover:from-amber-700 hover:to-orange-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isLoading ? tSync('Ajout en cours...') : tSync('Ajouter l\'événement')}
            </button>
          </div>
        </form>
      </div>

      {/* Modal de succès */}
      {showSuccess && createdEvent && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-10 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {tSync('Événement ajouté avec succès !')}
              </h3>
              <p className="text-gray-600">
                {tSync('L\'événement')} "{createdEvent.title?.fr}" {tSync('a été créé')}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCloseSuccess}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {tSync('Continuer')}
              </button>
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                {tSync('Fermer')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}