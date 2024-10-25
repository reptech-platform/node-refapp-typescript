import { IPerson } from "../../models/person.model";
import { ClientSession, Error } from "mongoose";
import PersonSchema from "../../db/dao/person.db.model";
import Helper from "../../utils/helper.utils";
import { injectable, inject } from "inversify";
import DbSession from "../../db/utils/dbsession.db";

// Interface for CreatePersonRepository
export default interface ICreatePersonRepository {
    // Creates a new person in the database.
    create(person: IPerson, session: ClientSession | undefined): Promise<IPerson>;

    // Checks if a person with the given userName exists in the database.
    isPersonExist(userName: string): Promise<boolean>;
}

// This decorator ensures that CreatePersonRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class CreatePersonRepository implements ICreatePersonRepository {
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

    // Creates a new person in the database.
    public async create(person: IPerson, session: ClientSession | undefined): Promise<IPerson> {
        // Create new person entry in the database
        let newPerson = await PersonSchema.create([person], { session })
            .then((data: any) => {
                // Uses the helper to process the person
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IPerson;
            })
            .catch((error: Error) => {
                // Abort Client Session if there's an error
                DbSession.Abort(session);
                // Throws an error if the operation fails
                throw error;
            });

        // Returns newly created person object
        return newPerson;
    }
}
