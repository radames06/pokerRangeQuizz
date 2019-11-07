export class Card {
    private color: number;
    private level: number;

    constructor (color?: number, level?: number) {
        this.color = color;
        this.level = level;
    }
    public randomCard() {
        this.color = Math.floor(Math.random() * 4 + 1);
        this.level = Math.floor(Math.random() * 13 + 2);
        console.log(this.level + "/" + this.color);
    }
    public getCardString(): String {
        var handString: String;
        switch(this.level) {
            case 14 : {
                handString = "A";
                break;
            }
            case 13 : {
                handString = "K";
                break;
            }
            case 12 : {
                handString = "Q";
                break;
            }
            case 11 : {
                handString = "J";
                break;
            }
            case 10 : {
                handString = "T";
                break;
            }
            default : {
                handString = this.level.toString();
                break;
            }
        }
        switch(this.color) {
            case 1 : {
                handString += 'h';
                break;
            }
            case 2 : {
                handString += 'c';
                break;
            }
            case 3 : {
                handString += 'd';
                break;
            }
            case 4 : {
                handString += 's';
                break;
            }
        }

        return handString;
    }
}

export class Question {
    private cards: Card[];

    constructor () {
        this.cards.push(new Card());
        this.cards.push(new Card());
        this.cards[1].randomCard();
        this.cards[2].randomCard();
    }
}