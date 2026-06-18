export type OLQRubricItem = {
  olqId: string;
  olqName: string;
  dailyActionExamples: string[];
  evaluationCriteria: string[];
};

export function buildOLQRubricStub(): OLQRubricItem[] {
  return [
    {
      olqId: "OLQ-01",
      olqName: "Officer Like Qualities (Example Placeholder)",
      dailyActionExamples: ["Example daily action 1", "Example daily action 2"],
      evaluationCriteria: ["Clarity of behavior observed", "Consistency over time", "Impact on team"]
    }
  ];
}
