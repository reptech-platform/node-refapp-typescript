import { injectable } from "inversify";
import { IAirport } from "./airport.model";
import { IPerson } from "./person.model";

// Interface representing an IAirline
export interface IAirline {

    // The unique code for the airline
    airlineCode: string;

    // The name of the airline
    name?: string | undefined;

    // URL or path to the airline's logo image
    logo?: string | undefined;

    // The CEO of the airline, represented by an IPerson interface
    CEO?: IPerson | undefined;

    // The CEO of the airline, represented by an Person's name
    ceoName?: string | undefined;

    // An array of staff members object, each represented by an IPerson interface
    staff?: IPerson[] | undefined | null;

    // An array of staff members
    staffList?: string[] | undefined;

    // Store airport reference object
    airport?: IAirport;

    // Store airport reference
    airportId?: { icaoCode: string, iataCode: string };
}

// The Airline class implements the IAirline interface
@injectable()
export class Airline implements IAirline {
    // The unique code for the airline
    airlineCode: string;

    // The name of the airline
    name?: string | undefined;

    // URL or path to the airline's logo image
    logo?: string | undefined;

    // The CEO of the airline, represented by an IPerson interface
    CEO?: IPerson | undefined;

    // The CEO of the airline, represented by an Person's name
    ceoName?: string | undefined;

    // An array of staff members object, each represented by an IPerson interface
    staff?: IPerson[] | undefined | null;

    // An array of staff members
    staffList?: string[] | undefined;

    // Store airport reference object
    airport?: IAirport;

    // Store airport reference 
    airportId?: { icaoCode: string, iataCode: string };

    // Constructor for the Airline class
    constructor() { }
}
