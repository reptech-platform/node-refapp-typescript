import { IPerson } from "../../models/person.model";
import { inject, injectable } from "inversify";
import IGetPersonRepository from "../../repositories/person/get.person.repository";

export default interface IGetPersonService {
    // Fetches a single person by their userName, excluding the _id field.
    get(userName: string): Promise<IPerson>;
}

// This decorator ensures that PersonsService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class GetPersonService implements IGetPersonService {

    // Injecting the Helper service
    constructor(
        @inject("IGetPersonRepository") private getPersonRepository: IGetPersonRepository
    ) { }

    // Fetches a single person by their userName, excluding the _id field.
    public async get(userName: string): Promise<IPerson> {

        // Check if the person exists. If they do, throw an error.
        let isExist = await this.getPersonRepository.isPersonExist(userName);
        if (!isExist) {
            throw new Error(`Provided '${userName}' person does not exist`);
        }

        return await this.getPersonRepository.get(userName);
    }

}