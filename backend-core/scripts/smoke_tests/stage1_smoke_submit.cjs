const http = require("http");

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request(
      {
        hostname: "localhost",
        port: 3001,
        path,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data)
        }
      },
      (r) => {
        let s = "";
        r.on("data", (c) => (s += c));
        r.on("end", () => {
          try {
            resolve(JSON.parse(s));
          } catch (e) {
            reject(new Error(s));
          }
        });
      }
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

(async () => {
  const init = await post("/api/stage1/session/init", {
    config: {
      sessionId: "stage1-mock-0013",
      maxCssQuestions: 70,
      maxOpamQuestions: 120,
      totalTimeSeconds: 5400,
      seed: 42
    }
  });

  const state = init.state;
  const next = init.next;

  const submit = await post("/api/stage1/session/submit", {
    state,
    questionId: next.question.id,
    selectedOptionIndex: next.question.correctOptionIndex
  });

  console.log(
    JSON.stringify(
      {
        afterSubmitStage: submit.state.stage,
        nextKind: submit.next?.kind ?? null,
        nextQuestionId: submit.next?.question?.id ?? null,
        answeredCount: submit.state.answeredCount
      },
      null,
      2
    )
  );
})().catch((e) => {
  console.error(e?.message || e);
  process.exit(1);
});
