import { ClientSession, Error } from "mongoose";
import { Search, SortBy, FilterBy, Pagination, SearchResults } from "../models/search.model";
import Helper from "../utils/helper.utils";;
import AirportSchema, { IAirportSchema } from "../db/dao/airport.db.model";
import { IAirport } from "../models/airport.model";
import { injectable, inject } from "inversify";

// This decorator ensures that AirportsService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@injectable()
export default class AirportRepository {

    // Injecting the Helper service
    constructor(@inject(Helper) private helper: Helper) { }

    // Method to check if an airport exists by its ICAO and IATA codes
    public async isAirportExist(icaoCode: string, iataCode: string): Promise<boolean> {
        return await AirportSchema.find({ icaoCode, iataCode }, { _id: 1 })
            .then((data: IAirportSchema[]) => {
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

    // Method to get a specific airport by its ICAO and IATA codes
    public async getAirportId(icaoCode: string, iataCode: string): Promise<string> {
        return await AirportSchema.find({ icaoCode, iataCode }, { _id: 1 })
            .then((data: IAirportSchema[]) => {
                // Get the first item from the array or return an empty object
                let results = this.helper.GetItemFromArray(data, 0, { _id: null });
                return results._id;
            })
            .catch((error: Error) => {
                // Handle any errors that occur during the query
                throw error;
            });
    }

    // Method to get a specific airport airline id by its ICAO and IATA codes
    public async getAirportAirlineId(icaoCode: string, iataCode: string): Promise<string> {
        return await AirportSchema.find({ icaoCode, iataCode }, { airline: 1 })
            .then((data: IAirportSchema[]) => {
                // Get the first item from the array or return an empty object
                let results = this.helper.GetItemFromArray(data, 0, { airline: null });
                return results.airline;
            })
            .catch((error: Error) => {
                // Handle any errors that occur during the query
                throw error;
            });
    }

    // Method to get all airports
    public async getAirports(): Promise<IAirport[]> {

        let $pipeline = [
            {
                $lookup: {
                    from: "airlines", localField: "airlineId", foreignField: "_id", as: "Airlines",
                    pipeline: [
                        {
                            $project: {
                                "airports": 0,
                                "_id": 0,
                                "__v": 0
                            }
                        }
                    ]
                }
            },
            { $unwind: { path: "$Airlines", preserveNullAndEmptyArrays: true } },
            { "$addFields": { "airlines": "$Airlines" } },
            {
                $project: {
                    "_id": 0,
                    "airlineId": 0,
                    "Airlines": 0,
                    "__v": 0
                }
            }
        ];

        return await AirportSchema.aggregate($pipeline)
            .then((data: any) => {
                // Get all items from the array or return an empty array
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IAirport[];
            })
            .catch((error: Error) => {
                // Handle any errors that occur during the query
                throw error;
            });
    }

    // Method to get a specific airport by its ICAO and IATA codes
    public async getAirport(icaoCode: string, iataCode: string): Promise<IAirport> {

        let $pipeline = [
            { $match: { icaoCode, iataCode } },
            {
                $lookup: {
                    from: "airlines", localField: "airlineId", foreignField: "_id", as: "Airlines",
                    pipeline: [
                        {
                            $project: {
                                "airports": 0,
                                "_id": 0,
                                "__v": 0
                            }
                        }
                    ]
                }
            },
            { $unwind: { path: "$Airlines", preserveNullAndEmptyArrays: true } },
            { "$addFields": { "airlines": "$Airlines" } },
            {
                $project: {
                    "_id": 0,
                    "airlineId": 0,
                    "Airlines": 0,
                    "__v": 0
                }
            }
        ];

        return await AirportSchema.aggregate($pipeline)
            .then((data: any) => {
                // Get all items from the array or return an empty array
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IAirport;
            })
            .catch((error: Error) => {
                // Handle any errors that occur during the query
                throw error;
            });

    }

    // Method to get a specific airport along with its associated airlines by airport ID
    public async getAriportAirlines(icaoCode: string, iataCode: string): Promise<IAirport> {
        let $pipeline = [
            { $match: { icaoCode, iataCode } },
            {
                $lookup: {
                    from: "airlines", localField: "airlineId", foreignField: "_id", as: "Airlines",
                    pipeline: [
                        {
                            $project: {
                                "__v": 0
                            }
                        }
                    ]
                }
            },
            { $unwind: { path: "$Airlines", preserveNullAndEmptyArrays: true } },
            { "$addFields": { "airlines": "$Airlines" } },
            {
                $project: {
                    "Airlines": 0,
                    "__v": 0
                }
            }
        ];

        return await AirportSchema.aggregate($pipeline)
            .then((data: IAirportSchema[]) => {
                // Get the first item from the array or return an empty object
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IAirport;
            })
            .catch((error: Error) => {
                // Handle any errors that occur during the query
                throw error;
            });
    }

    // Method to get all airports along with their associated airlines
    public async getAriportsAirlines(): Promise<IAirport[]> {
        let $pipeline = [
            {
                $lookup: {
                    from: "airlines", localField: "airlineId", foreignField: "_id", as: "Airlines",
                    pipeline: [
                        {
                            $project: {
                                "__v": 0
                            }
                        }
                    ]
                }
            },
            { $unwind: { path: "$Airlines", preserveNullAndEmptyArrays: true } },
            { "$addFields": { "airlines": "$Airlines" } },
            {
                $project: {
                    "Airlines": 0,
                    "__v": 0
                }
            }
        ];

        return await AirportSchema.aggregate($pipeline)
            .then((data: IAirportSchema[]) => {
                // Get all items from the array or return an empty array
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IAirport[];
            })
            .catch((error: Error) => {
                // Handle any errors that occur during the query
                throw error;
            });
    }

    // Method to create a new airport
    public async createAirport(airport: IAirport, session: ClientSession | undefined): Promise<IAirport> {

        // create the airport document with the new data.
        return await AirportSchema.create([airport], { session })
            .then((data: any) => {
                // Get the first item from the array or return an empty object
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IAirport;
            })
            .catch((error: Error) => {
                // Handle any errors that occur during the creation
                throw error;
            });
    }

    // Updates an airport's information based on the provided ICAO and IATA codes.
    public async updateAirport(icaoCode: string, iataCode: string, airport: IAirport, session: ClientSession | undefined): Promise<IAirport> {

        // Find and update the airport document with the new data.
        return await AirportSchema.findOneAndUpdate({ icaoCode, iataCode }, airport, { new: true, session })
            .then((data: any) => {
                // Extract the first item from the data array using a helper function.
                let results = this.helper.GetItemFromArray(data, 0, {});
                // Return the results cast as an IAirport object.
                return results as IAirport;
            })
            .catch((error: Error) => {
                // Throw an error if the update operation fails.
                throw error;
            });
    }

    // Deletes an airport based on the provided ICAO and IATA codes.
    public async deleteAirport(icaoCode: string, iataCode: string, session: ClientSession | undefined): Promise<boolean> {

        // Find and delete the airport document.
        return await AirportSchema.findOneAndDelete({ icaoCode, iataCode }, { session })
            .then(() => {
                // Return true if the deletion was successful.
                return true;
            })
            .catch((error: Error) => {
                // Throw an error if the deletion operation fails.
                throw error;
            });
    }

    // Deletes an airport based on the provided airport id.
    public async deleteAirportById(_id: string, session: ClientSession | undefined): Promise<boolean> {
        // Find and delete the airport document.
        return await AirportSchema.findOneAndDelete({ _id }, { session })
            .then(() => {
                // Return true if the deletion was successful.
                return true;
            })
            .catch((error: Error) => {
                // Throw an error if the deletion operation fails.
                throw error;
            });
    }

    // Searches for airports based on the provided search criteria.
    public async searchAirport(search: Search): Promise<SearchResults> {

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
        let recordCount = await this.searchAirportCount(search);

        // Initialize the aggregation pipeline.
        let $pipeline: any = [];

        // Add match, sort, limit, and skip stages to the pipeline if they exist.
        if ($match) $pipeline.push({ $match });
        if ($sort) $pipeline.push({ $sort });
        if ($limit) $pipeline.push($limit);
        if ($skip) $pipeline.push($skip);

        // Execute the aggregation pipeline on the AirportSchema.
        return await AirportSchema.aggregate($pipeline)
            .then((data: IAirportSchema[]) => {
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

    // Counts the number of airports based on the provided search criteria.
    public async searchAirportCount(search: Search): Promise<number> {

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

        // Execute the aggregation pipeline on the AirportSchema.
        return await AirportSchema.aggregate($pipeline)
            .then((data: IAirportSchema[]) => {
                // Extract the record count from the aggregation result.
                let dbRst = this.helper.GetItemFromArray(data, 0, { recordCount: 0 });
                return dbRst.recordCount as number;
            })
            .catch((error: Error) => {
                // Throw an error if the aggregation operation fails.
                throw error;
            });
    }

    // Counts the total number of airports in the collection.
    public async getAirportCount(): Promise<number> {

        // Define the aggregation pipeline for counting all documents.
        let $pipeline = [
            { $group: { _id: null, recordCount: { $sum: 1 } } }, // Group stage to count documents.
            { $project: { _id: 0 } } // Project stage to format the output.
        ];

        // Execute the aggregation pipeline on the AirportSchema.
        return await AirportSchema.aggregate($pipeline)
            .then((data: IAirportSchema[]) => {
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
