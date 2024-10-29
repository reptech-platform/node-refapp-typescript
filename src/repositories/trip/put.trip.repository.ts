import { ClientSession, Error } from "mongoose";
import TripSchema, { ITripSchema } from "../../db/dao/trip.db.model";
import { ITrip } from "../../models/trip.model";
import Helper from "../../utils/helper.utils";
import { injectable, inject } from "inversify";
import DbSession from "../../db/utils/dbsession.db";

// Interface for UpdateTripRepository
export default interface IUpdateTripRepository {
    // Updates an existing trip by its tripId and returns the updated trip.
    updateTrip(tripId: number, trip: ITripSchema, session: ClientSession | undefined): Promise<ITrip>;

    // Checks if a trip with the given tripId exists in the database.
    isExist(tripId: number): Promise<boolean>;
}

// This decorator ensures that UpdateTripRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class UpdateTripRepository implements IUpdateTripRepository {
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

    // Updates an existing trip by its tripId and returns the updated trip.
    public async updateTrip(tripId: number, trip: ITripSchema, session: ClientSession | undefined): Promise<ITrip> {

        let updatedTrip = await TripSchema.findOneAndUpdate({ tripId }, trip, { new: true, session })
            .then((data: any) => {
                // Uses the helper to process the updated tripe
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as ITrip;
            })
            .catch((error: Error) => {
                // Abort Client Session if there's an error
                DbSession.Abort(session);
                // Throws an error if the operation fails.
                throw error;
            });

        return updatedTrip;
    }
}
