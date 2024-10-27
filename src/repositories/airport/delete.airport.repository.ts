import { injectable, inject } from "inversify";
import { ClientSession, Error } from "mongoose";
import Helper from "../../utils/helper.utils";
import AirportSchema, { IAirportSchema } from "../../db/dao/airport.db.model";

// Interface for DeleteAirportRepository
export default interface IDeleteAirportRepository {
    // Deletes an airport based on the provided ICAO and IATA codes.
    deleteAirport(icaoCode: string, iataCode: string, session: ClientSession | undefined): Promise<boolean>;

    // Method to check if an airport exists by its ICAO and IATA codes
    isAirportExist(icaoCode: string, iataCode: string): Promise<boolean>;
}

// This decorator ensures that DeleteAirportRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class DeleteAirportRepository implements IDeleteAirportRepository {

    // Injecting the Helper service
    constructor(@inject(Helper) private helper: Helper) { }

    // Method to check if an airport exists by its ICAO and IATA codes
    public async isAirportExist(icaoCode: string, iataCode: string): Promise<boolean> {
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

    // Deletes an airport based on the provided ICAO and IATA codes.
    public async deleteAirport(icaoCode: string, iataCode: string, session: ClientSession | undefined): Promise<boolean> {

        // Find and delete the airport document.
        return await AirportSchema.findOneAndDelete({ icaoCode, iataCode }, { session })
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
