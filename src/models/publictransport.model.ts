import { injectable } from "inversify";
import { BasePlanItem } from "./baseplanitem.model";

// Interface representing public transport, extending the BasePlanItem interface
export interface IPublicTransport extends BasePlanItem {
    // Seat number assigned for the public transport
    seatNumber: string;
}

// Abstract class implementing the IPublicTransport interface and extending the BasePlanItem class
@injectable()
export abstract class PublicTransport extends BasePlanItem implements IPublicTransport {
    // Seat number assigned for the public transport
    seatNumber: string;

    // Constructor for the PublicTransport abstract class
    constructor() {
        // Call the constructor of the parent class (BasePlanItem)
        super();
    }
}
