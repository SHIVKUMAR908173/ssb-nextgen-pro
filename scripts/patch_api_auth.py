import os
import re

API_DIR = 'c:/Users/Shivkumar/.antigravity/ssb-nextgen-pro/frontend/src/app/api'
UNPROTECTED = [
    'evaluate-tat', 'evaluate-wat', 'evaluate-sd', 'evaluate-gpe', 'evaluate-lecturette',
    'fitness-coach', 'generate-notes', 'lecturette-notes', 'news', 'ocr', 'oir', 'oir-questions',
    'csss-questions', 'psych-eval', 'update-streak', 'assessment-profile'
]

import_stmt = "import { getServerUser } from '@/lib/supabase/auth';\n"
auth_check = "\n    const user = await getServerUser();\n    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });\n"

for route in UNPROTECTED:
    route_file = os.path.join(API_DIR, route, 'route.ts')
    if not os.path.exists(route_file):
        print(f'Skipping {route}, not found')
        continue
    
    with open(route_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'getServerUser' in content:
        print(f'Skipping {route}, already protected')
        continue
    
    # 1. Add import
    # Find last import statement
    lines = content.split('\n')
    last_import = 0
    for i, line in enumerate(lines):
        if line.startswith('import '):
            last_import = i
    
    lines.insert(last_import + 1, "import { getServerUser } from '@/lib/supabase/auth';")
    content = '\n'.join(lines)
    
    # 2. Add auth check at start of GET/POST
    def replacer(match):
        return match.group(0) + auth_check
    
    content = re.sub(r'export\s+async\s+function\s+(?:POST|GET)\s*\([^)]*\)\s*\{(?:\s*try\s*\{)?', replacer, content)
    
    with open(route_file, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f'Patched {route}')
