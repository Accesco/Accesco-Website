export const runtime = 'nodejs';
import { spawn, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Find the right python command for the current platform (Windows: python, python3; Unix: python3)
function findPython() {
  const candidates = ['python', 'python3', 'py'];
  for (const cmd of candidates) {
    try {
      execSync(`${cmd} --version`, { stdio: 'pipe' });
      return cmd;
    } catch {
      // try next
    }
  }
  return null;
}

export async function POST(request) {
  try {
    const formData = await request.formData();

    const person    = formData.get('person');     // File — user photo
    const shirtFile = formData.get('shirt');      // File — garment image

    if (!person || !shirtFile) {
      return Response.json({ error: 'Missing person or garment image.' }, { status: 400 });
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

    // Verify the python script exists
    if (!fs.existsSync(pythonFile)) {
      return Response.json({ error: 'Virtual try-on model script not found on server.' }, { status: 500 });
    }

    // Find Python executable
    const pythonCmd = findPython();
    if (!pythonCmd) {
      try { fs.unlinkSync(personPath); } catch {}
      try { fs.unlinkSync(shirtPath); } catch {}
      return Response.json({
        error: 'Python is not installed or not found in PATH. Please install Python 3 and the required dependencies.',
      }, { status: 500 });
    }

    const py = spawn(pythonCmd, [pythonFile, personPath, shirtPath, outputPath], {
      env: { ...process.env, HF_TOKEN: process.env.HF_TOKEN || '' },
    });

    let stderr = '';
    let stdout = '';
    py.stderr.on('data', (d) => { stderr += d.toString(); });
    py.stdout.on('data', (d) => { stdout += d.toString(); });

    return await new Promise((resolve) => {
      // Timeout after 6 minutes (IDM-VTON cold start can take 120+ seconds)
      const timeout = setTimeout(() => {
        try { py.kill('SIGTERM'); } catch {}
        try { fs.unlinkSync(personPath); } catch {}
        try { fs.unlinkSync(shirtPath); } catch {}
        resolve(Response.json({
          error: 'Virtual try-on timed out. The model may be waking up — please try again in 1–2 minutes.',
        }, { status: 504 }));
      }, 6 * 60 * 1000);

      // Handle spawn errors (e.g. python not found at runtime)
      py.on('error', (err) => {
        clearTimeout(timeout);
        try { fs.unlinkSync(personPath); } catch {}
        try { fs.unlinkSync(shirtPath); } catch {}
        resolve(Response.json({
          error: `Could not start Python: ${err.message}. Make sure Python 3 is installed and accessible.`,
        }, { status: 500 }));
      });

      py.on('close', (code) => {
        clearTimeout(timeout);
        try { fs.unlinkSync(personPath); } catch {}
        try { fs.unlinkSync(shirtPath); } catch {}

        const combined = (stdout + '\n' + stderr).toLowerCase();

        if (code !== 0 || !fs.existsSync(outputPath)) {
          console.error('[vto] python exit code:', code);
          console.error('[vto] stdout:', stdout.slice(0, 800));
          console.error('[vto] stderr:', stderr.slice(0, 800));

          // Parse meaningful errors from vto_hf.py log output
          let errMsg = 'Virtual try-on generation failed. Please try again.';

          if (combined.includes('modulenot') || combined.includes('no module named')) {
            errMsg = 'Missing Python dependencies. Run: pip install gradio_client pillow pillow-heif pillow-avif-plugin';
          } else if (combined.includes('hf_token') || combined.includes('401') || combined.includes('unauthorized')) {
            errMsg = 'Hugging Face authentication failed. Set HF_TOKEN in your environment.';
          } else if (combined.includes('timeout') || combined.includes('timed out')) {
            errMsg = 'Model request timed out. The IDM-VTON space may be busy — please try again.';
          } else if (combined.includes('space is sleeping') || combined.includes('space is starting')) {
            errMsg = 'The try-on model is waking up. Please wait 30 seconds and try again.';
          } else if (combined.includes('503') || combined.includes('unavailable')) {
            errMsg = 'The virtual try-on service is temporarily unavailable. Please try again shortly.';
          } else if (combined.includes('fatal:')) {
            // Extract [vto:*] FATAL: message from the Python log
            const fatalMatch = (stdout + '\n' + stderr).match(/\[vto:[^\]]+\] FATAL: (.+)/);
            if (fatalMatch) errMsg = fatalMatch[1].trim();
          } else if (combined.includes('connectio') || combined.includes('network')) {
            errMsg = 'Network error reaching the model service. Check your internet connection.';
          }

          return resolve(Response.json({ error: errMsg }, { status: 500 }));
        }

        const image = fs.readFileSync(outputPath);
        try { fs.unlinkSync(outputPath); } catch {}

        resolve(new Response(image, { headers: { 'Content-Type': 'image/jpeg' } }));
      });
    });

  } catch (err) {
    console.error('[vto] route error:', err);
    return Response.json({ error: `Server error: ${err.message}` }, { status: 500 });
  }
}