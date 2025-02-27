import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';

export interface TutorialStep {
  instruction: string;      // Instruction text to display for this step
  action: () => void;       // Function to run when this step is executed
  delay?: number;           // Delay (in ms) before executing the action (default: 2000ms)
  // (Optional: you can add other properties like a selector, etc.)
}

@Component({
  selector: 'app-parsons-tutorial',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tutorial-overlay" *ngIf="visible" [@popup]>
      <div class="tutorial-container">
        <p class="tutorial-instruction">{{ currentInstruction }}</p>
        <!-- Show a "Next" button if autoAdvance is false -->
        <button *ngIf="!autoAdvance" class="tutorial-next-btn" (click)="nextStep()">Next</button>
      </div>
    </div>
  `,
  styles: [`
    .tutorial-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.4);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2000;
    }
    .tutorial-container {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      text-align: center;
      max-width: 80%;
    }
    .tutorial-instruction {
      font-size: 1.2rem;
      margin-bottom: 1rem;
    }
    .tutorial-next-btn {
      padding: 0.5rem 1rem;
      font-size: 1rem;
    }
  `],
  animations: [
    trigger('popup', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({ opacity: 0, transform: 'scale(0.8)' }))
      ])
    ])
  ]
})
export class ParsonsTutorialComponent implements OnInit {
  @Input() tutorialSteps: TutorialStep[] = [];
  @Input() autoAdvance: boolean = true; // Set to false if you want manual control via a "Next" button.
  @Output() tutorialComplete = new EventEmitter<void>();

  currentStepIndex = 0;
  currentInstruction = '';
  visible = true;

  ngOnInit(): void {
    this.startTutorial();
  }

  startTutorial(): void {
    if (this.tutorialSteps && this.tutorialSteps.length > 0) {
      this.currentStepIndex = 0;
      this.runCurrentStep();
    } else {
      // If there are no steps, immediately complete the tutorial.
      this.completeTutorial();
    }
  }

  runCurrentStep(): void {
    if (this.currentStepIndex >= this.tutorialSteps.length) {
      this.completeTutorial();
      return;
    }
    const step = this.tutorialSteps[this.currentStepIndex];
    this.currentInstruction = step.instruction;
    const delay = step.delay ?? 2000;
    if (this.autoAdvance) {
      setTimeout(() => {
        step.action();
        this.currentStepIndex++;
        this.runCurrentStep();
      }, delay);
    }
  }

  nextStep(): void {
    // For manual advancement when autoAdvance is false.
    const step = this.tutorialSteps[this.currentStepIndex];
    step.action();
    this.currentStepIndex++;
    this.runCurrentStep();
  }

  completeTutorial(): void {
    this.visible = false;
    this.tutorialComplete.emit();
  }
}
