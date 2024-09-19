import { Error } from "mongoose";
import { provideSingleton, inject } from "../utils/provideSingleton";
import PersonTripSchema from "../db/models/persontrip.db.model";
import { IPerson } from "../models/person.model";
import { ITrip } from "../models/trip.model";
import PersonTripRepository from "../repositories/persontrip.repository";

// This decorator ensures that PersonTripsService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@provideSingleton(PersonTripService)
export default class PersonTripService {

    // Injecting the Helper, PersonsService and TripService services
    constructor(
        @inject(PersonTripRepository) private personTripRepository: PersonTripRepository
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
    public async addOrUpadatePersonTrips(userName: string, trips: ITrip[] | any[]): Promise<void> {

        let mapItems: any[] = [];

        /* if (trips && trips.length > 0) {
            // Loop Check if the trips already exists in the database using its userName
            for (let index = 0; index < trips.length; index++) {

                // Read trip based on index loop
                let currentTrip = trips[index];

                // Check the trip is exist in the database
                let isExist = await this.tripsService.isTripExist(currentTrip.tripId);

                if (!isExist) {
                    // If the trip does not exist, create a new trip entry in the database
                    currentTrip = await this.tripsService.createTrip(currentTrip);
                } else {
                    // If the trip exist, update trip entry in the database
                    await this.tripsService.updateTrip(currentTrip.tripId, currentTrip);
                }

                // Check person and trip is already mapped
                isExist = await this.isPersonAndTripExist(userName, currentTrip.tripId);

                if (!isExist) {
                    // Add tripId to array of id list for person trip mapping
                    mapItems.push({ userName, tripId: currentTrip.tripId });
                }
            }
        } */

        return await this.personTripRepository.addOrUpadatePersonTrips(mapItems);
    }

    // This method deletes a trip for a person.
    public async deletePersonTrip(userName: string, tripId: number): Promise<void> {
        return await this.personTripRepository.deletePersonTrip(userName, tripId);
    }

    // This method deletes a all trips for a person.
    public async deleteAllPersonTrips(userName: string): Promise<void> {
        return await this.personTripRepository.deleteAllPersonTrips(userName);
    }

    // This method get multiple travellers to a trip.
    public async getTripTravellers(tripId: number): Promise<IPerson[]> {
        return await this.personTripRepository.getTripTravellers(tripId);
    }

    // This method adds multiple travellers to a trip.
    public async addOrUpdateTripTravellers(tripId: number, travellers: IPerson[] | any[]): Promise<void> {

        let mapItems: any[] = [];

        /* if (travellers && travellers.length > 0) {
            // Loop Check if the travellers are already exists in the database using its tripId
            for (let index = 0; index < travellers.length; index++) {

                // Read traveller based on index loop
                let currentTraveller = travellers[index];

                // Check the traveller is exist in the database
                let isExist = await this.personsService.isPersonExist(currentTraveller.userName);

                if (!isExist) {
                    // If the traveller does not exist, create a new traveller entry in the database
                    currentTraveller = await this.personsService.createPerson(currentTraveller);
                } else {
                    // If the trip exist, update trip entry in the database
                    await this.personsService.updatePerson(currentTraveller.userName, currentTraveller);
                }

                // Check person and trip is already mapped
                isExist = await this.isPersonAndTripExist(currentTraveller.userName, tripId);

                if (!isExist) {
                    // Add tripId to array of id list for person trip mapping
                    mapItems.push({ userName: currentTraveller.userName, tripId });
                }
            }
        } */

        return await this.personTripRepository.addOrUpdateTripTravellers(mapItems);
    }

    // This method deletes a all travellers for a tripe.
    public async deleteAllTripTravellers(tripId: number): Promise<void> {
        return await this.personTripRepository.deleteAllTripTravellers(tripId);
    }

}