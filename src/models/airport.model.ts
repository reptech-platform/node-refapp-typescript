import { injectable } from "inversify";
import { AirportLocation } from "./airportlocations.model";

export interface IAirport {
    name: String;
    icaoCode: String;
    iataCode: String;
    latitude: Number;
    longitude: Number;
    isInsideCity: Boolean;
    locationJSON: String;
    location: AirportLocation;
    airlineId: String;
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
    airlineId: String;
}
