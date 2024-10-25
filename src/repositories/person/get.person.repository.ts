import { IPerson } from "../../models/person.model";
import { Error } from "mongoose";
import PersonSchema, { IPersonSchema } from "../../db/dao/person.db.model";
import Helper from "../../utils/helper.utils";
import { injectable, inject } from "inversify";

// Interface for GetPersonRepository
export default interface IGetPersonRepository {
    // Fetches a single person by their userName, excluding the userName field.
    get(userName: string): Promise<IPerson>;

    // Checks if a person with the given userName exists in the database.
    isPersonExist(userName: string): Promise<boolean>;
}

// This decorator ensures that GetPersonRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class GetPersonRepository implements IGetPersonRepository {
    // Injecting the Helper service
    constructor(@inject(Helper) private helper: Helper) { }

    // Checks if a person with the given userName exists in the database.
    public async isPersonExist(userName: string): Promise<boolean> {
        return await PersonSchema.find({ userName }, { _id: 1 })
            .then((data: any[]) => {
                // Uses the helper to process the array of persons.
                let results = this.helper.GetItemFromArray(data, 0, { _id: null });
                // Returns true if the person exists, otherwise false.
                if (!this.helper.IsNullValue(results._id)) return true;
                return false;
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });
    }

    // Fetches a single person by their userName, excluding the userName field.
    public async get(userName: string): Promise<IPerson> {
        return await PersonSchema.find({ userName }, { _id: 0 })
            .then((data: IPersonSchema[]) => {
                // Uses the helper to process the person.
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IPerson;
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });
    }
}
