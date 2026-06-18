import { execSync } from 'child_process';
import * as path from 'path';

// Fix for ES Module environment
const scriptPath = path.resolve(process.cwd(), 'scripts/generate-youtube-course.ts');

// Curated list of educational YouTube videos mapped to specific chapters in the database
const dataset = [
    // NDA - Calculus
    { url: 'https://www.youtube.com/watch?v=WUvTyaaNkzM', chapter: 'nda-calc' }, // 3Blue1Brown Calculus intro
    // NDA - Polity
    { url: 'https://www.youtube.com/watch?v=mZ-7T1n_62s', chapter: 'nda-gat-polity' }, // Indian Constitution overview
    // CDS - Modern History
    { url: 'https://www.youtube.com/watch?v=r0X6Xh2xNks', chapter: 'cds-gk-history' }, // Modern History marathon clip
    // CDS - English
    { url: 'https://www.youtube.com/watch?v=bQ0t3K1Htyk', chapter: 'cds-eng-grammar' }, // English grammar rules
    // AFCAT - Time Speed Distance
    { url: 'https://www.youtube.com/watch?v=ZtK0hE8qP4s', chapter: 'afcat-speed' }, // TSD tricks
    // SSB - OIR
    { url: 'https://www.youtube.com/watch?v=1F_t8T-g_1s', chapter: 'ssb-oir' }, // OIR Test tricks
    // SSB - TAT
    { url: 'https://www.youtube.com/watch?v=pDqzBw1n2Hk', chapter: 'ssb-tat' }, // TAT Story writing
    // SSB - Interview
    { url: 'https://www.youtube.com/watch?v=T_W-8nN-S50', chapter: 'ssb-pi' }, // PIQ Form filling
];

console.log(`Starting massive dataset generation for ${dataset.length} topics...`);
console.log(`This will take a few minutes as the AI processes each transcript.\n`);

let successCount = 0;

for (let i = 0; i < dataset.length; i++) {
    const item = dataset[i];
    console.log(`\n======================================================`);
    console.log(`Processing ${i + 1}/${dataset.length}: [Chapter: ${item.chapter}]`);
    console.log(`URL: ${item.url}`);
    console.log(`======================================================`);
    
    try {
        // Run the generation script synchronously for each item to avoid rate limits
        execSync(`npx ts-node "${scriptPath}" "${item.url}" "${item.chapter}"`, { stdio: 'inherit' });
        successCount++;
    } catch (error: any) {
        console.error(`\n❌ Failed to process ${item.url}`);
        console.error(error.message);
        // Continue to the next one even if this one fails
    }
}

console.log(`\n\n🎉 Massive Dataset Generation Complete!`);
console.log(`Successfully generated and inserted ${successCount} out of ${dataset.length} topics.`);
