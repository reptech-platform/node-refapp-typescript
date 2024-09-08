import { injectable } from "inversify";
import { Location } from "./location.model";
import { IGeographicPoint } from "./geographicpoint.model";

// Interface representing the location details of an airport, extending the Location interface
export interface IAirportLocation extends Location {
    // Geographic point representing the location
    loc: IGeographicPoint;
}

// Class implementing the IAirportLocation interface and extending the Location class
@injectable()
export class AirportLocation extends Location implements IAirportLocation {
    // Geographic point representing the location
    loc: IGeographicPoint;

    // Constructor for the AirportLocation class
    constructor() {
        // Call the constructor of the parent class (Location)
        super();
    }
}
