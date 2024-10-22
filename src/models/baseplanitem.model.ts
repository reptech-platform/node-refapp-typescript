import { injectable } from "inversify";

// Interface representing a base plan item
export interface IBasePlanItem {
    // Optional unique identifier for the plan item
    planItemId?: number;

    // Optional confirmation code for the plan item
    confirmationCode?: string;

    // Optional start date and time for the plan item
    startsAt?: Date;

    // Optional end date and time for the plan item
    endsAt?: Date;

    // Optional duration of the plan item in minutes
    duration?: any;
}

// Abstract class implementing the IBasePlanItem interface
@injectable()
export abstract class BasePlanItem implements IBasePlanItem {
    // Optional unique identifier for the plan item
    planItemId?: number;

    // Optional confirmation code for the plan item
    confirmationCode?: string;

    // Optional start date and time for the plan item
    startsAt?: Date;

    // Optional end date and time for the plan item
    endsAt?: Date;

    // Optional duration of the plan item in minutes
    duration?: any;

    // Constructor for the BasePlanItem abstract class
    constructor() { }
}
