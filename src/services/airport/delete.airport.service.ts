import { inject, injectable } from "inversify";
import { ClientSession } from "mongoose";
import DbSession from "../../db/utils/dbsession.db";
import IDeleteAirportRepository from "../../repositories/airport/delete.airport.repository";

export default interface IDeleteAirportService {
    // Deletes a Airport by their icaoCode and iataCode.
    deleteAirport(icaoCode: string, iataCode: string, dbSession: ClientSession | undefined): Promise<boolean>;
}

// This decorator ensures that DeleteAirportService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class DeleteAirportService implements IDeleteAirportService {

    // Injecting the Helper service
    constructor(
        @inject('IDeleteAirportRepository') private deleteAirportRepository: IDeleteAirportRepository
    ) { }

    // Deletes a Airport by their AirportCode.
    public async deleteAirport(icaoCode: string, iataCode: string, dbSession: ClientSession | undefined): Promise<boolean> {

        // Check if the Airport exists. If not, throw an error.
        let isExist = await this.deleteAirportRepository.isExist(icaoCode, iataCode);
        if (!isExist) {
            throw new Error(`Provided Airport '${icaoCode}' and '${iataCode}' does not exist`);
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

        let results: boolean = await this.deleteAirportRepository.deleteAirport(icaoCode, iataCode, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        return results;
    }

}