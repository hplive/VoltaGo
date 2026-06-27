'use client'

import dynamic from 'next/dynamic'
import type { MapPoint } from './leaflet-map'

const LeafletMap = dynamic(() => import('./leaflet-map'), {
  ssr: false,
  loading: () => (
    <div
      style={{ height: 220, borderRadius: 16 }}
      className="w-full bg-[#EFF3F0] animate-pulse flex items-center justify-center"
    >
      <span className="text-sm text-[#6B7A72]">A carregar mapa…</span>
    </div>
  ),
})

interface MapViewProps {
  center: [number, number]
  zoom?: number
  points?: MapPoint[]
  route?: [number, number][]
  height?: number
}

export function MapView(props: MapViewProps) {
  return <LeafletMap {...props} />
}
