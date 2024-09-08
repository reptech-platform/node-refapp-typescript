import { Error } from "mongoose";
import Helper from "../utils/helper.utils";
import TripSchema, { ITripSchema } from "../db/models/trip.db.model";
import { ITrip } from "../models/trip.model";
import { Search, SortBy, FilterBy, Pagination, SearchResults } from "../models/search.model";
import { provideSingleton, inject } from "../utils/provideSingleton";

// This decorator ensures that TripsService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@provideSingleton(TripsService)
export default class TripsService {

    // Injecting the Helper service
    constructor(@inject(Helper) private helper: Helper) { }

    // Checks if a trip with the given tripId exists in the database.
    public async isTripExist(tripId: number): Promise<boolean> {
        return await TripSchema.find({ tripId }, { _id: 1 })
            .then((data: ITripSchema[]) => {
                // Uses the helper to process the array of trips.
                let results = this.helper.GetItemFromArray(data, 0, { _id: null });
                // Returns true if the trip exists, otherwise false.
                if (!this.helper.IsNullValue(results._id)) return true;
                return false;
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });
    }

    // Fetches all trips from the database, excluding the _id field.
    public async getTrips(): Promise<ITrip[]> {

        return TripSchema.find({}, { _id: 0 })
            .then((data: ITripSchema[]) => {
                // Uses the helper to process the array of trips.
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as ITrip[];
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });
    }

    // Fetches a single trip by its tripId, excluding the _id field.
    public async getTrip(tripId: number): Promise<ITrip> {

        return TripSchema.find({ tripId }, { _id: 0 })
            .then((data: ITripSchema[]) => {
                // Uses the helper to process the trip.
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as ITrip;
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });
    }

    // Creates a new trip in the database.
    public async createTrip(trip: ITripSchema | ITrip): Promise<ITrip> {

        return TripSchema.create(trip)
            .then((data: any) => {
                return data as ITrip;
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });
    }

    // Updates an existing trip by its tripId and returns the updated trip.
    public async updateTrip(tripId: number, trip: any): Promise<ITrip> {

        return TripSchema.findOneAndUpdate({ tripId }, trip, { new: true })
            .then((data: any) => {
                return data as ITrip;
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });
    }

    // Deletes a trip by its tripId.
    public async deleteTrip(tripId: number): Promise<boolean> {

        return TripSchema.findOneAndDelete({ tripId })
            .then(() => {
                // Returns true if the deletion is successful.
                return true;
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });
    }

    // Searches for trips based on the provided search criteria.
    public async searchTrip(search: Search): Promise<SearchResults> {

        let $sort: any = undefined, $match: any = undefined, $limit: any = undefined, $skip: any = undefined;

        // Processes the sort criteria.
        if (!this.helper.IsArrayNull(search.sort)) {
            search.sort?.forEach((e: SortBy) => {
                let sortBy: SortBy = new SortBy(e);
                $sort = { ...$sort, [sortBy.name]: sortBy.getOrder() };
            });
        }

        // Processes the filter criteria.
        if (!this.helper.IsArrayNull(search.filter)) {
            search.filter?.forEach((e: FilterBy) => {
                let filterBy: FilterBy = new FilterBy(e);
                $match = { ...$match, [filterBy.name]: filterBy.getQuery() };
            });
        }

        // Processes the pagination criteria.
        if (!this.helper.IsJsonNull(search.pagination)) {
            let pagination: Pagination = new Pagination(search.pagination);
            $limit = { $limit: pagination.getLimit() };
            $skip = { $skip: pagination.getOffset() };
        }

        // Gets the total count of records matching the search criteria.
        let recordCount = await this.searchTripCount(search);

        let $pipeline: any = [];

        // Builds the aggregation pipeline.
        if ($match) $pipeline.push({ $match });
        if ($sort) $pipeline.push({ $sort });
        if ($limit) $pipeline.push($limit);
        if ($skip) $pipeline.push($skip);

        // Executes the aggregation pipeline.
        return TripSchema.aggregate($pipeline)
            .then((data: ITripSchema[]) => {
                let results: SearchResults = new SearchResults();
                results.count = recordCount;
                results.data = this.helper.GetItemFromArray(data, -1, []);
                return results;
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });
    }

    // Gets the total count of trips matching the search criteria.
    public async searchTripCount(search: Search): Promise<number> {

        let $match = {};

        // Processes the filter criteria.
        if (!this.helper.IsArrayNull(search.filter)) {
            search.filter?.forEach((e: FilterBy) => {
                let filterBy: FilterBy = new FilterBy(e);
                $match = { ...$match, [filterBy.name]: filterBy.getQuery() };
            });
        }

        // Executes the count query.
        return TripSchema.countDocuments($match)
            .then((count: number) => {
                return count;
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });
    }

    // This method returns the total count of trips in the database.
    public async getTripCount(): Promise<number> {

        let $pipeline = [
            // Groups all documents and calculates the total count.
            { $group: { _id: null, recordCount: { $sum: 1 } } },
            // Projects the result to include only the recordCount field.
            { $project: { _id: 0 } }
        ];

        // Executes the aggregation pipeline.
        return TripSchema.aggregate($pipeline)
            .then((data: ITripSchema[]) => {
                // Uses the helper to process the result and extract the recordCount.
                let dbRst = this.helper.GetItemFromArray(data, 0, { recordCount: 0 });
                return dbRst.recordCount as number;
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });
    }

}