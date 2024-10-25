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
        @inject('ICreatePersonRepository') private createPersonRepository: ICreatePersonRepository,
        @inject('IUpdatePersonRepository') private updatePersonRepository: IUpdatePersonRepository
    ) { }

    // Updates an existing person by their userName and returns the updated person.
    public async update(userName: string, person: IPerson, dbSession: ClientSession | undefined): Promise<IPerson> {
        // Check if the person exists. If not, throw an error.
        let isExist = await this.isPersonExist(userName);
        if (!isExist) {
            throw new Error(`Provided '${userName}' person does not exist`);
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

        // Check if best friend object is not null
        if (person.bestFriend) {
            let bestFriendId = person.bestFriend.userName;
            isExist = await this.isPersonExist(bestFriendId);
            if (!isExist) {
                let bestFriend = await this.createPersonRepository.create(person.bestFriend, dbSession);
                bestFriendId = bestFriend.userName;
            } else {
                await this.updatePersonRepository.update(bestFriendId, person.bestFriend, dbSession);
            }
            person.bestFriendId = bestFriendId;
        }

        // Check if friends object is not null
        if (person.friends && person.friends.length > 0) {
            let friends: String[] = [];
            // Loop to check if each friend already exists in the database using their userName
            for (let index = 0; index < person.friends.length; index++) {
                let friend = person.friends[index];
                let friendId = friend.userName;
                isExist = await this.isPersonExist(friend.userName);
                if (!isExist) {
                    let newFriend = await this.createPersonRepository.create(friend, dbSession);
                    friendId = newFriend.userName;
                } else {
                    await this.updatePersonRepository.update(friendId, friend, dbSession);
                }
                friends.push(friendId);
            }
            person.friendsList = friends;
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
