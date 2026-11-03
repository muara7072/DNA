import { MasterCharacterDNA, ConsistencyReport, StoryboardScene } from '../types/character';

export interface PromptOptimizationResult {
  success: boolean;
  masterPrompt?: string;
  negativePrompt?: string;
  technicalBreakdown?: string[];
  directorsNotes?: string;
  message?: string;
}

export async function optimizePromptWithAI(
  promptType: string,
  characterDna: MasterCharacterDNA,
  sceneDescription: string,
  parameters: any
): Promise<PromptOptimizationResult> {
  try {
    const res = await fetch('/api/gemini/optimize-prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        promptType,
        characterDna,
        sceneDescription,
        parameters,
      }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    console.warn('API call fallback:', err.message);
    return {
      success: false,
      message: err.message,
    };
  }
}

export async function checkConsistencyWithAI(
  masterImageBase64: string,
  generatedImageBase64: string,
  characterDna: MasterCharacterDNA
): Promise<ConsistencyReport> {
  try {
    const res = await fetch('/api/gemini/consistency-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        masterImageBase64,
        generatedImageBase64,
        characterDna,
      }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    return {
      status: data.status || 'NEEDS REVIEW',
      facialSimilarityScore: data.facialSimilarityScore ?? null,
      confidence: data.confidence ?? null,
      metrics: data.metrics || {
        faceShape: 'NEEDS REVIEW',
        eyeShape: 'NEEDS REVIEW',
        noseShape: 'NEEDS REVIEW',
        lipShape: 'NEEDS REVIEW',
        skinTone: 'NEEDS REVIEW',
        hairIdentity: 'NEEDS REVIEW',
        ageConsistency: 'NEEDS REVIEW',
        bodyProportion: 'NEEDS REVIEW',
      },
      detailedFindings: data.detailedFindings || data.message || 'Evaluasi konsistensi manual direkomendasikan.',
      recommendations: data.recommendations || 'Pastikan kedua gambar memiliki pencahayaan seimbang dan sudut pandang frontal.',
      timestamp: new Date().toISOString(),
    };
  } catch (err: any) {
    console.warn('Consistency check fallback:', err.message);
    return {
      status: 'NEEDS REVIEW',
      facialSimilarityScore: null,
      confidence: null,
      metrics: {
        faceShape: 'NEEDS REVIEW',
        eyeShape: 'NEEDS REVIEW',
        noseShape: 'NEEDS REVIEW',
        lipShape: 'NEEDS REVIEW',
        skinTone: 'NEEDS REVIEW',
        hairIdentity: 'NEEDS REVIEW',
        ageConsistency: 'NEEDS REVIEW',
        bodyProportion: 'NEEDS REVIEW',
      },
      detailedFindings: `Sistem evaluasi computer vision memerlukan koneksi backend aktif (${err.message}). Status ditandai sebagai "NEEDS REVIEW" untuk memastikan integritas data.`,
      recommendations: 'Gunakan panduan checklist manual 9 Aturan Master DNA untuk memvalidasi kemiripan struktur wajah.',
      timestamp: new Date().toISOString(),
    };
  }
}

export async function generateStoryboardWithAI(
  title: string,
  concept: string,
  characterDna: MasterCharacterDNA,
  sceneCount: number,
  durationPerScene: string,
  videoStyle: string,
  aspect: string
): Promise<{ success: boolean; scenes: StoryboardScene[]; error?: string }> {
  try {
    const res = await fetch('/api/gemini/generate-storyboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        concept,
        characterDna,
        sceneCount,
        durationPerScene,
        videoStyle,
        aspect,
      }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    return { success: false, scenes: [], error: err.message };
  }
}

export async function generatePortraitWithAI(
  prompt: string,
  characterDna: MasterCharacterDNA,
  aspectRatio: string
): Promise<{ success: boolean; imageBase64?: string; isQuotaOrPaid?: boolean; message?: string }> {
  try {
    const res = await fetch('/api/gemini/generate-portrait', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, characterDna, aspectRatio }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      message: err.message,
    };
  }
}
