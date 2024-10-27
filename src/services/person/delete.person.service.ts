import { inject, injectable } from "inversify";
import { ClientSession } from "mongoose";
import DbSession from "../../db/utils/dbsession.db";
import IDeletePersonRepository from "../../repositories/person/delete.person.repository";

export default interface IDeletePersonService {
    // Deletes a person by their userName.
    deletePerson(userName: string, dbSession: ClientSession | undefined): Promise<boolean>;
}

// This decorator ensures that PersonsService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class DeletePersonService implements IDeletePersonService {

    // Injecting the Helper service
    constructor(
        @inject('IDeletePersonRepository') private deletePersonRepository: IDeletePersonRepository
    ) { }

    // Deletes a person by their userName.
    public async deletePerson(userName: string, dbSession: ClientSession | undefined): Promise<boolean> {

        // Check if the person exists. If not, throw an error.
        let isExist = await this.deletePersonRepository.isExist(userName);
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

        let results: boolean = await this.deletePersonRepository.deletePerson(userName, dbSession);

        // delete all person trips from the database
        // await this.personTripRepository.deleteAllPersonTrips(userName, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        return results;
    }

}