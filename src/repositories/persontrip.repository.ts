import { Error } from "mongoose";
import { provideSingleton, inject } from "../utils/provideSingleton";
import PersonTripSchema from "../db/models/persontrip.db.model";
import { IPerson } from "../models/person.model";
import { ITrip } from "../models/trip.model";
import Helper from "../utils/helper.utils";

// This decorator ensures that PersonTripsService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@provideSingleton(PersonTripRepository)
export default class PersonTripRepository {

    // Injecting the Helper, PersonsService and TripService services
    constructor(@inject(Helper) private helper: Helper) { }

    // This method checks if a person with the given userName is associated with a trip with the given tripId.
    public async isPersonAndTripExist(userName: string, tripId: number): Promise<boolean> {

        return await PersonTripSchema.find({ userName, tripId }, { _id: 1 })
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

    // This method adds multiple trips for a person.
    public async addOrUpadatePersonTrips(mapItems: [] | any[]): Promise<void> {

        /* if (trips && trips.length > 0) {
            // Loop Check if the trips already exists in the database using its userName
            for (let index = 0; index < trips.length; index++) {

                // Read trip based on index loop
                let currentTrip = trips[index];

                // Check the trip is exist in the database
                let isExist = await this.tripsService.isTripExist(currentTrip.tripId);

                if (!isExist) {
                    // If the trip does not exist, create a new trip entry in the database
                    currentTrip = await this.tripsService.createTrip(currentTrip);
                } else {
                    // If the trip exist, update trip entry in the database
                    await this.tripsService.updateTrip(currentTrip.tripId, currentTrip);
                }

                // Check person and trip is already mapped
                isExist = await this.isPersonAndTripExist(userName, currentTrip.tripId);

                if (!isExist) {
                    // Add tripId to array of id list for person trip mapping
                    mapItems.push({ userName, tripId: currentTrip.tripId });
                }
            }
        } */

        // Inserts the mapItems into the PersonTripSchema collection.
        await PersonTripSchema.insertMany(mapItems).catch((error: Error) => {
            // Throws an error if the operation fails.
            throw error;
        });
    }

    // This method deletes a trip for a person.
    public async deletePersonTrip(userName: string, tripId: number): Promise<void> {

        // Deletes the trip from the PersonTripSchema collection.
        await PersonTripSchema.deleteOne({ userName, tripId }).catch((error: Error) => {
            // Throws an error if the operation fails.
            throw error;
        });
    }

    // This method deletes a all trips for a person.
    public async deleteAllPersonTrips(userName: string): Promise<void> {

        // Deletes the trip from the PersonTripSchema collection.
        await PersonTripSchema.deleteMany({ userName }).catch((error: Error) => {
            // Throws an error if the operation fails.
            throw error;
        });
    }

    // This method get multiple travellers to a trip.
    public async getTripTravellers(tripId: number): Promise<IPerson[]> {

        // Define the aggregation pipeline
        let $pipeline = [
            // Match documents where the tripId matches the provided tripId
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

    // This method adds multiple travellers to a trip.
    public async addOrUpdateTripTravellers(mapItems: [] | any[]): Promise<void> {

        /* if (travellers && travellers.length > 0) {
            // Loop Check if the travellers are already exists in the database using its tripId
            for (let index = 0; index < travellers.length; index++) {

                // Read traveller based on index loop
                let currentTraveller = travellers[index];

                // Check the traveller is exist in the database
                let isExist = await this.personsService.isPersonExist(currentTraveller.userName);

                if (!isExist) {
                    // If the traveller does not exist, create a new traveller entry in the database
                    currentTraveller = await this.personsService.createPerson(currentTraveller);
                } else {
                    // If the trip exist, update trip entry in the database
                    await this.personsService.updatePerson(currentTraveller.userName, currentTraveller);
                }

                // Check person and trip is already mapped
                isExist = await this.isPersonAndTripExist(currentTraveller.userName, tripId);

                if (!isExist) {
                    // Add tripId to array of id list for person trip mapping
                    mapItems.push({ userName: currentTraveller.userName, tripId });
                }
            }
        } */

        // Inserts the mapItems into the PersonTripSchema collection.
        await PersonTripSchema.insertMany(mapItems).catch((error: Error) => {
            // Throws an error if the operation fails.
            throw error;
        });
    }

    // This method deletes a all travellers for a tripe.
    public async deleteAllTripTravellers(tripId: number): Promise<void> {

        // Deletes the trip from the PersonTripSchema collection.
        await PersonTripSchema.deleteMany({ tripId }).catch((error: Error) => {
            // Throws an error if the operation fails.
            throw error;
        });
    }

}