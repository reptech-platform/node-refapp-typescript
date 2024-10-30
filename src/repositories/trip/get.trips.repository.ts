import { ITrip } from "../../models/trip.model";
import { Error } from "mongoose";
import TripSchema, { ITripSchema } from "../../db/dao/trip.db.model";
import Helper from "../../utils/helper.utils";
import { injectable, inject } from "inversify";

// Interface for GetTripsRepository
export default interface IGetTripsRepository {
    // Fetches all Trips from the database
    getAllTrips(): Promise<ITrip[]>;
}

// This decorator ensures that GetTripsRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class GetTripsRepository implements IGetTripsRepository {
    // Injecting the Helper service
    constructor(@inject(Helper) private helper: Helper) { }

    // Fetches all Trips from the database
    public async getAllTrips(): Promise<ITrip[]> {
        return await TripSchema.find({}, { _id: 0 })
            .then((data: ITripSchema[]) => {
                // Uses the helper to process the array of Trips.
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as ITrip[];
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });
    }
}
