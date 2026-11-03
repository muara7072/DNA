import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CharacterProfile,
  MasterCharacterDNA,
  SavedPromptItem,
  StoryboardProject,
} from '../types/character';
import { defaultCharacters } from '../data/defaultCharacters';

export type TabKey =
  | 'dashboard'
  | 'create-character'
  | 'dna-studio'
  | 'reference-library'
  | 'visual-prompt'
  | 'video-prompt'
  | 'motion-generator'
  | 'voice-generator'
  | 'storyboard-studio'
  | 'consistency-checker'
  | 'prompt-library'
  | 'projects-history'
  | 'settings';

interface StudioContextType {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  characters: CharacterProfile[];
  activeCharacterId: string;
  activeCharacter: CharacterProfile;
  setActiveCharacterId: (id: string) => void;
  saveCharacter: (profile: CharacterProfile) => void;
  updateCharacterDna: (characterId: string, partialDna: Partial<MasterCharacterDNA>) => void;
  toggleIdentityLock: (characterId: string) => void;
  duplicateCharacter: (characterId: string) => void;
  deleteCharacter: (characterId: string) => void;
  savedPrompts: SavedPromptItem[];
  savePrompt: (item: Omit<SavedPromptItem, 'id' | 'createdAt'>) => void;
  deletePrompt: (id: string) => void;
  storyboardProjects: StoryboardProject[];
  saveStoryboardProject: (project: StoryboardProject) => void;
  deleteStoryboardProject: (id: string) => void;
  isRightPanelOpen: boolean;
  toggleRightPanel: () => void;
  activePreviewPrompt: { title: string; prompt: string; type: string } | null;
  setActivePreviewPrompt: (p: { title: string; prompt: string; type: string } | null) => void;
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  resetAllData: () => void;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CHARACTERS: 'muara_characters_v2',
  ACTIVE_CHAR: 'muara_active_char_id_v2',
  SAVED_PROMPTS: 'muara_saved_prompts_v2',
  STORYBOARDS: 'muara_storyboards_v2',
};

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [activePreviewPrompt, setActivePreviewPrompt] = useState<{
    title: string;
    prompt: string;
    type: string;
  } | null>(null);

  // Initialize Characters with persistence
  const [characters, setCharacters] = useState<CharacterProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHARACTERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse saved characters:', e);
    }
    return defaultCharacters;
  });

  const [activeCharacterId, setActiveCharacterIdState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_CHAR);
      if (saved) return saved;
    } catch (e) {}
    return defaultCharacters[0]?.id || '';
  });

  // Saved Prompts
  const [savedPrompts, setSavedPrompts] = useState<SavedPromptItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SAVED_PROMPTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'p-initial-01',
        characterId: 'char-elena-vance',
        characterName: 'Elena Vance',
        promptType: 'VISUAL',
        title: 'Editorial Studio Portrait 85mm',
        masterPrompt: 'Extreme Close Up of Elena Vance, [IDENTITY PRESERVATION: Elena Vance, 28-year-old Eurasian woman]. Wearing tailored charcoal linen crewneck. Shot on Hasselblad H6D-100c 85mm f/1.4. Natural skin pores, soft window lighting.',
        negativePrompt: 'blurry, cartoon, plastic doll skin, extra limbs, bad anatomy',
        tags: ['Studio', 'Editorial', 'Elena'],
        createdAt: new Date().toISOString(),
      },
    ];
  });

  // Storyboard Projects
  const [storyboardProjects, setStoryboardProjects] = useState<StoryboardProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STORYBOARDS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(characters));
    } catch (e) {
      console.warn('Could not save characters to localStorage', e);
    }
  }, [characters]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_CHAR, activeCharacterId);
    } catch (e) {}
  }, [activeCharacterId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED_PROMPTS, JSON.stringify(savedPrompts));
    } catch (e) {}
  }, [savedPrompts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STORYBOARDS, JSON.stringify(storyboardProjects));
    } catch (e) {}
  }, [storyboardProjects]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3200);
  };

  const activeCharacter =
    characters.find((c) => c.id === activeCharacterId) || characters[0] || defaultCharacters[0];

  const setActiveCharacterId = (id: string) => {
    setActiveCharacterIdState(id);
    const target = characters.find((c) => c.id === id);
    if (target) {
      showToast(`Karakter Aktif: ${target.name}`, 'info');
    }
  };

  const saveCharacter = (profile: CharacterProfile) => {
    setCharacters((prev) => {
      const idx = prev.findIndex((c) => c.id === profile.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = profile;
        return next;
      }
      return [profile, ...prev];
    });
    setActiveCharacterIdState(profile.id);
    showToast(`Karakter ${profile.name} berhasil disimpan!`, 'success');
  };

  const updateCharacterDna = (characterId: string, partialDna: Partial<MasterCharacterDNA>) => {
    setCharacters((prev) =>
      prev.map((char) => {
        if (char.id === characterId) {
          return {
            ...char,
            dna: {
              ...char.dna,
              ...partialDna,
              updatedAt: new Date().toISOString(),
            },
          };
        }
        return char;
      })
    );
    showToast('Master Character DNA diperbarui', 'success');
  };

  const toggleIdentityLock = (characterId: string) => {
    setCharacters((prev) =>
      prev.map((char) => {
        if (char.id === characterId) {
          const nextLock = !char.dna.identityLocked;
          showToast(
            nextLock
              ? `Identity Lock DIAKTIFKAN untuk ${char.name}. Struktur wajah dikunci permanen.`
              : `Identity Lock DIBUKA untuk ${char.name}.`,
            nextLock ? 'success' : 'info'
          );
          return {
            ...char,
            dna: {
              ...char.dna,
              identityLocked: nextLock,
              updatedAt: new Date().toISOString(),
            },
          };
        }
        return char;
      })
    );
  };

  const duplicateCharacter = (characterId: string) => {
    const target = characters.find((c) => c.id === characterId);
    if (!target) return;
    const newId = `char-${Date.now()}`;
    const newDnaId = `MUA-DNA-${Math.floor(1000 + Math.random() * 9000)}`;
    const cloned: CharacterProfile = {
      ...target,
      id: newId,
      name: `${target.name} (Clone)`,
      isPreset: false,
      dna: {
        ...target.dna,
        characterId: newDnaId,
        name: `${target.name} (Clone)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
    setCharacters((prev) => [cloned, ...prev]);
    setActiveCharacterIdState(newId);
    showToast(`Karakter diduplikasi sebagai "${cloned.name}"`, 'success');
  };

  const deleteCharacter = (characterId: string) => {
    if (characters.length <= 1) {
      showToast('Minimal harus ada 1 karakter di Studio', 'error');
      return;
    }
    const target = characters.find((c) => c.id === characterId);
    setCharacters((prev) => prev.filter((c) => c.id !== characterId));
    const remaining = characters.filter((c) => c.id !== characterId);
    if (remaining.length > 0) {
      setActiveCharacterIdState(remaining[0].id);
    }
    showToast(`Karakter ${target?.name || ''} telah dihapus`, 'info');
  };

  const savePrompt = (item: Omit<SavedPromptItem, 'id' | 'createdAt'>) => {
    const newPrompt: SavedPromptItem = {
      ...item,
      id: `p-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setSavedPrompts((prev) => [newPrompt, ...prev]);
    showToast(`Prompt "${newPrompt.title}" disimpan ke Library!`, 'success');
  };

  const deletePrompt = (id: string) => {
    setSavedPrompts((prev) => prev.filter((p) => p.id !== id));
    showToast('Prompt dihapus dari Library', 'info');
  };

  const saveStoryboardProject = (project: StoryboardProject) => {
    setStoryboardProjects((prev) => {
      const idx = prev.findIndex((p) => p.id === project.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = project;
        return next;
      }
      return [project, ...prev];
    });
    showToast(`Storyboard Project "${project.title}" disimpan!`, 'success');
  };

  const deleteStoryboardProject = (id: string) => {
    setStoryboardProjects((prev) => prev.filter((p) => p.id !== id));
    showToast('Storyboard project dihapus', 'info');
  };

  const toggleRightPanel = () => {
    setIsRightPanelOpen((prev) => !prev);
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.CHARACTERS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_CHAR);
    localStorage.removeItem(STORAGE_KEYS.SAVED_PROMPTS);
    localStorage.removeItem(STORAGE_KEYS.STORYBOARDS);
    setCharacters(defaultCharacters);
    setActiveCharacterIdState(defaultCharacters[0].id);
    setSavedPrompts([]);
    setStoryboardProjects([]);
    showToast('Data studio direset ke profil bawaan', 'info');
  };

  return (
    <StudioContext.Provider
      value={{
        activeTab,
        setActiveTab,
        characters,
        activeCharacterId,
        activeCharacter,
        setActiveCharacterId,
        saveCharacter,
        updateCharacterDna,
        toggleIdentityLock,
        duplicateCharacter,
        deleteCharacter,
        savedPrompts,
        savePrompt,
        deletePrompt,
        storyboardProjects,
        saveStoryboardProject,
        deleteStoryboardProject,
        isRightPanelOpen,
        toggleRightPanel,
        activePreviewPrompt,
        setActivePreviewPrompt,
        toast,
        showToast,
        resetAllData,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
};

export function useStudio() {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error('useStudio must be used within a StudioProvider');
  }
  return context;
}
