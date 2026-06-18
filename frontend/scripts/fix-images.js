const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../src/data');

function generateHazySvg(seed, prefix) {
  // Using deterministic pseudo-random based on seed string
  let num = 0;
  for(let i=0; i<seed.length; i++) num += seed.charCodeAt(i);
  
  const i = num % 60;
  const j = (num * 3) % 12;

  let baseColor = prefix === 'tat' ? '#1a1a1a' : '#2a2a2a'; // slightly lighter for PPDT
  
  return `<svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="${prefix}-haze-${i}-${j}" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="12" result="blur" />
          <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0" result="grayscale" />
          <feComponentTransfer>
             <feFuncA type="linear" slope="0.9"/>
          </feComponentTransfer>
        </filter>
        <linearGradient id="${prefix}-bg-${i}-${j}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4a4a4a"/>
          <stop offset="100%" stop-color="${baseColor}"/>
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#${prefix}-bg-${i}-${j})" />
      
      <g filter="url(#${prefix}-haze-${i}-${j})">
        <!-- Background elements (trees/buildings) -->
        <rect x="100" y="200" width="150" height="300" fill="#2d2d2d" opacity="0.6" />
        <rect x="500" y="150" width="200" height="400" fill="#222" opacity="0.7" />
        <path d="M 0 450 Q 400 350 800 500 L 800 600 L 0 600 Z" fill="#111" />
        
        <!-- Foreground figures (ambiguous) -->
        <!-- Figure 1 -->
        <ellipse cx="${300 + (j * 10) % 200}" cy="380" rx="30" ry="40" fill="#000" />
        <rect x="${280 + (j * 10) % 200}" y="400" width="40" height="120" fill="#000" />
        
        <!-- Figure 2 -->
        <ellipse cx="${450 - (i * 5) % 150}" cy="400" rx="25" ry="35" fill="#000" />
        <path d="M ${425 - (i * 5) % 150} 420 L ${475 - (i * 5) % 150} 420 L ${460 - (i * 5) % 150} 550 L ${440 - (i * 5) % 150} 550 Z" fill="#000" />
        
        <!-- Dynamic object based on index -->
        <circle cx="${150 + (i * j * 15) % 500}" cy="${250 + (i * j * 7) % 200}" r="${20 + (j * 5) % 40}" fill="#333" opacity="0.8" />
      </g>
      
      <!-- Grain overlay for psychological texture -->
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
        <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.1 0" />
      </filter>
      <rect width="800" height="600" style="pointer-events:none;" filter="url(#noise)" opacity="0.4" />
    </svg>`;
}

function processObject(obj, prefix) {
  if (Array.isArray(obj)) {
    obj.forEach(item => processObject(item, prefix));
  } else if (obj !== null && typeof obj === 'object') {
    for (let key in obj) {
      if ((key === 'image_url' || key === 'image' || key === 'question_image') && typeof obj[key] === 'string') {
        if (obj[key].includes('.jpg') || obj[key].includes('.png') || obj[key].includes('.jpeg')) {
          obj[key] = generateHazySvg(obj[key], prefix);
        }
      } else {
        processObject(obj[key], prefix);
      }
    }
  }
}

function run() {
  const files = fs.readdirSync(dataDir);
  let totalFixed = 0;

  files.forEach(file => {
    if (file.endsWith('.json')) {
      const filePath = path.join(dataDir, file);
      const prefix = file.includes('tat') ? 'tat' : (file.includes('ppdt') ? 'ppdt' : 'oir');
      
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const originalData = JSON.stringify(data);
        
        processObject(data, prefix);
        
        const newData = JSON.stringify(data, null, 2);
        
        if (originalData !== newData) {
          fs.writeFileSync(filePath, newData, 'utf8');
          console.log(`Fixed missing images in ${file}`);
          totalFixed++;
        }
      } catch (e) {
        console.error(`Error parsing ${file}:`, e);
      }
    }
  });

  console.log(`Done. Fixed ${totalFixed} files.`);
}

run();
