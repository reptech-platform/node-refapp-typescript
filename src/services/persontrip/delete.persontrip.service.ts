import { inject, injectable } from "inversify";
import { ClientSession } from "mongoose";
import DbSession from "../../db/utils/dbsession.db";
import IDeletePersonTripRepository from "../../repositories/persontrip/delete.persontrip.repository";

export default interface IDeletePersonTripService {
    // Deletes a PersonTrip by their trip id and username.
    deletePersonTrip(userName: string, tripId: number, dbSession: ClientSession | undefined): Promise<boolean>;
}

// This decorator ensures that DeletePersonTripService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class DeletePersonTripService implements IDeletePersonTripService {

    // Injecting the Helper service
    constructor(
        @inject('IDeletePersonTripRepository') private deletePersonTripRepository: IDeletePersonTripRepository
    ) { }

    // Deletes a PersonTrip by their trip id and username.
    public async deletePersonTrip(userName: string, tripId: number, dbSession: ClientSession | undefined): Promise<boolean> {

        // Check if the PersonTrip exists. If not, throw an error.
        let isExist = await this.deletePersonTripRepository.isExist(userName, tripId);
        if (!isExist) {
            throw new Error(`Provided person trip '${userName}' and '${tripId}' does not exist`);
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

        let results: boolean = await this.deletePersonTripRepository.deletePersonTrip(userName, tripId, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        return results;
    }

}