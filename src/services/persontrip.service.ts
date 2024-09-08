import { Error } from "mongoose";
import { provideSingleton, inject } from "../utils/provideSingleton";
import TripService from "../services/trip.service";
import PersonsService from "../services/person.service";
import PersonSchema from "../db/models/person.db.model";
import PersonTripSchema, { IPersonTripSchema } from "../db/models/persontrip.db.model";
import TripSchema from "../db/models/trip.db.model";
import { IPerson } from "../models/person.model";
import { ITrip } from "../models/trip.model";
import Helper from "../utils/helper.utils";
import { any } from "joi";

// This decorator ensures that PersonTripsService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@provideSingleton(PersonTripsService)
export default class PersonTripsService {

    // Injecting the Helper, PersonsService and TripService services
    constructor(
        @inject(Helper) private helper: Helper,
        @inject(PersonsService) private personsService: PersonsService,
        @inject(TripService) private tripService: TripService
    ) { }

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
    public async addPersonTrips(userName: string, trips: ITrip[] | any[]): Promise<void> {

        let mapItems: any[] = [];

        for (let trip of trips) {
            // Creates a new trip for each trip in the array and adds the userName and tripId to mapItems.
            let newDoc = await this.tripService.createTrip(trip);
            mapItems.push({ userName, tripId: newDoc.tripId });
        }

        // Inserts the mapItems into the PersonTripSchema collection.
        await PersonTripSchema.insertMany(mapItems).catch((error: Error) => {
            // Throws an error if the operation fails.
            throw error;
        });
    }

    // This method deletes a trip for a person.
    public async deletePersonTrip(tripId: number): Promise<void> {

        // Deletes the trip from the tripService.
        await this.tripService.deleteTrip(tripId);

        // Deletes the trip from the PersonTripSchema collection.
        await PersonTripSchema.findByIdAndDelete({ tripId }).catch((error: Error) => {
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
    public async addTripTravellers(tripId: number, travellers: IPerson[] | any[]): Promise<void> {

        let mapItems: any[] = [];

        for (let traveller of travellers) {
            // Creates a new person for each traveller and adds their userName and tripId to mapItems.
            let newDoc = await this.personsService.createPerson(traveller);
            mapItems.push({ userName: newDoc.userName, tripId });
        }

        // Inserts the mapItems into the PersonTripSchema collection.
        await PersonTripSchema.insertMany(mapItems).catch((error: Error) => {
            // Throws an error if the operation fails.
            throw error;
        });
    }

    // This method deletes a traveller from a trip.
    public async deleteTripTraveller(userName: string): Promise<void> {

        // Deletes the person from the personsService.
        await this.personsService.deletePerson(userName);

        // Deletes the person from the PersonTripSchema collection.
        await PersonTripSchema.findByIdAndDelete({ userName }).catch((error: Error) => {
            // Throws an error if the operation fails.
            throw error;
        });
    }

}