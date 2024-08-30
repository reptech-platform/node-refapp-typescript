import { Error } from "mongoose";
import { Search, SortBy, FilterBy, Pagination, SearchResults } from "../models/search.model";
import { provideSingleton, inject } from "../utils/provideSingleton";
import Helper from "../utils/helper.utils";;
import AirportSchema, { IAirportSchema } from "../db/models/airport.db.model";
import { IAirport } from "../models/airport.model";

@provideSingleton(AirportsService)
export default class AirportsService {

    constructor(@inject(Helper) private helper: Helper) { }

    public async getAirports(): Promise<IAirport[]> {
        return AirportSchema.find()
            .then((data: IAirportSchema[]) => {
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IAirport[];
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async getAirport(id: string): Promise<IAirport> {
        return AirportSchema.find({ _id: id })
            .then((data: IAirportSchema[]) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IAirport;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async getAriportAirlines(id: string): Promise<IAirport> {

        let $pipeline = [
            { $match: { _id: this.helper.ObjectId(id) } },
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

        return AirportSchema.aggregate($pipeline)
            .then((data: IAirportSchema[]) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IAirport;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

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

        return AirportSchema.aggregate($pipeline)
            .then((data: IAirportSchema[]) => {
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IAirport[];
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async createAirport(airport: IAirportSchema | IAirport): Promise<IAirport> {
        return AirportSchema.create(airport)
            .then((data: IAirportSchema) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IAirport;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async updateAirport(id: string, airport: IAirport): Promise<IAirport> {
        return AirportSchema.findOneAndUpdate({ _id: id }, airport, { new: true })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IAirport;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async deleteAirport(id: string): Promise<boolean> {
        return AirportSchema.findOneAndDelete({ _id: id })
            .then(() => {
                return true;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async searchAirport(search: Search): Promise<SearchResults> {


        let $sort: any = undefined, $match: any = undefined, $limit: any = undefined, $skip: any = undefined;

        if (!this.helper.IsArrayNull(search.sort)) {
            search.sort?.forEach((e: SortBy) => {
                let sortBy: SortBy = new SortBy(e);
                $sort = { ...$sort, [sortBy.name]: sortBy.getOrder() };
            });
        }

        if (!this.helper.IsArrayNull(search.filter)) {
            search.filter?.forEach((e: FilterBy) => {
                let filterBy: FilterBy = new FilterBy(e);
                $match = { ...$match, [filterBy.name]: filterBy.getQuery() };
            });
        }

        if (!this.helper.IsJsonNull(search.pagination)) {
            let pagination: Pagination = new Pagination(search.pagination);
            $limit = { $limit: pagination.getLimit() };
            $skip = { $skip: pagination.getOffset() };
        }

        let recordCount = await this.searchAirportCount(search);

        let $pipeline: any = [];

        if ($match) $pipeline.push({ $match });
        if ($sort) $pipeline.push({ $sort });
        if ($limit) $pipeline.push($limit);
        if ($skip) $pipeline.push($skip);

        return AirportSchema.aggregate($pipeline)
            .then((data: IAirportSchema[]) => {
                let results: SearchResults = new SearchResults();
                results.count = recordCount;
                results.data = this.helper.GetItemFromArray(data, -1, []);
                return results;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async searchAirportCount(search: Search): Promise<number> {


        let $match = {};

        if (!this.helper.IsNullValue(search) && !this.helper.IsArrayNull(search.filter)) {
            search.filter?.forEach((e: FilterBy) => {
                let filterBy: FilterBy = new FilterBy(e);
                $match = { ...$match, [filterBy.name]: filterBy.getQuery() };
            });
        }

        let $pipeline = [
            { $match },
            { $group: { _id: null, recordCount: { $sum: 1 } } },
            { $project: { _id: 0 } }
        ];

        return AirportSchema.aggregate($pipeline)
            .then((data: IAirportSchema[]) => {
                let dbRst = this.helper.GetItemFromArray(data, 0, { recordCount: 0 });
                return dbRst.recordCount as number;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async getAirportCount(): Promise<number> {

        let $pipeline = [
            { $group: { _id: null, recordCount: { $sum: 1 } } },
            { $project: { _id: 0 } }
        ];

        return AirportSchema.aggregate($pipeline)
            .then((data: IAirportSchema[]) => {
                let dbRst = this.helper.GetItemFromArray(data, 0, { recordCount: 0 });
                return dbRst.recordCount as number;
            })
            .catch((error: Error) => {
                throw error;
            });
    }
}