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

  range: Map<String, RangeVal>;
  rangeName: String;
  rangeText: String;
  rangeTable: String[][];
  rangeNumRows: number;
  rangeNumCols: number;
  rangeRows: number[];
  rangeCols: number[];
  submitErrors: String[];
  submitSuccess: String;
  savedRanges: RangePoker[] = [];

  subscription: Subscription;
  subscriptionSaved: Subscription;

  constructor(private rangeService: RangesService) { }

  onSubmit() {
    this.submitErrors = [];
    this.submitSuccess = "";
    this.rangeService.initRange();
    this.parseRange();
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

  parseRange() {
    var rangeItems = this.rangeText.split(',');
    var rangeSimplifiee: String[] = [];

    // Création d'une range avec seulement des mains simples
    rangeItems.forEach((item) => {
      // Cas des ranges TT+
      if (item.indexOf('+') >= 0) {
        console.log("item +");
        var hand = item.substr(0, item.indexOf('+'));
        if (this.range.has(hand) && item.length == hand.length +1) {
          // item bien formaté
          var handCoords = this.rangeService.getRangeCoords(hand);
          if (hand.length == 2) {
            // cas des paires
            for (var i = handCoords[1] ; i <= 14 ; i++) {
              rangeSimplifiee.push(this.rangeTable[14-i][14-i]);
            }
          } else if (hand.substr(2,1) == 's') {
            // cas des Suited - [T8s+] - coords [10,8] --> ajouter [10,8], [10,7], [10,6], etc...
            for (var i = handCoords[0] ; i > handCoords[1] ; i--) {
              rangeSimplifiee.push(this.rangeTable[14-handCoords[0]][15-i]);
            }
          } else if (hand.substr(2,1) == 'o') {
            // cas des offsuit
            for (var i = handCoords[1] ; i > handCoords[0] ; i--) {
              rangeSimplifiee.push(this.rangeTable[15-i][14-handCoords[1]]);
            }
          } else {
            this.submitErrors.push('Definition incorrecte : ' + item);
          }
        } else {
          this.submitErrors.push('Definition incorrecte : ' + item);
        }
      }
      // Cas des ranges ATo-A5o
      else if (item.indexOf('-') >= 0) {
      }
      // Cas des mains uniques
      else {
        console.log("item hand");
        if (this.range.has(item)) {
          rangeSimplifiee.push(item);
        } else {
          this.submitErrors.push('Definition incorrecte : ' + item);
        }

      }
    });

    // Mise à jour de la range
    rangeSimplifiee.forEach((item) => {
        this.rangeService.updateRatio(item, 1);
    });
  }

  ngOnInit() {
    this.subscription = this.rangeService.rangeChanged.subscribe((range: RangePoker) => {
      this.range = range.getMap();
    })
    this.subscriptionSaved = this.rangeService.savedRangesChanged.subscribe((rangeList: RangePoker[]) => {
      this.savedRanges = rangeList;
    })
    this.rangeService.initRange();
    this.rangeTable = this.rangeService.getTable();
    this.rangeNumRows = this.rangeTable.length;
    this.rangeNumCols = this.rangeTable[1].length;
    
    this.rangeRows = Array(this.rangeNumRows).fill(this.rangeNumRows).map((x, i) => i);
    this.rangeCols = Array(this.rangeNumCols).fill(this.rangeNumCols).map((x, i) => i);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscriptionSaved.unsubscribe();
  }

}
