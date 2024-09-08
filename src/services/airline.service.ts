import { Error } from "mongoose";
import { provideSingleton, inject } from "../utils/provideSingleton";
import Helper from "../utils/helper.utils";;
import AirlineSchema, { IAirlineSchema } from "../db/models/airline.db.model";
import { IAirline } from "../models/airline.model";
import { FilterBy, Pagination, Search, SearchResults, SortBy } from "../models/search.model";

// This decorator ensures that AirlinesService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@provideSingleton(AirlinesService)
export default class AirlinesService {

    // Injecting the Helper service
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

    // Method to get all airlines
    public async getAirlines(): Promise<IAirline[]> {
        return await AirlineSchema.find({}, { _id: 0 })
            .then((data: IAirlineSchema[]) => {
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
        return await AirlineSchema.find({ airlineCode }, { _id: 0 })
            .then((data: IAirlineSchema[]) => {
                // Get all items from the array or return an empty array
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IAirline;
            })
            .catch((error: Error) => {
                // Handle any errors that occur during the query
                throw error;
            });
    }

    // Method to get all airlines along with their associated airports
    public async getAirlinesAirports(): Promise<IAirline[]> {

        let $pipeline = [
            {
                $lookup: {
                    from: "airports", localField: "airportId", foreignField: "_id", as: "Airports",
                    pipeline: [
                        {
                            $project: {
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
                    "Airports": 0,
                    "__v": 0
                }
            }

        ];

        return await AirlineSchema.aggregate($pipeline)
            .then((data: IAirlineSchema[]) => {
                // Get all items from the array or return an empty array
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IAirline[];
            })
            .catch((error: Error) => {
                // Handle any errors that occur during the query
                throw error;
            });
    }

    // Method to get a specific airline along with its associated airports by airline ID
    public async getAirlineAirports(id: string): Promise<IAirline> {

        let $pipeline = [
            { $match: { _id: this.helper.ObjectId(id) } },
            {
                $lookup: {
                    from: "airports", localField: "airportId", foreignField: "_id", as: "Airports",
                    pipeline: [
                        {
                            $project: {
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
                    "Airports": 0,
                    "__v": 0
                }
            }
        ];

        return await AirlineSchema.aggregate($pipeline)
            .then((data: any) => {
                // Get all items from the array or return an empty array
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IAirline;
            })
            .catch((error: Error) => {
                // Handle any errors that occur during the query
                throw error;
            });

    }

    // Method to create a new airline
    public async createAirline(airline: IAirline | IAirline): Promise<IAirline> {
        return await AirlineSchema.create(airline)
            .then((data: IAirlineSchema) => {
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
    public async updateAirline(airlineCode: string, airline: IAirline): Promise<IAirline> {
        // Find and update the airline document with the new data.
        return await AirlineSchema.findOneAndUpdate({ airlineCode }, airline, { new: true })
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
    public async deleteAirline(airlineCode: string): Promise<boolean> {
        // Find and delete the airline document.
        return await AirlineSchema.findOneAndDelete({ airlineCode })
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