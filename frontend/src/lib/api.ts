const API_BASE = 'http://localhost:8000/api';

export const api = {
  async getEvents() {
    const res = await fetch(`${API_BASE}/events`);
    return res.json();
  },
  
  async getAlerts() {
    const res = await fetch(`${API_BASE}/alerts`);
    return res.json();
  },
  
  async ingestTweet(text: string, lat: number, lng: number) {
    const res = await fetch(`${API_BASE}/ingest/tweet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, lat, lng })
    });
    return res.json();
  },
  
  connectWebSocket(onMessage: (data: any) => void) {
    const ws = new WebSocket('ws://localhost:8000/api/live');
    ws.onmessage = (event) => onMessage(JSON.parse(event.data));
    ws.onopen = () => ws.send('ping');
    return ws;
  }
};
