import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Lock,
  Unlock,
  Copy,
  Trash2,
  ExternalLink,
  Download,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export const ReferenceLibraryView: React.FC = () => {
  const {
    characters,
    activeCharacterId,
    setActiveCharacterId,
    duplicateCharacter,
    deleteCharacter,
    toggleIdentityLock,
    setActiveTab,
    showToast,
  } = useStudio();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocked, setFilterLocked] = useState<'all' | 'locked' | 'unlocked'>('all');

  const filteredCharacters = characters.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.dna.nationality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.dna.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.dna.characterId.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterLocked === 'locked') return c.dna.identityLocked;
    if (filterLocked === 'unlocked') return !c.dna.identityLocked;
    return true;
  });

  const handleExportCharacter = (char: any) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(char, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${char.name.toLowerCase().replace(/\s+/g, '_')}_profile.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`Profil ${char.name} diekspor!`, 'success');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              CHARACTER ROSTER REPOSITORY
            </span>
            <span className="font-mono text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {characters.length} Registered
            </span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-white mt-1">Character Reference Library</h1>
          <p className="text-xs text-slate-400">
            Daftar seluruh model karakter fotorealistik yang tersimpan dengan Master DNA aktif.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('create-character')}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs shadow-md shadow-cyan-500/10 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Character</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0C101A] p-3 rounded-xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari karakter berdasarkan nama, ID, profesi, atau asal negara..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 shrink-0">
          <button
            onClick={() => setFilterLocked('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filterLocked === 'all'
                ? 'bg-slate-800 text-cyan-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({characters.length})
          </button>
          <button
            onClick={() => setFilterLocked('locked')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filterLocked === 'locked'
                ? 'bg-slate-800 text-cyan-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Locked ({characters.filter((c) => c.dna.identityLocked).length})
          </button>
          <button
            onClick={() => setFilterLocked('unlocked')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filterLocked === 'unlocked'
                ? 'bg-slate-800 text-cyan-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Unlocked ({characters.filter((c) => !c.dna.identityLocked).length})
          </button>
        </div>
      </div>

      {/* Character Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCharacters.map((char) => {
          const isActive = char.id === activeCharacterId;

          return (
            <div
              key={char.id}
              className={`bg-[#0C101A] border rounded-2xl overflow-hidden transition-all flex flex-col justify-between ${
                isActive
                  ? 'border-cyan-500/80 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-500/40'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Portrait Header */}
                <div className="w-full aspect-[4/3] bg-slate-950 relative overflow-hidden group">
                  <img
                    src={char.referenceImages.facePortrait}
                    alt={char.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C101A] via-transparent to-black/40 flex flex-col justify-between p-3.5">
                    {/* Top tags */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-cyan-300 bg-slate-950/80 border border-slate-700 px-2 py-0.5 rounded backdrop-blur-sm">
                        {char.dna.characterId}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleIdentityLock(char.id);
                        }}
                        className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm transition-all ${
                          char.dna.identityLocked
                            ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/60'
                            : 'bg-amber-950/90 text-amber-300 border border-amber-500/60'
                        }`}
                      >
                        {char.dna.identityLocked ? (
                          <>
                            <Lock className="w-3 h-3 text-cyan-400" />
                            <span>LOCKED</span>
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3 h-3 text-amber-400" />
                            <span>UNLOCKED</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Bottom overlay info */}
                    <div>
                      <h2 className="text-lg font-bold text-white tracking-tight">{char.name}</h2>
                      <div className="text-xs text-slate-300 font-medium">
                        {char.dna.profession}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Character Specs Strip */}
                <div className="p-4 space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span>{char.dna.visualAge} y/o</span>
                    <span>·</span>
                    <span>{char.dna.gender}</span>
                    <span>·</span>
                    <span>{char.dna.nationality}</span>
                    <span>·</span>
                    <span>{char.dna.bodyType}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-slate-950 p-2 rounded border border-slate-800/80">
                      <span className="text-slate-400 block text-[10px] uppercase">Skin Tone</span>
                      <span className="text-slate-200 font-medium truncate block">{char.dna.skinTone}</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800/80">
                      <span className="text-slate-400 block text-[10px] uppercase">Eyes</span>
                      <span className="text-slate-200 font-medium truncate block">
                        {char.dna.eyeShape} ({char.dna.eyeColor.split(' ')[0]})
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {char.dna.distinctiveFeatures}
                  </p>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-4 pt-0 space-y-2 border-t border-slate-800/60 mt-2">
                <div className="flex items-center gap-2 pt-3">
                  <button
                    onClick={() => {
                      setActiveCharacterId(char.id);
                      setActiveTab('visual-prompt');
                    }}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-cyan-300'
                    }`}
                  >
                    {isActive ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Active Character</span>
                      </>
                    ) : (
                      <span>Select Target</span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setActiveCharacterId(char.id);
                      setActiveTab('dna-studio');
                    }}
                    title="Inspect Master DNA"
                    className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-slate-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => duplicateCharacter(char.id)}
                    title="Duplikat Karakter"
                    className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-slate-700 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleExportCharacter(char)}
                    title="Export Profile JSON"
                    className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-slate-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  {!char.isPreset && characters.length > 1 && (
                    <button
                      onClick={() => deleteCharacter(char.id)}
                      title="Hapus Karakter"
                      className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-rose-400 hover:bg-rose-950/40 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
