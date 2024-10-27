import { IPerson } from "../../models/person.model";
import { inject, injectable } from "inversify";
import { ClientSession } from "mongoose";
import DbSession from "../../db/utils/dbsession.db";
import ICreatePersonRepository from "../../repositories/person/post.person.repository";

// Interface for CreatePersonService
export default interface ICreatePersonService {
    // Creates a new person in the database.
    create(person: IPerson, dbSession: ClientSession | undefined): Promise<IPerson>;
}

// This decorator ensures that CreatePersonService is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class CreatePersonService implements ICreatePersonService {
    // Injecting the PersonRepository service
    constructor(
        @inject('ICreatePersonRepository') private createPersonRepository: ICreatePersonRepository
    ) { }

    // Creates a new person in the database.
    public async create(person: IPerson, dbSession: ClientSession | undefined): Promise<IPerson> {

        // Check if the person exists. If they do, throw an error.
        let isExist = await this.isPersonExist(person.userName);
        if (isExist) {
            throw new Error(`Provided person '${person.userName}' already exists`);
        }

        // Check if best friend object is not null
        if (person.bestFriendId) {
            isExist = await this.isPersonExist(person.bestFriendId);
            if (!isExist) {
                throw new Error(`Provided best friend '${person.bestFriendId}' does not exist`);
            }
        }

        // Check if friends object is not null
        if (person.friendsList && person.friendsList.length > 0) {
            // Loop to check if each friend already exists in the database using their userName
            for (let index = 0; index < person.friendsList.length; index++) {
                let friend = person.friendsList[index];
                isExist = await this.isPersonExist(friend);
                if (!isExist) {
                    throw new Error(`Provided friend '${friend}' does not exist`);
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

        // Create new person entry in the database
        let newPerson = await this.createPersonRepository.create(person, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        // Return newly created person object
        return newPerson;
    }

    // Checks if a person with the given userName exists in the database.
    private async isPersonExist(userName: string): Promise<boolean> {
        return await this.createPersonRepository.isPersonExist(userName);
    }
}
