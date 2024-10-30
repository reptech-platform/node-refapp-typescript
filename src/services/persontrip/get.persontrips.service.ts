import { inject, injectable } from "inversify";
import IGetPersonTripsRepository from "../../repositories/persontrip/get.persontrips.repository";
import { IPersonTrip } from "../../models/persontrip.model";

export default interface IGetPersonTripsService {
    // Fetches all person and trips from the database.
    getAllPersonsAndTrips(): Promise<IPersonTrip[]>;
}

// This decorator ensures that GetPersonTripService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class GetPersonTripsService implements IGetPersonTripsService {

    // Injecting the Helper service
    constructor(
        @inject("IGetPersonTripsRepository") private getPersonTripsRepository: IGetPersonTripsRepository
    ) { }

    // Fetches all persons and trips from the database.
    public async getAllPersonsAndTrips(): Promise<IPersonTrip[]> {
        return await this.getPersonTripsRepository.getAllPersonsAndTrips();
    }
}