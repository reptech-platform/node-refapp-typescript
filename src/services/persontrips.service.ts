import { Error } from "mongoose";
import PersonTrip, { IPersonTripSchema } from "../db/models/persontrips.db.model";
import { provideSingleton } from "../utils/provideSingleton";

@provideSingleton(PersonTripsService)
export default class PersonTripsService {

    constructor() { }

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