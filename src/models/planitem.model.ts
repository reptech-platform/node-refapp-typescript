import { injectable } from "inversify";
import { PublicTransport } from "./publictransport.model";
import { IAirline } from "./airline.model";
import { IAirport } from "./airport.model";
import { IDocument } from "./document.model";

/**
 * Interface to validate model field construction
 */
export interface IPlanItems extends PublicTransport {
    flightNumber: string;
    airline: IAirline;
    fromAirport?: IAirport;
    toAirport?: IAirport;
    ticket: IDocument;
}

@injectable()
export class PlanItems extends PublicTransport {
    flightNumber: string;
    airline: IAirline;
    fromAirport?: IAirport;
    toAirport?: IAirport;
    ticket: IDocument;
    constructor() { super(); }
}