import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { ProfessorSpeechComponent } from "../professor-speech/professor-speech.component";
import { prof_decomposer } from '../parsons-columns/decomposer.dialogues';
export interface Column {
  columnName: string;
  keyType: string;
  referencesTable?: string;
  tableName?: string;
}

export interface TwoNFTable {
  tableName: string;
  columns: Column[];
}

export interface ColumnFeedback {
  columnName: string;
  targetTable: string;
  feedback: string;
  feedbackType: string;
  keyType: string;
}

export interface ColumnQuestion {
  title: string;
  html_content: string;
  twoNFTables: TwoNFTable[];
  feedback: ColumnFeedback[];
  instructions?: string;
  summary?: string;
}

@Component({
  selector: 'app-columngametutorial',
  standalone: true,
  imports: [CommonModule, DragDropModule, ProfessorSpeechComponent],
  templateUrl: './columngametutorial.component.html',
  styleUrl: './columngametutorial.component.css',
  animations: [
    trigger('itemAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('1000ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('1000ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class ColumngametutorialComponent {

  @Output() completed = new EventEmitter<void>();

  // --- Mock Data for demonstration ---
  currentQuestion: ColumnQuestion = {
    title: 'Mock Parsons Columns Question',
    html_content: '<p>This is a mock representation of your table structure.</p>',
    twoNFTables: [
      {
        tableName: 'Orders',
        columns: [
          { columnName: 'ORDER_ID', keyType: 'PK' },
          { columnName: 'ITEM_ORDERED', keyType: 'NONE' },
          { columnName: 'TOTAL_AMOUNT', keyType: 'NONE' }
        ]
      },
      {
        tableName: 'Order_Details',
        columns: [
          { columnName: 'ORDER_DETAILS_ID', keyType: 'PK' },
          { columnName: 'CUSTOMER_NAME', keyType: 'NONE' },
          { columnName: 'QUANTITY_ORDERED', keyType: 'NONE' }
        ]
      }
    ],
    feedback: [
      {
        columnName: 'ORDER_ID',
        targetTable: 'Orders',
        feedback: 'Correct! ORDER_ID is the Primary Key for Orders.',
        feedbackType: 'correct',
        keyType: 'PK'
      },
      {
        columnName: 'ITEM_ORDERED',
        targetTable: 'Order_Details',
        feedback: 'Correct! ITEM_ORDERED belongs to Order_Details.',
        feedbackType: 'correct',
        keyType: 'NONE'
      },
      {
        columnName: 'TOTAL_AMOUNT',
        targetTable: 'Orders',
        feedback: 'Correct! TOTAL_AMOUNT should be stored in Orders.',
        feedbackType: 'correct',
        keyType: 'NONE'
      },
      {
        columnName: 'ORDER_DETAILS_ID',
        targetTable: 'Order_Details',
        feedback: 'Correct! ORDER_DETAILS_ID is the Primary Key for Order_Details.',
        feedbackType: 'correct',
        keyType: 'PK'
      },
      {
        columnName: 'CUSTOMER_NAME',
        targetTable: 'Orders',
        feedback: 'Correct! CUSTOMER_NAME belongs in Orders.',
        feedbackType: 'correct',
        keyType: 'NONE'
      },
      {
        columnName: 'QUANTITY_ORDERED',
        targetTable: 'Order_Details',
        feedback: 'Correct! QUANTITY_ORDERED belongs in Order_Details.',
        feedbackType: 'correct',
        keyType: 'NONE'
      }
    ],
    instructions: 'Follow the tutorial to see the correct answer.',
    summary: 'Tutorial complete! All columns have been assigned correctly.'
  };

  // --- Data for simulation ---
  availableColumns: Column[] = [];
  columnAssignments: Record<string, Column[]> = {};
  connectedDropLists: string[] = [];

  // Flags and texts for simulation steps
  currentStepText: string = 'Step 1: The "Show Table" button will be highlighted and auto-clicked to reveal the tables.';
  highlightToggleTableButton: boolean = false;
  highlightGetFeedback: boolean = false;
  feedbackGiven: boolean = false;
  showTable: boolean = true;
  progressText: string = '';
  tutorialOver: boolean = false;
  showRepeatModal: boolean = false;
  highlightedStatus: { [key: string]: string } = {};
  feedbackMessages: { [key: string]: string } = {};
  showNextButton = false;
  showProfessorModal = false;
  decomposerDialogues = prof_decomposer;
  constructor() {}

  ngOnInit(): void {
    this.setupColumns();
  }

  setupColumns(): void {
    // Build availableColumns from currentQuestion.twoNFTables.
    this.availableColumns = this.currentQuestion.twoNFTables.flatMap(table =>
      table.columns.map(col => ({
        columnName: col.columnName,
        keyType: col.keyType,
        tableName: table.tableName
      }))
    );
    // Initialize assignments for each table.
    this.columnAssignments = {};
    this.currentQuestion.twoNFTables.forEach(table => {
      this.columnAssignments[table.tableName] = [];
    });
    // Setup connected drop list IDs.
    this.connectedDropLists = [
      'availableColumnsList',
      ...Object.keys(this.columnAssignments).map(key => key + 'List')
    ];
  }

  // --- Simulation functions ---

  // Called when the user clicks "Show Answer"
  runTutorial(): void {
    this.resetPuzzle();
    // Reset simulation flags and texts.
    this.feedbackGiven = false;
    this.highlightGetFeedback = false;
    this.tutorialOver = false;
    this.showRepeatModal = false;
    this.currentStepText = 'Step 1: The "Show Table" button will be highlighted and auto-clicked to reveal the tables.';
    this.simulateToggleTable();
  }

  toggleTable(): void {
    this.showTable = !this.showTable;
  }

  simulateToggleTable(): void {
    this.currentStepText =
      'Step 1: Highlighting the "Show Table" button. It will be auto-clicked to reveal the tables.';
    this.highlightToggleTableButton = true;
    setTimeout(() => {
      this.toggleTable(); // Show tables
      this.highlightToggleTableButton = false;
      this.simulateHideTable();
    }, 2500);
  }

  simulateHideTable(): void {
    this.currentStepText =
      'Step 1.1: The tables are now visible. Now the "Hide Table" button will be highlighted and auto-clicked to hide the tables.';
    this.highlightToggleTableButton = true;
    setTimeout(() => {
      this.toggleTable(); // Hide tables
      this.highlightToggleTableButton = false;
      this.currentStepText =
        'Step 2: Drag simulation in progress. Columns are being automatically moved to their correct tables.';
      setTimeout(() => {
        this.simulateDragColumns();
      }, 1500);
    }, 2500);
  }

  simulateDragColumns(): void {
    if (this.availableColumns.length > 0) {
      // Remove one column from availableColumns.
      const draggedColumn = this.availableColumns.shift();
      if (!draggedColumn) { return; }
      
      // Find matching feedback records for this column.
      const matchingFeedbacks = this.currentQuestion.feedback.filter(fb =>
        fb.columnName === draggedColumn.columnName &&
        fb.keyType === draggedColumn.keyType
      );
      
      let targetTable: string;
      if (matchingFeedbacks && matchingFeedbacks.length > 0) {
        // Prefer the record with feedbackType 'correct'
        const correctFeedback = matchingFeedbacks.find(fb => fb.feedbackType === 'correct');
        if (correctFeedback && correctFeedback.targetTable) {
          targetTable = correctFeedback.targetTable;
        } else {
          targetTable = matchingFeedbacks[0].targetTable;
        }
      } else {
        // Fallback: if no matching feedback, assign randomly.
        const tableNames = Object.keys(this.columnAssignments);
        targetTable = tableNames[Math.floor(Math.random() * tableNames.length)];
      }
      
      setTimeout(() => {
        this.columnAssignments[targetTable].push(draggedColumn);
        if (this.availableColumns.length > 0) {
          setTimeout(() => {
            this.simulateDragColumns();
          }, 1500);
        } else {
          this.currentStepText =
            'Step 3: The "Get Feedback" button is highlighted. Feedback will be applied shortly.';
          this.highlightGetFeedback = true;
          setTimeout(() => {
            this.getFeedback();
            this.tutorialOver = true;
            setTimeout(() => {
              this.showRepeatModal = true;
            }, 3000);
          }, 2000);
        }
      }, 1500);
    }
  }

  // Original getFeedback method.
  getFeedback(): void {
    if (!this.currentQuestion || !this.currentQuestion.feedback) {
      console.error('No feedback found.');
      return;
    }
    this.feedbackMessages = {}; 
    this.highlightedStatus = {};
    console.log("Current Feedback:", this.currentQuestion.feedback);
    console.log("Assigned Columns:", this.columnAssignments);
    Object.keys(this.columnAssignments).forEach(targetTable => {
      const columns = this.columnAssignments[targetTable];
      console.log(`Processing target table: ${targetTable}`);
      console.log(`Assigned Columns for ${targetTable}:`, columns);
      columns.forEach((assignedColumn: Column) => {
        console.log("Processing Assigned Column:", assignedColumn);
        const matchingFeedback = this.currentQuestion.feedback.find(fb =>
          fb.columnName === assignedColumn.columnName &&
          fb.targetTable === targetTable &&
          fb.keyType === assignedColumn.keyType
        );
        const feedbackKey = `${assignedColumn.columnName}_${targetTable}_${assignedColumn.keyType}`;
        if (matchingFeedback) {
          this.highlightedStatus[feedbackKey] = matchingFeedback.feedbackType;
          this.feedbackMessages[feedbackKey] = matchingFeedback.feedback;
          console.log("Feedback matched:", matchingFeedback.feedback);
        } else {
          this.highlightedStatus[feedbackKey] = 'incorrect';
          this.feedbackMessages[feedbackKey] = `No valid feedback found for ${assignedColumn.columnName}.`;
          console.log("No match found for", assignedColumn.columnName);
        }
      });
    });
    console.log("Feedback Messages:", this.feedbackMessages);
    console.log("Highlighted Status:", this.highlightedStatus);
    this.feedbackGiven = true;
    const correctCount = Object.values(this.highlightedStatus).filter(status => status === 'correct').length;
    const totalColumns = Object.keys(this.highlightedStatus).length;
    this.showNextButton = correctCount === totalColumns;
    this.progressText = `Correct: ${correctCount}/${totalColumns}`;
    console.log("Progress:", this.progressText);
  }

  repeatTutorial(): void {
    this.feedbackGiven = false;
    this.feedbackMessages = {};
    this.highlightedStatus = {};
    this.highlightGetFeedback = false;
    this.tutorialOver = false;
    this.showRepeatModal = false;
    this.resetPuzzle();
    this.currentStepText = 'Step 1: The "Show Table" button will be highlighted and auto-clicked to reveal the tables.';
    setTimeout(() => {
      this.simulateToggleTable();
    }, 2500);
  }

  resetPuzzle(): void {
    this.availableColumns = this.currentQuestion.twoNFTables.flatMap(table =>
      table.columns.map(col => ({
        columnName: col.columnName,
        keyType: col.keyType,
        referencesTable: col.referencesTable,
        tableName: table.tableName,
      }))
    );
    this.shuffleArray(this.availableColumns);
    this.columnAssignments = {};
    this.currentQuestion.twoNFTables.forEach(table => {
      this.columnAssignments[table.tableName] = [];
    });
  }

  shuffleArray(array: any[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  navigateToNextQuestion(): void {
    this.completed.emit();
  }

  // ----------------- HELPER FUNCTIONS -----------------
  onDrop(event: CdkDragDrop<Column[]>): void {
    if (event.previousContainer === event.container) {
      return;
    }
    const draggedItem: Column = event.previousContainer.data[event.previousIndex];
    if (event.previousContainer.id === 'availableColumnsList') {
      const targetTable: string = event.container.id.replace('List', '');
      if (this.columnAssignments[targetTable]) {
        transferArrayItem(
          event.previousContainer.data,
          this.columnAssignments[targetTable],
          event.previousIndex,
          event.currentIndex
        );
      }
    } else if (event.container.id === 'availableColumnsList') {
      if (!this.availableColumns.some((col) => col.columnName === draggedItem.columnName)) {
        transferArrayItem(
          event.previousContainer.data,
          this.availableColumns,
          event.previousIndex,
          event.currentIndex
        );
      }
    } else {
      const targetTable: string = event.container.id.replace('List', '');
      const sourceTable: string = event.previousContainer.id.replace('List', '');
      if (this.columnAssignments[sourceTable] && this.columnAssignments[targetTable]) {
        transferArrayItem(
          event.previousContainer.data,
          this.columnAssignments[targetTable],
          event.previousIndex,
          event.currentIndex
        );
      }
    }
  }

  isPrimaryKey(column: Column): boolean {
    return column.keyType === 'PK';
  }

  isForeignKey(column: Column): boolean {
    return column.keyType === 'FK';
  }

  feedbackKeyForColumn(column: Column, tableName: string): string {
    return `${column.columnName}_${tableName}_${column.keyType}`;
  }
}
