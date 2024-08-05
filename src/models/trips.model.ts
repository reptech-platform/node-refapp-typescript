import { injectable } from "inversify";
import { IPerson } from "./psersons.model";
import { PlanItems } from "./planitems.model";

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
    planItems?: PlanItems[];
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
    planItems?: PlanItems[];
    travellers: IPerson[] | [];

    constructor() { }
}