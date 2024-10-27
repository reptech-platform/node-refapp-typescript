import { ClientSession, Error } from "mongoose";
import AirportSchema, { IAirportSchema } from "../../db/dao/airport.db.model";
import { IAirport } from "../../models/airport.model";
import Helper from "../../utils/helper.utils";
import { injectable, inject } from "inversify";

// Interface for UpdateAirportRepository
export default interface IUpdateAirportRepository {
    // Updates an airport's information based on the provided ICAO and IATA codes.
    updateAirport(icaoCode: string, iataCode: string, airport: IAirport, session: ClientSession | undefined): Promise<IAirport>;

    // Method to check if an airport exists by its ICAO and IATA codes
    isAirportExist(icaoCode: string, iataCode: string): Promise<boolean>;
}

// This decorator ensures that UpdateAirportRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class UpdateAirportRepository implements IUpdateAirportRepository {
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

    // Updates an airport's information based on the provided ICAO and IATA codes.
    public async updateAirport(icaoCode: string, iataCode: string, airport: IAirport, session: ClientSession | undefined): Promise<IAirport> {

        // Find and update the airport document with the new data.
        return await AirportSchema.findOneAndUpdate({ icaoCode, iataCode }, airport, { new: true, session })
            .then((data: any) => {
                // Extract the first item from the data array using a helper function.
                let results = this.helper.GetItemFromArray(data, 0, {});
                // Return the results cast as an IAirport object.
                return results as IAirport;
            })
            .catch((error: Error) => {
                // Throw an error if the update operation fails.
                throw error;
            });
    }
}
