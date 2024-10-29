import { Error } from "mongoose";
import Helper from "../../utils/helper.utils";
import { injectable, inject } from "inversify";
import TripSchema, { ITripSchema } from "../../db/dao/trip.db.model";
import { ITrip } from "../../models/trip.model";

// Interface for GetTripRepository
export default interface IGetTripRepository {
    // Fetches a single trip by its tripId, excluding the _id field.
    getTrip(tripId: number): Promise<ITrip>;

    // Checks if a trip with the given tripId exists in the database.
    isExist(tripId: number): Promise<boolean>;
}

// This decorator ensures that GetTripRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class GetTripRepository implements IGetTripRepository {
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

    // Fetches a single trip by its tripId, excluding the _id field.
    public async getTrip(tripId: number): Promise<ITrip> {

        return await TripSchema.find({ tripId }, { _id: 0 })
            .then((data: ITripSchema[]) => {
                // Uses the helper to process the trip.
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as ITrip;
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });
    }
}
