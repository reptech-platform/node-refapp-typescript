import { Error } from "mongoose";
import Helper from "../../utils/helper.utils";
import { injectable, inject } from "inversify";
import AirportSchema, { IAirportSchema } from "../../db/dao/airport.db.model";
import { IAirport } from "../../models/airport.model";

// Interface for GetAirportRepository
export default interface IGetAirportRepository {
    // Method to get a specific airport by its ICAO and IATA codes
    getAirport(icaoCode: string, iataCode: string): Promise<IAirport>;

    // Method to get a specific airport id by its ICAO and IATA codes
    getAirportId(icaoCode: string, iataCode: string): Promise<string>

    // Method to check if an airport exists by its ICAO and IATA codes
    isExist(icaoCode: string, iataCode: string): Promise<boolean>;
}

// This decorator ensures that GetAirportRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class GetAirportRepository implements IGetAirportRepository {
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

    // Method to get a specific airport by its ICAO and IATA codes
    public async getAirport(icaoCode: string, iataCode: string): Promise<IAirport> {

        let $pipeline = [
            { $match: { icaoCode, iataCode } },
            {
                $lookup: {
                    from: "airlines", localField: "airlineId", foreignField: "_id", as: "airlines",
                    pipeline: [
                        {
                            $project: {
                                __v: 0,
                                _id: 0
                            }
                        }
                    ]
                }
            },
            { $unwind: { path: "$airlines", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 0,
                    airportId: 0,
                    __v: 0
                }
            }
        ];

        return await AirportSchema.aggregate($pipeline)
            .then((data: IAirportSchema[]) => {
                // Uses the helper to process the Airport.
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IAirport;
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });
    }

    // Method to get a specific airport id by its ICAO and IATA codes
    public async getAirportId(icaoCode: string, iataCode: string): Promise<string> {

        return await AirportSchema.find({ icaoCode, iataCode }, { _id: 1 })
            .then((data: IAirportSchema[]) => {
                // Uses the helper to process the Airport.
                let results = this.helper.GetItemFromArray(data, 0, { _id: null });
                return results._id;
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });
    }
}
