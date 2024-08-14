import { Error } from "mongoose";
import PersonSchema, { IPersonSchema } from "../db/models/persons.db.model";
import Helper from "../utils/helper.utils";
import { IPerson } from "../models/persons.model";
import { Search, SortBy, FilterBy, Pagination, SearchResults } from "../models/search.model";
import { provideSingleton, inject } from "../utils/provideSingleton";

@provideSingleton(PersonsService)
export default class PersonsService {

    constructor(@inject(Helper) private helper: Helper) {
    }

    public async getPersons(): Promise<IPerson[]> {
        return PersonSchema.find()
            .then((data: IPersonSchema[]) => {
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IPerson[];
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async getPerson(id: string): Promise<IPerson> {
        return PersonSchema.find({ _id: id })
            .then((data: IPersonSchema[]) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IPerson;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async createPerson(person: IPersonSchema | IPerson): Promise<IPerson> {
        return PersonSchema.create(person)
            .then((data: IPersonSchema) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IPerson;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async getPersonTrips(id: string): Promise<IPerson> {

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

        return PersonSchema.aggregate($pipeline)
            .then((data: IPersonSchema[]) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IPerson;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async getPersonsTrips(): Promise<IPerson[]> {

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

        return PersonSchema.aggregate($pipeline)
            .then((data: IPersonSchema[]) => {
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IPerson[];
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async updatePerson(id: string, person: any): Promise<IPerson> {
        return PersonSchema.findOneAndUpdate({ _id: id }, person, { new: true })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IPerson;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async deletePerson(id: string): Promise<boolean> {
        return PersonSchema.findOneAndDelete({ _id: id })
            .then(() => {
                return true;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async searchPerson(search: Search): Promise<SearchResults> {


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

        let recordCount = await this.searchPersonCount(search);

        let $pipeline: any = [];

        if ($match) $pipeline.push({ $match });
        if ($sort) $pipeline.push({ $sort });
        if ($limit) $pipeline.push($limit);
        if ($skip) $pipeline.push($skip);

        return PersonSchema.aggregate($pipeline)
            .then((data: IPersonSchema[]) => {
                let results: SearchResults = new SearchResults();
                results.count = recordCount;
                results.data = this.helper.GetItemFromArray(data, -1, []);
                return results;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async searchPersonCount(search: Search): Promise<number> {


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

        return PersonSchema.aggregate($pipeline)
            .then((data: IPersonSchema[]) => {
                let dbRst = this.helper.GetItemFromArray(data, 0, { recordCount: 0 });
                return dbRst.recordCount as number;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async getPersonCount(): Promise<number> {

        let $pipeline = [
            { $group: { _id: null, recordCount: { $sum: 1 } } },
            { $project: { _id: 0 } }
        ];

        return PersonSchema.aggregate($pipeline)
            .then((data: IPersonSchema[]) => {
                let dbRst = this.helper.GetItemFromArray(data, 0, { recordCount: 0 });
                return dbRst.recordCount as number;
            })
            .catch((error: Error) => {
                throw error;
            });
    }
}