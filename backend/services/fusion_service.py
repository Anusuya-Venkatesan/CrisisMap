from sklearn.cluster import DBSCAN
import numpy as np
from sqlalchemy.orm import Session
from backend.db.models import Event, Alert
from backend.core.config import settings

class FusionService:
    def cluster_events(self, db: Session):
        events = db.query(Event).all()
        
        if len(events) < 2:
            return []
        
        coords = np.array([[e.lat, e.lng] for e in events])
        
        clustering = DBSCAN(
            eps=settings.DBSCAN_EPS,
            min_samples=settings.DBSCAN_MIN_SAMPLES
        ).fit(coords)
        
        for event, cluster_id in zip(events, clustering.labels_):
            event.cluster_id = int(cluster_id)
        
        db.commit()
        
        clusters = {}
        for event in events:
            if event.cluster_id not in clusters:
                clusters[event.cluster_id] = {
                    'events': [],
                    'total_severity': 0,
                    'lat': 0,
                    'lng': 0
                }
            clusters[event.cluster_id]['events'].append(event)
            clusters[event.cluster_id]['total_severity'] += event.severity
            clusters[event.cluster_id]['lat'] += event.lat
            clusters[event.cluster_id]['lng'] += event.lng
        
        result = []
        for cluster_id, data in clusters.items():
            if cluster_id == -1:
                continue
            
            count = len(data['events'])
            avg_severity = data['total_severity'] / count
            avg_lat = data['lat'] / count
            avg_lng = data['lng'] / count
            
            result.append({
                'cluster_id': cluster_id,
                'severity': round(avg_severity, 2),
                'event_count': count,
                'lat': avg_lat,
                'lng': avg_lng,
                'event_type': data['events'][0].event_type
            })
            
            if avg_severity > 7:
                alert = Alert(
                    message=f"High severity {data['events'][0].event_type} detected",
                    severity=avg_severity,
                    lat=avg_lat,
                    lng=avg_lng
                )
                db.add(alert)
        
        db.commit()
        return result

fusion_service = FusionService()
