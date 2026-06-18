const fs = require('fs');
const files = fs.readdirSync('src/data').filter(f => f.startsWith('oir_'));
const verbal = files.filter(f => f.includes('verbal')).map(f => f.replace('.json', ''));
const visual = files.filter(f => f.includes('visual')).map(f => f.replace('.json', ''));

const content = `export const OIR_VERBAL_SETS = ${JSON.stringify(verbal, null, 2)};\nexport const OIR_VISUAL_SETS = ${JSON.stringify(visual, null, 2)};\n`;
fs.writeFileSync('src/lib/oir-manifest.ts', content);
console.log('Manifest generated with ' + verbal.length + ' verbal and ' + visual.length + ' visual sets.');
