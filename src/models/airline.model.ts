import { injectable } from "inversify";
import { IPerson } from "./person.model";
import { IAirport } from "./airport.model";

export interface IAirline {
    airlineCode?: string;
    name?: string;
    logo?: string;
    CEO?: IPerson;
    staff?: IPerson[];
    airports?: IAirport;
}

@injectable()
export class Airline implements IAirline {
    airlineCode?: string;
    name?: string;
    logo?: string;
    CEO?: IPerson;
    staff?: IPerson[];
    airports?: IAirport;
    constructor() { }
}