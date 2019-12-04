import { Injectable } from '@angular/core';
import { RangePoker, rangeFormatted } from './range.poker.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { RangeVal } from './range.val.model';

@Injectable({ providedIn: 'root' })
export class RangesService {

    private rangeTable: String[][] = [
        ['AA', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s'],
        ['AKo', 'KK', 'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s', 'K3s', 'K2s'],
        ['AQo', 'KQo', 'QQ', 'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s', 'Q6s', 'Q5s', 'Q4s', 'Q3s', 'Q2s'],
        ['AJo', 'KJo', 'QJo', 'JJ', 'JTs', 'J9s', 'J8s', 'J7s', 'J6s', 'J5s', 'J4s', 'J3s', 'J2s'],
        ['ATo', 'KTo', 'QTo', 'JTo', 'TT', 'T9s', 'T8s', 'T7s', 'T6s', 'T5s', 'T4s', 'T3s', 'T2s'],
        ['A9o', 'K9o', 'Q9o', 'J9o', 'T9o', '99', '98s', '97s', '96s', '95s', '94s', '93s', '92s'],
        ['A8o', 'K8o', 'Q8o', 'J8o', 'T8o', '98o', '88', '87s', '86s', '85s', '84s', '83s', '82s'],
        ['A7o', 'K7o', 'Q7o', 'J7o', 'T7o', '97o', '87o', '77', '76s', '75s', '74s', '73s', '72s'],
        ['A6o', 'K6o', 'Q6o', 'J6o', 'T6o', '96o', '86o', '76o', '66', '65s', '64s', '63s', '62s'],
        ['A5o', 'K5o', 'Q5o', 'J5o', 'T5o', '95o', '85o', '75o', '65o', '55', '54s', '53s', '52s'],
        ['A4o', 'K4o', 'Q4o', 'J4o', 'T4o', '94o', '84o', '74o', '64o', '54o', '44', '43s', '42s'],
        ['A3o', 'K3o', 'Q3o', 'J3o', 'T3o', '93o', '83o', '73o', '63o', '53o', '43o', '33', '32s'],
        ['A2o', 'K2o', 'Q2o', 'J2o', 'T2o', '92o', '82o', '72o', '62o', '52o', '42o', '32o', '22']
    ]

    private range: RangePoker = new RangePoker();
    private savedRanges: RangePoker[] = [];
    rangeChanged = new Subject<RangePoker>();
    savedRangesChanged = new Subject<RangePoker[]>();

    constructor(private http: HttpClient, private authService: AuthService) {
        console.log("rangeService constructor");
    }

    loadRangesOnInit() {
        console.log("rangeService loadRangesOnInit");

        this.savedRanges = [];
        this.range = new RangePoker();
        
        var url: string = 'https://eventmanager-492e5.firebaseio.com/ranges/' +
            encodeURIComponent(this.authService.userMail.toString().replace('.', '').replace('@', '')) + '.json';

        let httpParams = new HttpParams().set('auth', this.authService.token);

        this.http.get(url, { params: httpParams })
            .subscribe((response: any) => {
                if (response) {
                    Object.keys(response).forEach(item => {
                        this.range = new RangePoker();
                        this.range.setOwner(this.authService.userMail);
                        this.range.setName(item);
                        this.range.setOriginalText(response[item]['originalText']);
                        this.parseRange(response[item]['originalText']);
                        this.savedRanges.push(this.range.getClone());
                    })
                } else {
                    this.range = new RangePoker();
                    this.range.setName('Enter a name');
                    this.range.setOwner(this.authService.userMail);
                }
                this.savedRangesChanged.next(this.savedRanges);
                this.rangeChanged.next(this.range);
            })
    }

    updateRatio(hand: String, ratio: number) { // OK
        this.range.setRatio(hand, ratio);
        this.rangeChanged.next(this.range);
    }
    getRangeCoords(hand: String) { // OK
        // [32s]=[32] - [32o]=[23]
        if (hand.length == 2) return [this.getCardNumber(hand.substr(0, 1)), this.getCardNumber(hand.substr(1, 1))];
        switch (hand.substr(2, 1)) {
            case "o": return [this.getCardNumber(hand.substr(1, 1)), this.getCardNumber(hand.substr(0, 1))];
            case "s": return [this.getCardNumber(hand.substr(0, 1)), this.getCardNumber(hand.substr(1, 1))];
        }
    }
    private getCardNumber(card: String): number { // OK
        switch (card) {
            case "A": return 14;
            case "K": return 13;
            case "Q": return 12;
            case "J": return 11;
            case "T": return 10;
            default: return +card;
        }
    }
    getTable() { return this.rangeTable }
    getRange() { return this.range }
    getSavedRanges() { return this.savedRanges }
    getRangeByName(name: String): RangePoker {
        console.log("getRangeByName : " + name);
        var returnItem: RangePoker;
        this.savedRanges.forEach(item => {
            console.log(item.getName());
            if (item.getName().valueOf() == name) returnItem = item;
        })
        return returnItem;
    }

    saveRange(name: String) { // OK
        // Name already exists ? 
        var nameExists: boolean = false;
        this.savedRanges.forEach((rangeItem, index) => {
            if (rangeItem.getName() == name) {
                nameExists = true;
                this.savedRanges.splice(index, 1);
        
            }
        })
        

        if (nameExists) { // mise à jour d'une range existante
            console.log("range already existing");
            var url: string = 'https://eventmanager-492e5.firebaseio.com/ranges/' +
                encodeURIComponent(this.range.getOwner().toString().replace('.', '').replace('@', '')) + '.json';
            let httpParams = new HttpParams().set('auth', this.authService.token);
            this.http.patch(url, this.range.getJson(), { params: httpParams })
                .subscribe((response: RangePoker) => {
                    this.savedRanges.push(this.range.getClone());
                    this.savedRangesChanged.next(this.savedRanges);
                });
        } else { // nouvelle range
            console.log("new range");
            this.range.setName(name);
            this.range.setOwner(this.authService.userMail);
            var url: string = 'https://eventmanager-492e5.firebaseio.com/ranges/' + encodeURIComponent(this.range.getOwner().toString().replace('.', '').replace('@', '')) + '.json';
            let httpParams = new HttpParams().set('auth', this.authService.token);
            this.http.patch(url, this.range.getJson(), { params: httpParams })
                .subscribe((response: RangePoker) => {
                    this.savedRanges.push(this.range.getClone());
                    this.savedRangesChanged.next(this.savedRanges);
                });
        }
    }
    loadRange(i: number) { // OK
        this.range = this.savedRanges[i].getClone();
        this.rangeChanged.next(this.range);
    }
    deleteRange(i: number) { // OK
        var url: string = 'https://eventmanager-492e5.firebaseio.com/ranges/' +
            encodeURIComponent(this.range.getOwner().toString().replace('.', '').replace('@', '')) +
            '/' + this.range.getName() + '.json';
        let httpParams = new HttpParams().set('auth', this.authService.token);
        this.http.delete(url, { params: httpParams })
            .subscribe((response: string) => {
                this.savedRanges.splice(i, 1);
                this.savedRangesChanged.next(this.savedRanges);
            });

    }


    parseRange(rangeText: String) {
        var rangeItems = rangeText.replace(' ', '').split(',');
        var rangeSimplifiee: String[] = [];
        var rangeMap: Map<String, RangeVal> = this.range.getMap();
        var submitErrors: String[] = [];

        // Création d'une range avec seulement des mains simples
        rangeItems.forEach((item) => {
            // Cas des ranges TT+
            if (item.indexOf('+') >= 0) {
                var hand = item.substr(0, item.indexOf('+'));
                if (rangeMap.has(hand) && item.length == hand.length + 1) {
                    // item bien formaté
                    var handCoords = this.getRangeCoords(hand);
                    if (hand.length == 2) {
                        // cas des paires
                        for (var i = handCoords[1]; i <= 14; i++) {
                            rangeSimplifiee.push(this.rangeTable[14 - i][14 - i]);
                        }
                    } else if (hand.substr(2, 1) == 's') {
                        // cas des Suited - [T8s+] - coords [10,8] --> ajouter [10,8], [10,7], [10,6], etc...
                        for (var i = handCoords[0]; i > handCoords[1]; i--) {
                            rangeSimplifiee.push(this.rangeTable[14 - handCoords[0]][15 - i]);
                        }
                    } else if (hand.substr(2, 1) == 'o') {
                        // cas des offsuit
                        for (var i = handCoords[1]; i > handCoords[0]; i--) {
                            rangeSimplifiee.push(this.rangeTable[15 - i][14 - handCoords[1]]);
                        }
                    } else {
                        submitErrors.push('Definition incorrecte : ' + item);
                    }
                } else {
                    submitErrors.push('Definition incorrecte : ' + item);
                }
            }
            // Cas des ranges ATo-A5o
            else if (item.indexOf('-') >= 0) {
                // TODO
            }
            // Cas des mains uniques
            else {
                if (rangeMap.has(item)) {
                    rangeSimplifiee.push(item);
                } else {
                    submitErrors.push('Definition incorrecte : ' + item);
                }

            }
        });

        // Mise à jour de la range
        this.range.setOriginalText(rangeText);
        this.range.initMap();
        rangeSimplifiee.forEach((item) => {
            this.updateRatio(item, 1);
        });
        return submitErrors;
    }

    emptyRanges() {
        this.range = new RangePoker();
        this.savedRanges = [];
    }

}