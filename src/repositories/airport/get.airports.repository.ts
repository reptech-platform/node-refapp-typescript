import { Error } from "mongoose";
import Helper from "../../utils/helper.utils";
import { injectable, inject } from "inversify";
import AirportSchema, { IAirportSchema } from "../../db/dao/airport.db.model";
import { IAirport } from "../../models/airport.model";

// Interface for GetAirportRepository
export default interface IGetAirportsRepository {
    // Method to get all airports
    getAirports(): Promise<IAirport[]>;
}

// This decorator ensures that GetAirportRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class GetAirportsRepository implements IGetAirportsRepository {
    // Injecting the Helper service
    constructor(@inject(Helper) private helper: Helper) { }

    // Method to get all airports
    public async getAirports(): Promise<IAirport[]> {

        let $pipeline = [
            {
                $lookup: {
                    from: "airlines", localField: "airline", foreignField: "airlineCode", as: "airlines",
                    pipeline: [
                        {
                            $project: {
                                __v: 0,
                                _id: 0,
                                airportId: 0,
                                "CEO._id": 0
                            }
                        }
                    ]
                }
            },
            { $unwind: { path: "$airlines", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 0,
                    airline: 0,
                    __v: 0
                }
            }
        ];

        return await AirportSchema.aggregate($pipeline)
            .then((data: IAirportSchema[]) => {
                // Uses the helper to process the Airport.
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IAirport[];
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });
    }
}
