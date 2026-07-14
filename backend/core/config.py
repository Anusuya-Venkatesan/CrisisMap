from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./crisismap.db"
    BERT_MODEL: str = "distilbert-base-uncased"
    YOLO_MODEL: str = "yolov8n.pt"
    DBSCAN_EPS: float = 0.05
    DBSCAN_MIN_SAMPLES: int = 2
    
    class Config:
        env_file = ".env"

settings = Settings()
