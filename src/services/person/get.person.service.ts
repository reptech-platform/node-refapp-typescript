import { inject, injectable } from "inversify";
import IGetPersonRepository from "../../repositories/person/get.person.repository";
import { IPersonRead } from "../../models/person/person.read.model";

// Interface for GetPersonService
export default interface IGetPersonService {
    // Gets a person by their userName
    getPerson(userName: string): Promise<IPersonRead>;
    // Gets the best friend of a person by their userName
    getBestFriend(userName: string): Promise<IPersonRead>;
    // Gets the friends of a person by their userName
    getFriends(userName: string): Promise<IPersonRead[]>;
}

// This decorator ensures that GetPersonService is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class GetPersonService implements IGetPersonService {
    // Injecting the GetPersonRepository service
    constructor(
        @inject("IGetPersonRepository") private getPersonRepository: IGetPersonRepository
    ) { }

    // Gets a person by their userName
    public async getPerson(userName: string): Promise<IPersonRead> {
        // Check if the person exists. If not, throw an error.
        let isExist = await this.getPersonRepository.isExist(userName);
        if (!isExist) {
            throw new Error(`Provided '${userName}' person does not exist`);
        }
        // Retrieve and return the person's information
        return await this.getPersonRepository.getPerson(userName);
    }

    // Gets the best friend of a person by their userName
    public async getBestFriend(userName: string): Promise<IPersonRead> {
        // Check if the person exists. If not, throw an error.
        let isExist = await this.getPersonRepository.isExist(userName);
        if (!isExist) {
            throw new Error(`Provided '${userName}' person does not exist`);
        }
        // Retrieve and return the best friend's information
        return await this.getPersonRepository.getBestFriend(userName);
    }

    // Gets the friends of a person by their userName
    public async getFriends(userName: string): Promise<IPersonRead[]> {
        // Check if the person exists. If not, throw an error.
        let isExist = await this.getPersonRepository.isExist(userName);
        if (!isExist) {
            throw new Error(`Provided '${userName}' person does not exist`);
        }
        // Retrieve and return the friends' information
        return await this.getPersonRepository.getFriends(userName);
    }
}
