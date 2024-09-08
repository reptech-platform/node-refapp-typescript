import { injectable } from "inversify";
import { ICity } from "./city.model";

// Interface representing a location with an address and an optional city
export interface ILocation {
    // The address of the location
    address: string;

    // Optional property representing the embeded city, which is an ICity interface
    city?: ICity;
}

// Class implementing the ILocation interface
@injectable()
export class Location implements ILocation {
    // The address of the location
    address: string;

    // Optional property representing the embeded city, which is an ICity interface
    city?: ICity;

    // Constructor for the Location class
    constructor() { }
}
