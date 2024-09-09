import { Error } from "mongoose";
import { LazyServiceIdentifier } from "inversify";
import { provideSingleton, inject } from "../utils/provideSingleton";
import Helper from "../utils/helper.utils";;
import AirlineSchema, { IAirlineSchema } from "../db/models/airline.db.model";
import { IAirline } from "../models/airline.model";
import { IAirport } from "../models/airport.model";
import { FilterBy, Pagination, Search, SearchResults, SortBy } from "../models/search.model";
import AirportsService from "../services/airport.service";
import RequestResponse from "../utils/request.response";

// This decorator ensures that AirlinesService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@provideSingleton(AirlinesService)
export default class AirlinesService {

    // Injecting the Helper and AirportsService service
    constructor(
        // AirportsService has a circular dependency
        @inject(new LazyServiceIdentifier(() => AirportsService)) private airportsService: AirportsService,
        @inject(Helper) private helper: Helper) {
    }

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
    public async createAirline(airline: IAirline): Promise<IAirline> {

        // Retrieve the airport information from the airline object, which may be undefined
        const airport: IAirport | undefined = airline.airports;

        if (airport) {
            // Check if the airport already exists in the database using its icaoCode and  iataCode
            const isExist = await this.airportsService.isAirportExist(airport.icaoCode, airport.iataCode);

            // If the airport does not exist, create a new airport entry in the database
            if (!isExist) {
                await this.airportsService.createAirport(airport);
            }

            // Retrieve the airport ID using the icaoCode and  iataCode and assign it to the airline object
            airline.airportId = await this.airportsService.getAirportId(airport.icaoCode, airport.iataCode);
        }

        // create the airline document with the new data.
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
    public async updateAirline(airlineCode: string, airline: IAirline): Promise<IAirline | RequestResponse> {

        // Retrieve the airport information from the airline object, which may be undefined
        const airport: IAirport | undefined = airline.airports;

        if (airport) {
            // Check if the airport already exists in the database using its icaoCode and  iataCode
            const isExist = await this.airportsService.isAirportExist(airport.icaoCode, airport.iataCode);

            // If the airport does not exist, throw error message
            if (!isExist) {
                throw { status: 400, message: `Provided ${airport.icaoCode} and ${airport.iataCode} airport does not exist` };
            }

            // Retrieve the airport ID using the icaoCode and  iataCode and assign it to the airline object
            airline.airportId = await this.airportsService.getAirportId(airport.icaoCode, airport.iataCode);

            // Update airport object using the icaoCode and  iataCode in the database
            await this.airportsService.updateAirport(airport.icaoCode, airport.iataCode, airport);
        }

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

        // Retrieve the airport id information from the database, which may be undefined
        const airportId: string = await this.getAirlineAirportId(airlineCode);

        // Check if the airportId exists in the database using its airportId
        if (!this.helper.IsNullValue(airportId)) {
            // Delete airport in the database using airport id
            await this.airportsService.deleteAirportById(airportId);
        }

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

    // Deletes an airline based on the provided airline id.
    public async deleteAirlineById(_id: string): Promise<boolean> {
        // Find and delete the airline document.
        return await AirlineSchema.findOneAndDelete({ _id })
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