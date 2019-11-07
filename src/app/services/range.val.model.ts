export class RangeVal {
    constructor(
        public ratio: number = 0,
        public ok: number = 0,
        public ko: number = 0
    ) {}

    public setRatio(newRatio: number) {
        this.ratio = newRatio;
    }
}