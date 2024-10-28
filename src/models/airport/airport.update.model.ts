import { injectable } from "inversify";
import { IAirportLocation } from "../airportlocation.model";

// Interface representing an IAirportUpdate
export interface IAirportUpdate {
    // The name of the airport
    name?: string;

    // The latitude coordinate of the airport
    latitude?: number;

    // The longitude coordinate of the airport
    longitude?: number;

    // Indicates whether the airport is located inside a city
    isInsideCity?: boolean;

    // JSON string representing the location details of the airport
    locationJSON?: string;

    // Optional property representing the embeded location details of the airport
    location?: IAirportLocation;

    // Optional property to store airline reference id
    airline?: string;
}

// Class implementing the IAirportUpdate interface
@injectable()
export class AirportUpdate implements IAirportUpdate {

    // Constructor for the Airport class
    constructor() { }

    // The name of the airport
    name?: string;

    // The latitude coordinate of the airport
    latitude?: number;

    // The longitude coordinate of the airport
    longitude?: number;

    // Indicates whether the airport is located inside a city
    isInsideCity?: boolean;

    // JSON string representing the location details of the airport
    locationJSON?: string;

    // Optional property representing the embeded location details of the airport
    location?: IAirportLocation;

    // Optional property to store airline reference id
    airline?: string;
}

