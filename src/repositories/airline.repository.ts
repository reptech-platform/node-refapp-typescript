import { ClientSession, Error } from "mongoose";
import Helper from "../utils/helper.utils";;
import AirlineSchema, { IAirlineSchema } from "../db/dao/airline.db.model";
import { IAirline } from "../models/airline.model";
import RequestResponse from "../utils/request.response";
import { FilterBy, Pagination, Search, SearchResults, SortBy } from "../models/search.model";
import { injectable, inject } from "inversify";

// This decorator ensures that AirlinesRepository is a singleton, meaning only one instance of this service will be created and used throughout the application.
@injectable()
export default class AirlineRepository {

    // Injecting the Helper and AirportsService service
    constructor(@inject(Helper) private helper: Helper) { }

    // Method to check if an airline exists by its code
    public async isAirlineExist(airlineCode: string): Promise<boolean> {
        return await AirlineSchema.find({ airlineCode }, { _id: 1 })
            .then((data: IAirlineSchema[]) => {
                // Get the first item from the array or return an object with _id: null
                let results = this.helper.GetItemFromArray(data, 0, { _id: null });
                // Check if the _id is not null
                if (!this.helper.IsNullValue(results._id)) return true;
                return false;
            })
            .catch((error: Error) => {
                // Handle any errors that occur during the query
                throw error;
            });
    }

    // Method to get a specific airline by its code
    public async getAirlineId(airlineCode: string): Promise<string> {
        return await AirlineSchema.find({ airlineCode }, { _id: 1 })
            .then((data: IAirlineSchema[]) => {
                // Get the first item from the array or return an empty object
                let results = this.helper.GetItemFromArray(data, 0, { _id: null });
                return results._id;
            })
            .catch((error: Error) => {
                // Handle any errors that occur during the query
                throw error;
            });
    }

    // Method to get a specific airline airport id  by its code
    public async getAirlineAirportId(airlineCode: string): Promise<string> {
        return await AirlineSchema.find({ airlineCode }, { airportId: 1 })
            .then((data: IAirlineSchema[]) => {
                // Get the first item from the array or return an empty object
                let results = this.helper.GetItemFromArray(data, 0, { airportId: null });
                return results.airportId;
            })
            .catch((error: Error) => {
                // Handle any errors that occur during the query
                throw error;
            });
    }

    // Method to get all airlines
    public async getAirlines(): Promise<IAirline[]> {

        let $pipeline = [
            {
                $lookup: {
                    from: "airports", localField: "airportId", foreignField: "_id", as: "Airports",
                    pipeline: [
                        {
                            $project: {
                                "airlines": 0,
                                "_id": 0,
                                "__v": 0
                            }
                        }
                    ]
                }
            },
            { $unwind: { path: "$Airports", preserveNullAndEmptyArrays: true } },
            { "$addFields": { "airports": "$Airports" } },
            {
                $project: {
                    "_id": 0,
                    "airportId": 0,
                    "Airports": 0,
                    "__v": 0
                }
            }
        ];

        return await AirlineSchema.aggregate($pipeline)
            .then((data: any) => {
                // Get all items from the array or return an empty array
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IAirline[];
            })
            .catch((error: Error) => {
                // Handle any errors that occur during the query
                throw error;
            });
    }

    // Method to get a specific airline by its code
    public async getAirline(airlineCode: string): Promise<IAirline> {

        let $pipeline = [
            { $match: { airlineCode } },
            {
                $lookup: {
                    from: "airports", localField: "airportId", foreignField: "_id", as: "Airports",
                    pipeline: [
                        {
                            $project: {
                                "airline": 0,
                                "_id": 0,
                                "__v": 0
                            }
                        }
                    ]
                }
            },
            { $unwind: { path: "$Airports", preserveNullAndEmptyArrays: true } },
            { "$addFields": { "airports": "$Airports" } },
            {
                $project: {
                    "_id": 0,
                    "airportId": 0,
                    "Airports": 0,
                    "__v": 0
                }
            }
        ];

        return await AirlineSchema.aggregate($pipeline)
            .then((data: any) => {
                // Get all items from the array or return an empty array
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IAirline;
            })
            .catch((error: Error) => {
                // Handle any errors that occur during the query
                throw error;
            });
    }

    // Method to get a specific airline along with its associated airports by airline ID
    public async getAirlineAirports(airlineCode: string): Promise<IAirline[]> {

        let $pipeline = [
            { $match: { airlineCode } },
            {
                $lookup: {
                    from: "airports",
                    localField: "airportId",
                    foreignField: "_id",
                    as: "mapItems",
                    pipeline: [
                        {
                            $project: {
                                "airline": 0,
                                "_id": 0,
                                "__v": 0
                            }
                        }
                    ]
                }
            },
            { $unwind: { path: "$mapItems", preserveNullAndEmptyArrays: true } },
            { "$addFields": { "items": "$mapItems" } },
            {
                $project: {
                    "_id": 0,
                    "airportId": 0,
                    "mapItems": 0,
                    "__v": 0
                }
            }
        ];

        return await AirlineSchema.aggregate($pipeline)
            .then((data: any[]) => {
                // Get all items from the array or return an empty array
                return data.map(x => x.items);
            })
            .catch((error: Error) => {
                // Handle any errors that occur during the query
                throw error;
            });

    }

    // Method to get all airlines along with its associated airports
    public async getAirlinesAirports(): Promise<IAirline[]> {

        let $pipeline = [
            {
                $lookup: {
                    from: "airports",
                    localField: "airportId",
                    foreignField: "_id",
                    as: "mapItems",
                    pipeline: [
                        {
                            $project: {
                                "airline": 0,
                                "_id": 0,
                                "__v": 0
                            }
                        }
                    ]
                }
            },
            { $unwind: { path: "$mapItems", preserveNullAndEmptyArrays: true } },
            { "$addFields": { "items": "$mapItems" } },
            {
                $project: {
                    "_id": 0,
                    "airportId": 0,
                    "mapItems": 0,
                    "__v": 0
                }
            }
        ];

        return await AirlineSchema.aggregate($pipeline)
            .then((data: any[]) => {
                // Get all items from the array or return an empty array
                return data.map(x => x.items);
            })
            .catch((error: Error) => {
                // Handle any errors that occur during the query
                throw error;
            });

    }

    // Method to create a new airline
    public async createAirline(airline: IAirline, session: ClientSession | undefined): Promise<IAirline> {

        // create the airline document with the new data.
        return await AirlineSchema.create([airline], { session })
            .then((data: any) => {
                // Get the first item from the array or return an empty object
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IAirline;
            })
            .catch((error: Error) => {
                // Handle any errors that occur during the creation
                throw error;
            });
    }

    // Updates an airline's information based on the provided airline code.
    public async updateAirline(airlineCode: string, airline: IAirline, session: ClientSession | undefined): Promise<IAirline | RequestResponse> {

        // Find and update the airline document with the new data.
        return await AirlineSchema.findOneAndUpdate({ airlineCode }, airline, { new: true, session })
            .then((data: any) => {
                // Extract the first item from the data array using a helper function.
                let results = this.helper.GetItemFromArray(data, 0, {});
                // Return the results cast as an IAirline object.
                return results as IAirline;
            })
            .catch((error: Error) => {
                // Throw an error if the update operation fails.
                throw error;
            });
    }

    // Deletes an airline based on the provided airline code.
    public async deleteAirline(airlineCode: string, session: ClientSession | undefined): Promise<boolean> {

        // Find and delete the airline document.
        return await AirlineSchema.findOneAndDelete({ airlineCode }, { session })
            .then(() => {
                // Return true if the deletion was successful.
                return true;
            })
            .catch((error: Error) => {
                // Throw an error if the deletion operation fails.
                throw error;
            });
    }

    // Deletes an airline based on the provided airline id.
    public async deleteAirlineById(_id: string, session: ClientSession | undefined): Promise<boolean> {
        // Find and delete the airline document.
        return await AirlineSchema.findOneAndDelete({ _id }, { session })
            .then(() => {
                // Return true if the deletion was successful.
                return true;
            })
            .catch((error: Error) => {
                // Throw an error if the deletion operation fails.
                throw error;
            });
    }

    // Searches for airlines based on the provided search criteria.
    public async searchAirline(search: Search): Promise<SearchResults> {

        // Initialize variables for sorting, matching, limiting, and skipping.
        let $sort: any = undefined, $match: any = undefined, $limit: any = undefined, $skip: any = undefined;

        // Check if the sort array is not null and process each sort criterion.
        if (!this.helper.IsArrayNull(search.sort)) {
            search.sort?.forEach((e: SortBy) => {
                let sortBy: SortBy = new SortBy(e);
                // Build the sort object dynamically.
                $sort = { ...$sort, [sortBy.name]: sortBy.getOrder() };
            });
        }

        // Check if the filter array is not null and process each filter criterion.
        if (!this.helper.IsArrayNull(search.filter)) {
            search.filter?.forEach((e: FilterBy) => {
                let filterBy: FilterBy = new FilterBy(e);
                // Build the match object dynamically.
                $match = { ...$match, [filterBy.name]: filterBy.getQuery() };
            });
        }

        // Check if the pagination object is not null and set limit and skip values.
        if (!this.helper.IsJsonNull(search.pagination)) {
            let pagination: Pagination = new Pagination(search.pagination);
            $limit = { $limit: pagination.getLimit() };
            $skip = { $skip: pagination.getOffset() };
        }

        // Get the total record count for the search criteria.
        let recordCount = await this.searchAirlineCount(search);

        // Initialize the aggregation pipeline.
        let $pipeline: any = [];

        // Add match, sort, limit, and skip stages to the pipeline if they exist.
        if ($match) $pipeline.push({ $match });
        if ($sort) $pipeline.push({ $sort });
        if ($limit) $pipeline.push($limit);
        if ($skip) $pipeline.push($skip);

        // Execute the aggregation pipeline on the AirlineSchema.
        return await AirlineSchema.aggregate($pipeline)
            .then((data: IAirlineSchema[]) => {
                // Create a new SearchResults object.
                let results: SearchResults = new SearchResults();
                // Set the count and data properties of the results.
                results.count = recordCount;
                results.data = this.helper.GetItemFromArray(data, -1, []);
                // Return the search results.
                return results;
            })
            .catch((error: Error) => {
                // Throw an error if the aggregation operation fails.
                throw error;
            });
    }

    // Counts the number of airlines based on the provided search criteria.
    public async searchAirlineCount(search: Search): Promise<number> {

        // Initialize the match object for filtering.
        let $match = {};

        // Check if the search object and filter array are not null.
        if (!this.helper.IsNullValue(search) && !this.helper.IsArrayNull(search.filter)) {
            search.filter?.forEach((e: FilterBy) => {
                let filterBy: FilterBy = new FilterBy(e);
                // Build the match object dynamically based on the filter criteria.
                $match = { ...$match, [filterBy.name]: filterBy.getQuery() };
            });
        }

        // Define the aggregation pipeline for counting documents.
        let $pipeline = [
            { $match }, // Match stage to filter documents.
            { $group: { _id: null, recordCount: { $sum: 1 } } }, // Group stage to count documents.
            { $project: { _id: 0 } } // Project stage to format the output.
        ];

        // Execute the aggregation pipeline on the AirlineSchema.
        return await AirlineSchema.aggregate($pipeline)
            .then((data: IAirlineSchema[]) => {
                // Extract the record count from the aggregation result.
                let dbRst = this.helper.GetItemFromArray(data, 0, { recordCount: 0 });
                return dbRst.recordCount as number;
            })
            .catch((error: Error) => {
                // Throw an error if the aggregation operation fails.
                throw error;
            });
    }

    // Counts the total number of airlines in the collection.
    public async getAirlineCount(): Promise<number> {

        // Define the aggregation pipeline for counting all documents.
        let $pipeline = [
            { $group: { _id: null, recordCount: { $sum: 1 } } }, // Group stage to count documents.
            { $project: { _id: 0 } } // Project stage to format the output.
        ];

        // Execute the aggregation pipeline on the AirlineSchema.
        return await AirlineSchema.aggregate($pipeline)
            .then((data: IAirlineSchema[]) => {
                // Extract the record count from the aggregation result.
                let dbRst = this.helper.GetItemFromArray(data, 0, { recordCount: 0 });
                return dbRst.recordCount as number;
            })
            .catch((error: Error) => {
                // Throw an error if the aggregation operation fails.
                throw error;
            });
    }
}