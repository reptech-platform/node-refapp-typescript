import { injectable } from "inversify";
import { IPerson } from "./person.model";
import { IAirline } from "./airline.model";

// Interface representing an IAirline
export interface IAirlineStaff {

    // airline's airlineCode
    airlineCode: string;

    // person's user name
    userName: string;

    // personn object
    staff: IPerson;

    // airline object
    airline: IAirline;
}

// The Airline class implements the IAirlineStaff interface
@injectable()
export class AirlineStaff implements IAirlineStaff {
    // airline's airlineCode
    airlineCode: string;

    // person's user name
    userName: string;

    // personn object
    staff: IPerson;

    // airline object
    airline: IAirline;

    // Constructor for the Airline class
    constructor() { }
}
