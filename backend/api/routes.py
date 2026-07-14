from fastapi import APIRouter, Depends, UploadFile, File, WebSocket
from sqlalchemy.orm import Session
from pydantic import BaseModel
from backend.db.database import get_db
from backend.db.models import Event, Alert
from backend.services.nlp_service import nlp_service
from backend.services.vision_service import vision_service
from backend.services.fusion_service import fusion_service
from backend.utils.anomaly import detect_anomalies
import json

router = APIRouter()

class TweetInput(BaseModel):
    text: str
    lat: float
    lng: float

@router.post("/ingest/tweet")
async def ingest_tweet(tweet: TweetInput, db: Session = Depends(get_db)):
    result = nlp_service.classify_tweet(tweet.text)
    
    event = Event(
        event_type=result['event_type'],
        severity=result['urgency'],
        lat=tweet.lat,
        lng=tweet.lng,
        source='twitter',
        text=tweet.text
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    
    return {
        'event_id': event.id,
        'event_type': result['event_type'],
        'urgency': result['urgency'],
        'confidence': result['confidence']
    }

@router.post("/ingest/image")
async def ingest_image(
    file: UploadFile = File(...),
    lat: float = 0.0,
    lng: float = 0.0,
    db: Session = Depends(get_db)
):
    image_bytes = await file.read()
    result = vision_service.detect_disaster(image_bytes)
    
    event = Event(
        event_type=result['event_type'],
        severity=result['severity'],
        lat=lat,
        lng=lng,
        source='satellite',
        detections=result['detections']
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    
    return {
        'event_id': event.id,
        'event_type': result['event_type'],
        'severity': result['severity'],
        'detections': result['detections']
    }

@router.get("/events")
async def get_events(db: Session = Depends(get_db)):
    clusters = fusion_service.cluster_events(db)
    events = db.query(Event).all()
    
    return {
        'events': [{
            'id': e.id,
            'event_type': e.event_type,
            'severity': e.severity,
            'lat': e.lat,
            'lng': e.lng,
            'cluster_id': e.cluster_id,
            'source': e.source,
            'timestamp': e.timestamp.isoformat()
        } for e in events],
        'clusters': clusters
    }

@router.get("/alerts")
async def get_alerts(db: Session = Depends(get_db)):
    alerts = db.query(Alert).order_by(Alert.timestamp.desc()).limit(20).all()
    anomalies = detect_anomalies(db)
    
    return {
        'alerts': [{
            'id': a.id,
            'message': a.message,
            'severity': a.severity,
            'lat': a.lat,
            'lng': a.lng,
            'timestamp': a.timestamp.isoformat()
        } for a in alerts],
        'anomalies': anomalies
    }

@router.websocket("/live")
async def websocket_endpoint(websocket: WebSocket, db: Session = Depends(get_db)):
    await websocket.accept()
    try:
        while True:
            events = db.query(Event).order_by(Event.timestamp.desc()).limit(10).all()
            data = {
                'type': 'update',
                'events': [{
                    'id': e.id,
                    'event_type': e.event_type,
                    'severity': e.severity,
                    'lat': e.lat,
                    'lng': e.lng
                } for e in events]
            }
            await websocket.send_text(json.dumps(data))
            await websocket.receive_text()
    except:
        pass
