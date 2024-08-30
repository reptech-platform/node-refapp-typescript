import { injectable } from "inversify";
import { BasePlanItem } from "./baseplanitem.model";

@injectable()
export class PublicTransport extends BasePlanItem {
    seatNumber: string;
    constructor() { super(); }
}