import { injectable } from "inversify";
import { IPerson } from "./psersons.model";

export interface IAirLine {
    airlineCode: String;
    name: String;
    logo: String;
    CEO: IPerson;
}

@injectable()
export class AirLine implements IAirLine {
    airlineCode: String;
    name: String;
    logo: String;
    CEO: IPerson;
    constructor() { }
}