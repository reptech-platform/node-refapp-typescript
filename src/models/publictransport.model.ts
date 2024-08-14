import { injectable } from "inversify";
import { BasePlanItem } from "./baseplanitems.model";

@injectable()
export class PublicTransport extends BasePlanItem {
    seatNumber: string;
    constructor() { super(); }
}