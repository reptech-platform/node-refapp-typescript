import { ClientSession, Error } from "mongoose";
import Helper from "../../utils/helper.utils";
import { injectable, inject } from "inversify";
import DbSession from "../../db/utils/dbsession.db";
import TripSchema, { ITripSchema } from "../../db/dao/trip.db.model";
import { ITrip } from "../../models/trip.model";

// Interface for CreateTripRepository
export default interface ICreateTripRepository {
    // Creates a new trip in the database.
    createTrip(trip: ITripSchema, session: ClientSession | undefined): Promise<ITrip>;

    // Checks if a trip with the given tripId exists in the database.
    isExist(tripId: number): Promise<boolean>;
}

// This decorator ensures that CreateTripRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class CreateTripRepository implements ICreateTripRepository {
    // Injecting the Helper service
    constructor(@inject(Helper) private helper: Helper) { }

    // Checks if a trip with the given tripId exists in the database.
    public async isExist(tripId: number): Promise<boolean> {
        return await TripSchema.find({ tripId }, { _id: 1 })
            .then((data: ITripSchema[]) => {
                // Uses the helper to process the array of trips.
                let results = this.helper.GetItemFromArray(data, 0, { _id: null });
                // Returns true if the trip exists, otherwise false.
                if (!this.helper.IsNullValue(results._id)) return true;
                return false;
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });
    }

    // Creates a new trip in the database.
    public async createTrip(trip: ITripSchema, session: ClientSession | undefined): Promise<ITrip> {

        // Save the document for the model
        let newTrip = await TripSchema.create([trip], { session })
            .then((data: any) => {
                // Uses the helper to process the trip.
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as ITrip;
            })
            .catch((error: Error) => {
                // Abort Client Session
                DbSession.Abort(session);
                // Throws an error if the operation fails.
                throw error;
            });

        // Returns newly created trip object
        return newTrip;
    }
}
