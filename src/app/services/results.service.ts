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
        var url: string = 'https://eventmanager-492e5.firebaseio.com/quizzresults/' + encodeURIComponent(this.authService.userMail.toString().replace('.', '').replace('@', '')) + '.json';
        let httpParams = new HttpParams().set('auth', this.authService.token);
        this.http.patch(url, this.getResultJson(result, saveDate), { params: httpParams })
            .subscribe((response: Object) => {
                //
            },
                error => {
                    console.log("Save Result Error");
                    console.log(error);
                });

        var url: string = 'https://eventmanager-492e5.firebaseio.com/quizzquestions/' + encodeURIComponent(this.authService.userMail.toString().replace('.', '').replace('@', '')) + '.json';
        this.http.patch(url, this.getQuestionsJson(questions, saveDate), { params: httpParams })
            .subscribe((response: Object) => {
                //
            },
                error => {
                    console.log("Save Question Error");
                    console.log(error);
                });

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
            encodeURIComponent(this.authService.userMail.toString().replace('.', '').replace('@', '')) + '.json';
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
                    console.log(this.quizzList);
                }
            })

        this.questions = new Map();
        var url: string = 'https://eventmanager-492e5.firebaseio.com/quizzquestions/' +
            encodeURIComponent(this.authService.userMail.toString().replace('.', '').replace('@', '')) + '.json';
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
                        for(var question of item) {
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
