import { injectable } from "inversify";

export interface IBasePlanItem {
    planItemId: number;
    confirmationCode: string;
    startsAt: Date;
    endsAt: Date;
    duaration: number
}

@injectable()
export abstract class BasePlanItem implements IBasePlanItem {
    planItemId: number;
    confirmationCode: string;
    startsAt: Date;
    endsAt: Date;
    duaration: number;
    constructor() { }
};