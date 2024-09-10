import { Error } from "mongoose";
import { provideSingleton, inject } from "../utils/provideSingleton";
import AirlinesService from "../services/airline.service";
import PersonsService from "../services/person.service";
import AirportStaffSchema from "../db/models/airportstaff.db.model";
import { IPerson } from "../models/person.model";
import { IAirline } from "../models/airline.model";
import Helper from "../utils/helper.utils";
import { LazyServiceIdentifier } from "inversify";

// This decorator ensures that AirlineStaffsService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@provideSingleton(AirlineStaffsService)
export default class AirlineStaffsService {

    // Injecting the Helper, PersonsService and TripService services
    constructor(
        @inject(Helper) private helper: Helper,
        // PersonsService has a circular dependency
        @inject(new LazyServiceIdentifier(() => PersonsService)) private personsService: PersonsService,
        // AirlinesService has a circular dependency
        @inject(new LazyServiceIdentifier(() => AirlinesService)) private airlinesService: AirlinesService
    ) { }

    // This method checks if a person with the given userName is associated with a airline with the given airlineCode.
    public async isAirlineAndStaffExist(airlineCode: string, userName: string): Promise<boolean> {

        return await AirportStaffSchema.find({ airlineCode, userName }, { _id: 1 })
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
        return await AirportStaffSchema.aggregate($pipeline)
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
    public async addOrUpadateAirlineStaffs(airlineCode: string, persons: IPerson[] | any[]): Promise<void> {

        let mapItems: any[] = [];

        if (persons && persons.length > 0) {
            // Loop Check if the persons already exists in the database using its userName
            for (let index = 0; index < persons.length; index++) {

                // Read person based on index loop
                let currentPerson = persons[index];

                // Check the person is exist in the database
                let isExist = await this.personsService.isPersonExist(currentPerson.userName);

                if (!isExist) {
                    // If the person does not exist, create a new person entry in the database
                    currentPerson = await this.personsService.createPerson(currentPerson);
                } else {
                    // If the person exist, update person entry in the database
                    await this.personsService.updatePerson(currentPerson.userName, currentPerson);
                }

                // Check airline and person is already mapped
                isExist = await this.isAirlineAndStaffExist(airlineCode, currentPerson.userName);

                if (!isExist) {
                    // Add userName to array of id list for person airline mapping
                    mapItems.push({ airlineCode, userName: currentPerson.userName });
                }
            }
        }

        // Inserts the mapItems into the AirportStaffSchema collection.
        await AirportStaffSchema.insertMany(mapItems).catch((error: Error) => {
            // Throws an error if the operation fails.
            throw error;
        });
    }

    // This method deletes a staff for a ailine.
    public async deleteStaffStaff(airlineCode: string, userName: string): Promise<void> {

        // Deletes the userName from the AirportStaffSchema collection.
        await AirportStaffSchema.deleteOne({ airlineCode, userName }).catch((error: Error) => {
            // Throws an error if the operation fails.
            throw error;
        });
    }

    // This method deletes a all staffs for a airline.
    public async deleteAllAirlineStaff(airlineCode: string): Promise<void> {

        // Deletes the person from the AirportStaffSchema collection.
        await AirportStaffSchema.deleteMany({ airlineCode }).catch((error: Error) => {
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
        return await AirportStaffSchema.aggregate($pipeline)
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
    public async addOrUpdateStaffAirlines(userName: string, airlines: IAirline[] | any[]): Promise<void> {

        let mapItems: any[] = [];

        if (airlines && airlines.length > 0) {
            // Loop Check if the travellers are already exists in the database using its tripId
            for (let index = 0; index < airlines.length; index++) {

                // Read traveller based on index loop
                let currentAirline = airlines[index];

                // Check the traveller is exist in the database
                let isExist = await this.airlinesService.isAirlineExist(currentAirline.airlineCode);

                if (!isExist) {
                    // If the traveller does not exist, create a new traveller entry in the database
                    currentAirline = await this.airlinesService.createAirline(currentAirline);
                } else {
                    // If the trip exist, update trip entry in the database
                    await this.airlinesService.updateAirline(currentAirline.airlineCode, currentAirline);
                }

                // Check person and trip is already mapped
                isExist = await this.isAirlineAndStaffExist(currentAirline.airlineCode, userName);

                if (!isExist) {
                    // Add tripId to array of id list for person trip mapping
                    mapItems.push({ airlineCode: currentAirline.airlineCode, userName });
                }
            }
        }

        // Inserts the mapItems into the PersonTripSchema collection.
        await AirportStaffSchema.insertMany(mapItems).catch((error: Error) => {
            // Throws an error if the operation fails.
            throw error;
        });
    }

    // This method deletes a all airlines for a staff.
    public async deleteAllStaffAirlines(userName: string): Promise<void> {

        // Deletes the trip from the AirportStaffSchema collection.
        await AirportStaffSchema.deleteMany({ userName }).catch((error: Error) => {
            // Throws an error if the operation fails.
            throw error;
        });
    }

}