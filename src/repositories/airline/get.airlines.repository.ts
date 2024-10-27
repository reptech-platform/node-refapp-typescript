import { Error } from "mongoose";
import Helper from "../../utils/helper.utils";
import { injectable, inject } from "inversify";
import AirlineSchema, { IAirlineSchema } from "../../db/dao/airline.db.model";
import { IAirline } from "../../models/airline.model";

// Interface for GetAirlinesRepository
export default interface IGetAirlinesRepository {
    // Method to get all airlines
    getAirlines(): Promise<IAirline[]>;
}

// This decorator ensures that GetAirlinesRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class GetAirlinesRepository implements IGetAirlinesRepository {
    // Injecting the Helper service
    constructor(@inject(Helper) private helper: Helper) { }

    // Fetches a single Airline by its airlineCode, excluding the _id field.
    public async getAirlines(): Promise<IAirline[]> {

        return await AirlineSchema.find({}, { _id: 0 })
            .then((data: IAirlineSchema[]) => {
                // Uses the helper to process the Airline.
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IAirline[];
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });
    }
}
