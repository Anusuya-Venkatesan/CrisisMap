export interface Event {
  id: number;
  event_type: string;
  severity: number;
  lat: number;
  lng: number;
  cluster_id: number | null;
  source: string;
  timestamp: string;
}

export interface Cluster {
  cluster_id: number;
  severity: number;
  event_count: number;
  lat: number;
  lng: number;
  event_type: string;
}

export interface Alert {
  id: number;
  message: string;
  severity: number;
  lat: number;
  lng: number;
  timestamp: string;
}

export interface Anomaly {
  type: string;
  message: string;
  severity: number;
}
