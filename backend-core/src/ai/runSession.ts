import { CandidateInput, InterviewEvaluation, InterviewRunConfig } from "./types.js";
import { createStaticQuestionProvider } from "./questionProviderStatic.js";
import { runInterviewStateMachine } from "./interviewStateMachine.js";

export function runDeterministicMockInterviewSession(params: {
  config: InterviewRunConfig;
  candidate: CandidateInput;
}): { evaluation: InterviewEvaluation; sessionHistory: unknown[] } {
  const { config, candidate } = params;

  const deps = {
    questionProvider: createStaticQuestionProvider()
  };

  let state = undefined;
  let evaluation: InterviewEvaluation | undefined = undefined;
  const sessionHistory: unknown[] = [];

  // Hard guard: maxTurns + extra stages.
  for (let i = 0; i < config.maxTurns + 10; i += 1) {
    const out = runInterviewStateMachine({
      deps,
      config,
      candidate,
      state
    });

    state = out.state;
    sessionHistory.push({ next: out.next, state: out.state });

    if (out.next.evaluation) {
      evaluation = out.next.evaluation;
      break;
    }
  }

  if (!evaluation) {
    throw new Error("Interview session did not reach conclusion/evaluation within guardrail.");
  }

  return { evaluation, sessionHistory };
}
