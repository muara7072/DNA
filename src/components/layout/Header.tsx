import React from 'react';
import {
  Lock,
  Unlock,
  Sparkles,
  PanelRightClose,
  PanelRightOpen,
  PlusCircle,
  Cpu,
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export const Header: React.FC = () => {
  const {
    activeCharacter,
    toggleIdentityLock,
    setActiveTab,
    isRightPanelOpen,
    toggleRightPanel,
  } = useStudio();

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#0E121B]/95 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between gap-4 sticky top-0 z-40 select-none">
      {/* Zone 1: Brand & Subtitle */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 via-blue-600 to-amber-400 p-[1px] shadow-lg shadow-cyan-500/10">
          <div className="w-full h-full bg-[#0B0E14] rounded-[7px] flex items-center justify-center">
            <span className="font-mono font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-amber-300 text-sm tracking-wider">
              M
            </span>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm lg:text-base font-bold tracking-tight text-white whitespace-nowrap">
              MUARA AI REALISTIC CHARACTER STUDIO
            </h1>
            <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-wider text-amber-400/90 border border-amber-400/30 px-1.5 py-0.2 rounded bg-amber-400/5">
              Academy
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden md:block">
            AI CHARACTER IDENTITY &amp; CREATIVE PRODUCTION SYSTEM · <span className="text-cyan-400 font-medium tracking-wide">CREATE ONCE. STAY CONSISTENT. LOOK REAL.</span>
          </p>
        </div>
      </div>

      {/* Zone 2: Active Character DNA Quick Pill */}
      {activeCharacter && (
        <div className="hidden xl:flex items-center gap-3 bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5 shadow-inner">
          <div className="w-6 h-6 rounded-md overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
            <img
              src={activeCharacter.referenceImages.facePortrait}
              alt={activeCharacter.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-xs">
            <span className="text-slate-400">Target DNA:</span>{' '}
            <span className="font-semibold text-slate-100">{activeCharacter.name}</span>{' '}
            <span className="font-mono text-[10px] text-slate-400">({activeCharacter.dna.characterId})</span>
          </div>

          <button
            onClick={() => toggleIdentityLock(activeCharacter.id)}
            title={activeCharacter.dna.identityLocked ? 'Identity Terkunci (Klik untuk membuka)' : 'Identity Terbuka (Klik untuk mengunci)'}
            className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded transition-all ${
              activeCharacter.dna.identityLocked
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
            }`}
          >
            {activeCharacter.dna.identityLocked ? (
              <>
                <Lock className="w-3 h-3" />
                <span>DNA LOCKED</span>
              </>
            ) : (
              <>
                <Unlock className="w-3 h-3" />
                <span>UNLOCKED</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Zone 3: Actions & Preview Panel Toggle */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          onClick={() => setActiveTab('create-character')}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-900 bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-300 hover:brightness-110 active:scale-95 transition-all px-3 py-2 rounded-lg shadow-md shadow-cyan-500/10 whitespace-nowrap"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Character</span>
        </button>

        <button
          onClick={toggleRightPanel}
          title={isRightPanelOpen ? 'Tutup Preview Panel' : 'Buka Preview Panel'}
          className={`p-2 rounded-lg border transition-colors ${
            isRightPanelOpen
              ? 'bg-slate-800 text-cyan-400 border-cyan-500/30'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
          aria-label="Toggle Preview Panel"
        >
          {isRightPanelOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
