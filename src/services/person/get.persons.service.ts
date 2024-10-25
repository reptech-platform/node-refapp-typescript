import { IPerson } from "../../models/person.model";
import { inject, injectable } from "inversify";
import IGetPersonsRepository from "../../repositories/person/get.persons.repository";

export default interface IGetPersonsService {
    // Fetches all persons from the database.
    gets(): Promise<IPerson[]>;
}

// This decorator ensures that PersonsService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class GetPersonsService implements IGetPersonsService {

    // Injecting the Helper service
    constructor(
        @inject('IGetPersonsRepository') private getPersonsRepository: IGetPersonsRepository
    ) { }

    // Fetches all persons from the database.
    public async gets(): Promise<IPerson[]> {
        return await this.getPersonsRepository.gets();
    }

}