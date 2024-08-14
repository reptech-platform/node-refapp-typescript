import { Error } from "mongoose";
import TripTraveller, { ITripTravellerSchema } from "../db/models/triptravellers.db.model";
import { provideSingleton } from "../utils/provideSingleton";

@provideSingleton(TripTravellersService)
export default class TripTravellersService {

    constructor() { }

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