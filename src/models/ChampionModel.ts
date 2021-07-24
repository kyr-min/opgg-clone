export default class ChampionModel {
    id?: string;
    key?: string;
    name?: string;
    position: string[];
    consonant: string;
    
    constructor({id, key, name, consonant, position = []} : ChampionModel) {
        this.id = id;
        this.key = key;
        this.name = name;
        this.position = position;
        this.consonant = consonant;
    }
}