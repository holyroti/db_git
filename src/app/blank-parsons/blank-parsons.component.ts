import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { QuestionService } from '../services/question.service';
import { BlankQuestion, BlankTable, BlankColumn } from '../models/BlankModel';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ToastrService } from 'ngx-toastr';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AppModalComponent } from '../app-modal/app-modal.component';
import { keywiseDialogues } from './keywiseDialogues';
import { ProfessorSpeechComponent } from "../professor-speech/professor-speech.component";
import { BlankGameTutorialComponent } from '../blankgametutorial/blankgametutorial.component';

@Component({
  selector: 'app-blank-parsons',
  templateUrl: './blank-parsons.component.html',
  styleUrls: ['./blank-parsons.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, AppModalComponent, ProfessorSpeechComponent, BlankGameTutorialComponent],
  animations: [
    // Existing slideIn trigger
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('500ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    // New selectAnimation trigger for interactive elements
    trigger('selectAnimation', [
      state('inactive', style({
        transform: 'scale(1)',
        border: '2px solid transparent'
      })),
      state('active', style({
        transform: 'scale(1.05)',
        border: '4px solid yellow'
      })),
      transition('inactive <=> active', animate('300ms ease-in-out'))
    ])
  ]
})
export class BlankComponent implements OnInit {
  @Output() nextQuestion: EventEmitter<number> = new EventEmitter<number>();

  highlightTableSelect: boolean = false;
  highlightColumnSelect: boolean = false;
  highlightAddColumn: boolean = false;
  currentStepText: string = 'Step 1: The "Show Table" button will be highlighted and auto-clicked to reveal the table.';
  highlightToggleTableButton: boolean = false;
  highlightGetFeedback: boolean = false;
  tutorialOver: boolean = false;
  showRepeatModal: boolean = false;
  autoSimulate: boolean = true;
  // --- NEW: Highlight Flags for Interactive Elements ---
  highlightRemoveColumn: boolean = false;
  // For professor speech etc.
  showProfessorModal: boolean = false;
  keyWiseDialogues = keywiseDialogues;
  toggleProfessorModal() {
    this.showProfessorModal = !this.showProfessorModal;
  }

  // Used for displaying a simplified game overview (if needed)
  gameInputTables: { 
    tableName: string; 
    availableColumnNames: string[]; 
    availableReferences: string[]; 
  }[] = [];

  @Input() questionId: number | null = null;
  @Output() completed: EventEmitter<void> = new EventEmitter<void>();
  @Input() stage: number | null = null;

  showModalTutorial = false;

  blankQuestions: BlankQuestion[] = [];
  currentQuestion: BlankQuestion | null = null;
  showTable: boolean = true;
  selectedQuestionID: number | null = null;
  showNextButton: boolean = false;

  // Dropdown lists
  predefinedTableNames: string[] = [];
  availableColumnNames: string[] = [];   // Flattened list of all available column names
  availableReferences: { id: number; name: string }[] = [];
  tableIdToName: { [key: number]: string } = {};

  // Holds the correct answer mapping (solution)
  solutionTables: BlankTable[] = [];

  // The student's working copy; column names start blank so that the dropdown doesn't prefill them
  userInputTables: BlankTable[] = [];

  // Feedback tracking
  feedbackGiven: boolean = false;
  highlightedStatus: { [column: string]: string | '' } = {};
  feedbackMessages: { [column: string]: string } = {};

  // Modals for instructions/summary
  showInstructionModal: boolean = false;
  showSummaryModal: boolean = false;
  instructionModalTitle = 'Instructions';
  SummaryModalTitle = 'Summary';
  instructionModalContent = "";
  summaryModalContent = "";

  showAnswers: boolean = false;
  loading: boolean = true; // Add a loading flag

  navigateToNextQuestion(): void {
    const currentIndex = this.blankQuestions.findIndex(
      (q) => q.questionId === this.currentQuestion?.questionId
    );
    const nextQ = this.blankQuestions[currentIndex + 1];
    if (nextQ) {
      // Update local selectedQuestionID if needed.
      this.selectedQuestionID = nextQ.questionId;
      // Optionally, load new details in this component.
      this.loadBlankDetails(nextQ.questionId);
      // Emit the new question ID (of type number)
      this.nextQuestion.emit(nextQ.questionId);
    } else {
      console.warn("No more questions available.");
    }
  }
  
  // Cheat method to automatically fill the student's answers with the correct solution.
  runCheat(): void {
    if (!this.solutionTables || !this.userInputTables) {
      console.error('Solution or working copy not available.');
      return;
    }
    
    // Loop through each table in the solution
    for (let i = 0; i < this.solutionTables.length; i++) {
      const solTable = this.solutionTables[i];
      if (this.userInputTables[i]) {
        // Set the table name (targetTable)
        this.userInputTables[i].targetTable = solTable.targetTable;
        
        // Loop through each column of the table
        for (let j = 0; j < solTable.columns.length; j++) {
          const solCol = solTable.columns[j];
          if (this.userInputTables[i].columns[j]) {
            this.userInputTables[i].columns[j].columnName = solCol.columnName;
            this.userInputTables[i].columns[j].keyType = solCol.keyType;
            // Copy the reference table ID (which should be numeric)
            this.userInputTables[i].columns[j].referencesTableId = solCol.referencesTableId;
            this.userInputTables[i].columns[j].target_table = solCol.target_table;
            console.log(`Cheat – Table ${i}, Column ${j}: Set referencesTableId =`, solCol.referencesTableId);
          }
        }
      }
    }
    
    // Now update the feedback based on the filled-in solution
    this.getFeedback();
  }
  
  
 
  openTutorialModal(): void {
    this.showModalTutorial = true;
  }

  closeTutorialModal(): void {
    this.showModalTutorial = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['questionId'] && this.questionId) {
      console.log('Received questionId:', this.questionId);
      this.getBlankQuestionByID(this.questionId);
    }
  }

  toggleShowAnswers() {
    this.initSummaryModal();
  }

  closeInstructionModal() {
    this.showInstructionModal = false;
  }

  closeSummaryModal() {
    this.showSummaryModal = false;
  }

  initInstructionModal() {
    this.showInstructionModal = true;
    this.instructionModalContent = this.currentQuestion?.instructions || "";
  }

  initSummaryModal() {
    this.showSummaryModal = true;
    this.summaryModalContent = this.currentQuestion?.summary || "";
  }

  constructor(private questionService: QuestionService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadBlankQuestions();
    console.log(this.questionId);
  }

  async getBlankQuestionByID(questionId: number): Promise<void> {
    try {
      const response = await this.questionService.getBlankQuestionByID(questionId).toPromise();
      console.log('API Response:', response);
      if (response?.success && response.data) {
        // Use our mapping function to set currentQuestion and userInputTables
        this.mapDataToQuestion(response.data);
      } else {
        console.error('Invalid API response:', response);
      }
    } catch (err) {
      console.error('Error fetching blank question by ID:', err);
    }
  }

  mapDataToQuestion(data: any): void {
    const { question, tables, columns, feedback } = data;
    // Map the question fields
    this.currentQuestion = {
      questionId: question.questionID || 'N/A',
      sectionId: question.sectionID || 'N/A',
      htmlCode: question.html_code || '',
      hints: question.hints || '',
      instructions: question.instructions || '',
      question: question.question || '',
      summary: question.summary || '',
      tables: [],
      feedback: []
    };
  
    // Map tables: for each table, filter the columns that belong to it (using target_table)
    const mappedTables = tables.map((table: any) => {
      const columnsForTable = columns
        .filter((col: any) => col.target_table === table.target_table)
        .map((col: any) => ({
          id: col.COLUMN_ID,
          columnName: col.COLUMN_NAME,
          keyType: col.KEY_TYPE,
          // Use the exact field name (in uppercase) as returned by your API:
          referencesTableId: col.REFERENCES_TABLE_ID,
          target_table: col.TARGET_TABLE,
          columnId: col.COLUMN_ID,
        }));
      if (columnsForTable.length === 0) {
        console.warn(`No columns found for table: ${table.target_table}`);
      }
      return {
        id: table.ID,
        targetTable: table.target_table,
        referencesTable: table.references_table,
        tableName: table.target_table, // for display purposes
        columns: columnsForTable,
      };
    });
  
    // Map feedback records.
    // Notice we use feed.feedback_columnID (the alias from our SQL) and store the joined column_name as expectedColumnName.
    const mappedFeedback = feedback.map((feed: any) => ({
      id: feed.ID,
      questionid: feed.QUESTIONID,
      target_table: feed.TARGET_TABLE,
      column_name: feed.COLUMN_NAME,
      expectedKeyType: feed.EXPECTED_KEY_TYPE,
      // Use the proper field name from the API
      referencesTableId: feed.REFERENCES_TABLE_ID,
      feedback: feed.FEEDBACK,
      feedbackType: feed.FEEDBACK_TYPE,
    }));
    
  
    // Assign mapped values to our current question model
    this.currentQuestion.tables = mappedTables;
    this.currentQuestion.feedback = mappedFeedback;
  
    console.log("Mapped Current Question:", this.currentQuestion);
  
    // Create the student's working copy.
    // Here we prefill the table names but leave the columnName fields empty for the student.
    this.solutionTables = JSON.parse(JSON.stringify(this.currentQuestion?.tables));

    this.initializeUserInputTables();
  }

  createDefaultColumn(tableId: number, columnId: number | null = null): BlankColumn {
    const id = columnId ?? Date.now();
    return {
      id: id,
      columnName: '',
      keyType: 'NONE',
      referencesTableId: null,
      target_table: '',
      columnId: columnId || null,
    };
  }

 

  
  loadBlankQuestions() {
    this.questionService.getBlankQuestions().subscribe({
      next: (response) => {
        if (response.success) {
          // Map all questions from the API into our BlankQuestion objects
          this.blankQuestions = response.data.map((q: any) => ({
            questionId: q.QUESTIONID,
            sectionId: q.SECTIONID,
            htmlCode: q.HTML_CODE,
            hints: q.HINTS,
            instructions: q.INSTRUCTIONS,
            question: q.QUESTION,
            tables: [],    // will be filled later
            feedback: [],  // will be filled later
            summary: q.SUMMARY,
          }));
          console.log('Mapped Blank Questions:', this.blankQuestions);
  
          // Choose the selected question (by passed in questionId or default to the first)
          let qid = this.questionId || this.blankQuestions[0].questionId;
          const selectedQuestion = this.blankQuestions.find(q => q.questionId == qid);
          if (selectedQuestion) {
            this.selectedQuestionID = selectedQuestion.questionId;
            // Set the currentQuestion to the mapped question
            this.currentQuestion = selectedQuestion;
          } else {
            this.selectedQuestionID = this.blankQuestions[0].questionId;
            this.currentQuestion = this.blankQuestions[0];
          }
          console.log('Selected Question:', this.currentQuestion);
  
          // Now fetch details (tables, columns, feedback) and merge into currentQuestion
          this.loadBlankDetails(this.selectedQuestionID);
        }
      },
      error: (err) => console.error('Error fetching blank questions:', err),
    });
  }
  

  loadBlankDetails(questionId: number | undefined): void {
    this.loading = true;  // start loading

    const validQuestionId = questionId ?? 1;
    console.log('Fetching details for questionId:', validQuestionId);
  
    this.questionService.getBlankDetails(validQuestionId).subscribe({
      next: (response) => {
        if (response.success) {
          const { tables, feedback, columns } = response.data;
          // Build dropdown lists:
          this.predefinedTableNames = Array.from(new Set(tables.map((table: any) => table.TARGET_TABLE)));
          // Build a dictionary of reference options using the table IDs:
          // For each table we want a mapping like { 9: "room", 10: "department" }
          this.tableIdToName = {};
          tables.forEach((table: any) => {
            // We assume table.ID is the unique numeric id and TARGET_TABLE is the name.
            this.tableIdToName[table.ID] = table.TARGET_TABLE.toLowerCase().trim();
          });
          // Also, if you need a list for the select (as key/value pairs), you can do:
          this.availableReferences = Object.keys(this.tableIdToName).map(id => ({
            id: Number(id),
            name: this.tableIdToName[Number(id)]
          }));
          
          // (Then update your HTML select accordingly using Angular's keyvalue pipe.)
  
          // For available columns, we use the COLUMN_NAME from columns:
          this.availableColumnNames = Array.from(new Set(columns.map((col: any) => col.COLUMN_NAME))).filter(name => name);
  
          // Map fetched data into currentQuestion.
          this.currentQuestion = {
            questionId: this.currentQuestion?.questionId || validQuestionId,
            sectionId: this.currentQuestion?.sectionId || 1,
            htmlCode: this.currentQuestion?.htmlCode || '',
            hints: this.currentQuestion?.hints || '',
            instructions: this.currentQuestion?.instructions || '',
            question: this.currentQuestion?.question || 'Loading Question.. Please wait a moment',
            summary: this.currentQuestion?.summary || '',
            tables: tables.map((table: any) => ({
              id: table.ID,
              targetTable: table.TARGET_TABLE,
              // The API now returns the normalized references in the "references" field
              // which is an array of strings. (For example: ["Room", "Department"])
              referencesTable: table.references,
              columns: columns
                .filter((col: any) => col.TARGET_TABLE === table.TARGET_TABLE)
                .map((col: any) => ({
                  id: col.COLUMN_ID,
                  columnName: col.COLUMN_NAME,
                  keyType: col.KEY_TYPE,
                  // Map the numeric value from the API field:
                  referencesTableId: col.REFERENCES_TABLEID, 
                  target_table: col.TARGET_TABLE,
                  columnId: col.COLUMN_ID,
                }))
            })),
            feedback: feedback.map((feed: any) => ({
              id: feed.ID,
              questionid: feed.QUESTIONID,
              target_table: feed.TARGET_TABLE,
              column_name: feed.COLUMN_NAME,
              expectedKeyType: feed.EXPECTED_KEY_TYPE,
              // Use the uppercase field so that the expected reference ID is available
              //referencesTableId: feed.REFERENCES_TABLE_ID, 
              referencesTableId: feed.REFERENCES_TABLE_ID, 
              feedback: feed.FEEDBACK,
              feedbackType: feed.FEEDBACK_TYPE,
            }))
          };
  
          console.log("Mapped Current Question:", this.currentQuestion);
          this.solutionTables = JSON.parse(JSON.stringify(this.currentQuestion.tables));
          this.initializeUserInputTables();
          this.loading = false;  // finished loading

        } else {
          console.error('Invalid response from getBlankDetails:', response);
        }
      },
      error: (err) => console.error('Error fetching blank details:', err),
    });
  }
  initializeUserInputTables(): void {
    if (!this.currentQuestion || !this.currentQuestion.tables) {
      return;
    }

    this.predefinedTableNames = Array.from(
      new Set(
        this.currentQuestion.tables.map((table: any) =>
          table.targetTable
        )
      )
    );

    console.log(this.predefinedTableNames + " predefined table names");
    
    // Deep copy each table but reset each column's columnName to an empty string.
    this.userInputTables = this.currentQuestion.tables.map(table => ({
      id: table.id,
      targetTable: table.targetTable,
      referencesTable: table.referencesTable,
      columns: table.columns.map((col: any) => ({
        id: col.id,
        columnId: col.id, // or use col.columnId if available
        columnName: '',   // clear the answer so the student must choose
        keyType: 'NONE' as 'PK' | 'FK' | 'NONE',
        referencesTableId: null,
        target_table: col.target_table,
      })),
    }));
  
    console.log("User Input Tables:", this.userInputTables);
  }
  // Optionally, a helper to retrieve the solution's column name
  getSolutionColumnName(tableIndex: number, columnIndex: number): string {
    return this.solutionTables?.[tableIndex]?.columns?.[columnIndex]?.columnName ?? '';
  }

 

  addColumn(tableIndex: number): void {
    if (!this.userInputTables[tableIndex]) {
      console.error(`Table at index ${tableIndex} does not exist in userInputTables.`);
      return;
    }
    const table = this.userInputTables[tableIndex];
    // Create a new blank column; you might also want to tie it to feedback if needed
    const newColumn = this.createDefaultColumn(table.id);
    table.columns.push(newColumn);
    console.log(`Added column to table at index ${tableIndex}:`, table);
  }

  removeColumn(tableIndex: number, columnIndex: number): void {
    const columns = this.userInputTables[tableIndex]?.columns;
    if (!columns) {
      console.error(`No columns found for table at index ${tableIndex}`);
      return;
    }
    if (columns.length > 1) {
      columns.splice(columnIndex, 1);
      console.log(`Removed column at index ${columnIndex} from table ${tableIndex}`);
    } else {
      console.warn(`Cannot remove the last column in table ${tableIndex}`);
    }
  }

  updateKeyType(tableIndex: number, columnIndex: number): void {
    const column = this.currentQuestion?.tables[tableIndex]?.columns[columnIndex];
    if (column?.keyType !== 'FK') {
      column!.referencesTableId = null;
    }
  }

  updateSelectedTables(tableIndex: number): void {
    console.log('Updated selected table for index:', tableIndex, this.currentQuestion?.tables);
  }

  isTableSelected(tableName: string): boolean {
    return this.currentQuestion?.tables.some((table) => table.targetTable === tableName) || false;
  }

  resetPuzzle(): void {
    this.initializeUserInputTables();
    this.toastr.info('The puzzle has been reset!', 'Reset Successful');
  }

  

  toggleTable(): void {
    this.showTable = !this.showTable;
  }

  toggleInstructionModal(): void {
    this.showInstructionModal = !this.showInstructionModal;
  }

  highlightColumn(columnIndex: number, status: 'correct' | 'incorrect' | 'neutral'): void {
    const columnId = this.userInputTables[columnIndex]?.columns[columnIndex]?.id;
    if (columnId) {
      this.highlightedStatus[columnId] = status;
      console.log(`Column with ID ${columnId} status set to ${status}`);
    }
  }


// Add these properties at the top of your component (if not already declared)
keyTypeFeedback: { [key: string]: string } = {};
referenceFeedback: { [key: string]: string } = {};

// Helper method to generate a base key (using the student's selected column name and table name)
getBaseKey(column: BlankColumn, table: BlankTable): string {
  return `${column.columnName}_${table.targetTable}`;
}

// We update getFeedbackKey to use getBaseKey so that our TS and HTML use the same key.
getFeedbackKey(column: BlankColumn, table: BlankTable): string {
  return this.getBaseKey(column, table);
}

getFeedback(): void {
  console.log("feedbac", JSON.stringify(this.currentQuestion?.feedback, null, 2));
  if (!this.currentQuestion || !this.currentQuestion.feedback) {
    console.error('No feedback found.');
    return;
  }

  // Reset previous feedback objects
  this.feedbackMessages = {};
  this.highlightedStatus = {};
  this.keyTypeFeedback = {};
  this.referenceFeedback = {};

  this.userInputTables.forEach((userTable) => {
    userTable.columns.forEach((assignedColumn) => {
      if (!assignedColumn.columnName || !assignedColumn.columnName.trim()) {
        console.warn(`Column name is missing for ${userTable.targetTable}. Skipping feedback.`);
        return;
      }
      const baseKey = this.getBaseKey(assignedColumn, userTable);

      const candidateFeedback = this.currentQuestion?.feedback.find((fb) =>
        fb.target_table === userTable.targetTable &&
        fb.column_name === assignedColumn.columnName
      );

      if (!candidateFeedback) {
        this.highlightedStatus[baseKey] = 'incorrect';
        this.feedbackMessages[baseKey] = `Incorrect: This column does not belong to the table ${userTable.targetTable}.`;
        return;
      }

      // Check key type
      if (candidateFeedback.expectedKeyType !== assignedColumn.keyType) {
        if (candidateFeedback.expectedKeyType === 'PK' && assignedColumn.keyType === 'FK') {
          this.keyTypeFeedback[baseKey] = "This column has the wrong key type. It should be marked as Primary Key.";
        } else if (candidateFeedback.expectedKeyType === 'FK' && assignedColumn.keyType === 'PK') {
          this.keyTypeFeedback[baseKey] = "This column should be marked as Foreign Key.";
        } else {
          this.keyTypeFeedback[baseKey] = "This column has the wrong key type. Try selecting the correct one.";
        }
        this.highlightedStatus[baseKey] = 'incorrect';
      } else {
        this.keyTypeFeedback[baseKey] = "";
      }

      // For foreign keys, check that the reference is correct.
      if (assignedColumn.keyType === 'FK') {
        const expectedId = candidateFeedback.referencesTableId ? Number(candidateFeedback.referencesTableId) : NaN;
        const assignedId = assignedColumn.referencesTableId ? Number(assignedColumn.referencesTableId) : NaN;

        const expectedTableName = this.tableIdToName[expectedId] ? this.tableIdToName[expectedId].toLowerCase().trim() : "";
        const assignedTableName = this.tableIdToName[assignedId] ? this.tableIdToName[assignedId].toLowerCase().trim() : "";

        console.log(`${expectedId} expectedId, ${assignedId} assignedId`);
        console.log(`${expectedTableName} expectedTableName, ${assignedTableName} assignedTableName`);

        if (expectedTableName && assignedTableName && expectedTableName !== assignedTableName) {
          this.referenceFeedback[baseKey] = "Incorrect reference: Please select the correct referenced table.";
          this.highlightedStatus[baseKey] = 'incorrect';
        } else {
          this.referenceFeedback[baseKey] = "";
        }
      } else {
        this.referenceFeedback[baseKey] = "";
      }

      // Combine feedback
      if (!this.keyTypeFeedback[baseKey] && !this.referenceFeedback[baseKey]) {
        this.highlightedStatus[baseKey] = candidateFeedback.feedbackType;
        this.feedbackMessages[baseKey] = candidateFeedback.feedback;
      } else {
        let combinedError = "";
        if (this.keyTypeFeedback[baseKey]) {
          combinedError += this.keyTypeFeedback[baseKey] + " ";
        }
        if (this.referenceFeedback[baseKey]) {
          combinedError += this.referenceFeedback[baseKey];
        }
        this.feedbackMessages[baseKey] = combinedError.trim();
      }
    });
  });

  console.log("Feedback Messages:", this.feedbackMessages);
  console.log("Key Type Errors:", this.keyTypeFeedback);
  console.log("Reference Errors:", this.referenceFeedback);
  console.log("Highlighted Status:", this.highlightedStatus);

  const total = Object.keys(this.feedbackMessages).length;
  const correctCount = Object.values(this.highlightedStatus).filter(status => status === 'correct').length;

  this.showNextButton = (total > 0 && correctCount === total);

 
  this.feedbackGiven = true;
  if(this.showNextButton){
    this.initSummaryModal();
  }
}






// Helper methods for HTML display:
isFeedbackCorrect(column: BlankColumn, table: BlankTable): boolean {
  return this.highlightedStatus[this.getBaseKey(column, table)] === 'correct';
}

isFeedbackIncorrect(column: BlankColumn, table: BlankTable): boolean {
  return this.highlightedStatus[this.getBaseKey(column, table)] === 'incorrect';
}


}
