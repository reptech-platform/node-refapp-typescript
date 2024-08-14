import { injectable } from "inversify";

export interface ICity {
    name: string;
    countryRegion: string;
    region: string;
}

@injectable()
export class City implements ICity {
    name: string;
    countryRegion: string;
    region: string;
    constructor() { }
}