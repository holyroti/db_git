import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TutorialComponent, TutorialStep } from '../tutorial/tutorial.component';
import { TutorialDragComponent } from '../tutorial-drag/tutorial-drag.component';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-game',
  templateUrl: './easygametutorial.component.html',
  styleUrls: ['./easygametutorial.component.css'],
  standalone: true,
  imports: [CommonModule, DragDropModule, TutorialComponent, TutorialDragComponent],
  animations: [
    trigger('itemAnimation', [
      // Items enter: slower animation (1000ms)
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('1000ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      // Items leave: slower animation (1000ms)
      transition(':leave', [
        animate('1000ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class EasyGameTutorialComponent implements OnInit, AfterViewInit {
  showTable = false;
  showTutorial = true;
  autoSimulate = true;
  requiredCount = 3;

  // Flag to highlight the "Show/Hide Table" button (used for both states)
  highlightToggleTableButton: boolean = false;

  // Left drop list data (draggable items)
  codeItems = [
    { text: 'Item 1', codeLineId: 1 },
    { text: 'Item 2', codeLineId: 2 },
    { text: 'Item 3', codeLineId: 3 }
  ];
  // Save a copy for resetting the puzzle.
  originalCode = [...this.codeItems];

  // Right drop list data (target area)
  currentItems: any[] = [];

  // (Optional) Tutorial steps (if using your TutorialComponent)
  tutorialSteps: TutorialStep[] = [
    { selector: '.example-list', instruction: 'This is where you drag your code lines.' },
    { selector: '.btn-feedback', instruction: 'Click here to get feedback on your code!' },
    { selector: '.simulate-drag-btn', instruction: 'The drag is simulated automatically.' }
  ];

  // Feedback properties
  feedbackGiven = false;
  feedbackMessages: { [key: number]: string } = {};
  highlightedStatus: { [key: number]: string } = {};

  // Highlight flag for the Get Feedback button
  highlightGetFeedback = false;
  // Flag to indicate tutorial cycle is complete
  tutorialOver = false;
  // Flag to show the repeat modal overlay
  showRepeatModal: boolean = false;

  // Current step text to explain what is happening
  currentStepText: string =
    'Step 1: The "Show Table" button will be highlighted and auto-clicked to reveal the table.';

  // (CDK drop handler; adjust if needed)
  drop(event: any) {
    console.log('Drop event:', event);
  }

  onTutorialComplete() {
    this.showTutorial = false;
  }

  toggleTable() {
    this.showTable = !this.showTable;
  }

  /**
   * simulateToggleTable() highlights the "Show Table" button,
   * then auto-clicks it (calling toggleTable()) and updates the step text.
   * After that, it calls simulateHideTable() after a delay.
   */
  simulateToggleTable() {
    this.currentStepText =
      'Step 1: Highlighting the "Show Table" button. It will be auto-clicked to reveal the table.';
    this.highlightToggleTableButton = true;
    setTimeout(() => {
      this.toggleTable(); // Reveals the table
      this.highlightToggleTableButton = false;
      // Proceed to simulate clicking the Hide Table button.
      this.simulateHideTable();
    }, 2500); // Increased delay for slower animation
  }

  /**
   * simulateHideTable() updates the step text to indicate that you can hide the table,
   * highlights the button (now reading "Hide Table") and auto-clicks it to hide the table.
   * Then it updates the step text and starts the drag simulation.
   */
  simulateHideTable() {
    this.currentStepText =
      'Step 1.1: Now that the table is visible, the "Hide Table" button is highlighted. It will be auto-clicked to hide the table.';
    this.highlightToggleTableButton = true;
    setTimeout(() => {
      this.toggleTable(); // Hides the table
      this.highlightToggleTableButton = false;
      this.currentStepText =
        'Step 2: Drag simulation in progress. Items are being automatically moved from left to right.';
      setTimeout(() => {
        this.simulateDrag();
      }, 1500);
    }, 2500);
  }

  /**
   * simulateDrag() automatically moves an item from the left list to the right list.
   * When the target list is full, it highlights the Get Feedback button and,
   * after a delay, automatically calls getFeedback() to mark all items as correct.
   */
  simulateDrag() {
    if (this.codeItems.length > 0) {
      const draggedItem = this.codeItems.shift(); // Remove the first item
      setTimeout(() => {
        this.currentItems.push(draggedItem);
        if (this.currentItems.length < this.requiredCount && this.autoSimulate) {
          setTimeout(() => {
            this.simulateDrag();
          }, 1500);
        } else if (this.currentItems.length === this.requiredCount) {
          this.currentStepText =
            'Step 3: The "Get Feedback" button is highlighted. When clicked, items will be marked correct.';
          this.highlightGetFeedback = true;
          setTimeout(() => {
            this.getFeedback();
            this.tutorialOver = true;
            // After 3 seconds, show the repeat modal.
            setTimeout(() => {
              this.showRepeatModal = true;
            }, 3000);
          }, 2000);
        }
      }, 1500);
    }
  }

  /**
   * getFeedback() marks each item as correct and updates feedback.
   * After feedback is applied, the highlight on the Get Feedback button is stopped.
   */
  getFeedback(): void {
    if (!this.currentItems) {
      return;
    }
    this.currentItems.forEach((item) => {
      this.highlightedStatus[item.codeLineId] = 'correct';
      this.feedbackMessages[item.codeLineId] = 'Correct placement!';
    });
    this.feedbackGiven = true;
    this.currentStepText =
      'Feedback given: All items are marked correct. Tutorial complete.';
    setTimeout(() => {
      this.highlightGetFeedback = false;
    }, 2000);
  }

  /**
   * resetPuzzle() resets the drop lists to their initial state.
   */
  resetPuzzle(): void {
    this.currentItems = [];
    this.codeItems = [...this.originalCode];
  }

  /**
   * repeatTutorial() clears all feedback and highlight flags,
   * resets the puzzle, updates the step text, hides the repeat modal,
   * and restarts the simulation cycle.
   */
  repeatTutorial(): void {
    this.feedbackGiven = false;
    this.feedbackMessages = {};
    this.highlightedStatus = {};
    this.highlightGetFeedback = false;
    this.tutorialOver = false;
    this.showRepeatModal = false;
    this.resetPuzzle();
    this.currentStepText =
      'Step 1: The "Show Table" button will be highlighted and auto-clicked to reveal the table.';
    setTimeout(() => {
      this.simulateToggleTable();
    }, 2500);
  }

  ngOnInit(): void {
    if (this.autoSimulate) {
      setTimeout(() => {
        this.simulateToggleTable();
      }, 2500);
    }
  }

  ngAfterViewInit(): void {
    // Additional post-view initialization if needed.
  }
}
