import { inject, injectable } from "inversify";
import { Error, default as mongoose } from "mongoose";
import Person, { IPersonSchema } from "../db/models/persons.db.model";
import Helper from "../utils/helper.utils";
import TYPES from "../constants/types";
import { IPerson } from "../models/psersons.model";
import { Search, SortBy, FilterBy, Pagination } from "../models/search.model";

@injectable()
export default class PersonsService {

    constructor(@inject(TYPES.Helper) private helper: Helper) {
    }

    public async getPersons(): Promise<IPersonSchema[]> {
        return Person.find()
            .then((data: IPersonSchema[]) => {
                return data;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async getPerson(id: string): Promise<IPersonSchema> {
        return Person.find({ _id: id })
            .then((data: IPersonSchema[]) => {
                return this.helper.GetItemFromArray(data, 0, {});
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async getPersonTrips(id: string): Promise<any> {

        let $pipeline = [

            { $match: { _id: this.helper.ObjectId(id) } },
            {
                $lookup: {
                    from: "travellers", localField: "_id", foreignField: "personId", as: "TravellersMap",
                    pipeline: [
                        {
                            $lookup: {
                                from: "trips", localField: "tripId", foreignField: "_id", as: "trips"
                            }
                        },
                        { $unwind: { path: "$trips", preserveNullAndEmptyArrays: true } },
                        {
                            $project: {
                                trips: "$trips"
                            }
                        }
                    ]
                }
            },
            { $unwind: { path: "$TravellersMap", preserveNullAndEmptyArrays: true } },
            { "$addFields": { "trips": "$TravellersMap.trips" } },
            {
                $project: {
                    "TravellersMap": 0,
                    "__v": 0
                }
            }
        ];

        return Person.aggregate($pipeline)
            .then((data: any) => {
                return this.helper.GetItemFromArray(data, 0, {});
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async getPersonsTrips(): Promise<any> {

        let $pipeline = [
            {
                $lookup: {
                    from: "persontrips", localField: "_id", foreignField: "personId", as: "PersonTrips",
                    pipeline: [
                        {
                            $lookup: {
                                from: "trips", localField: "tripId", foreignField: "_id", as: "trips"
                            }
                        },
                        { $unwind: { path: "$trips", preserveNullAndEmptyArrays: true } },
                        {
                            $project: {
                                trips: "$trips"
                            }
                        }
                    ]
                }
            },
            { $unwind: { path: "$PersonTrips", preserveNullAndEmptyArrays: true } },
            { "$addFields": { "trips": "$PersonTrips.trips" } },
            {
                $project: {
                    "PersonTrips": 0,
                    "__v": 0
                }
            }
        ];

        return Person.aggregate($pipeline)
            .then((data: any[]) => {
                return data;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async searchPerson(search: Search): Promise<any> {


        let $sort = {}, $match = {}, $limit: any = undefined, $skip: any = undefined;

        if (!this.helper.IsArrayNull(search.sort)) {
            search.sort.forEach((e: SortBy) => {
                let sortBy: SortBy = new SortBy(e);
                $sort = { ...$sort, [sortBy.name]: sortBy.getOrder() };
            });
        }

        if (!this.helper.IsArrayNull(search.filter)) {
            search.filter.forEach((e: FilterBy) => {
                let filterBy: FilterBy = new FilterBy(e);
                $match = { ...$match, [filterBy.name]: filterBy.getQuery() };
            });
        }

        if (!this.helper.IsJsonNull(search.pagination)) {
            let pagination: Pagination = new Pagination(search.pagination);
            $limit = { $limit: pagination.getLimit() };
            $skip = { $skip: pagination.getOffset() };
        }

        let $pipeline = [
            { $sort },
            { $match }
        ];

        if ($limit) $pipeline.push($limit);
        if ($skip) $pipeline.push($skip);

        return Person.aggregate($pipeline)
            .then((data: any) => {
                return this.helper.GetItemFromArray(data, -1, []);
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async searchPersonCount(search: Search): Promise<any> {


        let $match = {};

        if (!this.helper.IsNullValue(search) && !this.helper.IsArrayNull(search.filter)) {
            search.filter.forEach((e: FilterBy) => {
                let filterBy: FilterBy = new FilterBy(e);
                $match = { ...$match, [filterBy.name]: filterBy.getQuery() };
            });
        }

        let $pipeline = [
            { $match },
            { $group: { _id: null, recordCount: { $sum: 1 } } },
            { $project: { _id: 0 } }
        ];

        return Person.aggregate($pipeline)
            .then((data: any) => {
                let dbRst = this.helper.GetItemFromArray(data, 0, { recordCount: 0 });
                return dbRst.recordCount;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async getPersonCount(): Promise<any> {

        let $pipeline = [
            { $group: { _id: null, recordCount: { $sum: 1 } } },
            { $project: { _id: 0 } }
        ];

        return Person.aggregate($pipeline)
            .then((data: any) => {
                let dbRst = this.helper.GetItemFromArray(data, 0, { recordCount: 0 });
                return dbRst.recordCount;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async createPerson(person: IPersonSchema | IPerson): Promise<IPersonSchema> {
        return Person.create(person)
            .then((data: IPersonSchema) => {
                return data;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async updatePerson(id: string, person: any): Promise<IPersonSchema> {
        return Person.findOneAndUpdate({ _id: id }, person, { new: true })
            .then((data: any) => {
                return data;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async deletePerson(id: string): Promise<boolean> {
        return Person.findOneAndDelete({ _id: id })
            .then(() => {
                return true;
            })
            .catch((error: Error) => {
                throw error;
            });
    }
}