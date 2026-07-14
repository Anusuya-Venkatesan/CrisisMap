import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Event, Cluster } from '../../lib/types';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  events: Event[];
  clusters: Cluster[];
}

export default function MapView({ events, clusters }: MapViewProps) {
  const getSeverityColor = (severity: number) => {
    if (severity >= 8) return '#ef4444';
    if (severity >= 5) return '#f59e0b';
    return '#eab308';
  };

  return (
    <MapContainer center={[11.0168, 76.9558]} zoom={7} className="h-full w-full">
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap'
      />
      {events.map((event) => (
        <CircleMarker
          key={event.id}
          center={[event.lat, event.lng]}
          radius={8}
          fillColor={getSeverityColor(event.severity)}
          color="#fff"
          weight={1}
          fillOpacity={0.8}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-bold">{event.event_type}</p>
              <p>Severity: {event.severity}</p>
              <p>Source: {event.source}</p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
      {clusters.map((cluster) => (
        <CircleMarker
          key={`cluster-${cluster.cluster_id}`}
          center={[cluster.lat, cluster.lng]}
          radius={15}
          fillColor={getSeverityColor(cluster.severity)}
          color="#fff"
          weight={2}
          fillOpacity={0.5}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-bold">Cluster {cluster.cluster_id}</p>
              <p>Events: {cluster.event_count}</p>
              <p>Severity: {cluster.severity}</p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
