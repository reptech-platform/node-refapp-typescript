import { IPerson } from "../models/person.model";
import { Search, SearchResults } from "../models/search.model";
import { ClientSession } from "mongoose";

export default interface IPersonService {

    // Checks if a person with the given userName exists in the database.
    isPersonExist(userName: string): Promise<boolean>;

    // Fetches all persons from the database, excluding the _id field.
    getPersons(): Promise<IPerson[]>;

    // Fetches a single person by their userName, excluding the _id field.
    getPerson(userName: string): Promise<IPerson>;

    // Creates a new person in the database.
    createPerson(person: IPerson, dbSession: ClientSession | undefined): Promise<IPerson>;

    // Updates an existing person by their userName and returns the updated person.
    updatePerson(userName: string, person: any, dbSession: ClientSession | undefined): Promise<IPerson>;

    // Updates or adds documents to a person's attachments.
    updatePersonDocument(userName: string, document: any, dbSession: ClientSession | undefined): Promise<IPerson>;

    // Deletes documents from a person's attachments.
    deletePersonDocument(userName: string, docId: number, dbSession: ClientSession | undefined): Promise<IPerson>;

    // Deletes a person by their userName.
    deletePerson(userName: string, dbSession: ClientSession | undefined): Promise<boolean>;

    // Searches for persons based on the provided search criteria.
    searchPerson(search: Search): Promise<SearchResults>;

    // Counts the number of persons based on the provided search criteria.
    searchPersonCount(search: Search): Promise<number>;

    // Counts the total number of persons in the collection.
    getPersonCount(): Promise<number>;
}