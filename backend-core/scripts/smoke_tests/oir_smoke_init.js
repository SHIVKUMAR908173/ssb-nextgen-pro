import http from "node:http";

const body = JSON.stringify({
  config: {
    sessionId: "oir-s1",
    totalTimeSeconds: 900,
    questionCount: 40,
    balanceCategories: true,
    seed: 1
  }
});

const req = http.request(
  {
    hostname: "localhost",
    port: 3001,
    path: "/api/oir/session/init",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(body)
    }
  },
  (res) => {
    let s = "";
    res.on("data", (d) => {
      s += d.toString("utf-8");
    });
    res.on("end", () => {
      console.log("status", res.statusCode);
      console.log(s);
    });
  }
);

req.on("error", (e) => {
  console.error(e);
});

req.write(body);
req.end();
