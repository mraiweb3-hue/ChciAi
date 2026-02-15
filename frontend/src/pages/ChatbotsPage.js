import { useEffect, useState, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import DashboardLayout from '@/components/DashboardLayout';
import ChatWidgetPreview from '@/components/ChatWidgetPreview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { api } from '@/lib/api';
import { Plus, Pencil, Trash2, Copy, Check, Bot, Code, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const emptyForm = {
  name: '', system_prompt: '', welcome_message: 'Dobry den! Jak vam mohu pomoci?',
  primary_color: '#6366F1', language: 'cs', position: 'bottom-right',
};

export default function ChatbotsPage() {
  const { t } = useLanguage();
  const [chatbots, setChatbots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [embedId, setEmbedId] = useState(null);
  const [previewBot, setPreviewBot] = useState(null);

  const load = useCallback(() => {
    api.get('/chatbots').then(r => setChatbots(r.data)).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditId(null); setForm({ ...emptyForm }); setDialogOpen(true); };

  const openEdit = (bot) => {
    setEditId(bot.id);
    setForm({ name: bot.name, system_prompt: bot.system_prompt, welcome_message: bot.welcome_message, primary_color: bot.primary_color, language: bot.language, position: bot.position });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      if (editId) {
        await api.put(`/chatbots/${editId}`, form);
        toast.success('Updated');
      } else {
        await api.post('/chatbots', form);
        toast.success('Created');
      }
      setDialogOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Error');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('chatbots.deleteConfirm'))) return;
    try {
      await api.delete(`/chatbots/${id}`);
      toast.success('Deleted');
      load();
    } catch { toast.error('Error'); }
  };

  const toggleActive = async (bot) => {
    try {
      await api.put(`/chatbots/${bot.id}`, { is_active: !bot.is_active });
      load();
    } catch { toast.error('Error'); }
  };

  const copyEmbed = (bot) => {
    const code = `<script src="https://app.chciai.cz/widget.js" data-chatbot-id="${bot.id}" data-token="${bot.widget_token}"></script>`;
    navigator.clipboard.writeText(code);
    setCopiedId(bot.id);
    toast.success(t('chatbots.codeCopied'));
    setTimeout(() => setCopiedId(null), 2000);
  };

  const updateField = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  return (
    <DashboardLayout>
      <div data-testid="chatbots-page">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-100" style={{ fontFamily: 'Plus Jakarta Sans' }}>{t('chatbots.title')}</h1>
            <p className="text-sm text-slate-500 mt-1">{t('chatbots.subtitle')}</p>
          </div>
          <Button onClick={openCreate} className="bg-primary text-white hover:bg-primary/90 rounded-full h-10 px-5 text-sm shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all" data-testid="create-chatbot-btn">
            <Plus className="w-4 h-4 mr-1.5" /> {t('chatbots.create')}
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
        ) : chatbots.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4"><Bot className="w-7 h-7 text-slate-600" /></div>
            <p className="text-sm text-slate-500">{t('chatbots.noResults')}</p>
            <Button onClick={openCreate} className="mt-4 bg-primary text-white rounded-full px-6 h-10 text-sm" data-testid="create-first-chatbot-btn">
              <Plus className="w-4 h-4 mr-1.5" /> {t('chatbots.create')}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5" data-testid="chatbots-grid">
            {chatbots.map(bot => (
              <Card key={bot.id} className="bg-card border-border hover:border-primary/20 transition-all" data-testid={`chatbot-card-${bot.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${bot.primary_color}20` }}>
                        <Bot className="w-5 h-5" style={{ color: bot.primary_color }} />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-slate-100">{bot.name}</h3>
                        <p className="text-xs text-slate-500">{bot.language === 'cs' ? 'Cestina' : 'English'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={bot.is_active ? 'default' : 'secondary'} className={`text-xs rounded-full ${bot.is_active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-slate-500'}`}>
                        {bot.is_active ? t('chatbots.active') : t('chatbots.inactive')}
                      </Badge>
                      <Switch checked={bot.is_active} onCheckedChange={() => toggleActive(bot)} data-testid={`toggle-active-${bot.id}`} />
                    </div>
                  </div>

                  {bot.system_prompt && (
                    <p className="text-xs text-slate-500 mb-4 line-clamp-2 bg-white/5 rounded-lg p-2.5">{bot.system_prompt}</p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(bot)} className="text-slate-400 hover:text-slate-200 h-8 text-xs" data-testid={`edit-chatbot-${bot.id}`}>
                      <Pencil className="w-3.5 h-3.5 mr-1" /> {t('chatbots.edit')}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => copyEmbed(bot)} className="text-slate-400 hover:text-slate-200 h-8 text-xs" data-testid={`copy-embed-${bot.id}`}>
                      {copiedId === bot.id ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                      {t('chatbots.embedCode')}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setPreviewBot(previewBot?.id === bot.id ? null : bot)} className="text-slate-400 hover:text-slate-200 h-8 text-xs" data-testid={`preview-chatbot-${bot.id}`}>
                      <Code className="w-3.5 h-3.5 mr-1" /> {t('chatbots.preview')}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(bot.id)} className="text-slate-400 hover:text-red-400 h-8 text-xs ml-auto" data-testid={`delete-chatbot-${bot.id}`}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                  {previewBot?.id === bot.id && (
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
                      <ChatWidgetPreview config={bot} />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-card border-border max-w-lg" data-testid="chatbot-dialog">
            <DialogHeader>
              <DialogTitle className="text-lg text-slate-100" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                {editId ? t('chatbots.edit') : t('chatbots.create')}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label className="text-sm text-slate-400">{t('chatbots.name')}</Label>
                <Input value={form.name} onChange={updateField('name')} className="bg-white/5 border-white/10 text-slate-200 mt-1.5" placeholder="AI Asistent" data-testid="chatbot-name-input" />
              </div>
              <div>
                <Label className="text-sm text-slate-400">{t('chatbots.systemPrompt')}</Label>
                <textarea value={form.system_prompt} onChange={updateField('system_prompt')} rows={3} className="w-full bg-white/5 border border-white/10 text-slate-200 rounded-lg px-3 py-2 text-sm mt-1.5 focus:outline-none focus:border-primary/50 resize-none" placeholder={t('chatbots.systemPromptPlaceholder')} data-testid="chatbot-prompt-input" />
              </div>
              <div>
                <Label className="text-sm text-slate-400">{t('chatbots.welcomeMessage')}</Label>
                <Input value={form.welcome_message} onChange={updateField('welcome_message')} className="bg-white/5 border-white/10 text-slate-200 mt-1.5" data-testid="chatbot-welcome-input" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-slate-400">{t('chatbots.primaryColor')}</Label>
                  <div className="flex items-center gap-2 mt-1.5">
                    <input type="color" value={form.primary_color} onChange={updateField('primary_color')} className="w-10 h-10 rounded-lg cursor-pointer border-0" data-testid="chatbot-color-input" />
                    <Input value={form.primary_color} onChange={updateField('primary_color')} className="bg-white/5 border-white/10 text-slate-200 flex-1" />
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-slate-400">{t('chatbots.language')}</Label>
                  <select value={form.language} onChange={updateField('language')} className="w-full bg-white/5 border border-white/10 text-slate-200 rounded-lg px-3 py-2.5 text-sm mt-1.5 focus:outline-none" data-testid="chatbot-language-select">
                    <option value="cs">Cestina</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setDialogOpen(false)} className="text-slate-400 rounded-full" data-testid="chatbot-cancel-btn">{t('chatbots.cancel')}</Button>
              <Button onClick={handleSave} disabled={saving} className="bg-primary text-white rounded-full px-6 shadow-[0_0_20px_rgba(99,102,241,0.3)]" data-testid="chatbot-save-btn">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : t('chatbots.save')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
