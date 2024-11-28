import { injectable } from "inversify";
import Helper from "../utils/helper.utils";

// Class representing sorting criteria
@injectable()
export class SortBy {
    // The name of the field to sort by
    name: string;

    // The order of sorting
    order: string;

    // Constructor for the SortBy class
    constructor(sortBy: SortBy) {
        this.name = sortBy.name;
        this.order = sortBy.order;
    }

    // Method to get the sorting order as a number (-1 for DESC, 1 for ASC)
    getOrder() {
        return this.order?.toUpperCase() === 'DESC' ? -1 : 1;
    }
}

// Class representing pagination details
@injectable()
export class Pagination {
    // The number of items per page, default is 10
    size: number | 10;

    // The current page number, default is 1
    page: number | 1;

    // Constructor for the Pagination class
    constructor(pagination?: Pagination) {
        this.size = pagination?.size || 10;
        this.page = pagination?.page || 1;
    }

    // Method to get the limit of items to fetch
    getLimit() {
        return this.size * this.page;
    }

    // Method to get the offset for the items to fetch
    getOffset() {
        return (this.page - 1) * this.size;
    }
}

// Class representing filtering criteria
@injectable()
export class FilterBy {
    // The name of the field to filter by
    name: string;

    // The condition for filtering, e.g., 'CONTAINS', 'STARTSWITH'
    condition: string;

    // The value to filter by
    value: string | number;

    // The operator of the field to filter by ( and || or)
    operator: string = "OR";

    // Private helper instance for additional operations
    private helper: Helper;

    // Constructor for the FilterBy class
    constructor() { this.helper = new Helper(); }

    /* constructor(filterBy: FilterBy) {
        this.helper = new Helper();
        this.name = filterBy.name;
        this.condition = filterBy.condition;
        this.value = filterBy.value;
        this.operator = filterBy.operator;
    } */

    // Method to get the query object for filtering
    getMatchQuery(filters: FilterBy[] = []) {
        let $and: any = [], $or: any = [], $match: any = null;

        if (filters.length > 0) {
            filters.forEach((e: FilterBy) => {
                let filter = this.getQuery(e);
                // Build the match object dynamically.
                if (e.operator.toUpperCase() === 'AND') {
                    $and.push({ [e.name]: filter });
                } else if (e.operator.toUpperCase() === 'OR') {
                    $or.push({ [e.name]: filter });
                }
                //$match = { ...$match, [filterBy.name]: filterBy.getQuery() };
            });
        }

        if ($and.length > 0 && $or.length > 0) {
            $match = { $and: [...$and, { $or: [...$or] }] };
            $or = [];
            $and = [];
        }

        if ($and.length > 0) {
            $match = { $and };
        }

        if ($or.length > 0) {
            $match = { $or };
        }

        return $match;

    }

    // Method to get the query object for filtering
    private getQuery(filterBy: FilterBy) {
        let tOperator = filterBy.condition || "";
        let _query: any = { $regex: `^${filterBy.value}$`, $options: 'i' };

        if (!this.helper.IsNullValue(tOperator)) {
            switch (tOperator.toUpperCase()) {
                case 'CONTAINS': _query = { $regex: `${filterBy.value}`, $options: 'i' }; break;
                case 'STARTSWITH': _query = { $regex: `^${filterBy.value}`, $options: 'i' }; break;
                case 'ENDSWITH': _query = { $regex: `${filterBy.value}$`, $options: 'i' }; break;
                case '=':
                    _query = { $regex: `^${filterBy.value}$`, $options: 'i' };
                    if (typeof filterBy.value === 'number') {
                        _query = { $eq: filterBy.value };
                    }
                    break;
                case '>': _query = { $gt: filterBy.value }; break;
                case '>=': _query = { $gte: filterBy.value }; break;
                case '<': _query = { $lt: filterBy.value }; break;
                case '<=': _query = { $lte: filterBy.value }; break;
            }
        }

        return _query;
    }
}

// Class representing search criteria
@injectable()
export class Search {
    // Optional array of sorting criteria
    sort?: SortBy[] = [];

    // Optional array of filtering criteria
    filter?: FilterBy[] = [];

    // Optional pagination details
    pagination?: Pagination;

    // Constructor for the Search class
    constructor() { }
}

// Class representing search results
@injectable()
export class SearchResults {
    // The total count of items found
    count: number;

    // The data of the search results
    data: any;
}
