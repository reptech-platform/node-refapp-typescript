import { injectable } from "inversify";
import { PlanItem } from "./planitems.model";

@injectable()
export class PublicTransport extends PlanItem {
    seatNumber: String;
    constructor() { super(); }
}