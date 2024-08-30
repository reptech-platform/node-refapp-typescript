import { injectable } from "inversify";
import { PublicTransport } from "./publictransport.model";
import { IAirline } from "./airline.model";
import { IAirport } from "./airport.model";
import { ITicket } from "./ticket.model";


export interface IPlanItems extends PublicTransport {
    flightNumber: string;
    airline: IAirline;
    fromAirport?: IAirport;
    toAirport?: IAirport;
    ticket: ITicket;
}

@injectable()
export class PlanItems extends PublicTransport {
    flightNumber: string;
    airline: IAirline;
    fromAirport?: IAirport;
    toAirport?: IAirport;
    ticket: ITicket;
    constructor() { super(); }
}