import { injectable } from "inversify";
import { Location } from "./location.model";
import { IGeographicPoint } from "./geographicpoints.model";


export interface IAirportLocation extends Location {
    loc: IGeographicPoint;
}

@injectable()
export class AirportLocation extends Location {
    loc: IGeographicPoint;
    constructor() { super(); }
}