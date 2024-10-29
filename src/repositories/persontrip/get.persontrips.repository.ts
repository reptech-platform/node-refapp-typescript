
import { Error } from "mongoose";
import { injectable } from "inversify";
import PersonTripSchema from "../../db/dao/persontrip.db.model";
import { IPerson } from "../../models/person.model";
import { ITrip } from "../../models/trip.model";

// Interface for GetPersonTripsRepository
export default interface IGetPersonTripsRepository {
    // Fetches all Trips from the database
    getAllPersonTrips(): Promise<ITrip[]>;

    // Fetches all Persons from the database
    getAllTripTravellers(): Promise<IPerson[]>;
}

// This decorator ensures that GetPersonTripsRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class GetPersonTripsRepository implements IGetPersonTripsRepository {
    // Injecting the Helper service
    constructor() { }

    // Fetches all Trips from the database
    public async getAllPersonTrips(): Promise<ITrip[]> {
        // Define the aggregation pipeline
        let $pipeline = [
            {
                // Perform a lookup to join the 'trips' collection
                $lookup: {
                    from: "trips", // The collection to join
                    localField: "tripId", // The field from the input documents
                    foreignField: "tripId", // The field from the 'trips' collection
                    as: "mapItems", // The name of the new array field to add to the input documents
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
            { $unwind: { path: "$mapItems", preserveNullAndEmptyArrays: true } },
            { "$addFields": { "items": "$mapItems" } },
            {
                // Project the 'mapItems' array as 'trips'
                $project: {
                    "_id": 0,
                    "tripId": 0,
                    "mapItems": 0,
                    "__v": 0
                }
            }
        ];

        // Execute the aggregation pipeline on the PersonTripSchema
        return await PersonTripSchema.aggregate($pipeline)
            .then((data: any[]) => {
                // Resolve the promise with the resulting data
                return data.map(x => x.items);
            })
            .catch((error: Error) => {
                // Throw an error if the aggregation fails
                throw error;
            });
    }

    // Fetches all Persons from the database
    public async getAllTripTravellers(): Promise<IPerson[]> {
        // Define the aggregation pipeline
        let $pipeline = [
            {
                // Perform a lookup to join the 'persons' collection
                $lookup: {
                    from: "persons", // The collection to join
                    localField: "userName", // The field from the input documents
                    foreignField: "userName", // The field from the 'trips' collection
                    as: "mapItems", // The name of the new array field to add to the input documents
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
            { $unwind: { path: "$mapItems", preserveNullAndEmptyArrays: true } },
            { "$addFields": { "items": "$mapItems" } },
            {
                // Project the 'mapItems' array as 'trips'
                $project: {
                    "_id": 0,
                    "userName": 0,
                    "mapItems": 0,
                    "__v": 0
                }
            }
        ];

        // Execute the aggregation pipeline on the PersonTripSchema
        return await PersonTripSchema.aggregate($pipeline)
            .then((data: any[]) => {
                // Resolve the promise with the resulting data
                return data.map(x => x.items);
            })
            .catch((error: Error) => {
                // Throw an error if the aggregation fails
                throw error;
            });
    }
}
