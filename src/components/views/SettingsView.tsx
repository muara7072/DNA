import React from 'react';
import {
  Sliders,
  Shield,
  RotateCcw,
  Cpu,
  Info,
  CheckCircle,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export const SettingsView: React.FC = () => {
  const { resetAllData, showToast } = useStudio();

  const handleReset = () => {
    if (window.confirm('Apakah Anda yakin ingin mereset seluruh data karakter dan prompt ke bawaan studio?')) {
      resetAllData();
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              STUDIO PREFERENCES &amp; SYSTEM
            </span>
            <span className="font-mono text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              v2.4 Production Engine
            </span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-white mt-1">Studio Settings</h1>
          <p className="text-xs text-slate-400">
            Konfigurasi target model AI, integritas Master DNA, dan pengelolaan database karakter.
          </p>
        </div>
      </div>

      {/* Target AI Generation Engines */}
      <div className="bg-[#0C101A] border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
        <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>TARGET GENERATION ENGINES &amp; COMPATIBILITY</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Visual Engine</span>
              <span className="text-[10px] text-emerald-400 font-mono">SUPPORTED</span>
            </div>
            <p className="text-slate-400">Flux.1 Pro, Midjourney v6.1, Ideogram 2.0</p>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Video Engine</span>
              <span className="text-[10px] text-emerald-400 font-mono">SUPPORTED</span>
            </div>
            <p className="text-slate-400">Kling AI, Runway Gen-3 Alpha, Luma Dream Machine, Sora, Veo</p>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Voice &amp; Audio</span>
              <span className="text-[10px] text-emerald-400 font-mono">SUPPORTED</span>
            </div>
            <p className="text-slate-400">ElevenLabs Multilingual v2, Gemini TTS, Web Speech</p>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Multimodal Vision</span>
              <span className="text-[10px] text-emerald-400 font-mono">ONLINE</span>
            </div>
            <p className="text-slate-400">Gemini 3.8 Flash (Facial Landmark Continuity Audit)</p>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Master DNA Engine</span>
              <span className="text-[10px] text-cyan-400 font-mono">LOCK ACTIVE</span>
            </div>
            <p className="text-slate-400">Identity Preservation Protocol v2</p>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Persistence Tier</span>
              <span className="text-[10px] text-emerald-400 font-mono">PERSISTENT</span>
            </div>
            <p className="text-slate-400">Local Browser Storage &amp; Full-Stack API</p>
          </div>
        </div>
      </div>

      {/* Brand & Academy Credits */}
      <div className="bg-gradient-to-r from-[#0C1220] via-slate-900 to-[#0C101A] border border-cyan-500/20 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>MUARA TECHNO ACADEMY</span>
        </div>

        <h3 className="text-lg font-bold text-white">MUARA AI REALISTIC CHARACTER STUDIO</h3>
        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
          Dirancang untuk para kreator konten AI, studio animasi, sutradara virtual, dan pengembang film independen untuk memproduksi manusia AI yang konsisten dan tampak nyata.
        </p>

        <div className="pt-2 text-[11px] text-slate-400 font-mono">
          "CREATE ONCE. STAY CONSISTENT. LOOK REAL."
        </div>
      </div>

      {/* Data Management & Reset */}
      <div className="bg-[#0C101A] border border-rose-950/60 rounded-xl p-5 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-rose-400" />
          <span>RESET DATABASE &amp; CACHE STUDIO</span>
        </h2>

        <p className="text-xs text-slate-400 leading-relaxed">
          Mengembalikan daftar karakter, Master DNA, dan prompt yang tersimpan kembali ke konfigurasi bawaan (Elena Vance, Kenjiro Takahashi, Aria Nusantara, Marcus Thorne).
        </p>

        <div className="pt-2">
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 hover:bg-rose-900/60 font-semibold text-xs transition-colors"
          >
            Reset Semua Data ke Profil Bawaan
          </button>
        </div>
      </div>
    </div>
  );
};
