import { injectable } from "inversify";
import { IPerson } from "./persons.model";
import { IPlanItems } from "./planitems.model";

export interface ITrip {
    _id: string;
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