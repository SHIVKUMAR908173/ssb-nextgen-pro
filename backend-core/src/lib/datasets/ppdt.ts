export type PPDTItem = {
  id: string;
  prompt: string;

  /**
   * Asset path served by this project (relative to repo root under /assets).
   * Example: "assets/ppdt/ppdt-0001.jpg"
   */
  imagePath: string;

  /**
   * Optional provenance tag so you can later trace back to the original open/public dataset.
   */
  imageSet?: string;

  storyTemplate: string;
};

/**
 * Sources for PPDT images:
 * - SSB Arena (ssbarena.github.io): 30+ free sets with 12 hazy images each (336 total)
 * - Centurion Defence Academy: 50 curated PPDT hazy pictures
 * 
 * Use `npm run download:ssbarena` to fetch images from SSB Arena GitHub repository.
 * Attribution required for all sources.
 */
export function buildPPDTDatasetStub(): PPDTItem[] {
  // Integrated from free sources: ssbarena.github.io (primary) + Centurion Defence Academy
  // Total: 386 images (336 from SSB Arena + 50 from Centurion)
  const items: PPDTItem[] = [];
  
  // SSB Arena sets (28 sets × 12 images = 336 images)
  for (let set = 1; set <= 28; set++) {
    for (let pic = 1; pic <= 12; pic++) {
      const id = `ppdt-${String((set - 1) * 12 + pic).padStart(4, "0")}`;
      items.push({
        id,
        prompt: `PPDT Hazy Picture ${id}: Indistinct scene with human figures and objects requiring perception and interpretation.`,
        imageSet: `ssbarena-ppdt-set-${set}`,
        imagePath: `assets/ppdt/${id}.jpg`,
        storyTemplate:
          "Write: (1) Your observation of the picture, (2) What led to this situation, (3) What is happening now, (4) What will happen next."
      });
    }
  }
  
  // Centurion Defence Academy set (50 images)
  for (let i = 1; i <= 50; i++) {
    const id = `ppdt-${String(336 + i).padStart(4, "0")}`;
    items.push({
      id,
      prompt: `PPDT Hazy Picture ${id}: Indistinct scene with human figures and objects requiring perception and interpretation.`,
      imageSet: "centurion-defence-academy",
      imagePath: `assets/ppdt/${id}.jpg`,
      storyTemplate:
        "Write: (1) Your observation of the picture, (2) What led to this situation, (3) What is happening now, (4) What will happen next."
    });
  }
  
  return items;
}

export type PPDTAssetManifest = {
  datasetId: "ppdt_assets_manifest";
  version: "0.1.0";
  items: Array<{
    id: string;
    imagePath: string;
    imageSet?: string;
  }>;
};

export function buildPPDTAssetManifestStub(): PPDTAssetManifest {
  return {
    datasetId: "ppdt_assets_manifest",
    version: "0.1.0",
    items: [
      {
        id: "ppdt-0001",
        imageSet: "open-repository-stub",
        imagePath: "assets/ppdt/ppdt-0001.jpg"
      }
    ]
  };
}
