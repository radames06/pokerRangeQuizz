import { Component, OnInit } from '@angular/core';
import { Question } from '../services/question.model';
import { RangesService } from '../services/ranges.service';

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.css']
})
export class QuizzComponent implements OnInit {

  private quizzStarted : boolean = false;
  private currentQuestion : number = 0;
  private nbQuestions: number = 5;
  private questions: Question[];

  constructor(private rangesService: RangesService) { }

  ngOnInit() {
  }

  onStartQuizz() {
    this.questions = [];
    for (var i:number = 0 ; i< this.nbQuestions ; i++) {
      var range = this.rangesService.getRandomRange();
      this.questions.push(new Question(range.getName()));
      this.questions[i].setCorrectAnswer((range.getMap().get(this.questions[i].getCardsFormatted()).getRatio() == 1));
    }

    this.quizzStarted = true;
    this.currentQuestion = 0;
  }
  inRange() {
    this.questions[this.currentQuestion].setAnswer(true);
    this.currentQuestion++;
  }
  outRange() {
    this.questions[this.currentQuestion].setAnswer(false);
    this.currentQuestion++;
  }


}
