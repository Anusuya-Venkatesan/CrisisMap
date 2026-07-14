import { Activity, MapPin, AlertCircle } from 'lucide-react';
import { Event } from '../../lib/types';

interface StatsPanelProps {
  events: Event[];
}

export default function StatsPanel({ events }: StatsPanelProps) {
  const totalEvents = events.length;
  const highSeverity = events.filter(e => e.severity >= 8).length;
  const avgSeverity = events.length > 0
    ? (events.reduce((sum, e) => sum + e.severity, 0) / events.length).toFixed(1)
    : '0';

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="text-blue-400" size={20} />
          <span className="text-gray-400 text-sm">Total Events</span>
        </div>
        <p className="text-3xl font-bold text-white">{totalEvents}</p>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="text-red-400" size={20} />
          <span className="text-gray-400 text-sm">High Severity</span>
        </div>
        <p className="text-3xl font-bold text-red-400">{highSeverity}</p>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="text-green-400" size={20} />
          <span className="text-gray-400 text-sm">Avg Severity</span>
        </div>
        <p className="text-3xl font-bold text-green-400">{avgSeverity}</p>
      </div>
    </div>
  );
}
