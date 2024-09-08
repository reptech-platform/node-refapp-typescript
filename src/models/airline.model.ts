import { injectable } from "inversify";
import { IPerson } from "./person.model";
import { IAirport } from "./airport.model";

// Interface representing an airline
export interface IAirline {

    // The unique code for the airline
    airlineCode?: string;

    // The name of the airline
    name?: string;

    // URL or path to the airline's logo image
    logo?: string;

    // The CEO of the airline, represented by an IPerson interface
    CEO?: IPerson;

    // An array of staff members, each represented by an IPerson interface
    staff?: IPerson[];

    // The airports associated with the airline, represented by an IAirport interface
    airports?: IAirport;
}

// The Airline class implements the IAirline interface
@injectable()
export class Airline implements IAirline {
    // The unique code for the airline
    airlineCode?: string;

    // The name of the airline
    name?: string;

    // URL or path to the airline's logo image
    logo?: string;

    // The CEO of the airline, represented by an IPerson interface
    CEO?: IPerson;

    // An array of staff members, each represented by an IPerson interface
    staff?: IPerson[];

    // The airports associated with the airline, represented by an IAirport interface
    airports?: IAirport;

    // Constructor for the Airline class
    constructor() { }
}
