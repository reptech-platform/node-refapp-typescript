import { injectable, inject } from "inversify";
import { ClientSession, Error } from "mongoose";
import Helper from "../../utils/helper.utils";
import PersonTripSchema from "../../db/dao/persontrip.db.model";
import DbSession from "../../db/utils/dbsession.db";

// Interface for DeletePersonTripRepository
export default interface IDeletePersonTripRepository {
    // This method deletes a trip for a person.
    deletePersonTrip(userName: string, tripId: number, session: ClientSession | undefined): Promise<boolean>;

    // This method checks if a person with the given userName is associated with a trip with the given tripId.
    isExist(userName: string, tripId: number): Promise<boolean>;
}

// This decorator ensures that DeletePersonTripRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class DeletePersonTripRepository implements IDeletePersonTripRepository {
    // Injecting the Helper service
    constructor(@inject(Helper) private helper: Helper) { }

    // This method checks if a person with the given userName is associated with a trip with the given tripId.
    public async isExist(userName: string, tripId: number): Promise<boolean> {
        return await PersonTripSchema.find({ userName, tripId }, { _id: 1 })
            .then((data: any[]) => {
                let results = this.helper.GetItemFromArray(data, 0, { _id: null });
                // Returns true if the association exists, otherwise false.
                return !this.helper.IsNullValue(results._id);
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    // This method deletes a trip for a person.
    public async deletePersonTrip(userName: string, tripId: number, session: ClientSession | undefined): Promise<boolean> {
        return await PersonTripSchema.deleteOne({ userName, tripId }, { session })
            .then(() => {
                return true;
            })
            .catch((error: Error) => {
                // Abort Client Session if there's an error
                DbSession.Abort(session);
                // Throws an error if the operation fails.
                throw error;
            });
    }
}
