import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const RouteMapComponent = ({ artwork }) => {
  const [userPosition, setUserPosition] = useState(null);
  const [route, setRoute] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showRoute, setShowRoute] = useState(false);

  // Coordonnées du musée
  const museumPosition = artwork?.location ? 
    [artwork.location.latitude, artwork.location.longitude] : 
    [14.67862, -17.436026]; // Coordonnées par défaut du musée

  // Fonction pour obtenir la position de l'utilisateur
  const getUserLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas prise en charge par votre navigateur.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserPosition([latitude, longitude]);
        setLoading(false);
      },
      (error) => {
        setError(`Impossible d'obtenir la localisation: ${error.message}`);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Fonction pour tracer l'itinéraire (simulation)
  const getRoute = () => {
    if (!userPosition) {
      setError("Veuillez d'abord activer la géolocalisation.");
      return;
    }

    // Dans une application réelle, on utiliserait un service d'itinéraire comme OpenRouteService ou MapBox
    // Pour cette implémentation, nous simulons un itinéraire en ligne droite
    setRoute([
      userPosition,
      museumPosition
    ]);
    setShowRoute(true);
  };

  // Effacer l'itinéraire
  const clearRoute = () => {
    setRoute([]);
    setShowRoute(false);
    setUserPosition(null);
    setError(null);
  };

  // Icônes personnalisées
  const userIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const museumIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <div className="route-map-container">
      <div className="controls mb-4">
        {!userPosition ? (
          <button
            onClick={getUserLocation}
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              loading 
                ? 'bg-gray-300 text-gray-500' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {loading ? 'Localisation...' : 'Utiliser ma position actuelle'}
          </button>
        ) : (
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={getRoute}
              disabled={showRoute}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                showRoute 
                  ? 'bg-gray-300 text-gray-500' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Afficher l'itinéraire
            </button>
            
            <button
              onClick={clearRoute}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-all"
            >
              Effacer
            </button>
          </div>
        )}
        
        {error && (
          <div className="mt-2 p-2 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
      </div>

      <div className="map-wrapper" style={{ height: '400px', width: '100%', borderRadius: '8px' }}>
        <MapContainer 
          center={museumPosition} 
          zoom={13} 
          style={{ height: '100%', width: '100%', borderRadius: '8px' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Marqueur pour le musée */}
          <Marker position={museumPosition} icon={museumIcon}>
            <Popup>
              <div>
                <h3 className="font-bold">{artwork?.title?.fr || artwork?.title?.en || 'Musée des Civilisations Noires'}</h3>
                <p>{artwork?.location?.address || 'Musée des Civilisations Noires, Dakar'}</p>
              </div>
            </Popup>
          </Marker>
          
          {/* Marqueur pour la position de l'utilisateur */}
          {userPosition && (
            <Marker position={userPosition} icon={userIcon}>
              <Popup>
                <div>
                  <h3 className="font-bold">Votre position</h3>
                  <p>Point de départ de l'itinéraire</p>
                </div>
              </Popup>
            </Marker>
          )}
          
          {/* Ligne de l'itinéraire */}
          {showRoute && route.length > 0 && (
            <Polyline 
              positions={route} 
              color="#3e8ed0"
              weight={4}
              opacity={0.8}
            />
          )}
        </MapContainer>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-600">
        {userPosition && showRoute 
          ? "Itinéraire depuis votre position actuelle vers le musée" 
          : userPosition 
            ? "Cliquez sur 'Afficher l'itinéraire' pour tracer le chemin" 
            : "Activez la géolocalisation pour voir votre position sur la carte"}
      </div>
    </div>
  );
};

export default RouteMapComponent;