import { injectable } from "inversify";
import { IAirportLocation } from "./airportlocation.model";
import { IAirline } from "./airline.model";

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
    airlineAirport?: IAirline;
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
    airlineAirport?: IAirline;
    airlineId: any;
}
