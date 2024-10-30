import { Error } from "mongoose";
import Helper from "../../utils/helper.utils";
import { inject, injectable } from "inversify";
import PersonTripSchema from "../../db/dao/persontrip.db.model";
import { IPersonTrip } from "../../models/persontrip.model";

// Interface for GetPersonTripsRepository
export default interface IGetPersonTripsRepository {
    // Fetches all persons and trips from the database
    getAllPersonsAndTrips(): Promise<IPersonTrip[]>;
}

// This decorator ensures that GetPersonTripsRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class GetPersonTripsRepository implements IGetPersonTripsRepository {
    // Injecting the Helper service
    constructor(@inject(Helper) private helper: Helper) { }

    // Fetches all persons and trips from the database
    public async getAllPersonsAndTrips(): Promise<IPersonTrip[]> {
        // Define the aggregation pipeline
        let $pipeline = [
            {
                // Perform a lookup to join the 'trips' collection
                $lookup: {
                    from: "trips", // The collection to join
                    localField: "tripId", // The field from the input documents
                    foreignField: "tripId", // The field from the 'trips' collection
                    as: "trips", // The name of the new array field to add to the input documents
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
            // Unwind the 'trips' array to deconstruct the array field
            { $unwind: { path: "$trips", preserveNullAndEmptyArrays: true } },
            {
                // Perform a lookup to join the 'persons' collection
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
            // Unwind the 'persons' array to deconstruct the array field
            { $unwind: { path: "$persons", preserveNullAndEmptyArrays: true } },
            {
                // Project the 'mapItems' array as 'trips'
                $project: {
                    "_id": 0,
                    "person": "$persons",
                    "trip": "$trips"
                }
            }
        ];

        // Execute the aggregation pipeline on the PersonTripSchema
        return await PersonTripSchema.aggregate($pipeline)
            .then((data: any[]) => {
                // Uses the helper to process the Airline.
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IPersonTrip[];
            })
            .catch((error: Error) => {
                // Throw an error if the aggregation fails
                throw error;
            });
    }
}
