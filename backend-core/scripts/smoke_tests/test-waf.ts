import { createWaf } from './src/security/waf.js';

async function runTests() {
  const waf = createWaf();
  const testCases = [
    {
      name: "Normal API Request",
      req: {
        method: "GET",
        headers: {
            "x-forwarded-for": "192.168.1.1",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/100"
        }
      },
      url: "/api/wat/set1"
    },
    {
      name: "Bot User Agent (Curl)",
      req: {
        method: "GET",
        headers: {
            "x-forwarded-for": "192.168.1.2",
            "user-agent": "curl/7.68.0"
        }
      },
      url: "/api/wat/set1"
    },
    {
      name: "Bot User Agent (Python-Requests)",
      req: {
        method: "GET",
        headers: {
            "x-forwarded-for": "192.168.1.3",
            "user-agent": "python-requests/2.25.1"
        }
      },
      url: "/api/pi/history"
    },
    {
      name: "Malicious Request (SQL Injection)",
      req: {
        method: "GET",
        headers: {
            "x-forwarded-for": "192.168.1.5",
            "user-agent": "Mozilla/5.0"
        }
      },
      url: "/api/wat/set1?id=1%27%20OR%20%271%27%3D%271"
    },
    {
      name: "Malicious Request (Path Traversal)",
      req: {
        method: "GET",
        headers: {
            "x-forwarded-for": "192.168.1.6",
            "user-agent": "Mozilla/5.0"
        }
      },
      url: "/api/pi/../../../etc/passwd"
    },
    {
      name: "Normal Auth Request",
      req: {
        method: "POST",
        headers: {
            "x-forwarded-for": "192.168.1.4",
            "user-agent": "Mozilla/5.0 Chrome/100"
        }
      },
      url: "/api/auth/signin"
    }
  ];

  console.log("=== WAF Test Execution ===");
  for (const tc of testCases) {
    let statusCode = 200;
    let endedWith: any = null;
    
    // Mock response object
    const res: any = {
      setHeader: () => {},
      end: (data: string) => { endedWith = JSON.parse(data); },
      set statusCode(code: number) { statusCode = code; }
    };
    
    const allowed = await waf.enforce(tc.req as any, res, tc.url);
    console.log(`[TEST] ${tc.name}: Allowed=${allowed}, StatusCode=${statusCode}`);
    if (!allowed && endedWith) {
        console.log(`       Reason: ${endedWith.reason}`);
    }
  }
  
  // Test Rate Limiting
  console.log("\n=== Rate Limit Test Execution ===");
  console.log("Sending 125 requests from 10.0.0.1 to protected endpoint (Limit is 120)...");
  
  let allowedCount = 0;
  let blockedCount = 0;
  
  for(let i=0; i<125; i++) {
     let statusCode = 200;
     const res: any = {
      setHeader: () => {},
      end: () => {},
      set statusCode(code: number) { statusCode = code; }
     };
     const allowed = await waf.enforce({
        method: "GET",
        headers: { "x-forwarded-for": "10.0.0.1", "user-agent": "Mozilla/5.0" }
     } as any, res, "/api/wat/test");
     
     if (allowed) allowedCount++;
     else blockedCount++;
  }
  console.log(`Results: Allowed=${allowedCount}, Blocked=${blockedCount} (Expected: 120 Allowed, 5 Blocked)`);
  
  // Test Auth Rate Limiting (Limit is 10)
  console.log("\nSending 15 requests from 10.0.0.2 to auth endpoint (Limit is 10)...");
  let authAllowed = 0;
  let authBlocked = 0;
  for(let i=0; i<15; i++) {
     let statusCode = 200;
     const res: any = {
      setHeader: () => {},
      end: () => {},
      set statusCode(code: number) { statusCode = code; }
     };
     const allowed = await waf.enforce({
        method: "POST",
        headers: { "x-forwarded-for": "10.0.0.2", "user-agent": "Mozilla/5.0" }
     } as any, res, "/api/auth/signin");
     
     if (allowed) authAllowed++;
     else authBlocked++;
  }
  console.log(`Results: Allowed=${authAllowed}, Blocked=${authBlocked} (Expected: 10 Allowed, 5 Blocked)`);

}

runTests().catch(console.error);
