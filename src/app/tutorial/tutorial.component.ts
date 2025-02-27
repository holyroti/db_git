import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

export interface TutorialStep {
  selector: string;        // CSS selector for the element to highlight
  instruction: string;     // Instruction text to display
  autoDrag?: boolean;      // If true, simulate an auto-drag on that element
}

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.css'],
  standalone: true,
  animations: [
    trigger('popup', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'scale(0.8)' }))
      ])
    ])
  ]
})
export class TutorialComponent implements OnInit {
  @Input() steps: TutorialStep[] = [];
  @Output() tutorialComplete = new EventEmitter<void>();

  currentStepIndex = 0;

  ngOnInit() {
    // Start the tutorial by running the first step
    this.runStep();
  }

  runStep() {
    const step = this.steps[this.currentStepIndex];
    if (step) {
      // If this step is flagged for auto-drag, you might trigger a drag simulation
      if (step.autoDrag) {
        // For this example, we simply add a highlight and you could
        // integrate with the TutorialDragComponent if needed.
        setTimeout(() => {
          this.highlightElement(step.selector);
        }, 500);
      } else {
        this.highlightElement(step.selector);
      }
    }
  }

  highlightElement(selector: string) {
    const element = document.querySelector(selector);
    if (element) {
      element.classList.add('tutorial-highlight');
    }
  }

  resetHighlight(selector: string) {
    const element = document.querySelector(selector);
    if (element) {
      element.classList.remove('tutorial-highlight');
    }
  }

  onNext() {
    // Reset highlight for the current step
    const currentStep = this.steps[this.currentStepIndex];
    if (currentStep) {
      this.resetHighlight(currentStep.selector);
    }
    // Advance to the next step or finish the tutorial
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
      this.runStep();
    } else {
      this.tutorialComplete.emit();
    }
  }
}
