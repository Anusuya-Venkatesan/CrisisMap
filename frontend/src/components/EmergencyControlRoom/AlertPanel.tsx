import { AlertTriangle } from 'lucide-react';
import { Alert, Anomaly } from '../../lib/types';

interface AlertPanelProps {
  alerts: Alert[];
  anomalies: Anomaly[];
}

export default function AlertPanel({ alerts, anomalies }: AlertPanelProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 h-full overflow-y-auto">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <AlertTriangle className="text-red-500" />
        Active Alerts
      </h2>
      
      {anomalies.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-orange-400 mb-2">Anomalies</h3>
          {anomalies.map((anomaly, idx) => (
            <div key={idx} className="bg-red-900/30 border border-red-500 rounded p-3 mb-2">
              <p className="text-red-300 text-sm font-medium">{anomaly.message}</p>
              <p className="text-xs text-gray-400 mt-1">Severity: {anomaly.severity}</p>
            </div>
          ))}
        </div>
      )}
      
      <div className="space-y-2">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`rounded p-3 border ${
              alert.severity >= 8
                ? 'bg-red-900/20 border-red-500'
                : alert.severity >= 5
                ? 'bg-orange-900/20 border-orange-500'
                : 'bg-yellow-900/20 border-yellow-500'
            }`}
          >
            <p className="text-white text-sm font-medium">{alert.message}</p>
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>Severity: {alert.severity}</span>
              <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
