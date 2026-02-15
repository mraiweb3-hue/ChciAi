import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { MessageSquare, User, Bot, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ConversationsPage() {
  const { t } = useLanguage();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    api.get('/conversations')
      .then(r => setConversations(r.data))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleString('cs-CZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    } catch { return iso; }
  };

  return (
    <DashboardLayout>
      <div data-testid="conversations-page">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-100" style={{ fontFamily: 'Plus Jakarta Sans' }}>{t('conversations.title')}</h1>
          <p className="text-sm text-slate-500 mt-1">{t('conversations.subtitle')}</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4"><MessageSquare className="w-7 h-7 text-slate-600" /></div>
            <p className="text-sm text-slate-500">{t('conversations.noResults')}</p>
          </div>
        ) : (
          <div className="space-y-3" data-testid="conversations-list">
            {conversations.map(conv => (
              <Card key={conv.id} className="bg-card border-border hover:border-primary/20 transition-all" data-testid={`conversation-${conv.id}`}>
                <CardContent className="p-0">
                  <button
                    onClick={() => setExpandedId(expandedId === conv.id ? null : conv.id)}
                    className="w-full p-5 flex items-center justify-between text-left"
                    data-testid={`conversation-toggle-${conv.id}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-medium text-slate-200">{conv.chatbot_name}</span>
                          <Badge variant="secondary" className="text-[10px] bg-white/5 text-slate-500 rounded-full">
                            {conv.messages?.length || 0} {t('conversations.messages')}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500">
                          {t('conversations.visitor')}: {conv.visitor_id?.slice(0, 8)}...
                          &nbsp;&middot;&nbsp;
                          {formatDate(conv.updated_at)}
                        </p>
                      </div>
                    </div>
                    {expandedId === conv.id ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                  </button>

                  {expandedId === conv.id && (
                    <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-3 max-h-96 overflow-y-auto" data-testid={`conversation-messages-${conv.id}`}>
                      {conv.messages?.length === 0 && (
                        <p className="text-xs text-slate-600 text-center py-4">No messages yet</p>
                      )}
                      {conv.messages?.map((msg, i) => (
                        <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? '' : ''}`}>
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-500/10' : 'bg-primary/10'}`}>
                            {msg.role === 'user' ? <User className="w-3.5 h-3.5 text-blue-400" /> : <Bot className="w-3.5 h-3.5 text-primary" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-slate-500 mb-0.5">{msg.role === 'user' ? 'Visitor' : 'AI'} &middot; {formatDate(msg.timestamp)}</p>
                            <p className="text-sm text-slate-300 leading-relaxed">{msg.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
