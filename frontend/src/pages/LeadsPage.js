import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { Users, Trash2, Mail, Phone, MessageSquare, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function LeadsPage() {
  const { t } = useLanguage();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get('/leads')
      .then(r => setLeads(r.data))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/leads/${id}`);
      toast.success('Deleted');
      load();
    } catch { toast.error('Error'); }
  };

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleString('cs-CZ', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch { return iso; }
  };

  return (
    <DashboardLayout>
      <div data-testid="leads-page">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-100" style={{ fontFamily: 'Plus Jakarta Sans' }}>{t('leads.title')}</h1>
          <p className="text-sm text-slate-500 mt-1">{t('leads.subtitle')}</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
        ) : leads.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4"><Users className="w-7 h-7 text-slate-600" /></div>
            <p className="text-sm text-slate-500">{t('leads.noResults')}</p>
          </div>
        ) : (
          <div className="space-y-3" data-testid="leads-list">
            {leads.map(lead => (
              <Card key={lead.id} className="bg-card border-border hover:border-primary/20 transition-all" data-testid={`lead-${lead.id}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-200 mb-1">{lead.name}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {lead.email}</span>
                          {lead.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {lead.phone}</span>}
                        </div>
                        {lead.message && (
                          <p className="text-xs text-slate-400 mt-2 bg-white/5 rounded-lg p-2 flex items-start gap-1.5">
                            <MessageSquare className="w-3 h-3 shrink-0 mt-0.5" /> {lead.message}
                          </p>
                        )}
                        <p className="text-[10px] text-slate-600 mt-2">{formatDate(lead.created_at)}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(lead.id)} className="text-slate-500 hover:text-red-400 h-8 w-8 p-0" data-testid={`delete-lead-${lead.id}`}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
