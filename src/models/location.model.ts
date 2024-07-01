import { injectable } from "inversify";
import { ICity } from "./city.model";

export interface ILocation {
    address: String;
    city: ICity;
}

@injectable()
export class Location implements ILocation {
    address: String;
    city: ICity;
    constructor() { }
}