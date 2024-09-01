import { injectable } from "inversify";
import { IPerson } from "./person.model";
import { IPlanItems } from "./planitem.model";

export interface ITrip {
    _id: string;
    tripId: string;
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
    planItems?: IPlanItems[];
    travellers?: IPerson[];

}

@injectable()
export class Trip implements ITrip {
    _id: string;
    tripId: string;
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
    planItems?: IPlanItems[];
    travellers?: IPerson[];

    constructor() { }
}