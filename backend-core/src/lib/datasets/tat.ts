export type TATItem = {
  id: string;
  prompt: string;

  /**
   * Asset path served by this project (relative to repo root under /assets).
   * Example: "assets/tat/tat-0001.jpg"
   */
  imagePath: string;

  /**
   * Optional provenance tag so you can later trace back to the original open/public dataset.
   */
  imageSet?: string;

  storyTemplate: string;
};

/**
 * Sources for TAT images:
 * - SSB Arena (ssbarena.github.io): 30+ free sets with 12 images each (336 total)
 * - Centurion Defence Academy: 50 curated TAT pictures
 * - PsychoDrill (GitHub): Open-source TAT images with model answers
 * 
 * Use `npm run download:ssbarena` to fetch images from SSB Arena GitHub repository.
 * Attribution required for all sources.
 */
export function buildTATDatasetStub(): TATItem[] {
  // Integrated from free sources: ssbarena.github.io (primary) + Centurion Defence Academy
  // Total: 386 images (336 from SSB Arena + 50 from Centurion)
  const items: TATItem[] = [];
  
  // SSB Arena sets (28 sets × 12 images = 336 images)
  for (let set = 1; set <= 28; set++) {
    for (let pic = 1; pic <= 12; pic++) {
      const id = `tat-${String((set - 1) * 12 + pic).padStart(4, "0")}`;
      items.push({
        id,
        prompt: `TAT Picture ${id}: Ambiguous scene depicting human figures in various situations.`,
        imageSet: `ssbarena-set-${set}`,
        imagePath: `assets/tat/${id}.jpg`,
        storyTemplate:
          "Write a story describing: (1) What led to this situation, (2) What is happening now, (3) What the characters are thinking/feeling, (4) What will happen next."
      });
    }
  }
  
  // Centurion Defence Academy set (50 images)
  for (let i = 1; i <= 50; i++) {
    const id = `tat-${String(336 + i).padStart(4, "0")}`;
    items.push({
      id,
      prompt: `TAT Picture ${id}: Ambiguous scene depicting human figures in various situations.`,
      imageSet: "centurion-defence-academy",
      imagePath: `assets/tat/${id}.jpg`,
      storyTemplate:
        "Write a story describing: (1) What led to this situation, (2) What is happening now, (3) What the characters are thinking/feeling, (4) What will happen next."
    });
  }
  
  return items;
}

export type TATAssetManifest = {
  datasetId: "tat_assets_manifest";
  version: "0.1.0";
  items: Array<{
    id: string;
    imagePath: string;
    imageSet?: string;
  }>;
};

export function buildTATAssetManifestStub(): TATAssetManifest {
  return {
    datasetId: "tat_assets_manifest",
    version: "0.1.0",
    items: [
      {
        id: "tat-0001",
        imageSet: "open-repository-stub",
        imagePath: "assets/tat/tat-0001.jpg"
      }
    ]
  };
}
