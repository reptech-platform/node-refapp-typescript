import { injectable } from "inversify";
import { ICity } from "./city.model";

export interface ILocation {
    address: string;
    city?: ICity;
}

@injectable()
export class Location implements ILocation {
    address: string;
    city?: ICity;
    constructor() { }
}