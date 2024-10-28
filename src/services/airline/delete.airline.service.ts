import { inject, injectable } from "inversify";
import { ClientSession } from "mongoose";
import DbSession from "../../db/utils/dbsession.db";
import IDeleteAirlineRepository from "../../repositories/airline/delete.airline.repository";

export default interface IDeleteAirlineService {
    // Deletes a Airline by their userName.
    deleteAirline(airlineCode: string, dbSession: ClientSession | undefined): Promise<boolean>;
}

// This decorator ensures that DeleteAirlineService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class DeleteAirlineService implements IDeleteAirlineService {

    // Injecting the Helper service
    constructor(
        @inject('IDeleteAirlineRepository') private deleteAirlineRepository: IDeleteAirlineRepository
    ) { }

    // Deletes a Airline by their airlineCode.
    public async deleteAirline(airlineCode: string, dbSession: ClientSession | undefined): Promise<boolean> {

        // Check if the Airline exists. If not, throw an error.
        let isExist = await this.deleteAirlineRepository.isExist(airlineCode);
        if (!isExist) {
            throw new Error(`Provided airline '${airlineCode}' does not exist`);
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

        let results: boolean = await this.deleteAirlineRepository.deleteAirline(airlineCode, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        return results;
    }

}