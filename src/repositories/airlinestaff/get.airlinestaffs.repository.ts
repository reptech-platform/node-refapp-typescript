import { Error } from "mongoose";
import { inject, injectable } from "inversify";
import Helper from "../../utils/helper.utils";
import AirlineStaffSchema from "../../db/dao/airlinestaff.db.model";
import { IAirlineStaff } from "../../models/airlinestaff.model";

// Interface for GetAirlineStaffRepository
export default interface IGetAirlineStaffsRepository {
    // This method get multiple staff to a airline.
    getAllAirlineStaffs(): Promise<IAirlineStaff[]>;
}

// This decorator ensures that GetAirlineStaffRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class GetAirlineStaffsRepository implements IGetAirlineStaffsRepository {
    // Injecting the Helper service
    constructor(@inject(Helper) private helper: Helper) { }

    // This method get multiple staff to a airline.
    public async getAllAirlineStaffs(): Promise<IAirlineStaff[]> {

        // Define the aggregation pipeline
        let $pipeline = [
            {
                // Perform a lookup to join the 'trips' collection
                $lookup: {
                    from: "persons", // The collection to join
                    localField: "userName", // The field from the input documents
                    foreignField: "userName", // The field from the 'persons' collection
                    as: "persons", // The name of the new array field to add to the input documents
                    pipeline: [
                        {
                            // Project to exclude _id and __v fields from the joined documents
                            $project: {
                                _id: 0,
                                __v: 0
                            }
                        }
                    ]
                }
            },
            // Unwind the 'mapItems' array to deconstruct the array field
            { $unwind: { path: "$persons", preserveNullAndEmptyArrays: true } },
            {
                // Perform a lookup to join the 'trips' collection
                $lookup: {
                    from: "airlines", // The collection to join
                    localField: "airlineCode", // The field from the input documents
                    foreignField: "airlineCode", // The field from the 'persons' collection
                    as: "airlines", // The name of the new array field to add to the input documents
                    pipeline: [
                        {
                            // Project to exclude _id and __v fields from the joined documents
                            $project: {
                                _id: 0,
                                __v: 0,
                                "CEO._id": 0,
                                "airportId": 0
                            }
                        }
                    ]
                }
            },
            // Unwind the 'mapItems' array to deconstruct the array field
            { $unwind: { path: "$airlines", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 0,
                    staff: "$persons",
                    airline: "$airlines"
                }
            }
        ];

        // Execute the aggregation pipeline on the AirportStaffSchema
        return await AirlineStaffSchema.aggregate($pipeline)
            .then((data: any[]) => {
                // Uses the helper to process the Airline.
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IAirlineStaff[];
            })
            .catch((error: Error) => {
                // Throw an error if the aggregation fails
                throw error;
            });
    }
}
