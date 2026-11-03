import React, { useState } from 'react';
import {
  FolderKanban,
  Download,
  Upload,
  Plus,
  Trash2,
  ExternalLink,
  Clapperboard,
  Users,
  Copy,
  Calendar,
  Layers,
  FileCode,
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { StoryboardProject } from '../../types/character';

export const ProjectsHistoryView: React.FC = () => {
  const {
    storyboardProjects,
    deleteStoryboardProject,
    characters,
    savedPrompts,
    setActiveTab,
    showToast,
  } = useStudio();

  const handleExportFullStudioJson = () => {
    const backupPackage = {
      appName: 'MUARA AI REALISTIC CHARACTER STUDIO',
      exportedAt: new Date().toISOString(),
      characters,
      savedPrompts,
      storyboardProjects,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupPackage, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `muara_character_studio_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Seluruh data project & karakter diekspor (JSON)', 'success');
  };

  const handleExportProjectTxt = (project: StoryboardProject) => {
    let content = `MUARA AI REALISTIC CHARACTER STUDIO
PROJECT PRODUCTION PACKAGE: ${project.title.toUpperCase()}
Project ID: ${project.id}
Created: ${new Date(project.createdAt).toLocaleString('id-ID')}
Concept: ${project.concept}
Style: ${project.videoStyle} | Aspect Ratio: ${project.aspectRatio}

==================================================
SCENE BY SCENE CONTINUITY BREAKDOWN (${project.scenes.length} Scenes)
==================================================\n\n`;

    project.scenes.forEach((s) => {
      content += `SCENE ${s.sceneNumber}: ${s.sceneTitle} (${s.duration})\n`;
      content += `Action: ${s.characterAction}\n`;
      content += `Expression: ${s.facialExpression}\n`;
      content += `Camera: ${s.cameraAngle} - ${s.cameraMovement}\n`;
      content += `Dialogue: "${s.dialogue}"\n`;
      content += `Visual Prompt: ${s.visualPrompt}\n`;
      content += `Video Prompt: ${s.videoPrompt}\n\n`;
    });

    const dataStr = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${project.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_spec.txt`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Naskah project diunduh (TXT)', 'info');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              PRODUCTION ARCHIVE &amp; ASSETS
            </span>
            <span className="font-mono text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {storyboardProjects.length} Projects
            </span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-white mt-1">History &amp; Projects</h1>
          <p className="text-xs text-slate-400">
            Kelola proyek storyboard, ekspor paket produksi karakter (JSON &amp; TXT), dan cadangan data lokal.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportFullStudioJson}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-cyan-500/30 text-cyan-300 text-xs font-bold hover:bg-slate-800 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Backup Studio (JSON)</span>
          </button>
        </div>
      </div>

      {/* Storyboard Projects List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            SAVED STORYBOARD PROJECTS
          </h2>
          <button
            onClick={() => setActiveTab('storyboard-studio')}
            className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buat Storyboard Baru</span>
          </button>
        </div>

        {storyboardProjects.length === 0 ? (
          <div className="bg-[#0C101A] border border-slate-800 rounded-xl p-12 text-center space-y-3">
            <FolderKanban className="w-10 h-10 text-slate-600 mx-auto" />
            <h2 className="text-sm font-bold text-slate-300">Belum Ada Proyek Storyboard Tersimpan</h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Buka menu Storyboard Studio untuk merancang alur adegan karakter Anda lalu klik "Save Project".
            </p>
            <button
              onClick={() => setActiveTab('storyboard-studio')}
              className="mt-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
            >
              Buka Storyboard Studio
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {storyboardProjects.map((proj) => {
              const char = characters.find((c) => c.id === proj.characterId);

              return (
                <div
                  key={proj.id}
                  className="bg-[#0C101A] border border-slate-800 hover:border-slate-700 rounded-xl p-5 space-y-4 transition-all shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 flex items-center justify-center">
                          <Clapperboard className="w-3.5 h-3.5" />
                        </span>
                        <div>
                          <h3 className="text-sm font-bold text-white">{proj.title}</h3>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {new Date(proj.createdAt).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono font-bold bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-cyan-400">
                        {proj.scenes.length} SCENES
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {proj.concept}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 pt-1">
                      <span>Karakter: <strong className="text-slate-200">{char?.name || 'Target'}</strong></span>
                      <span>·</span>
                      <span>{proj.aspectRatio}</span>
                      <span>·</span>
                      <span>{proj.videoStyle}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleExportProjectTxt(proj)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold hover:bg-slate-800 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download TXT</span>
                    </button>

                    <button
                      onClick={() => deleteStoryboardProject(proj.id)}
                      className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Hapus Proyek"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
