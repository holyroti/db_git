import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
// Remove the hardcoded import of EasyGameTutorialComponent if not needed.
// You can support content projection instead.

@Component({
  selector: 'app-app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-modal.component.html',
  styleUrls: ['./app-modal.component.css']
})
export class AppModalComponent {
  @Input() titleInstruction: string = ''; // Title for Instruction Modal
  @Input() contentInstruction: string = ''; // Content for Instruction Modal
  @Input() showModalInstruction: boolean = false; // Flag for Instruction Modal

  @Input() titleSummary: string = ''; // Title for Summary Modal
  @Input() contentSummary: string = ''; // Content for Summary Modal
  @Input() showModalSummary: boolean = false; // Flag for Summary Modal

  // Game modal inputs/outputs
  @Input() titleGame: string = 'Game Tutorial';
  @Input() showModalGame: boolean = false;
  @Output() closeModalGame = new EventEmitter<void>();

  @Output() closeModalInstruction = new EventEmitter<void>();
  @Output() closeModalSummary = new EventEmitter<void>();

  constructor() {}

  closeGame(): void {
    this.closeModalGame.emit();
  }

  closeInstruction(): void {
    this.closeModalInstruction.emit();
  }

  toggleModalInstruction(): void {
    this.showModalInstruction = !this.showModalInstruction;
  }

  closeSummary(): void {
    this.closeModalSummary.emit();
  }
}
