import { NextResponse } from 'next/server';
import { OIR_VERBAL_SETS, OIR_VISUAL_SETS } from '@/lib/oir-manifest';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'verbal';
  let setId = searchParams.get('set');

  try {
    if (type === 'mixed') {
      // Pick a random verbal and visual set
      const verbalSetId = OIR_VERBAL_SETS[Math.floor(Math.random() * OIR_VERBAL_SETS.length)];
      const visualSetId = OIR_VISUAL_SETS[Math.floor(Math.random() * OIR_VISUAL_SETS.length)];

      const verbalPath = path.join(process.cwd(), 'src', 'data', `${verbalSetId}.json`);
      const visualPath = path.join(process.cwd(), 'src', 'data', `${visualSetId}.json`);

      let verbalData = [];
      let visualData = [];

      try { verbalData = JSON.parse(fs.readFileSync(verbalPath, 'utf8')); } catch (e) { console.error("Error reading verbal set", e); }
      try { visualData = JSON.parse(fs.readFileSync(visualPath, 'utf8')); } catch (e) { console.error("Error reading visual set", e); }

      // Get 25 verbal and 25 visual (or whatever is available up to 25)
      const verbalSelected = verbalData.slice(0, 25);
      const visualSelected = visualData.slice(0, 25);

      // Combine and shuffle
      const mixedData = [...verbalSelected, ...visualSelected].sort(() => 0.5 - Math.random());

      return NextResponse.json({
          setId: 'mixed_battery',
          type: 'mixed',
          data: mixedData
      });
    }

    // Default behavior for verbal or visual
    const manifest = type === 'visual' ? OIR_VISUAL_SETS : OIR_VERBAL_SETS;
    if (!manifest || manifest.length === 0) {
      return NextResponse.json({ error: 'No sets found for this type' }, { status: 404 });
    }

    if (!setId || !manifest.includes(setId)) {
       setId = manifest[Math.floor(Math.random() * manifest.length)];
    }
    
    const filePath = path.join(process.cwd(), 'src', 'data', `${setId}.json`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    return NextResponse.json({
        setId,
        type,
        data
    });
  } catch (e: unknown) {
      return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
