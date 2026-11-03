import React, { useState, useEffect } from 'react';
import {
  Activity,
  Plus,
  Trash2,
  Clock,
  Copy,
  Check,
  Save,
  Download,
  Sparkles,
  Move,
  Eye,
  Camera,
  Play,
  RotateCcw,
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { TimelineSegment, MotionPromptParams } from '../../types/character';
import { buildMotionPrompt } from '../../utils/promptGenerators';

export const MotionActionView: React.FC = () => {
  const {
    activeCharacter,
    characters,
    setActiveCharacterId,
    savePrompt,
    showToast,
    setActivePreviewPrompt,
  } = useStudio();

  // Category selectors
  const [bodyMovement, setBodyMovement] = useState('Standing then stepping forward with natural poise');
  const [facialMovement, setFacialMovement] = useState(
    'Natural blinking (1 blink per 3s), subtle confident smile, direct eye contact with lens'
  );
  const [cameraMotion, setCameraMotion] = useState('Dolly in 15% paired with micro handheld stabilization');

  // Action Timeline
  const [timeline, setTimeline] = useState<TimelineSegment[]>([
    {
      id: 'seg-1',
      timeRange: '0–2 seconds',
      action: 'Character looks directly into camera lens with composed posture',
      facialMovement: 'Neutral calm expression, slow natural eyelid blink at 1.2s',
      cameraMovement: 'Static camera with shallow depth of field',
    },
    {
      id: 'seg-2',
      timeRange: '2–5 seconds',
      action: 'Character smiles naturally, raises right hand to chest height in open communicative gesture',
      facialMovement: 'Subtle cheek muscle contraction, authentic eye crinkle, smile',
      cameraMovement: 'Smooth slow push in (approx 5% zoom)',
    },
    {
      id: 'seg-3',
      timeRange: '5–8 seconds',
      action: 'Character speaks with synchronized natural articulation, slight nod for emphasis',
      facialMovement: 'Organic jaw movement, realistic tongue visibility, lip phoneme sync',
      cameraMovement: 'Maintaining eye-level cinematic tracking',
    },
    {
      id: 'seg-4',
      timeRange: '8–10 seconds',
      action: 'Character completes statement, lowers hand gently, maintains reassuring eye contact',
      facialMovement: 'Gentle lingering warm smile, calm breath settling chest',
      cameraMovement: 'Subtle settle pause, gentle focus roll on eyes',
    },
  ]);

  const [compiledPrompt, setCompiledPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!activeCharacter) return;

    const result = buildMotionPrompt(activeCharacter.dna, {
      bodyMovement,
      facialMovement,
      cameraMotion,
      timeline,
    });

    setCompiledPrompt(result.masterPrompt);

    setActivePreviewPrompt({
      title: `MOTION PROMPT · ${activeCharacter.name}`,
      prompt: result.masterPrompt,
      type: 'MOTION',
    });
  }, [activeCharacter?.id, bodyMovement, facialMovement, cameraMotion, timeline]);

  const handleAddSegment = () => {
    const nextIndex = timeline.length + 1;
    const startSec = timeline.length * 2.5;
    const endSec = startSec + 2.5;
    const newSeg: TimelineSegment = {
      id: `seg-${Date.now()}`,
      timeRange: `${startSec.toFixed(1)}–${endSec.toFixed(1)}s`,
      action: 'Natural secondary gesture and posture realignment',
      facialMovement: 'Organic micro-expression and gaze retention',
      cameraMovement: 'Subtle cinematic drift',
    };
    setTimeline([...timeline, newSeg]);
    showToast('Tahapan timeline baru ditambahkan!', 'success');
  };

  const handleRemoveSegment = (id: string) => {
    if (timeline.length <= 1) {
      showToast('Minimal harus ada 1 tahapan aksi', 'error');
      return;
    }
    setTimeline(timeline.filter((s) => s.id !== id));
  };

  const handleUpdateSegment = (id: string, field: keyof TimelineSegment, val: string) => {
    setTimeline(
      timeline.map((s) => (s.id === id ? { ...s, [field]: val } : s))
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(compiledPrompt);
    setCopied(true);
    showToast('Motion prompt disalin ke clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToLibrary = () => {
    savePrompt({
      characterId: activeCharacter.id,
      characterName: activeCharacter.name,
      promptType: 'MOTION',
      title: `Motion Timeline (${timeline.length} stages) - ${activeCharacter.name}`,
      masterPrompt: compiledPrompt,
      tags: ['Motion', 'Timeline', activeCharacter.name],
    });
  };

  const bodyOptions = [
    'Walking with natural pace and arm sway',
    'Sitting comfortably, leaning forward slightly',
    'Standing upright with relaxed shoulders',
    'Turning 45 degrees toward the light source',
    'Expressive hand gestures explaining a concept',
    'Pointing deliberately toward visual element',
    'Waving friendly greeting toward audience',
    'Running dynamically with natural gravitational tilt',
    'Natural poise with subtle breathing motion',
  ];

  const facialOptions = [
    'Natural blinking with micro-expressions',
    'Subtle confident smile with warm eyes',
    'Genuine enthusiastic laugh with natural eye crinkles',
    'Speaking with phoneme-accurate lip movement',
    'Looking left thoughtfully then returning to camera',
    'Looking right taking in surroundings',
    'Direct piercing eye contact with viewer',
    'Deep emotional resonance and empathetic gaze',
  ];

  const cameraOptions = [
    'Static locked-off camera',
    'Cinematic slow zoom in',
    'Dramatic zoom out reveal',
    'Dolly in tracking forward',
    'Dolly out widening scope',
    'Orbit tracking shot 30 degrees',
    'Smooth horizontal pan',
    'Vertical tilt up to face',
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              KINEMATIC CONTINUITY ENGINE
            </span>
            <span className="font-mono text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              Natural Human Physics &amp; Micro-Expressions
            </span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-white mt-1">Motion &amp; Action Generator</h1>
          <p className="text-xs text-slate-400">
            Koreografi timeline pergerakan fisik tubuh, artikulasi wajah mikro, dan lintasan kamera tanpa merusak identitas wajah asli.
          </p>
        </div>

        {/* Character Selector */}
        <div className="flex items-center gap-2 bg-[#0C101A] p-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
          <span className="text-xs text-slate-400 pl-2">Karakter:</span>
          <select
            value={activeCharacter.id}
            onChange={(e) => setActiveCharacterId(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-100 focus:outline-none focus:border-cyan-500"
          >
            {characters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Motion Presets & Action Timeline (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Motion Categories */}
          <div className="bg-[#0C101A] border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <Move className="w-4 h-4 text-cyan-400" />
              <span>KATEGORI GERAKAN UTAMA</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Body Movement (Gerakan Tubuh)</label>
                <select
                  value={bodyMovement}
                  onChange={(e) => setBodyMovement(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  {bodyOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Facial Movement (Ekspresi Mikro Wajah)</label>
                <select
                  value={facialMovement}
                  onChange={(e) => setFacialMovement(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  {facialOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Camera Motion (Lintasan Kamera)</label>
                <select
                  value={cameraMotion}
                  onChange={(e) => setCameraMotion(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  {cameraOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Action Timeline Builder */}
          <div className="bg-[#0C101A] border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  ACTION TIMELINE CHOREOGRAPHY
                </h2>
              </div>

              <button
                onClick={handleAddSegment}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Tahapan</span>
              </button>
            </div>

            <div className="space-y-3">
              {timeline.map((seg, index) => (
                <div
                  key={seg.id}
                  className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2 relative"
                >
                  <div className="flex items-center justify-between pb-1 border-b border-slate-800/60">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[11px] font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        value={seg.timeRange}
                        onChange={(e) => handleUpdateSegment(seg.id, 'timeRange', e.target.value)}
                        className="bg-slate-900 border border-slate-700/80 rounded px-2 py-0.5 text-xs font-mono font-bold text-amber-300 w-32 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {timeline.length > 1 && (
                      <button
                        onClick={() => handleRemoveSegment(seg.id)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                        title="Hapus tahapan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
                    <div className="sm:col-span-3">
                      <label className="text-[10px] text-slate-400 block mb-0.5">Physical Action:</label>
                      <input
                        type="text"
                        value={seg.action}
                        onChange={(e) => handleUpdateSegment(seg.id, 'action', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] text-slate-400 block mb-0.5">Facial Expression:</label>
                      <input
                        type="text"
                        value={seg.facialMovement}
                        onChange={(e) => handleUpdateSegment(seg.id, 'facialMovement', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Camera:</label>
                      <input
                        type="text"
                        value={seg.cameraMovement}
                        onChange={(e) => handleUpdateSegment(seg.id, 'cameraMovement', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0C101A] border border-amber-500/30 rounded-xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
                  PHYSICAL CONTINUITY OUTPUT
                </span>
                <h3 className="text-sm font-bold text-white">Compiled Motion Directive</h3>
              </div>

              <span className="text-xs font-mono bg-slate-900 px-2 py-0.5 rounded text-slate-400 border border-slate-800">
                {timeline.length} Stages
              </span>
            </div>

            {/* Prompt Output */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-slate-200 leading-relaxed max-h-80 overflow-y-auto select-text whitespace-pre-wrap">
              {compiledPrompt}
            </div>

            {/* Kinematic Quality Guarantee */}
            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1">
              <span className="text-[10px] font-bold uppercase text-cyan-400 block">
                Kinematic Guarantee
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Prompt ini memuat instruksi inersia gravitasi, rotasi servikal alami leher, frekuensi kedip mata (1 kedipan/3 detik), dan locking fitur wajah 100%.
              </p>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-amber-500/10"
              >
                {copied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Tersalin!' : 'Copy Motion Prompt'}</span>
              </button>

              <button
                onClick={handleSaveToLibrary}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-amber-400 transition-colors"
                title="Simpan ke Prompt Library"
              >
                <Save className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
