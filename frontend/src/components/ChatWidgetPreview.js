import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Minus } from 'lucide-react';

export default function ChatWidgetPreview({ config = {} }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  const {
    name = 'AI Asistent',
    primary_color = '#6366F1',
    welcome_message = 'Dobry den! Jak vam mohu pomoci?',
  } = config;

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: 'assistant', content: welcome_message }]);
    }
  }, [open, welcome_message, messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Dekuji za vasi zpravu. Jak vam mohu dale pomoci?' }]);
    }, 1000);
  };

  return (
    <div className="relative" data-testid="chat-widget-preview">
      {open && (
        <div
          className="absolute bottom-16 right-0 w-80 h-[420px] rounded-2xl overflow-hidden flex flex-col shadow-2xl animate-scale-in border border-white/10"
          style={{ background: '#0F172A' }}
          data-testid="chat-widget-panel"
        >
          <div
            className="px-4 py-3 flex items-center justify-between shrink-0"
            style={{ backgroundColor: primary_color }}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{name}</p>
                <p className="text-xs text-white/70">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setOpen(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors" data-testid="chat-minimize-btn">
                <Minus className="w-4 h-4 text-white" />
              </button>
              <button onClick={() => { setOpen(false); setMessages([]); }} className="p-1 hover:bg-white/10 rounded-full transition-colors" data-testid="chat-close-btn">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3" data-testid="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                    msg.role === 'user'
                      ? 'text-white rounded-br-md'
                      : 'bg-white/10 text-slate-200 rounded-bl-md'
                  }`}
                  style={msg.role === 'user' ? { backgroundColor: primary_color } : {}}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Napiste zpravu..."
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary/50"
                data-testid="chat-input"
              />
              <button
                onClick={handleSend}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 transition-colors"
                style={{ backgroundColor: primary_color }}
                data-testid="chat-send-btn"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-center text-[10px] text-slate-600 mt-2">Powered by CHCI AI</p>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-all hover:scale-105 widget-bubble"
        style={{ backgroundColor: primary_color, boxShadow: `0 0 24px ${primary_color}40` }}
        data-testid="chat-bubble-btn"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    </div>
  );
}
