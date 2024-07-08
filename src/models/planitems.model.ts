import { injectable } from "inversify";
import { PublicTransport } from "./publictransport.model";
import { IAirLine } from "./airlines.model";
import { IAirport } from "./airport.model";

@injectable()
export class PlanItems extends PublicTransport {
    flightNumber: String;
    airLine: IAirLine;
    fromAirport: IAirport;
    toAirport: IAirport;
    constructor() { super(); }
}