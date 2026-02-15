import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { api } from '@/lib/api';
import { User, Lock, Shield, Loader2, Download, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { t } = useLanguage();
  const { user, updateUser } = useAuth();
  const [profileForm, setProfileForm] = useState({ company_name: user?.company_name || '' });
  const [passwordForm, setPasswordForm] = useState({ current_password: '', new_password: '' });
  const [visitorId, setVisitorId] = useState('');
  const [saving, setSaving] = useState(false);

  const handleProfileSave = async () => {
    setSaving(true);
    try {
      const res = await api.put('/settings/profile', profileForm);
      updateUser(res.data);
      toast.success('Profile updated');
    } catch (err) { toast.error(err.response?.data?.detail || 'Error'); }
    finally { setSaving(false); }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.new_password.length < 8) { toast.error('Min. 8 characters'); return; }
    setSaving(true);
    try {
      await api.put('/settings/password', passwordForm);
      setPasswordForm({ current_password: '', new_password: '' });
      toast.success('Password changed');
    } catch (err) { toast.error(err.response?.data?.detail || 'Error'); }
    finally { setSaving(false); }
  };

  const handleExportData = async () => {
    if (!visitorId.trim()) { toast.error('Enter visitor ID'); return; }
    try {
      const res = await api.get(`/gdpr/export/${visitorId}`);
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `gdpr-export-${visitorId}.json`; a.click();
      toast.success('Data exported');
    } catch { toast.error('Export failed'); }
  };

  const handleDeleteData = async () => {
    if (!visitorId.trim()) { toast.error('Enter visitor ID'); return; }
    if (!window.confirm('Delete all data for this visitor?')) return;
    try {
      await api.delete(`/gdpr/data/${visitorId}`);
      toast.success('Visitor data deleted');
      setVisitorId('');
    } catch { toast.error('Delete failed'); }
  };

  return (
    <DashboardLayout>
      <div data-testid="settings-page">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-100" style={{ fontFamily: 'Plus Jakarta Sans' }}>{t('settings.title')}</h1>
        </div>

        <Tabs defaultValue="profile" className="max-w-2xl">
          <TabsList className="bg-white/5 border border-white/10 rounded-full p-1 mb-8">
            <TabsTrigger value="profile" className="rounded-full text-sm data-[state=active]:bg-primary data-[state=active]:text-white" data-testid="settings-tab-profile">
              <User className="w-4 h-4 mr-1.5" /> {t('settings.profile')}
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-full text-sm data-[state=active]:bg-primary data-[state=active]:text-white" data-testid="settings-tab-security">
              <Lock className="w-4 h-4 mr-1.5" /> {t('settings.security')}
            </TabsTrigger>
            <TabsTrigger value="gdpr" className="rounded-full text-sm data-[state=active]:bg-primary data-[state=active]:text-white" data-testid="settings-tab-gdpr">
              <Shield className="w-4 h-4 mr-1.5" /> {t('settings.gdpr')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base text-slate-200">{t('settings.profile')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm text-slate-400">{t('settings.companyName')}</Label>
                  <Input value={profileForm.company_name} onChange={(e) => setProfileForm({ company_name: e.target.value })} className="bg-white/5 border-white/10 text-slate-200 mt-1.5" data-testid="settings-company-input" />
                </div>
                <div>
                  <Label className="text-sm text-slate-400">{t('settings.email')}</Label>
                  <Input value={user?.email || ''} disabled className="bg-white/5 border-white/10 text-slate-500 mt-1.5" data-testid="settings-email-display" />
                </div>
                <Button onClick={handleProfileSave} disabled={saving} className="bg-primary text-white rounded-full px-6 h-10 text-sm" data-testid="settings-save-profile-btn">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : t('settings.save')}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base text-slate-200">{t('settings.security')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm text-slate-400">{t('settings.currentPassword')}</Label>
                  <Input type="password" value={passwordForm.current_password} onChange={(e) => setPasswordForm(p => ({ ...p, current_password: e.target.value }))} className="bg-white/5 border-white/10 text-slate-200 mt-1.5" data-testid="settings-current-password" />
                </div>
                <div>
                  <Label className="text-sm text-slate-400">{t('settings.newPassword')}</Label>
                  <Input type="password" value={passwordForm.new_password} onChange={(e) => setPasswordForm(p => ({ ...p, new_password: e.target.value }))} className="bg-white/5 border-white/10 text-slate-200 mt-1.5" data-testid="settings-new-password" />
                </div>
                <Button onClick={handlePasswordChange} disabled={saving} className="bg-primary text-white rounded-full px-6 h-10 text-sm" data-testid="settings-change-password-btn">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : t('settings.changePassword')}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gdpr">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base text-slate-200">{t('settings.gdprTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-400">{t('settings.gdprDesc')}</p>
                <div>
                  <Label className="text-sm text-slate-400">{t('settings.visitorId')}</Label>
                  <Input value={visitorId} onChange={(e) => setVisitorId(e.target.value)} className="bg-white/5 border-white/10 text-slate-200 mt-1.5" placeholder="visitor-uuid-here" data-testid="settings-visitor-id-input" />
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleExportData} variant="outline" className="border-white/10 text-slate-300 rounded-full px-5 h-10 text-sm" data-testid="settings-export-data-btn">
                    <Download className="w-4 h-4 mr-1.5" /> {t('settings.exportData')}
                  </Button>
                  <Button onClick={handleDeleteData} variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-full px-5 h-10 text-sm" data-testid="settings-delete-data-btn">
                    <Trash2 className="w-4 h-4 mr-1.5" /> {t('settings.deleteData')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
