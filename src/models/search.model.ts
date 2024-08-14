import { injectable } from "inversify";
import Helper from "../utils/helper.utils";

@injectable()
export class SortBy {
    name: string;
    order: string;

    constructor(sortBy: SortBy) {
        this.name = sortBy.name;
        this.order = sortBy.order;
    }

    getOrder() {
        return this.order?.toUpperCase() === 'DESC' ? -1 : 1
    }

}

@injectable()
export class Pagination {
    size: number | 10;
    page: number | 1;

    constructor(pagination?: Pagination) {
        this.size = pagination?.size || 10;
        this.page = pagination?.page || 1;
    }

    getLimit() {
        return this.size * this.page;
    }

    getOffset() {
        return (this.page - 1) * this.size;
    }
}

@injectable()
export class FilterBy {
    name: string;
    condition: string;
    value: string | number;
    private helper: Helper;

    constructor(filterBy: FilterBy) {
        this.helper = new Helper();
        this.name = filterBy.name;
        this.condition = filterBy.condition;
        this.value = filterBy.value;
    }

    getQuery() {

        let tOperator = this.condition || "";
        let _query: any = { $regex: `^${this.value}$`, $options: 'i' };

        if (!this.helper.IsNullValue(tOperator)) {
            switch (tOperator.toUpperCase()) {
                case 'CONTAINS': _query = { $regex: `${this.value}`, $options: 'i' }; break;
                case 'STARTSWITH': _query = { $regex: `^${this.value}`, $options: 'i' }; break;
                case 'ENDSSWITH': _query = { $regex: `^${this.value}`, $options: 'i' }; break;
                case '=':
                    _query = { $regex: `^${this.value}$`, $options: 'i' };
                    if (typeof (this.value) === 'number') {
                        _query = { $eq: this.value };
                    }

                    break;
                case '>': _query = { $gt: this.value }; break;
                case '>=': _query = { $gte: this.value }; break;
                case '<': _query = { $lt: this.value }; break;
                case '<=': _query = { $lte: this.value }; break;
            }
        }

        return _query;

    }

}

@injectable()
export class Search {

    sort?: SortBy[] = [];
    filter?: FilterBy[] = [];
    pagination?: Pagination;

    constructor() { }

}

@injectable()
export class SearchResults {
    count: number;
    data: any;
}