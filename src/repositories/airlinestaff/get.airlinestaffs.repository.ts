import { Error } from "mongoose";
import { injectable } from "inversify";
import AirlineStaffSchema from "../../db/dao/airlinestaff.db.model";
import { IPerson } from "../../models/person.model";
import { IAirline } from "../../models/airline.model";

// Interface for GetAirlineStaffRepository
export default interface IGetAirlineStaffsRepository {
    // This method get multiple staff to a airline.
    getArilineStaffs(airlineCode: string): Promise<IPerson[]>;

    // This method get multiple staff to a airline.
    getStaffArilines(userName: string): Promise<IAirline[]>;
}

// This decorator ensures that GetAirlineStaffRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class GetAirlineStaffsRepository implements IGetAirlineStaffsRepository {
    // Injecting the Helper service
    constructor() { }

    // This method get multiple staff to a airline.
    public async getArilineStaffs(airlineCode: string): Promise<IPerson[]> {

        // Define the aggregation pipeline
        let $pipeline = [
            // Match documents where the airlineCode matches the provided airlineCode
            { $match: { airlineCode } },
            {
                // Perform a lookup to join the 'trips' collection
                $lookup: {
                    from: "persons", // The collection to join
                    localField: "userName", // The field from the input documents
                    foreignField: "userName", // The field from the 'persons' collection
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
                // Project the 'mapItems' array as 'persons'
                $project: {
                    "_id": 0,
                    "userName": 0,
                    "mapItems": 0,
                    "__v": 0
                }
            }
        ];

        // Execute the aggregation pipeline on the AirportStaffSchema
        return await AirlineStaffSchema.aggregate($pipeline)
            .then((data: any[]) => {
                // Resolve the promise with the resulting data
                return data.map(x => x.items);
            })
            .catch((error: Error) => {
                // Throw an error if the aggregation fails
                throw error;
            });
    }

    // This method get multiple staff to a airline.
    public async getStaffArilines(userName: string): Promise<IAirline[]> {

        // Define the aggregation pipeline
        let $pipeline = [
            // Match documents where the tripId matches the provided tripId
            { $match: { userName } },
            {
                // Perform a lookup to join the 'persons' collection
                $lookup: {
                    from: "airlines", // The collection to join
                    localField: "airlineCode", // The field from the input documents
                    foreignField: "airlineCode", // The field from the 'trips' collection
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
                    "airlineCode": 0,
                    "mapItems": 0,
                    "__v": 0
                }
            }
        ];

        // Execute the aggregation pipeline on the PersonTripSchema
        return await AirlineStaffSchema.aggregate($pipeline)
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
