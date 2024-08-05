import { injectable } from "inversify";
import { PublicTransport } from "./publictransport.model";
import { IAirline } from "./airlines.model";
import { IAirport } from "./airport.model";

@injectable()
export class PlanItems extends PublicTransport {
    flightNumber: String;
    airline: IAirline;
    fromAirport: IAirport;
    toAirport: IAirport;
    constructor() { super(); }
}