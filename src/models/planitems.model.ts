import { injectable } from "inversify";
import { PublicTransport } from "./publictransport.model";
import { IAirline } from "./airlines.model";
import { IAirport } from "./airport.model";


export interface IPlanItems extends PublicTransport {
    flightNumber: string;
    airline: IAirline;
    fromAirport?: IAirport;
    toAirport?: IAirport;
}

@injectable()
export class PlanItems extends PublicTransport {
    flightNumber: string;
    airline: IAirline;
    fromAirport?: IAirport;
    toAirport?: IAirport;
    constructor() { super(); }
}