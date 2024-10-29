import PersonSchema from "../../db/dao/person.db.model";
import { injectable, inject } from "inversify";
import { ClientSession, Error } from "mongoose";
import Helper from "../../utils/helper.utils";
import DbSession from "../../db/utils/dbsession.db";

// Interface for DeletePersonRepository
export default interface IDeletePersonRepository {
    // Deletes a person by their userName.
    deletePerson(userName: string, session: ClientSession | undefined): Promise<boolean>;

    // Checks if a person with the given userName exists in the database.
    isExist(userName: string): Promise<boolean>;
}

// This decorator ensures that DeletePersonRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class DeletePersonRepository implements IDeletePersonRepository {

    // Injecting the Helper service
    constructor(@inject(Helper) private helper: Helper) { }

    // Checks if a person with the given userName exists in the database.
    public async isExist(userName: string): Promise<boolean> {
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

    // Deletes a person by their userName.
    public async deletePerson(userName: string, session: ClientSession | undefined): Promise<boolean> {
        // Use findOneAndDelete to find and delete the person by userName
        let boolDeleted: boolean = await PersonSchema.findOneAndDelete({ userName }, { session })
            .then(() => {
                // Returns true if the deletion is successful.
                return true;
            })
            .catch((error: Error) => {
                // Abort Client Session if there's an error
                DbSession.Abort(session);
                // Throws an error if the operation fails.
                throw error;
            });

        // Returns the result of the deletion operation.
        return boolDeleted;
    }
}
