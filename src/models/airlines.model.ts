import { injectable } from "inversify";
import { IPerson } from "./persons.model";
import { IAirport } from "./airport.model";

export interface IAirline {
    _id: string;
    airlineCode: string;
    name: string;
    logo: string;
    CEO?: IPerson;
    airport?: IAirport;
    airportId: any;
}

@injectable()
export class Airline implements IAirline {
    _id: string;
    airlineCode: string;
    name: string;
    logo: string;
    CEO?: IPerson;
    airport?: IAirport;
    airportId: any;
    constructor() { }
}