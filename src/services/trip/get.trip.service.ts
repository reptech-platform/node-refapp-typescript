import { inject, injectable } from "inversify";
import IGetTripRepository from "../../repositories/trip/get.trip.repository";
import { ITrip } from "../../models/trip.model";

export default interface IGetTripService {
    // Fetches a single trip by their tripId, excluding the _id field.
    getTrip(tripId: number): Promise<ITrip>;
}

// This decorator ensures that PersonsService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class GetTripService implements IGetTripService {

    // Injecting the Helper service
    constructor(
        @inject("IGetTripRepository") private getTripRepository: IGetTripRepository
    ) { }

    // Fetches a single trip by their tripId, excluding the _id field.
    public async getTrip(tripId: number): Promise<ITrip> {

        // Check if the trip exists. If they do, throw an error.
        let isExist = await this.getTripRepository.isExist(tripId);
        if (!isExist) {
            throw new Error(`Provided trip '${tripId}' does not exist`);
        }

        return await this.getTripRepository.getTrip(tripId);
    }

}