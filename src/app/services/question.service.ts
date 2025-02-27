import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question } from '../models/question';
import { columnQuestion, TwoNFTable } from '../models/columnQuestion';
import { BlankColumn, BlankFeedback, BlankQuestion, BlankTable } from '../models/BlankModel';

export interface ColumnQuestionsResponse {
  success: boolean;
  data: columnQuestion[];
}


@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private apiUrl = 'http://localhost:3000/api'; // Update with your backend URL

  constructor(private http: HttpClient) {}

  getTwoNFData(questionId: number): Observable<{ success: boolean; data: TwoNFTable[] }> {
    return this.http.get<{ success: boolean; data: TwoNFTable[] }>(
      `${this.apiUrl}/questions/${questionId}/two-nf`
    );
  }
  
  /**
   * Fetch all questions by section ID
   */
  getQuestionsBySection(sectionID: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/questions/section/${sectionID}`);
  }

  /**
   * Fetch specific question details by question ID
   */
  getQuestionDetails(questionID: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/questions/${questionID}`);
  }

  getFeedbackAndCorrectOrder(questionID: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/feedback/${questionID}`);
  }
  
  getCorrectOrderDetails(questionID: number): Observable<{ codeLineId: number; explanation: string }[]> {
    return this.http.get<{ codeLineId: number; explanation: string }[]>(
      `${this.apiUrl}/questions/correct-order/${questionID}`
    );
  }
  
  getFeedbackDetails(questionID: number): Observable<{ codeLineId: number; feedbackText: string }[]> {
    return this.http.get<{ codeLineId: number; feedbackText: string }[]>(
      `${this.apiUrl}/questions/feedback/${questionID}`
    );
  }

  getColumnQuestionById(questionId: number): Observable<{ success: boolean; data: columnQuestion }> {
    return this.http.get<{ success: boolean; data: columnQuestion }>(`${this.apiUrl}/questions/column-questions/${questionId}`);
  }
  // getColumnQuestions(): Observable<{ success: boolean; data: columnQuestion[] }> {
  //   return this.http.get<{ success: boolean; data: columnQuestion[] }>(`${this.apiUrl}/questions/column-questions`);
  // }

  getBlankQuestions(): Observable<{ success: boolean; data: any[] }> {
    return this.http.get<{ success: boolean; data: any[] }>(`${this.apiUrl}/questions/blank-questions`);
  }


  getBlankDetails(questionId: number): Observable<{
    success: boolean;
    data: {
      tables: BlankTable[];
      feedback: BlankFeedback[];
      columns: BlankColumn[];
    };
  }> {
    return this.http.get<{
      success: boolean;
      data: {
        tables: BlankTable[];
        feedback: BlankFeedback[];
        columns: BlankColumn[];
      };
    }>(`${this.apiUrl}/questions/${questionId}/blank-details`);
  }

  // QuestionService (frontend)

getBlankQuestionByID(questionId: number): Observable<{
  success: boolean;
  data: {
    question: BlankQuestion;
    tables: BlankTable[];
    columns: BlankColumn[];
    feedback: BlankFeedback[];
  };
}> {
  return this.http.get<{
    success: boolean;
    data: {
      question: BlankQuestion;
      tables: BlankTable[];
      columns: BlankColumn[];
      feedback: BlankFeedback[];
    };
  }>(`${this.apiUrl}/questions/${questionId}/blank-question`);
}

}
