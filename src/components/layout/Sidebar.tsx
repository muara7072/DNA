import React from 'react';
import {
  LayoutDashboard,
  UserPlus,
  Dna,
  Users,
  Image as ImageIcon,
  Video,
  Activity,
  Mic,
  Clapperboard,
  ShieldCheck,
  BookOpen,
  FolderKanban,
  Sliders,
  Lock,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { useStudio, TabKey } from '../../context/StudioContext';

interface MenuItem {
  key: TabKey;
  label: string;
  icon: React.ElementType;
  section?: string;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, activeCharacter, characters, setActiveCharacterId } = useStudio();

  const menuItems: MenuItem[] = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'CORE' },
    { key: 'create-character', label: 'Create New Character', icon: UserPlus, section: 'CHARACTER IDENTITY' },
    { key: 'dna-studio', label: 'Character DNA Studio', icon: Dna, badge: 'MASTER' },
    { key: 'reference-library', label: 'Reference Library', icon: Users },
    { key: 'visual-prompt', label: 'Visual Prompt Generator', icon: ImageIcon, section: 'PROMPT PRODUCTION' },
    { key: 'video-prompt', label: 'Video Prompt Generator', icon: Video },
    { key: 'motion-generator', label: 'Motion & Action Generator', icon: Activity },
    { key: 'voice-generator', label: 'Voice Identity Generator', icon: Mic },
    { key: 'storyboard-studio', label: 'Storyboard Studio', icon: Clapperboard, section: 'PRODUCTION SUITE' },
    { key: 'consistency-checker', label: 'Consistency Checker', icon: ShieldCheck, badge: 'AI AUDIT' },
    { key: 'prompt-library', label: 'Prompt Library', icon: BookOpen },
    { key: 'projects-history', label: 'History & Projects', icon: FolderKanban, section: 'SYSTEM' },
    { key: 'settings', label: 'Settings', icon: Sliders },
  ];

  return (
    <aside className="w-64 lg:w-72 bg-[#0A0D14] border-r border-slate-800/80 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] select-none">
      {/* Active Character Quick Bar in Sidebar */}
      {activeCharacter && (
        <div className="p-3 mx-3 mt-3 mb-1 bg-gradient-to-b from-slate-900 to-[#0F141E] rounded-xl border border-slate-800 shadow-sm">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
            <span>ACTIVE CHARACTER DNA</span>
            {activeCharacter.dna.identityLocked && (
              <span className="flex items-center gap-1 text-cyan-400 font-mono text-[9px] bg-cyan-950/60 border border-cyan-800/40 px-1 py-0.2 rounded">
                <Lock className="w-2.5 h-2.5" /> LOCKED
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-700 bg-slate-950 shrink-0 relative group cursor-pointer"
                 onClick={() => setActiveTab('dna-studio')}>
              <img
                src={activeCharacter.referenceImages.facePortrait}
                alt={activeCharacter.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-semibold text-xs text-white truncate flex items-center gap-1">
                {activeCharacter.name}
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                {activeCharacter.dna.gender} · {activeCharacter.dna.visualAge} y/o · {activeCharacter.dna.nationality}
              </div>
              <div className="text-[10px] font-mono text-cyan-400/80 mt-0.5">
                {activeCharacter.dna.characterId}
              </div>
            </div>
          </div>

          {/* Character Quick Switcher Dropdown */}
          {characters.length > 1 && (
            <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Switch:</span>
              <select
                value={activeCharacter.id}
                onChange={(e) => setActiveCharacterId(e.target.value)}
                className="bg-slate-950/80 border border-slate-700/60 rounded px-2 py-0.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 max-w-[130px] truncate"
              >
                {characters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;

          return (
            <React.Fragment key={item.key}>
              {item.section && (
                <div className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {item.section}
                </div>
              )}
              <button
                onClick={() => setActiveTab(item.key)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-950/60 to-slate-900 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        item.badge === 'MASTER'
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
              </button>
            </React.Fragment>
          );
        })}
      </nav>

      {/* Sidebar Footer Studio Info */}
      <div className="p-3 border-t border-slate-800/80 text-[11px] text-slate-400 bg-[#080A0F]">
        <div className="flex items-center justify-between text-slate-400 font-medium">
          <span>Engine Status</span>
          <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-400">
            ONLINE
          </span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">
          Muara Techno Academy Character Engine v2.4
        </p>
      </div>
    </aside>
  );
};
