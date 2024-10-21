
import { ClientSession } from "mongoose";

import { ITrip } from "../../models/trip.model";
import { Search, SearchResults } from "../../models/search.model";
import TripRepository from "../../repositories/trip.repository";
import MapItem from "../../utils/mapitems";
import { IPerson } from "../../models/person.model";
import DbSession from "../../db/utils/dbsession.db";
import Helper from "../../utils/helper.utils";
import ITripService from "../trip.interface";
import { inject, injectable } from "inversify";
import IPersonTripService from "../persontrip.interface";
import IPersonService from "../person.interface";

// This decorator ensures that TripsService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@injectable()
export default class TripService implements ITripService {

    // Injecting the Helper service
    constructor(
        @inject(Helper) private helper: Helper,
        @inject(TripRepository) private tripRepository: TripRepository,
        @inject('IPersonTripService') private personTripService: IPersonTripService,
        @inject('IPersonService') private personService: IPersonService
    ) { }

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
    public async createTrip(trip: ITrip, dbSession: ClientSession | undefined): Promise<ITrip> {

        // Create a new session for trip transaction if session is null
        if (this.helper.IsNullValue(dbSession)) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        }

        // Create trip by passing session
        let newTrip = await this.tripRepository.createTrip(trip, dbSession);

        const tripId: number = newTrip.tripId;

        // Retrieve the travellers information from the trip object, which may be undefined
        const travellers: IPerson[] | undefined = trip.travellers;

        let mapItems: MapItem[] = [];

        if (travellers && travellers.length > 0) {
            // Loop Check if the travellers are already exists in the database using its tripId
            for (let index = 0; index < travellers.length; index++) {

                // Read traveller based on index loop
                let currentTraveller = travellers[index];

                // Check the traveller is exist in the database
                let isExist = await this.personService.isPersonExist(currentTraveller.userName);

                if (!isExist) {
                    // If the traveller does not exist, create a new traveller entry in the database
                    currentTraveller = await this.personService.createPerson(currentTraveller, dbSession);
                } else {
                    // If the trip exist, update trip entry in the database
                    await this.personService.updatePerson(currentTraveller.userName, currentTraveller, dbSession);
                }

                // Check person and trip is already mapped
                isExist = await this.personTripService.isPersonAndTripExist(currentTraveller.userName, tripId);

                if (!isExist) {
                    // Add tripId to array of id list for person trip mapping
                    mapItems.push({ userName: currentTraveller.userName, tripId });
                }
            }
        }

        if (mapItems && mapItems.length > 0) {
            // Add or update trips and map the person trips
            await this.personTripService.addTripTravellers(tripId, mapItems, dbSession);
        }

        DbSession.Commit(dbSession);

        // Returns newly created trip object
        return newTrip;
    }

    // Updates an existing trip by its tripId and returns the updated trip.
    public async updateTrip(tripId: number, trip: any, dbSession: ClientSession | undefined): Promise<ITrip> {

        // Create a new session for trip transaction if session is null
        if (this.helper.IsNullValue(dbSession)) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        }

        let updatedTrip = await this.tripRepository.updateTrip(tripId, trip, dbSession);

        // Retrieve the travellers information from the trip object, which may be undefined
        const travellers: IPerson[] | undefined = trip.travellers;

        let mapItems: MapItem[] = [];

        if (travellers && travellers.length > 0) {
            // Loop Check if the travellers are already exists in the database using its tripId
            for (let index = 0; index < travellers.length; index++) {

                // Read traveller based on index loop
                let currentTraveller = travellers[index];

                // Check the traveller is exist in the database
                let isExist = await this.personService.isPersonExist(currentTraveller.userName);

                if (!isExist) {
                    // If the traveller does not exist, create a new traveller entry in the database
                    currentTraveller = await this.personService.createPerson(currentTraveller, dbSession);
                } else {
                    // If the trip exist, update trip entry in the database
                    await this.personService.updatePerson(currentTraveller.userName, currentTraveller, dbSession);
                }

                // Check person and trip is already mapped
                isExist = await this.personTripService.isPersonAndTripExist(currentTraveller.userName, tripId);

                if (!isExist) {
                    // Add tripId to array of id list for person trip mapping
                    mapItems.push({ userName: currentTraveller.userName, tripId });
                }
            }
        }

        if (mapItems && mapItems.length > 0) {
            // Add or update trips and map the person trips
            await this.personTripService.addTripTravellers(tripId, mapItems, dbSession);
        }

        DbSession.Commit(dbSession);

        return updatedTrip;
    }

    // Deletes a trip by its tripId.
    public async deleteTrip(tripId: number, dbSession: ClientSession | undefined): Promise<boolean> {

        // Create a new session for trip transaction if session is null
        if (this.helper.IsNullValue(dbSession)) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        }

        let boolDeleted: boolean = await this.tripRepository.deleteTrip(tripId, dbSession);

        // delete all trip travellers from the database
        await this.personTripService.deleteAllTripTravellers(tripId, dbSession);

        DbSession.Commit(dbSession);

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