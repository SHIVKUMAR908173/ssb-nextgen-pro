import http from "node:http";

const body = JSON.stringify({
  topicId: "gd-2025-warfare-evolving",
  turns: [
    { speaker: "other", text: "I think tech is changing everything." },
    { speaker: "candidate", text: "I understand your point about technology. I agree that AI is reshaping strategy, especially information warfare." , referencesOthers: true},
    { speaker: "candidate", text: "However, we must address accountability and international law, and also consider humanitarian impacts like civilian harm."}
  ]
});

const req = http.request(
  {
    hostname: "localhost",
    port: 3001,
    path: "/api/gd/topics/evaluate",
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
