'use client'

import { MapContainer, TileLayer, CircleMarker, Polyline, Popup, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export interface MapPoint {
  lat: number
  lng: number
  label?: string
  color?: string
  primary?: boolean
}

interface LeafletMapProps {
  center: [number, number]
  zoom?: number
  points?: MapPoint[]
  route?: [number, number][]
  height?: number
}

export default function LeafletMap({
  center,
  zoom = 14,
  points = [],
  route,
  height = 220,
}: LeafletMapProps) {
  return (
    <div style={{ height, width: '100%', borderRadius: 16, overflow: 'hidden' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {route && route.length > 1 && (
          <Polyline
            positions={route}
            pathOptions={{ color: '#1FA971', weight: 4, opacity: 0.8 }}
          />
        )}
        {points.map((p, i) => (
          <CircleMarker
            key={i}
            center={[p.lat, p.lng]}
            radius={p.primary ? 11 : 8}
            pathOptions={{
              color: '#ffffff',
              weight: 2.5,
              fillColor: p.color || (p.primary ? '#E0A23B' : '#1FA971'),
              fillOpacity: 1,
            }}
          >
            {p.label && (
              <Tooltip direction="top" offset={[0, -8]} opacity={1} permanent={!!p.primary}>
                {p.label}
              </Tooltip>
            )}
            {p.label && <Popup>{p.label}</Popup>}
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}
