import { inject, injectable } from "inversify";
import IGetPersonTripsRepository from "../../repositories/persontrip/get.persontrips.repository";
import { ITrip } from "../../models/trip.model";
import { IPerson } from "../../models/person.model";

export default interface IGetPersonTripsService {
    // Fetches all person's trips from the database.
    getAllPersonTrips(): Promise<ITrip[]>;

    // Fetches all trip's travellers from the database.
    getAllTripTravellers(): Promise<IPerson[]>;
}

// This decorator ensures that GetPersonTripService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class GetPersonTripsService implements IGetPersonTripsService {

    // Injecting the Helper service
    constructor(
        @inject("IGetPersonTripsRepository") private getPersonTripsRepository: IGetPersonTripsRepository
    ) { }

    // Fetches all person's trips from the database.
    public async getAllPersonTrips(): Promise<ITrip[]> {
        return await this.getPersonTripsRepository.getAllPersonTrips();
    }

    // Fetches all trip's travellers from the database.
    public async getAllTripTravellers(): Promise<IPerson[]> {
        return await this.getPersonTripsRepository.getAllTripTravellers();
    }

}