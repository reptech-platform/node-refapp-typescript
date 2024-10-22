import { ClientSession } from "mongoose";
import { IPerson } from "../models/person.model";
import { ITrip } from "../models/trip.model";
import MapItem from "src/utils/mapitems";

export default interface IPersonTripRepository {

    // This method checks if a person with the given userName is associated with a trip with the given tripId.
    isPersonAndTripExist(userName: string, tripId: number): Promise<boolean>;

    // This method get multiple trips to a person.
    getPersonTrips(userName: string): Promise<ITrip[]>;

    // This method adds multiple trips for a person.
    mapPersonsAndTrips(mapItems: MapItem[], session: ClientSession | undefined): Promise<void>;

    // This method deletes a trip for a person.
    deletePersonTrip(userName: string, tripId: number, session: ClientSession | undefined): Promise<void>;

    // This method deletes a all trips for a person.
    deleteAllPersonTrips(userName: string, session: ClientSession | undefined): Promise<void>;

    // This method get multiple travellers to a trip.
    getTripTravellers(tripId: number): Promise<IPerson[]>;

    // This method deletes a all travellers for a tripe.
    deleteAllTripTravellers(tripId: number, session: ClientSession | undefined): Promise<void>;

}