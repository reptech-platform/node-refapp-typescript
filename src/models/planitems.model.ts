import { injectable } from "inversify";

export interface IPlanItem {
    confirmationCode: string;
    startsAt: Date;
    endsAt: Date;
    duaration: number
}

@injectable()
export class PlanItem implements IPlanItem {
    confirmationCode: string;
    startsAt: Date;
    endsAt: Date;
    duaration: number;
    constructor() { }
};