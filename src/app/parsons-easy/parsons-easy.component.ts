import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { ToastrService } from 'ngx-toastr';
import { AppModalComponent } from '../app-modal/app-modal.component';
import { ProfessorSpeechComponent } from '../professor-speech/professor-speech.component';
import { Question, LineItem } from '../models/question';
import { QuestionService } from '../services/question.service';
import { EasyGameTutorialComponent } from "../easygametutorial/easygametutorial.component";

import { splitterDialogues } from './splitter-dialogues';

@Component({
  selector: 'app-parsons-easy',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, AppModalComponent, ProfessorSpeechComponent, EasyGameTutorialComponent],
  templateUrl: './parsons-easy.component.html',
  styleUrls: ['./parsons-easy.component.css'],
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
export class ParsonsEasyComponent implements OnInit {
  @Input() questions: Question[] = [];
  @Input() currentQuestion: Question | null = null;
  @Input() questionId: number | null = null;
  @Output() completed: EventEmitter<void> = new EventEmitter<void>();

  // --- CHEAT / TUTORIAL PROPERTIES ---
  // Left side draggable items and backup copy
  codeItems: LineItem[] = [];
  originalCode: LineItem[] = [];
  // Right side drop area
  currentItems: LineItem[] = [];

  // Feedback & progress
  feedbackMessages: { [id: number]: string } = {};
  highlightedStatus: { [id: number]: 'correct' | 'incorrect' | 'neutral' } = {};
  remainingItems: number = 0;
  progressText: string = '';
  feedbackGiven: boolean = false;
  showNextButton: boolean = false;
  showTable: boolean = true;

  // Modal properties for instructions/summary
  showInstructionModal: boolean = false;
  showSummaryModal: boolean = false;
  instructionModalTitle = 'Instructions';
  SummaryModalTitle = 'Summary';
  instructionModalContent: string = "";
  summaryModalContent: string = "";

  // Question selection
  selectedSection: number = 1;
  selectedQuestionID: number | null = null;

  // Professor and dialogues
  showProfessorModal: boolean = false;
  splitterDialoges= splitterDialogues; // Replace with your actual dialogues

  // Game modal (for tutorial) properties
  showModalGame: boolean = false;
  titleGame: string = 'Game Tutorial';

  // Simulation / cheat mode properties for Parsons Easy
  currentStepText: string = 'Step 1: The "Show Table" button will be highlighted and auto-clicked to reveal the table.';
  highlightToggleTableButton: boolean = false;
  highlightGetFeedback: boolean = false;
  tutorialOver: boolean = false;
  showRepeatModal: boolean = false;
  autoSimulate: boolean = true;

  constructor(private questionService: QuestionService, private toastr: ToastrService) {}

  toggleProfessorModal(): void {
    this.showProfessorModal = !this.showProfessorModal;
  }
  
  ngOnInit(): void {
    if (this.questionId) {
      this.loadQuestionDetails(this.questionId);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadData();
  }

  // --- Data Loading Methods ---
  loadData(): void {
    if (!this.questionId) {
      console.error('Invalid question ID:', this.questionId);
      return;
    }

    this.loadQuestionDetails(this.questionId);

    // this.questionService.getQuestionsBySection(this.questionId).subscribe({
    //   next: (questions) => {
    //     this.questions = questions.map(q => ({
    //       QUESTION_ID: q.QUESTION_ID,
    //       SECTION: '1NF Easy',
    //       QUESTION: q.QUESTION,
    //       HINTS: q.HINTS || '',
    //       HTML_CONTENT: q.HTML_CONTENT || '',
    //       CODE: [],
    //       correctOrder: [],
    //       feedback: [],
    //       SUMMARY: q.SUMMARY
    //     }));
    //     if (this.questions.length > 0) {
    //       this.selectedQuestionID = this.questions[0].QUESTION_ID;
    //       this.loadQuestionDetails(this.selectedQuestionID);
    //     }
    //   },
    //   error: (err) => console.error('Error loading questions:', err),
    // });
  }

  loadQuestionDetails(questionID: number | null): void {
    if (!questionID) {
      console.error('Invalid question ID:', questionID);
      return;
    }
    this.questionService.getQuestionDetails(questionID).subscribe({
      next: (details) => {
        const questionData = details[0];
        const codeLines = details.map(item => ({
          codeLineId: item.CODE_LINE_ID,
          text: item.CODE_LINE_TEXT
        }));
        this.currentQuestion = {
          QUESTION_ID: questionData.QUESTION_ID,
          SECTION: '1NF Easy',
          QUESTION: questionData.QUESTION,
          HINTS: questionData.HINTS || '',
          HTML_CONTENT: questionData.HTML_CONTENT || '',
          CODE: codeLines,
          correctOrder: [],
          feedback: [],
          SUMMARY: questionData.SUMMARY
        };
        this.initInstructionModal();
        this.originalCode = [...codeLines];
        this.questionService.getCorrectOrderDetails(questionID).subscribe({
          next: (correctOrderDetails) => {
            this.currentQuestion!.correctOrder = correctOrderDetails.map(detail => detail.codeLineId);
            this.resetPuzzle();
            this.updateProgress();
          },
          error: (err) => console.error('Error loading correct order details:', err),
        });
        this.questionService.getFeedbackDetails(questionID).subscribe({
          next: (feedbackDetails) => {
            this.currentQuestion!.feedback = feedbackDetails.map(feedback => ({
              codeLineId: feedback.codeLineId,
              text: feedback.feedbackText
            }));
          },
          error: (err) => console.error('Error loading feedback:', err),
        });
      },
      error: (err) => console.error('Error loading question details:', err),
    });
  }

  updateProgress(): void {
    if (!this.currentQuestion || !this.currentQuestion.correctOrder) {
      this.progressText = 'Correct: 0/0';
      return;
    }
    const totalCorrectOrder = this.currentQuestion.correctOrder.length;
    this.progressText = `Correct: 0/${totalCorrectOrder}`;
  }

  // --- Drag & Drop Methods ---
  drop(event: CdkDragDrop<LineItem[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const sortableListLength = event.container.data.length;
      if (sortableListLength < this.remainingItems) {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      } else {
        console.log('Cannot add more items, limit reached.');
      }
    }
    this.clearFeedback();
  }

  clearFeedback(): void {
    this.feedbackGiven = false;
    this.feedbackMessages = {};
    this.highlightedStatus = {};
    this.updateProgress();
  }

  clickResetPuzzle(): void {
    this.resetPuzzle();
    this.toastr.info('The puzzle has been reset!', 'Reset Successful');
  }

  resetPuzzle(): void {
    if (!this.currentQuestion) return;
    this.currentItems = [];
    this.codeItems = [...this.originalCode];
    this.updateRemainingItems();
    this.clearFeedback();
  }

  updateRemainingItems(): void {
    const totalItems = this.currentQuestion?.correctOrder.length || 0;
    this.remainingItems = totalItems - this.currentItems.length;
  }

  shuffleArray(array: LineItem[]): LineItem[] {
    return array.sort(() => Math.random() - 0.5);
  }

  navigateToNextQuestion(): void {
    this.completed.emit();
  }

  // --- Modal Utility Methods ---
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
    this.instructionModalContent = this.currentQuestion?.HINTS || "";
  }
  initSummaryModal(): void {
    this.showSummaryModal = true;
    this.summaryModalContent = this.currentQuestion?.SUMMARY || "";
  }

  // --- Game Modal (Tutorial) Methods ---
  openGameModal(): void {
    this.showModalGame = true;
  }
  closeGameModal(): void {
    this.showModalGame = false;
  }
// New property to hold the sorted items (if needed)
sortedCodeItems: LineItem[] = [];

// runCheat() is called by the Show Answer button.
runCheat(): void {
  console.log("runCheat() called");
  this.resetPuzzle(); // Reset the puzzle first.
  // Sort codeItems according to the order defined in currentQuestion.correctOrder.
  if (this.currentQuestion && this.currentQuestion.correctOrder) {
    this.codeItems.sort((a: LineItem, b: LineItem) => {
      const orderA = this.currentQuestion!.correctOrder.indexOf(a.codeLineId);
      const orderB = this.currentQuestion!.correctOrder.indexOf(b.codeLineId);
      return orderA - orderB;
    });
  }
  console.log("Sorted codeItems:", this.codeItems);
  console.log("correct order that need to be in list " + this.currentQuestion?.correctOrder)
  // Start the simulated drag
  this.simulateCheatDrag();
}

simulateCheatDrag(): void {
  console.log('simulateDrag() called');
  // Ensure currentQuestion, its CODE, and correctOrder exist.
  if (this.currentQuestion && this.currentQuestion.CODE && this.currentQuestion.correctOrder) {
    console.log('simulateDrag(): correctOrder is', this.currentQuestion.correctOrder);
    
    // Filter the items so that we only keep those that are present in correctOrder.
    const filteredCode = this.currentQuestion.CODE.filter(item =>
      this.currentQuestion!.correctOrder.includes(item.codeLineId)
    );
    
    // If sortedCodeItems is empty, initialize it by sorting the filtered items.
    if (!this.sortedCodeItems || this.sortedCodeItems.length === 0) {
      this.sortedCodeItems = [...filteredCode].sort((a, b) => {
        const orderA = this.currentQuestion!.correctOrder.indexOf(a.codeLineId);
        const orderB = this.currentQuestion!.correctOrder.indexOf(b.codeLineId);
        return orderA - orderB;
      });
      console.log('simulateDrag(): sortedCodeItems initialized:', this.sortedCodeItems);
    }
    
    // If there are still items in the sorted array, simulate dragging the next one.
    if (this.sortedCodeItems.length > 0) {
      const draggedItem = this.sortedCodeItems.shift();
      console.log('simulateDrag(): Dragging item:', draggedItem);
      setTimeout(() => {
        // Add the dragged item to the right drop zone.
        this.currentItems.push(draggedItem!);
        console.log('simulateDrag(): Current items after push:', this.currentItems);
        // Continue simulation if there are more items in sortedCodeItems.
        if (this.sortedCodeItems.length > 0) {
          setTimeout(() => {
            this.simulateCheatDrag();
          }, 1500);
        } else if (this.currentItems.length === this.currentQuestion?.correctOrder.length) {
          // Once all items are moved (i.e. the number of currentItems equals the length of correctOrder)
          this.currentStepText = 'Step 3: The "Get Feedback" button is highlighted. When clicked, items will be marked correct.';
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
  } else {
    console.log('simulateDrag() not executed because currentQuestion, CODE, or correctOrder is missing.');
  }
}


  // --- TUTORIAL SIMULATION METHODS ---


  toggleTable(): void {
    this.showTable = !this.showTable;
  }




  // simulateDrag(): void {
  //   console.log('simulateDrag() called');
  //   // Ensure currentQuestion, CODE, and correctOrder are available.
  //   if (this.currentQuestion && this.currentQuestion.CODE && this.currentQuestion.correctOrder) {
  //     console.log('simulateDrag(): correctOrder is', this.currentQuestion.correctOrder);
  //     // If sortedCodeItems is empty, initialize it by sorting currentQuestion.CODE
  //     if (!this.sortedCodeItems || this.sortedCodeItems.length === 0) {
  //       // Create a new array sorted based on the index in correctOrder.
  //       this.sortedCodeItems = [...this.currentQuestion.CODE].sort((a, b) => {
  //         const orderA = this.currentQuestion!.correctOrder.indexOf(a.codeLineId);
  //         const orderB = this.currentQuestion!.correctOrder.indexOf(b.codeLineId);
  //         return orderA - orderB;
  //       });
  //       console.log('simulateDrag(): sortedCodeItems initialized:', this.sortedCodeItems);
  //     }
      
  //     // If there are still items to drag, remove the first one from sortedCodeItems.
  //     if (this.sortedCodeItems.length > 0) {
  //       const draggedItem = this.sortedCodeItems.shift();
  //       console.log('simulateDrag(): draggedItem:', draggedItem);
  //       setTimeout(() => {
  //         // Add the dragged item to the right drop zone.
  //         this.currentItems.push(draggedItem!);
  //         console.log('simulateDrag(): currentItems:', this.currentItems);
  //         // Continue simulation if there are more items to drag.
  //         if (this.sortedCodeItems.length > 0) {
  //           setTimeout(() => {
  //             this.simulateDrag();
  //           }, 1500);
  //         } else if (this.currentItems.length === this.remainingItems) {
  //           // Once all items are moved, update the step text and auto-trigger feedback.
  //           this.currentStepText = 'Step 3: The "Get Feedback" button is highlighted. When clicked, items will be marked correct.';
  //           this.highlightGetFeedback = true;
  //           setTimeout(() => {
  //             this.getFeedback();
  //             this.tutorialOver = true;
  //             setTimeout(() => {
  //               this.showRepeatModal = true;
  //             }, 3000);
  //           }, 2000);
  //         }
  //       }, 1500);
  //     }
  //   } else {
  //     console.log('simulateDrag() not executed because currentQuestion, CODE, or correctOrder is missing.');
  //   }
  // }
  
  
  // --- Existing getFeedback() ---
  getFeedback(): void {
    if (!this.currentQuestion || !this.currentQuestion.correctOrder) {
      return;
    }
    const correctOrderSet = new Set(this.currentQuestion.correctOrder);
    let correctCount = 0;
    this.currentItems.forEach((item) => {
      const feedback = this.currentQuestion!.feedback.find((f) => f.codeLineId === item.codeLineId);
      if (correctOrderSet.has(item.codeLineId)) {
        this.highlightedStatus[item.codeLineId] = 'correct';
        this.feedbackMessages[item.codeLineId] = feedback ? feedback.text : 'No feedback available';
        correctCount++;
      } else {
        this.highlightedStatus[item.codeLineId] = 'incorrect';
        this.feedbackMessages[item.codeLineId] = feedback ? feedback.text : 'No feedback available';
      }
    });
    this.progressText = `Correct: ${correctCount}/${this.currentQuestion.correctOrder.length}`;
    this.feedbackGiven = true;

    if(correctCount == this.currentQuestion.correctOrder.length){
      this.initSummaryModal();
      this.showNextButton = true;
    }

  }



  onDrop(event: CdkDragDrop<LineItem[]>): void {
    console.log('onDrop event triggered', event);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const sortableListLength = event.container.data.length;
      if (sortableListLength < this.remainingItems) {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      } else {
        console.log('Cannot add more items, limit reached.');
      }
    }
    this.clearFeedback();
  }
  

  // For Parsons Easy, we assume codeLineId is our key for feedback.
  isPrimaryKey(item: LineItem): boolean {
    return item.text.includes('PK');
  }

  isForeignKey(item: LineItem): boolean {
    return item.text.includes('FK');
  }

  feedbackKeyForColumn(item: LineItem): number {
    return item.codeLineId;
  }
}
