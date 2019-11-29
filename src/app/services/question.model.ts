export class Card {
     color: number;
     level: number;

    constructor (color?: number, level?: number) {
        this.color = color;
        this.level = level;
    }
    public randomCard() {
        this.color = Math.floor(Math.random() * 4 + 1);
        this.level = Math.floor(Math.random() * 13 + 2);
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
    public getCardNumber(): number {
        return this.level;
    }
    public getImg(): String {
        return "assets/img/"+this.getCardString()+".gif";
    }

}

export class Question {
     cards: Card[] = [];
     rangeName: String;
     answer: boolean; // true : in range / false : not in range
     correctAnswer : boolean; // la réponse qu'il faudrait donner
     result: boolean; // true : reponse correcte

    constructor (rangeName: String) {

        do {
            this.cards.push(new Card());
            this.cards.push(new Card());
            this.cards[0].randomCard();
            this.cards[1].randomCard(); 
        } while (this.cards[0].getCardString() == this.cards[1].getCardString())
        
        this.rangeName = rangeName;
    }
    setCorrectAnswer(correctAnswer: boolean) {
        this.correctAnswer = correctAnswer;
    }
    getCorrectAnswer() {
        return this.correctAnswer;
    }
    setAnswer(answer: boolean) {
        this.answer = answer;
        this.setResult();
    }
    setResult() {
        this.result = (this.answer == this.correctAnswer);
    }
    getResult() {
        return this.result;
    }
    getCards() {
        return this.cards;
    }
    getRange() {
        return this.rangeName;
    }
    getCardsFormatted() {
        var card1 = this.cards[0].getCardString().substr(0,1);
        var card2 = this.cards[1].getCardString().substr(0,1);
        var color1 = this.cards[0].getCardString().substr(1,1);
        var color2 = this.cards[1].getCardString().substr(1,1);
        var level1 = this.cards[0].getCardNumber();
        var level2 = this.cards[1].getCardNumber();
                
        // paire
        if (card1 == card2) { return card1+card2; }
        else if (color1 == color2) { return (level1>level2) ? card1+card2+'s' : card2+card1+'s' }
        else { return (level1>level2) ? card1+card2+'o' : card2+card1+'o' }
    }
    fillFromObject(question: Question) {
        this.rangeName = question.rangeName;
        var card0 = new Card(question.cards[0].color, question.cards[0].level);
        var card1 = new Card(question.cards[1].color, question.cards[1].level);

        this.cards = [card0, card1];
        this.answer = question.answer;
        this.correctAnswer = question.correctAnswer;
        this.result = question.result;
    }
}