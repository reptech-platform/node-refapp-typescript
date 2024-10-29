import { inject, injectable } from "inversify";
import IGetTripsRepository from "../../repositories/trip/get.trips.repository";
import { ITrip } from "../../models/trip.model";

export default interface IGetTripsService {
    // Fetches all trips from the database.
    getTrips(): Promise<ITrip[]>;
}

// This decorator ensures that GetTripsService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class GetTripsService implements IGetTripsService {

    // Injecting the Helper service
    constructor(
        @inject("IGetTripsRepository") private getTripsRepository: IGetTripsRepository
    ) { }

    // Fetches all trips from the database.
    public async getTrips(): Promise<ITrip[]> {
        return await this.getTripsRepository.getTrips();
    }

}