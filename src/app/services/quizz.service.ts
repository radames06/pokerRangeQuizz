import { Injectable } from '@angular/core';
import { Question } from './question.model';
import { RangesService } from './ranges.service';

@Injectable({ providedIn: 'root' })
export class QuzzService {
    private nbQuestions: number = 5;
    private questions: Question[] = [];

    constructor(private rangesService: RangesService) {}

    
}
