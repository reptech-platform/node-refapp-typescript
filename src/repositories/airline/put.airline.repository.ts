import { ClientSession, Error } from "mongoose";
import AirlineSchema, { IAirlineSchema } from "../../db/dao/airline.db.model";
import Helper from "../../utils/helper.utils";
import { injectable, inject } from "inversify";
import { IAirlineRead } from "../../models/airline/airline.read.model";

// Interface for UpdateAirlineRepository
export default interface IUpdateAirlineRepository {
    // Updates an airline's information based on the provided airline code.
    updateAirline(airlineCode: string, airline: IAirlineSchema, session: ClientSession | undefined): Promise<IAirlineRead>;

    // Method to check if an airline exists by its code
    isExist(airlineCode: string): Promise<boolean>;
}

// This decorator ensures that UpdateAirlineRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class UpdateAirlineRepository implements IUpdateAirlineRepository {
    // Injecting the Helper service
    constructor(@inject(Helper) private helper: Helper) { }

    // Method to check if an airline exists by its code
    public async isExist(airlineCode: string): Promise<boolean> {
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

    // Updates an airline's information based on the provided airline code.
    public async updateAirline(airlineCode: string, airline: IAirlineSchema, session: ClientSession | undefined): Promise<IAirlineRead> {

        // Find and update the airline document with the new data.
        return await AirlineSchema.findOneAndUpdate({ airlineCode }, airline, { new: true, session })
            .then((data: any) => {
                // Extract the first item from the data array using a helper function.
                let results = this.helper.GetItemFromArray(data, 0, {});
                // Return the results cast as an IAirlineRead object.
                return results as IAirlineRead;
            })
            .catch((error: Error) => {
                // Throw an error if the update operation fails.
                throw error;
            });
    }
}
