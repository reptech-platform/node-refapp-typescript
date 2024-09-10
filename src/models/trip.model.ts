import { injectable } from "inversify";
import { IPerson } from "./person.model";
import { IPlanItems } from "./planitem.model";

// Interface representing a trip
export interface ITrip {
    // Optional unique identifier for the trip
    tripId: number;

    // Optional share identifier for the trip
    shareId?: string;

    // Optional name of the trip
    name?: string;

    // Optional budget for the trip
    budget?: number;

    // Optional description of the trip
    description?: string;

    // Optional array of tags associated with the trip
    tags?: string[];

    // Optional start date and time for the trip
    startAt?: Date;

    // Optional end date and time for the trip
    endsAt?: Date;

    // To store only time, declare as string and use field validation at DB
    startTime?: Date;

    // To store only time, declare as string and use field validation at DB
    endTime?: Date;

    // Optional cost of the trip
    cost?: number;

    // Optional array of plan items associated with the trip, each represented by the IPlanItems interface
    planItems?: IPlanItems[];

    // Optional array of travellers on the trip, each represented by the IPerson interface
    travellers?: IPerson[];
}

/**
 * Model definition for Data Transfer Object
 */
@injectable()
export class Trip implements ITrip {
    // Optional unique identifier for the trip
    tripId: number;

    // Optional share identifier for the trip
    shareId?: string;

    // Optional name of the trip
    name?: string;

    // Optional budget for the trip
    budget?: number;

    // Optional description of the trip
    description?: string;

    // Optional array of tags associated with the trip
    tags?: string[];

    // Optional start date and time for the trip
    startAt?: Date;

    // Optional end date and time for the trip
    endsAt?: Date;

    // To store only time, declare as string and use field validation at DB
    startTime?: Date;

    // To store only time, declare as string and use field validation at DB
    endTime?: Date;

    // Optional cost of the trip
    cost?: number;

    // Optional array of plan items associated with the trip, each represented by the IPlanItems interface
    planItems?: IPlanItems[];

    // Optional array of travellers on the trip, each represented by the IPerson interface
    travellers?: IPerson[];

    // Constructor for the Trip class
    constructor() { }
}
