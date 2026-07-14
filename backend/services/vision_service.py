from ultralytics import YOLO
import cv2
import numpy as np
from backend.core.config import settings

class VisionService:
    def __init__(self):
        self.model = YOLO(settings.YOLO_MODEL)
    
    def detect_disaster(self, image_bytes: bytes):
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        results = self.model(img, verbose=False)
        
        detections = []
        severity_score = 0
        
        for result in results:
            boxes = result.boxes
            for box in boxes:
                conf = float(box.conf[0])
                cls = int(box.cls[0])
                class_name = self.model.names[cls]
                
                detections.append({
                    'class': class_name,
                    'confidence': round(conf, 2),
                    'bbox': box.xyxy[0].tolist()
                })
                
                severity_score += conf * 2
        
        event_type = 'flood' if len(detections) > 3 else 'cyclone' if len(detections) > 0 else 'unknown'
        severity = min(10, severity_score)
        
        return {
            'event_type': event_type,
            'severity': round(severity, 2),
            'detections': detections,
            'detection_count': len(detections)
        }

vision_service = VisionService()
