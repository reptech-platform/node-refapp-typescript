import { injectable } from "inversify";
import { AirportLocation } from "./airportlocations.model";
import { Airline, IAirline } from "./airlines.model";

export interface IAirport {
    name: String;
    icaoCode: String;
    iataCode: String;
    latitude: Number;
    longitude: Number;
    isInsideCity: Boolean;
    locationJSON: String;
    location: AirportLocation;
    airline: IAirline;
    airlineId: any;
}

@injectable()
export class Airport implements IAirport {

    constructor(
    ) { }
    name: String;
    icaoCode: String;
    iataCode: String;
    latitude: Number;
    longitude: Number;
    isInsideCity: Boolean;
    locationJSON: String;
    location: AirportLocation;
    airline: Airline;
    airlineId: any;
}
