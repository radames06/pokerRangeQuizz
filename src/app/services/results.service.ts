import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Subject } from 'rxjs';
import { Question } from './question.model';

@Injectable({ providedIn: 'root' })
export class ResultsService {

    private results: Result[] = [];
    private questions: Map<number, Question[]> = new Map();
    private quizzList: Date[] = [];
    resultsChanged = new Subject<Result[]>();
    questionsChanged = new Subject<Map<number, Question[]>>();
    quizzListChanged = new Subject<Date[]>();

    constructor(private http: HttpClient, private authService: AuthService) { }

    saveResult(result: Map<String, { ok: number, ko: number }>, questions: Question[]) {
        console.log("Save result of Quizz");
        var saveDate: Date = new Date();
        var url: string = 'https://eventmanager-492e5.firebaseio.com/quizzresults/' + encodeURIComponent(this.authService.userMail.toString().replace(/\./gi, '').replace('@', '')) + '.json';
        let httpParams = new HttpParams().set('auth', this.authService.token);
        this.http.patch(url, this.getResultJson(result, saveDate), { params: httpParams })
            .subscribe((response: Object) => {
                this.addResults(result, saveDate);
                this.resultsChanged.next(this.results);
            },
                error => {
                    console.log("Save Result Error");
                    console.log(error);
                });

        var url: string = 'https://eventmanager-492e5.firebaseio.com/quizzquestions/' + encodeURIComponent(this.authService.userMail.toString().replace(/\./gi, '').replace('@', '')) + '.json';
        this.http.patch(url, this.getQuestionsJson(questions, saveDate), { params: httpParams })
            .subscribe((response: Object) => {
                this.addQuestions(questions, saveDate);
                this.refreshQuizzList();
                this.questionsChanged.next(this.questions);
                this.quizzListChanged.next(this.quizzList);
            },
                error => {
                    console.log("Save Question Error");
                    console.log(error);
                });
    }
    deleteResult(quizz: Date) {
        console.log("deleteResult");
        var url: string = 'https://eventmanager-492e5.firebaseio.com/quizzresults/' +
            encodeURIComponent(this.authService.userMail.toString().replace(/\./gi, '').replace('@', '')) + '/' +
            encodeURIComponent(quizz.toString()) + '.json';
        let httpParams = new HttpParams().set('auth', this.authService.token);
        this.http.delete(url, { params: httpParams })
            .subscribe((response: string) => {
                this.removeResultFromArray(quizz);
                this.resultsChanged.next(this.results);
            });

        var url: string = 'https://eventmanager-492e5.firebaseio.com/quizzquestions/' +
            encodeURIComponent(this.authService.userMail.toString().replace(/\./gi, '').replace('@', '')) + '/' +
            encodeURIComponent(quizz.toString()) + '.json';
        this.http.delete(url, { params: httpParams })
            .subscribe((response: string) => {
                this.questions.delete(quizz.getTime());
                this.refreshQuizzList();
                this.questionsChanged.next(this.questions);
                this.quizzListChanged.next(this.quizzList);
            });
    }

    addResults(newResults: Map<String, { ok: number, ko: number}>, saveDate: Date) {
        newResults.forEach((value, key) => {
            this.results.push(new Result(saveDate, key, value.ok, value.ok))
        })
    }
    addQuestions(newQuestions: Question[], saveDate: Date) {
        this.questions.set(saveDate.getTime(), newQuestions);
    }
    refreshQuizzList() {
        var newQuizzList: Date[] = [];
        this.questions.forEach((value, key) => {
            newQuizzList.push(new Date(key));
        })
        this.quizzList = newQuizzList;
    }
    removeResultFromArray(quizz: Date) {
        var newResults: Result[] = [];
        this.results.forEach(item => {
            //console.log(item);
            if (item.getDate().getTime() != quizz.getTime()) {
                newResults.push(item);
            }
        })
        this.results = newResults;
    }

    public getResultJson(result: Map<String, { ok: number, ko: number }>, saveDate: Date) {
        var resultJson: String = JSON.stringify([...result]);
        return JSON.stringify({ [saveDate.toString()]: { resultJson } })
    }
    public getQuestionsJson(questions: Question[], saveDate: Date) {
        var questionsJson: String = JSON.stringify(questions);
        return JSON.stringify({ [saveDate.toString()]: { questionsJson } });
    }

    public loadResults() {
        this.results = [];
        this.quizzList = [];
        var url: string = 'https://eventmanager-492e5.firebaseio.com/quizzresults/' +
            encodeURIComponent(this.authService.userMail.toString().replace(/\./gi, '').replace('@', '')) + '.json';
        let httpParams = new HttpParams().set('auth', this.authService.token);
        this.http.get(url, { params: httpParams })
            .subscribe((response: any) => {
                if (response) {
                    Object.keys(response).forEach((item: String) => {
                        var quizzDate = new Date(item.toString());
                        var quizz: Map<String, { ok: number, ko: number }>;
                        quizz = new Map(JSON.parse(response[item.toString()]['resultJson']));
                        quizz.forEach((range, key) => {
                            this.results.push(new Result(quizzDate, key, range.ok, range.ko));
                        });
                        this.quizzList.push(quizzDate);
                    })
                    this.resultsChanged.next(this.results);
                    this.quizzListChanged.next(this.quizzList);
                } else {
                    this.results = [];
                    this.quizzList = [];
                    this.resultsChanged.next(this.results);
                    this.quizzListChanged.next(this.quizzList);
                }
            })

        this.questions = new Map();
        var url: string = 'https://eventmanager-492e5.firebaseio.com/quizzquestions/' +
            encodeURIComponent(this.authService.userMail.toString().replace(/\./gi, '').replace('@', '')) + '.json';
        this.http.get(url, { params: httpParams })
            .subscribe((response: any) => {
                if (response) {
                    var localQuestion: Map<number, Question[]> = new Map();
                    Object.keys(response).forEach((item: String) => {
                        var quizzDate = new Date(item.toString());
                        localQuestion.set(quizzDate.getTime(), JSON.parse(response[item.toString()]['questionsJson']));
                    })
                    localQuestion.forEach((item: Question[], key: number) => {
                        var newQuestionArray: Question[] = [];
                        for (var question of item) {
                            var newQuestion = new Question('tmp');
                            newQuestion.fillFromObject(question);
                            newQuestionArray.push(newQuestion);
                        }
                        this.questions.set(key, newQuestionArray);
                    })
                    this.questionsChanged.next(this.questions);
                } else {
                    this.questions = new Map();
                    this.questionsChanged.next(this.questions);
                }
            })

    }
}

export class Result {
    private date: Date;
    private range: String;
    private ok: number;
    private ko: number;

    constructor(date: Date, range: String, ok: number, ko: number) {
        this.date = date;
        this.range = range;
        this.ok = ok;
        this.ko = ko;
    }

    public getDate() { return this.date; }
    public getRange() { return this.range; }
    public getOk() { return this.ok; }
    public getKo() { return this.ko; }
}
