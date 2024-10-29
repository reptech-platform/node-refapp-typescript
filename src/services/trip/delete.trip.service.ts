import { inject, injectable } from "inversify";
import { ClientSession } from "mongoose";
import DbSession from "../../db/utils/dbsession.db";
import IDeleteTripRepository from "../../repositories/trip/delete.trip.repository";

export default interface IDeleteTripService {
    // Deletes a trip by their tripId.
    deleteTrip(tripId: number, dbSession: ClientSession | undefined): Promise<boolean>;
}

// This decorator ensures that TripsService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class DeleteTripService implements IDeleteTripService {

    // Injecting the Helper service
    constructor(
        @inject('IDeleteTripRepository') private deleteTripRepository: IDeleteTripRepository
    ) { }

    // Deletes a trip by their tripId.
    public async deleteTrip(tripId: number, dbSession: ClientSession | undefined): Promise<boolean> {

        // Check if the trip exists. If not, throw an error.
        let isExist = await this.deleteTripRepository.isExist(tripId);
        if (!isExist) {
            throw new Error(`Provided trip '${tripId}' does not exist`);
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

        let results: boolean = await this.deleteTripRepository.deleteTrip(tripId, dbSession);

        // delete all person trips from the database
        // await this.personTripRepository.deleteAllTripTrips(userName, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        return results;
    }

}