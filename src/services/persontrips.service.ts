import { inject, injectable } from "inversify";
import { Error, default as mongoose } from "mongoose";
import PersonTrip, { IPersonTripSchema } from "../db/models/persontrips.db.model";
import Helper from "../utils/helper.utils";;
import TYPES from "../constants/types";

@injectable()
export default class PersonTripsService {

    constructor(@inject(TYPES.Helper) private helper: Helper) {
    }

    public async createPersonTrip(personTrip: IPersonTripSchema | any): Promise<IPersonTripSchema> {
        return PersonTrip.create(personTrip)
            .then((data: IPersonTripSchema) => {
                return data;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async createPersonTrips(personTrip: IPersonTripSchema[] | any[]): Promise<IPersonTripSchema[]> {

        return PersonTrip.insertMany(personTrip)
            .then((data: any) => {
                return data;
            })
            .catch((error: Error) => {
                throw error;
            });
    }
}