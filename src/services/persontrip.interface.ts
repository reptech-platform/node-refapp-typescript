import { ClientSession } from "mongoose";
import { IPerson } from "../models/person.model";
import { ITrip } from "../models/trip.model";

export default interface IPersonTripService {

    // This method checks if a person with the given userName is associated with a trip with the given tripId.
    isPersonAndTripExist(userName: string, tripId: number): Promise<boolean>;

    // This method get multiple trips to a person.
    getPersonTrips(userName: string): Promise<ITrip[]>;

    // This method adds multiple trips for a person.
    addPersonTrips(userName: string, trips: ITrip[] | any[], dbSession: ClientSession | undefined): Promise<void>;

    // This method deletes a trip for a person.
    deletePersonTrip(userName: string, tripId: number, dbSession: ClientSession | undefined): Promise<void>;

    // This method deletes a all trips for a person.
    deleteAllPersonTrips(userName: string, dbSession: ClientSession | undefined): Promise<void>;

    // This method get multiple travellers to a trip.
    getTripTravellers(tripId: number): Promise<IPerson[]>;

    // This method adds multiple travellers to a trip.
    addTripTravellers(tripId: number, travellers: IPerson[] | any[], dbSession: ClientSession | undefined): Promise<void>;

    // This method deletes a all travellers for a tripe.
    deleteAllTripTravellers(tripId: number, dbSession: ClientSession | undefined): Promise<void>;

}