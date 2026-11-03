import { CharacterProfile } from '../types/character';

// Helper to generate a clean, stylized high-fidelity SVG avatar for fallback/reference
export function generateCharacterAvatarSvg(
  gender: string,
  skinColor: string,
  hairColor: string,
  hairStyle: string,
  accentColor: string,
  name: string
): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" width="100%" height="100%">
    <defs>
      <radialGradient id="bgGrad" cx="50%" cy="30%" r="80%">
        <stop offset="0%" stop-color="#1E293B" />
        <stop offset="100%" stop-color="#0B0F17" />
      </radialGradient>
      <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${skinColor}" />
        <stop offset="100%" stop-color="${skinColor}" stop-opacity="0.85" />
      </linearGradient>
      <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${hairColor}" />
        <stop offset="100%" stop-color="#111827" />
      </linearGradient>
      <linearGradient id="accentGlow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.4" />
        <stop offset="100%" stop-color="transparent" />
      </linearGradient>
    </defs>
    
    <!-- Background Canvas -->
    <rect width="320" height="320" rx="16" fill="url(#bgGrad)" />
    <circle cx="160" cy="140" r="130" fill="${accentColor}" opacity="0.08" />
    
    <!-- Torso / Shoulders -->
    <path d="M 70 320 C 70 240, 100 220, 160 220 C 220 220, 250 240, 250 320 Z" fill="#1E2430" />
    <path d="M 120 220 L 160 255 L 200 220 Z" fill="${skinColor}" opacity="0.9" />
    <path d="M 130 220 C 130 240, 190 240, 190 220 Z" fill="#0F172A" opacity="0.5" />
    
    <!-- Neck -->
    <rect x="140" y="170" width="40" height="50" rx="6" fill="url(#skinGrad)" />
    
    <!-- Head / Face -->
    <ellipse cx="160" cy="130" rx="54" ry="68" fill="url(#skinGrad)" />
    
    <!-- Hair Base/Back -->
    ${
      hairStyle.includes('Wavy') || hairStyle.includes('Long')
        ? `<path d="M 96 120 C 90 190, 85 240, 110 260 C 120 230, 115 170, 120 140 Z" fill="url(#hairGrad)" />
           <path d="M 224 120 C 230 190, 235 240, 210 260 C 200 230, 205 170, 200 140 Z" fill="url(#hairGrad)" />`
        : ''
    }
    
    <!-- Eyes -->
    <g fill="#111827">
      <ellipse cx="140" cy="126" rx="9" ry="5.5" fill="#FFFFFF" />
      <circle cx="140" cy="126" r="4.5" fill="#2E1C14" />
      <circle cx="141.5" cy="124.5" r="1.5" fill="#FFFFFF" />
      
      <ellipse cx="180" cy="126" rx="9" ry="5.5" fill="#FFFFFF" />
      <circle cx="180" cy="126" r="4.5" fill="#2E1C14" />
      <circle cx="181.5" cy="124.5" r="1.5" fill="#FFFFFF" />
    </g>
    
    <!-- Eyebrows -->
    <path d="M 128 116 Q 140 112 150 115" stroke="${hairColor}" stroke-width="3.2" stroke-linecap="round" fill="none" />
    <path d="M 170 115 Q 180 112 192 116" stroke="${hairColor}" stroke-width="3.2" stroke-linecap="round" fill="none" />
    
    <!-- Nose -->
    <path d="M 160 120 L 157 146 Q 160 150 165 146" stroke="#9A6B4C" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.6" />
    
    <!-- Lips -->
    <path d="M 148 164 Q 160 161 172 164 Q 160 171 148 164 Z" fill="#B96D60" opacity="0.85" />
    
    <!-- Hair Foreground -->
    <path d="M 106 125 C 100 80, 130 65, 160 65 C 190 65, 220 80, 214 125 C 200 85, 175 80, 160 84 C 145 80, 120 85, 106 125 Z" fill="url(#hairGrad)" />
    
    <!-- Studio Tag & DNA Watermark -->
    <rect x="14" y="14" width="76" height="20" rx="4" fill="rgba(15,23,42,0.7)" />
    <text x="20" y="28" font-family="JetBrains Mono, monospace" font-size="9" fill="${accentColor}" letter-spacing="1">DNA LOCK</text>
    
    <text x="16" y="302" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" font-size="12" fill="#E2E8F0">${name}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const defaultCharacters: CharacterProfile[] = [
  {
    id: 'char-elena-vance',
    name: 'Elena Vance',
    tags: ['Documentary', 'Editorial', 'Photorealistic'],
    isPreset: true,
    referenceImages: {
      facePortrait: generateCharacterAvatarSvg(
        'Female',
        '#E4B89A',
        '#3D2314',
        'Shoulder-Length Wavy',
        '#38BDF8',
        'Elena Vance'
      ),
    },
    dna: {
      characterId: 'MUA-DNA-0091',
      name: 'Elena Vance',
      gender: 'Female',
      visualAge: 28,
      nationality: 'Indonesian-Dutch',
      ethnicity: 'Eurasian mixed descent, natural warm olive undertones',
      skinTone: 'Olive Mediterranean',
      skinTexture: 'Micro-pores visible under direct light, subtle natural freckles across nasal bridge, soft subsurface scattering, zero airbrushed smoothing',
      faceShape: 'Oval',
      faceGeometry: 'Balanced symmetrical oval facial contour, high cheekbones, gentle softened jawline, 1:1.618 golden ratio facial harmony',
      eyeShape: 'Almond',
      eyeColor: 'Hazel Golden',
      eyebrow: 'Natural Arched',
      noseShape: 'Straight Greek',
      lipShape: 'Defined Cupid\'s Bow',
      hairStyle: 'Shoulder-Length Wavy',
      hairColor: 'Dark Chestnut Brown',
      bodyType: 'Athletic Lean',
      height: '172 cm',
      distinctiveFeatures: 'Faint constellation of light sun freckles across upper cheeks, subtle beauty mark 4mm below left tear duct, intelligent alert gaze',
      personality: 'Charismatic, investigative, observant, composed confidence',
      profession: 'Investigative Photojournalist & Cultural Documentarian',
      speakingStyle: 'Articulate, calm cadence, warm mid-range tone, persuasive and thoughtful pauses',
      facialExpression: 'Subtle knowing smile, direct eye contact with camera lens',
      bodyLanguage: 'Relaxed upright posture, purposeful hand gestures, observant head tilt',
      clothingStyle: 'Minimalist utilitarian chic, washed charcoal linen overshirts, organic cotton basics, discreet leather watch band',
      clothingIdentity: 'Signature tailored charcoal linen blazer over dark slate scoop tee',
      voiceIdentity: {
        voiceName: 'Elena Alto Calma',
        vocalDepth: 'Warm Alto',
        tone: 'Warm, articulate, empathetic and confident',
        speakingSpeed: 'Natural 1.0x',
        emotionalStyle: 'Thoughtful Curiosity & Authority',
        language: 'Bahasa Indonesia & English',
        accent: 'Neutral Jakarta Contemporary / Global Cosmopolitan',
      },
      masterVisualPrompt: 'Master DNA Reference Lock: Elena Vance, 28-year-old Eurasian woman with warm olive skin, authentic micro-pores and delicate freckles over nasal bridge. Almond hazel golden eyes, high defined cheekbones, natural arched eyebrows, straight delicate nose, defined cupid bow lips. Shoulder-length textured wavy dark chestnut brown hair with natural volume. 85mm f/1.4 lens, soft directional window light, photorealistic skin shader with realistic subsurface scattering.',
      negativePrompt: 'blurry, cartoon, 3d render, plastic doll skin, smooth porcelain skin, altered facial bone structure, changed eye color, changed ethnicity, extra limbs, deformed fingers, low resolution, bad anatomy, artificial lighting, oversaturated',
      identityLocked: true,
      createdAt: '2026-03-01T08:00:00.000Z',
      updatedAt: '2026-03-01T08:00:00.000Z',
    },
  },
  {
    id: 'char-kenjiro-takahashi',
    name: 'Kenjiro Takahashi',
    tags: ['Architecture', 'Tech Lead', 'Cinematic'],
    isPreset: true,
    referenceImages: {
      facePortrait: generateCharacterAvatarSvg(
        'Male',
        '#F3D2B8',
        '#1E1E24',
        'Clean Textured Fade Undercut',
        '#06B6D4',
        'Kenjiro Takahashi'
      ),
    },
    dna: {
      characterId: 'MUA-DNA-0092',
      name: 'Kenjiro Takahashi',
      gender: 'Male',
      visualAge: 34,
      nationality: 'Japanese',
      ethnicity: 'East Asian, Tokyo native',
      skinTone: 'Warm Beige',
      skinTexture: 'Clean natural male skin texture, faint laugh lines at eye corners, realistic matte hydration without greasy shine',
      faceShape: 'Angular Chiseled',
      faceGeometry: 'Strong defined jawline, prominent angular zygomatic bones, flat plane forehead, clean architectural facial balance',
      eyeShape: 'Hooded',
      eyeColor: 'Deep Dark Brown',
      eyebrow: 'Straight Dense',
      noseShape: 'High Bridge Narrow',
      lipShape: 'Thin Balanced',
      hairStyle: 'Clean Textured Fade Undercut',
      hairColor: 'Obsidian Jet Black',
      bodyType: 'Slender Elegant',
      height: '180 cm',
      distinctiveFeatures: 'Sharp angular jawline, slight scar along right temple, minimalist titanium thin-frame spectacles (optional)',
      personality: 'Methodical, visionary, quietly authoritative, laser-focused',
      profession: 'Spatial Architect & AI Visual Production Director',
      speakingStyle: 'Measured, precise articulation, resonant baritone, minimal filler words',
      facialExpression: 'Focused contemplation, calm resolute gaze into distance',
      bodyLanguage: 'Precise deliberate movements, upright spine, palms resting gently',
      clothingStyle: 'Issey Miyake pleats aesthetic, architectural dark gray turtlenecks, structured wool trench coats',
      clothingIdentity: 'Matte black structured architectural blazer with hidden button placket',
      voiceIdentity: {
        voiceName: 'Kenjiro Baritone Depth',
        vocalDepth: 'Deep Baritone',
        tone: 'Deep, crisp, architectural, authoritative',
        speakingSpeed: 'Deliberate 0.92x',
        emotionalStyle: 'Quiet Masterful Precision',
        language: 'English & Japanese & Indonesian',
        accent: 'Crisp International / Tokyo Mid-Atlantic',
      },
      masterVisualPrompt: 'Master DNA Reference Lock: Kenjiro Takahashi, 34-year-old Japanese man with sharp chiseled jawline, hooded deep dark brown eyes, straight dense dark eyebrows, high bridge narrow nose. Textured modern fade undercut in obsidian black. Natural warm beige skin with authentic pore details and subtle eye lines. Leica 50mm Summilux lens, architectural studio lighting, deep subtle shadows, photorealistic cinematic.',
      negativePrompt: 'deformed eyes, asymmetrical jaw drift, white skin bleached, plastic wax figure, video game render, airbrushing, caricature, cartoon, distorted ears, bad hands, low resolution',
      identityLocked: true,
      createdAt: '2026-03-01T09:00:00.000Z',
      updatedAt: '2026-03-01T09:00:00.000Z',
    },
  },
  {
    id: 'char-aria-nusantara',
    name: 'Aria Nusantara',
    tags: ['Founder', 'Keynote Speaker', 'Modern Luxury'],
    isPreset: true,
    referenceImages: {
      facePortrait: generateCharacterAvatarSvg(
        'Female',
        '#C8966E',
        '#12131A',
        'Sleek Obsidian Bob',
        '#EAB308',
        'Aria Nusantara'
      ),
    },
    dna: {
      characterId: 'MUA-DNA-0093',
      name: 'Aria Nusantara',
      gender: 'Female',
      visualAge: 25,
      nationality: 'Indonesian',
      ethnicity: 'Southeast Asian Javanese-Sundanese heritage',
      skinTone: 'Warm Caramel',
      skinTexture: 'Luminous natural golden undertones, rich dermal radiance, authentic skin pores, fine peach fuzz on cheek perimeter',
      faceShape: 'Heart Shaped',
      faceGeometry: 'High tapered cheekbones, gently tapered chin, soft forehead width, elegant neck curvature',
      eyeShape: 'Almond',
      eyeColor: 'Warm Amber',
      eyebrow: 'Soft Feathered',
      noseShape: 'Soft Button',
      lipShape: 'Full Natural',
      hairStyle: 'Sleek Obsidian Bob',
      hairColor: 'Obsidian Jet Black',
      bodyType: 'Slender Elegant',
      height: '166 cm',
      distinctiveFeatures: 'Radiant warm amber eyes with bright catchlights, gentle dimple on right cheek when smiling',
      personality: 'Inspiring, visionary, energetic, warm and highly approachable',
      profession: 'DeepTech Founder & Keynote Speaker',
      speakingStyle: 'Dynamic, infectious cadence, warm soprano clarity, empathetic resonance',
      facialExpression: 'Bright genuine smile showing slight upper teeth alignment, engaging eyes',
      bodyLanguage: 'Open chest, expressive hand gestures, confident stage pacing',
      clothingStyle: 'Modern Indonesian fusion couture, structured batik silk accents, tailored jewel-toned pantsuits',
      clothingIdentity: 'Emerald green tailored silk power suit with modern minimalist silhouette',
      voiceIdentity: {
        voiceName: 'Aria Soprano Inspiratif',
        vocalDepth: 'Warm Soprano',
        tone: 'Inspiring, clear, resonant, charismatic',
        speakingSpeed: 'Dynamic 1.05x',
        emotionalStyle: 'High Energy & Visionary Passion',
        language: 'Bahasa Indonesia & English',
        accent: 'Indonesian Urban Fluent / Silicon Valley Tech',
      },
      masterVisualPrompt: 'Master DNA Reference Lock: Aria Nusantara, 25-year-old Southeast Asian Indonesian woman with glowing warm caramel skin, full natural lips, soft button nose, almond warm amber eyes. Sleek blunt cut obsidian bob hairstyle tucked behind ears. Genuine radiant expression, high cheekbones. Hasselblad H6D-100c medium format camera, warm studio softbox key light, authentic photographic reality.',
      negativePrompt: 'unnatural doll eyes, yellow jaundice tint, flat 2D face, plastic skin, distorted teeth, mismatched eye sizes, bad hands, washed out colors, anime, cartoon, oversmoothed',
      identityLocked: true,
      createdAt: '2026-03-01T10:00:00.000Z',
      updatedAt: '2026-03-01T10:00:00.000Z',
    },
  },
  {
    id: 'char-marcus-thorne',
    name: 'Marcus Thorne',
    tags: ['Narrator', 'Executive', 'Commercial'],
    isPreset: true,
    referenceImages: {
      facePortrait: generateCharacterAvatarSvg(
        'Male',
        '#68412B',
        '#221E1D',
        'Curly Tapered Afro',
        '#F59E0B',
        'Marcus Thorne'
      ),
    },
    dna: {
      characterId: 'MUA-DNA-0094',
      name: 'Marcus Thorne',
      gender: 'Male',
      visualAge: 42,
      nationality: 'British-Caribbean',
      ethnicity: 'Afro-Caribbean heritage',
      skinTone: 'Deep Mahogany',
      skinTexture: 'Rich deep mahogany skin with refined pore distribution, natural specular highlights, distinguished character lines at brow',
      faceShape: 'Square Defined',
      faceGeometry: 'Broad jaw, masculine cranial structure, prominent brow ridge, harmonious ear proportion',
      eyeShape: 'Deep-set',
      eyeColor: 'Deep Dark Brown',
      eyebrow: 'Bold Defined',
      noseShape: 'Wide Natural',
      lipShape: 'Full Natural',
      hairStyle: 'Curly Tapered Afro',
      hairColor: 'Salt and Pepper',
      bodyType: 'Muscular Broad',
      height: '188 cm',
      distinctiveFeatures: 'Well-groomed salt-and-pepper short boxed beard, deep-set piercing eyes, baritone chest resonance',
      personality: 'Gravitas, calm mastery, deep emotional depth, dependable leader',
      profession: 'Senior Film Director & Global Voice Actor',
      speakingStyle: 'Deep resonant bass-baritone, cinematic BBC narrator cadence, rich timber',
      facialExpression: 'Warm authoritative smile, tranquil knowing gaze',
      bodyLanguage: 'Commanding stance, relaxed shoulders, authoritative presence',
      clothingStyle: 'Savile Row bespoke heavy knits, olive waxed jackets, fine merino wool overcoats',
      clothingIdentity: 'Dark forest green heavy-gauge merino turtleneck sweater under bespoke charcoal topcoat',
      voiceIdentity: {
        voiceName: 'Marcus Bass Narrator',
        vocalDepth: 'Deep Bass-Baritone',
        tone: 'Deep, cinematic, thunderous yet velvety, BBC nature documentary style',
        speakingSpeed: 'Slow Measured 0.88x',
        emotionalStyle: 'Cinematic Gravitas & Reassurance',
        language: 'English & International',
        accent: 'British Received Pronunciation / London BBC Standard',
      },
      masterVisualPrompt: 'Master DNA Reference Lock: Marcus Thorne, 42-year-old Afro-Caribbean man with deep mahogany skin, fine natural facial texture, deep-set dark brown eyes, groomed salt and pepper beard, curly close-tapered hair. Strong square jawline. Arri Alexa Mini LF portrait, 65mm lens, golden hour natural backlight with subtle fill, authentic cinema photorealism.',
      negativePrompt: 'skin tone bleaching, unnatural lighting, plastic skin, CGI texture, deformed mouth, bad beard texture, extra limbs, blur, anime, low resolution, bad teeth',
      identityLocked: true,
      createdAt: '2026-03-01T11:00:00.000Z',
      updatedAt: '2026-03-01T11:00:00.000Z',
    },
  },
];
