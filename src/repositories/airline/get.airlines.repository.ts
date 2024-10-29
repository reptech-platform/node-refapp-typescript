import { Error } from "mongoose";
import Helper from "../../utils/helper.utils";
import { injectable, inject } from "inversify";
import AirlineStaffSchema from "../../db/dao/airlinestaff.db.model";
import { IAirlineSchema } from "../../db/dao/airline.db.model";
import { IAirline } from "../../models/airline.model";
import { IAirlineStaff } from "../../models/airlinestaff.model";

// Interface for GetAirlinesRepository
export default interface IGetAirlinesRepository {
    // Method to get all airlines
    getAirlinesAndStaffs(): Promise<IAirlineStaff[]>;
}

// This decorator ensures that GetAirlinesRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class GetAirlinesRepository implements IGetAirlinesRepository {
    // Injecting the Helper service
    constructor(@inject(Helper) private helper: Helper) { }

    // Fetches a single Airline by its airlineCode, excluding the _id field.
    public async getAirlinesAndStaffs(): Promise<IAirlineStaff[]> {

        let $pipeline = [
            {
                $lookup: {
                    from: "airlines", localField: "airlineCode", foreignField: "airlineCode", as: "airlines",
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
                $lookup: {
                    from: "persons", localField: "userName", foreignField: "userName", as: "staffs",
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
            { $unwind: { path: "$staffs", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    "$airlines": 1,
                    "$staffs": 1
                }
            }
        ];

        return await AirlineStaffSchema.aggregate($pipeline)
            .then((data: IAirlineSchema[]) => {
                // Uses the helper to process the Airline.
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IAirlineStaff[];
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });
    }
}
