import re

filepath = r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\backend-core\src\server.ts"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Express imports
content = content.replace('import { createServer, IncomingMessage, ServerResponse } from "node:http";', 
                          'import { createServer, IncomingMessage, ServerResponse } from "node:http";\nimport express, { Request, Response, NextFunction } from "express";\nimport cors from "cors";\nimport helmet from "helmet";')

# 2. Refactor the server creation
server_start = """const server = createServer(async (req, res) => {"""
express_start = """const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',').map(s => s.trim());
app.use(helmet());
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));

app.use(async (req: Request, res: Response, next: NextFunction) => {
  applySecurityHeaders(res as any);
  if (req.url.startsWith("/assets/")) {
    next();
    return;
  }
  const ok = await waf.enforce(req as any, res as any, req.url);
  if (!ok) return;
  next();
});

"""

content = content.replace(server_start, express_start)

manual_cors_waf = """  if (!req.url) {
    sendJson(res, 404, { error: "Missing url" });
    return;
  }

  // CORS handling
  const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',').map(s => s.trim());
  const requestOrigin = req.headers.origin;
  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    res.setHeader('Access-Control-Allow-Origin', requestOrigin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Session-Token');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  // Security headers
  applySecurityHeaders(res);

  // WAF enforcement (protects dataset/payload endpoints from obvious scraping/bursting)
  const contentLengthHeader = req.headers["content-length"];
  const payloadBytes = typeof contentLengthHeader === "string" ? Number(contentLengthHeader) : undefined;

  const url = req.url;
  const ok = await waf.enforce(req, res, url);
  if (!ok) return;"""

content = content.replace(manual_cors_waf, "")

# Find all route `if` statements and replace the block
# We will find the index of "if (req.method ==="
def process_routes(text):
    out = ""
    idx = 0
    pattern = re.compile(r'if \s*\(\s*req\.method\s*===\s*"([^"]+)"\s*&&\s*(?:req\.)?url\s*(?:===|\?\.startsWith\()?\s*"([^"]+)"\)?\s*\)\s*\{')
    
    while True:
        match = pattern.search(text, idx)
        if not match:
            out += text[idx:]
            break
            
        out += text[idx:match.start()]
        
        method = match.group(1).lower()
        route = match.group(2)
        if 'startsWith' in match.group(0):
            route += '*'
            
        out += f'app.{method}("{route}", async (req: Request, res: Response) => {{'
        
        # Now find the matching closing brace
        brace_count = 1
        i = match.end()
        while i < len(text) and brace_count > 0:
            if text[i] == '{':
                brace_count += 1
            elif text[i] == '}':
                brace_count -= 1
            i += 1
            
        inner = text[match.end():i-1]
        
        # Replace return; at the end of the block
        inner = re.sub(r'return;\s*$', '', inner)
        # Replace readJsonBody
        inner = re.sub(r'await readJsonBody\(req\)', r'req.body', inner)
        # Replace sendJson
        inner = re.sub(r'sendJson\(res,\s*(\d+),\s*(.*?)\);', r'res.status(\1).json(\2);', inner)
        
        out += inner
        out += '});'
        
        idx = i

    return out

content = process_routes(content)

# We also need to change the bottom of the file
content = content.replace('sendJson(res, 404, { error: "Not found" });', 'res.status(404).json({ error: "Not found" });')
content = content.replace('});\n\nserver.listen(', '});\n\nconst server = createServer(app);\nserver.listen(')

# Finally, some routes might use sendJson inside catch, we replaced it above in inner.
# However, if there are any sendJson left globally:
content = re.sub(r'sendJson\(res,\s*(\d+),\s*(.*?)\);', r'res.status(\1).json(\2);', content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Refactored successfully")
