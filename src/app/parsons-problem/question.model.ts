// question.model.ts
export interface Question {
  id: number;
  section: string;
  content: string;
  code: string[];  // Add this line to define the code property
}
