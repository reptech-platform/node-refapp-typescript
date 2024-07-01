import { inject, injectable } from "inversify";
import { Error, default as mongoose } from "mongoose";
import Traveller, { ITravellerSchema } from "../db/models/travellers.db.model";
import Helper from "../utils/helper.utils";;
import TYPES from "../constants/types";

@injectable()
export default class TravellersService {

    constructor(@inject(TYPES.Helper) private helper: Helper) {
    }

    public async createTraveller(traveller: ITravellerSchema | any): Promise<ITravellerSchema> {
        return Traveller.create(traveller)
            .then((data: ITravellerSchema) => {
                return data;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async createBulkTraveller(travellers: ITravellerSchema[] | any[]): Promise<ITravellerSchema[]> {

        return Traveller.insertMany(travellers)
            .then((data: any) => {
                return data;
            })
            .catch((error: Error) => {
                throw error;
            });
    }
}