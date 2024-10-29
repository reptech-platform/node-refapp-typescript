import { inject, injectable } from "inversify";
import { ClientSession } from "mongoose";
import DbSession from "../../db/utils/dbsession.db";
import IUpdateAirportRepository from "../../repositories/airport/put.airport.repository";
import { IAirport } from "../../models/airport.model";
import AirportSchema, { IAirportSchema } from "../../db/dao/airport.db.model";
import IGetAirlineRepository from "../../repositories/airline/get.airline.repository";

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
        @inject('IUpdateAirportRepository') private updateAirportRepository: IUpdateAirportRepository,
        @inject('IGetAirlineRepository') private getAirlineRepository: IGetAirlineRepository
    ) { }

    // Updates an existing Airport by their userName and returns the updated Airport.
    public async updateAirport(icaoCode: string, iataCode: string, airport: IAirport, dbSession: ClientSession | undefined): Promise<IAirport> {

        // Create new Airport schema object
        let newAirport: IAirportSchema = new AirportSchema();

        let isExist = await this.updateAirportRepository.isExist(icaoCode, iataCode);
        if (isExist) {
            throw new Error(`Provided airport '${icaoCode}' and '${iataCode}' is already exist`);
        }

        // Check if airline is not null
        if (airport.airlineId) {
            let isExist = await this.getAirlineRepository.isExist(airport.airlineId);
            if (!isExist) {
                throw new Error(`Provided Airport '${airport.airlineId}' does not exist`);
            }
        }

        const keys = Object.keys(airport);

        for (let i = 0; i < keys.length; i++) {
            if (airport[keys[i]]) {
                newAirport[keys[i]] = airport[keys[i]];
            }
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
        const results = await this.updateAirportRepository.updateAirport(icaoCode, iataCode, newAirport, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        return results;
    }
}
