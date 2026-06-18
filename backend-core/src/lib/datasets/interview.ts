export type InterviewQuestionItem = {
  id: string;
  category: "personal_background" | "defence_motivation" | "situational_leadership";
  prompt: string;
  rubricTemplate: string;
};

export function buildInterviewDatasetStub(): InterviewQuestionItem[] {
  return [
    {
      id: "int-0001",
      category: "defence_motivation",
      prompt: "Why do you want to join the defence forces?",
      rubricTemplate:
        "Assess: clarity of motivation, realism, values alignment, examples from life, and ability to articulate impact."
    }
  ];
}
