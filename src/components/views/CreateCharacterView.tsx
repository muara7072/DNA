import React, { useState } from 'react';
import {
  UserPlus,
  Dna,
  Save,
  Image as ImageIcon,
  Sparkles,
  Upload,
  Trash2,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';
import {
  Gender,
  SkinTone,
  FaceShape,
  EyeShape,
  EyeColor,
  EyebrowStyle,
  NoseShape,
  LipShape,
  HairStyle,
  HairColor,
  BodyType,
  CharacterProfile,
  MasterCharacterDNA,
} from '../../types/character';
import { useStudio } from '../../context/StudioContext';
import { generateCharacterAvatarSvg } from '../../data/defaultCharacters';
import { generatePortraitWithAI } from '../../services/api';

export const CreateCharacterView: React.FC = () => {
  const { saveCharacter, setActiveTab, showToast, setActivePreviewPrompt } = useStudio();

  // Automatic unique ID generator
  const [characterId] = useState(() => `MUA-DNA-${Math.floor(1000 + Math.random() * 9000)}`);

  // Character Identity State
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('Female');
  const [visualAge, setVisualAge] = useState<number>(27);
  const [nationality, setNationality] = useState('Indonesian');
  const [ethnicity, setEthnicity] = useState('Southeast Asian mixed heritage, natural olive undertone');
  const [skinTone, setSkinTone] = useState<SkinTone>('Warm Caramel');
  const [skinTexture, setSkinTexture] = useState(
    'Natural micro-pores, subtle authentic skin texture, realistic subsurface scattering, zero airbrush smoothing'
  );
  const [faceShape, setFaceShape] = useState<FaceShape>('Oval');
  const [faceGeometry, setFaceGeometry] = useState('Balanced symmetrical golden ratio, soft angular cheekbones');
  const [eyeShape, setEyeShape] = useState<EyeShape>('Almond');
  const [eyeColor, setEyeColor] = useState<EyeColor>('Deep Dark Brown');
  const [eyebrow, setEyebrow] = useState<EyebrowStyle>('Natural Arched');
  const [noseShape, setNoseShape] = useState<NoseShape>('Straight Greek');
  const [lipShape, setLipShape] = useState<LipShape>('Full Natural');
  const [hairStyle, setHairStyle] = useState<HairStyle>('Shoulder-Length Wavy');
  const [hairColor, setHairColor] = useState<HairColor>('Obsidian Jet Black');
  const [bodyType, setBodyType] = useState<BodyType>('Athletic Lean');
  const [height, setHeight] = useState('168 cm');
  const [distinctiveFeatures, setDistinctiveFeatures] = useState(
    'Subtle beauty mark below left eye, faint natural freckles across nasal bridge, intelligent observant gaze'
  );

  // Personality & Style State
  const [personality, setPersonality] = useState('Charismatic, thoughtful, articulate, confident leader');
  const [profession, setProfession] = useState('Creative Director & Visual Storyteller');
  const [speakingStyle, setSpeakingStyle] = useState('Articulate, calm cadence, warm mid-range resonance');
  const [facialExpression, setFacialExpression] = useState('Subtle confident smile, direct engaging gaze into lens');
  const [bodyLanguage, setBodyLanguage] = useState('Poised upright posture, deliberate open hand gestures');
  const [clothingStyle, setClothingStyle] = useState(
    'Modern minimalist architectural tailoring, charcoal gray linen jacket, clean scoop neckline'
  );

  // Reference Images
  const [facePortrait, setFacePortrait] = useState<string>('');
  const [fullBody, setFullBody] = useState<string>('');
  const [extraReference, setExtraReference] = useState<string>('');
  const [isGeneratingPortrait, setIsGeneratingPortrait] = useState(false);

  // Auto-generate avatar if none uploaded
  const previewAvatar =
    facePortrait ||
    generateCharacterAvatarSvg(
      gender,
      skinTone.includes('Caramel') || skinTone.includes('Bronze') ? '#C8966E' : '#E4B89A',
      hairColor.includes('Black') ? '#111827' : '#3D2314',
      hairStyle,
      '#06B6D4',
      name || 'New Character'
    );

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void,
    label: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      showToast('Ukuran gambar maksimal 8MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setter(base64);
      showToast(`${label} berhasil diunggah!`, 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleCreateDna = () => {
    if (!name.trim()) {
      showToast('Mohon masukkan Nama Karakter terlebih dahulu', 'error');
      return;
    }

    const masterVisualPrompt = `[MASTER CHARACTER DNA LOCK: ${characterId}]
Subject: ${name}, ${visualAge}-year-old ${nationality} (${ethnicity}).
Facial Architecture: ${faceShape} bone structure, ${faceGeometry}.
Eyes: ${eyeShape} in ${eyeColor}. Nose: ${noseShape}. Lips: ${lipShape}. Eyebrows: ${eyebrow}.
Skin: ${skinTone} with ${skinTexture}.
Hair: ${hairStyle} in ${hairColor}.
Body & Stature: ${bodyType}, ${height}.
Distinctive Features: ${distinctiveFeatures}.
Clothing: ${clothingStyle}.
Expression & Demeanor: ${facialExpression}.
Photography: 85mm f/1.4 prime lens, soft natural lighting, realistic subsurface scattering, ultra-photorealistic skin pores, 8k resolution.`;

    const negativePrompt = `blurry, plastic doll skin, oversmoothed CGI, altered face geometry, changed eye shape, inconsistent facial identity, anime, 3d render, low resolution, bad anatomy`;

    setActivePreviewPrompt({
      title: `MASTER DNA · ${name}`,
      prompt: masterVisualPrompt,
      type: 'MASTER DNA',
    });

    showToast('Master Character DNA berhasil disusun & ditampilkan di Preview Panel!', 'success');
  };

  const handleGeneratePortrait = async () => {
    if (!name.trim()) {
      showToast('Masukkan Nama Karakter terlebih dahulu', 'error');
      return;
    }

    setIsGeneratingPortrait(true);
    showToast('Memproses portrait fotorealistik melalui AI Studio Image Engine...', 'info');

    const prompt = `Ultra photorealistic 85mm portrait photo of ${name}, a ${visualAge}-year-old ${nationality} (${ethnicity}), with ${skinTone} skin with natural pores, ${eyeColor} ${eyeShape} eyes, ${hairStyle} in ${hairColor}, wearing ${clothingStyle}. Soft studio window lighting, raw photographic realism, shallow depth of field.`;

    const mockDna: any = {
      name,
      visualAge,
      nationality,
      ethnicity,
      skinTone,
      eyeColor,
      eyeShape,
      hairStyle,
      hairColor,
      clothingStyle,
    };

    const result = await generatePortraitWithAI(prompt, mockDna, '1:1');
    setIsGeneratingPortrait(false);

    if (result.success && result.imageBase64) {
      setFacePortrait(result.imageBase64);
      showToast('Portrait karakter berhasil dibuat!', 'success');
    } else {
      // Fallback: Use high-fidelity SVG avatar and inform user
      const svgFallback = generateCharacterAvatarSvg(
        gender,
        skinTone.includes('Caramel') ? '#C8966E' : skinTone.includes('Olive') ? '#D6A680' : '#E8BCA0',
        hairColor.includes('Black') ? '#111827' : '#3D2314',
        hairStyle,
        '#38BDF8',
        name
      );
      setFacePortrait(svgFallback);
      showToast(
        result.message || 'Avatar master referensi telah dibuat! Master prompt siap disalin ke Midjourney/Flux.',
        'info'
      );
    }
  };

  const handleSaveCharacter = () => {
    if (!name.trim()) {
      showToast('Nama Karakter wajib diisi!', 'error');
      return;
    }

    const finalFace =
      facePortrait ||
      generateCharacterAvatarSvg(
        gender,
        skinTone.includes('Caramel') ? '#C8966E' : '#E4B89A',
        hairColor.includes('Black') ? '#111827' : '#3D2314',
        hairStyle,
        '#06B6D4',
        name
      );

    const masterVisualPrompt = `[IDENTITY PRESERVATION: ${name}, ${visualAge}yo ${nationality} ${ethnicity}] ${faceShape} face, ${eyeShape} ${eyeColor} eyes, ${hairStyle} (${hairColor}), ${skinTone} skin with authentic micro-pores. Distinctive: ${distinctiveFeatures}. Wearing ${clothingStyle}. Shot on 85mm f/1.4 studio photography.`;

    const negativePrompt = `blurry, plastic skin, distorted face, changed ethnicity, anime, 3d render, deformed anatomy, bad eyes`;

    const dna: MasterCharacterDNA = {
      characterId,
      name,
      gender,
      visualAge,
      nationality,
      ethnicity,
      skinTone,
      skinTexture,
      faceShape,
      faceGeometry,
      eyeShape,
      eyeColor,
      eyebrow,
      noseShape,
      lipShape,
      hairStyle,
      hairColor,
      bodyType,
      height,
      distinctiveFeatures,
      personality,
      profession,
      speakingStyle,
      facialExpression,
      bodyLanguage,
      clothingStyle,
      clothingIdentity: clothingStyle,
      voiceIdentity: {
        voiceName: `${name} Standard`,
        vocalDepth: gender === 'Male' ? 'Deep Baritone' : 'Warm Alto',
        tone: 'Warm, articulate, confident',
        speakingSpeed: 'Natural 1.0x',
        emotionalStyle: 'Calm Authority',
        language: 'Bahasa Indonesia & English',
        accent: 'Neutral Contemporary',
      },
      masterVisualPrompt,
      negativePrompt,
      identityLocked: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newProfile: CharacterProfile = {
      id: `char-${Date.now()}`,
      name,
      dna,
      referenceImages: {
        facePortrait: finalFace,
        fullBody: fullBody || undefined,
        extraReference: extraReference || undefined,
      },
      tags: [profession.split(' ')[0] || 'Custom', gender, nationality],
      isPreset: false,
    };

    saveCharacter(newProfile);
    setActiveTab('dna-studio');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              CHARACTER CREATION WIZARD
            </span>
            <span className="font-mono text-xs text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
              {characterId}
            </span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-white mt-1">Create New Realistic Character</h1>
          <p className="text-xs text-slate-400">
            Definisikan parameter biometrik, visual, kepribadian, dan foto referensi untuk membentuk Master Character DNA permanen.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCreateDna}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-cyan-300 transition-all"
          >
            <Dna className="w-3.5 h-3.5 text-cyan-400" />
            <span>Create DNA</span>
          </button>

          <button
            onClick={handleSaveCharacter}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 active:scale-95 text-xs font-bold text-slate-950 shadow-md shadow-cyan-500/10 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Character</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form Inputs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Core Biometric Identity */}
          <div className="bg-[#0C101A] border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              IDENTITAS KARAKTER
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Character Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya Wardhana"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Character ID</label>
                <input
                  type="text"
                  disabled
                  value={characterId}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2 text-slate-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-Binary">Non-Binary</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Visual Age: <span className="text-cyan-400 font-mono font-bold">{visualAge} y/o</span>
                </label>
                <input
                  type="range"
                  min={18}
                  max={75}
                  value={visualAge}
                  onChange={(e) => setVisualAge(Number(e.target.value))}
                  className="w-full accent-cyan-400 mt-2 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Nationality</label>
                <input
                  type="text"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  placeholder="e.g. Indonesian / Japanese / British"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Skin Tone</label>
                <select
                  value={skinTone}
                  onChange={(e) => setSkinTone(e.target.value as SkinTone)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Fair Pale">Fair Pale</option>
                  <option value="Warm Beige">Warm Beige</option>
                  <option value="Olive Mediterranean">Olive Mediterranean</option>
                  <option value="Warm Caramel">Warm Caramel</option>
                  <option value="Warm Bronze">Warm Bronze</option>
                  <option value="Deep Mahogany">Deep Mahogany</option>
                  <option value="Rich Espresso">Rich Espresso</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 font-medium mb-1">Ethnicity / Appearance</label>
                <input
                  type="text"
                  value={ethnicity}
                  onChange={(e) => setEthnicity(e.target.value)}
                  placeholder="Deskripsi etnis &amp; penampilan visual..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Face Shape</label>
                <select
                  value={faceShape}
                  onChange={(e) => setFaceShape(e.target.value as FaceShape)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Oval">Oval</option>
                  <option value="Square Defined">Square Defined</option>
                  <option value="Heart Shaped">Heart Shaped</option>
                  <option value="Diamond">Diamond</option>
                  <option value="Round Soft">Round Soft</option>
                  <option value="Angular Chiseled">Angular Chiseled</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Eye Shape</label>
                <select
                  value={eyeShape}
                  onChange={(e) => setEyeShape(e.target.value as EyeShape)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Almond">Almond</option>
                  <option value="Hooded">Hooded</option>
                  <option value="Round">Round</option>
                  <option value="Monolid">Monolid</option>
                  <option value="Upturned">Upturned</option>
                  <option value="Deep-set">Deep-set</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Eye Color</label>
                <select
                  value={eyeColor}
                  onChange={(e) => setEyeColor(e.target.value as EyeColor)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Deep Dark Brown">Deep Dark Brown</option>
                  <option value="Hazel Golden">Hazel Golden</option>
                  <option value="Warm Amber">Warm Amber</option>
                  <option value="Slate Gray">Slate Gray</option>
                  <option value="Emerald Green">Emerald Green</option>
                  <option value="Sapphire Blue">Sapphire Blue</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Eyebrow</label>
                <select
                  value={eyebrow}
                  onChange={(e) => setEyebrow(e.target.value as EyebrowStyle)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Natural Arched">Natural Arched</option>
                  <option value="Straight Dense">Straight Dense</option>
                  <option value="Soft Feathered">Soft Feathered</option>
                  <option value="Bold Defined">Bold Defined</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Nose Shape</label>
                <select
                  value={noseShape}
                  onChange={(e) => setNoseShape(e.target.value as NoseShape)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Straight Greek">Straight Greek</option>
                  <option value="Subtle Aquiline">Subtle Aquiline</option>
                  <option value="Soft Button">Soft Button</option>
                  <option value="High Bridge Narrow">High Bridge Narrow</option>
                  <option value="Wide Natural">Wide Natural</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Lip Shape</label>
                <select
                  value={lipShape}
                  onChange={(e) => setLipShape(e.target.value as LipShape)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Full Natural">Full Natural</option>
                  <option value="Defined Cupid's Bow">Defined Cupid's Bow</option>
                  <option value="Thin Balanced">Thin Balanced</option>
                  <option value="Soft Rounded">Soft Rounded</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Hair Style</label>
                <select
                  value={hairStyle}
                  onChange={(e) => setHairStyle(e.target.value as HairStyle)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Shoulder-Length Wavy">Shoulder-Length Wavy</option>
                  <option value="Clean Textured Fade Undercut">Clean Textured Fade Undercut</option>
                  <option value="Sleek Obsidian Bob">Sleek Obsidian Bob</option>
                  <option value="Curly Tapered Afro">Curly Tapered Afro</option>
                  <option value="Long Layered">Long Layered</option>
                  <option value="Buzz Cut Clean">Buzz Cut Clean</option>
                  <option value="Braided Crown Updo">Braided Crown Updo</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Hair Color</label>
                <select
                  value={hairColor}
                  onChange={(e) => setHairColor(e.target.value as HairColor)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Obsidian Jet Black">Obsidian Jet Black</option>
                  <option value="Dark Chestnut Brown">Dark Chestnut Brown</option>
                  <option value="Espresso Brown">Espresso Brown</option>
                  <option value="Honey Ash Blonde">Honey Ash Blonde</option>
                  <option value="Copper Auburn">Copper Auburn</option>
                  <option value="Salt and Pepper">Salt and Pepper</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Body Type</label>
                <select
                  value={bodyType}
                  onChange={(e) => setBodyType(e.target.value as BodyType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Athletic Lean">Athletic Lean</option>
                  <option value="Slender Elegant">Slender Elegant</option>
                  <option value="Average Natural">Average Natural</option>
                  <option value="Muscular Broad">Muscular Broad</option>
                  <option value="Curvy Defined">Curvy Defined</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Height</label>
                <input
                  type="text"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="e.g. 172 cm"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 font-medium mb-1">Distinctive Features (Ciri Khas)</label>
                <textarea
                  rows={2}
                  value={distinctiveFeatures}
                  onChange={(e) => setDistinctiveFeatures(e.target.value)}
                  placeholder="Tahi lalat, bentuk tulang pipi, freckles, ekspresi mata..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Character Personality & Style */}
          <div className="bg-[#0C101A] border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              CHARACTER PERSONALITY &amp; STYLE
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Personality</label>
                <input
                  type="text"
                  value={personality}
                  onChange={(e) => setPersonality(e.target.value)}
                  placeholder="e.g. Charismatic, analytical, empathetic"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Profession</label>
                <input
                  type="text"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  placeholder="e.g. Architectural Director, AI Researcher"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Speaking Style</label>
                <input
                  type="text"
                  value={speakingStyle}
                  onChange={(e) => setSpeakingStyle(e.target.value)}
                  placeholder="e.g. Articulate, measured, warm baritone"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Facial Expression</label>
                <input
                  type="text"
                  value={facialExpression}
                  onChange={(e) => setFacialExpression(e.target.value)}
                  placeholder="e.g. Subtle confident smile, direct eye contact"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Body Language</label>
                <input
                  type="text"
                  value={bodyLanguage}
                  onChange={(e) => setBodyLanguage(e.target.value)}
                  placeholder="e.g. Upright posture, relaxed shoulders"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Clothing Style</label>
                <input
                  type="text"
                  value={clothingStyle}
                  onChange={(e) => setClothingStyle(e.target.value)}
                  placeholder="e.g. Minimalist charcoal blazer, tailored silhouette"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Reference Images & Live Anchor */}
        <div className="space-y-6">
          <div className="bg-[#0C101A] border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>REFERENCE IMAGES</span>
              <span className="text-[10px] text-slate-400 font-normal">Wajah &amp; Tubuh</span>
            </h2>

            {/* Face Portrait Slot */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300">
                1. Foto Wajah (Master Face Portrait) <span className="text-rose-400">*</span>
              </label>

              <div className="w-full aspect-square rounded-xl overflow-hidden border border-slate-700 bg-slate-950 relative group">
                <img
                  src={previewAvatar}
                  alt="Portrait Preview"
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3">
                  <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-cyan-400">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, setFacePortrait, 'Foto Wajah')}
                    />
                  </label>

                  {facePortrait && (
                    <button
                      onClick={() => setFacePortrait('')}
                      className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-500"
                      title="Hapus Foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="flex-1 cursor-pointer py-2 px-3 rounded-lg border border-dashed border-slate-700 hover:border-cyan-500 bg-slate-950 text-center text-xs text-slate-400 hover:text-slate-200 transition-colors flex items-center justify-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{facePortrait ? 'Ganti Foto Wajah' : 'Upload Foto Wajah'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, setFacePortrait, 'Foto Wajah')}
                  />
                </label>

                <button
                  type="button"
                  onClick={handleGeneratePortrait}
                  disabled={isGeneratingPortrait}
                  className="py-2 px-3 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-cyan-400 flex items-center gap-1.5 transition-all"
                  title="Generate portrait foto melalui AI Studio"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isGeneratingPortrait ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingPortrait ? 'Generating...' : 'AI Portrait'}</span>
                </button>
              </div>
            </div>

            {/* Full Body Photo Slot */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <label className="block text-xs font-medium text-slate-300">
                2. Foto Seluruh Tubuh (Full Body Reference)
              </label>

              {fullBody ? (
                <div className="relative w-full h-36 rounded-lg overflow-hidden border border-slate-700 group">
                  <img src={fullBody} alt="Full Body" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setFullBody('')}
                    className="absolute top-2 right-2 p-1 rounded bg-rose-600 text-white"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block py-3 px-3 rounded-lg border border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/60 text-center text-xs text-slate-400 hover:text-slate-300 transition-colors">
                  <Upload className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                  <span>Upload Foto Seluruh Tubuh</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, setFullBody, 'Foto Tubuh')}
                  />
                </label>
              )}
            </div>

            {/* Extra Reference Photo Slot */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <label className="block text-xs font-medium text-slate-300">
                3. Foto Referensi Tambahan (Profile / Angles)
              </label>

              {extraReference ? (
                <div className="relative w-full h-28 rounded-lg overflow-hidden border border-slate-700 group">
                  <img src={extraReference} alt="Extra Angle" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setExtraReference('')}
                    className="absolute top-2 right-2 p-1 rounded bg-rose-600 text-white"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block py-3 px-3 rounded-lg border border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/60 text-center text-xs text-slate-400 hover:text-slate-300 transition-colors">
                  <Upload className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                  <span>Upload Angle / Pose Tambahan</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, setExtraReference, 'Foto Tambahan')}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2">
            <button
              onClick={handleCreateDna}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 font-bold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              <Dna className="w-4 h-4 text-cyan-400" />
              <span>CREATE CHARACTER DNA</span>
            </button>

            <button
              onClick={handleGeneratePortrait}
              disabled={isGeneratingPortrait}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-semibold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>GENERATE CHARACTER PORTRAIT</span>
            </button>

            <button
              onClick={handleSaveCharacter}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-400 to-amber-300 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>SAVE CHARACTER</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
