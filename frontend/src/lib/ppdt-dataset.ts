import ppdtData from '@/data/ppdt_60_sets.json';

interface PpdtImage {
  image_url: string;
}

interface PpdtSet {
  set_id: string | number;
  images: PpdtImage[];
}

export const PPDT_SETS = {
  sets: (ppdtData.sets as PpdtSet[]).map((set) => ({
    setId: set.set_id,
    images: set.images.map((img) => ({
      image_url: img.image_url,
      isBlank: false
    }))
  }))
};
