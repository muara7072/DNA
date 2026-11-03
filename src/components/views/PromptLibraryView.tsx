import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Copy,
  Check,
  Trash2,
  Download,
  Filter,
  Image as ImageIcon,
  Video,
  Activity,
  Mic,
  Clapperboard,
  Tag,
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { SavedPromptItem } from '../../types/character';

export const PromptLibraryView: React.FC = () => {
  const { savedPrompts, deletePrompt, showToast, setActivePreviewPrompt } = useStudio();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredPrompts = savedPrompts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.characterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.masterPrompt.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterType !== 'ALL' && p.promptType !== filterType) return false;
    return true;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Prompt disalin ke clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadTxt = (p: SavedPromptItem) => {
    const content = `MUARA AI REALISTIC CHARACTER STUDIO
PROMPT SPECIFICATION: ${p.title}
Type: ${p.promptType} | Target Character: ${p.characterName}

--- MASTER PROMPT ---
${p.masterPrompt}

${p.negativePrompt ? `--- NEGATIVE PROMPT ---\n${p.negativePrompt}\n` : ''}
`;
    const dataStr = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${p.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.txt`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Prompt diunduh sebagai TXT', 'info');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'VISUAL':
        return <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />;
      case 'VIDEO':
        return <Video className="w-3.5 h-3.5 text-blue-400" />;
      case 'MOTION':
        return <Activity className="w-3.5 h-3.5 text-amber-400" />;
      case 'VOICE':
        return <Mic className="w-3.5 h-3.5 text-emerald-400" />;
      case 'STORYBOARD':
        return <Clapperboard className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <BookOpen className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              PROMPT REPOSITORY
            </span>
            <span className="font-mono text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {savedPrompts.length} Saved
            </span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-white mt-1">Prompt Library</h1>
          <p className="text-xs text-slate-400">
            Kumpulan seluruh prompt visual, video, motion, dan voice yang telah dikompilasi dari Master Character DNA.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0C101A] p-3 rounded-xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari prompt berdasarkan judul, nama karakter, atau isi teks..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 shrink-0 overflow-x-auto">
          {['ALL', 'VISUAL', 'VIDEO', 'MOTION', 'VOICE'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                filterType === t
                  ? 'bg-slate-800 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Prompts Cards */}
      {filteredPrompts.length === 0 ? (
        <div className="bg-[#0C101A] border border-slate-800 rounded-xl p-12 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
          <h2 className="text-sm font-bold text-slate-300">Belum Ada Prompt di Kategori Ini</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Gunakan Visual Prompt Generator atau Video Prompt Generator lalu klik "Simpan ke Library".
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPrompts.map((p) => (
            <div
              key={p.id}
              className="bg-[#0C101A] border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800">
                    {getTypeIcon(p.promptType)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">{p.title}</h3>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span className="text-cyan-400 font-medium">{p.characterName}</span>
                      <span>·</span>
                      <span className="font-mono text-[10px]">
                        {new Date(p.createdAt).toLocaleDateString('id-ID', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <button
                    onClick={() => handleCopy(p.masterPrompt, p.id)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 text-xs font-semibold transition-all border border-cyan-500/30"
                  >
                    {copiedId === p.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === p.id ? 'Tersalin' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={() => handleDownloadTxt(p)}
                    title="Download TXT"
                    className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => deletePrompt(p.id)}
                    title="Hapus Prompt"
                    className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Master Prompt Box */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 font-mono text-xs text-slate-200 leading-relaxed max-h-36 overflow-y-auto select-text">
                {p.masterPrompt}
              </div>

              {p.negativePrompt && (
                <div className="bg-slate-950/60 p-2 rounded border border-slate-800/60 text-[11px] font-mono text-slate-400 select-text">
                  <strong className="text-slate-400">Negative:</strong> {p.negativePrompt}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
