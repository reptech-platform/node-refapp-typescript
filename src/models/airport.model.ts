import { injectable } from "inversify";
import { IAirportLocation } from "./airportlocation.model";
import { IAirline } from "./airline.model";

export interface IAirport {
    name: string;
    icaoCode: string;
    iataCode: string;
    latitude: number;
    longitude: number;
    isInsideCity: boolean;
    locationJSON: string;
    location?: IAirportLocation;
    airlines?: IAirline;
}

@injectable()
export class Airport implements IAirport {

    constructor() { }

    name: string;
    icaoCode: string;
    iataCode: string;
    latitude: number;
    longitude: number;
    isInsideCity: boolean;
    locationJSON: string;
    location?: IAirportLocation;
    airlines?: IAirline;
}
