from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from backend.db.models import Event

def detect_anomalies(db: Session):
    recent_time = datetime.utcnow() - timedelta(minutes=10)
    recent_events = db.query(Event).filter(Event.timestamp >= recent_time).all()
    
    anomalies = []
    if len(recent_events) > 10:
        anomalies.append({
            'type': 'spike',
            'message': f'Unusual spike: {len(recent_events)} events in 10 minutes',
            'severity': 8.0
        })
    
    high_severity = db.query(Event).filter(Event.severity > 8).all()
    if len(high_severity) > 3:
        anomalies.append({
            'type': 'high_severity',
            'message': f'{len(high_severity)} high-severity events detected',
            'severity': 9.0
        })
    
    return anomalies
