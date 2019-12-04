import { Component, OnInit } from '@angular/core';
import { Question } from '../services/question.model';
import { RangesService } from '../services/ranges.service';
import { ResultsService } from '../services/results.service';
import { RangePoker } from '../services/range.poker.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.css']
})
export class QuizzComponent implements OnInit {

  quizzStarted: boolean = false;
  private currentQuestion: Question;
  private questions: Question[];
  private results: Map<String, { ok: number, ko: number }> = new Map();
  private totalResults: { ok: number, ko: number } = { ok: 0, ko: 0 };
  ranges: RangePoker[]; // Liste de toutes les ranges disponibles
  rangeChecked: boolean[]; // Liste des ranges cochées sur le quizz
  private rangeList: String[]; // Liste des ranges selectionnées

  constructor(private rangesService: RangesService, private resultsSerivce: ResultsService) { }

  ngOnInit() {
    this.ranges = this.rangesService.getSavedRanges();
    this.selectAll(false);
  }

  selectAll(value: boolean) {
    this.rangeChecked = Array(this.ranges.length).fill(value);
  }

  onStartQuizz() {
    this.initRangeList();
    this.questions = [];
    this.nextQuestion();
    this.quizzStarted = true;
    this.results = new Map();
    this.totalResults = { ok: 0, ko: 0 };
    this.rangeList.forEach(range => {
      this.results.set(range, { ok: 0, ko: 0 })
    });
    //this.rangeList = Array.from(this.results.keys());
  }

  initRangeList() {
    this.rangeList = [];
    for (var i=0; i<this.ranges.length; i++) {
      if (this.rangeChecked[i]) {
        this.rangeList.push(this.ranges[i].getName());
      }
    }
  }

  nextQuestion() {
    var range = this.getRandomRange();
    this.currentQuestion = new Question(range);
    this.currentQuestion.setCorrectAnswer((this.rangesService.getRangeByName(range).getMap().get(this.currentQuestion.getCardsFormatted()).getRatio() == 1));
  }

  getRandomRange() { // OK
    console.log("getRandomRange");
    console.log(this.rangeList.length);
    var rndId = Math.floor(Math.random() * this.rangeList.length);
    console.log(rndId);
    return this.rangeList[rndId];
  }

  validResults() {
    switch (this.currentQuestion.getResult()) {
      case true:
        this.results.get(this.currentQuestion.getRange()).ok++;
        this.totalResults.ok++;
        break;
      default:
        this.results.get(this.currentQuestion.getRange()).ko++;
        this.totalResults.ko++;
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
