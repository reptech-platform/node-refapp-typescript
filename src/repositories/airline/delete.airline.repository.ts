import { injectable, inject } from "inversify";
import { ClientSession, Error } from "mongoose";
import Helper from "../../utils/helper.utils";
import AirlineSchema, { IAirlineSchema } from "../../db/dao/airline.db.model";

// Interface for DeleteAirlineRepository
export default interface IDeleteAirlineRepository {
    // Deletes an airline based on the provided airline code.
    deleteAirline(airlineCode: string, session: ClientSession | undefined): Promise<boolean>;

    // Method to check if an airline exists by its code
    isAirlineExist(airlineCode: string): Promise<boolean>;
}

// This decorator ensures that DeleteAirlineRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class DeleteAirlineRepository implements IDeleteAirlineRepository {

    // Injecting the Helper service
    constructor(@inject(Helper) private helper: Helper) { }

    // Method to check if an airline exists by its code
    public async isAirlineExist(airlineCode: string): Promise<boolean> {
        return await AirlineSchema.find({ airlineCode }, { _id: 1 })
            .then((data: IAirlineSchema[]) => {
                // Get the first item from the array or return an object with _id: null
                let results = this.helper.GetItemFromArray(data, 0, { _id: null });
                // Check if the _id is not null
                if (!this.helper.IsNullValue(results._id)) return true;
                return false;
            })
            .catch((error: Error) => {
                // Handle any errors that occur during the query
                throw error;
            });
    }

    // Deletes an airline based on the provided airline code.
    public async deleteAirline(airlineCode: string, session: ClientSession | undefined): Promise<boolean> {

        // Find and delete the airline document.
        return await AirlineSchema.findOneAndDelete({ airlineCode }, { session })
            .then(() => {
                // Return true if the deletion was successful.
                return true;
            })
            .catch((error: Error) => {
                // Throw an error if the deletion operation fails.
                throw error;
            });
    }
}
