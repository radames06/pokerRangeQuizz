import { Component, OnInit } from '@angular/core';
import { Question } from '../services/question.model';

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.css']
})
export class QuizzComponent implements OnInit {

  private quizzStarted : boolean = false;
  private currentQuestion : number = 0;
  private nbQuestions: number = 5;
  private questions: Question[] = [];

  constructor() { }

  ngOnInit() {
  }

  onStartQuizz() {
    
  }

}
