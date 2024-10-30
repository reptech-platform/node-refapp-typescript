import { ClientSession, Error } from "mongoose";
import Helper from "../../utils/helper.utils";
import { injectable, inject } from "inversify";
import DbSession from "../../db/utils/dbsession.db";
import PersonTripSchema, { IPersonTripSchema } from "../../db/dao/persontrip.db.model";

// Interface for CreatePersonTripRepository
export default interface ICreatePersonTripRepository {
    // This method create the trip and person mapping in the database.
    createTripAndPersonMapping(mapItems: [] | any[], session: ClientSession | undefined): Promise<void>;

    // This method checks if a person with the given userName is associated with a trip with the given tripId.
    isExist(userName: string, tripId: number): Promise<boolean>;
}

// This decorator ensures that CreatePersonTripRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class CreatePersonTripRepository implements ICreatePersonTripRepository {
    // Injecting the Helper service
    constructor(@inject(Helper) private helper: Helper) { }

    // This method checks if a person with the given userName is associated with a trip with the given tripId.
    public async isExist(userName: string, tripId: number): Promise<boolean> {

        return await PersonTripSchema.find({ userName, tripId }, { _id: 1 })
            .then((data: any[]) => {
                // Uses the helper to process the array of results.
                let results = this.helper.GetItemFromArray(data, 0, { _id: null });
                // Returns true if the association exists, otherwise false.
                if (!this.helper.IsNullValue(results._id)) return true;
                return false;
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });
    }

    // This method create the trip and person mapping in the database.
    public async createTripAndPersonMapping(mapItems: IPersonTripSchema[] | any[], session: ClientSession | undefined): Promise<void> {

        // Inserts the mapItems into the PersonTripSchema collection.
        await PersonTripSchema.insertMany(mapItems, { session }).catch((error: Error) => {
            // Abort Client Session if there's an error
            DbSession.Abort(session);
            // Throws an error if the operation fails.
            throw error;
        });
    }
}
