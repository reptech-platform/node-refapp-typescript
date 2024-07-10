import { injectable } from "inversify";
import { IPerson } from "./psersons.model";
import { Airport, IAirport } from "./airport.model";

export interface IAirline {
    airlineCode: String;
    name: String;
    logo: String;
    CEO: IPerson;
    airport: IAirport;
    airportId: any;
}

@injectable()
export class Airline implements IAirline {
    airlineCode: String;
    name: String;
    logo: String;
    CEO: IPerson;
    airport: Airport;
    airportId: any;
    constructor() { }
}