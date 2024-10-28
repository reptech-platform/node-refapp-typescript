import { ClientSession, Error } from "mongoose";
import Helper from "../../utils/helper.utils";
import { injectable, inject } from "inversify";
import AirportSchema, { IAirportSchema } from "../../db/dao/airport.db.model";
import { IAirportRead } from "../../models/airport/airport.read.model";

// Interface for CreateAirportRepository
export default interface ICreateAirportRepository {
    // Creates a new Airport in the database.
    createAirport(airport: IAirportSchema, session: ClientSession | undefined): Promise<IAirportRead>;

    // Method to check if an airport exists by its ICAO and IATA codes
    isExist(icaoCode: string, iataCode: string): Promise<boolean>;
}

// This decorator ensures that CreateAirportRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class CreateAirportRepository implements ICreateAirportRepository {
    // Injecting the Helper service
    constructor(@inject(Helper) private helper: Helper) { }

    // Method to check if an airport exists by its ICAO and IATA codes
    public async isExist(icaoCode: string, iataCode: string): Promise<boolean> {
        return await AirportSchema.find({ icaoCode, iataCode }, { _id: 1 })
            .then((data: IAirportSchema[]) => {
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

    // Method to create a new airport
    public async createAirport(airport: IAirportSchema, session: ClientSession | undefined): Promise<IAirportRead> {

        // create the airport document with the new data.
        return await AirportSchema.create([airport], { session })
            .then((data: any) => {
                // Get the first item from the array or return an empty object
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IAirportRead;
            })
            .catch((error: Error) => {
                // Handle any errors that occur during the creation
                throw error;
            });
    }
}
