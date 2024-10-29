import { inject, injectable } from "inversify";
import { ClientSession } from "mongoose";
import DbSession from "../../db/utils/dbsession.db";
import ICreateAirportRepository from "../../repositories/airport/post.airport.repository";
import { IAirport } from "../../models/airport.model";
import AirportSchema, { IAirportSchema } from "../../db/dao/airport.db.model";
import IGetAirlineRepository from "../../repositories/airline/get.airline.repository";

// Interface for CreateAirportService
export default interface ICreateAirportService {
    // Method to create a new Airport
    createAirport(airport: IAirport, dbSession: ClientSession | undefined): Promise<IAirport>;
}

// This decorator ensures that CreateAirportService is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class CreateAirportService implements ICreateAirportService {
    // Injecting the AirportRepository service
    constructor(
        @inject('ICreateAirportRepository') private createAirportRepository: ICreateAirportRepository,
        @inject('IGetAirlineRepository') private getAirlineRepository: IGetAirlineRepository
    ) { }

    // Method to create a new Airport
    public async createAirport(airport: IAirport, dbSession: ClientSession | undefined): Promise<IAirport> {

        // Create new Airport schema object
        let newAirport: IAirportSchema = new AirportSchema();

        const { icaoCode, iataCode } = airport;
        if (icaoCode && iataCode) {
            let isExist = await this.createAirportRepository.isExist(icaoCode, iataCode);
            if (isExist) {
                throw new Error(`Provided airport '${icaoCode}' and '${iataCode}' is already exist`);
            }
        } else {
            throw new Error(`Provided airport '${icaoCode}' and '${iataCode}' is invalid`);
        }

        // Check if airline  is not null
        if (airport.airlineId) {
            let isExist = await this.getAirlineRepository.isExist(airport.airlineId);
            if (!isExist) {
                throw new Error(`Provided Airline '${airport.airlineId}' does not exist`);
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
        const results = await this.createAirportRepository.createAirport(newAirport, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        return results;
    }
}
