'use client';

import { useState, useRef } from 'react';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import { QrCode, Download, Share2, Printer, Copy, X } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

export default function QRCodeGenerator({ artwork, className = '', iconOnly = false }) {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const qrRef = useRef(null);
  const { tSync } = useTranslation();

  // Générer l'URL complète de l'œuvre
  const getArtworkUrl = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}/artwork/${artwork.id || artwork._id}`;
  };

  // Générer le QR code
  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      const url = getArtworkUrl();
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#92400e', // amber-700
          light: '#fffbeb' // amber-50
        }
      });
      setQrCodeUrl(qrDataUrl);
      setShowModal(true);
    } catch (error) {
      console.error('Erreur génération QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Copier le lien dans le presse-papiers
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getArtworkUrl());
      alert(tSync('Lien copié dans le presse-papiers'));
    } catch (error) {
      console.error('Erreur copie:', error);
    }
  };

  // Télécharger le QR code comme image
  const downloadQRCode = async () => {
    if (qrCodeUrl) {
      try {
        // Méthode plus simple : télécharger directement l'image du QR code
        const link = document.createElement('a');
        link.download = `qr-code-${artwork.title?.fr || 'artwork'}.png`;
        link.href = qrCodeUrl;
        link.click();
      } catch (error) {
        console.error('Erreur téléchargement:', error);
        // Fallback avec html2canvas si nécessaire
        if (qrRef.current) {
          try {
            const canvas = await html2canvas(qrRef.current, {
              backgroundColor: '#ffffff',
              scale: 2,
              useCORS: true
            });
            
            const link = document.createElement('a');
            link.download = `qr-code-${artwork.title?.fr || 'artwork'}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
          } catch (canvasError) {
            console.error('Erreur html2canvas:', canvasError);
            alert(tSync('Erreur lors du téléchargement. Essayez avec un clic droit > Enregistrer l\'image.'));
          }
        }
      }
    }
  };

  // Imprimer le QR code
  const printQRCode = () => {
    if (qrRef.current) {
      const printWindow = window.open('', '_blank');
      const qrHtml = `
        <html>
          <head>
            <title>QR Code - ${artwork.title?.fr || 'Artwork'}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 20px;
                margin: 0;
              }
              .qr-container {
                display: inline-block;
                padding: 20px;
                border: 2px solid #92400e;
                border-radius: 10px;
                background: white;
              }
              .artwork-info {
                margin-top: 15px;
                color: #92400e;
              }
              .artwork-title {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 5px;
              }
              .artwork-url {
                font-size: 12px;
                color: #6b7280;
                word-break: break-all;
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <img src="${qrCodeUrl}" alt="QR Code" />
              <div class="artwork-info">
                <div class="artwork-title">${artwork.title?.fr || 'Sans titre'}</div>
                <div class="artwork-url">${getArtworkUrl()}</div>
              </div>
            </div>
          </body>
        </html>
      `;
      printWindow.document.write(qrHtml);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Partager sur les réseaux sociaux
  const shareOnSocial = async (platform) => {
    const url = getArtworkUrl();
    const title = artwork.title?.fr || 'Découvrez cette œuvre';
    
    // Pour les plateformes qui supportent le partage d'images
    if (platform === 'whatsapp' && qrCodeUrl) {
      try {
        // Convertir le QR code en blob pour WhatsApp
        const response = await fetch(qrCodeUrl);
        const blob = await response.blob();
        
        if (navigator.share && navigator.canShare({ files: [new File([blob], 'qr-code.png', { type: 'image/png' })] })) {
          await navigator.share({
            title: title,
            text: `${title} - Scannez ce QR code`,
            files: [new File([blob], 'qr-code.png', { type: 'image/png' })]
          });
          return;
        }
      } catch (error) {
        console.log('Partage natif non supporté, utilisation du lien');
      }
    }
    
    // Fallback classique avec URL
    let shareUrl = '';
    const textWithQR = `${title} - Scannez ce QR code ou visitez: ${url}`;
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(textWithQR)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(textWithQR)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <>
      {/* Bouton pour générer le QR code */}
      <button
        onClick={generateQRCode}
        disabled={isGenerating}
        className={`${iconOnly ? 'flex items-center justify-center' : 'flex items-center gap-2'} bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-all ${className} ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={iconOnly ? tSync('Générer QR Code') : undefined}
      >
        <QrCode className="w-5 h-5" />
        {!iconOnly && (isGenerating ? tSync('Génération...') : tSync('Générer QR Code'))}
      </button>

      {/* Modal du QR code */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-amber-900">
                {tSync('QR Code de l\'œuvre')}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* QR Code */}
            <div ref={qrRef} className="text-center mb-6 p-4 bg-amber-50 rounded-xl">
              {qrCodeUrl && (
                <>
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code" 
                    className="mx-auto mb-4"
                  />
                  <div className="text-sm text-amber-800">
                    <p className="font-semibold mb-1">{artwork.title?.fr || 'Sans titre'}</p>
                    <p className="text-xs break-all">{getArtworkUrl()}</p>
                  </div>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-4">
              {/* Actions principales */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={downloadQRCode}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 text-white px-4 py-3 rounded-lg transition-all"
                >
                  <Download className="w-4 h-4" />
                  {tSync('Télécharger')}
                </button>
                
                <button
                  onClick={printQRCode}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-4 py-3 rounded-lg transition-all"
                >
                  <Printer className="w-4 h-4" />
                  {tSync('Imprimer')}
                </button>
              </div>

              {/* Copier le lien */}
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center justify-center gap-2 bg-amber-800 hover:bg-amber-900 text-white px-4 py-3 rounded-lg transition-all"
              >
                <Copy className="w-4 h-4" />
                {tSync('Copier le lien')}
              </button>

              {/* Partage sur réseaux sociaux */}
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-3 text-center">
                  {tSync('Partager le QR code')}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => shareOnSocial('facebook')}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded text-sm transition-all border border-amber-700"
                  >
                    Facebook
                  </button>
                  <button
                    onClick={() => shareOnSocial('twitter')}
                    className="bg-amber-700 hover:bg-amber-800 text-white px-3 py-2 rounded text-sm transition-all border border-amber-800"
                  >
                    Twitter
                  </button>
                  <button
                    onClick={() => shareOnSocial('whatsapp')}
                    className="bg-amber-800 hover:bg-amber-900 text-white px-3 py-2 rounded text-sm transition-all border border-amber-900"
                  >
                    WhatsApp
                  </button>
                </div>
                <div className="mt-3 text-xs text-gray-500 text-center">
                  {tSync('Le QR code et le lien seront partagés')}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}