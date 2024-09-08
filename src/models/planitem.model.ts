import { injectable } from "inversify";
import { PublicTransport } from "./publictransport.model";
import { IAirline } from "./airline.model";
import { IAirport } from "./airport.model";
import { IDocument } from "./document.model";

// Interface representing plan items, extending the PublicTransport interface
export interface IPlanItems extends PublicTransport {
    // Optional flight number for the plan item
    flightNumber?: string;

    // Optional airline associated with the plan item, represented by the IAirline interface
    airLine?: IAirline;

    // Optional departure airport for the plan item, represented by the IAirport interface
    fromAirport?: IAirport;

    // Optional arrival airport for the plan item, represented by the IAirport interface
    toAirport?: IAirport;

    // Optional ticket document for the plan item, represented by the IDocument interface
    ticket?: IDocument;
}

// Class implementing the IPlanItems interface and extending the PublicTransport class
@injectable()
export class PlanItems extends PublicTransport {
    // Optional flight number for the plan item
    flightNumber?: string;

    // Optional airline associated with the plan item, represented by the IAirline interface
    airLine?: IAirline;

    // Optional departure airport for the plan item, represented by the IAirport interface
    fromAirport?: IAirport;

    // Optional arrival airport for the plan item, represented by the IAirport interface
    toAirport?: IAirport;

    // Optional ticket document for the plan item, represented by the IDocument interface
    ticket?: IDocument;

    // Constructor for the PlanItems class
    constructor() {
        // Call the constructor of the parent class (PublicTransport)
        super();
    }
}
