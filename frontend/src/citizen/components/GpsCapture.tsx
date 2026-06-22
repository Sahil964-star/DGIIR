import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Override Leaflet's marker icon with a premium inline SVG icon
const mapPinIcon = L.divIcon({
  html: `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-8 h-8 bg-indigo-500/30 rounded-full animate-ping"></div>
      <div class="w-8 h-8 bg-indigo-600 dark:bg-indigo-500 rounded-full border-2 border-white dark:border-slate-800 shadow-md flex items-center justify-center text-white">
        <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      </div>
    </div>
  `,
  className: 'custom-map-pin',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

interface GpsCoords {
  lat: number;
  lng: number;
  accuracy?: number;
}

interface Props {
  onChange: (coords: GpsCoords | null) => void;
}

export default function GpsCapture({ onChange }: Props) {
  const [loading, setLoading]       = useState(false);
  const [coords, setCoords]         = useState<GpsCoords | null>(null);
  const [error, setError]           = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef          = useRef<L.Map | null>(null);
  const markerRef       = useRef<L.Marker | null>(null);

  // Delhi coordinates as a default fallback
  const defaultLatLng: [number, number] = [28.6139, 77.2090];

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create Map
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
    }).setView(defaultLatLng, 12);

    // Standard OpenStreetMap tiles (supports light/dark theme beautifully)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 20,
    }).addTo(map);

    // Add custom zoom control at top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    mapRef.current = map;

    // Handle Map click to pin custom coordinates
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      updateMarker(lat, lng);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const updateMarker = (lat: number, lng: number, accuracy?: number) => {
    if (!mapRef.current) return;

    const newCoords: GpsCoords = { lat, lng, accuracy };
    setCoords(newCoords);
    onChange(newCoords);

    // Move or add marker
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      const marker = L.marker([lat, lng], { icon: mapPinIcon, draggable: true }).addTo(mapRef.current);
      marker.on('dragend', () => {
        const position = marker.getLatLng();
        updateMarker(position.lat, position.lng);
      });
      markerRef.current = marker;
    }

    mapRef.current.panTo([lat, lng]);
  };

  const captureLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        updateMarker(latitude, longitude, accuracy);
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 16);
        }
        setLoading(false);
      },
      (err) => {
        console.error('GPS Capture error:', err);
        setError('Unable to fetch location. Please check browser permissions.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const clearLocation = () => {
    setCoords(null);
    setError(null);
    onChange(null);

    if (markerRef.current && mapRef.current) {
      mapRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
      mapRef.current.setView(defaultLatLng, 12);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 p-4 space-y-3 flex flex-col">
      <div className="flex items-center gap-3">
        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
          coords ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
        }`}>
          {coords && (
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          )}
        </div>
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {coords ? 'Location Pinned' : 'Geotag Complaint'}
        </span>

        <div className="ml-auto flex gap-2">
          {coords && (
            <button
              type="button"
              onClick={clearLocation}
              className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
            >
              ✕ Clear
            </button>
          )}
          <button
            type="button"
            onClick={captureLocation}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-55 transition-colors"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-0.5 mr-1 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Locating...
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                GPS Autofill
              </>
            )}
          </button>
        </div>
      </div>

      {/* Leaflet Map Box */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-44 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-inner z-10"
      />

      <p className="text-[11px] text-slate-400 dark:text-slate-500">
        💡 Use GPS Autofill or click/drag on the map to manually set the location.
      </p>

      {coords && (
        <div className="text-xs text-slate-500 dark:text-slate-400 space-y-0.5 pt-1 border-t border-slate-100 dark:border-slate-800">
          <p>Latitude: <span className="font-semibold text-slate-700 dark:text-slate-300">{coords.lat.toFixed(6)}</span></p>
          <p>Longitude: <span className="font-semibold text-slate-700 dark:text-slate-300">{coords.lng.toFixed(6)}</span></p>
          {coords.accuracy != null && (
            <p>GPS Precision: <span className="font-semibold text-slate-700 dark:text-slate-300">± {coords.accuracy.toFixed(1)}m</span></p>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 dark:text-red-400 font-medium">{error}</p>
      )}
    </div>
  );
}
