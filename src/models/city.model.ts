import { injectable } from "inversify";

export interface ICity {
    name: String;
    countryRegion: String;
    region: String;
}

@injectable()
export class City implements ICity {
    name: String;
    countryRegion: String;
    region: String;
    constructor() { }
}