const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'src/data');
const files = fs.readdirSync(dataDir).filter(f => f.startsWith('oir_set') && f.endsWith('_visual.json'));

let masterPool = [];

// 1. Gather all existing questions from all visual sets to form a master pool
files.forEach(f => {
  const data = JSON.parse(fs.readFileSync(path.join(dataDir, f), 'utf8'));
  const questions = Array.isArray(data) ? data : (data.questions ? data.questions : []);
  
  questions.forEach(q => {
    // Basic validation
    if (q && q.question_text && q.options) {
      masterPool.push(JSON.parse(JSON.stringify(q)));
    }
  });
});

console.log('Total questions in master pool:', masterPool.length);

if (masterPool.length === 0) {
  console.error("No valid questions found to draw from.");
  process.exit(1);
}

// Helper to shuffle array
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

// 2. Fill the under-filled sets
let underFilledCount = 0;
files.forEach(f => {
  const filePath = path.join(dataDir, f);
  let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let questions = Array.isArray(data) ? data : (data.questions ? data.questions : []);
  
  if (questions.length < 40) {
    underFilledCount++;
    console.log(`Filling ${f} (currently ${questions.length} questions)`);
    
    // We need 40 - questions.length more questions
    let needed = 40 - questions.length;
    
    // Shuffle master pool to get random questions
    shuffle(masterPool);
    
    let added = 0;
    let poolIdx = 0;
    
    while(added < needed) {
      if (poolIdx >= masterPool.length) {
         // Cycle if necessary
         shuffle(masterPool);
         poolIdx = 0;
      }
      
      let candidate = JSON.parse(JSON.stringify(masterPool[poolIdx]));
      poolIdx++;
      
      // Ensure we don't have exact duplicate question_text in the same set if possible
      // (Though SVG might vary, text is a good proxy)
      const isDuplicate = questions.some(q => q.question_text === candidate.question_text && JSON.stringify(q.options) === JSON.stringify(candidate.options));
      if (!isDuplicate) {
        // Assign new ID
        candidate.id = questions.length + 1;
        questions.push(candidate);
        added++;
      }
    }
    
    // Save it back
    // If it was an array originally, save as array. If it was object with questions, save as object.
    let outputData = Array.isArray(data) ? questions : { ...data, questions: questions };
    fs.writeFileSync(filePath, JSON.stringify(outputData, null, 2));
  }
});

console.log(`Successfully filled ${underFilledCount} under-filled OIR visual sets.`);
