import React, { useState } from 'react';
import {
  ShieldCheck,
  Upload,
  AlertTriangle,
  CheckCircle,
  FileText,
  Sparkles,
  Info,
  RefreshCw,
  Eye,
  Sliders,
  Check,
  Layers,
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { ConsistencyReport } from '../../types/character';
import { checkConsistencyWithAI } from '../../services/api';

export const ConsistencyCheckerView: React.FC = () => {
  const { activeCharacter, showToast } = useStudio();

  // Images for comparison
  const [masterImage] = useState<string>(activeCharacter.referenceImages.facePortrait);
  const [generatedImage, setGeneratedImage] = useState<string>('');
  const [sceneImage, setSceneImage] = useState<string>('');

  const [isAuditing, setIsAuditing] = useState(false);
  const [report, setReport] = useState<ConsistencyReport | null>(null);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void,
    name: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      showToast('Ukuran foto maksimal 8MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setter(event.target?.result as string);
      showToast(`${name} berhasil dimuat!`, 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleRunAudit = async () => {
    if (!generatedImage) {
      setReport({
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
        detailedFindings:
          'Foto hasil generasi belum diunggah. Unggah "Generated Character Image" untuk membandingkan landmark biometrik wajah.',
        recommendations:
          'Unggah gambar hasil dari Midjourney/Flux yang ingin Anda validasi kemiripannya dengan Master DNA.',
        timestamp: new Date().toISOString(),
      });
      showToast('Status: NEEDS REVIEW (Unggah foto target terlebih dahulu)', 'info');
      return;
    }

    setIsAuditing(true);
    showToast('Memeriksa kesesuaian landmark wajah biometrik via Gemini Multimodal Vision...', 'info');

    const result = await checkConsistencyWithAI(
      masterImage,
      generatedImage,
      activeCharacter.dna
    );

    setIsAuditing(false);
    setReport(result);
    showToast(`Audit Selesai: Status [${result.status}]`, 'success');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              BIOMETRIC CONTINUITY AUDIT
            </span>
            <span className="font-mono text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              Facial Landmark &amp; DNA Verification
            </span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-white mt-1">Character Consistency Checker</h1>
          <p className="text-xs text-slate-400">
            Bandingkan foto referensi asli (Ground Truth) dengan hasil generasi adegan baru untuk mengaudit integritas identitas wajah.
          </p>
        </div>

        <button
          onClick={handleRunAudit}
          disabled={isAuditing}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-pink-600 to-amber-400 hover:brightness-110 active:scale-95 text-slate-950 font-extrabold text-xs shadow-lg shadow-rose-500/20 transition-all self-start sm:self-auto"
        >
          <Sparkles className={`w-4 h-4 ${isAuditing ? 'animate-spin' : ''}`} />
          <span>{isAuditing ? 'Memeriksa Biometrik...' : 'RUN CONSISTENCY AUDIT'}</span>
        </button>
      </div>

      {/* Mandatory Notice Banner */}
      <div className="bg-[#0E131E] border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-amber-300 font-semibold">Standar Verifikasi Biometrik:</strong>{' '}
          Sesuai aturan MUARA Character Studio, jika foto belum diunggah atau landmark belum dapat dihitung secara objektif oleh model komputer visi, status ditampilkan sebagai{' '}
          <span className="font-mono text-amber-400 font-bold bg-amber-950/80 px-1 py-0.5 rounded border border-amber-800/60">
            NEEDS REVIEW
          </span>{' '}
          untuk mencegah estimasi palsu.
        </div>
      </div>

      {/* 3-Column Image Comparison Stage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Slot 1: Master Reference Image */}
        <div className="bg-[#0C101A] border border-cyan-500/40 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              1. MASTER REFERENCE
            </span>
            <span className="text-[10px] font-mono text-slate-400">Ground Truth</span>
          </div>

          <div className="w-full aspect-square rounded-lg overflow-hidden border border-slate-700 bg-slate-950 relative group">
            <img
              src={masterImage}
              alt="Master Reference"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5">
              <span className="text-xs font-bold text-white">{activeCharacter.name}</span>
              <span className="text-[10px] font-mono text-cyan-400">{activeCharacter.dna.characterId}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Foto referensi asli dari Master DNA. Menjadi acuan perbandingan tulang wajah, jarak pupil, dan bentuk bibir.
          </p>
        </div>

        {/* Slot 2: Generated Character Image */}
        <div className="bg-[#0C101A] border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              2. GENERATED IMAGE
            </span>
            <span className="text-[10px] font-mono text-slate-400">Target Audit</span>
          </div>

          <div className="w-full aspect-square rounded-lg overflow-hidden border border-dashed border-slate-700 bg-slate-950 relative flex items-center justify-center">
            {generatedImage ? (
              <>
                <img
                  src={generatedImage}
                  alt="Generated Character"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setGeneratedImage('')}
                  className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 text-slate-300 text-[10px] hover:text-white"
                >
                  Ganti
                </button>
              </>
            ) : (
              <label className="cursor-pointer flex flex-col items-center justify-center p-4 text-center">
                <Upload className="w-6 h-6 text-slate-500 mb-2" />
                <span className="text-xs text-slate-300 font-semibold">Upload Generated Image</span>
                <span className="text-[10px] text-slate-500 mt-0.5">Hasil dari Midjourney / Flux</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, setGeneratedImage, 'Generated Image')}
                />
              </label>
            )}
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Unggah foto hasil generasi prompt baru yang ingin diperiksa apakah wajahnya identik dengan Master DNA.
          </p>
        </div>

        {/* Slot 3: Scene / Video Frame Image */}
        <div className="bg-[#0C101A] border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              3. SCENE / FRAME IMAGE
            </span>
            <span className="text-[10px] font-mono text-slate-400">Multi-Shot</span>
          </div>

          <div className="w-full aspect-square rounded-lg overflow-hidden border border-dashed border-slate-700 bg-slate-950 relative flex items-center justify-center">
            {sceneImage ? (
              <>
                <img src={sceneImage} alt="Scene Frame" className="w-full h-full object-cover" />
                <button
                  onClick={() => setSceneImage('')}
                  className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 text-slate-300 text-[10px] hover:text-white"
                >
                  Ganti
                </button>
              </>
            ) : (
              <label className="cursor-pointer flex flex-col items-center justify-center p-4 text-center">
                <Upload className="w-6 h-6 text-slate-500 mb-2" />
                <span className="text-xs text-slate-300 font-semibold">Upload Scene Frame</span>
                <span className="text-[10px] text-slate-500 mt-0.5">Kling / Runway adegan lanjutan</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, setSceneImage, 'Scene Frame')}
                />
              </label>
            )}
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Opsional: Unggah frame dari video atau adegan kedua untuk memverifikasi kontinuitas antar adegan.
          </p>
        </div>
      </div>

      {/* Audit Report Section */}
      <div className="bg-[#0C101A] border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              LAPORAN HASIL EVALUASI BIOMETRIK
            </h2>
            <span className="text-xs text-slate-400">
              Evaluasi landmark 8 titik anatomi wajah manusia
            </span>
          </div>

          {/* Status Badge */}
          {report ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Status Audit:</span>
              <span
                className={`text-xs font-mono font-bold px-3 py-1 rounded-md border ${
                  report.status === 'VERIFIED'
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60'
                    : report.status === 'ACCEPTABLE'
                    ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/60'
                    : report.status === 'IDENTITY DRIFT'
                    ? 'bg-rose-950/80 text-rose-300 border-rose-500/60'
                    : 'bg-amber-950/80 text-amber-300 border-amber-500/60'
                }`}
              >
                {report.status}
              </span>
              {report.facialSimilarityScore !== null && (
                <span className="font-mono text-sm font-extrabold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  {report.facialSimilarityScore}% Match
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
              Menunggu Pelaksanaan Audit
            </span>
          )}
        </div>

        {/* 8 Biometric Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Face Shape (Bentuk Wajah)', val: report?.metrics.faceShape || 'NEEDS REVIEW' },
            { label: 'Eye Shape & Color (Mata)', val: report?.metrics.eyeShape || 'NEEDS REVIEW' },
            { label: 'Nose Shape (Hidung)', val: report?.metrics.noseShape || 'NEEDS REVIEW' },
            { label: 'Lip Shape (Bibir)', val: report?.metrics.lipShape || 'NEEDS REVIEW' },
            { label: 'Skin Tone & Texture (Kulit)', val: report?.metrics.skinTone || 'NEEDS REVIEW' },
            { label: 'Hair Identity (Rambut)', val: report?.metrics.hairIdentity || 'NEEDS REVIEW' },
            { label: 'Age Consistency (Usia)', val: report?.metrics.ageConsistency || 'NEEDS REVIEW' },
            { label: 'Body Proportion (Tubuh)', val: report?.metrics.bodyProportion || 'NEEDS REVIEW' },
          ].map((item, idx) => {
            const isMatch = item.val.toLowerCase().includes('match') || item.val.toLowerCase().includes('verified');
            const isReview = item.val.includes('NEEDS REVIEW');

            return (
              <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block uppercase font-medium">{item.label}</span>
                <div className="mt-1 flex items-center justify-between">
                  <span
                    className={`text-xs font-bold truncate ${
                      isMatch
                        ? 'text-emerald-400'
                        : isReview
                        ? 'text-amber-300'
                        : 'text-slate-200'
                    }`}
                  >
                    {item.val}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Findings & Recommendations */}
        {report && (
          <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">
                Detailed Biometric Findings:
              </span>
              <p className="text-slate-300 leading-relaxed">{report.detailedFindings}</p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase text-cyan-400 block">
                Prompt Tuning Recommendation:
              </span>
              <p className="text-slate-300 leading-relaxed">{report.recommendations}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
