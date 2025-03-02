import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionService } from '../services/question.service';
import { Question } from '../models/question';
import { ParsonsEasyComponent } from '../parsons-easy/parsons-easy.component';
import { ParsonsColumnsComponent } from '../parsons-columns/parsons-columns.component';
import { ParsonsRelationsComponent } from '../parsons-relations/parsons-relations.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { BlankComponent } from '../blank-parsons/blank-parsons.component';
import { VisualNovelComponent } from '../visual-novel/visual-novel.component';
@Component({
  selector: 'app-parsons-problem',
  templateUrl: './parsons-problem.component.html',
  styleUrls: ['./parsons-problem.component.css'],
  standalone: true,
  imports: [ParsonsEasyComponent, ParsonsColumnsComponent, CommonModule, FormsModule, DragDropModule, ToolbarComponent, BlankComponent, VisualNovelComponent ], // No need for `providers` here
  
})
export class ParsonsProblemComponent implements OnInit {
  username: string = JSON.parse(sessionStorage.getItem('loggedInUser') || '{}').username || 'Guest';
  selectedSection: number = 1; // Default section
  questions: Question[] = [];
  selectedQuestionId: number | null = null; // Pass questionId instead of full question
  stage: number = 1; // 1 = Component 1 (0-1NF), 2 = Component 2 (1-2NF)

  showSummary: boolean = true;
  constructor(private questionService: QuestionService) {}
  stages: string[] = ['Stage 1: 0NF to 1NF', 'Stage 2: 1NF to 2NF', 'Stage 3: 2NF to 3NF', 'Stage 4: Summary'];

  ngOnInit(): void {
    this.selectedQuestionId = 1;
  }

 
  handleNextQuestion(newQuestionId: number) {
    // newQuestionId is now correctly typed as a number.
    this.selectedQuestionId = newQuestionId;
    // Reset the stage back to 1.
    this.stage = 1;
  }
  
  
  nextStage(): void {
    if (this.stage < 4) {
      this.stage++;
    } else {
      console.log('All stages completed!');
      this.showSummary = true;
    }
  }

  closeSummary(){
    this.showSummary = false;
  }
}
