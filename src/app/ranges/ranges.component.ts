import { Component, OnInit } from '@angular/core';
import { RangesService } from '../services/ranges.service';
import { RangePoker } from '../services/range.poker.model';
import { Subscription } from 'rxjs';
import { RangeVal } from '../services/range.val.model';
import { Card } from '../services/question.model';

@Component({
  selector: 'app-ranges',
  templateUrl: './ranges.component.html',
  styleUrls: ['./ranges.component.css']
})
export class RangesComponent implements OnInit {

  private range: Map<String, RangeVal>;
  private rangeName: String;
  private rangeText: String;
  private rangeTable: String[][];
  private rangeNumRows: number;
  private rangeNumCols: number;
  private rangeRows: number[];
  private rangeCols: number[];
  private submitErrors: String[];
  private submitSuccess: String;
  private savedRanges: RangePoker[] = [];

  subscriptionRange: Subscription;
  subscriptionSaved: Subscription;

  constructor(private rangeService: RangesService) { }

  onSubmit() {
    this.submitSuccess = "";
    this.submitErrors = this.rangeService.parseRange(this.rangeText);
    if (this.submitErrors.length == 0) this.submitSuccess = new String("Range ok");
  }
  onSave() {
    this.rangeService.saveRange(this.rangeName);
  }
  onLoad(i: number) {
    this.rangeService.loadRange(i);
  }
  onDelete(i: number) {
    this.rangeService.deleteRange(i);
  }

  ngOnInit() {
    this.rangeService.loadRangesOnInit();
    console.log("RangesComponent ngOnInit");
    this.rangeTable = this.rangeService.getTable();
    this.rangeNumRows = this.rangeTable.length;
    this.rangeNumCols = this.rangeTable[1].length;
    
    this.rangeRows = Array(this.rangeNumRows).fill(this.rangeNumRows).map((x, i) => i);
    this.rangeCols = Array(this.rangeNumCols).fill(this.rangeNumCols).map((x, i) => i);
    this.subscriptionRange = this.rangeService.rangeChanged.subscribe((range: RangePoker) => {
      this.range = range.getMap();
      this.rangeName = range.getName();
      this.rangeText = range.getOriginalText();
    })
    this.subscriptionSaved = this.rangeService.savedRangesChanged.subscribe((rangeList: RangePoker[]) => {
      this.savedRanges = rangeList;
    })
  }
  ngOnDestroy() {
    this.subscriptionRange.unsubscribe();
    this.subscriptionSaved.unsubscribe();
  }

}
