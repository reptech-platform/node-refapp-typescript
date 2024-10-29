import { injectable, inject } from "inversify";
import { ClientSession, Error } from "mongoose";
import Helper from "../../utils/helper.utils";
import AirlineStaffSchema from "../../db/dao/airlinestaff.db.model";
import DbSession from "../../db/utils/dbsession.db";

// Interface for DeleteAirlineStaffRepository
export default interface IDeleteAirlineStaffRepository {
    // This method deletes a staff for a ailine.
    deleteStaffStaff(airlineCode: string, userName: string, session: ClientSession | undefined): Promise<void>;

    // This method checks if a person with the given userName is associated with a airline with the given airlineCode.
    isAirlineAndStaffExist(airlineCode: string, userName: string): Promise<boolean>;
}

// This decorator ensures that DeleteAirlineStaffRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class DeleteAirlineStaffRepository implements IDeleteAirlineStaffRepository {

    // Injecting the Helper service
    constructor(@inject(Helper) private helper: Helper) { }

    // This method checks if a person with the given userName is associated with a airline with the given airlineCode.
    public async isAirlineAndStaffExist(airlineCode: string, userName: string): Promise<boolean> {

        return await AirlineStaffSchema.find({ airlineCode, userName }, { _id: 1 })
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

    // This method deletes a staff for a ailine.
    public async deleteStaffStaff(airlineCode: string, userName: string, session: ClientSession | undefined): Promise<void> {

        // Deletes the userName from the AirportStaffSchema collection.
        await AirlineStaffSchema.deleteOne({ airlineCode, userName }, { session }).catch((error: Error) => {
            // Abort Client Session if there's an error
            DbSession.Abort(session);
            // Throws an error if the operation fails.
            throw error;
        });
    }
}
