from transformers import pipeline
from backend.core.config import settings

class NLPService:
    def __init__(self):
        self.classifier = pipeline("text-classification", model=settings.BERT_MODEL)
        self.disaster_keywords = {
            'flood': ['flood', 'flooding', 'water', 'submerged', 'inundated'],
            'cyclone': ['cyclone', 'hurricane', 'storm', 'wind', 'tornado'],
            'landslide': ['landslide', 'mudslide', 'collapse', 'debris']
        }
    
    def classify_tweet(self, text: str):
        text_lower = text.lower()
        
        event_type = 'unknown'
        for disaster, keywords in self.disaster_keywords.items():
            if any(kw in text_lower for kw in keywords):
                event_type = disaster
                break
        
        urgency_keywords = ['urgent', 'emergency', 'help', 'sos', 'critical', 'severe', 'danger']
        keyword_score = sum(1 for kw in urgency_keywords if kw in text_lower)
        
        result = self.classifier(text[:512])[0]
        confidence = result['score'] if result['label'] == 'POSITIVE' else 1 - result['score']
        
        urgency = min(10, (confidence * 5) + (keyword_score * 1.5))
        
        return {
            'event_type': event_type,
            'urgency': round(urgency, 2),
            'confidence': round(confidence, 2)
        }

nlp_service = NLPService()
