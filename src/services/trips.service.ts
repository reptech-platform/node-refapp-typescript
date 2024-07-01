import { inject, injectable } from "inversify";
import { Error, default as mongoose } from "mongoose";
import TripSchema, { ITripSchema } from "../db/models/trips.db.model";
import Helper from "../utils/helper.utils";;
import TYPES from "../constants/types";
import { ITrip } from "../models/trips.model";
import { pipeline } from "stream";

@injectable()
export default class TripsService {

    constructor(@inject(TYPES.Helper) private helper: Helper) {
    }

    public async getTrips(): Promise<ITripSchema[]> {
        return TripSchema.find()
            .then((data: ITripSchema[]) => {
                return data;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async getTrip(id: string): Promise<ITripSchema[]> {
        return TripSchema.find({ _id: id })
            .then((data: ITripSchema[]) => {
                return this.helper.GetItemFromArray(data, 0, {});
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async getTripsTravellers(): Promise<any> {

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
            { "$addFields": { "travellers": "$TravellersMap.travellers" } },
            { $unwind: { path: "$TravellersMap", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    "TravellersMap": 0,
                    "__v": 0
                }
            }
        ];

        return TripSchema.aggregate($pipeline)
            .then((data: any) => {
                return data;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async getTripTravellers(id: string): Promise<any> {

        let $pipeline = [

            { $match: { _id: this.helper.ObjectId(id) } },
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
            { "$addFields": { "travellers": "$TravellersMap.travellers" } },
            { $unwind: { path: "$TravellersMap", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    "TravellersMap": 0,
                    "__v": 0
                }
            }
        ];

        return TripSchema.aggregate($pipeline)
            .then((data: any) => {
                return this.helper.GetItemFromArray(data, 0, {});
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async createTrip(trip: ITripSchema | ITrip): Promise<ITripSchema> {
        return TripSchema.create(trip)
            .then((data: ITripSchema) => {
                return data;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async updateTrip(id: string, trip: any): Promise<ITripSchema> {
        return TripSchema.findOneAndUpdate({ _id: id }, trip, { new: true })
            .then((data: any) => {
                return data;
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
}