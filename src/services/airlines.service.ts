import { inject, injectable } from "inversify";
import { Error, default as mongoose } from "mongoose";
import Helper from "../utils/helper.utils";;
import TYPES from "../constants/types";
import AirlineSchema, { IAirlineSchema } from "db/models/airlines.db.model";
import { IAirline } from "../models/airlines.model";

@injectable()
export default class AirlinesService {

    constructor(@inject(TYPES.Helper) private helper: Helper) {
    }

    public async getAirlines(): Promise<IAirlineSchema[]> {
        return AirlineSchema.find()
            .then((data: IAirlineSchema[]) => {
                return data;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async getAirline(id: string): Promise<IAirlineSchema> {
        return AirlineSchema.find({ _id: id })
            .then((data: IAirlineSchema[]) => {
                return this.helper.GetItemFromArray(data, 0, {});
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async getAirlinesAirports(): Promise<any> {

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
            .then((data: any) => {
                return data;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async getAirlineAirports(id: string): Promise<any> {

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
                return this.helper.GetItemFromArray(data, 0, {});
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async createAirline(airline: IAirlineSchema | IAirline): Promise<IAirlineSchema> {
        return AirlineSchema.create(airline)
            .then((data: IAirlineSchema) => {
                return data;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async updateAirline(id: string, airline: any): Promise<IAirlineSchema> {
        return AirlineSchema.findOneAndUpdate({ _id: id }, airline, { new: true })
            .then((data: any) => {
                return data;
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
}