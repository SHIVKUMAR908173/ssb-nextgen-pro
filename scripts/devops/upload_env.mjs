import { readFileSync } from 'fs';
import { execSync } from 'child_process';

const envFile = readFileSync('.env.local', 'utf-8');
const lines = envFile.split('\n');

for (const line of lines) {
  if (!line.trim() || line.startsWith('#')) continue;
  
  const [key, ...valueParts] = line.split('=');
  const value = valueParts.join('=').trim();
  
  if (key && value) {
    console.log(`Adding ${key}...`);
    try {
      execSync(`echo "${value}" | vercel env add ${key.trim()} production`, { stdio: 'pipe' });
      execSync(`echo "${value}" | vercel env add ${key.trim()} preview`, { stdio: 'pipe' });
      execSync(`echo "${value}" | vercel env add ${key.trim()} development`, { stdio: 'pipe' });
      console.log(`✅ Added ${key}`);
    } catch (e) {
      console.log(`❌ Failed to add ${key}`);
    }
  }
}
