import Helper from "../utils/helper.utils";
import { IPerson } from "../models/person.model";
import { Search, SearchResults } from "../models/search.model";
import { provideSingleton, inject } from "../utils/provideSingleton";
import PersonTripRepository from "../repositories/persontrip.repository";
import PersonRepository from "../repositories/person.repository";

// This decorator ensures that PersonsService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@provideSingleton(PersonsService)
export default class PersonsService {

    // Injecting the Helper service
    constructor(
        // PersonTripsService has a circular dependency
        @inject(PersonTripRepository) private personTripRepository: PersonTripRepository,
        @inject(PersonRepository) private personRepository: PersonRepository
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
    public async createPerson(person: IPerson): Promise<IPerson> {

        // create new person entry in the database
        let newPerson = await this.personRepository.createPerson(person);

        // Retrieve the trip information from the person object, which may be undefined
        /* const trips: ITrip[] | undefined = person.trips;

        if (trips && trips.length > 0) {
            // Add or update trips and map the person trips
            await this.personTripRepository.addOrUpadatePersonTrips(person.userName, trips);
        } */

        // Returns newly created person object
        return newPerson;
    }

    // Updates an existing person by their userName and returns the updated person.
    public async updatePerson(userName: string, person: any): Promise<IPerson> {

        let updatedPerson = await this.personRepository.updatePerson(userName, person);

        // Retrieve the trip information from the person object, which may be undefined
        /* const trips: ITrip[] | undefined = person.trips;

        if (trips && trips.length > 0) {
            // Add or update trips and map the person trips
            await this.personTripRepository.addOrUpadatePersonTrips(userName, trips);
        } */

        return updatedPerson;
    }

    // Updates or adds documents to a person's attachments.
    public async updatePersonDocument(userName: string, document: any): Promise<IPerson> {
        return await this.personRepository.updatePersonDocument(userName, document);
    }

    // Deletes documents from a person's attachments.
    public async deletePersonDocument(userName: string, document: any): Promise<IPerson> {
        return await this.personRepository.deletePersonDocument(userName, document);
    }

    // Deletes a person by their userName.
    public async deletePerson(userName: string): Promise<boolean> {
        let boolDeleted: boolean = await this.personRepository.deletePerson(userName);

        // delete all person trips from the database
        // await this.personTripsService.deleteAllPersonTrips(userName);

        return boolDeleted;
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