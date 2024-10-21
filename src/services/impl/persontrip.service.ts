import { IPerson } from "../../models/person.model";
import { ITrip } from "../../models/trip.model";
import PersonTripRepository from "../../repositories/persontrip.repository";
import MapItem from "../../utils/mapitems";
import TripRepository from "../../repositories/trip.repository";
import PersonRepository from "../../repositories/person.repository";
import DbSession from "../../db/utils/dbsession.db";
import { ClientSession } from "mongoose";
import { inject, injectable } from "inversify";
import IPersonTripService from "../persontrip.interface";
import Helper from "../../utils/helper.utils";

// This decorator ensures that PersonTripsService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@injectable()
export default class PersonTripService implements IPersonTripService {

    // Injecting the Helper, PersonsService and TripService services
    constructor(
        @inject(Helper) private helper: Helper,
        @inject(PersonTripRepository) private personTripRepository: PersonTripRepository,
        @inject(PersonRepository) private personRepository: PersonRepository,
        @inject(TripRepository) private tripRepository: TripRepository,
    ) { }

    // This method checks if a person with the given userName is associated with a trip with the given tripId.
    public async isPersonAndTripExist(userName: string, tripId: number): Promise<boolean> {
        return await this.personTripRepository.isPersonAndTripExist(userName, tripId);
    }


    // This method get multiple trips to a person.
    public async getPersonTrips(userName: string): Promise<ITrip[]> {
        return await this.personTripRepository.getPersonTrips(userName);
    }

    // This method adds multiple trips for a person.
    public async addPersonTrips(userName: string, trips: ITrip[] | any[], dbSession: ClientSession | undefined): Promise<void> {

        // Create a new session for transaction if session is null
        if (this.helper.IsNullValue(dbSession)) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        }

        let mapItems: MapItem[] = [];

        if (trips && trips.length > 0) {

            // Loop Check if the trips already exists in the database using its userName
            for (let index = 0; index < trips.length; index++) {

                // Read trip based on index loop
                let currentTrip = trips[index];

                // Check the trip is exist in the database
                let isExist = await this.tripRepository.isTripExist(currentTrip.tripId);

                if (!isExist) {
                    // If the trip does not exist, create a new trip entry in the database
                    currentTrip = await this.tripRepository.createTrip(currentTrip, dbSession);
                } else {
                    // If the trip exist, update trip entry in the database
                    await this.tripRepository.updateTrip(currentTrip.tripId, currentTrip, dbSession);
                }

                // Check person and trip is already mapped
                isExist = await this.personTripRepository.isPersonAndTripExist(userName, currentTrip.tripId);

                if (!isExist) {
                    // Add tripId to array of id list for person trip mapping
                    mapItems.push({ userName, tripId: currentTrip.tripId });
                }
            }
        }

        if (mapItems && mapItems.length > 0) {
            // Add or update trips and map the person trips
            await this.personTripRepository.mapPersonsAndTrips(mapItems, dbSession);
        }

        DbSession.Commit(dbSession);

    }

    // This method deletes a trip for a person.
    public async deletePersonTrip(userName: string, tripId: number, dbSession: ClientSession | undefined): Promise<void> {

        // Create a new session for transaction if session is null
        if (this.helper.IsNullValue(dbSession)) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        }

        await this.personTripRepository.deletePersonTrip(userName, tripId, dbSession);

        DbSession.Commit(dbSession);
    }

    // This method deletes a all trips for a person.
    public async deleteAllPersonTrips(userName: string, dbSession: ClientSession | undefined): Promise<void> {

        // Create a new session for transaction if session is null
        if (this.helper.IsNullValue(dbSession)) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        }

        await this.personTripRepository.deleteAllPersonTrips(userName, dbSession);

        DbSession.Commit(dbSession);
    }

    // This method get multiple travellers to a trip.
    public async getTripTravellers(tripId: number): Promise<IPerson[]> {
        return await this.personTripRepository.getTripTravellers(tripId);
    }

    // This method adds multiple travellers to a trip.
    public async addTripTravellers(tripId: number, travellers: IPerson[] | any[], dbSession: ClientSession | undefined): Promise<void> {

        // Create a new session for transaction if session is null
        if (this.helper.IsNullValue(dbSession)) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        }

        let mapItems: MapItem[] = [];

        if (travellers && travellers.length > 0) {
            // Loop Check if the travellers are already exists in the database using its tripId
            for (let index = 0; index < travellers.length; index++) {

                // Read traveller based on index loop
                let currentTraveller = travellers[index];

                // Check the traveller is exist in the database
                let isExist = await this.personRepository.isPersonExist(currentTraveller.userName);

                if (!isExist) {
                    // If the traveller does not exist, create a new traveller entry in the database
                    currentTraveller = await this.personRepository.createPerson(currentTraveller, dbSession);
                } else {
                    // If the trip exist, update trip entry in the database
                    await this.personRepository.updatePerson(currentTraveller.userName, currentTraveller, dbSession);
                }

                // Check person and trip is already mapped
                isExist = await this.personTripRepository.isPersonAndTripExist(currentTraveller.userName, tripId);

                if (!isExist) {
                    // Add tripId to array of id list for person trip mapping
                    mapItems.push({ userName: currentTraveller.userName, tripId });
                }
            }
        }

        if (mapItems && mapItems.length > 0) {
            // Add or update trips and map the person trips
            await this.personTripRepository.mapPersonsAndTrips(mapItems, dbSession);
        }

        DbSession.Commit(dbSession);

    }

    // This method deletes a all travellers for a tripe.
    public async deleteAllTripTravellers(tripId: number, dbSession: ClientSession | undefined): Promise<void> {

        // Create a new session for transaction if session is null
        if (this.helper.IsNullValue(dbSession)) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        }

        await this.personTripRepository.deleteAllTripTravellers(tripId, dbSession);

        DbSession.Commit(dbSession);
    }

}