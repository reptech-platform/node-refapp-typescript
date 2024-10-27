import { IPerson } from "../../models/person.model";
import { inject, injectable } from "inversify";
import { ClientSession } from "mongoose";
import DbSession from "../../db/utils/dbsession.db";
import ICreatePersonRepository from "../../repositories/person/post.person.repository";
import IUpdatePersonRepository from "../../repositories/person/put.person.repository";

// Interface for UpdatePersonService
export default interface IUpdatePersonService {
    // Updates an existing person by their userName and returns the updated person.
    update(userName: string, person: IPerson, dbSession: ClientSession | undefined): Promise<IPerson>;
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
    public async update(userName: string, person: IPerson, dbSession: ClientSession | undefined): Promise<IPerson> {
        // Check if the person exists. If not, throw an error.
        let isExist = await this.isPersonExist(userName);
        if (!isExist) {
            throw new Error(`Provided '${userName}' person does not exist`);
        }

        // Check if best friend object is not null
        if (person.bestFriendId) {
            isExist = await this.isPersonExist(person.bestFriendId);
            if (!isExist) {
                throw new Error(`Provided '${person.bestFriendId}' best friend does not exist`);
            }
        }

        // Check if friends object is not null
        if (person.friendsList && person.friendsList.length > 0) {
            // Loop to check if each friend already exists in the database using their userName
            for (let index = 0; index < person.friendsList.length; index++) {
                let friend = person.friendsList[index];
                isExist = await this.isPersonExist(friend);
                if (!isExist) {
                    throw new Error(`Provided '${person.bestFriendId}' friend does not exist`);
                }
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

        // Update the person entry in the database
        let updatedPerson = await this.updatePersonRepository.update(userName, person, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        // Return the updated person object
        return updatedPerson;
    }

    // Checks if a person with the given userName exists in the database.
    private async isPersonExist(userName: string): Promise<boolean> {
        return await this.updatePersonRepository.isPersonExist(userName);
    }
}
