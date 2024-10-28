import { injectable } from "inversify";
import { IPerson } from "../person.model";
import { IAirportRead } from "../airport/airport.read.model";

// Interface representing an IAirlineRead
export interface IAirlineRead {

    // The unique code for the airline
    airlineCode: string;

    // The name of the airline
    name?: string;

    // URL or path to the airline's logo image
    logo?: string;

    // The CEO of the airline, represented by an IPerson interface
    CEO?: IPerson | undefined | null;

    // An array of staff members, each represented by an IPerson interface
    staff?: IPerson[] | undefined | null;

    // The airports associated with the airline, represented by an IAirport interface
    airports?: IAirportRead;

}

// The Airline class implements the IAirlineRead interface
@injectable()
export class AirlineRead implements IAirlineRead {
    // The unique code for the airline
    airlineCode: string;

    // The name of the airline
    name?: string;

    // URL or path to the airline's logo image
    logo?: string;

    // The CEO of the airline, represented by an IPerson interface
    CEO?: IPerson | undefined | null;

    // An array of staff members, each represented by an IPerson interface
    staff?: IPerson[] | undefined | null;

    // Store airport reference id
    airports?: IAirportRead;

    // The airports associated with the airline, represented by an IAirport interface
    constructor() { }
}
