import { Error } from "mongoose";
import { provideSingleton, inject } from "../utils/provideSingleton";
import Helper from "../utils/helper.utils";;
import AirlineSchema, { IAirlineSchema } from "../db/models/airline.db.model";
import { IAirline } from "../models/airline.model";
import { FilterBy, Pagination, Search, SearchResults, SortBy } from "../models/search.model";

@provideSingleton(AirlinesService)
export default class AirlinesService {

    constructor(@inject(Helper) private helper: Helper) {
    }

    public async getAirlines(): Promise<IAirline[]> {
        return AirlineSchema.find()
            .then((data: IAirlineSchema[]) => {
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IAirline[];
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async getAirline(id: string): Promise<IAirline> {
        return AirlineSchema.find({ _id: id })
            .then((data: IAirlineSchema[]) => {
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IAirline;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

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

        return AirlineSchema.aggregate($pipeline)
            .then((data: IAirlineSchema[]) => {
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IAirline[];
            })
            .catch((error: Error) => {
                throw error;
            });
    }

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

        return AirlineSchema.aggregate($pipeline)
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IAirline;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async createAirline(airline: IAirline | IAirline): Promise<IAirline> {
        return AirlineSchema.create(airline)
            .then((data: IAirlineSchema) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IAirline;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async updateAirline(id: string, airline: IAirline): Promise<IAirline> {
        return AirlineSchema.findOneAndUpdate({ _id: id }, airline, { new: true })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IAirline;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async deleteAirline(id: string): Promise<boolean> {
        return AirlineSchema.findOneAndDelete({ _id: id })
            .then(() => {
                return true;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async searchAirline(search: Search): Promise<SearchResults> {


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

        let recordCount = await this.searchAirlineCount(search);

        let $pipeline: any = [];

        if ($match) $pipeline.push({ $match });
        if ($sort) $pipeline.push({ $sort });
        if ($limit) $pipeline.push($limit);
        if ($skip) $pipeline.push($skip);

        return AirlineSchema.aggregate($pipeline)
            .then((data: IAirlineSchema[]) => {
                let results: SearchResults = new SearchResults();
                results.count = recordCount;
                results.data = this.helper.GetItemFromArray(data, -1, []);
                return results;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async searchAirlineCount(search: Search): Promise<number> {


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

        return AirlineSchema.aggregate($pipeline)
            .then((data: IAirlineSchema[]) => {
                let dbRst = this.helper.GetItemFromArray(data, 0, { recordCount: 0 });
                return dbRst.recordCount as number;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async getAirlineCount(): Promise<number> {

        let $pipeline = [
            { $group: { _id: null, recordCount: { $sum: 1 } } },
            { $project: { _id: 0 } }
        ];

        return AirlineSchema.aggregate($pipeline)
            .then((data: IAirlineSchema[]) => {
                let dbRst = this.helper.GetItemFromArray(data, 0, { recordCount: 0 });
                return dbRst.recordCount as number;
            })
            .catch((error: Error) => {
                throw error;
            });
    }
}