import React from 'react';
import { StudioProvider, useStudio } from './context/StudioContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { RightPreviewPanel } from './components/layout/RightPreviewPanel';

// 13 Views
import { DashboardView } from './components/views/DashboardView';
import { CreateCharacterView } from './components/views/CreateCharacterView';
import { DnaStudioView } from './components/views/DnaStudioView';
import { ReferenceLibraryView } from './components/views/ReferenceLibraryView';
import { VisualPromptView } from './components/views/VisualPromptView';
import { VideoPromptView } from './components/views/VideoPromptView';
import { MotionActionView } from './components/views/MotionActionView';
import { VoiceIdentityView } from './components/views/VoiceIdentityView';
import { StoryboardStudioView } from './components/views/StoryboardStudioView';
import { ConsistencyCheckerView } from './components/views/ConsistencyCheckerView';
import { PromptLibraryView } from './components/views/PromptLibraryView';
import { ProjectsHistoryView } from './components/views/ProjectsHistoryView';
import { SettingsView } from './components/views/SettingsView';

const StudioContent: React.FC = () => {
  const { activeTab, toast } = useStudio();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'create-character':
        return <CreateCharacterView />;
      case 'dna-studio':
        return <DnaStudioView />;
      case 'reference-library':
        return <ReferenceLibraryView />;
      case 'visual-prompt':
        return <VisualPromptView />;
      case 'video-prompt':
        return <VideoPromptView />;
      case 'motion-generator':
        return <MotionActionView />;
      case 'voice-generator':
        return <VoiceIdentityView />;
      case 'storyboard-studio':
        return <StoryboardStudioView />;
      case 'consistency-checker':
        return <ConsistencyCheckerView />;
      case 'prompt-library':
        return <PromptLibraryView />;
      case 'projects-history':
        return <ProjectsHistoryView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#080A0F] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header */}
      <Header />

      {/* Main Studio Body: Sidebar + Viewport + Right Preview Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation */}
        <Sidebar />

        {/* Center Main Work Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 studio-grid-bg">
          {renderActiveView()}
        </main>

        {/* Right Preview Drawer / Inspector */}
        <RightPreviewPanel />
      </div>

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span
            className={`w-2 h-2 rounded-full ${
              toast.type === 'success'
                ? 'bg-emerald-400'
                : toast.type === 'error'
                ? 'bg-rose-400'
                : 'bg-cyan-400'
            }`}
          />
          <span className="text-slate-100">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <StudioProvider>
      <StudioContent />
    </StudioProvider>
  );
}
