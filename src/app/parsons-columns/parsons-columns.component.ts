import { Component, EventEmitter, Input, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { CdkDragDrop, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { QuestionService } from '../services/question.service';
import { Column, columnQuestion, TwoNFTable } from '../models/columnQuestion';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppModalComponent } from '../app-modal/app-modal.component';
import { ProfessorSpeechComponent } from "../professor-speech/professor-speech.component";
import { trigger, transition, style, animate } from '@angular/animations';
import { ColumngametutorialComponent } from '../columngametutorial/columngametutorial.component';
import { prof_decomposer } from './decomposer.dialogues';
@Component({
  selector: 'app-parsons-columns',
  templateUrl: './parsons-columns.component.html',
  styleUrls: ['./parsons-columns.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, AppModalComponent, ProfessorSpeechComponent, ColumngametutorialComponent],
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

export class ParsonsColumnsComponent implements OnInit {
  @Input() currentQuestion: columnQuestion | null = null;
  @Input() showNextButton: boolean = false;
  @Input() questionId: number | null = null;
  @Input() stage: number | null = 3;
  @Output() completed: EventEmitter<void> = new EventEmitter<void>();

  // Professor and modal properties
  showProfessorModal: boolean = false;
  decomposerDialogues = prof_decomposer; // Replace with your actual dialogues

  // ------------------ TUTORIAL SIMULATION PROPERTIES ------------------
  currentStepText: string = 'Step 1: The "Show Table" button will be highlighted and auto-clicked to reveal the tables.';
  highlightToggleTableButton: boolean = false;
  highlightGetFeedback: boolean = false;
  tutorialOver: boolean = false;
  showRepeatModal: boolean = false;

  // Data properties
  questions: columnQuestion[] = [];
  availableColumns: Column[] = [];
  connectedDropLists: string[] = [];
  columnAssignments: Record<string, Column[]> = {};
  discardedColumns: Column[] = [];
  selectedQuestionId: number | null = null;
  highlightedStatus: { [key: string]: string } = {};
  feedbackMessages: { [key: string]: string } = {};
  progressText: string = '';
  feedbackGiven: boolean = false;
  showTable: boolean = true;
  twoNFTables: TwoNFTable[] = [];
  errorMessage: string = '';

  // Modal properties for instruction/summary (if needed)
  showInstructionModal: boolean = false;
  showSummaryModal: boolean = false;
  instructionModalTitle: string = 'Instructions';
  SummaryModalTitle: string = 'Summary';
  instructionModalContent: string = "";
  summaryModalContent: string = "";

  showModalTutorial = false;
  tutorialModalTitle = 'Tutorial';

  constructor(private questionService: QuestionService) {}
  @ViewChild('availableList') availableList: any;
  @ViewChildren('tableList') tableDropLists!: QueryList<any>;
  get tableLists(): any[] {
    return this.tableDropLists ? this.tableDropLists.toArray() : [];
  }
  tableListsArray(currentTableName: string): any[] {
    // Return all table drop list references except the one for currentTableName.
    return this.tableLists.filter(dl => dl.id !== (currentTableName + 'List'));
  }

  getConnectedDropListsForTable(tableName: string): any[] {
    const dropLists = this.tableDropLists ? this.tableDropLists.toArray() : [];
    // Filter out the drop list for the current table.
    const otherTableLists = dropLists.filter(dl => dl.id !== tableName + 'List');
    return [this.availableList, ...otherTableLists];
  }
  
  
  toggleProfessorModal() {
    this.showProfessorModal = !this.showProfessorModal;
  }
  
  closeTutorialModal(): void {
    this.showModalTutorial = false;
  }

  openTutorialModal(): void {
    this.showModalTutorial = true;
  }

  ngOnInit(): void {
    // this.loadQuestions();
    if (this.questionId) {
      this.loadDataForCurrentQuestion();
    } else {
      console.error('No question ID provided.');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadData();
  }

  loadData(): void {
    if (!this.questionId) {
      console.error('Invalid question ID:', this.questionId);
      return;
    }
    this.questionService.getTwoNFData(this.questionId).subscribe({
      next: (response) => {
        if (response.success) {
          this.twoNFTables = this.filterTablesByStage(response.data, this.stage || 3);
          this.setupColumns();
        } else {
          console.error('Failed to load data for 2NF stage.');
        }
      },
      error: (err) => console.error('Error loading data:', err),
    });
  }

  filterTablesByStage(data: any[], stage: number): TwoNFTable[] {
    switch (stage) {
      case 1:
        return data.filter(table => table.context === '0-1NF');
      case 2:
        return data.filter(table => table.context === '1-2NF');
      default:
        return data;
    }
  }

  setupColumns(): void {
    if (!this.currentQuestion) return;
    // Build availableColumns from twoNFTables.
    this.availableColumns = this.currentQuestion.twoNFTables.flatMap(table =>
      table.columns.map(col => ({
        columnName: col.columnName,
        keyType: col.keyType,
        referencesTable: col.referencesTable,
        tableName: table.tableName,
      }))
    );
    // Initialize column assignments for each table.
    this.columnAssignments = {};
    this.currentQuestion.twoNFTables.forEach(table => {
      this.columnAssignments[table.tableName] = [];
    });
  }


  loadDataForCurrentQuestion(): void {
    this.questionService.getColumnQuestionById(this.questionId!).subscribe({
      next: (response) => {
        if (response.success) {
          // If the API returns an array, pick the first element.
          this.currentQuestion = Array.isArray(response.data) ? response.data[0] : response.data;
          // Now, twoNFTables should be available.
          this.availableColumns = this.currentQuestion?.twoNFTables.flatMap(table =>
            table.columns.map(col => ({
              columnName: col.columnName,
              keyType: col.keyType,
              referencesTable: col.referencesTable,
              tableName: table.tableName,
            }))
          ) || [];
          // Initialize column assignments for each table.
          this.currentQuestion?.twoNFTables.forEach(table => {
            this.columnAssignments[table.tableName] = [];
          });
          this.initInstructionModal();
        } else {
          console.error('Failed to load data for the current question.');
        }
      },
      error: (err) => console.error('Error loading question data:', err),
    });
  }
  

  // loadQuestions(): void {
  //   this.questionService.getColumnQuestions().subscribe({
  //     next: (response) => {
  //       if (response.success) {
  //         this.questions = response.data;
  //         if (this.questions.length > 0) {
  //           this.selectedQuestionId = this.questions[0].questionId;
  //           this.setCurrentQuestion();
  //         }
  //       }
  //     },
  //     error: (err) => console.error('Error loading questions:', err),
  //   });
  // }

  setCurrentQuestion(): void {
    this.currentQuestion = this.questions.find(q => q.questionId === this.selectedQuestionId) || null;
    if (this.currentQuestion) {
      this.availableColumns = this.currentQuestion.twoNFTables.flatMap(table =>
        table.columns.map(col => ({
          columnName: typeof col === 'string' ? col : col.columnName,
          keyType: (typeof col === 'object' && 'keyType' in col) ? col.keyType : 'NONE',
          referencesTable: (typeof col === 'object' && 'referencesTable' in col) ? col.referencesTable : null,
          tableName: table.tableName,
        }))
      );
      this.initInstructionModal();
      this.currentQuestion.twoNFTables.forEach(table => {
        this.columnAssignments[table.tableName] = [];
      });
      this.connectedDropLists = [
        'availableColumnsList',
        ...Object.keys(this.columnAssignments).map(key => key + 'List')
      ];
    }
  }

  // ------------------ MODAL UTILITY FUNCTIONS ------------------
  toggleInstructionModal(): void {
    this.showInstructionModal = !this.showInstructionModal;
  }
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

  initSummaryModal(){
    this.showSummaryModal = true;
    this.summaryModalContent = this.currentQuestion?.summary || "";
  }
  // ------------------ SIMULATION FUNCTIONS ------------------

  // New method to start the tutorial simulation when the user clicks "Show Tutorial"
  runTutorial(): void {
    this.resetPuzzle();
    // Reset tutorial flags and text
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
      'Step 1.1: The tables are visible. Now the "Hide Table" button is highlighted and will be auto-clicked to hide the tables.';
    this.highlightToggleTableButton = true;
    setTimeout(() => {
      this.toggleTable(); // Hide tables
      this.highlightToggleTableButton = false;
      this.currentStepText =
        'Step 2: Drag simulation in progress. Columns are being automatically moved from the available list to the tables.';
      setTimeout(() => {
        this.simulateDragColumns();
      }, 1500);
    }, 2500);
  }


  simulateDragColumns(): void {
    if (this.availableColumns.length > 0) {
      // Remove one column from the availableColumns array.
      const draggedColumn = this.availableColumns.shift();
      if (!draggedColumn) { 
        return; 
      }
      
      // Find all feedback records that match the column's name and keyType.
      const matchingFeedbacks = this.currentQuestion?.feedback.filter(fb =>
        fb.columnName === draggedColumn.columnName &&
        fb.keyType === draggedColumn.keyType
      );
      
      let targetTable: string;
      
      if (matchingFeedbacks && matchingFeedbacks.length > 0) {
        // Prefer the feedback record with feedbackType 'correct'
        const correctFeedback = matchingFeedbacks.find(fb => fb.feedbackType === 'correct');
        if (correctFeedback && correctFeedback.targetTable) {
          targetTable = correctFeedback.targetTable;
        } else {
          // Fall back to the first matching feedback if none is marked correct.
          targetTable = matchingFeedbacks[0].targetTable;
        }
      } else {
        // Fallback: if no matching feedback is found, use round-robin assignment.
        const tableNames = Object.keys(this.columnAssignments);
        targetTable = tableNames[(tableNames.length - this.availableColumns.length) % tableNames.length];
      }
      
      // Wait a short delay, then "drop" the column into the correct target table.
      setTimeout(() => {
        this.columnAssignments[targetTable].push(draggedColumn);
        // Continue simulation until no available columns remain.
        if (this.availableColumns.length > 0) {
          setTimeout(() => {
            this.simulateDragColumns();
          }, 1500);
        } else {
          // When all columns have been moved, update step text and trigger feedback.
          this.currentStepText =
            'Step 3: The "Get Feedback" button is highlighted. When clicked, columns will be evaluated.';
          this.highlightGetFeedback = true;
          setTimeout(() => {
            this.getFeedback();
            this.tutorialOver = true;
            // After 3 seconds, show the repeat tutorial modal.
            setTimeout(() => {
              this.showRepeatModal = true;
            }, 3000);
          }, 2000);
        }
      }, 1500);
    }
  }
  
  
  // The getFeedback() method as originally provided:
  getFeedback(): void {
    if (!this.currentQuestion || !this.currentQuestion.feedback) {
      console.error('No feedback found.');
      return;
    }
  
    // Initialize feedback messages and statuses
    this.feedbackMessages = {}; 
    this.highlightedStatus = {};
  
    console.log("Current Feedback:", this.currentQuestion.feedback);
    console.log("Assigned Columns:", this.columnAssignments);
  
    // Loop through each target table in the column assignments
    Object.keys(this.columnAssignments).forEach((targetTable) => {
      const columns = this.columnAssignments[targetTable];
      console.log(`Processing target table: ${targetTable}`);
      console.log(`Assigned Columns for ${targetTable}:`, columns);
      // For each column in the current table, check against the feedback
      columns.forEach((assignedColumn: Column) => {
        console.log("Processing Assigned Column:", assignedColumn);
        // Find a matching feedback record for columnName, targetTable, and keyType
        const matchingFeedback = this.currentQuestion?.feedback.find((fb) => 
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
  
    if (this.showNextButton)
      this.initSummaryModal();
  
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
    this.currentStepText =
      'Step 1: The "Show Table" button will be highlighted and auto-clicked to reveal the tables.';
    setTimeout(() => {
      this.simulateToggleTable();
    }, 2500);
  }

  resetPuzzle(): void {
    if (!this.currentQuestion) return;
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


  // Modal utility functions (if still needed)


  // Handles drop events between drag lists.
onDrop(event: CdkDragDrop<Column[]>): void {
  // If the item is dropped in the same container, do nothing.
  if (event.previousContainer === event.container) {
    return;
  }

  // Get the dragged item (it should be a Column).
  const draggedItem: Column = event.previousContainer.data[event.previousIndex];

  // If moving from the available columns list to a table drop list:
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
  } 
  // If moving from a table drop list back to available columns:
  else if (event.container.id === 'availableColumnsList') {
    // Optional: only allow if not already present.
    if (!this.availableColumns.some((col) => col.columnName === draggedItem.columnName)) {
      transferArrayItem(
        event.previousContainer.data,
        this.availableColumns,
        event.previousIndex,
        event.currentIndex
      );
    }
  } 
  // If moving between table drop lists:
  else {
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

// Returns true if the column is a primary key.
isPrimaryKey(column: Column): boolean {
  return column.keyType === 'PK';
}

// Returns true if the column is a foreign key.
isForeignKey(column: Column): boolean {
  return column.keyType === 'FK';
}

// Constructs a unique feedback key for a given column and table.
feedbackKeyForColumn(column: Column, tableName: string): string {
  return `${column.columnName}_${tableName}_${column.keyType}`;
}

}
