import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Globe, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AuthPage() {
  const { t, language, toggleLanguage } = useLanguage();
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', company_name: '' });

  const handleChange = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (tab === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.email, form.password, form.company_name);
      }
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Something went wrong';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 grid-pattern relative" data-testid="auth-page">
      <div className="hero-glow" style={{ top: '40%', left: '50%' }} />

      <div className="absolute top-6 left-6 flex items-center gap-3">
        <Link to="/" className="text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1.5 text-sm" data-testid="auth-back-link">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
      </div>
      <div className="absolute top-6 right-6">
        <button onClick={toggleLanguage} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors" data-testid="auth-language-toggle">
          <Globe className="w-4 h-4" /> {language === 'cs' ? 'EN' : 'CZ'}
        </button>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-lg">AI</div>
            <span className="text-xl font-bold text-slate-100" style={{ fontFamily: 'Plus Jakarta Sans' }}>CHCI<span className="text-primary">.AI</span></span>
          </Link>
        </div>

        <div className="glass-card rounded-2xl p-8" data-testid="auth-card">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="w-full mb-6 bg-white/5 border border-white/10 rounded-full p-1">
              <TabsTrigger
                value="login"
                className="flex-1 rounded-full text-sm data-[state=active]:bg-primary data-[state=active]:text-white"
                data-testid="auth-login-tab"
              >
                {t('auth.login')}
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="flex-1 rounded-full text-sm data-[state=active]:bg-primary data-[state=active]:text-white"
                data-testid="auth-register-tab"
              >
                {t('auth.register')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <h2 className="text-xl font-bold text-slate-100 mb-1" style={{ fontFamily: 'Plus Jakarta Sans' }}>{t('auth.loginTitle')}</h2>
              <p className="text-sm text-slate-500 mb-6">{t('auth.loginSubtitle')}</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-sm text-slate-400 mb-1.5">{t('auth.email')}</Label>
                  <Input
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange('email')}
                    className="bg-white/5 border-white/10 text-slate-200 focus:border-primary rounded-lg h-11"
                    placeholder="vas@email.cz"
                    data-testid="auth-email-input"
                  />
                </div>
                <div>
                  <Label className="text-sm text-slate-400 mb-1.5">{t('auth.password')}</Label>
                  <Input
                    type="password"
                    required
                    value={form.password}
                    onChange={handleChange('password')}
                    className="bg-white/5 border-white/10 text-slate-200 focus:border-primary rounded-lg h-11"
                    placeholder="********"
                    data-testid="auth-password-input"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white hover:bg-primary/90 rounded-full h-11 text-sm font-medium shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all"
                  data-testid="auth-submit-btn"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('auth.login')}
                </Button>
              </form>
              <p className="text-center text-sm text-slate-500 mt-4">
                {t('auth.noAccount')}{' '}
                <button onClick={() => setTab('register')} className="text-primary hover:underline" data-testid="switch-to-register">{t('auth.switchToRegister')}</button>
              </p>
            </TabsContent>

            <TabsContent value="register">
              <h2 className="text-xl font-bold text-slate-100 mb-1" style={{ fontFamily: 'Plus Jakarta Sans' }}>{t('auth.registerTitle')}</h2>
              <p className="text-sm text-slate-500 mb-6">{t('auth.registerSubtitle')}</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-sm text-slate-400 mb-1.5">{t('auth.companyName')}</Label>
                  <Input
                    type="text"
                    required
                    value={form.company_name}
                    onChange={handleChange('company_name')}
                    className="bg-white/5 border-white/10 text-slate-200 focus:border-primary rounded-lg h-11"
                    placeholder="Vase firma s.r.o."
                    data-testid="auth-company-input"
                  />
                </div>
                <div>
                  <Label className="text-sm text-slate-400 mb-1.5">{t('auth.email')}</Label>
                  <Input
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange('email')}
                    className="bg-white/5 border-white/10 text-slate-200 focus:border-primary rounded-lg h-11"
                    placeholder="vas@email.cz"
                    data-testid="auth-register-email-input"
                  />
                </div>
                <div>
                  <Label className="text-sm text-slate-400 mb-1.5">{t('auth.password')}</Label>
                  <Input
                    type="password"
                    required
                    minLength={8}
                    value={form.password}
                    onChange={handleChange('password')}
                    className="bg-white/5 border-white/10 text-slate-200 focus:border-primary rounded-lg h-11"
                    placeholder="Min. 8 znaku"
                    data-testid="auth-register-password-input"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white hover:bg-primary/90 rounded-full h-11 text-sm font-medium shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all"
                  data-testid="auth-register-submit-btn"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('auth.register')}
                </Button>
              </form>
              <p className="text-center text-sm text-slate-500 mt-4">
                {t('auth.hasAccount')}{' '}
                <button onClick={() => setTab('login')} className="text-primary hover:underline" data-testid="switch-to-login">{t('auth.switchToLogin')}</button>
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
