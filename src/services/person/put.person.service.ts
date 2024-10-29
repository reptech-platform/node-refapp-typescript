import { inject, injectable } from "inversify";
import { ClientSession } from "mongoose";
import DbSession from "../../db/utils/dbsession.db";
import IUpdatePersonRepository from "../../repositories/person/put.person.repository";
import PersonSchema, { IPersonSchema } from "../../db/dao/person.db.model";
import { IPerson } from "../../models/person.model";

// Interface for UpdatePersonService
export default interface IUpdatePersonService {
    // Updates an existing person by their userName and returns the updated person.
    updatePerson(userName: string, person: IPerson, dbSession: ClientSession | undefined): Promise<IPerson>;
}

// This decorator ensures that UpdatePersonService is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class UpdatePersonService implements IUpdatePersonService {
    // Injecting the PersonRepository service
    constructor(
        @inject('IUpdatePersonRepository') private updatePersonRepository: IUpdatePersonRepository
    ) { }

    // Updates an existing person by their userName and returns the updated person.
    public async updatePerson(userName: string, person: IPerson, dbSession: ClientSession | undefined): Promise<IPerson> {
        let newPerson: IPersonSchema = new PersonSchema();

        // Check if the person exists. If they do, throw an error.
        let isExist = await this.updatePersonRepository.isExist(userName);
        if (!isExist) {
            throw new Error(`Provided person '${userName}' does not exists`);
        }

        // Check if best friend object is not null
        if (person.bestFriendId) {
            let isExist = await this.updatePersonRepository.isExist(person.bestFriendId);
            if (!isExist) {
                throw new Error(`Provided best friend '${person.bestFriendId}' does not exist`);
            }
        }

        // Check if friends object is not null
        if (person.friendsList && person.friendsList.length > 0) {
            // Loop to check if each friend already exists in the database using their userName
            for (let index = 0; index < person.friendsList.length; index++) {
                let friend = person.friendsList[index];
                let isExist = await this.updatePersonRepository.isExist(friend);
                if (!isExist) {
                    throw new Error(`Provided friend '${friend}' does not exist`);
                }
            }
        }

        const keys = Object.keys(person);

        for (let i = 0; i < keys.length; i++) {
            if (person[keys[i]]) {
                newPerson[keys[i]] = person[keys[i]];
            }
        }

        // Flag to indicate if this function created the session
        let inCarryTransact: boolean = false;

        // Check if a session is provided; if not, create a new one
        if (!dbSession) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        } else {
            inCarryTransact = true;
        }

        // Create new person entry in the database
        let results = await this.updatePersonRepository.updatePerson(userName, newPerson, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        // Return newly created person object
        return results;
    }
}
