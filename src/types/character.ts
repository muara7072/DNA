export type Gender = 'Female' | 'Male' | 'Non-Binary';

export type SkinTone =
  | 'Fair Pale'
  | 'Warm Beige'
  | 'Olive Mediterranean'
  | 'Warm Caramel'
  | 'Warm Bronze'
  | 'Deep Mahogany'
  | 'Rich Espresso';

export type FaceShape =
  | 'Oval'
  | 'Square Defined'
  | 'Heart Shaped'
  | 'Diamond'
  | 'Round Soft'
  | 'Angular Chiseled';

export type EyeShape =
  | 'Almond'
  | 'Hooded'
  | 'Round'
  | 'Monolid'
  | 'Upturned'
  | 'Deep-set';

export type EyeColor =
  | 'Deep Dark Brown'
  | 'Hazel Golden'
  | 'Warm Amber'
  | 'Slate Gray'
  | 'Emerald Green'
  | 'Sapphire Blue';

export type EyebrowStyle =
  | 'Natural Arched'
  | 'Straight Dense'
  | 'Soft Feathered'
  | 'Bold Defined';

export type NoseShape =
  | 'Straight Greek'
  | 'Subtle Aquiline'
  | 'Soft Button'
  | 'High Bridge Narrow'
  | 'Wide Natural';

export type LipShape =
  | 'Full Natural'
  | 'Defined Cupid\'s Bow'
  | 'Thin Balanced'
  | 'Soft Rounded';

export type HairStyle =
  | 'Shoulder-Length Wavy'
  | 'Clean Textured Fade Undercut'
  | 'Sleek Obsidian Bob'
  | 'Curly Tapered Afro'
  | 'Long Layered'
  | 'Buzz Cut Clean'
  | 'Braided Crown Updo';

export type HairColor =
  | 'Dark Chestnut Brown'
  | 'Obsidian Jet Black'
  | 'Espresso Brown'
  | 'Honey Ash Blonde'
  | 'Copper Auburn'
  | 'Salt and Pepper';

export type BodyType =
  | 'Athletic Lean'
  | 'Slender Elegant'
  | 'Average Natural'
  | 'Muscular Broad'
  | 'Curvy Defined';

export interface CharacterReferenceImages {
  facePortrait: string; // Base64 or URL
  fullBody?: string;
  extraReference?: string;
}

export interface MasterCharacterDNA {
  characterId: string;
  name: string;
  gender: Gender;
  visualAge: number;
  nationality: string;
  ethnicity: string;
  skinTone: SkinTone;
  skinTexture: string;
  faceShape: FaceShape;
  faceGeometry: string;
  eyeShape: EyeShape;
  eyeColor: EyeColor;
  eyebrow: EyebrowStyle;
  noseShape: NoseShape;
  lipShape: LipShape;
  hairStyle: HairStyle;
  hairColor: HairColor;
  bodyType: BodyType;
  height: string;
  distinctiveFeatures: string;
  personality: string;
  profession: string;
  speakingStyle: string;
  facialExpression: string;
  bodyLanguage: string;
  clothingStyle: string;
  clothingIdentity: string;
  voiceIdentity: {
    voiceName: string;
    vocalDepth: string;
    tone: string;
    speakingSpeed: string;
    emotionalStyle: string;
    language: string;
    accent: string;
  };
  masterVisualPrompt: string;
  negativePrompt: string;
  identityLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CharacterProfile {
  id: string;
  name: string;
  dna: MasterCharacterDNA;
  referenceImages: CharacterReferenceImages;
  tags: string[];
  isPreset?: boolean;
}

export interface VisualPromptParams {
  shotType: 'Extreme Close Up' | 'Close Up' | 'Headshot' | 'Medium Shot' | 'Medium Full Shot' | 'Full Body' | 'Wide Shot';
  camera: 'Portrait Photography (85mm f/1.4)' | 'Professional Studio Photography' | 'Cinematic Photography (35mm Anamorphic)' | 'Documentary Photography (Leica 50mm)' | 'Commercial Photography (Hasselblad H6D-100c)';
  visualStyle: 'Ultra Photorealistic' | 'Hyper Realistic' | 'Natural Human Photography' | 'Cinematic Realism' | 'Professional Corporate Portrait' | 'Luxury Editorial' | 'Documentary Realism';
  lighting: 'Natural Soft Light' | 'Golden Hour' | 'Studio Lighting' | 'Rembrandt Lighting' | 'Cinematic Lighting' | 'Soft Window Light';
  aspectRatio: '1:1' | '4:5' | '3:4' | '9:16' | '16:9';
  sceneDescription: string;
  clothingOverride?: string;
  facialExpression?: string;
  pose?: string;
  environment?: string;
}

export interface VideoPromptParams {
  sceneDescription: string;
  sceneLocation: string;
  characterActivity: string;
  facialExpression: string;
  dialogue?: string;
  duration: '5 Seconds' | '8 Seconds' | '10 Seconds' | '15 Seconds';
  cameraMovement: 'Static Camera' | 'Slow Push In' | 'Dolly In' | 'Dolly Out' | 'Tracking Shot' | 'Pan Left' | 'Pan Right' | 'Orbit Shot' | 'Handheld Cinematic';
  videoStyle: 'Photorealistic Cinematic' | 'Hollywood Film Look' | 'Commercial Film' | 'Documentary' | 'Professional Interview' | 'Talking Head Video';
  lighting: string;
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:5';
}

export interface TimelineSegment {
  id: string;
  timeRange: string; // e.g. "0-2s"
  action: string;
  facialMovement: string;
  cameraMovement: string;
}

export interface MotionPromptParams {
  bodyMovement: string;
  facialMovement: string;
  cameraMotion: string;
  timeline: TimelineSegment[];
}

export interface VoicePromptParams {
  voiceName: string;
  gender: string;
  voiceAge: number;
  language: string;
  accent: string;
  vocalDepth: string;
  tone: string;
  speakingSpeed: string;
  emotionalStyle: string;
  pronunciationStyle: string;
  voiceStyle: string;
  dialogueText: string;
}

export interface StoryboardScene {
  sceneNumber: number;
  sceneTitle: string;
  duration: string;
  characterAction: string;
  facialExpression: string;
  cameraAngle: string;
  cameraMovement: string;
  environment: string;
  lighting: string;
  dialogue: string;
  voiceDirection: string;
  visualPrompt: string;
  videoPrompt: string;
  motionPrompt: string;
  audioPrompt: string;
}

export interface StoryboardProject {
  id: string;
  title: string;
  characterId: string;
  concept: string;
  aspectRatio: string;
  videoStyle: string;
  scenes: StoryboardScene[];
  createdAt: string;
  updatedAt: string;
}

export interface ConsistencyReport {
  status: 'VERIFIED' | 'ACCEPTABLE' | 'IDENTITY DRIFT' | 'NEEDS REVIEW';
  facialSimilarityScore: number | null;
  confidence: number | null;
  metrics: {
    faceShape: string;
    eyeShape: string;
    noseShape: string;
    lipShape: string;
    skinTone: string;
    hairIdentity: string;
    ageConsistency: string;
    bodyProportion: string;
  };
  detailedFindings: string;
  recommendations: string;
  timestamp: string;
}

export interface SavedPromptItem {
  id: string;
  characterId: string;
  characterName: string;
  promptType: 'VISUAL' | 'VIDEO' | 'MOTION' | 'VOICE' | 'STORYBOARD';
  title: string;
  masterPrompt: string;
  negativePrompt?: string;
  tags: string[];
  createdAt: string;
}
