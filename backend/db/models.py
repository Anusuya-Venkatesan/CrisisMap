from sqlalchemy import Column, Integer, String, Float, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Event(Base):
    __tablename__ = "events"
    
    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String)
    severity = Column(Float)
    lat = Column(Float)
    lng = Column(Float)
    source = Column(String)
    text = Column(String, nullable=True)
    detections = Column(JSON, nullable=True)
    cluster_id = Column(Integer, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    message = Column(String)
    severity = Column(Float)
    lat = Column(Float)
    lng = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
