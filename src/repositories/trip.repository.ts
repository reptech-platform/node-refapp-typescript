import { ClientSession } from "mongoose";
import { ITrip } from "../models/trip.model";
import { Search, SearchResults } from "../models/search.model";

export default interface ITripRepository {

    // Checks if a trip with the given tripId exists in the database.
    isTripExist(tripId: number): Promise<boolean>;

    // Fetches all trips from the database, excluding the _id field.
    getTrips(): Promise<ITrip[]>;

    // Fetches a single trip by its tripId, excluding the _id field.
    getTrip(tripId: number): Promise<ITrip>;

    // Creates a new trip in the database.
    createTrip(trip: ITrip, session: ClientSession | undefined): Promise<ITrip>;

    // Updates an existing trip by its tripId and returns the updated trip.
    updateTrip(tripId: number, trip: any, session: ClientSession | undefined): Promise<ITrip>;

    // Deletes a trip by its tripId.
    deleteTrip(tripId: number, session: ClientSession | undefined): Promise<boolean>;

    // Searches for trips based on the provided search criteria.
    searchTrip(search: Search): Promise<SearchResults>;

    // Gets the total count of trips matching the search criteria.
    searchTripCount(search: Search): Promise<number>;

    // This method returns the total count of trips in the database.
    getTripCount(): Promise<number>;

}