import { ClientSession, Error } from "mongoose";
import AirlineStaffSchema from "../db/dao/airlinestaff.db.model";
import { IPerson } from "../models/person.model";
import { IAirline } from "../models/airline.model";
import Helper from "../utils/helper.utils";
import { injectable, inject } from "inversify";

// This decorator ensures that AirlineStaffsService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@injectable()
export default class AirlineStaffRepository {

    // Injecting the Helper, PersonsService and TripService services
    constructor(@inject(Helper) private helper: Helper) { }

    // This method checks if a person with the given userName is associated with a airline with the given airlineCode.
    public async isAirlineAndStaffExist(airlineCode: string, userName: string): Promise<boolean> {

        return await AirlineStaffSchema.find({ airlineCode, userName }, { _id: 1 })
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

    // This method adds multiple staff for a airline.
    public async addOrUpadateAirlineStaffs(mapItems: [] | any[], session: ClientSession | undefined): Promise<void> {

        // Inserts the mapItems into the AirportStaffSchema collection.
        await AirlineStaffSchema.insertMany(mapItems, { session }).catch((error: Error) => {
            // Throws an error if the operation fails.
            throw error;
        });
    }

    // This method deletes a staff for a ailine.
    public async deleteStaffStaff(airlineCode: string, userName: string, session: ClientSession | undefined): Promise<void> {

        // Deletes the userName from the AirportStaffSchema collection.
        await AirlineStaffSchema.deleteOne({ airlineCode, userName }, { session }).catch((error: Error) => {
            // Throws an error if the operation fails.
            throw error;
        });
    }

    // This method deletes a all staffs for a airline.
    public async deleteAllAirlineStaff(airlineCode: string, session: ClientSession | undefined): Promise<void> {

        // Deletes the person from the AirportStaffSchema collection.
        await AirlineStaffSchema.deleteMany({ airlineCode }, { session }).catch((error: Error) => {
            // Throws an error if the operation fails.
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

    // This method adds multiple airlines to a staff.
    public async addOrUpdateStaffAirlines(mapItems: [] | any[], session: ClientSession | undefined): Promise<void> {

        // Inserts the mapItems into the PersonTripSchema collection.
        await AirlineStaffSchema.insertMany(mapItems, { session }).catch((error: Error) => {
            // Throws an error if the operation fails.
            throw error;
        });
    }

    // This method deletes a all airlines for a staff.
    public async deleteAllStaffAirlines(userName: string, session: ClientSession | undefined): Promise<void> {

        // Deletes the trip from the AirportStaffSchema collection.
        await AirlineStaffSchema.deleteMany({ userName }, { session }).catch((error: Error) => {
            // Throws an error if the operation fails.
            throw error;
        });
    }

}