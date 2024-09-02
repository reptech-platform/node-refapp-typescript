import { injectable } from "inversify";
import { Location } from "./location.model";

export interface IEventLocation extends Location {
    buildingInfo: string;
}

@injectable()
export class EventLocation extends Location implements IEventLocation {
    buildingInfo: string;
    constructor() { super(); }
}