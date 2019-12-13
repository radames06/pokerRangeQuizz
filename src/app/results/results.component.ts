import { Component, OnInit } from '@angular/core';
import { ResultsService, Result } from '../services/results.service';
import { Subscription } from 'rxjs';
import { Question } from '../services/question.model';
import { RangePoker } from '../services/range.poker.model';
import { RangesService } from '../services/ranges.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  private results: Result[]; // tous les résultats des quizz {date, range, ok, ko}
  totalResult: { ok: number, ko: number };
  quizzList: Date[]; // liste des dates des quizz
  private questionsList: Map<number, Question[]>; // liste des questions (incl. résultat) par quizz (identifié par une date)
  private subscriptionResult: Subscription;
  private subscriptionQuizzList: Subscription;
  private subscriptionQuestions: Subscription;
  private quizzChecked: boolean[]; // liste des quizz selectionnés
  displayedRangeResults: Map<String, { nbOk: number, nbKo: number }> = new Map();
  selectedRange: String;
  private savedRanges: RangePoker[];
  private rangePoker: RangePoker;
  private resultStyles: Object[][];
  private tipContent: String[][];
  private questionsResultMap: Map<String, { ok: number, ko: number }>;

  rangeTable: String[][];
  rangeNumRows: number;
  rangeNumCols: number;
  rangeRows: number[];
  rangeCols: number[];


  constructor(private resultsService: ResultsService, private rangeService: RangesService) { }

  ngOnInit() {
    this.subscriptionResult = this.resultsService.resultsChanged.subscribe((resultsList: Result[]) => {
      this.results = resultsList;
    })
    this.subscriptionQuizzList = this.resultsService.quizzListChanged.subscribe((quizzList: Date[]) => {
      this.quizzList = quizzList.sort((a: Date, b: Date) => { return a.getTime() - b.getTime() });
      this.selectAll(false);
    })

    this.rangeTable = this.rangeService.getTable();
    this.rangeNumRows = this.rangeTable.length;
    this.rangeNumCols = this.rangeTable[1].length;

    this.rangeRows = Array(this.rangeNumRows).fill(this.rangeNumRows).map((x, i) => i);
    this.rangeCols = Array(this.rangeNumCols).fill(this.rangeNumCols).map((x, i) => i);

    this.subscriptionQuestions = this.resultsService.questionsChanged.subscribe((questionsList: Map<number, Question[]>) => {
      this.questionsList = questionsList;
    })

    this.resultsService.loadResults();
    this.savedRanges = this.rangeService.getSavedRanges();
    this.rangePoker = new RangePoker();
    this.resultStyles = Array(this.rangeNumRows).fill(this.rangeNumRows).map((x, i) => Array(this.rangeNumCols).fill(this.rangeNumCols));
    this.tipContent = Array(this.rangeNumRows).fill(this.rangeNumRows).map((x, i) => Array(this.rangeNumCols).fill(this.rangeNumCols));
  }

  ngOnDestroy() {
    this.subscriptionResult.unsubscribe();
    this.subscriptionQuestions.unsubscribe();
    this.subscriptionQuizzList.unsubscribe();
  }

  selectAll(value: boolean) {
    this.quizzChecked = Array(this.quizzList.length).fill(value);
  }

  onUpdateResults() {
    this.displayedRangeResults = new Map();
    this.totalResult = {ok: 0, ko: 0};
    this.results.forEach(item => {
      if (this.quizzChecked[this.quizzList.map(Number).indexOf(+item.getDate())]) {
        if (this.displayedRangeResults.has(item.getRange())) {
          var nbOk = this.displayedRangeResults.get(item.getRange()).nbOk;
          var nbKo = this.displayedRangeResults.get(item.getRange()).nbKo;
          this.displayedRangeResults.set(item.getRange(), { nbOk: nbOk + item.getOk(), nbKo: nbKo + item.getKo() });
        } else {
          this.displayedRangeResults.set(item.getRange(), { nbOk: item.getOk(), nbKo: item.getKo() });
        }
        this.totalResult.ok += item.getOk();
        this.totalResult.ko += item.getKo();
      }
    })
  }

  getResultStyle() {
    for (var row in this.rangeRows) {
      for (var col in this.rangeCols) {
        // calcul du ratio
        var result: number = 0.0;
        if (this.questionsResultMap.has(this.rangeService.getTable()[row][col])) {
          var ok = this.questionsResultMap.get(this.rangeService.getTable()[row][col]).ok;
          var ko = this.questionsResultMap.get(this.rangeService.getTable()[row][col]).ko;
          result = ok / (ok + ko);
          this.tipContent[row][col] = "ok: " + ok + " / total: " + (ok+ko);
        } else {
          result = -1;
          this.tipContent[row][col] = "";
        }
        // la main est-elle dans la range ? 
        if (this.rangePoker.getMap().get(this.rangeService.getTable()[row][col]).getRatio() == 1) {
          this.resultStyles[row][col] = { 'font-weight': 'bold', 'background-color': this.getRGB(result) };
        } else {
          this.resultStyles[row][col] = { 'font-weight': 'normal', 'background-color': this.getRGB(result) };
        }
        
      }
    }
  }

  onRangeSelect(rangeName: String) {
    this.savedRanges.forEach(range => {
      if (range.getName() == rangeName) {
        this.rangePoker = range;
      }
    })

    this.questionsResultMap = new Map();
    for (var i = 0; i < this.quizzList.length; i++) { // pour chaque quizz
      if (this.quizzChecked[i]) {                 // si le quizz est coché
        for (let question of this.questionsList.get(this.quizzList[i].getTime())) { // pour chaque question du quizz
          if (question.getRange() == rangeName) {  // si la question est dans la range selectionnée
            if (this.questionsResultMap.has(question.getCardsFormatted())) {
              var nbOk = this.questionsResultMap.get(question.getCardsFormatted()).ok;
              nbOk += question.getResult() ? 1 : 0;
              var nbKo = this.questionsResultMap.get(question.getCardsFormatted()).ko;
              nbKo += question.getResult() ? 0 : 1;
            } else {
              var nbOk = question.getResult() ? 1 : 0;
              var nbKo = question.getResult() ? 0 : 1;
            }
            this.questionsResultMap.set(question.getCardsFormatted(), { ok: nbOk, ko: nbKo });
          }
        }
      }
    }

    this.getResultStyle();
  }

  onDeleteResult(i: number) {
    this.resultsService.deleteResult(this.quizzList[i]);
  }

  getRGB(ratio: number) {
    var ko = { r: 217, g: 75, b: 28 };
    var ok = { r: 90, g: 224, b: 103 };

    var r = ko.r + (ok.r - ko.r) * ratio;
    var g = ko.g + (ok.g - ko.g) * ratio;
    var b = ko.b + (ok.b - ko.b) * ratio;

    return (ratio == -1 ? "rgb(255,255,255)" : "rgb(" + r + "," + g + "," + b + ")");
  }
  getDisplayResults() {
    return this.displayedRangeResults.size>0;
  }
}

