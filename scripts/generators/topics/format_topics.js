const fs = require('fs');

const msgs = JSON.parse(fs.readFileSync('C:\\Users\\Shivkumar\\.antigravity\\scratch\\msgs.json', 'utf8'));

let allTopics = [];

function getExam(text) {
    if (text.includes('AFCAT EXAM OVERVIEW')) return 'afcat';
    if (text.includes('PAPER I — ENGLISH') && text.includes('PAPER II — GENERAL KNOWLEDGE')) return 'cds';
    if (text.includes('PAPER I — MATHEMATICS') && text.includes('PAPER II — GENERAL ABILITY')) return 'nda';
    return 'unknown';
}

function processMessage(msg) {
    const lines = msg.split('\n');
    let exam = getExam(msg);
    let subject = 'Unknown';
    let chapter = 'Unknown';
    let chapterNum = 0;
    let topicNum = 0;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line) continue;
        
        if (line.match(/^##?\s+PAPER/) || line.match(/^##\s+SECTION/) || line.match(/^##\s+PART/) || line.match(/^##\s+SECTION/i)) {
            if (line.includes('MATHEMATICS') || line.includes('NUMERICAL')) subject = 'Mathematics';
            else if (line.includes('ENGLISH')) subject = 'English';
            else if (line.includes('GENERAL KNOWLEDGE')) subject = 'General Knowledge';
            else if (line.includes('GENERAL ABILITY')) subject = 'General Ability';
            else if (line.includes('GENERAL AWARENESS')) subject = 'General Awareness';
            else if (line.includes('REASONING')) subject = 'Reasoning';
            chapterNum = 0; 
        }
        else if (line.includes('SSB INTERVIEW')) {
            exam = 'ssb';
            subject = 'SSB Preparation';
            chapterNum = 0;
        }
        else if (line.startsWith('### ')) {
            if (line.includes('SECTION')) {
                let parts = line.split(':');
                if (parts.length > 1) subject = parts[1].trim();
            } else {
                chapter = line.substring(4).trim().split('(')[0].trim();
                chapterNum++;
                topicNum = 0;
            }
        }
        else {
            let match = line.match(/^(\d+)\.\s+(.*)/);
            if (match) {
                let title = match[2].trim();
                topicNum++;
                
                let subjShort = subject.substring(0,3).toLowerCase().replace(/[^a-z]/g, '');
                let cNumStr = chapterNum < 10 ? '0' + chapterNum : chapterNum;
                let tNumStr = topicNum < 10 ? '0' + topicNum : topicNum;
                
                let cName = exam + '-' + subjShort + '-' + cNumStr;
                let id = `${cName}-t${tNumStr}`;
                
                allTopics.push(`  { id: '${id}', exam: '${exam}', subject: '${subject}', chapter: '${cName}', title: '${title.replace(/'/g, "\\'")}' },`);
            }
        }
    }
}

msgs.forEach(processMessage);

let uniqueTopics = [...new Set(allTopics)];
let output = `// Total topics: ${uniqueTopics.length}\nconst ALL_TOPICS = [\n${uniqueTopics.join('\n')}\n];\nmodule.exports = ALL_TOPICS;\n`;
fs.writeFileSync('C:\\Users\\Shivkumar\\.antigravity\\scratch\\final_topics.js', output);
console.log('Written ' + uniqueTopics.length + ' topics.');
