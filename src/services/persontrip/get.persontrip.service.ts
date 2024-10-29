import { inject, injectable } from "inversify";
import IGetPersonTripRepository from "../../repositories/persontrip/get.persontrip.repository";
import { IPerson } from "../../models/person.model";
import { ITrip } from "../../models/trip.model";

// Interface for GetPersonTripService
export default interface IGetPersonTripService {
    // This method get multiple travellers for a trip.
    getTripTravellers(tripId: number): Promise<IPerson[]>;

    // This method get multiple trips for a person.
    getPersonTrips(userName: string): Promise<ITrip[]>;
}

// This decorator ensures that GetPersonTripService is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class GetPersonTripService implements IGetPersonTripService {
    // Injecting the GetPersonTripRepository service
    constructor(
        @inject("IGetPersonTripRepository") private getPersonTripRepository: IGetPersonTripRepository
    ) { }

    // This method get multiple travellers for a trip.
    public async getTripTravellers(tripId: number): Promise<IPerson[]> {
        // Check if the PersonTrip exists. If not, throw an error.
        let isExist = await this.getPersonTripRepository.isExist(null, tripId);
        if (!isExist) {
            throw new Error(`Provided PersonTrip '${tripId}' does not exist`);
        }
        // Retrieve and return the PersonTrip's information
        return await this.getPersonTripRepository.getTripTravellers(tripId);
    }

    // This method get multiple trips for a person.
    public async getPersonTrips(userName: string): Promise<ITrip[]> {
        // Check if the PersonTrip exists. If not, throw an error.
        let isExist = await this.getPersonTripRepository.isExist(userName, null);
        if (!isExist) {
            throw new Error(`Provided PersonTrip '${userName}' does not exist`);
        }
        // Retrieve and return the PersonTrip's information
        return await this.getPersonTripRepository.getPersonTrips(userName);
    }
}
