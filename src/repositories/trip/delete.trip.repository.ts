import { injectable, inject } from "inversify";
import { ClientSession, Error } from "mongoose";
import Helper from "../../utils/helper.utils";
import DbSession from "../../db/utils/dbsession.db";
import TripSchema, { ITripSchema } from "../../db/dao/trip.db.model";

// Interface for DeleteTripRepository
export default interface IDeleteTripRepository {
    // Deletes a trip by its tripId.
    deleteTrip(tripId: number, session: ClientSession | undefined): Promise<boolean>;

    // Checks if a trip with the given tripId exists in the database.
    isExist(tripId: number): Promise<boolean>;
}

// This decorator ensures that DeleteTripRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class DeleteTripRepository implements IDeleteTripRepository {

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

    // Deletes a trip by its tripId.
    public async deleteTrip(tripId: number, session: ClientSession | undefined): Promise<boolean> {

        let boolDeleted: boolean = await TripSchema.findOneAndDelete({ tripId }, { session })
            .then(() => {
                // Returns true if the deletion is successful.
                return true;
            })
            .catch((error: Error) => {
                // Abort Client Session if there's an error
                DbSession.Abort(session);
                // Throws an error if the operation fails.
                throw error;
            });

        return boolDeleted;
    }
}
