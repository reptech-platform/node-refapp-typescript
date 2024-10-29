import { ITrip } from "../../models/trip.model";
import { inject, injectable } from "inversify";
import { ClientSession } from "mongoose";
import DbSession from "../../db/utils/dbsession.db";
import IUpdateTripRepository from "../../repositories/trip/put.trip.repository";
import TripSchema, { ITripSchema } from "../../db/dao/trip.db.model";

// Interface for UpdateTripService
export default interface IUpdateTripService {
    // Updates an existing trip by their tripId and returns the updated trip.
    updateTrip(tripId: number, trip: ITrip, dbSession: ClientSession | undefined): Promise<ITrip>;
}

// This decorator ensures that UpdateTripService is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class UpdateTripService implements IUpdateTripService {
    // Injecting the TripRepository service
    constructor(
        @inject('IUpdateTripRepository') private updateTripRepository: IUpdateTripRepository
    ) { }

    // Updates an existing trip by their tripId and returns the updated trip.
    public async updateTrip(tripId: number, trip: ITrip, dbSession: ClientSession | undefined): Promise<ITrip> {

        // Check if the trip exists. If not, throw an error.
        let isExist = await this.updateTripRepository.isExist(tripId);
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

        let newItem: ITripSchema = new TripSchema();

        const keys = Object.keys(trip);

        for (let i = 0; i < keys.length; i++) {
            if (trip[keys[i]]) {
                newItem[keys[i]] = trip[keys[i]];
            }
        }

        // Update the trip entry in the database
        let results = await this.updateTripRepository.updateTrip(tripId, newItem, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        // Return the updated trip object
        return results;
    }
}
