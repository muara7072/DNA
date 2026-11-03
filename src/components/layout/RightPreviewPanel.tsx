import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  Copy,
  Check,
  Shield,
  Eye,
  Sparkles,
  Download,
  Info,
  ExternalLink,
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export const RightPreviewPanel: React.FC = () => {
  const {
    activeCharacter,
    toggleIdentityLock,
    activePreviewPrompt,
    showToast,
    isRightPanelOpen,
    setActiveTab,
  } = useStudio();

  const [copied, setCopied] = useState(false);

  if (!isRightPanelOpen || !activeCharacter) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Prompt disalin ke clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadDnaJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activeCharacter.dna, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${activeCharacter.name.toLowerCase().replace(/\s+/g, '_')}_dna.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Master Character DNA diekspor (JSON)', 'info');
  };

  return (
    <aside className="w-80 lg:w-96 bg-[#0A0D14] border-l border-slate-800/80 flex flex-col shrink-0 h-[calc(100vh-4rem)] overflow-y-auto select-none p-4 space-y-4">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            MASTER DNA PREVIEW
          </h2>
          <p className="text-[11px] text-slate-400">Live Consistency &amp; Output Inspector</p>
        </div>

        <button
          onClick={handleDownloadDnaJson}
          title="Download Master DNA JSON"
          className="p-1.5 rounded-md bg-slate-900 border border-slate-700 hover:text-cyan-400 text-slate-400 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Character Visual Anchor Card */}
      <div className="bg-gradient-to-b from-slate-900 via-[#0E131F] to-[#0A0D14] rounded-xl border border-slate-800 p-3 relative overflow-hidden shadow-lg">
        {/* Identity Lock Status Badge */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 font-mono text-xs text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>{activeCharacter.dna.characterId}</span>
          </div>

          <button
            onClick={() => toggleIdentityLock(activeCharacter.id)}
            className={`flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded transition-all ${
              activeCharacter.dna.identityLocked
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40'
                : 'bg-amber-500/15 text-amber-300 border border-amber-500/40'
            }`}
          >
            {activeCharacter.dna.identityLocked ? (
              <>
                <Lock className="w-3 h-3 text-cyan-400" />
                <span>IDENTITY LOCKED</span>
              </>
            ) : (
              <>
                <Unlock className="w-3 h-3 text-amber-400" />
                <span>UNLOCKED</span>
              </>
            )}
          </button>
        </div>

        {/* Character Portrait Viewport */}
        <div className="w-full aspect-square rounded-lg overflow-hidden border border-slate-700/80 bg-slate-950 relative group">
          <img
            src={activeCharacter.referenceImages.facePortrait}
            alt={activeCharacter.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
            <div className="text-white font-bold text-sm tracking-tight">{activeCharacter.name}</div>
            <div className="text-[11px] text-slate-300">
              {activeCharacter.dna.visualAge} y/o · {activeCharacter.dna.gender} · {activeCharacter.dna.nationality}
            </div>
          </div>
        </div>

        {/* Quick Attribute Grid */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
          <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80">
            <span className="text-slate-400 block text-[10px] uppercase">Skin Tone</span>
            <span className="text-slate-200 font-medium truncate block">{activeCharacter.dna.skinTone}</span>
          </div>
          <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80">
            <span className="text-slate-400 block text-[10px] uppercase">Face Shape</span>
            <span className="text-slate-200 font-medium truncate block">{activeCharacter.dna.faceShape}</span>
          </div>
          <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80">
            <span className="text-slate-400 block text-[10px] uppercase">Eyes</span>
            <span className="text-slate-200 font-medium truncate block">
              {activeCharacter.dna.eyeShape} · {activeCharacter.dna.eyeColor.split(' ')[0]}
            </span>
          </div>
          <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80">
            <span className="text-slate-400 block text-[10px] uppercase">Hair Style</span>
            <span className="text-slate-200 font-medium truncate block">{activeCharacter.dna.hairStyle}</span>
          </div>
        </div>

        {/* Distinctive Features */}
        <div className="mt-2 text-[11px] bg-slate-950/40 p-2 rounded border border-slate-800/50">
          <span className="text-cyan-400/90 font-medium text-[10px] uppercase block mb-0.5">
            Distinctive Features
          </span>
          <p className="text-slate-300 line-clamp-2 leading-relaxed">
            {activeCharacter.dna.distinctiveFeatures}
          </p>
        </div>
      </div>

      {/* Active Generated Prompt Inspector */}
      <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{activePreviewPrompt?.title || 'ACTIVE PROMPT INSPECTOR'}</span>
          </div>

          <span className="text-[10px] font-mono uppercase bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
            {activePreviewPrompt?.type || 'PROMPT'}
          </span>
        </div>

        <div className="bg-[#080B10] p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 max-h-48 overflow-y-auto leading-relaxed select-text">
          {activePreviewPrompt?.prompt || activeCharacter.dna.masterVisualPrompt}
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] text-slate-400 font-mono">
            Length: {(activePreviewPrompt?.prompt || activeCharacter.dna.masterVisualPrompt).length} chars
          </span>

          <button
            onClick={() => handleCopy(activePreviewPrompt?.prompt || activeCharacter.dna.masterVisualPrompt)}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 active:scale-95 transition-all"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy Prompt'}</span>
          </button>
        </div>
      </div>

      {/* 9 Golden Rules of Identity Preservation */}
      <div className="bg-[#090D14] rounded-xl border border-slate-800/80 p-3 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          <span>9 ATURAN IDENTITY PRESERVATION</span>
        </div>

        <ul className="text-[11px] text-slate-400 space-y-1 pl-3 list-disc marker:text-cyan-500">
          <li>Jangan ubah identitas &amp; proporsi wajah karakter.</li>
          <li>Pertahankan mata, hidung, bibir, &amp; rahang asli.</li>
          <li>Pertahankan warna &amp; mikro-tekstur pori kulit alami.</li>
          <li>Pertahankan usia visual &amp; ciri khas rambut.</li>
          <li>Identitas wajah konsisten di semua adegan berbeda.</li>
          <li>Ekspresi, pose, baju &amp; background boleh berubah.</li>
        </ul>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <button
            onClick={() => setActiveTab('consistency-checker')}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
          >
            Buka Consistency Checker <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </aside>
  );
};
