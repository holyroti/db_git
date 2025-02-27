export interface Question {
  QUESTION_ID: number;
  SECTION: string;
  QUESTION: string;
  HINTS?: string;
  HTML_CONTENT?: string;
  CODE: LineItem[];
  correctOrder: number[];
  feedback: { codeLineId: number; text: string }[]; // Feedback property
  SUMMARY: string;
}

export interface LineItem {
  codeLineId: number; // Unique identifier for each line
  text: string; // Text content of the line
}
