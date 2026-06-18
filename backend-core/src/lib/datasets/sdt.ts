export type SDTItem = {
  id: string;
  perspective: "self" | "parents" | "teachers" | "friends";
  promptTemplate: string;
  responseTemplate: string;
};

export function buildSDTDatasetStub(): SDTItem[] {
  return [
    {
      id: "sdt-0001",
      perspective: "self",
      promptTemplate:
        "Write a brief self-description from the perspective of: {perspective}. Focus on values, strengths, and how others might see you.",
      responseTemplate: "I see myself as ...; My strengths are ...; I believe others would describe me as ...;"
    }
  ];
}
