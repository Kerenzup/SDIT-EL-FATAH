import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API Route for Gemini AI Financial Advisor (ISAK 35 Audit & Advisory)
app.post('/api/ai-financial-audit', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        error: 'Kunci API Gemini belum dikonfigurasi di lingkungan server (GEMINI_API_KEY missing).',
      });
    }

    const { reportSummary, question } = req.body;

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
Anda adalah seorang konsultan akuntan publik senior dan auditor independen spesialis entitas berorientasi nonlaba (ISAK 35) di Indonesia untuk Yayasan Pendidikan.

Berikut adalah data ringkasan laporan keuangan Yayasan Pendidikan:
${JSON.stringify(reportSummary, null, 2)}

Pertanyaan/Instruksi dari Pengurus Yayasan:
"${question || 'Berikan analisis kesehatan keuangan yayasan, evaluasi kepatuhan alokasi dana BOS, efisiensi beban SDM, serta rekomendasi strategis untuk tahun depan.'}"

Petunjuk Respon:
1. Analisis rasio likuiditas (Aset Lancar vs Kewajiban Jangka Pendek).
2. Evaluasi porsi Pendapatan Dana BOS dan SPP terhadap Total Pendapatan.
3. Evaluasi proporsi Beban Operasional & SDM terhadap Total Beban.
4. Berikan 3 poin rekomendasi taktis berstandar ISAK 35 dalam Bahasa Indonesia yang profesional, ramah, dan solutif.
5. Gunakan format Markdown yang rapi dengan poin-poin tebal.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return res.json({ result: response.text });
  } catch (err: any) {
    console.error('Gemini API error:', err);
    return res.status(500).json({
      error: 'Gagal memproses analisis AI: ' + (err?.message || 'Internal Server Error'),
    });
  }
});

// Vite middleware for development or Static server for production
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Keuangan Yayasan running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
