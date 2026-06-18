const fs = require('fs');

// TAT injection
const tatPath = 'src/data/tat_60_sets.json';
const tatData = JSON.parse(fs.readFileSync(tatPath, 'utf8'));

const tatAssets = [
  '/assets/tat/tat-0001.jpg',
  '/assets/tat/tat-0002.jpg',
  '/assets/tat/tat-0003.jpg',
  '/assets/tat/tat-0004.jpg',
  '/assets/tat/tat-0005.jpg',
  '/assets/tat/tat-0006.png'
];

for (let i = 0; i < Math.min(tatAssets.length, tatData.sets[0].scenarios.length); i++) {
  tatData.sets[0].scenarios[i].image_url = tatAssets[i];
}

fs.writeFileSync(tatPath, JSON.stringify(tatData, null, 2));
console.log('Injected TAT assets into Set 1');


// PPDT injection
const ppdtPath = 'src/data/ppdt_60_sets.json';
const ppdtData = JSON.parse(fs.readFileSync(ppdtPath, 'utf8'));

const ppdtAssets = [
  '/assets/ppdt/ppdt-0001.png',
  '/assets/ppdt/ppdt-0002.png',
  '/assets/ppdt/ppdt-0003.png'
];

for (let i = 0; i < Math.min(ppdtAssets.length, ppdtData.sets.length); i++) {
  ppdtData.sets[i].images[0].image_url = ppdtAssets[i];
}

fs.writeFileSync(ppdtPath, JSON.stringify(ppdtData, null, 2));
console.log('Injected PPDT assets into Sets 1-3');
