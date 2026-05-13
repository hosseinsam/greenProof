'use client';

import { useEffect } from 'react';
import { CircleMarker, MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';

type Coordinates = {
  lat: number;
  lng: number;
};

const DEFAULT_CENTER: Coordinates = { lat: 35.6892, lng: 51.389 };

function MapClickHandler({
  onPick
}: {
  onPick: (coords: Coordinates) => void;
}) {
  useMapEvents({
    click(event) {
      onPick({
        lat: Number(event.latlng.lat.toFixed(6)),
        lng: Number(event.latlng.lng.toFixed(6))
      });
    }
  });

  return null;
}

function RecenterMap({ center }: { center: Coordinates }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, Math.max(map.getZoom(), 15), { duration: 0.8 });
  }, [center, map]);

  return null;
}

export default function LeafletLocationPicker({
  value,
  onChange
}: {
  value: Coordinates | null;
  onChange: (coords: Coordinates) => void;
}) {
  const center = value ?? DEFAULT_CENTER;

  return (
    <div className="overflow-hidden rounded-[28px] border border-[color:var(--line)] bg-white">
      <div className="h-[320px] w-full">
        <MapContainer center={[center.lat, center.lng]} zoom={value ? 15 : 11} scrollWheelZoom className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onPick={onChange} />
          <RecenterMap center={center} />
          {value ? (
            <CircleMarker
              center={[value.lat, value.lng]}
              radius={12}
              pathOptions={{ color: '#173829', fillColor: '#d8e57b', fillOpacity: 0.92, weight: 3 }}
            />
          ) : null}
        </MapContainer>
      </div>
    </div>
  );
}
