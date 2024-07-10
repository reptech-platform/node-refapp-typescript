import { inject, injectable } from "inversify";
import { Error, default as mongoose } from "mongoose";
import Person, { IPersonSchema } from "../db/models/persons.db.model";
import Helper from "../utils/helper.utils";
import TYPES from "../constants/types";
import { IPerson } from "../models/psersons.model";

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

    public async getPerson(id: string): Promise<IPersonSchema[]> {
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
            { "$addFields": { "trips": "$TravellersMap.trips" } },
            { $unwind: { path: "$TravellersMap", preserveNullAndEmptyArrays: true } },
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
            { "$addFields": { "trips": "$PersonTrips.trips" } },
            { $unwind: { path: "$PersonTrips", preserveNullAndEmptyArrays: true } },
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