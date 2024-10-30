import { inject, injectable } from "inversify";
import { ClientSession } from "mongoose";
import DbSession from "../../db/utils/dbsession.db";
import ICreatePersonRepository from "../../repositories/person/post.person.repository";
import { IPerson } from "../../models/person.model";
import PersonSchema, { IPersonSchema } from "../../db/dao/person.db.model";
import Helper from "../../utils/helper.utils";

// Interface for CreatePersonService
export default interface ICreatePersonService {
    // Creates a new person in the database.
    createPerson(person: IPerson, dbSession: ClientSession | undefined): Promise<IPerson>;
}

// This decorator ensures that CreatePersonService is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class CreatePersonService implements ICreatePersonService {
    // Injecting the PersonRepository service
    constructor(
        @inject('Helper') private helper: Helper,
        @inject('ICreatePersonRepository') private createPersonRepository: ICreatePersonRepository
    ) { }

    // Creates a new person in the database.
    public async createPerson(person: IPerson, dbSession: ClientSession | undefined): Promise<IPerson> {

        let newItem: IPersonSchema = new PersonSchema();

        if (person.userName) {
            // Check if the person exists. If they do, throw an error.
            let isExist = await this.createPersonRepository.isExist(person.userName);
            if (isExist) {
                throw new Error(`Provided person '${person.userName}' already exists`);
            }
        } else {
            throw new Error(`Provided person userName is required`);
        }

        // Check bestFriend and bestFriendId both are passed
        if (!this.helper.IsJsonNull(person.bestFriend) && !this.helper.IsNullValue(person.bestFriendId)) {
            throw new Error(`Provide only bestFriend or bestFriendId`);
        }

        // Check if best friend object is not null
        if (person.bestFriend && !this.helper.IsJsonNull(person.bestFriend)) {
            if (this.helper.IsNullValue(person.bestFriend.userName)) {
                throw new Error(`Provided best friend userName is required`);
            } else {
                if (person.bestFriend.userName) {
                    let isExist = await this.createPersonRepository.isExist(person.bestFriend.userName);
                    if (!isExist) {
                        throw new Error(`Provided best friend '${person.bestFriend.userName}' does not exist`);
                    }
                }

                person.bestFriendId = person.bestFriend.userName;
            }
        }

        // Check bestFriend and bestFriendId both are passed
        if (!this.helper.IsArrayNull(person.friendsList) && !this.helper.IsArrayNull(person.friends)) {
            throw new Error(`Provide only friends or friendsList`);
        }

        let friendItems: any = person.friendsList || [];

        if (!this.helper.IsArrayNull(person.friends)) {
            friendItems = person.friends?.map(x => x.userName);
            // Check friends names are not empty
            if (!friendItems || friendItems.length === 0) {
                throw new Error(`Provide valid friends `);
            }
        }

        // Check if friends object is not null
        if (friendItems && friendItems.length > 0) {
            // Loop to check if each friend already exists in the database using their userName
            for (let index = 0; index < friendItems.length; index++) {
                let friend = friendItems[index];
                let isExist = await this.createPersonRepository.isExist(friend);
                if (!isExist) {
                    throw new Error(`Provided friend '${friend}' does not exist`);
                }
            }
            person.friendsList = friendItems;
        }

        const keys = Object.keys(person);

        for (let i = 0; i < keys.length; i++) {
            if (person[keys[i]]) {
                newItem[keys[i]] = person[keys[i]];
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
        let results = await this.createPersonRepository.createPerson(newItem, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        // Return newly created person object
        return results;
    }
}
