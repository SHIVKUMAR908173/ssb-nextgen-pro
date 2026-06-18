import tatData from '@/data/tat_60_sets.json';

interface TatScenario {
  image_url: string;
}

interface TatSet {
  set_id: string | number;
  scenarios: TatScenario[];
}

export const TAT_SETS = (tatData.sets as TatSet[]).map((set) => ({
  setId: set.set_id,
  images: set.scenarios.map((scenario) => ({
    url: scenario.image_url,
    isBlank: false
  })).concat([{ url: "", isBlank: true }])
}));
