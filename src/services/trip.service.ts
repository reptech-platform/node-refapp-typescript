import { Error } from "mongoose";
import Helper from "../utils/helper.utils";
import TripSchema, { ITripSchema } from "../db/models/trip.db.model";
import { ITrip } from "../models/trip.model";
import { Search, SortBy, FilterBy, Pagination, SearchResults } from "../models/search.model";
import { provideSingleton, inject } from "../utils/provideSingleton";

@provideSingleton(TripsService)
export default class TripsService {

    constructor(@inject(Helper) private helper: Helper) { }

    public async getTrips(): Promise<ITrip[]> {
        return TripSchema.find()
            .then((data: ITripSchema[]) => {
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as ITrip[];
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async getTrip(id: string): Promise<ITrip> {
        return TripSchema.find({ _id: id })
            .then((data: ITripSchema[]) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as ITrip;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async getTripsTravellers(): Promise<ITrip[]> {

        let $pipeline = [
            {
                $lookup: {
                    from: "travellers", localField: "_id", foreignField: "tripId", as: "TravellersMap",
                    pipeline: [
                        {
                            $lookup: {
                                from: "persons", localField: "personId", foreignField: "_id", as: "persons"
                            }
                        },
                        { $unwind: { path: "$persons", preserveNullAndEmptyArrays: true } },
                        {
                            $project: {
                                travellers: "$persons"
                            }
                        }
                    ]
                }
            },
            { $unwind: { path: "$TravellersMap", preserveNullAndEmptyArrays: true } },
            { "$addFields": { "travellers": "$TravellersMap.travellers" } },
            {
                $project: {
                    "TravellersMap": 0,
                    "__v": 0
                }
            }
        ];

        return TripSchema.aggregate($pipeline)
            .then((data: ITripSchema[]) => {
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as ITrip[];
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async getTripTravellers(id: string): Promise<ITrip> {

        let $pipeline = [

            { $match: { _id: this.helper.ObjectId(id) } },
            {
                $lookup: {
                    from: "triptravellers", localField: "_id", foreignField: "tripId", as: "TripTravellers",
                    pipeline: [
                        {
                            $lookup: {
                                from: "persons", localField: "personId", foreignField: "_id", as: "persons"
                            }
                        },
                        { $unwind: { path: "$persons", preserveNullAndEmptyArrays: true } },
                        {
                            $project: {
                                travellers: "$persons"
                            }
                        }
                    ]
                }
            },
            { $unwind: { path: "$TripTravellers", preserveNullAndEmptyArrays: true } },
            { "$addFields": { "travellers": "$TripTravellers.travellers" } },
            {
                $project: {
                    "TripTravellers": 0,
                    "__v": 0
                }
            }
        ];

        return TripSchema.aggregate($pipeline)
            .then((data: ITripSchema[]) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as ITrip;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async createTrip(trip: ITripSchema | ITrip): Promise<ITrip> {
        return TripSchema.create(trip)
            .then((data: ITripSchema) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as ITrip;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async updateTrip(id: string, trip: any): Promise<ITrip> {
        return TripSchema.findOneAndUpdate({ _id: id }, trip, { new: true })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as ITrip;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async deleteTrip(id: string): Promise<boolean> {
        return TripSchema.findOneAndDelete({ _id: id })
            .then(() => {
                return true;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async searchTrip(search: Search): Promise<SearchResults> {


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

        let recordCount = await this.searchTripCount(search);

        let $pipeline: any = [];

        if ($match) $pipeline.push({ $match });
        if ($sort) $pipeline.push({ $sort });
        if ($limit) $pipeline.push($limit);
        if ($skip) $pipeline.push($skip);

        return TripSchema.aggregate($pipeline)
            .then((data: ITripSchema[]) => {
                let results: SearchResults = new SearchResults();
                results.count = recordCount;
                results.data = this.helper.GetItemFromArray(data, -1, []);
                return results;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async searchTripCount(search: Search): Promise<number> {


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

        return TripSchema.aggregate($pipeline)
            .then((data: ITripSchema[]) => {
                let dbRst = this.helper.GetItemFromArray(data, 0, { recordCount: 0 });
                return dbRst.recordCount as number;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async getTripCount(): Promise<number> {

        let $pipeline = [
            { $group: { _id: null, recordCount: { $sum: 1 } } },
            { $project: { _id: 0 } }
        ];

        return TripSchema.aggregate($pipeline)
            .then((data: ITripSchema[]) => {
                let dbRst = this.helper.GetItemFromArray(data, 0, { recordCount: 0 });
                return dbRst.recordCount as number;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async getTripsTravellers(): Promise<ITrip[]> {

    }
}