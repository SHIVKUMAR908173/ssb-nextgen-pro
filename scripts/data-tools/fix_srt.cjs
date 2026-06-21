const fs = require('fs');
const path = 'src/data/srt_situation_bank.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

let fixes = 0;
data.sets.forEach(set => {
  set.situations = set.situations.map(s => {
    let fixed = s;
    const replacements = [
      [/\bYou was\b/gi, 'You were'],
      [/\bHe don't\b/gi, "He doesn't"],
      [/\bShe don't\b/gi, "She doesn't"],
      [/\bThey was\b/gi, 'They were'],
      [/\bWe was\b/gi, 'We were'],
      [/\bI was went\b/gi, 'I went'],
      [/\bYou was went\b/gi, 'You went'],
      [/\bhave went\b/gi, 'have gone'],
      [/\bhas went\b/gi, 'has gone'],
      [/\bhave came\b/gi, 'have come'],
      [/\bhas came\b/gi, 'has come'],
      [/\bhave ran\b/gi, 'have run'],
      [/\bhas ran\b/gi, 'has run'],
      [/\bYou is\b/gi, 'You are'],
      [/\bThey is\b/gi, 'They are'],
      [/\bWe is\b/gi, 'We are'],
      [/\bHe have\b/gi, 'He has'],
      [/\bShe have\b/gi, 'She has'],
      [/\bIt have\b/gi, 'It has'],
      [/\bdoesn't has\b/gi, "doesn't have"],
      [/\bdon't has\b/gi, "don't have"],
      [/\bdidn't went\b/gi, "didn't go"],
      [/\bdidn't came\b/gi, "didn't come"],
      [/\bdidn't ran\b/gi, "didn't run"],
      [/\bdidn't saw\b/gi, "didn't see"],
      [/\bdidn't knew\b/gi, "didn't know"],
      [/\bmore better\b/gi, 'better'],
      [/\bmore worse\b/gi, 'worse'],
      [/\bmost best\b/gi, 'best'],
      [/\bmost worst\b/gi, 'worst'],
      [/\bcould of\b/gi, 'could have'],
      [/\bshould of\b/gi, 'should have'],
      [/\bwould of\b/gi, 'would have'],
      [/\bmust of\b/gi, 'must have'],
      [/\birregardless\b/gi, 'regardless'],
      [/\balot\b/gi, 'a lot'],
      [/\btheirself\b/gi, 'themselves'],
      [/\bhisself\b/gi, 'himself'],
      [/\bsuppose to\b/gi, 'supposed to'],
      [/\buse to\b/gi, 'used to'],
    ];

    replacements.forEach(([regex, replacement]) => {
      const before = fixed;
      fixed = fixed.replace(regex, replacement);
      if (before !== fixed) fixes++;
    });

    // Capitalize first letter
    if (fixed.length > 0 && fixed[0] !== fixed[0].toUpperCase()) {
      fixed = fixed[0].toUpperCase() + fixed.slice(1);
      fixes++;
    }

    // Ensure ends with punctuation
    if (fixed.length > 0 && !['.','?','!'].includes(fixed[fixed.length-1])) {
      fixed = fixed + '.';
      fixes++;
    }

    return fixed;
  });
});

data.metadata.version = '2.1';
fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Applied ' + fixes + ' grammar fixes across ' + data.sets.length + ' sets (' + data.sets.reduce((a,s) => a + s.situations.length, 0) + ' situations)');
