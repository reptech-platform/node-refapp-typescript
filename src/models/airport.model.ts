import { injectable } from "inversify";
import { IAirportLocation } from "./airportlocations.model";
import { IAirline } from "./airlines.model";

export interface IAirport {
    _id: string;
    name: string;
    icaoCode: string;
    iataCode: string;
    latitude: number;
    longitude: number;
    isInsideCity: Boolean;
    locationJSON: string;
    location?: IAirportLocation;
    airline?: IAirline;
    airlineId: any;
}

@injectable()
export class Airport implements IAirport {

    constructor() { }

    _id: string;
    name: string;
    icaoCode: string;
    iataCode: string;
    latitude: number;
    longitude: number;
    isInsideCity: Boolean;
    locationJSON: string;
    location?: IAirportLocation;
    airline?: IAirline;
    airlineId: any;
}
