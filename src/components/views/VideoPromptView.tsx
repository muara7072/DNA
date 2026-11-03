import React, { useState, useEffect } from 'react';
import {
  Video,
  Sparkles,
  Copy,
  Check,
  Save,
  Download,
  Film,
  Clock,
  Sliders,
  MessageSquare,
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { VideoPromptParams } from '../../types/character';
import { buildVideoPrompt } from '../../utils/promptGenerators';
import { optimizePromptWithAI } from '../../services/api';

export const VideoPromptView: React.FC = () => {
  const {
    activeCharacter,
    characters,
    setActiveCharacterId,
    savePrompt,
    showToast,
    setActivePreviewPrompt,
  } = useStudio();

  // Video Parameters
  const [sceneDescription, setSceneDescription] = useState(
    'Character turns toward camera while standing by sunlit panoramic window, explaining character continuity'
  );
  const [sceneLocation, setSceneLocation] = useState('High-rise creative studio with soft ambient morning haze');
  const [characterActivity, setCharacterActivity] = useState(
    'Natural walking pace, stops smoothly, gestures with right hand to emphasize points'
  );
  const [facialExpression, setFacialExpression] = useState(
    'Confident, warm reassuring smile, natural periodic blinks and brow articulation'
  );
  const [dialogue, setDialogue] = useState(
    'Satu karakter, ribuan kemungkinan visual. Identitas tetap terkunci sempurna.'
  );
  const [duration, setDuration] = useState<VideoPromptParams['duration']>('8 Seconds');
  const [cameraMovement, setCameraMovement] = useState<VideoPromptParams['cameraMovement']>('Slow Push In');
  const [videoStyle, setVisualStyle] = useState<VideoPromptParams['videoStyle']>('Photorealistic Cinematic');
  const [lighting, setLighting] = useState('Golden hour warm sunlight with cool ambient studio bounce');
  const [aspectRatio, setAspectRatio] = useState<VideoPromptParams['aspectRatio']>('16:9');

  const [compiledPrompt, setCompiledPrompt] = useState('');
  const [compiledNegative, setCompiledNegative] = useState('');
  const [instructions, setInstructions] = useState<string[]>([]);
  const [isAiOptimizing, setIsAiOptimizing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!activeCharacter) return;

    const result = buildVideoPrompt(activeCharacter.dna, {
      sceneDescription,
      sceneLocation,
      characterActivity,
      facialExpression,
      dialogue,
      duration,
      cameraMovement,
      videoStyle,
      lighting,
      aspectRatio,
    });

    setCompiledPrompt(result.masterPrompt);
    setCompiledNegative(result.negativePrompt);
    setInstructions(result.instructions);

    setActivePreviewPrompt({
      title: `VIDEO PROMPT · ${activeCharacter.name}`,
      prompt: result.masterPrompt,
      type: 'VIDEO',
    });
  }, [
    activeCharacter?.id,
    sceneDescription,
    sceneLocation,
    characterActivity,
    facialExpression,
    dialogue,
    duration,
    cameraMovement,
    videoStyle,
    lighting,
    aspectRatio,
  ]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Video prompt disalin ke clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToLibrary = () => {
    savePrompt({
      characterId: activeCharacter.id,
      characterName: activeCharacter.name,
      promptType: 'VIDEO',
      title: `${duration} - ${videoStyle} (${activeCharacter.name})`,
      masterPrompt: compiledPrompt,
      negativePrompt: compiledNegative,
      tags: ['Video', duration, videoStyle],
    });
  };

  const handleDownloadTxt = () => {
    const content = `MUARA AI REALISTIC CHARACTER STUDIO
CINEMATIC VIDEO PROMPT SPECIFICATION
Target Character: ${activeCharacter.name} (${activeCharacter.dna.characterId})
Duration: ${duration} | Aspect Ratio: ${aspectRatio} | Camera: ${cameraMovement}

--- MASTER VIDEO PROMPT ---
${compiledPrompt}

--- NEGATIVE PROMPT ---
${compiledNegative}

--- RUNTIME INSTRUCTIONS ---
${instructions.join('\n')}
`;
    const dataStr = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${activeCharacter.name.toLowerCase()}_video_prompt.txt`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Video prompt diunduh (TXT)', 'info');
  };

  const handleAiOptimize = async () => {
    setIsAiOptimizing(true);
    showToast('Mengoptimasi video prompt via Gemini AI...', 'info');

    const result = await optimizePromptWithAI(
      'VIDEO CINEMATIC PROMPT',
      activeCharacter.dna,
      sceneDescription,
      { sceneLocation, characterActivity, facialExpression, dialogue, duration, cameraMovement, videoStyle, lighting, aspectRatio }
    );

    setIsAiOptimizing(false);

    if (result.success && result.masterPrompt) {
      setCompiledPrompt(result.masterPrompt);
      if (result.negativePrompt) setCompiledNegative(result.negativePrompt);
      showToast('Video prompt berhasil diperkaya oleh AI!', 'success');
      setActivePreviewPrompt({
        title: `AI OPTIMIZED VIDEO · ${activeCharacter.name}`,
        prompt: result.masterPrompt,
        type: 'AI VIDEO',
      });
    } else {
      showToast('Engine lokal telah menghasilkan formula video prompt yang optimal.', 'info');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              CINEMATIC VIDEO PROMPT GENERATOR
            </span>
            <span className="font-mono text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              Kling AI · Runway Gen-3 · Sora · Veo
            </span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-white mt-1">Video Prompt Generator</h1>
          <p className="text-xs text-slate-400">
            Hasilkan prompt video profesional lengkap dengan instruksi lip-sync, pergerakan kamera sinematik, dan proteksi konsistensi wajah antar-frame.
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
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-[#0C101A] border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              PARAMETER SINEMATOGRAFI &amp; TIMING
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Duration</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['5 Seconds', '8 Seconds', '10 Seconds', '15 Seconds'] as const).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDuration(d)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all border ${
                        duration === d
                          ? 'bg-blue-600 text-white border-blue-400 font-bold'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Camera Movement</label>
                <select
                  value={cameraMovement}
                  onChange={(e) => setCameraMovement(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Static Camera">Static Camera</option>
                  <option value="Slow Push In">Slow Push In</option>
                  <option value="Dolly In">Dolly In</option>
                  <option value="Dolly Out">Dolly Out</option>
                  <option value="Tracking Shot">Tracking Shot</option>
                  <option value="Pan Left">Pan Left</option>
                  <option value="Pan Right">Pan Right</option>
                  <option value="Orbit Shot">Orbit Shot</option>
                  <option value="Handheld Cinematic">Handheld Cinematic</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Video Style</label>
                <select
                  value={videoStyle}
                  onChange={(e) => setVisualStyle(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Photorealistic Cinematic">Photorealistic Cinematic</option>
                  <option value="Hollywood Film Look">Hollywood Film Look</option>
                  <option value="Commercial Film">Commercial Film</option>
                  <option value="Documentary">Documentary</option>
                  <option value="Professional Interview">Professional Interview</option>
                  <option value="Talking Head Video">Talking Head Video</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Aspect Ratio</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['16:9', '9:16', '1:1', '4:5'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setAspectRatio(r)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-mono font-semibold transition-all border ${
                        aspectRatio === r
                          ? 'bg-blue-600 text-white border-blue-400 font-bold'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Scene Action & Dialogue */}
          <div className="bg-[#0C101A] border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              AKSI KARAKTER &amp; LIP-SYNC DIALOG
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Scene Description</label>
                <textarea
                  rows={2}
                  value={sceneDescription}
                  onChange={(e) => setSceneDescription(e.target.value)}
                  placeholder="Deskripsi adegan video..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Lokasi Adegan (Scene Location)</label>
                  <input
                    type="text"
                    value={sceneLocation}
                    onChange={(e) => setSceneLocation(e.target.value)}
                    placeholder="e.g. Modern glass office, dusk lighting"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Pencahayaan (Lighting)</label>
                  <input
                    type="text"
                    value={lighting}
                    onChange={(e) => setLighting(e.target.value)}
                    placeholder="e.g. Natural soft rim light"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Aktivitas / Gerakan Tubuh</label>
                  <input
                    type="text"
                    value={characterActivity}
                    onChange={(e) => setCharacterActivity(e.target.value)}
                    placeholder="e.g. Berjalan pelan lalu berhenti dan menoleh"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Ekspresi Mikro Wajah</label>
                  <input
                    type="text"
                    value={facialExpression}
                    onChange={(e) => setFacialExpression(e.target.value)}
                    placeholder="e.g. Senyum hangat, kedipan mata natural"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1 flex items-center justify-between">
                  <span>Dialog Karakter (Teks untuk sinkronisasi bibir / lip-sync)</span>
                  <span className="text-[10px] text-cyan-400 font-mono">Audio &amp; Lip Sync</span>
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <textarea
                    rows={2}
                    value={dialogue}
                    onChange={(e) => setDialogue(e.target.value)}
                    placeholder="Ketik kalimat dialog yang akan diucapkan karakter..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 resize-none text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Box (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0C101A] border border-blue-500/30 rounded-xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block">
                  READY FOR VIDEO GENERATORS
                </span>
                <h3 className="text-sm font-bold text-white">Generated Video Prompt</h3>
              </div>

              <button
                onClick={handleAiOptimize}
                disabled={isAiOptimizing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-300 text-xs font-bold hover:brightness-125 transition-all"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isAiOptimizing ? 'animate-spin' : ''}`} />
                <span>{isAiOptimizing ? 'Optimizing...' : 'AI Enhance'}</span>
              </button>
            </div>

            {/* Compiled Video Prompt Box */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-300 block">Master Video Prompt:</span>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-slate-200 leading-relaxed max-h-64 overflow-y-auto select-text">
                {compiledPrompt}
              </div>
            </div>

            {/* Negative Prompt */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-400 block">Video Negative Prompt:</span>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400 leading-relaxed select-text">
                {compiledNegative}
              </div>
            </div>

            {/* Instructions */}
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-2">
                Production Continuity Directives:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {instructions.map((inst, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-blue-400/90"
                  >
                    {inst}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
              <button
                onClick={() => handleCopy(compiledPrompt)}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:brightness-110 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-blue-500/10"
              >
                {copied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Tersalin!' : 'Copy Video Prompt'}</span>
              </button>

              <button
                onClick={handleSaveToLibrary}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-400 transition-colors"
                title="Simpan ke Prompt Library"
              >
                <Save className="w-4 h-4" />
              </button>

              <button
                onClick={handleDownloadTxt}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-400 transition-colors"
                title="Download TXT"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
