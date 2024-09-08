import { injectable } from "inversify";
import { Location } from "./location.model";

// Interface representing the location details of an event, extending the Location interface
export interface IEventLocation extends Location {
    // Information about the building where the event is located
    buildingInfo: string;
}

// Class implementing the IEventLocation interface and extending the Location class
@injectable()
export class EventLocation extends Location implements IEventLocation {
    // Information about the building where the event is located
    buildingInfo: string;

    // Constructor for the EventLocation class
    constructor() {
        // Call the constructor of the parent class (Location)
        super();
    }
}
