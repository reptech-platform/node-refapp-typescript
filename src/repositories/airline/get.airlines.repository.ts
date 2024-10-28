import { Error } from "mongoose";
import Helper from "../../utils/helper.utils";
import { injectable, inject } from "inversify";
import AirlineSchema, { IAirlineSchema } from "../../db/dao/airline.db.model";
import { IAirlineRead } from "../../models/airline/airline.read.model";

// Interface for GetAirlinesRepository
export default interface IGetAirlinesRepository {
    // Method to get all airlines
    getAirlines(): Promise<IAirlineRead[]>;
}

// This decorator ensures that GetAirlinesRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class GetAirlinesRepository implements IGetAirlinesRepository {
    // Injecting the Helper service
    constructor(@inject(Helper) private helper: Helper) { }

    // Fetches a single Airline by its airlineCode, excluding the _id field.
    public async getAirlines(): Promise<IAirlineRead[]> {

        let $pipeline = [
            {
                $lookup: {
                    from: "airports", localField: "airportId", foreignField: "_id", as: "airports",
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
            { $unwind: { path: "$airports", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 0,
                    airportId: 0,
                    __v: 0,
                    "CEO._id": 0
                }
            }
        ];

        return await AirlineSchema.aggregate($pipeline)
            .then((data: IAirlineSchema[]) => {
                // Uses the helper to process the Airline.
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IAirlineRead[];
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });
    }
}
