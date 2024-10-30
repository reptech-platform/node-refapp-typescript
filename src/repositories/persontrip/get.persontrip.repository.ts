import { Error } from "mongoose";
import Helper from "../../utils/helper.utils";
import { injectable, inject } from "inversify";
import { ITrip } from "../../models/trip.model";
import PersonTripSchema from "../../db/dao/persontrip.db.model";
import { IPerson } from "../../models/person.model";

// Interface for GetTripRepository
export default interface IGetPersonTripRepository {
    // This method get multiple trips to a person.
    getPersonTrips(userName: string): Promise<ITrip[]>;

    // This method get multiple travellers to a trip.
    getTripTravellers(tripId: number): Promise<IPerson[]>;

    // This method checks if a person with the given userName is associated with a trip with the given tripId.
    isExist(userName: string | undefined | null, tripId: number | undefined | null): Promise<boolean>;
}

// This decorator ensures that GetTripRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class GetPersonTripRepository implements IGetPersonTripRepository {
    // Injecting the Helper service
    constructor(@inject(Helper) private helper: Helper) { }

    // This method checks if a person with the given userName is associated with a trip with the given tripId.
    public async isExist(userName: string | undefined | null, tripId: number | undefined | null): Promise<boolean> {

        // Validate the inputs 
        if (!tripId && !userName) {
            throw new Error("At least one of tripId or userName must be provided")
        }

        if (tripId && !userName) {
            return await PersonTripSchema.find({ tripId }, { _id: 1 })
                .then((data: any[]) => {
                    // Uses the helper to process the array of results.
                    let results = this.helper.GetItemFromArray(data, 0, { _id: null });
                    // Returns true if the association exists, otherwise false.
                    if (!this.helper.IsNullValue(results._id)) return true;
                    return false;
                })
                .catch((error: Error) => {
                    // Throws an error if the operation fails.
                    throw error;
                });
        }

        if (!tripId && userName) {
            return await PersonTripSchema.find({ userName }, { _id: 1 })
                .then((data: any[]) => {
                    // Uses the helper to process the array of results.
                    let results = this.helper.GetItemFromArray(data, 0, { _id: null });
                    // Returns true if the association exists, otherwise false.
                    if (!this.helper.IsNullValue(results._id)) return true;
                    return false;
                })
                .catch((error: Error) => {
                    // Throws an error if the operation fails.
                    throw error;
                });
        }

        return await PersonTripSchema.find({ userName, tripId }, { _id: 1 })
            .then((data: any[]) => {
                let results = this.helper.GetItemFromArray(data, 0, { _id: null });
                // Returns true if the association exists, otherwise false.
                return !this.helper.IsNullValue(results._id);
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    // This method get multiple trips to a person.
    public async getPersonTrips(userName: string): Promise<ITrip[]> {

        // Define the aggregation pipeline
        let $pipeline = [
            // Match documents where the userName matches the provided userName
            { $match: { userName } },
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

    // This method get multiple travellers to a trip.
    public async getTripTravellers(tripId: number): Promise<IPerson[]> {

        // Define the aggregation pipeline
        let $pipeline = [
            // Match documents where the userName matches the provided userName
            { $match: { tripId } },
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
