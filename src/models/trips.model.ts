import { injectable } from "inversify";
import { IPerson } from "./psersons.model";
import { Flight } from "./flights.model";

export interface ITrip {
    shareId: string;
    name: string;
    budget: number;
    description: string;
    tags: string[];
    startAt: Date;
    endsAt: Date;
    startTime: Date;
    endTime: Date;
    cost: number;
    flights?: Flight[];
    travellers: IPerson[] | [];
}

@injectable()
export class Trip implements ITrip {
    shareId: string;
    name: string;
    budget: number;
    description: string;
    tags: string[];
    startAt: Date;
    endsAt: Date;
    startTime: Date;
    endTime: Date;
    cost: number;
    flights?: Flight[];
    travellers: IPerson[] | [];

    constructor() { }
}