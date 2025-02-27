import { Component, Input } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NestedTable } from '../dialogues';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-professor-speech',
  templateUrl: './professor-speech.component.html',
  styleUrls: ['./professor-speech.component.css'],
  standalone: true,
  imports: [DragDropModule, CommonModule] //
})
export class ProfessorSpeechComponent {
  @Input() dialogues: any[] = [];
  @Input() characterImage: string = '';
  @Input() professorName: string = '';

  showProfessorModal = false;
  currentDialogueIndex = 0;

  toggleProfessorModal(): void {
    this.showProfessorModal = !this.showProfessorModal;
    if (this.showProfessorModal) {
      this.currentDialogueIndex = 0; // Reset dialogue when opened
    }
  }

  nextDialogue(): void {
    if (this.currentDialogueIndex < this.dialogues.length - 1) {
      this.currentDialogueIndex++;
    }
  }

  previousDialogue(): void {
    if (this.currentDialogueIndex > 0) {
      this.currentDialogueIndex--;
    }
  }

  get currentDialogue() {
    return this.dialogues[this.currentDialogueIndex];
  }

  isNestedTable(cell: any): cell is NestedTable {
    return cell && Array.isArray(cell.headers) && Array.isArray(cell.rows);
  }
}

  
  
