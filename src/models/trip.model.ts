import { injectable } from "inversify";
import { IPerson } from "./person.model";
import { IPlanItems } from "./planitem.model";

/**
 * Interface to validate model field construction
 */
export interface ITrip {
    tripId?: string;
    shareId?: string;
    name?: string;
    budget?: number;
    description?: string;
    tags?: string[];
    startAt?: Date;
    endsAt?: Date;
    /**
     * To store only time, declare as string and use field validation at DB
     */
    startTime?: Date;
    /**
     * To store only time, declare as string and use field validation at DB
     */
    endTime?: Date;
    cost?: number;
    //planItems?: IPlanItems[];
    //travellers?: IPerson[];
}

/**
 * Model defination for Data transfer object
 */
@injectable()
export class Trip implements ITrip {
    tripId?: string;
    shareId?: string;
    name?: string;
    budget?: number;
    description?: string;
    tags?: string[];
    startAt?: Date;
    endsAt?: Date;
    /**
     * To store only time, declare as string and use field validation at DB
     */
    startTime?: Date;
    /**
     * To store only time, declare as string and use field validation at DB
     */
    endTime?: Date;
    cost?: number;
    //planItems?: IPlanItems[];
    //travellers?: IPerson[];

    constructor() { }
}