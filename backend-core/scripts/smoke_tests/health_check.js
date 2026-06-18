import http from "node:http";

const req = http.get("http://localhost:3001/health", (res) => {
  console.log("status", res.statusCode);
  let s = "";
  res.on("data", (d) => {
    s += d.toString("utf-8");
  });
  res.on("end", () => {
    console.log(s);
  });
});

req.on("error", (e) => {
  console.error(e);
});
