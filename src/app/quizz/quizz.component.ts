import { Component, OnInit } from '@angular/core';
import { Question } from '../services/question.model';
import { RangesService } from '../services/ranges.service';
import { ResultsService } from '../services/results.service';

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.css']
})
export class QuizzComponent implements OnInit {

  private quizzStarted: boolean = false;
  private currentQuestion: Question;
  private questions: Question[];
  private results: Map<String, { ok: number, ko: number }> = new Map();
  private rangeList: String[];

  constructor(private rangesService: RangesService, private resultsSerivce: ResultsService) { }

  ngOnInit() {
  }

  onStartQuizz() {
    this.questions = [];
    this.nextQuestion();
    this.quizzStarted = true;
    this.results = new Map();
    this.rangesService.getSavedRanges().forEach(range => {
      this.results.set(range.getName(), {ok: 0, ko: 0})
    });
    this.rangeList = Array.from(this.results.keys());
  }
  nextQuestion() {
    var range = this.rangesService.getRandomRange();
    this.currentQuestion = new Question(range.getName());
    this.currentQuestion.setCorrectAnswer((range.getMap().get(this.currentQuestion.getCardsFormatted()).getRatio() == 1));
  }
  validResults() {
    switch (this.currentQuestion.getResult()) {
      case true:
        this.results.get(this.currentQuestion.getRange()).ok++;
        break;
      default:
        this.results.get(this.currentQuestion.getRange()).ko++;
        break;
    }
  }

  inRange() {
    this.currentQuestion.setAnswer(true);
    this.validResults();
    this.questions.unshift(this.currentQuestion);
    this.nextQuestion();
  }
  outRange() {
    this.currentQuestion.setAnswer(false);
    this.validResults();
    this.questions.unshift(this.currentQuestion);
    this.nextQuestion();
  }
  onStopQuizz() {
    this.quizzStarted = false;
    this.resultsSerivce.saveResult(this.results, this.questions);
  }
}
