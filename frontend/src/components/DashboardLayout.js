import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Bot, MessageSquare, Users, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const navItems = [
  { key: 'dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { key: 'chatbots', icon: Bot, path: '/chatbots' },
  { key: 'conversations', icon: MessageSquare, path: '/conversations' },
  { key: 'leads', icon: Users, path: '/leads' },
  { key: 'settings', icon: Settings, path: '/settings' },
];

export default function DashboardLayout({ children }) {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex" data-testid="dashboard-layout">
      <aside
        className={`fixed left-0 top-0 h-full bg-card border-r border-border flex flex-col transition-all duration-300 z-40 ${collapsed ? 'w-16' : 'w-60'}`}
        data-testid="dashboard-sidebar"
      >
        <div className={`flex items-center h-16 border-b border-border ${collapsed ? 'justify-center px-2' : 'px-5'}`}>
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">AI</div>
            {!collapsed && <span className="text-base font-bold text-slate-100 tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans' }}>CHCI<span className="text-primary">.AI</span></span>}
          </Link>
        </div>

        <nav className="flex-1 py-4 space-y-1 px-2">
          {navItems.map(({ key, icon: Icon, path }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={key}
                to={path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                } ${collapsed ? 'justify-center' : ''}`}
                data-testid={`sidebar-${key}`}
                title={collapsed ? t(`sidebar.${key}`) : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{t(`sidebar.${key}`)}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border space-y-2">
          {!collapsed && (
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-slate-200 truncate">{user?.company_name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          )}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={`w-full text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg text-sm ${collapsed ? 'justify-center px-0' : 'justify-start'}`}
            data-testid="sidebar-logout"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="ml-2">{t('nav.logout')}</span>}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full justify-center text-slate-500 hover:text-slate-300"
            data-testid="sidebar-collapse-toggle"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </aside>

      <main className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-60'}`}>
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
