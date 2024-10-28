import { injectable } from "inversify";

// Interface representing an airline
export interface IAirlineUpdate {

    // The name of the airline
    name?: string | undefined;

    // URL or path to the airline's logo image
    logo?: string | undefined;

    // The CEO of the airline, represented by an IPerson interface
    CEO?: string | undefined;

    // An array of staff members, each represented by an IPerson interface
    //staff?: string[];

    // Store airport reference id
    airport?: { icaoCode: string, iataCode: string };

}

// The Airline class implements the IAirline interface
@injectable()
export class AirlineAdd implements IAirlineUpdate {

    // The name of the airline
    name?: string | undefined;

    // URL or path to the airline's logo image
    logo?: string | undefined;

    // The CEO of the airline, represented by an IPerson interface
    CEO?: string | undefined;

    // An array of staff members, each represented by an IPerson interface
    //staff?: string[];

    // Store airport reference id
    airport?: { icaoCode: string, iataCode: string };

    // Constructor for the Airline class
    constructor() { }
}
