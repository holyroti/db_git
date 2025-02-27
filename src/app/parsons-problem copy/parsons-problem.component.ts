import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { QuestionService } from '../services/question.service';
import { LineItem, Question } from '../models/question';
import { CdkDragDrop, copyArrayItem, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Section } from '../models/Section';

@Component({
  selector: 'app-parsons-problem',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatPaginatorModule,
    MatIconModule,
    ToolbarComponent,
    DragDropModule
  ],
  templateUrl: './parsons-problem.component.html',
  styleUrls: ['./parsons-problem.component.css']
})
export class ParsonsProblemComponent implements OnInit {
  // component properties and methods
// scratch card: https://codepen.io/Totati/pen/pPXrJV
// https://www.youtube.com/watch?v=6AiNn2_J0qI
  public sortedCode: any[] = [];

  username: string = JSON.parse(sessionStorage.getItem('loggedInUser') || '{}').username || 'Guest';
  originalCode: any[] = []; // Immutable copy of the original code for the current question

  questions: Question[] = [];
  currentQuestion: Question | null = null;
  pageSize = 1; // Number of questions per page
  pageIndex = 0; // Current page index
  feedbackMessages: { [codeLineId: number]: string } = {}; // Add feedbackMessages property
  remainingItems: number = 0; // New property to track remaining items

  feedbackGiven: boolean = false;
  progressCalculated: boolean = false; // Tracks whether feedback has been given
  highlightedStatus: { [id: number]: 'correct' | 'incorrect' | 'neutral' } = {}; // Highlighting status by codeLineId
  currentItems: LineItem[] = [];

  progressText: string = ''; // Progress tracker text
  showNextButton: boolean = false; // Controls visibility of the next question button

  selectedQuestionID: number | null = null; // Holds the currently selected question ID

  public correctOrderExplanation: string[] = []; // Array to store explanations for the correct order



  constructor(private router: Router, private http: HttpClient, private questionService: QuestionService) {}


  selectedSection: number = 1; // Default section ID for "1NF Easy"

  sections = [
    { id: 1, name: '1NF Easy' },
    { id: 2, name: '1NF Intermediate' },
    { id: 3, name: '2NF Easy' },
    { id: 4, name: '2NF Intermediate' },
    { id: 5, name: '3NF Easy' },
    { id: 6, name: '3NF Intermediate' },
  ];


  showTable: boolean = false;

  toggleTable() {
    this.showTable = !this.showTable;
  }


  ngOnInit(): void {
    const user = sessionStorage.getItem('loggedInUser');
    if (!user) {
      this.router.navigate(['/']);
      return;
    }
    this.loadQuestionsBySection();
    this.updateRemainingItems(); // Initialize remaining items

   // this.loadQuestions();
    //this.getQuestionsByDifficulty();
    //this.loadSelectedQuestion();
  }

  updateRemainingItems(): void {
    const totalItems = this.currentQuestion?.correctOrder?.length || 0;
    this.remainingItems = totalItems - this.currentItems.length;
  }
  
  loadQuestionsBySection(): void {
    console.log('Selected Section ID:', this.selectedSection);
  
    this.questionService.getQuestionsBySection(this.selectedSection).subscribe({
      next: (questions: any[]) => {
        // Map backend fields to the frontend Question interface
        this.questions = questions.map((q, index) => ({
          question_id: q.QUESTION_ID, // Map QUESTION_ID
          section: `Section ${q.SECTION_ID}`, // Use SECTION_ID as a string representation
          question: `Exercise ${index + 1}`, // Format "Exercise: n"
          hints: q.HINTS || '', // Provide empty string if HINTS is null
          html_content: q.html_content || '', // Sanitize HTML content
          code: [], // Initialize an empty code array
          correctOrder: [], // Initialize an empty correctOrder array
          feedback: [], // Default to an empty array
        }));
  
        console.log('Mapped Questions:', this.questions);
        console.log('HTML Content:', this.currentQuestion?.html_content);

        // Automatically load details of the first question
        if (this.questions.length > 0) {
          this.selectedQuestionID = this.questions[0].question_id; // Set the first question as selected
          this.loadQuestionDetails(this.selectedQuestionID); // Load details of the first question
        } else {
          this.currentQuestion = null;
          console.log('No questions available for the selected section.');
        }
      },
      error: (error) => console.error('Error loading questions by section:', error),
    });
  }

  loadQuestionDetails(questionID: number | null): void {
    if (!questionID) {
      console.error('Invalid question ID:', questionID);
      return;
    }
  
    console.log('Loading question details for ID:', questionID);
  
    this.questionService.getQuestionDetails(questionID).subscribe({
      next: (details: any[]) => {
        if (!details || details.length === 0) {
          console.error('No details returned for the question.');
          return;
        }
  
        const questionData = details[0];
        const codeLines = details.map(item => ({
          codeLineId: item.CODE_LINE_ID,
          text: item.CODE_LINE_TEXT,
        }));
  
        this.currentQuestion = {
          question_id: questionData.QUESTION_ID,
          section: `Section ${questionData.SECTION_ID}`,
          question: questionData.QUESTION,
          hints: questionData.HINTS || '',
          html_content: questionData.HTML_CONTENT || '',
          code: codeLines,
          correctOrder: [],
          feedback: [],
        };
  
        // Backup the original code for reset purposes
        this.originalCode = [...codeLines];
  
        // Fetch correctOrder and explanations
        this.questionService.getCorrectOrderDetails(questionID).subscribe({
          next: (correctOrderDetails) => {
            this.currentQuestion!.correctOrder = correctOrderDetails.map(detail => detail.codeLineId);
            this.correctOrderExplanation = correctOrderDetails.map(detail => detail.explanation);
  
            // Reset puzzle after loading the correctOrder
            this.resetPuzzle();
            this.updateProgress();
          },
          error: (error) => console.error('Error loading correct order details:', error),
        });
  
        // Fetch feedback
        this.questionService.getFeedbackDetails(questionID).subscribe({
          next: (feedbackDetails) => {
            this.currentQuestion!.feedback = feedbackDetails.map(feedback => ({
              codeLineId: feedback.codeLineId,
              text: feedback.feedbackText,
            }));
          },
          error: (error) => console.error('Error loading feedback details:', error),
        });
  
        console.log('Current Question:', this.currentQuestion);
      },
      error: (error) => console.error('Error loading question details:', error),
    });
  }
  
  
  
  getFeedback(): void {
    if (!this.currentQuestion || !this.currentQuestion.correctOrder || !this.currentItems) {
      console.error('No current question, correct order, or items available.');
      return;
    }
  
    const currentItemIds = this.currentItems.map(item => Number(item.codeLineId));
    const correctOrderSet = new Set(this.currentQuestion.correctOrder);
  
    console.log('Expected Correct Order:', Array.from(correctOrderSet));
    console.log('User Order:', currentItemIds);
  
    let correctCount = 0;
    let allCorrect = true;
  
    currentItemIds.forEach(currentId => {
      if (correctOrderSet.has(currentId)) {
        const feedbackEntry = this.currentQuestion!.feedback.find(f => f.codeLineId === currentId);
        this.highlightedStatus[currentId] = 'correct';
        this.feedbackMessages[currentId] = feedbackEntry ? feedbackEntry.text : 'Correct placement!';
        correctCount++; // Increment the count for each correct item
      } else {
        this.highlightedStatus[currentId] = 'incorrect';
        const feedbackEntry = this.currentQuestion!.feedback.find(f => f.codeLineId === currentId);
        this.feedbackMessages[currentId] = feedbackEntry ? feedbackEntry.text : 'Incorrect placement!';
        allCorrect = false; // Mark as incorrect if any item does not belong to the correct set
      }
    });
  
    // Update progress text with the number of correct items
    const totalCorrectOrder = this.currentQuestion.correctOrder.length;
    this.progressText = `Correct:  ${correctCount}/${totalCorrectOrder}`;
  
    // Check if all correct elements are present and there are no incorrect items
    if (allCorrect && currentItemIds.every(id => correctOrderSet.has(id))) {
      console.log('All correct elements are present!');
      this.showNextButton = true; // Show the "Next Question" button
    } else {
      console.log('Some elements are incorrect or missing.');
      this.showNextButton = false; // Hide the "Next Question" button
    }
  
    this.feedbackGiven = true;
    console.log('Feedback Provided:', this.feedbackMessages);
  }
  
  
  
  

  mapSectionToID(section: Section): number {

    return section;
  }

  
  onQuestionChange(): void {
    const selectedQuestion = this.questions[this.pageIndex];
    if (selectedQuestion) {
      this.loadQuestionDetails(selectedQuestion.question_id); // Pass valid questionID
    } else {
      console.error('Selected question not found.');
    }
  }




 
  drop(event: CdkDragDrop<LineItem[]>): void {
    if (!this.currentQuestion) {
      console.error('No current question available.');
      return;
    }
  
    const maxItemsAllowed = this.currentQuestion.correctOrder.length; // Restrict to the correct number of items
  
    if (event.container.id === 'sortableList') {
      // Restrict items in the sortable list
      if (event.container.data.length >= maxItemsAllowed) {
        console.warn('Maximum items reached in sortable list. Cannot add more.');
        return; // Prevent additional items from being added to the sortable list
      }
    }
  
    if (event.previousContainer === event.container) {
      // Reorder items within the same container
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Move the item from one container to another
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  

    
    // Clear feedback if the user changes the list
    if (!this.feedbackGiven) {
      this.highlightedStatus = {}; // Reset highlight status
      this.feedbackMessages = {}; // Clear feedback messages
    }
      this.updateRemainingItems();

    console.log('Updated Trash List:', this.currentQuestion?.code);
    console.log('Updated Sortable List:', this.currentItems);
  }
  


cloneItem(item: LineItem): LineItem {
  // Return a deep clone of the item to ensure no references are shared
  return JSON.parse(JSON.stringify(item));
}

updateProgress(): void {
  console.log("update progress called ");
  if (!this.currentQuestion || !this.currentQuestion.correctOrder) {
    console.error('No current question or correct order data available.');
    this.progressText = 'Correct: 0/0';
    return;
  }

  const totalCorrectOrder = this.currentQuestion.correctOrder.length;
  this.progressText = `Correct: 0/${totalCorrectOrder}`;
  console.log('Updated progress:', this.progressText);
}




navigateToNextQuestion(): void {
  if (this.pageIndex < this.questions.length - 1) {
    this.pageIndex++; // Move to the next question in the section

    const nextQuestionID = this.questions[this.pageIndex].question_id; // Get the next question ID
    console.log(`Navigating to question ID: ${nextQuestionID}`);

    // Update the selected question ID
    this.selectedQuestionID = nextQuestionID;

    // Load the next question details and reset puzzle
    this.loadQuestionDetails(nextQuestionID);

    // Reset state for the new question
    this.showNextButton = false; // Hide the "Next Question" button
    this.feedbackGiven = false; // Reset feedback state
    this.highlightedStatus = {}; // Clear highlighted statuses
    this.feedbackMessages = {}; // Clear feedback messages
    this.currentItems = []; // Clear the sortable area
    this.correctOrderExplanation = []; // Clear previous question explanations

    console.log(`Navigated to question: ${this.pageIndex + 1}`);
  } else {
    console.log("No more questions available.");
  }
}







resetPuzzle(): void {
  if (!this.currentQuestion || !this.currentQuestion.code) {
    console.error("Error: No current question or code available for reset.");
    return;
  }

  console.log("Resetting puzzle for question:", this.currentQuestion);

  // Reset feedback state and highlighted statuses

  this.feedbackGiven = false;
  this.highlightedStatus = {};
  this.feedbackMessages = {}; // Clear feedback messages
  this.updateProgress();  // Reset the Trash List (A) to the shuffled original question code
  this.currentQuestion.code = this.shuffleArray([...this.originalCode]); // Shuffle the original code

  // Clear the Sortable List (B)
  this.currentItems = []; // Clear all dragged items to ensure a reset state

  this.updateRemainingItems();

  // Log the reset state for debugging
  console.log("Trash List reset to:", this.currentQuestion.code);
  console.log("Sortable List cleared:", this.currentItems);
}





shuffleArray(array: any[]): any[] {
  return array
    .map(value => ({ value, sort: Math.random() })) // Assign a random sort value
    .sort((a, b) => a.sort - b.sort) // Sort by the random value
    .map(({ value }) => value); // Extract the original values
}





}






  
  
