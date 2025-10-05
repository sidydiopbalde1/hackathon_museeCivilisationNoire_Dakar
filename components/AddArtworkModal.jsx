'use client';

import { useState, useRef } from 'react';
import { X, Upload, Camera, Save } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
import Image from 'next/image';

export default function AddArtworkModal({ isOpen, onClose, onSubmit }) {
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
    period: '',
    origin: '',
    material: '',
    dimensions: '',
    imageFile: null,
    imagePreview: null
  });
  
  const [isLoading, setIsLoading] = useState(false);

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
      
      // Créer l'œuvre avec l'image base64
      const artworkData = {
        title: formData.title,
        description: formData.description,
        period: formData.period,
        origin: formData.origin,
        material: formData.material,
        dimensions: formData.dimensions,
        imageUrl: imageUrl
      };
      
      await onSubmit(artworkData);
      
      // Réinitialiser le formulaire
      setFormData({
        title: { fr: '', en: '', wo: '' },
        description: { fr: '', en: '', wo: '' },
        period: '',
        origin: '',
        material: '',
        dimensions: '',
        imageFile: null,
        imagePreview: null
      });
      onClose();
    } catch (error) {
      console.error('Erreur:', error);
      alert(error.message || 'Erreur lors de l\'ajout de l\'œuvre');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-amber-900">
            {tSync('Ajouter une nouvelle œuvre')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              {tSync('Image de l\'œuvre')} *
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

          {/* Other fields */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {tSync('Période')} *
              </label>
              <input
                type="text"
                value={formData.period}
                onChange={(e) => handleInputChange('period', e.target.value)}
                placeholder="Ex: XVe - XVIIIe siècle"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {tSync('Origine')} *
              </label>
              <input
                type="text"
                value={formData.origin}
                onChange={(e) => handleInputChange('origin', e.target.value)}
                placeholder="Ex: Mali, Nigeria..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {tSync('Matériaux')} *
              </label>
              <input
                type="text"
                value={formData.material}
                onChange={(e) => handleInputChange('material', e.target.value)}
                placeholder="Ex: Bois, fibres végétales"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {tSync('Dimensions')} *
              </label>
              <input
                type="text"
                value={formData.dimensions}
                onChange={(e) => handleInputChange('dimensions', e.target.value)}
                placeholder="Ex: 65 x 35 x 15 cm"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                required
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {tSync('Annuler')}
            </button>
            
            <button
              type="submit"
              disabled={isLoading || !formData.imageFile}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-700 text-white rounded-lg hover:from-amber-700 hover:to-orange-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isLoading ? tSync('Ajout en cours...') : tSync('Ajouter l\'œuvre')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}