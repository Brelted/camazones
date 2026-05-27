import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';

/**
 * Hook de géolocalisation
 *
 * Retourne : { location, error, loading, refresh, permission }
 * location = { latitude, longitude, city? }
 */
export default function useLocation() {
  const [location,   setLocation]   = useState(null);
  const [error,      setError]      = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [permission, setPermission] = useState(null); // 'granted' | 'denied' | null

  const requestLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1 — Demander la permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermission(status);

      if (status !== 'granted') {
        setError('Permission de localisation refusée');
        setLoading(false);
        return;
      }

      // 2 — Obtenir la position actuelle
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = pos.coords;

      // 3 — Géocodage inverse (ville)
      let city = null;
      try {
        const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
        city = place?.city || place?.subregion || place?.region || null;
      } catch {
        // géocodage non critique
      }

      setLocation({ latitude, longitude, city });
    } catch (err) {
      setError('Impossible d\'obtenir votre position');
    } finally {
      setLoading(false);
    }
  }, []);

  // Calcul de distance entre deux coordonnées (Haversine, résultat en km)
  function distanceTo(lat2, lon2) {
    if (!location) return null;
    const R  = 6371;
    const dLat = toRad(lat2 - location.latitude);
    const dLon = toRad(lon2 - location.longitude);
    const a  = Math.sin(dLat / 2) ** 2
              + Math.cos(toRad(location.latitude))
              * Math.cos(toRad(lat2))
              * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  return {
    location,
    error,
    loading,
    permission,
    refresh:    requestLocation,
    distanceTo,
  };
}

function toRad(deg) { return (deg * Math.PI) / 180; }
