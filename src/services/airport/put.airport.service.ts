import { inject, injectable } from "inversify";
import { ClientSession } from "mongoose";
import DbSession from "../../db/utils/dbsession.db";
import IUpdateAirportRepository from "../../repositories/airport/put.airport.repository";
import { IAirport } from "../../models/airport.model";
import AirportSchema, { IAirportSchema } from "../../db/dao/airport.db.model";
import IGetAirlineRepository from "../../repositories/airline/get.airline.repository";
import Helper from "../../utils/helper.utils";

// Interface for UpdateAirportService
export default interface IUpdateAirportService {
    // Updates an existing Airport by their userName and returns the updated Airport.
    updateAirport(icaoCode: string, iataCode: string, Airport: IAirport, dbSession: ClientSession | undefined): Promise<IAirport>;
}

// This decorator ensures that UpdateAirportService is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class UpdateAirportService implements IUpdateAirportService {
    // Injecting the AirportRepository service
    constructor(
        @inject('Helper') private helper: Helper,
        @inject('IUpdateAirportRepository') private updateAirportRepository: IUpdateAirportRepository,
        @inject('IGetAirlineRepository') private getAirlineRepository: IGetAirlineRepository
    ) { }

    // Updates an existing Airport by their userName and returns the updated Airport.
    public async updateAirport(icaoCode: string, iataCode: string, airport: IAirport, dbSession: ClientSession | undefined): Promise<IAirport> {

        // Create new Airport schema object
        let newItem: IAirportSchema = new AirportSchema();

        // Map airline model into schema object
        const keys = Object.keys(airport);
        for (let i = 0; i < keys.length; i++) {
            if (airport[keys[i]]) {
                newItem[keys[i]] = airport[keys[i]];
            }
        }

        if (icaoCode && iataCode) {
            let isExist = await this.updateAirportRepository.isExist(icaoCode, iataCode);
            if (isExist) {
                throw new Error(`Provided airport '${icaoCode}' and '${iataCode}' is already exist`);
            }
        } else {
            throw new Error(`Provided airport '${icaoCode}' and '${iataCode}' is invalid`);
        }

        // Check airline and airlineId both are passed
        if (!this.helper.IsJsonNull(airport.airline) && !this.helper.IsNullValue(airport.airlineId)) {
            throw new Error(`Provide only airline or airlineId`);
        }

        // Check if airline  is not null
        if (airport.airlineId && !this.helper.IsNullValue(airport.airlineId)) {
            let isExist = await this.getAirlineRepository.isExist(airport.airlineId);
            if (!isExist) {
                throw new Error(`Provided Airline '${airport.airlineId}' does not exist`);
            }
            newItem.airline = airport.airlineId;
        }

        if (airport.airline && !this.helper.IsJsonNull(airport.airline)) {
            let isExist = await this.getAirlineRepository.isExist(airport.airline.airlineCode);
            if (!isExist) {
                throw new Error(`Provided Airline '${airport.airline.airlineCode}' does not exist`);
            }
            newItem.airline = airport.airline.airlineCode;
        }

        // Flag to indicate if this function created the session
        let inCarryTransact: boolean = false;

        // Check if a session is provided; if not, create a new one
        if (!dbSession) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        } else {
            inCarryTransact = true;
        }

        // Create Airport document
        const results = await this.updateAirportRepository.updateAirport(icaoCode, iataCode, newItem, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        return results;
    }
}
