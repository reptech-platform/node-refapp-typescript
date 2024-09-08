import { injectable } from "inversify";
import { IAirportLocation } from "./airportlocation.model";
import { IAirline } from "./airline.model";

// Interface representing an airport
export interface IAirport {
    // The name of the airport
    name: string;

    // The ICAO code of the airport, e.g., "KATL" for Hartsfield-Jackson Atlanta International Airport
    icaoCode: string;

    // The IATA code of the airport, e.g., "ATL" for Hartsfield-Jackson Atlanta International Airport
    iataCode: string;

    // The latitude coordinate of the airport
    latitude: number;

    // The longitude coordinate of the airport
    longitude: number;

    // Indicates whether the airport is located inside a city
    isInsideCity: boolean;

    // JSON string representing the location details of the airport
    locationJSON: string;

    // Optional property representing the embeded location details of the airport
    location?: IAirportLocation;

    // Optional property representing the airlines associated with the airport
    airlines?: IAirline;
}

// Class implementing the IAirport interface
@injectable()
export class Airport implements IAirport {

    // Constructor for the Airport class
    constructor() { }

    // The name of the airport
    name: string;

    // The ICAO code of the airport
    icaoCode: string;

    // The IATA code of the airport
    iataCode: string;

    // The latitude coordinate of the airport
    latitude: number;

    // The longitude coordinate of the airport
    longitude: number;

    // Indicates whether the airport is located inside a city
    isInsideCity: boolean;

    // JSON string representing the location details of the airport
    locationJSON: string;

    // Optional property representing the embeded location details of the airport
    location?: IAirportLocation;

    // Optional property representing the airlines associated with the airport
    airlines?: IAirline;
}

