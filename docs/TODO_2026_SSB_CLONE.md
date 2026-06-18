# TODO: 2026 SSB standards clone integration (architecture + rules + scoring)

- [ ] Analyze current implementation coverage (Stage 1, PI/CIQ, voice/transport, GTO rules, medical standards, AI scoring)
- [ ] Stage 1: Implement CSS (70-question cognitive battery) using deterministic datasets + session state machine
- [ ] Stage 1: Implement OPAM (120-question objective personality assessment) with deterministic scoring + 15 OLQs mapping
- [ ] Stage 1: Wire new Stage 1 APIs into `src/server.ts` + ensure frontend-facing response shapes are parseable (schema validated)
- [ ] CIQ pipeline: Verify CIQ 1..6 ordering and stage transitions in `src/ai/interviewStateMachine.ts`
- [ ] CIQ pipeline: Replace/extend PI evaluation so CIQ stage outputs are structured and deterministic
- [ ] Voice AI: Add WebRTC transport skeleton (e.g., LiveKit-compatible endpoints/hooks) without breaking existing HTTP mock flows
- [ ] Voice AI: Implement “barge-in” interruption handling at protocol/state level (stop speaking → resume listen)
- [ ] GTO rules engine: Implement/extend strict Color Rule + Distance Rule enforcement across evaluators
- [ ] GTO rules engine: Ensure gap-bridge + out-of-bounds/material safety are consistently penalized
- [ ] Medical standards: Extend `src/medical/standards.ts` to enforce 2026 vision dioptre limits + color perception grades
- [ ] Medical standards: Extend anthropometric logic: region height relaxations + age-specific weight charts
- [ ] Deterministic AI scoring: Add constrained decoding plumbing using JSON Schema approach
- [ ] Deterministic AI scoring: Ensure TAT/WAT/SRT evaluators always return schema-validated JSON (no hallucinated score keys/types)
- [ ] Add/extend smoke tests for each new endpoint/evaluator
- [ ] Run `npm run typecheck` and fix all TS issues
- [ ] Run build and start server; hit all new/modified endpoints with curl and validate response schemas
