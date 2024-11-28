import { Error } from "mongoose";
import { Search, SortBy, FilterBy, Pagination, SearchResults } from "../../models/search.model";
import PersonSchema, { IPersonSchema } from "../../db/dao/person.db.model";
import Helper from "../../utils/helper.utils";
import { injectable, inject } from "inversify";

// Interface for SearchPersonRepository
export default interface ISearchPersonRepository {
    // Searches for persons based on the provided search criteria.
    search(search: Search): Promise<SearchResults>;

    // Counts the number of persons based on the provided search criteria.
    searchCount(search: Search): Promise<number>;
}

// This decorator ensures that SearchPersonRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class SearchPersonRepository implements ISearchPersonRepository {
    // Injecting the Helper service
    constructor(@inject(Helper) private helper: Helper) { }

    // Searches for persons based on the provided search criteria.
    public async search(search: Search): Promise<SearchResults> {
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
            // Build the match object dynamically based on the filter criteria.
            let filterBy: FilterBy = new FilterBy();
            let _$match: any = filterBy.getMatchQuery(search.filter);
            if (_$match) {
                // Build the match object dynamically.
                $match = { ...$match, ..._$match };
            }
        }

        // Check if the pagination object is not null and set limit and skip values.
        if (!this.helper.IsJsonNull(search.pagination)) {
            let pagination: Pagination = new Pagination(search.pagination);
            $limit = { $limit: pagination.getLimit() };
            $skip = { $skip: pagination.getOffset() };
        }

        // Get the total record count for the search criteria.
        let recordCount = await this.searchCount(search);

        // Initialize the aggregation pipeline.
        let $pipeline: any = [];

        // Add match, sort, limit, and skip stages to the pipeline if they exist.
        if ($match) $pipeline.push({ $match });
        if ($sort) $pipeline.push({ $sort });
        if ($limit) $pipeline.push($limit);
        if ($skip) $pipeline.push($skip);

        // Execute the aggregation pipeline on the PersonSchema.
        return await PersonSchema.aggregate($pipeline)
            .then((data: IPersonSchema[]) => {
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

    // Counts the number of persons based on the provided search criteria.
    public async searchCount(search: Search): Promise<number> {
        // Initialize the match object for filtering.
        let $match = {};

        // Check if the search object and filter array are not null.
        if (!this.helper.IsNullValue(search) && !this.helper.IsArrayNull(search.filter)) {
            // Build the match object dynamically based on the filter criteria.
            let filterBy: FilterBy = new FilterBy();
            let _$match: any = filterBy.getMatchQuery(search.filter);
            if (_$match) {
                // Build the match object dynamically.
                $match = { ...$match, ..._$match };
            }
        }

        // Define the aggregation pipeline for counting documents.
        let $pipeline = [
            { $match }, // Match stage to filter documents.
            { $group: { _id: null, recordCount: { $sum: 1 } } }, // Group stage to count documents.
            { $project: { _id: 0 } } // Project stage to format the output.
        ];

        // Execute the aggregation pipeline on the PersonSchema.
        return await PersonSchema.aggregate($pipeline)
            .then((data: IPersonSchema[]) => {
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
