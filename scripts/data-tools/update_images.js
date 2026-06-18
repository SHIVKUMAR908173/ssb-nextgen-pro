const fs = require('fs');

const path = 'c:\\Users\\Shivkumar\\.antigravity\\ssb-nextgen-pro\\frontend\\src\\data\\psych_scenario_bank.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const localTatImages = [
    '/assets/tat/tat-0001.jpg',
    '/assets/tat/tat-0002.jpg',
    '/assets/tat/tat-0003.jpg',
    '/assets/tat/tat-0004.jpg',
    '/assets/tat/tat-0005.jpg',
    '/assets/tat/tat-0006.png'
];

const localPpdtImages = [
    '/assets/ppdt/ppdt-0001.png',
    '/assets/ppdt/ppdt-0002.png',
    '/assets/ppdt/ppdt-0003.png'
];

// Add image_url to TAT
data.tat_stimuli = data.tat_stimuli.map((item, index) => {
    if (item.is_blank) {
        item.image_url = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"; // blank white/grey image
    } else if (index < localTatImages.length) {
        item.image_url = localTatImages[index]; // Use real local asset
    } else {
        const prompt = encodeURIComponent(item.description + " realistic sketch style black and white military psychology test");
        item.image_url = `https://image.pollinations.ai/prompt/${prompt}?width=800&height=600&nologo=true`;
    }
    return item;
});

// Add image_url to PPDT
data.ppdt_stimuli = data.ppdt_stimuli.map((item, index) => {
    if (index < localPpdtImages.length) {
        item.image_url = localPpdtImages[index]; // Use custom local PPDT asset
    } else if (index < localTatImages.length) {
        item.image_url = localTatImages[index]; // Fallback to local TAT asset
    } else {
        const prompt = encodeURIComponent(item.description + " hazy blurry silhouette realistic black and white military psychology test");
        item.image_url = `https://image.pollinations.ai/prompt/${prompt}?width=800&height=600&nologo=true`;
    }
    return item;
});

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log("Successfully updated psych_scenario_bank.json with local PPDT and TAT assets!");
