import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Event, Cluster, Alert, Anomaly } from '../lib/types';
import MapView from '../components/EmergencyControlRoom/MapView';
import AlertPanel from '../components/EmergencyControlRoom/AlertPanel';
import StatsPanel from '../components/EmergencyControlRoom/StatsPanel';
import ChatPanel from '../components/EmergencyControlRoom/ChatPanel';
import HeatmapLayer from '../components/EmergencyControlRoom/HeatmapLayer';

export default function Dashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const eventsData = await api.getEvents();
      setEvents(eventsData.events || []);
      setClusters(eventsData.clusters || []);
      
      const alertsData = await api.getAlerts();
      setAlerts(alertsData.alerts || []);
      setAnomalies(alertsData.anomalies || []);
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    const ws = api.connectWebSocket((data) => {
      if (data.type === 'update') {
        fetchData();
      }
    });

    return () => {
      clearInterval(interval);
      ws.close();
    };
  }, []);

  return (
    <div className="h-screen bg-gray-900 flex">
      <aside className="w-64 bg-gray-800 p-4 border-r border-gray-700">
        <h1 className="text-2xl font-bold text-white mb-6">CrisisMap AI</h1>
        <nav className="space-y-2">
          <div className="bg-blue-600 text-white px-4 py-2 rounded">Dashboard</div>
          <div className="text-gray-400 px-4 py-2 hover:bg-gray-700 rounded cursor-pointer">Events</div>
          <div className="text-gray-400 px-4 py-2 hover:bg-gray-700 rounded cursor-pointer">Analytics</div>
        </nav>
      </aside>

      <main className="flex-1 p-6 overflow-hidden">
        <div className="h-full grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-4">
            <StatsPanel events={events} />
            <div className="bg-gray-800 rounded-lg h-[calc(100%-120px)]">
              <MapView events={events} clusters={clusters} />
            </div>
          </div>

          <div className="space-y-4 overflow-y-auto">
            <div className="h-64">
              <AlertPanel alerts={alerts} anomalies={anomalies} />
            </div>
            <HeatmapLayer events={events} />
            <div className="h-80">
              <ChatPanel />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
