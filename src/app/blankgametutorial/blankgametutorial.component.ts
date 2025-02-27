import { Component, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { ProfessorSpeechComponent } from "../professor-speech/professor-speech.component";
import { keywiseDialogues } from '../blank-parsons/keywiseDialogues';
import { AppModalComponent } from "../app-modal/app-modal.component";

export interface BlankColumn {
  id: number;
  columnName: string;
  keyType: 'PK' | 'FK' | 'NONE';
  referencesTableId: string | null;
  target_table: string;
}

export interface BlankTable {
  id: number;
  targetTable: string;
  referencesTable: string;
  columns: BlankColumn[];
}

export interface BlankQuestion {
  questionId: number;
  question: string;
  htmlCode: string;
  hints: string;
  instructions: string;
  summary: string;
  tables: BlankTable[];
  feedback: any[]; // Ideally, define a proper interface for feedback
}

@Component({
  selector: 'app-blankgametutorial',
  standalone: true,
  imports: [CommonModule, FormsModule, ProfessorSpeechComponent, AppModalComponent],
  templateUrl: './blankgametutorial.component.html',
  styleUrls: ['./blankgametutorial.component.css'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('500ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class BlankGameTutorialComponent implements OnInit {
  // Mock question data
  currentQuestion: BlankQuestion | null = null;
  // Student's working copy of tables for dropdown selections
  userInputTables: BlankTable[] = [];
  // For question selector
  blankQuestions: BlankQuestion[] = [];
  selectedQuestionID: number | null = null;

  // Predefined dropdown lists
  predefinedTableNames: string[] = ['Orders', 'Order_Details'];
  availableColumnNames: string[] = ['ORDER_ID', 'ITEM_ORDERED', 'TOTAL_AMOUNT', 'ORDER_DETAILS_ID', 'CUSTOMER_NAME', 'QUANTITY_ORDERED'];
  availableReferences: string[] = ['Orders', 'Order_Details'];

  // Simulation flags and texts
  currentStepText: string = 'Step 1: The tutorial will now auto-select table names for your tables.';
  feedbackGiven: boolean = false;
  showRepeatModal: boolean = false;
  showNextButton: boolean = false;
  // These objects hold simulated feedback
  highlightedStatus: { [id: number]: string } = {};
  feedbackMessages: { [id: number]: string } = {};
  showTable: boolean = true;

  // Highlight flags for simulation
  highlightTableSelect: boolean = false;
  highlightColumnSelect: boolean = false;
  highlightAddColumn: boolean = false;
  highlightRemoveColumn: boolean = false;

  // Modal properties for instructions/summary
  showInstructionModal: boolean = false;
  showSummaryModal: boolean = false;
  instructionModalTitle: string = 'Instructions';
  SummaryModalTitle: string = 'Summary';
  instructionModalContent: string = "";
  summaryModalContent: string = "";

  // For professor speech
  showProfessorModal: boolean = false;
  keyWiseDialogues = keywiseDialogues;

  // For "Show Answers" toggle if needed
  showAnswers: boolean = false;
// Add this near your other properties:
  simulationLog: string[] = [];
  private logMessage(message: string): void {
    // Optionally, you could prepend a timestamp here.
    this.simulationLog.push(message);
  }
  
  constructor() {}

  ngOnInit(): void {
    this.initializeMockData();
    // For simulation, add the current question to blankQuestions as well.
    this.blankQuestions = [this.currentQuestion!];
    this.selectedQuestionID = this.currentQuestion?.questionId || 1;
    // Start the simulation after a short delay.
    setTimeout(() => {
      this.simulateSelectTables();
    }, 2000);
  }

  // Called if inputs change
  ngOnChanges(changes: SimpleChanges): void {
    // Optionally handle changes.
  }

  // Initialize mock question data and create the working copy.
  initializeMockData(): void {
    this.currentQuestion = {
      questionId: 1,
      question: 'Design the blank tables for the database.',
      htmlCode: '<p>Mock HTML content for table structure.</p>',
      hints: 'Try selecting the correct table names and columns.',
      instructions: 'Follow the tutorial steps to complete the design.',
      summary: 'Tutorial complete! All columns have been assigned correctly.',
      tables: [
        {
          id: 1,
          targetTable: '',
          referencesTable: '',
          columns: [
            { id: 101, columnName: '', keyType: 'NONE', referencesTableId: null, target_table: '' },
            { id: 102, columnName: '', keyType: 'NONE', referencesTableId: null, target_table: '' }
          ]
        },
        {
          id: 2,
          targetTable: '',
          referencesTable: '',
          columns: [
            { id: 201, columnName: '', keyType: 'NONE', referencesTableId: null, target_table: '' },
            { id: 202, columnName: '', keyType: 'NONE', referencesTableId: null, target_table: '' }
          ]
        }
      ],
      feedback: [
        { table: 'Orders', column: 'ORDER_ID', feedback: 'Correct!' },
        { table: 'Orders', column: 'TOTAL_AMOUNT', feedback: 'Correct!' },
        { table: 'Order_Details', column: 'ORDER_DETAILS_ID', feedback: 'Correct!' },
        { table: 'Order_Details', column: 'CUSTOMER_NAME', feedback: 'Correct!' }
      ]
    };

    // Create the student's working copy (userInputTables)
    this.initializeUserInputTables();
  }

  initializeUserInputTables(): void {
    if (!this.currentQuestion) return;
    this.userInputTables = this.currentQuestion.tables.map(table => ({
      id: table.id,
      targetTable: '',
      referencesTable: '',
      columns: table.columns.map(col => ({
        id: col.id,
        columnName: '',
        keyType: 'NONE',
        referencesTableId: null,
        target_table: ''
      }))
    }));
  }

  // --- Simulation Step 1: Auto-select table names ---
  simulateSelectTables(): void {
    this.currentStepText = 'Step 1: Auto-selecting the correct table names...';
    this.highlightTableSelect = true;
    // You can also log the message if needed:
    // this.logMessage('Auto-selecting table names...');
    setTimeout(() => {
      if (this.userInputTables.length >= 2) {
        this.userInputTables[0].targetTable = 'Orders';
        this.userInputTables[1].targetTable = 'Order_Details';
      }
      this.highlightTableSelect = false;
      this.currentStepText = 'Step 2: Now auto-selecting the correct column names for each table...';
      setTimeout(() => {
        this.simulateSelectColumns();
      }, 2000);
    }, 2000);
  }
  

  // --- Simulation Step 2: Auto-select column names, simulate add/remove ---
  simulateSelectColumns(): void {
    this.highlightColumnSelect = true;
    setTimeout(() => {
      if (this.userInputTables.length >= 2) {
        // For table 1 (Orders)
        this.userInputTables[0].columns[0].columnName = 'ORDER_ID';
        this.userInputTables[0].columns[1].columnName = 'TOTAL_AMOUNT';
        // For table 2 (Order_Details)
        this.userInputTables[1].columns[0].columnName = 'ORDER_DETAILS_ID';
        this.userInputTables[1].columns[1].columnName = 'CUSTOMER_NAME';
      }
      this.highlightColumnSelect = false;
      this.currentStepText = 'Step 2.1: Highlighting the "Add Column" button...';
      this.highlightAddColumn = true;
      setTimeout(() => {
        this.highlightAddColumn = false;
        // Optionally simulate removal (if more than one column exists)
        if (this.userInputTables[0].columns.length > 1) {
          this.removeColumn(0, this.userInputTables[0].columns.length - 1);
          this.currentStepText = 'A column was removed. Auto-clicking "Get Feedback"...';
        } else {
          this.currentStepText = 'Auto-clicking "Get Feedback"...';
        }
        setTimeout(() => {
          this.getFeedback();
          this.showRepeatModal = true;

        }, 2000);
      }, 2000);
    }, 2000);

  }

  // --- Simulation Step 3: Auto-trigger feedback ---
  getFeedback(): void {
    let correctCount = 0;
    this.userInputTables.forEach(table => {
      table.columns.forEach(col => {
        if (col.columnName && col.columnName.trim() !== '') {
          this.highlightedStatus[col.id] = 'correct';
          this.feedbackMessages[col.id] = 'Correct!';
          correctCount++;
        } else {
          this.highlightedStatus[col.id] = 'incorrect';
          this.feedbackMessages[col.id] = 'Incorrect!';
        }
      });
    });
    this.feedbackGiven = true;
    this.currentStepText = 'Feedback applied: ' + correctCount + ' columns are correct.';
    const totalColumns = this.userInputTables.reduce((sum, table) => sum + table.columns.length, 0);
    this.showNextButton = (correctCount === totalColumns);
  }

  // --- Repeat the Tutorial ---
  repeatTutorial(): void {
    this.feedbackGiven = false;
    this.feedbackMessages = {};
    this.highlightedStatus = {};
    this.showRepeatModal = false;
    this.initializeUserInputTables();
    this.currentStepText = 'Step 1: The tutorial will now auto-select table names.';
    setTimeout(() => {
      this.simulateSelectTables();
    }, 2000);
  }

  // --- Helper Methods for Add/Remove Columns ---
  addColumn(tableIndex: number): void {
    if (!this.userInputTables[tableIndex]) {
      console.error(`Table at index ${tableIndex} does not exist.`);
      return;
    }
    const table = this.userInputTables[tableIndex];
    const newColumn = this.createDefaultColumn(table.id);
    table.columns.push(newColumn);
    this.logMessage(`Added column to table ${tableIndex}: `+  table);
  }

  removeColumn(tableIndex: number, columnIndex: number): void {
    const columns = this.userInputTables[tableIndex]?.columns;
    if (!columns) {
      console.error(`No columns found for table at index ${tableIndex}`);
      return;
    }
    if (columns.length > 1) {
      columns.splice(columnIndex, 1);
      this.logMessage(`Removed column at index ${columnIndex} from table ${tableIndex}`);
    } else {
      console.warn(`Cannot remove the last column in table ${tableIndex}`);
    }
  }

  createDefaultColumn(tableId: number, columnId?: number): BlankColumn {
    const id = columnId ? columnId : Date.now();
    return {
      id: id,
      columnName: '',
      keyType: 'NONE',
      referencesTableId: null,
      target_table: ''
    };
  }

  // --- Navigation & Toggle Methods ---
  navigateToNextQuestion(): void {
    this.logMessage("Navigating to next question...");
  }

  toggleTable(): void {
    this.showTable = !this.showTable;
  }

  toggleInstructionModal(): void {
    this.showInstructionModal = !this.showInstructionModal;
  }

  toggleShowAnswers(): void {
    this.showAnswers = !this.showAnswers;
  }

  // --- Modal Utility Methods ---
  closeInstructionModal(): void {
    this.showInstructionModal = false;
  }
  closeSummaryModal(): void {
    this.showSummaryModal = false;
  }
  initInstructionModal(): void {
    this.showInstructionModal = true;
    this.instructionModalContent = this.currentQuestion?.instructions || "";
  }
  initSummaryModal(): void {
    this.showSummaryModal = true;
    this.summaryModalContent = this.currentQuestion?.summary || "";
  }

  // --- Professor Speech Toggle ---
  toggleProfessorModal(): void {
    this.showProfessorModal = !this.showProfessorModal;
  }
}
