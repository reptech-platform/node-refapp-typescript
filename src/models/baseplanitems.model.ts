import { injectable } from "inversify";

export interface IBasePlanItem {
    confirmationCode: string;
    startsAt: Date;
    endsAt: Date;
    duaration: number
}

@injectable()
export class BasePlanItem implements IBasePlanItem {
    confirmationCode: string;
    startsAt: Date;
    endsAt: Date;
    duaration: number;
    constructor() { }
};