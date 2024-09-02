import { injectable } from "inversify";
import { Location } from "./location.model";
import { IGeographicPoint } from "./geographicpoint.model";

export interface IAirportLocation extends Location {
    loc: IGeographicPoint;
}

@injectable()
export class AirportLocation extends Location implements IAirportLocation {
    loc: IGeographicPoint;
    constructor() { super(); }
}