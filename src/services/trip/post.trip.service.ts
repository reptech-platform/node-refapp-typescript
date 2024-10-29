import { ITrip } from "../../models/trip.model";
import { inject, injectable } from "inversify";
import { ClientSession } from "mongoose";
import DbSession from "../../db/utils/dbsession.db";
import ICreateTripRepository from "../../repositories/trip/post.trip.repository";
import TripSchema, { ITripSchema } from "../../db/dao/trip.db.model";

// Interface for CreateTripService
export default interface ICreateTripService {
    // Creates a new trip in the database.
    createTrip(trip: ITrip, dbSession: ClientSession | undefined): Promise<ITrip>;
}

// This decorator ensures that CreateTripService is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class CreateTripService implements ICreateTripService {
    // Injecting the TripRepository service
    constructor(
        @inject('ICreateTripRepository') private createTripRepository: ICreateTripRepository
    ) { }

    // Creates a new trip in the database.
    public async createTrip(trip: ITrip, dbSession: ClientSession | undefined): Promise<ITrip> {

        if (trip.tripId) {
            // Check if the trip exists. If they do, throw an error.
            let isExist = await this.createTripRepository.isExist(trip.tripId);
            if (isExist) {
                throw new Error(`Provided trip '${trip.tripId}' already exists`);
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

        let newItem: ITripSchema = new TripSchema();

        const keys = Object.keys(trip);

        for (let i = 0; i < keys.length; i++) {
            if (trip[keys[i]]) {
                newItem[keys[i]] = trip[keys[i]];
            }
        }

        // Create new trip entry in the database
        let results = await this.createTripRepository.createTrip(newItem, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        // Return newly created trip object
        return results;
    }
}
