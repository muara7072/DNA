import React, { useState } from 'react';
import {
  Dna,
  Lock,
  Unlock,
  Edit3,
  Check,
  Copy,
  Download,
  Shield,
  FileCode,
  Sparkles,
  Info,
  Save,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { MasterCharacterDNA } from '../../types/character';

export const DnaStudioView: React.FC = () => {
  const { activeCharacter, updateCharacterDna, toggleIdentityLock, showToast, setActivePreviewPrompt } =
    useStudio();

  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'visual' | 'json'>('visual');

  // Local state for editable fields
  const [formData, setFormData] = useState<MasterCharacterDNA>(() => activeCharacter.dna);

  // Sync if character changes
  React.useEffect(() => {
    setFormData(activeCharacter.dna);
  }, [activeCharacter.id]);

  const handleSaveDna = () => {
    updateCharacterDna(activeCharacter.id, formData);
    setIsEditing(false);
    showToast('Master Character DNA berhasil diperbarui!', 'success');
  };

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Disalin ke clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activeCharacter.dna, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${activeCharacter.name.toLowerCase().replace(/\s+/g, '_')}_master_dna.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Master Character DNA diekspor (JSON)', 'info');
  };

  const handleInspectPreview = () => {
    setActivePreviewPrompt({
      title: `MASTER DNA: ${activeCharacter.name}`,
      prompt: activeCharacter.dna.masterVisualPrompt,
      type: 'MASTER DNA',
    });
    showToast('Prompt dimuat ke panel preview kanan!', 'info');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              MASTER CHARACTER DNA ENGINE
            </span>
            <span className="font-mono text-xs text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
              {activeCharacter.dna.characterId}
            </span>
            {activeCharacter.dna.identityLocked && (
              <span className="flex items-center gap-1 text-[10px] font-mono text-cyan-300 bg-cyan-950/80 border border-cyan-800/60 px-2 py-0.5 rounded">
                <Lock className="w-2.5 h-2.5 text-cyan-400" /> IDENTITY LOCKED
              </span>
            )}
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-white mt-1">
            {activeCharacter.name} · Master DNA Architecture
          </h1>
          <p className="text-xs text-slate-400">
            Pusat penyimpanan identitas permanen. Menjamin konsistensi biometrik wajah, tekstur kulit, dan proporsi tubuh di semua model generasi AI.
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="bg-slate-900 border border-slate-800 p-0.5 rounded-lg flex items-center">
            <button
              onClick={() => setViewMode('visual')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                viewMode === 'visual' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Visual Card
            </button>
            <button
              onClick={() => setViewMode('json')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                viewMode === 'json' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Raw DNA JSON
            </button>
          </div>

          <button
            onClick={() => toggleIdentityLock(activeCharacter.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              activeCharacter.dna.identityLocked
                ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/25'
                : 'bg-amber-500/15 text-amber-300 border-amber-500/40 hover:bg-amber-500/25'
            }`}
          >
            {activeCharacter.dna.identityLocked ? (
              <>
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>UNLOCK IDENTITY</span>
              </>
            ) : (
              <>
                <Unlock className="w-3.5 h-3.5 text-amber-400" />
                <span>LOCK IDENTITY</span>
              </>
            )}
          </button>

          {isEditing ? (
            <button
              onClick={handleSaveDna}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>UPDATE CHARACTER</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-all"
            >
              <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>EDIT DNA</span>
            </button>
          )}

          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-all"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>EXPORT DNA</span>
          </button>
        </div>
      </div>

      {/* Identity Lock System Banner */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-[#0A0E18] border border-cyan-500/30 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              SISTEM CHARACTER IDENTITY LOCK AKTIF
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
              Identitas biometrik wajah, geometri rahang, kontur mata, dan tekstur kulit diikat ke token Master DNA. Model dilarang merubah identitas dasar, hanya pose, pakaian, dan lingkungan yang boleh disesuaikan adegan.
            </p>
          </div>
        </div>

        <button
          onClick={handleInspectPreview}
          className="self-start md:self-center flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold hover:bg-cyan-500/20 whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>VIEW PROMPT INSPECTION</span>
        </button>
      </div>

      {viewMode === 'json' ? (
        /* Raw DNA JSON Viewer */
        <div className="bg-[#080B10] border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-slate-400 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span>master_character_dna_{activeCharacter.dna.characterId}.json</span>
            </span>
            <button
              onClick={() => handleCopyPrompt(JSON.stringify(activeCharacter.dna, null, 2))}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              <span>Salin Raw JSON</span>
            </button>
          </div>

          <pre className="p-4 bg-slate-950 rounded-lg text-xs font-mono text-slate-200 overflow-x-auto max-h-[500px] border border-slate-800/80">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      ) : (
        /* Visual DNA Card View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Biometric Face & Physical DNA */}
          <div className="lg:col-span-2 space-y-5">
            {/* Core Biometrics */}
            <div className="bg-[#0C101A] border border-slate-800 rounded-xl p-5 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center justify-between">
                <span>1. BIOMETRIC FACIAL IDENTITY</span>
                {isEditing && <span className="text-[10px] text-amber-300 font-mono">EDITING MODE</span>}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Face Geometry &amp; Contour</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.faceGeometry}
                      onChange={(e) => setFormData({ ...formData, faceGeometry: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                    />
                  ) : (
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-200 font-medium">
                      {formData.faceShape} · {formData.faceGeometry}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Skin Tone &amp; Micro-Texture</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.skinTexture}
                      onChange={(e) => setFormData({ ...formData, skinTexture: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                    />
                  ) : (
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-200 font-medium">
                      {formData.skinTone} · {formData.skinTexture}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Eyes, Iris &amp; Eyebrows</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={`${formData.eyeShape} - ${formData.eyeColor}`}
                      onChange={(e) => setFormData({ ...formData, eyeColor: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                    />
                  ) : (
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-200 font-medium">
                      {formData.eyeShape} ({formData.eyeColor}) · Alis {formData.eyebrow}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Nose &amp; Lip Shape</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={`${formData.noseShape} / ${formData.lipShape}`}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                    />
                  ) : (
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-200 font-medium">
                      {formData.noseShape} · {formData.lipShape}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Hair Identity</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.hairStyle}
                      onChange={(e) => setFormData({ ...formData, hairStyle: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                    />
                  ) : (
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-200 font-medium">
                      {formData.hairStyle} ({formData.hairColor})
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Body Proportions &amp; Height</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={`${formData.bodyType} - ${formData.height}`}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                    />
                  ) : (
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-200 font-medium">
                      {formData.bodyType} · {formData.height}
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-400 font-medium mb-1">Distinctive Features (Ciri Khas Permanen)</label>
                  {isEditing ? (
                    <textarea
                      rows={2}
                      value={formData.distinctiveFeatures}
                      onChange={(e) => setFormData({ ...formData, distinctiveFeatures: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 resize-none"
                    />
                  ) : (
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-200 font-medium leading-relaxed">
                      {formData.distinctiveFeatures}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Personality, Clothing & Voice DNA */}
            <div className="bg-[#0C101A] border border-slate-800 rounded-xl p-5 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                2. PERSONALITY, CLOTHING &amp; VOICE DNA
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Profession &amp; Persona</label>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-200 font-medium">
                    {formData.profession}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Clothing Identity</label>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-200 font-medium truncate">
                    {formData.clothingIdentity || formData.clothingStyle}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Voice Identity Profile</label>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-200 font-medium">
                    {formData.voiceIdentity?.voiceName} · {formData.voiceIdentity?.vocalDepth} ({formData.voiceIdentity?.speakingSpeed})
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Speaking Style &amp; Accent</label>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-200 font-medium">
                    {formData.speakingStyle} · {formData.voiceIdentity?.accent}
                  </div>
                </div>
              </div>
            </div>

            {/* Master Visual & Negative Prompts */}
            <div className="bg-[#0C101A] border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  3. MASTER VISUAL &amp; NEGATIVE PROMPT
                </h2>
                <button
                  onClick={() => handleCopyPrompt(formData.masterVisualPrompt)}
                  className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin' : 'Salin Master Visual'}</span>
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-medium block mb-1">
                    Master Visual Prompt (Preservation Lock):
                  </span>
                  {isEditing ? (
                    <textarea
                      rows={3}
                      value={formData.masterVisualPrompt}
                      onChange={(e) => setFormData({ ...formData, masterVisualPrompt: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 font-mono text-slate-200 resize-none text-[11px]"
                    />
                  ) : (
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-slate-200 text-[11px] leading-relaxed">
                      {formData.masterVisualPrompt}
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-medium block mb-1">
                    Master Negative Prompt:
                  </span>
                  {isEditing ? (
                    <textarea
                      rows={2}
                      value={formData.negativePrompt}
                      onChange={(e) => setFormData({ ...formData, negativePrompt: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 font-mono text-slate-200 resize-none text-[11px]"
                    />
                  ) : (
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-slate-400 text-[11px]">
                      {formData.negativePrompt}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Reference & 9 Rules */}
          <div className="space-y-5">
            {/* Visual Portrait Card */}
            <div className="bg-[#0C101A] border border-slate-800 rounded-xl p-4 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                ORIGINAL REFERENCE IMAGE
              </span>

              <div className="w-full aspect-square rounded-xl overflow-hidden border border-slate-700 bg-slate-950 relative group">
                <img
                  src={activeCharacter.referenceImages.facePortrait}
                  alt={activeCharacter.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                  <div className="font-bold text-white text-sm">{activeCharacter.name}</div>
                  <div className="text-[11px] text-cyan-400 font-mono">{activeCharacter.dna.characterId}</div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 pt-1">
                Foto referensi master ini digunakan sebagai patokan visual identitas wajah (ground truth anchor) untuk semua prompt.
              </div>
            </div>

            {/* 9 Rules of Character Identity */}
            <div className="bg-[#0C101A] border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  9 ATURAN IDENTITY LOCK
                </h3>
              </div>

              <ol className="text-xs text-slate-400 space-y-2 list-decimal pl-4 leading-relaxed">
                <li><strong className="text-slate-200">Dilarang mengubah</strong> identitas wajah karakter.</li>
                <li><strong className="text-slate-200">Kunci bentuk</strong> mata, hidung, bibir, rahang, dan proporsi tulang wajah.</li>
                <li><strong className="text-slate-200">Pertahankan</strong> warna kulit dan tekstur mikro-pori alami.</li>
                <li><strong className="text-slate-200">Pertahankan</strong> visual age ({activeCharacter.dna.visualAge} tahun).</li>
                <li><strong className="text-slate-200">Pertahankan</strong> karakteristik rambut ({activeCharacter.dna.hairColor}).</li>
                <li><strong className="text-slate-200">Pertahankan</strong> ciri khas tubuh dan postur.</li>
                <li><strong className="text-slate-200">Dilarang menghasilkan wajah baru</strong> ketika karakter digunakan di adegan berbeda.</li>
                <li><span className="text-cyan-400">Variasi diizinkan:</span> Ekspresi, pose, baju, pencahayaan, dan background.</li>
                <li><strong className="text-slate-200">Identitas utama</strong> selalu mengacu pada Master DNA dan foto referensi asli.</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
