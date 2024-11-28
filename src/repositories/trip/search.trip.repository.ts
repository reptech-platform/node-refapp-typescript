import { Error } from "mongoose";
import { Search, SortBy, FilterBy, Pagination, SearchResults } from "../../models/search.model";
import TripSchema, { ITripSchema } from "../../db/dao/trip.db.model";
import Helper from "../../utils/helper.utils";
import { injectable, inject } from "inversify";

// Interface for SearchTripRepository
export default interface ISearchTripRepository {
    // Searches for trips based on the provided search criteria.
    search(search: Search): Promise<SearchResults>;

    // Gets the total count of trips matching the search criteria.
    searchCount(search: Search): Promise<number>;
}

// This decorator ensures that SearchTripRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class SearchTripRepository implements ISearchTripRepository {
    // Injecting the Helper service
    constructor(@inject(Helper) private helper: Helper) { }

    // Searches for trips based on the provided search criteria.
    public async search(search: Search): Promise<SearchResults> {

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
            // Build the match object dynamically based on the filter criteria.
            let filterBy: FilterBy = new FilterBy();
            let _$match: any = filterBy.getMatchQuery(search.filter);
            if (_$match) {
                // Build the match object dynamically.
                $match = { ...$match, ..._$match };
            }
        }

        // Processes the pagination criteria.
        if (!this.helper.IsJsonNull(search.pagination)) {
            let pagination: Pagination = new Pagination(search.pagination);
            $limit = { $limit: pagination.getLimit() };
            $skip = { $skip: pagination.getOffset() };
        }

        // Gets the total count of records matching the search criteria.
        let recordCount = await this.searchCount(search);

        let $pipeline: any = [];

        // Builds the aggregation pipeline.
        if ($match) $pipeline.push({ $match });
        if ($sort) $pipeline.push({ $sort });
        if ($limit) $pipeline.push($limit);
        if ($skip) $pipeline.push($skip);

        // Executes the aggregation pipeline.
        return await TripSchema.aggregate($pipeline)
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
    public async searchCount(search: Search): Promise<number> {

        let $match = {};

        // Processes the filter criteria.
        if (!this.helper.IsArrayNull(search.filter)) {
            // Build the match object dynamically based on the filter criteria.
            let filterBy: FilterBy = new FilterBy();
            let _$match: any = filterBy.getMatchQuery(search.filter);
            if (_$match) {
                // Build the match object dynamically.
                $match = { ...$match, ..._$match };
            }
        }

        // Executes the count query.
        return await TripSchema.countDocuments($match)
            .then((count: number) => {
                return count;
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });
    }
}
