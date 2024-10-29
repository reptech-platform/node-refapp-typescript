import { Error } from "mongoose";
import Helper from "../../utils/helper.utils";
import { injectable, inject } from "inversify";
import AirlineSchema, { IAirlineSchema } from "../../db/dao/airline.db.model";
import { IAirline } from "../../models/airline.model";

// Interface for GetAirlineRepository
export default interface IGetAirlineRepository {
    // Method to get a specific airline by its code
    getAirline(airlineCode: string): Promise<IAirline>;

    // Method to check if an airline exists by its code
    isExist(airlineCode: string): Promise<boolean>;
}

// This decorator ensures that GetAirlineRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class GetAirlineRepository implements IGetAirlineRepository {
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

    // Fetches a single Airline by its airlineCode, excluding the _id field.
    public async getAirline(airlineCode: string): Promise<IAirline> {

        let $pipeline = [
            { $match: { airlineCode } },
            {
                $lookup: {
                    from: "airports", localField: "airportId", foreignField: "_id", as: "airports",
                    pipeline: [
                        {
                            $project: {
                                "__v": 0,
                                "_id": 0,
                                "airlineId": 0
                            }
                        }
                    ]
                }
            },
            { $unwind: { path: "$airports", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    "__v": 0,
                    "_id": 0,
                    "CEO._id": 0,
                    "airportId": 0,
                    "ceoName": 0
                }
            }
        ];

        return await AirlineSchema.aggregate($pipeline)
            .then((data: IAirlineSchema[]) => {
                // Uses the helper to process the Airline.
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IAirline;
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });
    }
}
