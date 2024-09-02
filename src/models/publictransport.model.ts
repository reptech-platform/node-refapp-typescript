import { injectable } from "inversify";
import { BasePlanItem } from "./baseplanitem.model";

export interface IPublicTransport extends BasePlanItem {
    seatNumber: string;
}

@injectable()
export abstract class PublicTransport
    extends BasePlanItem implements IPublicTransport {
    seatNumber: string;
    constructor() {
        super();
    }
}