import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Send, 
  Mail, 
  Target, 
  Palette, 
  ArrowRight,
  Loader2,
  Copy,
  Check,
  History,
  Layout,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  FileText,
  Share2
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { generateCampaign } from "./lib/gemini";
import { EmailCampaign, CampaignTone } from "./types";
import { cn } from "./lib/utils";

const TONES: { value: CampaignTone; label: string; icon: any }[] = [
  { value: 'professional', label: 'Professional', icon: Layout },
  { value: 'playful', label: 'Playful', icon: Sparkles },
  { value: 'urgent', label: 'Urgent', icon: Target },
  { value: 'luxury', label: 'Luxury', icon: Palette },
];

const PLATFORM_ICONS = {
  twitter: Twitter,
  facebook: Facebook,
  linkedin: Linkedin,
  instagram: Instagram,
};

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState<CampaignTone>("professional");
  const [audience, setAudience] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [campaign, setCampaign] = useState<EmailCampaign | null>(null);
  const [history, setHistory] = useState<EmailCampaign[]>([]);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [view, setView] = useState<'email' | 'social'>('email');

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const result = await generateCampaign(prompt, tone, audience);
      const newCampaign = result as EmailCampaign;
      setCampaign(newCampaign);
      setHistory(prev => [newCampaign, ...prev]);
    } catch (error) {
      alert("Failed to generate campaign. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="h-16 bg-white border-b border-slate-200 sticky top-0 z-50 px-8">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Tanveer<span className="text-indigo-600">Email</span></span>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              AI Engine Ready
            </div>
            <div className="h-6 w-[1px] bg-slate-200 mx-2" />
            <div className="flex items-center gap-4">
              <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Templates</button>
              <button className="px-5 py-2 bg-indigo-600 text-white rounded-full text-sm font-semibold shadow-sm hover:bg-indigo-700 hover:shadow-md transition-all active:scale-95">
                Export
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Input Studio */}
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                Craft your <span className="text-indigo-600 italic font-serif">vision</span>.
              </h1>
              <p className="text-slate-500 text-sm leading-relaxed">
                Describe your project goals and let our AI engine generate high-converting marketing assets.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Campaign Prompt</label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Summer clearance for a boutique coffee roaster. 20% off single-origin beans."
                  className="w-full h-36 p-4 text-sm bg-slate-50 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none leading-relaxed transition-all"
                />
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Tone of Voice</label>
                  <div className="grid grid-cols-2 gap-2">
                    {TONES.map(t => (
                      <button 
                        key={t.value}
                        onClick={() => setTone(t.value)}
                        className={cn(
                          "py-2 px-3 text-xs font-medium rounded-lg border transition-all text-left flex items-center gap-2",
                          tone === t.value 
                            ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm" 
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        )}
                      >
                        <t.icon className={cn("w-3.5 h-3.5", tone === t.value ? "text-indigo-600" : "text-slate-400")} />
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Target Audience</label>
                  <input 
                    type="text"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="e.g. Specialty coffee lovers"
                    className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt}
                className={cn(
                  "w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm",
                  isGenerating 
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98] hover:shadow-lg"
                )}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span className="text-sm tracking-wide uppercase">Generate Assets</span>
                  </>
                )}
              </button>
            </div>

            {/* History Peek */}
            {history.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Library</h3>
                <div className="space-y-2">
                  {history.slice(0, 3).map((h) => (
                    <div 
                      key={h.id} 
                      onClick={() => setCampaign(h)}
                      className="group flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center group-hover:bg-white transition-colors">
                          <Mail className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                        </div>
                        <div className="truncate max-w-[150px]">
                          <p className="font-semibold text-xs text-slate-700 truncate">{h.name}</p>
                          <p className="text-[9px] text-slate-400 font-medium">{new Date(h.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Preview Area */}
          <div className="lg:col-span-8 flex flex-col h-full space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-6">
                <button 
                  onClick={() => setView('email')}
                  className={cn(
                    "text-xs font-bold uppercase tracking-widest pb-1.5 transition-all border-b-2",
                    view === 'email' ? "text-indigo-600 border-indigo-600" : "text-slate-400 border-transparent hover:text-slate-600"
                  )}
                >
                  Email View
                </button>
                <button 
                  onClick={() => setView('social')}
                  className={cn(
                    "text-xs font-bold uppercase tracking-widest pb-1.5 transition-all border-b-2",
                    view === 'social' ? "text-indigo-600 border-indigo-600" : "text-slate-400 border-transparent hover:text-slate-600"
                  )}
                >
                  Social Assets
                </button>
              </div>
              <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
                <button 
                  onClick={() => setView('email')}
                  className={cn("p-1.5 rounded transition-colors", view === 'email' ? "bg-slate-50 text-slate-600" : "text-slate-400 hover:text-slate-600")}
                >
                  <Layout className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setView('social')}
                  className={cn("p-1.5 rounded transition-colors", view === 'social' ? "bg-slate-50 text-slate-600" : "text-slate-400 hover:text-slate-600")}
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {campaign ? (
                <motion.div 
                  key={`${campaign.id}-${view}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex-1 bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden flex flex-col min-h-[700px]"
                >
                  {view === 'email' ? (
                    <>
                      {/* Browser Chrome Header */}
                      <div className="bg-slate-50 px-8 py-5 border-b border-slate-200 space-y-3">
                        <div className="flex gap-1.5 mb-1 text-slate-300">
                          <div className="w-2.5 h-2.5 rounded-full bg-current"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-current"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-current"></div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 group relative">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider w-16">Subject:</span>
                            <p className="text-sm font-semibold text-slate-700">{campaign.subjectLines[0]} <span className="font-normal text-slate-400 ml-2 italic">+{campaign.subjectLines.length - 1} variations</span></p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider w-16">Audience:</span>
                            <p className="text-[11px] text-slate-500 font-medium px-2 py-0.5 bg-slate-100 rounded border border-slate-200 capitalize">{campaign.targetAudience || 'Global'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Scrollable Email Body */}
                      <div className="flex-1 overflow-y-auto bg-white p-12 lg:p-16">
                        <div className="max-w-2xl mx-auto space-y-12">
                          {/* Hero Image Container */}
                          <div className="relative group rounded-2xl overflow-hidden border border-slate-100 shadow-sm aspect-[16/9]">
                            <img 
                              src={`https://picsum.photos/seed/${campaign.id}/1200/675`}
                              alt="Campaign Banner"
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                              <h3 className="text-xl font-bold text-white tracking-tight leading-tight">{campaign.name}</h3>
                              <div className="px-2 py-1 bg-white/10 backdrop-blur-md rounded text-[9px] font-bold text-white uppercase tracking-widest border border-white/20 capitalize">
                                {campaign.tone}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                            {/* Text Content */}
                            <div className="md:col-span-8 space-y-8">
                              <article className="prose prose-slate prose-p:text-slate-600 prose-headings:font-serif prose-headings:font-normal prose-headings:tracking-tight prose-headings:text-slate-900 prose-a:text-indigo-600 prose-a:font-semibold max-w-none">
                                <ReactMarkdown>{campaign.bodyCopy}</ReactMarkdown>
                              </article>
                              
                              <div className="pt-8 border-t border-slate-100">
                                <button className="w-full py-4 bg-indigo-600 text-white rounded-lg font-bold tracking-wide uppercase text-sm shadow-md hover:bg-slate-900 transition-all">
                                  Visit Store
                                </button>
                                <p className="mt-8 text-[10px] text-center text-slate-400 uppercase tracking-[0.2em] font-medium">
                                  {campaign.name} | Campaignflow AI generated
                                </p>
                              </div>
                            </div>

                            {/* Sidebar Details */}
                            <div className="md:col-span-4 space-y-8">
                              <section className="space-y-4">
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Subject Alternatives</h4>
                                <div className="space-y-2">
                                  {campaign.subjectLines.map((sl, idx) => (
                                    <button 
                                      key={idx}
                                      onClick={() => copyToClipboard(sl, `sl-${idx}`)}
                                      className="w-full text-left p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-600 hover:border-indigo-200 hover:bg-white transition-all flex items-center justify-between group"
                                    >
                                      <span className="truncate pr-2 italic">"{sl}"</span>
                                      {copiedField === `sl-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 opacity-0 group-hover:opacity-30" />}
                                    </button>
                                  ))}
                                </div>
                              </section>

                              <section className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                  <Sparkles className="w-3 h-3" /> Visual Strategy
                                </h4>
                                <p className="text-[11px] italic leading-relaxed text-slate-500">
                                  "{campaign.visualPrompt}"
                                </p>
                              </section>

                              <button 
                                onClick={() => copyToClipboard(campaign.bodyCopy, 'body')}
                                className="w-full flex items-center justify-center gap-2 p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
                              >
                                {copiedField === 'body' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                Copy Body Copy
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 bg-slate-50/30 overflow-y-auto p-12 lg:p-16">
                      <div className="max-w-3xl mx-auto space-y-12">
                        <div className="space-y-2">
                          <h2 className="text-2xl font-bold tracking-tight">Social Media Distribution</h2>
                          <p className="text-slate-500 text-sm">Platform-optimized content to drive traffic to your campaign.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {campaign.socialPosts.map((post, idx) => {
                            const Icon = PLATFORM_ICONS[post.platform as keyof typeof PLATFORM_ICONS] || Sparkles;
                            return (
                              <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col space-y-6 relative group"
                              >
                                <div className="flex items-center justify-between">
                                  <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                                    post.platform === 'twitter' ? "bg-black text-white" :
                                    post.platform === 'facebook' ? "bg-[#1877F2] text-white" :
                                    post.platform === 'linkedin' ? "bg-[#0A66C2] text-white" :
                                    "bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white"
                                  )}>
                                    <Icon className="w-5 h-5" />
                                  </div>
                                  <button 
                                    onClick={() => copyToClipboard(post.content, `social-${idx}`)}
                                    className="p-2 rounded-lg hover:bg-slate-50 transition-colors opacity-0 group-hover:opacity-100"
                                  >
                                    {copiedField === `social-${idx}` ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                                  </button>
                                </div>
                                <div className="space-y-4">
                                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{post.platform}</p>
                                  <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
                                </div>
                                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{post.content.length} characters</span>
                                  <div className="flex gap-2">
                                    <button className="text-[10px] font-bold text-indigo-600 hover:underline uppercase tracking-widest">Post Now</button>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>

                        {/* Image Preview for Socials */}
                        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
                           <div className="flex items-center gap-3">
                              <Palette className="w-5 h-5 text-indigo-600" />
                              <h3 className="text-sm font-bold uppercase tracking-widest">Recommended Visuals</h3>
                           </div>
                           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {[1,2,3,4].map(i => (
                                <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 transition-transform hover:scale-[1.02] cursor-pointer">
                                  <img 
                                    src={`https://picsum.photos/seed/${campaign.id}-${i}/400/400`} 
                                    alt="Graphic Option" 
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                              ))}
                           </div>
                           <p className="text-xs text-slate-400 italic font-medium leading-relaxed bg-slate-50 p-4 rounded-xl">
                             "Pro tip: Use the high-fidelity prompt we generated to create platform-specific sizes in your favorite design tool."
                           </p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="flex-1 min-h-[600px] bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center p-12">
                   <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mb-6 animate-bounce">
                      <Layout className="w-7 h-7 text-indigo-600/20" />
                   </div>
                   <div className="space-y-2">
                     <h3 className="font-bold text-xl text-slate-900 tracking-tight">The Campaign Canvas</h3>
                     <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
                       Your generated assets will materialize here in high-fidelity preview.
                     </p>
                   </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-10 mt-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 grayscale group-hover:grayscale-0 transition-all opacity-40 hover:opacity-100">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold font-serif italic text-slate-900">Tanveer Email Campaign</span>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">© 2026 Tanveer Creative Labs. All Rights Reserved.</p>
          <div className="flex items-center gap-8">
            <a href="#" className="text-[10px] text-slate-400 hover:text-indigo-600 transition-colors font-bold uppercase tracking-widest">Support</a>
            <a href="#" className="text-[10px] text-slate-400 hover:text-indigo-600 transition-colors font-bold uppercase tracking-widest">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
