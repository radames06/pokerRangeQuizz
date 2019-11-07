import { RangeVal } from './range.val.model';

export class RangePoker {

    private rangeMap: Map<String, RangeVal> = new Map([
        ['AA', new RangeVal()],['AKs', new RangeVal()],['AQs', new RangeVal()],['AJs', new RangeVal()],['ATs', new RangeVal()],['A9s', new RangeVal()],['A8s', new RangeVal()],
        ['A7s', new RangeVal()],['A6s', new RangeVal()],['A5s', new RangeVal()],['A4s', new RangeVal()],['A3s', new RangeVal()],['A2s', new RangeVal()],
        ['AKo', new RangeVal()],['KK', new RangeVal()],['KQs', new RangeVal()],['KJs', new RangeVal()],['KTs', new RangeVal()],['K9s', new RangeVal()],['K8s', new RangeVal()],
        ['K7s', new RangeVal()],['K6s', new RangeVal()],['K5s', new RangeVal()],['K4s', new RangeVal()],['K3s', new RangeVal()],['K2s', new RangeVal()],
        ['AQo', new RangeVal()],['KQo', new RangeVal()],['QQ', new RangeVal()],['QJs', new RangeVal()],['QTs', new RangeVal()],['Q9s', new RangeVal()],['Q8s', new RangeVal()],
        ['Q7s', new RangeVal()],['Q6s', new RangeVal()],['Q5s', new RangeVal()],['Q4s', new RangeVal()],['Q3s', new RangeVal()],['Q2s', new RangeVal()],
        ['AJo', new RangeVal()],['KJo', new RangeVal()],['QJo', new RangeVal()],['JJ', new RangeVal()],['JTs', new RangeVal()],['J9s', new RangeVal()],['J8s', new RangeVal()],
        ['J7s', new RangeVal()],['J6s', new RangeVal()],['J5s', new RangeVal()],['J4s', new RangeVal()],['J3s', new RangeVal()],['J2s', new RangeVal()],
        ['ATo', new RangeVal()],['KTo', new RangeVal()],['QTo', new RangeVal()],['JTo', new RangeVal()],['TT', new RangeVal()],['T9s', new RangeVal()],['T8s', new RangeVal()],
        ['T7s', new RangeVal()],['T6s', new RangeVal()],['T5s', new RangeVal()],['T4s', new RangeVal()],['T3s', new RangeVal()],['T2s', new RangeVal()],
        ['A9o', new RangeVal()],['K9o', new RangeVal()],['Q9o', new RangeVal()],['J9o', new RangeVal()],['T9o', new RangeVal()],['99', new RangeVal()],['98s', new RangeVal()],
        ['97s', new RangeVal()],['96s', new RangeVal()],['95s', new RangeVal()],['94s', new RangeVal()],['93s', new RangeVal()],['92s', new RangeVal()],
        ['A8o', new RangeVal()],['K8o', new RangeVal()],['Q8o', new RangeVal()],['J8o', new RangeVal()],['T8o', new RangeVal()],['98o', new RangeVal()],['88', new RangeVal()],
        ['87s', new RangeVal()],['86s', new RangeVal()],['85s', new RangeVal()],['84s', new RangeVal()],['83s', new RangeVal()],['82s', new RangeVal()],
        ['A7o', new RangeVal()],['K7o', new RangeVal()],['Q7o', new RangeVal()],['J7o', new RangeVal()],['T7o', new RangeVal()],['97o', new RangeVal()],['87o', new RangeVal()],
        ['77', new RangeVal()],['76s', new RangeVal()],['75s', new RangeVal()],['74s', new RangeVal()],['73s', new RangeVal()],['72s', new RangeVal()],
        ['A6o', new RangeVal()],['K6o', new RangeVal()],['Q6o', new RangeVal()],['J6o', new RangeVal()],['T6o', new RangeVal()],['96o', new RangeVal()],['86o', new RangeVal()],
        ['76o', new RangeVal()],['66', new RangeVal()],['65s', new RangeVal()],['64s', new RangeVal()],['63s', new RangeVal()],['62s', new RangeVal()],
        ['A5o', new RangeVal()],['K5o', new RangeVal()],['Q5o', new RangeVal()],['J5o', new RangeVal()],['T5o', new RangeVal()],['95o', new RangeVal()],['85o', new RangeVal()],
        ['75o', new RangeVal()],['65o', new RangeVal()],['55', new RangeVal()],['54s', new RangeVal()],['53s', new RangeVal()],['52s', new RangeVal()],
        ['A4o', new RangeVal()],['K4o', new RangeVal()],['Q4o', new RangeVal()],['J4o', new RangeVal()],['T4o', new RangeVal()],['94o', new RangeVal()],['84o', new RangeVal()],
        ['74o', new RangeVal()],['64o', new RangeVal()],['54o', new RangeVal()],['44', new RangeVal()],['43s', new RangeVal()],['42s', new RangeVal()],
        ['A3o', new RangeVal()],['K3o', new RangeVal()],['Q3o', new RangeVal()],['J3o', new RangeVal()],['T3o', new RangeVal()],['93o', new RangeVal()],['83o', new RangeVal()],
        ['73o', new RangeVal()],['63o', new RangeVal()],['53o', new RangeVal()],['43o', new RangeVal()],['33', new RangeVal()],['32s', new RangeVal()],
        ['A2o', new RangeVal()],['K2o', new RangeVal()],['Q2o', new RangeVal()],['J2o', new RangeVal()],['T2o', new RangeVal()],['92o', new RangeVal()],['82o', new RangeVal()],
        ['72o', new RangeVal()],['62o', new RangeVal()],['52o', new RangeVal()],['42o', new RangeVal()],['32o', new RangeVal()],['22', new RangeVal()]
    ]);
    private rangeName: String;

    getMap() {return this.rangeMap}

    public setRatio(hand: String, newRatio: number) {
        this.rangeMap.get(hand).setRatio(newRatio);
    }
    public getName() {
        return this.rangeName;
    }
    public setName(name: String) {
        this.rangeName = name;
    }
}