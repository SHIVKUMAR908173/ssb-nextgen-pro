import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../frontend/.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedStudyMaterials() {
    console.log("Loading study_material_data.json...");
    
    const jsonPath = path.resolve(__dirname, '../frontend/src/data/study_material_data.json');
    if (!fs.existsSync(jsonPath)) {
        console.error("Could not find study_material_data.json at:", jsonPath);
        return;
    }

    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const studyData = JSON.parse(rawData);

    console.log("Starting Supabase insertion...");

    for (const [examKey, data] of Object.entries(studyData)) {
        const payload = data;

        const record = {
            exam_id: examKey,
            title: payload.title,
            category: payload.category,
            description: payload.description,
            theme_color: payload.color,
            syllabus_blueprint: payload.syllabus_blueprint || [],
            modules: payload.modules || [],
            practice_questions: payload.practice_questions || [],
            pdf_vault: payload.pdf_vault || [],
            video_vault: payload.video_vault || []
        };

        const { error } = await supabase
            .from('study_materials')
            .upsert(record, { onConflict: 'exam_id' });

        if (error) {
            console.error(`Error inserting ${examKey}:`, error.message);
        } else {
            console.log(`✅ Successfully seeded study material for: ${examKey.toUpperCase()}`);
        }
    }

    console.log("Migration Complete.");
}

seedStudyMaterials();
