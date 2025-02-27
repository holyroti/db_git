export interface columnQuestion {
  questionId: number;
  title: string;
  instructions: string;
  oneNFTable: {
    tableName: string;
    columns: string[]; // String array in the source
  } | null;
  twoNFTables: TwoNFTable[];
  answers: {
    columnName: string;
    targetTable: string;
    feedback: string;
    feedback_type: string;
  }[];
  feedback: Feedback[];
  html_content: string | "";
  summary: string;
}

export interface Feedback {
  columnName: string;
  targetTable: string;
  feedback: string;
  feedbackType: string;
  column_type: string;
  keyType: string;

}

export interface Column {
  columnName: string;
  keyType: string;
  referencesTable: string | null;
}

export interface TwoNFTable {
  tableName: string;
  columns: Column[];
}
