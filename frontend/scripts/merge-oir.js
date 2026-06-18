const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../src/data');
const files = fs.readdirSync(dataDir).filter(f => f.startsWith('oir_'));

const fragments = files.filter(f => f.match(/_\d+_\d+\.json$/));

// Group fragments by base name
const groups = {};
fragments.forEach(f => {
  const match = f.match(/^(oir_set\d+_(visual|verbal))_\d+_\d+\.json$/);
  if (match) {
    const base = match[1];
    if (!groups[base]) groups[base] = [];
    groups[base].push(f);
  }
});

for (const [base, fragmentFiles] of Object.entries(groups)) {
  let mergedArray = [];
  let success = true;
  for (const f of fragmentFiles) {
    try {
      const content = fs.readFileSync(path.join(dataDir, f), 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        mergedArray = mergedArray.concat(parsed);
      }
    } catch (e) {
      console.error(`Error parsing ${f}:`, e.message);
      success = false;
    }
  }

  if (success && mergedArray.length > 0) {
    const outName = `${base}.json`;
    fs.writeFileSync(path.join(dataDir, outName), JSON.stringify(mergedArray, null, 2));
    console.log(`Merged ${fragmentFiles.length} fragments into ${outName} (${mergedArray.length} items)`);
    
    // Delete fragments
    for (const f of fragmentFiles) {
      fs.unlinkSync(path.join(dataDir, f));
    }
  }
}
console.log('Merging complete.');
