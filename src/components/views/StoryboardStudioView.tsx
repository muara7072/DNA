import React, { useState } from 'react';
import {
  Clapperboard,
  Sparkles,
  Save,
  Download,
  Copy,
  Check,
  Plus,
  Trash2,
  Layers,
  ChevronDown,
  ChevronUp,
  Film,
  Camera,
  Eye,
  Mic,
  Activity,
  Share2,
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { StoryboardScene, StoryboardProject } from '../../types/character';
import { generateDefaultScenes } from '../../utils/promptGenerators';
import { generateStoryboardWithAI } from '../../services/api';

export const StoryboardStudioView: React.FC = () => {
  const {
    activeCharacter,
    characters,
    setActiveCharacterId,
    saveStoryboardProject,
    showToast,
  } = useStudio();

  // Storyboard Parameters
  const [projectTitle, setProjectTitle] = useState('Brand Campaign: The Real Continuity');
  const [storyConcept, setStoryConcept] = useState(
    'Pengenalan karakter visioner yang bekerja di studio arsitektur masa depan, menjelaskan rahasia konsistensi AI kepada audiens global.'
  );
  const [sceneCount, setSceneCount] = useState<number>(4);
  const [durationPerScene, setDurationPerScene] = useState('8 Seconds');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [videoStyle, setVisualStyle] = useState('Cinematic Realism');
  const [dialogueLanguage, setDialogueLanguage] = useState('Bahasa Indonesia & English');

  // Generated Scenes List
  const [scenes, setScenes] = useState<StoryboardScene[]>(() =>
    generateDefaultScenes(activeCharacter.dna, projectTitle, storyConcept, sceneCount)
  );

  const [expandedScene, setExpandedScene] = useState<number | null>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerateStoryboard = async () => {
    setIsGenerating(true);
    showToast('Menyusun naskah & shot storyboard dengan Master Character DNA...', 'info');

    const result = await generateStoryboardWithAI(
      projectTitle,
      storyConcept,
      activeCharacter.dna,
      sceneCount,
      durationPerScene,
      videoStyle,
      aspectRatio
    );

    setIsGenerating(false);

    if (result.success && result.scenes && result.scenes.length > 0) {
      setScenes(result.scenes);
      showToast(`${result.scenes.length} Adegan storyboard berhasil dibuat oleh Gemini AI!`, 'success');
    } else {
      // Deterministic continuity fallback
      const localScenes = generateDefaultScenes(
        activeCharacter.dna,
        projectTitle,
        storyConcept,
        sceneCount
      );
      setScenes(localScenes);
      showToast('Storyboard disusun dengan formula Master Character DNA!', 'info');
    }
  };

  const handleSaveProject = () => {
    const project: StoryboardProject = {
      id: `proj-${Date.now()}`,
      title: projectTitle,
      characterId: activeCharacter.id,
      concept: storyConcept,
      aspectRatio,
      videoStyle,
      scenes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveStoryboardProject(project);
  };

  const handleExportMarkdown = () => {
    let md = `# STORYBOARD PRODUCTION BIBLE: ${projectTitle.toUpperCase()}\n`;
    md += `Target Character: ${activeCharacter.name} (DNA ID: ${activeCharacter.dna.characterId})\n`;
    md += `Concept: ${storyConcept}\n`;
    md += `Aspect Ratio: ${aspectRatio} | Style: ${videoStyle} | Total Scenes: ${scenes.length}\n\n`;
    md += `--- ALL SCENES LOCKED WITH MASTER CHARACTER DNA ---\n\n`;

    scenes.forEach((s) => {
      md += `## SCENE ${s.sceneNumber}: ${s.sceneTitle}\n`;
      md += `- **Duration**: ${s.duration}\n`;
      md += `- **Action**: ${s.characterAction}\n`;
      md += `- **Facial Expression**: ${s.facialExpression}\n`;
      md += `- **Camera**: ${s.cameraAngle} · ${s.cameraMovement}\n`;
      md += `- **Environment & Lighting**: ${s.environment} (${s.lighting})\n`;
      md += `- **Dialogue**: "${s.dialogue}"\n`;
      md += `- **Voice Direction**: ${s.voiceDirection}\n\n`;
      md += `### Prompts\n`;
      md += `**Visual Prompt (Flux/Midjourney)**:\n\`\`\`\n${s.visualPrompt}\n\`\`\`\n\n`;
      md += `**Video Prompt (Kling/Runway Gen-3)**:\n\`\`\`\n${s.videoPrompt}\n\`\`\`\n\n`;
      md += `**Motion Prompt**:\n${s.motionPrompt}\n\n`;
      md += `**Audio Prompt**:\n${s.audioPrompt}\n\n`;
      md += `--------------------------------------------------\n\n`;
    });

    const dataStr = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(md);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${projectTitle.toLowerCase().replace(/\s+/g, '_')}_storyboard.md`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Storyboard diekspor sebagai Markdown Production Bible!', 'success');
  };

  const handleCopyPrompt = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    showToast('Prompt adegan disalin!', 'success');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              MULTI-SCENE CONTINUITY STUDIO
            </span>
            <span className="font-mono text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              DNA Lock Across All Scenes
            </span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-white mt-1">Storyboard Studio</h1>
          <p className="text-xs text-slate-400">
            Rancang alur cerita sinematik multi-adegan lengkap dengan visual, video, motion, dan audio prompt yang terhubung pada Master DNA {activeCharacter.name}.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleSaveProject}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-all"
          >
            <Save className="w-3.5 h-3.5 text-cyan-400" />
            <span>Save Project</span>
          </button>

          <button
            onClick={handleExportMarkdown}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span>Export Markdown</span>
          </button>
        </div>
      </div>

      {/* Production Project Setup Card */}
      <div className="bg-[#0C101A] border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
        <h2 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center justify-between">
          <span>PROJECT PARAMETERS &amp; STORY CONCEPT</span>
          <span className="font-mono text-slate-400 text-[10px]">
            Target: {activeCharacter.name} ({activeCharacter.dna.characterId})
          </span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="sm:col-span-2">
            <label className="block text-slate-400 font-medium mb-1">Project Title</label>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500 font-semibold"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Target Character</label>
            <select
              value={activeCharacter.id}
              onChange={(e) => setActiveCharacterId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
            >
              {characters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.dna.characterId})
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <label className="block text-slate-400 font-medium mb-1">Story Concept (Konsep Cerita)</label>
            <textarea
              rows={2}
              value={storyConcept}
              onChange={(e) => setStoryConcept(e.target.value)}
              placeholder="Jelaskan plot atau narasi visual yang ingin dibangun..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">
              Jumlah Adegan: <span className="text-purple-400 font-bold">{sceneCount} Scenes</span>
            </label>
            <div className="flex items-center gap-1">
              {[2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setSceneCount(num)}
                  className={`flex-1 py-1.5 rounded text-xs font-mono font-bold transition-all border ${
                    sceneCount === num
                      ? 'bg-purple-600 text-white border-purple-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Durasi per Adegan</label>
            <select
              value={durationPerScene}
              onChange={(e) => setDurationPerScene(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
            >
              <option value="5 Seconds">5 Seconds per scene</option>
              <option value="8 Seconds">8 Seconds per scene</option>
              <option value="10 Seconds">10 Seconds per scene</option>
              <option value="15 Seconds">15 Seconds per scene</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Aspect Ratio &amp; Gaya</label>
            <div className="flex gap-2">
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-1/2 bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="16:9">16:9 Landscape</option>
                <option value="9:16">9:16 Vertical</option>
                <option value="1:1">1:1 Square</option>
              </select>
              <select
                value={videoStyle}
                onChange={(e) => setVisualStyle(e.target.value)}
                className="w-1/2 bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="Cinematic Realism">Cinematic</option>
                <option value="Commercial Look">Commercial</option>
                <option value="Documentary">Documentary</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleGenerateStoryboard}
            disabled={isGenerating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:brightness-110 active:scale-95 text-white font-extrabold text-xs shadow-lg shadow-purple-500/20 transition-all"
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Menyusun Storyboard...' : 'GENERATE STORYBOARD SCENES'}</span>
          </button>
        </div>
      </div>

      {/* Generated Scenes List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            SCENE BREAKDOWN LIST ({scenes.length} SCENES)
          </h2>
          <span className="text-xs text-slate-400">
            Identitas Wajah: {activeCharacter.name} Terkunci
          </span>
        </div>

        {scenes.map((scene) => {
          const isExpanded = expandedScene === scene.sceneNumber;

          return (
            <div
              key={scene.sceneNumber}
              className="bg-[#0C101A] border border-slate-800 rounded-xl overflow-hidden transition-all shadow-sm"
            >
              {/* Scene Summary Bar */}
              <div
                onClick={() => setExpandedScene(isExpanded ? null : scene.sceneNumber)}
                className="p-4 cursor-pointer flex items-center justify-between hover:bg-slate-900/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 font-mono text-xs font-bold flex items-center justify-center">
                    0{scene.sceneNumber}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white">{scene.sceneTitle}</h3>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{scene.duration}</span>
                      <span>·</span>
                      <span>{scene.cameraAngle}</span>
                      <span>·</span>
                      <span className="text-cyan-400">{scene.cameraMovement}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyPrompt(scene.videoPrompt, scene.sceneNumber);
                    }}
                    className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-300 text-xs flex items-center gap-1"
                    title="Copy Video Prompt"
                  >
                    {copiedIndex === scene.sceneNumber ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span className="hidden sm:inline">Copy Prompt</span>
                  </button>

                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Collapsible Scene Detail */}
              {isExpanded && (
                <div className="p-4 pt-0 border-t border-slate-800/80 space-y-4 bg-slate-950/40">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-3">
                    <div className="space-y-2">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-medium block">
                          Character Action:
                        </span>
                        <p className="text-slate-200 mt-0.5">{scene.characterAction}</p>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-medium block">
                          Facial Expression:
                        </span>
                        <p className="text-slate-200 mt-0.5">{scene.facialExpression}</p>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-medium block">
                          Environment &amp; Lighting:
                        </span>
                        <p className="text-slate-200 mt-0.5">
                          {scene.environment} · {scene.lighting}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-medium block">
                          Dialogue:
                        </span>
                        <p className="text-amber-300 font-medium italic mt-0.5">"{scene.dialogue}"</p>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-medium block">
                          Voice Direction:
                        </span>
                        <p className="text-slate-300 mt-0.5">{scene.voiceDirection}</p>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-medium block">
                          Audio &amp; Ambience:
                        </span>
                        <p className="text-slate-300 mt-0.5">{scene.audioPrompt}</p>
                      </div>
                    </div>
                  </div>

                  {/* Scene Prompts Tabs */}
                  <div className="space-y-2 pt-2">
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">
                          Visual Prompt (Midjourney v6.1 / Flux.1):
                        </span>
                        <button
                          onClick={() => handleCopyPrompt(scene.visualPrompt, scene.sceneNumber * 10)}
                          className="text-[10px] text-slate-400 hover:text-cyan-300 flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" /> Copy Visual
                        </button>
                      </div>
                      <p className="text-xs font-mono text-slate-300">{scene.visualPrompt}</p>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono text-blue-400 uppercase font-semibold">
                          Video Prompt (Kling / Runway Gen-3):
                        </span>
                        <button
                          onClick={() => handleCopyPrompt(scene.videoPrompt, scene.sceneNumber * 20)}
                          className="text-[10px] text-slate-400 hover:text-cyan-300 flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" /> Copy Video
                        </button>
                      </div>
                      <p className="text-xs font-mono text-slate-300">{scene.videoPrompt}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
