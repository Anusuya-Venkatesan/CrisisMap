import { Event } from '../../lib/types';

interface HeatmapLayerProps {
  events: Event[];
}

export default function HeatmapLayer({ events }: HeatmapLayerProps) {
  const eventsByType = events.reduce((acc, event) => {
    acc[event.event_type] = (acc[event.event_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-lg font-bold text-white mb-3">Event Distribution</h3>
      <div className="space-y-2">
        {Object.entries(eventsByType).map(([type, count]) => (
          <div key={type} className="flex items-center justify-between">
            <span className="text-gray-300 capitalize">{type}</span>
            <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold">
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
