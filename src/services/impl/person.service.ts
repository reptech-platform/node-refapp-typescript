import { IPerson } from "../../models/person.model";
import { Search, SearchResults } from "../../models/search.model";
import { ITrip } from "../../models/trip.model";
import MapItem from "../../utils/mapitems";
import DbSession from "../../db/utils/dbsession.db";
import { ClientSession } from "mongoose";
import IPersonService from "../person.interface";
import ITripService from "../trip.interface";
import { inject, injectable } from "inversify";
import IPersonRepository from "../../repositories/person.repository";
import IPersonTripRepository from "../../repositories/persontrip.repository";

// This decorator ensures that PersonsService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@injectable()
export default class PersonService implements IPersonService {

    // Injecting the Helper service
    constructor(
        @inject('IPersonRepository') private personRepository: IPersonRepository,
        @inject('ITripRepository') private tripService: ITripService,
        @inject('IPersonTripRepository') private personTripRepository: IPersonTripRepository
    ) { }

    // Checks if a person with the given userName exists in the database.
    public async isPersonExist(userName: string): Promise<boolean> {
        return await this.personRepository.isPersonExist(userName);
    }

    // Fetches all persons from the database, excluding the _id field.
    public async getPersons(): Promise<IPerson[]> {
        return await this.personRepository.getPersons();
    }

    // Fetches a single person by their userName, excluding the _id field.
    public async getPerson(userName: string): Promise<IPerson> {
        return await this.personRepository.getPerson(userName);
    }

    // Creates a new person in the database.
    public async createPerson(person: IPerson, dbSession: ClientSession | undefined): Promise<IPerson> {

        // Flag to indicate if this function created the session
        let inCarryTransact: boolean = false;

        // Check if a session is provided; if not, create a new one
        if (!dbSession) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        } else {
            inCarryTransact = true;
        }

        // Check is best friend object is not null
        if (person.bestFriend) {

            let bestFriendId = person.bestFriend.userName;

            let isExist = await this.personRepository.isPersonExist(bestFriendId);

            if (!isExist) {
                let bestFriend = await this.personRepository.createPerson(person.bestFriend, dbSession);
                bestFriendId = bestFriend.userName;
            } else {
                await this.personRepository.updatePerson(bestFriendId, person.bestFriend, dbSession);
            }

            person.bestFriendId = bestFriendId;
        }

        // Check is friends object is not null
        if (person.friends && person.friends.length > 0) {

            let friends: String[] = [];

            // Loop Check if the friend is already exists in the database using its userName
            for (let index = 0; index < person.friends.length; index++) {

                // Read friend based on index loop
                let friend = person.friends[index];
                let friendId = friend.userName;

                let isExist = await this.personRepository.isPersonExist(friend.userName);

                if (!isExist) {
                    let newFriend = await this.personRepository.createPerson(friend, dbSession);
                    friendId = newFriend.userName;
                } else {
                    await this.personRepository.updatePerson(friendId, friend, dbSession);
                }

                friends.push(friendId);
            }

            person.friendsList = friends;
        }

        // create new person entry in the database
        let newPerson = await this.personRepository.createPerson(person, dbSession);

        // Retrieve the trip information from the person object, which may be undefined
        const trips: ITrip[] | undefined = person.trips;

        let mapItems: MapItem[] = [];

        if (trips && trips.length > 0) {

            // Loop Check if the trips already exists in the database using its userName
            for (let index = 0; index < trips.length; index++) {

                // Read trip based on index loop
                let currentTrip = trips[index];

                let tripId: number | undefined = currentTrip.tripId;

                if (tripId) {
                    // Check the trip is exist in the database
                    let isExist = await this.tripService.isTripExist(tripId);

                    if (!isExist) {
                        // If the trip does not exist, create a new trip entry in the database
                        currentTrip = await this.tripService.createTrip(currentTrip, dbSession);
                    } else {
                        // If the trip exist, update trip entry in the database
                        await this.tripService.updateTrip(tripId, currentTrip, dbSession);
                    }
                } else {
                    // If the trip does not exist, create a new trip entry in the database
                    currentTrip = await this.tripService.createTrip(currentTrip, dbSession);

                    tripId = currentTrip.tripId;
                }

                if (tripId) {

                    // Check person and trip is already mapped
                    let isExist = await this.personTripRepository.isPersonAndTripExist(person.userName, tripId);

                    if (!isExist) {
                        // Add tripId to array of id list for person trip mapping
                        mapItems.push({ userName: person.userName, tripId });
                    }
                }
            }

            if (mapItems && mapItems.length > 0) {
                // Add or update trips and map the person trips
                await this.personTripRepository.mapPersonsAndTrips(mapItems, dbSession);
            }
        }

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        // Returns newly created person object
        return newPerson;
    }

    // Updates an existing person by their userName and returns the updated person.
    public async updatePerson(userName: string, person: any, dbSession: ClientSession | undefined): Promise<IPerson> {
        // Flag to indicate if this function created the session
        let inCarryTransact: boolean = false;

        // Check if a session is provided; if not, create a new one
        if (!dbSession) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        } else {
            inCarryTransact = true;
        }

        // Check is best friend object is not null
        if (person.bestFriend) {

            let bestFriendId = person.bestFriend.userName;

            let isExist = await this.personRepository.isPersonExist(bestFriendId);

            if (!isExist) {
                let bestFriend = await this.personRepository.createPerson(person.bestFriend, dbSession);
                bestFriendId = bestFriend.userName;
            } else {
                await this.personRepository.updatePerson(bestFriendId, person.bestFriend, dbSession);
            }

            person.bestFriendId = bestFriendId;
        }

        // Check is friends object is not null
        if (person.friends && person.friends.length > 0) {

            let friends: String[] = [];

            // Loop Check if the friend is already exists in the database using its userName
            for (let index = 0; index < person.friends.length; index++) {

                // Read friend based on index loop
                let friend = person.friends[index];
                let friendId = friend.userName;

                let isExist = await this.personRepository.isPersonExist(friend.userName);

                if (!isExist) {
                    let newFriend = await this.personRepository.createPerson(friend, dbSession);
                    friendId = newFriend.userName;
                } else {
                    await this.personRepository.updatePerson(friendId, friend, dbSession);
                }

                friends.push(friendId);
            }

            person.friendsList = friends;
        }

        // Update person details in the database
        let updatedPerson = await this.personRepository.updatePerson(userName, person, dbSession);

        // Retrieve the trip information from the person object, which may be undefined
        const trips: ITrip[] | undefined = person.trips;
        let mapItems: MapItem[] = [];

        if (trips && trips.length > 0) {
            // Loop through each trip to check existence and update or create
            for (let index = 0; index < trips.length; index++) {
                // Get the current trip from the list
                let currentTrip = trips[index];
                let tripId: number | undefined = currentTrip.tripId;

                if (tripId) {
                    // Check if the trip exists in the database
                    let isExist = await this.tripService.isTripExist(tripId);
                    if (!isExist) {
                        // If the trip does not exist, create a new trip entry
                        currentTrip = await this.tripService.createTrip(currentTrip, dbSession);
                    } else {
                        // If the trip exists, update the trip entry
                        await this.tripService.updateTrip(tripId, currentTrip, dbSession);
                    }
                } else {
                    // If no tripId, create a new trip entry
                    currentTrip = await this.tripService.createTrip(currentTrip, dbSession);
                    tripId = currentTrip.tripId;
                }

                if (tripId) {
                    // Check if the person and trip are already mapped
                    let isExist = await this.personTripRepository.isPersonAndTripExist(person.userName, tripId);
                    if (!isExist) {
                        // Add tripId to the list for person trip mapping
                        mapItems.push({ userName: person.userName, tripId });
                    }
                }
            }

            if (mapItems && mapItems.length > 0) {
                // Map the trips to the person
                await this.personTripRepository.mapPersonsAndTrips(mapItems, dbSession);
            }
        }

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        return updatedPerson;
    }

    // Updates or adds documents to a person's attachments.
    public async updatePersonDocument(userName: string, document: any, dbSession: ClientSession | undefined): Promise<IPerson> {

        // Flag to indicate if this function created the session
        let inCarryTransact: boolean = false;

        // Check if a session is provided; if not, create a new one
        if (!dbSession) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        } else {
            inCarryTransact = true;
        }

        const results: IPerson = await this.personRepository.updatePersonDocument(userName, document, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        return results;
    }

    // Deletes documents from a person's attachments.
    public async deletePersonDocument(userName: string, docId: number, dbSession: ClientSession | undefined): Promise<IPerson> {

        // Flag to indicate if this function created the session
        let inCarryTransact: boolean = false;

        // Check if a session is provided; if not, create a new one
        if (!dbSession) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        } else {
            inCarryTransact = true;
        }

        const results: IPerson = await this.personRepository.deletePersonDocument(userName, docId, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        return results;
    }

    // Deletes a person by their userName.
    public async deletePerson(userName: string, dbSession: ClientSession | undefined): Promise<boolean> {

        // Flag to indicate if this function created the session
        let inCarryTransact: boolean = false;

        // Check if a session is provided; if not, create a new one
        if (!dbSession) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        } else {
            inCarryTransact = true;
        }

        let results: boolean = await this.personRepository.deletePerson(userName, dbSession);

        // delete all person trips from the database
        await this.personTripRepository.deleteAllPersonTrips(userName, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        return results;
    }

    // Searches for persons based on the provided search criteria.
    public async searchPerson(search: Search): Promise<SearchResults> {
        return await this.personRepository.searchPerson(search);
    }

    // Counts the number of persons based on the provided search criteria.
    public async searchPersonCount(search: Search): Promise<number> {
        return await this.personRepository.searchPersonCount(search);
    }

    // Counts the total number of persons in the collection.
    public async getPersonCount(): Promise<number> {
        return await this.personRepository.getPersonCount();
    }

}