import { injectable } from "inversify";
import { IPerson } from "./person.model";
import { IAirline } from "./airline.model";
import { ITrip } from "./trip.model";

// Interface representing an IPersonTrip
export interface IPersonTrip {

    // trip's trip id
    tripId: number;

    // person's user name
    userName: string;

    // person object
    person: IPerson;

    // trip object
    trip: ITrip;
}

// The Airline class implements the IPersonTrip interface
@injectable()
export class PersonTrip implements IPersonTrip {
    // trip's trip id
    tripId: number;

    // person's user name
    userName: string;

    // person object
    person: IPerson;

    // trip object
    trip: ITrip;

    // Constructor for the Airline class
    constructor() { }
}
