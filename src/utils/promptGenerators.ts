import {
  MasterCharacterDNA,
  VisualPromptParams,
  VideoPromptParams,
  MotionPromptParams,
  VoicePromptParams,
  StoryboardScene,
} from '../types/character';

/**
 * Compiles a Master Character DNA into a bulletproof Photorealistic Visual Prompt
 */
export function buildVisualPrompt(
  dna: MasterCharacterDNA,
  params: VisualPromptParams
): { masterPrompt: string; negativePrompt: string; technicalBreakdown: string[] } {
  const identityLockClause = `[IDENTITY PRESERVATION: ${dna.name}, ${dna.visualAge}-year-old ${dna.nationality} (${dna.ethnicity}). Face geometry: ${dna.faceShape} bone structure, ${dna.faceGeometry}. Eyes: ${dna.eyeShape} ${dna.eyeColor}. Nose: ${dna.noseShape}. Lips: ${dna.lipShape}. Skin: ${dna.skinTone} with authentic micro-texture (${dna.skinTexture}). Hair: ${dna.hairStyle} in ${dna.hairColor}. Distinctive markings: ${dna.distinctiveFeatures}. Body: ${dna.bodyType}, ${dna.height}.]`;

  const clothingDesc = params.clothingOverride || dna.clothingIdentity || dna.clothingStyle;
  const expressionDesc = params.facialExpression || dna.facialExpression;
  const poseDesc = params.pose || 'natural poised posture, realistic relaxed shoulders, direct engagement';
  const environmentDesc = params.environment || params.sceneDescription || 'modern architectural studio interior, neutral textured micro-cement wall';

  const masterPrompt = `${params.shotType} of ${dna.name}, ${identityLockClause}. 
Action & Scene: ${params.sceneDescription}. 
Clothing: wearing ${clothingDesc}. 
Expression & Gaze: ${expressionDesc}, looking directly into lens. 
Pose: ${poseDesc}. 
Environment: ${environmentDesc}. 
Photography & Camera: ${params.camera}, ${params.visualStyle}, shot on Hasselblad H6D-100c with 85mm f/1.4 portrait prime lens, shallow depth of field, creamy bokeh. 
Lighting: ${params.lighting}, natural soft directional illumination creating authentic specular reflections on skin, natural catchlights in irises. 
Material Rendering: ultra-fine skin pores, subtle epidermal subsurface scattering, photorealistic fabric threads, raw authentic photographic color science, zero airbrushed skin smoothing, cinematic 8k resolution.`;

  const negativePrompt = `${dna.negativePrompt}, altered face, distorted eyes, plastic silicone wax skin, airbrush, extra ears, bad teeth, inconsistent identity, anime, 3d CGI render, low quality, oversaturated colors, flat lighting`;

  const technicalBreakdown = [
    `Camera: ${params.camera} (85mm f/1.4 Prime)`,
    `Shot Type: ${params.shotType}`,
    `Lighting: ${params.lighting}`,
    `Color Tone: Natural Film Look / Rec.709`,
    `Skin Shader: Subsurface Scattering v3 (Natural Pores)`,
    `Aspect Ratio: ${params.aspectRatio}`,
  ];

  return { masterPrompt, negativePrompt, technicalBreakdown };
}

/**
 * Compiles a Master Character DNA into a Video Prompt for Kling AI, Runway Gen-3, Luma Dream Machine, Sora, or Veo
 */
export function buildVideoPrompt(
  dna: MasterCharacterDNA,
  params: VideoPromptParams
): { masterPrompt: string; negativePrompt: string; instructions: string[] } {
  const masterPrompt = `[CHARACTER IDENTITY LOCK: ${dna.name}, ${dna.visualAge}yo ${dna.ethnicity}, ${dna.skinTone} skin with natural skin pores, ${dna.eyeColor} ${dna.eyeShape} eyes, ${dna.hairStyle} (${dna.hairColor}). STRICT FACE CONSISTENCY MAINTAINED ACROSS ALL FRAMES.]
Scene: ${params.sceneDescription} at ${params.sceneLocation}.
Activity & Movement: ${params.characterActivity}.
Facial Expression & Micro-gestures: ${params.facialExpression}, subtle natural eye blinks, organic muscle movements around eyes and jaw.
Camera Movement: ${params.cameraMovement}, smooth cinematic stabilizer track, cinematic depth of field.
Lighting & Atmosphere: ${params.lighting}, consistent studio illumination, realistic natural shadows.
${params.dialogue ? `Dialogue & Lip-Sync: Character speaks line: "${params.dialogue}" with precise phoneme-accurate lip synchronization, organic jaw movement, tongue articulation, and synchronized chest breathing.` : 'Movement: Fluid organic body dynamics, realistic cloth physics and hair sway conforming to wind dynamics.'}
Visual Style: ${params.videoStyle}, 24fps film motion blur, photorealistic live-action footage, Arri Alexa LF cinema camera.`;

  const negativePrompt = `${dna.negativePrompt}, morphed face, warping features between frames, flickering eyes, robotic mouth movements, cartoon motion, jittery artifacts, unnatural neck elongation, duplicated limbs`;

  const instructions = [
    `Duration: ${params.duration}`,
    `Camera Movement: ${params.cameraMovement}`,
    `Aspect Ratio: ${params.aspectRatio}`,
    `Frame Rate: 24 fps (Cinematic Standard)`,
    `Audio Track: Synchronized ambient acoustics & vocal presence`,
  ];

  return { masterPrompt, negativePrompt, instructions };
}

/**
 * Compiles Motion Prompt with Action Timeline
 */
export function buildMotionPrompt(
  dna: MasterCharacterDNA,
  params: MotionPromptParams
): { masterPrompt: string; timelineSummary: string } {
  const timelineText = params.timeline
    .map(
      (t) =>
        `[${t.timeRange}]: ${t.action}. Facial: ${t.facialMovement}. Camera: ${t.cameraMovement}.`
    )
    .join('\n');

  const masterPrompt = `[MOTION DIRECTIVE & PHYSICAL CONTINUITY]
Subject: ${dna.name} (Master DNA ID: ${dna.characterId}).
Body Dynamics: ${params.bodyMovement}.
Facial Micro-Expressions: ${params.facialMovement}.
Camera Choreography: ${params.cameraMotion}.

EXECUTION TIMELINE:
${timelineText}

Kinematic Constraints:
- Weight distribution obeys realistic gravitational inertia.
- Natural neck and spine counter-rotation during head turns.
- Eyelid blink rate: 1 organic blink every 2.5–3.5 seconds.
- Facial identity lock: 0% drift of facial geometry, bone proportions, or pupil placement during motion.`;

  return { masterPrompt, timelineSummary: timelineText };
}

/**
 * Compiles Voice DNA into Master Voice Prompt and SSML-enhanced Dialogue
 */
export function buildVoicePrompt(
  dna: MasterCharacterDNA,
  params: VoicePromptParams
): {
  voiceDescription: string;
  voiceGenPrompt: string;
  markedScript: string;
  productionNotes: string[];
} {
  const voiceDescription = `${params.voiceName} - ${params.gender}, visual age ${params.voiceAge}. Vocal Profile: ${params.vocalDepth}, ${params.tone}. Pace: ${params.speakingSpeed}. Emotional Demeanor: ${params.emotionalStyle}. Pronunciation: ${params.pronunciationStyle}. Language: ${params.language} (${params.accent}).`;

  const voiceGenPrompt = `Text-To-Speech Persona Prompt:
Voice Archetype: ${params.voiceStyle}
Gender: ${params.gender} | Pitch: ${params.vocalDepth} | Timbre: ${params.tone}
Accent: ${params.accent} | Cadence: ${params.speakingSpeed}
Acoustic Environment: Clean treated broadcast recording studio, Neumann U87 microphone close proximity, zero room reverb, warm low-end proximity effect, crisp sibilance control.`;

  // SSML-like enriched marked script
  const markedScript = `[VOICE: ${params.voiceName} | PACE: ${params.speakingSpeed} | EMOTION: ${params.emotionalStyle}]
<voice style="${params.voiceStyle}" depth="${params.vocalDepth}">
<prosody rate="${params.speakingSpeed.includes('0.8') ? 'slow' : params.speakingSpeed.includes('1.1') ? 'fast' : 'medium'}" pitch="default">
${params.dialogueText}
</prosody>
</voice>`;

  const productionNotes = [
    `Recommended Engine: ElevenLabs (Multilingual v2) or Gemini TTS (${dna.voiceIdentity?.language || 'Indonesian/English'})`,
    `Mastering: High-pass filter at 80Hz, gentle compression 2.5:1 ratio, subtle de-esser at 6.2kHz`,
    `Audio Output: 48kHz, 24-bit Broadcast WAV / MP3 320kbps`,
  ];

  return { voiceDescription, voiceGenPrompt, markedScript, productionNotes };
}

/**
 * Generates initial fallback storyboard scenes for a character
 */
export function generateDefaultScenes(
  dna: MasterCharacterDNA,
  title: string,
  concept: string,
  count: number = 4
): StoryboardScene[] {
  const templates = [
    {
      title: 'Scene 1: Introduction & Identity Anchor',
      duration: '0:00 - 0:08',
      action: `${dna.name} walks into modern architectural studio, pausing deliberately and facing the lens.`,
      expression: 'Confident composure, subtle gentle smile, engaging direct gaze.',
      angle: 'Eye Level Medium Close Up',
      movement: 'Slow Push In',
      environment: 'Sunlit brutalist concrete and warm wood studio with soft atmospheric haze',
      lighting: 'Soft directional morning window light',
      dialogue: 'Halo semuanya, saya siap membantu merancang masa depan visual Anda.',
      voiceDirection: 'Warm, articulate, inviting tone with deliberate initial pause.',
    },
    {
      title: 'Scene 2: Demonstration & Dynamic Action',
      duration: '0:08 - 0:16',
      action: `${dna.name} gestures toward an interactive holographic display table, analyzing live data points.`,
      expression: 'Intense focus, intellectual curiosity, slight furrow of brow settling into reassurance.',
      angle: 'Over-the-shoulder Medium Shot shifting to Profile',
      movement: 'Subtle Orbit Tracking Right',
      environment: 'High-tech creative command center with minimalist glowing interface',
      lighting: 'Cool cyan ambient rim light paired with warm halogen desk glow',
      dialogue: 'Kuncinya adalah konsistensi: satu DNA karakter, ribuan kemungkinan adegan tanpa kehilangan identitas.',
      voiceDirection: 'Authoritative, clear pacing, emphasizing keywords with vocal inflection.',
    },
    {
      title: 'Scene 3: Deep Focus & Close Detail',
      duration: '0:16 - 0:24',
      action: `${dna.name} looks up from workspace, adjusting posture and making intimate connection with viewer.`,
      expression: 'Subtle knowing smile, tranquil confidence, authentic eye crinkles.',
      angle: 'Extreme Close Up on Face (85mm f/1.4)',
      movement: 'Static Camera with micro handheld breathing sensation',
      environment: 'Warm blurred bokeh studio background',
      lighting: 'Rembrandt key lighting accentuating cheekbones and natural skin pores',
      dialogue: 'Setiap pori-pori, bentuk mata, dan gestur tetap terjaga sempurna.',
      voiceDirection: 'Intimate close-proximity delivery, warm resonance, clear sibilance.',
    },
    {
      title: 'Scene 4: Resolution & Call to Action',
      duration: '0:24 - 0:32',
      action: `${dna.name} stands up smoothly, hands resting comfortably at sides, nodding with affirmative pride.`,
      expression: 'Empowering smile, radiant optimism, steady authoritative gaze.',
      angle: 'Medium Full Shot looking slightly upward (+5 degrees)',
      movement: 'Slow Dolly Out',
      environment: 'Panoramic studio window overlooking modern city skyline at dusk',
      lighting: 'Golden hour twilight with electric blue studio fill',
      dialogue: 'Muara AI Realistic Character Studio. Create once, stay consistent, look real.',
      voiceDirection: 'Cinematic brand sign-off, deep inspiring resonance and final settling smile.',
    },
  ];

  return Array.from({ length: count }).map((_, idx) => {
    const t = templates[idx % templates.length];
    return {
      sceneNumber: idx + 1,
      sceneTitle: `${t.title} (${dna.name})`,
      duration: t.duration,
      characterAction: t.action,
      facialExpression: t.expression,
      cameraAngle: t.angle,
      cameraMovement: t.movement,
      environment: t.environment,
      lighting: t.lighting,
      dialogue: t.dialogue,
      voiceDirection: t.voiceDirection,
      visualPrompt: `Photorealistic cinematic shot of ${dna.name}, Master DNA ID ${dna.characterId}. ${t.action} Facial expression: ${t.expression}. ${t.angle}, ${t.movement}. Shot on Arri Alexa LF 85mm. Lighting: ${t.lighting}. Realistic skin pores, natural anatomy.`,
      videoPrompt: `[IDENTITY LOCK: ${dna.name}] ${t.action} Camera: ${t.movement}. Expression: ${t.expression}. Dialogue: "${t.dialogue}". Synchronized realistic speech and natural body physics. 24fps cinematic photorealism.`,
      motionPrompt: `0-2s: Entry movement. 2-6s: Core gesture. 6-8s: Final composed pose. Face identity preserved 100%.`,
      audioPrompt: `Dialogue: "${t.dialogue}" spoken with ${t.voiceDirection}. Subtle studio room tone and cloth movement.`,
    };
  });
}
