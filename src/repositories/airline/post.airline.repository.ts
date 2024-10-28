import { ClientSession, Error } from "mongoose";
import Helper from "../../utils/helper.utils";
import { injectable, inject } from "inversify";
import AirlineSchema, { IAirlineSchema } from "../../db/dao/airline.db.model";
import { IAirlineRead } from "../../models/airline/airline.read.model";

// Interface for CreateAirlineRepository
export default interface ICreateAirlineRepository {
    // Method to create a new airline
    createAirline(airline: IAirlineSchema, session: ClientSession | undefined): Promise<IAirlineRead>;

    // Method to check if an airline exists by its code
    isExist(airlineCode: string): Promise<boolean>;
}

// This decorator ensures that CreateAirlineRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class CreateAirlineRepository implements ICreateAirlineRepository {
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

    // Method to create a new airline
    public async createAirline(airline: IAirlineSchema, session: ClientSession | undefined): Promise<IAirlineRead> {

        // create the airline document with the new data.
        return await AirlineSchema.create([airline], { session })
            .then((data: any) => {
                // Get the first item from the array or return an empty object
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IAirlineRead;
            })
            .catch((error: Error) => {
                // Handle any errors that occur during the creation
                throw error;
            });
    }
}
