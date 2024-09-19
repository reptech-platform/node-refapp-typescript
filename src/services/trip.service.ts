import { ITrip } from "../models/trip.model";
import { Search, SearchResults } from "../models/search.model";
import { provideSingleton, inject } from "../utils/provideSingleton";
import TripRepository from "../repositories/trip.repository";

// This decorator ensures that TripsService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@provideSingleton(TripService)
export default class TripService {

    // Injecting the Helper service
    constructor(
        @inject(TripRepository) private tripRepository: TripRepository) { }

    // Checks if a trip with the given tripId exists in the database.
    public async isTripExist(tripId: number): Promise<boolean> {
        return await this.tripRepository.isTripExist(tripId);
    }

    // Fetches all trips from the database, excluding the _id field.
    public async getTrips(): Promise<ITrip[]> {
        return await this.tripRepository.getTrips();
    }

    // Fetches a single trip by its tripId, excluding the _id field.
    public async getTrip(tripId: number): Promise<ITrip> {
        return await this.tripRepository.getTrip(tripId);
    }

    // Creates a new trip in the database.
    public async createTrip(trip: ITrip): Promise<ITrip> {

        let newTrip = await this.tripRepository.createTrip(trip);

        // Retrieve the travellers information from the trip object, which may be undefined
        /* const travellers: IPerson[] | undefined = trip.travellers;

        if (travellers && travellers.length > 0) {
            // Add or update travellers and map the trip travellers
            await this.personTripsService.addOrUpdateTripTravellers(trip.tripId, travellers);
        } */

        // Returns newly created trip object
        return newTrip;
    }

    // Updates an existing trip by its tripId and returns the updated trip.
    public async updateTrip(tripId: number, trip: any): Promise<ITrip> {

        let updatedTrip = await this.tripRepository.updateTrip(tripId, trip);

        /* // Retrieve the travellers information from the trip object, which may be undefined
        const travellers: IPerson[] | undefined = trip.travellers;

        if (travellers && travellers.length > 0) {
            // Add or update travellers and map the trip travellers
            await this.personTripsService.addOrUpdateTripTravellers(trip.tripId, travellers);
        } */

        return updatedTrip;
    }

    // Deletes a trip by its tripId.
    public async deleteTrip(tripId: number): Promise<boolean> {

        let boolDeleted: boolean = await this.tripRepository.deleteTrip(tripId);

        // delete all trip travellers from the database
        // await this.personTripsService.deleteAllTripTravellers(tripId);

        return boolDeleted;
    }

    // Searches for trips based on the provided search criteria.
    public async searchTrip(search: Search): Promise<SearchResults> {
        return await this.tripRepository.searchTrip(search);
    }

    // Gets the total count of trips matching the search criteria.
    public async searchTripCount(search: Search): Promise<number> {
        return await this.tripRepository.searchTripCount(search);
    }

    // This method returns the total count of trips in the database.
    public async getTripCount(): Promise<number> {
        return await this.tripRepository.getTripCount();
    }

}