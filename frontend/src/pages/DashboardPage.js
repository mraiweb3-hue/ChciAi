import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { Bot, MessageSquare, Users, Activity, Plus, ArrowRight, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(res => setStats(res.data))
      .catch(() => toast.error('Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { key: 'totalChatbots', icon: Bot, value: stats?.total_chatbots, color: 'text-primary', bg: 'bg-primary/10' },
    { key: 'activeChatbots', icon: Activity, value: stats?.active_chatbots, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { key: 'totalConversations', icon: MessageSquare, value: stats?.total_conversations, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { key: 'totalLeads', icon: Users, value: stats?.total_leads, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { key: 'conversationsToday', icon: TrendingUp, value: stats?.conversations_today, color: 'text-violet-400', bg: 'bg-violet-400/10' },
    { key: 'leadsToday', icon: Users, value: stats?.leads_today, color: 'text-rose-400', bg: 'bg-rose-400/10' },
  ];

  return (
    <DashboardLayout>
      <div data-testid="dashboard-page">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-100 mb-1" style={{ fontFamily: 'Plus Jakarta Sans' }}>
            {t('dashboard.welcome')}, {user?.company_name}
          </h1>
          <p className="text-sm text-slate-500">{t('dashboard.title')}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8" data-testid="stats-grid">
          {statCards.map(({ key, icon: Icon, value, color, bg }) => (
            <Card key={key} className="bg-card border-border hover:border-primary/20 transition-colors" data-testid={`stat-card-${key}`}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-slate-100" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                  {loading ? '-' : (value ?? 0)}
                </p>
                <p className="text-xs text-slate-500 mt-1">{t(`dashboard.${key}`)}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="bg-card border-border" data-testid="quick-actions-card">
            <CardContent className="p-6">
              <h3 className="text-base font-semibold text-slate-200 mb-4" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                {t('dashboard.quickActions')}
              </h3>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/chatbots')}
                  className="w-full justify-between bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 rounded-xl h-12 text-sm"
                  data-testid="quick-create-chatbot"
                >
                  <span className="flex items-center gap-2"><Plus className="w-4 h-4" /> {t('dashboard.createChatbot')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/conversations')}
                  className="w-full justify-between text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-xl h-12 text-sm"
                  data-testid="quick-view-conversations"
                >
                  <span className="flex items-center gap-2"><MessageSquare className="w-4 h-4" /> {t('dashboard.viewConversations')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/leads')}
                  className="w-full justify-between text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-xl h-12 text-sm"
                  data-testid="quick-view-leads"
                >
                  <span className="flex items-center gap-2"><Users className="w-4 h-4" /> {t('dashboard.viewLeads')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border" data-testid="recent-activity-card">
            <CardContent className="p-6">
              <h3 className="text-base font-semibold text-slate-200 mb-4" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                {t('dashboard.recentActivity')}
              </h3>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                  <Activity className="w-5 h-5 text-slate-600" />
                </div>
                <p className="text-sm text-slate-500">
                  {stats?.total_conversations === 0 ? 'No activity yet. Create your first AI employee!' : `${stats?.total_conversations || 0} total conversations`}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
