
export const runtime = 'nodejs';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const downloadImage = async (url, filepath) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download image: ${res.statusText}`);
  fs.writeFileSync(filepath, Buffer.from(await res.arrayBuffer()));
};

export async function POST(request) {
  try {
    const formData = await request.formData();

    const person    = formData.get('person');     // File — user photo
    const shirtFile = formData.get('shirt');      // File — shirt uploaded by user (ai-tryon page sends 'shirt')

    if (!person || !shirtFile) {
      return Response.json({ error: 'Missing person or shirt image.' }, { status: 400 });
    }

    const tmpDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    const reqId      = `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const personPath = path.join(tmpDir, `person_${reqId}.jpg`);
    const shirtPath  = path.join(tmpDir, `shirt_${reqId}.jpg`);
    const outputPath = path.join(tmpDir, `result_${reqId}.jpg`);

    fs.writeFileSync(personPath, Buffer.from(await person.arrayBuffer()));
    fs.writeFileSync(shirtPath,  Buffer.from(await shirtFile.arrayBuffer()));

    const pythonFile = path.join(
      process.cwd(),
      'app/services/instastyle/virtual-tryon/FEATURE 02 - VIRTUAL TRY/vto_hf.py'
    );

    const py = spawn('python', [pythonFile, personPath, shirtPath, outputPath], {
      env: { ...process.env, HF_TOKEN: process.env.HF_TOKEN || '' },
    });

    let stderr = '';
    py.stderr.on('data', (d) => { stderr += d.toString(); });

    return await new Promise((resolve) => {
      py.on('close', (code) => {
        try { fs.unlinkSync(personPath); } catch {}
        try { fs.unlinkSync(shirtPath);  } catch {}

        if (code !== 0 || !fs.existsSync(outputPath)) {
          console.error('[ai-tryon] python error:', stderr);
          return resolve(Response.json({ error: 'Model failed to generate image.', detail: stderr }, { status: 500 }));
        }

        const image = fs.readFileSync(outputPath);
        try { fs.unlinkSync(outputPath); } catch {}

        resolve(new Response(image, { headers: { 'Content-Type': 'image/jpeg' } }));
      });
    });

  } catch (err) {
    console.error('[ai-tryon] route error:', err);
    return Response.json({ error: 'Server error.', detail: err.message }, { status: 500 });
  }
}