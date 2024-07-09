import { inject, injectable } from "inversify";
import { Error, default as mongoose } from "mongoose";
import TripTraveller, { ITripTravellerSchema } from "../db/models/triptravellers.db.model";
import Helper from "../utils/helper.utils";;
import TYPES from "../constants/types";

@injectable()
export default class TripTravellersService {

    constructor(@inject(TYPES.Helper) private helper: Helper) {
    }

    public async createTraveller(tripTraveller: ITripTravellerSchema | any): Promise<ITripTravellerSchema> {
        return TripTraveller.create(tripTraveller)
            .then((data: ITripTravellerSchema) => {
                return data;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async createTravellers(tripTravellers: ITripTravellerSchema[] | any[]): Promise<ITripTravellerSchema[]> {

        return TripTraveller.insertMany(tripTravellers)
            .then((data: any) => {
                return data;
            })
            .catch((error: Error) => {
                throw error;
            });
    }
}