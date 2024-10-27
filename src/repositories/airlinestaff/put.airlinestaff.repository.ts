import { ClientSession, Error } from "mongoose";
import Helper from "../../utils/helper.utils";
import { injectable, inject } from "inversify";
import AirlineStaffSchema from "../../db/dao/airlinestaff.db.model";

// Interface for UpdateAirlineStaffRepository
export default interface IUpdateAirlineStaffRepository {
    // This method adds multiple airlines to a staff.
    addOrUpdateStaffAirlines(mapItems: [] | any[], session: ClientSession | undefined): Promise<void>;

    // This method checks if a person with the given userName is associated with a airline with the given airlineCode.
    isAirlineAndStaffExist(airlineCode: string, userName: string): Promise<boolean>;
}

// This decorator ensures that UpdateAirlineStaffRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class UpdateAirlineStaffRepository implements IUpdateAirlineStaffRepository {
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

    // This method adds multiple airlines to a staff.
    public async addOrUpdateStaffAirlines(mapItems: [] | any[], session: ClientSession | undefined): Promise<void> {

        // Inserts the mapItems into the PersonTripSchema collection.
        await AirlineStaffSchema.insertMany(mapItems, { session }).catch((error: Error) => {
            // Throws an error if the operation fails.
            throw error;
        });
    }
}
