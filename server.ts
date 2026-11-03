import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '25mb' }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Health & Config Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'MUARA AI REALISTIC CHARACTER STUDIO',
    hasApiKey: Boolean(apiKey),
    engine: 'Gemini 3.8 Flash & Character DNA Engine',
    timestamp: new Date().toISOString(),
  });
});

// Prompt Optimization / Master DNA Enhancer
app.post('/api/gemini/optimize-prompt', async (req, res) => {
  try {
    const { promptType, characterDna, sceneDescription, parameters } = req.body;

    if (!ai) {
      return res.status(200).json({
        success: false,
        fallback: true,
        message: 'No GEMINI_API_KEY configured. Fallback engine generated prompt.',
      });
    }

    const systemPrompt = `You are the Lead AI Creative Director & Character Continuity Director at MUARA AI REALISTIC CHARACTER STUDIO by Muara Techno Academy.
Your mission is to produce an impeccably photorealistic, industry-grade prompt for Midjourney v6.1, Flux.1 Pro, Kling AI, Runway Gen-3, or Luma Dream Machine.
STRICT RULE: Character Identity Preservation is sacred. Master Character DNA MUST NOT BE ALTERED.
Character Details:
- Name: ${characterDna?.name || 'Subject'}
- Gender: ${characterDna?.gender || 'N/A'}, Age: ${characterDna?.visualAge || 'N/A'}, Ethnicity: ${characterDna?.ethnicity || 'N/A'}
- Skin: ${characterDna?.skinTone || 'N/A'}, Skin Texture: ${characterDna?.skinTexture || 'natural micro-pores, realistic subsurface scattering, no plastic smoothing'}
- Facial Geometry: ${characterDna?.faceGeometry || 'natural bone structure'}, Eyes: ${characterDna?.eyeShape || 'almond'} (${characterDna?.eyeColor || 'brown'})
- Nose: ${characterDna?.noseShape || 'straight'}, Lips: ${characterDna?.lipShape || 'natural'}
- Hair: ${characterDna?.hairStyle || 'styled'} (${characterDna?.hairColor || 'dark'})
- Body & Height: ${characterDna?.bodyType || 'athletic'} (${characterDna?.height || '170cm'})
- Distinctive Features: ${characterDna?.distinctiveFeatures || 'subtle authentic characteristics'}

Task: Generate a pristine, professional ${promptType || 'VISUAL'} prompt in English.
Include Identity Preservation directives, camera lens specifications (e.g. 85mm f/1.4 Leica Summilux), lighting setup, environmental physics, and complete negative prompt.`;

    const userPrompt = `Generate a cinematic prompt for scene: "${sceneDescription || 'Portrait in modern minimalist studio'}".
Additional parameters: ${JSON.stringify(parameters || {})}.
Format response as JSON with:
- "masterPrompt": The comprehensive English prompt ready to paste into Flux/Midjourney/Kling.
- "negativePrompt": Detailed negative prompt preventing identity drift, plastic skin, CGI look, deformities.
- "technicalBreakdown": Key camera, lighting, and consistency tokens.
- "directorsNotes": 1-2 practical production tips in Indonesian for the user.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, ...parsed });
  } catch (error: any) {
    console.error('Error optimizing prompt:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to optimize prompt',
    });
  }
});

// Character Consistency Checker
app.post('/api/gemini/consistency-check', async (req, res) => {
  try {
    const { masterImageBase64, generatedImageBase64, characterDna } = req.body;

    if (!ai) {
      return res.status(200).json({
        success: false,
        status: 'NEEDS REVIEW',
        message: 'Gemini API key is not configured for automatic computer vision evaluation.',
      });
    }

    if (!masterImageBase64 || !generatedImageBase64) {
      return res.status(200).json({
        success: true,
        status: 'NEEDS REVIEW',
        facialSimilarityScore: null,
        message: 'Both reference and target images must be uploaded to compute verifiable facial consistency metrics.',
        evaluationReport: {
          faceShape: 'NEEDS REVIEW',
          eyeShape: 'NEEDS REVIEW',
          noseShape: 'NEEDS REVIEW',
          lipShape: 'NEEDS REVIEW',
          skinTone: 'NEEDS REVIEW',
          hairIdentity: 'NEEDS REVIEW',
          ageConsistency: 'NEEDS REVIEW',
          bodyProportion: 'NEEDS REVIEW',
          recommendation: 'Unggah Master Reference Image dan Generated Image untuk verifikasi landmark wajah secara otomatis.',
        },
      });
    }

    // Extract base64 clean data and mime type
    const parseImage = (dataUri: string) => {
      const matches = dataUri.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        return { mimeType: matches[1], data: matches[2] };
      }
      return { mimeType: 'image/jpeg', data: dataUri };
    };

    const img1 = parseImage(masterImageBase64);
    const img2 = parseImage(generatedImageBase64);

    const promptText = `You are a Senior Computer Vision & Biometric Character Consistency Auditor at MUARA AI REALISTIC CHARACTER STUDIO.
Examine these two images:
Image 1: Master Character DNA Reference Image for ${characterDna?.name || 'Target Character'}.
Image 2: Generated Character Image in a new scene.

Evaluate identity preservation across:
1. Facial Similarity (Estimated similarity percentage 0-100% based on bone structure, inter-pupillary distance, jawline)
2. Face Shape (Match / Minor Deviation / Mismatch)
3. Eye Shape & Color (Match / Deviation / Mismatch)
4. Nose Shape & Bridge (Match / Deviation / Mismatch)
5. Lip Shape & Philtrum (Match / Deviation / Mismatch)
6. Skin Tone & Texture (Natural pores preserved vs over-smoothed / Drift)
7. Hair Identity (Consistent hairline, color, texture)
8. Visual Age Consistency
9. Overall Verdict: "VERIFIED CONSISTENT" (>=85%), "ACCEPTABLE VARIATION" (70-84%), or "IDENTITY DRIFT DETECTED" (<70%).
10. Actionable prompt refinement recommendation in Indonesian.

Return strict JSON:
{
  "status": "VERIFIED" | "ACCEPTABLE" | "IDENTITY DRIFT" | "NEEDS REVIEW",
  "facialSimilarityScore": number,
  "confidence": number,
  "metrics": {
    "faceShape": string,
    "eyeShape": string,
    "noseShape": string,
    "lipShape": string,
    "skinTone": string,
    "hairIdentity": string,
    "ageConsistency": string,
    "bodyProportion": string
  },
  "detailedFindings": string,
  "recommendations": string
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: img1.mimeType, data: img1.data } },
          { inlineData: { mimeType: img2.mimeType, data: img2.data } },
          { text: promptText },
        ],
      },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, ...parsed });
  } catch (error: any) {
    console.error('Error checking consistency:', error);
    return res.status(200).json({
      success: false,
      status: 'NEEDS REVIEW',
      message: error?.message || 'Vision comparison could not be completed.',
      evaluationReport: {
        recommendation: 'Gunakan perbandingan visual manual atau pastikan ukuran foto < 4MB.',
      },
    });
  }
});

// Storyboard Generator
app.post('/api/gemini/generate-storyboard', async (req, res) => {
  try {
    const { title, concept, characterDna, sceneCount, durationPerScene, videoStyle, aspect } = req.body;

    if (!ai) {
      return res.status(200).json({
        success: false,
        message: 'No GEMINI_API_KEY configured. Local template generator used.',
      });
    }

    const count = Number(sceneCount) || 4;

    const promptText = `Generate a ${count}-scene production storyboard for project "${title || 'Untitled'}".
Story Concept: ${concept || 'Cinematic character introduction and demonstration'}
Master Character DNA:
- Name: ${characterDna?.name || 'Character'}
- Ethnicity & Appearance: ${characterDna?.ethnicity || 'Modern professional'}, ${characterDna?.visualAge || '28'} y/o
- Clothing: ${characterDna?.clothingStyle || 'Clean minimalist'}
- Style: ${videoStyle || 'Cinematic Realism'}, Aspect Ratio: ${aspect || '16:9'}
- Duration per scene: ${durationPerScene || '8s'}

CRITICAL CONTINUITY MANDATE:
All scenes must lock and preserve ${characterDna?.name || 'Character'}'s face, skin tone, hair, and physique across every single shot.

Generate JSON array of scenes with exact fields for each scene:
- "sceneNumber": number (1 to ${count})
- "sceneTitle": string
- "duration": string (e.g. "0:00 - 0:08")
- "characterAction": string
- "facialExpression": string
- "cameraAngle": string
- "cameraMovement": string
- "environment": string
- "lighting": string
- "dialogue": string (in Indonesian or English as appropriate)
- "voiceDirection": string
- "visualPrompt": English Flux/Midjourney visual prompt maintaining Master DNA
- "videoPrompt": English Kling/Runway Gen-3 video prompt with camera and lip sync instructions
- "motionPrompt": English motion timeline breakdown
- "audioPrompt": English sound effects & master voice instructions`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              sceneNumber: { type: Type.INTEGER },
              sceneTitle: { type: Type.STRING },
              duration: { type: Type.STRING },
              characterAction: { type: Type.STRING },
              facialExpression: { type: Type.STRING },
              cameraAngle: { type: Type.STRING },
              cameraMovement: { type: Type.STRING },
              environment: { type: Type.STRING },
              lighting: { type: Type.STRING },
              dialogue: { type: Type.STRING },
              voiceDirection: { type: Type.STRING },
              visualPrompt: { type: Type.STRING },
              videoPrompt: { type: Type.STRING },
              motionPrompt: { type: Type.STRING },
              audioPrompt: { type: Type.STRING },
            },
            required: [
              'sceneNumber',
              'sceneTitle',
              'characterAction',
              'visualPrompt',
              'videoPrompt',
              'motionPrompt',
            ],
          },
        },
      },
    });

    const scenes = JSON.parse(response.text || '[]');
    return res.json({ success: true, scenes });
  } catch (error: any) {
    console.error('Error generating storyboard:', error);
    return res.status(500).json({ success: false, error: error?.message });
  }
});

// Image Generation Endpoint (with paid key check / fallback handling)
app.post('/api/gemini/generate-portrait', async (req, res) => {
  try {
    const { prompt, characterDna, aspectRatio } = req.body;

    if (!ai) {
      return res.status(400).json({
        success: false,
        error: 'API key is not configured.',
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: prompt || `Ultra photorealistic studio headshot of ${characterDna?.name || 'a person'}, 85mm portrait lens, pristine natural skin texture, studio lighting.`,
        config: {
          // imageConfig
        },
      });

      // Check if image data is in response parts
      const candidate = response.candidates?.[0];
      const parts = candidate?.content?.parts || [];
      const imagePart = parts.find((p: any) => p.inlineData && p.inlineData.mimeType?.startsWith('image/'));

      if (imagePart?.inlineData) {
        return res.json({
          success: true,
          imageBase64: `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`,
        });
      }

      return res.json({
        success: false,
        message: 'No image bytes returned by model. Use generated master visual prompt in Midjourney or Flux.',
      });
    } catch (modelErr: any) {
      return res.status(200).json({
        success: false,
        isQuotaOrPaid: modelErr?.message?.includes('RESOURCE_EXHAUSTED') || modelErr?.message?.includes('quota'),
        message: modelErr?.message || 'Image model requires paid quota. Fallback prompt ready for external generators.',
      });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

// Setup Vite or static serving
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`MUARA AI Studio server running on port ${port} (mode: ${isDev ? 'development' : 'production'})`);
  });
}

startServer();
