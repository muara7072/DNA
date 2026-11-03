import React from 'react';
import {
  Sparkles,
  Lock,
  UserPlus,
  Image as ImageIcon,
  Video,
  Activity,
  Mic,
  Clapperboard,
  ShieldCheck,
  Dna,
  ArrowRight,
  Copy,
  Users,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { useStudio, TabKey } from '../../context/StudioContext';

export const DashboardView: React.FC = () => {
  const {
    activeCharacter,
    characters,
    savedPrompts,
    storyboardProjects,
    setActiveTab,
    setActiveCharacterId,
    showToast,
  } = useStudio();

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Master Visual Prompt disalin ke clipboard!', 'success');
  };

  const quickLaunchCards = [
    {
      title: 'Visual Prompt Generator',
      desc: 'Hasilkan prompt foto ultra-realistis dengan Identity Lock.',
      tab: 'visual-prompt' as TabKey,
      icon: ImageIcon,
      color: 'from-cyan-500/20 to-blue-600/10 border-cyan-500/30 text-cyan-300',
    },
    {
      title: 'Video Prompt Generator',
      desc: 'Prompt kamera sinematik, lip-sync, dan kontinuitas adegan.',
      tab: 'video-prompt' as TabKey,
      icon: Video,
      color: 'from-blue-500/20 to-indigo-600/10 border-blue-500/30 text-blue-300',
    },
    {
      title: 'Motion & Action Generator',
      desc: 'Rancang timeline gerak tubuh, ekspresi mikro, dan fisika alami.',
      tab: 'motion-generator' as TabKey,
      icon: Activity,
      color: 'from-amber-500/20 to-yellow-600/10 border-amber-500/30 text-amber-300',
    },
    {
      title: 'Voice Identity Generator',
      desc: 'Master Voice DNA, instruksi audio, dan skrip suara.',
      tab: 'voice-generator' as TabKey,
      icon: Mic,
      color: 'from-emerald-500/20 to-teal-600/10 border-emerald-500/30 text-emerald-300',
    },
    {
      title: 'Storyboard Studio',
      desc: 'Pembuatan naskah & visual adegan berseri dengan karakter konsisten.',
      tab: 'storyboard-studio' as TabKey,
      icon: Clapperboard,
      color: 'from-purple-500/20 to-indigo-600/10 border-purple-500/30 text-purple-300',
    },
    {
      title: 'Consistency Checker',
      desc: 'Audit kemiripan biometrik wajah & integritas Master DNA.',
      tab: 'consistency-checker' as TabKey,
      icon: ShieldCheck,
      color: 'from-rose-500/20 to-pink-600/10 border-rose-500/30 text-rose-300',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Studio Banner & Master Tagline */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0D1524] via-[#0A101C] to-[#0A0D14] border border-cyan-500/30 p-6 lg:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-cyan-400">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>MUARA TECHNO ACADEMY · CHARACTER CONTINUITY SYSTEM</span>
          </div>

          <h1 className="text-2xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            MUARA AI REALISTIC CHARACTER STUDIO
          </h1>

          <p className="text-lg lg:text-xl font-bold bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-300 bg-clip-text text-transparent">
            "CREATE ONCE. STAY CONSISTENT. LOOK REAL."
          </p>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed pt-1">
            Studio produksi karakter manusia AI fotorealistik dengan identitas wajah, geometri tulang, pori-pori kulit alami, proporsi tubuh, pakaian, suara, dan kepribadian yang terkunci secara permanen di seluruh adegan visual, video, gerak, dan storyboard.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => setActiveTab('create-character')}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-4 py-2.5 rounded-lg text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create New Character</span>
            </button>

            <button
              onClick={() => setActiveTab('dna-studio')}
              className="flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold px-4 py-2.5 rounded-lg text-xs active:scale-95 transition-all"
            >
              <Dna className="w-4 h-4 text-cyan-400" />
              <span>Inspect Master DNA</span>
            </button>
          </div>
        </div>
      </div>

      {/* Production Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#0C101A] border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
            Master Characters
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              {characters.length}
            </span>
            <span className="text-xs text-slate-400">Profiles</span>
          </div>
        </div>

        <div className="bg-[#0C101A] border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
            Identity Locked
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">
              {characters.filter((c) => c.dna.identityLocked).length}
            </span>
            <span className="text-xs text-slate-400">Locked 100%</span>
          </div>
        </div>

        <div className="bg-[#0C101A] border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
            Prompt Library
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-amber-300 tabular-nums">
              {savedPrompts.length}
            </span>
            <span className="text-xs text-slate-400">Compiled</span>
          </div>
        </div>

        <div className="bg-[#0C101A] border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
            Storyboards
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-purple-300 tabular-nums">
              {storyboardProjects.length}
            </span>
            <span className="text-xs text-slate-400">Productions</span>
          </div>
        </div>
      </div>

      {/* Active Character DNA Spotlight */}
      {activeCharacter && (
        <div className="bg-[#0C101A] border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  CURRENT PRODUCTION TARGET
                </span>
                <span className="font-mono text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {activeCharacter.dna.characterId}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">{activeCharacter.name}</h2>
              <p className="text-xs text-slate-400">
                {activeCharacter.dna.profession} · {activeCharacter.dna.nationality} ({activeCharacter.dna.visualAge} y/o)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('visual-prompt')}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Buat Visual</span>
              </button>

              <button
                onClick={() => setActiveTab('dna-studio')}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 text-slate-300 border border-slate-700 hover:bg-slate-800 transition-all"
              >
                <Dna className="w-3.5 h-3.5 text-cyan-400" />
                <span>Detail DNA</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 items-center">
            {/* Character Face Anchor */}
            <div className="md:col-span-1">
              <div className="w-full aspect-square rounded-xl overflow-hidden border border-slate-700 bg-slate-950 relative group">
                <img
                  src={activeCharacter.referenceImages.facePortrait}
                  alt={activeCharacter.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur-sm p-1.5 rounded text-[10px] text-center text-cyan-300 font-mono">
                  {activeCharacter.dna.identityLocked ? 'DNA LOCKED: 100%' : 'DNA UNLOCKED'}
                </div>
              </div>
            </div>

            {/* Core Facial Identity Tokens */}
            <div className="md:col-span-3 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 uppercase font-medium block">
                    Skin &amp; Texture
                  </span>
                  <span className="text-slate-200 font-semibold truncate block mt-0.5">
                    {activeCharacter.dna.skinTone}
                  </span>
                  <span className="text-[11px] text-slate-400 truncate block">
                    Pores &amp; SSS Natural
                  </span>
                </div>

                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 uppercase font-medium block">
                    Facial Geometry
                  </span>
                  <span className="text-slate-200 font-semibold truncate block mt-0.5">
                    {activeCharacter.dna.faceShape}
                  </span>
                  <span className="text-[11px] text-slate-400 truncate block">
                    Golden Ratio Contour
                  </span>
                </div>

                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 uppercase font-medium block">
                    Eyes &amp; Gaze
                  </span>
                  <span className="text-slate-200 font-semibold truncate block mt-0.5">
                    {activeCharacter.dna.eyeShape} ({activeCharacter.dna.eyeColor.split(' ')[0]})
                  </span>
                  <span className="text-[11px] text-slate-400 truncate block">
                    Iris Specular Catchlight
                  </span>
                </div>

                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 uppercase font-medium block">
                    Hair Identity
                  </span>
                  <span className="text-slate-200 font-semibold truncate block mt-0.5">
                    {activeCharacter.dna.hairStyle}
                  </span>
                  <span className="text-[11px] text-slate-400 truncate block">
                    {activeCharacter.dna.hairColor}
                  </span>
                </div>

                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 uppercase font-medium block">
                    Body &amp; Height
                  </span>
                  <span className="text-slate-200 font-semibold truncate block mt-0.5">
                    {activeCharacter.dna.bodyType}
                  </span>
                  <span className="text-[11px] text-slate-400 truncate block">
                    {activeCharacter.dna.height}
                  </span>
                </div>

                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 uppercase font-medium block">
                    Voice Archetype
                  </span>
                  <span className="text-slate-200 font-semibold truncate block mt-0.5">
                    {activeCharacter.dna.voiceIdentity.vocalDepth}
                  </span>
                  <span className="text-[11px] text-slate-400 truncate block">
                    {activeCharacter.dna.voiceIdentity.speakingSpeed}
                  </span>
                </div>
              </div>

              {/* Master Prompt Snippet */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
                    Master Photorealistic Visual Prompt:
                  </span>
                  <button
                    onClick={() => handleCopyPrompt(activeCharacter.dna.masterVisualPrompt)}
                    className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Salin Prompt</span>
                  </button>
                </div>
                <p className="font-mono text-slate-300 line-clamp-2 leading-relaxed text-[11px]">
                  {activeCharacter.dna.masterVisualPrompt}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Production Suite Quick Launch Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            PRODUCTION WORKFLOW MODULES
          </h2>
          <span className="text-xs text-slate-400">
            6 Specialized AI Prompt Engines
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickLaunchCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.tab}
                onClick={() => setActiveTab(card.tab)}
                className={`bg-[#0C101A] border rounded-xl p-4 cursor-pointer transition-all hover:border-cyan-500/50 hover:bg-[#0F1422] group shadow-sm ${card.color}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4 text-cyan-400" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Character Switcher Bar */}
      <div className="bg-[#0C101A] border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              CHARACTER ROSTER ({characters.length})
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('reference-library')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
          >
            Lihat Semua Perpustakaan &rarr;
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {characters.map((char) => {
            const isSelected = char.id === activeCharacter?.id;
            return (
              <div
                key={char.id}
                onClick={() => setActiveCharacterId(char.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center gap-3 ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500/60 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="w-10 h-10 rounded-md overflow-hidden bg-slate-950 shrink-0 border border-slate-700">
                  <img
                    src={char.referenceImages.facePortrait}
                    alt={char.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate">{char.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {char.dna.visualAge} y/o · {char.dna.gender}
                  </div>
                  {isSelected && (
                    <span className="text-[9px] font-mono text-cyan-400 font-bold block mt-0.5">
                      ACTIVE
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
