const PPDT_LOCAL_ASSETS = [
  '/assets/ppdt/ppdt-0001.png',
  '/assets/ppdt/ppdt-0002.png',
  '/assets/ppdt/ppdt-0003.png',
] as const;

const TAT_LOCAL_ASSETS = [
  '/assets/tat/tat-0001.jpg',
  '/assets/tat/tat-0002.jpg',
  '/assets/tat/tat-0003.jpg',
  '/assets/tat/tat-0004.jpg',
  '/assets/tat/tat-0005.jpg',
  '/assets/tat/tat-0006.png',
] as const;

function pickCyclicAsset(assets: readonly string[], index: number): string {
  if (assets.length === 0) return '';
  const normalizedIndex = Math.abs(index) % assets.length;
  return assets[normalizedIndex];
}

export function resolvePPDTImage(index: number): string {
  return pickCyclicAsset(PPDT_LOCAL_ASSETS, index);
}

export function resolveTATImage(setIndex: number, slideIndex: number): string {
  const flatIndex = setIndex * 12 + slideIndex;
  return pickCyclicAsset(TAT_LOCAL_ASSETS, flatIndex);
}

export const PPDT_ASSETS = PPDT_LOCAL_ASSETS;
export const TAT_ASSETS = TAT_LOCAL_ASSETS;
