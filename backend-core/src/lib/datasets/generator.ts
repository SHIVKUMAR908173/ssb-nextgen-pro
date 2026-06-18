export const datasetGenerator = {
  /**
   * Generates missing TAT images using pollinations.ai 
   */
  generateMissingTat(count: number, startIndex: number): { prompt_text: string; image_url: string }[] {
    const prompts = [
      'person at shop counter buying supplies for relief distribution',
      'HR manager resolving dispute in factory setting',
      'young woman teaching children in village school',
      'group using boat during flood rescue operation',
      'person organizing sports event coaching youth',
      'doctor treating patients in rural health camp',
      'soldier standing near barbed wire fence at dawn',
      'person standing at crossroads with different paths',
      'person planting trees in barren landscape',
      'group of students around campfire during NCC camp',
      'elderly person sitting alone on park bench',
      'group of farmers looking at dried up well',
      'young person studying late at night under street lamp',
      'two individuals arguing near parked car with dent',
      'person addressing crowd holding placards in town square',
    ];

    const results = [];
    for (let i = 0; i < count; i++) {
      const idx = (startIndex + i) % prompts.length;
      const prompt = prompts[idx]!;
      results.push({
        prompt_text: prompt,
        image_url: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}%20realistic%20sketch%20style%20black%20and%20white%20military%20psychology%20test?width=800&height=600&nologo=true`
      });
    }
    return results;
  },

  /**
   * Generates missing WAT words
   */
  generateMissingWat(count: number): string[] {
    const fallbackWords = ["ACTION", "BRAVE", "COUNTRY", "DUTY", "ENERGY", "FEAR", "GOAL", "HONESTY", "INITIATIVE", "JOY", "KNOWLEDGE", "LEADER", "MOTIVE", "NATION", "OBEY", "POWER", "QUICK", "RESPECT", "SUCCESS", "TRUTH"];
    const results = [];
    for (let i = 0; i < count; i++) {
      results.push(fallbackWords[i % fallbackWords.length]!);
    }
    return results;
  },

  /**
   * Generates missing SRT situations
   */
  generateMissingSrt(count: number): string[] {
    const fallbackSituations = [
      "You see a house on fire in your neighborhood.",
      "Your friend meets with an accident while you are traveling together.",
      "You find a lost wallet containing a large sum of money and ID cards.",
      "You are traveling by train and notice a suspicious unattended bag.",
      "You are assigned a difficult task with a very tight deadline."
    ];
    const results = [];
    for (let i = 0; i < count; i++) {
      results.push(fallbackSituations[i % fallbackSituations.length]!);
    }
    return results;
  }
};
