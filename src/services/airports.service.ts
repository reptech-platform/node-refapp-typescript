import { inject, injectable } from "inversify";
import { Error, default as mongoose } from "mongoose";
import Helper from "../utils/helper.utils";;
import TYPES from "../constants/types";
import AirportSchema, { IAirportSchema } from "db/models/airports.db.model";
import { IAirport } from "../models/airport.model";

@injectable()
export default class AirportsService {

    constructor(@inject(TYPES.Helper) private helper: Helper) {
    }

    public async getAirports(): Promise<IAirportSchema[]> {
        return AirportSchema.find()
            .then((data: IAirportSchema[]) => {
                return data;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async getAirport(id: string): Promise<IAirportSchema> {
        return AirportSchema.find({ _id: id })
            .then((data: IAirportSchema[]) => {
                return this.helper.GetItemFromArray(data, 0, {});
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async getAriportAirlines(id: string): Promise<any> {

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
            .then((data: any) => {
                return data;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async getAriportsAirlines(): Promise<any> {

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
            .then((data: any) => {
                return data;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async createAirport(airport: IAirportSchema | IAirport): Promise<IAirportSchema> {
        return AirportSchema.create(airport)
            .then((data: IAirportSchema) => {
                return data;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async updateAirport(id: string, airport: any): Promise<IAirportSchema> {
        return AirportSchema.findOneAndUpdate({ _id: id }, airport, { new: true })
            .then((data: any) => {
                return data;
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
}