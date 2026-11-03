import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Sparkles,
  Copy,
  Check,
  Save,
  Download,
  Lock,
  Layers,
  Camera,
  Sliders,
  Send,
  RefreshCw,
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { VisualPromptParams } from '../../types/character';
import { buildVisualPrompt } from '../../utils/promptGenerators';
import { optimizePromptWithAI } from '../../services/api';

export const VisualPromptView: React.FC = () => {
  const {
    activeCharacter,
    characters,
    setActiveCharacterId,
    savePrompt,
    showToast,
    setActivePreviewPrompt,
  } = useStudio();

  // Visual Prompt Controls State
  const [shotType, setShotType] = useState<VisualPromptParams['shotType']>('Headshot');
  const [camera, setCamera] = useState<VisualPromptParams['camera']>('Portrait Photography (85mm f/1.4)');
  const [visualStyle, setVisualStyle] = useState<VisualPromptParams['visualStyle']>('Ultra Photorealistic');
  const [lighting, setLighting] = useState<VisualPromptParams['lighting']>('Studio Lighting');
  const [aspectRatio, setAspectRatio] = useState<VisualPromptParams['aspectRatio']>('1:1');
  const [sceneDescription, setSceneDescription] = useState('High-end editorial studio portrait, direct gaze with serene confidence');
  const [clothingOverride, setClothingOverride] = useState('');
  const [facialExpression, setFacialExpression] = useState('Gentle natural smile, engaging catchlights in irises');
  const [pose, setPose] = useState('Natural 3/4 angle posture with shoulders squared toward camera');
  const [environment, setEnvironment] = useState('Minimalist modern studio backdrop with warm neutral travertine wall');

  const [compiledPrompt, setCompiledPrompt] = useState('');
  const [compiledNegative, setCompiledNegative] = useState('');
  const [technicalBreakdown, setTechnicalBreakdown] = useState<string[]>([]);
  const [isAiOptimizing, setIsAiOptimizing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync / Recompile when parameters change
  useEffect(() => {
    if (!activeCharacter) return;

    const result = buildVisualPrompt(activeCharacter.dna, {
      shotType,
      camera,
      visualStyle,
      lighting,
      aspectRatio,
      sceneDescription,
      clothingOverride: clothingOverride || undefined,
      facialExpression: facialExpression || undefined,
      pose: pose || undefined,
      environment: environment || undefined,
    });

    setCompiledPrompt(result.masterPrompt);
    setCompiledNegative(result.negativePrompt);
    setTechnicalBreakdown(result.technicalBreakdown);

    setActivePreviewPrompt({
      title: `VISUAL PROMPT · ${activeCharacter.name}`,
      prompt: result.masterPrompt,
      type: 'VISUAL',
    });
  }, [
    activeCharacter?.id,
    shotType,
    camera,
    visualStyle,
    lighting,
    aspectRatio,
    sceneDescription,
    clothingOverride,
    facialExpression,
    pose,
    environment,
  ]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Prompt visual disalin ke clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToLibrary = () => {
    savePrompt({
      characterId: activeCharacter.id,
      characterName: activeCharacter.name,
      promptType: 'VISUAL',
      title: `${shotType} - ${sceneDescription.slice(0, 32)}...`,
      masterPrompt: compiledPrompt,
      negativePrompt: compiledNegative,
      tags: [shotType, visualStyle, activeCharacter.name],
    });
  };

  const handleDownloadTxt = () => {
    const content = `MUARA AI REALISTIC CHARACTER STUDIO
VISUAL PROMPT PRODUCTION SPECIFICATION
Character: ${activeCharacter.name} (${activeCharacter.dna.characterId})
Aspect Ratio: ${aspectRatio} | Shot: ${shotType}

--- MASTER PROMPT ---
${compiledPrompt}

--- NEGATIVE PROMPT ---
${compiledNegative}

--- TECHNICAL SPECS ---
${technicalBreakdown.join('\n')}
`;
    const dataStr = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${activeCharacter.name.toLowerCase()}_visual_prompt.txt`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Spesifikasi prompt diunduh (TXT)', 'info');
  };

  const handleAiOptimize = async () => {
    setIsAiOptimizing(true);
    showToast('Mengoptimasi prompt dengan Gemini AI Engine...', 'info');

    const result = await optimizePromptWithAI(
      'VISUAL PHOTOREALISTIC',
      activeCharacter.dna,
      sceneDescription,
      { shotType, camera, visualStyle, lighting, aspectRatio, pose, environment }
    );

    setIsAiOptimizing(false);

    if (result.success && result.masterPrompt) {
      setCompiledPrompt(result.masterPrompt);
      if (result.negativePrompt) setCompiledNegative(result.negativePrompt);
      showToast('Prompt visual berhasil disempurnakan oleh AI!', 'success');
      setActivePreviewPrompt({
        title: `AI OPTIMIZED VISUAL · ${activeCharacter.name}`,
        prompt: result.masterPrompt,
        type: 'AI VISUAL',
      });
    } else {
      showToast('Engine lokal telah menghasilkan formula prompt master yang optimal.', 'info');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              PHOTOREALISTIC PROMPT ENGINE
            </span>
            <span className="font-mono text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              Midjourney v6.1 &amp; Flux.1 Pro Ready
            </span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-white mt-1">Visual Prompt Generator</h1>
          <p className="text-xs text-slate-400">
            Sintesis prompt gambar fotorealistik dengan perlindungan Master DNA dan instruksi preservasi wajah otomatis.
          </p>
        </div>

        {/* Character Selector */}
        <div className="flex items-center gap-2 bg-[#0C101A] p-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
          <span className="text-xs text-slate-400 pl-2">Target Karakter:</span>
          <select
            value={activeCharacter.id}
            onChange={(e) => setActiveCharacterId(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-100 focus:outline-none focus:border-cyan-500"
          >
            {characters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.dna.characterId})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-[#0C101A] border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center justify-between">
              <span>PARAMETER FOTOGRAFI &amp; KAMERA</span>
              <span className="font-mono text-[10px] text-slate-400">Aspect: {aspectRatio}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Shot Type</label>
                <select
                  value={shotType}
                  onChange={(e) => setShotType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Extreme Close Up">Extreme Close Up</option>
                  <option value="Close Up">Close Up</option>
                  <option value="Headshot">Headshot</option>
                  <option value="Medium Shot">Medium Shot</option>
                  <option value="Medium Full Shot">Medium Full Shot</option>
                  <option value="Full Body">Full Body</option>
                  <option value="Wide Shot">Wide Shot</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Camera &amp; Lens</label>
                <select
                  value={camera}
                  onChange={(e) => setCamera(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Portrait Photography (85mm f/1.4)">Portrait Photography (85mm f/1.4)</option>
                  <option value="Professional Studio Photography">Professional Studio Photography</option>
                  <option value="Cinematic Photography (35mm Anamorphic)">Cinematic Photography (35mm Anamorphic)</option>
                  <option value="Documentary Photography (Leica 50mm)">Documentary Photography (Leica 50mm)</option>
                  <option value="Commercial Photography (Hasselblad H6D-100c)">Commercial Photography (Hasselblad H6D)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Visual Style</label>
                <select
                  value={visualStyle}
                  onChange={(e) => setVisualStyle(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Ultra Photorealistic">Ultra Photorealistic</option>
                  <option value="Hyper Realistic">Hyper Realistic</option>
                  <option value="Natural Human Photography">Natural Human Photography</option>
                  <option value="Cinematic Realism">Cinematic Realism</option>
                  <option value="Professional Corporate Portrait">Professional Corporate Portrait</option>
                  <option value="Luxury Editorial">Luxury Editorial</option>
                  <option value="Documentary Realism">Documentary Realism</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Lighting Setup</label>
                <select
                  value={lighting}
                  onChange={(e) => setLighting(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Natural Soft Light">Natural Soft Light</option>
                  <option value="Golden Hour">Golden Hour</option>
                  <option value="Studio Lighting">Studio Lighting</option>
                  <option value="Rembrandt Lighting">Rembrandt Lighting</option>
                  <option value="Cinematic Lighting">Cinematic Lighting</option>
                  <option value="Soft Window Light">Soft Window Light</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 font-medium mb-1">Aspect Ratio</label>
                <div className="grid grid-cols-5 gap-2">
                  {(['1:1', '4:5', '3:4', '9:16', '16:9'] as const).map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setAspectRatio(ratio)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-mono font-semibold transition-all border ${
                        aspectRatio === ratio
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Scene, Pose & Environment */}
          <div className="bg-[#0C101A] border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              ADEGAN, POSE &amp; LINGKUNGAN
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Deskripsi Adegan (Scene Description)</label>
                <textarea
                  rows={2}
                  value={sceneDescription}
                  onChange={(e) => setSceneDescription(e.target.value)}
                  placeholder="Ceritakan konteks adegan yang ingin dibuat..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">
                    Pakaian (Clothing Override)
                  </label>
                  <input
                    type="text"
                    value={clothingOverride}
                    onChange={(e) => setClothingOverride(e.target.value)}
                    placeholder={`Default: ${activeCharacter.dna.clothingStyle}`}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Ekspresi Wajah</label>
                  <input
                    type="text"
                    value={facialExpression}
                    onChange={(e) => setFacialExpression(e.target.value)}
                    placeholder="Senyum lembut, tatapan langsung..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Pose Karakter</label>
                  <input
                    type="text"
                    value={pose}
                    onChange={(e) => setPose(e.target.value)}
                    placeholder="Postur tegap 3/4 menghadap lensa..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Latar Belakang / Environment</label>
                  <input
                    type="text"
                    value={environment}
                    onChange={(e) => setEnvironment(e.target.value)}
                    placeholder="Dinding semen studio, pencahayaan lembut..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Output Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0C101A] border border-cyan-500/30 rounded-xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
                  READY-TO-USE OUTPUT
                </span>
                <h3 className="text-sm font-bold text-white">Generated Visual Prompt</h3>
              </div>

              <button
                onClick={handleAiOptimize}
                disabled={isAiOptimizing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold hover:brightness-125 transition-all"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isAiOptimizing ? 'animate-spin' : ''}`} />
                <span>{isAiOptimizing ? 'Optimizing...' : 'AI Enhance'}</span>
              </button>
            </div>

            {/* Master Prompt Output Box */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Master Prompt:</span>
                <span className="font-mono text-[10px]">{compiledPrompt.length} chars</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-slate-200 leading-relaxed max-h-60 overflow-y-auto select-text">
                {compiledPrompt}
              </div>
            </div>

            {/* Negative Prompt */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-400 block">Negative Prompt:</span>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400 leading-relaxed select-text">
                {compiledNegative}
              </div>
            </div>

            {/* Technical Chips */}
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-2">
                Preserved Technical Tokens:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {technicalBreakdown.map((t, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-cyan-400/90"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
              <button
                onClick={() => handleCopy(compiledPrompt)}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-cyan-500/10"
              >
                {copied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Tersalin!' : 'Copy Visual Prompt'}</span>
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
