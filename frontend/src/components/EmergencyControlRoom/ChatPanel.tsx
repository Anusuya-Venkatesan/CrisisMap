import { useState } from 'react';
import { Send } from 'lucide-react';

export default function ChatPanel() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ text: string; type: 'user' | 'bot' }>>([
    { text: 'AI Assistant ready. Ask about threats, locations, or severity.', type: 'bot' }
  ]);

  const handleSend = () => {
    if (!query.trim()) return;
    
    setMessages([...messages, { text: query, type: 'user' }]);
    
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: 'Query processed. Check map for high-threat zones.',
        type: 'bot'
      }]);
    }, 500);
    
    setQuery('');
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 h-full flex flex-col">
      <h2 className="text-xl font-bold text-white mb-4">AI Query</h2>
      
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded ${
              msg.type === 'user'
                ? 'bg-blue-600 text-white ml-8'
                : 'bg-gray-700 text-gray-200 mr-8'
            }`}
          >
            <p className="text-sm">{msg.text}</p>
          </div>
        ))}
      </div>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about threats..."
          className="flex-1 bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
