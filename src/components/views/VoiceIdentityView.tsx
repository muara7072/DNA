import React, { useState, useEffect } from 'react';
import {
  Mic,
  Play,
  Pause,
  Download,
  Copy,
  Check,
  Save,
  Sparkles,
  Volume2,
  Sliders,
  AudioWaveform,
  VolumeX,
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { VoicePromptParams } from '../../types/character';
import { buildVoicePrompt } from '../../utils/promptGenerators';

export const VoiceIdentityView: React.FC = () => {
  const {
    activeCharacter,
    characters,
    setActiveCharacterId,
    savePrompt,
    showToast,
    setActivePreviewPrompt,
  } = useStudio();

  // Voice DNA Parameters
  const [voiceName, setVoiceName] = useState(
    activeCharacter.dna.voiceIdentity?.voiceName || `${activeCharacter.name} Master Voice`
  );
  const [gender, setGender] = useState(activeCharacter.dna.gender);
  const [voiceAge, setVoiceAge] = useState(activeCharacter.dna.visualAge);
  const [language, setLanguage] = useState(activeCharacter.dna.voiceIdentity?.language || 'Bahasa Indonesia');
  const [accent, setAccent] = useState(activeCharacter.dna.voiceIdentity?.accent || 'Neutral Jakarta Contemporary');
  const [vocalDepth, setVocalDepth] = useState(activeCharacter.dna.voiceIdentity?.vocalDepth || 'Warm Alto');
  const [tone, setTone] = useState(activeCharacter.dna.voiceIdentity?.tone || 'Warm, articulate, confident');
  const [speakingSpeed, setSpeakingSpeed] = useState(activeCharacter.dna.voiceIdentity?.speakingSpeed || 'Natural 1.0x');
  const [emotionalStyle, setEmotionalStyle] = useState(activeCharacter.dna.voiceIdentity?.emotionalStyle || 'Calm Confidence');
  const [pronunciationStyle, setPronunciationStyle] = useState('Articulate Standard');
  const [voiceStyle, setVisualStyle] = useState('Professional Presenter');

  // Dialogue script input
  const [dialogueText, setDialogueText] = useState(
    'Selamat datang di Muara AI Realistic Character Studio. Kami memastikan identitas visual, karakter, dan suara Anda tetap konsisten di setiap produksi.'
  );

  // Audio Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync when character changes
  useEffect(() => {
    if (activeCharacter.dna.voiceIdentity) {
      setVoiceName(activeCharacter.dna.voiceIdentity.voiceName);
      setGender(activeCharacter.dna.gender);
      setVoiceAge(activeCharacter.dna.visualAge);
      setVocalDepth(activeCharacter.dna.voiceIdentity.vocalDepth);
      setTone(activeCharacter.dna.voiceIdentity.tone);
      setSpeakingSpeed(activeCharacter.dna.voiceIdentity.speakingSpeed);
      setEmotionalStyle(activeCharacter.dna.voiceIdentity.emotionalStyle);
      setLanguage(activeCharacter.dna.voiceIdentity.language);
      setAccent(activeCharacter.dna.voiceIdentity.accent);
    }
  }, [activeCharacter.id]);

  const output = buildVoicePrompt(activeCharacter.dna, {
    voiceName,
    gender,
    voiceAge,
    language,
    accent,
    vocalDepth,
    tone,
    speakingSpeed,
    emotionalStyle,
    pronunciationStyle,
    voiceStyle,
    dialogueText,
  });

  useEffect(() => {
    setActivePreviewPrompt({
      title: `VOICE DNA · ${voiceName}`,
      prompt: output.voiceGenPrompt,
      type: 'VOICE',
    });
  }, [output.voiceGenPrompt, voiceName]);

  // Real TTS Playback using Web Speech API
  const handlePlayAudio = () => {
    if (!('speechSynthesis' in window)) {
      showToast('Browser Anda belum mendukung Web Speech API', 'error');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel(); // clear queue
    const utterance = new SpeechSynthesisUtterance(dialogueText);

    // Tune pitch according to vocal depth
    if (vocalDepth.includes('Deep') || vocalDepth.includes('Bass')) {
      utterance.pitch = 0.8;
    } else if (vocalDepth.includes('Tenor') || vocalDepth.includes('Alto')) {
      utterance.pitch = 1.0;
    } else {
      utterance.pitch = 1.2;
    }

    // Tune rate
    if (speakingSpeed.includes('0.8')) utterance.rate = 0.85;
    else if (speakingSpeed.includes('1.1')) utterance.rate = 1.15;
    else utterance.rate = 1.0;

    // Detect language
    if (language.includes('Indonesia')) {
      utterance.lang = 'id-ID';
    } else {
      utterance.lang = 'en-US';
    }

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
    showToast(`Memutar audio Text-to-Speech (${utterance.lang})...`, 'info');
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(output.voiceGenPrompt);
    setCopied(true);
    showToast('Voice prompt disalin ke clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToLibrary = () => {
    savePrompt({
      characterId: activeCharacter.id,
      characterName: activeCharacter.name,
      promptType: 'VOICE',
      title: `${voiceStyle} - ${voiceName}`,
      masterPrompt: output.voiceGenPrompt,
      tags: ['Voice', voiceStyle, language],
    });
  };

  const handleDownloadScript = () => {
    const content = `MUARA AI REALISTIC CHARACTER STUDIO
MASTER VOICE DNA & DIALOGUE PRODUCTION SPECIFICATION
Character: ${activeCharacter.name} | Voice Persona: ${voiceName}

--- MASTER VOICE PROFILE ---
${output.voiceDescription}

--- ELEVENLABS / GEMINI TTS PERSONA PROMPT ---
${output.voiceGenPrompt}

--- ENRICHED SCRIPT WITH PROSODY & EMOTIONS ---
${output.markedScript}

--- PRODUCTION DIRECTIVES ---
${output.productionNotes.join('\n')}
`;
    const dataStr = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${voiceName.toLowerCase().replace(/\s+/g, '_')}_voice_spec.txt`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Spesifikasi audio diunduh (TXT)', 'info');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              MASTER VOICE DNA STUDIO
            </span>
            <span className="font-mono text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              ElevenLabs &amp; Gemini TTS Multilingual v2
            </span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-white mt-1">Voice Identity Generator</h1>
          <p className="text-xs text-slate-400">
            Ciptakan identitas vokal unik dengan parameter kedalaman akustik, tempo, emosi, dan sintesis audio Bahasa Indonesia yang konsisten.
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
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Voice DNA Form */}
          <div className="bg-[#0C101A] border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <Mic className="w-4 h-4 text-emerald-400" />
              <span>PARAMETER MASTER VOICE DNA</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Voice Name</label>
                <input
                  type="text"
                  value={voiceName}
                  onChange={(e) => setVoiceName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Voice Style (Archetype)</label>
                <select
                  value={voiceStyle}
                  onChange={(e) => setVisualStyle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Professional Presenter">Professional Presenter</option>
                  <option value="Friendly Mentor">Friendly Mentor</option>
                  <option value="Corporate Executive">Corporate Executive</option>
                  <option value="Documentary Narrator">Documentary Narrator</option>
                  <option value="Educational Teacher">Educational Teacher</option>
                  <option value="Cinematic Storyteller">Cinematic Storyteller</option>
                  <option value="Casual Conversation">Casual Conversation</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                  <option value="English (US)">English (US)</option>
                  <option value="English (UK)">English (UK)</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Bilingual ID-EN">Bilingual (ID &amp; EN)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Accent</label>
                <input
                  type="text"
                  value={accent}
                  onChange={(e) => setAccent(e.target.value)}
                  placeholder="e.g. Neutral Jakarta Contemporary"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Vocal Depth (Pitch)</label>
                <select
                  value={vocalDepth}
                  onChange={(e) => setVocalDepth(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Deep Bass-Baritone">Deep Bass-Baritone</option>
                  <option value="Deep Baritone">Deep Baritone</option>
                  <option value="Rich Tenor">Rich Tenor</option>
                  <option value="Warm Alto">Warm Alto</option>
                  <option value="Crisp Mezzo-Soprano">Crisp Mezzo-Soprano</option>
                  <option value="Warm Soprano">Warm Soprano</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Speaking Speed (Tempo)</label>
                <select
                  value={speakingSpeed}
                  onChange={(e) => setSpeakingSpeed(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Slow Measured 0.85x">Slow &amp; Measured (0.85x)</option>
                  <option value="Natural 1.0x">Natural Conversational (1.0x)</option>
                  <option value="Dynamic Fast 1.15x">Dynamic &amp; Fast (1.15x)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Tone &amp; Timbre</label>
                <input
                  type="text"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  placeholder="e.g. Warm, articulate, resonant"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Emotional Style</label>
                <input
                  type="text"
                  value={emotionalStyle}
                  onChange={(e) => setEmotionalStyle(e.target.value)}
                  placeholder="e.g. Calm Confidence, Inspiring"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Dialogue Text Input */}
          <div className="bg-[#0C101A] border border-slate-800 rounded-xl p-5 space-y-3 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              INPUT NARASI &amp; DIALOG (TTS READY)
            </h2>

            <div>
              <label className="block text-xs text-slate-400 font-medium mb-1">
                Masukkan teks narasi yang akan disuarakan:
              </label>
              <textarea
                rows={3}
                value={dialogueText}
                onChange={(e) => setDialogueText(e.target.value)}
                placeholder="Ketik naskah pidato, promosi, atau dialog adegan..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-100 text-xs focus:outline-none focus:border-cyan-500 resize-none leading-relaxed"
              />
            </div>

            {/* In-Browser Audio Player Bar */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePlayAudio}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isPlaying
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                  }`}
                  title={isPlaying ? 'Hentikan Audio' : 'Putar Audio'}
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>

                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>{isPlaying ? 'Memutar Audio Synthesis...' : 'Audio Preview Ready'}</span>
                    {isPlaying && (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 rounded border border-emerald-800">
                        TTS LIVE
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {language} · {vocalDepth} · {speakingSpeed}
                  </div>
                </div>
              </div>

              {/* Fake Audio Equalizer Waves */}
              <div className="hidden sm:flex items-center gap-1">
                {[4, 12, 8, 16, 20, 14, 22, 10, 18, 6, 14, 8].map((h, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-200 ${
                      isPlaying ? 'bg-emerald-400' : 'bg-slate-700'
                    }`}
                    style={{
                      height: isPlaying ? `${Math.max(4, (h * (i % 2 === 0 ? 1.2 : 0.8)))}px` : '4px',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Box (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0C101A] border border-emerald-500/30 rounded-xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
                  VOICE GENERATION SPECIFICATION
                </span>
                <h3 className="text-sm font-bold text-white">Master Voice Persona Prompt</h3>
              </div>

              <span className="text-[10px] font-mono bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-emerald-300">
                Studio Ready
              </span>
            </div>

            {/* Voice Description */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 block">Master Voice Description:</span>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-200 leading-relaxed">
                {output.voiceDescription}
              </div>
            </div>

            {/* Persona Generation Prompt */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 block">
                ElevenLabs / Voice Engine Prompt:
              </span>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-emerald-300 leading-relaxed whitespace-pre-wrap select-text max-h-48 overflow-y-auto">
                {output.voiceGenPrompt}
              </div>
            </div>

            {/* Prosody Marked Script */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 block">
                Enriched Script with Prosody &amp; Emotion:
              </span>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 leading-relaxed select-text max-h-36 overflow-y-auto">
                {output.markedScript}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
              <button
                onClick={handleCopyPrompt}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-emerald-500/10"
              >
                {copied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Tersalin!' : 'Copy Voice Prompt'}</span>
              </button>

              <button
                onClick={handleSaveToLibrary}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-emerald-400 transition-colors"
                title="Simpan ke Prompt Library"
              >
                <Save className="w-4 h-4" />
              </button>

              <button
                onClick={handleDownloadScript}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-emerald-400 transition-colors"
                title="Download Specification TXT"
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
