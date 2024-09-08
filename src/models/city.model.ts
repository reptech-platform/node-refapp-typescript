import { injectable } from "inversify";

// Interface representing a city
export interface ICity {
    // The name of the city
    name: string;

    // The country or region where the city is located
    countryRegion: string;

    // The specific region within the country where the city is located
    region: string;
}

// Class implementing the ICity interface
@injectable()
export class City implements ICity {
    // The name of the city
    name: string;

    // The country or region where the city is located
    countryRegion: string;

    // The specific region within the country where the city is located
    region: string;

    // Constructor for the City class
    constructor() { }
}
