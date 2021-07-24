export default class ChampionTrendModel {
    id: number;
    rank: string;
    change: number;
    name: string;
    position: string;
    winrate: string;
    pickrate: string;
    banrate: string;
    tierIcon: string;

    constructor(data: ChampionTrendModel) {
        this.id = data.id;
        this.rank =  data.rank;
        this.change =  data.change;
        this.name =  data.name;
        this.position =  data.position;
        this.winrate = data.winrate;
        this.pickrate =  data.pickrate;
        this.banrate =  data.banrate;
        this.tierIcon =  data.tierIcon;
    }
}