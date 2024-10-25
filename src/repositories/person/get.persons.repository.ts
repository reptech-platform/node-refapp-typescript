import { IPerson } from "../../models/person.model";
import { Error } from "mongoose";
import PersonSchema, { IPersonSchema } from "../../db/dao/person.db.model";
import Helper from "../../utils/helper.utils";
import { injectable, inject } from "inversify";

// Interface for GetPersonsRepository
export default interface IGetPersonsRepository {
    // Fetches all persons from the database
    gets(): Promise<IPerson[]>;
}

// This decorator ensures that GetPersonsRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class GetPersonsRepository implements IGetPersonsRepository {
    // Injecting the Helper service
    constructor(@inject(Helper) private helper: Helper) { }

    // Fetches all persons from the database
    public async gets(): Promise<IPerson[]> {
        return await PersonSchema.find({}, { _id: 0 })
            .then((data: IPersonSchema[]) => {
                // Uses the helper to process the array of persons.
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IPerson[];
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });
    }
}
