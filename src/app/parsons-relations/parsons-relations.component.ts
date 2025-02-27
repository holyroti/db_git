import { Component, Input } from '@angular/core';
import { Question } from '../models/question';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-parsons-relations',
  templateUrl: './parsons-relations.component.html',
  styleUrls: ['./parsons-relations.component.css'],
  imports: [CommonModule, FormsModule, DragDropModule],
  standalone: true
})
export class ParsonsRelationsComponent {
  @Input() questions: Question[] = [];
  @Input() currentQuestion: Question | null = null;

  // Add logic for column dragging and dropping here
}
