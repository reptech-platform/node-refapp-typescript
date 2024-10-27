import { Error } from "mongoose";
import { Search, SortBy, FilterBy, Pagination, SearchResults } from "../../models/search.model";
import AirportSchema, { IAirportSchema } from "../../db/dao/airport.db.model";
import Helper from "../../utils/helper.utils";
import { injectable, inject } from "inversify";

// Interface for SearchAirportRepository
export default interface ISearchAirportRepository {
    // Searches for Airports based on the provided search criteria.
    searchAirport(search: Search): Promise<SearchResults>;

    // Gets the total count of Airports matching the search criteria.
    searchAirportCount(search: Search): Promise<number>;
}

// This decorator ensures that SearchAirportRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class SearchAirportRepository implements ISearchAirportRepository {
    // Injecting the Helper service
    constructor(@inject(Helper) private helper: Helper) { }

    // Searches for Airports based on the provided search criteria.
    public async searchAirport(search: Search): Promise<SearchResults> {

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
        let recordCount = await this.searchAirportCount(search);

        let $pipeline: any = [];

        // Builds the aggregation pipeline.
        if ($match) $pipeline.push({ $match });
        if ($sort) $pipeline.push({ $sort });
        if ($limit) $pipeline.push($limit);
        if ($skip) $pipeline.push($skip);

        // Executes the aggregation pipeline.
        return await AirportSchema.aggregate($pipeline)
            .then((data: IAirportSchema[]) => {
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

    // Gets the total count of Airports matching the search criteria.
    public async searchAirportCount(search: Search): Promise<number> {

        let $match = {};

        // Processes the filter criteria.
        if (!this.helper.IsArrayNull(search.filter)) {
            search.filter?.forEach((e: FilterBy) => {
                let filterBy: FilterBy = new FilterBy(e);
                $match = { ...$match, [filterBy.name]: filterBy.getQuery() };
            });
        }

        // Executes the count query.
        return await AirportSchema.countDocuments($match)
            .then((count: number) => {
                return count;
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });
    }
}
